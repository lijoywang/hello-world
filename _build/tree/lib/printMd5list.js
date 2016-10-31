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
module.exports = function (tree, path) {
    var md5list = { };

    tree.forEach(function (node) {
        md5list[node.filename] = node.md5;
    });

    write(path, JSON.stringify(md5list));
};