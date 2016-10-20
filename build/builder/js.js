/**
 * Created by bjhl on 16/01/14.
 */
var feTree = require("../tool/feTree");
var util = require("../tool/util");
var fs = require("fs");
var biz = require("../tool/biz");
var writeTask = require("../tasks/write");
var renameTask = require("../tasks/rename");
var amdTask = require("../tasks/amd");
var generateTask = require("../tasks/generate");

var jsBuild = function(ast,fileName){
    //将esprima转成压缩后的JS文件，并返回内容
    var minjs = generateTask.generate(ast);
    //将pathname改为发布后的带MD5的文件路径，并将内容发布到当前路径下
    writeTask.write(biz.getReleaseMd5Name(fileName,minjs),minjs);
};
//插件发布
var pluginBuild = function(){
    //插件发布
    var jsPlugin = biz.plugin.get();
    util.each(jsPlugin,function(ast,fileName) {
        var releaseName = biz.getReleaseName(fileName);
        jsBuild(ast,releaseName);
    });
};
//deps
var buildDep = function(dependencyMap,output){
    var manifest = {
        version:{},
        deps:{}
    };
    var reDeps = {};//去重
    var jsMd5List = util.cacheMd5.get("js");
    var addVersion = function(path){
        var releaseName = biz.getReleaseName(path);
        var pathMd5 = jsMd5List[releaseName];

        if(!manifest.version[releaseName]) {
            manifest.version[releaseName] = pathMd5;
        }
    };
    var addDep = function(path,dep){
        var pathReleaseName = biz.getReleaseName(path);

        manifest.deps[pathReleaseName] = manifest.deps[pathReleaseName] || [];
        reDeps[pathReleaseName] = reDeps[pathReleaseName] || {};

        if(dep && !reDeps[pathReleaseName][dep]) {
            var depReleaseName = biz.getReleaseName(dep);
            manifest.deps[pathReleaseName].push(depReleaseName);
        }
    };
    var addPluginDep = function(path,dep){
        if((util.isHtml(path) || util.isCss(path)) && biz.plugin.isPlugin(path)) {
            path = biz.plugin.getPlugName(path);
            addVersion(path);
            addDep(path,dep);
            return true;
        }
        return false;
    }
    //生成依赖表
    util.each(dependencyMap,function(item,path){
        //JS生成依赖表
        var path = item.file;
        var deps = item.children;

        //插件添加依赖
        if(biz.plugin.isPlugin(path)) {
            path = biz.plugin.getPlugName(path);
            addVersion(path);
            addDep(path);
            return false;
        }
        //JS文件并不没有过滤添加依赖
        if(util.isJs(path) && !util.fileFilter.is(path)) {
            addVersion(path);
            addDep(path);
            if(deps.length) {
                util.each(deps,function(depItem){
                    var node = depItem.node;
                    var file = node.file;
                    //同步加载添加依赖
                    if(!depItem.async){
                        if(biz.plugin.isPlugin(file)){
                            file = biz.plugin.getPlugName(file);
                            addDep(path,file);
                            return false;
                        }

                        if(util.isJs(file)){
                            addDep(path,file);
                            return false;
                        }

                    }
                    //depItem.children.length && recurDep(depItem.children);
                });
            }
        }
    });

    var loaderConfig = biz.getLoaderConfig();
    //根据环境不同，分配给loader不同的配置
    manifest["dir_path"] = loaderConfig.dir_path;

    manifest["enable_combo"] = loaderConfig.enable_combo;

    var content = "window.initRequireConfig && window.initRequireConfig("+JSON.stringify(manifest)+")";
    //文件名称与文件内容，生成MD5的配置文件｛fileName:md5｝
    util.cacheMd5.set(biz.getReleaseName(output),content);

    writeTask.write(biz.getReleaseName(output),content);
};
//过滤文件处理
var filterFile = function(dependencyMap){
    //依赖文件必须最后生成
    util.each(util.fileFilter.get(),function(item,key){
        if(/manifest\.js$/ig.test(item.fileName)) {
            buildDep(dependencyMap,item.fileName);
            return;
        };

        if(/loader\.js$/ig.test(item.fileName)) {
            jsBuild(item.content,biz.getReleaseName(item.fileName));
            return;
        };
    });
};
//对当前文件AST过滤，并添加插件，发布
var astPublish = function(dependencyMap){
    util.each(dependencyMap,function(dps,fileName){
        if(util.isJs(fileName)) {
            var amd = dps.amd || {};
            if(!util.fileFilter.is(fileName,amd.ast)) {
                //重命名，并添加插件，生成AMD插件内容文件
                renameTask.rename(amd);
                //JS文件AMD
                amdTask.amd(amd);

                jsBuild(amd.ast,biz.getReleaseName(amd.path));
            }
        }
    });
};

exports.build = function(){
    var dependencyMap = feTree.dependencyMap;
    //对正向依赖中的AST编辑并发布
    astPublish(dependencyMap);
    //插件发布
    pluginBuild();
    //过滤文件处理
    filterFile(dependencyMap);
};