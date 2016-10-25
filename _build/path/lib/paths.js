/**
 * Created by phpstorm
 * @file path handle
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');
var md5 = require('../../util/md5');
var config = require('../../config');

var projectRoot = config.projectRoot;
var diskSrc = path.join(projectRoot, config.developSrc);
var diskLib = path.join(projectRoot, config.developLib);

var projectOutput = path.join(projectRoot, config.output);
var outputSrc = path.join(projectOutput, config.outputSrc);
var outputLib = path.join(projectOutput, config.outputLib);

var amdConfig = config.amdConfig;
var prefixConfig = config.prefixConfig;

/**
 * 返回需要的路径方法
 *
 * @params options {object}
 * @property filename {string} 文件名（硬盘路径）
 * @property resource {string} 引用资源文件
 * @property isAmd {boolean} 是否amd模块
 *
 * @params handle {object}
 * @property pathname {string} 去掉前缀和后缀的路径
 * @property prefix {string} resource路径的前缀
 * @property params {string} resource路径的后缀
 * @property extname {string} resource的扩展名
 * @property isPlugin: false,
 * @property isFilter: false
 *
 * @return
 * @property disk {string} pathname的硬盘路径
 * @property outer {string} disk的发布路径
 * @property release {string} outer的发布资源路劲
 * @property releaseMd5 {string} md5资源文件
 */
module.exports = function (options, handle) {

    var module = {
        /*
         * 根据当前文件路径filename返回引用用资源的硬盘路径
         * @params filename文件名（当前文件路径 硬盘路径）
         * @params pathname 引用资源文件
         */
        getDisk: function () {
            var me = this;

            if (me.disk) {
                return me.disk;
            }

            var diskPath = '';
            // 模块
            if (me.isAmd) {
                var baseUrl = amdConfig.baseUrl;
                var paths = amdConfig.paths;

                var amdPath = paths[me.pathname];
                if (amdPath) {
                    diskPath = path.join(baseUrl, amdPath);
                }
            }
            // template
            else {

                    var prefixKey = '';
                    for (var key in prefixConfig) {
                        // TODO
                        if (me.pathname.indexOf(key) === 0) {
                            prefixKey = key;
                        }
                    }

                    if (prefixKey) {
                        diskPath = path.join(
                            projectRoot,
                            prefixConfig[key],
                            me.pathname.replace(prefixKey, '')
                        );
                    }
            }

            if (!diskPath) {
                diskPath = path.join(
                    path.dirname(me.filename),
                    me.pathname
                );
            }

            me.disk = diskPath;

            return diskPath;
        },

        /*
         * 返回输出路径
         * @params diskname资源文件
         */
        getOutput: function () {
            var me = this;
            var disk = me.getDisk();

            if (me.outer) {
                return me.outer;
            }

            if (disk.indexOf(diskSrc) > -1) {
                me.outer = disk.replace(diskSrc, outputSrc);
            }
            else if (disk.indexOf(diskLib) > -1) {
                me.outer = disk.replace(diskLib, outputLib);
            }
            else {
                console.log('diskPath format error');
            }

            return me.outer;
        },

        /*
         * 返回输出加MD5的资源名称
         * @params output file name
         */
        getRelease: function () {
            var me = this;
            var sep = path.sep;

            var outer = me.getOutput();

            if (me.release) {
                return me.release;
            }

            if (outer.indexOf(outputSrc) > -1) {
                me.release = outer.replace(outputSrc, sep + config.outputSrc);
            }
            else if (outer.indexOf(outputLib) > -1) {
                me.release = outer.replace(outputLib, sep + config.outputLib);
            }
            else {
                console.log('release format error');
            }

            return me.release;
        },

        /*
         * 返回可替换的路径
         * @params releasename
         * @params pathHandle 原始资源文件，通过pathHandle获取前缀及参数，拼接到releasename
         */
        getReleaseMd5: function (content) {
            var me = this;

            var release = me.getRelease();
            var md5 = md5(content);

            if (me.releaseMd5) {
                return me.releaseMd5;
            }

            me.releaseMd5 = path.join(me.prefix, release, '_' + md5, me.params);

            return me.releaseMd5;
        }
    };

    Object.assign(module, options);

    if (handle) {
        Object.assign(module, handle);
    }

    return module;
};