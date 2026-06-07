# Vendor Onboarding

Each vendor gets a directory under `vendors/<vendor>/`.

## Required Files

- `sources.yml`: upstream repositories and input priorities.
- `normalization.yml`: vendor name, material rules, printer aliases, and exceptions.
- `profiles/`: normalized Bambu Studio JSON source files.
- `reports/`: generated reports explaining the latest import.

## Adding a Vendor

1. Create `vendors/<vendor>/sources.yml`.
2. Create `vendors/<vendor>/normalization.yml`.
3. Put sample inputs under `incoming/<vendor>/`.
4. Run:

   ```powershell
   npm run vendor:ingest -- --vendor <vendor> --from incoming
   ```

5. Add material rules until `npm run verify` passes.
6. Commit the normalized profiles and reports.

## Source Priority

Higher `priority` wins when two sources describe the same vendor/material/printer/nozzle profile.

Use this for vendors that publish multiple repositories, for example:

- newer `.bbsflmt` export repository: high priority
- older JSON repository: lower priority fallback
- local `incoming/` files: highest priority when intentionally overriding

