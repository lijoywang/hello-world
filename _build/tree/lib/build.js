/**
 * Created by phpstorm
 * @file build tree
 * @author lijun
 * @date 16/10/26
 */
var md5 = require('../../util/md5');

class Build {
    /**
     * 叶子结点开始构建
     *
     * @params {object}
     * @property node {object}
     * @property builder {fun}
     * @property md5 {object} md5与node的md5比较，判断是否有改变，如果md5不存在，则重新编译
     */
    constructor (optoins) {
        var me = this;
        var building;
        var builded;

        // 编译状态
        me.builded = false;
        me.building = false;

        me.builder = function (instance) {
            return new Promise(function (resovel) {
                resovel();
            });
        };
        
        Object.defineProperty(
            me,
            'building',
            {
                set: function (boolean) {
                    var md5 = options.md5;
                    if (md5 
                        && 
                        me.md5 == md5
                    ) {
                        me.builed = true;
                        return false;
                    }
                    // 避免重复打包
                    if (boolean === building) {
                        return false;
                    }

                    building = boolean;

                    if (building === true) {
                        setTimeout (function () {
                            me.builded = true;
                        }, 1000 * Math.random())
                    }
                },
                get: function () {
                    return building;
                }
            }
        );

        Object.defineProperty(
            me,
            'builded',
            {
                set: function (boolean) {
                    builded = boolean;

                    if (builded === true) {
                        if (me.parentMap.size) {
                            me.parentMap.forEach(function (parentNode) {
                                parentNode.notice();
                            });

                            me.parentMap.clear();
                        }
                    }
                },
                get: function () {
                    return builded;
                }
            }
        );

        Object.assign(
            me, 
            options.node,
            {
                builder: options.builder
            }
        );
    }
    /**
     * 递归叶子结点，build， 成功之后通知上级结点
     */
    recurNode () {
        var me = this;

        if (this.childMap.size) {
            me.childMap.forEach(function (childNode) {
                childNode.recurNode.call(childNode, me);
            });
        }
        else {
            me.building = true;
        }
    }

    notice () {
        var me = this;

        var isChildBuild = true;

        if (me.childMap.size) {
            me.childMap.forEach(function (node) {
                if (!node.builded) {
                    isChildBuild = false;
                    return false;
                }
            });
        }

        if (isChildBuild) {
            me.isBuilding = true;
        }
    }
};

/**
 * 叶子结点开始构建
 *
 * @params {object}
 * @property tree {object}
 * @property builder {fun}
 * @property md5List {object} 发布之前的md5列表， 根据此列表判断是否增量发布
 */
module.exports = function (options) {
    var tree = options.tree;

    tree.forEach(function (node) {
        var nodeBuild = new Build(
            node,
            options.builder,
            {
                md5: 244324
            }
        );

        nodeBuild.recurNode();
    });
};

