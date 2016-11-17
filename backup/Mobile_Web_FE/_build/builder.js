/**
 * Created by bjhl on 15/11/27.
 */
var other = require("./builder/other");
var font = require("./builder/font");
var css = require("./builder/css");
var js = require("./builder/js");
var html = require("./builder/html");
var image = require("./builder/image");

exports.build = function(){
    /*
     * 执行步骤
     * other 输出，如.swf
     *
     * font 输出
     *
     * CSS
     * 1.编译，并将编译后的内容，添加树结点,图片替换
     * 2.压缩，生成MD5，生成配置文件｛原文件：MD5号｝写文件到发布目录
     *
     * JS
     * 2.重命名：require文件地址替换，require.getImage图片地址替换,AMD
     * 3.require插件实现，将插件转为JS文件，依赖于CSS编译后的树结点content，AMD
     * 4.树结点与插件的esprima压缩，转为JS原文件，生成MD5，生成配置文件｛原文件：MD5号｝写文件到发布目录
     *
     * HTML
     * 4.根据CSS配置替换CSS,根据JS配置文件替换JS，写文件到发布目录
     *
     * 5.IMAGE
     * 根据image配置上传图片，
     *
     * */
    other.build();

    font.build();

    css.build(function(){
        js.build();

        html.build();

        image.build();
    });
};