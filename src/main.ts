import { createTmpDir, deleteTmpDir, createOutputDir } from "./directory";
import { getFrames } from "./ffmpeg/frames";
import { createVideoFrameSheets } from './ffmpeg/sheets';
import { getVideoMetadata } from "./ffprobe";
import { renderVTT, calculateFrameDuration } from "./vtt";
import { SLVTTManifest, SLVTTOptions } from "./types/types";
import { getSamples } from "./samples";
import defaults from './config/defaults';
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function create(userSuppliedOptions: SLVTTOptions): Promise<void> {
    const options = Object.assign({}, defaults, userSuppliedOptions)

    options.tmpDir = await createTmpDir();

    const manifest: SLVTTManifest = {
        options: options as Required<SLVTTOptions>,
        samples: [],
        frames: [],
        sheets: [],
        vtt: '',
    };

    try {
        await createOutputDir(options.outputDirectory)
        manifest.metadata = await getVideoMetadata(manifest.options.videoFilePath);
        manifest.samples = getSamples(manifest.metadata, manifest.options.numSamples)
        manifest.frames = await getFrames(manifest.options, manifest.samples)
        manifest.sheets = await createVideoFrameSheets(manifest.options, manifest.frames, manifest.options.outputDirectory)
        manifest.vtt = renderVTT(
            manifest.options.frameHeight,
            manifest.options.frameWidth,
            manifest.options.cols,
            manifest.options.rows,
            calculateFrameDuration(manifest.metadata.duration, manifest.options.cols, manifest.options.rows, manifest.sheets.length),
            manifest.sheets)
        await writeFile(join(manifest.options.outputDirectory, `sl.vtt`), manifest.vtt, { encoding: 'utf-8' });
    } catch (e) {
        throw e instanceof Error ? e : new Error(String(e));
    } finally {
        if (manifest.options.tmpDir) {
            await deleteTmpDir(manifest.options.tmpDir);
        }
    }
}

