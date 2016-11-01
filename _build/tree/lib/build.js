/**
 * Created by phpstorm
 * @file build node
 * @author lijun
 * @date 16/10/26
 */
var write = require('./write');
var getPathMd5 = require('./getPathMd5');

module.exports = function (options) {
    var tree = options.tree;
    var md5Cache = options.md5Cache || {};
    var builder = options.builder;

    var getMd5Target = function (filename) {
        return md5Cache[filename] || { };
    };

    // 判断当前文件是否需要重新编译
    // 1.判断所有子节点是否需要编译，如果有任何一个子节点编译，那当前父节点都要重新编译
    // 2.判断当前节点是否需要重新编译，根据当前节点的bmd5与cache bmd5相对比
    var isBuild = function (node) {
        var boolean = false;
        var childMap = node.childMap;
        if (childMap.size) {
            childMap.forEach(function (childNode) {
                if (getMd5Target(childNode.filename).amd5 !== childNode.amd5) {
                    boolean = true;
                    return false;
                }
            });
        }
        if (boolean) {
            return true;
        }

        return getMd5Target(node.filename).bmd5 !== node.bmd5;
    };

    var noticeParents = function (node) {
        var parentMap = node.parentMap;
        if (parentMap.size) {
            parentMap.forEach(function (parentNode) {
                var childMap = parentNode.childMap;
                // 所有子节点是否已build完成
                var allBuiled = true;
                childMap.forEach(function (node) {
                    if (!node.builed) {
                        allBuiled = false;
                        return false;
                    }
                });

                if (allBuiled) {
                    build(parentNode);
                }
            });
        }
        else {
            // 根节点
        }
    };

    var build = function (node) {
        if (isBuild(node)) {
            builder(node)
            .then(function () {
                node.builed = true;
                // 输出文件
                var output = node.output;
                // output 路径不存在，说明不是入口文件，不需要输出
                if (output) {
                    write(getPathMd5(output, node.amd5), node.content);
                }
                noticeParents(node);
            });
        }
        else {
            node.builed = true;
            // 替换当前amd5
            node.amd5 = getMd5Target(node.filename).amd5;
            noticeParents(node);
        }
    };

    if (tree.size) {
        tree.forEach(function (node) {
            // 叶子节点
            if (!node.childMap.size) {
                build(node);
            }
        });
    }
};

