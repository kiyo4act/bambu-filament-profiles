#!/usr/bin/env node

import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import YAML from 'yaml';

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const workRoot = path.join(repoRoot, '.work');
const vendorsRoot = path.join(repoRoot, 'vendors');
const distRoot = path.join(repoRoot, 'dist');
const gitBin = process.env.GIT ?? 'git';
const profileCandidateFormats = new Set(['json', 'bbsflmt', 'zip']);

const command = process.argv[2];
const args = parseArgs(process.argv.slice(3));

try {
  if (command === 'vendor:status') {
    await vendorStatus(args);
  } else if (command === 'vendor:collect') {
    await vendorCollect(args);
  } else if (command === 'vendor:diff') {
    await vendorDiff(args);
  } else if (command === 'vendor:propose') {
    await vendorPropose(args);
  } else if (command === 'vendor:ingest') {
    await vendorIngest(args);
  } else if (command === 'vendor:lock-inputs') {
    await vendorLockInputs(args);
  } else if (command === 'profiles:expand-inherits') {
    await profilesExpandInherits(args);
  } else if (command === 'reports:vendor-state') {
    await reportsVendorState(args);
  } else if (command === 'verify') {
    await verifyAll();
  } else if (command === 'build:bbsflmt') {
    await buildBbsflmt();
  } else if (command === 'generate:readme') {
    await generateReadme(args);
  } else {
    usage();
    process.exit(command ? 1 : 0);
  }
} catch (error) {
  console.error(error.message);
  if (error.details) console.error(error.details);
  process.exit(error.exitCode ?? 1);
}

function usage() {
  console.log(`Usage:
  node scripts/bambu-profiles.mjs vendor:status --vendor <vendor> [--json] [--exit-code]
  node scripts/bambu-profiles.mjs vendor:collect --vendor <vendor> [--from upstream|incoming|all|<path>]
  node scripts/bambu-profiles.mjs vendor:diff --vendor <vendor>
  node scripts/bambu-profiles.mjs vendor:propose --vendor <vendor>
  node scripts/bambu-profiles.mjs vendor:ingest --vendor <vendor> [--from incoming|upstream|<path>]
  node scripts/bambu-profiles.mjs vendor:lock-inputs --vendor <vendor> [--defer-artifact-candidates|--lock-artifact-candidates]
  node scripts/bambu-profiles.mjs profiles:expand-inherits --vendor <vendor> [--system-root <path>]
  node scripts/bambu-profiles.mjs reports:vendor-state --vendor <vendor>
  node scripts/bambu-profiles.mjs verify
  node scripts/bambu-profiles.mjs build:bbsflmt
  node scripts/bambu-profiles.mjs generate:readme [--check]`);
}

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      parsed._.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key === 'json' || key === 'exit-code') {
      parsed[toCamel(key)] = true;
      continue;
    }
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      parsed[toCamel(key)] = true;
      continue;
    }
    parsed[toCamel(key)] = next;
    index += 1;
  }
  return parsed;
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

async function vendorStatus(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const lock = await readJsonIfExists(path.join(config.dir, 'upstream-lock.json'));
  const current = [];

  for (const source of config.sources.sources ?? []) {
    const head = await remoteHead(source.repo, source.branch ?? 'main');
    const locked = lock?.sources?.[source.id]?.commit ?? null;
    current.push({
      id: source.id,
      repo: source.repo,
      branch: source.branch ?? 'main',
      locked,
      head,
      changed: locked !== head,
    });
  }

  const result = {
    vendor: config.vendor,
    changed: current.some((item) => item.changed),
    sources: current,
  };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`# ${config.vendor} upstream status`);
    for (const item of current) {
      const mark = item.changed ? 'changed' : 'unchanged';
      console.log(`- ${item.id}: ${mark}`);
      console.log(`  locked: ${item.locked ?? '(none)'}`);
      console.log(`  head:   ${item.head}`);
    }
  }

  if (options.exitCode && result.changed) {
    const error = new Error('Upstream changes detected.');
    error.exitCode = 2;
    throw error;
  }
}

async function vendorCollect(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const from = options.from ?? 'all';
  const collectionRoot = collectionRootFor(vendorKey);
  await fs.rm(collectionRoot, { recursive: true, force: true });
  await fs.mkdir(collectionRoot, { recursive: true });

  const manifest = {
    vendor: config.vendor,
    vendorKey,
    generatedAt: new Date().toISOString(),
    collectionRoot: path.relative(repoRoot, collectionRoot).replaceAll(path.sep, '/'),
    sources: {},
    inputs: [],
    artifactCandidates: [],
    filteredOut: [],
    bundleErrors: [],
  };

  const collectUpstream = from === 'all' || from === 'upstream';
  const collectIncoming = from === 'all' || from === 'incoming';
  const collectCustom = !['all', 'upstream', 'incoming'].includes(from);

  if (collectUpstream) {
    for (const source of config.sources.sources ?? []) {
      const sourceDir = await cloneSource(vendorKey, source);
      const commit = (await git(['rev-parse', 'HEAD'], sourceDir)).stdout.trim();
      manifest.sources[source.id] = sourceManifestEntry(source, commit);
      const inputs = await readDirectoryInputs(sourceDir, sourceMetaForSource(config, source, commit), {
        includeArtifactCandidates: true,
      });
      await appendCollectedInputs(manifest, inputs.profiles, collectionRoot);
      await appendArtifactCandidates(manifest, inputs.artifactCandidates, collectionRoot);
      appendFilteredOut(manifest, inputs.filteredOut);
    }
  }

  if (collectIncoming) {
    const incomingRoots = await incomingRootsFor(vendorKey);
    if (incomingRoots.length) {
      manifest.sources.incoming = {
        id: 'incoming',
        label: 'Manual incoming files',
        repo: 'incoming',
        branch: '',
        commit: '',
        priority: 200,
        formats: ['json', 'bbsflmt', 'zip'],
      };
      for (const incomingRoot of incomingRoots) {
        const profiles = await readProfilesFromDirectory(incomingRoot, {
          vendor: config.vendor,
          sourceId: 'incoming',
          sourceLabel: `Manual incoming files: ${path.relative(repoRoot, incomingRoot).replaceAll(path.sep, '/')}`,
          sourceRepo: 'incoming',
          sourcePriority: 200,
          sourceCommit: '',
          allowedFormats: new Set(['json', 'bbsflmt', 'zip']),
        });
        await appendCollectedInputs(manifest, profiles, collectionRoot);
      }
    }
  }

  if (collectCustom) {
    const customRoot = path.resolve(repoRoot, from);
    manifest.sources.manual = {
      id: 'manual',
      label: `Manual path: ${from}`,
      repo: from,
      branch: '',
      commit: '',
      priority: 200,
      formats: ['json', 'bbsflmt', 'zip'],
    };
    const profiles = await readProfilesFromDirectory(customRoot, {
      vendor: config.vendor,
      sourceId: 'manual',
      sourceLabel: `Manual path: ${from}`,
      sourceRepo: from,
      sourcePriority: 200,
      sourceCommit: '',
      allowedFormats: new Set(['json', 'bbsflmt', 'zip']),
    });
    await appendCollectedInputs(manifest, profiles, collectionRoot);
  }

  await writeJson(collectionManifestPath(vendorKey), manifest);
  await writeCollectionReport(manifest);
  console.log(
    `OK: collected ${manifest.inputs.length} JSON profile(s), ${manifest.artifactCandidates.length} artifact candidate(s), and ${manifest.filteredOut.length} filtered-out profile-like file(s) for ${config.vendor} into ${path.relative(repoRoot, collectionRoot)}.`,
  );
}

async function vendorDiff(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const manifest = await readCollectionManifest(vendorKey);
  const inputLock = await readJsonIfExists(path.join(config.dir, 'input-lock.json'));
  const upstreamLock = await readJsonIfExists(path.join(config.dir, 'upstream-lock.json'));

  const previousInputs = new Map(
    (inputLock?.inputs ?? []).map((item) => [inputIdentity(item), item]),
  );
  const currentInputs = new Map(manifest.inputs.map((item) => [inputIdentity(item), item]));
  const missingPreviousInputs = (inputLock?.inputs ?? []).filter(
    (item) => !currentInputs.has(inputIdentity(item)),
  );
  const missingPreviousByProfileHash = groupInputsByHash(missingPreviousInputs, (item) => item.profileHash);
  const missingPreviousBySettingsHash = groupInputsByHash(missingPreviousInputs, inputSettingsHash);
  const matchedMovedPreviousInputs = new Set();
  const previousArtifactCandidates = new Map(
    (inputLock?.reviewedArtifactCandidates ?? inputLock?.artifactCandidates ?? [])
      .map((item) => [artifactCandidateIdentity(item), item]),
  );
  const currentArtifactCandidates = new Map(
    (manifest.artifactCandidates ?? []).map((item) => [artifactCandidateIdentity(item), item]),
  );
  const inputDiffs = [];
  const artifactCandidateDiffs = [];

  for (const input of manifest.inputs) {
    let previous = previousInputs.get(inputIdentity(input));
    let status = 'added';
    if (previous) {
      status = previous.profileHash === input.profileHash
        ? 'unchanged'
        : inputSettingsHash(previous) && inputSettingsHash(previous) === inputSettingsHash(input)
          ? 'metadata-only-changed'
          : 'changed';
    } else if (!inputLock) {
      status = 'untracked';
    } else {
      previous = matchPreviousInputByHash(missingPreviousByProfileHash, input.profileHash, input, matchedMovedPreviousInputs);
      if (previous) {
        status = 'moved-unchanged';
      } else {
        previous = matchPreviousInputByHash(missingPreviousBySettingsHash, inputSettingsHash(input), input, matchedMovedPreviousInputs);
        if (previous) {
          status = 'moved-metadata-only';
        }
      }
      if (previous) {
        matchedMovedPreviousInputs.add(inputIdentity(previous));
      }
    }
    inputDiffs.push({
      status,
      sourceId: input.sourceId,
      relativePath: input.relativePath,
      innerPath: input.innerPath,
      profileName: input.profileName,
      previousHash: previous?.profileHash ?? null,
      currentHash: input.profileHash,
      previousIdentity: previous && inputIdentity(previous) !== inputIdentity(input) ? inputIdentity(previous) : null,
      previousRelativePath: previous && inputIdentity(previous) !== inputIdentity(input) ? previous.relativePath : null,
      previousInnerPath: previous && inputIdentity(previous) !== inputIdentity(input) ? previous.innerPath : null,
    });
  }

  for (const previous of inputLock?.inputs ?? []) {
    if (matchedMovedPreviousInputs.has(inputIdentity(previous))) continue;
    if (!currentInputs.has(inputIdentity(previous))) {
      inputDiffs.push({
        status: 'removed',
        sourceId: previous.sourceId,
        relativePath: previous.relativePath,
        innerPath: previous.innerPath,
        profileName: previous.profileName,
        previousHash: previous.profileHash,
        currentHash: null,
      });
    }
  }

  for (const candidate of manifest.artifactCandidates ?? []) {
    const previous = previousArtifactCandidates.get(artifactCandidateIdentity(candidate));
    let status = 'added';
    if (previous) {
      status = artifactCandidateReviewHash(previous) === artifactCandidateReviewHash(candidate) ? 'unchanged' : 'changed';
    } else if (!inputLock) {
      status = 'untracked';
    }
    artifactCandidateDiffs.push({
      status,
      identity: artifactCandidateIdentity(candidate),
      sourceId: candidate.sourceId,
      relativePath: candidate.relativePath,
      innerPath: candidate.innerPath,
      candidateType: candidate.candidateType,
      profileName: candidate.profileName,
      previousHash: previous ? artifactCandidateReviewHash(previous) : null,
      currentHash: artifactCandidateReviewHash(candidate),
      promoteFromPath: candidate.promoteFromPath,
    });
  }

  for (const previous of inputLock?.reviewedArtifactCandidates ?? inputLock?.artifactCandidates ?? []) {
    if (!currentArtifactCandidates.has(artifactCandidateIdentity(previous))) {
      artifactCandidateDiffs.push({
        status: 'removed',
        identity: artifactCandidateIdentity(previous),
        sourceId: previous.sourceId,
        relativePath: previous.relativePath,
        innerPath: previous.innerPath,
        candidateType: previous.candidateType,
        profileName: previous.profileName,
        previousHash: artifactCandidateReviewHash(previous),
        currentHash: null,
        promoteFromPath: previous.promoteFromPath ?? '',
      });
    }
  }

  const sourceDiffs = Object.values(manifest.sources).map((source) => {
    const locked = upstreamLock?.sources?.[source.id] ?? null;
    return {
      id: source.id,
      repo: source.repo,
      branch: source.branch,
      lockedCommit: locked?.commit ?? null,
      currentCommit: source.commit || null,
      status: locked?.commit && source.commit
        ? locked.commit === source.commit
          ? 'unchanged'
          : 'changed'
        : 'untracked',
    };
  });

  const result = {
    vendor: manifest.vendor,
    generatedAt: new Date().toISOString(),
    basis: {
      manifest: path.relative(repoRoot, collectionManifestPath(vendorKey)).replaceAll(path.sep, '/'),
      inputLock: inputLock ? path.relative(repoRoot, path.join(config.dir, 'input-lock.json')).replaceAll(path.sep, '/') : null,
      upstreamLock: upstreamLock ? path.relative(repoRoot, path.join(config.dir, 'upstream-lock.json')).replaceAll(path.sep, '/') : null,
    },
    sources: sourceDiffs,
    inputs: inputDiffs.sort((a, b) =>
      `${a.status}:${a.sourceId}:${a.relativePath}:${a.innerPath}`.localeCompare(
        `${b.status}:${b.sourceId}:${b.relativePath}:${b.innerPath}`,
        'en',
      ),
    ),
    artifactCandidates: artifactCandidateDiffs.sort((a, b) =>
      `${a.status}:${a.sourceId}:${a.relativePath}:${a.innerPath}:${a.candidateType}`.localeCompare(
        `${b.status}:${b.sourceId}:${b.relativePath}:${b.innerPath}:${b.candidateType}`,
        'en',
      ),
    ),
  };

  const reportsDir = collectionReportsRoot(vendorKey);
  await fs.mkdir(reportsDir, { recursive: true });
  await writeJson(path.join(reportsDir, 'diff.json'), result);
  await fs.writeFile(path.join(reportsDir, 'diff.md'), diffMarkdown(result), 'utf8');
  console.log(`OK: wrote diff report for ${manifest.vendor} to ${path.relative(repoRoot, reportsDir)}.`);
}

async function vendorPropose(options) {
  const vendorKey = requireVendor(options);
  const manifest = await readCollectionManifest(vendorKey);
  const reportsDir = collectionReportsRoot(vendorKey);
  const diff = await readJsonIfExists(path.join(reportsDir, 'diff.json'));
  const changedKeys = new Set(
    (diff?.inputs ?? manifest.inputs)
      .filter((item) => ['added', 'changed', 'untracked'].includes(item.status ?? 'untracked'))
      .map(inputIdentity),
  );
  const changedArtifactCandidateKeys = new Set(
    (diff?.artifactCandidates ?? manifest.artifactCandidates ?? [])
      .filter((item) => ['added', 'changed', 'untracked'].includes(item.status ?? 'untracked'))
      .map(artifactCandidateIdentity),
  );
  const existingProfiles = (await readAllNormalizedProfiles()).filter((item) => item.vendor === manifest.vendor);
  const knownFamilies = new Set(existingProfiles.map((item) => item.profile.name.split(' @')[0]));
  const proposals = [];
  const artifactProposals = [];
  const decisions = [];

  for (const input of manifest.inputs) {
    if (!changedKeys.has(inputIdentity(input))) continue;
    const text = normalizeText(
      [
        input.profileName,
        input.filamentSettingsId,
        input.relativePath,
        input.innerPath,
        input.inherits,
        input.compatiblePrinters.join(' '),
        input.filamentType,
      ].join(' '),
    );
    const sourceFamilyName = sourceFamilyNameFromParts(
      manifest.vendor,
      input.profileName,
      input.filamentSettingsId,
      input.innerPath,
    );
    const trustedSourceFamily = input.sourceFamilySource === 'path';
    const familyFromSource = input.sourceFamilyName || sourceFamilyName;
    const material = materialObservationFor(normalizeText(familyFromSource || text));
    const printers = printerNamesFromText(text).map((printer) => ({
      printer,
      nozzle: nozzleFor(text, {}),
    }));
    const familySuggestion = familyFromSource
      ? familyNameFromSourceFamily(manifest.vendor, familyFromSource)
      : familySuggestionFor(manifest.vendor, material);
    const issues = proposalIssuesFor(input, material, printers, familySuggestion, knownFamilies, {
      trustedSourceFamily,
    });
    const proposal = {
      sourceId: input.sourceId,
      relativePath: input.relativePath,
      innerPath: input.innerPath,
      profileName: input.profileName,
      observedMaterial: material,
      suggestedFamily: familySuggestion,
      observedPrinters: printers,
      hasVendor: input.filamentVendor.includes(manifest.vendor),
      inherits: input.inherits,
      issues,
    };
    proposals.push(proposal);
    for (const issue of issues) {
      decisions.push({
        kind: 'input',
        issue,
        sourceId: input.sourceId,
        relativePath: input.relativePath,
        innerPath: input.innerPath,
        profileName: input.profileName,
        suggestedFamily: familySuggestion,
      });
    }
  }

  for (const candidate of manifest.artifactCandidates ?? []) {
    if (!changedArtifactCandidateKeys.has(artifactCandidateIdentity(candidate))) continue;
    const text = normalizeText(
      [
        candidate.profileName,
        candidate.filamentSettingsId,
        candidate.relativePath,
        candidate.innerPath,
        candidate.inherits,
        candidate.compatiblePrinters.join(' '),
        candidate.filamentType,
      ].join(' '),
    );
    const sourceFamilyName = sourceFamilyNameFromParts(
      manifest.vendor,
      candidate.profileName,
      candidate.filamentSettingsId,
      candidate.innerPath,
    );
    const trustedSourceFamily = candidate.sourceFamilySource === 'path';
    const familyFromSource = candidate.sourceFamilyName || sourceFamilyName;
    const material = materialObservationFor(normalizeText(familyFromSource || text));
    const printers = printerNamesFromText(text).map((printer) => ({
      printer,
      nozzle: nozzleFor(text, {}),
    }));
    const familySuggestion = familyFromSource
      ? familyNameFromSourceFamily(manifest.vendor, familyFromSource)
      : familySuggestionFor(manifest.vendor, material);
    const issues = artifactCandidateIssuesFor(candidate, material, printers, familySuggestion, knownFamilies, {
      trustedSourceFamily,
    });
    const artifactProposal = {
      sourceId: candidate.sourceId,
      relativePath: candidate.relativePath,
      innerPath: candidate.innerPath,
      candidateType: candidate.candidateType,
      profileName: candidate.profileName,
      observedMaterial: material,
      suggestedFamily: familySuggestion,
      observedPrinters: printers,
      promoteFromPath: candidate.promoteFromPath,
      notes: candidate.notes ?? [],
      issues,
    };
    artifactProposals.push(artifactProposal);
    for (const issue of issues) {
      decisions.push({
        kind: 'artifact-candidate',
        issue,
        sourceId: candidate.sourceId,
        relativePath: candidate.relativePath,
        innerPath: candidate.innerPath,
        profileName: candidate.profileName,
        suggestedFamily: familySuggestion,
        candidateType: candidate.candidateType,
        promoteFromPath: candidate.promoteFromPath,
      });
    }
  }

  const result = {
    vendor: manifest.vendor,
    generatedAt: new Date().toISOString(),
    changedInputCount: proposals.length,
    changedArtifactCandidateCount: artifactProposals.length,
    proposalCount: proposals.length,
    artifactProposalCount: artifactProposals.length,
    decisionRequestCount: decisions.length,
    proposals,
    artifactProposals,
    decisions,
  };

  await fs.mkdir(reportsDir, { recursive: true });
  await writeJson(path.join(reportsDir, 'proposals.json'), result);
  await fs.writeFile(path.join(reportsDir, 'proposal-summary.md'), proposalMarkdown(result), 'utf8');
  await fs.writeFile(path.join(reportsDir, 'decision-requests.md'), decisionRequestsMarkdown(result), 'utf8');
  console.log(
    `OK: wrote ${proposals.length} proposal(s) and ${decisions.length} decision request(s) for ${manifest.vendor}.`,
  );
}

async function vendorLockInputs(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const manifest = await readCollectionManifest(vendorKey);
  const artifactCandidates = manifest.artifactCandidates ?? [];
  const deferArtifactCandidates = Boolean(options.deferArtifactCandidates);
  const lockArtifactCandidates = Boolean(options.lockArtifactCandidates);

  if (artifactCandidates.length && !deferArtifactCandidates && !lockArtifactCandidates) {
    const error = new Error(
      `${manifest.vendor} has ${artifactCandidates.length} artifact candidate(s); review them before locking inputs, or rerun with --defer-artifact-candidates to lock normal inputs only.`,
    );
    error.details = artifactCandidates.map((candidate) =>
      `- ${candidate.sourceId}: ${candidate.relativePath}${candidate.innerPath ? ` :: ${candidate.innerPath}` : ''}`,
    ).join('\n');
    throw error;
  }

  const lock = {
    vendor: manifest.vendor,
    acceptedAt: new Date().toISOString(),
    sources: manifest.sources,
    inputs: manifest.inputs.map((input) => ({
      identity: inputIdentity(input),
      sourceId: input.sourceId,
      sourceRepo: input.sourceRepo,
      sourceCommit: input.sourceCommit,
      format: input.format,
      relativePath: input.relativePath,
      innerPath: input.innerPath,
      sourceFileHash: input.sourceFileHash,
      profileHash: input.profileHash,
      bundleHash: input.bundleHash,
      settingsHash: input.settingsHash,
      profileName: input.profileName,
      sourceFamilyName: input.sourceFamilyName ?? '',
      sourceFamilySource: input.sourceFamilySource ?? '',
      filamentSettingsId: input.filamentSettingsId,
      filamentVendor: input.filamentVendor,
      filamentType: input.filamentType,
      compatiblePrinters: input.compatiblePrinters,
      observedPrinters: input.observedPrinters,
      inherits: input.inherits,
      keyCount: input.keyCount,
      extractedPath: input.extractedPath,
    })),
  };

  if (lockArtifactCandidates) {
    lock.reviewedArtifactCandidates = artifactCandidates.map((candidate) => ({
      identity: artifactCandidateIdentity(candidate),
      sourceId: candidate.sourceId,
      sourceRepo: candidate.sourceRepo,
      sourceCommit: candidate.sourceCommit,
      format: candidate.format,
      candidateType: candidate.candidateType,
      relativePath: candidate.relativePath,
      innerPath: candidate.innerPath,
      sourceFileHash: candidate.sourceFileHash,
      profileHash: candidate.profileHash,
      bundleHash: candidate.bundleHash,
      reviewHash: artifactCandidateReviewHash(candidate),
      profileName: candidate.profileName,
      sourceFamilyName: candidate.sourceFamilyName ?? '',
      sourceFamilySource: candidate.sourceFamilySource ?? '',
      extractedPath: candidate.extractedPath,
      promoteFromPath: candidate.promoteFromPath,
    }));
  }

  await writeJson(path.join(config.dir, 'input-lock.json'), lock);
  const artifactMessage = lockArtifactCandidates
    ? ` and ${lock.reviewedArtifactCandidates.length} reviewed artifact candidate(s)`
    : deferArtifactCandidates && artifactCandidates.length
      ? `; deferred ${artifactCandidates.length} artifact candidate(s)`
      : '';
  console.log(`OK: locked ${lock.inputs.length} accepted input(s)${artifactMessage} for ${manifest.vendor}.`);
}

async function profilesExpandInherits(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const systemRoot = path.resolve(
    options.systemRoot ??
      path.join(process.env.APPDATA ?? '', 'BambuStudioBeta', 'system', 'BBL', 'filament'),
  );
  const systemPresets = await loadPresetMap(systemRoot);
  if (!systemPresets.size) {
    throw new Error(`No Bambu Studio system filament presets found under ${systemRoot}`);
  }

  const profileFiles = (await walkFiles(path.join(config.dir, 'profiles')).catch(() => []))
    .filter((file) => file.toLowerCase().endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, 'en'));
  const localPresets = new Map();
  for (const filePath of profileFiles) {
    const profile = JSON.parse(await fs.readFile(filePath, 'utf8'));
    if (profile.name) localPresets.set(profile.name, { filePath, profile });
  }
  const allPresets = new Map([...systemPresets, ...localPresets]);
  const cache = new Map();
  const unresolved = [];
  let expandedCount = 0;

  for (const filePath of profileFiles) {
    const profile = JSON.parse(await fs.readFile(filePath, 'utf8'));
    if (!profile.inherits) continue;
    const expanded = expandPresetForFile(profile, filePath, allPresets, cache, [], unresolved);
    expanded.inherits = '';
    delete expanded.instantiation;
    delete expanded.is_custom_defined;
    delete expanded.setting_id;
    delete expanded.type;
    await writeJson(filePath, sortDeep(expanded));
    expandedCount += 1;
  }

  if (unresolved.length) {
    const error = new Error(`Failed to resolve ${unresolved.length} inherited preset(s).`);
    error.details = unresolved.map((item) => `- ${item.filePath}: ${item.parentName}`).join('\n');
    throw error;
  }
  console.log(
    `OK: expanded ${expandedCount} inherited profile(s) for ${config.vendor} using ${systemPresets.size} Bambu Studio system presets.`,
  );
}

async function reportsVendorState(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const profiles = (await readAllNormalizedProfiles()).filter((item) => slug(item.vendor) === vendorKey);
  const errors = validateProfiles(profiles);
  const materials = new Map();
  const printers = new Map();
  for (const item of profiles) {
    const family = item.profile.name.split(' @')[0];
    if (!materials.has(family)) materials.set(family, []);
    materials.get(family).push(item);
    const printer = String(item.profile.compatible_printers?.[0] ?? '').replace(/\s+\d+(?:\.\d+)?\s+nozzle$/i, '').trim();
    if (printer) printers.set(printer, (printers.get(printer) ?? 0) + 1);
  }

  const report = {
    vendor: config.vendor,
    generatedAt: new Date().toISOString(),
    normalizedProfileCount: profiles.length,
    materialCount: materials.size,
    printerCounts: Object.fromEntries([...printers.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))),
    unresolvedInheritsCount: profiles.filter((item) => item.profile.inherits).length,
    validationErrors: errors,
    outputs: profiles.map((item) => ({
      name: item.profile.name,
      path: item.relativePathFromVendor,
      family: item.profile.name.split(' @')[0],
      type: item.profile.filament_type?.[0] ?? '',
      printer: item.profile.compatible_printers?.[0] ?? '',
      keyCount: Object.keys(item.profile).length,
    })),
  };

  const reportsDir = path.join(config.dir, 'reports');
  await fs.rm(reportsDir, { recursive: true, force: true });
  await fs.mkdir(reportsDir, { recursive: true });
  await writeJson(path.join(reportsDir, 'manifest.json'), report);
  await fs.writeFile(path.join(reportsDir, 'classification.md'), vendorStateClassificationMarkdown(report), 'utf8');
  await fs.writeFile(path.join(reportsDir, 'filename-normalization.md'), vendorStateFilenamesMarkdown(report), 'utf8');
  await fs.writeFile(
    path.join(reportsDir, 'conflicts.md'),
    listMarkdown('Committed State Conflicts', errors, 'No committed-state conflicts.'),
    'utf8',
  );
  await fs.writeFile(
    path.join(reportsDir, 'warnings.md'),
    listMarkdown(
      'Committed State Warnings',
      report.unresolvedInheritsCount
        ? [`${report.unresolvedInheritsCount} profile(s) still have non-empty inherits.`]
        : [],
      'No unresolved inherited presets remain.',
    ),
    'utf8',
  );
  console.log(`OK: wrote committed-state reports for ${config.vendor} with ${profiles.length} profile(s).`);
}

async function vendorUpdate(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const { sourceProfiles, upstreamHeads } = await readUpstreamSourceProfiles(config, vendorKey);

  const result = await normalizeAndWriteVendor(config, sourceProfiles, { upstreamHeads });
  await writeJson(path.join(config.dir, 'upstream-lock.json'), {
    vendor: config.vendor,
    updatedAt: new Date().toISOString(),
    sources: upstreamHeads,
  });
  await generateReadme();
  console.log(`OK: ${config.vendor} updated with ${result.profileCount} normalized profiles.`);
}

async function vendorIngest(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const from = options.from ?? 'incoming';
  if (from === 'upstream') {
    const { sourceProfiles, upstreamHeads } = await readUpstreamSourceProfiles(config, vendorKey);
    if (!sourceProfiles.length) {
      throw new Error(`No upstream profiles found for ${config.vendor}`);
    }
    const result = await normalizeAndWriteVendor(config, sourceProfiles, { upstreamHeads });
    await writeJson(path.join(config.dir, 'upstream-lock.json'), {
      vendor: config.vendor,
      updatedAt: new Date().toISOString(),
      sources: upstreamHeads,
    });
    await generateReadme();
    console.log(`OK: ${config.vendor} ingested from upstream with ${result.profileCount} normalized profiles.`);
    return;
  }
  const inputRoots = from === 'incoming' ? await incomingRootsFor(vendorKey) : [path.resolve(repoRoot, from)];
  const incomingProfiles = [];
  for (const inputRoot of inputRoots) {
    incomingProfiles.push(
      ...(await readProfilesFromDirectory(inputRoot, {
        vendor: config.vendor,
        sourceId: from === 'incoming' ? 'incoming' : 'manual',
        sourceLabel: from === 'incoming'
          ? `Manual incoming files: ${path.relative(repoRoot, inputRoot).replaceAll(path.sep, '/')}`
          : `Manual path: ${from}`,
        sourceRepo: from === 'incoming' ? 'incoming' : from,
        sourcePriority: 200,
        allowedFormats: new Set(['json', 'bbsflmt', 'zip']),
      })),
    );
  }
  if (!incomingProfiles.length) {
    throw new Error(`No profiles found for ${config.vendor} from ${from}`);
  }

  const existingProfiles = await readProfilesFromDirectory(path.join(config.dir, 'profiles'), {
    vendor: config.vendor,
    sourceId: 'existing',
    sourceLabel: 'Existing normalized profiles',
    sourceRepo: 'vendors',
    sourcePriority: 10,
    allowedFormats: new Set(['json']),
  });

  const result = await normalizeAndWriteVendor(config, [...existingProfiles, ...incomingProfiles], {
    upstreamHeads: await readJsonIfExists(path.join(config.dir, 'upstream-lock.json')).then(
      (lock) => lock?.sources ?? {},
    ),
  });
  await generateReadme();
  console.log(`OK: ${config.vendor} ingested with ${result.profileCount} normalized profiles.`);
}

async function normalizeAndWriteVendor(config, rawProfiles, { upstreamHeads }) {
  const reports = {
    errors: [],
    warnings: [],
    conflicts: [],
    classifications: [],
    normalizedNames: [],
    rejected: [],
  };
  const candidates = [];
  const filamentIdLocks = await readFilamentIdLocks();

  for (const raw of rawProfiles) {
    const normalized = normalizeRawProfile(config, raw, reports, { filamentIdLocks });
    candidates.push(...normalized);
  }

  const selected = selectCandidates(candidates, reports);
  const profileItems = [...selected.values()].sort((a, b) =>
    a.outputName.localeCompare(b.outputName, 'en'),
  );

  applyFamilyFilamentIds(profileItems, { filamentIdLocks, reports });

  await writeVendorReports(config, reports, {
    rawCount: rawProfiles.length,
    candidates,
    selected: profileItems,
    upstreamHeads,
  });

  if (reports.errors.length) {
    const error = new Error(
      `${config.vendor} normalization failed with ${reports.errors.length} error(s). See ${path.relative(repoRoot, path.join(config.dir, 'reports'))}.`,
    );
    error.details = reports.errors.map((item) => `- ${item}`).join('\n');
    throw error;
  }

  await writeVendorFilamentIdLocks(config, profileItems);

  const profilesDir = path.join(config.dir, 'profiles');
  await fs.rm(profilesDir, { recursive: true, force: true });
  for (const item of profileItems) {
    await writeJson(item.outputPath, item.profile);
  }

  return { profileCount: profileItems.length };
}

function normalizeRawProfile(config, raw, reports, options = {}) {
  const sourceText = normalizeText(
    [
      raw.profile.name,
      raw.profile.filament_settings_id?.[0],
      raw.relativePath,
      raw.innerPath,
    ].join(' '),
  );
  const sourceFamilyName = raw.sourceFamilyName || sourceFamilyNameFromParts(
    config.vendor,
    raw.profile.name,
    arrayFirst(raw.profile.filament_settings_id),
    raw.innerPath,
  );
  const families = sourceFamilyName
    ? [familyNameFromSourceFamily(config.vendor, sourceFamilyName)]
    : materialFamiliesFor(sourceText, config.vendor);
  const printerNozzles = printerNozzlesFor(raw, sourceText, config);

  if (!families.length) {
    reports.errors.push(`Unclassified material: ${raw.sourceId}:${raw.relativePath}:${raw.innerPath ?? ''}`);
  }
  if (!printerNozzles.length) {
    reports.errors.push(`Unknown printer/nozzle: ${raw.sourceId}:${raw.relativePath}:${raw.innerPath ?? ''}`);
  }

  reports.classifications.push({
    sourceId: raw.sourceId,
    sourcePath: raw.relativePath,
    innerPath: raw.innerPath ?? '',
    sourceName: raw.profile.name ?? '',
    inherits: raw.profile.inherits ?? '',
    sourceFamilyName,
    sourceFamilySource: raw.sourceFamilySource ?? '',
    families,
    printerNozzles,
  });

  const out = [];
  for (const familyName of families) {
    const materialType = materialTypeForFamily(familyName, config.vendor, arrayFirst(raw.profile.filament_type), {
      preferSourceFilamentType: raw.sourceFamilySource === 'path',
    });
    if (sourceText.includes('PETG') && startsWithMaterial(familyName, config.vendor, 'PET ')) {
      reports.errors.push(`PETG source classified as PET: ${raw.relativePath} -> ${familyName}`);
    }
    if (sourceText.includes('PET') && !sourceText.includes('PETG') && startsWithMaterial(familyName, config.vendor, 'PETG ')) {
      reports.errors.push(`PET source classified as PETG: ${raw.relativePath} -> ${familyName}`);
    }

    for (const printerNozzle of printerNozzles) {
      const compatiblePrinter = `${printerNozzle.printer} ${printerNozzle.nozzle} nozzle`;
      const outputName = `${familyName} @${compatiblePrinter}`;
      const familyKey = familyKeyFor(familyName, config.vendor);
      const printerKey = printerKeyFor(printerNozzle.printer);
      const outputRelativePath = path.join(
        'profiles',
        familyKey,
        printerKey,
        `nozzle-${printerNozzle.nozzle}.json`,
      );
      const outputPath = path.join(config.dir, outputRelativePath);
      const profile = finalizeProfile(raw.profile, {
        vendor: config.vendor,
        familyName,
        materialType,
        outputName,
        compatiblePrinter,
        sourceFormat: raw.format,
        reports,
        raw,
        filamentIdLocks: options.filamentIdLocks,
      });

      const item = {
        key: `${config.vendor}:${familyKey}:${printerKey}:${printerNozzle.nozzle}`,
        vendor: config.vendor,
        familyName,
        familyKey,
        materialType,
        printer: printerNozzle.printer,
        printerKey,
        nozzle: printerNozzle.nozzle,
        compatiblePrinter,
        outputName,
        outputPath,
        outputRelativePath,
        priority: raw.sourcePriority,
        pathPrinterMatch: sourcePathMatchesPrinter(raw, printerKey),
        sourceKeyCount: Object.keys(raw.profile ?? {}).length,
        source: sourceSummary(raw),
        sourceFilamentId: raw.profile.filament_id ?? '',
        profile,
        profileHash: stableHash(profile),
      };

      reports.normalizedNames.push({
        sourceId: raw.sourceId,
        sourcePath: raw.relativePath,
        innerPath: raw.innerPath ?? '',
        sourceName: raw.profile.name ?? '',
        sourceFamilyName: raw.sourceFamilyName ?? '',
        sourceFamilySource: raw.sourceFamilySource ?? '',
        outputName,
        outputRelativePath,
      });
      out.push(item);
    }
  }
  return out;
}

function selectCandidates(candidates, reports) {
  const selected = new Map();
  for (const candidate of candidates.sort(compareCandidatePrecedence)) {
    const previous = selected.get(candidate.key);
    if (!previous) {
      selected.set(candidate.key, candidate);
      continue;
    }

    if (previous.profileHash === candidate.profileHash) {
      reports.conflicts.push(
        `Duplicate identical profile kept once: ${candidate.outputName} from ${previous.source.sourceId} and ${candidate.source.sourceId}`,
      );
      reports.rejected.push({ ...candidate, rejectedReason: 'duplicate-identical' });
      continue;
    }

    if (previous.priority === candidate.priority) {
      if (previous.pathPrinterMatch !== candidate.pathPrinterMatch) {
        const kept = previous.pathPrinterMatch ? previous : candidate;
        const rejected = previous.pathPrinterMatch ? candidate : previous;
        selected.set(candidate.key, kept);
        reports.conflicts.push(
          `Preferred path-matched duplicate ${kept.source.sourceId}:${kept.source.path} over ${rejected.source.sourceId}:${rejected.source.path} for ${kept.outputName}`,
        );
        reports.rejected.push({ ...rejected, rejectedReason: 'same-priority-path-mismatch' });
        continue;
      }
      if (previous.sourceKeyCount !== candidate.sourceKeyCount) {
        const kept = previous.sourceKeyCount > candidate.sourceKeyCount ? previous : candidate;
        const rejected = previous.sourceKeyCount > candidate.sourceKeyCount ? candidate : previous;
        selected.set(candidate.key, kept);
        reports.conflicts.push(
          `Preferred more specific duplicate ${kept.source.sourceId}:${kept.source.path} over ${rejected.source.sourceId}:${rejected.source.path} for ${kept.outputName}`,
        );
        reports.rejected.push({ ...rejected, rejectedReason: 'same-priority-more-specific' });
        continue;
      }
      reports.errors.push(
        `Same-priority conflict for ${candidate.outputName}: ${previous.source.sourceId}:${previous.source.path} vs ${candidate.source.sourceId}:${candidate.source.path}`,
      );
      reports.rejected.push({ ...candidate, rejectedReason: 'same-priority-conflict' });
      continue;
    }

    reports.conflicts.push(
      `Preferred ${previous.source.sourceId} over ${candidate.source.sourceId} for ${candidate.outputName}`,
    );
    reports.rejected.push({ ...candidate, rejectedReason: 'lower-priority' });
  }
  return selected;
}

function compareCandidatePrecedence(a, b) {
  if (b.priority !== a.priority) return b.priority - a.priority;
  if (b.pathPrinterMatch !== a.pathPrinterMatch) return Number(b.pathPrinterMatch) - Number(a.pathPrinterMatch);
  if (b.sourceKeyCount !== a.sourceKeyCount) return b.sourceKeyCount - a.sourceKeyCount;
  const byName = a.outputName.localeCompare(b.outputName, 'en');
  if (byName) return byName;
  return `${a.source.sourceId}:${a.source.path}`.localeCompare(`${b.source.sourceId}:${b.source.path}`, 'en');
}

function applyFamilyFilamentIds(profileItems, { filamentIdLocks, reports }) {
  const byFamily = new Map();
  for (const item of profileItems) {
    const key = `${item.vendor}:${item.familyName}`;
    if (!byFamily.has(key)) byFamily.set(key, []);
    byFamily.get(key).push(item);
  }

  for (const [key, items] of byFamily) {
    const [vendor, familyName] = key.split(':');
    const decision = resolveFilamentId({
      vendor,
      familyName,
      sourceFilamentIds: items.map((item) => item.sourceFilamentId),
      filamentIdLocks,
    });
    const sourceIds = unique(items.map((item) => item.sourceFilamentId).filter(Boolean));
    const compatibleSourceIds = sourceIds.filter(isCompatibleFilamentIdFormat);
    const incompatibleSourceIds = sourceIds.filter((id) => !isCompatibleFilamentIdFormat(id));

    if (compatibleSourceIds.length > 1 && decision.reason !== 'lock') {
      reports.warnings.push(
        `${key}: mixed source filament_id values (${compatibleSourceIds.join(', ')}) were normalized to ${decision.filament_id}`,
      );
    }
    if (incompatibleSourceIds.length) {
      reports.warnings.push(
        `${key}: ignored incompatible source filament_id values (${incompatibleSourceIds.join(', ')}) and normalized to ${decision.filament_id}`,
      );
    }

    for (const item of items) {
      item.profile.filament_id = decision.filament_id;
      item.profile = sortObject(item.profile);
      item.profileHash = stableHash(item.profile);
      item.filamentIdDecision = decision;
    }
  }
}

function resolveFilamentId({ vendor, familyName, sourceFilamentId = '', sourceFilamentIds = [], filamentIdLocks }) {
  const lock = filamentIdLocks?.get(`${vendor}:${familyName}`);
  if (lock?.filament_id && isCompatibleFilamentIdFormat(lock.filament_id)) {
    return { filament_id: lock.filament_id, reason: 'lock', lock_source: lock.source ?? '' };
  }

  const sourceIds = unique([sourceFilamentId, ...sourceFilamentIds].filter(isCompatibleFilamentIdFormat));
  if (sourceIds.length === 1) {
    return { filament_id: sourceIds[0], reason: 'source-preserved' };
  }
  if (sourceIds.length > 1) {
    const fallback = filamentIdForFamily(vendor, familyName);
    const chosen = chooseMixedSourceFilamentId(sourceFilamentIds, fallback);
    return { filament_id: chosen, reason: 'source-mixed-normalized' };
  }

  return { filament_id: filamentIdForFamily(vendor, familyName), reason: 'bambu-studio-md5' };
}

function chooseMixedSourceFilamentId(sourceFilamentIds, fallback) {
  const counts = new Map();
  for (const id of sourceFilamentIds.filter(isCompatibleFilamentIdFormat)) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    if (a[0] === fallback) return -1;
    if (b[0] === fallback) return 1;
    return a[0].localeCompare(b[0], 'en');
  });
  return ranked[0]?.[0] ?? fallback;
}

function finalizeProfile(inputProfile, options) {
  const profile = { ...inputProfile };
  profile.name = options.outputName;
  profile.filament_settings_id = [options.outputName];
  profile.filament_vendor = [options.vendor];
  profile.filament_type = [options.materialType];
  profile.filament_id = resolveFilamentId({
    vendor: options.vendor,
    familyName: options.familyName,
    sourceFilamentId: profile.filament_id,
    filamentIdLocks: options.filamentIdLocks,
  }).filament_id;
  profile.compatible_printers = [options.compatiblePrinter];
  profile.compatible_printers_condition = '';
  profile.from = 'User';
  profile.version = profile.version ?? options.raw.bundle?.version ?? options.raw.bundleVersion ?? '2.0.0.0';

  if (options.sourceFormat === 'bbsflmt' || !profile.inherits) {
    profile.inherits = '';
  } else {
    options.reports.warnings.push(
      `Kept unresolved inherits from legacy JSON: ${options.raw.relativePath} -> ${profile.inherits}`,
    );
  }

  delete profile.instantiation;
  delete profile.is_custom_defined;
  delete profile.setting_id;
  delete profile.type;
  return sortObject(profile);
}

async function readProfilesFromDirectory(root, sourceMeta) {
  return (await readDirectoryInputs(root, sourceMeta)).profiles;
}

async function readDirectoryInputs(root, sourceMeta, options = {}) {
  const files = await walkFiles(root).catch(() => []);
  const profiles = [];
  const artifactCandidates = [];
  const filteredOut = [];
  for (const filePath of files) {
    const format = formatForPath(filePath);
    const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
    const filterReason = sourcePathFilterReason(relativePath, sourceMeta);
    if (filterReason) {
      const filtered = await filteredOutProfileLikeFile(filePath, root, sourceMeta, format, filterReason);
      if (filtered) filteredOut.push(filtered);
      continue;
    }
    if (format === 'json') {
      if (!sourceMeta.allowedFormats.has(format)) {
        if (options.includeArtifactCandidates) {
          artifactCandidates.push(...(await probeArtifactCandidates(filePath, root, sourceMeta, format)));
        }
        continue;
      }
      const bytes = await fs.readFile(filePath);
      const profile = JSON.parse(bytes.toString('utf8'));
      if (!isFilamentProfile(profile)) continue;
      const sourceFamilyName = sourceFamilyNameFromPath(relativePath, sourceMeta);
      profiles.push({
        ...sourceMeta,
        format,
        filePath,
        relativePath,
        sourceFamilyName,
        sourceFamilySource: sourceFamilyName ? 'path' : '',
        sourceFileHash: hash(bytes),
        profileHash: stableHash(profile),
        profile,
      });
    } else if (format === 'bbsflmt' || format === 'zip') {
      if (!sourceMeta.allowedFormats.has(format)) {
        if (options.includeArtifactCandidates) {
          artifactCandidates.push(...(await probeArtifactCandidates(filePath, root, sourceMeta, format)));
        }
        continue;
      }
      profiles.push(...(await readBundleProfiles(filePath, root, sourceMeta, format)));
    } else if (options.includeArtifactCandidates && profileCandidateFormats.has(format)) {
      artifactCandidates.push(...(await probeArtifactCandidates(filePath, root, sourceMeta, format)));
    }
  }
  filteredOut.sort((a, b) =>
    `${a.sourceId}:${a.relativePath}:${a.reason}`.localeCompare(`${b.sourceId}:${b.relativePath}:${b.reason}`, 'en'),
  );
  return { profiles, artifactCandidates, filteredOut };
}

async function filteredOutProfileLikeFile(filePath, root, sourceMeta, format, reason) {
  if (!profileCandidateFormats.has(format)) return null;
  const bytes = await fs.readFile(filePath).catch(() => null);
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
  const base = {
    ...sourceMeta,
    format,
    relativePath,
    reason,
    include: sourceMeta.pathInclude ?? [],
    exclude: sourceMeta.pathExclude ?? [],
    sourceFileHash: bytes ? hash(bytes) : '',
    profileName: '',
    profileHash: '',
  };

  if (format !== 'json') return base;
  if (!bytes) return null;
  try {
    const profile = JSON.parse(bytes.toString('utf8'));
    if (!isFilamentProfile(profile)) return null;
    return {
      ...base,
      profileName: profile.name ?? '',
      profileHash: stableHash(profile),
    };
  } catch {
    return null;
  }
}

function formatForPath(filePath) {
  const suffix = path.extname(filePath).toLowerCase();
  return suffix === '.bbsflmt' ? 'bbsflmt' : suffix.slice(1);
}

async function readBundleProfiles(filePath, root, sourceMeta, format) {
  const bytes = new Uint8Array(await fs.readFile(filePath));
  const sourceFileHash = hash(Buffer.from(bytes));
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
  const sourceFamilyName = sourceFamilyNameFromPath(relativePath, sourceMeta);
  const parsed = parseBundleProfiles(bytes);
  const out = [];

  for (const item of parsed.profiles) {
    out.push({
      ...sourceMeta,
      format,
      filePath,
      relativePath,
      innerPath: item.innerPath,
      sourceFamilyName,
      sourceFamilySource: sourceFamilyName ? 'path' : '',
      bundle: item.bundle,
      bundleHash: item.bundleHash,
      sourceFileHash,
      profileHash: item.profileHash,
      profile: item.profile,
    });
  }

  if (!parsed.bundle && !parsed.profiles.length) {
    out.push({
      ...sourceMeta,
      format,
      filePath,
      relativePath,
      innerPath: '',
      sourceFamilyName,
      sourceFamilySource: sourceFamilyName ? 'path' : '',
      bundle: null,
      bundleHash: null,
      sourceFileHash,
      profileHash: stableHash({ name: `INVALID BUNDLE ${relativePath}` }),
      profile: { name: `INVALID BUNDLE ${relativePath}` },
      bundleError: 'missing bundle_structure.json',
    });
  }
  return out;
}

async function probeArtifactCandidates(filePath, root, sourceMeta, format) {
  const bytes = new Uint8Array(await fs.readFile(filePath));
  const sourceFileHash = hash(Buffer.from(bytes));
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
  const base = {
    ...sourceMeta,
    format,
    filePath,
    relativePath,
    sourceFileHash,
  };

  try {
    if (format === 'json') {
      const profile = JSON.parse(Buffer.from(bytes).toString('utf8'));
      return [artifactCandidateFromProfile(base, {
        candidateType: 'raw-json',
        innerPath: '',
        profile,
        notes: ['format is not allowed by this source'],
      })];
    }
    if (format === 'bbsflmt') {
      return bundleArtifactCandidates(base, bytes, {
        candidateType: 'direct-bbsflmt-bundle',
        innerPrefix: '',
        notes: ['format is not allowed by this source'],
      });
    }
    if (format === 'zip') {
      return zipArtifactCandidates(base, bytes);
    }
  } catch (error) {
    return [artifactCandidateWithoutProfile(base, {
      candidateType: `unreadable-${format}`,
      innerPath: '',
      notes: [`format is not allowed by this source`, error.message],
    })];
  }
  return [];
}

function zipArtifactCandidates(base, bytes) {
  const entries = unzipSync(bytes);
  const names = Object.keys(entries).sort((a, b) => a.localeCompare(b, 'en'));
  const out = [];
  const notes = ['format is not allowed by this source'];
  const hasDirectBundle = Boolean(entries['bundle_structure.json']);

  if (hasDirectBundle) {
    out.push(...bundleArtifactCandidates(base, bytes, {
      candidateType: 'direct-bundle-zip',
      innerPrefix: '',
      notes,
    }));
  }

  for (const name of names) {
    if (name === 'bundle_structure.json') continue;
    const lower = name.toLowerCase();
    if (lower.endsWith('.bbsflmt')) {
      out.push(...bundleArtifactCandidates(base, entries[name], {
        candidateType: 'nested-bbsflmt-in-zip',
        innerPrefix: name,
        notes,
      }));
      continue;
    }
    if (!hasDirectBundle && lower.endsWith('.json')) {
      try {
        const profile = JSON.parse(strFromU8(entries[name]));
        out.push(artifactCandidateFromProfile(base, {
          candidateType: 'raw-json-in-zip',
          innerPath: name,
          profile,
          notes,
        }));
      } catch (error) {
        out.push(artifactCandidateWithoutProfile(base, {
          candidateType: 'unreadable-json-in-zip',
          innerPath: name,
          notes: [...notes, error.message],
        }));
      }
    }
  }

  if (!out.length) {
    out.push(artifactCandidateWithoutProfile(base, {
      candidateType: 'unknown-zip',
      innerPath: '',
      notes: [...notes, 'zip does not contain direct bundle JSON, raw JSON, or a nested .bbsflmt at probe depth 2'],
    }));
  }
  return out;
}

function bundleArtifactCandidates(base, bytes, options) {
  try {
    const parsed = parseBundleProfiles(bytes);
    if (!parsed.profiles.length) {
      return [artifactCandidateWithoutProfile(base, {
        candidateType: options.candidateType,
        innerPath: options.innerPrefix ?? '',
        notes: [...options.notes, parsed.bundle ? 'bundle has no profile JSON entries' : 'missing bundle_structure.json'],
      })];
    }
    return parsed.profiles.map((item) =>
      artifactCandidateFromProfile(base, {
        candidateType: options.candidateType,
        innerPath: options.innerPrefix ? `${options.innerPrefix}::${item.innerPath}` : item.innerPath,
        profile: item.profile,
        bundle: item.bundle,
        bundleHash: item.bundleHash,
        notes: options.notes,
      }),
    );
  } catch (error) {
    return [artifactCandidateWithoutProfile(base, {
      candidateType: options.candidateType,
      innerPath: options.innerPrefix ?? '',
      notes: [...options.notes, error.message],
    })];
  }
}

function parseBundleProfiles(bytes) {
  const entries = unzipSync(bytes);
  const names = Object.keys(entries).sort((a, b) => a.localeCompare(b, 'en'));
  const bundleBytes = entries['bundle_structure.json'];
  const bundle = bundleBytes ? JSON.parse(strFromU8(bundleBytes)) : null;
  const bundleHash = bundle ? stableHash(bundle) : null;
  const profiles = [];
  for (const name of names) {
    if (!name.toLowerCase().endsWith('.json')) continue;
    if (name === 'bundle_structure.json') continue;
    const profile = JSON.parse(strFromU8(entries[name]));
    if (!isFilamentProfile(profile)) continue;
    profiles.push({
      innerPath: name,
      bundle,
      bundleHash,
      profile,
      profileHash: stableHash(profile),
    });
  }
  return { bundle, bundleHash, profiles };
}

function isFilamentProfile(profile) {
  return Boolean(profile?.filament_settings_id);
}

function artifactCandidateFromProfile(base, options) {
  const profile = options.profile;
  return {
    ...base,
    candidateType: options.candidateType,
    innerPath: options.innerPath ?? '',
    bundle: options.bundle ?? null,
    bundleHash: options.bundleHash ?? null,
    profile,
    profileHash: stableHash(profile),
    profileName: profile.name ?? '',
    filamentSettingsId: arrayFirst(profile.filament_settings_id) ?? '',
    filamentVendor: Array.isArray(profile.filament_vendor) ? profile.filament_vendor : [],
    filamentType: arrayFirst(profile.filament_type) ?? '',
    compatiblePrinters: Array.isArray(profile.compatible_printers) ? profile.compatible_printers : [],
    inherits: profile.inherits ?? '',
    keyCount: Object.keys(profile).length,
    notes: options.notes ?? [],
  };
}

function artifactCandidateWithoutProfile(base, options) {
  return {
    ...base,
    candidateType: options.candidateType,
    innerPath: options.innerPath ?? '',
    bundle: null,
    bundleHash: null,
    profile: null,
    profileHash: null,
    profileName: '',
    filamentSettingsId: '',
    filamentVendor: [],
    filamentType: '',
    compatiblePrinters: [],
    inherits: '',
    keyCount: 0,
    notes: options.notes ?? [],
  };
}

function collectionRootFor(vendorKey) {
  return path.join(workRoot, 'extracted', vendorKey);
}

function collectionManifestPath(vendorKey) {
  return path.join(collectionRootFor(vendorKey), 'manifest.json');
}

function collectionReportsRoot(vendorKey) {
  return path.join(collectionRootFor(vendorKey), 'reports');
}

async function readCollectionManifest(vendorKey) {
  const manifestPath = collectionManifestPath(vendorKey);
  const manifest = await readJsonIfExists(manifestPath);
  if (!manifest) {
    throw new Error(
      `No collection manifest found for ${vendorKey}. Run vendor:collect before vendor:diff or vendor:propose.`,
    );
  }
  return manifest;
}

async function appendCollectedInputs(manifest, rawProfiles, collectionRoot) {
  const writtenBundles = new Set();
  for (const raw of rawProfiles) {
    const profileHash = raw.profileHash ?? stableHash(raw.profile);
    const observedPrinters = unique(printerNamesFromText(normalizeText([
      raw.profile.name,
      arrayFirst(raw.profile.filament_settings_id),
      raw.relativePath,
      raw.innerPath,
      raw.profile.inherits,
      Array.isArray(raw.profile.compatible_printers) ? raw.profile.compatible_printers.join(' ') : '',
    ].join(' '))));
    const sourceKey = `${raw.sourceId}:${raw.relativePath}:${raw.innerPath ?? ''}`;
    const extractedRelativePath = path
      .join(
        'profiles',
        slug(raw.sourceId),
        hash(sourceKey).slice(0, 12),
        `${safeFileName(raw.profile.name ?? raw.innerPath ?? raw.relativePath) || `profile-${profileHash.slice(0, 8)}`}.json`,
      )
      .replaceAll(path.sep, '/');
    await writeJson(path.join(collectionRoot, extractedRelativePath), raw.profile);

    if (raw.bundle) {
      const bundleKey = `${raw.sourceId}:${raw.relativePath}`;
      if (!writtenBundles.has(bundleKey)) {
        writtenBundles.add(bundleKey);
        const bundleRelativePath = path
          .join('bundles', slug(raw.sourceId), `${hash(bundleKey).slice(0, 12)}-bundle_structure.json`)
          .replaceAll(path.sep, '/');
        await writeJson(path.join(collectionRoot, bundleRelativePath), raw.bundle);
      }
    }

    if (raw.bundleError) {
      manifest.bundleErrors.push({
        sourceId: raw.sourceId,
        relativePath: raw.relativePath,
        error: raw.bundleError,
      });
    }

    manifest.inputs.push({
      identity: inputIdentity(raw),
      sourceId: raw.sourceId,
      sourceLabel: raw.sourceLabel,
      sourceRepo: raw.sourceRepo,
      sourceCommit: raw.sourceCommit ?? '',
      sourcePriority: raw.sourcePriority,
      format: raw.format,
      relativePath: raw.relativePath,
      innerPath: raw.innerPath ?? '',
      sourceFileHash: raw.sourceFileHash ?? '',
      profileHash,
      bundleHash: raw.bundleHash ?? null,
      settingsHash: profileSettingsHash(raw.profile),
      extractedPath: extractedRelativePath,
      profileName: raw.profile.name ?? '',
      sourceFamilyName: raw.sourceFamilyName ?? '',
      sourceFamilySource: raw.sourceFamilySource ?? '',
      filamentSettingsId: arrayFirst(raw.profile.filament_settings_id) ?? '',
      filamentVendor: Array.isArray(raw.profile.filament_vendor) ? raw.profile.filament_vendor : [],
      filamentType: arrayFirst(raw.profile.filament_type) ?? '',
      compatiblePrinters: Array.isArray(raw.profile.compatible_printers)
        ? raw.profile.compatible_printers
        : [],
      observedPrinters,
      inherits: raw.profile.inherits ?? '',
      keyCount: Object.keys(raw.profile).length,
    });
  }
  manifest.inputs.sort((a, b) =>
    `${a.sourceId}:${a.relativePath}:${a.innerPath}`.localeCompare(
      `${b.sourceId}:${b.relativePath}:${b.innerPath}`,
      'en',
    ),
  );
}

async function appendArtifactCandidates(manifest, rawCandidates, collectionRoot) {
  for (const raw of rawCandidates) {
    const profileHash = raw.profileHash ?? null;
    const candidateHash = hash(
      `${raw.sourceId}:${raw.relativePath}:${raw.innerPath ?? ''}:${raw.candidateType}:${raw.sourceFileHash}:${profileHash ?? ''}`,
    ).slice(0, 12);
    let extractedPath = '';
    let promoteFromPath = '';

    if (raw.profile) {
      const candidateDir = path
        .join('candidate-profiles', slug(raw.sourceId), candidateHash)
        .replaceAll(path.sep, '/');
      const candidateFileName = `${
        safeFileName(raw.profile.name ?? raw.innerPath ?? raw.relativePath) || `candidate-${candidateHash}`
      }.json`;
      extractedPath = path.join(candidateDir, candidateFileName).replaceAll(path.sep, '/');
      await writeJson(path.join(collectionRoot, extractedPath), raw.profile);
      promoteFromPath = path.relative(repoRoot, path.join(collectionRoot, candidateDir)).replaceAll(path.sep, '/');
    }

    const candidate = {
      identity: artifactCandidateIdentity(raw),
      sourceId: raw.sourceId,
      sourceLabel: raw.sourceLabel,
      sourceRepo: raw.sourceRepo,
      sourceCommit: raw.sourceCommit ?? '',
      sourcePriority: raw.sourcePriority,
      format: raw.format,
      candidateType: raw.candidateType,
      relativePath: raw.relativePath,
      innerPath: raw.innerPath ?? '',
      sourceFileHash: raw.sourceFileHash ?? '',
      profileHash,
      bundleHash: raw.bundleHash ?? null,
      reviewHash: artifactCandidateReviewHash(raw),
      extractedPath,
      promoteFromPath,
      profileName: raw.profileName ?? '',
      sourceFamilyName: raw.sourceFamilyName ?? '',
      sourceFamilySource: raw.sourceFamilySource ?? '',
      filamentSettingsId: raw.filamentSettingsId ?? '',
      filamentVendor: raw.filamentVendor ?? [],
      filamentType: raw.filamentType ?? '',
      compatiblePrinters: raw.compatiblePrinters ?? [],
      inherits: raw.inherits ?? '',
      keyCount: raw.keyCount ?? 0,
      notes: raw.notes ?? [],
    };
    manifest.artifactCandidates.push(candidate);
  }

  manifest.artifactCandidates.sort((a, b) =>
    `${a.sourceId}:${a.relativePath}:${a.innerPath}:${a.candidateType}`.localeCompare(
      `${b.sourceId}:${b.relativePath}:${b.innerPath}:${b.candidateType}`,
      'en',
    ),
  );
}

function appendFilteredOut(manifest, rawItems = []) {
  manifest.filteredOut.push(...rawItems.map((raw) => ({
    sourceId: raw.sourceId,
    sourceLabel: raw.sourceLabel,
    sourceRepo: raw.sourceRepo,
    sourceCommit: raw.sourceCommit ?? '',
    sourcePriority: raw.sourcePriority,
    format: raw.format,
    relativePath: raw.relativePath,
    sourceFileHash: raw.sourceFileHash ?? '',
    profileHash: raw.profileHash ?? '',
    profileName: raw.profileName ?? '',
    reason: raw.reason,
    include: raw.include ?? [],
    exclude: raw.exclude ?? [],
  })));
  manifest.filteredOut.sort((a, b) =>
    `${a.sourceId}:${a.relativePath}:${a.reason}`.localeCompare(`${b.sourceId}:${b.relativePath}:${b.reason}`, 'en'),
  );
}

async function incomingRootsFor(vendorKey) {
  const root = path.join(repoRoot, 'incoming');
  if (!(await exists(root))) return [];
  const roots = [root];
  const vendorRoot = path.join(root, vendorKey);
  if (await exists(vendorRoot)) roots.push(vendorRoot);
  return roots;
}

function inputIdentity(item) {
  return `${item.sourceId}:${item.relativePath}:${item.innerPath ?? ''}`;
}

function inputSettingsHash(item) {
  return item.settingsHash ?? null;
}

function groupInputsByHash(inputs, getHash) {
  const groups = new Map();
  for (const input of inputs) {
    const key = getHash(input);
    if (!key) continue;
    const items = groups.get(key) ?? [];
    items.push(input);
    groups.set(key, items);
  }
  return groups;
}

function matchPreviousInputByHash(index, hashValue, currentInput, matchedPreviousInputs) {
  if (!hashValue) return null;
  const candidates = (index.get(hashValue) ?? []).filter((item) =>
    !matchedPreviousInputs.has(inputIdentity(item)),
  );
  if (!candidates.length) return null;
  const sameName = candidates.filter((item) => item.profileName === currentInput.profileName);
  if (sameName.length === 1) return sameName[0];
  return candidates.length === 1 ? candidates[0] : null;
}

function artifactCandidateIdentity(item) {
  return item.identity ?? `${item.sourceId}:${item.relativePath}:${item.innerPath ?? ''}:${item.candidateType ?? ''}`;
}

function artifactCandidateReviewHash(item) {
  return item.reviewHash ?? stableHash({
    bundleHash: item.bundleHash ?? null,
    candidateType: item.candidateType ?? '',
    innerPath: item.innerPath ?? '',
    profileHash: item.profileHash ?? null,
    sourceFileHash: item.sourceFileHash ?? '',
  });
}

async function writeCollectionReport(manifest) {
  const reportsDir = collectionReportsRoot(manifest.vendorKey);
  await fs.mkdir(reportsDir, { recursive: true });
  const lines = [
    '# Input Collection',
    '',
    `Vendor: ${manifest.vendor}`,
    `Inputs: ${manifest.inputs.length}`,
    `Artifact candidates: ${(manifest.artifactCandidates ?? []).length}`,
    `Filtered out: ${(manifest.filteredOut ?? []).length}`,
    `Bundle errors: ${manifest.bundleErrors.length}`,
    '',
    '| Source | Format | Path | Inner path | Profile name | Hash | Extracted JSON |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const input of manifest.inputs) {
    lines.push(
      `| ${md(input.sourceId)} | ${md(input.format)} | ${md(input.relativePath)} | ${md(input.innerPath)} | ${md(input.profileName)} | ${input.profileHash.slice(0, 12)} | ${md(input.extractedPath)} |`,
    );
  }
  lines.push('');
  if (manifest.bundleErrors.length) {
    lines.push('## Bundle Errors', '');
    for (const error of manifest.bundleErrors) {
      lines.push(`- ${error.sourceId}:${error.relativePath}: ${error.error}`);
    }
    lines.push('');
  }
  await fs.writeFile(path.join(reportsDir, 'input-manifest.md'), lines.join('\n'), 'utf8');
  await writeJson(path.join(reportsDir, 'artifact-candidates.json'), manifest.artifactCandidates ?? []);
  await fs.writeFile(
    path.join(reportsDir, 'artifact-candidates.md'),
    artifactCandidatesMarkdown(manifest.artifactCandidates ?? []),
    'utf8',
  );
  await writeJson(path.join(reportsDir, 'filtered-out.json'), manifest.filteredOut ?? []);
  await fs.writeFile(
    path.join(reportsDir, 'filtered-out.md'),
    filteredOutMarkdown(manifest.filteredOut ?? []),
    'utf8',
  );
}

function artifactCandidatesMarkdown(candidates) {
  const lines = [
    '# Artifact Candidates',
    '',
    'These files matched a profile-like extension but were not allowed by the source `formats`. AI should review them before promoting any extracted JSON.',
    '',
  ];
  if (!candidates.length) {
    lines.push('No artifact candidates found.', '');
    return lines.join('\n');
  }
  lines.push(
    '| Source | Type | Format | Path | Inner path | Profile | Hash | Promote path | Notes |',
    '|---|---|---|---|---|---|---|---|---|',
  );
  for (const candidate of candidates) {
    lines.push(
      `| ${md(candidate.sourceId)} | ${md(candidate.candidateType)} | ${md(candidate.format)} | ${md(candidate.relativePath)} | ${md(candidate.innerPath)} | ${md(candidate.profileName)} | ${md(String(candidate.profileHash ?? candidate.sourceFileHash ?? '').slice(0, 12))} | ${md(candidate.promoteFromPath)} | ${md((candidate.notes ?? []).join('<br>'))} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function filteredOutMarkdown(items) {
  const lines = [
    '# Filtered Out',
    '',
    'These profile-like files matched a source path `include` / `exclude` filter and were not collected as inputs or artifact candidates.',
    '',
  ];
  if (!items.length) {
    lines.push('No profile-like files were filtered out.', '');
    return lines.join('\n');
  }
  lines.push(
    '| Source | Format | Path | Profile | Hash | Reason | Include | Exclude |',
    '|---|---|---|---|---|---|---|---|',
  );
  for (const item of items) {
    lines.push(
      `| ${md(item.sourceId)} | ${md(item.format)} | ${md(item.relativePath)} | ${md(item.profileName)} | ${md(String(item.profileHash ?? item.sourceFileHash ?? '').slice(0, 12))} | ${md(item.reason)} | ${md((item.include ?? []).join('<br>'))} | ${md((item.exclude ?? []).join('<br>'))} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function diffMarkdown(result) {
  const counts = countBy(result.inputs, 'status');
  const candidateCounts = countBy(result.artifactCandidates ?? [], 'status');
  const lines = [
    '# Input Diff',
    '',
    `Vendor: ${result.vendor}`,
    `Inputs: ${result.inputs.length}`,
    `Added: ${counts.added ?? 0}`,
    `Changed: ${counts.changed ?? 0}`,
    `Metadata-only changed: ${counts['metadata-only-changed'] ?? 0}`,
    `Unchanged: ${counts.unchanged ?? 0}`,
    `Moved unchanged: ${counts['moved-unchanged'] ?? 0}`,
    `Moved metadata-only: ${counts['moved-metadata-only'] ?? 0}`,
    `Removed: ${counts.removed ?? 0}`,
    `Untracked: ${counts.untracked ?? 0}`,
    `Artifact candidates: ${(result.artifactCandidates ?? []).length}`,
    `Artifact candidates added: ${candidateCounts.added ?? 0}`,
    `Artifact candidates changed: ${candidateCounts.changed ?? 0}`,
    `Artifact candidates unchanged: ${candidateCounts.unchanged ?? 0}`,
    `Artifact candidates removed: ${candidateCounts.removed ?? 0}`,
    `Artifact candidates untracked: ${candidateCounts.untracked ?? 0}`,
    '',
    '## Sources',
    '',
    '| Source | Status | Locked commit | Current commit |',
    '|---|---|---|---|',
  ];
  for (const source of result.sources) {
    lines.push(
      `| ${md(source.id)} | ${source.status} | ${md(source.lockedCommit ?? '')} | ${md(source.currentCommit ?? '')} |`,
    );
  }
  lines.push('', '## Inputs', '', '| Status | Source | Path | Inner path | Profile name | Previous path |', '|---|---|---|---|---|---|');
  for (const input of result.inputs) {
    const previousPath = input.previousRelativePath
      ? `${input.previousRelativePath}${input.previousInnerPath ? ` :: ${input.previousInnerPath}` : ''}`
      : '';
    lines.push(
      `| ${input.status} | ${md(input.sourceId)} | ${md(input.relativePath)} | ${md(input.innerPath)} | ${md(input.profileName)} | ${md(previousPath)} |`,
    );
  }
  lines.push('');
  lines.push(
    '## Artifact Candidates',
    '',
    '| Status | Source | Type | Path | Inner path | Profile name | Promote path |',
    '|---|---|---|---|---|---|---|',
  );
  for (const candidate of result.artifactCandidates ?? []) {
    lines.push(
      `| ${candidate.status} | ${md(candidate.sourceId)} | ${md(candidate.candidateType)} | ${md(candidate.relativePath)} | ${md(candidate.innerPath)} | ${md(candidate.profileName)} | ${md(candidate.promoteFromPath)} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function proposalMarkdown(result) {
  const lines = [
    '# Normalization Proposal Inputs',
    '',
    `Vendor: ${result.vendor}`,
    `Changed inputs considered: ${result.changedInputCount}`,
    `Artifact candidates considered: ${result.changedArtifactCandidateCount ?? 0}`,
    `Decision requests: ${result.decisionRequestCount}`,
    '',
    '| Source | Profile | Suggested family | Printers | Issues |',
    '|---|---|---|---|---|',
  ];
  for (const proposal of result.proposals) {
    lines.push(
      `| ${md(`${proposal.sourceId}:${proposal.relativePath}:${proposal.innerPath}`)} | ${md(proposal.profileName)} | ${md(proposal.suggestedFamily)} | ${md(proposal.observedPrinters.map((item) => `${item.printer} ${item.nozzle}`).join('<br>'))} | ${md(proposal.issues.join('<br>'))} |`,
    );
  }
  lines.push(
    '',
    '## Artifact Candidates',
    '',
    '| Source | Type | Profile | Suggested family | Printers | Promote path | Issues |',
    '|---|---|---|---|---|---|---|',
  );
  for (const proposal of result.artifactProposals ?? []) {
    lines.push(
      `| ${md(`${proposal.sourceId}:${proposal.relativePath}:${proposal.innerPath}`)} | ${md(proposal.candidateType)} | ${md(proposal.profileName)} | ${md(proposal.suggestedFamily)} | ${md(proposal.observedPrinters.map((item) => `${item.printer} ${item.nozzle}`).join('<br>'))} | ${md(proposal.promoteFromPath)} | ${md(proposal.issues.join('<br>'))} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function decisionRequestsMarkdown(result) {
  const lines = ['# Decision Requests', ''];
  if (!result.decisions.length) {
    lines.push('No new decisions are required for the changed inputs.', '');
    return lines.join('\n');
  }
  lines.push(
    'AI should review these items and ask the user before writing normalized JSON for any decision that is not already covered by an approved prior judgment.',
    '',
    '| Kind | Issue | Source | Profile | Suggested family | Promote path |',
    '|---|---|---|---|---|---|',
  );
  for (const decision of result.decisions) {
    lines.push(
      `| ${md(decision.kind ?? 'input')} | ${md(decision.issue)} | ${md(`${decision.sourceId}:${decision.relativePath}:${decision.innerPath}`)} | ${md(decision.profileName)} | ${md(decision.suggestedFamily)} | ${md(decision.promoteFromPath ?? '')} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function materialObservationFor(text) {
  const base = [];
  if (text.includes('PETG')) base.push('PETG');
  if (hasToken(text, 'PET') || text.includes('PET-') || text.includes('PET ')) base.push('PET');
  for (const token of ['PLA', 'ABS', 'ASA', 'PAHT', 'PA12', 'PA6', 'PA', 'PC', 'PEBA', 'PP', 'TPE', 'TPU']) {
    if (hasToken(text, token) || text.includes(`${token}-`)) base.push(token);
  }
  const modifiers = ['CF', 'GF', 'HF', 'HS', 'ECO', 'BASIC', 'MATTE', 'SILK', 'MARBLE', 'METALLIC', 'GALAXY', 'SPARKLY', 'RAPID', 'WOOD', '95A']
    .filter((token) => hasToken(text, token) || text.includes(token));
  if (text.includes('+')) modifiers.push('PLUS');
  if (/\b2\.0\b/.test(text)) modifiers.push('2.0');
  return {
    base: unique(base),
    modifiers: unique(modifiers),
    hasPetg: text.includes('PETG'),
    hasPet: hasToken(text, 'PET') || text.includes('PET-') || text.includes('PET '),
    hasCf: hasToken(text, 'CF'),
    hasGf: hasToken(text, 'GF'),
  };
}

function familySuggestionFor(vendor, material) {
  if (!material.base.length) return '';
  const primary = material.base[0];
  const suffix = [];
  if (material.modifiers.includes('CF')) suffix.push('CF');
  if (material.modifiers.includes('GF')) suffix.push('GF');
  if (material.modifiers.includes('PLUS')) suffix.push('+');
  if (material.modifiers.includes('2.0')) suffix.push('2.0');
  for (const token of ['HS', 'ECO', 'BASIC', 'MATTE', 'SILK', 'MARBLE', 'METALLIC', 'GALAXY', 'SPARKLY', 'RAPID', 'WOOD', '95A']) {
    if (material.modifiers.includes(token)) suffix.push(titleMaterialModifier(vendor, token));
  }
  return `${vendor} ${[primary, ...suffix].join(' ')}`.trim();
}

function proposalIssuesFor(input, material, printers, familySuggestion, knownFamilies, options = {}) {
  const issues = [];
  if (!input.filamentVendor.length) {
    issues.push('missing filament_vendor; AI should set the visible vendor after review');
  }
  if (input.inherits) {
    issues.push('inherits is present; AI should expand against Bambu Studio system presets before committing');
  }
  if (!material.base.length && !options.trustedSourceFamily) {
    issues.push('material family is unclear');
  }
  if (material.hasPet && material.hasPetg) {
    issues.push('PET and PETG both appear; AI must keep them separate');
  }
  if (material.hasPet && material.hasCf && material.hasGf && !material.hasPetg) {
    issues.push('PET CF GF appears; propose split/handling and confirm with user');
  }
  if (!printers.length && !input.compatiblePrinters.length) {
    issues.push('printer/nozzle is unclear');
  }
  if (familySuggestion && !knownFamilies.has(familySuggestion) && !options.trustedSourceFamily) {
    issues.push('suggested family is new to the repository');
  }
  return unique(issues);
}

function artifactCandidateIssuesFor(candidate, material, printers, familySuggestion, knownFamilies, options = {}) {
  const issues = ['unsupported artifact candidate requires AI review before promotion'];
  if (!candidate.profileHash) {
    issues.push('candidate does not contain a readable profile');
  }
  if (candidate.profileHash && !candidate.promoteFromPath) {
    issues.push('candidate profile has no promoteFromPath');
  }
  if (!material.base.length && candidate.profileHash && !options.trustedSourceFamily) {
    issues.push('material family is unclear');
  }
  if (material.hasPet && material.hasPetg) {
    issues.push('PET and PETG both appear; AI must keep them separate');
  }
  if (material.hasPet && material.hasCf && material.hasGf && !material.hasPetg) {
    issues.push('PET CF GF appears; propose split/handling and confirm with user');
  }
  if (!printers.length && !(candidate.compatiblePrinters ?? []).length && candidate.profileHash) {
    issues.push('printer/nozzle is unclear');
  }
  if (familySuggestion && !knownFamilies.has(familySuggestion) && !options.trustedSourceFamily) {
    issues.push('suggested family is new to the repository');
  }
  return unique(issues);
}

function titleMaterialModifier(vendor, token) {
  const map = {
    BASIC: slug(vendor) === 'sunlu' ? 'BASIC' : 'Basic',
    ECO: 'ECO',
    HS: 'HS',
    MATTE: 'Matte',
    SILK: 'Silk',
    MARBLE: 'Marble',
    METALLIC: 'Metallic',
    GALAXY: 'Galaxy',
    SPARKLY: 'Sparkly',
    RAPID: 'Rapid',
    WOOD: 'Wood',
    '95A': '95A',
  };
  return map[token] ?? token;
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) counts[item[key]] = (counts[item[key]] ?? 0) + 1;
  return counts;
}

async function loadPresetMap(root) {
  const presets = new Map();
  const files = (await walkFiles(root).catch(() => [])).filter((file) => file.toLowerCase().endsWith('.json'));
  for (const filePath of files) {
    try {
      const profile = JSON.parse(await fs.readFile(filePath, 'utf8'));
      if (profile.name) presets.set(profile.name, { filePath, profile });
    } catch {
      // Ignore unrelated or invalid system files; verification catches committed JSON separately.
    }
  }
  return presets;
}

function expandPresetForFile(profile, filePath, allPresets, cache, stack, unresolved) {
  const cacheKey = `${filePath}:${profile.name ?? ''}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  if (stack.includes(cacheKey)) {
    throw new Error(`Cyclic inherits chain: ${[...stack, cacheKey].join(' -> ')}`);
  }

  let expandedParent = {};
  const parentName = profile.inherits ?? '';
  if (parentName) {
    const parent = allPresets.get(parentName);
    if (!parent) {
      unresolved.push({ filePath, parentName });
    } else {
      expandedParent = expandPresetForFile(parent.profile, parent.filePath, allPresets, cache, [...stack, cacheKey], unresolved);
    }
  }
  const expanded = sortDeep({ ...expandedParent, ...profile });
  cache.set(cacheKey, expanded);
  return expanded;
}

function materialFamiliesFor(text, vendor) {
  const prefix = `${vendor} `;
  if (text.includes('PETG')) {
    if (hasToken(text, 'HS') && text.includes('MATTE')) return [`${prefix}PETG HS Matte`];
    if (text.includes('BASIC')) return [`${prefix}PETG ${titleMaterialModifier(vendor, 'BASIC')}`];
    if (text.includes('ECO')) return [`${prefix}PETG ECO`];
    if (text.includes('MARBLE')) return [`${prefix}PETG Marble`];
    if (text.includes('METALLIC')) return [`${prefix}PETG Metallic`];
    if (text.includes('MATTE')) return [`${prefix}PETG Matte`];
    if (text.includes('GALAXY')) return [`${prefix}Galaxy PETG`];
    if (text.includes('SPARK')) return [`${prefix}Sparkly PETG`];
    if (hasToken(text, 'HS')) return [`${prefix}PETG HS`];
    if (hasToken(text, 'GF')) return [`${prefix}PETG GF`];
    if (hasToken(text, 'CF')) return [`${prefix}PETG CF`];
    return [`${prefix}PETG`];
  }
  if (text.includes('PET')) {
    const hasCf = hasToken(text, 'CF');
    const hasGf = hasToken(text, 'GF');
    if (hasCf && hasGf) return [`${prefix}PET CF`, `${prefix}PET GF`];
    if (hasGf) return [`${prefix}PET GF`];
    if (hasCf) return [`${prefix}PET CF`];
    return [`${prefix}PET`];
  }
  if (text.includes('PLA')) {
    if (hasToken(text, 'CF')) return [`${prefix}PLA CF`];
    if (text.includes('+') && /\b2\.0\b/.test(text)) return [`${prefix}PLA + 2.0`];
    if (text.includes('+') && text.includes('SILK')) return [`${prefix}PLA + Silk`];
    if (text.includes('+')) return [`${prefix}PLA +`];
    if (text.includes('MATTE')) return [`${prefix}PLA Matte`];
    if (text.includes('SILK')) return [`${prefix}PLA Silk`];
    if (text.includes('MARBLE')) return [`${prefix}PLA Marble`];
    if (text.includes('WOOD')) return [`${prefix}PLA Wood`];
    if (text.includes('GALAXY')) return [`${prefix}Galaxy PLA`];
    if (text.includes('RAPID')) return [`${prefix}PLA Rapid`];
    return [`${prefix}PLA`];
  }
  if (text.includes('ABS')) {
    if (hasToken(text, 'CF') || hasToken(text, 'GF')) return [`${prefix}ABS CF/GF`];
    return [`${prefix}ABS Pro`];
  }
  if (text.includes('ASA')) {
    if (hasToken(text, 'CF')) return [`${prefix}ASA CF`];
    if (text.includes('BASIC')) return [`${prefix}ASA ${titleMaterialModifier(vendor, 'BASIC')}`];
    return [`${prefix}ASA`];
  }
  if (text.includes('PAHT')) return [`${prefix}PAHT CF`];
  if (text.includes('PA-CF') || text.includes('PA CF')) return [`${prefix}PA CF`];
  if (text.includes('PC')) {
    if (hasToken(text, 'GF')) return [`${prefix}PC GF`];
    return [`${prefix}PC`];
  }
  if (text.includes('PP')) {
    if (hasToken(text, 'CF')) return [`${prefix}PP CF`];
    return [`${prefix}PP`];
  }
  if (text.includes('TPU')) {
    if (hasToken(text, 'GF')) return [`${prefix}TPU GF`];
    if (text.includes('95A') || text.includes('95 A')) return [`${prefix}TPU 95A`];
    return [`${prefix}TPU`];
  }
  return [];
}

function sourceFamilyNameFromParts(vendor, ...values) {
  for (const value of values) {
    const familyName = sourceFamilyNameFromText(vendor, value);
    if (familyName) return familyName;
  }
  return '';
}

function sourceFamilyNameFromText(vendor, value) {
  const fileName = String(value ?? '').split(/[\\/]/).pop().replace(/\.json$/i, '');
  const match = fileName.match(new RegExp(`${escapeRegex(vendor)}\\s+(.+?)\\s+Filament$`, 'i'));
  if (!match) return '';
  return normalizeSourceFamilyName(match[1]);
}

function familyNameFromSourceFamily(vendor, sourceFamilyName) {
  const familyName = String(sourceFamilyName ?? '').trim();
  if (!familyName) return '';
  if (familyName.toLowerCase() === String(vendor).toLowerCase()) return familyName;
  if (familyName.toLowerCase().startsWith(`${String(vendor).toLowerCase()} `)) return familyName;
  return `${vendor} ${familyName}`;
}

function normalizeSourceFamilyName(familyName) {
  const upperTokens = new Set([
    'ABS',
    'ASA',
    'CF',
    'ESD',
    'FR',
    'GF',
    'HS',
    'HT',
    'LW',
    'PA',
    'PA6',
    'PA12',
    'PAHT',
    'PC',
    'PEBA',
    'PET',
    'PETG',
    'PLA',
    'PP',
    'ST',
    'TPE',
    'TPU',
    'UV',
  ]);
  return familyName
    .normalize('NFKC')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/([+\-\s]+)/)
    .map((part) => {
      if (!part || part === '-' || part === '+') return part;
      if (/^\s+$/.test(part)) return ' ';
      const upper = part.toUpperCase();
      if (upperTokens.has(upper) || /^[0-9]+[A-Z]$/.test(upper)) return upper;
      return `${part.slice(0, 1).toUpperCase()}${part.slice(1).toLowerCase()}`;
    })
    .join('');
}

function materialTypeForFamily(familyName, vendor, sourceFilamentType = '', options = {}) {
  const fallback = String(sourceFilamentType ?? '').trim();
  if (options.preferSourceFilamentType && fallback) return fallback;
  const material = familyName.replace(new RegExp(`^${escapeRegex(vendor)}\\s+`, 'i'), '').toUpperCase();
  if (material.startsWith('PETG CF')) return 'PETG-CF';
  if (material.startsWith('PETG-CF')) return 'PETG-CF';
  if (material.startsWith('PETG GF')) return 'PETG-GF';
  if (material.startsWith('PETG-GF')) return 'PETG-GF';
  if (material.startsWith('PETG')) return 'PETG';
  if (material.startsWith('GALAXY PETG')) return 'PETG';
  if (material.startsWith('SPARKLY PETG')) return 'PETG';
  if (material.startsWith('PET CF')) return 'PET-CF';
  if (material.startsWith('PET-CF')) return 'PET-CF';
  if (material.startsWith('PET GF')) return 'PET-GF';
  if (material.startsWith('PET-GF')) return 'PET-GF';
  if (material.startsWith('PET')) return 'PET';
  if (material.startsWith('PLA CF')) return 'PLA-CF';
  if (material.startsWith('PLA-CF')) return 'PLA-CF';
  if (material.startsWith('PLA')) return 'PLA';
  if (material.startsWith('GALAXY PLA')) return 'PLA';
  if (material.startsWith('MARBLE PLA')) return 'PLA';
  if (material.startsWith('UV ROCK PLA')) return 'PLA';
  if (material.startsWith('ABS CF') || material.startsWith('ABS-CF')) return 'ABS-GF';
  if (material.startsWith('ABS')) return 'ABS';
  if (material.startsWith('ASA CF')) return 'ASA-CF';
  if (material.startsWith('ASA-CF')) return 'ASA-CF';
  if (material.startsWith('ASA')) return 'ASA';
  if (material.startsWith('PAHT')) return 'PAHT-CF';
  if (material.startsWith('PA12') && material.includes('CF')) return 'PA-CF';
  if (material.startsWith('PA6') && material.includes('CF')) return 'PA-CF';
  if (material.startsWith('PA CF') || material.startsWith('PA-CF')) return 'PA-CF';
  if (material.startsWith('PA')) return 'PA';
  if (material.startsWith('PC GF')) return 'PC-GF';
  if (material.startsWith('PC-GF')) return 'PC-GF';
  if (material.startsWith('PC')) return 'PC';
  if (material.startsWith('PEBA')) return 'TPU';
  if (material.startsWith('PP CF')) return 'PP-CF';
  if (material.startsWith('PP-CF')) return 'PP-CF';
  if (material.startsWith('TPE')) return 'TPU';
  if (material.startsWith('TPU GF')) return 'TPU-GF';
  if (material.startsWith('TPU-GF')) return 'TPU-GF';
  if (material.startsWith('TPU')) return 'TPU';
  if (fallback) return fallback;
  return material.split(/\s+/)[0];
}

function printerNozzlesFor(raw, sourceText, config) {
  const fromCompatible = Array.isArray(raw.profile.compatible_printers)
    ? raw.profile.compatible_printers.flatMap((item) =>
        printerNamesFromText(normalizeText(item)).map((printer) => ({
          printer,
          nozzle: nozzleFor(normalizeText(`${item} ${raw.relativePath} ${raw.innerPath ?? ''}`), config),
        })),
      )
    : [];
  if (fromCompatible.length) return uniquePrinterNozzles(fromCompatible);

  let printers = printerNamesFromText(sourceText);
  let nozzle = nozzleFor(sourceText, config);
  if (!printers.length && raw.profile.inherits) {
    const inheritedText = normalizeText(raw.profile.inherits);
    printers = printerNamesFromText(inheritedText);
    nozzle = nozzleFor(inheritedText, config);
  }
  return uniquePrinterNozzles(printers.map((printer) => ({ printer, nozzle })));
}

function printerNamesFromText(text) {
  const out = [];
  let remaining = ` ${text} `;
  const add = (pattern, name) => {
    if (pattern.test(remaining)) out.push(name);
    remaining = remaining.replace(pattern, ' ');
  };

  add(/A1\s*MINI|A1MINI|A1M/g, 'Bambu Lab A1 mini');
  add(/X1\s*CARBON|X1C/g, 'Bambu Lab X1 Carbon');
  add(/X1E/g, 'Bambu Lab X1E');
  add(/(?<![A-Z0-9])X1(?![A-Z0-9])/g, 'Bambu Lab X1');
  add(/X2D/g, 'Bambu Lab X2D');
  add(/P1P/g, 'Bambu Lab P1P');
  add(/P1S/g, 'Bambu Lab P1S');
  add(/P2S/g, 'Bambu Lab P2S');
  add(/(?<![A-Z0-9])A1(?![A-Z0-9])/g, 'Bambu Lab A1');
  add(/H2C/g, 'Bambu Lab H2C');
  add(/H2D/g, 'Bambu Lab H2D');
  add(/H2S/g, 'Bambu Lab H2S');
  return unique(out);
}

function nozzleFor(text, config) {
  if (/0\.2/.test(text)) return '0.2';
  if (/0\.6/.test(text)) return '0.6';
  if (/0\.8/.test(text)) return '0.8';
  if (/0\.4/.test(text)) return '0.4';
  return String(config.normalization?.defaults?.nozzle ?? '0.4');
}

async function buildBbsflmt() {
  const profiles = await readAllNormalizedProfiles();
  const filamentIdLocks = await readFilamentIdLocks();
  const errors = validateProfiles(profiles, { filamentIdLocks, requireFilamentIdLocks: true });
  errors.push(...(await validateLockedArtifactCandidates(profiles)));
  if (errors.length) {
    throw new Error(`Cannot build bundles because profile validation failed:\n${errors.map((e) => `- ${e}`).join('\n')}`);
  }

  await fs.rm(distRoot, { recursive: true, force: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    bundleType: 'filament config bundle',
    bundleGrouping: 'vendor-printer-material',
    vendors: [],
  };

  const sortedGroups = bundleGroupsForProfiles(profiles);
  for (const group of sortedGroups) {
    const { vendor, familyName, printerNozzle, items } = group;
    const vendorKey = slug(vendor);
    const bundleProfiles = items.sort((a, b) => a.profile.name.localeCompare(b.profile.name, 'en'));
    const innerPaths = bundleProfiles.map((item) => `${vendor}/${item.profile.name}.json`);
    const bundleVersion = bundleProfiles[0]?.profile.version ?? '2.0.0.0';
    const bundle = {
      bundle_id: `${hash(`${vendor}:${printerNozzle.printer}:${familyName}`).slice(0, 10)}_${familyName}_${hash(innerPaths.join('|')).slice(0, 10)}`,
      bundle_type: 'filament config bundle',
      filament_name: familyName,
      filament_vendor: [
        {
          vendor,
          filament_path: innerPaths,
        },
      ],
      version: bundleVersion,
    };

    const zipEntries = {
      'bundle_structure.json': strToU8(`${JSON.stringify(bundle, null, 4)}\n`),
    };
    for (let index = 0; index < bundleProfiles.length; index += 1) {
      zipEntries[innerPaths[index]] = strToU8(`${JSON.stringify(bundleProfiles[index].profile, null, 4)}\n`);
      await writeJson(
        path.join(distRoot, 'json', vendorKey, bundleProfiles[index].relativePathFromVendor),
        bundleProfiles[index].profile,
      );
    }

    const bundleBytes = zipSync(zipEntries, { level: 9 });
    const outPath = path.join(
      distRoot,
      'bbsflmt',
      vendorKey,
      printerNozzle.printerKey,
      `${safeFileName(familyName)}.bbsflmt`,
    );
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, Buffer.from(bundleBytes));
    validateBundleBytes(bundleBytes, outPath, {
      filamentIdLocks,
      requireFilamentIdLocks: true,
      requireSinglePrinter: true,
    });

    let vendorManifest = manifest.vendors.find((item) => item.vendor === vendor);
    if (!vendorManifest) {
      vendorManifest = { vendor, bundles: [] };
      manifest.vendors.push(vendorManifest);
    }
    vendorManifest.bundles.push({
      material: familyName,
      type: bundleProfiles[0]?.profile.filament_type?.[0] ?? '',
      printer: printerNozzle.printer,
      printerKey: printerNozzle.printerKey,
      nozzles: unique(bundleProfiles.map((item) => printerNozzleForProfile(item.profile).nozzle).filter(Boolean)),
      compatiblePrinters: unique(bundleProfiles.map((item) => item.profile.compatible_printers?.[0] ?? '').filter(Boolean)),
      artifact: path.relative(distRoot, outPath).replaceAll(path.sep, '/'),
      profiles: bundleProfiles.map((item) => ({
        name: item.profile.name,
        printer: item.profile.compatible_printers?.[0] ?? '',
        source: item.relativePathFromRepo,
      })),
    });
  }

  await writeUserBaseProfiles(profiles);
  await writeJson(path.join(distRoot, 'manifest.json'), manifest);
  await writeReleaseNotes(manifest);
  await writeAggregateZip('all-bbsflmt.zip', path.join(distRoot, 'bbsflmt'));
  await writeAggregateZip('all-json.zip', path.join(distRoot, 'json'));
  await writeAggregateZip('all-user-base.zip', path.join(distRoot, 'user-base'));
  console.log(`OK: built ${manifest.vendors.reduce((sum, vendor) => sum + vendor.bundles.length, 0)} machine-scoped .bbsflmt bundles.`);
}

async function verifyAll() {
  const profiles = await readAllNormalizedProfiles();
  const filamentIdLocks = await readFilamentIdLocks();
  const errors = validateProfiles(profiles, { filamentIdLocks, requireFilamentIdLocks: true });
  errors.push(...(await validateLockedArtifactCandidates(profiles)));
  if (await exists(path.join(distRoot, 'bbsflmt'))) {
    const bundleFiles = (await walkFiles(path.join(distRoot, 'bbsflmt'))).filter((file) =>
      file.toLowerCase().endsWith('.bbsflmt'),
    );
    if (!bundleFiles.length) errors.push('dist/bbsflmt exists but contains no .bbsflmt files.');
    for (const bundleFile of bundleFiles) {
      try {
        validateBundleBytes(new Uint8Array(await fs.readFile(bundleFile)), bundleFile, {
          filamentIdLocks,
          requireFilamentIdLocks: true,
          requireSinglePrinter: true,
        });
      } catch (error) {
        errors.push(error.message);
      }
    }
  }
  errors.push(...(await validateUserBaseDist(profiles)));
  if (errors.length) {
    throw new Error(`Verification failed:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
  console.log(`OK: verified ${profiles.length} normalized profile JSON files.`);
}

function validateProfiles(profiles, options = {}) {
  const errors = [];
  const byName = new Map();
  const byFamilyId = new Map();
  errors.push(...validateFilamentIdLockCoverage(profiles, options.filamentIdLocks));
  for (const item of profiles) {
    const profile = item.profile;
    const label = item.relativePathFromRepo;
    if (!profile.name) errors.push(`${label}: missing name`);
    if (!Array.isArray(profile.filament_settings_id) || profile.filament_settings_id[0] !== profile.name) {
      errors.push(`${label}: name and filament_settings_id[0] differ`);
    }
    if (!profile.version) errors.push(`${label}: missing version`);
    if (!Array.isArray(profile.filament_vendor) || !profile.filament_vendor[0]) {
      errors.push(`${label}: missing filament_vendor`);
    }
    if (!Array.isArray(profile.filament_type) || !profile.filament_type[0]) {
      errors.push(`${label}: missing filament_type`);
    }
    if (!Array.isArray(profile.compatible_printers) || profile.compatible_printers.length !== 1) {
      errors.push(`${label}: compatible_printers must contain exactly one printer/nozzle`);
    }
    if (profile.inherits) {
      errors.push(`${label}: inherits must be expanded and then cleared`);
    }
    if (profile.name?.includes('PETG') && profile.filament_type?.[0]?.startsWith('PET-')) {
      errors.push(`${label}: PETG profile has PET filament_type`);
    }
    if (/(^| )PET( |$)/.test(profile.name ?? '') && !profile.name.includes('PETG') && profile.filament_type?.[0]?.startsWith('PETG')) {
      errors.push(`${label}: PET profile has PETG filament_type`);
    }
    if (/(^| )PET\s+(CF\s*GF|GF\s*CF|CF\/GF|GF\/CF)( |$)/i.test(profile.name ?? '')) {
      errors.push(`${label}: PET CF GF style family must be split or explicitly resolved before commit`);
    }
    const filamentIdError = validateFilamentId(profile, label, '', options);
    if (filamentIdError) errors.push(filamentIdError);
    const familyIdError = validateFamilyFilamentIdConsistency(byFamilyId, profile, label);
    if (familyIdError) errors.push(familyIdError);
    const pathPrinterError = validatePathPrinterConsistency(item);
    if (pathPrinterError) errors.push(pathPrinterError);
    const previous = byName.get(profile.name);
    if (previous && stableHash(previous.profile) !== stableHash(profile)) {
      errors.push(`${label}: duplicate profile name with different content: ${profile.name}`);
    }
    if (!previous) byName.set(profile.name, item);
  }
  return errors;
}

async function validateLockedArtifactCandidates(profiles) {
  const errors = [];
  const profilesByVendor = new Map();
  for (const item of profiles) {
    const vendorKey = slug(item.vendor);
    if (!profilesByVendor.has(vendorKey)) profilesByVendor.set(vendorKey, new Map());
    profilesByVendor.get(vendorKey).set(item.profile.name, item);
  }

  for (const vendorDir of await listDirs(vendorsRoot)) {
    const lockPath = path.join(vendorDir, 'input-lock.json');
    const lock = await readJsonIfExists(lockPath);
    if (!lock) continue;
    const vendorKey = slug(lock.vendor ?? path.basename(vendorDir));
    const vendorProfiles = profilesByVendor.get(vendorKey) ?? new Map();
    for (const candidate of lock.reviewedArtifactCandidates ?? []) {
      if (!candidate.profileName) continue;
      if (!vendorProfiles.has(candidate.profileName)) {
        const label = path.relative(repoRoot, lockPath).replaceAll(path.sep, '/');
        errors.push(
          `${label}: reviewed artifact candidate is missing from normalized profiles: ${candidate.profileName} (${candidate.identity ?? 'unknown identity'})`,
        );
      }
    }
  }
  return errors;
}

function validatePathPrinterConsistency(item) {
  const parts = item.relativePathFromVendor.split('/');
  if (parts.length < 4 || parts[0] !== 'profiles') return '';
  const pathPrinterKey = parts[2];
  const nozzleFile = parts[3];
  const compatible = item.profile.compatible_printers?.[0] ?? '';
  const printerName = compatible.replace(/\s+\d+(?:\.\d+)?\s+nozzle$/i, '').trim();
  const compatiblePrinterKey = printerKeyFor(printerName);
  if (compatiblePrinterKey && pathPrinterKey !== compatiblePrinterKey) {
    return `${item.relativePathFromRepo}: path printer ${pathPrinterKey} does not match compatible_printers ${compatible}`;
  }
  const nozzleMatch = nozzleFile.match(/^nozzle-(\d+(?:\.\d+)?)\.json$/i);
  if (nozzleMatch && !compatible.includes(`${nozzleMatch[1]} nozzle`)) {
    return `${item.relativePathFromRepo}: path nozzle ${nozzleMatch[1]} does not match compatible_printers ${compatible}`;
  }
  return '';
}

function validateFilamentId(profile, label, vendorOverride = '', options = {}) {
  if (!profile.filament_id) return `${label}: missing filament_id`;
  if (!isCompatibleFilamentIdFormat(profile.filament_id)) {
    return `${label}: filament_id ${profile.filament_id} is not a supported Bambu-compatible ID format`;
  }
  const vendor = profile.filament_vendor?.[0] ?? vendorOverride;
  const familyName = familyNameForProfile(profile);
  if (!vendor || !familyName) return '';
  const lockKey = `${vendor}:${familyName}`;
  const expected = options.filamentIdLocks?.get(lockKey)?.filament_id ?? '';
  if (!expected) {
    return options.requireFilamentIdLocks ? `${label}: missing filament_id lock for ${vendor} family ${familyName}` : '';
  }
  if (profile.filament_id !== expected) {
    return `${label}: filament_id ${profile.filament_id} does not match expected ${expected} for ${vendor} family ${familyName}`;
  }
  return '';
}

function validateFilamentIdLockCoverage(profiles, filamentIdLocks) {
  if (!filamentIdLocks) return [];
  const errors = [];
  const byFamily = new Map();
  for (const item of profiles) {
    const vendor = item.profile.filament_vendor?.[0] ?? item.vendor;
    const familyName = familyNameForProfile(item.profile);
    if (!vendor || !familyName) continue;
    const key = `${vendor}:${familyName}`;
    if (!byFamily.has(key)) byFamily.set(key, []);
    byFamily.get(key).push(item);
  }

  for (const [key, items] of byFamily) {
    const [vendor, familyName] = key.split(':');
    const lock = filamentIdLocks.get(key);
    if (!lock) {
      errors.push(`missing filament_id lock for ${vendor} family ${familyName}`);
      continue;
    }
    if (!isCompatibleFilamentIdFormat(lock.filament_id)) {
      errors.push(`${path.relative(repoRoot, lock.lockPath).replaceAll(path.sep, '/')}: ${key} has unsupported filament_id ${lock.filament_id}`);
    }
    if (Number.isInteger(lock.profile_count) && lock.profile_count !== items.length) {
      errors.push(
        `${path.relative(repoRoot, lock.lockPath).replaceAll(path.sep, '/')}: ${key} profile_count ${lock.profile_count} does not match ${items.length} committed profiles`,
      );
    }
    if (lock.strategy === 'bambu-studio-md5') {
      const expected = filamentIdForFamily(vendor, familyName);
      if (lock.filament_id !== expected) {
        errors.push(
          `${path.relative(repoRoot, lock.lockPath).replaceAll(path.sep, '/')}: ${key} Bambu Studio MD5 lock ${lock.filament_id} does not match expected ${expected}`,
        );
      }
    }
  }
  return errors;
}

function validateFamilyFilamentIdConsistency(byFamilyId, profile, label, vendorOverride = '') {
  const vendor = profile.filament_vendor?.[0] ?? vendorOverride;
  const familyName = familyNameForProfile(profile);
  if (!vendor || !familyName || !profile.filament_id) return '';
  const key = `${vendor}:${familyName}`;
  const previous = byFamilyId.get(key);
  if (previous && previous.id !== profile.filament_id) {
    return `${label}: filament_id ${profile.filament_id} differs from ${previous.id} used by ${previous.label} for ${vendor} family ${familyName}`;
  }
  if (!previous) byFamilyId.set(key, { id: profile.filament_id, label });
  return '';
}

function familyNameForProfile(profile) {
  return String(profile.name ?? '').split(' @')[0];
}

function bundleGroupsForProfiles(profiles) {
  const bundleGroups = new Map();
  for (const item of profiles) {
    const familyName = familyNameForProfile(item.profile);
    const printerNozzle = printerNozzleForProfile(item.profile);
    const key = [item.vendor, printerNozzle.printerKey, familyName].join('\u001f');
    if (!bundleGroups.has(key)) {
      bundleGroups.set(key, {
        vendor: item.vendor,
        familyName,
        printerNozzle,
        items: [],
      });
    }
    bundleGroups.get(key).items.push(item);
  }
  return [...bundleGroups.values()].sort(compareBundleGroups);
}

function printerNozzleForProfile(profile) {
  const compatiblePrinter = String(profile.compatible_printers?.[0] ?? '').trim();
  const parsed = parseCompatiblePrinter(compatiblePrinter);
  return {
    printer: parsed.printer,
    printerKey: printerKeyFor(parsed.printer),
    nozzle: parsed.nozzle,
  };
}

function parseCompatiblePrinter(compatiblePrinter) {
  const match = compatiblePrinter.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s+nozzle$/i);
  if (match) {
    return {
      printer: match[1].trim(),
      nozzle: match[2],
    };
  }
  return {
    printer: compatiblePrinter.trim(),
    nozzle: '',
  };
}

function compareBundleGroups(a, b) {
  return (
    a.vendor.localeCompare(b.vendor, 'en') ||
    a.printerNozzle.printerKey.localeCompare(b.printerNozzle.printerKey, 'en') ||
    a.familyName.localeCompare(b.familyName, 'en')
  );
}

function validateBundleBytes(bytes, label, options = {}) {
  const entries = unzipSync(bytes);
  const bundleBytes = entries['bundle_structure.json'];
  if (!bundleBytes) throw new Error(`${label}: missing bundle_structure.json`);
  const bundle = JSON.parse(strFromU8(bundleBytes));
  const paths = (bundle.filament_vendor ?? []).flatMap((item) =>
    (item.filament_path ?? []).map((bundlePath) => ({ bundlePath, vendor: item.vendor ?? '' })),
  );
  if (!paths.length) throw new Error(`${label}: bundle has no filament paths`);
  const names = new Set();
  const printerModels = new Set();
  const byFamilyId = new Map();
  for (const { bundlePath, vendor } of paths) {
    const entry = entries[bundlePath];
    if (!entry) throw new Error(`${label}: bundle path missing from zip: ${bundlePath}`);
    const profile = JSON.parse(strFromU8(entry));
    if (names.has(profile.name)) throw new Error(`${label}: duplicate profile name in bundle: ${profile.name}`);
    names.add(profile.name);
    if (!Array.isArray(profile.filament_settings_id) || profile.filament_settings_id[0] !== profile.name) {
      throw new Error(`${label}: profile name/id mismatch: ${bundlePath}`);
    }
    const filamentIdError = validateFilamentId(profile, `${label}: ${bundlePath}`, vendor, options);
    if (filamentIdError) throw new Error(filamentIdError);
    const familyIdError = validateFamilyFilamentIdConsistency(byFamilyId, profile, `${label}: ${bundlePath}`, vendor);
    if (familyIdError) throw new Error(familyIdError);
    if (options.requireSinglePrinter) {
      const compatiblePrinter = String(profile.compatible_printers?.[0] ?? '').trim();
      if (!compatiblePrinter) throw new Error(`${label}: missing compatible_printers[0] in bundle profile: ${bundlePath}`);
      printerModels.add(parseCompatiblePrinter(compatiblePrinter).printer);
    }
  }
  if (options.requireSinglePrinter && printerModels.size > 1) {
    throw new Error(`${label}: bundle contains multiple printer models: ${[...printerModels].join(', ')}`);
  }
}

async function writeUserBaseProfiles(profiles) {
  const baseDir = path.join(distRoot, 'user-base', 'filament', 'base');
  await fs.mkdir(baseDir, { recursive: true });
  for (const item of profiles.sort((a, b) => a.profile.name.localeCompare(b.profile.name, 'en'))) {
    const profileName = item.profile.name;
    const baseName = safeFileName(profileName);
    await writeJson(path.join(baseDir, `${baseName}.json`), item.profile);
    await fs.writeFile(path.join(baseDir, `${baseName}.info`), userBaseInfoForProfile(item.profile, item.vendor), 'utf8');
  }
}

async function validateUserBaseDist(profiles) {
  const baseDir = path.join(distRoot, 'user-base', 'filament', 'base');
  if (!(await exists(baseDir))) return [];
  const errors = [];
  const expectedFiles = new Set();
  for (const item of profiles) {
    const baseName = safeFileName(item.profile.name);
    const jsonPath = path.join(baseDir, `${baseName}.json`);
    const infoPath = path.join(baseDir, `${baseName}.info`);
    expectedFiles.add(path.relative(baseDir, jsonPath).replaceAll(path.sep, '/'));
    expectedFiles.add(path.relative(baseDir, infoPath).replaceAll(path.sep, '/'));
    if (!(await exists(jsonPath))) {
      errors.push(`dist/user-base: missing JSON for ${item.profile.name}`);
    } else {
      const generated = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
      if (stableHash(generated) !== stableHash(item.profile)) {
        errors.push(`dist/user-base: generated JSON differs from source profile: ${item.profile.name}`);
      }
    }
    if (!(await exists(infoPath))) {
      errors.push(`dist/user-base: missing .info for ${item.profile.name}`);
    } else {
      const expectedInfo = userBaseInfoForProfile(item.profile, item.vendor);
      const actualInfo = await fs.readFile(infoPath, 'utf8');
      if (actualInfo !== expectedInfo) {
        errors.push(`dist/user-base: .info differs from expected setting_id metadata: ${item.profile.name}`);
      }
    }
  }
  for (const file of await walkFiles(baseDir)) {
    const relative = path.relative(baseDir, file).replaceAll(path.sep, '/');
    if (!expectedFiles.has(relative)) errors.push(`dist/user-base: unexpected file ${relative}`);
  }
  return errors;
}

async function generateReadme(options = {}) {
  const profiles = await readAllNormalizedProfiles().catch(() => []);
  const lines = [];
  if (!profiles.length) {
    lines.push('No normalized profiles are committed yet. Use `vendor:collect`, `vendor:diff`, and `vendor:propose` to prepare an AI-reviewed update.');
  } else {
    const vendorSummaries = readmeVendorSummaries(bundleGroupsForProfiles(profiles));
    lines.push('| Vendor | Bundles | Materials | Printers | Profiles |');
    lines.push('|---|---:|---:|---:|---:|');
    for (const summary of vendorSummaries) {
      lines.push(`| ${md(summary.vendor)} | ${summary.bundles} | ${summary.materials} | ${summary.printers} | ${summary.profiles} |`);
    }

    for (const summary of vendorSummaries) {
      lines.push(
        '',
        '<details>',
        `<summary>${escapeHtml(summary.vendor)} details: ${summary.bundles} bundles, ${summary.materials} materials, ${summary.printers} printers, ${summary.profiles} profiles</summary>`,
        '',
      );
      for (const printerSummary of readmePrinterSummaries(summary.groups)) {
        lines.push(
          `### ${printerSummary.printer}`,
          '',
          '| Nozzles | Material | Type | Profiles | Release artifact |',
          '|---|---|---|---:|---|',
        );
        for (const group of printerSummary.groups) {
          lines.push(
            `| ${md(readmeNozzlesForBundle(group).join(', '))} | ${md(group.familyName)} | ${md(group.items[0].profile.filament_type?.[0] ?? '')} | ${group.items.length} | ${md(readmeArtifactForBundle(group))} |`,
          );
        }
        lines.push('');
      }
      lines.push('</details>');
    }
  }

  const readmePath = path.join(repoRoot, 'README.md');
  const current = await fs.readFile(readmePath, 'utf8');
  const start = '<!-- PROFILE_TABLE_START -->';
  const end = '<!-- PROFILE_TABLE_END -->';
  const replacement = `${start}\n\n${lines.join('\n')}\n\n${end}`;
  const next = current.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*${escapeRegex(end)}`), replacement);
  if (options.check) {
    if (next !== current) {
      throw new Error('README.md generated profile table is out of date. Run `npm run generate:readme`.');
    }
    console.log('OK: README generated profile table is up to date.');
    return;
  }
  await fs.writeFile(readmePath, next, 'utf8');
  console.log(`OK: updated README with ${profiles.length} profiles.`);
}

function readmeVendorSummaries(bundleGroups) {
  const byVendor = new Map();
  for (const group of bundleGroups) {
    if (!byVendor.has(group.vendor)) byVendor.set(group.vendor, []);
    byVendor.get(group.vendor).push(group);
  }
  return [...byVendor.entries()].map(([vendor, groups]) => ({
    vendor,
    groups,
    bundles: groups.length,
    materials: new Set(groups.map((group) => group.familyName)).size,
    printers: new Set(groups.map((group) => group.printerNozzle.printer)).size,
    profiles: groups.reduce((sum, group) => sum + group.items.length, 0),
  }));
}

function readmePrinterSummaries(bundleGroups) {
  const byPrinter = new Map();
  for (const group of bundleGroups) {
    const printer = group.printerNozzle.printer;
    if (!byPrinter.has(printer)) byPrinter.set(printer, []);
    byPrinter.get(printer).push(group);
  }
  return [...byPrinter.entries()].map(([printer, groups]) => ({
    printer,
    groups,
  }));
}

function readmeNozzlesForBundle(group) {
  return unique(group.items.map((item) => printerNozzleForProfile(item.profile).nozzle).filter(Boolean))
    .sort((a, b) => Number(a) - Number(b));
}

function readmeArtifactForBundle(group) {
  return [
    'dist/bbsflmt',
    slug(group.vendor),
    group.printerNozzle.printerKey,
    `${safeFileName(group.familyName)}.bbsflmt`,
  ].join('/');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function readAllNormalizedProfiles() {
  const profiles = [];
  for (const vendorDir of await listDirs(vendorsRoot)) {
    const vendor = path.basename(vendorDir).toUpperCase();
    const profilesDir = path.join(vendorDir, 'profiles');
    const files = (await walkFiles(profilesDir).catch(() => [])).filter((file) => file.toLowerCase().endsWith('.json'));
    for (const file of files) {
      const profile = JSON.parse(await fs.readFile(file, 'utf8'));
      profiles.push({
        vendor: profile.filament_vendor?.[0] ?? vendor,
        profile,
        filePath: file,
        relativePathFromVendor: path.relative(vendorDir, file).replaceAll(path.sep, '/'),
        relativePathFromRepo: path.relative(repoRoot, file).replaceAll(path.sep, '/'),
      });
    }
  }
  return profiles.sort((a, b) => a.profile.name.localeCompare(b.profile.name, 'en'));
}

async function readFilamentIdLocks() {
  const locks = new Map();
  for (const vendorDir of await listDirs(vendorsRoot)) {
    const lockPath = path.join(vendorDir, 'filament-id-lock.json');
    const lock = await readJsonIfExists(lockPath);
    if (!lock) continue;
    const vendor = lock.vendor ?? path.basename(vendorDir).toUpperCase();
    const families = Array.isArray(lock.families)
      ? lock.families
      : Object.entries(lock.families ?? {}).map(([family, filament_id]) => ({ family, filament_id }));
    for (const item of families) {
      if (!item.family || !item.filament_id) {
        throw new Error(`${path.relative(repoRoot, lockPath)}: filament ID lock entries require family and filament_id`);
      }
      const key = `${vendor}:${item.family}`;
      if (locks.has(key)) {
        throw new Error(`${path.relative(repoRoot, lockPath)}: duplicate filament ID lock for ${key}`);
      }
      locks.set(key, {
        vendor,
        family: item.family,
        filament_id: item.filament_id,
        source: item.source ?? '',
        strategy: item.strategy ?? '',
        profile_count: item.profile_count,
        lockPath,
      });
    }
  }
  return locks;
}

async function writeVendorFilamentIdLocks(config, profileItems) {
  const lockPath = path.join(config.dir, 'filament-id-lock.json');
  const existing = await readJsonIfExists(lockPath);
  const familyItems = Array.isArray(existing?.families)
    ? existing.families
    : Object.entries(existing?.families ?? {}).map(([family, filament_id]) => ({ family, filament_id }));
  const byFamily = new Map(familyItems.map((item) => [item.family, { ...item }]));
  const currentByFamily = new Map();

  for (const item of profileItems) {
    if (!currentByFamily.has(item.familyName)) currentByFamily.set(item.familyName, []);
    currentByFamily.get(item.familyName).push(item);
  }

  for (const [family, items] of currentByFamily) {
    const decision = items[0].filamentIdDecision ?? { reason: 'source-preserved' };
    const filamentId = items[0].profile.filament_id;
    const previous = byFamily.get(family) ?? {};
    byFamily.set(family, {
      ...previous,
      family,
      filament_id: filamentId,
      profile_count: items.length,
      strategy: decision.reason,
      source: filamentIdLockSource(decision),
    });
  }

  await writeJson(lockPath, {
    vendor: config.vendor,
    generatedAt: new Date().toISOString(),
    purpose: 'Lock stable Bambu-compatible filament_id values so future normalization and releases overwrite imported profiles instead of creating duplicates.',
    families: [...byFamily.values()].sort((a, b) => a.family.localeCompare(b.family, 'en')),
  });
}

function filamentIdLockSource(decision) {
  if (decision.reason === 'lock') return decision.lock_source || 'preserved from existing filament-id lock';
  if (decision.reason === 'source-preserved') return 'preserved from accepted source profiles';
  if (decision.reason === 'source-mixed-normalized') return 'normalized from mixed source filament_id values by deterministic family rule';
  if (decision.reason === 'bambu-studio-md5') return 'generated with Bambu Studio new-filament MD5 rule';
  return 'resolved by normalization workflow';
}

async function writeVendorReports(config, reports, summary) {
  const reportsDir = path.join(config.dir, 'reports');
  await fs.rm(reportsDir, { recursive: true, force: true });
  await fs.mkdir(reportsDir, { recursive: true });
  await writeJson(path.join(reportsDir, 'manifest.json'), {
    vendor: config.vendor,
    generatedAt: new Date().toISOString(),
    rawProfileCount: summary.rawCount,
    candidateCount: summary.candidates.length,
    selectedCount: summary.selected.length,
    rejectedCount: reports.rejected.length,
    upstreamHeads: summary.upstreamHeads,
    errors: reports.errors,
    warnings: reports.warnings,
    conflicts: reports.conflicts,
    outputs: summary.selected.map((item) => ({
      name: item.outputName,
      path: path.relative(config.dir, item.outputPath).replaceAll(path.sep, '/'),
      family: item.familyName,
      type: item.materialType,
      printer: item.compatiblePrinter,
      source: item.source,
    })),
  });
  await fs.writeFile(path.join(reportsDir, 'classification.md'), classificationMarkdown(reports.classifications), 'utf8');
  await fs.writeFile(path.join(reportsDir, 'filename-normalization.md'), filenamesMarkdown(reports.normalizedNames), 'utf8');
  await fs.writeFile(path.join(reportsDir, 'conflicts.md'), listMarkdown('Conflicts', reports.conflicts, 'No conflicts.'), 'utf8');
  await fs.writeFile(path.join(reportsDir, 'warnings.md'), listMarkdown('Warnings', reports.warnings, 'No warnings.'), 'utf8');
}

function classificationMarkdown(items) {
  const lines = [
    '# Classification Report',
    '',
    '| Source | Inner path | Source name | Families | Printers | Inherits |',
    '|---|---|---|---|---|---|',
  ];
  for (const item of items.sort((a, b) => `${a.sourceId}:${a.sourcePath}`.localeCompare(`${b.sourceId}:${b.sourcePath}`, 'en'))) {
    lines.push(
      `| ${md(`${item.sourceId}:${item.sourcePath}`)} | ${md(item.innerPath)} | ${md(item.sourceName)} | ${md(item.families.join('<br>'))} | ${md(item.printerNozzles.map((p) => `${p.printer} ${p.nozzle}`).join('<br>'))} | ${md(item.inherits)} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function vendorStateClassificationMarkdown(report) {
  const byFamily = new Map();
  for (const item of report.outputs) {
    if (!byFamily.has(item.family)) byFamily.set(item.family, []);
    byFamily.get(item.family).push(item);
  }
  const lines = [
    '# Committed Profile Classification',
    '',
    'This report describes the normalized JSON currently committed under `vendors/<vendor>/profiles/`. Input diff and proposal reports are generated under `.work/extracted/<vendor>/reports/` during AI review.',
    '',
    '| Material | Type | Profiles | Printers |',
    '|---|---|---:|---|',
  ];
  for (const [family, items] of [...byFamily.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
    const printers = items.map((item) => item.printer).sort((a, b) => a.localeCompare(b, 'en'));
    lines.push(`| ${md(family)} | ${md(items[0].type)} | ${items.length} | ${md(printers.join('<br>'))} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function filenamesMarkdown(items) {
  const lines = [
    '# Filename Normalization Report',
    '',
    '| Source | Inner path | Source name | Normalized name | Output path |',
    '|---|---|---|---|---|',
  ];
  for (const item of items.sort((a, b) => a.outputName.localeCompare(b.outputName, 'en'))) {
    lines.push(
      `| ${md(`${item.sourceId}:${item.sourcePath}`)} | ${md(item.innerPath)} | ${md(item.sourceName)} | ${md(item.outputName)} | ${md(item.outputRelativePath)} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

function vendorStateFilenamesMarkdown(report) {
  const lines = [
    '# Committed Profile Paths',
    '',
    'Source filenames are not normalized in place. Committed JSON paths are normalized after AI/user review.',
    '',
    '| Profile name | Path | Key count |',
    '|---|---|---:|',
  ];
  for (const item of report.outputs.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    lines.push(`| ${md(item.name)} | ${md(item.path)} | ${item.keyCount} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function listMarkdown(title, items, emptyText) {
  const lines = [`# ${title}`, ''];
  if (!items.length) lines.push(emptyText);
  for (const item of items) lines.push(`- ${item}`);
  lines.push('');
  return lines.join('\n');
}

async function writeReleaseNotes(manifest) {
  const totals = releaseTotals(manifest);
  const breakdown = releaseBreakdown(manifest);
  const lines = [
    '# Release Artifacts',
    '',
    `Expected Bambu Studio import count: ${totals.profiles} configs`,
    `Machine material bundles generated: ${totals.bundles}`,
    `Material families represented: ${totals.materials}`,
    `Vendors included: ${totals.vendors}`,
    '',
    '## Counts',
    '',
    '| Vendor | Bundles | Materials | Profiles |',
    '|---|---:|---:|---:|',
  ];
  for (const vendor of breakdown.vendors) {
    lines.push(`| ${vendor.vendor} | ${vendor.bundles} | ${vendor.materials} | ${vendor.profiles} |`);
  }
  lines.push('', '| Printer | Bundles | Profiles |', '|---|---:|---:|');
  for (const printer of breakdown.printers) {
    lines.push(`| ${printer.printer} | ${printer.bundles} | ${printer.profiles} |`);
  }
  lines.push(
    '',
    'Download `all-bbsflmt.zip` for Bambu Studio import testing. It is organized as `vendor/printer/material.bbsflmt`; import only the printer folders you need to avoid unnecessary user presets.',
    'Download `all-user-base.zip` for printer/AMS sync testing with Bambu Studio user-profile metadata. It contains `filament/base/*.json` and matching `.info` files with stable `setting_id` values.',
    'Download `manifest.json` for the complete per-bundle file list.',
    '',
  );
  for (const vendor of manifest.vendors) {
    lines.push(`## ${vendor.vendor}`, '');
    const bundlesByPrinter = new Map();
    for (const bundle of vendor.bundles ?? []) {
      const printer = bundle.printer ?? '';
      if (!bundlesByPrinter.has(printer)) bundlesByPrinter.set(printer, []);
      bundlesByPrinter.get(printer).push(bundle);
    }
    for (const [printer, bundles] of [...bundlesByPrinter.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
      lines.push(`### ${printer}`, '');
      for (const bundle of bundles.sort((a, b) => a.material.localeCompare(b.material, 'en'))) {
        lines.push(`- ${bundle.material}: ${bundle.profiles.length} profile(s) -> \`${bundle.artifact}\``);
      }
      lines.push('');
    }
    lines.push('');
  }
  await fs.writeFile(path.join(distRoot, 'release-notes.md'), lines.join('\n'), 'utf8');
}

function releaseTotals(manifest) {
  const bundles = manifest.vendors.flatMap((vendor) => vendor.bundles ?? []);
  const materialFamilies = new Set(
    manifest.vendors.flatMap((vendor) => (vendor.bundles ?? []).map((bundle) => `${vendor.vendor}:${bundle.material}`)),
  );
  return {
    vendors: manifest.vendors.length,
    bundles: bundles.length,
    materials: materialFamilies.size,
    profiles: bundles.reduce((sum, bundle) => sum + (bundle.profiles?.length ?? 0), 0),
  };
}

function releaseBreakdown(manifest) {
  const vendors = manifest.vendors.map((vendor) => {
    const bundles = vendor.bundles ?? [];
    return {
      vendor: vendor.vendor,
      bundles: bundles.length,
      materials: new Set(bundles.map((bundle) => bundle.material)).size,
      profiles: bundles.reduce((sum, bundle) => sum + (bundle.profiles?.length ?? 0), 0),
    };
  });
  const printerCounts = new Map();
  for (const vendor of manifest.vendors) {
    for (const bundle of vendor.bundles ?? []) {
      const printer = bundle.printer ?? '';
      if (!printer) continue;
      const current = printerCounts.get(printer) ?? { bundles: 0, profiles: 0 };
      current.bundles += 1;
      current.profiles += bundle.profiles?.length ?? 0;
      printerCounts.set(printer, current);
    }
  }
  const printers = [...printerCounts.entries()]
    .map(([printer, counts]) => ({ printer, ...counts }))
    .sort((a, b) => a.printer.localeCompare(b.printer, 'en'));
  return { vendors, printers };
}

async function writeAggregateZip(fileName, sourceDir) {
  const files = await walkFiles(sourceDir).catch(() => []);
  const entries = {};
  for (const file of files) {
    entries[path.relative(sourceDir, file).replaceAll(path.sep, '/')] = new Uint8Array(await fs.readFile(file));
  }
  if (!Object.keys(entries).length) return;
  await fs.writeFile(path.join(distRoot, fileName), Buffer.from(zipSync(entries, { level: 9 })));
}

async function readVendorConfig(vendorKey) {
  const dir = path.join(vendorsRoot, vendorKey);
  const sources = YAML.parse(await fs.readFile(path.join(dir, 'sources.yml'), 'utf8'));
  const normalizationPath = path.join(dir, 'normalization.yml');
  const normalization = (await exists(normalizationPath))
    ? YAML.parse(await fs.readFile(normalizationPath, 'utf8'))
    : {};
  return {
    key: vendorKey,
    dir,
    vendor: sources.vendor ?? normalization.vendor ?? vendorKey.toUpperCase(),
    sources,
    normalization,
  };
}

async function readUpstreamSourceProfiles(config, vendorKey) {
  const sourceProfiles = [];
  const upstreamHeads = {};

  for (const source of config.sources.sources ?? []) {
    const sourceDir = await cloneSource(vendorKey, source);
    const commit = (await git(['rev-parse', 'HEAD'], sourceDir)).stdout.trim();
    upstreamHeads[source.id] = {
      repo: source.repo,
      branch: source.branch ?? 'main',
      commit,
    };
    sourceProfiles.push(...(await readProfilesFromDirectory(
      sourceDir,
      sourceMetaForSource(config, source, commit),
    )));
  }

  return { sourceProfiles, upstreamHeads };
}

function sourceManifestEntry(source, commit) {
  return {
    id: source.id,
    label: source.label ?? source.id,
    repo: source.repo,
    branch: source.branch ?? 'main',
    commit,
    priority: Number(source.priority ?? 0),
    formats: source.formats ?? ['json', 'bbsflmt', 'zip'],
    include: pathPatterns(source.include),
    exclude: pathPatterns(source.exclude),
    familyPathSegment: sourceFamilyPathSegment(source),
  };
}

function sourceMetaForSource(config, source, commit) {
  return {
    vendor: config.vendor,
    sourceId: source.id,
    sourceLabel: source.label ?? source.id,
    sourceRepo: source.repo,
    sourcePriority: Number(source.priority ?? 0),
    sourceCommit: commit,
    allowedFormats: new Set(source.formats ?? ['json', 'bbsflmt', 'zip']),
    pathInclude: pathPatterns(source.include),
    pathExclude: pathPatterns(source.exclude),
    sourceFamilyPathSegment: sourceFamilyPathSegment(source),
  };
}

function sourceFamilyPathSegment(source) {
  if (source.familyPathSegment === undefined || source.familyPathSegment === null || source.familyPathSegment === '') {
    return null;
  }
  const segment = Number(source.familyPathSegment);
  if (!Number.isInteger(segment) || segment < 0) {
    throw new Error(`${source.id} familyPathSegment must be a non-negative integer.`);
  }
  return segment;
}

function sourceFamilyNameFromPath(relativePath, sourceMeta) {
  const segment = sourceMeta.sourceFamilyPathSegment;
  if (segment === null || segment === undefined) return '';
  const parts = String(relativePath ?? '').replaceAll('\\', '/').split('/');
  return normalizeTrustedSourceFamilyName(parts[segment] ?? '');
}

function normalizeTrustedSourceFamilyName(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s+/g, ' ')
    .trim();
}

async function cloneSource(vendorKey, source) {
  const target = path.join(workRoot, 'upstreams', vendorKey, source.id);
  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(path.dirname(target), { recursive: true });
  await git(['clone', '--depth', '1', '--branch', source.branch ?? 'main', source.repo, target], repoRoot);
  return target;
}

async function remoteHead(repo, branch) {
  const result = await git(['ls-remote', repo, `refs/heads/${branch}`], repoRoot);
  const line = result.stdout.trim().split(/\r?\n/).find(Boolean);
  if (!line) throw new Error(`No remote head found for ${repo} ${branch}`);
  return line.split(/\s+/)[0];
}

async function git(args, cwd) {
  return execFileAsync(gitBin, args, {
    cwd,
    maxBuffer: 1024 * 1024 * 20,
    windowsHide: true,
  });
}

function requireVendor(options) {
  if (!options.vendor) throw new Error('Missing --vendor <vendor>');
  return slug(options.vendor);
}

function pathPatterns(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value])
    .map((item) => String(item).replaceAll('\\', '/').trim())
    .filter(Boolean);
}

function sourcePathFilterReason(relativePath, sourceMeta) {
  const include = sourceMeta.pathInclude ?? [];
  const exclude = sourceMeta.pathExclude ?? [];
  if (include.length && !pathMatchesAny(relativePath, include)) {
    return 'path did not match source include';
  }
  if (exclude.length && pathMatchesAny(relativePath, exclude)) {
    return 'path matched source exclude';
  }
  return '';
}

function pathMatchesAny(relativePath, patterns) {
  const normalized = String(relativePath).replaceAll('\\', '/');
  return patterns.some((pattern) => globToRegExp(pattern).test(normalized));
}

function globToRegExp(pattern) {
  const normalized = String(pattern).replaceAll('\\', '/');
  let source = '^';
  for (let index = 0; index < normalized.length;) {
    const char = normalized[index];
    if (char === '*') {
      if (normalized[index + 1] === '*') {
        index += 2;
        if (normalized[index] === '/') {
          source += '(?:[^/]+/)*';
          index += 1;
        } else {
          source += '.*';
        }
      } else {
        source += '[^/]*';
        index += 1;
      }
      continue;
    }
    if (char === '?') {
      source += '[^/]';
      index += 1;
      continue;
    }
    source += escapeRegex(char);
    index += 1;
  }
  return new RegExp(`${source}$`);
}

async function walkFiles(root) {
  const out = [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const next = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(next)));
    if (entry.isFile()) out.push(next);
  }
  return out.sort((a, b) => a.localeCompare(b, 'en'));
}

async function listDirs(root) {
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(filePath) {
  if (!(await exists(filePath))) return null;
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function normalizeText(text) {
  return String(text ?? '')
    .normalize('NFKC')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/[，、]/g, ',')
    .replace(/[`´]/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase()
    .trim();
}

function hasToken(text, token) {
  return new RegExp(`(^|[^A-Z0-9])${escapeRegex(token)}([^A-Z0-9]|$)`).test(text);
}

function startsWithMaterial(familyName, vendor, prefix) {
  return familyName.replace(new RegExp(`^${escapeRegex(vendor)}\\s+`, 'i'), '').startsWith(prefix);
}

function familyKeyFor(familyName, vendor) {
  return slug(familyName.replace(new RegExp(`^${escapeRegex(vendor)}\\s+`, 'i'), ''));
}

function printerKeyFor(printerName) {
  return slug(printerName.replace(/^Bambu Lab\s+/i, ''));
}

function filamentIdForFamily(vendor, familyName) {
  return `P${md5(familyName).slice(0, 7)}`;
}

function isCompatibleFilamentIdFormat(filamentId) {
  return /^P[0-9a-f]{7}$/.test(String(filamentId ?? '')) || /^G[A-Z0-9]{4}$/.test(String(filamentId ?? ''));
}

function md5(text) {
  return crypto.createHash('md5').update(String(text)).digest('hex');
}

function userBaseInfoForProfile(profile, vendor) {
  return [
    'sync_info = ',
    'user_id = ',
    `setting_id = ${settingIdForUserBaseProfile(profile, vendor)}`,
    'base_id = ',
    'updated_time = 0',
    '',
  ].join('\n');
}

function settingIdForUserBaseProfile(profile, vendor) {
  return `PFU${slug(vendor).slice(0, 3).toUpperCase()}${hash(profile.name).slice(0, 14)}`;
}

function sourceSummary(raw) {
  return {
    sourceId: raw.sourceId,
    label: raw.sourceLabel,
    repo: raw.sourceRepo,
    path: raw.relativePath,
    innerPath: raw.innerPath ?? '',
    format: raw.format,
    priority: raw.sourcePriority,
  };
}

function sourcePathMatchesPrinter(raw, printerKey) {
  const pathText = normalizeText(`${raw.relativePath} ${raw.innerPath ?? ''}`);
  const pathPrinters = printerNamesFromText(pathText).map(printerKeyFor);
  return pathPrinters.includes(printerKey);
}

function stableHash(value) {
  return hash(JSON.stringify(sortDeep(value)));
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

function hash(text) {
  const data = text instanceof Uint8Array ? text : String(text);
  return crypto.createHash('sha1').update(data).digest('hex');
}

function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([k, v]) => [k, sortDeep(v)]));
  }
  return value;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function arrayFirst(value) {
  return Array.isArray(value) ? value[0] : value;
}

function uniquePrinterNozzles(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = `${item.printer}:${item.nozzle}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function slug(value) {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeFileName(value) {
  return String(value)
    .normalize('NFKC')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[. ]+$/g, '')
    .trim();
}

function md(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
