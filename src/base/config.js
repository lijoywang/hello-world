/**
 * @file 全站配置
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var env;

    var host = location.host;

    switch (host.substr(0, 4)) {

        case 'test':
            env = 'test';
            break;

        case 'beta':
            env = 'beta';
            break;

        default:
            env = host.substr(0, 3) === 'dev'
                ? 'dev'
                : 'prod';

            break;

    }

    /**
     * 当前运行环境
     *
     * @type {string}
     */
    exports.ENV = env;

    /**
     * 主站根 url
     *
     * @type {string}
     */
    exports.SITE_MAIN = 'http://'
                      + (env === 'prod' ? 'www' : env)
                      + '.genshuixue.com';

    /**
     * 机构根 url
     *
     * @type {string}
     */
    var org = 'i';
    if (env == 'test') {
        org = 'test-i.ctest';
    }
    else if (env == 'beta') {
        org = 'beta-i'
    }
    exports.SITE_ORG = 'http://'
                      + org
                      + '.genshuixue.com';

});