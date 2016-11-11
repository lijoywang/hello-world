/**
 * @file router
 * @author lijun
 */
define(function (require, exports) {

    'use strict';

    var utilUrl = require('cc/util/url');

    var routerMaps = {
        __auto: ''
    };

    var router = {
        add: function (key, fun) {
            var me = this;
            var eachData = { };

            if (!$.isFunction(key)) {
                if ($.type(key) === 'string') {
                    eachData[key] = fun;
                }
                else if ($.type(key) === 'array') {
                    $.each(
                        key,
                        function (index, hashKey) {
                            eachData[hashKey] = fun;
                        }
                    );
                }
                else {
                    $.extend(
                        eachData,
                        key
                    );
                }

                $.each(
                    eachData,
                    function (key, fun) {
                        var hashFun = routerMaps[key];
                        if (!hashFun) {
                            routerMaps[key] = fun;
                        }
                    }
                );
            }
            else {
                if (!routerMaps.__auto) {
                    routerMaps.__auto = key;
                }
            }
        },
        getHashHead: function (url) {
            var hash = (url || location.hash).split('#')[1];
            if (hash) {
                return '#' + hash.split('?')[0];
            }

            return '';
        },
        parseQuery: function (url, params) {
            var hashStr = (url || location.hash).split('?')[1] || '';
            var result = {};

            if ($.trim(hashStr)) {
                result = utilUrl.parseQuery(hashStr);
            }

            if (params) {
                $.extend(
                    result,
                    params
                );
            }

            return result;
        },
        switch: function (url, params) {
            var me = this;
            var hashValue = me.getHashHead(url);
            var hashParams = me.parseQuery(url, params);

            var hashPramsStr = '';
            if (!$.isEmptyObject(hashParams)) {
                hashPramsStr = '?' + $.param(hashParams);
            }

            if (me.getHashHead(location.hash) != hashValue) {
                location.href = url.split('?')[0] + hashPramsStr;
            }
            else {
                var hashFun = routerMaps[hashValue];

                if (hashFun) {
                    hashFun(
                        hashParams,
                        hashValue
                    );
                }

                if (routerMaps.__auto) {
                    routerMaps.__auto(
                        hashParams,
                        hashValue
                    );
                }
            }
        }
    };

    window.onhashchange = function () {
        router.switch(
            location.hash
        );
    };

    return router;
});
