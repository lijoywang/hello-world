/**
 * Created by phpstorm
 * @file build node
 * @author lijun
 * @date 16/10/26
 */
const write = require('./write');
const printMd5Cache = require('./printMd5Cache');
const noop = require('./noop');
const readSync = require('./readSync');

// TODO 增量发布bug
/**
 * 树节点构建器
 *
 * @params options {object}
 * @property tree {object} 节点树
 * @property builder {function} 节点构建器
 * @property mad5path {string} md5缓存列表数据
 * @property complete {function}
 */
module.exports = options => {
    let {tree, builder = noop, complete = noop, md5path} = options;

    let md5Cache = {};
    if (md5path) {
        let json = readSync(md5path);
        if (json) {
            md5Cache = JSON.parse(json);
        }
    }

    let getMd5Target = (filename) => md5Cache[filename] || { };
    // 判断当前文件是否需要重新编译
    // 1.判断所有子节点是否需要编译，如果有任何一个子节点编译，那当前父节点都要重新编译
    // 2.判断当前节点是否需要重新编译，根据当前节点的bmd5与cache bmd5相对比
    let isBuild = (node) => {
        let [boolean, childMap] = [false, node.childMap];
        if (childMap.size) {
            childMap.forEach(childNode => {
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

    // 所有node的根节点完成，则回调complete方法
    let isComplete = () => {
        var boolean = true;
        tree.forEach((node) => {
            if (!node.builed) {
                boolean = false;
                return false;
            }
        });
        return boolean;
    }

    let noticeParents = (node) => {
        let parentMap = node.parentMap;
        if (parentMap.size) {
            parentMap.forEach((parentNode) => {
                let childMap = parentNode.childMap;
                // 所有子节点是否已build完成
                let allBuiled = true;
                childMap.forEach((node) => {
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
            if (isComplete()) {
                if (md5path) {
                    printMd5Cache(tree, md5path);
                }
                complete();
            }
        }
    };

    let build = node => {
        if (isBuild(node)) {
            builder(node)
            .then((boolean) => {
                node.builed = true;
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
        tree.forEach(node => {
            // 叶子节点
            if (!node.childMap.size) {
                build(node);
            }
        });
    }
};

