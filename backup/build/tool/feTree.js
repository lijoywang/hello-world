/**
 * Created by bjhl on 15/12/5.
 */
var feTree = require('fe-tree');
var path = require("path");
var fs = require("fs");
var util = require("./util");
var rule = require("fe-tree/lib/rule");

var config = require("../config");
var fileExports = require("./fileExports").getExportsFile();
var manifest = require("./manifestEdit").getManifest();
var dep = require('./isDep');

var amdConfig = {
    baseUrl: util.fixPath(manifest.baseUrl),
    paths: manifest.paths || {},
    packages: manifest.packages||[]
};

var node = (function(){
    feTree.parse({
        files: fileExports,
        amdConfig: amdConfig,
        htmlRules: [{
            pattern: /require\.toUrl\(\s*['"][^'"]+['"]\s*\)/gi,
            match: function (result) {
                var terms = result.split(/['"]/);
                if (terms.length === 3) {
                    return terms[1];
                }
            }
        },{
            pattern: /file=['"][^'"]+['"]/gi,
            match: function (result) {
                var terms = result.split(/['"]/);
                if (terms.length === 3) {
                    var fileName = terms[1];

                    if(!fileName.match("/")) {
                        fileName = path.join(config.src,fileName);
                    }
                    return fileName;
                }
            }
        },{
            pattern: /\$page_module\s*=\s*['"][^'"]+['"]/gi,
            match: function (result) {
                var terms = result.split(/['"]/);
                if (terms.length === 3) {
                    if(dep.isDepExist(terms[1])) {
                        return rule.parseAmdDependencies(
                            result.replace(/\$page_module\s*\=/, ''),
                            amdConfig
                        );
                    } else {
                        return util.addRequireExtName(terms[1]);
                    }
                }
            }
        },{
            pattern: /\$g_modules\[\]\s*=\s*['"][^'"]+['"]/gi,
            match: function(result){
                var terms = result.split(/['"]/);
                if (terms.length === 3) {
                    if(dep.isDepExist(terms[1])) {
                        return rule.parseAmdDependencies(
                            result.replace(/\$g_modules\[\]\s*\=/, ''),
                            amdConfig
                        );
                    } else {
                        return util.addRequireExtName(terms[1]);
                    }
                }
            }
        }],
        processDependency: function (dependency, node) {

            var raw = dependency.raw;

            //过滤依赖
            if(util.isFilterPath(raw)) {
                return;
            }

            // 纠正依赖路径 html,css
            if (!dependency.amd) {
                var fixPathName = util.fixPath(raw,node.file);

                if(fixPathName !== raw) {
                    dependency.file = fixPathName;
                }

                if (!dependency.file && /^(\.\/|[^./])/.test(raw)) {
                    dependency.file = path.join(node.file, '..', raw);
                }
            }

            var moduleExclude = {
                jquery: 1,
                text: 1,
                tpl: 1,
                css: 1,
                js: 1
            };

            var rawExclude = {
                require: 1,
                exports: 1,
                module: 1
            };

            if (!moduleExclude[dependency.module]
                && !rawExclude[dependency.raw]
            ) {
                return dependency;
            }
        }
    });

    return feTree;
})();

exports.dependencyMap = node.dependencyMap;
exports.reverseDependencyMap = node.reverseDependencyMap;