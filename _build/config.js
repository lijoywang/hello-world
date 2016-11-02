/**
 * Created by phpstorm
 * @file config
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');

exports.projectRoot = path.dirname(__dirname);

exports.developSrc= 'src'; // 开发目录
exports.developLib= 'lib'; // 开发依赖库
exports.output = 'output'; // 输出根路径
exports.outputSrc = 'assert'; // 输出替换src值
exports.outputLib = 'lib'; // 输入替换lib值

// 查找文件内容规则
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
    ]
};

// 路径容错
exports.prefixConfig = {
    'src': 'src'
};

// amd config
exports.amdConfig = {
    baseUrl: path.join(exports.projectRoot, exports.developSrc),
    paths: {
        "cores": 'cores',
        "utils": 'utils',
        "services": 'services'
    }
};

// 入口文件
exports.files = [
    path.join(exports.projectRoot, 'src/test/index.html'),
    path.join(exports.projectRoot, 'src/test/index1.html')
];

