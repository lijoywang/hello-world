/**
 * Created by phpstorm
 * @file write file
 * @author lijun
 * @date 16/10/24
 */
var write = require("write");

module.exports = function (path, content) {
    write(
        path,
        content,
        function (error) {
            if (error) {
                console.log('write file is error');
            }
        }
    );
};