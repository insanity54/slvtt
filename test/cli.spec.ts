import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { sampleVideo } from '../src/constants';
import { exec } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getRandomId } from '../src/random';
import { promises as fs } from 'fs';
import { rm } from 'fs/promises';

function execAsync(command: string): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
        });
    });
}

describe('cli', () => {
    let stderr: string;
    let stdout: string;

    describe('integration', () => {
        describe('10 samples', () => {
            const outputDir = join(tmpdir(), getRandomId())

            beforeAll(async () => {
                const command = `tsx ./src/cli.ts --input ${sampleVideo} --output ${outputDir} --samples 10`;
                const result = await execAsync(command);
                stderr = result.stderr;
                stdout = result.stdout;
            }, 60_000);

            it('creates vtt file', async () => {
                const vttPath = join(outputDir, 'sl.vtt');
                const stat = await fs.stat(vttPath);
                expect(stat.isFile()).toBe(true);
            });

            it('creates sheet files', async () => {
                const files = await fs.readdir(outputDir);
                const sheets = files.filter((f) => f.endsWith('.webp'));
                expect(sheets.length).toBeGreaterThan(0);
            });

            afterAll(async () => {
                await rm(outputDir, { recursive: true, force: true });
            })
        })

        describe('100 samples', () => {
            const outputDir = join(tmpdir(), getRandomId())

            beforeAll(async () => {
                const command = `tsx ./src/cli.ts --input ${sampleVideo} --output ${outputDir} --samples 100`;
                const result = await execAsync(command);
                stderr = result.stderr;
                stdout = result.stdout;
            }, 60_000);

            it('creates vtt file', async () => {
                const vttPath = join(outputDir, 'sl.vtt');
                const stat = await fs.stat(vttPath);
                expect(stat.isFile()).toBe(true);
            });

            it('creates sheet files', async () => {
                const files = await fs.readdir(outputDir);
                const sheets = files.filter((f) => f.endsWith('.webp'));
                expect(sheets.length).toBeGreaterThan(0);
            });

            afterAll(async () => {
                await rm(outputDir, { recursive: true, force: true });
            })
        })
    })




});
