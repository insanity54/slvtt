import { Sample, StoryboardOptions, VideoMetadata } from "./types/types";
import { formatDuration } from "./ffmpeg/format";

export function getSamples(metadata: VideoMetadata, numSamples: number): Sample[] {
    const captureInterval = metadata.duration / numSamples; // in milliseconds

    const samples: Sample[] = [];

    for (let i = 0; i < numSamples; i++) {
        const ms = Math.floor(i * captureInterval);
        samples.push({ timestamp: ms, formatted: formatDuration(ms), index: i });
    }

    return samples;
}