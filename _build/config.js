/**
 * Created by phpstorm
 * @file config
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');

exports.projectRoot = path.dirname(__dirname);

exports.developSrc= 'src'; // 开发目录
exports.developLib= 'lib'; // 第三方类库
exports.output = 'output'; // 输入根路径
exports.outputSrc = 'assert';
exports.outputLib = 'lib';

exports.rules = {
    htmlRules: [
        {
            pattern: /\s+src=['"]([\w\d\/\.]+)['"]/ig
        },
        {
            pattern: /\s+href=['"]([^'"]+)['"]/ig,
            match: function (pathname) {
                return pathname;
            }
        }
    ],
    cssRules: [
        {
            pattern: /^\s*@import\s+['"]([^'"]+)['"]/ig
        }
    ],
    jsRules: {

    }
};

exports.prefixConfig = {
    'src': 'src'
};

exports.amdConfig = {
    baseUrl: path.join(exports.projectRoot, exports.developSrc),
    paths: {
        "cores": 'cores',
        "utils": 'utils',
        "services": 'services'
    }
}

exports.files = [
    path.join(exports.projectRoot, 'src/test/index.html')
];
