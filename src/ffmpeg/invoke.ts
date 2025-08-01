
import { spawn } from 'node:child_process';


export async function callFFmpeg(args: any): Promise<void> {
    return new Promise((resolve, reject) => {

        let stdoutData = '';
        let stderrData = '';

        const ffmpeg = spawn("ffmpeg", args);

        ffmpeg.stdout.on('data', (chunk) => {
            stdoutData += chunk.toString();
        })

        ffmpeg.stderr.on('data', (chunk) => {
            stderrData += chunk.toString();
        })

        ffmpeg.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`ffmpeg exited with code ${code}\n${stderrData}`));
            }

            return resolve();
        })


        ffmpeg.on('error', (err) => {
            return reject(new Error(`Failed to start ffmpeg process: ${err}`));
        });
    })
}