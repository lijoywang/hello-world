/**
 * Created by phpstorm
 * @file print dependency
 * @author lijun
 * @date 16/10/29
 */
var write = require('./write');
/**
 * 输出依赖关系
 *
 * @params tree {object}
 * @params path {string} 输出路径
 */
module.exports = (tree, path) => {
    var md5list = {};

    tree.forEach(function (node) {
        md5list[node.filename] = {
            bmd5: node.bmd5,
            amd5: node.amd5
        };

    });
    if (path) {
        write(path, JSON.stringify(md5list));
    }
};