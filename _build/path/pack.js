/**
 * Created by phpstorm
 * @file path handle
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');
var md5 = require('../util/md5');
var config = require('../config');
var pathHandle = require('./handle');

var dirname = path.dirname(config.dirname);
var diskSrc = path.join(dirname, config.developSrc);
var diskLib = path.join(dirname, config.developLib);

var outputSrc = path.join(dirname, config.output, config.outputSrc);
var outputLib = path.join(dirname, config.output, config.outputLib);

var amdConfig = config.amdConfig;
var prefixConfig = config.prefixConfig;

/*
 * @params filename 当前文件硬盘路径
 * @params pathname 资源文件相对路径
 * @params content 当前文件内容
 */
function Pack(options) {
    return new Pack.fn._init(options);
}

Pack.fn = Pack.prototype = {
    /*
     * 初使化
     * @params filename文件名（硬盘路径）
     * @params pathname 引用资源文件
     * @params isAmd 是否amd模块
     */
    _init: function (options) {
        var me = this;

        me.diskPath = '';
        // 输出路径
        me.outerPath = '';

        me.releasePath = '';
        // md5 path
        me.releaseMd5Path = '';

        Object.assign(me, options);
    },
    /*
     * 根据当前文件路径返回引用用资源的硬盘路径
     * @params filename文件名（硬盘路径）
     * @params pathname 引用资源文件
     */
    getDiskPath : function () {
        var me = this;

        if (!me.diskPath) {
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
                var prefix = me.pathname.split(path.sep);
                if (prefix.length > 0) {
                    var prefixPath = prefixConfig[prefix[0]];
                    if (prefixPath) {
                        diskPath = path.join(dirname, prefixPath, prefix[1]);
                    }
                }
            }

            if (diskPath) {
                diskPath = path.join(me.filename, me.pathname);
            }

            me.diskPath = diskPath;
        }

        return me.diskPath;
    },

    /*
     * 返回输出路径
     * @params diskname资源文件
     */
    getOutputPath: function () {
        var me = this;

        var diskPath = this.getDiskPath();

        if (!me.outerPath) {
            if (diskPath.indexOf(diskSrc) > -1) {
                me.outerPath = diskPath.replace(diskSrc, outputSrc);
            } else if (diskPath.indexOf(diskLib) > -1) {
                me.outerPath = diskPath.replace(diskLib, outputLib);
            }
            else {
                console.log('diskPath format error');
            }
        }

        return me.outerPath;
    },

    /*
     * 返回输出加MD5的资源名称
     * @params outputname
     */
    getReleasePath: function () {
        var me = this;

        var outerPath = me.getOutputPath();

        if (!me.releasePath) {
            if (outerPath.indexOf(outputSrc) > -1) {
                me.releasePath = outerPath.replace(outputSrc, path.seq + config.outputSrc);
            } else if (diskPath.indexOf(outputLib) > -1) {
                me.releasePath = outerPath.replace(outputLib, path.seq + config.outputLib);
            }
            else {
                console.log('diskPath format error');
            }
        }

        return me.releasePath;
    },

    /*
     * 返回可替换的路径
     * @params releasename
     * @params pathHandle 原始资源文件，通过pathHandle获取前缀及参数，拼接到releasename
     */
    getReleaseMd5Path: function (content) {
        var me = this;

        var outerPath = me.getOutputPath();
        var md5 = md5(content);

        if (!me.releaseMd5Path) {
            var fileHandle = pathHandle(me.pathname);

            me.releaseMd5Path = path.join(fileHandle.prefix, outerPath, '_' + md5, fileHandle.params);
        }
    }
}

Pack.fn._init.prototype = Pack.fn;

module.exports = Pack;