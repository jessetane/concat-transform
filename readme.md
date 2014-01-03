# concat-transform
transform stream that defers executing `_transform` until end

## why
you have a transformation that can only be performed atomically

## how
subclass of `stream.Transform` that buffers into memory

## tests
node: `node test`
browser: `require('concat-transform/test')`

## license
WTFPL
