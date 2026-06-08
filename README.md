# Bambu Filament Profiles

Reviewable Bambu Studio filament profiles with generated `.bbsflmt` release bundles.

This repository is built for ongoing maintenance by a coding agent:

- JSON under `vendors/<vendor>/profiles/` is the source of truth.
- `.bbsflmt` files are generated artifacts for GitHub Releases.
- Upstream repositories can be monitored, collected, diffed, and reviewed locally by AI.
- User-made or third-party profiles can be dropped directly into `incoming/` and reviewed through the same diff/proposal workflow by passing `--vendor <vendor>`.
- GitHub Actions package committed JSON into user-facing archives; they do not decide normalization.

## Current Vendors

<!-- PROFILE_TABLE_START -->

No normalized profiles are committed yet. Use `vendor:collect`, `vendor:diff`, and `vendor:propose` to prepare an AI-reviewed update.

<!-- PROFILE_TABLE_END -->

## Basic Workflow

For Bambu Studio import testing, download `all-bbsflmt.zip` from the latest prerelease or release, extract it locally, then import the contained `.bbsflmt` files. Pushing an update branch creates a candidate prerelease named `candidate-YYYYMMDD-HHMM-<short_sha>`. After the candidate is accepted and merged to `main`, a profile-changing `main` push creates a stable release named `vYYYYMMDD-HHMM-<short_sha>`. Release notes show the expected Bambu Studio import count before the material list.

```powershell
npm ci
npm run vendor:status -- --vendor tinmorry
npm run vendor:collect -- --vendor tinmorry --from all
npm run vendor:diff -- --vendor tinmorry
npm run vendor:propose -- --vendor tinmorry
npm run vendor:lock-inputs -- --vendor tinmorry
npm run verify
npm run build:bbsflmt
```

See [operations](docs/operations.md) and [vendor onboarding](docs/vendor-onboarding.md) for the agent workflow.
