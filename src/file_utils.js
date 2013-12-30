var fs = require('fs');
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
            stat_result['hash'] = hash_result;
            callback(null, stat_result)
        });
    });
}


exports.hash = hash;
exports.stat_with_hash = stat_with_hash;