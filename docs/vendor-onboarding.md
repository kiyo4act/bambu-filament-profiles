# Vendor Onboarding

Each vendor gets a directory under `vendors/<vendor>/`. New vendors start with observation, not hard-coded normalization rules.

## Required Files

- `sources.yml`: upstream repositories, branches, formats, and priority.
- `profiles/`: normalized Bambu Studio JSON source files after AI/user review.
- `reports/` or `decision-log.md`: committed reasoning when a normalization decision should be remembered.

Do not create vendor-specific material/printer rewrite tables as the default. The update workflow should compare input diffs, show proposals, and ask about new decisions.

## Adding A Vendor

1. Create `vendors/<vendor>/sources.yml`.
2. Put sample files under `incoming/<vendor>/` if there is no upstream yet.
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
