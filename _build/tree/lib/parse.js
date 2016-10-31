/**
 * Created by phpstorm
 * @file tree
 * @author lijun
 * @date 16/10/24
 */

var fs = require('fs');
var fileType = require('./fileType');
var Node = require('./Node');
var noop = require('./noop');

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
        var me = this;

        me.dendencyMap = new Map();

        Object.assign(me, options);

        var files = options.files || [];
        files.forEach(function (filename) {
            me.process(
                me.createNode({filename: filename})
            );
        });

        return me.dendencyMap;
    }

    html (node) {
        var me = this;
        var filename = node.filename;
        var rule = fileType.isHtml(filename)
            ? me.rules.htmlRules
            : me.rules.cssRules;

        var sourcesFormat =  function (sources, patternOptions) {
            if (typeof sources === 'string') {
                sources = [sources];
            }
            sources.forEach(function (sourceId) {
                var result = me.filter(
                    Object.assign(
                        patternOptions,
                        {
                            filename: filename,
                            sourceId: sourceId
                        }
                    )
                );

                if (result.filename) {
                    var childNode = me.createNode(result);

                    node.addChild(childNode);
                    // 递归
                    if (!result.isFilter) {
                        me.process(childNode);
                    }
                }
            });
        };

        rule.forEach(function (item) {
            var match = item.match || noop;

            node.content.replace(
                item.pattern,
                function (value, $1) {
                    var sources = $1 || match(value) || '';
                    if (sources) {
                        sourcesFormat(sources, item)
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
        var me = this;

        var type = fileType.type(node.filename);

        if (type === 'html') {
            me.html(node);
        }
        else if (type === 'css') {
            me.css(node)
        }
        else if (type === 'js') {
            me.js(node);
        }
        else if (type === 'image') {
            me.image(node);
        }
        else {
            me.other(node);
        }
    }

    createNode (options) {
        var me = this;
        var filename = options.filename;
        var node = me.dendencyMap.get(filename);

        if (!node) {
            node = new Node(
                Object.assign(
                    {content: fs.readFileSync(filename, 'utf-8')},
                    options
                )
            );

            me.dendencyMap.set(filename, node);
        }

        return node;
    }
}

module.exports = function (options) {
    return new Promise(function (resolve) {
        resolve(new Tree(options));
    });
};
