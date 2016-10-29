/**
 * Created by phpstorm
 * @file tree node
 * @author lijun
 * @date 16/10/26
 */
var md5 = require('../../util/md5');
/**
 * 初使化节点
 *
 * @params options {object}
 */
class Node {

    constructor (options) {
        var me = this;
        // 父节点
        me.parentMap = new Map();
        // 子节点
        me.childMap = new Map();

        Object.assign(me, options);
    }

    addChild (node) {
        var me = this;

        // 添加子节点
        me.childMap.set(node.name, node);
        // 添加父节点
        node.parentMap.set(me.name, me);
    }

    isRootNode () {
        return !this.parentMap.size;
    }
};

module.exports = Node;
