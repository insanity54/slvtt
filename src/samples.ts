import { Sample, VideoMetadata } from "./types/types";
import { formatDuration } from "./ffmpeg/format";

export function getSamples(metadata: VideoMetadata, numSamples: number): Sample[] {
    const captureInterval = metadata.duration / numSamples;

    const samples: Sample[] = [];

    for (let i = 0; i < numSamples; i++) {
        const seconds = Math.floor(i * captureInterval);
        samples.push({ timestamp: seconds, formatted: formatDuration(seconds), index: i });
    }

    return samples;
}