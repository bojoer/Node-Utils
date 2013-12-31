var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var crypto = require('crypto');


hash = function(path, callback) {
    var fileStream = fs.createReadStream(path);
    fileStream.on('end', function() {
        hash.end();
        callback(null, hash.read());
    });
    fileStream.on('error', function() {
        hash.end();
        callback('Unable to hash file', null);
    });

    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');

    fileStream.pipe(hash); 
}


stat_with_hash = function(path, callback) {
    fs.stat(path, function(stat_err, stat_result) {
        if(stat_err){
            return callback(stat_err, null);
        }
        hash(path, function(hash_err, hash_result) {
            if(hash_err){
                return callback(hash_err, null);
            }
            stat_result.hash = hash_result;
            callback(null, stat_result)
        });
    });
}


create_directory_and_move_file = function(oldPath, newPath, callback) {
    if(!fs.existsSync(oldPath)){
        callback('File does not exist');
    }else{
        var newDirectory = path.dirname(newPath);
        mkdirp(newDirectory, function(mkdirp_err) {
            // TODO: Unable to come up with a test to make this happen
            // if(mkdirp_err){
            //     callback(mkdirp_err);
            // }
            fs.rename(oldPath, newPath, function(rename_err) {
                callback(rename_err);
            });
        });
    }
}

exports.hash = hash;
exports.stat_with_hash = stat_with_hash;
exports.create_directory_and_move_file = create_directory_and_move_file;