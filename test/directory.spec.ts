import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { extractFrames } from '../src/ffmpeg';
import { tmpdir } from 'os';
import { createTmpDir, directoryExists } from '../src/directory';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';


describe('directory', () => {
    describe('createTmpDir', () => {
        let dir: string

        beforeAll(async () => {
            dir = await createTmpDir()
        })

        it('exists', async () => {
            const stats = await stat(dir);
            expect(stats.isDirectory()).toBe(true);
        })


    })

    describe('directoryExists', () => {
        it('resolves true when the specified dir exists', async () => {
            const dir = tmpdir()
            await expect(directoryExists(dir)).resolves.toBeTruthy()
        })

        it('resolves false when the specified dir does not exist', async () => {
            const dir = '/hakunna-mattatta-this-directory-definitely-does-not-exist'
            await expect(directoryExists(dir)).resolves.toBeFalsy()
        })
    })

})
