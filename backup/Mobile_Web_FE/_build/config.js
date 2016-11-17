var path = require("path");

exports.dir = __dirname;

exports.src = "/src";

exports.s2m = "resources";

exports.lib = "lib";
//项目根目录
exports.projectRoot = path.dirname(__dirname);
//开发根目录
exports.developSrc = path.join(this.projectRoot,exports.src);
//开发依赖目录
exports.developLib = path.join(this.projectRoot,exports.lib);
//开发mainfest
exports.manifest = path.join(exports.developSrc,"manifest.js");
//output tpl
exports.view = path.join(exports.projectRoot,"/output/view");
//output public静态资源
exports.public = path.join(exports.projectRoot,"/output/public");
//output version
exports.version = "v2";
//require
exports.requireDir = exports.s2m;
//发布根目录
exports.rleaseSrc = path.join(exports.version,exports.s2m);
//发布依赖目录
exports.rleaseLib = path.join(exports.version,exports.lib);
//上传图片配置文件地址
exports.loadImagePath = path.join(exports.version,exports.s2m,"loadImageConfig.json");
//上传图片服务器地址
exports.devImageServerPath = "http://test-img.gsxservice.com/";

exports.betaImageServerPath = "http://img.gsxservice.com/";

//local loader config
exports.localLoaderConfig = {
    dir_path: "",
    enable_combo: false //是否开启文件合并
};

exports.devLoaderConfig = {
    dir_path: "",
    enable_combo: true
};
//dev beta loaderConfig
exports.betaLoaderConfig = {
    dir_path: "",
    enable_combo: true
};


