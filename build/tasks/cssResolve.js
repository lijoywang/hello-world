/**
 * Created by bjhl on 15/11/27.
 */
var fs = require("fs");
var path = require("path");
var stylus = require("stylus");
var util = require("../tool/util");
var biz = require("../tool/biz");
var epr = require('edp-provider-rider');
var cleanCss = require('clean-css');

var config = require("../config");
var writeTask = require("./write");

var CleanCSS = new cleanCss();

//默认配置
var stylusPlugin = epr.plugin({
    use: function (style) {
        style.define('url', epr.stylus.resolver());
    }
});
//编译前的长度
var compileLength = 0;
//编译后的长度
var compiledLength = 0;

exports.cssResolve = function(deps,rootPath,callback){
    var _self = this,
        deps = deps.join();//当前文件的反依赖树

    //JS插件
    function isJsPlugin(){
        return deps.indexOf(".js") > -1;
    }
    //入口文件
    function isExports(){
        return  deps.indexOf('.tpl') > -1 || deps.indexOf('.html') > -1 || isJsPlugin();
    }
    //write
    function write(string){
        CleanCSS.minify(string, function (errors, minified) {
            if(!errors && minified && (undefined != minified.styles)){
                string = minified.styles;
                if(isJsPlugin()){
                    //添加缓冲
                    util.cachePlugin.set(rootPath,string);
                } else {
                    var saveName = biz.getReleaseMd5Name(biz.getReleaseName(rootPath), string);

                    writeTask.write(saveName,string);
                }
            } else {
                console.error(errors);
            }

            compiledLength++;
            isCallback();
        });
    }
    //
    function isCallback(){
        if(compiledLength === compileLength){
            callback && callback();
        }
    }
    //
    function replaceContent(content){
        //image replace
        var reg =  /url\(\s*?['"]?(?:[^'")]+)['"]?\s*?\)/gi;

        var string = content.replace(reg,function(result){

            var terms = result.split(/['"]/);

            if (terms.length === 3) {
                var value = terms[1];
                if(value) {
                    if(util.isImage(value)) {
                        var name = biz.loadImage.getName(rootPath,value);
                        return "url('"+name+"')"
                    }

                    if(util.isFont(value)) {
                        var name = biz.getReleaseMd5Name(biz.getReleaseName(rootPath,value));
                        return "url('"+biz.addRootPath(name)+"')";
                    };

                    return "url('"+value+"')";
                }
            }
            return result;
        });

        write(string);
    }
    //

    function compile(content){

        stylus(content)
            .set("filename",rootPath)
            .set("paths",[config.developSrc])
            .use(stylusPlugin)
            .render(function(err, css){
                if(err){
                    console.error(err);
                } else {
                    replaceContent(css);
                }
            });
    }

    //入口文件
    if(isExports()){
        compileLength++;
        fs.readFile(rootPath,'utf-8',function(rerr,content){
            if(rerr) {
                console.error(rerr);
            } else {
                compile(content);
            }
        });
    }
};

