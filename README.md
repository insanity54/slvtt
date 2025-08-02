# slvtt

*<b>S</b>uper<b>l</b>ative <b>V</b>ideo <b>T</b>humbnail <b>T</b>hing*

Create video sprites aka thumbnails aka storyboards aka "timeline hover previews" and a WEBVTT file. Creates output suitable for the following video player plugins.

* https://github.com/chrisboustead/videojs-vtt-thumbnails
* https://github.com/mayeaux/videojs-vtt-thumbnails

## Software Dependencies

* libvips
* ffmpeg
* ffprobe
* nodejs >= V22.6.0

## Project Requirements

* [x] Test Driven Development
* [x] Minimal dependencies
* [x] Extract idividual frames
* [x] Combine frames into a storyboard
* [x] Generate .vtt
* [ ] CI tests passing
* [ ] Published on npm

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