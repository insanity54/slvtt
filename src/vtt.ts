import { ResolvedSLVTTOptions, VideoFrameSheetConfig, VideoMetadata, SLVTTManifest } from "./types/types";



export function formatTimestamp(seconds: number): string {
    const ms = Math.round((seconds % 1) * 1000)
    const totalSeconds = Math.floor(seconds)
    const s = totalSeconds % 60
    const m = Math.floor((totalSeconds / 60) % 60)
    const h = Math.floor(totalSeconds / 3600)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

export function calculateFrameDuration(
    videoDuration: number,
    frameColumns: number,
    frameRows: number,
    sheetCount: number,
): number {
    if (videoDuration <= 0) throw new Error("videoDuration must be greater than 0")
    if (frameColumns <= 0) throw new Error("frameColumns must be greater than 0")
    if (frameRows <= 0) throw new Error("frameRows must be greater than 0")
    if (sheetCount <= 0) throw new Error("sheetCount must be greater than 0")

    const framesPerSheet = frameColumns * frameRows
    const totalFrames = framesPerSheet * sheetCount

    return videoDuration / totalFrames
}

export function prepareVTTInput(
    manifest: Required<SLVTTManifest>
): [number, number, number, number, number, VideoFrameSheetConfig[]] {
    const frameHeight = manifest.options.frameHeight
    const frameWidth = manifest.options.frameWidth
    const cols = manifest.options.cols
    const rows = manifest.options.rows
    const sheets = manifest.sheets
    const videoDuration = manifest.metadata.duration

    const frameDuration = calculateFrameDuration(
        videoDuration,
        cols,
        rows,
        sheets.length
    )

    return [frameHeight, frameWidth, cols, rows, frameDuration, sheets]
}

export function renderVTT(
    frameHeight: number,
    frameWidth: number,
    cols: number,
    rows: number,
    frameDuration: number,
    sheets: VideoFrameSheetConfig[]
): string {
    const framesPerSheet = cols * rows
    const totalFrames = framesPerSheet * sheets.length

    let vtt = 'WEBVTT\n\n'

    for (let i = 0; i < totalFrames; i++) {
        const sheetIndex = Math.floor(i / framesPerSheet)
        const frameIndexInSheet = i % framesPerSheet
        const col = frameIndexInSheet % cols
        const row = Math.floor(frameIndexInSheet / cols)
        const x = col * frameWidth
        const y = row * frameHeight
        const start = formatTimestamp(i * frameDuration)
        const end = formatTimestamp((i + 1) * frameDuration)

        const sheetFile = sheets[sheetIndex].sheetFilePath

        vtt += `${start} --> ${end}\n`
        vtt += `${sheetFile}#xywh=${x},${y},${frameWidth},${frameHeight}\n\n`
    }

    return vtt.trim() + '\n'
}
