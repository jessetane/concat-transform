var stream = require('stream');
var inherits = require('inherits');

module.exports = ConcatTransform;

function ConcatTransform(opts) {
  if (!(this instanceof ConcatTransform))
    return new ConcatTransform(opts); 
  
  this._concatBuffer = null;
  this._concatEnding = false;
  
  stream.Transform.call(this, opts);
}
inherits(ConcatTransform, stream.Transform);

ConcatTransform.prototype._write = function(chunk, encoding, cb) {
  if (this._transform !== _transform) {
    this._concatTransform = this._transform;
    this._transform = _transform;
  }
  
  if (this._concatEnding) {
    this._transform = this._concatTransform;
  }
  else if (chunk) {
    bufferChunk.call(this, chunk, encoding);
  }
  
  return stream.Transform.prototype._write.call(this, chunk, encoding, cb);
};

ConcatTransform.prototype.end = function(chunk, encoding, cb) {
  if (chunk) bufferChunk.call(this, chunk, encoding);
  
  this._concatEnding = true;
  chunk = this._concatBuffer;
  
  return stream.Writable.prototype.end.call(this, chunk, encoding, cb);
};

function bufferChunk(chunk, encoding) {
  var ws = this._writableState;
  
  if (ws.objectMode) {
    if (this._concatBuffer) {
      this._concatBuffer.push(chunk);
    }
    else {
      this._concatBuffer = [ chunk ];
    }
  }
  else {
    if (!Buffer.isBuffer(chunk)) {
      chunk = Buffer(chunk, encoding);
    }
    this._concatBuffer = this._concatBuffer ? Buffer.concat([ this._concatBuffer, chunk ]) : chunk;
  }
}

function _transform(c, e, cb) {
  cb();
}
