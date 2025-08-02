#!/usr/bin/env node

import { resolve } from 'path';
import { tmpdir } from 'os';
import { exit } from 'process';
import { create } from './main';
import { getRandomId } from './random';
import { rm } from 'fs/promises';

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        console.error(`Missing value for --${key}`);
        exit(1);
      }
      args[key] = value;
      i++;
    } else if (arg.startsWith('-')) {
      console.warn(`Ignoring unsupported short argument: ${arg}`);
    }
  }
  return args;
}

const args = parseArgs(process.argv);

// Required
if (!args.input || !args.output) {
  console.error('Usage: cli.ts --input <path> --output <dir> [options]');
  console.error('Options: --frame-width <px> --frame-height <px> --interval <sec> --columns <n> --rows <n> --samples <n> --concurrency <n>');
  exit(1);
}

const options = {
  videoFilePath: resolve(args.input),
  outputDirectory: resolve(args.output),
  tmpDir: resolve(tmpdir(), getRandomId()),
  concurrencyLimit: parseInt(args.concurrency ?? '10'),
  frameWidth: parseInt(args['frame-width'] ?? '160'),
  frameHeight: parseInt(args['frame-height'] ?? '90'),
  interval: parseFloat(args.interval ?? '10'),
  cols: parseInt(args.columns ?? '5'),
  rows: parseInt(args.rows ?? '5'),
  numSamples: parseInt(args.samples ?? 100),
};

create(options)
  .then(() => {
    console.log('[slvtt] VideoFrameSheet created successfully.');
    return rm(options.tmpDir, { recursive: true, force: true })
  })
  .catch((err) => {
    console.error('[slvtt] Failed:', err);
    exit(1);
  });
