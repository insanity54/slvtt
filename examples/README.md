# Examples

## Javascript Library

see ./example.ts

## CLI

There is no need to run these example commands-- they have already been run for you and the output is displayed in the examples/ subfolders.

### Basic slvtt usage

    ./dist/cli.cjs --input ./test/fixtures/sample.mp4 --output ./examples/basic


### Higher concurrency

Run with caution-- higher concurrency may lag your computer.

    ./dist/cli.cjs --input ./test/fixtures/sample.mp4 --output ./examples/concurrency --samples 100 --concurrency 20


### Lots of samples

    ./dist/cli.cjs --input ./test/fixtures/sample.mp4 --output ./examples/lots --samples 420


### Tiny frames

    ./dist/cli.cjs --input ./test/fixtures/sample.mp4 --output ./examples/tiny --frame-height 30 --frame-width 53


### Lots of columns

    ./dist/cli.cjs --input ./test/fixtures/sample.mp4 --output ./examples/columns --columns 20 --rows 1


