/**
 * Created by phpstorm
 * @file config
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');

exports.dirname = __dirname;

exports.developSrc= 'src'; // 开发目录
exports.developLib= 'lib'; // 第三方类库
exports.output = 'output'; // 输入根路径
exports.outputSrc = 'assert';
exports.outputLib = 'lib';

exports.rules = {
    htmlRules: [
        {
            pattern: /\s+src=['"]([\w\d\/\.])['"]\s+/,
            match: function (pathname) {
                return pathname;
            }
        }
    ],
    cssRules: {

    },
    jsRules: {

    }
};

exports.prefixConfig = {
    'src': 'src',
    '/src': 'src',
    'lib': 'lib',
    '/lib': 'lib'
};

exports.amdConfig = {
    baseUrl: path.join(exports.dirname, exports.developSrc),
    paths: {
        "cores": 'cores',
        "utils": 'utils',
        "services": 'services'
    }
}

exports.files = [
    path.join(diskRoot, 'src/test/index.html')
];
