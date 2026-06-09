# Polymaker Decisions

## 2026-06-10 - Trust Upstream Material Folders

`Polymaker3D/Polymaker-Preset` is treated as authoritative for material family grouping. Use `preset/<material>/...` as the normalized family suffix and do not merge product-line folders into generic material names.

Examples:

- `PolyLite PLA` remains `Polymaker PolyLite PLA`, not `Polymaker PLA`.
- `Polymaker ABS Max` remains `Polymaker ABS Max`, not `Polymaker Polymaker ABS Max`.
- The profile selector name should keep product-line labels such as `PolyLite`.
- Short material-type labels should continue to come from the source `filament_type`, such as `PLA`, `PETG`, or `TPU`.
