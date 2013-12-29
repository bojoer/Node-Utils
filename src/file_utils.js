var fs = require('fs');
var file = require('file');
var crypto = require('crypto');


hash = function(filePath, callback) {
    var hash = crypto.createHash('sha1');
    var fileStream = fs.createReadStream(filePath);

    fileStream.on('end', function() {
        hash.end();
        callback(null, hash.read());
    });

    fileStream.on('error', function() {
        hash.end();
        callback('Unable to load file', null);
    });

    hash.setEncoding('hex');
    fileStream.pipe(hash);
}


exports.hash = hash;