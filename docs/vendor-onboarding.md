# Vendor Onboarding

Each vendor gets a directory under `vendors/<vendor>/`. New vendors start with observation, not hard-coded normalization rules.

## Required Files

- `sources.yml`: upstream repositories, branches, formats, and priority.
- `profiles/`: normalized Bambu Studio JSON source files after AI/user review.
- `reports/` or `decision-log.md`: committed reasoning when a normalization decision should be remembered.

Do not create vendor-specific material/printer rewrite tables as the default. The update workflow should compare input diffs, show proposals, and ask about new decisions.

## Adding A Vendor

1. Create `vendors/<vendor>/sources.yml`.
2. Put sample files directly under `incoming/` if there is no upstream yet. Use `--vendor <vendor>` when collecting them.
3. Run collection and proposal commands:

   ```powershell
   npm run vendor:collect -- --vendor <vendor> --from all
   npm run vendor:diff -- --vendor <vendor>
   npm run vendor:propose -- --vendor <vendor>
   ```

4. Review `.work/extracted/<vendor>/reports/`.
5. Ask the user about entries in `decision-requests.md`.
6. Write normalized JSON only after the decision is clear.
7. Expand inherited presets and verify:

   ```powershell
   npm run profiles:expand-inherits -- --vendor <vendor>
   npm run vendor:lock-inputs -- --vendor <vendor>
   npm run verify
   npm run build:bbsflmt
   npm run verify
   ```

## Source Priority

Higher `priority` indicates which source should be preferred when the AI/user decision says two sources describe the same vendor/material/printer/nozzle profile.

Use priority as evidence, not as silent authority. If two changed inputs conflict, record the conflict and ask unless a prior decision log already covers the same case.

## Source Path Filters

For upstream repositories that mix Bambu Studio presets with other slicer or printer-vendor profiles, add `include` / `exclude` globs to the source definition. Filters are evaluated against repository-relative paths before format handling. Profile-like files filtered this way are reported in `.work/extracted/<vendor>/reports/filtered-out.md` and are not collected as inputs or artifact candidates.

Example:

```yml
vendor: Polymaker
sources:
  - id: polymaker-preset-json
    label: Polymaker preset repository
    repo: https://github.com/Polymaker3D/Polymaker-Preset.git
    branch: main
    priority: 100
    formats:
      - json
    include:
      - preset/**/BBL/**/BambuStudio/*.json
    exclude:
      - preset/**/Orcaslicer/*.json
      - preset/**/OrcaSlicer/*.json
```
