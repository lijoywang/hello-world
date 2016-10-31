/**
 * Created by phpstorm
 * @file print dependency
 * @author lijun
 * @date 16/10/29
 */
var noop = require('./noop');
/**
 * 输出依赖关系
 *
 * @params tree {object}
 * @params format {fun} 格式化路径
 *
 * @return
 * {
 *  md5:{},
 *  dependency:{}
 * }
 */
module.exports = function (tree, format) {
    format = format || noop;

    var dependencyMap = {
        md5list: { },
        dependency: { }
    };


    tree.forEach(function (node) {
        var filename = format(node.filename);
        var md5list = dependencyMap.md5list;
        var dependency = dependencyMap.dependency;
        var childMap = node.childMap;
        
        var rootDependency = dependency[filename] = [];
        if (childMap.size) {
            childMap.forEach(function (childNode) {
                rootDependency.push(childNode.filename);
            });
        }

        md5list[filename] = node.md5;
    });
};