multiplex-stream
================

Multiplex multiple streams through a single stream

## Features

- should provide multiple readable/writable streams over a single carrier stream
- should behave correctly with intermediate flow control where data events may get split and/or concatenated
- should allow the downstream connection to write data first
- should allow a stream to be named

## Installation

```
npm install stream-multiplex
```

## API

```javascript
var MultiplexStream = require('multiplex-stream');

// create 2 multiplex instances and listen for connections downstream
var upstreamMultiplex = new MultiplexStream();
var downstreamMultiplex = new MultiplexStream(function(downstreamConnection) {
  // a multiplexed stream has connected from upstream
  downstreamConnection.setEncoding();
  downstreamConnection.on('data', function(data) {
    // received data, send reply upstream
    downstreamConnection.write('Hello, upstream');
  });
  downstreamConnection.on('end', function(data) {
    // downstream connection has ended
  });
});

// pipe from one multiplex to the other (there could
// be other carrier streams in between, for instance a net socket)
upstreamMultiplex.pipe(downstreamMultiplex).pipe(upstreamMultiplex);

// create a new upstream multiplexed stream
var upstreamConnection = upstreamMultiplex.connect(function() {
  upstreamConnection.setEncoding();
  upstreamConnection.on('data', function(data) {
    // received reply, end the connection
    upstreamConnection.end();        
  });
  upstreamConnection.on('end', function(data) {
    // upstream connection has ended
  });
  // send some data downstream
  upstreamConnection.write('Hello, downstream');
});
```

## Roadmap

- should error if an existing id is used to make a connection
- should timeout if no multiplex responds to the connect request
- should end tunnel streams cleanly when the multiplex stream ends

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using ``./grunt.sh`` or ``.\grunt.bat``.

## License
Copyright (c) 2012 Peter Halliday  
Licensed under the MIT license.