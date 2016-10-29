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
     * @property amdConfig {object}
     * @property filter {fun} 回调sourceId ,返回filename,返回挂在对象上的属性
     */
    constructor (options) {
        var me = this;

        me.dendencyMap = new Map();

        me.filter = new Function();

        Object.assign(me, options);

        var files = options.files || [];

        return new Promise(function (resolve) {
            files.forEach(function (filename) {
                me.createNode(
                    {
                        filename: filename
                    }
                )
                .then(function (node) {
                    me.process(node);
                });
            });
        });

    }

    html (node) {
        var me = this;
        var rule = me.fileType.isHtml
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
                            filename: node.filename,
                            sourceId: sourceId
                        }
                    )
                );


                if (result.filename) {
                    me.createNode(result)
                    .then(function (childNode) {
                        if (!result.isFilter) {
                            // 递归
                            me.process(childNode);
                        }
                        node.addChild(childNode);
                    });
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

    process (node) {
        var me = this;

        me.fileType = fileType(node.filename);

        if (me.fileType.isHtml) {
            me.html(node);
        }
        else if (me.fileType.isCss) {
            me.css(node)
        }
        else if (me.fileType.isJs) {
            me.js(node);
        }
        else {
            me.other(node);
        }
    }

    createNode (options, done) {
        var me = this;
        var filename = options.filename;
        var node = me.dendencyMap.get(filename);

        return new Promise(function (resolve, reject) {
            if (node) {
                resolve(node);
            }
            else {
                fs.readFile(
                    filename,
                    'utf-8',
                    function (error, content) {
                        if (error) {
                            reject();
                            console.log('read file is error');
                        }
                        else {
                            options['content'] = content;

                            node = new Node(options);
                            me.dendencyMap.set(filename, node);

                            resolve(node);
                        }
                    }
                );
            }
        });
    }
}

module.exports = function (options) {
    return new Promise(function (resolve) {
        resolve(new Tree(options));
    })
    .then(function (node) {
        console.log(node)
    });
};
