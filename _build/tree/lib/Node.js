/**
 * Created by phpstorm
 * @file tree node
 * @author lijun
 * @date 16/10/26
 */
var md5 = require('./md5');

class Node {

    constructor (options) {
        var me = this;
        var content;

        // 父节点
        me.parentMap = new Map();
        // 子节点
        me.childMap = new Map();

        Object.defineProperty(
            me,
            'content',
            {
                set: function (value) {
                    content = value;

                    me.md5 = md5(content);
                },
                get: function () {
                    return content;
                }
            }
        );

        Object.assign(me, options);
    }

    addChild (node) {
        var me = this;
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
