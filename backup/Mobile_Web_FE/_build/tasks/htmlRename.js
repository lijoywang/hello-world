/**
 * Created by bjhl on 15/11/27.
 */
var path = require("path");
var util = require("../tool/util");
var biz = require("../tool/biz");

var htmlRules = {
    require_to_url: /require\.toUrl\(\s*['"][^'"]+['"]\s*\)/gi,
    href: /href=['"](?:[^'"]+\.(?:ico|css|less|styl|sass)(?:\?.+)?)['"]/gi,
    src: /src=['"][^'"]+['"]/gi,
    file: /file=['"][^'"]+['"]/gi,
    page_module: /\$page_module\s*=\s*['"][^'"]+['"]/gi,
    require: /require\s*?\(\s*?(\[?[^{}\]]+\]?)/ig,
    url: /url\(\s*?['"]?(?:[^'")]+)['"]?\s*?\)/gi,
    g_modules: /\$g_modules\[\]\s*=\s*['"][^'"]+['"]/gi
};

var rulesMatch = function(result){
    var terms = result.split(/['"]/);

    if (terms.length === 3) {
        return terms[1];
    }

    if(/^\s*require/ig.test(result)) {
        return result
            .replace(/require\s*?\(/, '')
            .replace(/[\]\[]/ig,"");
    }
};

var clearEmptyLabel = function(string){
    //删除base下的manifest标签
    var reg = /<script\s*label-del=['"]+true['"]+[^\>]*>[\s\S\n]*?<\/script>/gi;
    return string.replace(reg,"");
};

var replaceContent = function(pathName,string){

    string = clearEmptyLabel(string);

    util.each(htmlRules,function(reg,key){
        string = string.replace(reg,function(value){

            var fileName = rulesMatch(value);

            if(util.isFilterPath(fileName)) {
                return value;
            };
            var name = fileNameFilter[key] && fileNameFilter[key](pathName,fileName);

            //替换值
            if(key == "require_to_url" ) {

                if(util.isLocal() || biz.loadImage.isWhiteList(pathName,fileName)) {
                    console.log(value,fileName,name)
                    return value.replace(fileName,name);
                }

                return "\""+name+"\"";
            }
            //替换require.toUrl
            return value.replace(fileName,name);
        });
    });
    //替换文件中的script标签
    return string;
};

var fileNameFilter = {
    html: function(pathName,fileName){
        if(biz.isFileExist(pathName,fileName)) {
            var releaseName = biz.getReleaseName(pathName,fileName);
            if(util.isHtml(fileName)) {
                return releaseName;
            }

            return biz.getReleaseMd5Name(releaseName);
        }
    },
    image: function(pathName,fileName){
        if(util.isImage(fileName)) {
            return biz.loadImage.getName(pathName,fileName);
        }

        if(util.isFont(fileName)) {
            return biz.addRootPath(biz.getReleaseMd5Name(biz.getReleaseName(pathName,fileName)));
        }
    },
    href: function(pathName,fileName){
        return this.html(pathName,fileName);
    },
    page_module: function(pathName,fileName){
        return this.require(pathName,fileName);
    },
    src: function(pathName,fileName){
        if(util.isImage(fileName)) {
            return this.image(pathName,fileName);
        }
        return biz.addRootPath(this.html(pathName,fileName));
    },
    file:function(pathName,fileName) {
        return this.html(pathName,fileName);
    },
    url: function(pathName,fileName){
        //url
        if(/^v2/.test(fileName)) {
            return fileName;
        }
        return biz.loadImage.getName(pathName,fileName);
    },
    require: function(pathName,fileName){
        var _rname = [];
        //数组的形式要去掉字符串
        fileName.split(",").forEach(function(name){

            var requireName = biz.getRequireName(pathName,name);
            //判断是否为字符串
            if(name.match(/['"]/)){
                requireName = "\""+requireName+"\"";
            }

            _rname.push(requireName);
        });

        return _rname.join(",");
    },
    g_modules: function(pathName,fileName){
        return this.require(pathName,fileName);
    },
    require_to_url: function(pathName,fileName){
        return this.image(pathName,fileName);
    }
};
//require replace name
exports.htmlRename = function(pathName,string){
    return replaceContent(pathName,string);
};