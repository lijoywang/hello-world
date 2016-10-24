/**
 * Created by phpstorm
 * @file info
 * @author md5
 * @date 16/10/21
 */
var crypto = require('crypto');

module.exports = function (content) {
    var md5 = crypto.createHash('md5');

    md5.update(content);

    return md5.digest('hex').slice(0, 10);
};