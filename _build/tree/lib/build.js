/**
 * Created by phpstorm
 * @file build node
 * @author lijun
 * @date 16/10/26
 */
module.exports = function (options) {
    var tree = options.tree;
    var md5list = options.md5list || {};
    var builder = options.builder;

    var noticeParents = function (parentNodes) {
        if (parentNodes.size) {
            parentNodes.forEach(function (parentNode) {
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

    };

    var build = function (node) {
        var filename = node.filename;
        var nodeMd5 = node.md5;
        var oldMd5 = md5list[filename];
        var parentMap = node.parentMap;

        if (node.builed === true) {
            noticeParents(parentMap);
            return false;
        }

        if (oldMd5
            &&
            oldMd5 == nodeMd5
        ) {
            node.builed = true;
            noticeParents(parentMap);
        }
        else {
            builder(node)
            .then(function () {
                node.builed = true;

                console.log(node.filename)
                noticeParents(parentMap);
            });
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

