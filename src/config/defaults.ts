import type { SLVTTOptions } from '../types/types.js'

const defaults: Required<Omit<SLVTTOptions, 'videoFilePath' | 'outputDirectory' | 'tmpDir'>> = {
    frameWidth: 140,
    frameHeight: 76,
    numSamples: 540,
    concurrencyLimit: 4,
    cols: 9,
    rows: 6,
}

export default defaults