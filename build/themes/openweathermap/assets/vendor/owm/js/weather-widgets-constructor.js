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

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

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

    this.cityName = cityName.value.replace(/(\s)+/g, '-').toLowerCase();
    this.container = container || '';
    this.url = document.location.protocol + '//openweathermap.org/data/2.5/find?q=' + this.cityName + '&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1';

    this.selCitySign = document.createElement('span');
    this.selCitySign.innerText = ' selected ';
    this.selCitySign.class = 'widget-form__selected';

    var objWidget = new _weatherWidget2.default(generateWidget.paramsWidget, generateWidget.controlsWidget, generateWidget.urls);

    objWidget.render();
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

      var that = this;
      tableCities.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.tagName.toLowerCase() === 'A'.toLowerCase() && event.target.classList.contains('widget-form__link')) {
          var selectedCity = event.target.parentElement.querySelector('#selectedCity');
          if (!selectedCity) {
            event.target.parentElement.insertBefore(that.selCitySign, event.target.parentElement.children[1]);

            var generateWidget = new _generatorWidget2.default();

            // Подстановка найденого города
            generateWidget.paramsWidget.cityId = event.target.id;
            generateWidget.paramsWidget.cityName = event.target.textContent;
            generateWidget.paramsWidget.units = this.units;
            generateWidget.setInitialStateForm(event.target.id, event.target.textContent);
            window.cityId = event.target.id;
            window.cityName = event.target.textContent;

            var objWidget = new _weatherWidget2.default(generateWidget.paramsWidget, generateWidget.controlsWidget, generateWidget.urls);
            objWidget.render();
          }
        }
      });
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

},{"./generator-widget":6,"./weather-widget":10,"String.fromCodePoint":11,"es6-promise":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Denis on 28.09.2016.
*/

// Работа с датой
var CustomDate = function (_Date) {
  _inherits(CustomDate, _Date);

  function CustomDate() {
    _classCallCheck(this, CustomDate);

    return _possibleConstructorReturn(this, (CustomDate.__proto__ || Object.getPrototypeOf(CustomDate)).apply(this, arguments));
  }

  _createClass(CustomDate, [{
    key: 'numberDaysOfYearXXX',


    /**
    * метод преобразования номера дня в году в трехразрядное число ввиде строки
    * @param  {[integer]} number [число менее 999]
    * @return {[string]}        [трехзначное число ввиде строки порядкового номера дня в году]
    */
    value: function numberDaysOfYearXXX(number) {
      if (number > 365) {
        return false;
      }
      if (number < 10) {
        return '00' + number;
      } else if (number < 100) {
        return '0' + number;
      }
      return number;
    }

    /**
    * Метод определения порядкового номера в году
    * @param  {date} date Дата формата yyyy-mm-dd
    * @return {integer}  Порядковый номер в году
    */

  }, {
    key: 'convertDateToNumberDay',
    value: function convertDateToNumberDay(date) {
      var now = new Date(date);
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start;
      var oneDay = 1000 * 60 * 60 * 24;
      var day = Math.floor(diff / oneDay);
      return now.getFullYear() + '-' + this.numberDaysOfYearXXX(day);
    }

    /**
    * Метод преообразует дату формата yyyy-<number day in year> в yyyy-mm-dd
    * @param  {string} date дата формата yyyy-<number day in year>
    * @return {date} дата формата yyyy-mm-dd
    */

  }, {
    key: 'convertNumberDayToDate',
    value: function convertNumberDayToDate(date) {
      var re = /(\d{4})(-)(\d{3})/;
      var line = re.exec(date);
      var beginyear = new Date(line[1]);
      var unixtime = beginyear.getTime() + line[3] * 1000 * 60 * 60 * 24;
      var res = new Date(unixtime);

      var month = res.getMonth() + 1;
      var days = res.getDate();
      var year = res.getFullYear();
      return (days < 10 ? '0' + days : days) + '.' + (month < 10 ? '0' + month : month) + '.' + year;
    }

    /**
    * Метод преобразования даты вида yyyy-<number day in year>
    * @param  {date1} date дата в формате yyyy-mm-dd
    * @return {string}  дата ввиде строки формата yyyy-<number day in year>
    */

  }, {
    key: 'formatDate',
    value: function formatDate(date1) {
      var date = new Date(date1);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      return year + '-' + (month < 10 ? '0' + month : month) + ' - ' + (day < 10 ? '0' + day : day);
    }

    /**
    * Метод возвращает текущую отформатированную дату yyyy-mm-dd
    * @return {[string]} текущая дата
    */

  }, {
    key: 'getCurrentDate',
    value: function getCurrentDate() {
      var now = new Date();
      return this.formatDate(now);
    }

    // Возвращает последние три месяца

  }, {
    key: 'getDateLastThreeMonth',
    value: function getDateLastThreeMonth() {
      var now = new Date();
      var year = new Date().getFullYear();
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start;
      var oneDay = 1000 * 60 * 60 * 24;
      var day = Math.floor(diff / oneDay);
      day -= 90;
      if (day < 0) {
        year -= 1;
        day = 365 - day;
      }
      return year + '-' + this.numberDaysOfYearXXX(day);
    }

    // Возвращает интервал дат текущего лета

  }, {
    key: 'getCurrentSummerDate',
    value: function getCurrentSummerDate() {
      var year = new Date().getFullYear();
      var dateFr = this.convertDateToNumberDay(year + '-06-01');
      var dateTo = this.convertDateToNumberDay(year + '-08-31');
      return [dateFr, dateTo];
    }

    // Возвращает интервал дат текущего лета

  }, {
    key: 'getCurrentSpringDate',
    value: function getCurrentSpringDate() {
      var year = new Date().getFullYear();
      var dateFr = this.convertDateToNumberDay(year + '-03-01');
      var dateTo = this.convertDateToNumberDay(year + '-05-31');
      return [dateFr, dateTo];
    }

    // Возвращает интервал дат предыдущего лета

  }, {
    key: 'getLastSummerDate',
    value: function getLastSummerDate() {
      var year = new Date().getFullYear() - 1;
      var dateFr = this.convertDateToNumberDay(year + '-06-01');
      var dateTo = this.convertDateToNumberDay(year + '-08-31');
      return [dateFr, dateTo];
    }
  }, {
    key: 'getFirstDateCurYear',
    value: function getFirstDateCurYear() {
      return new Date().getFullYear() + ' - 001';
    }

    /**
    * [timestampToDate unixtime to dd.mm.yyyy hh:mm]
    * @param  {[type]} timestamp [description]
    * @return {string}           [description]
    */

  }, {
    key: 'timestampToDateTime',
    value: function timestampToDateTime(unixtime) {
      var date = new Date(unixtime * 1000);
      return date.toLocaleString();
    }

    /**
    * [timestampToDate unixtime to hh:mm]
    * @param  {[type]} timestamp [description]
    * @return {string}           [description]
    */

  }, {
    key: 'timestampToTime',
    value: function timestampToTime(unixtime) {
      var date = new Date(unixtime * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      return (hours < 10 ? '0' + hours : hours) + ' : ' + (minutes < 10 ? '0' + minutes : minutes) + ' ';
    }

    /**
    * Возращение номера дня в неделе по unixtime timestamp
    * @param unixtime
    * @returns {number}
    */

  }, {
    key: 'getNumberDayInWeekByUnixTime',
    value: function getNumberDayInWeekByUnixTime(unixtime) {
      var date = new Date(unixtime * 1000);
      return date.getDay();
    }

    /** Вернуть наименование дня недели
    * @param dayNumber
    * @returns {string}
    */

  }, {
    key: 'getDayNameOfWeekByDayNumber',
    value: function getDayNameOfWeekByDayNumber(dayNumber) {
      var days = {
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat'
      };
      return days[dayNumber];
    }

    /**
     * Вернуть Наименование месяца по его номеру
     * @param numMonth
     * @returns {*}
     */

  }, {
    key: 'getMonthNameByMonthNumber',
    value: function getMonthNameByMonthNumber(numMonth) {

      if (typeof numMonth !== "number" || numMonth <= 0 && numMonth >= 12) {
        return null;
      }

      var monthName = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec"
      };

      return monthName[numMonth];
    }

    /** Сравнение даты в формате dd.mm.yyyy = dd.mm.yyyy с текущим днем
    *
    */

  }, {
    key: 'compareDatesWithToday',
    value: function compareDatesWithToday(date) {
      return date.toLocaleDateString() === new Date().toLocaleDateString();
    }
  }, {
    key: 'convertStringDateMMDDYYYHHToDate',
    value: function convertStringDateMMDDYYYHHToDate(date) {
      var re = /(\d{2})(\.{1})(\d{2})(\.{1})(\d{4})/;
      var resDate = re.exec(date);
      if (resDate.length === 6) {
        return new Date(resDate[5] + '-' + resDate[3] + '-' + resDate[1]);
      }
      // Если дата не распарсена берем текущую
      return new Date();
    }

    /**
     * Возвращает дату в формате HH:MM MonthName NumberDate
     * @returns {string}
     */

  }, {
    key: 'getTimeDateHHMMMonthDay',
    value: function getTimeDateHHMMMonthDay() {
      var date = new Date();
      return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ' ' + this.getMonthNameByMonthNumber(date.getMonth()) + ' ' + date.getDate();
    }
  }]);

  return CustomDate;
}(Date);

exports.default = CustomDate;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Denis on 20.10.2016.
 */
var naturalPhenomenon = exports.naturalPhenomenon = {
    "en": {
        "name": "English",
        "main": "",
        "description": {
            "200": "thunderstorm with light rain",
            "201": "thunderstorm with rain",
            "202": "thunderstorm with heavy rain",
            "210": "light thunderstorm",
            "211": "thunderstorm",
            "212": "heavy thunderstorm",
            "221": "ragged thunderstorm",
            "230": "thunderstorm with light drizzle",
            "231": "thunderstorm with drizzle",
            "232": "thunderstorm with heavy drizzle",
            "300": "light intensity drizzle",
            "301": "drizzle",
            "302": "heavy intensity drizzle",
            "310": "light intensity drizzle rain",
            "311": "drizzle rain",
            "312": "heavy intensity drizzle rain",
            "313": "shower rain and drizzle",
            "314": "heavy shower rain and drizzle",
            "321": "shower drizzle",
            "500": "light rain",
            "501": "moderate rain",
            "502": "heavy intensity rain",
            "503": "very heavy rain",
            "504": "extreme rain",
            "511": "freezing rain",
            "520": "light intensity shower rain",
            "521": "shower rain",
            "522": "heavy intensity shower rain",
            "531": "ragged shower rain",
            "600": "light snow",
            "601": "snow",
            "602": "heavy snow",
            "611": "sleet",
            "612": "shower sleet",
            "615": "light rain and snow",
            "616": "rain and snow",
            "620": "light shower snow",
            "621": "shower snow",
            "622": "heavy shower snow",
            "701": "mist",
            "711": "smoke",
            "721": "haze",
            "731": "sand,dust whirls",
            "741": "fog",
            "751": "sand",
            "761": "dust",
            "762": "volcanic ash",
            "771": "squalls",
            "781": "tornado",
            "800": "clear sky",
            "801": "few clouds",
            "802": "scattered clouds",
            "803": "broken clouds",
            "804": "overcast clouds",
            "900": "tornado",
            "901": "tropical storm",
            "902": "hurricane",
            "903": "cold",
            "904": "hot",
            "905": "windy",
            "906": "hail",
            "950": "setting",
            "951": "calm",
            "952": "light breeze",
            "953": "gentle breeze",
            "954": "moderate breeze",
            "955": "fresh breeze",
            "956": "strong breeze",
            "957": "high wind, near gale",
            "958": "gale",
            "959": "severe gale",
            "960": "storm",
            "961": "violent storm",
            "962": "hurricane"
        }
    },
    "ru": {
        "name": "Russian",
        "main": "",
        "description": {
            "200": "\u0433\u0440\u043E\u0437\u0430 \u0441 \u043C\u0435\u043B\u043A\u0438\u043C \u0434\u043E\u0436\u0434\u0451\u043C",
            "201": "\u0433\u0440\u043E\u0437\u0430 \u0441 \u0434\u043E\u0436\u0434\u0451\u043C",
            "202": "\u0433\u0440\u043E\u0437\u0430 \u0441 \u043F\u0440\u043E\u043B\u0438\u0432\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0451\u043C",
            "210": "\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
            "211": "\u0433\u0440\u043E\u0437\u0430",
            "212": "\u0431\u0443\u0440\u044F",
            "221": "\u0436\u0435\u0441\u0442\u043E\u043A\u0430\u044F \u0433\u0440\u043E\u0437\u0430",
            "230": "\u0433\u0440\u043E\u0437\u0430 \u0441 \u043C\u0435\u043B\u043A\u0438\u043C \u0434\u043E\u0436\u0434\u0451\u043C",
            "231": "\u0433\u0440\u043E\u0437\u0430 \u0441 \u0434\u043E\u0436\u0434\u0451\u043C",
            "232": "\u0433\u0440\u043E\u0437\u0430 \u0441 \u0441\u0438\u043B\u044C\u043D\u044B\u043C \u0434\u043E\u0436\u0434\u0451\u043C",
            "300": "\u0441\u044B\u0440\u043E",
            "301": "\u0441\u044B\u0440\u043E",
            "302": "\u043E\u0447\u0435\u043D\u044C \u0441\u044B\u0440\u043E",
            "310": "\u043B\u0451\u0433\u043A\u0438\u0439 \u0434\u043E\u0436\u0434\u044C",
            "311": "\u043B\u0451\u0433\u043A\u0438\u0439 \u0434\u043E\u0436\u0434\u044C",
            "312": "\u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
            "321": "\u043C\u0435\u043B\u043A\u0438\u0439 \u0434\u043E\u0436\u0434\u044C",
            "500": "\u043B\u0435\u0433\u043A\u0438\u0439 \u0434\u043E\u0436\u0434\u044C",
            "501": "\u0434\u043E\u0436\u0434\u044C",
            "502": "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
            "503": "\u043F\u0440\u043E\u043B\u0438\u0432\u043D\u043E\u0439 \u0434\u043E\u0436\u0434\u044C",
            "504": "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
            "511": "\u0445\u043E\u043B\u043E\u0434\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
            "520": "\u0434\u043E\u0436\u0434\u044C",
            "521": "\u0434\u043E\u0436\u0434\u044C",
            "522": "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0434\u043E\u0436\u0434\u044C",
            "600": "\u043D\u0435\u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
            "601": "\u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
            "602": "\u0441\u0438\u043B\u044C\u043D\u044B\u0439 \u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
            "611": "\u0441\u043B\u044F\u043A\u043E\u0442\u044C",
            "621": "\u0441\u043D\u0435\u0433\u043E\u043F\u0430\u0434",
            "701": "\u0442\u0443\u043C\u0430\u043D",
            "711": "\u0442\u0443\u043C\u0430\u043D\u043D\u043E",
            "721": "\u0442\u0443\u043C\u0430\u043D\u043D\u043E",
            "731": "\u043F\u0435\u0441\u0447\u0430\u043D\u0430\u044F \u0431\u0443\u0440\u044F",
            "741": "\u0442\u0443\u043C\u0430\u043D\u043D\u043E",
            "800": "\u044F\u0441\u043D\u043E",
            "801": "\u043E\u0431\u043B\u0430\u0447\u043D\u043E",
            "802": "\u0441\u043B\u0435\u0433\u043A\u0430 \u043E\u0431\u043B\u0430\u0447\u043D\u043E",
            "803": "\u043F\u0430\u0441\u043C\u0443\u0440\u043D\u043E",
            "804": "\u043F\u0430\u0441\u043C\u0443\u0440\u043D\u043E",
            "900": "\u0442\u043E\u0440\u043D\u0430\u0434\u043E",
            "901": "\u0442\u0440\u043E\u043F\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0431\u0443\u0440\u044F",
            "902": "\u0443\u0440\u0430\u0433\u0430\u043D",
            "903": "\u0445\u043E\u043B\u043E\u0434\u043D\u043E",
            "904": "\u0436\u0430\u0440\u0430",
            "905": "\u0432\u0435\u0442\u0440\u0435\u043D\u043D\u043E",
            "906": "\u0433\u0440\u0430\u0434",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "it": {
        "name": "Italian",
        "main": "",
        "description": {
            "200": "temporale con pioggerella",
            "201": "temporale con pioggia",
            "202": "temporale con pioggia forte",
            "210": "temporale",
            "211": "temporale",
            "212": "temporale forte",
            "221": "temporale",
            "230": "temporale con pioggerella",
            "231": "temporale con pioggerella",
            "232": "temporale con pioggerella",
            "300": "pioggerella",
            "301": "pioggerella",
            "302": "pioggerella",
            "310": "pioggerella",
            "311": "pioggerella",
            "312": "forte pioggerella",
            "321": "acquazzone",
            "500": "pioggia leggera",
            "501": "pioggia moderata",
            "502": "forte pioggia",
            "503": "pioggia fortissima",
            "504": "pioggia estrema",
            "511": "pioggia gelata",
            "520": "pioggerella",
            "521": "acquazzone",
            "522": "acquazzone",
            "600": "neve",
            "601": "neve",
            "602": "forte nevicata",
            "611": "nevischio",
            "621": "forte nevicata",
            "701": "foschia",
            "711": "fumo",
            "721": "foschia",
            "731": "mulinelli di sabbia\/polvere",
            "741": "nebbia",
            "800": "cielo sereno",
            "801": "poche nuvole",
            "802": "nubi sparse",
            "803": "nubi sparse",
            "804": "cielo coperto",
            "900": "tornado",
            "901": "tempesta tropicale",
            "902": "uragano",
            "903": "freddo",
            "904": "caldo",
            "905": "ventoso",
            "906": "grandine",
            "950": "Setting",
            "951": "Calmo",
            "952": "Bava di vento",
            "953": "Brezza leggera",
            "954": "Brezza tesa",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Tempesta",
            "961": "Tempesta violenta",
            "962": "Uragano"
        }
    },
    "sp": {
        "name": "Spanish",
        "main": "",
        "description": {
            "200": "tormenta con lluvia ligera",
            "201": "tormenta con lluvia",
            "202": "tormenta con lluvia intensa",
            "210": "ligera tormenta",
            "211": "tormenta",
            "212": "fuerte tormenta",
            "221": "tormenta irregular",
            "230": "tormenta con llovizna ligera",
            "231": "tormenta con llovizna",
            "232": "tormenta con llovizna intensa",
            "300": "llovizna ligera",
            "301": "llovizna",
            "302": "llovizna de gran intensidad",
            "310": "lluvia y llovizna ligera",
            "311": "lluvia y llovizna",
            "312": "lluvia y llovizna de gran intensidad",
            "321": "chubasco",
            "500": "lluvia ligera",
            "501": "lluvia moderada",
            "502": "lluvia de gran intensidad",
            "503": "lluvia muy fuerte",
            "504": "lluvia muy fuerte",
            "511": "lluvia helada",
            "520": "chubasco de ligera intensidad",
            "521": "chubasco",
            "522": "chubasco de gran intensidad",
            "600": "nevada ligera",
            "601": "nieve",
            "602": "nevada intensa",
            "611": "aguanieve",
            "621": "chubasco de nieve",
            "701": "niebla",
            "711": "humo",
            "721": "niebla",
            "731": "torbellinos de arena\/polvo",
            "741": "bruma",
            "800": "cielo claro",
            "801": "algo de nubes",
            "802": "nubes dispersas",
            "803": "nubes rotas",
            "804": "nubes",
            "900": "tornado",
            "901": "tormenta tropical",
            "902": "hurac\xE1n",
            "903": "fr\xEDo",
            "904": "calor",
            "905": "ventoso",
            "906": "granizo",
            "950": "Setting",
            "951": "calma",
            "952": "Viento flojo",
            "953": "Viento suave",
            "954": "Viento moderado",
            "955": "Brisa",
            "956": "Viento fuerte",
            "957": "Viento fuerte, pr\xF3ximo a vendaval",
            "958": "Vendaval",
            "959": "Vendaval fuerte",
            "960": "Tempestad",
            "961": "Tempestad violenta",
            "962": "Hurac\xE1n"
        }
    },
    "ua": {
        "name": "Ukrainian",
        "main": "",
        "description": {
            "200": "\u0433\u0440\u043E\u0437\u0430 \u0437 \u043B\u0435\u0433\u043A\u0438\u043C \u0434\u043E\u0449\u0435\u043C",
            "201": "\u0433\u0440\u043E\u0437\u0430 \u0437 \u0434\u043E\u0449\u0435\u043C",
            "202": "\u0433\u0440\u043E\u0437\u0430 \u0437\u0456 \u0437\u043B\u0438\u0432\u043E\u044E",
            "210": "\u043B\u0435\u0433\u043A\u0430 \u0433\u0440\u043E\u0437\u0430",
            "211": "\u0433\u0440\u043E\u0437\u0430",
            "212": "\u0441\u0438\u043B\u044C\u043D\u0430 \u0433\u0440\u043E\u0437\u0430",
            "221": "\u043A\u043E\u0440\u043E\u0442\u043A\u043E\u0447\u0430\u0441\u043D\u0456 \u0433\u0440\u043E\u0437\u0438",
            "230": "\u0433\u0440\u043E\u0437\u0430 \u0437 \u0434\u0440\u0456\u0431\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C",
            "231": "\u0433\u0440\u043E\u0437\u0430 \u0437 \u0434\u043E\u0449\u0435\u043C",
            "232": "\u0433\u0440\u043E\u0437\u0430 \u0437 \u0441\u0438\u043B\u044C\u043D\u0438\u043C \u0434\u0440\u0456\u0431\u043D\u0438\u043C \u0434\u043E\u0449\u0435\u043C",
            "300": "\u043B\u0435\u0433\u043A\u0430 \u043C\u0440\u044F\u043A\u0430",
            "301": "\u043C\u0440\u044F\u043A\u0430",
            "302": "\u0441\u0438\u043B\u044C\u043D\u0430 \u043C\u0440\u044F\u043A\u0430",
            "310": "\u043B\u0435\u0433\u043A\u0438\u0439 \u0434\u0440\u0456\u0431\u043D\u0438\u0439 \u0434\u043E\u0449",
            "311": "\u0434\u0440\u0456\u0431\u043D\u0438\u0439 \u0434\u043E\u0449",
            "312": "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u0440\u0456\u0431\u043D\u0438\u0439 \u0434\u043E\u0449",
            "321": "\u0434\u0440\u0456\u0431\u043D\u0438\u0439 \u0434\u043E\u0449",
            "500": "\u043B\u0435\u0433\u043A\u0430 \u0437\u043B\u0438\u0432\u0430",
            "501": "\u043F\u043E\u043C\u0456\u0440\u043D\u0438\u0439 \u0434\u043E\u0449",
            "502": "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0434\u043E\u0449",
            "503": "\u0441\u0438\u043B\u044C\u043D\u0430 \u0437\u043B\u0438\u0432\u0430",
            "504": "\u0437\u043B\u0438\u0432\u0430",
            "511": "\u043A\u0440\u0438\u0436\u0430\u043D\u0438\u0439 \u0434\u043E\u0449",
            "520": "\u0434\u043E\u0449",
            "521": "\u0434\u043E\u0449",
            "522": "\u0441\u0438\u043B\u044C\u043D\u0430 \u0437\u043B\u0438\u0432\u0430",
            "600": "\u043B\u0435\u0433\u043A\u0438\u0439 \u0441\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
            "601": "\u0441\u043D\u0456\u0433 ",
            "602": "\u0441\u0438\u043B\u044C\u043D\u0438\u0439 \u0441\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
            "611": "\u043C\u043E\u043A\u0440\u0438\u0439 \u0441\u043D\u0456\u0433",
            "621": "\u0441\u043D\u0456\u0433\u043E\u043F\u0430\u0434",
            "701": "\u0442\u0443\u043C\u0430\u043D",
            "711": "\u0442\u0443\u043C\u0430\u043D",
            "721": "\u0441\u0435\u0440\u043F\u0430\u043D\u043E\u043A",
            "731": "\u043F\u0456\u0449\u0430\u043D\u0430 \u0437\u0430\u043C\u0435\u0442\u0456\u043B\u044C",
            "741": "\u0442\u0443\u043C\u0430\u043D",
            "800": "\u0447\u0438\u0441\u0442\u0435 \u043D\u0435\u0431\u043E",
            "801": "\u0442\u0440\u043E\u0445\u0438 \u0445\u043C\u0430\u0440\u043D\u043E",
            "802": "\u0440\u043E\u0437\u0456\u0440\u0432\u0430\u043D\u0456 \u0445\u043C\u0430\u0440\u0438",
            "803": "\u0445\u043C\u0430\u0440\u043D\u043E",
            "804": "\u0445\u043C\u0430\u0440\u043D\u043E",
            "900": "\u0442\u043E\u0440\u043D\u0430\u0434\u043E",
            "901": "\u0442\u0440\u043E\u043F\u0456\u0447\u043D\u0430 \u0431\u0443\u0440\u044F",
            "902": "\u0431\u0443\u0440\u0435\u0432\u0456\u0439",
            "903": "\u0445\u043E\u043B\u043E\u0434\u043D\u043E",
            "904": "\u0441\u043F\u0435\u043A\u0430",
            "905": "\u0432\u0456\u0442\u0440\u044F\u043D\u043E",
            "906": "\u0433\u0440\u0430\u0434",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "de": {
        "name": "German",
        "main": "",
        "description": {
            "200": "Gewitter mit leichtem Regen",
            "201": "Gewitter mit Regen",
            "202": "Gewitter mit starkem Regen",
            "210": "leichte Gewitter",
            "211": "Gewitter",
            "212": "schwere Gewitter",
            "221": "einige Gewitter",
            "230": "Gewitter mit leichtem Nieselregen",
            "231": "Gewitter mit Nieselregen",
            "232": "Gewitter mit starkem Nieselregen",
            "300": "leichtes Nieseln",
            "301": "Nieseln",
            "302": "starkes Nieseln",
            "310": "leichter Nieselregen",
            "311": "Nieselregen",
            "312": "starker Nieselregen",
            "321": "Nieselschauer",
            "500": "leichter Regen",
            "501": "m\xE4\xDFiger Regen",
            "502": "sehr starker Regen",
            "503": "sehr starker Regen",
            "504": "Starkregen",
            "511": "Eisregen",
            "520": "leichte Regenschauer",
            "521": "Regenschauer",
            "522": "heftige Regenschauer",
            "600": "m\xE4\xDFiger Schnee",
            "601": "Schnee",
            "602": "heftiger Schneefall",
            "611": "Graupel",
            "621": "Schneeschauer",
            "701": "tr\xFCb",
            "711": "Rauch",
            "721": "Dunst",
            "731": "Sand \/ Staubsturm",
            "741": "Nebel",
            "800": "klarer Himmel",
            "801": "ein paar Wolken",
            "802": "\xFCberwiegend bew\xF6lkt",
            "803": "\xFCberwiegend bew\xF6lkt",
            "804": "wolkenbedeckt",
            "900": "Tornado",
            "901": "Tropensturm",
            "902": "Hurrikan",
            "903": "kalt",
            "904": "hei\xDF",
            "905": "windig",
            "906": "Hagel",
            "950": "Setting",
            "951": "Windstille",
            "952": "Leichte Brise",
            "953": "Milde Brise",
            "954": "M\xE4\xDFige Brise",
            "955": "Frische Brise",
            "956": "Starke Brise",
            "957": "Hochwind, ann\xE4hender Sturm",
            "958": "Sturm",
            "959": "Schwerer Sturm",
            "960": "Gewitter",
            "961": "Heftiges Gewitter",
            "962": "Orkan"
        }
    },
    "pt": {
        "name": "Portuguese",
        "main": "",
        "description": {
            "200": "trovoada com chuva leve",
            "201": "trovoada com chuva",
            "202": "trovoada com chuva forte",
            "210": "trovoada leve",
            "211": "trovoada",
            "212": "trovoada pesada",
            "221": "trovoada irregular",
            "230": "trovoada com garoa fraca",
            "231": "trovoada com garoa",
            "232": "trovoada com garoa pesada",
            "300": "garoa fraca",
            "301": "garoa",
            "302": "garoa intensa",
            "310": "chuva leve",
            "311": "chuva fraca",
            "312": "chuva forte",
            "321": "chuva de garoa",
            "500": "chuva fraca",
            "501": "Chuva moderada",
            "502": "chuva de intensidade pesado",
            "503": "chuva muito forte",
            "504": "Chuva Forte",
            "511": "chuva com congelamento",
            "520": "chuva moderada",
            "521": "chuva",
            "522": "chuva de intensidade pesada",
            "600": "Neve branda",
            "601": "neve",
            "602": "Neve pesada",
            "611": "chuva com neve",
            "621": "banho de neve",
            "701": "N\xE9voa",
            "711": "fuma\xE7a",
            "721": "neblina",
            "731": "turbilh\xF5es de areia/poeira",
            "741": "Neblina",
            "800": "c\xE9u claro",
            "801": "Algumas nuvens",
            "802": "nuvens dispersas",
            "803": "nuvens quebrados",
            "804": "tempo nublado",
            "900": "tornado",
            "901": "tempestade tropical",
            "902": "furac\xE3o",
            "903": "frio",
            "904": "quente",
            "905": "com vento",
            "906": "granizo",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "ro": {
        "name": "Romanian",
        "main": "",
        "description": {
            "200": "furtun\u0103 cu ploaie u\u0219oar\u0103",
            "201": "furtun\u0103",
            "202": "furtun\u0103 cu ploaie puternic\u0103",
            "210": "furtun\u0103 u\u0219oar\u0103",
            "211": "furtun\u0103",
            "212": "furtun\u0103 puternic\u0103",
            "221": "furtun\u0103 aprig\u0103",
            "230": "furtun\u0103 cu burni\u021B\u0103",
            "231": "furtun\u0103 cu burni\u021B\u0103",
            "232": "furtun\u0103 cu burni\u021B\u0103",
            "300": "burni\u021B\u0103 de intensitate joas\u0103",
            "301": "burni\u021B\u0103",
            "302": "burni\u021B\u0103 de intensitate mare",
            "310": "burni\u021B\u0103 de intensitate joas\u0103",
            "311": "burni\u021B\u0103",
            "312": "burni\u021B\u0103 de intensitate mare",
            "321": "burni\u021B\u0103",
            "500": "ploaie u\u0219oar\u0103",
            "501": "ploaie",
            "502": "ploaie puternic\u0103",
            "503": "ploaie toren\u021Bial\u0103 ",
            "504": "ploaie extrem\u0103",
            "511": "ploaie \xEEnghe\u021Bat\u0103",
            "520": "ploaie de scurt\u0103 durat\u0103",
            "521": "ploaie de scurt\u0103 durat\u0103",
            "522": "ploaie de scurt\u0103 durat\u0103",
            "600": "ninsoare u\u0219oar\u0103",
            "601": "ninsoare",
            "602": "ninsoare puternic\u0103",
            "611": "lapovi\u021B\u0103",
            "621": "ninsoare de scurt\u0103 durat\u0103",
            "701": "cea\u021B\u0103",
            "711": "cea\u021B\u0103",
            "721": "cea\u021B\u0103",
            "731": "v\xE2rtejuri de nisip",
            "741": "cea\u021B\u0103",
            "800": "cer senin",
            "801": "c\xE2\u021Biva nori",
            "802": "nori \xEEmpr\u0103\u0219tia\u021Bi",
            "803": "cer fragmentat",
            "804": "cer acoperit de nori",
            "900": "tornad\u0103",
            "901": "furtuna tropical\u0103",
            "902": "uragan",
            "903": "rece",
            "904": "fierbinte",
            "905": "vant puternic",
            "906": "grindin\u0103",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "pl": {
        "name": "Polish",
        "main": "",
        "description": {
            "200": "Burza z lekkimi opadami deszczu",
            "201": "Burza z opadami deszczu",
            "202": "Burza z intensywnymi opadami deszczu",
            "210": "Lekka burza",
            "211": "Burza",
            "212": "Silna burza",
            "221": "Burza",
            "230": "Burza z lekk\u0105 m\u017Cawk\u0105",
            "231": "Burza z m\u017Cawka",
            "232": "Burza z intensywn\u0105 m\u017Cawk\u0105",
            "300": "Lekka m\u017Cawka",
            "301": "M\u017Cawka",
            "302": "Intensywna m\u017Cawka",
            "310": "Lekkie opady drobnego deszczu",
            "311": "Deszcz / m\u017Cawka",
            "312": "Intensywny deszcz / m\u017Cawka",
            "321": "Silna m\u017Cawka",
            "500": "Lekki deszcz",
            "501": "Umiarkowany deszcz",
            "502": "Intensywny deszcz",
            "503": "bardzo silny deszcz",
            "504": "Ulewa",
            "511": "Marzn\u0105cy deszcz",
            "520": "Kr\xF3tka ulewa",
            "521": "Deszcz",
            "522": "Intensywny, lekki deszcz",
            "600": "Lekkie opady \u015Bniegu",
            "601": "\u015Anieg",
            "602": "Mocne opady \u015Bniegu",
            "611": "Deszcz ze \u015Bniegem",
            "621": "\u015Anie\u017Cyca",
            "701": "Mgie\u0142ka",
            "711": "Smog",
            "721": "Zamglenia",
            "731": "Zamie\u0107 piaskowa",
            "741": "Mg\u0142a",
            "800": "Bezchmurnie",
            "801": "Lekkie zachmurzenie",
            "802": "Rozproszone chmury",
            "803": "Pochmurno z przeja\u015Bnieniami",
            "804": "Pochmurno",
            "900": "tornado",
            "901": "burza tropikalna",
            "902": "Huragan",
            "903": "Ch\u0142odno",
            "904": "Gor\u0105co",
            "905": "wietrznie",
            "906": "Grad",
            "950": "Setting",
            "951": "Spokojnie",
            "952": "Lekka bryza",
            "953": "Delikatna bryza",
            "954": "Umiarkowana bryza",
            "955": "\u015Awie\u017Ca bryza",
            "956": "Silna bryza",
            "957": "Prawie wichura",
            "958": "Wichura",
            "959": "Silna wichura",
            "960": "Sztorm",
            "961": "Gwa\u0142towny sztorm",
            "962": "Huragan"
        }
    },
    "fi": {
        "name": "Finnish",
        "main": "",
        "description": {
            "200": "ukkosmyrsky ja kevyt sade",
            "201": "ukkosmyrsky ja sade",
            "202": "ukkosmyrsky ja kova sade",
            "210": "pieni ukkosmyrsky",
            "211": "ukkosmyrsky",
            "212": "kova ukkosmyrsky",
            "221": "liev\xE4 ukkosmyrsky",
            "230": "ukkosmyrsky ja kevyt tihkusade",
            "231": "ukkosmyrsky ja tihkusade",
            "232": "ukkosmyrsky ja kova tihkusade",
            "300": "liev\xE4 tihuttainen",
            "301": "tihuttaa",
            "302": "kova tihuttainen",
            "310": "liev\xE4 tihkusade",
            "311": "tihkusade",
            "312": "kova tihkusade",
            "321": "tihkusade",
            "500": "pieni sade",
            "501": "kohtalainen sade",
            "502": "kova sade",
            "503": "eritt\xE4in runsasta sadetta",
            "504": "kova sade",
            "511": "j\xE4\xE4t\xE4v\xE4 sade",
            "520": "liev\xE4 tihkusade",
            "521": "tihkusade",
            "522": "kova sade",
            "600": "pieni lumisade",
            "601": "lumi",
            "602": "paljon lunta",
            "611": "r\xE4nt\xE4",
            "621": "lumikuuro",
            "701": "sumu",
            "711": "savu",
            "721": "sumu",
            "731": "hiekka/p\xF6ly py\xF6rre",
            "741": "sumu",
            "800": "taivas on selke\xE4",
            "801": "v\xE4h\xE4n pilvi\xE4",
            "802": "ajoittaisia pilvi\xE4",
            "803": "hajanaisia pilvi\xE4",
            "804": "pilvinen",
            "900": "tornado",
            "901": "trooppinen myrsky",
            "902": "hirmumyrsky",
            "903": "kylm\xE4",
            "904": "kuuma",
            "905": "tuulinen",
            "906": "rakeita",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "nl": {
        "name": "Dutch",
        "main": "",
        "description": {
            "200": "onweersbui met lichte regen",
            "201": "onweersbui met regen",
            "202": "onweersbui met zware regenval",
            "210": "lichte onweersbui",
            "211": "onweersbui",
            "212": "zware onweersbui",
            "221": "onregelmatig onweersbui",
            "230": "onweersbui met lichte motregen",
            "231": "onweersbui met motregen",
            "232": "onweersbui met zware motregen",
            "300": "lichte motregen",
            "301": "motregen",
            "302": "zware motregen",
            "310": "lichte motregen\/regen",
            "311": "motregen",
            "312": "zware motregen\/regen",
            "321": "zware motregen",
            "500": "lichte regen",
            "501": "matige regen",
            "502": "zware regenval",
            "503": "zeer zware regenval",
            "504": "extreme regen",
            "511": "Koude buien",
            "520": "lichte stortregen",
            "521": "stortregen",
            "522": "zware stortregen",
            "600": "lichte sneeuw",
            "601": "sneeuw",
            "602": "hevige sneeuw",
            "611": "ijzel",
            "621": "natte sneeuw",
            "701": "mist",
            "711": "mist",
            "721": "nevel",
            "731": "zand\/stof werveling",
            "741": "mist",
            "800": "onbewolkt",
            "801": "licht bewolkt",
            "802": "half bewolkt",
            "803": "zwaar bewolkt",
            "804": "geheel bewolkt",
            "900": "tornado",
            "901": "tropische storm",
            "902": "orkaan",
            "903": "koud",
            "904": "heet",
            "905": "stormachtig",
            "906": "hagel",
            "950": "Windstil",
            "951": "Kalm",
            "952": "Lichte bries",
            "953": "Zachte bries",
            "954": "Matige bries",
            "955": "Vrij krachtige wind",
            "956": "Krachtige wind",
            "957": "Harde wind",
            "958": "Stormachtig",
            "959": "Storm",
            "960": "Zware storm",
            "961": "Zeer zware storm",
            "962": "Orkaan"
        }
    },
    "fr": {
        "name": "French",
        "main": "",
        "description": {
            "200": "orage et pluie fine",
            "201": "orage et pluie",
            "202": "orage et fortes pluies",
            "210": "orages l\xE9gers",
            "211": "orages",
            "212": "gros orages",
            "221": "orages \xE9parses",
            "230": "Orage avec l\xE9g\xE8re bruine",
            "231": "orages \xE9parses",
            "232": "gros orage",
            "300": "Bruine l\xE9g\xE8re",
            "301": "Bruine",
            "302": "Fortes bruines",
            "310": "Pluie fine \xE9parse",
            "311": "pluie fine",
            "312": "Crachin intense",
            "321": "Averses de bruine",
            "500": "l\xE9g\xE8res pluies",
            "501": "pluies mod\xE9r\xE9es",
            "502": "Fortes pluies",
            "503": "tr\xE8s fortes pr\xE9cipitations",
            "504": "grosses pluies",
            "511": "pluie vergla\xE7ante",
            "520": "petites averses",
            "521": "averses de pluie",
            "522": "averses intenses",
            "600": "l\xE9g\xE8res neiges",
            "601": "neige",
            "602": "fortes chutes de neige",
            "611": "neige fondue",
            "621": "averses de neige",
            "701": "brume",
            "711": "Brouillard",
            "721": "brume",
            "731": "temp\xEAtes de sable",
            "741": "brouillard",
            "800": "ensoleill\xE9",
            "801": "peu nuageux",
            "802": "partiellement ensoleill\xE9",
            "803": "nuageux",
            "804": "Couvert",
            "900": "tornade",
            "901": "temp\xEAte tropicale",
            "902": "ouragan",
            "903": "froid",
            "904": "chaud",
            "905": "venteux",
            "906": "gr\xEAle",
            "950": "Setting",
            "951": "Calme",
            "952": "Brise l\xE9g\xE8re",
            "953": "Brise douce",
            "954": "Brise mod\xE9r\xE9e",
            "955": "Brise fraiche",
            "956": "Brise forte",
            "957": "Vent fort, presque violent",
            "958": "Vent violent",
            "959": "Vent tr\xE8s violent",
            "960": "Temp\xEAte",
            "961": "emp\xEAte violente",
            "962": "Ouragan"
        }
    },
    "bg": {
        "name": "Bulgarian",
        "main": "",
        "description": {
            "200": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F \u0441\u044A\u0441 \u0441\u043B\u0430\u0431 \u0434\u044A\u0436\u0434",
            "201": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F \u0441 \u0432\u0430\u043B\u0435\u0436",
            "202": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F \u0441 \u043F\u043E\u0440\u043E\u0439",
            "210": "\u0421\u043B\u0430\u0431\u0430 \u0433\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F",
            "211": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F",
            "212": "\u0421\u0438\u043B\u043D\u0430 \u0433\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F",
            "221": "\u0420\u0430\u0437\u043A\u044A\u0441\u0430\u043D\u0430 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0441\u0442",
            "230": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F \u0441\u044A\u0441 \u0441\u043B\u0430\u0431 \u0440\u044A\u043C\u0435\u0436",
            "231": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F \u0441 \u0440\u044A\u043C\u0435\u0436",
            "232": "\u0413\u0440\u044A\u043C\u043E\u0442\u0435\u0432\u0438\u0447\u043D\u0430 \u0431\u0443\u0440\u044F \u0441\u044A\u0441 \u0441\u0438\u043B\u0435\u043D \u0440\u044A\u043C\u0435\u0436",
            "300": "\u0421\u043B\u0430\u0431 \u0440\u044A\u043C\u0435\u0436",
            "301": "\u0420\u044A\u043C\u0438",
            "302": "\u0421\u0438\u043B\u0435\u043D \u0440\u044A\u043C\u0435\u0436",
            "310": "\u0421\u043B\u0430\u0431 \u0434\u044A\u0436\u0434",
            "311": "\u0420\u044A\u043C\u044F\u0449 \u0434\u044A\u0436\u0434",
            "312": "\u0421\u0438\u043B\u0435\u043D \u0440\u044A\u043C\u0435\u0436",
            "321": "\u0421\u0438\u043B\u0435\u043D \u0440\u044A\u043C\u0435\u0436",
            "500": "\u0421\u043B\u0430\u0431 \u0434\u044A\u0436\u0434",
            "501": "\u0423\u043C\u0435\u0440\u0435\u043D \u0434\u044A\u0436\u0434",
            "502": "\u0421\u0438\u043B\u0435\u043D \u0434\u044A\u0436\u0434",
            "503": "\u041C\u043D\u043E\u0433\u043E \u0441\u0438\u043B\u0435\u043D \u0432\u0430\u043B\u0435\u0436",
            "504": "\u0421\u0438\u043B\u0435\u043D \u0434\u044A\u0436\u0434",
            "511": "\u0414\u044A\u0436\u0434 \u0441\u044A\u0441 \u0441\u0442\u0443\u0434",
            "520": "\u0421\u043B\u0430\u0431 \u0434\u044A\u0436\u0434",
            "521": "\u041E\u0431\u0438\u043B\u0435\u043D \u0434\u044A\u0436\u0434",
            "522": "\u041F\u043E\u0440\u043E\u0439",
            "600": "\u0421\u043B\u0430\u0431 \u0441\u043D\u0435\u0433\u043E\u0432\u0430\u043B\u0435\u0436",
            "601": "\u0421\u043D\u0435\u0433\u043E\u0432\u0430\u043B\u0435\u0436",
            "602": "\u0421\u0438\u043B\u0435\u043D \u0441\u043D\u0435\u0433\u043E\u0432\u0430\u043B\u0435\u0436",
            "611": "\u0418\u0437\u043D\u0435\u043D\u0430\u0434\u0432\u0430\u0449 \u0432\u0430\u043B\u0435\u0436",
            "621": "\u041E\u0431\u0438\u043B\u0435\u043D \u0441\u043D\u0435\u0433\u043E\u0432\u0430\u043B\u0435\u0436",
            "701": "\u041C\u044A\u0433\u043B\u0430",
            "711": "\u0414\u0438\u043C",
            "721": "\u041D\u0438\u0441\u043A\u0430 \u043C\u044A\u0433\u043B\u0430",
            "731": "\u041F\u044F\u0441\u044A\u0447\u043D\u0430/\u041F\u0440\u0430\u0448\u043D\u0430 \u0431\u0443\u0440\u044F",
            "741": "\u041C\u044A\u0433\u043B\u0430",
            "800": "\u042F\u0441\u043D\u043E \u043D\u0435\u0431\u0435",
            "801": "\u041D\u0438\u0441\u043A\u0430 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0441\u0442",
            "802": "\u0420\u0430\u0437\u043A\u044A\u0441\u0430\u043D\u0430 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0441\u0442",
            "803": "\u0420\u0430\u0437\u0441\u0435\u044F\u043D\u0430 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0441\u0442",
            "804": "\u0422\u044A\u043C\u043D\u0438 \u043E\u0431\u043B\u0430\u0446\u0438",
            "900": "\u0422\u043E\u0440\u043D\u0430\u0434\u043E/\u0423\u0440\u0430\u0433\u0430\u043D",
            "901": "\u0422\u0440\u043E\u043F\u0438\u0447\u0435\u0441\u043A\u0430 \u0431\u0443\u0440\u044F",
            "902": "\u0423\u0440\u0430\u0433\u0430\u043D",
            "903": "\u0421\u0442\u0443\u0434\u0435\u043D\u043E",
            "904": "\u0413\u043E\u0440\u0435\u0449\u043E \u0432\u0440\u0435\u043C\u0435",
            "905": "\u0412\u0435\u0442\u0440\u043E\u0432\u0438\u0442\u043E",
            "906": "\u0413\u0440\u0430\u0434",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "se": {
        "name": "Swedish",
        "main": "",
        "description": {
            "200": "\xE5skov\xE4der",
            "201": "\xE5skov\xE4der",
            "202": "fullt \xE5skov\xE4der",
            "210": "\xE5ska",
            "211": "\xE5skov\xE4der",
            "212": "\xE5ska",
            "221": "oj\xE4mnt ov\xE4der",
            "230": "\xE5skov\xE4der",
            "231": "\xE5skov\xE4der",
            "232": "fullt \xE5skov\xE4der",
            "300": "mjukt duggregn",
            "301": "duggregn",
            "302": "h\xE5rt duggregn",
            "310": "mjukt regn",
            "311": "regn",
            "312": "h\xE5rt regn",
            "321": "duggregn",
            "500": "mjukt regn",
            "501": "M\xE5ttlig regn",
            "502": "h\xE5rt regn",
            "503": "mycket kraftigt regn",
            "504": "\xF6sregn",
            "511": "underkylt regn",
            "520": "mjukt \xF6sregn",
            "521": "dusch-regn",
            "522": "regnar sm\xE5spik",
            "600": "mjuk sn\xF6",
            "601": "sn\xF6",
            "602": "kraftigt sn\xF6fall",
            "611": "sn\xF6blandat regn",
            "621": "sn\xF6ov\xE4der",
            "701": "dimma",
            "711": "smogg",
            "721": "dis",
            "731": "sandstorm",
            "741": "dimmigt",
            "800": "klar himmel",
            "801": "n\xE5gra moln",
            "802": "spridda moln",
            "803": "molnigt",
            "804": "\xF6verskuggande moln",
            "900": "storm",
            "901": "tropisk storm",
            "902": "orkan",
            "903": "kallt",
            "904": "varmt",
            "905": "bl\xE5sigt",
            "906": "hagel",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "zh_tw": {
        "name": "Chinese Traditional",
        "main": "",
        "description": {
            "200": "\u96F7\u9663\u96E8",
            "201": "\u96F7\u9663\u96E8",
            "202": "\u96F7\u9663\u96E8",
            "210": "\u96F7\u9663\u96E8",
            "211": "\u96F7\u9663\u96E8",
            "212": "\u96F7\u9663\u96E8",
            "221": "\u96F7\u9663\u96E8",
            "230": "\u96F7\u9663\u96E8",
            "231": "\u96F7\u9663\u96E8",
            "232": "\u96F7\u9663\u96E8",
            "300": "\u5C0F\u96E8",
            "301": "\u5C0F\u96E8",
            "302": "\u5927\u96E8",
            "310": "\u5C0F\u96E8",
            "311": "\u5C0F\u96E8",
            "312": "\u5927\u96E8",
            "321": "\u9663\u96E8",
            "500": "\u5C0F\u96E8",
            "501": "\u4E2D\u96E8",
            "502": "\u5927\u96E8",
            "503": "\u5927\u96E8",
            "504": "\u66B4\u96E8",
            "511": "\u51CD\u96E8",
            "520": "\u9663\u96E8",
            "521": "\u9663\u96E8",
            "522": "\u5927\u96E8",
            "600": "\u5C0F\u96EA",
            "601": "\u96EA",
            "602": "\u5927\u96EA",
            "611": "\u96E8\u593E\u96EA",
            "621": "\u9663\u96EA",
            "701": "\u8584\u9727",
            "711": "\u7159\u9727",
            "721": "\u8584\u9727",
            "731": "\u6C99\u65CB\u98A8",
            "741": "\u5927\u9727",
            "800": "\u6674",
            "801": "\u6674\uFF0C\u5C11\u96F2",
            "802": "\u591A\u96F2",
            "803": "\u591A\u96F2",
            "804": "\u9670\uFF0C\u591A\u96F2",
            "900": "\u9F8D\u6372\u98A8",
            "901": "\u71B1\u5E36\u98A8\u66B4",
            "902": "\u98B6\u98A8",
            "903": "\u51B7",
            "904": "\u71B1",
            "905": "\u5927\u98A8",
            "906": "\u51B0\u96F9",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "tr": {
        "name": "Turkish",
        "main": "",
        "description": {
            "200": "G\xF6k g\xFCr\xFClt\xFCl\xFC hafif ya\u011Fmurlu",
            "201": "G\xF6k g\xFCr\xFClt\xFCl\xFC ya\u011Fmurlu",
            "202": "G\xF6k g\xFCr\xFClt\xFCl\xFC sa\u011Fanak ya\u011F\u0131\u015Fl\u0131",
            "210": "Hafif sa\u011Fanak",
            "211": "Sa\u011Fanak",
            "212": "\u015Eiddetli sa\u011Fanak",
            "221": "Aral\u0131kl\u0131 sa\u011Fanak",
            "230": "G\xF6k g\xFCr\xFClt\xFCl\xFC hafif ya\u011F\u0131\u015Fl\u0131",
            "231": "G\xF6k g\xFCr\xFClt\xFCl\xFC ya\u011F\u0131\u015Fl\u0131",
            "232": "G\xF6k g\xFCr\xFClt\xFCl\xFC \u015Fiddetli ya\u011F\u0131\u015Fl\u0131",
            "300": "Yer yer hafif yo\u011Funluklu ya\u011F\u0131\u015F",
            "301": "Yer yer ya\u011F\u0131\u015Fl\u0131",
            "302": "Yer yer yo\u011Fun ya\u011F\u0131\u015Fl\u0131",
            "310": "Yer yer hafif ya\u011F\u0131\u015Fl\u0131",
            "311": "Yer yer ya\u011F\u0131\u015Fl\u0131",
            "312": "Yer yer yo\u011Fun ya\u011F\u0131\u015Fl\u0131",
            "321": "Yer yer sa\u011Fanak ya\u011F\u0131\u015Fl\u0131",
            "500": "Hafif ya\u011Fmur",
            "501": "Orta \u015Fiddetli ya\u011Fmur",
            "502": "\u015Eiddetli ya\u011Fmur",
            "503": "\xC7ok \u015Fiddetli ya\u011Fmur",
            "504": "A\u015F\u0131r\u0131 ya\u011Fmur",
            "511": "Ya\u011F\u0131\u015Fl\u0131 ve so\u011Fuk hava",
            "520": "K\u0131sa s\xFCreli hafif yo\u011Funluklu ya\u011Fmur",
            "521": "K\u0131sa s\xFCreli ya\u011Fmur",
            "522": "K\u0131sa s\xFCreli \u015Fiddetli ya\u011Fmur",
            "600": "Hafif kar ya\u011F\u0131\u015Fl\u0131",
            "601": "Kar ya\u011F\u0131\u015Fl\u0131",
            "602": "Yo\u011Fun kar ya\u011F\u0131\u015Fl\u0131",
            "611": "Karla kar\u0131\u015F\u0131k ya\u011Fmurlu",
            "621": "K\u0131sa s\xFCrel\xFC kar ya\u011F\u0131\u015F\u0131",
            "701": "Sisli",
            "711": "Sisli",
            "721": "Hafif sisli",
            "731": "Kum/Toz f\u0131rt\u0131nas\u0131",
            "741": "Sisli",
            "800": "A\xE7\u0131k",
            "801": "Az bulutlu",
            "802": "Par\xE7al\u0131 az bulutlu",
            "803": "Par\xE7al\u0131 bulutlu",
            "804": "Kapal\u0131",
            "900": "Kas\u0131rga",
            "901": "Tropik f\u0131rt\u0131na",
            "902": "Hortum",
            "903": "\xC7ok So\u011Fuk",
            "904": "\xC7ok S\u0131cak",
            "905": "R\xFCzgarl\u0131",
            "906": "Dolu ya\u011F\u0131\u015F\u0131",
            "950": "Durgun",
            "951": "Sakin",
            "952": "Hafif R\xFCzgarl\u0131",
            "953": "Az R\xFCzgarl\u0131",
            "954": "Orta Seviye R\xFCzgarl\u0131",
            "955": "R\xFCzgarl\u0131",
            "956": "Kuvvetli R\xFCzgar",
            "957": "Sert R\xFCzgar",
            "958": "F\u0131rt\u0131na",
            "959": "\u015Eiddetli F\u0131rt\u0131na",
            "960": "Kas\u0131rga",
            "961": "\u015Eiddetli Kas\u0131rga",
            "962": "\xC7ok \u015Eiddetli Kas\u0131rga"
        }
    },
    "zh_cn": {
        "name": "Chinese Simplified",
        "main": "",
        "description": {
            "200": "\u96F7\u9635\u96E8",
            "201": "\u96F7\u9635\u96E8",
            "202": "\u96F7\u9635\u96E8",
            "210": "\u96F7\u9635\u96E8",
            "211": "\u96F7\u9635\u96E8",
            "212": "\u96F7\u9635\u96E8",
            "221": "\u96F7\u9635\u96E8",
            "230": "\u96F7\u9635\u96E8",
            "231": "\u96F7\u9635\u96E8",
            "232": "\u96F7\u9635\u96E8",
            "300": "\u5C0F\u96E8",
            "301": "\u5C0F\u96E8",
            "302": "\u5927\u96E8",
            "310": "\u5C0F\u96E8",
            "311": "\u5C0F\u96E8",
            "312": "\u5927\u96E8",
            "321": "\u9635\u96E8",
            "500": "\u5C0F\u96E8",
            "501": "\u4E2D\u96E8",
            "502": "\u5927\u96E8",
            "503": "\u5927\u96E8",
            "504": "\u66B4\u96E8",
            "511": "\u51BB\u96E8",
            "520": "\u9635\u96E8",
            "521": "\u9635\u96E8",
            "522": "\u5927\u96E8",
            "600": "\u5C0F\u96EA",
            "601": "\u96EA",
            "602": "\u5927\u96EA",
            "611": "\u96E8\u5939\u96EA",
            "621": "\u9635\u96EA",
            "701": "\u8584\u96FE",
            "711": "\u70DF\u96FE",
            "721": "\u8584\u96FE",
            "731": "\u6C99\u65CB\u98CE",
            "741": "\u5927\u96FE",
            "800": "\u6674",
            "801": "\u6674\uFF0C\u5C11\u4E91",
            "802": "\u591A\u4E91",
            "803": "\u591A\u4E91",
            "804": "\u9634\uFF0C\u591A\u4E91",
            "900": "\u9F99\u5377\u98CE",
            "901": "\u70ED\u5E26\u98CE\u66B4",
            "902": "\u98D3\u98CE",
            "903": "\u51B7",
            "904": "\u70ED",
            "905": "\u5927\u98CE",
            "906": "\u51B0\u96F9",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "cz": {
        "name": "Czech",
        "main": "",
        "description": {
            "200": "bou\u0159ka se slab\xFDm de\u0161t\u011Bm",
            "201": "bou\u0159ka a d\xE9\u0161\u0165",
            "202": "bou\u0159ka se siln\xFDm de\u0161t\u011Bm",
            "210": "slab\u0161\xED bou\u0159ka",
            "211": "bou\u0159ka",
            "212": "siln\xE1 bou\u0159ka",
            "221": "bou\u0159kov\xE1 p\u0159eh\xE1\u0148ka",
            "230": "bou\u0159ka se slab\xFDm mrholen\xEDm",
            "231": "bou\u0159ka s mrholen\xEDm",
            "232": "bou\u0159ka se siln\xFDm mrholen\xEDm",
            "300": "slab\xE9 mrholen\xED",
            "301": "mrholen\xED",
            "302": "siln\xE9 mrholen\xED",
            "310": "slab\xE9 mrholen\xED a d\xE9\u0161\u0165",
            "311": "mrholen\xED s de\u0161t\u011Bm",
            "312": "siln\xE9 mrholen\xED a d\xE9\u0161\u0165",
            "313": "mrholen\xED a p\u0159eh\xE1\u0148ky",
            "314": "mrholen\xED a siln\xE9 p\u0159eh\xE1\u0148ky",
            "321": "ob\u010Dasn\xE9 mrholen\xED",
            "500": "slab\xFD d\xE9\u0161\u0165",
            "501": "d\xE9\u0161\u0165",
            "502": "prudk\xFD d\xE9\u0161\u0165",
            "503": "p\u0159\xEDvalov\xFD d\xE9\u0161\u0165",
            "504": "pr\u016Ftr\u017E mra\u010Den",
            "511": "mrznouc\xED d\xE9\u0161\u0165",
            "520": "slab\xE9 p\u0159eh\xE1\u0148ky",
            "521": "p\u0159eh\xE1\u0148ky",
            "522": "siln\xE9 p\u0159eh\xE1\u0148ky",
            "531": "ob\u010Dasn\xE9 p\u0159eh\xE1\u0148ky",
            "600": "m\xEDrn\xE9 sn\u011B\u017Een\xED",
            "601": "sn\u011B\u017Een\xED",
            "602": "hust\xE9 sn\u011B\u017Een\xED",
            "611": "zmrzl\xFD d\xE9\u0161\u0165",
            "612": "sm\xED\u0161en\xE9 p\u0159eh\xE1\u0148ky",
            "615": "slab\xFD d\xE9\u0161\u0165 se sn\u011Bhem",
            "616": "d\xE9\u0161\u0165 se sn\u011Bhem",
            "620": "slab\xE9 sn\u011Bhov\xE9 p\u0159eh\xE1\u0148ky",
            "621": "sn\u011Bhov\xE9 p\u0159eh\xE1\u0148ky",
            "622": "siln\xE9 sn\u011Bhov\xE9 p\u0159eh\xE1\u0148ky",
            "701": "mlha",
            "711": "kou\u0159",
            "721": "opar",
            "731": "p\xEDse\u010Dn\xE9 \u010Di prachov\xE9 v\xEDry",
            "741": "hust\xE1 mlha",
            "751": "p\xEDsek",
            "761": "pra\u0161no",
            "762": "sope\u010Dn\xFD popel",
            "771": "prudk\xE9 bou\u0159e",
            "781": "torn\xE1do",
            "800": "jasno",
            "801": "skoro jasno",
            "802": "polojasno",
            "803": "obla\u010Dno",
            "804": "zata\u017Eeno",
            "900": "torn\xE1do",
            "901": "tropick\xE1 bou\u0159e",
            "902": "hurik\xE1n",
            "903": "zima",
            "904": "horko",
            "905": "v\u011Btrno",
            "906": "krupobit\xED",
            "950": "bezv\u011Bt\u0159\xED",
            "951": "v\xE1nek",
            "952": "v\u011Bt\u0159\xEDk",
            "953": "slab\xFD v\xEDtr",
            "954": "m\xEDrn\xFD v\xEDtr",
            "955": "\u010Derstv\xFD v\xEDtr",
            "956": "siln\xFD v\xEDtr",
            "957": "prudk\xFD v\xEDtr",
            "958": "bou\u0159liv\xFD v\xEDtr",
            "959": "vich\u0159ice",
            "960": "siln\xE1 vich\u0159ice",
            "961": "mohutn\xE1 vich\u0159ice",
            "962": "ork\xE1n"
        }
    },
    "kr": {
        "name": "Korea",
        "main": "",
        "description": {
            "200": "thunderstorm with light rain",
            "201": "thunderstorm with rain",
            "202": "thunderstorm with heavy rain",
            "210": "light thunderstorm",
            "211": "thunderstorm",
            "212": "heavy thunderstorm",
            "221": "ragged thunderstorm",
            "230": "thunderstorm with light drizzle",
            "231": "thunderstorm with drizzle",
            "232": "thunderstorm with heavy drizzle",
            "300": "light intensity drizzle",
            "301": "drizzle",
            "302": "heavy intensity drizzle",
            "310": "light intensity drizzle rain",
            "311": "drizzle rain",
            "312": "heavy intensity drizzle rain",
            "321": "shower drizzle",
            "500": "light rain",
            "501": "moderate rain",
            "502": "heavy intensity rain",
            "503": "very heavy rain",
            "504": "extreme rain",
            "511": "freezing rain",
            "520": "light intensity shower rain",
            "521": "shower rain",
            "522": "heavy intensity shower rain",
            "600": "light snow",
            "601": "snow",
            "602": "heavy snow",
            "611": "sleet",
            "621": "shower snow",
            "701": "mist",
            "711": "smoke",
            "721": "haze",
            "731": "sand\/dust whirls",
            "741": "fog",
            "800": "sky is clear",
            "801": "few clouds",
            "802": "scattered clouds",
            "803": "broken clouds",
            "804": "overcast clouds",
            "900": "tornado",
            "901": "tropical storm",
            "902": "hurricane",
            "903": "cold",
            "904": "hot",
            "905": "windy",
            "906": "hail",
            "950": "Setting",
            "951": "Calm",
            "952": "Light breeze",
            "953": "Gentle Breeze",
            "954": "Moderate breeze",
            "955": "Fresh Breeze",
            "956": "Strong breeze",
            "957": "High wind, near gale",
            "958": "Gale",
            "959": "Severe Gale",
            "960": "Storm",
            "961": "Violent Storm",
            "962": "Hurricane"
        }
    },
    "gl": {
        "name": "Galician",
        "main": "",
        "description": {
            "200": "tormenta el\xE9ctrica con choiva lixeira",
            "201": "tormenta el\xE9ctrica con choiva",
            "202": "tormenta el\xE9ctrica con choiva intensa",
            "210": "tormenta el\xE9ctrica lixeira",
            "211": "tormenta el\xE9ctrica",
            "212": "tormenta el\xE9ctrica forte",
            "221": "tormenta el\xE9ctrica irregular",
            "230": "tormenta el\xE9ctrica con orballo lixeiro",
            "231": "tormenta el\xE9ctrica con orballo",
            "232": "tormenta el\xE9ctrica con orballo intenso",
            "300": "orballo lixeiro",
            "301": "orballo",
            "302": "orballo de gran intensidade",
            "310": "choiva e orballo lixeiro",
            "311": "choiva e orballo",
            "312": "choiva e orballo de gran intensidade",
            "321": "orballo de ducha",
            "500": "choiva lixeira",
            "501": "choiva moderada",
            "502": "choiva de gran intensidade",
            "503": "choiva moi forte",
            "504": "choiva extrema",
            "511": "choiva xeada",
            "520": "choiva de ducha de baixa intensidade",
            "521": "choiva de ducha",
            "522": "choiva de ducha de gran intensidade",
            "600": "nevada lixeira",
            "601": "neve",
            "602": "nevada intensa",
            "611": "auganeve",
            "621": "neve de ducha",
            "701": "n\xE9boa",
            "711": "fume",
            "721": "n\xE9boa lixeira",
            "731": "remui\xF1os de area e polvo",
            "741": "bruma",
            "800": "ceo claro",
            "801": "algo de nubes",
            "802": "nubes dispersas",
            "803": "nubes rotas",
            "804": "nubes",
            "900": "tornado",
            "901": "tormenta tropical",
            "902": "furac\xE1n",
            "903": "fr\xEDo",
            "904": "calor",
            "905": "ventoso",
            "906": "sarabia",
            "951": "calma",
            "952": "Vento frouxo",
            "953": "Vento suave",
            "954": "Vento moderado",
            "955": "Brisa",
            "956": "Vento forte",
            "957": "Vento forte, pr\xF3ximo a vendaval",
            "958": "Vendaval",
            "959": "Vendaval forte",
            "960": "Tempestade",
            "961": "Tempestade violenta",
            "962": "Furac\xE1n"
        }
    },
    "vi": {
        "name": "vietnamese",
        "main": "",
        "description": {
            "200": "Gi\xF4ng b\xE3o v\xE0 M\u01B0a nh\u1EB9",
            "201": "Gi\xF4ng b\xE3o v\xE0 M\u01B0a",
            "202": "Gi\xF4ng b\xE3o M\u01B0a l\u1EDBn",
            "210": "Gi\xF4ng b\xE3o c\xF3 ch\u1EDBp gi\u1EADt",
            "211": "B\xE3o",
            "212": "Gi\xF4ng b\xE3o l\u1EDBn",
            "221": "B\xE3o v\xE0i n\u01A1i",
            "230": "Gi\xF4ng b\xE3o v\xE0 M\u01B0a ph\xF9n nh\u1EB9",
            "231": "Gi\xF4ng b\xE3o v\u1EDBi m\u01B0a ph\xF9n",
            "232": "Gi\xF4ng b\xE3o v\u1EDBi m\u01B0a ph\xF9n n\u1EB7ng",
            "300": "\xE1nh s\xE1ng c\u01B0\u1EDDng \u0111\u1ED9 m\u01B0a ph\xF9n",
            "301": "m\u01B0a ph\xF9n",
            "302": "m\u01B0a ph\xF9n c\u01B0\u1EDDng \u0111\u1ED9 n\u1EB7ng",
            "310": "m\u01B0a ph\xF9n nh\u1EB9",
            "311": "m\u01B0a v\xE0 m\u01B0a ph\xF9n",
            "312": "m\u01B0a v\xE0 m\u01B0a ph\xF9n n\u1EB7ng",
            "321": "m\u01B0a r\xE0o v\xE0 m\u01B0a ph\xF9n",
            "500": "m\u01B0a nh\u1EB9",
            "501": "m\u01B0a v\u1EEBa",
            "502": "m\u01B0a c\u01B0\u1EDDng \u0111\u1ED9 n\u1EB7ng",
            "503": "m\u01B0a r\u1EA5t n\u1EB7ng",
            "504": "m\u01B0a l\u1ED1c",
            "511": "m\u01B0a l\u1EA1nh",
            "520": "m\u01B0a r\xE0o nh\u1EB9",
            "521": "m\u01B0a r\xE0o",
            "522": "m\u01B0a r\xE0o c\u01B0\u1EDDng \u0111\u1ED9 n\u1EB7ng",
            "600": "tuy\u1EBFt r\u01A1i nh\u1EB9",
            "601": "tuy\u1EBFt",
            "602": "tuy\u1EBFt n\u1EB7ng h\u1EA1t",
            "611": "m\u01B0a \u0111\xE1",
            "621": "tuy\u1EBFt m\xF9 tr\u1EDDi",
            "701": "s\u01B0\u01A1ng m\u1EDD",
            "711": "kh\xF3i b\u1EE5i",
            "721": "\u0111\xE1m m\xE2y",
            "731": "b\xE3o c\xE1t v\xE0 l\u1ED1c xo\xE1y",
            "741": "s\u01B0\u01A1ng m\xF9",
            "800": "b\u1EA7u tr\u1EDDi quang \u0111\xE3ng",
            "801": "m\xE2y th\u01B0a",
            "802": "m\xE2y r\u1EA3i r\xE1c",
            "803": "m\xE2y c\u1EE5m",
            "804": "m\xE2y \u0111en u \xE1m",
            "900": "l\u1ED1c xo\xE1y",
            "901": "c\u01A1n b\xE3o nhi\u1EC7t \u0111\u1EDBi",
            "902": "b\xE3o l\u1ED1c",
            "903": "l\u1EA1nh",
            "904": "n\xF3ng",
            "905": "gi\xF3",
            "906": "m\u01B0a \u0111\xE1",
            "950": "Ch\u1EBF \u0111\u1ECD",
            "951": "Nh\u1EB9 nh\xE0ng",
            "952": "\xC1nh s\xE1ng nh\u1EB9",
            "953": "G\xEDo tho\u1EA3ng",
            "954": "Gi\xF3 nh\u1EB9",
            "955": "Gi\xF3 v\u1EEBa ph\u1EA3i",
            "956": "Gi\xF3 m\u1EA1nh",
            "957": "Gi\xF3 xo\xE1y",
            "958": "L\u1ED1c xo\xE1y",
            "959": "L\u1ED1c xo\xE1y n\u1EB7ng",
            "960": "B\xE3o",
            "961": "B\xE3o c\u1EA5p l\u1EDBn",
            "962": "B\xE3o l\u1ED1c"
        }
    },
    "ar": {
        "name": "Arabic",
        "main": "",
        "description": {
            "200": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u0645\u0639 \u0623\u0645\u0637\u0627\u0631 \u062E\u0641\u064A\u0641\u0629",
            "201": "\u0627\u0644\u0639\u0648\u0627\u0635\u0641 \u0631\u0639\u062F\u064A\u0629 \u0645\u0639 \u0627\u0644\u0645\u0637\u0631",
            "202": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u0645\u0639 \u0627\u0645\u0637\u0627\u0631 \u063A\u0632\u064A\u0631\u0629",
            "210": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u062E\u0641\u064A\u0641\u0629",
            "211": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629",
            "212": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u062B\u0642\u064A\u0644\u0629",
            "221": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u062E\u0634\u0646\u0629",
            "230": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u0645\u0639 \u0631\u0630\u0627\u0630 \u062E\u0641\u064A\u0641",
            "231": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u0645\u0639 \u0631\u0630\u0627\u0630",
            "232": "\u0639\u0627\u0635\u0641\u0629 \u0631\u0639\u062F\u064A\u0629 \u0645\u0639 \u0631\u0630\u0627\u0630 \u063A\u0632\u064A\u0631\u0629",
            "300": "\u0631\u0630\u0627\u0630 \u062E\u0641\u064A\u0641 \u0627\u0644\u0643\u062B\u0627\u0641\u0629",
            "301": "\u0631\u0630\u0627\u0630",
            "302": "\u0631\u0630\u0627\u0630 \u0634\u062F\u064A\u062F \u0627\u0644\u0643\u062B\u0627\u0641\u0629",
            "310": "\u0631\u0630\u0627\u0630 \u0645\u0637\u0631 \u062E\u0641\u064A\u0641 \u0627\u0644\u0643\u062B\u0627\u0641\u0629",
            "311": "\u0631\u0630\u0627\u0630 \u0645\u0637\u0631",
            "312": "\u0631\u0630\u0627\u0630 \u0645\u0637\u0631 \u0634\u062F\u064A\u062F \u0627\u0644\u0643\u062B\u0627\u0641\u0629",
            "321": "\u0648\u0627\u0628\u0644 \u0631\u0630\u0627\u0630",
            "500": "\u0645\u0637\u0631 \u062E\u0641\u064A\u0641",
            "501": "\u0645\u0637\u0631 \u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u063A\u0632\u0627\u0631\u0629",
            "502": "\u0645\u0637\u0631 \u063A\u0632\u064A\u0631",
            "503": "\u0645\u0637\u0631 \u0634\u062F\u064A\u062F \u0627\u0644\u063A\u0632\u0627\u0631\u0629",
            "504": "\u0645\u0637\u0631 \u0639\u0627\u0644\u064A \u0627\u0644\u063A\u0632\u0627\u0631\u0629",
            "511": "\u0645\u0637\u0631 \u0628\u0631\u062F",
            "520": "\u0648\u0627\u0628\u0644 \u0645\u0637\u0631 \u062E\u0641\u064A\u0641",
            "521": "\u0648\u0627\u0628\u0644 \u0645\u0637\u0631",
            "522": "\u0648\u0627\u0628\u0644 \u0645\u0637\u0631 \u0634\u062F\u064A\u062F \u0627\u0644\u0643\u062B\u0627\u0641\u0629",
            "600": "\u062B\u0644\u0648\u062C \u062E\u0641\u064A\u0641\u0647",
            "601": "\u062B\u0644\u0648\u062C",
            "602": "\u062B\u0644\u0648\u062C \u0642\u0648\u064A\u0629",
            "611": "\u0635\u0642\u064A\u0639",
            "621": "\u0648\u0627\u0628\u0644 \u062B\u0644\u0648\u062C",
            "701": "\u0636\u0628\u0627\u0628",
            "711": "\u062F\u062E\u0627\u0646",
            "721": "\u063A\u064A\u0648\u0645",
            "731": "\u063A\u0628\u0627\u0631",
            "741": "\u063A\u064A\u0645",
            "800": "\u0633\u0645\u0627\u0621 \u0635\u0627\u0641\u064A\u0629",
            "801": "\u063A\u0627\u0626\u0645 \u062C\u0632\u0626",
            "802": "\u063A\u064A\u0648\u0645 \u0645\u062A\u0641\u0631\u0642\u0629",
            "803": "\u063A\u064A\u0648\u0645 \u0645\u062A\u0646\u0627\u062B\u0631\u0647",
            "804": "\u063A\u064A\u0648\u0645 \u0642\u0627\u062A\u0645\u0629",
            "900": "\u0625\u0639\u0635\u0627\u0631",
            "901": "\u0639\u0627\u0635\u0641\u0629 \u0627\u0633\u062A\u0648\u0627\u0626\u064A\u0629",
            "902": "\u0632\u0648\u064A\u0639\u0629",
            "903": "\u0628\u0627\u0631\u062F",
            "904": "\u062D\u0627\u0631",
            "905": "\u0631\u064A\u0627\u062D",
            "906": "\u0648\u0627\u0628\u0644",
            "950": "\u0625\u0639\u062F\u0627\u062F",
            "951": "\u0647\u0627\u062F\u0626",
            "952": "\u0646\u0633\u064A\u0645 \u062E\u0641\u064A\u0641",
            "953": "\u0646\u0633\u064A\u0645 \u0644\u0637\u064A\u0641",
            "954": "\u0646\u0633\u064A\u0645 \u0645\u0639\u062A\u062F\u0644",
            "955": "\u0646\u0633\u064A\u0645 \u0639\u0644\u064A\u0644",
            "956": "\u0646\u0633\u064A\u0645 \u0642\u0648\u064A",
            "957": "\u0631\u064A\u0627\u062D \u0642\u0648\u064A\u0629",
            "958": "\u0639\u0627\u0635\u0641",
            "959": "\u0639\u0627\u0635\u0641\u0629 \u0634\u062F\u064A\u062F\u0629",
            "960": "\u0639\u0627\u0635\u0641\u0629",
            "961": "\u0639\u0627\u0635\u0641\u0629 \u0639\u0646\u064A\u0641\u0629",
            "962": "\u0625\u0639\u0635\u0627\u0631"
        }
    },
    "mk": {
        "name": "Macedonian",
        "main": "",
        "description": {
            "200": "\u0433\u0440\u043C\u0435\u0436\u0438 \u0441\u043E \u0441\u043B\u0430\u0431 \u0434\u043E\u0436\u0434",
            "201": "\u0433\u0440\u043C\u0435\u0436\u0438 \u0441\u043E \u0434\u043E\u0436\u0434",
            "202": "\u0433\u0440\u043C\u0435\u0436\u0438 \u0441\u043E \u0441\u0438\u043B\u0435\u043D \u0434\u043E\u0436\u0434",
            "210": "\u0441\u043B\u0430\u0431\u0438 \u0433\u0440\u043C\u0435\u0436\u0438",
            "211": "\u0433\u0440\u043C\u0435\u0436\u0438",
            "212": "\u0441\u0438\u043B\u043D\u0438 \u0433\u0440\u043C\u0435\u0436\u0438",
            "221": "\u043C\u043D\u043E\u0433\u0443 \u0441\u0438\u043B\u043D\u0438 \u0433\u0440\u043C\u0435\u0436\u0438",
            "230": "\u0433\u0440\u043C\u0435\u0436\u0438 \u0441\u043E \u0441\u043B\u0430\u0431\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "231": "\u0433\u0440\u043C\u0435\u0436\u0438 \u0441\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "232": "\u0433\u0440\u043C\u0435\u0436\u0438 \u0441\u043E \u0441\u0438\u043B\u043D\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "300": "\u0441\u043B\u0430\u0431\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "301": "\u0440\u043E\u0441\u0435\u045A\u0435",
            "302": "\u0441\u0438\u043B\u043D\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "310": "\u0441\u043B\u0430\u0431\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "311": "\u0440\u043E\u0441\u0435\u045A\u0435",
            "312": "\u0441\u0438\u043B\u043D\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "321": "\u0434\u043E\u0436\u0434",
            "500": "\u0441\u043B\u0430\u0431 \u0434\u043E\u0436\u0434",
            "501": "\u0441\u043B\u0430\u0431 \u0434\u043E\u0436\u0434",
            "502": "\u0441\u0438\u043B\u0435\u043D \u0434\u043E\u0436\u0434",
            "503": "\u043C\u043D\u043E\u0433\u0443 \u0441\u0438\u043B\u0435\u043D \u0434\u043E\u0436\u0434",
            "504": "\u043E\u0431\u0438\u043B\u0435\u043D \u0434\u043E\u0436\u0434",
            "511": "\u0433\u0440\u0430\u0434",
            "520": "\u0441\u043B\u0430\u0431\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "521": "\u0440\u043E\u0441\u0438",
            "522": "\u0441\u0438\u043B\u043D\u043E \u0440\u043E\u0441\u0435\u045A\u0435",
            "600": "\u0441\u043B\u0430\u0431 \u0441\u043D\u0435\u0433",
            "601": "\u0441\u043D\u0435\u0433",
            "602": "\u0441\u0438\u043B\u0435\u043D \u0441\u043D\u0435\u0433",
            "611": "\u043B\u0430\u043F\u0430\u0432\u0438\u0446\u0430",
            "621": "\u043B\u0430\u043F\u0430\u0432\u0438\u0446\u0430",
            "701": "\u043C\u0430\u0433\u043B\u0430",
            "711": "\u0441\u043C\u043E\u0433",
            "721": "\u0437\u0430\u043C\u0430\u0433\u043B\u0435\u043D\u043E\u0441\u0442",
            "731": "\u043F\u0435\u0441\u043E\u0447\u0435\u043D \u0432\u0440\u0442\u043B\u043E\u0433",
            "741": "\u043C\u0430\u0433\u043B\u0430",
            "800": "\u0447\u0438\u0441\u0442\u043E \u043D\u0435\u0431\u043E",
            "801": "\u043D\u0435\u043A\u043E\u043B\u043A\u0443 \u043E\u0431\u043B\u0430\u0446\u0438",
            "802": "\u043E\u0434\u0432\u043E\u0435\u043D\u0438 \u043E\u0431\u043B\u0430\u0446\u0438",
            "803": "\u043E\u0431\u043B\u0430\u0446\u0438",
            "804": "\u043E\u0431\u043B\u0430\u0447\u043D\u043E",
            "900": "\u0442\u043E\u0440\u043D\u0430\u0434\u043E",
            "901": "\u0442\u0440\u043E\u043F\u0441\u043A\u0430 \u0431\u0443\u0440\u0430",
            "902": "\u0443\u0440\u0430\u0433\u0430\u043D",
            "903": "\u043B\u0430\u0434\u043D\u043E",
            "904": "\u0442\u043E\u043F\u043B\u043E",
            "905": "\u0432\u0435\u0442\u0440\u043E\u0432\u0438\u0442\u043E",
            "906": "\u0433\u0440\u0430\u0434",
            "950": "\u0417\u0430\u043B\u0435\u0437",
            "951": "\u041C\u0438\u0440\u043D\u043E",
            "952": "\u0421\u043B\u0430\u0431 \u0432\u0435\u0442\u0430\u0440",
            "953": "\u0421\u043B\u0430\u0431 \u0432\u0435\u0442\u0430\u0440",
            "954": "\u0412\u0435\u0442\u0430\u0440",
            "955": "\u0421\u0432\u0435\u0436 \u0432\u0435\u0442\u0430\u0440",
            "956": "\u0421\u0438\u043B\u0435\u043D \u0432\u0435\u0442\u0430\u0440",
            "957": "\u041C\u043D\u043E\u0433\u0443 \u0441\u0438\u043B\u0435\u043D \u0432\u0435\u0442\u0430\u0440",
            "958": "\u041D\u0435\u0432\u0440\u0435\u043C\u0435",
            "959": "\u0421\u0438\u043B\u043D\u043E \u043D\u0435\u0432\u0440\u0435\u043C\u0435",
            "960": "\u0411\u0443\u0440\u0430",
            "961": "\u0421\u0438\u043B\u043D\u0430 \u0431\u0443\u0440\u0430",
            "962": "\u0423\u0440\u0430\u0433\u0430\u043D"
        }
    },
    "sk": {
        "name": "Slovak",
        "main": "",
        "description": {
            "200": "b\xFArka so slab\xFDm da\u017E\u010Fom",
            "201": "b\xFArka s da\u017E\u010Fom",
            "202": "b\xFArka so siln\xFDm da\u017E\u010Fom",
            "210": "mierna b\xFArka",
            "211": "b\xFArka",
            "212": "siln\xE1 b\xFArka",
            "221": "prudk\xE1 b\xFArka",
            "230": "b\xFArka so slab\xFDm mrholen\xEDm",
            "231": "b\xFArka s mrholen\xEDm",
            "232": "b\xFArka so siln\xFDm mrholen\xEDm",
            "300": "slab\xE9 mrholenie",
            "301": "mrholenie",
            "302": "siln\xE9 mrholenie",
            "310": "slab\xE9 pop\u0155chanie",
            "311": "pop\u0155chanie",
            "312": "siln\xE9 pop\u0155chanie",
            "321": "jemn\xE9 mrholenie",
            "500": "slab\xFD d\xE1\u017E\u010F",
            "501": "mierny d\xE1\u017E\u010F",
            "502": "siln\xFD d\xE1\u017E\u010F",
            "503": "ve\u013Emi siln\xFD d\xE1\u017E\u010F",
            "504": "extr\xE9mny d\xE1\u017E\u010F",
            "511": "mrzn\xFAci d\xE1\u017E\u010F",
            "520": "slab\xE1 preh\xE1nka",
            "521": "preh\xE1nka",
            "522": "siln\xE1 preh\xE1nka",
            "600": "slab\xE9 sne\u017Eenie",
            "601": "sne\u017Eenie",
            "602": "siln\xE9 sne\u017Eenie",
            "611": "d\xE1\u017E\u010F so snehom",
            "621": "snehov\xE1 preh\xE1nka",
            "701": "hmla",
            "711": "dym",
            "721": "opar",
            "731": "pieskov\xE9/pra\u0161n\xE9 v\xEDry",
            "741": "hmla",
            "800": "jasn\xE1 obloha",
            "801": "takmer jasno",
            "802": "polojasno",
            "803": "obla\u010Dno",
            "804": "zamra\u010Den\xE9",
            "900": "torn\xE1do",
            "901": "tropick\xE1 b\xFArka",
            "902": "hurik\xE1n",
            "903": "zima",
            "904": "hor\xFAco",
            "905": "veterno",
            "906": "krupobitie",
            "950": "Nastavenie",
            "951": "Bezvetrie",
            "952": "Slab\xFD v\xE1nok",
            "953": "Jemn\xFD vietor",
            "954": "Stredn\xFD vietor",
            "955": "\u010Cerstv\xFD vietor",
            "956": "Siln\xFD vietor",
            "957": "Siln\xFD vietor, takmer v\xEDchrica",
            "958": "V\xEDchrica",
            "959": "Siln\xE1 v\xEDchrica",
            "960": "B\xFArka",
            "961": "Ni\u010Div\xE1 b\xFArka",
            "962": "Hurik\xE1n"
        }
    },
    "hu": {
        "name": "Hungarian",
        "main": "",
        "description": {
            "200": "vihar enyhe es\u0151vel",
            "201": "vihar es\u0151vel",
            "202": "vihar heves es\u0151vel",
            "210": "enyhe zivatar",
            "211": "vihar",
            "212": "heves vihar",
            "221": "durva vihar",
            "230": "vihar enyhe szit\xE1l\xE1ssal",
            "231": "vihar szit\xE1l\xE1ssal",
            "232": "vihar er\u0151s szit\xE1l\xE1ssal",
            "300": "enyhe intenzit\xE1s\xFA szit\xE1l\xE1s",
            "301": "szit\xE1l\xE1s",
            "302": "er\u0151s intenzit\xE1s\xFA szit\xE1l\xE1s",
            "310": "enyhe intenzit\xE1s\xFA szit\xE1l\xF3 es\u0151",
            "311": "szit\xE1l\xF3 es\u0151",
            "312": "er\u0151s intenzit\xE1s\xFA szit\xE1l\xF3 es\u0151",
            "321": "z\xE1por",
            "500": "enyhe es\u0151",
            "501": "k\xF6zepes es\u0151",
            "502": "heves intenzit\xE1s\xFA es\u0151",
            "503": "nagyon heves es\u0151",
            "504": "extr\xE9m es\u0151",
            "511": "\xF3nos es\u0151",
            "520": "enyhe intenzit\xE1s\xFA z\xE1por",
            "521": "z\xE1por",
            "522": "er\u0151s intenzit\xE1s\xFA z\xE1por",
            "600": "enyhe havaz\xE1s",
            "601": "havaz\xE1s",
            "602": "er\u0151s havaz\xE1s",
            "611": "havas es\u0151",
            "621": "h\xF3z\xE1por",
            "701": "gyenge k\xF6d",
            "711": "k\xF6d",
            "721": "k\xF6d",
            "731": "homokvihar",
            "741": "k\xF6d",
            "800": "tiszta \xE9gbolt",
            "801": "kev\xE9s felh\u0151",
            "802": "sz\xF3rv\xE1nyos felh\u0151zet",
            "803": "er\u0151s felh\u0151zet",
            "804": "bor\xFAs \xE9gbolt",
            "900": "torn\xE1d\xF3",
            "901": "tr\xF3pusi vihar",
            "902": "hurrik\xE1n",
            "903": "h\u0171v\xF6s",
            "904": "forr\xF3",
            "905": "szeles",
            "906": "j\xE9ges\u0151",
            "950": "Nyugodt",
            "951": "Csendes",
            "952": "Enyhe szell\u0151",
            "953": "Finom szell\u0151",
            "954": "K\xF6zepes sz\xE9l",
            "955": "\xC9l\xE9nk sz\xE9l",
            "956": "Er\u0151s sz\xE9l",
            "957": "Er\u0151s, m\xE1r viharos sz\xE9l",
            "958": "Viharos sz\xE9l",
            "959": "Er\u0151sen viharos sz\xE9l",
            "960": "Sz\xE9lvihar",
            "961": "Tombol\xF3 sz\xE9lvihar",
            "962": "Hurrik\xE1n"
        }
    },
    "ca": {
        "name": "Catalan",
        "main": "",
        "description": {
            "200": "Tempesta amb pluja suau",
            "201": "Tempesta amb pluja",
            "202": "Tempesta amb pluja intensa",
            "210": "Tempesta suau",
            "211": "Tempesta",
            "212": "Tempesta forta",
            "221": "Tempesta irregular",
            "230": "Tempesta amb plugim suau",
            "231": "Tempesta amb plugin",
            "232": "Tempesta amb molt plugim",
            "300": "Plugim suau",
            "301": "Plugim",
            "302": "Plugim intens",
            "310": "Plugim suau",
            "311": "Plugim",
            "312": "Plugim intens",
            "313": "Pluja",
            "314": "Pluja intensa",
            "321": "Plugim",
            "500": "Pluja suau",
            "501": "Pluja",
            "502": "Pluja intensa",
            "503": "Pluja molt intensa",
            "504": "Pluja extrema",
            "511": "Pluja gla\xE7ada",
            "520": "Pluja suau",
            "521": "Pluja suau",
            "522": "Pluja intensa",
            "531": "Pluja irregular",
            "600": "Nevada suau",
            "601": "Nevada",
            "602": "Nevada intensa",
            "611": "Aiguaneu",
            "612": "Pluja d'aiguaneu",
            "615": "Plugim i neu",
            "616": "Pluja i neu",
            "620": "Nevada suau",
            "621": "Nevada",
            "622": "Nevada intensa",
            "701": "Boira",
            "711": "Fum",
            "721": "Boirina",
            "731": "Sorra",
            "741": "Boira",
            "751": "Sorra",
            "761": "Pols",
            "762": "Cendra volc\xE0nica",
            "771": "X\xE0fec",
            "781": "Tornado",
            "800": "Cel net",
            "801": "Lleugerament ennuvolat",
            "802": "N\xFAvols dispersos",
            "803": "Nuvolositat variable",
            "804": "Ennuvolat",
            "900": "Tornado",
            "901": "Tempesta tropical",
            "902": "Hurac\xE0",
            "903": "Fred",
            "904": "Calor",
            "905": "Vent",
            "906": "Pedra",
            "950": "",
            "951": "Calmat",
            "952": "Brisa suau",
            "953": "Brisa agradable",
            "954": "Brisa moderada",
            "955": "Brisa fresca",
            "956": "Brisca fora",
            "957": "Vent intens",
            "958": "Vendaval",
            "959": "Vendaval sever",
            "960": "Tempesta",
            "961": "Tempesta violenta",
            "962": "Hurac\xE0"
        }
    },
    "hr": {
        "name": "Croatian",
        "main": "",
        "description": {
            "200": "grmljavinska oluja s slabom ki\u0161om",
            "201": "grmljavinska oluja s ki\u0161om",
            "202": "grmljavinska oluja s jakom ki\u0161om",
            "210": "slaba grmljavinska oluja",
            "211": "grmljavinska oluja",
            "212": "jaka grmljavinska oluja",
            "221": "orkanska grmljavinska oluja",
            "230": "grmljavinska oluja sa slabom rosuljom",
            "231": "grmljavinska oluja s rosuljom",
            "232": "grmljavinska oluja sa jakom rosuljom",
            "300": "rosulja slabog intenziteta",
            "301": "rosulja",
            "302": "rosulja jakog intenziteta",
            "310": "rosulja s ki\u0161om slabog intenziteta",
            "311": "rosulja s ki\u0161om",
            "312": "rosulja s ki\u0161om jakog intenziteta",
            "313": "pljuskovi i rosulja",
            "314": "rosulja s jakim pljuskovima",
            "321": "rosulja s pljuskovima",
            "500": "slaba ki\u0161a",
            "501": "umjerena ki\u0161a",
            "502": "ki\u0161a jakog intenziteta",
            "503": "vrlo jaka ki\u0161a",
            "504": "ekstremna ki\u0161a",
            "511": "ledena ki\u0161a",
            "520": "pljusak slabog intenziteta",
            "521": "pljusak",
            "522": "pljusak jakog intenziteta",
            "531": "olujna ki\u0161a s pljuskovima",
            "600": "slabi snijeg",
            "601": "snijeg",
            "602": "gusti snijeg",
            "611": "susnje\u017Eica",
            "612": "susnje\u017Eica s pljuskovima",
            "615": "slaba ki\u0161a i snijeg",
            "616": "ki\u0161a i snijeg",
            "620": "snijeg s povremenim pljuskovima",
            "621": "snijeg s pljuskovima",
            "622": "snijeg s jakim pljuskovima",
            "701": "sumaglica",
            "711": "dim",
            "721": "izmaglica",
            "731": "kovitlaci pijeska ili pra\u0161ine",
            "741": "magla",
            "751": "pijesak",
            "761": "pra\u0161ina",
            "762": "vulkanski pepeo",
            "771": "zapusi vjetra s ki\u0161om",
            "781": "tornado",
            "800": "vedro",
            "801": "blaga naoblaka",
            "802": "ra\u0161trkani oblaci",
            "803": "isprekidani oblaci",
            "804": "obla\u010Dno",
            "900": "tornado",
            "901": "tropska oluja",
            "902": "orkan",
            "903": "hladno",
            "904": "vru\u0107e",
            "905": "vjetrovito",
            "906": "tu\u010Da",
            "950": "",
            "951": "lahor",
            "952": "povjetarac",
            "953": "slab vjetar",
            "954": "umjeren vjetar",
            "955": "umjereno jak vjetar",
            "956": "jak vjetar",
            "957": "\u017Eestok vjetar",
            "958": "olujni vjetar",
            "959": "jak olujni vjetar",
            "960": "orkanski vjetar",
            "961": "jak orkanski vjetar",
            "962": "orkan"
        }
    },
    "blank": {
        "name": "Catalan",
        "main": "",
        "description": {
            "200": "",
            "201": "",
            "202": "",
            "210": "",
            "211": "",
            "212": "",
            "221": "",
            "230": "",
            "231": "",
            "232": "",
            "300": "",
            "301": "",
            "302": "",
            "310": "",
            "311": "",
            "312": "",
            "313": "",
            "314": "",
            "321": "",
            "500": "",
            "501": "",
            "502": "",
            "503": "",
            "504": "",
            "511": "",
            "520": "",
            "521": "",
            "522": "",
            "531": "",
            "600": "",
            "601": "",
            "602": "",
            "611": "",
            "612": "",
            "615": "",
            "616": "",
            "620": "",
            "621": "",
            "622": "",
            "701": "",
            "711": "",
            "721": "",
            "731": "",
            "741": "",
            "751": "",
            "761": "",
            "762": "",
            "771": "",
            "781": "",
            "800": "",
            "801": "",
            "802": "",
            "803": "",
            "804": "",
            "900": "",
            "901": "",
            "902": "",
            "903": "",
            "904": "",
            "905": "",
            "906": "",
            "950": "",
            "951": "",
            "952": "",
            "953": "",
            "954": "",
            "955": "",
            "956": "",
            "957": "",
            "958": "",
            "959": "",
            "960": "",
            "961": "",
            "962": ""
        }
    }
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Denis on 20.10.2016.
 */
var windSpeed = exports.windSpeed = {
    "en": {
        "Settings": {
            "speed_interval": [0.0, 0.3],
            "desc": "0-1   Smoke rises straight up"
        },
        "Calm": {
            "speed_interval": [0.3, 1.6],
            "desc": "1-3 One can see downwind of the smoke drift"
        },
        "Light breeze": {
            "speed_interval": [1.6, 3.3],
            "desc": "4-6 One can feel the wind. The leaves on the trees move, the wind can lift small streamers."
        },
        "Gentle Breeze": {
            "speed_interval": [3.4, 5.5],
            "desc": "7-10 Leaves and twigs move. Wind extends light flag and pennants"
        },
        "Moderate breeze": {
            "speed_interval": [5.5, 8.0],
            "desc": "11-16   The wind raises dust and loose papers, touches on the twigs and small branches, stretches larger flags and pennants"
        },
        "Fresh Breeze": {
            "speed_interval": [8.0, 10.8],
            "desc": "17-21   Small trees in leaf begin to sway. The water begins little waves to peak"
        },
        "Strong breeze": {
            "speed_interval": [10.8, 13.9],
            "desc": "22-27   Large branches and smaller tribes moves. The whiz of telephone lines. It is difficult to use the umbrella. A resistance when running."
        },
        "High wind, near gale": {
            "speed_interval": [13.9, 17.2],
            "desc": "28-33   Whole trees in motion. It is hard to go against the wind."
        },
        "Gale": {
            "speed_interval": [17.2, 20.7],
            "desc": "34-40   The wind break twigs of trees. It is hard to go against the wind."
        },
        "Severe Gale": {
            "speed_interval": [20.8, 24.5],
            "desc": "41-47   All large trees swaying and throws. Tiles can blow down."
        },
        "Storm": {
            "speed_interval": [24.5, 28.5],
            "desc": "48-55   Rare inland. Trees uprooted. Serious damage to houses."
        },
        "Violent Storm": {
            "speed_interval": [28.5, 32.7],
            "desc": "56-63   Occurs rarely and is followed by destruction."
        },
        "Hurricane": {
            "speed_interval": [32.7, 64],
            "desc": "Occurs very rarely. Unusually severe damage."
        }
    }
}; /**
   * Created by Denis on 21.10.2016.
   */

},{}],6:[function(require,module,exports){
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

},{"./Cookies":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customDate = require('./custom-date');

var _customDate2 = _interopRequireDefault(_customDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Denis on 29.09.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 График температуры и погоды
 @class Graphic
 */
var Graphic = function (_CustomDate) {
  _inherits(Graphic, _CustomDate);

  function Graphic(params) {
    _classCallCheck(this, Graphic);

    var _this = _possibleConstructorReturn(this, (Graphic.__proto__ || Object.getPrototypeOf(Graphic)).call(this));

    _this.params = params;
    /**
    * метод для расчета отрисовки основной линии параметра температуры
    * [line description]
    * @return {[type]} [description]
    */
    _this.temperaturePolygon = d3.line().x(function (d) {
      return d.x;
    }).y(function (d) {
      return d.y;
    });
    return _this;
  }

  /**
   * Преобразуем объект данных в массив для формирования графика
   * @param  {[boolean]} temperature [признак для построения графика]
   * @return {[array]}   rawData [массив с адаптированными по типу графика данными]
   */


  _createClass(Graphic, [{
    key: 'prepareData',
    value: function prepareData() {
      var i = 0;
      var rawData = [];

      this.params.data.forEach(function (elem) {
        rawData.push({ x: i, date: i, maxT: elem.max, minT: elem.min });
        i += 1; // Смещение по оси X
      });

      return rawData;
    }

    /**
     * Создаем изображение с контекстом объекта svg
     * [makeSVG description]
     * @return {[object]}
     */

  }, {
    key: 'makeSVG',
    value: function makeSVG() {
      return d3.select(this.params.id).append('svg').attr('class', 'axis').attr('width', this.params.width).attr('height', this.params.height).attr('fill', this.params.colorPolilyne).style('stroke', '#ffffff');
    }

    /**
    * Определение минималльного и максимального элемента по параметру даты
    * [getMinMaxDate description]
    * @param  {[array]} rawData [массив с адаптированными по типу графика данными]
    * @return {[object]} data [объект с минимальным и максимальным значением]
    */

  }, {
    key: 'getMinMaxDate',
    value: function getMinMaxDate(rawData) {
      /* Определяем минимальные и максмальные значения для построения осей */
      var data = {
        maxDate: 0,
        minDate: 10000
      };

      rawData.forEach(function (elem) {
        if (data.maxDate <= elem.date) {
          data.maxDate = elem.date;
        }
        if (data.minDate >= elem.date) {
          data.minDate = elem.date;
        }
      });

      return data;
    }

    /**
     * Определяем минимальные и максимальные значения дат и температуры
     * [getMinMaxDateTemperature description]
     * @param  {[object]} rawData [description]
     * @return {[object]}         [description]
     */

  }, {
    key: 'getMinMaxTemperature',
    value: function getMinMaxTemperature(rawData) {
      /* Определяем минимальные и максмальные значения для построения осей */
      var data = {
        min: 100,
        max: 0
      };

      rawData.forEach(function (elem) {
        if (data.min >= elem.minT) {
          data.min = elem.minT;
        }
        if (data.max <= elem.maxT) {
          data.max = elem.maxT;
        }
      });

      return data;
    }

    /**
     *
     * [getMinMaxWeather description]
     * @param  {[type]} rawData [description]
     * @return {[type]}         [description]
     */

  }, {
    key: 'getMinMaxWeather',
    value: function getMinMaxWeather(rawData) {
      /* Определяем минимальные и максмальные значения для построения осей */
      var data = {
        min: 0,
        max: 0
      };

      rawData.forEach(function (elem) {
        if (data.min >= elem.humidity) {
          data.min = elem.humidity;
        }
        if (data.min >= elem.rainfallAmount) {
          data.min = elem.rainfallAmount;
        }
        if (data.max <= elem.humidity) {
          data.max = elem.humidity;
        }
        if (data.max <= elem.rainfallAmount) {
          data.max = elem.rainfallAmount;
        }
      });

      return data;
    }

    /**
    * Определяем длину осей X,Y
    * [makeAxesXY description]
    * @param  {[array]} rawData [Массив с данными для построения графика]
    * @param  {[integer]} margin  [отступы от краев графика]
    * @return {[function]}         [description]
    */

  }, {
    key: 'makeAxesXY',
    value: function makeAxesXY(rawData, params) {
      // длина оси X= ширина контейнера svg - отступ слева и справа
      var xAxisLength = params.width - 2 * params.margin;
      // длина оси Y = высота контейнера svg - отступ сверху и снизу
      var yAxisLength = params.height - 2 * params.margin;

      return this.scaleAxesXYTemperature(rawData, xAxisLength, yAxisLength, params);
    }

    /**
    * // функция интерполяции значений на оси Х и Y
    * [scaleAxesXY description]
    * @param  {[object]}  rawData     [Объект с данными для построения графика]
    * @param  {function} xAxisLength [интерполирование значений на ось X]
    * @param  {function} yAxisLength [интерполирование значений на ось Y]
    * @param  {[type]}  margin      [отступы от краев графика]
    * @return {[array]}              [массив с интерполированными значениями]
    */

  }, {
    key: 'scaleAxesXYTemperature',
    value: function scaleAxesXYTemperature(rawData, xAxisLength, yAxisLength, params) {
      var _getMinMaxDate = this.getMinMaxDate(rawData),
          maxDate = _getMinMaxDate.maxDate,
          minDate = _getMinMaxDate.minDate;

      var _getMinMaxTemperature = this.getMinMaxTemperature(rawData),
          min = _getMinMaxTemperature.min,
          max = _getMinMaxTemperature.max;

      /**
      * метод интерполяции значений на ось Х
      * [scaleTime description]
      */


      var scaleX = d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]).range([0, xAxisLength]);

      /**
      * метод интерполяции значений на ось Y
      * [scaleLinear description]
      * @return {[type]} [description]
      */
      var scaleY = d3.scaleLinear().domain([max + 5, min - 5]).range([0, yAxisLength]);

      var data = [];
      // масштабирование реальных данных в данные для нашей координатной системы
      rawData.forEach(function (elem) {
        data.push({
          x: scaleX(elem.date) + params.offsetX,
          maxT: scaleY(elem.maxT) + params.offsetX,
          minT: scaleY(elem.minT) + params.offsetX
        });
      });

      return { scaleX: scaleX, scaleY: scaleY, data: data };
    }
  }, {
    key: 'scaleAxesXYWeather',
    value: function scaleAxesXYWeather(rawData, xAxisLength, yAxisLength, margin) {
      var _getMinMaxDate2 = this.getMinMaxDate(rawData),
          maxDate = _getMinMaxDate2.maxDate,
          minDate = _getMinMaxDate2.minDate;

      var _getMinMaxWeather = this.getMinMaxWeather(rawData),
          min = _getMinMaxWeather.min,
          max = _getMinMaxWeather.max;

      // функция интерполяции значений на ось Х


      var scaleX = d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]).range([0, xAxisLength]);

      // функция интерполяции значений на ось Y
      var scaleY = d3.scaleLinear().domain([max, min]).range([0, yAxisLength]);
      var data = [];

      // масштабирование реальных данных в данные для нашей координатной системы
      rawData.forEach(function (elem) {
        data.push({
          x: scaleX(elem.date) + margin,
          humidity: scaleY(elem.humidity) + margin,
          rainfallAmount: scaleY(elem.rainfallAmount) + margin,
          color: elem.color
        });
      });

      return { scaleX: scaleX, scaleY: scaleY, data: data };
    }

    /**
     * Формивароние массива для рисования полилинии
     * [makePolyline description]
     * @param  {[array]} data [массив с интерполированными значениями]
     * @param  {[integer]} margin [отступ от краев графика]
     * @param  {[object]} scaleX, scaleY [объекты с функциями интерполяции X,Y]
     * @return {[type]}  [description]
     */

  }, {
    key: 'makePolyline',
    value: function makePolyline(data, params, scaleX, scaleY) {
      var arrPolyline = [];
      data.forEach(function (elem) {
        arrPolyline.push({
          x: scaleX(elem.date) + params.offsetX,
          y: scaleY(elem.maxT) + params.offsetY });
      });
      data.reverse().forEach(function (elem) {
        arrPolyline.push({
          x: scaleX(elem.date) + params.offsetX,
          y: scaleY(elem.minT) + params.offsetY
        });
      });
      arrPolyline.push({
        x: scaleX(data[data.length - 1].date) + params.offsetX,
        y: scaleY(data[data.length - 1].maxT) + params.offsetY
      });

      return arrPolyline;
    }
    /**
     * Отрисовка полилиний с заливкой основной и имитация ее тени
     * [drawPoluline description]
     * @param  {[type]} svg  [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */

  }, {
    key: 'drawPolyline',
    value: function drawPolyline(svg, data) {
      // добавляем путь и рисуем линии

      svg.append('g').append('path').style('stroke-width', this.params.strokeWidth).attr('d', this.temperaturePolygon(data)).style('stroke', this.params.colorPolilyne).style('fill', this.params.colorPolilyne).style('opacity', 1);
    }
    /**
     * Отрисовка надписей с показателями температуры на осях
     * @param  {[type]} svg    [description]
     * @param  {[type]} data   [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */

  }, {
    key: 'drawLabelsTemperature',
    value: function drawLabelsTemperature(svg, data, params) {
      data.forEach(function (elem, item, data) {
        // отрисовка текста
        svg.append('text').attr('x', elem.x).attr('y', elem.maxT - 2 - params.offsetX / 2).attr('text-anchor', 'middle').style('font-size', params.fontSize).style('stroke', params.fontColor).style('fill', params.fontColor).text(params.data[item].max + '\xB0');

        svg.append('text').attr('x', elem.x).attr('y', elem.minT + 7 + params.offsetY / 2).attr('text-anchor', 'middle').style('font-size', params.fontSize).style('stroke', params.fontColor).style('fill', params.fontColor).text(params.data[item].min + '\xB0');
      });
    }

    /**
     * Метод диспетчер прорисовка графика со всеми элементами
     * [render description]
     * @return {[type]} [description]
     */

  }, {
    key: 'render',
    value: function render() {
      var svg = this.makeSVG();
      var rawData = this.prepareData();

      var _makeAxesXY = this.makeAxesXY(rawData, this.params),
          scaleX = _makeAxesXY.scaleX,
          scaleY = _makeAxesXY.scaleY,
          data = _makeAxesXY.data;

      var polyline = this.makePolyline(rawData, this.params, scaleX, scaleY);
      this.drawPolyline(svg, polyline);
      this.drawLabelsTemperature(svg, data, this.params);
      // this.drawMarkers(svg, polyline, this.margin);
    }
  }]);

  return Graphic;
}(_customDate2.default);

exports.default = Graphic;

},{"./custom-date":3}],8:[function(require,module,exports){
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
    event.preventDefault();
    var element = event.target;
    if (element.id && element.classList.contains('container-custom-card__btn')) {
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
  });

  copyContentJSCode.disabled = !document.queryCommandSupported('copy');
});

},{"./generator-widget":6}],9:[function(require,module,exports){
'use strict';

var _cities = require('./cities');

var _cities2 = _interopRequireDefault(_cities);

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Модуль диспетчер для отрисовки баннерров на конструкторе
document.addEventListener('DOMContentLoaded', function () {

    // Работа с формой для инициали
    var cityName = document.getElementById('city-name');
    var cities = document.getElementById('cities');
    var searchCity = document.getElementById('search-city');

    var objCities = new _cities2.default(cityName, cities);
    objCities.getCities();

    searchCity.addEventListener('click', function () {
        var objCities = new _cities2.default(cityName, cities);
        objCities.getCities();
    });
});

},{"./cities":2,"./popup":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customDate = require('./custom-date');

var _customDate2 = _interopRequireDefault(_customDate);

var _graphicD3js = require('./graphic-d3js');

var _graphicD3js2 = _interopRequireDefault(_graphicD3js);

var _naturalPhenomenonData = require('./data/natural-phenomenon-data');

var naturalPhenomenon = _interopRequireWildcard(_naturalPhenomenonData);

var _windSpeedData = require('./data/wind-speed-data');

var windSpeed = _interopRequireWildcard(_windSpeedData);

var windDirection = _interopRequireWildcard(_windSpeedData);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Denis on 29.09.2016.
 */

var Promise = require('es6-promise').Promise;

var WeatherWidget = function (_CustomDate) {
  _inherits(WeatherWidget, _CustomDate);

  function WeatherWidget(params, controls, urls) {
    _classCallCheck(this, WeatherWidget);

    var _this = _possibleConstructorReturn(this, (WeatherWidget.__proto__ || Object.getPrototypeOf(WeatherWidget)).call(this));

    _this.params = params;
    _this.controls = controls;
    _this.urls = urls;

    // Инициализируем объект пустыми значениями
    _this.weather = {
      fromAPI: {
        coord: {
          lon: '0',
          lat: '0'
        },
        weather: [{
          id: ' ',
          main: ' ',
          description: ' ',
          icon: ' '
        }],
        base: ' ',
        main: {
          temp: 0,
          pressure: ' ',
          humidity: ' ',
          temp_min: ' ',
          temp_max: ' '
        },
        wind: {
          speed: 0,
          deg: ' '
        },
        rain: {},
        clouds: {
          all: ' '
        },
        dt: '',
        sys: {
          type: ' ',
          id: ' ',
          message: ' ',
          country: ' ',
          sunrise: ' ',
          sunset: ' '
        },
        id: ' ',
        name: 'Undefined',
        cod: ' '
      }
    };
    return _this;
  }

  /**
   * Обертка обещение для асинхронных запросов
   * @param url
   * @returns {Promise}
   */


  _createClass(WeatherWidget, [{
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

    /**
     * Запрос к API для получения данных текущей погоды
     */

  }, {
    key: 'getWeatherFromApi',
    value: function getWeatherFromApi() {
      var _this2 = this;

      this.httpGet(this.urls.urlWeatherAPI).then(function (response) {
        _this2.weather.fromAPI = response;
        _this2.weather.naturalPhenomenon = naturalPhenomenon.naturalPhenomenon[_this2.params.lang].description;
        _this2.weather.windSpeed = windSpeed.windSpeed[_this2.params.lang];
        _this2.httpGet(_this2.urls.paramsUrlForeDaily).then(function (response) {
          _this2.weather.forecastDaily = response;
          _this2.parseDataFromServer();
        }, function (error) {
          console.log('\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 ' + error);
          _this2.parseDataFromServer();
        });
      }, function (error) {
        console.log('\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 ' + error);
        _this2.parseDataFromServer();
      });
    }

    /**
     * Метод возвращает родительский селектор по значению дочернего узла в JSON
     * @param {object} JSON
     * @param {variant} element Значение элементарного типа, дочернего узла для поиска родительского
     * @param {string} elementName Наименование искомого селектора,для поиска родительского селектора
     * @return {string} Наименование искомого селектора
     */

  }, {
    key: 'getParentSelectorFromObject',
    value: function getParentSelectorFromObject(object, element, elementName, elementName2) {
      for (var key in object) {
        // Если сравнение производится с объектом из двух элементов ввиде интервала
        if (_typeof(object[key][elementName]) === 'object' && elementName2 == null) {
          if (element >= object[key][elementName][0] && element < object[key][elementName][1]) {
            return key;
          }
          // сравнение производится со значением элементарного типа с двумя элементами в JSON
        } else if (elementName2 != null) {
          if (element >= object[key][elementName] && element < object[key][elementName2]) {
            return key;
          }
        }
      }
    }

    /**
     * Возвращает JSON с метеодаными
     * @param jsonData
     * @returns {*}
     */

  }, {
    key: 'parseDataFromServer',
    value: function parseDataFromServer() {
      var weather = this.weather;

      if (weather.fromAPI.name === 'Undefined' || weather.fromAPI.cod === '404') {
        console.log('Данные от сервера не получены');
        return;
      }

      // Инициализируем объект
      var metadata = {
        cloudiness: ' ',
        dt: ' ',
        cityName: ' ',
        icon: ' ',
        temperature: ' ',
        temperatureMin: ' ',
        temperatureMAx: ' ',
        pressure: ' ',
        humidity: ' ',
        sunrise: ' ',
        sunset: ' ',
        coord: ' ',
        wind: ' ',
        weather: ' '
      };
      var temperature = parseInt(weather.fromAPI.main.temp.toFixed(0), 10) + 0;
      metadata.cityName = weather.fromAPI.name + ', ' + weather.fromAPI.sys.country;
      metadata.temperature = temperature; // `${temp > 0 ? `+${temp}` : temp}`;
      metadata.temperatureMin = parseInt(weather.fromAPI.main.temp_min.toFixed(0), 10) + 0;
      metadata.temperatureMax = parseInt(weather.fromAPI.main.temp_max.toFixed(0), 10) + 0;
      if (weather.naturalPhenomenon) {
        metadata.weather = weather.naturalPhenomenon[weather.fromAPI.weather[0].id];
      }
      if (weather.windSpeed) {
        metadata.windSpeed = 'Wind: ' + weather.fromAPI.wind.speed.toFixed(1) + ' m/s ' + this.getParentSelectorFromObject(weather.windSpeed, weather.fromAPI.wind.speed.toFixed(1), 'speed_interval');
        metadata.windSpeed2 = weather.fromAPI.wind.speed.toFixed(1) + ' m/s ' + this.getParentSelectorFromObject(weather.windSpeed, weather.fromAPI.wind.speed.toFixed(1), 'speed_interval').substr(0, 1);
      }
      if (weather.windDirection) {
        metadata.windDirection = '' + this.getParentSelectorFromObject(weather["windDirection"], weather["fromAPI"]["wind"]["deg"], "deg_interval");
      }
      if (weather.clouds) {
        metadata.clouds = '' + this.getParentSelectorFromObject(weather.clouds, weather.fromAPI.clouds.all, 'min', 'max');
      }

      metadata.humidity = weather.fromAPI.main.humidity + '%';
      metadata.pressure = weather["fromAPI"]["main"]["pressure"] + ' mb';
      metadata.icon = '' + weather.fromAPI.weather[0].icon;

      this.renderWidget(metadata);
    }
  }, {
    key: 'renderWidget',
    value: function renderWidget(metadata) {
      // Оотрисовка первых четырех виджетов
      for (var elem in this.controls.cityName) {
        if (this.controls.cityName.hasOwnProperty(elem)) {
          this.controls.cityName[elem].innerHTML = metadata.cityName;
        }
      }

      for (var _elem in this.controls.temperature) {
        if (this.controls.temperature.hasOwnProperty(_elem)) {
          this.controls.temperature[_elem].innerHTML = metadata.temperature + '<span class=\'weather-left-card__degree\'>' + this.params.textUnitTemp + '</span>';
        }
      }

      for (var _elem2 in this.controls.mainIconWeather) {
        if (this.controls.mainIconWeather.hasOwnProperty(_elem2)) {
          this.controls.mainIconWeather[_elem2].src = this.getURLMainIcon(metadata.icon, true);
          this.controls.mainIconWeather[_elem2].alt = 'Weather in ' + (metadata.cityName ? metadata.cityName : '');
        }
      }

      if (metadata.weather) {
        for (var _elem3 in this.controls.naturalPhenomenon) {
          if (this.controls.naturalPhenomenon.hasOwnProperty(_elem3)) {
            this.controls.naturalPhenomenon[_elem3].innerText = metadata.weather;
          }
        }
      }
      if (metadata.windSpeed) {
        for (var _elem4 in this.controls.windSpeed) {
          if (this.controls.windSpeed.hasOwnProperty(_elem4)) {
            this.controls.windSpeed[_elem4].innerText = metadata.windSpeed;
          }
        }
      }

      // Отрисовка пяти последних виджетов
      for (var _elem5 in this.controls.cityName2) {
        if (this.controls.cityName2.hasOwnProperty(_elem5)) {
          this.controls.cityName2[_elem5].innerHTML = metadata.cityName;
        }
      }

      for (var _elem6 in this.controls.temperature2) {
        if (this.controls.temperature2.hasOwnProperty(_elem6)) {
          if (this.controls.temperature2[_elem6]) {
            this.controls.temperature2[_elem6].innerHTML = metadata.temperature + '<span>' + this.params.textUnitTemp + '</span>';
          }
        }
        if (this.controls.temperatureFeels.hasOwnProperty(_elem6)) {
          if (this.controls.temperatureFeels[_elem6]) {
            this.controls.temperatureFeels[_elem6].innerHTML = metadata.temperature + '<span>' + this.params.textUnitTemp + '</span>';
          }
        }
      }

      for (var _elem7 in this.controls.temperatureMin) {
        if (this.controls.temperatureMin.hasOwnProperty(_elem7)) {
          this.controls.temperatureMin[_elem7].innerHTML = metadata.temperature + '<span>' + this.params.textUnitTemp + '</span>';
        }
      }

      for (var _elem8 in this.controls.temperatureMax) {
        if (this.controls.temperatureMax.hasOwnProperty(_elem8)) {
          this.controls.temperatureMax[_elem8].innerHTML = metadata.temperature + '<span>' + this.params.textUnitTemp + '</span>';
        }
      }

      if (metadata.weather) {
        for (var _elem9 in this.controls.naturalPhenomenon2) {
          if (this.controls.naturalPhenomenon2.hasOwnProperty(_elem9)) {
            this.controls.naturalPhenomenon2[_elem9].innerText = metadata.weather;
          }
        }
      }

      if (metadata.windSpeed2 && metadata.windDirection) {
        for (var _elem10 in this.controls.windSpeed2) {
          if (this.controls.windSpeed2.hasOwnProperty(_elem10)) {
            this.controls.windSpeed2[_elem10].innerText = metadata.windSpeed2 + ' ' + metadata.windDirection;
          }
        }
      }

      for (var _elem11 in this.controls.mainIconWeather2) {
        if (this.controls.mainIconWeather2.hasOwnProperty(_elem11)) {
          this.controls.mainIconWeather2[_elem11].src = this.getURLMainIcon(metadata.icon, true);
          this.controls.mainIconWeather2[_elem11].alt = 'Weather in ' + (metadata.cityName ? metadata.cityName : '');
        }
      }

      if (metadata.humidity) {
        for (var _elem12 in this.controls.humidity) {
          if (this.controls.humidity.hasOwnProperty(_elem12)) {
            this.controls.humidity[_elem12].innerText = metadata.humidity;
          }
        }
      }

      if (metadata.pressure) {
        for (var _elem13 in this.controls.pressure) {
          if (this.controls.pressure.hasOwnProperty(_elem13)) {
            this.controls.pressure[_elem13].innerText = metadata.pressure;
          }
        }
      }
      // Прописываем текущую дату в виджеты
      for (var _elem14 in this.controls.dateReport) {
        if (this.controls.dateReport.hasOwnProperty(_elem14)) {
          this.controls.dateReport[_elem14].innerText = this.getTimeDateHHMMMonthDay();
        }
      }

      if (this.weather.forecastDaily) {
        this.prepareDataForGraphic();
      }
    }
  }, {
    key: 'prepareDataForGraphic',
    value: function prepareDataForGraphic() {
      var _this3 = this;

      var arr = [];

      this.weather.forecastDaily.list.forEach(function (elem) {
        var day = _this3.getDayNameOfWeekByDayNumber(_this3.getNumberDayInWeekByUnixTime(elem.dt));
        arr.push({
          min: Math.round(elem.temp.min),
          max: Math.round(elem.temp.max),
          day: elem != 0 ? day : 'Today',
          icon: elem.weather[0].icon,
          date: _this3.timestampToDateTime(elem.dt)
        });
      });
      return this.drawGraphicD3(arr);
    }

    /**
     * Отрисовка названия дней недели и иконок с погодой
     * @param data
     */

  }, {
    key: 'renderIconsDaysOfWeek',
    value: function renderIconsDaysOfWeek(data) {
      var _this4 = this;

      var that = this;

      data.forEach(function (elem, index) {
        var date = void 0;
        date = new Date(elem.date.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1'));
        // для edge строим другой алгоритм даты
        if (date.toString() === 'Invalid Date') {
          var reg = /(\d+)/ig;
          var found = elem.date.match(reg);
          date = new Date(found[2] + '-' + found[1] + '-' + found[0] + ' ' + found[3] + ':' + (found[4] ? found[4] : '00') + ':' + (found[5] ? found[5] : '00'));
          if (date.toString() === 'Invalid Date') {
            date = new Date(found[2], found[0] - 1, found[1], found[3], found[4] ? found[4] : '00', found[5] ? found[5] : '00');
          }
        }
        that.controls.calendarItem[index].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this4.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 8].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this4.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 18].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this4.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 28].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this4.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
      });
      return data;
    }
  }, {
    key: 'getURLMainIcon',
    value: function getURLMainIcon(nameIcon) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // Создаем и инициализируем карту сопоставлений
      var mapIcons = new Map();

      if (!color) {
        //
        mapIcons.set('01d', '01dbw');
        mapIcons.set('02d', '02dbw');
        mapIcons.set('03d', '03dbw');
        mapIcons.set('03d', '03dbw');
        mapIcons.set('04d', '04dbw');
        mapIcons.set('05d', '05dbw');
        mapIcons.set('06d', '06dbw');
        mapIcons.set('07d', '07dbw');
        mapIcons.set('08d', '08dbw');
        mapIcons.set('09d', '09dbw');
        mapIcons.set('10d', '10dbw');
        mapIcons.set('11d', '11dbw');
        mapIcons.set('13d', '13dbw');
        // Ночные
        mapIcons.set('01n', '01dbw');
        mapIcons.set('02n', '02dbw');
        mapIcons.set('03n', '03dbw');
        mapIcons.set('03n', '03dbw');
        mapIcons.set('04n', '04dbw');
        mapIcons.set('05n', '05dbw');
        mapIcons.set('06n', '06dbw');
        mapIcons.set('07n', '07dbw');
        mapIcons.set('08n', '08dbw');
        mapIcons.set('09n', '09dbw');
        mapIcons.set('10n', '10dbw');
        mapIcons.set('11n', '11dbw');
        mapIcons.set('13n', '13dbw');

        if (mapIcons.get(nameIcon)) {
          return this.params.baseURL + '/img/widgets/' + mapIcons.get(nameIcon) + '.png';
        }
        return 'http://openweathermap.org/img/w/' + nameIcon + '.png';
      }
      return this.params.baseURL + '/img/widgets/' + nameIcon + '.png';
    }

    /**
     * Отрисовка графика с помощью библиотеки D3
     */

  }, {
    key: 'drawGraphicD3',
    value: function drawGraphicD3(data) {
      this.renderIconsDaysOfWeek(data);

      // Очистка контейнеров для графиков
      var svg = document.getElementById('graphic');
      var svg1 = document.getElementById('graphic1');
      var svg2 = document.getElementById('graphic2');
      var svg3 = document.getElementById('graphic3');

      if (svg.querySelector('svg')) {
        svg.removeChild(svg.querySelector('svg'));
      }
      if (svg1.querySelector('svg')) {
        svg1.removeChild(svg1.querySelector('svg'));
      }
      if (svg2.querySelector('svg')) {
        svg2.removeChild(svg2.querySelector('svg'));
      }
      if (svg3.querySelector('svg')) {
        svg3.removeChild(svg3.querySelector('svg'));
      }

      // Параметризуем область отрисовки графика
      var params = {
        id: '#graphic',
        data: data,
        offsetX: 15,
        offsetY: 10,
        width: 420,
        height: 79,
        rawData: [],
        margin: 10,
        colorPolilyne: '#333',
        fontSize: '12px',
        fontColor: '#333',
        strokeWidth: '1px'
      };

      // Реконструкция процедуры рендеринга графика температуры
      var objGraphicD3 = new _graphicD3js2.default(params);
      objGraphicD3.render();

      // отрисовка остальных графиков
      params.id = '#graphic1';
      params.colorPolilyne = '#DDF730';
      objGraphicD3 = new _graphicD3js2.default(params);
      objGraphicD3.render();

      params.id = '#graphic2';
      params.colorPolilyne = '#FEB020';
      objGraphicD3 = new _graphicD3js2.default(params);
      objGraphicD3.render();

      params.id = '#graphic3';
      params.colorPolilyne = '#FEB020';
      objGraphicD3 = new _graphicD3js2.default(params);
      objGraphicD3.render();
    }

    /**
     * Отображение графика погоды на неделю
     */

  }, {
    key: 'drawGraphic',
    value: function drawGraphic(arr) {
      this.renderIconsDaysOfWeek(arr);

      var context = this.controls.graphic.getContext('2d');
      this.controls.graphic.width = 465;
      this.controls.graphic.height = 70;

      context.fillStyle = '#fff';
      context.fillRect(0, 0, 600, 300);

      context.font = 'Oswald-Medium, Arial, sans-seri 14px';

      var step = 55;
      var i = 0;
      var zoom = 4;
      var stepY = 64;
      var stepYTextUp = 58;
      var stepYTextDown = 75;
      context.beginPath();
      context.moveTo(step - 10, -1 * arr[i].min * zoom + stepY);
      context.strokeText(arr[i].max + '\xBA', step, -1 * arr[i].max * zoom + stepYTextUp);
      context.lineTo(step - 10, -1 * arr[i].max * zoom + stepY);
      i += 1;
      while (i < arr.length) {
        step += 55;
        context.lineTo(step, -1 * arr[i].max * zoom + stepY);
        context.strokeText(arr[i].max + '\xBA', step, -1 * arr[i].max * zoom + stepYTextUp);
        i += 1;
      }
      i -= 1;
      context.lineTo(step + 30, -1 * arr[i].max * zoom + stepY);
      step = 55;
      i = 0;
      context.moveTo(step - 10, -1 * arr[i].min * zoom + stepY);
      context.strokeText(arr[i].min + '\xBA', step, -1 * arr[i].min * zoom + stepYTextDown);
      context.lineTo(step - 10, -1 * arr[i].min * zoom + stepY);
      i += 1;
      while (i < arr.length) {
        step += 55;
        context.lineTo(step, -1 * arr[i].min * zoom + stepY);
        context.strokeText(arr[i].min + '\xBA', step, -1 * arr[i].min * zoom + stepYTextDown);
        i += 1;
      }
      i -= 1;
      context.lineTo(step + 30, -1 * arr[i].min * zoom + stepY);
      context.fillStyle = '#333';
      context.lineTo(step + 30, -1 * arr[i].max * zoom + stepY);
      context.closePath();
      context.strokeStyle = '#333';
      context.stroke();
      context.fill();
    }
  }, {
    key: 'render',
    value: function render() {
      this.getWeatherFromApi();
    }
  }]);

  return WeatherWidget;
}(_customDate2.default);

exports.default = WeatherWidget;

},{"./custom-date":3,"./data/natural-phenomenon-data":4,"./data/wind-speed-data":5,"./graphic-d3js":7,"es6-promise":12}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"_process":13}],13:[function(require,module,exports){
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

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxDb29raWVzLmpzIiwiYXNzZXRzXFxqc1xcY2l0aWVzLmpzIiwiYXNzZXRzXFxqc1xcY3VzdG9tLWRhdGUuanMiLCJhc3NldHNcXGpzXFxkYXRhXFxuYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXHdpbmQtc3BlZWQtZGF0YS5qcyIsImFzc2V0c1xcanNcXGdlbmVyYXRvci13aWRnZXQuanMiLCJhc3NldHNcXGpzXFxncmFwaGljLWQzanMuanMiLCJhc3NldHNcXGpzXFxwb3B1cC5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIiwibm9kZV9tb2R1bGVzL1N0cmluZy5mcm9tQ29kZVBvaW50L2Zyb21jb2RlcG9pbnQuanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7SUFDcUIsTzs7Ozs7Ozs4QkFFVCxJLEVBQU0sSyxFQUFPO0FBQ3JCLFVBQUksVUFBVSxJQUFJLElBQUosRUFBZDtBQUNBLGNBQVEsT0FBUixDQUFnQixRQUFRLE9BQVIsS0FBcUIsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUF0RDtBQUNBLGVBQVMsTUFBVCxHQUFrQixPQUFPLEdBQVAsR0FBYSxPQUFPLEtBQVAsQ0FBYixHQUE2QixZQUE3QixHQUE0QyxRQUFRLFdBQVIsRUFBNUMsR0FBcUUsVUFBdkY7QUFDRDs7QUFFRDs7Ozs4QkFDVSxJLEVBQU07QUFDZCxVQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLElBQUksTUFBSixDQUNsQyxhQUFhLEtBQUssT0FBTCxDQUFhLDhCQUFiLEVBQTZDLE1B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VixtQkFBTSxFQXpCSTtBQTBCVixtQkFBTSxFQTFCSTtBQTJCVixtQkFBTSxFQTNCSTtBQTRCVixtQkFBTSxFQTVCSTtBQTZCVixtQkFBTSxFQTdCSTtBQThCVixtQkFBTSxFQTlCSTtBQStCVixtQkFBTSxFQS9CSTtBQWdDVixtQkFBTSxFQWhDSTtBQWlDVixtQkFBTSxFQWpDSTtBQWtDVixtQkFBTSxFQWxDSTtBQW1DVixtQkFBTSxFQW5DSTtBQW9DVixtQkFBTSxFQXBDSTtBQXFDVixtQkFBTSxFQXJDSTtBQXNDVixtQkFBTSxFQXRDSTtBQXVDVixtQkFBTSxFQXZDSTtBQXdDVixtQkFBTSxFQXhDSTtBQXlDVixtQkFBTSxFQXpDSTtBQTBDVixtQkFBTSxFQTFDSTtBQTJDVixtQkFBTSxFQTNDSTtBQTRDVixtQkFBTSxFQTVDSTtBQTZDVixtQkFBTSxFQTdDSTtBQThDVixtQkFBTSxFQTlDSTtBQStDVixtQkFBTSxFQS9DSTtBQWdEVixtQkFBTSxFQWhESTtBQWlEVixtQkFBTSxFQWpESTtBQWtEVixtQkFBTSxFQWxESTtBQW1EVixtQkFBTSxFQW5ESTtBQW9EVixtQkFBTSxFQXBESTtBQXFEVixtQkFBTSxFQXJESTtBQXNEVixtQkFBTSxFQXRESTtBQXVEVixtQkFBTSxFQXZESTtBQXdEVixtQkFBTSxFQXhESTtBQXlEVixtQkFBTSxFQXpESTtBQTBEVixtQkFBTSxFQTFESTtBQTJEVixtQkFBTSxFQTNESTtBQTREVixtQkFBTSxFQTVESTtBQTZEVixtQkFBTSxFQTdESTtBQThEVixtQkFBTSxFQTlESTtBQStEVixtQkFBTSxFQS9ESTtBQWdFVixtQkFBTSxFQWhFSTtBQWlFVixtQkFBTSxFQWpFSTtBQWtFVixtQkFBTSxFQWxFSTtBQW1FVixtQkFBTSxFQW5FSTtBQW9FVixtQkFBTSxFQXBFSTtBQXFFVixtQkFBTSxFQXJFSTtBQXNFVixtQkFBTSxFQXRFSTtBQXVFVixtQkFBTSxFQXZFSTtBQXdFVixtQkFBTSxFQXhFSTtBQXlFVixtQkFBTSxFQXpFSTtBQTBFVixtQkFBTTtBQTFFSTtBQUhW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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0b0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8g0KDQsNCx0L7RgtCwINGBINC60YPQutCw0LzQuFxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb29raWVzIHtcclxuXHJcbiAgc2V0Q29va2llKG5hbWUsIHZhbHVlKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9IG5ldyBEYXRlKCk7XHJcbiAgICBleHBpcmVzLnNldFRpbWUoZXhwaXJlcy5nZXRUaW1lKCkgKyAoMTAwMCAqIDYwICogNjAgKiAyNCkpO1xyXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiOyBleHBpcmVzPVwiICsgZXhwaXJlcy50b0dNVFN0cmluZygpICsgIFwiOyBwYXRoPS9cIjtcclxuICB9XHJcblxyXG4gIC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCIGNvb2tpZSDRgSDQuNC80LXQvdC10LwgbmFtZSwg0LXRgdC70Lgg0LXRgdGC0YwsINC10YHQu9C4INC90LXRgiwg0YLQviB1bmRlZmluZWRcclxuICBnZXRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cChcclxuICAgICAgXCIoPzpefDsgKVwiICsgbmFtZS5yZXBsYWNlKC8oW1xcLiQ/Knx7fVxcKFxcKVxcW1xcXVxcXFxcXC9cXCteXSkvZywgJ1xcXFwkMScpICsgXCI9KFteO10qKVwiXHJcbiAgICApKTtcclxuICAgIHJldHVybiBtYXRjaGVzID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZXNbMV0pIDogdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQ29va2llKCkge1xyXG4gICAgdGhpcy5zZXRDb29raWUobmFtZSwgXCJcIiwge1xyXG4gICAgICBleHBpcmVzOiAtMVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxyXG4qL1xyXG5cclxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcclxucmVxdWlyZSgnU3RyaW5nLmZyb21Db2RlUG9pbnQnKTtcclxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XHJcbmltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXRpZXMge1xyXG5cclxuICBjb25zdHJ1Y3RvcihjaXR5TmFtZSwgY29udGFpbmVyKSB7XHJcblxyXG4gICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHJcbiAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcbiAgICB0aGlzLnVuaXRzID0gZ2VuZXJhdGVXaWRnZXQudW5pdHNUZW1wWzFdO1xyXG4gICAgaWYgKCFjaXR5TmFtZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaXR5TmFtZSA9IGNpdHlOYW1lLnZhbHVlLnJlcGxhY2UoLyhcXHMpKy9nLCctJykudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyIHx8ICcnO1xyXG4gICAgdGhpcy51cmwgPSBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vL29wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9maW5kP3E9JHt0aGlzLmNpdHlOYW1lfSZ0eXBlPWxpa2Umc29ydD1wb3B1bGF0aW9uJmNudD0zMCZhcHBpZD1iMWIxNWU4OGZhNzk3MjI1NDEyNDI5YzFjNTBjMTIyYTFgO1xyXG5cclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICB0aGlzLnNlbENpdHlTaWduLmlubmVyVGV4dCA9ICcgc2VsZWN0ZWQgJztcclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24uY2xhc3MgPSAnd2lkZ2V0LWZvcm1fX3NlbGVjdGVkJztcclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LmNvbnRyb2xzV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC51cmxzKTtcclxuXHJcbiAgICBvYmpXaWRnZXQucmVuZGVyKCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q2l0aWVzKCkge1xyXG4gICAgaWYgKCF0aGlzLmNpdHlOYW1lKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybClcclxuICAgICAgLnRoZW4oXHJcbiAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoRGF0YShyZXNwb25zZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXRTZWFyY2hEYXRhKEpTT05vYmplY3QpIHtcclxuICAgIGlmICghSlNPTm9iamVjdC5saXN0Lmxlbmd0aCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnQ2l0eSBub3QgZm91bmQnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCj0LTQsNC70Y/QtdC8INGC0LDQsdC70LjRhtGDLCDQtdGB0LvQuCDQtdGB0YLRjFxyXG4gICAgY29uc3QgdGFibGVDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xyXG4gICAgaWYgKHRhYmxlQ2l0eSkge1xyXG4gICAgICB0YWJsZUNpdHkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWJsZUNpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBodG1sID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IEpTT05vYmplY3QubGlzdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBuYW1lID0gYCR7SlNPTm9iamVjdC5saXN0W2ldLm5hbWV9LCAke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeX1gO1xyXG4gICAgICBjb25zdCBmbGFnID0gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1hZ2VzL2ZsYWdzLyR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5LnRvTG93ZXJDYXNlKCl9LnBuZ2A7XHJcbiAgICAgIGh0bWwgKz0gYDx0cj48dGQgY2xhc3M9XCJ3aWRnZXQtZm9ybV9faXRlbVwiPjxhIGhyZWY9XCIvY2l0eS8ke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIiBpZD1cIiR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGNsYXNzPVwid2lkZ2V0LWZvcm1fX2xpbmtcIj4ke25hbWV9PC9hPjxpbWcgc3JjPVwiJHtmbGFnfVwiPjwvcD48L3RkPjwvdHI+YDtcclxuICAgIH1cclxuXHJcbiAgICBodG1sID0gYDx0YWJsZSBjbGFzcz1cInRhYmxlXCIgaWQ9XCJ0YWJsZS1jaXRpZXNcIj4ke2h0bWx9PC90YWJsZT5gO1xyXG4gICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICBjb25zdCB0YWJsZUNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1jaXRpZXMnKTtcclxuXHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICB0YWJsZUNpdGllcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAoJ0EnKS50b0xvd2VyQ2FzZSgpICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dpZGdldC1mb3JtX19saW5rJykpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDaXR5ID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkQ2l0eScpO1xyXG4gICAgICAgIGlmICghc2VsZWN0ZWRDaXR5KSB7XHJcbiAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhhdC5zZWxDaXR5U2lnbiwgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICAgIC8vINCf0L7QtNGB0YLQsNC90L7QstC60LAg0L3QsNC50LTQtdC90L7Qs9C+INCz0L7RgNC+0LTQsFxyXG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LmNpdHlJZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC5jaXR5TmFtZSA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcclxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC51bml0cyA9IHRoaXMudW5pdHM7XHJcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKGV2ZW50LnRhcmdldC5pZCwgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcclxuICAgICAgICAgIHdpbmRvdy5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XHJcbiAgICAgICAgICB3aW5kb3cuY2l0eU5hbWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XHJcblxyXG5cclxuICAgICAgICAgIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQuY29udHJvbHNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LnVybHMpO1xyXG4gICAgICAgICAgb2JqV2lkZ2V0LnJlbmRlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXHJcbiAgKiBAcGFyYW0gdXJsXHJcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAqL1xyXG4gIGh0dHBHZXQodXJsKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKG51bGwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxyXG4qL1xyXG5cclxuLy8g0KDQsNCx0L7RgtCwINGBINC00LDRgtC+0LlcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRGF0ZSBleHRlbmRzIERhdGUge1xyXG5cclxuICAvKipcclxuICAqINC80LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDINCyINGC0YDQtdGF0YDQsNC30YDRj9C00L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60LhcclxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbnVtYmVyIFvRh9C40YHQu9C+INC80LXQvdC10LUgOTk5XVxyXG4gICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cclxuICAqL1xyXG4gIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKSB7XHJcbiAgICBpZiAobnVtYmVyID4gMzY1KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChudW1iZXIgPCAxMCkge1xyXG4gICAgICByZXR1cm4gYDAwJHtudW1iZXJ9YDtcclxuICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwKSB7XHJcbiAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVtYmVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LIg0LPQvtC00YNcclxuICAqIEBwYXJhbSAge2RhdGV9IGRhdGUg0JTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7aW50ZWdlcn0gINCf0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0LIg0LPQvtC00YNcclxuICAqL1xyXG4gIGNvbnZlcnREYXRlVG9OdW1iZXJEYXkoZGF0ZSkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICBjb25zdCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgcmV0dXJuIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAqL1xyXG4gIGNvbnZlcnROdW1iZXJEYXlUb0RhdGUoZGF0ZSkge1xyXG4gICAgY29uc3QgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICBjb25zdCBsaW5lID0gcmUuZXhlYyhkYXRlKTtcclxuICAgIGNvbnN0IGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xyXG4gICAgY29uc3QgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgKGxpbmVbM10gKiAxMDAwICogNjAgKiA2MCAqIDI0KTtcclxuICAgIGNvbnN0IHJlcyA9IG5ldyBEYXRlKHVuaXh0aW1lKTtcclxuXHJcbiAgICBjb25zdCBtb250aCA9IHJlcy5nZXRNb250aCgpICsgMTtcclxuICAgIGNvbnN0IGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgeWVhciA9IHJlcy5nZXRGdWxsWWVhcigpO1xyXG4gICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWAgOiBkYXlzfS4ke21vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRofS4ke3llYXJ9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC00LDRgtGLINCy0LjQtNCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqIEBwYXJhbSAge2RhdGUxfSBkYXRlINC00LDRgtCwINCyINGE0L7RgNC80LDRgtC1IHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge3N0cmluZ30gINC00LDRgtCwINCy0LLQuNC00LUg0YHRgtGA0L7QutC4INGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqL1xyXG4gIGZvcm1hdERhdGUoZGF0ZTEpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlMSk7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcblxyXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoIDwgMTApID8gYDAke21vbnRofWAgOiBtb250aH0gLSAkeyhkYXkgPCAxMCkgPyBgMCR7ZGF5fWAgOiBkYXl9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgtC10LrRg9GJ0YPRjiDQvtGC0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Rg9GOINC00LDRgtGDIHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge1tzdHJpbmddfSDRgtC10LrRg9GJ0LDRjyDQtNCw0YLQsFxyXG4gICovXHJcbiAgZ2V0Q3VycmVudERhdGUoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0RGF0ZShub3cpO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICBnZXREYXRlTGFzdFRocmVlTW9udGgoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICBsZXQgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgIGRheSAtPSA5MDtcclxuICAgIGlmIChkYXkgPCAwKSB7XHJcbiAgICAgIHllYXIgLT0gMTtcclxuICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0Q3VycmVudFNwcmluZ0RhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTAzLTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDUtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0L/RgNC10LTRi9C00YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldExhc3RTdW1tZXJEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSAtIDE7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICBnZXRGaXJzdERhdGVDdXJZZWFyKCkge1xyXG4gICAgcmV0dXJuIGAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gLSAwMDFgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGhoOm1tXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgY29uc3QgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgcmV0dXJuIGAke2hvdXJzIDwgMTAgPyBgMCR7aG91cnN9YCA6IGhvdXJzfSA6ICR7bWludXRlcyA8IDEwID8gYDAke21pbnV0ZXN9YCA6IG1pbnV0ZXN9IGA7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxyXG4gICogQHBhcmFtIHVuaXh0aW1lXHJcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICovXHJcbiAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICB9XHJcblxyXG4gIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxyXG4gICogQHBhcmFtIGRheU51bWJlclxyXG4gICogQHJldHVybnMge3N0cmluZ31cclxuICAqL1xyXG4gIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpIHtcclxuICAgIGNvbnN0IGRheXMgPSB7XHJcbiAgICAgIDA6ICdTdW4nLFxyXG4gICAgICAxOiAnTW9uJyxcclxuICAgICAgMjogJ1R1ZScsXHJcbiAgICAgIDM6ICdXZWQnLFxyXG4gICAgICA0OiAnVGh1JyxcclxuICAgICAgNTogJ0ZyaScsXHJcbiAgICAgIDY6ICdTYXQnLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBkYXlzW2RheU51bWJlcl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC10YDQvdGD0YLRjCDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LzQtdGB0Y/RhtCwINC/0L4g0LXQs9C+INC90L7QvNC10YDRg1xyXG4gICAqIEBwYXJhbSBudW1Nb250aFxyXG4gICAqIEByZXR1cm5zIHsqfVxyXG4gICAqL1xyXG4gIGdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIobnVtTW9udGgpe1xyXG5cclxuICAgIGlmKHR5cGVvZiBudW1Nb250aCAhPT0gXCJudW1iZXJcIiB8fCBudW1Nb250aCA8PTAgJiYgbnVtTW9udGggPj0gMTIpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGhOYW1lID0ge1xyXG4gICAgICAwOiBcIkphblwiLFxyXG4gICAgICAxOiBcIkZlYlwiLFxyXG4gICAgICAyOiBcIk1hclwiLFxyXG4gICAgICAzOiBcIkFwclwiLFxyXG4gICAgICA0OiBcIk1heVwiLFxyXG4gICAgICA1OiBcIkp1blwiLFxyXG4gICAgICA2OiBcIkp1bFwiLFxyXG4gICAgICA3OiBcIkF1Z1wiLFxyXG4gICAgICA4OiBcIlNlcFwiLFxyXG4gICAgICA5OiBcIk9jdFwiLFxyXG4gICAgICAxMDogXCJOb3ZcIixcclxuICAgICAgMTE6IFwiRGVjXCJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG1vbnRoTmFtZVtudW1Nb250aF07XHJcbiAgfVxyXG5cclxuICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgKlxyXG4gICovXHJcbiAgY29tcGFyZURhdGVzV2l0aFRvZGF5KGRhdGUpIHtcclxuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKSB7XHJcbiAgICBjb25zdCByZSA9IC8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcclxuICAgIGNvbnN0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgaWYgKHJlc0RhdGUubGVuZ3RoID09PSA2KSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKTtcclxuICAgIH1cclxuICAgIC8vINCV0YHQu9C4INC00LDRgtCwINC90LUg0YDQsNGB0L/QsNGA0YHQtdC90LAg0LHQtdGA0LXQvCDRgtC10LrRg9GJ0YPRjlxyXG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBISDpNTSBNb250aE5hbWUgTnVtYmVyRGF0ZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0VGltZURhdGVISE1NTW9udGhEYXkoKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiBgJHtkYXRlLmdldEhvdXJzKCkgPCAxMCA/IGAwJHtkYXRlLmdldEhvdXJzKCl9YCA6IGRhdGUuZ2V0SG91cnMoKSB9OiR7ZGF0ZS5nZXRNaW51dGVzKCkgPCAxMCA/IGAwJHtkYXRlLmdldE1pbnV0ZXMoKX1gIDogZGF0ZS5nZXRNaW51dGVzKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9ICR7ZGF0ZS5nZXREYXRlKCl9YDtcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjAuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBjb25zdCBuYXR1cmFsUGhlbm9tZW5vbiA9e1xyXG4gICAgXCJlblwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkVuZ2xpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGVhdnkgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwic2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcImhlYXZ5IHNob3dlciByYWluIGFuZCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibW9kZXJhdGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcInJhZ2dlZCBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGlnaHQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInNob3dlciBzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwibGlnaHQgcmFpbiBhbmQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwicmFpbiBhbmQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwibGlnaHQgc2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJoZWF2eSBzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImhhemVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmQsZHVzdCB3aGlybHNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwic2FuZFwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiZHVzdFwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwidm9sY2FuaWMgYXNoXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJzcXVhbGxzXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjbGVhciBza3lcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwic2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwibGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJnZW50bGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJtb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcImZyZXNoIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwic3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiaGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcImdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcInNldmVyZSBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwidmlvbGVudCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiaHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJydVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlJ1c3NpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2ZcXHUwNDQwXFx1MDQzZVxcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0MzJcXHUwNDNlXFx1MDQzN1xcdTA0M2NcXHUwNDNlXFx1MDQzNlxcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzNlxcdTA0MzVcXHUwNDQxXFx1MDQ0MlxcdTA0M2VcXHUwNDNhXFx1MDQzMFxcdTA0NGYgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2RcXHUwNDRjIFxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDM4XFx1MDQzZFxcdTA0NDJcXHUwNDM1XFx1MDQzZFxcdTA0NDFcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQzZVxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcXHUwNDNiXFx1MDQ0Y1xcdTA0NDhcXHUwNDNlXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQ0ZlxcdTA0M2FcXHUwNDNlXFx1MDQ0MlxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQ0N1xcdTA0MzBcXHUwNDNkXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0ZlxcdTA0NDFcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0M2ZcXHUwNDMwXFx1MDQ0MVxcdTA0M2NcXHUwNDQzXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0MzhcXHUwNDQ3XFx1MDQzNVxcdTA0NDFcXHUwNDNhXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDM2XFx1MDQzMFxcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzNVxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJpdFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkl0YWxpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dpYSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRlbXBvcmFsZSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImZvcnRlIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwaW9nZ2lhIGxlZ2dlcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBpb2dnaWEgbW9kZXJhdGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImZvcnRlIHBpb2dnaWFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBpb2dnaWEgZm9ydGlzc2ltYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicGlvZ2dpYSBlc3RyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwaW9nZ2lhIGdlbGF0YVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImZvcnRlIG5ldmljYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJuZXZpc2NoaW9cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImZvcnRlIG5ldmljYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJmb3NjaGlhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1vXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJmb3NjaGlhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJtdWxpbmVsbGkgZGkgc2FiYmlhXFwvcG9sdmVyZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibmViYmlhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBzZXJlbm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInBvY2hlIG51dm9sZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViaSBzcGFyc2VcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51Ymkgc3BhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJjaWVsbyBjb3BlcnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YSB0cm9waWNhbGVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhbm9cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyZWRkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2FsZG9cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5kaW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtb1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQmF2YSBkaSB2ZW50b1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJlenphIGxlZ2dlcmFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyZXp6YSB0ZXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJVcmFnYW5vXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJzcFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlNwYW5pc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgY29uIGxsdXZpYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdlcmEgdG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdWVydGUgdG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRvcm1lbnRhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwibGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImxsdXZpYSB5IGxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImNodWJhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsbHV2aWEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJsbHV2aWEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImxsdXZpYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImxsdXZpYSBtdXkgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJsbHV2aWEgbXV5IGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibGx1dmlhIGhlbGFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1YmFzY28gZGUgbGlnZXJhIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNodWJhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaHViYXNjbyBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiYWd1YW5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJjaHViYXNjbyBkZSBuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJodW1vXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuaWVibGFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInRvcmJlbGxpbm9zIGRlIGFyZW5hXFwvcG9sdm9cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJhY1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlZpZW50byBmbG9qb1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmllbnRvIHN1YXZlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJWaWVudG8gbW9kZXJhZG9cIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWaWVudG8gZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWaWVudG8gZnVlcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhZFwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ1YVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlVrcmFpbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3XFx1MDQ1NiBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZVxcdTA0NGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDNhXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQ0MlxcdTA0M2FcXHUwNDNlXFx1MDQ0N1xcdTA0MzBcXHUwNDQxXFx1MDQzZFxcdTA0NTYgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0M2ZcXHUwNDNlXFx1MDQzY1xcdTA0NTZcXHUwNDQwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0M2FcXHUwNDQwXFx1MDQzOFxcdTA0MzZcXHUwNDMwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzIFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzY1xcdTA0M2VcXHUwNDNhXFx1MDQ0MFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0NDFcXHUwNDM1XFx1MDQ0MFxcdTA0M2ZcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDNhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQ1NlxcdTA0NDlcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzNVxcdTA0NDJcXHUwNDU2XFx1MDQzYlxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDQ3XFx1MDQzOFxcdTA0NDFcXHUwNDQyXFx1MDQzNSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDQ1XFx1MDQzOCBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0NTZcXHUwNDQwXFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQ1NiBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDU2XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzVcXHUwNDMyXFx1MDQ1NlxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0NDFcXHUwNDNmXFx1MDQzNVxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQ1NlxcdTA0NDJcXHUwNDQwXFx1MDQ0ZlxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImRlXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiR2VybWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHZXdpdHRlciBtaXQgUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdld2l0dGVyIG1pdCBzdGFya2VtIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsZWljaHRlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2Nod2VyZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZWluaWdlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdld2l0dGVyIG1pdCBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxlaWNodGVzIE5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIk5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInN0YXJrZXMgTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGVpY2h0ZXIgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIk5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzdGFya2VyIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJOaWVzZWxzY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsZWljaHRlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJzZWhyIHN0YXJrZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlN0YXJrcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIkVpc3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsZWljaHRlIFJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWZ0aWdlIFJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBTY2huZWVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlNjaG5lZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVmdGlnZXIgU2NobmVlZmFsbFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiR3JhdXBlbFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiU2NobmVlc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwidHJcXHUwMGZjYlwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiUmF1Y2hcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkR1bnN0XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTYW5kIFxcLyBTdGF1YnN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJlbFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhcmVyIEhpbW1lbFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZWluIHBhYXIgV29sa2VuXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ3b2xrZW5iZWRlY2t0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9wZW5zdHVybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVycmlrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImthbHRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhlaVxcdTAwZGZcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmRpZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiSGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIldpbmRzdGlsbGVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxlaWNodGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIk1pbGRlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNXFx1MDBlNFxcdTAwZGZpZ2UgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyaXNjaGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0YXJrZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSG9jaHdpbmQsIGFublxcdTAwZTRoZW5kZXIgU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTY2h3ZXJlciBTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkhlZnRpZ2VzIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicHRcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJQb3J0dWd1ZXNlXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidHJvdm9hZGEgY29tIGNodXZhIGxldmVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidHJvdm9hZGEgY29tIGNodXZhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0cm92b2FkYSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0cm92b2FkYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidHJvdm9hZGEgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0cm92b2FkYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidHJvdm9hZGEgY29tIGdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJnYXJvYSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImdhcm9hIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImNodXZhIGxldmVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImNodXZhIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJjaHV2YSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiY2h1dmEgZGUgZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImNodXZhIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJDaHV2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2h1dmEgZGUgaW50ZW5zaWRhZGUgcGVzYWRvXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaHV2YSBtdWl0byBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiQ2h1dmEgRm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImNodXZhIGNvbSBjb25nZWxhbWVudG9cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNodXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHV2YVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2h1dmEgZGUgaW50ZW5zaWRhZGUgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZlIGJyYW5kYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTmV2ZSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImNodXZhIGNvbSBuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJiYW5obyBkZSBuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJOXFx1MDBlOXZvYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtYVxcdTAwZTdhXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZWJsaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0dXJiaWxoXFx1MDBmNWVzIGRlIGFyZWlhXFwvcG9laXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJsaW5hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjXFx1MDBlOXUgY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkFsZ3VtYXMgbnV2ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudXZlbnMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudXZlbnMgcXVlYnJhZG9zXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ0ZW1wbyBudWJsYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YWRlIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmlvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJxdWVudGVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImNvbSB2ZW50b1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJyb1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlJvbWFuaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiZnVydHVuXFx1MDEwMyBjdSBwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImZ1cnR1blxcdTAxMDMgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdXJ0dW5cXHUwMTAzIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZnVydHVuXFx1MDEwMyBhcHJpZ1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgam9hc1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgbWFyZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBtYXJlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbG9haWVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBsb2FpZSB0b3JlblxcdTAyMWJpYWxcXHUwMTAzIFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicGxvYWllIGV4dHJlbVxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBsb2FpZSBcXHUwMGVlbmdoZVxcdTAyMWJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5pbnNvYXJlIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmluc29hcmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5pbnNvYXJlIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibGFwb3ZpXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5pbnNvYXJlIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInZcXHUwMGUycnRlanVyaSBkZSBuaXNpcFwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNlciBzZW5pblwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiY1xcdTAwZTJcXHUwMjFiaXZhIG5vcmlcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm5vcmkgXFx1MDBlZW1wclxcdTAxMDNcXHUwMjE5dGlhXFx1MDIxYmlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImNlciBmcmFnbWVudGF0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJjZXIgYWNvcGVyaXQgZGUgbm9yaVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiZnVydHVuYSB0cm9waWNhbFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwicmVjZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiZmllcmJpbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2YW50IHB1dGVybmljXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmluZGluXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJwbFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlBvbGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkJ1cnphIHogbGVra2ltaSBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkJ1cnphIHogb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJCdXJ6YSB6IGludGVuc3l3bnltaSBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkxla2thIGJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJCdXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiU2lsbmEgYnVyemFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJCdXJ6YSB6IGxla2tcXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiQnVyemEgeiBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkJ1cnphIHogaW50ZW5zeXduXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIkxla2thIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiTVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJJbnRlbnN5d25hIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiTGVra2llIG9wYWR5IGRyb2JuZWdvIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIkRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJJbnRlbnN5d255IGRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJTaWxuYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIkxla2tpIGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiVW1pYXJrb3dhbnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJJbnRlbnN5d255IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiYmFyZHpvIHNpbG55IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiVWxld2FcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIk1hcnpuXFx1MDEwNWN5IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiS3JcXHUwMGYzdGthIHVsZXdhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJEZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIkludGVuc3l3bnksIGxla2tpIGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTGVra2llIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDE1YW5pZWdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk1vY25lIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiRGVzemN6IHplIFxcdTAxNWJuaWVnZW1cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTAxNWFuaWVcXHUwMTdjeWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJNZ2llXFx1MDE0MmthXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJTbW9nXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJaYW1nbGVuaWFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlphbWllXFx1MDEwNyBwaWFza293YVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTWdcXHUwMTQyYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQmV6Y2htdXJuaWVcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkxla2tpZSB6YWNobXVyemVuaWVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlJvenByb3N6b25lIGNobXVyeVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiUG9jaG11cm5vIHogcHJ6ZWphXFx1MDE1Ym5pZW5pYW1pXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJQb2NobXVybm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImJ1cnphIHRyb3Bpa2FsbmFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIkNoXFx1MDE0Mm9kbm9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIkdvclxcdTAxMDVjb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2lldHJ6bmllXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJHcmFkXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTcG9rb2puaWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxla2thIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJEZWxpa2F0bmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlVtaWFya293YW5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTVhd2llXFx1MDE3Y2EgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJQcmF3aWUgd2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiV2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2lsbmEgd2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3p0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJHd2FcXHUwMTQydG93bnkgc3p0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhZ2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJmaVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkZpbm5pc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ1a2tvc215cnNreSBqYSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInBpZW5pIHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwia292YSB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwibGlldlxcdTAwZTQgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInVra29zbXlyc2t5IGphIGtldnl0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidWtrb3NteXJza3kgamEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlldlxcdTAwZTQgdGlodXR0YWluZW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInRpaHV0dGFhXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJrb3ZhIHRpaHV0dGFpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWV2XFx1MDBlNCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwia292YSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGllbmkgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwia29odGFsYWluZW4gc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJlcml0dFxcdTAwZTRpbiBydW5zYXN0YSBzYWRldHRhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImpcXHUwMGU0XFx1MDBlNHRcXHUwMGU0dlxcdTAwZTQgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwicGllbmkgbHVtaXNhZGVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcImx1bWlcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInBhbGpvbiBsdW50YVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiclxcdTAwZTRudFxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImx1bWlrdXVyb1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic2F2dVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiaGlla2thXFwvcFxcdTAwZjZseSBweVxcdTAwZjZycmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInRhaXZhcyBvbiBzZWxrZVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInZcXHUwMGU0aFxcdTAwZTRuIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiYWpvaXR0YWlzaWEgcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJoYWphbmFpc2lhIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwicGlsdmluZW5cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb29wcGluZW4gbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJoaXJtdW15cnNreVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia3lsbVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImt1dW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ0dXVsaW5lblwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwicmFrZWl0YVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJubFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkR1dGNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvbndlZXJzYnVpIG1ldCByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpY2h0ZSBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ6d2FyZSBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvbnJlZ2VsbWF0aWcgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvbndlZXJzYnVpIG1ldCBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpY2h0ZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWNodGUgbW90cmVnZW5cXC9yZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInp3YXJlIG1vdHJlZ2VuXFwvcmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWNodGUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1hdGlnZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInplZXIgendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIktvdWRlIGJ1aWVuXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWNodGUgc3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiendhcmUgc3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGljaHRlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZXZpZ2Ugc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJpanplbFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmF0dGUgc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZXZlbFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiemFuZFxcL3N0b2Ygd2VydmVsaW5nXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJvbmJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImxpY2h0IGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcImhhbGYgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiendhYXIgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiZ2VoZWVsIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bpc2NoZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYWFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrb3VkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJoZWV0XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzdG9ybWFjaHRpZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIldpbmRzdGlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJLYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWNodGUgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlphY2h0ZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTWF0aWdlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJWcmlqIGtyYWNodGlnZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLcmFjaHRpZ2Ugd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGFyZGUgd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3Rvcm1hY2h0aWdcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJad2FyZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiWmVlciB6d2FyZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3JrYWFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJmclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkZyZW5jaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIm9yYWdlIGV0IHBsdWllIGZpbmVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIm9yYWdlIGV0IHBsdWllXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJvcmFnZSBldCBmb3J0ZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJvcmFnZXMgbFxcdTAwZTlnZXJzXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJvcmFnZXNcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImdyb3Mgb3JhZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiT3JhZ2UgYXZlYyBsXFx1MDBlOWdcXHUwMGU4cmUgYnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JvcyBvcmFnZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiQnJ1aW5lIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiQnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJGb3J0ZXMgYnJ1aW5lc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1aWUgZmluZSBcXHUwMGU5cGFyc2VcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBsdWllIGZpbmVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIkNyYWNoaW4gaW50ZW5zZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiQXZlcnNlcyBkZSBicnVpbmVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxcXHUwMGU5Z1xcdTAwZThyZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbHVpZXMgbW9kXFx1MDBlOXJcXHUwMGU5ZXNcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIkZvcnRlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInRyXFx1MDBlOHMgZm9ydGVzIHByXFx1MDBlOWNpcGl0YXRpb25zXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJncm9zc2VzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGx1aWUgdmVyZ2xhXFx1MDBlN2FudGVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBldGl0ZXMgYXZlcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiYXZlcnNlcyBkZSBwbHVpZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiYXZlcnNlcyBpbnRlbnNlc1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibFxcdTAwZTlnXFx1MDBlOHJlcyBuZWlnZXNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZXMgY2h1dGVzIGRlIG5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJuZWlnZSBmb25kdWVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImF2ZXJzZXMgZGUgbmVpZ2VcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImJydW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJCcm91aWxsYXJkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJicnVtZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidGVtcFxcdTAwZWF0ZXMgZGUgc2FibGVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJyb3VpbGxhcmRcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImVuc29sZWlsbFxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInBldSBudWFnZXV4XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwYXJ0aWVsbGVtZW50IGVuc29sZWlsbFxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YWdldXhcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkNvdXZlcnRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZGVcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBcXHUwMGVhdGUgdHJvcGljYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvdXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcm9pZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2hhdWRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRldXhcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyXFx1MDBlYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQnJpc2UgbFxcdTAwZTlnXFx1MDBlOHJlXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzZSBkb3VjZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2UgbW9kXFx1MDBlOXJcXHUwMGU5ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2UgZnJhaWNoZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiQnJpc2UgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgZm9ydCwgcHJlc3F1ZSB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW50IHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbnQgdHJcXHUwMGU4cyB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wXFx1MDBlYXRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJlbXBcXHUwMGVhdGUgdmlvbGVudGVcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk91cmFnYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImJnXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQnVsZ2FyaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDNmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQ0ZlxcdTA0NDkgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MjNcXHUwNDNjXFx1MDQzNVxcdTA0NDBcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDFjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQxNFxcdTA0NGFcXHUwNDM2XFx1MDQzNCBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0NDJcXHUwNDQzXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDFlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQxZlxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQyMVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQxOFxcdTA0MzdcXHUwNDNkXFx1MDQzNVxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0MzJcXHUwNDMwXFx1MDQ0OSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDE0XFx1MDQzOFxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDFmXFx1MDQ0ZlxcdTA0NDFcXHUwNDRhXFx1MDQ0N1xcdTA0M2RcXHUwNDMwXFwvXFx1MDQxZlxcdTA0NDBcXHUwNDMwXFx1MDQ0OFxcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDJmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQ0MVxcdTA0MzVcXHUwNDRmXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDIyXFx1MDQ0YVxcdTA0M2NcXHUwNDNkXFx1MDQzOCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0MjJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcXC9cXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0MjJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDIxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XFx1MDQzNVxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDEzXFx1MDQzZVxcdTA0NDBcXHUwNDM1XFx1MDQ0OVxcdTA0M2UgXFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MTJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJzZVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlN3ZWRpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwMGU1c2thXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTAwZTVza2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9qXFx1MDBlNG1udCBvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJmdWxsdCBcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIm1qdWt0IGR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaFxcdTAwZTVydCBkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibWp1a3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaFxcdTAwZTVydCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibWp1a3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiTVxcdTAwZTV0dGxpZyByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm15Y2tldCBrcmFmdGlndCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwMGY2c3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInVuZGVya3lsdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtanVrdCBcXHUwMGY2c3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImR1c2NoLXJlZ25cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInJlZ25hciBzbVxcdTAwZTVzcGlrXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtanVrIHNuXFx1MDBmNlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25cXHUwMGY2XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJrcmFmdGlndCBzblxcdTAwZjZmYWxsXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzblxcdTAwZjZibGFuZGF0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuXFx1MDBmNm92XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZGltbWFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2dnXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJkaXNcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZGltbWlndFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhciBoaW1tZWxcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIm5cXHUwMGU1Z3JhIG1vbG5cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNwcmlkZGEgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibW9sbmlndFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDBmNnZlcnNrdWdnYW5kZSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlzayBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImthbGx0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJ2YXJtdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiYmxcXHUwMGU1c2lndFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiemhfdHdcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFRyYWRpdGlvbmFsXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHU1MWNkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1NWMwZlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTU5MjdcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHU5NmU4XFx1NTkzZVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2NjNcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHU4NTg0XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1NzE1OVxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHU2Yzk5XFx1NjVjYlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTU5MjdcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHU2Njc0XFx1ZmYwY1xcdTVjMTFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTk2NzBcXHVmZjBjXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTlmOGRcXHU2MzcyXFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzFiMVxcdTVlMzZcXHU5OGE4XFx1NjZiNFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1OThiNlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTUxYjdcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcxYjFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTU5MjdcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHU1MWIwXFx1OTZmOVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ0clwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlR1cmtpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiSGFmaWYgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiU2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDE1ZWlkZGV0bGkgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQXJhbFxcdTAxMzFrbFxcdTAxMzEgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBoYWZpZiB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiWWVyIHllciBoYWZpZiB5b1xcdTAxMWZ1bmx1a2x1IHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiWWVyIHllciBoYWZpZiB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiWWVyIHllciBzYVxcdTAxMWZhbmFrIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIkhhZmlmIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiT3J0YSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTAxNWVpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDBjN29rIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiQVxcdTAxNWZcXHUwMTMxclxcdTAxMzEgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJZYVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxIHZlIHNvXFx1MDExZnVrIGhhdmFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiSGFmaWYga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIkthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJZb1xcdTAxMWZ1biBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiS2FybGEga2FyXFx1MDEzMVxcdTAxNWZcXHUwMTMxayB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbFxcdTAwZmMga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJIYWZpZiBzaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiS3VtXFwvVG96IGZcXHUwMTMxcnRcXHUwMTMxbmFzXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkFcXHUwMGU3XFx1MDEzMWtcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkF6IGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYXogYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJLYXBhbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIkthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BpayBmXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIb3J0dW1cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTAwYzdvayBTb1xcdTAxMWZ1a1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDBjN29rIFNcXHUwMTMxY2FrXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiRG9sdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIkR1cmd1blwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiU2FraW5cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkhhZmlmIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJBeiBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiT3J0YSBTZXZpeWUgUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLdXZ2ZXRsaSBSXFx1MDBmY3pnYXJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlNlcnQgUlxcdTAwZmN6Z2FyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwMTVlaWRkZXRsaSBGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwMTVlaWRkZXRsaSBLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZWlkZGV0bGkgS2FzXFx1MDEzMXJnYVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiemhfY25cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFNpbXBsaWZpZWRcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1NGUyZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1NjZiNFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTUxYmJcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1NTkyN1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTM5XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1OTYzNVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MGRmXFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1ODU4NFxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTZjOTlcXHU2NWNiXFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTY2NzRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTY2NzRcXHVmZjBjXFx1NWMxMVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1OTYzNFxcdWZmMGNcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY5OVxcdTUzNzdcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHU3MGVkXFx1NWUyNlxcdTk4Y2VcXHU2NmI0XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHU5OGQzXFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1NzBlZFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1NTkyN1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImN6XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ3plY2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2xhYlxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiYm91XFx1MDE1OWthIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJcXHUwMTYxXFx1MDBlZCBib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2lsblxcdTAwZTEgYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJib3VcXHUwMTU5a292XFx1MDBlMSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiYm91XFx1MDE1OWthIHNlIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImJvdVxcdTAxNTlrYSBzIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibXJob2xlblxcdTAwZWQgcyBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwibXJob2xlblxcdTAwZWQgYSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwibXJob2xlblxcdTAwZWQgYSBzaWxuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwicHJ1ZGtcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBcXHUwMTU5XFx1MDBlZHZhbG92XFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwclxcdTAxNmZ0clxcdTAxN2UgbXJhXFx1MDEwZGVuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpub3VjXFx1MDBlZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtXFx1MDBlZHJuXFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJodXN0XFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJ6bXJ6bFxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic21cXHUwMGVkXFx1MDE2MWVuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcImRcXHUwMGU5XFx1MDE2MVxcdTAxNjUgc2Ugc25cXHUwMTFiaGVtXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbGFiXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzaWxuXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtbGhhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJrb3VcXHUwMTU5XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJvcGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwXFx1MDBlZHNlXFx1MDEwZG5cXHUwMGU5IFxcdTAxMGRpIHByYWNob3ZcXHUwMGU5IHZcXHUwMGVkcnlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImh1c3RcXHUwMGUxIG1saGFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInBcXHUwMGVkc2VrXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxbm9cIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInNvcGVcXHUwMTBkblxcdTAwZmQgcG9wZWxcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInBydWRrXFx1MDBlOSBib3VcXHUwMTU5ZVwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInNrb3JvIGphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInphdGFcXHUwMTdlZW5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBib3VcXHUwMTU5ZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9ya29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZcXHUwMTFidHJub1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRcXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJiZXp2XFx1MDExYnRcXHUwMTU5XFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwidlxcdTAwZTFuZWtcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcInZcXHUwMTFidFxcdTAxNTlcXHUwMGVka1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwibVxcdTAwZWRyblxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwZGVyc3R2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJzaWxuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJwcnVka1xcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiYm91XFx1MDE1OWxpdlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwidmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcInNpbG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJtb2h1dG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwia3JcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJLb3JlYVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRodW5kZXJzdG9ybSB3aXRoIHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2h0IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInJhZ2dlZCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibW9kZXJhdGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNub3dcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImhhemVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRcXC9kdXN0IHdoaXJsc1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZm9nXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJza3kgaXMgY2xlYXJcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJnbFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkdhbGljaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGludGVuc29cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIm9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwib3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwib3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaG9pdmEgZSBvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImNob2l2YSBlIG9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImNob2l2YSBlIG9yYmFsbG8gZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwib3JiYWxsbyBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiY2hvaXZhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImNob2l2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2hvaXZhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImNob2l2YSBtb2kgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImNob2l2YSBleHRyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaG9pdmEgeGVhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNob2l2YSBkZSBkdWNoYSBkZSBiYWl4YSBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2hvaXZhIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2YWRhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJhdWdhbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmV2ZSBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiblxcdTAwZTlib2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bWVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5cXHUwMGU5Ym9hIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInJlbXVpXFx1MDBmMW9zIGRlIGFyZWEgZSBwb2x2b1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJ1bWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNlbyBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwic2FyYWJpYVwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlZlbnRvIGZyb3V4b1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmVudG8gc3VhdmVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlZlbnRvIG1vZGVyYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiVmVudG8gZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnRvIGZvcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkZSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiRnVyYWNcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidmlcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJ2aWV0bmFtZXNlXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBNXFx1MDFiMGEgbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gY1xcdTAwZjMgY2hcXHUxZWRicCBnaVxcdTFlYWR0XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJCXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkJcXHUwMGUzbyB2XFx1MDBlMGkgblxcdTAxYTFpXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTAwZTFuaCBzXFx1MDBlMW5nIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtXFx1MDFiMGEgdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5biBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJtXFx1MDFiMGEgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDFiMGEgdlxcdTFlZWJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJtXFx1MDFiMGEgY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibVxcdTAxYjBhIHJcXHUxZWE1dCBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJtXFx1MDFiMGEgbFxcdTFlZDFjXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtXFx1MDFiMGEgbFxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG9cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwidHV5XFx1MWViZnQgclxcdTAxYTFpIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwidHV5XFx1MWViZnRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInR1eVxcdTFlYmZ0IG5cXHUxZWI3bmcgaFxcdTFlYTF0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJtXFx1MDFiMGEgXFx1MDExMVxcdTAwZTFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInR1eVxcdTFlYmZ0IG1cXHUwMGY5IHRyXFx1MWVkZGlcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUxZWRkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJraFxcdTAwZjNpIGJcXHUxZWU1aVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDExMVxcdTAwZTFtIG1cXHUwMGUyeVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiYlxcdTAwZTNvIGNcXHUwMGUxdCB2XFx1MDBlMCBsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwic1xcdTAxYjBcXHUwMWExbmcgbVxcdTAwZjlcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImJcXHUxZWE3dSB0clxcdTFlZGRpIHF1YW5nIFxcdTAxMTFcXHUwMGUzbmdcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIm1cXHUwMGUyeSB0aFxcdTAxYjBhXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJtXFx1MDBlMnkgclxcdTFlYTNpIHJcXHUwMGUxY1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibVxcdTAwZTJ5IGNcXHUxZWU1bVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibVxcdTAwZTJ5IFxcdTAxMTFlbiB1IFxcdTAwZTFtXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiY1xcdTAxYTFuIGJcXHUwMGUzbyBuaGlcXHUxZWM3dCBcXHUwMTExXFx1MWVkYmlcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImJcXHUwMGUzbyBsXFx1MWVkMWNcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImxcXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIm5cXHUwMGYzbmdcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImdpXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwibVxcdTAxYjBhIFxcdTAxMTFcXHUwMGUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJDaFxcdTFlYmYgXFx1MDExMVxcdTFlY2RcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIk5oXFx1MWViOSBuaFxcdTAwZTBuZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDBjMW5oIHNcXHUwMGUxbmcgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHXFx1MDBlZG8gdGhvXFx1MWVhM25nXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJHaVxcdTAwZjMgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJHaVxcdTAwZjMgdlxcdTFlZWJhIHBoXFx1MWVhM2lcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkdpXFx1MDBmMyBtXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJHaVxcdTAwZjMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiTFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiQlxcdTAwZTNvIGNcXHUxZWE1cCBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkJcXHUwMGUzbyBsXFx1MWVkMWNcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImFyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQXJhYmljXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyM1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA2MjdcXHUwNjQ0XFx1MDYzOVxcdTA2NDhcXHUwNjI3XFx1MDYzNVxcdTA2NDEgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyN1xcdTA2NDRcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmJcXHUwNjQyXFx1MDY0YVxcdTA2NDRcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDYzNFxcdTA2NDZcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MSBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MSBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDY0NVxcdTA2MmFcXHUwNjQ4XFx1MDYzM1xcdTA2MzcgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM5XFx1MDYyN1xcdTA2NDRcXHUwNjRhIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjI4XFx1MDYzMVxcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2NDdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDYzNVxcdTA2NDJcXHUwNjRhXFx1MDYzOVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNjM2XFx1MDYyOFxcdTA2MjdcXHUwNjI4XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNjJmXFx1MDYyZVxcdTA2MjdcXHUwNjQ2XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNjNhXFx1MDYyOFxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA2MzNcXHUwNjQ1XFx1MDYyN1xcdTA2MjEgXFx1MDYzNVxcdTA2MjdcXHUwNjQxXFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA2M2FcXHUwNjI3XFx1MDYyNlxcdTA2NDUgXFx1MDYyY1xcdTA2MzJcXHUwNjI2XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDVcXHUwNjJhXFx1MDY0MVxcdTA2MzFcXHUwNjQyXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDZcXHUwNjI3XFx1MDYyYlxcdTA2MzFcXHUwNjQ3XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDJcXHUwNjI3XFx1MDYyYVxcdTA2NDVcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYyN1xcdTA2MzNcXHUwNjJhXFx1MDY0OFxcdTA2MjdcXHUwNjI2XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA2MzJcXHUwNjQ4XFx1MDY0YVxcdTA2MzlcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNjI4XFx1MDYyN1xcdTA2MzFcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNjJkXFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA2MzFcXHUwNjRhXFx1MDYyN1xcdTA2MmRcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYyZlxcdTA2MjdcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcXHUwNjQ3XFx1MDYyN1xcdTA2MmZcXHUwNjI2XCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NFxcdTA2MzdcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQ1XFx1MDYzOVxcdTA2MmFcXHUwNjJmXFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjM5XFx1MDY0NFxcdTA2NGFcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDYzMVxcdTA2NGFcXHUwNjI3XFx1MDYyZCBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzlcXHUwNjQ2XFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwibWtcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJNYWNlZG9uaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzZlxcdTA0MzBcXHUwNDMyXFx1MDQzOFxcdTA0NDZcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MVxcdTA0M2NcXHUwNDNlXFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzNVxcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDM1XFx1MDQ0MVxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0NDBcXHUwNDQyXFx1MDQzYlxcdTA0M2VcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0N1xcdTA0MzhcXHUwNDQxXFx1MDQ0MlxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZFxcdTA0MzVcXHUwNDNhXFx1MDQzZVxcdTA0M2JcXHUwNDNhXFx1MDQ0MyBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0M2VcXHUwNDM0XFx1MDQzMlxcdTA0M2VcXHUwNDM1XFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDNmXFx1MDQzYlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXFx1MDQxN1xcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA0MWNcXHUwNDM4XFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDQyMVxcdTA0MzJcXHUwNDM1XFx1MDQzNiBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNDFkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNDExXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNrXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU2xvdmFrXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiYlxcdTAwZmFya2Egc28gc2xhYlxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiYlxcdTAwZmFya2EgcyBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImJcXHUwMGZhcmthIHNvIHNpbG5cXHUwMGZkbSBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIm1pZXJuYSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNpbG5cXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJwcnVka1xcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImJcXHUwMGZhcmthIHNvIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImJcXHUwMGZhcmthIHMgbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzaWxuXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJqZW1uXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1pZXJueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZVxcdTAxM2VtaSBzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW1ueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpuXFx1MDBmYWNpIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInNsYWJcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInNsYWJcXHUwMGU5IHNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwic2lsblxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImRcXHUwMGUxXFx1MDE3ZVxcdTAxMGYgc28gc25laG9tXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmVob3ZcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJobWxhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJkeW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInBpZXNrb3ZcXHUwMGU5XFwvcHJhXFx1MDE2MW5cXHUwMGU5IHZcXHUwMGVkcnlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImhtbGFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25cXHUwMGUxIG9ibG9oYVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwidGFrbWVyIGphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInphbXJhXFx1MDEwZGVuXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInppbWFcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvclxcdTAwZmFjb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmV0ZXJub1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRpZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiTmFzdGF2ZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQmV6dmV0cmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJTbGFiXFx1MDBmZCB2XFx1MDBlMW5va1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiSmVtblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJTdHJlZG5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwY2Vyc3R2XFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2lsblxcdTAwZmQgdmlldG9yLCB0YWttZXIgdlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuXFx1MDBlMSB2XFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiQlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIk5pXFx1MDEwZGl2XFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyaWtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaHVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJIdW5nYXJpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ2aWhhciBlbnloZSBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInZpaGFyIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidmloYXIgaGV2ZXMgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJlbnloZSB6aXZhdGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGV2ZXMgdmloYXJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImR1cnZhIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ2aWhhciBlbnloZSBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidmloYXIgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInZpaGFyIGVyXFx1MDE1MXMgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiZW55aGUgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJrXFx1MDBmNnplcGVzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGV2ZXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJuYWd5b24gaGV2ZXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW0gZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwMGYzbm9zIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJlbnloZSBoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJlclxcdTAxNTFzIGhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImhhdmFzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiaFxcdTAwZjN6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZ3llbmdlIGtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImhvbW9rdmloYXJcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidGlzenRhIFxcdTAwZTlnYm9sdFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwia2V2XFx1MDBlOXMgZmVsaFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInN6XFx1MDBmM3J2XFx1MDBlMW55b3MgZmVsaFxcdTAxNTF6ZXRcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImVyXFx1MDE1MXMgZmVsaFxcdTAxNTF6ZXRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImJvclxcdTAwZmFzIFxcdTAwZTlnYm9sdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJcXHUwMGYzcHVzaSB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImhcXHUwMTcxdlxcdTAwZjZzXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmb3JyXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwic3plbGVzXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJqXFx1MDBlOWdlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIk55dWdvZHRcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNzZW5kZXNcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkVueWhlIHN6ZWxsXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiRmlub20gc3plbGxcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJLXFx1MDBmNnplcGVzIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAwYzlsXFx1MDBlOW5rIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkVyXFx1MDE1MXMgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiRXJcXHUwMTUxcywgbVxcdTAwZTFyIHZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJFclxcdTAxNTFzZW4gdmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTelxcdTAwZTlsdmloYXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRvbWJvbFxcdTAwZjMgc3pcXHUwMGU5bHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiY2FcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDYXRhbGFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlRlbXBlc3RhIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJUZW1wZXN0YSBmb3J0YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiVGVtcGVzdGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlRlbXBlc3RhIGFtYiBtb2x0IHBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiUGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiUGx1Z2ltIGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiUGx1Z2ltIGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwiUGx1amFcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiUGx1amFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlBsdWphIG1vbHQgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiUGx1amEgZXh0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiUGx1amEgZ2xhXFx1MDBlN2FkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwiUGx1amEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZhZGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiTmV2YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiQWlndWFuZXVcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcIlBsdWphIGQnYWlndWFuZXVcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcIlBsdWdpbSBpIG5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiUGx1amEgaSBuZXVcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcIk5ldmFkYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJOZXZhZGFcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJCb2lyYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiRnVtXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJCb2lyaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTb3JyYVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiQm9pcmFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcIlNvcnJhXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJQb2xzXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJDZW5kcmEgdm9sY1xcdTAwZTBuaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJYXFx1MDBlMGZlY1wiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQ2VsIG5ldFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiTGxldWdlcmFtZW50IGVubnV2b2xhdFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiTlxcdTAwZmF2b2xzIGRpc3BlcnNvc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiTnV2b2xvc2l0YXQgdmFyaWFibGVcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkVubnV2b2xhdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVGVtcGVzdGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFjXFx1MDBlMFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiRnJlZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiQ2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlZlbnRcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlBlZHJhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1hdFwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQnJpc2Egc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJpc2EgYWdyYWRhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmlzYSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2EgZnJlc2NhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzY2EgZm9yYVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudCBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBzZXZlclwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTBcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImhyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ3JvYXRpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBzbGFib20ga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBqYWtvbSBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYmEgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImpha2EgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmthbnNrYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzYSBzbGFib20gcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm1samF2aW5za2Egb2x1amEgc2EgamFrb20gcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInJvc3VsamEgc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJyb3N1bGphXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJyb3N1bGphIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb20gc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwicGxqdXNrb3ZpIGkgcm9zdWxqYVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwicm9zdWxqYSBzIGpha2ltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJyb3N1bGphIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJhIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInVtamVyZW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImtpXFx1MDE2MWEgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZybG8gamFrYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJla3N0cmVtbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibGVkZW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBsanVzYWsgc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbGp1c2FrXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbGp1c2FrIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvbHVqbmEga2lcXHUwMTYxYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZ3VzdGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzdXNuamVcXHUwMTdlaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzdXNuamVcXHUwMTdlaWNhIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcInNsYWJhIGtpXFx1MDE2MWEgaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcImtpXFx1MDE2MWEgaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcInNuaWplZyBzIHBvdnJlbWVuaW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuaWplZyBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzbmlqZWcgcyBqYWtpbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtYWdsaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJkaW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIml6bWFnbGljYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwia292aXRsYWNpIHBpamVza2EgaWxpIHByYVxcdTAxNjFpbmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm1hZ2xhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwaWplc2FrXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJ2dWxrYW5za2kgcGVwZW9cIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInphcHVzaSB2amV0cmEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidmVkcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImJsYWdhIG5hb2JsYWthXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJyYVxcdTAxNjF0cmthbmkgb2JsYWNpXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJpc3ByZWtpZGFuaSBvYmxhY2lcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bza2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJobGFkbm9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInZydVxcdTAxMDdlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2amV0cm92aXRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJ0dVxcdTAxMGRhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImxhaG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJwb3ZqZXRhcmFjXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJzbGFiIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwidW1qZXJlbiB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcInVtamVyZW5vIGphayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcImphayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTAxN2Vlc3RvayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIm9sdWpuaSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcImphayBvbHVqbmkgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJvcmthbnNraSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcImphayBvcmthbnNraSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIm9ya2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJibGFua1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIwLjEwLjIwMTYuXHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgd2luZFNwZWVkID0ge1xyXG4gICAgXCJlblwiOntcclxuICAgICAgICBcIlNldHRpbmdzXCI6IHtcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4wLCAwLjNdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIwLTEgICBTbW9rZSByaXNlcyBzdHJhaWdodCB1cFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkNhbG1cIjoge1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFswLjMsIDEuNl0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjEtMyBPbmUgY2FuIHNlZSBkb3dud2luZCBvZiB0aGUgc21va2UgZHJpZnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJMaWdodCBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEuNiwgMy4zXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNC02IE9uZSBjYW4gZmVlbCB0aGUgd2luZC4gVGhlIGxlYXZlcyBvbiB0aGUgdHJlZXMgbW92ZSwgdGhlIHdpbmQgY2FuIGxpZnQgc21hbGwgc3RyZWFtZXJzLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkdlbnRsZSBCcmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMuNCwgNS41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNy0xMCBMZWF2ZXMgYW5kIHR3aWdzIG1vdmUuIFdpbmQgZXh0ZW5kcyBsaWdodCBmbGFnIGFuZCBwZW5uYW50c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIk1vZGVyYXRlIGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbNS41LCA4LjBdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxMS0xNiAgIFRoZSB3aW5kIHJhaXNlcyBkdXN0IGFuZCBsb29zZSBwYXBlcnMsIHRvdWNoZXMgb24gdGhlIHR3aWdzIGFuZCBzbWFsbCBicmFuY2hlcywgc3RyZXRjaGVzIGxhcmdlciBmbGFncyBhbmQgcGVubmFudHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJGcmVzaCBCcmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzguMCwgMTAuOF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjE3LTIxICAgU21hbGwgdHJlZXMgaW4gbGVhZiBiZWdpbiB0byBzd2F5LiBUaGUgd2F0ZXIgYmVnaW5zIGxpdHRsZSB3YXZlcyB0byBwZWFrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU3Ryb25nIGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTAuOCwgMTMuOV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjIyLTI3ICAgTGFyZ2UgYnJhbmNoZXMgYW5kIHNtYWxsZXIgdHJpYmVzIG1vdmVzLiBUaGUgd2hpeiBvZiB0ZWxlcGhvbmUgbGluZXMuIEl0IGlzIGRpZmZpY3VsdCB0byB1c2UgdGhlIHVtYnJlbGxhLiBBIHJlc2lzdGFuY2Ugd2hlbiBydW5uaW5nLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxMy45LCAxNy4yXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjgtMzMgICBXaG9sZSB0cmVlcyBpbiBtb3Rpb24uIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJHYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxNy4yLCAyMC43XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMzQtNDAgICBUaGUgd2luZCBicmVhayB0d2lncyBvZiB0cmVlcy4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlNldmVyZSBHYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyMC44LCAyNC41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDEtNDcgICBBbGwgbGFyZ2UgdHJlZXMgc3dheWluZyBhbmQgdGhyb3dzLiBUaWxlcyBjYW4gYmxvdyBkb3duLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlN0b3JtXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyNC41LCAyOC41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDgtNTUgICBSYXJlIGlubGFuZC4gVHJlZXMgdXByb290ZWQuIFNlcmlvdXMgZGFtYWdlIHRvIGhvdXNlcy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJWaW9sZW50IFN0b3JtXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyOC41LCAzMi43XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNTYtNjMgICBPY2N1cnMgcmFyZWx5IGFuZCBpcyBmb2xsb3dlZCBieSBkZXN0cnVjdGlvbi5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJIdXJyaWNhbmVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMyLjcsIDY0XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiT2NjdXJzIHZlcnkgcmFyZWx5LiBVbnVzdWFsbHkgc2V2ZXJlIGRhbWFnZS5cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxyXG4gKi9cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMTMuMTAuMjAxNi5cclxuICovXHJcbmltcG9ydCBDb29raWVzIGZyb20gJy4vQ29va2llcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3JXaWRnZXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bWA7XHJcbiAgICAgICAgdGhpcy5zY3JpcHREM1NSQyA9IGAke3RoaXMuYmFzZVVSTH0vanMvbGlicy9kMy5taW4uanNgO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0U1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanNgO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xzV2lkZ2V0ID0ge1xyXG4gICAgICAgICAgICAvLyDQn9C10YDQstCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXHJcbiAgICAgICAgICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LWxlZnQtbWVudV9faGVhZGVyJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX251bWJlcicpLFxyXG4gICAgICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19tZWFucycpLFxyXG4gICAgICAgICAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fd2luZCcpLFxyXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9faW1nJyksXHJcbiAgICAgICAgICAgIGNhbGVuZGFySXRlbTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhbGVuZGFyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGdyYXBoaWM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljJyksXHJcbiAgICAgICAgICAgIC8vINCS0YLQvtGA0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAgICAgICAgY2l0eU5hbWUyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X190aXRsZScpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X190ZW1wZXJhdHVyZScpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZUZlZWxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fZmVlbHMnKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmVNaW46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0LWNhcmRfX3RlbXBlcmF0dXJlLW1pbicpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1heDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWF4JyksXHJcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fZGVzY3JpcHRpb24nKSxcclxuICAgICAgICAgICAgd2luZFNwZWVkMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3dpbmQtc3BlZWQnKSxcclxuICAgICAgICAgICAgbWFpbkljb25XZWF0aGVyMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2ljb24nKSxcclxuICAgICAgICAgICAgaHVtaWRpdHk6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19odW1pZGl0eScpLFxyXG4gICAgICAgICAgICBwcmVzc3VyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3ByZXNzdXJlJyksXHJcbiAgICAgICAgICAgIGRhdGVSZXBvcnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXRfX2RhdGUnKSxcclxuICAgICAgICAgICAgYXBpS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpLFxyXG4gICAgICAgICAgICBlcnJvcktleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yLWtleScpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1ldHJpY1RlbXBlcmF0dXJlKCk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uQVBJa2V5KCk7XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcblxyXG4gICAgICAgIC8vINC+0LHRitC10LrRgi3QutCw0YDRgtCwINC00LvRjyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjRjyDQstGB0LXRhSDQstC40LTQttC10YLQvtCyINGBINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsFxyXG4gICAgICAgIHRoaXMubWFwV2lkZ2V0cyA9IHtcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg2KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDcpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA4LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTUsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTgsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDI0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMxLXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y8g0LIg0LLQuNC00LbQtdGC0LDRhVxyXG4gICAgICogKi9cclxuICAgIGluaXRpYWxNZXRyaWNUZW1wZXJhdHVyZSgpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0VW5pdHMgPSBmdW5jdGlvbihjaGVja2JveCwgY29va2llKXtcclxuICAgICAgICAgICAgdmFyIHVuaXRzID0gJ21ldHJpYyc7XHJcbiAgICAgICAgICAgIGlmKGNoZWNrYm94LmNoZWNrZWQgPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdW5pdHMgPSAnaW1wZXJpYWwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvb2tpZS5zZXRDb29raWUoJ3VuaXRzJywgdW5pdHMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFVuaXRzID0gZnVuY3Rpb24odW5pdHMpe1xyXG4gICAgICAgICAgICBzd2l0Y2godW5pdHMpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbWV0cmljJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3VuaXRzLCAnwrBDJ107XHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbXBlcmlhbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt1bml0cywgJ8KwRiddO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBbJ21ldHJpYycsICfCsEMnXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgY29va2llID0gbmV3IENvb2tpZXMoKTtcclxuICAgICAgICAvL9Ce0L/RgNC10LTQtdC70LXQvdC40LUg0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRj1xyXG4gICAgICAgIHZhciB1bml0c0NoZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bml0c19jaGVja1wiKTtcclxuXHJcbiAgICAgICAgdW5pdHNDaGVjay5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgc2V0VW5pdHModW5pdHNDaGVjaywgY29va2llKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdW5pdHMgPSBcIm1ldHJpY1wiO1xyXG4gICAgICAgIHZhciB0ZXh0X3VuaXRfdGVtcCA9IG51bGw7XHJcbiAgICAgICAgaWYoY29va2llLmdldENvb2tpZSgndW5pdHMnKSl7XHJcbiAgICAgICAgICAgIHRoaXMudW5pdHNUZW1wID0gZ2V0VW5pdHMoY29va2llLmdldENvb2tpZSgndW5pdHMnKSkgfHwgWydtZXRyaWMnLCAnwrBDJ107XHJcbiAgICAgICAgICAgIFt1bml0cywgdGV4dF91bml0X3RlbXBdID0gdGhpcy51bml0c1RlbXA7XHJcbiAgICAgICAgICAgIGlmKHVuaXRzID09IFwibWV0cmljXCIpXHJcbiAgICAgICAgICAgICAgICB1bml0c0NoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB1bml0c0NoZWNrLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdW5pdHNDaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2V0VW5pdHModW5pdHNDaGVjaywgY29va2llKTtcclxuICAgICAgICAgICAgdGhpcy51bml0c1RlbXAgPSBnZXRVbml0cyh1bml0cyk7XHJcbiAgICAgICAgICAgIFt1bml0cywgdGV4dF91bml0X3RlbXBdID0gdGhpcy51bml0c1RlbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0KHQstC+0LnRgdGC0LLQviDRg9GB0YLQsNC90L7QstC60Lgg0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRjyDQtNC70Y8g0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICogQHBhcmFtIHVuaXRzXHJcbiAgICAgKi9cclxuICAgIHNldCB1bml0c1RlbXAodW5pdHMpIHtcclxuICAgICAgICB0aGlzLnVuaXRzID0gdW5pdHM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCh0LLQvtC50YHRgtCy0L4g0L/QvtC70YPRh9C10L3QuNGPINC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y8g0LTQu9GPINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBnZXQgdW5pdHNUZW1wKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuaXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRpb25BUElrZXkoKSB7XHJcbiAgICAgICAgbGV0IHZhbGlkYXRpb25BUEkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgdXJsID0gYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPTUyNDkwMSZ1bml0cz0ke3RoaXMudW5pdHNUZW1wWzBdfSZjbnQ9OCZhcHBpZD0ke3RoaXMuY29udHJvbHNXaWRnZXQuYXBpS2V5LnZhbHVlfWA7XHJcbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gYWNjZXB0JztcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gZXJyb3InO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQstCw0LvQuNC00LDRhtC40LggJHtlfWApO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBlcnJvcic7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1nb29kJyk7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCA9IHZhbGlkYXRpb25BUEkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzV2lkZ2V0LmFwaUtleS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kKTtcclxuICAgICAgICAvL3RoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGlkKSB7XHJcbiAgICAgICAgaWYoaWQgJiYgKHRoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZCB8fCB0aGlzLnBhcmFtc1dpZGdldC5jaXR5TmFtZSkgJiYgdGhpcy5wYXJhbXNXaWRnZXQuYXBwaWQpIHtcclxuICAgICAgICAgICAgbGV0IGNvZGUgPSAnJztcclxuICAgICAgICAgICAgaWYocGFyc2VJbnQoaWQpID09PSAxIHx8IHBhcnNlSW50KGlkKSA9PT0gMTEgfHwgcGFyc2VJbnQoaWQpID09PSAyMSB8fCBwYXJzZUludChpZCkgPT09IDMxKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gYDxzY3JpcHQgc3JjPScke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy9kMy5taW4uanMnPjwvc2NyaXB0PmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGAke2NvZGV9PGRpdiBpZD0nb3BlbndlYXRoZXJtYXAtd2lkZ2V0Jz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvamF2YXNjcmlwdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAke2lkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eWlkOiAke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGlkOiAnJHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZC5yZXBsYWNlKGAyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2N2AsJycpfScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzOiAnJHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9ICcke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJbml0aWFsU3RhdGVGb3JtKGNpdHlJZD0yNjQzNzQzLCBjaXR5TmFtZT0nTG9uZG9uJykge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtc1dpZGdldCA9IHtcclxuICAgICAgICAgICAgY2l0eUlkOiBjaXR5SWQsXHJcbiAgICAgICAgICAgIGNpdHlOYW1lOiBjaXR5TmFtZSxcclxuICAgICAgICAgICAgbGFuZzogJ2VuJyxcclxuICAgICAgICAgICAgYXBwaWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykudmFsdWUgfHwgICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgICAgICAgIHVuaXRzOiB0aGlzLnVuaXRzVGVtcFswXSxcclxuICAgICAgICAgICAgdGV4dFVuaXRUZW1wOiB0aGlzLnVuaXRzVGVtcFsxXSwgIC8vIDI0OFxyXG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmJhc2VVUkwsXHJcbiAgICAgICAgICAgIHVybERvbWFpbjogYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnYCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDQoNCw0LHQvtGC0LAg0YEg0YTQvtGA0LzQvtC5INC00LvRjyDQuNC90LjRhtC40LDQu9C4XHJcbiAgICAgICAgdGhpcy5jaXR5TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LW5hbWUnKTtcclxuICAgICAgICB0aGlzLmNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXRpZXMnKTtcclxuICAgICAgICB0aGlzLnNlYXJjaENpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNpdHknKTtcclxuXHJcbiAgICAgICAgdGhpcy51cmxzID0ge1xyXG4gICAgICAgIHVybFdlYXRoZXJBUEk6IGAke3RoaXMucGFyYW1zV2lkZ2V0LnVybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlcj9pZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0mdW5pdHM9JHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30mYXBwaWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dGhpcy5wYXJhbXNXaWRnZXQudXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseT9pZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0mdW5pdHM9JHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30mY250PTgmYXBwaWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICAgIHdpbmRTcGVlZDogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uYCxcclxuICAgICAgICB3aW5kRGlyZWN0aW9uOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvd2luZC1kaXJlY3Rpb24tZGF0YS5qc29uYCxcclxuICAgICAgICBjbG91ZHM6IGAke3RoaXMuYmFzZVVSTH0vZGF0YS9jbG91ZHMtZGF0YS5qc29uYCxcclxuICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25gLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcclxuXHJcbi8qKlxyXG4g0JPRgNCw0YTQuNC6INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0Lgg0L/QvtCz0L7QtNGLXHJcbiBAY2xhc3MgR3JhcGhpY1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpYyBleHRlbmRzIEN1c3RvbURhdGUge1xyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uID0gZDMubGluZSgpXHJcbiAgICAueCgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC54O1xyXG4gICAgfSlcclxuICAgIC55KChkKSA9PiB7XHJcbiAgICAgIHJldHVybiBkLnk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDQtNCw0L3QvdGL0YUg0LIg0LzQsNGB0YHQuNCyINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcclxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICovXHJcbiAgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBjb25zdCByYXdEYXRhID0gW107XHJcblxyXG4gICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIHJhd0RhdGEucHVzaCh7IHg6IGksIGRhdGU6IGksIG1heFQ6IGVsZW0ubWF4LCBtaW5UOiBlbGVtLm1pbiB9KTtcclxuICAgICAgaSArPSAxOyAvLyDQodC80LXRidC10L3QuNC1INC/0L4g0L7RgdC4IFhcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByYXdEYXRhO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgbWFrZVNWRygpIHtcclxuICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5wYXJhbXMuaWQpLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMnKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnBhcmFtcy53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmZmZmJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xyXG4gICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cclxuICAqL1xyXG4gIGdldE1pbk1heERhdGUocmF3RGF0YSkge1xyXG4gICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtYXhEYXRlOiAwLFxyXG4gICAgICBtaW5EYXRlOiAxMDAwMCxcclxuICAgIH07XHJcblxyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5taW5EYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgKiBbZ2V0TWluTWF4RGF0ZVRlbXBlcmF0dXJlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcblxyXG4gIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMTAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5taW5UKSB7XHJcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLm1pblQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ubWF4VCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSkge1xyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWluOiAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIG1ha2VBeGVzWFkocmF3RGF0YSwgcGFyYW1zKSB7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICBjb25zdCB4QXhpc0xlbmd0aCA9IHBhcmFtcy53aWR0aCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBZID0g0LLRi9GB0L7RgtCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YMg0Lgg0YHQvdC40LfRg1xyXG4gICAgY29uc3QgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gKDIgKiBwYXJhbXMubWFyZ2luKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcclxuICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cclxuICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAqL1xyXG4gIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXggKyA1LCBtaW4gLSA1XSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIG1pblQ6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcclxuICB9XHJcblxyXG4gIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbikge1xyXG4gICAgY29uc3QgeyBtYXhEYXRlLCBtaW5EYXRlIH0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgIGNvbnN0IHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuXHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sXHJcbiAgICAgICAgaHVtaWRpdHk6IHNjYWxlWShlbGVtLmh1bWlkaXR5KSArIG1hcmdpbixcclxuICAgICAgICByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luLFxyXG4gICAgICAgIGNvbG9yOiBlbGVtLmNvbG9yLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XHJcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKSB7XHJcbiAgICBjb25zdCBhcnJQb2x5bGluZSA9IFtdO1xyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSB9LFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICB4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIHk6IHNjYWxlWShkYXRhW2RhdGEubGVuZ3RoIC0gMV0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGRyYXdQb2x5bGluZShzdmcsIGRhdGEpIHtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcclxuXHJcbiAgICBzdmcuYXBwZW5kKCdnJykuYXBwZW5kKCdwYXRoJylcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQtNC/0LjRgdC10Lkg0YEg0L/QvtC60LDQt9Cw0YLQtdC70Y/QvNC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0L3QsCDQvtGB0Y/RhVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKi9cclxuICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpIHtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSkgPT4ge1xyXG4gICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5tYXhUIC0gMikgLSAocGFyYW1zLm9mZnNldFggLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1heH3CsGApO1xyXG5cclxuICAgICAgc3ZnLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgIC5hdHRyKCd4JywgZWxlbS54KVxyXG4gICAgICAuYXR0cigneScsIChlbGVtLm1pblQgKyA3KSArIChwYXJhbXMub2Zmc2V0WSAvIDIpKVxyXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnN0eWxlKCdmaWxsJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnRleHQoYCR7cGFyYW1zLmRhdGFbaXRlbV0ubWlufcKwYCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICBjb25zdCB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH0gPSB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgdGhpcy5kcmF3UG9seWxpbmUoc3ZnLCBwb2x5bGluZSk7XHJcbiAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICAvLyB0aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxyZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHIgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcm0tbGFuZGluZy13aWRnZXQnKTtcciAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpO1xyICAgIGNvbnN0IHBvcHVwU2hhZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcHVwLXNoYWRvdycpO1xyICAgIGNvbnN0IHBvcHVwQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtY2xvc2UnKTtcciAgICBjb25zdCBjb250ZW50SlNHZW5lcmF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWNvZGUtZ2VuZXJhdGUnKTtcciAgICBjb25zdCBjb3B5Q29udGVudEpTQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5LWpzLWNvZGUnKTtcciAgICBjb25zdCBhcGlLZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpO1xyXHIgICAgLy8g0KTQuNC60YHQuNGA0YPQtdC8INC60LvQuNC60Lgg0L3QsCDRhNC+0YDQvNC1LCDQuCDQvtGC0LrRgNGL0LLQsNC10LwgcG9wdXAg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDXHIgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyICAgICAgICBpZihlbGVtZW50LmlkICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpKSB7XHIgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcciAgICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0od2luZG93LmNpdHlJZCwgd2luZG93LmNpdHlOYW1lKTsgICAgICAgICBcciAgICAgICAgICAgIFxyICAgICAgICAgICAgXHIgICAgICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gZ2VuZXJhdGVXaWRnZXQuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0Lm1hcFdpZGdldHNbZWxlbWVudC5pZF1bJ2lkJ10pO1xyICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLXZpc2libGUnKSkge1xyICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcciAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC0tdmlzaWJsZScpO1xyICAgICAgICAgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5hZGQoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpXHIgICAgICAgICAgICAgICAgc3dpdGNoKGdlbmVyYXRvci5tYXBXaWRnZXRzW2V2ZW50LnRhcmdldC5pZF1bJ3NjaGVtYSddKSB7XHIgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JsdWUnOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1icm93bicpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJyb3duJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYnJvd24nOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm9uZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1icm93bicpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJyb3duJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1ibHVlJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYmx1ZScpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgXHIgICAgICAgIH1cciAgICB9KTtcclxyICAgIHZhciBldmVudFBvcHVwQ2xvc2UgPSBmdW5jdGlvbihldmVudCl7XHIgICAgICB2YXIgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcciAgICAgIGlmKCghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwQ2xvc2UnKSB8fCBlbGVtZW50ID09PSBwb3B1cClcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX3RpdGxlJylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9faXRlbXMnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19sYXlvdXQnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19idG4nKSkge1xyICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tdmlzaWJsZScpO1xyICAgICAgICBwb3B1cFNoYWRvdy5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC1zaGFkb3ctLXZpc2libGUnKTtcciAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcciAgICAgIH1cciAgICB9O1xyXHIgICAgZXZlbnRQb3B1cENsb3NlID0gZXZlbnRQb3B1cENsb3NlLmJpbmQodGhpcyk7XHIgICAgLy8g0JfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60YDQtdGB0YLQuNC6XHIgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudFBvcHVwQ2xvc2UpO1xyXHJcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyICAgICAgICAvL3ZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHIgICAgICAgIC8vcmFuZ2Uuc2VsZWN0Tm9kZShjb250ZW50SlNHZW5lcmF0aW9uKTtcciAgICAgICAgLy93aW5kb3cuZ2V0U2VsZWN0aW9uKCkuYWRkUmFuZ2UocmFuZ2UpO1xyICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnNlbGVjdCgpO1xyXHIgICAgICAgIHRyeXtcciAgICAgICAgICAgIGNvbnN0IHR4dENvcHkgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xyICAgICAgICAgICAgdmFyIG1zZyA9IHR4dENvcHkgPyAnc3VjY2Vzc2Z1bCcgOiAndW5zdWNjZXNzZnVsJztcciAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3B5IGVtYWlsIGNvbW1hbmQgd2FzICcgKyBtc2cpO1xyICAgICAgICB9XHIgICAgICAgIGNhdGNoKGUpe1xyICAgICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQutC+0L/QuNGA0L7QstCw0L3QuNGPICR7ZS5lcnJMb2dUb0NvbnNvbGV9YCk7XHIgICAgICAgIH1cclxyICAgICAgICAvLyDQodC90Y/RgtC40LUg0LLRi9C00LXQu9C10L3QuNGPIC0g0JLQndCY0JzQkNCd0JjQlTog0LLRiyDQtNC+0LvQttC90Ysg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMXHIgICAgICAgIC8vIHJlbW92ZVJhbmdlKHJhbmdlKSDQutC+0LPQtNCwINGN0YLQviDQstC+0LfQvNC+0LbQvdC+XHIgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcciAgICB9KTtcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmRpc2FibGVkID0gIWRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCgnY29weScpO1xyfSk7XHJcciIsIi8vINCc0L7QtNGD0LvRjCDQtNC40YHQv9C10YLRh9C10YAg0LTQu9GPINC+0YLRgNC40YHQvtCy0LrQuCDQsdCw0L3QvdC10YDRgNC+0LIg0L3QsCDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LVcclxuaW1wb3J0IENpdGllcyBmcm9tICcuL2NpdGllcyc7XHJcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblxyXG4gICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxyXG4gICAgY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbiAgICBjb25zdCBjaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XHJcbiAgICBjb25zdCBzZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcblxyXG4gICAgY29uc3Qgb2JqQ2l0aWVzID0gbmV3IENpdGllcyhjaXR5TmFtZSwgY2l0aWVzKTtcclxuICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuXHJcbiAgICBzZWFyY2hDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcbmltcG9ydCBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYy1kM2pzJztcclxuaW1wb3J0ICogYXMgbmF0dXJhbFBoZW5vbWVub24gIGZyb20gJy4vZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YSc7XHJcbmltcG9ydCAqIGFzIHdpbmRTcGVlZCBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcclxuaW1wb3J0ICogYXMgd2luZERpcmVjdGlvbiBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYXRoZXJXaWRnZXQgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xyXG4gICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgdGhpcy53ZWF0aGVyID0ge1xyXG4gICAgICBmcm9tQVBJOiB7XHJcbiAgICAgICAgY29vcmQ6IHtcclxuICAgICAgICAgIGxvbjogJzAnLFxyXG4gICAgICAgICAgbGF0OiAnMCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3ZWF0aGVyOiBbe1xyXG4gICAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICAgIG1haW46ICcgJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnICcsXHJcbiAgICAgICAgICBpY29uOiAnICcsXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgYmFzZTogJyAnLFxyXG4gICAgICAgIG1haW46IHtcclxuICAgICAgICAgIHRlbXA6IDAsXHJcbiAgICAgICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICAgICAgaHVtaWRpdHk6ICcgJyxcclxuICAgICAgICAgIHRlbXBfbWluOiAnICcsXHJcbiAgICAgICAgICB0ZW1wX21heDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2luZDoge1xyXG4gICAgICAgICAgc3BlZWQ6IDAsXHJcbiAgICAgICAgICBkZWc6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJhaW46IHt9LFxyXG4gICAgICAgIGNsb3Vkczoge1xyXG4gICAgICAgICAgYWxsOiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdDogJycsXHJcbiAgICAgICAgc3lzOiB7XHJcbiAgICAgICAgICB0eXBlOiAnICcsXHJcbiAgICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJyAnLFxyXG4gICAgICAgICAgY291bnRyeTogJyAnLFxyXG4gICAgICAgICAgc3VucmlzZTogJyAnLFxyXG4gICAgICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgIG5hbWU6ICdVbmRlZmluZWQnLFxyXG4gICAgICAgIGNvZDogJyAnLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAqIEBwYXJhbSB1cmxcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cclxuICBodHRwR2V0KHVybCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgKi9cclxuICBnZXRXZWF0aGVyRnJvbUFwaSgpIHtcclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSBuYXR1cmFsUGhlbm9tZW5vbi5uYXR1cmFsUGhlbm9tZW5vblt0aGlzLnBhcmFtcy5sYW5nXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gd2luZFNwZWVkLndpbmRTcGVlZFt0aGlzLnBhcmFtcy5sYW5nXTtcclxuICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnBhcmFtc1VybEZvcmVEYWlseSlcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgKiBAcGFyYW0ge29iamVjdH0gSlNPTlxyXG4gICAqIEBwYXJhbSB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9INCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAqL1xyXG4gIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpIHtcclxuICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdID09PSAnb2JqZWN0JyAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwINGBINC00LLRg9C80Y8g0Y3Qu9C10LzQtdC90YLQsNC80Lgg0LIgSlNPTlxyXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnROYW1lMiAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZTJdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgcGFyc2VEYXRhRnJvbVNlcnZlcigpIHtcclxuICAgIGNvbnN0IHdlYXRoZXIgPSB0aGlzLndlYXRoZXI7XHJcblxyXG4gICAgaWYgKHdlYXRoZXIuZnJvbUFQSS5uYW1lID09PSAnVW5kZWZpbmVkJyB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSAnNDA0Jykge1xyXG4gICAgICBjb25zb2xlLmxvZygn0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7XHJcbiAgICAgIGNsb3VkaW5lc3M6ICcgJyxcclxuICAgICAgZHQ6ICcgJyxcclxuICAgICAgY2l0eU5hbWU6ICcgJyxcclxuICAgICAgaWNvbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZTogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1BeDogJyAnLFxyXG4gICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICBodW1pZGl0eTogJyAnLFxyXG4gICAgICBzdW5yaXNlOiAnICcsXHJcbiAgICAgIHN1bnNldDogJyAnLFxyXG4gICAgICBjb29yZDogJyAnLFxyXG4gICAgICB3aW5kOiAnICcsXHJcbiAgICAgIHdlYXRoZXI6ICcgJyxcclxuICAgIH07XHJcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSwgMTApICsgMDtcclxuICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmUgPSB0ZW1wZXJhdHVyZTsgLy8gYCR7dGVtcCA+IDAgPyBgKyR7dGVtcH1gIDogdGVtcH1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNaW4gPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21pbi50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNYXggPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21heC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgaWYgKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pIHtcclxuICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIud2luZFNwZWVkKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIud2luZFNwZWVkLCB3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpLCAnc3BlZWRfaW50ZXJ2YWwnKX1gO1xyXG4gICAgICBtZXRhZGF0YS53aW5kU3BlZWQyID0gYCR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci53aW5kU3BlZWQsIHdlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSksICdzcGVlZF9pbnRlcnZhbCcpLnN1YnN0cigwLDEpfWA7XHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci53aW5kRGlyZWN0aW9uKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX1gXHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci5jbG91ZHMpIHtcclxuICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci5jbG91ZHMsIHdlYXRoZXIuZnJvbUFQSS5jbG91ZHMuYWxsLCAnbWluJywgJ21heCcpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgbWV0YWRhdGEuaHVtaWRpdHkgPSBgJHt3ZWF0aGVyLmZyb21BUEkubWFpbi5odW1pZGl0eX0lYDtcclxuICAgIG1ldGFkYXRhLnByZXNzdXJlID0gIGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wibWFpblwiXVtcInByZXNzdXJlXCJdfSBtYmA7XHJcbiAgICBtZXRhZGF0YS5pY29uID0gYCR7d2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWNvbn1gO1xyXG5cclxuICAgIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xyXG4gICAgLy8g0J7QvtGC0YDQuNGB0L7QstC60LAg0L/QtdGA0LLRi9GFINGH0LXRgtGL0YDQtdGFINCy0LjQtNC20LXRgtC+0LJcclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuIGNsYXNzPSd3ZWF0aGVyLWxlZnQtY2FyZF9fZGVncmVlJz4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndlYXRoZXIpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtZXRhZGF0YS53aW5kU3BlZWQpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDQv9GP0YLQuCDQv9C+0YHQu9C10LTQvdC40YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMltlbGVtXS5pbm5lckhUTUwgPSBtZXRhZGF0YS5jaXR5TmFtZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyW2VsZW1dKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMltlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVscy5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHNbZWxlbV0pIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVsc1tlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4pIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4KSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heFtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XHJcbiAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZDIgJiYgbWV0YWRhdGEud2luZERpcmVjdGlvbikge1xyXG4gICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkMikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMud2luZFNwZWVkMltlbGVtXS5pbm5lclRleHQgPSBgJHttZXRhZGF0YS53aW5kU3BlZWQyfSAke21ldGFkYXRhLndpbmREaXJlY3Rpb259YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEuaHVtaWRpdHkpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmh1bWlkaXR5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuaHVtaWRpdHkuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMuaHVtaWRpdHlbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEuaHVtaWRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLnByZXNzdXJlKSB7XHJcbiAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5wcmVzc3VyZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnByZXNzdXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLnByZXNzdXJlW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLnByZXNzdXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g0J/RgNC+0L/QuNGB0YvQstCw0LXQvCDRgtC10LrRg9GJ0YPRjiDQtNCw0YLRgyDQsiDQstC40LTQttC10YLRi1xyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnQpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydFtlbGVtXS5pbm5lclRleHQgPSB0aGlzLmdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KSB7XHJcbiAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKSB7XHJcbiAgICBjb25zdCBhcnIgPSBbXTtcclxuXHJcbiAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0LmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKGVsZW0uZHQpKTtcclxuICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgIG1pbjogTWF0aC5yb3VuZChlbGVtLnRlbXAubWluKSxcclxuICAgICAgICBtYXg6IE1hdGgucm91bmQoZWxlbS50ZW1wLm1heCksXHJcbiAgICAgICAgZGF5OiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgaWNvbjogZWxlbS53ZWF0aGVyWzBdLmljb24sXHJcbiAgICAgICAgZGF0ZTogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKGVsZW0uZHQpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XHJcbiAgICogQHBhcmFtIGRhdGFcclxuICAgKi9cclxuICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICBsZXQgZGF0ZTtcclxuICAgICAgZGF0ZSA9IG5ldyBEYXRlKGVsZW0uZGF0ZS5yZXBsYWNlKC8oXFxkKykuKFxcZCspLihcXGQrKS8sICckMy0kMi0kMScpKTtcclxuICAgICAgLy8g0LTQu9GPIGVkZ2Ug0YHRgtGA0L7QuNC8INC00YDRg9Cz0L7QuSDQsNC70LPQvtGA0LjRgtC8INC00LDRgtGLXHJcbiAgICAgIGlmIChkYXRlLnRvU3RyaW5nKCkgPT09ICdJbnZhbGlkIERhdGUnKSB7XHJcbiAgICAgICAgdmFyIHJlZyA9IC8oXFxkKykvaWc7XHJcbiAgICAgICAgdmFyIGZvdW5kID0gKGVsZW0uZGF0ZSkubWF0Y2gocmVnKTtcclxuICAgICAgICBkYXRlID0gbmV3IERhdGUoYCR7Zm91bmRbMl19LSR7Zm91bmRbMV19LSR7Zm91bmRbMF19ICR7Zm91bmRbM119OiR7Zm91bmRbNF0gPyBmb3VuZFs0XSA6ICcwMCcgfToke2ZvdW5kWzVdID8gZm91bmRbNV0gOiAnMDAnfWApO1xyXG4gICAgICAgIGlmIChkYXRlLnRvU3RyaW5nKCkgPT09ICdJbnZhbGlkIERhdGUnKSB7XHJcbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUoZm91bmRbMl0sZm91bmRbMF0gLSAxLGZvdW5kWzFdLGZvdW5kWzNdLGZvdW5kWzRdID8gZm91bmRbNF0gOiAnMDAnLCBmb3VuZFs1XSA/IGZvdW5kWzVdIDogJzAwJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyA4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyAxOF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGJyPiR7ZGF0ZS5nZXREYXRlKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMjhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIGdldFVSTE1haW5JY29uKG5hbWVJY29uLCBjb2xvciA9IGZhbHNlKSB7XHJcbiAgICAvLyDQodC+0LfQtNCw0LXQvCDQuCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC60LDRgNGC0YMg0YHQvtC/0L7RgdGC0LDQstC70LXQvdC40LlcclxuICAgIGNvbnN0IG1hcEljb25zID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIGlmICghY29sb3IpIHtcclxuICAgICAgLy9cclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMWQnLCAnMDFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMmQnLCAnMDJkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM2QnLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM2QnLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNGQnLCAnMDRkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNWQnLCAnMDVkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNmQnLCAnMDZkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwN2QnLCAnMDdkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOGQnLCAnMDhkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOWQnLCAnMDlkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMGQnLCAnMTBkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMWQnLCAnMTFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxM2QnLCAnMTNkYncnKTtcclxuICAgICAgLy8g0J3QvtGH0L3Ri9C1XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDFuJywgJzAxZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDJuJywgJzAyZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDRuJywgJzA0ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDVuJywgJzA1ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDZuJywgJzA2ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDduJywgJzA3ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDhuJywgJzA4ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDluJywgJzA5ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTBuJywgJzEwZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTFuJywgJzExZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTNuJywgJzEzZGJ3Jyk7XHJcblxyXG4gICAgICBpZiAobWFwSWNvbnMuZ2V0KG5hbWVJY29uKSkge1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLnBhcmFtcy5iYXNlVVJMfS9pbWcvd2lkZ2V0cy8ke21hcEljb25zLmdldChuYW1lSWNvbil9LnBuZ2A7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7bmFtZUljb259LnBuZ2A7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7dGhpcy5wYXJhbXMuYmFzZVVSTH0vaW1nL3dpZGdldHMvJHtuYW1lSWNvbn0ucG5nYDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgSDQv9C+0LzQvtGJ0YzRjiDQsdC40LHQu9C40L7RgtC10LrQuCBEM1xyXG4gICAqL1xyXG4gIGRyYXdHcmFwaGljRDMoZGF0YSkge1xyXG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XHJcblxyXG4gICAgLy8g0J7Rh9C40YHRgtC60LAg0LrQvtC90YLQtdC50L3QtdGA0L7QsiDQtNC70Y8g0LPRgNCw0YTQuNC60L7QslxyXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKTtcclxuICAgIGNvbnN0IHN2ZzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzEnKTtcclxuICAgIGNvbnN0IHN2ZzIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzInKTtcclxuICAgIGNvbnN0IHN2ZzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzMnKTtcclxuXHJcbiAgICBpZihzdmcucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcclxuICAgICAgc3ZnLnJlbW92ZUNoaWxkKHN2Zy5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XHJcbiAgICB9XHJcbiAgICBpZihzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKSB7XHJcbiAgICAgIHN2ZzEucmVtb3ZlQ2hpbGQoc3ZnMS5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XHJcbiAgICB9XHJcbiAgICBpZihzdmcyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKXtcclxuICAgICAgc3ZnMi5yZW1vdmVDaGlsZChzdmcyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzMucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xyXG4gICAgICAgIHN2ZzMucmVtb3ZlQ2hpbGQoc3ZnMy5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBpZDogJyNncmFwaGljJyxcclxuICAgICAgZGF0YSxcclxuICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICB3aWR0aDogNDIwLFxyXG4gICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgY29sb3JQb2xpbHluZTogJyMzMzMnLFxyXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxyXG4gICAgICBmb250Q29sb3I6ICcjMzMzJyxcclxuICAgICAgc3Ryb2tlV2lkdGg6ICcxcHgnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgbGV0IG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcblxyXG4gICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMxJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNEREY3MzAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMyJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMzJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAqL1xyXG4gIGRyYXdHcmFwaGljKGFycikge1xyXG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGggPSA0NjU7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDYwMCwgMzAwKTtcclxuXHJcbiAgICBjb250ZXh0LmZvbnQgPSAnT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4JztcclxuXHJcbiAgICBsZXQgc3RlcCA9IDU1O1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3Qgem9vbSA9IDQ7XHJcbiAgICBjb25zdCBzdGVwWSA9IDY0O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0VXAgPSA1ODtcclxuICAgIGNvbnN0IHN0ZXBZVGV4dERvd24gPSA3NTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBzdGVwID0gNTU7XHJcbiAgICBpID0gMDtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgaSArPSAxO1xyXG4gICAgd2hpbGUgKGkgPCBhcnIubGVuZ3RoKSB7XHJcbiAgICAgIHN0ZXAgKz0gNTU7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzMzMyc7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvKiEgaHR0cDovL210aHMuYmUvZnJvbWNvZGVwb2ludCB2MC4yLjEgYnkgQG1hdGhpYXMgKi9cbmlmICghU3RyaW5nLmZyb21Db2RlUG9pbnQpIHtcblx0KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcblx0XHRcdC8vIElFIDggb25seSBzdXBwb3J0cyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBvbiBET00gZWxlbWVudHNcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHZhciBvYmplY3QgPSB7fTtcblx0XHRcdFx0dmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9ICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG9iamVjdCwgb2JqZWN0KSAmJiAkZGVmaW5lUHJvcGVydHk7XG5cdFx0XHR9IGNhdGNoKGVycm9yKSB7fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9KCkpO1xuXHRcdHZhciBzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXHRcdHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cdFx0dmFyIGZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbihfKSB7XG5cdFx0XHR2YXIgTUFYX1NJWkUgPSAweDQwMDA7XG5cdFx0XHR2YXIgY29kZVVuaXRzID0gW107XG5cdFx0XHR2YXIgaGlnaFN1cnJvZ2F0ZTtcblx0XHRcdHZhciBsb3dTdXJyb2dhdGU7XG5cdFx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHRcdHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdFx0aWYgKCFsZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xuXHRcdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0XHRcdFx0dmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IC8vIGBOYU5gLCBgK0luZmluaXR5YCwgb3IgYC1JbmZpbml0eWBcblx0XHRcdFx0XHRjb2RlUG9pbnQgPCAwIHx8IC8vIG5vdCBhIHZhbGlkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0XHRcdGNvZGVQb2ludCA+IDB4MTBGRkZGIHx8IC8vIG5vdCBhIHZhbGlkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0XHRcdGZsb29yKGNvZGVQb2ludCkgIT0gY29kZVBvaW50IC8vIG5vdCBhbiBpbnRlZ2VyXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHsgLy8gQk1QIGNvZGUgcG9pbnRcblx0XHRcdFx0XHRjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuXHRcdFx0XHR9IGVsc2UgeyAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuXHRcdFx0XHRcdC8vIGh0dHA6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXG5cdFx0XHRcdFx0Y29kZVBvaW50IC09IDB4MTAwMDA7XG5cdFx0XHRcdFx0aGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuXHRcdFx0XHRcdGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG5cdFx0XHRcdFx0Y29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaW5kZXggKyAxID09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcblx0XHRcdFx0XHRyZXN1bHQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG5cdFx0XHRcdFx0Y29kZVVuaXRzLmxlbmd0aCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAoZGVmaW5lUHJvcGVydHkpIHtcblx0XHRcdGRlZmluZVByb3BlcnR5KFN0cmluZywgJ2Zyb21Db2RlUG9pbnQnLCB7XG5cdFx0XHRcdCd2YWx1ZSc6IGZyb21Db2RlUG9pbnQsXG5cdFx0XHRcdCdjb25maWd1cmFibGUnOiB0cnVlLFxuXHRcdFx0XHQnd3JpdGFibGUnOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0U3RyaW5nLmZyb21Db2RlUG9pbnQgPSBmcm9tQ29kZVBvaW50O1xuXHRcdH1cblx0fSgpKTtcbn1cbiIsIi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zdGVmYW5wZW5uZXIvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgNC4xLjBcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIChnbG9iYWwuRVM2UHJvbWlzZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxudmFyIF9pc0FycmF5ID0gdW5kZWZpbmVkO1xuaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gIF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xufSBlbHNlIHtcbiAgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xufVxuXG52YXIgaXNBcnJheSA9IF9pc0FycmF5O1xuXG52YXIgbGVuID0gMDtcbnZhciB2ZXJ0eE5leHQgPSB1bmRlZmluZWQ7XG52YXIgY3VzdG9tU2NoZWR1bGVyRm4gPSB1bmRlZmluZWQ7XG5cbnZhciBhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gIGxlbiArPSAyO1xuICBpZiAobGVuID09PSAyKSB7XG4gICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIGlmIChjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgY3VzdG9tU2NoZWR1bGVyRm4oZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICBjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG59XG5cbmZ1bmN0aW9uIHNldEFzYXAoYXNhcEZuKSB7XG4gIGFzYXAgPSBhc2FwRm47XG59XG5cbnZhciBicm93c2VyV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG52YXIgYnJvd3Nlckdsb2JhbCA9IGJyb3dzZXJXaW5kb3cgfHwge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHt9KS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbi8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG52YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbn1cblxuLy8gdmVydHhcbmZ1bmN0aW9uIHVzZVZlcnR4VGltZXIoKSB7XG4gIGlmICh0eXBlb2YgdmVydHhOZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2ZXJ0eE5leHQoZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIG5vZGUuZGF0YSA9IGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyO1xuICB9O1xufVxuXG4vLyB3ZWIgd29ya2VyXG5mdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gZXM2LXByb21pc2Ugd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgZ2xvYmFsU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdsb2JhbFNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgIHZhciBhcmcgPSBxdWV1ZVtpICsgMV07XG5cbiAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gYXR0ZW1wdFZlcnR4KCkge1xuICB0cnkge1xuICAgIHZhciByID0gcmVxdWlyZTtcbiAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB1bmRlZmluZWQ7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgaWYgKF9zdGF0ZSkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBfYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2VDYWxsYmFjayhfc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG52YXIgUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxudmFyIEdFVF9USEVOX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW4ocHJvbWlzZSkge1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gR0VUX1RIRU5fRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKSB7XG4gIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmIHRoZW4kJCA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUpIHtcbiAgICBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhlbiQkID09PSBHRVRfVEhFTl9FUlJPUikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0aGVuJCQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkKSkge1xuICAgICAgaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgZ2V0VGhlbih2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgfVxuXG4gIHB1Ymxpc2gocHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEO1xuXG4gIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHByb21pc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHVuZGVmaW5lZCxcbiAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gRXJyb3JPYmplY3QoKSB7XG4gIHRoaXMuZXJyb3IgPSBudWxsO1xufVxuXG52YXIgVFJZX0NBVENIX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgcmV0dXJuIFRSWV9DQVRDSF9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2NlZWRlZCA9IHVuZGVmaW5lZCxcbiAgICAgIGZhaWxlZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICB2YWx1ZSA9IHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgdmFsdWUuZXJyb3IgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAvLyBub29wXG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gRlVMRklMTEVEKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBlKTtcbiAgfVxufVxuXG52YXIgaWQgPSAwO1xuZnVuY3Rpb24gbmV4dElkKCkge1xuICByZXR1cm4gaWQrKztcbn1cblxuZnVuY3Rpb24gbWFrZVByb21pc2UocHJvbWlzZSkge1xuICBwcm9taXNlW1BST01JU0VfSURdID0gaWQrKztcbiAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICBtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBfcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gIHZhciBfaW5wdXQgPSB0aGlzLl9pbnB1dDtcblxuICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fZWFjaEVudHJ5KF9pbnB1dFtpXSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICB2YXIgcmVzb2x2ZSQkID0gYy5yZXNvbHZlO1xuXG4gIGlmIChyZXNvbHZlJCQgPT09IHJlc29sdmUpIHtcbiAgICB2YXIgX3RoZW4gPSBnZXRUaGVuKGVudHJ5KTtcblxuICAgIGlmIChfdGhlbiA9PT0gdGhlbiAmJiBlbnRyeS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIF90aGVuKTtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUkJChlbnRyeSk7XG4gICAgICB9KSwgaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQoZW50cnkpLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uIChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uIChwcm9taXNlLCBpKSB7XG4gIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgfSk7XG59O1xuXG4vKipcbiAgYFByb21pc2UuYWxsYCBhY2NlcHRzIGFuIGFycmF5IG9mIHByb21pc2VzLCBhbmQgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IG9mIGZ1bGZpbGxtZW50IHZhbHVlcyBmb3IgdGhlIHBhc3NlZCBwcm9taXNlcywgb3JcbiAgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBiZSByZWplY3RlZC4gSXQgY2FzdHMgYWxsXG4gIGVsZW1lbnRzIG9mIHRoZSBwYXNzZWQgaXRlcmFibGUgdG8gcHJvbWlzZXMgYXMgaXQgcnVucyB0aGlzIGFsZ29yaXRobS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVzb2x2ZSgyKTtcbiAgbGV0IHByb21pc2UzID0gcmVzb2x2ZSgzKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBhbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICBsZXQgcHJvbWlzZTMgPSByZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIGFycmF5IG9mIHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4gIEBzdGF0aWNcbiovXG5mdW5jdGlvbiBhbGwoZW50cmllcykge1xuICByZXR1cm4gbmV3IEVudW1lcmF0b3IodGhpcywgZW50cmllcykucHJvbWlzZTtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJhY2VgIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaCBpcyBzZXR0bGVkIGluIHRoZSBzYW1lIHdheSBhcyB0aGVcbiAgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gc2V0dGxlLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAyJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUHJvbWlzZS5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0XG4gIHNldHRsZWQgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGVcbiAgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3Qgc2V0dGxlZCBwcm9taXNlIGhhc1xuICBiZWNvbWUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAgcHJvbWlzZSB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdwcm9taXNlIDInKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnNcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBBbiBleGFtcGxlIHJlYWwtd29ybGQgdXNlIGNhc2UgaXMgaW1wbGVtZW50aW5nIHRpbWVvdXRzOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgUHJvbWlzZS5yYWNlKFthamF4KCdmb28uanNvbicpLCB0aW1lb3V0KDUwMDApXSlcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB3aGljaCBzZXR0bGVzIGluIHRoZSBzYW1lIHdheSBhcyB0aGUgZmlyc3QgcGFzc2VkXG4gIHByb21pc2UgdG8gc2V0dGxlLlxuKi9cbmZ1bmN0aW9uIHJhY2UoZW50cmllcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKF8sIHJlamVjdCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgYFByb21pc2UucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWQgYHJlYXNvbmAuXG4gIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UgPyBpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBuZWVkc05ldygpO1xuICB9XG59XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHJlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHJlamVjdDtcblByb21pc2UuX3NldFNjaGVkdWxlciA9IHNldFNjaGVkdWxlcjtcblByb21pc2UuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZS5fYXNhcCA9IGFzYXA7XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICAvKipcbiAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBDaGFpbmluZ1xuICAgIC0tLS0tLS0tXG4gIFxuICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgIH0pO1xuICBcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICB9KTtcbiAgICBgYGBcbiAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQXNzaW1pbGF0aW9uXG4gICAgLS0tLS0tLS0tLS0tXG4gIFxuICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IHJlc3VsdDtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IGF1dGhvciwgYm9va3M7XG4gIFxuICAgIHRyeSB7XG4gICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgXG4gICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICBcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kQXV0aG9yKCkuXG4gICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIHRoZW5cbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgdGhlbjogdGhlbixcblxuICAvKipcbiAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cbiAgXG4gICAgYGBganNcbiAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICB9XG4gIFxuICAgIC8vIHN5bmNocm9ub3VzXG4gICAgdHJ5IHtcbiAgICAgIGZpbmRBdXRob3IoKTtcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9XG4gIFxuICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgY2F0Y2hcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICAnY2F0Y2gnOiBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgdmFyIGxvY2FsID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gICAgaWYgKFApIHtcbiAgICAgICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBzaWxlbnRseSBpZ25vcmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2U7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UucG9seWZpbGwgPSBwb2x5ZmlsbDtcblByb21pc2UuUHJvbWlzZSA9IFByb21pc2U7XG5cbnJldHVybiBQcm9taXNlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXM2LXByb21pc2UubWFwXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
