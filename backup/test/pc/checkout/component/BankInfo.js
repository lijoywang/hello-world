/**
 * @file 银行卡信息
 * @author
 */
define(function (require, exports, module) {

    'use strict';

    var etpl = require('cc/util/etpl');

    var renderOption = etpl.compile(
          '<img src="${bank_logo}" />'
        + '<span class="card-no">${card_no}</span>'

        + '<div class="all-card-type">'
        + '<!-- if: ${card_type} == "C" -->'
        +     '<span class="card-type label tiny primary">信用卡</span>'
        + '<!-- else -->'
        +     '<span class="card-type label tiny primary">储蓄卡</span>'
        + '<!-- /if -->'

        + '<!-- if: 1 -->'
        +     '<span class="label tiny info">快捷</span>'
        + '<!-- /if -->'
        + '</div>'

        + '<span class="each-pay small muted">单笔限额${pay_each}</span>'
        + '<span class="each-day small muted">单日限额${pay_day}</span>'
    );

    return Ractive.extend({
        template: require('tpl!./BankInfo.html'),
        data: function () {
            return {

                style: require('text!./BankInfo.styl'),

                options: {
                    name: '',
                    className: '',
                    defaultText: '请选择',
                    data: null,
                    value: '',
                    disabled: false,
                    hidden: false,
                    onselect: $.noop
                },

                selectOptions: {

                }

            };
        },
        components: {
            Select: require('../../common/component/Select')
        },
        oncomplete: function () {
            this.observe('selectOptions.value', function (value) {
                this.set('options.value', value);
            });
            this.observe('selectOptions.disabled', function (disabled) {
                this.set('options.disabled', disabled);
            });
            this.observe('selectOptions.hidden', function (hidden) {
                this.set('options.hidden', hidden);
            });
        },
        onconfig: function () {

            var options = this.get('options');
            var cardList = options.data;

            var data = [ ];
            $.each(
                cardList,
                function (index, card) {
                    data.push({
                        text: renderOption(card),
                        value: index
                    });
                }
            );

            var selectOptions = $.extend({}, options, {
                data: data
            });

            this.set('selectOptions', selectOptions);

        },
    });

});