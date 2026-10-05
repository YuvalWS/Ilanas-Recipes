# Batch numbering notes

The numbers in `Batch N` are the folder numbers Yuval gave the scans. They are **not** a count of Ilana's original physical batches.

- **Batch 4 is intentionally empty.** The scan folder `Batch 4` exists but holds no scans. When the folders were created the number 4 was skipped by mistake, so the real batches go 3 -> 5. The folder was kept (not removed) on purpose, to keep folder numbers matching the numbers used here. There is no `recipes/batch-04/` and no recipe ids starting with `b04-`. Do not treat this as missing data.
- **Batch 99 = loose scans.** Two scans (`Scanned_20261004-2244-01.jpg` and `-02.jpg`) sat in the root of the scan folder, outside any `Batch N` folder. They form one recipe (`b99-r01`). The number 99 is a placeholder, not a real batch; it was chosen because Batches 22 and 23 were added later.
- Batches 22 and 23 were added to the scan folder after the first processing run.

If Yuval later renumbers folders, update `original_path` in each `recipe.json` and `scan_folder` in each `batch.json`.
