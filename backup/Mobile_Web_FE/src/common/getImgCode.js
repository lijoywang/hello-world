/**
 * Created by caoying on 15/11/25.
 */
define(function(require,exports){
    'use strict';

    var service = require('common/service');
    var observer = require('common/mvc/observer');
    var ui_new = require('common/ui');
    var ImageCheckCodeDialog = require('common/ui/ImageCheckCodeDialog/ImageCheckCodeDialog');

    /**
     * 获取验证码
     * @param  {Object} param
     * @property {string} param.mobile  手机号
     * @property {string} param.type  activity 注册短信
     *                       'common','register','forget_password', 'voice','change_pay_password'
     * @property {string} [param.captcha] 图形验证码
     * @property {string} [param.captcha_name] 图形验证码类型，与type一致
     * @return {Promise}
     */

    exports.getCode = function(param){
        var deferred = $.Deferred();
        var doSend = function (imageCode) {
            if (imageCode) {
                param['captcha'] = imageCode + '';
                param['captcha_name'] = param.type;
            }

            service.post('/sms/send', param, function (response) {
                if (response.code == '1000111' || response.code == '110056') {
                    //TODO
                    var imageCodeDialog = new ImageCheckCodeDialog({
                        'text': '获取短信验证码过于频繁',
                        'type': param.type,
                        'errorText': response.code == '110056' ? '验证码错误，请重新输入' : ''
                    });
                    observer.addListenerOnce(imageCodeDialog, 'success', function (code) {
                        imageCodeDialog.hide();
                        imageCodeDialog.destroy();
                        doSend(code);
                    });
                    observer.addListenerOnce(imageCodeDialog, 'cancel', function () {
                        deferred.resolve({
                            code: -1
                        });
                    });
                    imageCodeDialog.show();

                } else {
                    deferred.resolve(response);
                }

                return false;
            });
        };
        doSend();

        return deferred;
    }

});