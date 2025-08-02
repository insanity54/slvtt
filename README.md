# slvtt

[![CI](https://github.com/insanity54/slvtt/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/insanity54/slvtt/actions/workflows/main.yml)

*<b>S</b>uper<b>l</b>ative <b>V</b>ideo <b>T</b>humbnail <b>T</b>hing*

Create video sprites aka thumbnails aka storyboards aka "timeline hover previews" and a WEBVTT file. Creates output suitable for the following video player plugins.

* https://github.com/chrisboustead/videojs-vtt-thumbnails
* https://github.com/mayeaux/videojs-vtt-thumbnails

## Sample input

![sample.mp4](https://github.com/insanity54/slvtt/blob/main/test/fixtures/sample.mp4?raw=true)

## Sample output

![Sprite sheet 1: grid of video frames](https://github.com/insanity54/slvtt/blob/main/examples/basic/sheet-1.webp?raw=true)
![Sprite sheet 2: grid of video frames](https://github.com/insanity54/slvtt/blob/main/examples/basic/sheet-2.webp?raw=true)
![Sprite sheet 3: grid of video frames](https://github.com/insanity54/slvtt/blob/main/examples/basic/sheet-3.webp?raw=true)
![Sprite sheet 4: grid of video frames](https://github.com/insanity54/slvtt/blob/main/examples/basic/sheet-4.webp?raw=true)

![vtt file describing the sheets of video frames](https://github.com/insanity54/slvtt/blob/main/examples/basic/sl.vtt?raw=true)


## Software Dependencies

* libvips
* ffmpeg
* ffprobe
* nodejs >= V22.6.0

## Project Requirements

* [x] Test Driven Development
* [x] Minimal dependencies
* [x] Extract idividual frames
* [x] Combine frames into a sheet
* [x] Generate .vtt
* [x] CI tests passing
* [ ] Published on npm

## Installation

Make sure you have the above software dependencies installed. For installing node, I recommend [nvm](https://github.com/nvm-sh/nvm#install--update-script)


## Usage

Here is a quick guide on the two usage methods. For more details, See ./examples/

### CLI

Install dependencies

    npm install

Build the CLI program.

    npm run build

Run the CLI to create VideoFrameSheets

    ./dist/cli.cjs --input ./test/fixtures/sample.mp4 --output ~/Desktop/output-example

### Library

```ts
    import { create, type SLVTTOptions } from '@insanity54/slvtt';
    import { tmpdir } from 'node:os';
    import { join } from 'node:path';
    
    const inputVideo = // an absolute path to your video
    const outputDirectory = join(tmpdir(), 'slvtt-basic');

    const options: SLVTTOptions = {
        videoFilePath: inputVideo,
        outputDirectory
    };

    async function main() {
        await create(options);
        console.log(`output saved to ${outputDirectory}`)
    }

    main()
```

## Name gripes

Naming things is hard, especially when it comes to naming the things we are generating with this library. There is no universal standard and no agreement. It's really difficult to find this sort of stuff because of that. The industry refers to these things as the following.

* Video Storyboards
* Timeline Hover Previews
* Video Spritesheets 
* Preview Images
* Contact Sheets
* Video Thumbnails.

I don't like calling these things thumbs, stories, or sprites, because those words already mean something completely unrelated. Thumbnails are part of your hand, stories are in books, sprites are tiny mystical creatures. RIP SEO when using any of these words.

### What we call it

This repository reinvents the wheel in an attempt to simplify the taxonomy.

We use `VideoFrame` to describe a singular, individual video frame that we captured from a video.
We use `VideoFrameSheet` to describe a composite image consisting of rows and columns of `VideoFrames`.

Abbreviated in code, we use `frames` and `sheets`.