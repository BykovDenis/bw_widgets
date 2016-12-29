/**
 * Created by Denis on 13.10.2016.
 */
export default class GeneratorWidget {
    constructor() {

        this.baseURL = 'http://openweathermap.org/themes/openweathermap/assets/vendor/owm';
        this.scriptD3SRC = `${this.baseURL}/js/libs/d3.min.js`;
        this.scriptSRC = `${this.baseURL}/js/weather-widget-generator.js`;

        this.controlsWidget = {
            // Первая половина виджетов
            cityName: document.querySelectorAll('.widget-left-menu__header'),
            temperature: document.querySelectorAll('.weather-left-card__number'),
            naturalPhenomenon: document.querySelectorAll('.weather-left-card__means'),
            windSpeed: document.querySelectorAll('.weather-left-card__wind'),
            mainIconWeather: document.querySelectorAll('.weather-left-card__img'),
            calendarItem: document.querySelectorAll('.calendar__item'),
            graphic: document.getElementById('graphic'),
            // Вторая половина виджетов
            cityName2: document.querySelectorAll('.widget-right__title'),
            temperature2: document.querySelectorAll('.weather-right__temperature'),
            temperatureFeels: document.querySelectorAll('.weather-right__feels'),
            temperatureMin: document.querySelectorAll('.weather-right-card__temperature-min'),
            temperatureMax: document.querySelectorAll('.weather-right-card__temperature-max'),
            naturalPhenomenon2: document.querySelectorAll('.widget-right__description'),
            windSpeed2: document.querySelectorAll('.weather-right__wind-speed'),
            mainIconWeather2: document.querySelectorAll('.weather-right__icon'),
            humidity: document.querySelectorAll('.weather-right__humidity'),
            pressure: document.querySelectorAll('.weather-right__pressure'),
            dateReport: document.querySelectorAll('.widget__date'),
            apiKey: document.getElementById('api-key'),
            errorKey: document.getElementById('error-key'),
        };

        this.validationAPIkey();
        this.setInitialStateForm();

        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue' : {
                id: 1,
                code: this.getCodeForGenerateWidget(1),
                schema: 'blue',
            },
            'widget-2-left-blue' : {
                id: 2,
                code: this.getCodeForGenerateWidget(2),
                schema: 'blue',
            },
            'widget-3-left-blue' : {
                id: 3,
                code: this.getCodeForGenerateWidget(3),
                schema: 'blue',
            },
            'widget-4-left-blue' : {
                id: 4,
                code: this.getCodeForGenerateWidget(4),
                schema: 'blue',
            },
            'widget-5-right-blue' : {
                id: 5,
                code: this.getCodeForGenerateWidget(5),
                schema: 'blue',
            },
            'widget-6-right-blue' : {
                id: 6,
                code: this.getCodeForGenerateWidget(6),
                schema: 'blue',
            },
            'widget-7-right-blue' : {
                id: 7,
                code: this.getCodeForGenerateWidget(7),
                schema: 'blue',
            },
            'widget-8-right-blue' : {
                id: 8,
                code: this.getCodeForGenerateWidget(8),
                schema: 'blue',
            },
            'widget-9-right-blue' : {
                id: 9,
                code: this.getCodeForGenerateWidget(9),
                schema: 'blue',
            },
            'widget-1-left-brown' : {
                id: 11,
                code: this.getCodeForGenerateWidget(11),
                schema: 'brown',
            },
            'widget-2-left-brown' : {
                id: 12,
                code: this.getCodeForGenerateWidget(12),
                schema: 'brown',
            },
            'widget-3-left-brown' : {
                id: 13,
                code: this.getCodeForGenerateWidget(13),
                schema: 'brown',
            },
            'widget-4-left-brown' : {
                id: 14,
                code: this.getCodeForGenerateWidget(14),
                schema: 'brown',
            },
            'widget-5-right-brown' : {
                id: 15,
                code: this.getCodeForGenerateWidget(15),
                schema: 'brown',
            },
            'widget-6-right-brown' : {
                id: 16,
                code: this.getCodeForGenerateWidget(16),
                schema: 'brown',
            },
            'widget-7-right-brown' : {
                id: 17,
                code: this.getCodeForGenerateWidget(17),
                schema: 'brown',
            },
            'widget-8-right-brown' : {
                id: 18,
                code: this.getCodeForGenerateWidget(18),
                schema: 'brown',
            },
            'widget-9-right-brown' : {
                id: 19,
                code: this.getCodeForGenerateWidget(19),
                schema: 'brown',
            },
            'widget-1-left-white' : {
                id: 21,
                code: this.getCodeForGenerateWidget(21),
                schema: 'none',
            },
            'widget-2-left-white' : {
                id: 22,
                code: this.getCodeForGenerateWidget(22),
                schema: 'none',
            },
            'widget-3-left-white' : {
                id: 23,
                code: this.getCodeForGenerateWidget(23),
                schema: 'none',
            },
            'widget-4-left-white' : {
                id: 24,
                code: this.getCodeForGenerateWidget(24),
                schema: 'none',
            },
            'widget-31-right-brown' : {
                id: 31,
                code: this.getCodeForGenerateWidget(31),
                schema: 'brown',
            },
        }

    }

    validationAPIkey() {
        let validationAPI = function() {
        let url = `http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&units=metric&cnt=8&appid=${this.controlsWidget.apiKey.value}`;
        const xhr = new XMLHttpRequest();
        var that = this;
        xhr.onload = function () {
            if (xhr.status === 200) {
                that.controlsWidget.errorKey.innerText = 'Validation accept';
                that.controlsWidget.errorKey.classList.add('widget-form--good');
                that.controlsWidget.errorKey.classList.remove('widget-form--error');
                return;
            }
          that.controlsWidget.errorKey.innerText = 'Validation error';
          that.controlsWidget.errorKey.classList.remove('widget-form--good');
          that.controlsWidget.errorKey.classList.add('widget-form--error');
        };

        xhr.onerror = function(e){
          console.log(`Ошибка валидации ${e}`);
          that.controlsWidget.errorKey.innerText = 'Validation error';
          that.controlsWidget.errorKey.classList.remove('widget-form--good');
          that.controlsWidget.errorKey.classList.add('widget-form--error');
        }

          xhr.open('GET', url);
          xhr.send();
        }

        this.boundValidationMethod = validationAPI.bind(this);
        this.controlsWidget.apiKey.addEventListener('change',this.boundValidationMethod);
        //this.removeEventListener(this.boundValidationMethod);


    }

    getCodeForGenerateWidget(id) {        
        if(id && (this.paramsWidget.cityId || this.paramsWidget.cityName) && this.paramsWidget.appid) {
            let code = '';
            if(parseInt(id) === 1 || parseInt(id) === 11 || parseInt(id) === 21 || parseInt(id) === 31) {
                code = `<script src='http://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js'></script>`;
            }
            return `${code}<div id='openweathermap-widget'></div>
                    <script type='text/javascript'>
                    window.myWidgetParam = {
                        id: ${id},
                        cityid: ${this.paramsWidget.cityId},
                        appid: '${this.paramsWidget.appid.replace(`2d90837ddbaeda36ab487f257829b667`,'')}',
                        containerid: 'openweathermap-widget',
                    };
                    (function() {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.src = 'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';
                        var s = document.getElementsByTagName('script')[0];
                        s.parentNode.insertBefore(script, s);
                    })();
                  </script>`;
        }

        return null;
    }

    setInitialStateForm(cityId=524901, cityName='Moscow') {

        this.paramsWidget = {
            cityId: cityId,
            cityName: cityName,
            lang: 'en',
            appid: document.getElementById('api-key').value ||  '2d90837ddbaeda36ab487f257829b667',
            units: 'metric',
            textUnitTemp: String.fromCodePoint(0x00B0),  // 248
            baseURL: this.baseURL,
            urlDomain: 'http://api.openweathermap.org',
        };

        // Работа с формой для инициали
        this.cityName = document.getElementById('city-name');
        this.cities = document.getElementById('cities');
        this.searchCity = document.getElementById('search-city');

        this.urls = {
        urlWeatherAPI: `${this.paramsWidget.urlDomain}/data/2.5/weather?id=${this.paramsWidget.cityId}&units=${this.paramsWidget.units}&appid=${this.paramsWidget.appid}`,
        paramsUrlForeDaily: `${this.paramsWidget.urlDomain}/data/2.5/forecast/daily?id=${this.paramsWidget.cityId}&units=${this.paramsWidget.units}&cnt=8&appid=${this.paramsWidget.appid}`,
        windSpeed: `${this.baseURL}/data/wind-speed-data.json`,
        windDirection: `${this.baseURL}/data/wind-direction-data.json`,
        clouds: `${this.baseURL}/data/clouds-data.json`,
        naturalPhenomenon: `${this.baseURL}/data/natural-phenomenon-data.json`,
        };
    }

}
