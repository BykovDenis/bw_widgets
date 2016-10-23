/**
 * Created by Denis on 13.10.2016.
 */
export default class GeneratorWidget {
    constructor(id = 1, city_id = 524901, key = '2d90837ddbaeda36ab487f257829b667' ){

        this.baseURL = 'themes/openweathermap/assets/vendor/owm';
        this.scriptD3SRC = `${this.baseURL}/js/libs/d3.min.js`;
        this.scriptSRC = `${this.baseURL}/js/weather-widget-generator.js`;

        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue' : {
                id: 1,
                code: this.getCodeForGenerateWidget(1, city_id, key),
                schema: 'blue',
            },
            'widget-2-left-blue' : {
                id: 2,
                code: this.getCodeForGenerateWidget(2, city_id, key),
                schema: 'blue',
            },
            'widget-3-left-blue' : {
                id: 3,
                code: this.getCodeForGenerateWidget(3, city_id, key),
                schema: 'blue',
            },
            'widget-4-left-blue' : {
                id: 4,
                code: this.getCodeForGenerateWidget(4, city_id, key),
                schema: 'blue',
            },
            'widget-5-right-blue' : {
                id: 5,
                code: this.getCodeForGenerateWidget(5, city_id, key),
                schema: 'blue',
            },
            'widget-6-right-blue' : {
                id: 6,
                code: this.getCodeForGenerateWidget(6, city_id, key),
                schema: 'blue',
            },
            'widget-7-right-blue' : {
                id: 7,
                code: this.getCodeForGenerateWidget(7, city_id, key),
                schema: 'blue',
            },
            'widget-8-right-blue' : {
                id: 8,
                code: this.getCodeForGenerateWidget(8, city_id, key),
                schema: 'blue',
            },
            'widget-9-right-blue' : {
                id: 9,
                code: this.getCodeForGenerateWidget(9, city_id, key),
                schema: 'blue',
            },
            'widget-1-left-brown' : {
                id: 11,
                code: this.getCodeForGenerateWidget(11, city_id, key),
                schema: 'brown',
            },
            'widget-2-left-brown' : {
                id: 12,
                code: this.getCodeForGenerateWidget(12, city_id, key),
                schema: 'brown',
            },
            'widget-3-left-brown' : {
                id: 13,
                code: this.getCodeForGenerateWidget(13, city_id, key),
                schema: 'brown',
            },
            'widget-4-left-brown' : {
                id:14,
                code: this.getCodeForGenerateWidget(14, city_id, key),
                schema: 'brown',
            },
            'widget-5-right-brown' : {
                id: 15,
                code: this.getCodeForGenerateWidget(15, city_id, key),
                schema: 'brown',
            },
            'widget-6-right-brown' : {
                id: 16,
                code: this.getCodeForGenerateWidget(16, city_id, key),
                schema: 'brown',
            },
            'widget-7-right-brown' : {
                id: 17,
                code: this.getCodeForGenerateWidget(17, city_id, key),
                schema: 'brown',
            },
            'widget-8-right-brown' : {
                id: 18,
                code: this.getCodeForGenerateWidget(18, city_id, key),
                schema: 'brown',
            },
            'widget-9-right-brown' : {
                id: 19,
                code: this.getCodeForGenerateWidget(19, city_id, key),
                schema: 'brown',
            },
            'widget-1-left-white' : {
                id: 21,
                code: this.getCodeForGenerateWidget(21, city_id, key),
                schema: 'none',
            },
            'widget-2-left-white' : {
                id: 22,
                code: this.getCodeForGenerateWidget(22, city_id, key),
                schema: 'none',
            },
            'widget-3-left-white' : {
                id: 23,
                code: this.getCodeForGenerateWidget(23, city_id, key),
                schema: 'none',
            },
            'widget-4-left-white' : {
                id: 24,
                code: this.getCodeForGenerateWidget(24, city_id, key),
                schema: 'none',
            },
        }
    }

    getCodeForGenerateWidget(id, cityId = null, key, cityName = null) {        
        if(id && (cityId || cityName) && key) {
            let code = '';
            if(id === 1 && id === 11 && id== 21) {
                code = `<script src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>`;
            }
            return `${code}<div id='openweathermap-widget'></div>
                    <script type="text/javascript">
                    window.myWidgetParam = {
                        id: ${id},
                        cityid: ${cityId},
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
