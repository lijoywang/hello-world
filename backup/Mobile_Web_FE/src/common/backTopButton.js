/**
 * Created by xuzheng on 15/10/12.
 */
define(function (require, exports) {

    'use strict';

    var html = '' +
        '<div class="back-top-component">' +
        '   <img width="100%" src="http://m-cdn.gsxservice.com/asset/img/org/back_top_4197a2b630.png" />' +
        '</div>';

    var init = false;

    var scrollPosition = 280;

    function initFn() {
        require([
            'zepto',
            'common/mvc/observer',
            'common/page_layout',
            'util/dom'], function ($, observer, page_layout, util_dom) {
            /*var $container = $('<div></div>');
            $container.css({
                'width': '40px',
                'height': '40px',
                'margin': '10px 10px 20px 10px',
                'overflow': 'hidden'
            });*/
            

            var $element = $(html);
            //$element.appendTo($container);
            util_dom.enableGPU($element.get(0));

            
            $element.css({
                "width": "2.5rem",
                "height": "2.5rem",
                "z-index": 150,
                "bottom": "3.625rem",
                "right": ".625rem",
                "line-height": "2.3rem",
                "color": "#fff",
                "position": "fixed",
                "transition": "all 0.5s",
                "box-shadow": "0px 0px 6px #ccc",
                "border-radius":"100%",
                "transform": "translate3d(60px,0,0)"
            });

            function update() {
                if ($(window).scrollTop() > scrollPosition) {
                    show();
                } else {
                    hide();
                }
            }

            var isShow = false;
            var timer;

            function show() {
                if (!isShow) {
                    isShow = true;
                    //clearTimeout(timer);
                    /*$container.show();*/
                    /*observer.trigger($container, 'resize');*/
                    $element.css('transform', 'translate3d(0px,0,0)');
                }
            }

            function hide() {
                if (isShow) {
                    isShow = false;
                    $element.css('transform', 'translate3d(60px,0,0)');
                    /*timer = setTimeout(function () {
                        $container.hide();
                        observer.trigger($container, 'resize');
                    }, 600);*/
                }
            }

            observer.addDomListener(window, 'scroll', update);
            $element.click(function () {
                $(window).scrollTop(0);
            });
            $('body').append($element);
            // page_layout.right_bottom.addElement($container, 10);

            update();
        });
    }
    exports.init = function () {
        if (init) {
            return;
        }
        init = true;

        initFn();
    };
});