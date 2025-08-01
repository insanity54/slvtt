#!/usr/bin/env node

import { resolve } from 'path';
import { tmpdir } from 'os';
import { exit } from 'process';
import { create } from './main'; // adjust to main.ts if using ts-node
import { getRandomId } from './random'; // needed for tmpDir

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
  console.error('Usage: slvtt.ts --input <path> --output <dir> [options]');
  console.error('Options: --tile-width <px> --tile-height <px> --interval <sec> --columns <n> --rows <n> --concurrency <n>');
  exit(1);
}

const options = {
  videoFilePath: resolve(args.input),
  outputDirectory: resolve(args.output),
  tmpDir: resolve(tmpdir(), getRandomId()), // auto-generated tmp dir
  concurrencyLimit: parseInt(args.concurrency ?? '4'), // default to 4
  frameWidth: parseInt(args['tile-width'] ?? '160'),
  frameHeight: parseInt(args['tile-height'] ?? '90'),
  interval: parseFloat(args.interval ?? '10'),
  cols: parseInt(args.columns ?? '5'),
  rows: parseInt(args.rows ?? '5'),
};

create(options)
  .then(() => {
    console.log('Storyboard created successfully.');
  })
  .catch((err) => {
    console.error('[video-storyboard] Failed:', err);
    exit(1);
  });
