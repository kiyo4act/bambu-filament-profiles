# Operations Runbook

This repository is an AI-led local update workflow, not an automatic upstream converter.

## Normal Upstream Update

1. Ask AI to update a vendor, for example TINMORRY.
2. AI starts from local `main` and checks upstream state:

   ```powershell
   npm ci
   npm run vendor:status -- --vendor tinmorry
   ```

3. AI collects and expands inputs into `.work/`, without touching committed profiles:

   ```powershell
   npm run vendor:collect -- --vendor tinmorry --from upstream
   npm run vendor:diff -- --vendor tinmorry
   npm run vendor:propose -- --vendor tinmorry
   ```

4. AI reviews `.work/extracted/<vendor>/reports/`, especially `diff.md`, `proposal-summary.md`, `artifact-candidates.md`, and `decision-requests.md`.
5. If `artifact-candidates.md` contains any new, changed, or untracked candidate, AI stops before `vendor:lock-inputs`, commit, push, or PR creation and asks whether to adopt, reject, or defer each candidate. If the candidate is deferred, AI may lock normal inputs only with `--defer-artifact-candidates`.
6. If a new material/printer/inherits decision is needed, AI asks you before changing normalized JSON.
7. After the decision is accepted, AI updates `vendors/<vendor>/profiles/`, expands inherited profiles, and records the reasoning in vendor reports or a decision log.
8. AI runs:

   ```powershell
   npm run profiles:expand-inherits -- --vendor tinmorry
   npm run vendor:lock-inputs -- --vendor tinmorry
   npm run verify
   npm run build:bbsflmt
   npm run verify
   npm run generate:readme
   ```

   Use `npm run vendor:lock-inputs -- --vendor tinmorry --defer-artifact-candidates` only after the user explicitly defers artifact candidates for a later review.

9. AI commits and pushes the normalized JSON state to an update branch such as `agent/update/tinmorry-YYYYMMDD-HHMM`. GitHub Actions automatically creates a candidate prerelease with `all-bbsflmt.zip`, `all-json.zip`, and `manifest.json`.
10. AI creates a normal GitHub PR from the update branch to `main`. The PR body should say that the candidate prerelease must be import-tested in Bambu Studio before merge.
11. AI checks PR mergeability and reports conflicts before saying the PR is ready:

   ```powershell
   npm run pr:mergeability
   ```

12. Download `all-bbsflmt.zip` from the candidate prerelease, extract it locally, and import the contained `.bbsflmt` files in Bambu Studio.
13. Merge to `main` only after the candidate is acceptable and the PR has no conflicts. A profile-changing `main` push automatically creates the stable release.

## Artifact Candidate Adoption

- Treat zip files that contain `.bbsflmt` files as artifact candidates, not normal `zip` source inputs.
- Do not add `zip` to a vendor source `formats` list only to adopt a nested `.bbsflmt` from a distribution zip.
- Adopt a reviewed nested `.bbsflmt` by promoting the extracted candidate profile into normalized JSON and recording the reviewed artifact candidate in the input lock.
- Add `zip` to source `formats` only when the zip itself is a valid Bambu bundle with `bundle_structure.json`.

## Manual Profile Addition

1. Put files directly under `incoming/`. JSON, `.bbsflmt`, and zip files are supported. You do not need to create a vendor subfolder; specify the vendor with `--vendor`.
2. Ask AI to ingest the incoming files.
3. AI runs:

   ```powershell
   npm run vendor:collect -- --vendor <vendor> --from incoming
   npm run vendor:diff -- --vendor <vendor>
   npm run vendor:propose -- --vendor <vendor>
   ```

4. AI asks about any new decision requests, then updates committed JSON:

   ```powershell
   npm run vendor:ingest -- --vendor <vendor> --from incoming
   ```

5. AI locks the accepted input hashes, verifies, builds aggregate release artifacts locally, commits, pushes an `agent/update/**` branch, and creates a GitHub PR.
6. After accepted incoming files are verified and committed, AI moves processed input files out of `incoming/` into `.work/archived-incoming/<vendor>/<timestamp>/`. Leave only `incoming/.gitkeep` unless new manual inputs are intentionally waiting for review.

## What Actions Do

Actions can:

- run `verify`
- build `.bbsflmt` bundles from committed JSON
- upload `all-bbsflmt.zip`, `all-json.zip`, and `manifest.json`
- create a candidate prerelease automatically on update branch push
- create a stable release automatically on profile-changing `main` push
- show expected import counts in release notes
- detect upstream HEAD changes and write a summary

Actions do not:

- fetch upstream profile contents for normalization
- decide material grouping
- rewrite JSON
- create update PRs automatically
- merge to `main`

## Human Gate

Automation can validate JSON shape and bundle structure. It cannot prove that every Bambu Studio version shows every vendor/material in the printer UI, or that a profile prints well. Candidate releases exist so you can import-test before accepting the update.
