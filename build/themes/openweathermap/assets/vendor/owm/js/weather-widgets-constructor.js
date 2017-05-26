(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Работа с куками
var Cookies = function () {
  function Cookies() {
    _classCallCheck(this, Cookies);
  }

  _createClass(Cookies, [{
    key: "setCookie",
    value: function setCookie(name, value) {
      var expires = new Date();
      expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24);
      document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
    }

    // возвращает cookie с именем name, если есть, если нет, то undefined

  }, {
    key: "getCookie",
    value: function getCookie(name) {
      var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
  }, {
    key: "deleteCookie",
    value: function deleteCookie() {
      this.setCookie(name, "", {
        expires: -1
      });
    }
  }]);

  return Cookies;
}();

exports.default = Cookies;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

var _renderWidgets = require('./renderWidgets');

var _renderWidgets2 = _interopRequireDefault(_renderWidgets);

var _clearWidgetContainer = require('./clearWidgetContainer');

var _clearWidgetContainer2 = _interopRequireDefault(_clearWidgetContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Created by Denis on 21.10.2016.
*/

var Promise = require('es6-promise').Promise;
require('String.fromCodePoint');

var Cities = function () {
  function Cities(cityName, container) {
    _classCallCheck(this, Cities);

    var generateWidget = new _generatorWidget2.default();
    generateWidget.setInitialStateForm();
    this.units = generateWidget.unitsTemp[1];
    if (!cityName.value) {
      return false;
    }

    this.selectedCity = this.selectedCity.bind(this);

    this.cityName = cityName.value.replace(/(\s)+/g, '-').toLowerCase();
    this.container = container || '';
    this.url = document.location.protocol + '//openweathermap.org/data/2.5/find?q=' + this.cityName + '&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1';

    this.selCitySign = document.createElement('span');
    this.selCitySign.innerText = ' selected ';
    this.selCitySign.class = 'widget-form__selected';

    this.cityId = 2643743;
    (0, _renderWidgets2.default)(this.cityId);
  }

  _createClass(Cities, [{
    key: 'getCities',
    value: function getCities() {
      var _this = this;

      if (!this.cityName) {
        return null;
      }

      this.httpGet(this.url).then(function (response) {
        _this.getSearchData(response);
      }, function (error) {
        console.log('\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 ' + error);
      });
    }
  }, {
    key: 'getSearchData',
    value: function getSearchData(JSONobject) {
      if (!JSONobject.list.length) {
        console.log('City not found');
        return;
      }

      // Удаляем таблицу, если есть
      var tableCity = document.getElementById('table-cities');
      if (tableCity) {
        tableCity.parentNode.removeChild(tableCity);
      }

      var html = '';
      for (var i = 0; i < JSONobject.list.length; i += 1) {
        var name = JSONobject.list[i].name + ', ' + JSONobject.list[i].sys.country;
        var flag = 'http://openweathermap.org/images/flags/' + JSONobject.list[i].sys.country.toLowerCase() + '.png';
        html += '<tr><td class="widget-form__item"><a href="/city/' + JSONobject.list[i].id + '" id="' + JSONobject.list[i].id + '" class="widget-form__link">' + name + '</a><img src="' + flag + '"></p></td></tr>';
      }

      html = '<table class="table" id="table-cities">' + html + '</table>';
      this.container.insertAdjacentHTML('afterbegin', html);
      var tableCities = document.getElementById('table-cities');

      tableCities.addEventListener('click', this.selectedCity);
    }
  }, {
    key: 'selectedCity',
    value: function selectedCity(event) {
      event.preventDefault();
      if (event.target.tagName.toLowerCase() === 'A'.toLowerCase() && event.target.classList.contains('widget-form__link')) {
        var selectedCity = event.target.parentElement.querySelector('#selectedCity');
        if (!selectedCity) {
          event.target.parentElement.insertBefore(this.selCitySign, event.target.parentElement.children[1]);

          var generateWidget = new _generatorWidget2.default();

          // Подстановка найденого города
          generateWidget.paramsWidget.cityId = event.target.id;
          generateWidget.paramsWidget.cityName = event.target.textContent;
          generateWidget.paramsWidget.units = this.units;
          generateWidget.setInitialStateForm(event.target.id, event.target.textContent);
          this.cityId = event.target.id;
          this.cityName = event.target.textContent;

          (0, _clearWidgetContainer2.default)();
          (0, _renderWidgets2.default)(this.cityId);
        }
      }
    }

    /**
    * Обертка обещение для асинхронных запросов
    * @param url
    * @returns {Promise}
    */

  }, {
    key: 'httpGet',
    value: function httpGet(url) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(JSON.parse(this.response));
          } else {
            var error = new Error(this.statusText);
            error.code = this.status;
            reject(that.error);
          }
        };

        xhr.ontimeout = function (e) {
          reject(new Error('\u0412\u0440\u0435\u043C\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 API \u0438\u0441\u0442\u0435\u043A\u043B\u043E ' + e.type + ' ' + e.timeStamp.toFixed(2)));
        };

        xhr.onerror = function (e) {
          reject(new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 ' + e));
        };

        xhr.open('GET', url, true);
        xhr.send(null);
      });
    }
  }]);

  return Cities;
}();

exports.default = Cities;

},{"./clearWidgetContainer":3,"./generator-widget":4,"./renderWidgets":6,"String.fromCodePoint":8,"es6-promise":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var clearWidgetContainer = function clearWidgetContainer() {
  var i = 1;
  var containers = [];
  while (i < 100) {
    var container = document.getElementById('openweathermap-widget-' + i);
    if (container) {
      containers.push(container);
    }
    i++;
  };

  containers.forEach(function (elem) {
    elem.innerText = '';
  });
};

exports.default = clearWidgetContainer;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Denis on 13.10.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Cookies = require('./Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneratorWidget = function () {
    function GeneratorWidget() {
        _classCallCheck(this, GeneratorWidget);

        this.baseURL = document.location.protocol + '//openweathermap.org/themes/openweathermap/assets/vendor/owm';
        this.scriptD3SRC = this.baseURL + '/js/libs/d3.min.js';
        this.scriptSRC = this.baseURL + '/js/weather-widget-generator.js';

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
            errorKey: document.getElementById('error-key')
        };

        this.initialMetricTemperature();
        this.validationAPIkey();
        this.setInitialStateForm();

        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue': {
                id: 1,
                code: this.getCodeForGenerateWidget(1),
                schema: 'blue'
            },
            'widget-2-left-blue': {
                id: 2,
                code: this.getCodeForGenerateWidget(2),
                schema: 'blue'
            },
            'widget-3-left-blue': {
                id: 3,
                code: this.getCodeForGenerateWidget(3),
                schema: 'blue'
            },
            'widget-4-left-blue': {
                id: 4,
                code: this.getCodeForGenerateWidget(4),
                schema: 'blue'
            },
            'widget-5-right-blue': {
                id: 5,
                code: this.getCodeForGenerateWidget(5),
                schema: 'blue'
            },
            'widget-6-right-blue': {
                id: 6,
                code: this.getCodeForGenerateWidget(6),
                schema: 'blue'
            },
            'widget-7-right-blue': {
                id: 7,
                code: this.getCodeForGenerateWidget(7),
                schema: 'blue'
            },
            'widget-8-right-blue': {
                id: 8,
                code: this.getCodeForGenerateWidget(8),
                schema: 'blue'
            },
            'widget-9-right-blue': {
                id: 9,
                code: this.getCodeForGenerateWidget(9),
                schema: 'blue'
            },
            'widget-1-left-brown': {
                id: 11,
                code: this.getCodeForGenerateWidget(11),
                schema: 'brown'
            },
            'widget-2-left-brown': {
                id: 12,
                code: this.getCodeForGenerateWidget(12),
                schema: 'brown'
            },
            'widget-3-left-brown': {
                id: 13,
                code: this.getCodeForGenerateWidget(13),
                schema: 'brown'
            },
            'widget-4-left-brown': {
                id: 14,
                code: this.getCodeForGenerateWidget(14),
                schema: 'brown'
            },
            'widget-5-right-brown': {
                id: 15,
                code: this.getCodeForGenerateWidget(15),
                schema: 'brown'
            },
            'widget-6-right-brown': {
                id: 16,
                code: this.getCodeForGenerateWidget(16),
                schema: 'brown'
            },
            'widget-7-right-brown': {
                id: 17,
                code: this.getCodeForGenerateWidget(17),
                schema: 'brown'
            },
            'widget-8-right-brown': {
                id: 18,
                code: this.getCodeForGenerateWidget(18),
                schema: 'brown'
            },
            'widget-9-right-brown': {
                id: 19,
                code: this.getCodeForGenerateWidget(19),
                schema: 'brown'
            },
            'widget-1-left-white': {
                id: 21,
                code: this.getCodeForGenerateWidget(21),
                schema: 'none'
            },
            'widget-2-left-white': {
                id: 22,
                code: this.getCodeForGenerateWidget(22),
                schema: 'none'
            },
            'widget-3-left-white': {
                id: 23,
                code: this.getCodeForGenerateWidget(23),
                schema: 'none'
            },
            'widget-4-left-white': {
                id: 24,
                code: this.getCodeForGenerateWidget(24),
                schema: 'none'
            },
            'widget-31-right-brown': {
                id: 31,
                code: this.getCodeForGenerateWidget(31),
                schema: 'brown'
            }
        };
    }

    /**
     * Инициализация единиц измерения в виджетах
     * */


    _createClass(GeneratorWidget, [{
        key: 'initialMetricTemperature',
        value: function initialMetricTemperature() {

            var setUnits = function setUnits(checkbox, cookie) {
                var units = 'metric';
                if (checkbox.checked == false) {
                    checkbox.checked = false;
                    units = 'imperial';
                }
                cookie.setCookie('units', units);
            };

            var getUnits = function getUnits(units) {
                switch (units) {
                    case 'metric':
                        return [units, '°C'];
                    case 'imperial':
                        return [units, '°F'];
                }
                return ['metric', '°C'];
            };

            var cookie = new _Cookies2.default();
            //Определение единиц измерения
            var unitsCheck = document.getElementById("units_check");

            unitsCheck.addEventListener("change", function (event) {
                setUnits(unitsCheck, cookie);
                window.location.reload();
            });

            var units = "metric";
            var text_unit_temp = null;
            if (cookie.getCookie('units')) {
                this.unitsTemp = getUnits(cookie.getCookie('units')) || ['metric', '°C'];

                var _unitsTemp = _slicedToArray(this.unitsTemp, 2);

                units = _unitsTemp[0];
                text_unit_temp = _unitsTemp[1];

                if (units == "metric") unitsCheck.checked = true;else unitsCheck.checked = false;
            } else {
                unitsCheck.checked = true;
                setUnits(unitsCheck, cookie);
                this.unitsTemp = getUnits(units);

                var _unitsTemp2 = _slicedToArray(this.unitsTemp, 2);

                units = _unitsTemp2[0];
                text_unit_temp = _unitsTemp2[1];
            }
        }
        /**
         * Свойство установки единиц измерения для виджетов
         * @param units
         */

    }, {
        key: 'validationAPIkey',
        value: function validationAPIkey() {
            var validationAPI = function validationAPI() {
                var url = document.location.protocol + '//api.openweathermap.org/data/2.5/forecast/daily?id=524901&units=' + this.unitsTemp[0] + '&cnt=8&appid=' + this.controlsWidget.apiKey.value;
                var xhr = new XMLHttpRequest();
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

                xhr.onerror = function (e) {
                    console.log('\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438 ' + e);
                    that.controlsWidget.errorKey.innerText = 'Validation error';
                    that.controlsWidget.errorKey.classList.remove('widget-form--good');
                    that.controlsWidget.errorKey.classList.add('widget-form--error');
                };

                xhr.open('GET', url);
                xhr.send();
            };

            this.boundValidationMethod = validationAPI.bind(this);
            this.controlsWidget.apiKey.addEventListener('change', this.boundValidationMethod);
            //this.removeEventListener(this.boundValidationMethod);
        }
    }, {
        key: 'getCodeForGenerateWidget',
        value: function getCodeForGenerateWidget(id) {
            if (id && (this.paramsWidget.cityId || this.paramsWidget.cityName) && this.paramsWidget.appid) {
                var code = '';
                if (parseInt(id) === 1 || parseInt(id) === 11 || parseInt(id) === 21 || parseInt(id) === 31) {
                    code = '<script src=\'' + document.location.protocol + '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js\'></script>';
                }
                return code + '<div id=\'openweathermap-widget\'></div>\n                    <script type=\'text/javascript\'>\n                    window.myWidgetParam = {\n                        id: ' + id + ',\n                        cityid: ' + this.paramsWidget.cityId + ',\n                        appid: \'' + this.paramsWidget.appid.replace('2d90837ddbaeda36ab487f257829b667', '') + '\',\n                        units: \'' + this.paramsWidget.units + '\',\n                        containerid: \'openweathermap-widget\',\n                    };\n                    (function() {\n                        var script = document.createElement(\'script\');\n                        script.type = \'text/javascript\';\n                        script.async = true;\n                        script.src = \'' + document.location.protocol + '//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js\';\n                        var s = document.getElementsByTagName(\'script\')[0];\n                        s.parentNode.insertBefore(script, s);\n                    })();\n                  </script>';
            }

            return null;
        }
    }, {
        key: 'setInitialStateForm',
        value: function setInitialStateForm() {
            var cityId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2643743;
            var cityName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'London';


            this.paramsWidget = {
                cityId: cityId,
                cityName: cityName,
                lang: 'en',
                appid: document.getElementById('api-key').value || '2d90837ddbaeda36ab487f257829b667',
                units: this.unitsTemp[0],
                textUnitTemp: this.unitsTemp[1], // 248
                baseURL: this.baseURL,
                urlDomain: document.location.protocol + '//api.openweathermap.org'
            };

            // Работа с формой для инициали
            this.cityName = document.getElementById('city-name');
            this.cities = document.getElementById('cities');
            this.searchCity = document.getElementById('search-city');

            this.urls = {
                urlWeatherAPI: this.paramsWidget.urlDomain + '/data/2.5/weather?id=' + this.paramsWidget.cityId + '&units=' + this.paramsWidget.units + '&appid=' + this.paramsWidget.appid,
                paramsUrlForeDaily: this.paramsWidget.urlDomain + '/data/2.5/forecast/daily?id=' + this.paramsWidget.cityId + '&units=' + this.paramsWidget.units + '&cnt=8&appid=' + this.paramsWidget.appid,
                windSpeed: this.baseURL + '/data/wind-speed-data.json',
                windDirection: this.baseURL + '/data/wind-direction-data.json',
                clouds: this.baseURL + '/data/clouds-data.json',
                naturalPhenomenon: this.baseURL + '/data/natural-phenomenon-data.json'
            };
        }
    }, {
        key: 'unitsTemp',
        set: function set(units) {
            this.units = units;
        }
        /**
         * Свойство получения единиц измерения для виджетов
         * @returns {*}
         */
        ,
        get: function get() {
            return this.units;
        }
    }]);

    return GeneratorWidget;
}();

exports.default = GeneratorWidget;

},{"./Cookies":1}],5:[function(require,module,exports){
'use strict';

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var generator = new _generatorWidget2.default();
  var form = document.getElementById('frm-landing-widget');
  var popup = document.getElementById('popup');
  var popupShadow = document.querySelector('.popup-shadow');
  var popupClose = document.getElementById('popup-close');
  var contentJSGeneration = document.getElementById('js-code-generate');
  var copyContentJSCode = document.getElementById('copy-js-code');
  var apiKey = document.getElementById('api-key');

  // Фиксируем клики на форме, и открываем popup окно при нажатии на кнопку
  form.addEventListener('click', function (event) {
    var element = event.target;
    if (element.id && element.classList.contains('container-custom-card__btn')) {
      event.preventDefault();
      var generateWidget = new _generatorWidget2.default();
      generateWidget.setInitialStateForm(window.cityId, window.cityName);

      contentJSGeneration.value = generateWidget.getCodeForGenerateWidget(generateWidget.mapWidgets[element.id]['id']);
      if (!popup.classList.contains('popup--visible')) {
        document.body.style.overflow = 'hidden';
        popup.classList.add('popup--visible');
        popupShadow.classList.add('popup-shadow--visible');
        switch (generator.mapWidgets[event.target.id]['schema']) {
          case 'blue':
            if (!popup.classList.contains('popup--blue')) {
              popup.classList.add('popup--blue');
            }
            if (popup.classList.contains('popup--brown')) {
              popup.classList.remove('popup--brown');
            }
            break;
          case 'brown':
            if (!popup.classList.contains('popup--brown')) {
              popup.classList.add('popup--brown');
            }
            if (popup.classList.contains('popup--blue')) {
              popup.classList.remove('popup--blue');
            }
            break;
          case 'none':
            if (popup.classList.contains('popup--brown')) {
              popup.classList.remove('popup--brown');
            }
            if (popup.classList.contains('popup--blue')) {
              popup.classList.remove('popup--blue');
            }
        }
      }
    }
  });

  var eventPopupClose = function eventPopupClose(event) {
    var element = event.target;
    if ((!element.classList.contains('popupClose') || element === popup) && !element.classList.contains('container-custom-card__btn') && !element.classList.contains('popup__title') && !element.classList.contains('popup__items') && !element.classList.contains('popup__layout') && !element.classList.contains('popup__btn')) {
      popup.classList.remove('popup--visible');
      popupShadow.classList.remove('popup-shadow--visible');
      document.body.style.overflow = 'auto';
    }
  };

  eventPopupClose = eventPopupClose.bind(this);
  // Закрываем окно при нажатии на крестик
  document.addEventListener('click', eventPopupClose);

  copyContentJSCode.addEventListener('click', function (event) {
    event.preventDefault();
    //var range = document.createRange();
    //range.selectNode(contentJSGeneration);
    //window.getSelection().addRange(range);
    contentJSGeneration.select();

    try {
      var txtCopy = document.execCommand('copy');
      var msg = txtCopy ? 'successful' : 'unsuccessful';
      console.log('Copy email command was ' + msg);
    } catch (e) {
      console.log('\u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F ' + e.errLogToConsole);
    }

    // Снятие выделения - ВНИМАНИЕ: вы должны использовать
    // removeRange(range) когда это возможно
    window.getSelection().removeAllRanges();

    popup.classList.remove('popup--visible');
    popupShadow.classList.remove('popup-shadow--visible');
    document.body.style.overflow = 'auto';
  });

  copyContentJSCode.disabled = !document.queryCommandSupported('copy');
});

},{"./generator-widget":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var renderWidgets = function renderWidgets(cityId) {
    window.myWidgetParam = [];
    window.myWidgetParam.push({
        id: 11,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-11'
    });
    window.myWidgetParam.push({
        id: 12,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-12'
    });
    window.myWidgetParam.push({
        id: 13,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-13'
    });
    window.myWidgetParam.push({
        id: 14,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-14'
    });
    window.myWidgetParam.push({
        id: 15,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-15'
    });
    window.myWidgetParam.push({
        id: 16,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-16'
    });
    window.myWidgetParam.push({
        id: 17,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-17'
    });
    window.myWidgetParam.push({
        id: 18,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-18'
    });
    window.myWidgetParam.push({
        id: 19,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-19'
    });
    window.myWidgetParam.push({
        id: 1,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-1'
    });
    window.myWidgetParam.push({
        id: 2,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-2'
    });
    window.myWidgetParam.push({
        id: 3,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-3'
    });
    window.myWidgetParam.push({
        id: 4,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-4'
    });
    window.myWidgetParam.push({
        id: 5,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-5'
    });
    window.myWidgetParam.push({
        id: 6,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-6'
    });
    window.myWidgetParam.push({
        id: 7,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-7'
    });
    window.myWidgetParam.push({
        id: 8,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-8'
    });
    window.myWidgetParam.push({
        id: 9,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-9'
    });
    window.myWidgetParam.push({
        id: 21,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-21'
    });
    window.myWidgetParam.push({
        id: 22,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-22'
    });
    window.myWidgetParam.push({
        id: 23,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-23'
    });
    window.myWidgetParam.push({
        id: 24,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-24'
    });
    var scripts = document.getElementById('scripts');
    if (scripts) {
        var script = document.createElement('script');
        script.async = true;
        script.src = '//phase.owm.io/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator-2.0.js';
        scripts.textContent = '';
        scripts.appendChild(script);
    }
};

exports.default = renderWidgets;

},{}],7:[function(require,module,exports){
'use strict';
// Модуль диспетчер для отрисовки баннерров на конструкторе

var _cities = require('./cities');

var _cities2 = _interopRequireDefault(_cities);

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchCity = document.getElementById('search-city');
var btnRenderWidgets = document.getElementById('append-scripts');
var scripts = document.getElementById('scripts');
// Работа с формой для инициали
var cityName = document.getElementById('city-name');
var cities = document.getElementById('cities');

var objCities = new _cities2.default(cityName, cities);
objCities.getCities();

searchCity.addEventListener('click', function () {
  var objCities = new _cities2.default(cityName, cities);
  objCities.getCities();
});

},{"./cities":2,"./popup":5}],8:[function(require,module,exports){
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
if (!String.fromCodePoint) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function(_) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

},{}],9:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":10}],10:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxDb29raWVzLmpzIiwiYXNzZXRzXFxqc1xcY2l0aWVzLmpzIiwiYXNzZXRzXFxqc1xcY2xlYXJXaWRnZXRDb250YWluZXIuanMiLCJhc3NldHNcXGpzXFxnZW5lcmF0b3Itd2lkZ2V0LmpzIiwiYXNzZXRzXFxqc1xccG9wdXAuanMiLCJhc3NldHNcXGpzXFxyZW5kZXJXaWRnZXRzLmpzIiwiYXNzZXRzXFxqc1xcc2NyaXB0LmpzIiwibm9kZV9tb2R1bGVzL1N0cmluZy5mcm9tQ29kZVBvaW50L2Zyb21jb2RlcG9pbnQuanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7SUFDcUIsTzs7Ozs7Ozs4QkFFVCxJLEVBQU0sSyxFQUFPO0FBQ3JCLFVBQUksVUFBVSxJQUFJLElBQUosRUFBZDtBQUNBLGNBQVEsT0FBUixDQUFnQixRQUFRLE9BQVIsS0FBcUIsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUF0RDtBQUNBLGVBQVMsTUFBVCxHQUFrQixPQUFPLEdBQVAsR0FBYSxPQUFPLEtBQVAsQ0FBYixHQUE2QixZQUE3QixHQUE0QyxRQUFRLFdBQVIsRUFBNUMsR0FBcUUsVUFBdkY7QUFDRDs7QUFFRDs7Ozs4QkFDVSxJLEVBQU07QUFDZCxVQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLElBQUksTUFBSixDQUNsQyxhQUFhLEtBQUssT0FBTCxDQUFhLDhCQUFiLEVBQTZDLE1BQTdDLENBQWIsR0FBb0UsVUFEbEMsQ0FBdEIsQ0FBZDtBQUdBLGFBQU8sVUFBVSxtQkFBbUIsUUFBUSxDQUFSLENBQW5CLENBQVYsR0FBMkMsU0FBbEQ7QUFDRDs7O21DQUVjO0FBQ2IsV0FBSyxTQUFMLENBQWUsSUFBZixFQUFxQixFQUFyQixFQUF5QjtBQUN2QixpQkFBUyxDQUFDO0FBRGEsT0FBekI7QUFHRDs7Ozs7O2tCQXBCa0IsTzs7Ozs7Ozs7Ozs7QUNLckI7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7OztBQVRBOzs7O0FBSUEsSUFBTSxVQUFVLFFBQVEsYUFBUixFQUF1QixPQUF2QztBQUNBLFFBQVEsc0JBQVI7O0lBTXFCLE07QUFFbkIsa0JBQVksUUFBWixFQUFzQixTQUF0QixFQUFpQztBQUFBOztBQUUvQixRQUFNLGlCQUFpQiwrQkFBdkI7QUFDQSxtQkFBZSxtQkFBZjtBQUNBLFNBQUssS0FBTCxHQUFhLGVBQWUsU0FBZixDQUF5QixDQUF6QixDQUFiO0FBQ0EsUUFBSSxDQUFDLFNBQVMsS0FBZCxFQUFxQjtBQUNuQixhQUFPLEtBQVA7QUFDRDs7QUFFRCxTQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCOztBQUVBLFNBQUssUUFBTCxHQUFnQixTQUFTLEtBQVQsQ0FBZSxPQUFmLENBQXVCLFFBQXZCLEVBQWdDLEdBQWhDLEVBQXFDLFdBQXJDLEVBQWhCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLGFBQWEsRUFBOUI7QUFDQSxTQUFLLEdBQUwsR0FBYyxTQUFTLFFBQVQsQ0FBa0IsUUFBaEMsNkNBQWdGLEtBQUssUUFBckY7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFuQjtBQUNBLFNBQUssV0FBTCxDQUFpQixTQUFqQixHQUE2QixZQUE3QjtBQUNBLFNBQUssV0FBTCxDQUFpQixLQUFqQixHQUF5Qix1QkFBekI7O0FBRUEsU0FBSyxNQUFMLEdBQWMsT0FBZDtBQUNBLGlDQUFjLEtBQUssTUFBbkI7QUFDRDs7OztnQ0FFVztBQUFBOztBQUNWLFVBQUksQ0FBQyxLQUFLLFFBQVYsRUFBb0I7QUFDbEIsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBSyxPQUFMLENBQWEsS0FBSyxHQUFsQixFQUNHLElBREgsQ0FFRSxVQUFDLFFBQUQsRUFBYztBQUNaLGNBQUssYUFBTCxDQUFtQixRQUFuQjtBQUNELE9BSkgsRUFLRSxVQUFDLEtBQUQsRUFBVztBQUNULGdCQUFRLEdBQVIsNEZBQStCLEtBQS9CO0FBQ0QsT0FQSDtBQVNEOzs7a0NBRWEsVSxFQUFZO0FBQ3hCLFVBQUksQ0FBQyxXQUFXLElBQVgsQ0FBZ0IsTUFBckIsRUFBNkI7QUFDM0IsZ0JBQVEsR0FBUixDQUFZLGdCQUFaO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFVBQU0sWUFBWSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBbEI7QUFDQSxVQUFJLFNBQUosRUFBZTtBQUNiLGtCQUFVLFVBQVYsQ0FBcUIsV0FBckIsQ0FBaUMsU0FBakM7QUFDRDs7QUFFRCxVQUFJLE9BQU8sRUFBWDtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxXQUFXLElBQVgsQ0FBZ0IsTUFBcEMsRUFBNEMsS0FBSyxDQUFqRCxFQUFvRDtBQUNsRCxZQUFNLE9BQVUsV0FBVyxJQUFYLENBQWdCLENBQWhCLEVBQW1CLElBQTdCLFVBQXNDLFdBQVcsSUFBWCxDQUFnQixDQUFoQixFQUFtQixHQUFuQixDQUF1QixPQUFuRTtBQUNBLFlBQU0sbURBQWlELFdBQVcsSUFBWCxDQUFnQixDQUFoQixFQUFtQixHQUFuQixDQUF1QixPQUF2QixDQUErQixXQUEvQixFQUFqRCxTQUFOO0FBQ0Esc0VBQTRELFdBQVcsSUFBWCxDQUFnQixDQUFoQixFQUFtQixFQUEvRSxjQUEwRixXQUFXLElBQVgsQ0FBZ0IsQ0FBaEIsRUFBbUIsRUFBN0csb0NBQThJLElBQTlJLHNCQUFtSyxJQUFuSztBQUNEOztBQUVELHlEQUFpRCxJQUFqRDtBQUNBLFdBQUssU0FBTCxDQUFlLGtCQUFmLENBQWtDLFlBQWxDLEVBQWdELElBQWhEO0FBQ0EsVUFBTSxjQUFjLFNBQVMsY0FBVCxDQUF3QixjQUF4QixDQUFwQjs7QUFFQSxrQkFBWSxnQkFBWixDQUE2QixPQUE3QixFQUFzQyxLQUFLLFlBQTNDO0FBQ0Q7OztpQ0FFWSxLLEVBQU87QUFDbEIsWUFBTSxjQUFOO0FBQ0EsVUFBSSxNQUFNLE1BQU4sQ0FBYSxPQUFiLENBQXFCLFdBQXJCLE9BQXdDLEdBQUQsQ0FBTSxXQUFOLEVBQXZDLElBQThELE1BQU0sTUFBTixDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsbUJBQWhDLENBQWxFLEVBQXdIO0FBQ3RILFlBQUksZUFBZSxNQUFNLE1BQU4sQ0FBYSxhQUFiLENBQTJCLGFBQTNCLENBQXlDLGVBQXpDLENBQW5CO0FBQ0EsWUFBSSxDQUFDLFlBQUwsRUFBbUI7QUFDakIsZ0JBQU0sTUFBTixDQUFhLGFBQWIsQ0FBMkIsWUFBM0IsQ0FBd0MsS0FBSyxXQUE3QyxFQUEwRCxNQUFNLE1BQU4sQ0FBYSxhQUFiLENBQTJCLFFBQTNCLENBQW9DLENBQXBDLENBQTFEOztBQUVBLGNBQU0saUJBQWlCLCtCQUF2Qjs7QUFFQTtBQUNBLHlCQUFlLFlBQWYsQ0FBNEIsTUFBNUIsR0FBcUMsTUFBTSxNQUFOLENBQWEsRUFBbEQ7QUFDQSx5QkFBZSxZQUFmLENBQTRCLFFBQTVCLEdBQXVDLE1BQU0sTUFBTixDQUFhLFdBQXBEO0FBQ0EseUJBQWUsWUFBZixDQUE0QixLQUE1QixHQUFvQyxLQUFLLEtBQXpDO0FBQ0EseUJBQWUsbUJBQWYsQ0FBbUMsTUFBTSxNQUFOLENBQWEsRUFBaEQsRUFBb0QsTUFBTSxNQUFOLENBQWEsV0FBakU7QUFDQSxlQUFLLE1BQUwsR0FBYyxNQUFNLE1BQU4sQ0FBYSxFQUEzQjtBQUNBLGVBQUssUUFBTCxHQUFnQixNQUFNLE1BQU4sQ0FBYSxXQUE3Qjs7QUFFQTtBQUNBLHVDQUFjLEtBQUssTUFBbkI7QUFFRDtBQUNGO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OzRCQUtRLEcsRUFBSztBQUNYLFVBQU0sT0FBTyxJQUFiO0FBQ0EsYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFlBQU0sTUFBTSxJQUFJLGNBQUosRUFBWjtBQUNBLFlBQUksTUFBSixHQUFhLFlBQVc7QUFDdEIsY0FBSSxJQUFJLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUN0QixvQkFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFLLFFBQWhCLENBQVI7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBTSxRQUFRLElBQUksS0FBSixDQUFVLEtBQUssVUFBZixDQUFkO0FBQ0Esa0JBQU0sSUFBTixHQUFhLEtBQUssTUFBbEI7QUFDQSxtQkFBTyxLQUFLLEtBQVo7QUFDRDtBQUNGLFNBUkQ7O0FBVUEsWUFBSSxTQUFKLEdBQWdCLFVBQVMsQ0FBVCxFQUFZO0FBQzFCLGlCQUFPLElBQUksS0FBSiw4T0FBNEQsRUFBRSxJQUE5RCxTQUFzRSxFQUFFLFNBQUYsQ0FBWSxPQUFaLENBQW9CLENBQXBCLENBQXRFLENBQVA7QUFDRCxTQUZEOztBQUlBLFlBQUksT0FBSixHQUFjLFVBQVMsQ0FBVCxFQUFZO0FBQ3hCLGlCQUFPLElBQUksS0FBSixvSkFBd0MsQ0FBeEMsQ0FBUDtBQUNELFNBRkQ7O0FBSUEsWUFBSSxJQUFKLENBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQixJQUFyQjtBQUNBLFlBQUksSUFBSixDQUFTLElBQVQ7QUFDRCxPQXRCTSxDQUFQO0FBdUJEOzs7Ozs7a0JBekhrQixNOzs7QUNYckI7Ozs7O0FBQ0EsSUFBTSx1QkFBdUIsU0FBdkIsb0JBQXVCLEdBQVc7QUFDdEMsTUFBSSxJQUFJLENBQVI7QUFDQSxNQUFNLGFBQWEsRUFBbkI7QUFDQSxTQUFNLElBQUksR0FBVixFQUFlO0FBQ2IsUUFBTSxZQUFZLFNBQVMsY0FBVCw0QkFBaUQsQ0FBakQsQ0FBbEI7QUFDQSxRQUFJLFNBQUosRUFBZTtBQUNiLGlCQUFXLElBQVgsQ0FBZ0IsU0FBaEI7QUFDRDtBQUNEO0FBQ0Q7O0FBRUQsYUFBVyxPQUFYLENBQW1CLFVBQVMsSUFBVCxFQUFlO0FBQ2hDLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNELEdBRkQ7QUFJRCxDQWZEOztrQkFpQmUsb0I7Ozs7Ozs7Ozs7O3FqQkNsQmY7Ozs7O0FBR0E7Ozs7Ozs7O0lBRXFCLGU7QUFDakIsK0JBQWM7QUFBQTs7QUFFVixhQUFLLE9BQUwsR0FBa0IsU0FBUyxRQUFULENBQWtCLFFBQXBDO0FBQ0EsYUFBSyxXQUFMLEdBQXNCLEtBQUssT0FBM0I7QUFDQSxhQUFLLFNBQUwsR0FBb0IsS0FBSyxPQUF6Qjs7QUFFQSxhQUFLLGNBQUwsR0FBc0I7QUFDbEI7QUFDQSxzQkFBVSxTQUFTLGdCQUFULENBQTBCLDJCQUExQixDQUZRO0FBR2xCLHlCQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsNEJBQTFCLENBSEs7QUFJbEIsK0JBQW1CLFNBQVMsZ0JBQVQsQ0FBMEIsMkJBQTFCLENBSkQ7QUFLbEIsdUJBQVcsU0FBUyxnQkFBVCxDQUEwQiwwQkFBMUIsQ0FMTztBQU1sQiw2QkFBaUIsU0FBUyxnQkFBVCxDQUEwQix5QkFBMUIsQ0FOQztBQU9sQiwwQkFBYyxTQUFTLGdCQUFULENBQTBCLGlCQUExQixDQVBJO0FBUWxCLHFCQUFTLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQVJTO0FBU2xCO0FBQ0EsdUJBQVcsU0FBUyxnQkFBVCxDQUEwQixzQkFBMUIsQ0FWTztBQVdsQiwwQkFBYyxTQUFTLGdCQUFULENBQTBCLDZCQUExQixDQVhJO0FBWWxCLDhCQUFrQixTQUFTLGdCQUFULENBQTBCLHVCQUExQixDQVpBO0FBYWxCLDRCQUFnQixTQUFTLGdCQUFULENBQTBCLHNDQUExQixDQWJFO0FBY2xCLDRCQUFnQixTQUFTLGdCQUFULENBQTBCLHNDQUExQixDQWRFO0FBZWxCLGdDQUFvQixTQUFTLGdCQUFULENBQTBCLDRCQUExQixDQWZGO0FBZ0JsQix3QkFBWSxTQUFTLGdCQUFULENBQTBCLDRCQUExQixDQWhCTTtBQWlCbEIsOEJBQWtCLFNBQVMsZ0JBQVQsQ0FBMEIsc0JBQTFCLENBakJBO0FBa0JsQixzQkFBVSxTQUFTLGdCQUFULENBQTBCLDBCQUExQixDQWxCUTtBQW1CbEIsc0JBQVUsU0FBUyxnQkFBVCxDQUEwQiwwQkFBMUIsQ0FuQlE7QUFvQmxCLHdCQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FwQk07QUFxQmxCLG9CQUFRLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQXJCVTtBQXNCbEIsc0JBQVUsU0FBUyxjQUFULENBQXdCLFdBQXhCO0FBdEJRLFNBQXRCOztBQXlCQSxhQUFLLHdCQUFMO0FBQ0EsYUFBSyxnQkFBTDtBQUNBLGFBQUssbUJBQUw7O0FBRUE7QUFDQSxhQUFLLFVBQUwsR0FBa0I7QUFDZCxrQ0FBdUI7QUFDbkIsb0JBQUksQ0FEZTtBQUVuQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRmE7QUFHbkIsd0JBQVE7QUFIVyxhQURUO0FBTWQsa0NBQXVCO0FBQ25CLG9CQUFJLENBRGU7QUFFbkIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixDQUE5QixDQUZhO0FBR25CLHdCQUFRO0FBSFcsYUFOVDtBQVdkLGtDQUF1QjtBQUNuQixvQkFBSSxDQURlO0FBRW5CLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsQ0FBOUIsQ0FGYTtBQUduQix3QkFBUTtBQUhXLGFBWFQ7QUFnQmQsa0NBQXVCO0FBQ25CLG9CQUFJLENBRGU7QUFFbkIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixDQUE5QixDQUZhO0FBR25CLHdCQUFRO0FBSFcsYUFoQlQ7QUFxQmQsbUNBQXdCO0FBQ3BCLG9CQUFJLENBRGdCO0FBRXBCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsQ0FBOUIsQ0FGYztBQUdwQix3QkFBUTtBQUhZLGFBckJWO0FBMEJkLG1DQUF3QjtBQUNwQixvQkFBSSxDQURnQjtBQUVwQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRmM7QUFHcEIsd0JBQVE7QUFIWSxhQTFCVjtBQStCZCxtQ0FBd0I7QUFDcEIsb0JBQUksQ0FEZ0I7QUFFcEIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixDQUE5QixDQUZjO0FBR3BCLHdCQUFRO0FBSFksYUEvQlY7QUFvQ2QsbUNBQXdCO0FBQ3BCLG9CQUFJLENBRGdCO0FBRXBCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsQ0FBOUIsQ0FGYztBQUdwQix3QkFBUTtBQUhZLGFBcENWO0FBeUNkLG1DQUF3QjtBQUNwQixvQkFBSSxDQURnQjtBQUVwQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRmM7QUFHcEIsd0JBQVE7QUFIWSxhQXpDVjtBQThDZCxtQ0FBd0I7QUFDcEIsb0JBQUksRUFEZ0I7QUFFcEIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixFQUE5QixDQUZjO0FBR3BCLHdCQUFRO0FBSFksYUE5Q1Y7QUFtRGQsbUNBQXdCO0FBQ3BCLG9CQUFJLEVBRGdCO0FBRXBCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsRUFBOUIsQ0FGYztBQUdwQix3QkFBUTtBQUhZLGFBbkRWO0FBd0RkLG1DQUF3QjtBQUNwQixvQkFBSSxFQURnQjtBQUVwQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRmM7QUFHcEIsd0JBQVE7QUFIWSxhQXhEVjtBQTZEZCxtQ0FBd0I7QUFDcEIsb0JBQUksRUFEZ0I7QUFFcEIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixFQUE5QixDQUZjO0FBR3BCLHdCQUFRO0FBSFksYUE3RFY7QUFrRWQsb0NBQXlCO0FBQ3JCLG9CQUFJLEVBRGlCO0FBRXJCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsRUFBOUIsQ0FGZTtBQUdyQix3QkFBUTtBQUhhLGFBbEVYO0FBdUVkLG9DQUF5QjtBQUNyQixvQkFBSSxFQURpQjtBQUVyQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRmU7QUFHckIsd0JBQVE7QUFIYSxhQXZFWDtBQTRFZCxvQ0FBeUI7QUFDckIsb0JBQUksRUFEaUI7QUFFckIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixFQUE5QixDQUZlO0FBR3JCLHdCQUFRO0FBSGEsYUE1RVg7QUFpRmQsb0NBQXlCO0FBQ3JCLG9CQUFJLEVBRGlCO0FBRXJCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsRUFBOUIsQ0FGZTtBQUdyQix3QkFBUTtBQUhhLGFBakZYO0FBc0ZkLG9DQUF5QjtBQUNyQixvQkFBSSxFQURpQjtBQUVyQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRmU7QUFHckIsd0JBQVE7QUFIYSxhQXRGWDtBQTJGZCxtQ0FBd0I7QUFDcEIsb0JBQUksRUFEZ0I7QUFFcEIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixFQUE5QixDQUZjO0FBR3BCLHdCQUFRO0FBSFksYUEzRlY7QUFnR2QsbUNBQXdCO0FBQ3BCLG9CQUFJLEVBRGdCO0FBRXBCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsRUFBOUIsQ0FGYztBQUdwQix3QkFBUTtBQUhZLGFBaEdWO0FBcUdkLG1DQUF3QjtBQUNwQixvQkFBSSxFQURnQjtBQUVwQixzQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRmM7QUFHcEIsd0JBQVE7QUFIWSxhQXJHVjtBQTBHZCxtQ0FBd0I7QUFDcEIsb0JBQUksRUFEZ0I7QUFFcEIsc0JBQU0sS0FBSyx3QkFBTCxDQUE4QixFQUE5QixDQUZjO0FBR3BCLHdCQUFRO0FBSFksYUExR1Y7QUErR2QscUNBQTBCO0FBQ3RCLG9CQUFJLEVBRGtCO0FBRXRCLHNCQUFNLEtBQUssd0JBQUwsQ0FBOEIsRUFBOUIsQ0FGZ0I7QUFHdEIsd0JBQVE7QUFIYztBQS9HWixTQUFsQjtBQXNISDs7QUFFRDs7Ozs7OzttREFHMkI7O0FBRXZCLGdCQUFNLFdBQVcsU0FBWCxRQUFXLENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUEwQjtBQUN2QyxvQkFBSSxRQUFRLFFBQVo7QUFDQSxvQkFBRyxTQUFTLE9BQVQsSUFBb0IsS0FBdkIsRUFBNkI7QUFDekIsNkJBQVMsT0FBVCxHQUFtQixLQUFuQjtBQUNBLDRCQUFRLFVBQVI7QUFDSDtBQUNELHVCQUFPLFNBQVAsQ0FBaUIsT0FBakIsRUFBMEIsS0FBMUI7QUFDSCxhQVBEOztBQVNBLGdCQUFNLFdBQVcsU0FBWCxRQUFXLENBQVMsS0FBVCxFQUFlO0FBQzVCLHdCQUFPLEtBQVA7QUFDSSx5QkFBSyxRQUFMO0FBQ0ksK0JBQU8sQ0FBQyxLQUFELEVBQVEsSUFBUixDQUFQO0FBQ0oseUJBQUssVUFBTDtBQUNJLCtCQUFPLENBQUMsS0FBRCxFQUFRLElBQVIsQ0FBUDtBQUpSO0FBTUEsdUJBQU8sQ0FBQyxRQUFELEVBQVcsSUFBWCxDQUFQO0FBQ0gsYUFSRDs7QUFVQSxnQkFBSSxTQUFTLHVCQUFiO0FBQ0E7QUFDQSxnQkFBSSxhQUFhLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFqQjs7QUFFQSx1QkFBVyxnQkFBWCxDQUE0QixRQUE1QixFQUFzQyxVQUFTLEtBQVQsRUFBZTtBQUNqRCx5QkFBUyxVQUFULEVBQXFCLE1BQXJCO0FBQ0EsdUJBQU8sUUFBUCxDQUFnQixNQUFoQjtBQUNILGFBSEQ7O0FBS0EsZ0JBQUksUUFBUSxRQUFaO0FBQ0EsZ0JBQUksaUJBQWlCLElBQXJCO0FBQ0EsZ0JBQUcsT0FBTyxTQUFQLENBQWlCLE9BQWpCLENBQUgsRUFBNkI7QUFDekIscUJBQUssU0FBTCxHQUFpQixTQUFTLE9BQU8sU0FBUCxDQUFpQixPQUFqQixDQUFULEtBQXVDLENBQUMsUUFBRCxFQUFXLElBQVgsQ0FBeEQ7O0FBRHlCLGdEQUVDLEtBQUssU0FGTjs7QUFFeEIscUJBRndCO0FBRWpCLDhCQUZpQjs7QUFHekIsb0JBQUcsU0FBUyxRQUFaLEVBQ0ksV0FBVyxPQUFYLEdBQXFCLElBQXJCLENBREosS0FHSSxXQUFXLE9BQVgsR0FBcUIsS0FBckI7QUFDUCxhQVBELE1BUUk7QUFDQSwyQkFBVyxPQUFYLEdBQXFCLElBQXJCO0FBQ0EseUJBQVMsVUFBVCxFQUFxQixNQUFyQjtBQUNBLHFCQUFLLFNBQUwsR0FBaUIsU0FBUyxLQUFULENBQWpCOztBQUhBLGlEQUkwQixLQUFLLFNBSi9COztBQUlDLHFCQUpEO0FBSVEsOEJBSlI7QUFLSDtBQUVKO0FBQ0Q7Ozs7Ozs7MkNBZW1CO0FBQ2YsZ0JBQUksZ0JBQWdCLFNBQWhCLGFBQWdCLEdBQVc7QUFDL0Isb0JBQUksTUFBUyxTQUFTLFFBQVQsQ0FBa0IsUUFBM0IseUVBQXVHLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBdkcscUJBQXdJLEtBQUssY0FBTCxDQUFvQixNQUFwQixDQUEyQixLQUF2SztBQUNBLG9CQUFNLE1BQU0sSUFBSSxjQUFKLEVBQVo7QUFDQSxvQkFBSSxPQUFPLElBQVg7QUFDQSxvQkFBSSxNQUFKLEdBQWEsWUFBWTtBQUNyQix3QkFBSSxJQUFJLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUNwQiw2QkFBSyxjQUFMLENBQW9CLFFBQXBCLENBQTZCLFNBQTdCLEdBQXlDLG1CQUF6QztBQUNBLDZCQUFLLGNBQUwsQ0FBb0IsUUFBcEIsQ0FBNkIsU0FBN0IsQ0FBdUMsR0FBdkMsQ0FBMkMsbUJBQTNDO0FBQ0EsNkJBQUssY0FBTCxDQUFvQixRQUFwQixDQUE2QixTQUE3QixDQUF1QyxNQUF2QyxDQUE4QyxvQkFBOUM7QUFDQTtBQUNIO0FBQ0gseUJBQUssY0FBTCxDQUFvQixRQUFwQixDQUE2QixTQUE3QixHQUF5QyxrQkFBekM7QUFDQSx5QkFBSyxjQUFMLENBQW9CLFFBQXBCLENBQTZCLFNBQTdCLENBQXVDLE1BQXZDLENBQThDLG1CQUE5QztBQUNBLHlCQUFLLGNBQUwsQ0FBb0IsUUFBcEIsQ0FBNkIsU0FBN0IsQ0FBdUMsR0FBdkMsQ0FBMkMsb0JBQTNDO0FBQ0QsaUJBVkQ7O0FBWUEsb0JBQUksT0FBSixHQUFjLFVBQVMsQ0FBVCxFQUFXO0FBQ3ZCLDRCQUFRLEdBQVIsa0dBQWdDLENBQWhDO0FBQ0EseUJBQUssY0FBTCxDQUFvQixRQUFwQixDQUE2QixTQUE3QixHQUF5QyxrQkFBekM7QUFDQSx5QkFBSyxjQUFMLENBQW9CLFFBQXBCLENBQTZCLFNBQTdCLENBQXVDLE1BQXZDLENBQThDLG1CQUE5QztBQUNBLHlCQUFLLGNBQUwsQ0FBb0IsUUFBcEIsQ0FBNkIsU0FBN0IsQ0FBdUMsR0FBdkMsQ0FBMkMsb0JBQTNDO0FBQ0QsaUJBTEQ7O0FBT0Usb0JBQUksSUFBSixDQUFTLEtBQVQsRUFBZ0IsR0FBaEI7QUFDQSxvQkFBSSxJQUFKO0FBQ0QsYUF6QkQ7O0FBMkJBLGlCQUFLLHFCQUFMLEdBQTZCLGNBQWMsSUFBZCxDQUFtQixJQUFuQixDQUE3QjtBQUNBLGlCQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsZ0JBQTNCLENBQTRDLFFBQTVDLEVBQXFELEtBQUsscUJBQTFEO0FBQ0E7QUFDSDs7O2lEQUV3QixFLEVBQUk7QUFDekIsZ0JBQUcsT0FBTyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsSUFBNEIsS0FBSyxZQUFMLENBQWtCLFFBQXJELEtBQWtFLEtBQUssWUFBTCxDQUFrQixLQUF2RixFQUE4RjtBQUMxRixvQkFBSSxPQUFPLEVBQVg7QUFDQSxvQkFBRyxTQUFTLEVBQVQsTUFBaUIsQ0FBakIsSUFBc0IsU0FBUyxFQUFULE1BQWlCLEVBQXZDLElBQTZDLFNBQVMsRUFBVCxNQUFpQixFQUE5RCxJQUFvRSxTQUFTLEVBQVQsTUFBaUIsRUFBeEYsRUFBNEY7QUFDeEYsOENBQXVCLFNBQVMsUUFBVCxDQUFrQixRQUF6QztBQUNIO0FBQ0QsdUJBQVUsSUFBVixtTEFHa0IsRUFIbEIsMkNBSXNCLEtBQUssWUFBTCxDQUFrQixNQUp4Qyw0Q0FLc0IsS0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQXdCLE9BQXhCLHFDQUFtRSxFQUFuRSxDQUx0Qiw4Q0FNc0IsS0FBSyxZQUFMLENBQWtCLEtBTnhDLG9XQWE0QixTQUFTLFFBQVQsQ0FBa0IsUUFiOUM7QUFrQkg7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOzs7OENBRXNEO0FBQUEsZ0JBQW5DLE1BQW1DLHVFQUE1QixPQUE0QjtBQUFBLGdCQUFuQixRQUFtQix1RUFBVixRQUFVOzs7QUFFbkQsaUJBQUssWUFBTCxHQUFvQjtBQUNoQix3QkFBUSxNQURRO0FBRWhCLDBCQUFVLFFBRk07QUFHaEIsc0JBQU0sSUFIVTtBQUloQix1QkFBTyxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsRUFBbUMsS0FBbkMsSUFBNkMsa0NBSnBDO0FBS2hCLHVCQUFPLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FMUztBQU1oQiw4QkFBYyxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBTkUsRUFNa0I7QUFDbEMseUJBQVMsS0FBSyxPQVBFO0FBUWhCLDJCQUFjLFNBQVMsUUFBVCxDQUFrQixRQUFoQztBQVJnQixhQUFwQjs7QUFXQTtBQUNBLGlCQUFLLFFBQUwsR0FBZ0IsU0FBUyxjQUFULENBQXdCLFdBQXhCLENBQWhCO0FBQ0EsaUJBQUssTUFBTCxHQUFjLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFkO0FBQ0EsaUJBQUssVUFBTCxHQUFrQixTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBbEI7O0FBRUEsaUJBQUssSUFBTCxHQUFZO0FBQ1osK0JBQWtCLEtBQUssWUFBTCxDQUFrQixTQUFwQyw2QkFBcUUsS0FBSyxZQUFMLENBQWtCLE1BQXZGLGVBQXVHLEtBQUssWUFBTCxDQUFrQixLQUF6SCxlQUF3SSxLQUFLLFlBQUwsQ0FBa0IsS0FEOUk7QUFFWixvQ0FBdUIsS0FBSyxZQUFMLENBQWtCLFNBQXpDLG9DQUFpRixLQUFLLFlBQUwsQ0FBa0IsTUFBbkcsZUFBbUgsS0FBSyxZQUFMLENBQWtCLEtBQXJJLHFCQUEwSixLQUFLLFlBQUwsQ0FBa0IsS0FGaEs7QUFHWiwyQkFBYyxLQUFLLE9BQW5CLCtCQUhZO0FBSVosK0JBQWtCLEtBQUssT0FBdkIsbUNBSlk7QUFLWix3QkFBVyxLQUFLLE9BQWhCLDJCQUxZO0FBTVosbUNBQXNCLEtBQUssT0FBM0I7QUFOWSxhQUFaO0FBUUg7OzswQkFuR2EsSyxFQUFPO0FBQ2pCLGlCQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0g7QUFDRDs7Ozs7NEJBSWdCO0FBQ1osbUJBQU8sS0FBSyxLQUFaO0FBQ0g7Ozs7OztrQkE3TmdCLGU7Ozs7O0FDTHJCOzs7Ozs7QUFFQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3JELE1BQUksWUFBWSwrQkFBaEI7QUFDQSxNQUFNLE9BQU8sU0FBUyxjQUFULENBQXdCLG9CQUF4QixDQUFiO0FBQ0EsTUFBTSxRQUFRLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFkO0FBQ0EsTUFBTSxjQUFjLFNBQVMsYUFBVCxDQUF1QixlQUF2QixDQUFwQjtBQUNBLE1BQU0sYUFBYSxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBbkI7QUFDQSxNQUFNLHNCQUFzQixTQUFTLGNBQVQsQ0FBd0Isa0JBQXhCLENBQTVCO0FBQ0EsTUFBTSxvQkFBb0IsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQTFCO0FBQ0EsTUFBTSxTQUFTLFNBQVMsY0FBVCxDQUF3QixTQUF4QixDQUFmOztBQUVBO0FBQ0EsT0FBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFTLEtBQVQsRUFBZ0I7QUFDM0MsUUFBSSxVQUFVLE1BQU0sTUFBcEI7QUFDQSxRQUFHLFFBQVEsRUFBUixJQUFjLFFBQVEsU0FBUixDQUFrQixRQUFsQixDQUEyQiw0QkFBM0IsQ0FBakIsRUFBMkU7QUFDdkUsWUFBTSxjQUFOO0FBQ0EsVUFBTSxpQkFBaUIsK0JBQXZCO0FBQ0EscUJBQWUsbUJBQWYsQ0FBbUMsT0FBTyxNQUExQyxFQUFrRCxPQUFPLFFBQXpEOztBQUdBLDBCQUFvQixLQUFwQixHQUE0QixlQUFlLHdCQUFmLENBQXdDLGVBQWUsVUFBZixDQUEwQixRQUFRLEVBQWxDLEVBQXNDLElBQXRDLENBQXhDLENBQTVCO0FBQ0EsVUFBRyxDQUFDLE1BQU0sU0FBTixDQUFnQixRQUFoQixDQUF5QixnQkFBekIsQ0FBSixFQUFnRDtBQUM1QyxpQkFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixRQUFwQixHQUErQixRQUEvQjtBQUNBLGNBQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixnQkFBcEI7QUFDQSxvQkFBWSxTQUFaLENBQXNCLEdBQXRCLENBQTBCLHVCQUExQjtBQUNBLGdCQUFPLFVBQVUsVUFBVixDQUFxQixNQUFNLE1BQU4sQ0FBYSxFQUFsQyxFQUFzQyxRQUF0QyxDQUFQO0FBQ0ksZUFBSyxNQUFMO0FBQ0ksZ0JBQUcsQ0FBQyxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsYUFBekIsQ0FBSixFQUE2QztBQUN6QyxvQkFBTSxTQUFOLENBQWdCLEdBQWhCLENBQW9CLGFBQXBCO0FBQ0g7QUFDRCxnQkFBRyxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsY0FBekIsQ0FBSCxFQUE2QztBQUN6QyxvQkFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLGNBQXZCO0FBQ0g7QUFDRDtBQUNKLGVBQUssT0FBTDtBQUNJLGdCQUFHLENBQUMsTUFBTSxTQUFOLENBQWdCLFFBQWhCLENBQXlCLGNBQXpCLENBQUosRUFBOEM7QUFDMUMsb0JBQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixjQUFwQjtBQUNIO0FBQ0QsZ0JBQUcsTUFBTSxTQUFOLENBQWdCLFFBQWhCLENBQXlCLGFBQXpCLENBQUgsRUFBNEM7QUFDeEMsb0JBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixhQUF2QjtBQUNIO0FBQ0Q7QUFDSixlQUFLLE1BQUw7QUFDSSxnQkFBRyxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsY0FBekIsQ0FBSCxFQUE2QztBQUN6QyxvQkFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLGNBQXZCO0FBQ0g7QUFDRCxnQkFBRyxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsYUFBekIsQ0FBSCxFQUE0QztBQUN4QyxvQkFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLGFBQXZCO0FBQ0g7QUF2QlQ7QUF5QkM7QUFFUjtBQUNKLEdBekNEOztBQTJDQSxNQUFJLGtCQUFrQix5QkFBUyxLQUFULEVBQWU7QUFDbkMsUUFBSSxVQUFVLE1BQU0sTUFBcEI7QUFDQSxRQUFHLENBQUMsQ0FBQyxRQUFRLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsWUFBM0IsQ0FBRCxJQUE2QyxZQUFZLEtBQTFELEtBQ0UsQ0FBQyxRQUFRLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsNEJBQTNCLENBREgsSUFFRSxDQUFDLFFBQVEsU0FBUixDQUFrQixRQUFsQixDQUEyQixjQUEzQixDQUZILElBR0UsQ0FBQyxRQUFRLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsY0FBM0IsQ0FISCxJQUlFLENBQUMsUUFBUSxTQUFSLENBQWtCLFFBQWxCLENBQTJCLGVBQTNCLENBSkgsSUFLRSxDQUFDLFFBQVEsU0FBUixDQUFrQixRQUFsQixDQUEyQixZQUEzQixDQUxOLEVBS2dEO0FBQzlDLFlBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixnQkFBdkI7QUFDQSxrQkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLHVCQUE3QjtBQUNBLGVBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsUUFBcEIsR0FBK0IsTUFBL0I7QUFDRDtBQUNGLEdBWkQ7O0FBY0Esb0JBQWtCLGdCQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBO0FBQ0EsV0FBUyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxlQUFuQzs7QUFJQSxvQkFBa0IsZ0JBQWxCLENBQW1DLE9BQW5DLEVBQTRDLFVBQVMsS0FBVCxFQUFlO0FBQ3ZELFVBQU0sY0FBTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFvQixNQUFwQjs7QUFFQSxRQUFHO0FBQ0MsVUFBTSxVQUFVLFNBQVMsV0FBVCxDQUFxQixNQUFyQixDQUFoQjtBQUNBLFVBQUksTUFBTSxVQUFVLFlBQVYsR0FBeUIsY0FBbkM7QUFDQSxjQUFRLEdBQVIsQ0FBWSw0QkFBNEIsR0FBeEM7QUFDSCxLQUpELENBS0EsT0FBTSxDQUFOLEVBQVE7QUFDSixjQUFRLEdBQVIsOEdBQWtDLEVBQUUsZUFBcEM7QUFDSDs7QUFFRDtBQUNBO0FBQ0EsV0FBTyxZQUFQLEdBQXNCLGVBQXRCOztBQUVBLFVBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixnQkFBdkI7QUFDQSxnQkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLHVCQUE3QjtBQUNBLGFBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsUUFBcEIsR0FBK0IsTUFBL0I7QUFDSCxHQXZCRDs7QUF5QkEsb0JBQWtCLFFBQWxCLEdBQTZCLENBQUMsU0FBUyxxQkFBVCxDQUErQixNQUEvQixDQUE5QjtBQUNILENBcEdEOzs7QUNGQTs7Ozs7QUFDQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFTLE1BQVQsRUFBaUI7QUFDckMsV0FBTyxhQUFQLEdBQXVCLEVBQXZCO0FBQ0EsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxFQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLEVBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxFQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLEVBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxFQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLEVBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksQ0FEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxDQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLENBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksQ0FEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxDQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLENBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksQ0FEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxDQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLENBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxFQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLEVBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxRQUFNLFVBQVUsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQWhCO0FBQ0EsUUFBSSxPQUFKLEVBQWE7QUFDWCxZQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQSxlQUFPLEtBQVAsR0FBZSxJQUFmO0FBQ0EsZUFBTyxHQUFQLEdBQWEsMkZBQWI7QUFDQSxnQkFBUSxXQUFSLEdBQXNCLEVBQXRCO0FBQ0EsZ0JBQVEsV0FBUixDQUFvQixNQUFwQjtBQUNEO0FBQ0YsQ0E5SUQ7O2tCQWdKZSxhOzs7QUNqSmY7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsU0FBUyxjQUFULENBQXdCLGFBQXhCLENBQW5CO0FBQ0EsSUFBTSxtQkFBbUIsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUF6QjtBQUNBLElBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQTtBQUNBLElBQU0sV0FBVyxTQUFTLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBakI7QUFDQSxJQUFNLFNBQVMsU0FBUyxjQUFULENBQXdCLFFBQXhCLENBQWY7O0FBRUEsSUFBTSxZQUFZLHFCQUFXLFFBQVgsRUFBcUIsTUFBckIsQ0FBbEI7QUFDQSxVQUFVLFNBQVY7O0FBRUEsV0FBVyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyxZQUFXO0FBQzlDLE1BQU0sWUFBWSxxQkFBVyxRQUFYLEVBQXFCLE1BQXJCLENBQWxCO0FBQ0EsWUFBVSxTQUFWO0FBQ0QsQ0FIRDs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8g0KDQsNCx0L7RgtCwINGBINC60YPQutCw0LzQuFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb29raWVzIHtcclxuXHJcbiAgc2V0Q29va2llKG5hbWUsIHZhbHVlKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XHJcbiAgICBleHBpcmVzLnNldFRpbWUoZXhwaXJlcy5nZXRUaW1lKCkgKyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiOyBleHBpcmVzPVwiICsgZXhwaXJlcy50b0dNVFN0cmluZygpICsgIFwiOyBwYXRoPS9cIjtcclxuICB9XHJcblxyXG4gIC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCIGNvb2tpZSDRgSDQuNC80LXQvdC10LwgbmFtZSwg0LXRgdC70Lgg0LXRgdGC0YwsINC10YHQu9C4INC90LXRgiwg0YLQviB1bmRlZmluZWRcclxuICBnZXRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cChcclxuICAgICAgXCIoPzpefDsgKVwiICsgbmFtZS5yZXBsYWNlKC8oW1xcLiQ/Knx7fVxcKFxcKVxcW1xcXVxcXFxcXC9cXCteXSkvZywgJ1xcXFwkMScpICsgXCI9KFteO10qKVwiXHJcbiAgICApKTtcclxuICAgIHJldHVybiBtYXRjaGVzID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZXNbMV0pIDogdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQ29va2llKCkge1xyXG4gICAgdGhpcy5zZXRDb29raWUobmFtZSwgXCJcIiwge1xyXG4gICAgICBleHBpcmVzOiAtMVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxyXG4qL1xyXG5cclxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcclxucmVxdWlyZSgnU3RyaW5nLmZyb21Db2RlUG9pbnQnKTtcclxuaW1wb3J0IEdlbmVyYXRvcldpZGdldCBmcm9tICcuL2dlbmVyYXRvci13aWRnZXQnO1xyXG5cclxuaW1wb3J0IHJlbmRlcldpZGdldHMgZnJvbSAnLi9yZW5kZXJXaWRnZXRzJztcclxuaW1wb3J0IGNsZWFyV2lkZ2V0Q29udGFpbmVyIGZyb20gJy4vY2xlYXJXaWRnZXRDb250YWluZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0aWVzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lcikge1xyXG5cclxuICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xyXG4gICAgdGhpcy51bml0cyA9IGdlbmVyYXRlV2lkZ2V0LnVuaXRzVGVtcFsxXTtcclxuICAgIGlmICghY2l0eU5hbWUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWRDaXR5ID0gdGhpcy5zZWxlY3RlZENpdHkuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNpdHlOYW1lID0gY2l0eU5hbWUudmFsdWUucmVwbGFjZSgvKFxccykrL2csJy0nKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXIgfHwgJyc7XHJcbiAgICB0aGlzLnVybCA9IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vb3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/cT0ke3RoaXMuY2l0eU5hbWV9JnR5cGU9bGlrZSZzb3J0PXBvcHVsYXRpb24mY250PTMwJmFwcGlkPWIxYjE1ZTg4ZmE3OTcyMjU0MTI0MjljMWM1MGMxMjJhMWA7XHJcblxyXG4gICAgdGhpcy5zZWxDaXR5U2lnbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24uaW5uZXJUZXh0ID0gJyBzZWxlY3RlZCAnO1xyXG4gICAgdGhpcy5zZWxDaXR5U2lnbi5jbGFzcyA9ICd3aWRnZXQtZm9ybV9fc2VsZWN0ZWQnO1xyXG5cclxuICAgIHRoaXMuY2l0eUlkID0gMjY0Mzc0MztcclxuICAgIHJlbmRlcldpZGdldHModGhpcy5jaXR5SWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2l0aWVzKCkge1xyXG4gICAgaWYgKCF0aGlzLmNpdHlOYW1lKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybClcclxuICAgICAgLnRoZW4oXHJcbiAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoRGF0YShyZXNwb25zZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXRTZWFyY2hEYXRhKEpTT05vYmplY3QpIHtcclxuICAgIGlmICghSlNPTm9iamVjdC5saXN0Lmxlbmd0aCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnQ2l0eSBub3QgZm91bmQnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCj0LTQsNC70Y/QtdC8INGC0LDQsdC70LjRhtGDLCDQtdGB0LvQuCDQtdGB0YLRjFxyXG4gICAgY29uc3QgdGFibGVDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xyXG4gICAgaWYgKHRhYmxlQ2l0eSkge1xyXG4gICAgICB0YWJsZUNpdHkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWJsZUNpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBodG1sID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IEpTT05vYmplY3QubGlzdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBuYW1lID0gYCR7SlNPTm9iamVjdC5saXN0W2ldLm5hbWV9LCAke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeX1gO1xyXG4gICAgICBjb25zdCBmbGFnID0gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1hZ2VzL2ZsYWdzLyR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5LnRvTG93ZXJDYXNlKCl9LnBuZ2A7XHJcbiAgICAgIGh0bWwgKz0gYDx0cj48dGQgY2xhc3M9XCJ3aWRnZXQtZm9ybV9faXRlbVwiPjxhIGhyZWY9XCIvY2l0eS8ke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIiBpZD1cIiR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGNsYXNzPVwid2lkZ2V0LWZvcm1fX2xpbmtcIj4ke25hbWV9PC9hPjxpbWcgc3JjPVwiJHtmbGFnfVwiPjwvcD48L3RkPjwvdHI+YDtcclxuICAgIH1cclxuXHJcbiAgICBodG1sID0gYDx0YWJsZSBjbGFzcz1cInRhYmxlXCIgaWQ9XCJ0YWJsZS1jaXRpZXNcIj4ke2h0bWx9PC90YWJsZT5gO1xyXG4gICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICBjb25zdCB0YWJsZUNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1jaXRpZXMnKTtcclxuXHJcbiAgICB0YWJsZUNpdGllcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2VsZWN0ZWRDaXR5KTtcclxuICB9XHJcblxyXG4gIHNlbGVjdGVkQ2l0eShldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAoJ0EnKS50b0xvd2VyQ2FzZSgpICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dpZGdldC1mb3JtX19saW5rJykpIHtcclxuICAgICAgbGV0IHNlbGVjdGVkQ2l0eSA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZENpdHknKTtcclxuICAgICAgaWYgKCFzZWxlY3RlZENpdHkpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5zZWxDaXR5U2lnbiwgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xyXG5cclxuICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcclxuXHJcbiAgICAgICAgLy8g0J/QvtC00YHRgtCw0L3QvtCy0LrQsCDQvdCw0LnQtNC10L3QvtCz0L4g0LPQvtGA0L7QtNCwXHJcbiAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LmNpdHlJZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQuY2l0eU5hbWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LnVuaXRzID0gdGhpcy51bml0cztcclxuICAgICAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKGV2ZW50LnRhcmdldC5pZCwgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcclxuICAgICAgICB0aGlzLmNpdHlJZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICB0aGlzLmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xyXG5cclxuICAgICAgICBjbGVhcldpZGdldENvbnRhaW5lcigpO1xyXG4gICAgICAgIHJlbmRlcldpZGdldHModGhpcy5jaXR5SWQpO1xyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAqIEBwYXJhbSB1cmxcclxuICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICovXHJcbiAgaHR0cEdldCh1cmwpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgY2xlYXJXaWRnZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgaSA9IDE7XHJcbiAgY29uc3QgY29udGFpbmVycyA9IFtdO1xyXG4gIHdoaWxlKGkgPCAxMDApIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBvcGVud2VhdGhlcm1hcC13aWRnZXQtJHtpfWApO1xyXG4gICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICBjb250YWluZXJzLnB1c2goY29udGFpbmVyKTtcclxuICAgIH1cclxuICAgIGkrK1xyXG4gIH07XHJcblxyXG4gIGNvbnRhaW5lcnMuZm9yRWFjaChmdW5jdGlvbihlbGVtKSB7XHJcbiAgICBlbGVtLmlubmVyVGV4dCA9ICcnO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsZWFyV2lkZ2V0Q29udGFpbmVyO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAxMy4xMC4yMDE2LlxyXG4gKi9cclxuaW1wb3J0IENvb2tpZXMgZnJvbSAnLi9Db29raWVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmVyYXRvcldpZGdldCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly9vcGVud2VhdGhlcm1hcC5vcmcvdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtYDtcclxuICAgICAgICB0aGlzLnNjcmlwdEQzU1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy9saWJzL2QzLm1pbi5qc2A7XHJcbiAgICAgICAgdGhpcy5zY3JpcHRTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL3dlYXRoZXItd2lkZ2V0LWdlbmVyYXRvci5qc2A7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgICAgICAgIC8vINCf0LXRgNCy0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtbGVmdC1tZW51X19oZWFkZXInKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbnVtYmVyJyksXHJcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX21lYW5zJyksXHJcbiAgICAgICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX193aW5kJyksXHJcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19pbWcnKSxcclxuICAgICAgICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FsZW5kYXJfX2l0ZW0nKSxcclxuICAgICAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKSxcclxuICAgICAgICAgICAgLy8g0JLRgtC+0YDQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICAgICAgICBjaXR5TmFtZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX3RpdGxlJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3RlbXBlcmF0dXJlJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlRmVlbHM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19mZWVscycpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1pbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWluJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWF4OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1tYXgnKSxcclxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub24yOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X19kZXNjcmlwdGlvbicpLFxyXG4gICAgICAgICAgICB3aW5kU3BlZWQyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fd2luZC1zcGVlZCcpLFxyXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXIyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faWNvbicpLFxyXG4gICAgICAgICAgICBodW1pZGl0eTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2h1bWlkaXR5JyksXHJcbiAgICAgICAgICAgIHByZXNzdXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fcHJlc3N1cmUnKSxcclxuICAgICAgICAgICAgZGF0ZVJlcG9ydDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldF9fZGF0ZScpLFxyXG4gICAgICAgICAgICBhcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JyksXHJcbiAgICAgICAgICAgIGVycm9yS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3Ita2V5JyksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0aWFsTWV0cmljVGVtcGVyYXR1cmUoKTtcclxuICAgICAgICB0aGlzLnZhbGlkYXRpb25BUElrZXkoKTtcclxuICAgICAgICB0aGlzLnNldEluaXRpYWxTdGF0ZUZvcm0oKTtcclxuXHJcbiAgICAgICAgLy8g0L7QsdGK0LXQutGCLdC60LDRgNGC0LAg0LTQu9GPINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNGPINCy0YHQtdGFINCy0LjQtNC20LXRgtC+0LIg0YEg0LrQvdC+0L/QutC+0Lkt0LjQvdC40YbQuNCw0YLQvtGA0L7QvCDQuNGFINCy0YvQt9C+0LLQsCDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INC60L7QtNCwXHJcbiAgICAgICAgdGhpcy5tYXBXaWRnZXRzID0ge1xyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMy1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgzKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA0LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC01LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDUsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg1KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTYtcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDYpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA3LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC04LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDgsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg4KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTktcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogOSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDExKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEyLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTIpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTMsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC01LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxNSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE1KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxNixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE2KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC03LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxNyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE3KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC04LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxOCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE4KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxOSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIxLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjMsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDI0LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMzEtcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDMxLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMzEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRjyDQsiDQstC40LTQttC10YLQsNGFXHJcbiAgICAgKiAqL1xyXG4gICAgaW5pdGlhbE1ldHJpY1RlbXBlcmF0dXJlKCkge1xyXG5cclxuICAgICAgICBjb25zdCBzZXRVbml0cyA9IGZ1bmN0aW9uKGNoZWNrYm94LCBjb29raWUpe1xyXG4gICAgICAgICAgICB2YXIgdW5pdHMgPSAnbWV0cmljJztcclxuICAgICAgICAgICAgaWYoY2hlY2tib3guY2hlY2tlZCA9PSBmYWxzZSl7XHJcbiAgICAgICAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB1bml0cyA9ICdpbXBlcmlhbCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29va2llLnNldENvb2tpZSgndW5pdHMnLCB1bml0cyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0VW5pdHMgPSBmdW5jdGlvbih1bml0cyl7XHJcbiAgICAgICAgICAgIHN3aXRjaCh1bml0cyl7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdtZXRyaWMnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbdW5pdHMsICfCsEMnXTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2ltcGVyaWFsJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3VuaXRzLCAnwrBGJ107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFsnbWV0cmljJywgJ8KwQyddO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjb29raWUgPSBuZXcgQ29va2llcygpO1xyXG4gICAgICAgIC8v0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQtdC00LjQvdC40YYg0LjQt9C80LXRgNC10L3QuNGPXHJcbiAgICAgICAgdmFyIHVuaXRzQ2hlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVuaXRzX2NoZWNrXCIpO1xyXG5cclxuICAgICAgICB1bml0c0NoZWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBzZXRVbml0cyh1bml0c0NoZWNrLCBjb29raWUpO1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB1bml0cyA9IFwibWV0cmljXCI7XHJcbiAgICAgICAgdmFyIHRleHRfdW5pdF90ZW1wID0gbnVsbDtcclxuICAgICAgICBpZihjb29raWUuZ2V0Q29va2llKCd1bml0cycpKXtcclxuICAgICAgICAgICAgdGhpcy51bml0c1RlbXAgPSBnZXRVbml0cyhjb29raWUuZ2V0Q29va2llKCd1bml0cycpKSB8fCBbJ21ldHJpYycsICfCsEMnXTtcclxuICAgICAgICAgICAgW3VuaXRzLCB0ZXh0X3VuaXRfdGVtcF0gPSB0aGlzLnVuaXRzVGVtcDtcclxuICAgICAgICAgICAgaWYodW5pdHMgPT0gXCJtZXRyaWNcIilcclxuICAgICAgICAgICAgICAgIHVuaXRzQ2hlY2suY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHVuaXRzQ2hlY2suY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB1bml0c0NoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXRVbml0cyh1bml0c0NoZWNrLCBjb29raWUpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaXRzVGVtcCA9IGdldFVuaXRzKHVuaXRzKTtcclxuICAgICAgICAgICAgW3VuaXRzLCB0ZXh0X3VuaXRfdGVtcF0gPSB0aGlzLnVuaXRzVGVtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQodCy0L7QudGB0YLQstC+INGD0YHRgtCw0L3QvtCy0LrQuCDQtdC00LjQvdC40YYg0LjQt9C80LXRgNC10L3QuNGPINC00LvRjyDQstC40LTQttC10YLQvtCyXHJcbiAgICAgKiBAcGFyYW0gdW5pdHNcclxuICAgICAqL1xyXG4gICAgc2V0IHVuaXRzVGVtcCh1bml0cykge1xyXG4gICAgICAgIHRoaXMudW5pdHMgPSB1bml0cztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0KHQstC+0LnRgdGC0LLQviDQv9C+0LvRg9GH0LXQvdC40Y8g0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRjyDQtNC70Y8g0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKi9cclxuICAgIGdldCB1bml0c1RlbXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudW5pdHM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGlvbkFQSWtleSgpIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGlvbkFQSSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCB1cmwgPSBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZm9yZWNhc3QvZGFpbHk/aWQ9NTI0OTAxJnVuaXRzPSR7dGhpcy51bml0c1RlbXBbMF19JmNudD04JmFwcGlkPSR7dGhpcy5jb250cm9sc1dpZGdldC5hcGlLZXkudmFsdWV9YDtcclxuICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBhY2NlcHQnO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBlcnJvcic7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1nb29kJyk7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhg0J7RiNC40LHQutCwINCy0LDQu9C40LTQsNGG0LjQuCAke2V9YCk7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGVycm9yJztcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xyXG4gICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kID0gdmFsaWRhdGlvbkFQSS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHNXaWRnZXQuYXBpS2V5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsdGhpcy5ib3VuZFZhbGlkYXRpb25NZXRob2QpO1xyXG4gICAgICAgIC8vdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoaWQpIHtcclxuICAgICAgICBpZihpZCAmJiAodGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkIHx8IHRoaXMucGFyYW1zV2lkZ2V0LmNpdHlOYW1lKSAmJiB0aGlzLnBhcmFtc1dpZGdldC5hcHBpZCkge1xyXG4gICAgICAgICAgICBsZXQgY29kZSA9ICcnO1xyXG4gICAgICAgICAgICBpZihwYXJzZUludChpZCkgPT09IDEgfHwgcGFyc2VJbnQoaWQpID09PSAxMSB8fCBwYXJzZUludChpZCkgPT09IDIxIHx8IHBhcnNlSW50KGlkKSA9PT0gMzEpIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBgPHNjcmlwdCBzcmM9JyR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly9vcGVud2VhdGhlcm1hcC5vcmcvdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtL2pzL2QzLm1pbi5qcyc+PC9zY3JpcHQ+YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYCR7Y29kZX08ZGl2IGlkPSdvcGVud2VhdGhlcm1hcC13aWRnZXQnPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT0ndGV4dC9qYXZhc2NyaXB0Jz5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICR7aWR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXR5aWQ6ICR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwaWQ6ICcke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkLnJlcGxhY2UoYDJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3YCwnJyl9JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdHM6ICcke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0JyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gJyR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly9vcGVud2VhdGhlcm1hcC5vcmcvdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtL2pzL3dlYXRoZXItd2lkZ2V0LWdlbmVyYXRvci5qcyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgICAgICAgPC9zY3JpcHQ+YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEluaXRpYWxTdGF0ZUZvcm0oY2l0eUlkPTI2NDM3NDMsIGNpdHlOYW1lPSdMb25kb24nKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgICAgICAgICBjaXR5SWQ6IGNpdHlJZCxcclxuICAgICAgICAgICAgY2l0eU5hbWU6IGNpdHlOYW1lLFxyXG4gICAgICAgICAgICBsYW5nOiAnZW4nLFxyXG4gICAgICAgICAgICBhcHBpZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKS52YWx1ZSB8fCAgJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgICAgICAgdW5pdHM6IHRoaXMudW5pdHNUZW1wWzBdLFxyXG4gICAgICAgICAgICB0ZXh0VW5pdFRlbXA6IHRoaXMudW5pdHNUZW1wWzFdLCAgLy8gMjQ4XHJcbiAgICAgICAgICAgIGJhc2VVUkw6IHRoaXMuYmFzZVVSTCxcclxuICAgICAgICAgICAgdXJsRG9tYWluOiBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdgLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcclxuICAgICAgICB0aGlzLmNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdGllcycpO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG5cclxuICAgICAgICB0aGlzLnVybHMgPSB7XHJcbiAgICAgICAgdXJsV2VhdGhlckFQSTogYCR7dGhpcy5wYXJhbXNXaWRnZXQudXJsRG9tYWlufS9kYXRhLzIuNS93ZWF0aGVyP2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZjbnQ9OCZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgd2luZFNwZWVkOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvd2luZC1zcGVlZC1kYXRhLmpzb25gLFxyXG4gICAgICAgIHdpbmREaXJlY3Rpb246IGAke3RoaXMuYmFzZVVSTH0vZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25gLFxyXG4gICAgICAgIGNsb3VkczogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL2Nsb3Vkcy1kYXRhLmpzb25gLFxyXG4gICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanNvbmAsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJccmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcciAgICB2YXIgZ2VuZXJhdG9yID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJtLWxhbmRpbmctd2lkZ2V0Jyk7XHIgICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAnKTtcciAgICBjb25zdCBwb3B1cFNoYWRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1zaGFkb3cnKTtcciAgICBjb25zdCBwb3B1cENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNsb3NlJyk7XHIgICAgY29uc3QgY29udGVudEpTR2VuZXJhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jb2RlLWdlbmVyYXRlJyk7XHIgICAgY29uc3QgY29weUNvbnRlbnRKU0NvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29weS1qcy1jb2RlJyk7XHIgICAgY29uc3QgYXBpS2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKTtcclxyICAgIC8vINCk0LjQutGB0LjRgNGD0LXQvCDQutC70LjQutC4INC90LAg0YTQvtGA0LzQtSwg0Lgg0L7RgtC60YDRi9Cy0LDQtdC8IHBvcHVwINC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRg1xyICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyICAgICAgICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcciAgICAgICAgaWYoZWxlbWVudC5pZCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29udGFpbmVyLWN1c3RvbS1jYXJkX19idG4nKSkge1xyICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgICAgICAgICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSh3aW5kb3cuY2l0eUlkLCB3aW5kb3cuY2l0eU5hbWUpO1xyXHJcciAgICAgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24udmFsdWUgPSBnZW5lcmF0ZVdpZGdldC5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoZ2VuZXJhdGVXaWRnZXQubWFwV2lkZ2V0c1tlbGVtZW50LmlkXVsnaWQnXSk7XHIgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKSB7XHIgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgICAgICAgICAgcG9wdXBTaGFkb3cuY2xhc3NMaXN0LmFkZCgncG9wdXAtc2hhZG93LS12aXNpYmxlJylcciAgICAgICAgICAgICAgICBzd2l0Y2goZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnc2NoZW1hJ10pIHtcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmx1ZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdub25lJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICB9XHJcciAgICAgICAgfVxyICAgIH0pO1xyXHIgICAgdmFyIGV2ZW50UG9wdXBDbG9zZSA9IGZ1bmN0aW9uKGV2ZW50KXtcciAgICAgIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyICAgICAgaWYoKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBDbG9zZScpIHx8IGVsZW1lbnQgPT09IHBvcHVwKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbnRhaW5lci1jdXN0b20tY2FyZF9fYnRuJylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9fdGl0bGUnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19pdGVtcycpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2xheW91dCcpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2J0bicpKSB7XHIgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpO1xyICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyICAgICAgfVxyICAgIH07XHJcciAgICBldmVudFBvcHVwQ2xvc2UgPSBldmVudFBvcHVwQ2xvc2UuYmluZCh0aGlzKTtcciAgICAvLyDQl9Cw0LrRgNGL0LLQsNC10Lwg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrRgNC10YHRgtC40LpcciAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50UG9wdXBDbG9zZSk7XHJcclxyXHIgICAgY29weUNvbnRlbnRKU0NvZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIC8vdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcciAgICAgICAgLy9yYW5nZS5zZWxlY3ROb2RlKGNvbnRlbnRKU0dlbmVyYXRpb24pO1xyICAgICAgICAvL3dpbmRvdy5nZXRTZWxlY3Rpb24oKS5hZGRSYW5nZShyYW5nZSk7XHIgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24uc2VsZWN0KCk7XHJcciAgICAgICAgdHJ5e1xyICAgICAgICAgICAgY29uc3QgdHh0Q29weSA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XHIgICAgICAgICAgICB2YXIgbXNnID0gdHh0Q29weSA/ICdzdWNjZXNzZnVsJyA6ICd1bnN1Y2Nlc3NmdWwnO1xyICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvcHkgZW1haWwgY29tbWFuZCB3YXMgJyArIG1zZyk7XHIgICAgICAgIH1cciAgICAgICAgY2F0Y2goZSl7XHIgICAgICAgICAgICBjb25zb2xlLmxvZyhg0J7RiNC40LHQutCwINC60L7Qv9C40YDQvtCy0LDQvdC40Y8gJHtlLmVyckxvZ1RvQ29uc29sZX1gKTtcciAgICAgICAgfVxyXHIgICAgICAgIC8vINCh0L3Rj9GC0LjQtSDQstGL0LTQtdC70LXQvdC40Y8gLSDQktCd0JjQnNCQ0J3QmNCVOiDQstGLINC00L7Qu9C20L3RiyDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YxcciAgICAgICAgLy8gcmVtb3ZlUmFuZ2UocmFuZ2UpINC60L7Qs9C00LAg0Y3RgtC+INCy0L7Qt9C80L7QttC90L5cciAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xyXHIgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpO1xyICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyICAgIH0pO1xyXHIgICAgY29weUNvbnRlbnRKU0NvZGUuZGlzYWJsZWQgPSAhZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkKCdjb3B5Jyk7XHJ9KTtcciIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgcmVuZGVyV2lkZ2V0cyA9IGZ1bmN0aW9uKGNpdHlJZCkge1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtID0gW107XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxMSxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xMSdcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDEyLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTEyJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMTMsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMTMnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxNCxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xNCdcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDE1LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE1J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMTYsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMTYnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxNyxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xNydcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDE4LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE4J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMTksXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMTknXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTEnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAyLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTInXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAzLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTMnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiA0LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTQnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiA1LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTUnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiA2LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTYnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiA3LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTcnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiA4LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTgnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiA5LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTknXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAyMSxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0yMSdcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDIyLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTIyJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMjMsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMjMnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAyNCxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0yNCdcclxuICB9KTtcclxuICBjb25zdCBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmlwdHMnKTtcclxuICBpZiAoc2NyaXB0cykge1xyXG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgc2NyaXB0LnNyYyA9ICcvL3BoYXNlLm93bS5pby90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLTIuMC5qcyc7XHJcbiAgICBzY3JpcHRzLnRleHRDb250ZW50ID0gJyc7XHJcbiAgICBzY3JpcHRzLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyV2lkZ2V0cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyDQnNC+0LTRg9C70Ywg0LTQuNGB0L/QtdGC0YfQtdGAINC00LvRjyDQvtGC0YDQuNGB0L7QstC60Lgg0LHQsNC90L3QtdGA0YDQvtCyINC90LAg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1XHJcbmltcG9ydCBDaXRpZXMgZnJvbSAnLi9jaXRpZXMnO1xyXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCc7XHJcblxyXG5jb25zdCBzZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcbmNvbnN0IGJ0blJlbmRlcldpZGdldHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwZW5kLXNjcmlwdHMnKTtcclxuY29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JpcHRzJyk7XHJcbi8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcclxuY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbmNvbnN0IGNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXRpZXMnKTtcclxuXHJcbmNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbm9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuXHJcbnNlYXJjaENpdHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICBjb25zdCBvYmpDaXRpZXMgPSBuZXcgQ2l0aWVzKGNpdHlOYW1lLCBjaXRpZXMpO1xyXG4gIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxufSk7XHJcbiIsIi8qISBodHRwOi8vbXRocy5iZS9mcm9tY29kZXBvaW50IHYwLjIuMSBieSBAbWF0aGlhcyAqL1xuaWYgKCFTdHJpbmcuZnJvbUNvZGVQb2ludCkge1xuXHQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gSUUgOCBvbmx5IHN1cHBvcnRzIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG9uIERPTSBlbGVtZW50c1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIG9iamVjdCA9IHt9O1xuXHRcdFx0XHR2YXIgJGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gJGRlZmluZVByb3BlcnR5KG9iamVjdCwgb2JqZWN0LCBvYmplY3QpICYmICRkZWZpbmVQcm9wZXJ0eTtcblx0XHRcdH0gY2F0Y2goZXJyb3IpIHt9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0oKSk7XG5cdFx0dmFyIHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cdFx0dmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblx0XHR2YXIgZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRcdHZhciBNQVhfU0laRSA9IDB4NDAwMDtcblx0XHRcdHZhciBjb2RlVW5pdHMgPSBbXTtcblx0XHRcdHZhciBoaWdoU3Vycm9nYXRlO1xuXHRcdFx0dmFyIGxvd1N1cnJvZ2F0ZTtcblx0XHRcdHZhciBpbmRleCA9IC0xO1xuXHRcdFx0dmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFx0XHRpZiAoIWxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0XHR3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHRcdFx0XHR2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0IWlzRmluaXRlKGNvZGVQb2ludCkgfHwgLy8gYE5hTmAsIGArSW5maW5pdHlgLCBvciBgLUluZmluaXR5YFxuXHRcdFx0XHRcdGNvZGVQb2ludCA8IDAgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHRcdFx0Y29kZVBvaW50ID4gMHgxMEZGRkYgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHRcdFx0Zmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQgLy8gbm90IGFuIGludGVnZXJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29kZVBvaW50IDw9IDB4RkZGRikgeyAvLyBCTVAgY29kZSBwb2ludFxuXHRcdFx0XHRcdGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXG5cdFx0XHRcdFx0Ly8gaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdFx0XHRjb2RlUG9pbnQgLT0gMHgxMDAwMDtcblx0XHRcdFx0XHRoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG5cdFx0XHRcdFx0bG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcblx0XHRcdFx0XHRjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpbmRleCArIDEgPT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xuXHRcdFx0XHRcdHJlc3VsdCArPSBzdHJpbmdGcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcblx0XHRcdFx0XHRjb2RlVW5pdHMubGVuZ3RoID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuXHRcdFx0ZGVmaW5lUHJvcGVydHkoU3RyaW5nLCAnZnJvbUNvZGVQb2ludCcsIHtcblx0XHRcdFx0J3ZhbHVlJzogZnJvbUNvZGVQb2ludCxcblx0XHRcdFx0J2NvbmZpZ3VyYWJsZSc6IHRydWUsXG5cdFx0XHRcdCd3cml0YWJsZSc6IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRTdHJpbmcuZnJvbUNvZGVQb2ludCA9IGZyb21Db2RlUG9pbnQ7XG5cdFx0fVxuXHR9KCkpO1xufVxuIiwiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjEuMFxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHIgPSByZXF1aXJlO1xuICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHVuZGVmaW5lZDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICBpZiAoX3N0YXRlKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IF9hcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlc29sdmVkIHdpdGggdGhlXG4gIHBhc3NlZCBgdmFsdWVgLiBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3Jlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBQRU5ESU5HID0gdm9pZCAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgPSAyO1xuXG52YXIgR0VUX1RIRU5fRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbihwcm9taXNlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBHRVRfVEhFTl9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgdHJ5IHtcbiAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgYXNhcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICB2YXIgZXJyb3IgPSB0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfVxuICB9LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQgPT09IEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoZW4kJCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0aGVuJCQpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBzZWxmRnVsZmlsbG1lbnQoKSk7XG4gIH0gZWxzZSBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBnZXRUaGVuKHZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcblxuICBhc2FwKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9zdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBfc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBFcnJvck9iamVjdCgpIHtcbiAgdGhpcy5lcnJvciA9IG51bGw7XG59XG5cbnZhciBUUllfQ0FUQ0hfRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICByZXR1cm4gVFJZX0NBVENIX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkLFxuICAgICAgc3VjY2VlZGVkID0gdW5kZWZpbmVkLFxuICAgICAgZmFpbGVkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHZhbHVlID0gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICB2YWx1ZS5lcnJvciA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gIH1cblxuICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIF9yZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGlvbkVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgdmFyIF9pbnB1dCA9IHRoaXMuX2lucHV0O1xuXG4gIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lYWNoRW50cnkoX2lucHV0W2ldLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIChlbnRyeSwgaSkge1xuICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gIHZhciByZXNvbHZlJCQgPSBjLnJlc29sdmU7XG5cbiAgaWYgKHJlc29sdmUkJCA9PT0gcmVzb2x2ZSkge1xuICAgIHZhciBfdGhlbiA9IGdldFRoZW4oZW50cnkpO1xuXG4gICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XG4gICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKG5vb3ApO1xuICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24gKHJlc29sdmUkJCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSQkKGVudHJ5KTtcbiAgICAgIH0pLCBpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUkJChlbnRyeSksIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gKHN0YXRlLCBpLCB2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gKHByb21pc2UsIGkpIHtcbiAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gIHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KFJFSkVDVEVELCBpLCByZWFzb24pO1xuICB9KTtcbn07XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbChlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvcih0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIHRoaXNbUFJPTUlTRV9JRF0gPSBuZXh0SWQoKTtcbiAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaWYgKG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gIH1cbn1cblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLnJhY2UgPSByYWNlO1xuUHJvbWlzZS5yZXNvbHZlID0gcmVzb2x2ZTtcblByb21pc2UucmVqZWN0ID0gcmVqZWN0O1xuUHJvbWlzZS5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZS5fc2V0QXNhcCA9IHNldEFzYXA7XG5Qcm9taXNlLl9hc2FwID0gYXNhcDtcblxuUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQcm9taXNlLFxuXG4gIC8qKlxuICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIENoYWluaW5nXG4gICAgLS0tLS0tLS1cbiAgXG4gICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgfSk7XG4gIFxuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgIH0pO1xuICAgIGBgYFxuICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBc3NpbWlsYXRpb25cbiAgICAtLS0tLS0tLS0tLS1cbiAgXG4gICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgU2ltcGxlIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgcmVzdWx0O1xuICBcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgYXV0aG9yLCBib29rcztcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICBcbiAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgXG4gICAgfVxuICBcbiAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRBdXRob3IoKS5cbiAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgdGhlblxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICB0aGVuOiB0aGVuLFxuXG4gIC8qKlxuICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBcbiAgICBgYGBqc1xuICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgIH1cbiAgXG4gICAgLy8gc3luY2hyb25vdXNcbiAgICB0cnkge1xuICAgICAgZmluZEF1dGhvcigpO1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH1cbiAgXG4gICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCBjYXRjaFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gICdjYXRjaCc6IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgICB2YXIgbG9jYWwgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICBpZiAoUCkge1xuICAgICAgICB2YXIgcHJvbWlzZVRvU3RyaW5nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZS5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuUHJvbWlzZS5Qcm9taXNlID0gUHJvbWlzZTtcblxucmV0dXJuIFByb21pc2U7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczYtcHJvbWlzZS5tYXBcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
