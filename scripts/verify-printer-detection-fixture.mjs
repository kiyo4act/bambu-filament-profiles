#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const vendorKey = 'verify-printer-detection-fixture';
const vendorDir = path.join(repoRoot, 'vendors', vendorKey);
const fixtureRoot = path.join(repoRoot, '.work', 'verify-fixtures', 'printer-detection');
const extractedRoot = path.join(repoRoot, '.work', 'extracted', vendorKey);

try {
  await resetFixture();
  await fs.mkdir(vendorDir, { recursive: true });
  await fs.mkdir(fixtureRoot, { recursive: true });
  await fs.writeFile(path.join(vendorDir, 'sources.yml'), 'vendor: Fixture Printer Detection\nsources: []\n', 'utf8');

  const fixtures = [
    ['Fixture A2L PLA @Bambu Lab A2L 0.4 nozzle', 'Bambu Lab A2L 0.4 nozzle'],
    ['Fixture A1 mini PLA @Bambu Lab A1 mini 0.4 nozzle', 'Bambu Lab A1 mini 0.4 nozzle'],
    ['Fixture X1 Carbon PLA @Bambu Lab X1 Carbon 0.4 nozzle', 'Bambu Lab X1 Carbon 0.4 nozzle'],
    ['Fixture Unknown PLA @Bambu Lab Z9 0.4 nozzle', 'Bambu Lab Z9 0.4 nozzle'],
  ];

  for (const [name, compatiblePrinter] of fixtures) {
    await writeJson(path.join(fixtureRoot, `${name}.json`), profileFor(name, compatiblePrinter));
  }

  await runBambuProfiles([
    'vendor:collect',
    '--vendor',
    vendorKey,
    '--from',
    path.relative(repoRoot, fixtureRoot),
  ]);
  await runBambuProfiles(['vendor:diff', '--vendor', vendorKey]);
  await runBambuProfiles(['vendor:propose', '--vendor', vendorKey]);

  const result = await readJson(path.join(extractedRoot, 'reports', 'proposals.json'));
  assert.equal(result.proposals.length, fixtures.length);

  assertDetected(result, 'Fixture A2L PLA', 'Bambu Lab A2L');
  assertDetected(result, 'Fixture A1 mini PLA', 'Bambu Lab A1 mini');
  assertDetected(result, 'Fixture X1 Carbon PLA', 'Bambu Lab X1 Carbon');

  const a1Mini = proposalFor(result, 'Fixture A1 mini PLA');
  assert.deepEqual(
    a1Mini.observedPrinters.map((item) => item.printer),
    ['Bambu Lab A1 mini'],
    'A1 mini must not also be inferred as A1',
  );

  const unknown = proposalFor(result, 'Fixture Unknown PLA');
  assert.equal(unknown.observedPrinters.length, 0);
  assert.ok(
    unknown.issues.includes('printer/nozzle is unclear'),
    'an unsupported compatible_printers value must become a decision request',
  );
  assert.ok(
    result.decisions.some(
      (decision) => decision.profileName === unknown.profileName && decision.issue === 'printer/nozzle is unclear',
    ),
    'unsupported printer decision must be written to the decision report',
  );

  console.log('OK: printer detection fixture passed.');
} finally {
  if (!process.env.KEEP_VERIFY_FIXTURES) {
    await resetFixture();
  }
}

function assertDetected(result, nameFragment, expectedPrinter) {
  const proposal = proposalFor(result, nameFragment);
  assert.deepEqual(
    proposal.observedPrinters.map((item) => item.printer),
    [expectedPrinter],
    `${nameFragment} should resolve to exactly ${expectedPrinter}`,
  );
  assert.ok(!proposal.issues.includes('printer/nozzle is unclear'));
}

function proposalFor(result, nameFragment) {
  const proposal = result.proposals.find((item) => item.profileName.includes(nameFragment));
  assert.ok(proposal, `missing proposal containing ${nameFragment}`);
  return proposal;
}

function profileFor(name, compatiblePrinter) {
  return {
    name,
    filament_settings_id: [name],
    filament_vendor: ['Fixture'],
    filament_type: ['PLA'],
    compatible_printers: [compatiblePrinter],
    inherits: '',
  };
}

async function runBambuProfiles(args) {
  await execFileAsync(process.execPath, [path.join('scripts', 'bambu-profiles.mjs'), ...args], {
    cwd: repoRoot,
    windowsHide: true,
  });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function resetFixture() {
  await fs.rm(vendorDir, { recursive: true, force: true });
  await fs.rm(fixtureRoot, { recursive: true, force: true });
  await fs.rm(extractedRoot, { recursive: true, force: true });
}
