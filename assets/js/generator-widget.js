/**
 * Created by Denis on 13.10.2016.
 */
export default class GeneratorWidget {
    constructor(id = 1, city_id = 524901, key = '2d90837ddbaeda36ab487f257829b667' ){
        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue' : {
                code: `<script src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>
                       ${this.getCodeForGenerateWidget(id, city_id, key)}`,
                schema: 'blue',
            },
            'widget-2-left-blue' : {
                code: 'script.js?type=left&schema=blue&id=2',
                schema: 'blue',
            },
            'widget-3-left-blue' : {
                code: 'script.js?type=left&schema=blue&id=3',
                schema: 'blue',
            },
            'widget-4-left-blue' : {
                code: 'script.js?type=left&schema=blue&id=4',
                schema: 'blue',
            },
            'widget-5-right-blue' : {
                code: 'script.js?type=right&schema=blue&id=5',
                schema: 'blue',
            },
            'widget-6-right-blue' : {
                code: 'script.js?type=right&schema=blue&id=6',
                schema: 'blue',
            },
            'widget-7-right-blue' : {
                code: 'script.js?type=right&schema=blue&id=7',
                schema: 'blue',
            },
            'widget-8-right-blue' : {
                code: 'script.js?type=right&schema=blue&id=8',
                schema: 'blue',
            },
            'widget-9-right-blue' : {
                code: 'script.js?type=right&schema=blue&id=9',
                schema: 'blue',
            },
            'widget-1-left-brown' : {
                code: 'script.js?type=left&schema=brown&id=1',
                schema: 'brown',
            },
            'widget-2-left-brown' : {
                code: 'script.js?type=left&schema=brown&id=2',
                schema: 'brown',
            },
            'widget-3-left-brown' : {
                code: 'script.js?type=left&schema=brown&id=3',
                schema: 'brown',
            },
            'widget-4-left-brown' : {
                code: 'script.js?type=left&schema=brown&id=4',
                schema: 'brown',
            },
            'widget-5-right-brown' : {
                code: 'script.js?type=left&schema=brown&id=5',
                schema: 'brown',
            },
            'widget-6-right-brown' : {
                code: 'script.js?type=left&schema=brown&id=6',
                schema: 'brown',
            },
            'widget-7-right-brown' : {
                code: 'script.js?type=right&schema=brown&id=7',
                schema: 'brown',
            },
            'widget-8-right-brown' : {
                code: 'script.js?type=right&schema=brown&id=8',
                schema: 'brown',
            },
            'widget-9-right-brown' : {
                code: 'script.js?type=right&schema=brown&id=9',
                schema: 'brown',
            },
            'widget-1-left-white' : {
                code: 'script.js?type=left&schema=white&id=1',
                schema: 'none',
            },
            'widget-2-left-white' : {
                code: 'script.js?type=left&schema=white&id=2',
                schema: 'none',
            },
            'widget-3-left-white' : {
                code: 'script.js?type=left&schema=white&id=3',
                schema: 'none',
            },
            'widget-4-left-white' : {
                code: 'script.js?type=left&schema=white&id=4',
                schema: 'none',
            },
        }
    }

    getCodeForGenerateWidget(id, city_id = null, key, city_name = null) {
        if(id && (city_id || city_name) && key) {
            return `<div id='openweathermap-widget'></div>
                    <script type="text/javascript">
                    window.myWidgetParam = {
                        id: ${id},
                        cityid: ${city_id},
                        appid: "${key}",
                        containerid: 'openweathermap-widget',
                    };
                    (function() {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.src = 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(script, s);
                    })();
                  </script>`;
        }

        return null;
    }
}
