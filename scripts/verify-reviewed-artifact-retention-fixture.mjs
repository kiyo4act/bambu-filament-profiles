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
const vendorKey = 'verify-reviewed-artifact-retention-fixture';
const vendorName = 'Fixture Reviewed Artifact';
const vendorDir = path.join(repoRoot, 'vendors', vendorKey);
const fixtureRoot = path.join(repoRoot, '.work', 'verify-fixtures', 'reviewed-artifact-retention');
const sourceRepo = path.join(fixtureRoot, 'upstream');
const fixtureHooksDir = path.join(fixtureRoot, 'empty-hooks');
const extractedRoot = path.join(repoRoot, '.work', 'extracted', vendorKey);
const clonedUpstreamRoot = path.join(repoRoot, '.work', 'upstreams', vendorKey);
const readmePath = path.join(repoRoot, 'README.md');

const upstreamName = `${vendorName} PLA @Bambu Lab X1 0.4 nozzle`;
const reviewedArtifactName = `${vendorName} PETG Matte @Bambu Lab P2S 0.4 nozzle`;
const galaxyArtifactRawName = `${vendorName} PETG Galaxy @Bambu Lab X2D 0.4 nozzle`;
const galaxyArtifactNormalizedName = `${vendorName} Galaxy PETG @Bambu Lab X2D 0.4 nozzle`;
const removedRegularName = `${vendorName} ABS @Bambu Lab A1 0.4 nozzle`;
let readmeBefore;

try {
  readmeBefore = await fs.readFile(readmePath);
  await resetFixture();
  await fs.mkdir(vendorDir, { recursive: true });
  await writeJson(path.join(sourceRepo, 'profiles', 'upstream.json'), profileFor(upstreamName, 'PLA', 'Bambu Lab X1'));

  await git(['init', '--initial-branch', 'main'], sourceRepo);
  await git(['add', '.'], sourceRepo);
  await git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-m', 'fixture upstream'], sourceRepo);

  await fs.writeFile(
    path.join(vendorDir, 'sources.yml'),
    [
      `vendor: ${vendorName}`,
      'sources:',
      '  - id: fixture-upstream',
      '    label: Reviewed artifact retention fixture',
      `    repo: ${sourceRepo.replaceAll('\\', '/')}`,
      '    branch: main',
      '    priority: 100',
      '    formats:',
      '      - json',
      '    include:',
      '      - profiles/*.json',
      '',
    ].join('\n'),
    'utf8',
  );
  await writeJson(
    path.join(vendorDir, 'profiles', 'petg-matte', 'p2s', 'nozzle-0.4.json'),
    profileFor(reviewedArtifactName, 'PETG', 'Bambu Lab P2S'),
  );
  await writeJson(
    path.join(vendorDir, 'profiles', 'abs', 'a1', 'nozzle-0.4.json'),
    profileFor(removedRegularName, 'ABS', 'Bambu Lab A1'),
  );
  await writeJson(path.join(vendorDir, 'input-lock.json'), {
    vendor: vendorName,
    acceptedAt: '2026-06-09T00:00:00.000Z',
    sources: {},
    inputs: [],
    reviewedArtifactCandidates: [artifactLockEntry(reviewedArtifactName, 'reviewed-hash')],
  });

  await runBambuProfiles(['vendor:ingest', '--vendor', vendorKey, '--from', 'upstream']);

  const namesAfterIngest = new Set(await normalizedProfileNames());
  assert.ok(namesAfterIngest.has(upstreamName), 'current upstream profile must be ingested');
  assert.ok(namesAfterIngest.has(reviewedArtifactName), 'reviewed artifact-only profile must survive upstream ingest');
  assert.ok(!namesAfterIngest.has(removedRegularName), 'ordinary profile removed upstream must not be retained');

  const reviewedArtifact = artifactManifestEntry(reviewedArtifactName, 'reviewed-hash');
  const galaxyArtifact = artifactManifestEntry(galaxyArtifactRawName, 'new-hash');
  await writeJson(
    path.join(extractedRoot, reviewedArtifact.extractedPath),
    profileFor(reviewedArtifactName, 'PETG', 'Bambu Lab P2S'),
  );
  await writeJson(
    path.join(extractedRoot, galaxyArtifact.extractedPath),
    profileFor(galaxyArtifactRawName, 'PETG', 'Bambu Lab X2D'),
  );
  await writeJson(path.join(extractedRoot, 'manifest.json'), {
    vendor: vendorName,
    vendorKey,
    generatedAt: '2026-06-09T00:00:00.000Z',
    collectionRoot: `.work/extracted/${vendorKey}`,
    sources: {},
    inputs: [],
    artifactCandidates: [reviewedArtifact, galaxyArtifact],
    filteredOut: [],
    bundleErrors: [],
  });
  await runBambuProfiles(['vendor:lock-inputs', '--vendor', vendorKey, '--defer-artifact-candidates']);
  const lockAfterDefer = await readJson(path.join(vendorDir, 'input-lock.json'));
  assert.deepEqual(
    lockAfterDefer.reviewedArtifactCandidates.map((candidate) => candidate.profileName),
    [reviewedArtifactName],
    'deferring a new artifact candidate must retain prior reviewed artifact evidence only',
  );

  await runBambuProfiles(['vendor:ingest', '--vendor', vendorKey, '--from', galaxyArtifact.promoteFromPath]);
  await runBambuProfiles(['vendor:lock-inputs', '--vendor', vendorKey, '--lock-artifact-candidates']);
  const lockAfterAdopt = await readJson(path.join(vendorDir, 'input-lock.json'));
  const lockedGalaxy = lockAfterAdopt.reviewedArtifactCandidates.find(
    (candidate) => candidate.profileName === galaxyArtifactRawName,
  );
  assert.ok(lockedGalaxy, 'adopted artifact lock must preserve its raw review identity');
  assert.deepEqual(
    lockedGalaxy.normalizedProfileNames,
    [galaxyArtifactNormalizedName],
    'artifact lock must track the canonical normalized name when material word order changes',
  );

  await runBambuProfiles(['vendor:ingest', '--vendor', vendorKey, '--from', 'upstream']);
  const namesAfterArtifactRetention = new Set(await normalizedProfileNames());
  assert.ok(namesAfterArtifactRetention.has(upstreamName), 'current upstream profile must remain after artifact adoption');
  assert.ok(
    namesAfterArtifactRetention.has(reviewedArtifactName),
    'backward-compatible raw-name lock must continue retaining an older reviewed artifact',
  );
  assert.ok(
    namesAfterArtifactRetention.has(galaxyArtifactNormalizedName),
    'canonical artifact name must survive a later upstream ingest',
  );
  assert.ok(
    !namesAfterArtifactRetention.has(removedRegularName),
    'ordinary profile removed upstream must remain deleted after artifact adoption',
  );

  await removeNormalizedProfile(galaxyArtifactNormalizedName);
  const verifyFailure = await runBambuProfilesExpectFailure(['verify']);
  assert.match(
    verifyFailure,
    new RegExp(escapeRegex(galaxyArtifactNormalizedName)),
    'verification must name the missing canonical artifact profile',
  );
  const ingestFailure = await runBambuProfilesExpectFailure([
    'vendor:ingest',
    '--vendor',
    vendorKey,
    '--from',
    'upstream',
  ]);
  assert.match(
    ingestFailure,
    new RegExp(escapeRegex(galaxyArtifactNormalizedName)),
    'upstream ingest must stop rather than silently drop a missing canonical artifact profile',
  );

  console.log('OK: reviewed artifact retention fixture passed.');
} finally {
  if (readmeBefore) await fs.writeFile(readmePath, readmeBefore);
  if (!process.env.KEEP_VERIFY_FIXTURES) await resetFixture();
}

async function normalizedProfileNames() {
  const root = path.join(vendorDir, 'profiles');
  const files = await walkFiles(root);
  const names = [];
  for (const file of files.filter((item) => item.endsWith('.json'))) {
    names.push((await readJson(file)).name);
  }
  return names;
}

async function removeNormalizedProfile(profileName) {
  const files = await walkFiles(path.join(vendorDir, 'profiles'));
  for (const file of files.filter((item) => item.endsWith('.json'))) {
    if ((await readJson(file)).name === profileName) {
      await fs.rm(file);
      return;
    }
  }
  assert.fail(`normalized profile not found for removal: ${profileName}`);
}

async function walkFiles(root) {
  const out = [];
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...await walkFiles(full));
    else out.push(full);
  }
  return out;
}

async function resetFixture() {
  await fs.rm(vendorDir, { recursive: true, force: true });
  await fs.rm(fixtureRoot, { recursive: true, force: true });
  await fs.rm(extractedRoot, { recursive: true, force: true });
  await fs.rm(clonedUpstreamRoot, { recursive: true, force: true });
}

async function runBambuProfiles(args) {
  await execFileAsync(process.execPath, [path.join('scripts', 'bambu-profiles.mjs'), ...args], {
    cwd: repoRoot,
    windowsHide: true,
  });
}

async function runBambuProfilesExpectFailure(args) {
  try {
    await runBambuProfiles(args);
  } catch (error) {
    return [error.message, error.stdout, error.stderr].filter(Boolean).join('\n');
  }
  assert.fail(`expected bambu-profiles command to fail: ${args.join(' ')}`);
}

async function git(args, cwd) {
  await fs.mkdir(fixtureHooksDir, { recursive: true });
  await execFileAsync('git', [
    '-c',
    `core.hooksPath=${fixtureHooksDir.replaceAll('\\', '/')}`,
    '-c',
    'core.longpaths=true',
    ...args,
  ], { cwd, windowsHide: true });
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function profileFor(name, filamentType, printer) {
  return {
    name,
    filament_settings_id: [name],
    filament_vendor: [vendorName],
    filament_type: [filamentType],
    compatible_printers: [`${printer} 0.4 nozzle`],
    inherits: '',
  };
}

function artifactLockEntry(profileName, reviewHash) {
  const candidateDir = `candidate-profiles/fixture/${reviewHash}`;
  return {
    identity: `fixture-upstream:artifact.zip:bundle.bbsflmt::${profileName}.json:nested-bbsflmt-in-zip`,
    sourceId: 'fixture-upstream',
    sourceRepo: 'fixture',
    sourceCommit: 'fixture',
    format: 'zip',
    candidateType: 'nested-bbsflmt-in-zip',
    relativePath: 'artifact.zip',
    innerPath: `bundle.bbsflmt::${profileName}.json`,
    sourceFileHash: 'source-hash',
    profileHash: reviewHash,
    bundleHash: 'bundle-hash',
    reviewHash,
    profileName,
    extractedPath: `${candidateDir}/profile.json`,
    promoteFromPath: `.work/extracted/${vendorKey}/${candidateDir}`,
  };
}

function artifactManifestEntry(profileName, reviewHash) {
  return {
    ...artifactLockEntry(profileName, reviewHash),
    sourceLabel: 'Fixture artifact',
    sourcePriority: 100,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
