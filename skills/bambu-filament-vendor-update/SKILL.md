---
name: bambu-filament-vendor-update
description: Use when updating, ingesting, reviewing, locking, packaging, or creating PRs for Bambu Studio filament vendor profiles in this repository.
---

# Bambu Filament Vendor Update

Use this skill together with `AGENTS.md` and `docs/operations.md`.

## Start

1. Work from `origin/main` or an isolated update worktree.
2. Do not mix unrelated local changes into the vendor update.
3. Check status:

```powershell
npm run vendor:status -- --vendor <vendor>
```

## Review Inputs

1. Collect upstream inputs:

```powershell
npm run vendor:collect -- --vendor <vendor> --from upstream
npm run vendor:diff -- --vendor <vendor>
npm run vendor:propose -- --vendor <vendor>
```

2. Review `.work/extracted/<vendor>/reports/`, especially:

- `diff.md`
- `proposal-summary.md`
- `artifact-candidates.md`
- `decision-requests.md`

3. Stop before `vendor:lock-inputs`, commit, push, or PR when artifact candidates are added, changed, or untracked. Ask the user to adopt, reject, or defer them.

## Artifact Candidates

- Treat zip files that contain `.bbsflmt` files as artifact candidates.
- Do not add `zip` to source `formats` only to adopt a nested `.bbsflmt` from a distribution zip.
- Adopt a reviewed nested `.bbsflmt` by promoting the extracted candidate profile into normalized JSON and recording the reviewed artifact candidate in `input-lock.json`.
- Add `zip` to source `formats` only when the zip itself is a valid Bambu bundle with `bundle_structure.json`.

## Apply Accepted Changes

For manual or reviewed extracted profiles, use `vendor:ingest` with the accepted input path. For upstream-only refreshes, update normalized profiles only after the review decision is clear.

Then run:

```powershell
npm run profiles:expand-inherits -- --vendor <vendor>
npm run vendor:lock-inputs -- --vendor <vendor>
npm run verify
npm run build:bbsflmt
npm run verify
npm run generate:readme
```

Use `--defer-artifact-candidates` only after the user explicitly defers artifact candidates.

## Finish

1. Stage only relevant profile, report, lock, README, and workflow files.
2. Commit and push an `agent/update/**` branch.
3. Create a GitHub PR to `main`.
4. Run `npm run pr:mergeability` and resolve any `CONFLICTING` or `DIRTY` result before reporting the PR as ready.
5. Confirm the PR check passes and candidate prerelease assets exist.
6. Tell the user to import-test `all-bbsflmt.zip` before merge.
