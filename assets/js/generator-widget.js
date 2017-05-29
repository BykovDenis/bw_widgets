/**
 * Created by Denis on 13.10.2016.
 */
import Cookies from './Cookies';

export default class GeneratorWidget {
    constructor() {

        this.baseURL = `${document.location.protocol}//phase.owm.io/themes/openweathermap/assets/vendor/owm`;
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
        this.initForm = false;
        this.initialMetricTemperature();
        this.validationAPIkey();
        this.setInitialStateForm();
    }

    /**
     * [mapWidgets метод для сопоставления всех виджетов с
     * кнопкой-инициатором их вызова для генерации кода]
     * @param  {[type]} widgetID [description]
     * @return {[type]}          [description]
     */
    mapWidgets(widgetID) {
      switch(widgetID) {
        case 'widget-1-left-blue' :
          return {
            id: 1,
            code: this.getCodeForGenerateWidget(1),
            schema: 'blue',
          };
          break;
        case 'widget-2-left-blue' :
          return {
            id: 2,
            code: this.getCodeForGenerateWidget(2),
            schema: 'blue',
          };
          break;
        case 'widget-3-left-blue' :
          return {
            id: 3,
            code: this.getCodeForGenerateWidget(3),
            schema: 'blue',
          };
          break;
        case 'widget-4-left-blue' :
          return {
            id: 4,
            code: this.getCodeForGenerateWidget(4),
            schema: 'blue',
          };
          break;
        case 'widget-5-right-blue' :
          return {
            id: 5,
            code: this.getCodeForGenerateWidget(5),
            schema: 'blue',
          };
          break;
        case 'widget-6-right-blue' :
          return {
            id: 6,
            code: this.getCodeForGenerateWidget(6),
            schema: 'blue',
          };
          break;
        case 'widget-7-right-blue' :
          return {
            id: 7,
            code: this.getCodeForGenerateWidget(7),
            schema: 'blue',
          };
          break;
        case 'widget-8-right-blue' :
          return {
            id: 8,
            code: this.getCodeForGenerateWidget(8),
            schema: 'blue',
          };
          break;
        case 'widget-9-right-blue' :
          return {
            id: 9,
            code: this.getCodeForGenerateWidget(9),
            schema: 'blue',
          };
          break;
        case 'widget-1-left-brown' :
          return {
            id: 11,
            code: this.getCodeForGenerateWidget(11),
            schema: 'brown',
          };
          break;
        case 'widget-2-left-brown' :
          return {
            id: 12,
            code: this.getCodeForGenerateWidget(12),
            schema: 'brown',
          };
          break;
        case 'widget-3-left-brown' :
          return {
            id: 13,
            code: this.getCodeForGenerateWidget(13),
            schema: 'brown',
          };
          break;
        case 'widget-4-left-brown' :
          return {
            id: 14,
            code: this.getCodeForGenerateWidget(14),
            schema: 'brown',
          };
          break;
        case 'widget-5-right-brown' :
          return {
            id: 15,
            code: this.getCodeForGenerateWidget(15),
            schema: 'brown',
          };
          break;
        case 'widget-6-right-brown' :
          return {
            id: 16,
            code: this.getCodeForGenerateWidget(16),
            schema: 'brown',
          };
          break;
        case 'widget-7-right-brown' :
          return {
            id: 17,
            code: this.getCodeForGenerateWidget(17),
            schema: 'brown',
          };
          break;
        case 'widget-8-right-brown' :
          return {
            id: 18,
            code: this.getCodeForGenerateWidget(18),
            schema: 'brown',
          };
          break;
        case 'widget-9-right-brown' :
          return {
            id: 19,
            code: this.getCodeForGenerateWidget(19),
            schema: 'brown',
          };
          break;
        case 'widget-1-left-white' :
          return {
            id: 21,
            code: this.getCodeForGenerateWidget(21),
            schema: 'none',
          };
          break;
        case 'widget-2-left-white' :
          return {
            id: 22,
            code: this.getCodeForGenerateWidget(22),
            schema: 'none',
          };
          break;
        case 'widget-3-left-white' :
          return {
            id: 23,
            code: this.getCodeForGenerateWidget(23),
            schema: 'none',
          };
          break;
        case 'widget-4-left-white' :
          return {
            id: 24,
            code: this.getCodeForGenerateWidget(24),
            schema: 'none',
          };
          break;
        case 'widget-31-right-brown' :
          return {
            id: 31,
            code: this.getCodeForGenerateWidget(31),
            schema: 'brown',
          };
          break;
      }
    };

    /**
     * [defaultAppIdProps description]
     * @return {[type]} [description]
     */
    get defaultAppIdProps() {
      return this.defaultAppid;
    }
    /**
     * [defaultAppIdProps description]
     * @param  {[type]} appid [description]
     * @return {[type]}       [description]
     */
    set defaultAppIdProps(appid) {
      this.defaultAppid = appid;
    }

    /**
     * Инициализация единиц измерения в виджетах
     * */
    initialMetricTemperature() {

        const setUnits = function(checkbox, cookie){
            var units = 'metric';
            if(checkbox.checked == false){
                checkbox.checked = false;
                units = 'imperial';
            }
            cookie.setCookie('units', units);
        };

        const getUnits = function(units){
            switch(units){
                case 'metric':
                    return [units, '°C'];
                case 'imperial':
                    return [units, '°F'];
            }
            return ['metric', '°C'];
        };

        var cookie = new Cookies();
        //Определение единиц измерения
        var unitsCheck = document.getElementById("units_check");

        unitsCheck.addEventListener("change", function(event){
            setUnits(unitsCheck, cookie);
            window.location.reload();
        });

        var units = "metric";
        var text_unit_temp = null;
        if(cookie.getCookie('units')){
            this.unitsTemp = getUnits(cookie.getCookie('units')) || ['metric', '°C'];
            [units, text_unit_temp] = this.unitsTemp;
            if(units == "metric")
                unitsCheck.checked = true;
            else
                unitsCheck.checked = false;
        }
        else{
            unitsCheck.checked = true;
            setUnits(unitsCheck, cookie);
            this.unitsTemp = getUnits(units);
            [units, text_unit_temp] = this.unitsTemp;
        }

    }
    /**
     * Свойство установки единиц измерения для виджетов
     * @param units
     */
    set unitsTemp(units) {
        this.units = units;
    }
    /**
     * Свойство получения единиц измерения для виджетов
     * @returns {*}
     */
    get unitsTemp() {
        return this.units;
    }

    validationAPIkey() {
        let validationAPI = function() {
        let url = `${document.location.protocol}//api.openweathermap.org/data/2.5/forecast/daily?id=524901&units=${this.unitsTemp[0]}&cnt=8&appid=${this.controlsWidget.apiKey.value}`;
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
      const appid = this.paramsWidget.appid;
      if (!appid) {
        this.controlsWidget.errorKey.innerText = 'Validation error';
        this.controlsWidget.errorKey.classList.remove('widget-form--good');
        this.controlsWidget.errorKey.classList.add('widget-form--error');
        //alert('append your APIKEY');
        console.log('append your APIKEY');
        return;
      }
      if(id && (this.paramsWidget.cityId || this.paramsWidget.cityName)) {
          let code = '';
          if(parseInt(id) === 1 || parseInt(id) === 11 || parseInt(id) === 21 || parseInt(id) === 31) {
              code = `<script src='${this.baseURL}/js/d3.min.js'></script>`;
          }
          const codeWidget = `<div id="openweathermap-widget-${id}"></div>\r\n${code}${(`<script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];
            window.myWidgetParam.push({
                id: ${id},
                cityid: ${appid}',
                units: '${this.paramsWidget.units}',
                containerid: 'openweathermap-widget-${id}',
            });
            (function() {
                var script = document.createElement('script');
                script.async = true;
                script.src = "${this.baseURL}/js/weather-widget-generator-2.0.js";
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(script, s);
            })();
          </script>`).replace(/[\r\n] | [\s] /g,'')}`;
          return codeWidget;
      }

      return null;
    }

    setInitialStateForm(cityId=2643743, cityName='London') {

        this.paramsWidget = {
            cityId: cityId,
            cityName: cityName,
            lang: 'en',
            appid: document.getElementById('api-key').value,
            units: this.unitsTemp[0],
            textUnitTemp: this.unitsTemp[1],  // 248
            baseURL: this.baseURL,
            urlDomain: `${document.location.protocol}//api.openweathermap.org`,
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
