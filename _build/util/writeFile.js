/**
 * Created by phpstorm
 * @file info
 * @author lijun
 * @date 16/10/24
 */
var write = require("write");

module.exports = function (outerPath, content) {
    return new Promise(function (resolve, reject) {
        write(
            outerPath,
            content,
            function (error) {
                if (!error) {
                    resolve();
                }
                else {
                    console.log('write file is error');

                    reject();
                }
            }
        );
    });
}