/**
 * @file 钱包中心配置
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var config = require('common/config');
    var constant = require('./constant');

    var main = config.SITE_MAIN;
    var org = config.SITE_ORG;

    var roleUrl = { };
    roleUrl[constant.USER_ROLE_STUDENT] = {
        homeUrl: main,
        centerUrl: main + '/lesson/studentLessons',
        quitUrl: main + '/auth/logout?next=/static/login',
        helpUrl: main + '/guide/student_layout?a=student&op=compensation',
        downloadAppUrl: main + '/static/app',
        agreementUrl: main + '/guide/service_layout?a=service&op=fast-payment'
    };
    roleUrl[constant.USER_ROLE_TEACHET] = {
        homeUrl: main,
        centerUrl: main + '/teacher_center',
        quitUrl: main + '/auth/logout?next=/static/login',
        helpUrl: main + '/guide/teacher_layout?a=teacher&op=compensation',
        downloadAppUrl: main + '/static/app',
        agreementUrl: main + '/guide/service_layout?a=service&op=fast-payment'
    };
    roleUrl[constant.USER_ROLE_INSTITUTION] = {
        homeUrl: main,
        quitUrl: 'http://passport.genshuixue.com/logout.do?service=http://i.genshuixue.com',
        helpUrl: main + '/guide/org_layout?a=org&op=money',
        downloadAppUrl: org + '/download',
        agreementUrl: main + '/guide/service_layout?a=service&op=fast-payment'
    };

    exports.roleUrl = roleUrl;

    exports.init = function () {
        roleUrl[constant.USER_ROLE_INSTITUTION].centerUrl = org
            + '/main?tick=' + userData.number + '#/';
    };

});