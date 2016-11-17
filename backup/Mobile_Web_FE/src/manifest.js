/**
 * Created by xuzheng on 15/12/15.
 */

require.config({
    'baseUrl': '{{$static_origin}}/src/',
    'packages': [
        {
            'name': 'zepto',
            'location': '../lib/zepto',
            'main': 'zepto'
        },
        {
            'name': 'iscroll',
            'location': '../lib/iscroll',
            'main': 'iscroll'
        },
        {
            'name': 'jockey',
            'location': '../lib/jockey',
            'main': 'jockey'
        },
        {
            'name': 'ga',
            'location': '../lib/ga',
            'main': 'ga'
        },
        {
            'name': 'template',
            'location': '../lib/artTemplate',
            'main': 'template'
        }
        ,
        {
            'name': 'template',
            'location': '../lib/artTemplate',
            'main': 'template'
        },
        {
            'name': 'swiper',
            'location': '../lib/swiper/dist/js',
            'main': 'swiper'
        }
    ]
    /*paths: {
        swiper: '../lib/swiper/dist/js/swiper.min'
    },
    shim: {
        swiper: {
            exports: 'Swiper'
        }
    }*/
});
initRequireConfig(1);