#!/usr/bin/env node
/**
 * Rank Lab-original cross-platform replacement for Scrollcraft's Bash encoder.
 * It preserves the upstream workflow intent: H.264, no audio, yuv420p,
 * fixed GOPs, no scene-cut keyframes, faststart, and desktop/mobile variants
 * suitable for smooth scroll scrubbing.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const usage = 'Usage: node scrollcraft/scripts/encode.mjs <source> [--out-dir <directory>]\n\nWrites <name>.desktop.mp4 (1080p, GOP 8, CRF 20) and <name>.mobile.mp4 (720p, GOP 4, CRF 24).';
const args = process.argv.slice(2);
if (!args[0] || args.includes('--help') || args.includes('-h')) { console.log(usage); process.exit(args[0] ? 0 : 1); }
const input = resolve(args[0]);
const outFlag = args.indexOf('--out-dir');
if (outFlag !== -1 && !args[outFlag + 1]) { console.error('--out-dir requires a directory.'); process.exit(1); }
if (!existsSync(input)) { console.error('Source file not found: ' + input); process.exit(1); }
const outDir = resolve(outFlag === -1 ? dirname(input) : args[outFlag + 1]);
mkdirSync(outDir, { recursive: true });

function works(candidate) { const result = spawnSync(candidate, ['-version'], { stdio: 'ignore', shell: process.platform === 'win32' }); return !result.error && result.status === 0; }
function findFfmpeg() {
  const candidates = [process.env.SCROLLCRAFT_FFMPEG, 'ffmpeg'].filter(Boolean);
  for (const candidate of candidates) if (works(candidate)) return candidate;
  throw new Error('ffmpeg was not found. Install a full ffmpeg build or set SCROLLCRAFT_FFMPEG to its executable path.');
}
function run(ffmpeg, output, height, gop, crf) {
  const command = ['-y', '-i', input, '-map', '0:v:0', '-an', '-vf', 'scale=-2:' + height + ':flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0', '-movflags', '+faststart', output];
  const result = spawnSync(ffmpeg, command, { stdio: 'inherit', shell: false });
  if (result.error || result.status !== 0) throw new Error('ffmpeg failed while creating ' + output);
}
try {
  const ffmpeg = findFfmpeg();
  const stem = basename(input, extname(input));
  const desktop = join(outDir, stem + '.desktop.mp4');
  const mobile = join(outDir, stem + '.mobile.mp4');
  run(ffmpeg, desktop, 1080, 8, 20);
  run(ffmpeg, mobile, 720, 4, 24);
  console.log('Created:\n- ' + desktop + '\n- ' + mobile);
} catch (error) { console.error(error.message); process.exit(1); }
