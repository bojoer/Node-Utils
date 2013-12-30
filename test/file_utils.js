var fs = require('fs');
var assert = require('assert');
var should = require('should');

var file_utils = require('../src/file_utils.js')

describe('utils', function(){
  describe('hash', function(){  
    it('should return a hash for an empty file', function(){
      var filePath = __dirname + '/tmp/empty_file.txt';
      fs.writeFile(filePath, '', function() {
        file_utils.hash(filePath, function(err, result) {
          (err == null).should.be.true
          result.should.equal('da39a3ee5e6b4b0d3255bfef95601890afd80709');
          fs.unlink(filePath);
        });
      });
    });

    it('should return a hash for a file with content "test"', function(){
      var filePath = __dirname + '/tmp/test_file.txt';
      fs.writeFile(filePath, 'test', function() {
        file_utils.hash(filePath, function(err, result) {
          (err == null).should.be.true
          result.should.equal('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
          fs.unlink(filePath);
        });
      });
    });

    it('should return a error for a missing file', function(){
      var filePath = __dirname + '/tmp/non-file.txt';
      file_utils.hash(filePath, function(err, result) {
        err.should.equal('Unable to hash file');
        (result == null).should.be.true
      });
    });
  });

  describe('stat_with_hash', function(){  
    it('should return a error if unable to stat file', function(){
      var filePath = __dirname + '/tmp/non-file.txt';
      file_utils.stat_with_hash(filePath, function(err, result) {
        err.code.should.equal('ENOENT');
        (result == null).should.be.true
      });
    });

    it('should return a error if unable to hash file', function(){
      // TODO: Unsure how to do this
    });

    it('should return a stat and hash for a valid file', function(){
      var filePath = __dirname + '/tmp/hash-file.txt';
      fs.writeFile(filePath, 'test', function() {
        file_utils.stat_with_hash(filePath, function(err, result) {
          (err == null).should.be.true
          result.hash.should.equal('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
          result.size.should.equal(4);
          fs.unlink(filePath);
        });
      });
    });
  });
});



