#!/usr/bin/env node

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const vendorKey = 'verify-input-lock-fixture';
const vendorName = 'Fixture Input Lock';
const vendorDir = path.join(repoRoot, 'vendors', vendorKey);
const extractedRoot = path.join(repoRoot, '.work', 'extracted', vendorKey);

const movedProfile = profileFor('A1 Fixture PLA Filament', { filament_vendor: ['Fixture'] });
const movedHash = stableHash(movedProfile);
const movedSettingsHash = profileSettingsHash(movedProfile);

const metadataOldProfile = profileFor('A1 Fixture PETG Filament');
const metadataNewProfile = profileFor('A1 Fixture PETG Filament', {
  filament_vendor: ['Fixture'],
  filament_id: 'Pfixture',
});
const metadataOldHash = stableHash(metadataOldProfile);
const metadataNewHash = stableHash(metadataNewProfile);
const metadataSettingsHash = profileSettingsHash(metadataOldProfile);

const ambiguousOldAProfile = profileFor('A1 Fixture Ambiguous Old A Filament');
const ambiguousOldBProfile = profileFor('A1 Fixture Ambiguous Old B Filament');
const ambiguousNewProfile = profileFor('A1 Fixture Ambiguous Filament', {
  filament_vendor: ['Fixture'],
});
const ambiguousSettingsHash = 'ambiguous-settings-hash';

try {
  await resetFixture();
  await fs.mkdir(vendorDir, { recursive: true });
  await fs.mkdir(path.join(extractedRoot, 'reports'), { recursive: true });
  await fs.writeFile(
    path.join(vendorDir, 'sources.yml'),
    `vendor: ${vendorName}\nsources: []\n`,
    'utf8',
  );

  await writeJson(path.join(vendorDir, 'input-lock.json'), {
    vendor: vendorName,
    acceptedAt: '2026-06-09T00:00:00.000Z',
    sources: fixtureSources(),
    inputs: [
      inputLockEntry('old.zip', 'old/A1/Filament.json', movedProfile, movedHash, movedSettingsHash),
      inputLockEntry('meta.zip', 'meta/A1/Filament.json', metadataOldProfile, metadataOldHash, metadataSettingsHash),
      inputLockEntry('ambiguous-a.zip', 'old/A1/A.json', ambiguousOldAProfile, stableHash(ambiguousOldAProfile), ambiguousSettingsHash),
      inputLockEntry('ambiguous-b.zip', 'old/A1/B.json', ambiguousOldBProfile, stableHash(ambiguousOldBProfile), ambiguousSettingsHash),
    ],
  });

  await writeJson(path.join(extractedRoot, 'manifest.json'), {
    vendor: vendorName,
    vendorKey,
    generatedAt: '2026-06-09T00:00:00.000Z',
    collectionRoot: `.work/extracted/${vendorKey}`,
    sources: fixtureSources(),
    inputs: [
      manifestEntry('renamed.zip', 'new/A1/Filament.json', movedProfile, movedHash, movedSettingsHash),
      manifestEntry('meta.zip', 'meta/A1/Filament.json', metadataNewProfile, metadataNewHash, metadataSettingsHash),
      manifestEntry('ambiguous-new.zip', 'new/A1/Filament.json', ambiguousNewProfile, stableHash(ambiguousNewProfile), ambiguousSettingsHash),
    ],
    artifactCandidates: [],
    bundleErrors: [],
  });

  await runBambuProfiles(['vendor:diff', '--vendor', vendorKey]);
  const diff = await readJson(path.join(extractedRoot, 'reports', 'diff.json'));
  const moved = findInput(diff, 'renamed.zip');
  const metadataOnly = findInput(diff, 'meta.zip');
  const ambiguous = findInput(diff, 'ambiguous-new.zip');

  assert.equal(moved.status, 'moved-unchanged');
  assert.equal(moved.previousRelativePath, 'old.zip');
  assert.equal(metadataOnly.status, 'metadata-only-changed');
  assert.equal(ambiguous.status, 'added');
  assert.equal(diff.inputs.filter((input) => input.status === 'removed').length, 2);

  await runBambuProfiles(['vendor:propose', '--vendor', vendorKey]);
  const proposals = await readJson(path.join(extractedRoot, 'reports', 'proposals.json'));
  assert.equal(proposals.proposals.length, 1, 'only the ambiguous added input should remain a proposal candidate');
  assert.equal(proposals.proposals[0].relativePath, 'ambiguous-new.zip');

  console.log('OK: input lock dedupe fixture passed.');
} finally {
  if (!process.env.KEEP_VERIFY_FIXTURES) {
    await resetFixture();
  }
}

function fixtureSources() {
  return {
    incoming: {
      id: 'incoming',
      label: 'Fixture incoming',
      repo: 'incoming',
      branch: '',
      commit: '',
      priority: 200,
      formats: ['json', 'bbsflmt', 'zip'],
    },
  };
}

function inputLockEntry(relativePath, innerPath, profile, profileHash, settingsHash) {
  return {
    identity: `incoming:${relativePath}:${innerPath}`,
    sourceId: 'incoming',
    sourceRepo: 'incoming',
    sourceCommit: '',
    format: 'zip',
    relativePath,
    innerPath,
    sourceFileHash: 'fixture-source-hash',
    profileHash,
    bundleHash: null,
    settingsHash,
    profileName: profile.name,
    filamentSettingsId: profile.filament_settings_id[0],
    filamentVendor: profile.filament_vendor ?? [],
    filamentType: profile.filament_type[0],
    compatiblePrinters: profile.compatible_printers,
    observedPrinters: ['Bambu Lab A1'],
    inherits: profile.inherits,
    keyCount: Object.keys(profile).length,
    extractedPath: `profiles/incoming/${hash(`${relativePath}:${innerPath}`).slice(0, 12)}/${profile.name}.json`,
  };
}

function manifestEntry(relativePath, innerPath, profile, profileHash, settingsHash) {
  return {
    identity: `incoming:${relativePath}:${innerPath}`,
    sourceId: 'incoming',
    sourceLabel: 'Fixture incoming',
    sourceRepo: 'incoming',
    sourceCommit: '',
    sourcePriority: 200,
    format: 'zip',
    relativePath,
    innerPath,
    sourceFileHash: 'fixture-source-hash',
    profileHash,
    bundleHash: null,
    settingsHash,
    extractedPath: `profiles/incoming/${hash(`${relativePath}:${innerPath}`).slice(0, 12)}/${profile.name}.json`,
    profileName: profile.name,
    filamentSettingsId: profile.filament_settings_id[0],
    filamentVendor: profile.filament_vendor ?? [],
    filamentType: profile.filament_type[0],
    compatiblePrinters: profile.compatible_printers,
    observedPrinters: ['Bambu Lab A1'],
    inherits: profile.inherits,
    keyCount: Object.keys(profile).length,
  };
}

function profileFor(name, overrides = {}) {
  return {
    name,
    filament_settings_id: [name],
    filament_type: ['PLA'],
    compatible_printers: ['Bambu Lab A1'],
    inherits: '',
    ...overrides,
  };
}

function findInput(diff, relativePath) {
  const input = diff.inputs.find((item) => item.relativePath === relativePath);
  assert.ok(input, `missing diff input for ${relativePath}`);
  return input;
}

async function resetFixture() {
  await fs.rm(vendorDir, { recursive: true, force: true });
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

async function writeJson(file, value) {
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function profileSettingsHash(profile) {
  return stableHash(omitProfileMetadata(profile, new Set(['filament_id', 'filament_vendor'])));
}

function omitProfileMetadata(value, keysToOmit) {
  if (Array.isArray(value)) return value.map((item) => omitProfileMetadata(item, keysToOmit));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !keysToOmit.has(key))
        .map(([key, item]) => [key, omitProfileMetadata(item, keysToOmit)]),
    );
  }
  return value;
}

function stableHash(value) {
  return hash(JSON.stringify(sortDeep(value)));
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([key, item]) => [key, sortDeep(item)]));
  }
  return value;
}

function hash(text) {
  return crypto.createHash('sha1').update(String(text)).digest('hex');
}
