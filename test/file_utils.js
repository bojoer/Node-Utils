var fs = require('fs');
var sinon = require('sinon');
var rmdir = require('rimraf');
var mkdirp = require('mkdirp');
var should = require('should');
var randomstring = require("randomstring");

var file_utils = require('../src/file_utils.js')


describe('file_utils', function(){
  var test_directory = null;
  var file_path = null;
  beforeEach(function(done){
    test_directory = __dirname + '/tmp/' + randomstring.generate();
    mkdirp(test_directory, function(err) {
      file_path = test_directory + '/file.txt';
      done(); 
    });
  });
  afterEach(function(done){
    rmdir(test_directory, function (err) {
      done();
    });
  });
  describe('hash', function(){  
    it('should return a hash for an empty file', function(){
      fs.writeFileSync(file_path, '');
      file_utils.hash(file_path, function(err, result) {
        (err == null).should.be.true
        result.should.equal('da39a3ee5e6b4b0d3255bfef95601890afd80709');
      });
    });

    it('should return a hash for a file with content "test"', function(){
      fs.writeFileSync(file_path, 'test');
      file_utils.hash(file_path, function(err, result) {
        (err == null).should.be.true
        result.should.equal('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
      });
    });

    it('should return a error for a missing file', function(){
      file_utils.hash(file_path, function(err, result) {
        err.should.equal('Unable to hash file');
        (result == null).should.be.true
      });
    });
  });

  describe('stat_with_hash', function(){  
    it('should return a error if unable to stat file', function(){
      file_utils.stat_with_hash(file_path, function(err, result) {
        err.code.should.equal('ENOENT');
        (result == null).should.be.true
      });
    });

    it('should return a error if unable to hash file', function(){
      // TODO: Fix test since this has a horrible race condition
      // with the final unlink
      
      fs.writeFileSync(file_path, 'test');

      file_utils.stat_with_hash(file_path, function(err, result) {
        err.should.equal('Unable to hash file');
        (result == null).should.be.true
      });

      fs.unlink(file_path);
    });

    it('should return a stat and hash for a valid file', function(){
      fs.writeFileSync(file_path, 'test');

      file_utils.stat_with_hash(file_path, function(err, result) {
        (err == null).should.be.true
        result.hash.should.equal('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
        result.size.should.equal(4);
      });
    });
  });

  describe('create_directory_and_move_file', function(){
    var new_directory_one = null;
    var new_directory_two = null;
    var new_file_path = null;
    beforeEach(function(done){
      new_directory_one = test_directory + '/one';
      new_directory_two = new_directory_one + '/two';
      new_file_path = new_directory_two + '/move-file.txt';
      done();
    });
    it('should return an error if the file_path does not exist', function(){
      file_utils.create_directory_and_move_file(file_path, new_file_path, function(err) {
        err.should.equal('File does not exist');
        fs.existsSync(new_directory_one).should.be.false;
        fs.existsSync(new_directory_two).should.be.false;
      });
    });  
    it('should return an error if unable to make the directory', function(){
      // TODO: Write test to make mkdirp return an err
    });  
    it('should make a new directory if it does not exist', function(){
      fs.writeFileSync(file_path);

      file_utils.create_directory_and_move_file(file_path, new_file_path, function(err) {
        (err == null).should.be.true
        fs.existsSync(new_directory_one).should.be.true;
        fs.existsSync(new_directory_two).should.be.true;
      });
    });  

    it('should do nothing if the directory already exist', function(){
      fs.writeFileSync(file_path);
      fs.mkdirSync(new_directory_one);
      fs.mkdirSync(new_directory_two);

      file_utils.create_directory_and_move_file(file_path, new_file_path, function(err) {
        (err == null).should.be.true
        fs.existsSync(new_directory_one).should.be.true;
        fs.existsSync(new_directory_two).should.be.true;
      }); 
    });

    it('should write a file to the new directory', function(){
      fs.writeFileSync(file_path);

      file_utils.create_directory_and_move_file(file_path, new_file_path, function(err) {
        (err == null).should.be.true
        fs.existsSync(new_file_path).should.be.true;
      }); 
    });

    it('should over-write a file if it already exists', function(){
      fs.writeFileSync(file_path, 'new');
      fs.mkdirSync(new_directory_one);
      fs.mkdirSync(new_directory_two);
      fs.writeFileSync(new_file_path, 'old');

      file_utils.create_directory_and_move_file(file_path, new_file_path, function(err) {
        (err == null).should.be.true
        fs.existsSync(new_file_path).should.be.true;
        var file_content = fs.readFileSync(new_file_path, 'utf8');
        file_content.should.equal('new');
      }); 
    });
  });
});



