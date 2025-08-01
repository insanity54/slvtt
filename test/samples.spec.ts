import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { getSamples } from '../src/samples';
import { sampleVideo } from '../src/constants';
import { VideoMetadata, Sample } from '../src/types/types';
import { getVideoMetadata } from '../src/ffprobe';


describe('samples', () => {


    describe('integration', () => {

        let metadata: VideoMetadata;
        let samples: Sample[];
        const numSamples = 30

        beforeAll(async () => {
            metadata = await getVideoMetadata(sampleVideo)
            samples = getSamples(metadata, numSamples)
        })

        it('contains index, timestamps, and formatted', async () => {
            for (const sample of samples) {
                expect(sample).toHaveProperty('index');
                expect(sample).toHaveProperty('timestamp');
                expect(sample).toHaveProperty('formatted');
            }
        })

        it('timestamps should be unique', async () => {
            const seen = new Set()
            for (let i = 0; i < samples.length; i++) {
                const timestamp = samples[i].timestamp
                expect(seen.has(timestamp)).toBe(false)
                seen.add(timestamp)
            }
        })

    })

})

