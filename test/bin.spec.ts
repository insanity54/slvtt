import { describe, it, expect, beforeAll } from 'vitest';
import { sampleVideo } from '../src/constants';
import { exec } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getRandomId } from '../src/random';
import { promises as fs } from 'node:fs';

const outputDir = join(tmpdir(), getRandomId())

function execAsync(command: string): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
        });
    });
}

describe('bin', () => {
    let stderr: string;
    let stdout: string;

    beforeAll(async () => {
        const command = `ts-node ./bin/slvtt.ts --input ${sampleVideo} --output ${outputDir}`;
        const result = await execAsync(command);
        stderr = result.stderr;
        stdout = result.stdout;
    });

    it('creates vtt file', async () => {
        const vttPath = join(outputDir, 'storyboard.vtt');
        const stat = await fs.stat(vttPath);
        expect(stat.isFile()).toBe(true);
    });

    it('creates sheet files', async () => {
        const files = await fs.readdir(outputDir);
        const sheets = files.filter((f) => f.endsWith('.webp'));
        expect(sheets.length).toBeGreaterThan(0);
    });
});
