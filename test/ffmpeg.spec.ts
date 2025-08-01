import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { getFrames, extractFrame } from '../src/ffmpeg/frames';
import { pad, formatDuration } from '../src/ffmpeg/format';
import { createTmpDir } from '../src/directory';
import { sampleVideo } from '../src/constants';
import { Sample, VideoFrameInfo, ResolvedSLVTTOptions, VideoFrameSheetConfig } from '../src/types/types';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync } from 'node:fs';
import { rm, stat } from 'node:fs/promises';
import { getRandomId } from '../src/random';
import { getSamples } from '../src/samples';
import { getVideoMetadata } from '../src/ffprobe';

describe('ffmpeg', () => {


    describe('extractFrame integration', () => {
        const tmpDir = join(tmpdir(), `extract-frame-test-${Date.now()}`);
        const frameOutputPath = join(tmpDir, 'frame.jpg');

        beforeAll(() => {
            // ensure the tmp directory exists
            require('fs').mkdirSync(tmpDir, { recursive: true });
        });

        afterAll(() => {
            // cleanup after test
            rmSync(tmpDir, { recursive: true, force: true });
        });

        it('extracts a single frame and writes it to disk', { timeout: 30_000 }, async () => {
            await extractFrame(
                sampleVideo,
                frameOutputPath,
                '00:00:01.000', // 1 second into video
                320,
                180
            );

            const fileStats = await stat(frameOutputPath);
            expect(fileStats.isFile()).toBe(true);
            expect(fileStats.size).toBeGreaterThan(0);
        });
    });


    describe('getFrames', async () => {
        describe('integration', async () => {
            let frameFilePaths: VideoFrameInfo[]
            let tmpDir = await createTmpDir()
            let outputDirectory = join(tmpdir(), getRandomId())
            const numSamples = 30;

            beforeAll(async () => {
                const config: ResolvedSLVTTOptions = {
                    videoFilePath: sampleVideo,
                    numSamples,
                    frameHeight: 69,
                    frameWidth: 140,
                    concurrencyLimit: 3,
                    outputDirectory,
                    cols: 5,
                    rows: 3,
                    tmpDir,
                }
                const metadata = await getVideoMetadata(sampleVideo)
                const samples: Sample[] = getSamples(metadata, numSamples)
                frameFilePaths = await getFrames(config, samples)
            })

            it('creates individual video frames', async () => {
                expect(frameFilePaths).toHaveLength(numSamples)
            })
        })

    });



    describe('samples', () => {
        describe('integration', async () => {
            let samples: Sample[];
            const numSamples = 30;

            beforeAll(async () => {
                const metadata = await getVideoMetadata(sampleVideo);
                samples = getSamples(metadata, numSamples)
            })


            it(`gets ${numSamples} samples`, async () => {
                expect(samples).toHaveLength(numSamples)
            })
        })


    });




    describe('pad()', () => {
        it('pads single digit numbers with zeros', () => {
            expect(pad(1)).toBe('01');
            expect(pad(9, 3)).toBe('009');
        });

        it('does not pad if number already meets width', () => {
            expect(pad(10)).toBe('10');
            expect(pad(1234, 3)).toBe('1234');
        });

        it('returns string even for zero', () => {
            expect(pad(0)).toBe('00');
            expect(pad(0, 4)).toBe('0000');
        });
    });

    describe('formatDuration()', () => {
        it('formats 0 ms correctly', () => {
            expect(formatDuration(0)).toBe('00:00:00.000');
        });

        it('formats milliseconds under 1 second', () => {
            expect(formatDuration(123)).toBe('00:00:00.123');
        });

        it('formats exact seconds correctly', () => {
            expect(formatDuration(5000)).toBe('00:00:05.000');
        });

        it('formats minutes and seconds correctly', () => {
            expect(formatDuration(65000)).toBe('00:01:05.000');
        });

        it('formats hours, minutes, seconds and milliseconds', () => {
            expect(formatDuration(3661123)).toBe('01:01:01.123');
        });

        it('pads all values correctly', () => {
            expect(formatDuration(3723004)).toBe('01:02:03.004');
        });
    });
});