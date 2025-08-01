import sharp from 'sharp';
import fs from 'fs/promises';
import { join } from 'path';
import { ResolvedSLVTTOptions, VideoFrameInfo, VideoFrameSheetConfig } from '../types/types';

export async function createVideoFrameSheets(
  config: ResolvedSLVTTOptions,
  frames: VideoFrameInfo[],
  outputDirectory: string,
): Promise<VideoFrameSheetConfig[]> {
  const { frameHeight, frameWidth, cols, rows } = config;

  const framesPerSheet = cols * rows;
  const totalSheets = Math.ceil(frames.length / framesPerSheet);

  const sheetConfigs: VideoFrameSheetConfig[] = [];

  for (let i = 0; i < totalSheets; i++) {
    const start = i * framesPerSheet;
    const end = start + framesPerSheet;
    const framesForSheet = frames.slice(start, end);

    // If we have fewer than required, fill with blank frames
    const paddedFrames = [...framesForSheet];

    while (paddedFrames.length < framesPerSheet) {
      paddedFrames.push({
        index: -1,
        timestamp: 0,
        filename: '', // we'll detect this and fill with black
        height: frameHeight,
        width: frameWidth,
      });
    }

    const outputFileName = `sheet-${i + 1}.webp`;
    const outputFilePath = join(outputDirectory, outputFileName);

    await createVideoFrameSheet(
      paddedFrames,
      frameWidth * cols,
      frameHeight * rows,
      cols,
      outputFilePath
    );

    sheetConfigs.push({
      frameWidth,
      frameHeight,
      cols,
      rows,
      sheetFilePath: outputFileName,
    });
  }

  return sheetConfigs;
}

export async function createVideoFrameSheet(
  frames: VideoFrameInfo[],
  width: number,
  height: number,
  cols: number,
  outputFilePath: string,
): Promise<void> {
  const background = {
    create: {
      width,
      height,
      channels: 3 as const,
      background: { r: 0, g: 0, b: 0 },
    },
  };

  const composites: sharp.OverlayOptions[] = await Promise.all(
    frames.map(async (frame, i) => {
      const top = Math.floor(i / cols) * frame.height;
      const left = (i % cols) * frame.width;

      // If filename is missing, use a blank buffer
      if (!frame.filename) {
        const blank = await sharp({
          create: {
            width: frame.width,
            height: frame.height,
            channels: 3,
            background: { r: 0, g: 0, b: 0 },
          },
        }).png().toBuffer();

        return { input: blank, top, left };
      }

      return {
        input: frame.filename,
        top,
        left,
      };
    })
  );

  await sharp(background)
    .composite(composites)
    .jpeg()
    .toFile(outputFilePath);
}
