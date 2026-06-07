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

const command = process.argv[2];
const args = parseArgs(process.argv.slice(3));

try {
  if (command === 'vendor:status') {
    await vendorStatus(args);
  } else if (command === 'vendor:update') {
    await vendorUpdate(args);
  } else if (command === 'vendor:ingest') {
    await vendorIngest(args);
  } else if (command === 'verify') {
    await verifyAll();
  } else if (command === 'build:bbsflmt') {
    await buildBbsflmt();
  } else if (command === 'generate:readme') {
    await generateReadme();
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
  node scripts/bambu-profiles.mjs vendor:update --vendor <vendor>
  node scripts/bambu-profiles.mjs vendor:ingest --vendor <vendor> [--from incoming|<path>]
  node scripts/bambu-profiles.mjs verify
  node scripts/bambu-profiles.mjs build:bbsflmt
  node scripts/bambu-profiles.mjs generate:readme`);
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

async function vendorUpdate(options) {
  const vendorKey = requireVendor(options);
  const config = await readVendorConfig(vendorKey);
  const sourceProfiles = [];
  const upstreamHeads = {};

  for (const source of config.sources.sources ?? []) {
    const sourceDir = await cloneSource(vendorKey, source);
    const commit = await git(['rev-parse', 'HEAD'], sourceDir);
    upstreamHeads[source.id] = {
      repo: source.repo,
      branch: source.branch ?? 'main',
      commit: commit.stdout.trim(),
    };
    sourceProfiles.push(
      ...(await readProfilesFromDirectory(sourceDir, {
        vendor: config.vendor,
        sourceId: source.id,
        sourceLabel: source.label ?? source.id,
        sourceRepo: source.repo,
        sourcePriority: Number(source.priority ?? 0),
        allowedFormats: new Set(source.formats ?? ['json', 'bbsflmt', 'zip']),
      })),
    );
  }

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
  const incomingRoot =
    from === 'incoming' ? path.join(repoRoot, 'incoming', vendorKey) : path.resolve(repoRoot, from);

  const incomingProfiles = await readProfilesFromDirectory(incomingRoot, {
    vendor: config.vendor,
    sourceId: 'incoming',
    sourceLabel: 'Manual incoming files',
    sourceRepo: 'incoming',
    sourcePriority: 200,
    allowedFormats: new Set(['json', 'bbsflmt', 'zip']),
  });
  if (!incomingProfiles.length) {
    throw new Error(`No profiles found under ${incomingRoot}`);
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

  for (const raw of rawProfiles) {
    const normalized = normalizeRawProfile(config, raw, reports);
    candidates.push(...normalized);
  }

  const selected = selectCandidates(candidates, reports);
  const profileItems = [...selected.values()].sort((a, b) =>
    a.outputName.localeCompare(b.outputName, 'en'),
  );

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

  const profilesDir = path.join(config.dir, 'profiles');
  await fs.rm(profilesDir, { recursive: true, force: true });
  for (const item of profileItems) {
    await writeJson(item.outputPath, item.profile);
  }

  return { profileCount: profileItems.length };
}

function normalizeRawProfile(config, raw, reports) {
  const sourceText = normalizeText(
    [
      raw.profile.name,
      raw.profile.filament_settings_id?.[0],
      raw.relativePath,
      raw.innerPath,
    ].join(' '),
  );
  const families = materialFamiliesFor(sourceText, config.vendor);
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
    families,
    printerNozzles,
  });

  const out = [];
  for (const familyName of families) {
    const materialType = materialTypeForFamily(familyName, config.vendor);
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
        source: sourceSummary(raw),
        profile,
        profileHash: stableHash(profile),
      };

      reports.normalizedNames.push({
        sourceId: raw.sourceId,
        sourcePath: raw.relativePath,
        innerPath: raw.innerPath ?? '',
        sourceName: raw.profile.name ?? '',
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
  const byName = a.outputName.localeCompare(b.outputName, 'en');
  if (byName) return byName;
  return `${a.source.sourceId}:${a.source.path}`.localeCompare(`${b.source.sourceId}:${b.source.path}`, 'en');
}

function finalizeProfile(inputProfile, options) {
  const profile = { ...inputProfile };
  profile.name = options.outputName;
  profile.filament_settings_id = [options.outputName];
  profile.filament_vendor = [options.vendor];
  profile.filament_type = [options.materialType];
  profile.filament_id = filamentIdForFamily(options.vendor, options.familyName);
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
  const files = await walkFiles(root).catch(() => []);
  const out = [];
  for (const filePath of files) {
    const suffix = path.extname(filePath).toLowerCase();
    const format = suffix === '.bbsflmt' ? 'bbsflmt' : suffix.slice(1);
    if (!sourceMeta.allowedFormats.has(format)) continue;
    if (format === 'json') {
      const profile = JSON.parse(await fs.readFile(filePath, 'utf8'));
      out.push({
        ...sourceMeta,
        format,
        filePath,
        relativePath: path.relative(root, filePath).replaceAll(path.sep, '/'),
        profile,
      });
    } else if (format === 'bbsflmt' || format === 'zip') {
      out.push(...(await readBundleProfiles(filePath, root, sourceMeta, format)));
    }
  }
  return out;
}

async function readBundleProfiles(filePath, root, sourceMeta, format) {
  const bytes = new Uint8Array(await fs.readFile(filePath));
  const entries = unzipSync(bytes);
  const names = Object.keys(entries).sort((a, b) => a.localeCompare(b, 'en'));
  const bundleBytes = entries['bundle_structure.json'];
  const bundle = bundleBytes ? JSON.parse(strFromU8(bundleBytes)) : null;
  const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
  const out = [];

  for (const name of names) {
    if (!name.toLowerCase().endsWith('.json')) continue;
    if (name === 'bundle_structure.json') continue;
    const profile = JSON.parse(strFromU8(entries[name]));
    out.push({
      ...sourceMeta,
      format,
      filePath,
      relativePath,
      innerPath: name,
      bundle,
      profile,
    });
  }

  if (!bundle) {
    out.push({
      ...sourceMeta,
      format,
      filePath,
      relativePath,
      innerPath: '',
      bundle: null,
      profile: { name: `INVALID BUNDLE ${relativePath}` },
      bundleError: 'missing bundle_structure.json',
    });
  }
  return out;
}

function materialFamiliesFor(text, vendor) {
  const prefix = `${vendor} `;
  if (text.includes('PETG')) {
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
    if (text.includes('MATTE')) return [`${prefix}PLA Matte`];
    if (text.includes('SILK')) return [`${prefix}PLA Silk`];
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
    if (text.includes('BASIC')) return [`${prefix}ASA Basic`];
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

function materialTypeForFamily(familyName, vendor) {
  const material = familyName.replace(new RegExp(`^${escapeRegex(vendor)}\\s+`, 'i'), '').toUpperCase();
  if (material.startsWith('PETG CF')) return 'PETG-CF';
  if (material.startsWith('PETG GF')) return 'PETG-GF';
  if (material.startsWith('PETG')) return 'PETG';
  if (material.startsWith('GALAXY PETG')) return 'PETG';
  if (material.startsWith('SPARKLY PETG')) return 'PETG';
  if (material.startsWith('PET CF')) return 'PET-CF';
  if (material.startsWith('PET GF')) return 'PET-GF';
  if (material.startsWith('PET')) return 'PET';
  if (material.startsWith('PLA CF')) return 'PLA-CF';
  if (material.startsWith('PLA')) return 'PLA';
  if (material.startsWith('GALAXY PLA')) return 'PLA';
  if (material.startsWith('ABS CF')) return 'ABS-GF';
  if (material.startsWith('ABS')) return 'ABS';
  if (material.startsWith('ASA CF')) return 'ASA-CF';
  if (material.startsWith('ASA')) return 'ASA';
  if (material.startsWith('PAHT')) return 'PAHT-CF';
  if (material.startsWith('PA CF')) return 'PA-CF';
  if (material.startsWith('PC GF')) return 'PC-GF';
  if (material.startsWith('PP CF')) return 'PP-CF';
  if (material.startsWith('TPU GF')) return 'TPU-GF';
  if (material.startsWith('TPU')) return 'TPU';
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
  const errors = validateProfiles(profiles);
  if (errors.length) {
    throw new Error(`Cannot build bundles because profile validation failed:\n${errors.map((e) => `- ${e}`).join('\n')}`);
  }

  await fs.rm(distRoot, { recursive: true, force: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    bundleType: 'filament config bundle',
    vendors: [],
  };

  const byVendorFamily = new Map();
  for (const item of profiles) {
    const familyName = item.profile.name.split(' @')[0];
    const key = `${item.vendor}:${familyName}`;
    if (!byVendorFamily.has(key)) byVendorFamily.set(key, []);
    byVendorFamily.get(key).push(item);
  }

  for (const [key, items] of [...byVendorFamily.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
    const [vendor, familyName] = key.split(':');
    const vendorKey = slug(vendor);
    const bundleProfiles = items.sort((a, b) => a.profile.name.localeCompare(b.profile.name, 'en'));
    const innerPaths = bundleProfiles.map((item) => `${vendor}/${item.profile.name}.json`);
    const bundleVersion = bundleProfiles[0]?.profile.version ?? '2.0.0.0';
    const bundle = {
      bundle_id: `${hash(`${vendor}:${familyName}`).slice(0, 10)}_${familyName}_${hash(innerPaths.join('|')).slice(0, 10)}`,
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
    const outPath = path.join(distRoot, 'bbsflmt', vendorKey, `${safeFileName(familyName)}.bbsflmt`);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, Buffer.from(bundleBytes));
    validateBundleBytes(bundleBytes, outPath);

    let vendorManifest = manifest.vendors.find((item) => item.vendor === vendor);
    if (!vendorManifest) {
      vendorManifest = { vendor, materials: [] };
      manifest.vendors.push(vendorManifest);
    }
    vendorManifest.materials.push({
      name: familyName,
      type: bundleProfiles[0]?.profile.filament_type?.[0] ?? '',
      artifact: path.relative(distRoot, outPath).replaceAll(path.sep, '/'),
      profiles: bundleProfiles.map((item) => ({
        name: item.profile.name,
        printer: item.profile.compatible_printers?.[0] ?? '',
        source: item.relativePathFromRepo,
      })),
    });
  }

  await writeJson(path.join(distRoot, 'manifest.json'), manifest);
  await writeReleaseNotes(manifest);
  await writeAggregateZip('all-bbsflmt.zip', path.join(distRoot, 'bbsflmt'));
  await writeAggregateZip('all-json.zip', path.join(distRoot, 'json'));
  console.log(`OK: built ${manifest.vendors.reduce((sum, vendor) => sum + vendor.materials.length, 0)} .bbsflmt bundles.`);
}

async function verifyAll() {
  const profiles = await readAllNormalizedProfiles();
  const errors = validateProfiles(profiles);
  if (await exists(path.join(distRoot, 'bbsflmt'))) {
    const bundleFiles = (await walkFiles(path.join(distRoot, 'bbsflmt'))).filter((file) =>
      file.toLowerCase().endsWith('.bbsflmt'),
    );
    if (!bundleFiles.length) errors.push('dist/bbsflmt exists but contains no .bbsflmt files.');
    for (const bundleFile of bundleFiles) {
      try {
        validateBundleBytes(new Uint8Array(await fs.readFile(bundleFile)), bundleFile);
      } catch (error) {
        errors.push(error.message);
      }
    }
  }
  if (errors.length) {
    throw new Error(`Verification failed:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
  console.log(`OK: verified ${profiles.length} normalized profile JSON files.`);
}

function validateProfiles(profiles) {
  const errors = [];
  const byName = new Map();
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
    if (profile.name?.includes('PETG') && profile.filament_type?.[0]?.startsWith('PET-')) {
      errors.push(`${label}: PETG profile has PET filament_type`);
    }
    if (/(^| )PET( |$)/.test(profile.name ?? '') && !profile.name.includes('PETG') && profile.filament_type?.[0]?.startsWith('PETG')) {
      errors.push(`${label}: PET profile has PETG filament_type`);
    }
    const previous = byName.get(profile.name);
    if (previous && stableHash(previous.profile) !== stableHash(profile)) {
      errors.push(`${label}: duplicate profile name with different content: ${profile.name}`);
    }
    if (!previous) byName.set(profile.name, item);
  }
  return errors;
}

function validateBundleBytes(bytes, label) {
  const entries = unzipSync(bytes);
  const bundleBytes = entries['bundle_structure.json'];
  if (!bundleBytes) throw new Error(`${label}: missing bundle_structure.json`);
  const bundle = JSON.parse(strFromU8(bundleBytes));
  const paths = (bundle.filament_vendor ?? []).flatMap((item) => item.filament_path ?? []);
  if (!paths.length) throw new Error(`${label}: bundle has no filament paths`);
  const names = new Set();
  for (const bundlePath of paths) {
    const entry = entries[bundlePath];
    if (!entry) throw new Error(`${label}: bundle path missing from zip: ${bundlePath}`);
    const profile = JSON.parse(strFromU8(entry));
    if (names.has(profile.name)) throw new Error(`${label}: duplicate profile name in bundle: ${profile.name}`);
    names.add(profile.name);
    if (!Array.isArray(profile.filament_settings_id) || profile.filament_settings_id[0] !== profile.name) {
      throw new Error(`${label}: profile name/id mismatch: ${bundlePath}`);
    }
  }
}

async function generateReadme() {
  const profiles = await readAllNormalizedProfiles().catch(() => []);
  const lines = [];
  if (!profiles.length) {
    lines.push('No profiles have been generated yet. Run `npm run vendor:update -- --vendor tinmorry`.');
  } else {
    const byVendorFamily = new Map();
    for (const item of profiles) {
      const family = item.profile.name.split(' @')[0];
      const key = `${item.vendor}:${family}`;
      if (!byVendorFamily.has(key)) byVendorFamily.set(key, []);
      byVendorFamily.get(key).push(item);
    }
    lines.push('| Vendor | Material | Type | Profiles | Release artifact |');
    lines.push('|---|---|---:|---:|---|');
    for (const [key, items] of [...byVendorFamily.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
      const [vendor, family] = key.split(':');
      const artifact = `dist/bbsflmt/${slug(vendor)}/${safeFileName(family)}.bbsflmt`;
      lines.push(
        `| ${vendor} | ${family} | ${items[0].profile.filament_type?.[0] ?? ''} | ${items.length} | ${artifact} |`,
      );
    }
  }

  const readmePath = path.join(repoRoot, 'README.md');
  const current = await fs.readFile(readmePath, 'utf8');
  const start = '<!-- PROFILE_TABLE_START -->';
  const end = '<!-- PROFILE_TABLE_END -->';
  const replacement = `${start}\n\n${lines.join('\n')}\n\n${end}`;
  const next = current.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*${escapeRegex(end)}`), replacement);
  await fs.writeFile(readmePath, next, 'utf8');
  console.log(`OK: updated README with ${profiles.length} profiles.`);
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

function listMarkdown(title, items, emptyText) {
  const lines = [`# ${title}`, ''];
  if (!items.length) lines.push(emptyText);
  for (const item of items) lines.push(`- ${item}`);
  lines.push('');
  return lines.join('\n');
}

async function writeReleaseNotes(manifest) {
  const lines = ['# Release Artifacts', ''];
  for (const vendor of manifest.vendors) {
    lines.push(`## ${vendor.vendor}`, '');
    for (const material of vendor.materials) {
      lines.push(`- ${material.name}: ${material.profiles.length} profile(s) -> \`${material.artifact}\``);
    }
    lines.push('');
  }
  await fs.writeFile(path.join(distRoot, 'release-notes.md'), lines.join('\n'), 'utf8');
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
  const normalization = YAML.parse(await fs.readFile(path.join(dir, 'normalization.yml'), 'utf8'));
  return {
    key: vendorKey,
    dir,
    vendor: sources.vendor ?? normalization.vendor ?? vendorKey.toUpperCase(),
    sources,
    normalization,
  };
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
  return `PF${slug(vendor).slice(0, 3).toUpperCase()}${hash(`${vendor}:${familyName}`).slice(0, 8)}`;
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
  const pathText = normalizeText(raw.relativePath);
  const pathPrinters = printerNamesFromText(pathText).map(printerKeyFor);
  return pathPrinters.includes(printerKey);
}

function stableHash(value) {
  return hash(JSON.stringify(sortDeep(value)));
}

function hash(text) {
  return crypto.createHash('sha1').update(String(text)).digest('hex');
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
