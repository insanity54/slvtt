import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { mkdir, rm, stat } from 'node:fs/promises';
import { getRandomId } from './random';
import { readdir } from 'node:fs';

const tmpPrefix = resolve(tmpdir())


export async function createTmpDir() {
    const tmpDirPath = join(tmpdir(), getRandomId());
    const sheetDirPath = join(tmpDirPath, 'sheets');
    const framesDirPath = join(tmpDirPath, 'frames');
    const vttDirPath = join(tmpDirPath, 'vtt');
    await mkdir(sheetDirPath, { recursive: true })
    await mkdir(framesDirPath)
    await mkdir(vttDirPath)
    return tmpDirPath
}

export async function deleteTmpDir(tmpDir: string) {
    const resolved = resolve(tmpDir);

    // Safety check-- ensure it's under the OS tmpdir
    if (!resolved.startsWith(tmpPrefix)) {
        throw new Error(`Refusing to delete non-tmp directory: ${resolved}`)
    }

    await rm(tmpDir, { recursive: true, force: true });
}

export function getFrameFilePath(tmpDir: string, frameNumber: number) {
    return join(tmpDir, 'frames', `frame-${frameNumber}.jpg`);
}

export function getSheetFilePath(tmpDir: string, sheetNumber: number) {
    return join(tmpDir, 'sheets', `sheet-${sheetNumber}.webp`);
}

export function getVttFilePath(tmpDir: string) {

}

export async function createOutputDir(outputDir: string): Promise<void> {
    const exists = await directoryExists(outputDir)
    if (!exists) {
        await mkdir(outputDir, { recursive: true });
    }
}

export async function directoryExists(path: string): Promise<boolean> {
    try {
        const s = await stat(path);
        return s.isDirectory();
    } catch {
        return false;
    }
}