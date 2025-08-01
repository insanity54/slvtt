import { sampleVideo } from "../../src/constants";
import { getRandomId } from "../../src/random";
import { VideoFrameSheetConfig, ResolvedSLVTTOptions, VideoMetadata, SLVTTManifest } from "../../src/types/types"
import { tmpdir } from "node:os";
import { join } from "node:path";

export const mockSheets: VideoFrameSheetConfig[] = [
    {
        frameWidth: 160,
        frameHeight: 90,
        cols: 2,
        rows: 2,
        sheetFilePath: 'sheet-0.webp',
    },
    {
        frameWidth: 160,
        frameHeight: 90,
        cols: 2,
        rows: 2,
        sheetFilePath: 'sheet-1.webp',
    },
]


export const mockMetadata: VideoMetadata = {
    width: 1920,
    height: 1080,
    duration: 8,
    fps: 24.9
}

export const mockConfig: ResolvedSLVTTOptions = {
    tmpDir: join(tmpdir(), getRandomId()),
    outputDirectory: join(tmpdir(), getRandomId()),
    frameHeight: 40,
    frameWidth: 180,
    numSamples: 3,
    videoFilePath: sampleVideo,
    concurrencyLimit: 3,
    rows: 3,
    cols: 10,
};
