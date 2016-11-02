/**
 * Created by phpstorm
 * @file tree node
 * @author lijun
 * @date 16/10/26
 */
const md5 = require('./md5');
const write = require('./write');

class Node {

    constructor (options) {
        let me = this;
        var content;
        // 父节点
        me.parentMap = new Map();
        // 子节点
        me.childMap = new Map();
        // 首次改变
        me.md5Once = true;
        // 未编译前的md5
        me.bmd5 = '';
        // 编译之后的md5
        me.amd5 = '';

        Object.defineProperty(
            me,
            'content',
            {
                set: (value) => {
                    content = value;

                    let md5Code = md5(content);
                    if (me.md5Once) {
                        me.bmd5 = md5Code;
                        me.md5Once = false;
                    }
                    else {
                        me.amd5 = md5Code;
                    }
                },
                get: () => {
                    return content;
                }
            }
        );

        Object.assign(me, options);
    }

    addChild (node) {
        let me = this;
        // 添加子节点
        me.childMap.set(node.filename, node);
        // 添加父节点
        node.parentMap.set(me.filename, me);
    }

    isRootNode () {
        return !this.parentMap.size;
    }
};

module.exports = Node;
