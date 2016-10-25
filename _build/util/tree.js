/**
 * Created by phpstorm
 * @file fetree
 * @author lijun
 * @date 16/10/24
 */
var pathType = require('../path/type');
var pathPack = require('../path/index');
var readFile = require('./readFile');
var config = require('../config');
var noop = require('./noop');
var isEmptyObject = require('./isEmptyObject');

var rules = config.rules;

/**
 * @params options {object}
 * @property files {array} 所有文件硬盘路径
 * @property amdConfig {object}
 * @property filter {function} 返回资源文件的过滤之后的路径
 * @property htmlRule {object}
 * @property cssRule {object}
 * @property amdRule {object}
*/
exports.parse = function (options) {
    var files = options.files;

    var dependencyMap = { };
    var reverseDependencyMap = {};
    var createDependence = function (options) {
        var filename = options.filename;
        var pathname = options.pathname;

        //console.log(filename)
        // 初始化主结点
        var dependency = dependencyMap[filename] = dependencyMap[filename] || {};
        if (isEmptyObject(dependency)) {
            Object.assign(
                dependency,
                {
                    filename: filename,
                    content: options.content,
                    children: []
                }
            );
        }

        if (pathname) {
            dependency.children.push(pathname);

            // 创建返向依赖节点
            var reverseDependency = reverseDependencyMap[pathname] = reverseDependencyMap[pathname] || [];
            reverseDependency.push(filename);
        }
    };

    var process = function (filename) {
        if (filename) {
            var content = readFile.sync(filename);

            var isHtml = pathType.isHtml(filename);
            var isCss = pathType.isCss(filename);

            if (isHtml
                || isCss
            ) {
                var rule = isHtml
                    ? rules.htmlRules
                    : rules.cssRules;
                if ((rule || []).length) {
                    rule.forEach(function (item, index) {
                        var match = item.match || noop;

                        content.replace(
                            item.pattern,
                            function (value, $1) {
                                var resource = $1 || match(value) || '';

                                if (resource) {
                                    var pathnameHandle = pathPack({
                                        filename: filename,
                                        resource: resource
                                    });

                                    if (!pathnameHandle.isFilter) {
                                        resource = pathnameHandle.getDisk();

                                        process(resource);
                                    }
                                }

                                createDependence(
                                    {
                                        filename: filename,
                                        pathname: resource,
                                        content: content
                                    }
                                );
                            }
                        );
                    });

                }
            }
            else if (pathType.isJs(filename)) {

            }
            else {

            }
        }
    };

    if (typeof files === 'string') {
        files = [files];
    }

    //return new Promise(function (resolve, reject) {
        // TODO
        files.forEach(function (pathname, index) {
            process(pathname);
        });

        //console.log(dependencyMap);
    //});
};

