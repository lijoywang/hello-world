/**
 * Created by phpstorm
 * @file path md5
 * @author lijun
 * @date 16/10/21
 */
var path = require('path');

module.exports = (output, md5) => {
    return output.split('.')[0] + '_' + md5 + path.extname(output);
};