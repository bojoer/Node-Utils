var fs = require('fs')
var assert = require('assert')
var should = require('should')

var file_utils = require('../src/file_utils.js')


describe('hash', function(){
	it('should return a hash for an empty file', function(){
		var filePath = __dirname + '/tmp/empty_file.txt';
		fs.writeFile(filePath, '', function() {
			file_utils.hash(filePath, function(err, result) {
				result.should.equal('da39a3ee5e6b4b0d3255bfef95601890afd80709');
				fs.unlink(filePath);
			});
		});
	});

	it('should return a hash for a file with content "test"', function(){
		var filePath = __dirname + '/tmp/test_file.txt';
		fs.writeFile(filePath, 'test', function() {
			file_utils.hash(filePath, function(err, result) {
				result.should.equal('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
				fs.unlink(filePath);
			});
		});
	});

	it('should return an error for a missing file', function(){
		var filePath = __dirname + '/tmp/non-file.txt';
		file_utils.hash(filePath, function(err, result) {
			err.should.equal('Unable to load file');
		});
	});
});

