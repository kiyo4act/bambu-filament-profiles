#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const pr = process.argv[2];
const args = ['pr', 'view'];
if (pr) args.push(pr);
args.push('--json', 'url,headRefName,baseRefName,mergeable,mergeStateStatus');

let result;
try {
  result = JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }));
} catch (error) {
  const details = error.stderr?.toString?.() || error.message;
  throw new Error(`Failed to read PR mergeability with gh: ${details}`);
}

const url = result.url ?? '(unknown PR)';
const mergeable = result.mergeable ?? 'UNKNOWN';
const mergeStateStatus = result.mergeStateStatus ?? 'UNKNOWN';

console.log(`${url}`);
console.log(`head: ${result.headRefName ?? '(unknown)'} -> base: ${result.baseRefName ?? '(unknown)'}`);
console.log(`mergeable: ${mergeable}`);
console.log(`mergeStateStatus: ${mergeStateStatus}`);

if (mergeable === 'CONFLICTING' || mergeStateStatus === 'DIRTY') {
  process.exitCode = 1;
}
