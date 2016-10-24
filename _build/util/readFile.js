/**
 * Created by phpstorm
 * @file read file
 * @author lijun
 * @date 16/10/24
 */
var fs = require('fs');

exports.sync = function (pathname) {
    return fs.readFileSync(pathname, 'utf-8');
};

exports.async = function (pathname, done) {
    return new Promise(function (resolve, reject) {
        fs.readFile(
            pathname,
            'utf-8',
            function (error, fileContent) {
                if (error) {
                    console.log('read file is error');
                    reject();
                }
                else {
                    resolve(fileContent);
                }
            }
        );
    });
};