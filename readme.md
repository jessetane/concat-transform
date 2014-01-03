# concat-transform
transform stream that defers executing `_transform` until end

[![Browser Support](http://ci.testling.com/jessetane/concat-transform.png)](http://ci.testling.com/jessetane/concat-transform)

## why
you have a transformation that can only be performed atomically

## how
subclass of `stream.Transform` that buffers into memory

## tests
node: `node test`  
browser: `require('concat-transform/test')`

## license
WTFPL
