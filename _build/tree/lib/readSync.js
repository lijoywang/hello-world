/**
 * Created by phpstorm
 * @file read sync
 * @author lijun
 * @date 16/10/21
 */
var fs = require('fs');

module.exports = (filename) => {
    let content;

    if (fs.existsSync(filename)) {
        content = fs.readFileSync(filename, 'utf-8');
    }

    return content;
};