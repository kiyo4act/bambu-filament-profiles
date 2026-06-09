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
const vendorKey = 'verify-source-path-filter-fixture';
const vendorDir = path.join(repoRoot, 'vendors', vendorKey);
const fixtureRoot = path.join(repoRoot, '.work', 'verify-fixtures', 'source-path-filter');
const sourceRepo = path.join(fixtureRoot, 'mixed-upstream');
const extractedRoot = path.join(repoRoot, '.work', 'extracted', vendorKey);

try {
  await resetFixture();
  await fs.mkdir(vendorDir, { recursive: true });
  await fs.mkdir(sourceRepo, { recursive: true });

  await writeJson(
    path.join(sourceRepo, 'preset', 'Fixture PLA', 'BBL', 'X1', 'BambuStudio', 'Fixture PLA @BBL X1.json'),
    profileFor('Fixture PLA @BBL X1', ['Bambu Lab X1 0.4 nozzle']),
  );
  await writeJson(
    path.join(
      sourceRepo,
      'preset',
      'Fixture Source Path Filter ABS',
      'BBL',
      'X1',
      'BambuStudio',
      'Fixture Source Path Filter ABS @BBL X1.json',
    ),
    profileFor('Fixture Source Path Filter ABS @BBL X1', ['Bambu Lab X1 0.4 nozzle'], 'ABS'),
  );
  await writeJson(
    path.join(sourceRepo, 'preset', 'Fixture PLA', 'BBL', 'X1', 'Orcaslicer', 'Fixture PLA @BBL X1.json'),
    profileFor('Fixture PLA @BBL X1 Orca', ['Bambu Lab X1 0.4 nozzle']),
  );
  await writeJson(
    path.join(sourceRepo, 'preset', 'Fixture PLA', 'Elegoo', 'CC2', 'ElegooSlicer', 'Fixture PLA @Elegoo CC2.json'),
    profileFor('Fixture PLA @Elegoo CC2', ['Elegoo Centauri Carbon 2 0.4 nozzle']),
  );
  await writeJson(path.join(sourceRepo, 'index.json'), { note: 'not a filament profile' });

  await git(['init', '--initial-branch', 'main'], sourceRepo);
  await git(['add', '.'], sourceRepo);
  await git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-m', 'fixture upstream'], sourceRepo);

  await fs.writeFile(
    path.join(vendorDir, 'sources.yml'),
    [
      'vendor: Fixture Source Path Filter',
      'sources:',
      '  - id: mixed-upstream',
      '    label: Mixed upstream fixture',
      `    repo: ${sourceRepo.replaceAll('\\', '/')}`,
      '    branch: main',
      '    priority: 100',
      '    familyPathSegment: 1',
      '    formats:',
      '      - json',
      '    include:',
      '      - preset/**/BBL/**/*.json',
      '    exclude:',
      '      - preset/**/Orcaslicer/*.json',
      '',
    ].join('\n'),
    'utf8',
  );

  await runBambuProfiles(['vendor:collect', '--vendor', vendorKey, '--from', 'upstream']);

  const manifest = await readJson(path.join(extractedRoot, 'manifest.json'));
  assert.equal(manifest.inputs.length, 2, 'path filter should collect only the BambuStudio JSON files');
  assert.equal(manifest.inputs[0].relativePath, 'preset/Fixture PLA/BBL/X1/BambuStudio/Fixture PLA @BBL X1.json');
  assert.equal(manifest.inputs[0].sourceFamilyName, 'Fixture PLA');
  assert.equal(manifest.inputs[0].sourceFamilySource, 'path');
  assert.equal(manifest.artifactCandidates.length, 0, 'filtered profile-like files must not become artifact candidates');
  assert.equal(manifest.filteredOut.length, 2, 'path filter should report excluded filament JSON files');
  assert.ok(
    manifest.filteredOut.some((item) => item.reason === 'path did not match source include'),
    'filtered-out entries should record include mismatches',
  );
  assert.ok(
    manifest.filteredOut.some((item) => item.reason === 'path matched source exclude'),
    'filtered-out entries should record exclude matches',
  );
  assert.ok(
    !manifest.filteredOut.some((item) => item.relativePath === 'index.json'),
    'non-filament JSON should not be reported as a filtered profile-like file',
  );

  await runBambuProfiles(['vendor:diff', '--vendor', vendorKey]);
  await runBambuProfiles(['vendor:propose', '--vendor', vendorKey]);
  const proposals = await readJson(path.join(extractedRoot, 'reports', 'proposals.json'));
  assert.equal(proposals.proposals.length, 2);
  assert.ok(
    proposals.proposals.some((proposal) => proposal.suggestedFamily === 'Fixture Source Path Filter Fixture PLA'),
  );
  assert.ok(
    proposals.proposals.some((proposal) => proposal.suggestedFamily === 'Fixture Source Path Filter ABS'),
    'source family that already starts with vendor should not get a duplicate vendor prefix',
  );
  assert.equal(proposals.decisionRequestCount, 0);

  console.log('OK: source path filter fixture passed.');
} finally {
  if (!process.env.KEEP_VERIFY_FIXTURES) {
    await resetFixture();
  }
}

async function resetFixture() {
  await fs.rm(vendorDir, { recursive: true, force: true });
  await fs.rm(fixtureRoot, { recursive: true, force: true });
  await fs.rm(extractedRoot, { recursive: true, force: true });
}

async function runBambuProfiles(args) {
  await execFileAsync(process.execPath, [path.join('scripts', 'bambu-profiles.mjs'), ...args], {
    cwd: repoRoot,
    windowsHide: true,
  });
}

async function git(args, cwd) {
  await execFileAsync('git', args, {
    cwd,
    windowsHide: true,
  });
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function profileFor(name, compatiblePrinters, filamentType = 'PLA') {
  return {
    name,
    filament_settings_id: [name],
    filament_vendor: ['Fixture'],
    filament_type: [filamentType],
    compatible_printers: compatiblePrinters,
    inherits: '',
  };
}
