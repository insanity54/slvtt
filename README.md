# slvtt

*<b>S</b>uper<b>l</b>ative <b>V</b>ideo <b>T</b>humbnail <b>T</b>hing*

Create video sprites aka thumbnails aka storyboards aka "timeline hover previews" and a VTT to go. Creates output suitable for the following video player plugins.

* https://github.com/chrisboustead/videojs-vtt-thumbnails
* https://github.com/mayeaux/videojs-vtt-thumbnails

## Software Dependencies

* libvips
* ffmpeg
* ffprobe
* nodejs >= V22.6.0

## Project Requirements

* [x] Test Driven Development
* [ ] Minimal dependencies
* [ ] Extract idividual frames
* [ ] Combine frames into a storyboard
* [ ] Generate .vtt
* [ ] CI tests passing
* [ ] Published on npm




## Project structure

```txt
slvtt/
├── bin/
│   └── cli.js                  # Optional CLI wrapper for using the library from terminal
├── dist/                       # Compiled output (e.g., from TypeScript or bundler)
├── docs/
│   └── usage.md                # Documentation for how to use the library
├── examples/
│   └── basic.js                # Minimal usage examples
├── src/
│   ├── index.ts                # Main entry point
│   ├── config/
│   │   └── defaults.ts         # Default configuration values
│   ├── ffmpeg/
│   │   ├── generateThumbnails.ts  # Handles calling ffmpeg for thumbnails
│   │   └── generateSprite.ts      # Handles sprite sheet creation
│   ├── vtt/
│   │   └── generateVtt.ts      # Generates .vtt metadata from thumbnails
│   ├── utils/
│   │   ├── pathHelpers.ts      # File system utilities
│   │   └── timeHelpers.ts      # Helpers for formatting timestamps
│   └── types/
│       └── index.d.ts          # Type definitions for config, options, etc.
├── test/
│   ├── ffmpeg.test.ts
│   ├── vtt.test.ts
│   └── integration.test.ts     # Full pipeline test
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── jest.config.js
├── package.json
├── README.md
├── tsconfig.json
└── vitest.config.ts            # or any other test runner config
```


## Gripes

Naming things is hard, especially when it comes to naming the things we are generating with this library. There is no universal standard and no agreement. It's really difficult to find this sort of stuff because of that. The industry refers to these things as the following.

* Video Storyboards
* Timeline Hover Previews
* Video Spritesheets 
* Preview Images
* Contact Sheets
* Video Thumbnails.

I don't like calling these things thumbs, stories, or sprites, because those words already mean something completely unrelated. Thumbsnails are part of your hand, stories are in books, sprites are tiny mystical creatures. RIP SEO when using any of these words.

### What we call it

This repository reinvents the wheel in an attempt to simplify what we're working with.

We use `VideoFrame` to describe a singular, individual video frame that we captured from a video.
We use `VideoFrameSheet` to describe a composite image consisting of rows and columns of `VideoFrames`.

Abbreviated in code, we use `frames` and `sheets`.