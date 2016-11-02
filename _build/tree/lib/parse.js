/**
 * Created by phpstorm
 * @file tree
 * @author lijun
 * @date 16/10/24
 */
const fs = require('fs');
const fileType = require('./fileType');
const Node = require('./Node');
const noop = require('./noop');
var readSync = require('./readSync');

class Tree {
    /**
     * 生成入口文件树
     *
     * @params options {object}
     * @property files {string} 当前文件名称
     * @property rules {object}
     * @property filter {fun} 回调sourceId ,返回filename,返回挂在对象上的属性
     */
    constructor (options) {
        let me = this;

        me.dendencyMap = new Map();

        Object.assign(me, options);

        let files = options.files || [];
        files.forEach(
            filename =>
            me.process(
                me.createNode(me.filter({filename: filename}))
            )
        );

        return me.dendencyMap;
    }

    html (node) {
        let me = this;
        let filename = node.filename;

        let rule = fileType.isHtml(filename)
            ? me.rules.htmlRules
            : me.rules.cssRules;

        rule.forEach((item) => {
            let match = item.match || noop;

            node.content.replace(
                item.pattern,
                (value, $1) => {
                    let sources = $1 || match(value) || '';
                    if (sources) {
                        if (typeof sources === 'string') {
                            sources = [sources];
                        }

                        sources.forEach(sourceId => {
                            let result = me.filter(Object.assign(item, {filename, sourceId}));

                            if (result.filename) {
                                let childNode = me.createNode(result);

                                node.addChild(childNode);
                                // 递归
                                if (!result.isFilter) {
                                    me.process(childNode);
                                }
                            }
                        });
                    }
                }
            );
        });
    }

    css (node) {
        this.html(node);
    }

    image (node) {

    }

    js (node) {

    }

    process (node) {
        let me = this;
        let action = me[fileType.type(node.filename)];

        if (action) {
            action.call(me, node);
        }
    }

    createNode (options) {
        let me = this;
        let filename = options.filename;
        let node = me.dendencyMap.get(filename);

        if (!node) {
            node = new Node(
                Object.assign(
                    {content: readSync(filename)},
                    options
                )
            );

            me.dendencyMap.set(filename, node);
        }

        return node;
    }
}

module.exports = (options) => {
    return new Promise(resolve => resolve(new Tree(options)));
};
