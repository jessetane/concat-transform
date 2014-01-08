# concat-transform
transform stream that defers executing `_transform` until end

[![Browser Support](http://ci.testling.com/jessetane/concat-transform.png)](http://ci.testling.com/jessetane/concat-transform)

## why
useful if you have a transformation that can only be performed atomically - this was factored out of an attempt to fake streams for [zlib-browserify](github.com/brianloveswords/zlib-browserify)

## how
subclass of `stream.Transform` that buffers into memory

## tests
* in node: `node test`
* in browser: `npm run browser` (get browserify and bash first)

## license
WTFPL
