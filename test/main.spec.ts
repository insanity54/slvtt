import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { create } from '../src/main';
import { SLVTTOptions } from '../src/types/types';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sampleVideo } from '../src/constants';
import { readdir, readFile } from 'node:fs/promises';
import { rmSync } from 'node:fs';
import { directoryExists } from '../src/directory';
import { getRandomId } from '../src/random';


describe('createStoryboard integration', () => {

    const integrationTmp = join(tmpdir(), getRandomId());
    const outputDirectory = join(tmpdir(), getRandomId())
    const numSamples = 3

    const options: SLVTTOptions = {
        tmpDir: integrationTmp,
        videoFilePath: sampleVideo,
        numSamples,
        outputDirectory,
        concurrencyLimit: 4,
        rows: 15,
        cols: 3,
    };

    beforeAll(async () => {
        await create(options);
    });

    afterAll(() => {
        rmSync(outputDirectory, { recursive: true, force: true });
    });

    it('removes tmpDir', async () => {
        await expect(directoryExists(integrationTmp)).resolves.toBeFalsy();
    });

    it('creates output dir', async () => {
        await expect(directoryExists(join(outputDirectory))).resolves.toBeTruthy()
    });

    it('creates video frame sheets', async () => {
        const files = await readdir(outputDirectory);
        const sheetFiles = files.filter(f => f.includes('sheet') && f.endsWith('.webp'));
        expect(sheetFiles.length).toBeGreaterThan(0);
    });

    it('creates a VTT file', async () => {
        const files = await readdir(outputDirectory);
        const vttFile = files.find(f => f.endsWith('.vtt'));
        expect(vttFile).toBeDefined();

        const vttContent = await readFile(join(outputDirectory, vttFile!), 'utf-8');
        expect(vttContent).toContain('WEBVTT');
    });
});
