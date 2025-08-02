
/**
 * User-facing options for generating storyboards.
 */
export interface SLVTTOptions {
    videoFilePath: string
    outputDirectory: string
    frameWidth?: number
    frameHeight?: number
    numSamples?: number
    tmpDir?: string
    concurrencyLimit?: number
    rows?: number
    cols?: number
}


/**
 * Options merged with defaults — used internally.
 */
export type ResolvedSLVTTOptions = Required<SLVTTOptions>

/**
 * Basic metadata extracted from the video.
 */
export interface VideoMetadata {
    width: number           // source video width
    height: number          // source video height
    duration: number        // in seconds
    fps?: number            // optional, may not always be available
}

/**
 * Represents the time domain of the sample we are going to gather
 */
export interface Sample {
    timestamp: number         // milliseconds
    formatted: string         // suitable for feeding into ffmpeg -ss ${formattedDuration}
    index: number
}

/**
 * Represents a single frame captured from the video.
 */
export interface VideoFrameInfo {
    index: number             // nth frame
    timestamp: number         // in seconds
    filename: string
    height: number
    width: number
}

/**
 * Configuration for building a VideoFrameSheet
 */
export interface VideoFrameSheetConfig {
    cols: number
    rows: number
    frameWidth: number
    frameHeight: number
    sheetFilePath: string
}

/**
 * Represents one entry (cue) in the .vtt file.
 */
export interface VTTCue {
    start: number           // cue start time in seconds
    end: number             // cue end time in seconds
    x: number               // px from left in VideoFrameSheet
    y: number               // px from top in VideoFrameSheet
    width: number           // cue width (usually frameWidth)
    height: number          // cue height (usually frameHeight)
    sheetFilename: string   // reference to VideoFrameSheet image
}


/**
 * Represents the top-level inputs and outputs as the program runs
 */
export interface SLVTTManifest {
    options: ResolvedSLVTTOptions
    samples?: Sample[]
    metadata?: VideoMetadata
    frames?: VideoFrameInfo[]
    sheets?: VideoFrameSheetConfig[]
    vtt?: string
}