// use the following import in production
// import { create, type SLVTTOptions } from 'slvtt'; 

// use the next two import for testing
import { create } from '../src/main.ts';
import { SLVTTOptions } from '../src/types/types';


import { tmpdir } from 'node:os';
import { join } from 'node:path';

const __dirname = import.meta.dirname
const sampleVideo = join(__dirname, '..', 'test', 'fixtures', 'sample.mp4')
const outputDirectory = join(tmpdir(), 'slvtt-tiny');
const tmpDir = join(tmpdir(), 'slvtt-temp')


const options: SLVTTOptions = {
    videoFilePath: sampleVideo,
    outputDirectory,
    frameWidth: 53,
    frameHeight: 30,
    numSamples: 420,
    tmpDir: tmpDir,
    concurrencyLimit: 20,
    rows: 3,
    cols: 30,
};

async function main() {
    await create(options);
    console.log(`output saved to ${outputDirectory}`)
}

main()