#!/usr/bin/env node

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { strToU8, zipSync } from 'fflate';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const vendorKey = 'verify-raw-zip-fixture';
const vendorDir = path.join(repoRoot, 'vendors', vendorKey);
const fixtureRoot = path.join(repoRoot, '.work', 'verify-fixtures', 'raw-zip-filament');
const extractedRoot = path.join(repoRoot, '.work', 'extracted', vendorKey);

try {
  await resetFixture();
  await fs.mkdir(vendorDir, { recursive: true });
  await fs.mkdir(fixtureRoot, { recursive: true });
  await fs.writeFile(
    path.join(vendorDir, 'sources.yml'),
    'vendor: Fixture Raw ZIP\nsources: []\n',
    'utf8',
  );

  const filament = {
    name: 'A1 Fixture PLA Filament',
    filament_settings_id: ['A1 Fixture PLA Filament'],
    filament_vendor: ['Fixture'],
    filament_type: ['PLA'],
    compatible_printers: ['Bambu Lab A1'],
    inherits: '',
  };
  const process = {
    name: 'A1 Fixture Process',
    print_settings_id: ['A1 Fixture Process'],
    inherits: '',
  };
  const zipBytes = zipSync({
    'fixture/A1/Filament.json': strToU8(JSON.stringify(filament)),
    'fixture/A1/Process.json': strToU8(JSON.stringify(process)),
    'fixture/readme.json': strToU8(JSON.stringify({ note: 'not a filament profile' })),
  });
  await fs.writeFile(path.join(fixtureRoot, 'mixed-raw-json.zip'), Buffer.from(zipBytes));

  await runBambuProfiles([
    'vendor:collect',
    '--vendor',
    vendorKey,
    '--from',
    path.relative(repoRoot, fixtureRoot),
  ]);

  const manifest = await readJson(path.join(extractedRoot, 'manifest.json'));
  assert.equal(manifest.inputs.length, 1, 'raw ZIP fixture should collect exactly one filament profile');
  assert.equal(manifest.artifactCandidates.length, 0, 'raw ZIP fixture should not create artifact candidates');
  assert.equal(manifest.bundleErrors.length, 0, 'raw ZIP fixture should not create an INVALID BUNDLE pseudo-profile');
  assert.equal(manifest.inputs[0].profileName, filament.name);
  assert.equal(manifest.inputs[0].innerPath, 'fixture/A1/Filament.json');

  const collectedNames = manifest.inputs.map((input) => input.profileName).join('\n');
  assert.ok(!collectedNames.includes('Process'), 'Process.json must not be collected as a filament profile');
  assert.ok(!collectedNames.includes('INVALID BUNDLE'), 'raw ZIP with valid filament JSON must not create INVALID BUNDLE');

  console.log('OK: raw ZIP filament fixture passed.');
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

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}
