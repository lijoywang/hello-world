/**
 * @file 页面顶部导航
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    return Ractive.extend({
        template: require('tpl!./Nav.html'),
        data: function () {

            return {
                loaded: true,
                userName: '11',
                rootHttp: 'http://www.genshuixue.com'
            };

        }
    });

});