
import { spawn } from 'node:child_process';
import { VideoMetadata } from './types/types';


export interface FFprobeStats {
    width: number,
    height: number,
    duration: number,
}



export function parseFFprobeStdout(stdout: string): FFprobeStats {
    const output = JSON.parse(stdout);
    const width = output.streams[0].width;
    const height = output.streams[0].height;
    const duration = parseFloat(output.format.duration);

    return { width, height, duration };
}

export async function getVideoMetadata(videoFilePath: string): Promise<FFprobeStats> {
    return new Promise((resolve, reject) => {

        let stdoutData = '';
        let stderrData = '';

        const ffprobe = spawn("ffprobe", [
            "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height",
            "-show_format",
            "-of", "json",
            videoFilePath
        ]);

        ffprobe.stdout.on('data', (chunk) => {
            stdoutData += chunk.toString();
        })

        ffprobe.stderr.on('data', (chunk) => {
            stderrData += chunk.toString();
        })

        ffprobe.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`ffprobe exited with code ${code}\n${stderrData}`));
            }

            const metadata: VideoMetadata = parseFFprobeStdout(stdoutData)
            return resolve(metadata);
        })


        ffprobe.on('error', (err) => {
            return reject(new Error(`Failed to start ffprobe process: ${err}`));
        });
    })



}


