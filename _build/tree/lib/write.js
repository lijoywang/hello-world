/**
 * Created by phpstorm
 * @file write file
 * @author lijun
 * @date 16/10/24
 */
const write = require("write");

module.exports = (path, content) => {
    write(
        path,
        content,
        (error) => {
            if (error) {
                console.log('write file is error');
            }
        }
    );
};