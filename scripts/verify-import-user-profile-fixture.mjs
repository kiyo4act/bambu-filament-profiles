#!/usr/bin/env node

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const fixtureRoot = path.join(repoRoot, '.work', 'verify-import-user-profile');
const importScript = path.join(repoRoot, 'scripts', 'import-user-profile.mjs');

await fs.rm(fixtureRoot, { recursive: true, force: true });
await fs.mkdir(fixtureRoot, { recursive: true });

const source = {
  compatible_printers: ['Bambu Lab H2C 0.4 nozzle'],
  compatible_printers_condition: 'legacy condition',
  filament_id: 'Psource1',
  filament_max_volumetric_speed: ['16', '18'],
  filament_settings_id: ['User PETG Matte @Bambu Lab H2C 0.4 nozzle'],
  filament_vendor: ['UserVendor'],
  inherits: 'Some inherited preset',
  name: 'User PETG Matte @Bambu Lab H2C 0.4 nozzle',
  nozzle_temperature: ['245', 'nil'],
};
const sourcePath = path.join(fixtureRoot, 'source.json');
await writeJson(sourcePath, source);

await verifyExistingTarget(sourcePath);
await verifyNewTarget(sourcePath);

console.log('OK: import user profile fixture passed.');

async function verifyExistingTarget(sourcePath) {
  const targetPath = path.join(fixtureRoot, 'existing-target.json');
  await writeJson(targetPath, {
    ...source,
    filament_long_retractions_when_ec: ['nil'],
    filament_retraction_distances_when_ec: ['nil'],
    include: ['fdm_filament_template_direct_dual'],
    nozzle_temperature: ['230', 'nil'],
  });

  await runImport([
    '--source',
    sourcePath,
    '--target',
    path.relative(repoRoot, targetPath),
    '--name',
    'TINMORRY PETG Matte @Bambu Lab H2C 0.4 nozzle',
    '--compatible-printer',
    'Bambu Lab H2C 0.4 nozzle',
    '--vendor',
    'TINMORRY',
    '--filament-id',
    'P8a43bf1',
  ]);

  const output = await readJson(targetPath);
  assertEqual(output.nozzle_temperature, ['245', 'nil'], 'existing target should receive source calibration values');
  assertEqual(output.include, ['fdm_filament_template_direct_dual'], 'existing target should preserve include when source lacks it');
  assertEqual(output.filament_long_retractions_when_ec, ['nil'], 'existing target should preserve prefixed EC retraction key');
  assertEqual(output.filament_retraction_distances_when_ec, ['nil'], 'existing target should preserve prefixed EC distance key');
  assertFixedFields(output);
}

async function verifyNewTarget(sourcePath) {
  const targetPath = path.join(fixtureRoot, 'new', 'nozzle-0.4.json');

  await runImport([
    '--source',
    sourcePath,
    '--target',
    path.relative(repoRoot, targetPath),
    '--name',
    'TINMORRY PETG Matte @Bambu Lab H2C 0.4 nozzle',
    '--compatible-printer',
    'Bambu Lab H2C 0.4 nozzle',
    '--vendor',
    'TINMORRY',
    '--filament-id',
    'P8a43bf1',
    '--include',
    'fdm_filament_template_direct_dual',
  ]);

  const output = await readJson(targetPath);
  assertEqual(output.nozzle_temperature, ['245', 'nil'], 'new target should receive source calibration values');
  assertEqual(output.include, ['fdm_filament_template_direct_dual'], 'new target should allow explicit include');
  assertFixedFields(output);
}

async function runImport(args) {
  const result = await execFileAsync(process.execPath, [importScript, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return result.stdout;
}

function assertFixedFields(output) {
  assertEqual(output.name, 'TINMORRY PETG Matte @Bambu Lab H2C 0.4 nozzle', 'name should be fixed');
  assertEqual(output.filament_settings_id, ['TINMORRY PETG Matte @Bambu Lab H2C 0.4 nozzle'], 'filament_settings_id should match name');
  assertEqual(output.compatible_printers, ['Bambu Lab H2C 0.4 nozzle'], 'compatible_printers should be fixed');
  assertEqual(output.compatible_printers_condition, '', 'compatible_printers_condition should be cleared');
  assertEqual(output.filament_vendor, ['TINMORRY'], 'filament_vendor should be fixed');
  assertEqual(output.filament_id, 'P8a43bf1', 'filament_id should be fixed');
  assertEqual(output.inherits, '', 'inherits should be cleared');
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
