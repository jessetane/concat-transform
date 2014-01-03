var tape = require('tape');
var crypto = require('crypto');
var chunky = require('chunky');
var stream = require('stream');
var ConcatTransform = require('./');

tape('strings', function(t) {
  var input = new stream.PassThrough;
  var output = new stream.PassThrough;
  
  var tr = new ConcatTransform;
  tr._transform = function(c, enc, cb) {
    var self = this;
    setTimeout(function() {
      transformCount++;
      cb(null, c.toString().toUpperCase());
    }, 20);
  };
  
  output.on('data', function(data) {
    actual = data.toString();
  });
  
  output.on('end', function() {
    t.equal(writeCount > 1, true);
    t.equal(transformCount, 1);
    t.equal(actual, expected);
    t.end();
  });
  
  input.pipe(tr).pipe(output);
  
  var fixture = 'Humpty Dumpty was a big fat egg / He was playing the wall and then he broke his leg';
  var expected = fixture.toUpperCase();
  var actual;
  var transformCount = 0;
  var writeCount = 0;
  var delay = 0;
  var chunks = chunky(fixture);
  
  for (var i=0; i<chunks.length; i++) (function(chunk) {
    var last = i === chunks.length - 1;
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      var action = last ? 'end' : 'write';
      writeCount++;
      input[action](chunk);
    }, delay);
  })(chunks[i]);
});

tape('binary', function(t) {
  var input = new stream.PassThrough;
  var output = new stream.PassThrough;
  
  var tr = new ConcatTransform;
  tr._transform = function(c, enc, cb) {
    var self = this;
    setTimeout(function() {
      transformCount++;
      cb(null, c);
    }, 20);
  };
  
  output.on('data', function(data) {
    actual = data;
  });
  
  output.on('end', function() {
    t.equal(writeCount > 1, true);
    t.equal(transformCount, 1);
    t.equal(JSON.stringify(expected),
            JSON.stringify(actual));
    t.end();
  });
  
  input.pipe(tr).pipe(output);
  
  var expected = crypto.randomBytes(50);
  var actual;
  var writeCount = 0;
  var transformCount = 0;
  var delay = 0;
  var chunks = chunky(expected);
  
  for (var i=0; i<chunks.length; i++) (function(chunk) {
    var last = i === chunks.length - 1;
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      var action = last ? 'end' : 'write';
      writeCount++;
      input[action](chunk);
    }, delay);
  })(chunks[i]);
});

tape('objectMode', function(t) {
  var input = new stream.PassThrough({ objectMode: true });
  var output = new stream.PassThrough({ objectMode: true });
  
  var tr = new ConcatTransform({ objectMode: true });
  tr._transform = function(c, enc, cb) {
    var self = this;
    setTimeout(function() {
      transformCount++;
      cb(null, c);
    }, 20);
  };
  
  output.on('data', function(data) {
    actual = data;
  });
  
  output.on('end', function() {
    t.equal(writeCount > 1, true);
    t.equal(transformCount, 1);
    t.equal(JSON.stringify(expected),
            JSON.stringify(actual));
    t.end();
  });
  
  input.pipe(tr).pipe(output);
  
  var expected = [ 'a', 2, { x: 3 }, true, 5 ];
  var actual;
  var writeCount = 0;
  var transformCount = 0;
  var delay = 0;
  
  for (var i=0; i<expected.length; i++) (function(chunk) {
    var last = i === expected.length - 1;
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      var action = last ? 'end' : 'write';
      writeCount++;
      input[action](chunk);
    }, delay);
  })(expected[i]);
});
