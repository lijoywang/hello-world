/**
 * Created by bjhl on 15/11/27.
 */
var path = require("path");

var crypto = require("crypto");

var config = require("../config");

var argv = require('yargs').argv;

exports.condition = argv.s;

exports.isDev = function(){
    return this.condition === "dev";
};

exports.isBeta = function(){
    return this.condition === "beta";
};

exports.isLocal = function(){
    return !this.isDev() && !this.isBeta();
};

exports.isDomainPath = function(fileName){
    return /^{{[\s\S]*?}}\/[\w\d\_\-]+/ig.test(fileName);
};

exports.getDomainPath = function(releaseName){
    if(this.isDomainPath(releaseName)){
        return releaseName.match(/^{{[\s\S]*?}}/ig)[0];
    }
    return "";
};

//监听
exports.listerner = (function(){
    var _obj = {};
    return {
        add: function(evt,lisEvent){
            _obj[evt] = "";

            Object.defineProperty(_obj,evt,{
                set: function(value){
                    lisEvent && lisEvent(value);
                },
                get: function(value){
                    return value
                }
            })
        },
        trigger: function(evt,value){
            _obj[evt] = value;
        }
    }
})();

//获取文件类型
exports.getFileType = (function(){
    var _createRegExp = function(arr){
        return new RegExp(arr.join("|"),"ig");
    }

    return function(fileName){
        fileName = exports.getFilterFileName(fileName);

        var extName = path.extname(fileName),
            fileType = extName || "js";

        var cssReg = _createRegExp([".less",".css",".styl"]);
        if(cssReg.test(extName)) {
            fileType = "css"
        }

        var imageReg = _createRegExp([".png",".jpg",".jpeg",".gif"]);
        if(imageReg.test(extName)) {
            fileType = "image"
        }

        var fontReg = _createRegExp([".eot",".woff",".ttf",".svg"]);
        if(fontReg.test(extName)) {
            fileType = "font"
        }

        if(extName == ".js") {
            fileType = "js";
        }

        var stringRegExp = _createRegExp([".tpl",".html"]);
        if(stringRegExp.test(extName)) {
            fileType = "html"
        }

        return fileType;
    }
})();

exports.isImage = function(fileName){
    return this.getFileType(fileName) === "image";
};

exports.isHtml = function(fileName){
    return this.getFileType(fileName) === "html";
};

exports.isJs = function(fileName){
    return this.getFileType(fileName) === "js";
};

exports.isCss = function(fileName){
    return this.getFileType(fileName) === "css";
};

exports.isFont = function(fileName){
    return this.getFileType(fileName) === "font";
}

exports.isOther = function(fileName){
    return !this.isFont(fileName) && !this.isImage(fileName) && !this.isJs(fileName) && !this.isCss(fileName) && !this.isHtml(fileName);
}
//添加缓存
exports.cache = {
    _cache:{},
    set: function(property,obt,value){

        var _self = this;

        this.create(property);

        if(typeof obt === "string") {

            obt = exports.getFilterFileName(obt);

            if(value) {
                this._cache[property][obt] = value;
            } else {
                this._cache[property] = obt;
            }

        } else {
            exports.each(obt,function(value,key){
                exports.cache.set(property,key,value);
                //_self._cache[property][key] = value;
            });
        }
    },
    create: function(property,key){
        if(!this._cache[property]){
            this._cache[property] = {};
        }
        if(key && !this._cache[property][key]) {
            this._cache[property][key] = {};
        }
    },
    get: function(property,key){
        var pro = this._cache[property];

        if(pro && key) {

            key = exports.getFilterFileName(key);

            return pro[key];
        }
        return pro;
    },
    getCache: function(){
        return this._cache
    }
};
//css 插件
exports.cachePlugin = {
    set: function(key,value){
        exports.cache.set("cssPlugin",key,value);
    },
    get: function(key,value){
        return exports.cache.get("cssPlugin",key);
    }
}

//md5
exports.cacheMd5 = {
    //根据releaseName和内容生成MD5的缓存对象
    set: function(releaseName,content){
        var fileType = exports.getFileType(releaseName);

        exports.cache.set(fileType,releaseName,exports.md5(content));
    },
    get: function(property,key){
        return exports.cache.get(property,key);
    }
};
//md5
exports.cacheImage = {
    //根据releaseName和内容生成MD5的缓存对象
    set: function(releaseName,content){
        exports.cache.set("image",key,value);
    },
    get: function(key){
        exports.cache.get("image",key);
    }
};

//根据内容生成发布后的MD5,并生成原文件与MD5映射表
exports.md5 = function(content){
    var md5 = crypto.createHash("md5");
    md5.update(content);
    return md5.digest("hex").slice(0,10);
};

exports.each = function (target, handler) {
    if( Object.prototype.toString.call(target) === "[object Array]") {
        for (var i= 0,l=target.length;i<l;i++) {
            handler(target[i],i);
        }
    } else {
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                handler && handler(target[key], key);
            }
        }
    }
};

//判断是否以http,https,{{,development开始文件内容
exports.isFilterPath = function(fileName){
    //静态资源不过滤
    if(exports.isDomainPath(fileName)) {
        return false;
    }

    var regExp = new RegExp(("^("+config.developSrc+"|"+config.developLib+"|data:|,|http|https|{{)"),"i");

    return regExp.test(fileName);
};
//判断开发路径pathName如果在fileter数组当中
exports.fileFilter = (function(){
    var _filter = [
            "/src/manifest.js",
            "/src/loader.js",
            "/lib/requirejs/plugin_text.js"
        ],
        _rootFilter = function(){
            var temp = [];
            exports.each(_filter,function(value,index){
                temp.push(path.join(config.projectRoot,value));
            });
            return temp;
        },

        _filterList = [];

    return  {
        is: function(fileName,content){
            //TODO
            var _regExp = new RegExp("^"+_rootFilter().join("|")+"$","ig");

            if(_regExp.test(fileName)) {

                if(content) {
                    _filterList.push({
                        fileName: fileName,
                        content: content
                    });
                }
                return true;
            } else {
                return false;
            }

        },
        get: function(){
            return _filterList;
        }
    }
})();
/*
* 拼接文件名,如params,domain
*
* fileName: 原文件名
* rootName: fileName的硬盘路径
* */
exports.getCombineFileName = function(releaseName,fileName){
    var domainPath = this.getDomainPath(fileName);

    if(domainPath){
        releaseName = path.join(domainPath,releaseName);
    }

    var params = fileName.replace(fileName.split(/[\?\#]/)[0],"");

    return releaseName+params;
}
/*
 * 过滤domain,params，返回fileName
 * */
exports.getFilterFileName = function(fileName){
    if(!fileName){
        return fileName;
    }

    if(exports.isFilterPath(fileName)) {
        return fileName;
    }

    return fileName.replace(/((\?|\#)[\s\S]*|{{[\s\S]*?}}\/)/ig,"");
};
//
exports.addRequireExtName = function(fileName){
    //插件
    if(!exports.isHtml(fileName) && !exports.isImage(fileName) && !exports.isCss(fileName)) {
        return fileName+".js";
    }
    return fileName;
}
//修复HTML,CSS当中的路径
exports.fixPath = function(fileName,pathName){

    fileName = exports.getFilterFileName(fileName);


    var projectDir = config.projectRoot;
    //过滤依赖
    if(exports.isFilterPath(fileName)) {
        return fileName;
    }

    //test.js
    //todo
    //if(!fileName.match("/") && pathName) {
    //    fileName = "./"+fileName;
    //}
    //相对路径./ ../
    if(/^\.+/ig.test(fileName) && pathName){

        var basePath = path.dirname(pathName);

        return path.join(basePath,fileName);
    }

    var prefix = {
        '/src': projectDir,
        "/lib": projectDir
    };
    //获取文件根路径,并添加"/";
    var fstart = "/"+fileName.replace(/^\//ig,"").split("/")[0];

    //是否在配置文件当中，如果不存在，将所有路径添加根目录src
    var pfs = prefix[fstart];

    if(pfs) {
        return path.join(pfs,fileName);
    }

    return path.join(config.developSrc,fileName);
};

