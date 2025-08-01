import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { getVideoMetadata, FFprobeStats, pad, formatDuration } from '../src/ffprobe';
import { sampleVideo } from '../src/constants';


describe('getVideoMetadata', () => {
    let metadata: FFprobeStats;

    beforeAll(async () => {
        metadata = await getVideoMetadata(sampleVideo)
    })

    it('extracts video width, height, and duration', async () => {
        expect(metadata.width).toBe(1920);
        expect(metadata.height).toBe(1080);
        expect(metadata.duration).toBe(63.375);
    })

})

