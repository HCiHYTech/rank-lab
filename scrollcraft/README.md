# Scrollcraft Runtime Port

This directory contains the Rank Lab port of selected runtime, reference, and verification material from **Scrollcraft** by **Nate Herk**, pinned at `e95798551874854cef6dd3996ec7de1364a82bbd`.

- `engine/` and `references/` are retained substantially as upstream source material.
- `scripts/` are upstream operational tools retained substantially as-is for this first port.
- `scripts/encode.mjs` is Rank Lab-original cross-platform tooling that preserves Scrollcraft's scroll-scrub encoding intent on Windows, macOS, Linux, and Codex environments.

The source files are not Rank Lab-original work. See the repository-level [NOTICE](../NOTICE.md), [PROVENANCE](../PROVENANCE.md), [integrity policy](../docs/INTEGRITY_POLICY.md), and `provenance/borrowed-elements.json` for attribution and adaptation records.

## Runtime checks

```text
node scrollcraft/scripts/doctor.mjs
node scrollcraft/scripts/workspace.mjs --ensure
node scripts/integrity-check.mjs
```

## Cross-platform encoding

```text
node scrollcraft/scripts/encode.mjs path/to/source.mp4 --out-dir path/to/output
```

The encoder writes desktop and mobile H.264 files without audio, optimized for smooth scroll scrubbing. Use `SCROLLCRAFT_FFMPEG` to point at a specific ffmpeg executable when it is not on `PATH`.
