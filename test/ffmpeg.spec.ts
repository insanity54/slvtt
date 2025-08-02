import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { getFrames, extractFrame } from '../src/ffmpeg/frames';
import { pad, formatDuration } from '../src/ffmpeg/format';
import { createTmpDir } from '../src/directory';
import { sampleVideo } from '../src/constants';
import { Sample, VideoFrameInfo, ResolvedSLVTTOptions, VideoFrameSheetConfig } from '../src/types/types';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { rmSync } from 'fs';
import { rm, stat } from 'fs/promises';
import { getRandomId } from '../src/random';
import { getSamples } from '../src/samples';
import { getVideoMetadata } from '../src/ffprobe';

describe('ffmpeg', () => {


    describe('extractFrame integration', () => {
        const tmpDir = join(tmpdir(), `test-${Date.now()}`);
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


    describe('getFrames', () => {
        describe('integration', () => {
            let frameFilePaths: VideoFrameInfo[]
            let tmpDir: string;
            let outputDirectory = join(tmpdir(), getRandomId())
            const numSamples = 20;

            beforeAll(async () => {
                tmpDir = await createTmpDir()
                const config: ResolvedSLVTTOptions = {
                    videoFilePath: sampleVideo,
                    numSamples,
                    frameHeight: 30,
                    frameWidth: 53,
                    concurrencyLimit: 1,
                    outputDirectory,
                    cols: 5,
                    rows: 3,
                    tmpDir,
                }
                const metadata = await getVideoMetadata(sampleVideo)
                const samples: Sample[] = getSamples(metadata, numSamples)
                frameFilePaths = await getFrames(config, samples)
            }, 30_000)

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
        it('formats 0 seconds correctly', () => {
            expect(formatDuration(0)).toBe('00:00:00.000');
        });

        it('formats fractional seconds under 1 second', () => {
            expect(formatDuration(0.123)).toBe('00:00:00.123');
        });

        it('formats exact seconds correctly', () => {
            expect(formatDuration(5)).toBe('00:00:05.000');
        });

        it('formats minutes and seconds correctly', () => {
            expect(formatDuration(65)).toBe('00:01:05.000');
        });

        it('formats hours, minutes, seconds and milliseconds', () => {
            expect(formatDuration(3661.123)).toBe('01:01:01.123');
        });

        it('pads all values correctly', () => {
            expect(formatDuration(3723.004)).toBe('01:02:03.004');
        });
    });

});