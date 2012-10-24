var expect = require('chai').expect,
    StreamMultiplex = require('../../'),
    Checklist = require('checklist');
    
describe('StreamMultiplex', function() {
  it('should provide multiple readable/writable streams over a single carrier stream', function(done) {
    var checklist = new Checklist([
      'downstream connected',
      'Hello, downstream',
      'Hello, upstream',
      'Goodbye, downstream',
      'end downstream',
      'end upstream'
    ], done);
    var streamMultiplex1 = new StreamMultiplex();
    var streamMultiplex2 = new StreamMultiplex(function(downstreamConnection) {
      checklist.check('downstream connected');
      downstreamConnection.setEncoding();
      downstreamConnection.on('data', function(data) {
        checklist.check(data);
        downstreamConnection.removeAllListeners('data');
        downstreamConnection.on('data', function(data) {
          checklist.check(data);
        });
        downstreamConnection.write('Hello, upstream');
      });
      downstreamConnection.on('end', function(data) {
        checklist.check('end downstream');
      });
    });
    
    streamMultiplex1.pipe(streamMultiplex2);
    streamMultiplex2.pipe(streamMultiplex1);
    
    var upstreamConnection = streamMultiplex1.createStream();
    upstreamConnection.setEncoding();
    upstreamConnection.on('data', function(data) {
      checklist.check(data);
      upstreamConnection.end('Goodbye, downstream');        
    });
    upstreamConnection.on('end', function(data) {
      checklist.check('end upstream');        
    });
    upstreamConnection.write('Hello, downstream');
  });
});
