/**
 * @file 我的优惠券
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('./service');
    var constant = require('../../common/constant');
    var toNumber = require('cc/function/toNumber');

    var PAGE_SIZE = 10;

    return Ractive.extend({
        template: require('tpl!./couponList.html'),
        data: function () {
            return {
                style: require('text!./couponList.styl'),

                type: constant.COUPON_UNUSED,
                COUPON_UNUSED: constant.COUPON_UNUSED,
                COUPON_USED: constant.COUPON_USED,
                COUPON_OUT_OF_DATE: constant.COUPON_OUT_OF_DATE,

                unused: {
                    list: [],
                    hasMore: false,
                    page: 0,
                    loading: false
                },
                used: {
                    list: [],
                    hasMore: false,
                    page: 0,
                    loading: false
                },
                out: {
                    list: [],
                    hasMore: false,
                    page: 0,
                    loading: false
                },
            };
        },

        oncomplete: function () {

            var me = this;

            me.observe('type', function (type) {
                var keypath = me.getKeypath(type);
                var list = me.get(keypath + '.list');
                if (list.length < 1) {
                    me.getCouponList(type);
                }
            });
        },

        getKeypath: function (type) {
            var keypath;
            if (type == constant.COUPON_UNUSED) {
                keypath = 'unused';
            }
            else if (type == constant.COUPON_USED) {
                keypath = 'used';
            }
            else if (type == constant.COUPON_OUT_OF_DATE) {
                keypath = 'out';
            }
            return keypath;
        },
        getCouponList: function (type) {
            var me = this;
            var pageSize = PAGE_SIZE;
            var keypath = me.getKeypath(type);
            me.set(keypath + '.loading', true);

            service
            .getCouponList({
                page: me.get(keypath + '.page') + 1,
                pageSize: pageSize,
                status: type
            })
            .then(
                function (response) {
                    var response = response.data;
                    var responseList = response.list;
                    var list = me.get(keypath + '.list');
                    if (responseList && responseList !== null) {
                        $.each(responseList, function (index, item) {
                            list.push(item);
                        });
                    }
                    var page = response.page;
                    var size = response.size;
                    var total = response.total;
                    var data = {};
                    data[keypath + '.loading'] = false;
                    data[keypath + '.page'] = toNumber(page);
                    data[keypath + '.hasMore'] = total > page * size;
                    me.set(data);
                },
                function () {
                    me.set(keypath + '.loading', false);
                }
            );
        },
        loadMore: function (type) {
            var keypath = this.getKeypath(type);
            this.getCouponList(type);
        },
        toUseCoupon: function (url) {
            window.open(url);
        }
    });

});