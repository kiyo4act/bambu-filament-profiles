#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

function run(command, args) {
  return execFileSync(command, args, { encoding: 'utf8' }).trim();
}

function runStatus(command, args) {
  try {
    execFileSync(command, args, { stdio: 'pipe' });
    return 0;
  } catch (error) {
    return error.status ?? 1;
  }
}

const pr = process.argv[2];
const args = ['pr', 'view'];
if (pr) args.push(pr);
args.push('--json', 'url,headRefName,baseRefName,mergeable,mergeStateStatus');

let result;
try {
  result = JSON.parse(run('gh', args));
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
} else if (mergeable === 'UNKNOWN' || mergeStateStatus === 'UNKNOWN') {
  const base = result.baseRefName;
  const head = result.headRefName;
  if (!base || !head) {
    throw new Error('GitHub mergeability is UNKNOWN and PR refs are unavailable for local verification.');
  }

  console.log('GitHub mergeability is UNKNOWN; verifying refs locally.');
  run('git', ['fetch', 'origin']);
  const baseRef = `refs/remotes/origin/${base}`;
  const headRef = `refs/remotes/origin/${head}`;
  const baseRefStatus = runStatus('git', ['rev-parse', '--verify', baseRef]);
  const headRefStatus = runStatus('git', ['rev-parse', '--verify', headRef]);
  if (baseRefStatus !== 0 || headRefStatus !== 0) {
    throw new Error(`Could not verify local refs ${baseRef} and ${headRef}.`);
  }

  if (runStatus('git', ['merge-base', '--is-ancestor', baseRef, headRef]) === 0) {
    console.log(`local: ${baseRef} is already included in ${headRef}; no merge conflict possible for the current base.`);
  } else if (runStatus('git', ['merge-tree', '--write-tree', baseRef, headRef]) === 0) {
    console.log('local: merge-tree completed without conflicts.');
  } else {
    throw new Error('PR is not locally mergeable with the current base branch.');
  }
}
