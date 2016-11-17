/**
 * @file 选择帐号类型
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var constant = require('../constant');

    return Ractive.extend({
        template: require('tpl!./AccountTypeSelector.html'),
        data: function () {
            return {
                style: require('text!./AccountTypeSelector.styl'),
                accountTypeList: [
                    {
                        value: constant.ACCOUNT_TYPE_PERSON,
                        text: '个人帐号'
                    },
                    {
                        value: constant.ACCOUNT_TYPE_COMPANY,
                        text: '企业帐号'
                    }
                ],
                options: {
                    value: constant.ACCOUNT_TYPE_PERSON
                }
            };
        }
    });

});