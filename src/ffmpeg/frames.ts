import { VideoFrameInfo, ResolvedSLVTTOptions, Sample } from '../types/types';
import { getFrameFilePath } from '../directory';
import { promisePool } from '../pool';
import { callFFmpeg } from './invoke';


export async function getFrames(
    config: ResolvedSLVTTOptions,
    samples: Sample[],
): Promise<VideoFrameInfo[]> {
    if (!samples) throw new Error('missing second arg, "samples"')
    const tasks = samples.map((sample) => () => {
        const frameOutputPath = getFrameFilePath(config.tmpDir, sample.index);
        return extractFrame(
            config.videoFilePath,
            frameOutputPath,
            sample.formatted,
            config.frameWidth,
            config.frameHeight
        );
    });

    await promisePool(tasks, { limit: config.concurrencyLimit });

    return samples.map((s) => ({
        index: s.index,
        timestamp: s.timestamp,
        filename: getFrameFilePath(config.tmpDir, s.index),
        height: config.frameHeight,
        width: config.frameWidth,
    }));
}


export async function extractFrame(
    videoFilePath: string,
    frameOutputPath: string,
    formattedDuration: string,
    frameWidth: number,
    frameHeight: number,
): Promise<void> {
    const args = [
        '-ss', formattedDuration,
        '-i', videoFilePath,
        '-vframes', '1',
        '-s', `${frameWidth}x${frameHeight}`,
        frameOutputPath
    ]
    await callFFmpeg(args);
}
