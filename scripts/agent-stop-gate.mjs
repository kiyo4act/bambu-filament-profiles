#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

function exec(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function changedFiles() {
  return exec('git', ['status', '--porcelain=v1'])
    .split(/\r?\n/)
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map((file) => file.replace(/^.* -> /, ''))
    .map((file) => file.replace(/^"|"$/g, ''));
}

const changed = changedFiles();
const relevant = changed.filter((file) =>
  file === 'README.md' ||
  file === 'docs/operations.md' ||
  file === 'scripts/bambu-profiles.mjs' ||
  /^vendors\/[^/]+\/(profiles|reports|input-lock\.json|upstream-lock\.json)/.test(file)
);

if (!relevant.length) {
  process.exit(0);
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
execFileSync(npmCommand, ['run', 'verify'], { stdio: 'inherit' });

if (relevant.some((file) => /^vendors\/[^/]+\/profiles\//.test(file))) {
  console.error('Profile JSON changed. Before final completion, also run: npm run build:bbsflmt && npm run verify');
}
