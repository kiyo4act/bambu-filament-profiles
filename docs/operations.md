# Operations Runbook

This repository is an update workflow, not just a profile dump.

## Normal Upstream Update

1. Start from `main`.
2. Create a short-lived branch such as `agent/update/tinmorry-2026-06-07`.
3. Run:

   ```powershell
   npm ci
   npm run vendor:status -- --vendor tinmorry
   npm run vendor:update -- --vendor tinmorry
   npm run verify
   npm run build:bbsflmt
   npm run generate:readme
   ```

4. Commit changed profiles, reports, lock files, and README.
5. Open a PR with:
   - upstream commits used
   - added/changed/removed profile counts
   - conflict and warning summary
   - candidate release link once available
6. Build a candidate prerelease from the PR branch.
7. Import candidate `.bbsflmt` files in Bambu Studio.
8. Merge to `main` only after the candidate is acceptable.
9. Create a stable release from `main`.

## Manual Profile Addition

1. Put files under `incoming/<vendor>/`.
2. Run:

   ```powershell
   npm run vendor:ingest -- --vendor <vendor> --from incoming
   npm run verify
   npm run build:bbsflmt
   ```

3. Review `vendors/<vendor>/reports/`.
4. Commit normalized JSON, reports, and README updates.

## What Automation Can and Cannot Do

Automation can:

- detect upstream HEAD changes
- unpack `.bbsflmt`
- normalize names, vendors, printers, nozzles, and material families
- detect structural conflicts
- build candidate `.bbsflmt` assets
- open PRs and prereleases

Automation cannot fully prove:

- Bambu Studio accepts every generated bundle in every version
- a profile appears exactly where expected in every printer UI
- the profile prints well

Candidate releases keep that human import test explicit.

