#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const defaultPreserveKeys = [
  'include',
  'filament_long_retractions_when_ec',
  'filament_retraction_distances_when_ec',
];
const requiredOptions = ['source', 'target', 'name', 'compatiblePrinter', 'vendor', 'filamentId'];
const missing = Symbol('missing');

const options = parseArgs(process.argv.slice(2));

try {
  if (options.help) {
    usage();
    process.exit(0);
  }
  await main(options);
} catch (error) {
  console.error(error.message);
  process.exit(error.exitCode ?? 1);
}

function usage() {
  console.log(`Usage:
  node scripts/import-user-profile.mjs --source <path> --target <repo-json-path> --name <profile-name> --compatible-printer <printer-nozzle> --vendor <vendor> --filament-id <id> [--include <template>] [--preserve-key <key>] [--set-json <key>=<json>] [--dry-run]

Examples:
  npm run profile:import-user -- --source "%APPDATA%/BambuStudio/user/123/filament/base/Profile.json" --target vendors/tinmorry/profiles/petg-matte/h2c/nozzle-0.4.json --name "TINMORRY PETG Matte @Bambu Lab H2C 0.4 nozzle" --compatible-printer "Bambu Lab H2C 0.4 nozzle" --vendor TINMORRY --filament-id P8a43bf1
  npm run profile:import-user -- --source Profile.json --target vendors/vendor/profiles/material/h2c/nozzle-0.4.json --name "Vendor Material @Bambu Lab H2C 0.4 nozzle" --compatible-printer "Bambu Lab H2C 0.4 nozzle" --vendor Vendor --filament-id P1234567 --include fdm_filament_template_direct_dual
`);
}

async function main(args) {
  for (const key of requiredOptions) {
    if (!args[key]) throw new Error(`Missing required option --${toKebab(key)}`);
  }

  const sourcePath = path.resolve(args.source);
  const targetPath = resolveRepoPath(args.target, '--target');
  if (sourcePath === targetPath) throw new Error('--source and --target must be different files');

  const source = await readJson(sourcePath, '--source');
  const existing = await readJsonIfExists(targetPath);
  const created = existing === null;
  const preserveKeys = parsePreserveKeys(args.preserveKey);
  const profile = { ...source };

  if (existing) {
    for (const key of preserveKeys) {
      if (!(key in profile) && key in existing) profile[key] = existing[key];
    }
  }

  const include = asArray(args.include);
  if (include.length) profile.include = include;

  for (const assignment of asArray(args.setJson)) {
    const [key, value] = parseJsonAssignment(assignment);
    profile[key] = value;
  }

  profile.name = args.name;
  profile.filament_settings_id = [args.name];
  profile.compatible_printers = [args.compatiblePrinter];
  profile.compatible_printers_condition = '';
  profile.filament_vendor = [args.vendor];
  profile.filament_id = args.filamentId;
  profile.inherits = '';

  const output = sortDeep(profile);
  const changes = diffTopLevel(existing ?? {}, output);
  const residual = diffTopLevel(source, output);

  if (!args.dryRun) {
    await writeJson(targetPath, output);
  }

  printSummary({
    sourcePath,
    targetPath,
    created,
    dryRun: Boolean(args.dryRun),
    changes,
    residual,
    output,
  });
}

function parseArgs(argv) {
  const parsed = { _: [] };
  const repeatable = new Set(['include', 'preserve-key', 'set-json']);

  for (let index = 0; index < argv.length; index += 1) {
    const raw = argv[index];
    if (!raw.startsWith('--')) {
      parsed._.push(raw);
      continue;
    }

    const eqIndex = raw.indexOf('=');
    const rawKey = raw.slice(2, eqIndex === -1 ? undefined : eqIndex);
    const key = toCamel(rawKey);

    if (rawKey === 'dry-run' || rawKey === 'help') {
      parsed[key] = true;
      continue;
    }

    let value;
    if (eqIndex !== -1) {
      value = raw.slice(eqIndex + 1);
    } else {
      value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for --${rawKey}`);
      }
      index += 1;
    }

    if (repeatable.has(rawKey)) {
      parsed[key] = [...asArray(parsed[key]), value];
    } else {
      parsed[key] = value;
    }
  }

  return parsed;
}

function resolveRepoPath(filePath, label) {
  const resolved = path.resolve(repoRoot, filePath);
  const relative = path.relative(repoRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} must be inside the repository: ${filePath}`);
  }
  if (path.extname(resolved).toLowerCase() !== '.json') {
    throw new Error(`${label} must point to a .json file: ${filePath}`);
  }
  return resolved;
}

async function readJson(filePath, label) {
  let text;
  try {
    text = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read ${label} ${filePath}: ${error.message}`);
  }

  try {
    const json = JSON.parse(text);
    if (!json || Array.isArray(json) || typeof json !== 'object') {
      throw new Error('expected a JSON object');
    }
    return json;
  } catch (error) {
    throw new Error(`Failed to parse ${label} ${filePath}: ${error.message}`);
  }
}

async function readJsonIfExists(filePath) {
  try {
    return await readJson(filePath, 'target');
  } catch (error) {
    if (error.message.includes('ENOENT')) return null;
    throw error;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function parsePreserveKeys(value) {
  const keys = asArray(value);
  if (!keys.length) return defaultPreserveKeys;
  if (keys.includes('none')) return [];
  return keys;
}

function parseJsonAssignment(assignment) {
  const eqIndex = assignment.indexOf('=');
  if (eqIndex <= 0) throw new Error(`Expected --set-json <key>=<json>, got: ${assignment}`);
  const key = assignment.slice(0, eqIndex);
  const rawValue = assignment.slice(eqIndex + 1);
  try {
    return [key, JSON.parse(rawValue)];
  } catch (error) {
    throw new Error(`Failed to parse JSON value for --set-json ${key}: ${error.message}`);
  }
}

function diffTopLevel(before, after) {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort((a, b) => a.localeCompare(b, 'en'));
  return keys
    .filter((key) => stable(before[key] ?? missing) !== stable(after[key] ?? missing))
    .map((key) => ({
      key,
      before: key in before ? before[key] : missing,
      after: key in after ? after[key] : missing,
    }));
}

function printSummary({ sourcePath, targetPath, created, dryRun, changes, residual, output }) {
  const mode = created ? 'create' : 'update';
  const action = dryRun ? 'would write' : 'wrote';

  console.log(`OK: ${action} ${relativeFromRepo(targetPath)} (${mode})`);
  console.log(`source: ${sourcePath}`);
  console.log(`target: ${relativeFromRepo(targetPath)}`);
  console.log(`profile: ${output.name}`);
  console.log(`compatible_printers: ${JSON.stringify(output.compatible_printers)}`);
  console.log(`filament_vendor: ${JSON.stringify(output.filament_vendor)}`);
  console.log(`filament_id: ${output.filament_id}`);

  if (created) {
    console.log(`created fields: ${Object.keys(output).length}`);
  } else {
    console.log(`changed fields: ${changes.length}`);
    for (const change of changes) {
      console.log(`- ${change.key}: ${formatValue(change.before)} -> ${formatValue(change.after)}`);
    }
  }

  console.log(`residual differences from source: ${residual.length}`);
  for (const change of residual) {
    console.log(`- ${change.key}: ${formatValue(change.before)} -> ${formatValue(change.after)}`);
  }
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([k, v]) => [k, sortDeep(v)]));
  }
  return value;
}

function stable(value) {
  return value === missing ? '<missing>' : JSON.stringify(value);
}

function formatValue(value) {
  if (value === missing) return '<missing>';
  const text = JSON.stringify(value);
  return text.length > 140 ? `${text.slice(0, 137)}...` : text;
}

function asArray(value) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function relativeFromRepo(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toKebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
