var tape = require('tape');
var crypto = require('crypto');
var stream = require('stream');
var ConcatTransform = require('./');
var makeChunks = require('chunky');

tape('strings', function(t) {
  var actual, expected = 'Humpty Dumpty was a big fat egg / He was playing the wall and then he broke his leg';
  var wcnt = { i: 0 };
  var tcnt = 0;
  var chunks = chunky(expected);
  
  var input = new stream.PassThrough;
  var tr = new ConcatTransform;
  var output = new stream.PassThrough;
  
  tr._transform = function(c, enc, cb) {
    var self = this;
    setTimeout(function() {
      tcnt++;
      cb(null, c);
    }, 20);
  };
  
  output.on('data', function(data) {
    actual = data.toString();
  });
  
  output.on('end', function() {
    t.equal(wcnt.i > 1, true);
    t.equal(tcnt, 1);
    t.equal(actual, expected);
    t.end();
  });
  
  input.pipe(tr).pipe(output);
  feedChunks(input, chunky(expected), wcnt);
});

tape('binary', function(t) {
  var actual, expected = crypto.randomBytes(50);
  var wcnt = { i: 0 };
  var tcnt = 0;
  
  var input = new stream.PassThrough;
  var tr = new ConcatTransform;
  var output = new stream.PassThrough;
  
  tr._transform = function(c, enc, cb) {
    var self = this;
    setTimeout(function() {
      tcnt++;
      cb(null, c);
    }, 20);
  };
  
  output.on('data', function(data) {
    actual = data;
  });
  
  output.on('end', function() {
    t.equal(wcnt.i > 1, true);
    t.equal(tcnt, 1);
    t.equal(actual.toString('base64'),
            expected.toString('base64'));
    t.end();
  });
  
  input.pipe(tr).pipe(output);
  feedChunks(input, chunky(expected), wcnt);
});

tape('objectMode', function(t) {
  var actual, expected = [ 'a', 2, { x: 3 }, true, 5 ];
  var wcnt = { i: 0 };
  var tcnt = 0;
  
  var input = new stream.PassThrough({ objectMode: true });
  var tr = new ConcatTransform({ objectMode: true });
  var output = new stream.PassThrough({ objectMode: true });
  
  tr._transform = function(c, enc, cb) {
    var self = this;
    setTimeout(function() {
      tcnt++;
      cb(null, c);
    }, 20);
  };
  
  output.on('data', function(data) {
    actual = data;
  });
  
  output.on('end', function() {
    t.equal(wcnt.i > 1, true);
    t.equal(tcnt, 1);
    t.equal(JSON.stringify(expected),
            JSON.stringify(actual));
    t.end();
  });
  
  input.pipe(tr).pipe(output);
  feedChunks(input, expected, wcnt);
});

function feedChunks(input, chunks, cnt) {
  var delay = 0;
  for(var i=0; i<chunks.length; i++) (function(chunk) {
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      cnt.i++;
      var action = chunk === chunks.slice(-1)[0] ? 'end' : 'write';
      input[action](chunk);
    }, delay);
  })(chunks[i]);
}

function chunky(data) {
  var c;
  while (!c || c.length <= 1) {
    c = makeChunks(data);
  }
  return c;
}
