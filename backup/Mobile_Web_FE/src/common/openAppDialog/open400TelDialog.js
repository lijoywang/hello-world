/**
 * Created by chenmo on 16/2/19.
 * 打开400电话弹窗
 */
define(function (require) {

    var Dialog = require('common/ui/FullPageDialog/FullPageDialog');
    var app = require('common/app');
    var openAppDialog = require('./openAppDialog');
    var startChat = require('./startChat');
    var ui = require('common/ui');
    var env = require('util/env');
    var $ = require('zepto');


    var makePhoneCall = function (tel) {

        if (app.isApp()) {
            var tel = tel + '';
            var isTeacherApp = app.isTeacherApp();
            var currentVersionNumber = app.version2Number(app.appVersion());
            var supportVersionNumber = app.version2Number('2.7.0');
            if (isTeacherApp && (currentVersionNumber < supportVersionNumber)) {
                if (tel.charAt(0) == '0') {
                    ui.alert('抱歉，该学生手机号为国际手机号码，暂不支持在平台上拨打。您可以通过手机直接拨打手机号【' + tel + '】联系学生。');
                    return;
                } else {
                    tel = Number(tel);
                }
            }
            app.send('toMakePhoneCall', {
                phone_number: tel
            })
        }
        else {
            if (env.os.isIOS) {
                location.href = 'tel:' + tel;
            }
            else {
                var iframe = document.createElement('iframe');
                iframe = $(iframe);

                iframe
                    .css({
                        width: 0,
                        height: 0
                    })
                    .appendTo($(document.body))
                    .prop('src', 'tel:' + tel);
            }

        }
    };


    var makePhoneCallByPlatform = function (tel) {

        tel = tel.replace('-', '');
        var telStr = tel.replace(',', '转');

        var platform = env.os.name;

        if (platform === 'Android') {
            ui.confirm(''
                + '<div style="color: #000;padding: 0 30px;">'
                + '<strong style="font-weight:700;">是否拨打电话</strong>'
                + '<p style="margin-top:10px;">' + telStr + '</p>'
                + '</div>'
            ).done(function () {
                makePhoneCall(tel);
            });

        }
        else {
            makePhoneCall(tel);
        }
    };

    function closeFullDialog(dialog) {
        dialog.hide();
        setTimeout(function () {
            dialog.destroy();
            dialog = null;
        }, 2000);
    }


    return function (huanxinId, imData, tel) {


        tel = tel.toString();

        // by caoying 2015-12-08 这块逻辑判断稍微有点问题：应该是不在app里，先判断是否有400电话，
        // 若有电话，则打电话，若没有，则弹框提示。如果在app里弹出选择im/电话的弹框
        //if (!appController.isApp() && tel) {
        //    makePhoneCallByPlatform(tel);
        //    return;
        //}
        //
        //if (!tel) {
        //    openAppDialog();
        //    return;
        //}

        if (!app.isApp()) {
            if (tel) {
                makePhoneCallByPlatform(tel);
                return;
            }
            else {
                openAppDialog();
                return;
            }
        }
        else {
            tel = tel.replace('-', '');
            var telStr = tel.replace(',', '转');
            var htmlArray = '<div class="fsdlg-mask">' +
                '<div class="fsdlg-container fsdlg-tel400">' +
                '<ul class="fsdlg-body">' +
                '<li data-opttype="im" class="fsdlg_im">在线咨询</li>' +
                '<li data-opttype="tel" class="fsdlg_tel">电话咨询(' + tel + ')</li>' +
                '</ul>' +
                '</div>' +
                '</div>';


            var dialog = new Dialog({
                'content': htmlArray,
                'animateType': 0,
                'position': 'fixed',
                'closeButton': false,
                'backgroundColor': 'transparent',
                'zIndex': 800
            });
            dialog.show();
            $('.fsdlg_im').click(function () {
                closeFullDialog(dialog);
                startChat(huanxinId, imData);
            });
            $('.fsdlg_tel').click(function () {
                closeFullDialog(dialog);
                makePhoneCallByPlatform(tel);
            });
        }

    };

});