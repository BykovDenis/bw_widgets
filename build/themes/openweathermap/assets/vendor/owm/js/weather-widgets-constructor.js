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

    this.selectedCity = this.selectedCity.bind(this);

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
          window.cityId = event.target.id;
          window.cityName = event.target.textContent;

          var objWidget = new _weatherWidget2.default(generateWidget.paramsWidget, generateWidget.controlsWidget, generateWidget.urls);
          objWidget.render();
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
          date: _this3.timestampToDateTime(elem.dt),
          dt: elem.dt
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
        var date = new Date(elem.dt * 1000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxDb29raWVzLmpzIiwiYXNzZXRzXFxqc1xcY2l0aWVzLmpzIiwiYXNzZXRzXFxqc1xcY3VzdG9tLWRhdGUuanMiLCJhc3NldHNcXGpzXFxkYXRhXFxuYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXHdpbmQtc3BlZWQtZGF0YS5qcyIsImFzc2V0c1xcanNcXGdlbmVyYXRvci13aWRnZXQuanMiLCJhc3NldHNcXGpzXFxncmFwaGljLWQzanMuanMiLCJhc3NldHNcXGpzXFxwb3B1cC5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIiwibm9kZV9tb2R1bGVzL1N0cmluZy5mcm9tQ29kZVBvaW50L2Zyb21jb2RlcG9pbnQuanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7SUFDcUIsTzs7Ozs7Ozs4QkFFVCxJLEVBQU0sSyxFQUFPO0FBQ3JCLFVBQUksVUFBVSxJQUFJLElBQUosRUFBZDtBQUNBLGNBQVEsT0FBUixDQUFnQixRQUFRLE9BQVIsS0FBcUIsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUF0RDtBQUNBLGVBQVMsTUFBVCxHQUFrQixPQUFPLEdBQVAsR0FBYSxPQUFPLEtBQVAsQ0FBYixHQUE2QixZQUE3QixHQUE0QyxRQUFRLFdBQVIsRUFBNUMsR0FBcUUsVUFBdkY7QUFDRDs7QUFFRDs7Ozs4QkFDVSxJLEVBQU07QUFDZCxVQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLElBQUksTUFBSixDQUNsQyxhQUFhLEtBQUssT0FBTCxDQUFhLDhCQUFiLEVBQTZDLE1B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Qkk7QUF1QlYsbUJBQU0sRUF2Qkk7QUF3QlYsbUJBQU0sRUF4Qkk7QUF5QlYsbUJBQU0sRUF6Qkk7QUEwQlYsbUJBQU0sRUExQkk7QUEyQlYsbUJBQU0sRUEzQkk7QUE0QlYsbUJBQU0sRUE1Qkk7QUE2QlYsbUJBQU0sRUE3Qkk7QUE4QlYsbUJBQU0sRUE5Qkk7QUErQlYsbUJBQU0sRUEvQkk7QUFnQ1YsbUJBQU0sRUFoQ0k7QUFpQ1YsbUJBQU0sRUFqQ0k7QUFrQ1YsbUJBQU0sRUFsQ0k7QUFtQ1YsbUJBQU0sRUFuQ0k7QUFvQ1YsbUJBQU0sRUFwQ0k7QUFxQ1YsbUJBQU0sRUFyQ0k7QUFzQ1YsbUJBQU0sRUF0Q0k7QUF1Q1YsbUJBQU0sRUF2Q0k7QUF3Q1YsbUJBQU0sRUF4Q0k7QUF5Q1YsbUJBQU0sRUF6Q0k7QUEwQ1YsbUJBQU0sRUExQ0k7QUEyQ1YsbUJBQU0sRUEzQ0k7QUE0Q1YsbUJBQU0sRUE1Q0k7QUE2Q1YsbUJBQU0sRUE3Q0k7QUE4Q1YsbUJBQU0sRUE5Q0k7QUErQ1YsbUJBQU0sRUEvQ0k7QUFnRFYsbUJBQU0sRUFoREk7QUFpRFYsbUJBQU0sRUFqREk7QUFrRFYsbUJBQU0sRUFsREk7QUFtRFYsbUJBQU0sRUFuREk7QUFvRFYsbUJBQU0sRUFwREk7QUFxRFYsbUJBQU0sRUFyREk7QUFzRFYsbUJBQU0sRUF0REk7QUF1RFYsbUJBQU0sRUF2REk7QUF3RFYsbUJBQU0sRUF4REk7QUF5RFYsbUJBQU0sRUF6REk7QUEwRFYsbUJBQU0sRUExREk7QUEyRFYsbUJBQU0sRUEzREk7QUE0RFYsbUJBQU0sRUE1REk7QUE2RFYsbUJBQU0sRUE3REk7QUE4RFYsbUJBQU0sRUE5REk7QUErRFYsbUJBQU0sRUEvREk7QUFnRVYsbUJBQU0sRUFoRUk7QUFpRVYsbUJBQU0sRUFqRUk7QUFrRVYsbUJBQU0sRUFsRUk7QUFtRVYsbUJBQU0sRUFuRUk7QUFvRVYsbUJBQU0sRUFwRUk7QUFxRVYsbUJBQU0sRUFyRUk7QUFzRVYsbUJBQU0sRUF0RUk7QUF1RVYsbUJBQU0sRUF2RUk7QUF3RVYsbUJBQU0sRUF4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USxNQUFSLENBQWUsT0FBTyxFQUF0QixFQUEyQixDQUFDLENBQUQsR0FBSyxJQUFJLENBQUosRUFBTyxHQUFaLEdBQWtCLElBQW5CLEdBQTJCLEtBQXJEO0FBQ0EsY0FBUSxTQUFSLEdBQW9CLE1BQXBCO0FBQ0EsY0FBUSxNQUFSLENBQWUsT0FBTyxFQUF0QixFQUEyQixDQUFDLENBQUQsR0FBSyxJQUFJLENBQUosRUFBTyxHQUFaLEdBQWtCLElBQW5CLEdBQTJCLEtBQXJEO0FBQ0EsY0FBUSxTQUFSO0FBQ0EsY0FBUSxXQUFSLEdBQXNCLE1BQXRCO0FBQ0EsY0FBUSxNQUFSO0FBQ0EsY0FBUSxJQUFSO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUssaUJBQUw7QUFDRDs7Ozs7O2tCQTlma0IsYTs7O0FDWHJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdG9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vINCg0LDQsdC+0YLQsCDRgSDQutGD0LrQsNC80LhcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29va2llcyB7XHJcblxyXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSkge1xyXG4gICAgdmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZXhwaXJlcy5zZXRUaW1lKGV4cGlyZXMuZ2V0VGltZSgpICsgKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjsgZXhwaXJlcz1cIiArIGV4cGlyZXMudG9HTVRTdHJpbmcoKSArICBcIjsgcGF0aD0vXCI7XHJcbiAgfVxyXG5cclxuICAvLyDQstC+0LfQstGA0LDRidCw0LXRgiBjb29raWUg0YEg0LjQvNC10L3QtdC8IG5hbWUsINC10YHQu9C4INC10YHRgtGMLCDQtdGB0LvQuCDQvdC10YIsINGC0L4gdW5kZWZpbmVkXHJcbiAgZ2V0Q29va2llKG5hbWUpIHtcclxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXHJcbiAgICAgIFwiKD86Xnw7IClcIiArIG5hbWUucmVwbGFjZSgvKFtcXC4kPyp8e31cXChcXClcXFtcXF1cXFxcXFwvXFwrXl0pL2csICdcXFxcJDEnKSArIFwiPShbXjtdKilcIlxyXG4gICAgKSk7XHJcbiAgICByZXR1cm4gbWF0Y2hlcyA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaGVzWzFdKSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUNvb2tpZSgpIHtcclxuICAgIHRoaXMuc2V0Q29va2llKG5hbWUsIFwiXCIsIHtcclxuICAgICAgZXhwaXJlczogLTFcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4qIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cclxuKi9cclxuXHJcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XHJcbnJlcXVpcmUoJ1N0cmluZy5mcm9tQ29kZVBvaW50Jyk7XHJcbmltcG9ydCBXZWF0aGVyV2lkZ2V0IGZyb20gJy4vd2VhdGhlci13aWRnZXQnO1xyXG5pbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0aWVzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lcikge1xyXG5cclxuICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xyXG4gICAgdGhpcy51bml0cyA9IGdlbmVyYXRlV2lkZ2V0LnVuaXRzVGVtcFsxXTtcclxuICAgIGlmICghY2l0eU5hbWUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWRDaXR5ID0gdGhpcy5zZWxlY3RlZENpdHkuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNpdHlOYW1lID0gY2l0eU5hbWUudmFsdWUucmVwbGFjZSgvKFxccykrL2csJy0nKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXIgfHwgJyc7XHJcbiAgICB0aGlzLnVybCA9IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vb3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/cT0ke3RoaXMuY2l0eU5hbWV9JnR5cGU9bGlrZSZzb3J0PXBvcHVsYXRpb24mY250PTMwJmFwcGlkPWIxYjE1ZTg4ZmE3OTcyMjU0MTI0MjljMWM1MGMxMjJhMWA7XHJcblxyXG4gICAgdGhpcy5zZWxDaXR5U2lnbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24uaW5uZXJUZXh0ID0gJyBzZWxlY3RlZCAnO1xyXG4gICAgdGhpcy5zZWxDaXR5U2lnbi5jbGFzcyA9ICd3aWRnZXQtZm9ybV9fc2VsZWN0ZWQnO1xyXG5cclxuICAgIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQuY29udHJvbHNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LnVybHMpO1xyXG5cclxuICAgIG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRDaXRpZXMoKSB7XHJcbiAgICBpZiAoIXRoaXMuY2l0eU5hbWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJsKVxyXG4gICAgICAudGhlbihcclxuICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nZXRTZWFyY2hEYXRhKHJlc3BvbnNlKTtcclxuICAgICAgfSxcclxuICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgIH1cclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIGdldFNlYXJjaERhdGEoSlNPTm9iamVjdCkge1xyXG4gICAgaWYgKCFKU09Ob2JqZWN0Lmxpc3QubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdDaXR5IG5vdCBmb3VuZCcpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KPQtNCw0LvRj9C10Lwg0YLQsNCx0LvQuNGG0YMsINC10YHQu9C4INC10YHRgtGMXHJcbiAgICBjb25zdCB0YWJsZUNpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XHJcbiAgICBpZiAodGFibGVDaXR5KSB7XHJcbiAgICAgIHRhYmxlQ2l0eS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhYmxlQ2l0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGh0bWwgPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgSlNPTm9iamVjdC5saXN0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHtKU09Ob2JqZWN0Lmxpc3RbaV0ubmFtZX0sICR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5fWA7XHJcbiAgICAgIGNvbnN0IGZsYWcgPSBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWFnZXMvZmxhZ3MvJHtKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnkudG9Mb3dlckNhc2UoKX0ucG5nYDtcclxuICAgICAgaHRtbCArPSBgPHRyPjx0ZCBjbGFzcz1cIndpZGdldC1mb3JtX19pdGVtXCI+PGEgaHJlZj1cIi9jaXR5LyR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGlkPVwiJHtKU09Ob2JqZWN0Lmxpc3RbaV0uaWR9XCIgY2xhc3M9XCJ3aWRnZXQtZm9ybV9fbGlua1wiPiR7bmFtZX08L2E+PGltZyBzcmM9XCIke2ZsYWd9XCI+PC9wPjwvdGQ+PC90cj5gO1xyXG4gICAgfVxyXG5cclxuICAgIGh0bWwgPSBgPHRhYmxlIGNsYXNzPVwidGFibGVcIiBpZD1cInRhYmxlLWNpdGllc1wiPiR7aHRtbH08L3RhYmxlPmA7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIGNvbnN0IHRhYmxlQ2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xyXG5cclxuICAgIHRhYmxlQ2l0aWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zZWxlY3RlZENpdHkpO1xyXG4gIH1cclxuXHJcbiAgc2VsZWN0ZWRDaXR5KGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICgnQScpLnRvTG93ZXJDYXNlKCkgJiYgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd2lkZ2V0LWZvcm1fX2xpbmsnKSkge1xyXG4gICAgICBsZXQgc2VsZWN0ZWRDaXR5ID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkQ2l0eScpO1xyXG4gICAgICBpZiAoIXNlbGVjdGVkQ2l0eSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLnNlbENpdHlTaWduLCBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICAvLyDQn9C+0LTRgdGC0LDQvdC+0LLQutCwINC90LDQudC00LXQvdC+0LPQviDQs9C+0YDQvtC00LBcclxuICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQuY2l0eUlkID0gZXZlbnQudGFyZ2V0LmlkO1xyXG4gICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC5jaXR5TmFtZSA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcclxuICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQudW5pdHMgPSB0aGlzLnVuaXRzO1xyXG4gICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0oZXZlbnQudGFyZ2V0LmlkLCBldmVudC50YXJnZXQudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIHdpbmRvdy5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XHJcbiAgICAgICAgd2luZG93LmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xyXG5cclxuICAgICAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LmNvbnRyb2xzV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC51cmxzKTtcclxuICAgICAgICBvYmpXaWRnZXQucmVuZGVyKCk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICogQHBhcmFtIHVybFxyXG4gICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgKi9cclxuICBodHRwR2V0KHVybCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuKi9cclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgLyoqXHJcbiAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgKi9cclxuICBudW1iZXJEYXlzT2ZZZWFyWFhYKG51bWJlcikge1xyXG4gICAgaWYgKG51bWJlciA+IDM2NSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAobnVtYmVyIDwgMTApIHtcclxuICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMCkge1xyXG4gICAgICByZXR1cm4gYDAke251bWJlcn1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bWJlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXHJcbiAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge2ludGVnZXJ9ICDQn9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINCyINCz0L7QtNGDXHJcbiAgKi9cclxuICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgY29uc3QgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC/0YDQtdC+0L7QsdGA0LDQt9GD0LXRgiDQtNCw0YLRgyDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+INCyIHl5eXktbW0tZGRcclxuICAqIEBwYXJhbSAge3N0cmluZ30gZGF0ZSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKiBAcmV0dXJuIHtkYXRlfSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgKi9cclxuICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpIHtcclxuICAgIGNvbnN0IHJlID0gLyhcXGR7NH0pKC0pKFxcZHszfSkvO1xyXG4gICAgY29uc3QgbGluZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICBjb25zdCBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgIGNvbnN0IHVuaXh0aW1lID0gYmVnaW55ZWFyLmdldFRpbWUoKSArIChsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKiAyNCk7XHJcbiAgICBjb25zdCByZXMgPSBuZXcgRGF0ZSh1bml4dGltZSk7XHJcblxyXG4gICAgY29uc3QgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBjb25zdCBkYXlzID0gcmVzLmdldERhdGUoKTtcclxuICAgIGNvbnN0IHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcclxuICAgIHJldHVybiBgJHtkYXlzIDwgMTAgPyBgMCR7ZGF5c31gIDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQtNCw0YLRiyDQstC40LTQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKi9cclxuICBmb3JtYXREYXRlKGRhdGUxKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG5cclxuICAgIHJldHVybiBgJHt5ZWFyfS0keyhtb250aCA8IDEwKSA/IGAwJHttb250aH1gIDogbW9udGh9IC0gJHsoZGF5IDwgMTApID8gYDAke2RheX1gIDogZGF5fWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAqL1xyXG4gIGdldEN1cnJlbnREYXRlKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC/0L7RgdC70LXQtNC90LjQtSDRgtGA0Lgg0LzQtdGB0Y/RhtCwXHJcbiAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIGxldCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgbGV0IGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcbiAgICBkYXkgLT0gOTA7XHJcbiAgICBpZiAoZGF5IDwgMCkge1xyXG4gICAgICB5ZWFyIC09IDE7XHJcbiAgICAgIGRheSA9IDM2NSAtIGRheTtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHt5ZWFyfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0Q3VycmVudFN1bW1lckRhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldEN1cnJlbnRTcHJpbmdEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRMYXN0U3VtbWVyRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgLSAxO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpIHtcclxuICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IC0gMDAxYDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgdGltZXN0YW1wVG9EYXRlVGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBoaDptbV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgIHJldHVybiBgJHtob3VycyA8IDEwID8gYDAke2hvdXJzfWAgOiBob3Vyc30gOiAke21pbnV0ZXMgPCAxMCA/IGAwJHttaW51dGVzfWAgOiBtaW51dGVzfSBgO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICogQHJldHVybnMge251bWJlcn1cclxuICAqL1xyXG4gIGdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7XHJcbiAgfVxyXG5cclxuICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgKi9cclxuICBnZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIoZGF5TnVtYmVyKSB7XHJcbiAgICBjb25zdCBkYXlzID0ge1xyXG4gICAgICAwOiAnU3VuJyxcclxuICAgICAgMTogJ01vbicsXHJcbiAgICAgIDI6ICdUdWUnLFxyXG4gICAgICAzOiAnV2VkJyxcclxuICAgICAgNDogJ1RodScsXHJcbiAgICAgIDU6ICdGcmknLFxyXG4gICAgICA2OiAnU2F0JyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGF5c1tkYXlOdW1iZXJdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQtdGA0L3Rg9GC0Ywg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC80LXRgdGP0YbQsCDQv9C+INC10LPQviDQvdC+0LzQtdGA0YNcclxuICAgKiBAcGFyYW0gbnVtTW9udGhcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBnZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKG51bU1vbnRoKXtcclxuXHJcbiAgICBpZih0eXBlb2YgbnVtTW9udGggIT09IFwibnVtYmVyXCIgfHwgbnVtTW9udGggPD0wICYmIG51bU1vbnRoID49IDEyKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoTmFtZSA9IHtcclxuICAgICAgMDogXCJKYW5cIixcclxuICAgICAgMTogXCJGZWJcIixcclxuICAgICAgMjogXCJNYXJcIixcclxuICAgICAgMzogXCJBcHJcIixcclxuICAgICAgNDogXCJNYXlcIixcclxuICAgICAgNTogXCJKdW5cIixcclxuICAgICAgNjogXCJKdWxcIixcclxuICAgICAgNzogXCJBdWdcIixcclxuICAgICAgODogXCJTZXBcIixcclxuICAgICAgOTogXCJPY3RcIixcclxuICAgICAgMTA6IFwiTm92XCIsXHJcbiAgICAgIDExOiBcIkRlY1wiXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBtb250aE5hbWVbbnVtTW9udGhdO1xyXG4gIH1cclxuXHJcbiAgLyoqINCh0YDQsNCy0L3QtdC90LjQtSDQtNCw0YLRiyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5ID0gZGQubW0ueXl5eSDRgSDRgtC10LrRg9GJ0LjQvCDQtNC90LXQvFxyXG4gICpcclxuICAqL1xyXG4gIGNvbXBhcmVEYXRlc1dpdGhUb2RheShkYXRlKSB7XHJcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSA9PT0gKG5ldyBEYXRlKCkpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZGF0ZSkge1xyXG4gICAgY29uc3QgcmUgPSAvKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XHJcbiAgICBjb25zdCByZXNEYXRlID0gcmUuZXhlYyhkYXRlKTtcclxuICAgIGlmIChyZXNEYXRlLmxlbmd0aCA9PT0gNikge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YCk7XHJcbiAgICB9XHJcbiAgICAvLyDQldGB0LvQuCDQtNCw0YLQsCDQvdC1INGA0LDRgdC/0LDRgNGB0LXQvdCwINCx0LXRgNC10Lwg0YLQtdC60YPRidGD0Y5cclxuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgSEg6TU0gTW9udGhOYW1lIE51bWJlckRhdGVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICByZXR1cm4gYCR7ZGF0ZS5nZXRIb3VycygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRIb3VycygpfWAgOiBkYXRlLmdldEhvdXJzKCkgfToke2RhdGUuZ2V0TWludXRlcygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRNaW51dGVzKCl9YCA6IGRhdGUuZ2V0TWludXRlcygpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfSAke2RhdGUuZ2V0RGF0ZSgpfWA7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIwLjEwLjIwMTYuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbmF0dXJhbFBoZW5vbWVub24gPXtcclxuICAgIFwiZW5cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJFbmdsaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnaHQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImhlYXZ5IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwicmFnZ2VkIHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcInNob3dlciByYWluIGFuZCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJoZWF2eSBzaG93ZXIgcmFpbiBhbmQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwic2hvd2VyIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1vZGVyYXRlIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhlYXZ5IGludGVuc2l0eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZXJ5IGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiZnJlZXppbmcgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlnaHQgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJyYWdnZWQgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNub3dcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzaG93ZXIgc2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcImxpZ2h0IHJhaW4gYW5kIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcInJhaW4gYW5kIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcImxpZ2h0IHNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiaGVhdnkgc2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2tlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJoYXplXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJzYW5kLGR1c3Qgd2hpcmxzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJmb2dcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInNhbmRcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcImR1c3RcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInZvbGNhbmljIGFzaFwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwic3F1YWxsc1wiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2xlYXIgc2t5XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJmZXcgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzY2F0dGVyZWQgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJicm9rZW4gY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJvdmVyY2FzdCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2FsIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWNhbmVcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImNvbGRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZHlcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhaWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcInNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcImxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiZ2VudGxlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwibW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJmcmVzaCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcInN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcImhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJzZXZlcmUgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwic3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcInZpb2xlbnQgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcImh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicnVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJSdXNzaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQ0YlxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDMyXFx1MDQzZVxcdTA0MzdcXHUwNDNjXFx1MDQzZVxcdTA0MzZcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0MzZcXHUwNDM1XFx1MDQ0MVxcdTA0NDJcXHUwNDNlXFx1MDQzYVxcdTA0MzBcXHUwNDRmIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDNlXFx1MDQ0N1xcdTA0MzVcXHUwNDNkXFx1MDQ0YyBcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDNiXFx1MDQ1MVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQzOFxcdTA0M2RcXHUwNDQyXFx1MDQzNVxcdTA0M2RcXHUwNDQxXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQzZlxcdTA0NDBcXHUwNDNlXFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0M2VcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXFx1MDQzYlxcdTA0NGNcXHUwNDQ4XFx1MDQzZVxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0NGZcXHUwNDNhXFx1MDQzZVxcdTA0NDJcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDM1XFx1MDQ0MVxcdTA0NDdcXHUwNDMwXFx1MDQzZFxcdTA0MzBcXHUwNDRmIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NGZcXHUwNDQxXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQzZlxcdTA0MzBcXHUwNDQxXFx1MDQzY1xcdTA0NDNcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzBcXHUwNDRmIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0NDNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQzNlxcdTA0MzBcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0MzVcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaXRcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJJdGFsaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2lhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWEgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRlbXBvcmFsZVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0ZW1wb3JhbGUgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRlbXBvcmFsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJmb3J0ZSBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiYWNxdWF6em9uZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGlvZ2dpYSBsZWdnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwaW9nZ2lhIG1vZGVyYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJmb3J0ZSBwaW9nZ2lhXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwaW9nZ2lhIGZvcnRpc3NpbWFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcInBpb2dnaWEgZXN0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGlvZ2dpYSBnZWxhdGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZSBuZXZpY2F0YVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibmV2aXNjaGlvXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJmb3J0ZSBuZXZpY2F0YVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZm9zY2hpYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtb1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiZm9zY2hpYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwibXVsaW5lbGxpIGRpIHNhYmJpYVxcL3BvbHZlcmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm5lYmJpYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2llbG8gc2VyZW5vXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJwb2NoZSBudXZvbGVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51Ymkgc3BhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJpIHNwYXJzZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiY2llbG8gY29wZXJ0b1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcGVzdGEgdHJvcGljYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJ1cmFnYW5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmVkZG9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbGRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuZGluZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbW9cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkJhdmEgZGkgdmVudG9cIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyZXp6YSBsZWdnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmV6emEgdGVzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiVXJhZ2Fub1wiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwic3BcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJTcGFuaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnZXJhIHRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiZnVlcnRlIHRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0b3JtZW50YSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibGxvdml6bmFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImxsb3Zpem5hIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGx1dmlhIHkgbGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJsbHV2aWEgeSBsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwibGx1dmlhIHkgbGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJjaHViYXNjb1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGx1dmlhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibGx1dmlhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJsbHV2aWEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJsbHV2aWEgbXV5IGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwibGx1dmlhIG11eSBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImxsdXZpYSBoZWxhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNodWJhc2NvIGRlIGxpZ2VyYSBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHViYXNjb1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2h1YmFzY28gZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZhZGEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwibmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImFndWFuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiY2h1YmFzY28gZGUgbmlldmVcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiaHVtb1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwibmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0b3JiZWxsaW5vcyBkZSBhcmVuYVxcL3BvbHZvXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicnVtYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2llbG8gY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImFsZ28gZGUgbnViZXNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51YmVzIGRpc3BlcnNhc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViZXMgcm90YXNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0b3JtZW50YSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyYWNcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJcXHUwMGVkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5pem9cIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1hXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJWaWVudG8gZmxvam9cIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlZpZW50byBzdWF2ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiVmllbnRvIG1vZGVyYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiVmllbnRvIGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmllbnRvIGZ1ZXJ0ZSwgcHJcXHUwMGYzeGltbyBhIHZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YWRcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhZCB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWNcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidWFcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJVa3JhaW5pYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzN1xcdTA0NTYgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2VcXHUwNDRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzYVxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0NDJcXHUwNDNhXFx1MDQzZVxcdTA0NDdcXHUwNDMwXFx1MDQ0MVxcdTA0M2RcXHUwNDU2IFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDNmXFx1MDQzZVxcdTA0M2NcXHUwNDU2XFx1MDQ0MFxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDNhXFx1MDQ0MFxcdTA0MzhcXHUwNDM2XFx1MDQzMFxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzMyBcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0M2NcXHUwNDNlXFx1MDQzYVxcdTA0NDBcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDQxXFx1MDQzNVxcdTA0NDBcXHUwNDNmXFx1MDQzMFxcdTA0M2RcXHUwNDNlXFx1MDQzYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0NTZcXHUwNDQ5XFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDMwXFx1MDQzY1xcdTA0MzVcXHUwNDQyXFx1MDQ1NlxcdTA0M2JcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0N1xcdTA0MzhcXHUwNDQxXFx1MDQ0MlxcdTA0MzUgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQ0NVxcdTA0MzggXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDU2XFx1MDQ0MFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0NTYgXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQ1NlxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDM1XFx1MDQzMlxcdTA0NTZcXHUwNDM5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDQxXFx1MDQzZlxcdTA0MzVcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0NTZcXHUwNDQyXFx1MDQ0MFxcdTA0NGZcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJkZVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkdlcm1hblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkdld2l0dGVyIG1pdCBsZWljaHRlbSBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiR2V3aXR0ZXIgbWl0IFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHZXdpdHRlciBtaXQgc3RhcmtlbSBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGVpY2h0ZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNjaHdlcmUgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImVpbmlnZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHZXdpdHRlciBtaXQgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdld2l0dGVyIG1pdCBzdGFya2VtIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsZWljaHRlcyBOaWVzZWxuXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJOaWVzZWxuXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzdGFya2VzIE5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxlaWNodGVyIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwic3RhcmtlciBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiTmllc2Vsc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGVpY2h0ZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1cXHUwMGU0XFx1MDBkZmlnZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInNlaHIgc3RhcmtlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJTdGFya3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJFaXNyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGVpY2h0ZSBSZWdlbnNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVmdGlnZSBSZWdlbnNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm1cXHUwMGU0XFx1MDBkZmlnZXIgU2NobmVlXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJTY2huZWVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlZnRpZ2VyIFNjaG5lZWZhbGxcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkdyYXVwZWxcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlNjaG5lZXNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInRyXFx1MDBmY2JcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJEdW5zdFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiU2FuZCBcXC8gU3RhdWJzdHVybVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTmViZWxcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImtsYXJlciBIaW1tZWxcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImVpbiBwYWFyIFdvbGtlblwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDBmY2JlcndpZWdlbmQgYmV3XFx1MDBmNmxrdFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDBmY2JlcndpZWdlbmQgYmV3XFx1MDBmNmxrdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwid29sa2VuYmVkZWNrdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVHJvcGVuc3R1cm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cnJpa2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrYWx0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJoZWlcXHUwMGRmXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5kaWdcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIkhhZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJXaW5kc3RpbGxlXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMZWljaHRlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJNaWxkZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTVxcdTAwZTRcXHUwMGRmaWdlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmlzY2hlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdGFya2UgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhvY2h3aW5kLCBhbm5cXHUwMGU0aGVuZGVyIFN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2Nod2VyZXIgU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJIZWZ0aWdlcyBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3JrYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInB0XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUG9ydHVndWVzZVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0cm92b2FkYSBjb20gY2h1dmFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidHJvdm9hZGEgbGV2ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidHJvdm9hZGFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRyb3ZvYWRhIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidHJvdm9hZGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgZnJhY2FcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidHJvdm9hZGEgY29tIGdhcm9hIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiZ2Fyb2EgZnJhY2FcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJnYXJvYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaHV2YSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJjaHV2YSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiY2h1dmEgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImNodXZhIGRlIGdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJjaHV2YSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiQ2h1dmEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImNodXZhIGRlIGludGVuc2lkYWRlIHBlc2Fkb1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiY2h1dmEgbXVpdG8gZm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIkNodXZhIEZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaHV2YSBjb20gY29uZ2VsYW1lbnRvXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaHV2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2h1dmFcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImNodXZhIGRlIGludGVuc2lkYWRlIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTmV2ZSBicmFuZGFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk5ldmUgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJjaHV2YSBjb20gbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiYmFuaG8gZGUgbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiTlxcdTAwZTl2b2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bWFcXHUwMGU3YVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwibmVibGluYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidHVyYmlsaFxcdTAwZjVlcyBkZSBhcmVpYVxcL3BvZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTmVibGluYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY1xcdTAwZTl1IGNsYXJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJBbGd1bWFzIG51dmVuc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnV2ZW5zIGRpc3BlcnNhc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnV2ZW5zIHF1ZWJyYWRvc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwidGVtcG8gbnVibGFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcGVzdGFkZSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiZnVyYWNcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJpb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwicXVlbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJjb20gdmVudG9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5pem9cIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicm9cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJSb21hbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImZ1cnR1blxcdTAxMDMgY3UgcGxvYWllIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiZnVydHVuXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVydHVuXFx1MDEwMyBjdSBwbG9haWUgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJmdXJ0dW5cXHUwMTAzIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiZnVydHVuXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiZnVydHVuXFx1MDEwMyBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImZ1cnR1blxcdTAxMDMgYXByaWdcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIGpvYXNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIG1hcmVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgam9hc1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgbWFyZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGxvYWllIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwicGxvYWllXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJwbG9haWUgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwbG9haWUgdG9yZW5cXHUwMjFiaWFsXFx1MDEwMyBcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcInBsb2FpZSBleHRyZW1cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwbG9haWUgXFx1MDBlZW5naGVcXHUwMjFiYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuaW5zb2FyZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pbnNvYXJlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuaW5zb2FyZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImxhcG92aVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuaW5zb2FyZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ2XFx1MDBlMnJ0ZWp1cmkgZGUgbmlzaXBcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjZXIgc2VuaW5cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImNcXHUwMGUyXFx1MDIxYml2YSBub3JpXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJub3JpIFxcdTAwZWVtcHJcXHUwMTAzXFx1MDIxOXRpYVxcdTAyMWJpXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJjZXIgZnJhZ21lbnRhdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiY2VyIGFjb3Blcml0IGRlIG5vcmlcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImZ1cnR1bmEgdHJvcGljYWxcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJ1cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInJlY2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImZpZXJiaW50ZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmFudCBwdXRlcm5pY1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JpbmRpblxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicGxcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJQb2xpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJCdXJ6YSB6IGxla2tpbWkgb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJCdXJ6YSB6IG9wYWRhbWkgZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiQnVyemEgeiBpbnRlbnN5d255bWkgb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJMZWtrYSBidXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiQnVyemFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlNpbG5hIGJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJCdXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiQnVyemEgeiBsZWtrXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkJ1cnphIHogbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJCdXJ6YSB6IGludGVuc3l3blxcdTAxMDUgbVxcdTAxN2Nhd2tcXHUwMTA1XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJMZWtrYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIk1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiSW50ZW5zeXduYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIkxla2tpZSBvcGFkeSBkcm9ibmVnbyBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJEZXN6Y3ogXFwvIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiSW50ZW5zeXdueSBkZXN6Y3ogXFwvIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiU2lsbmEgbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJMZWtraSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlVtaWFya293YW55IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiSW50ZW5zeXdueSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImJhcmR6byBzaWxueSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlVsZXdhXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJNYXJ6blxcdTAxMDVjeSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIktyXFx1MDBmM3RrYSB1bGV3YVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiRGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJJbnRlbnN5d255LCBsZWtraSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIkxla2tpZSBvcGFkeSBcXHUwMTVibmllZ3VcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTAxNWFuaWVnXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJNb2NuZSBvcGFkeSBcXHUwMTVibmllZ3VcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkRlc3pjeiB6ZSBcXHUwMTVibmllZ2VtXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwMTVhbmllXFx1MDE3Y3ljYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiTWdpZVxcdTAxNDJrYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiU21vZ1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiWmFtZ2xlbmlhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJaYW1pZVxcdTAxMDcgcGlhc2tvd2FcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIk1nXFx1MDE0MmFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkJlemNobXVybmllXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJMZWtraWUgemFjaG11cnplbmllXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJSb3pwcm9zem9uZSBjaG11cnlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlBvY2htdXJubyB6IHByemVqYVxcdTAxNWJuaWVuaWFtaVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiUG9jaG11cm5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJidXJ6YSB0cm9waWthbG5hXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJDaFxcdTAxNDJvZG5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJHb3JcXHUwMTA1Y29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpZXRyem5pZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiR3JhZFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiU3Bva29qbmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMZWtrYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiRGVsaWthdG5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJVbWlhcmtvd2FuYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDE1YXdpZVxcdTAxN2NhIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTaWxuYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiUHJhd2llIHdpY2h1cmFcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIldpY2h1cmFcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNpbG5hIHdpY2h1cmFcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN6dG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiR3dhXFx1MDE0MnRvd255IHN6dG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWdhblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZmlcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJGaW5uaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidWtrb3NteXJza3kgamEga2V2eXQgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidWtrb3NteXJza3kgamEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidWtrb3NteXJza3kgamEga292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJwaWVuaSB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImtvdmEgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImxpZXZcXHUwMGU0IHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInVra29zbXlyc2t5IGphIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidWtrb3NteXJza3kgamEga292YSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZXZcXHUwMGU0IHRpaHV0dGFpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJ0aWh1dHRhYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwia292YSB0aWh1dHRhaW5lblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImtvdmEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInBpZW5pIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImtvaHRhbGFpbmVuIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiZXJpdHRcXHUwMGU0aW4gcnVuc2FzdGEgc2FkZXR0YVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJqXFx1MDBlNFxcdTAwZTR0XFx1MDBlNHZcXHUwMGU0IHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpZXZcXHUwMGU0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwidGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInBpZW5pIGx1bWlzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJsdW1pXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJwYWxqb24gbHVudGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInJcXHUwMGU0bnRcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJsdW1pa3V1cm9cIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNhdnVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImhpZWtrYVxcL3BcXHUwMGY2bHkgcHlcXHUwMGY2cnJlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJzdW11XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJ0YWl2YXMgb24gc2Vsa2VcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJ2XFx1MDBlNGhcXHUwMGU0biBwaWx2aVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcImFqb2l0dGFpc2lhIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiaGFqYW5haXNpYSBwaWx2aVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInBpbHZpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9vcHBpbmVuIG15cnNreVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaGlybXVteXJza3lcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImt5bG1cXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJrdXVtYVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidHV1bGluZW5cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcInJha2VpdGFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwibmxcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJEdXRjaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIm9ud2VlcnNidWkgbWV0IGxpY2h0ZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwib253ZWVyc2J1aSBtZXQgcmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIm9ud2VlcnNidWkgbWV0IHp3YXJlIHJlZ2VudmFsXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWNodGUgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwib253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiendhcmUgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib25yZWdlbG1hdGlnIG9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIm9ud2VlcnNidWkgbWV0IGxpY2h0ZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwib253ZWVyc2J1aSBtZXQgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIm9ud2VlcnNidWkgbWV0IHp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWNodGUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJ6d2FyZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGljaHRlIG1vdHJlZ2VuXFwvcmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIm1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJ6d2FyZSBtb3RyZWdlblxcL3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ6d2FyZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGljaHRlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtYXRpZ2UgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInp3YXJlIHJlZ2VudmFsXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ6ZWVyIHp3YXJlIHJlZ2VudmFsXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJLb3VkZSBidWllblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGljaHRlIHN0b3J0cmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInN0b3J0cmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInp3YXJlIHN0b3J0cmVnZW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpY2h0ZSBzbmVldXdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGV2aWdlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiaWp6ZWxcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5hdHRlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwibmV2ZWxcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInphbmRcXC9zdG9mIHdlcnZlbGluZ1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwib25iZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJsaWNodCBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJoYWxmIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcInp3YWFyIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImdlaGVlbCBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waXNjaGUgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia291ZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaGVldFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwic3Rvcm1hY2h0aWdcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJXaW5kc3RpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiS2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGljaHRlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJaYWNodGUgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1hdGlnZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiVnJpaiBrcmFjaHRpZ2Ugd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiS3JhY2h0aWdlIHdpbmRcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhhcmRlIHdpbmRcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlN0b3JtYWNodGlnXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiWndhcmUgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlplZXIgendhcmUgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk9ya2FhblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZnJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJGcmVuY2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJvcmFnZSBldCBwbHVpZSBmaW5lXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvcmFnZSBldCBwbHVpZVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwib3JhZ2UgZXQgZm9ydGVzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwib3JhZ2VzIGxcXHUwMGU5Z2Vyc1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwib3JhZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJncm9zIG9yYWdlc1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib3JhZ2VzIFxcdTAwZTlwYXJzZXNcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIk9yYWdlIGF2ZWMgbFxcdTAwZTlnXFx1MDBlOHJlIGJydWluZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwib3JhZ2VzIFxcdTAwZTlwYXJzZXNcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImdyb3Mgb3JhZ2VcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIkJydWluZSBsXFx1MDBlOWdcXHUwMGU4cmVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIkJydWluZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiRm9ydGVzIGJydWluZXNcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlBsdWllIGZpbmUgXFx1MDBlOXBhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwbHVpZSBmaW5lXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJDcmFjaGluIGludGVuc2VcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIkF2ZXJzZXMgZGUgYnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsXFx1MDBlOWdcXHUwMGU4cmVzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwicGx1aWVzIG1vZFxcdTAwZTlyXFx1MDBlOWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJGb3J0ZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ0clxcdTAwZThzIGZvcnRlcyBwclxcdTAwZTljaXBpdGF0aW9uc1wiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZ3Jvc3NlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBsdWllIHZlcmdsYVxcdTAwZTdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwZXRpdGVzIGF2ZXJzZXNcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImF2ZXJzZXMgZGUgcGx1aWVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImF2ZXJzZXMgaW50ZW5zZXNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxcXHUwMGU5Z1xcdTAwZThyZXMgbmVpZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZWlnZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZm9ydGVzIGNodXRlcyBkZSBuZWlnZVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibmVpZ2UgZm9uZHVlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJhdmVyc2VzIGRlIG5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJicnVtZVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiQnJvdWlsbGFyZFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiYnJ1bWVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInRlbXBcXHUwMGVhdGVzIGRlIHNhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicm91aWxsYXJkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJlbnNvbGVpbGxcXHUwMGU5XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJwZXUgbnVhZ2V1eFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicGFydGllbGxlbWVudCBlbnNvbGVpbGxcXHUwMGU5XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWFnZXV4XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJDb3V2ZXJ0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wXFx1MDBlYXRlIHRyb3BpY2FsZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3VyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJvaWRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNoYXVkXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50ZXV4XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJnclxcdTAwZWFsZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkJyaXNlIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJpc2UgZG91Y2VcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyaXNlIG1vZFxcdTAwZTlyXFx1MDBlOWVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNlIGZyYWljaGVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkJyaXNlIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50IGZvcnQsIHByZXNxdWUgdmlvbGVudFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVudCB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW50IHRyXFx1MDBlOHMgdmlvbGVudFwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcFxcdTAwZWF0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiZW1wXFx1MDBlYXRlIHZpb2xlbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPdXJhZ2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJiZ1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkJ1bGdhcmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQzZlxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0M2FcXHUwNDRhXFx1MDQ0MVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0MjBcXHUwNDRhXFx1MDQzY1xcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0MjBcXHUwNDRhXFx1MDQzY1xcdTA0NGZcXHUwNDQ5IFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDIzXFx1MDQzY1xcdTA0MzVcXHUwNDQwXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQxY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0MTRcXHUwNDRhXFx1MDQzNlxcdTA0MzQgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDQyXFx1MDQ0M1xcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0MWZcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDM5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0MjFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0MThcXHUwNDM3XFx1MDQzZFxcdTA0MzVcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDMyXFx1MDQzMFxcdTA0NDkgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0MWVcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDFjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQxNFxcdTA0MzhcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDFkXFx1MDQzOFxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDNjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQxZlxcdTA0NGZcXHUwNDQxXFx1MDQ0YVxcdTA0NDdcXHUwNDNkXFx1MDQzMFxcL1xcdTA0MWZcXHUwNDQwXFx1MDQzMFxcdTA0NDhcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDFjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQyZlxcdTA0NDFcXHUwNDNkXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDFkXFx1MDQzOFxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0M2FcXHUwNDRhXFx1MDQ0MVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0NDFcXHUwNDM1XFx1MDQ0ZlxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQyMlxcdTA0NGFcXHUwNDNjXFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDIyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXFwvXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDIyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQyMVxcdTA0NDJcXHUwNDQzXFx1MDQzNFxcdTA0MzVcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQxM1xcdTA0M2VcXHUwNDQwXFx1MDQzNVxcdTA0NDlcXHUwNDNlIFxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0MlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwic2VcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJTd2VkaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImZ1bGx0IFxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDBlNXNrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwMGU1c2thXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvalxcdTAwZTRtbnQgb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJtanVrdCBkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImhcXHUwMGU1cnQgZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIm1qdWt0IHJlZ25cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInJlZ25cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImhcXHUwMGU1cnQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIm1qdWt0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIk1cXHUwMGU1dHRsaWcgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaFxcdTAwZTVydCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJteWNrZXQga3JhZnRpZ3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDBmNnNyZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJ1bmRlcmt5bHQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibWp1a3QgXFx1MDBmNnNyZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJkdXNjaC1yZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJyZWduYXIgc21cXHUwMGU1c3Bpa1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibWp1ayBzblxcdTAwZjZcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuXFx1MDBmNlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwia3JhZnRpZ3Qgc25cXHUwMGY2ZmFsbFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic25cXHUwMGY2YmxhbmRhdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAwZjZvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImRpbW1hXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9nZ1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiZGlzXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJzYW5kc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImRpbW1pZ3RcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImtsYXIgaGltbWVsXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJuXFx1MDBlNWdyYSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzcHJpZGRhIG1vbG5cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm1vbG5pZ3RcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTAwZjZ2ZXJza3VnZ2FuZGUgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwic3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bpc2sgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrYWxsdFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwidmFybXRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImJsXFx1MDBlNXNpZ3RcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInpoX3R3XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2hpbmVzZSBUcmFkaXRpb25hbFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHU0ZTJkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHU2NmI0XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1NTFjZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTVjMGZcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHU1OTI3XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1OTZlOFxcdTU5M2VcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHU5NjYzXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1ODU4NFxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTcxNTlcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHU4NTg0XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1NmM5OVxcdTY1Y2JcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHU1OTI3XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1NjY3NFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1NjY3NFxcdWZmMGNcXHU1YzExXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTU5MWFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHU5NjcwXFx1ZmYwY1xcdTU5MWFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHU5ZjhkXFx1NjM3MlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTcxYjFcXHU1ZTM2XFx1OThhOFxcdTY2YjRcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTk4YjZcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHU1MWI3XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHU3MWIxXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHU1OTI3XFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1NTFiMFxcdTk2ZjlcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidHJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJUdXJraXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBoYWZpZiB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBzYVxcdTAxMWZhbmFrIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkhhZmlmIHNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTAxNWVpZGRldGxpIHNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkFyYWxcXHUwMTMxa2xcXHUwMTMxIHNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgaGFmaWYgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlllciB5ZXIgaGFmaWYgeW9cXHUwMTFmdW5sdWtsdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiWWVyIHllciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJZZXIgeWVyIHlvXFx1MDExZnVuIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlllciB5ZXIgaGFmaWYgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiWWVyIHllciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJZZXIgeWVyIHlvXFx1MDExZnVuIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlllciB5ZXIgc2FcXHUwMTFmYW5hayB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJIYWZpZiB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIk9ydGEgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwMTVlaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTAwYzdvayBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIkFcXHUwMTVmXFx1MDEzMXJcXHUwMTMxIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiWWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMSB2ZSBzb1xcdTAxMWZ1ayBoYXZhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSBoYWZpZiB5b1xcdTAxMWZ1bmx1a2x1IHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIkhhZmlmIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJLYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiWW9cXHUwMTFmdW4ga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkthcmxhIGthclxcdTAxMzFcXHUwMTVmXFx1MDEzMWsgeWFcXHUwMTFmbXVybHVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxcXHUwMGZjIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJTaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiSGFmaWYgc2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIkt1bVxcL1RveiBmXFx1MDEzMXJ0XFx1MDEzMW5hc1xcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJBXFx1MDBlN1xcdTAxMzFrXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJBeiBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJQYXJcXHUwMGU3YWxcXHUwMTMxIGF6IGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiS2FwYWxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9waWsgZlxcdTAxMzFydFxcdTAxMzFuYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSG9ydHVtXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwMGM3b2sgU29cXHUwMTFmdWtcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTAwYzdvayBTXFx1MDEzMWNha1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIkRvbHUgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJEdXJndW5cIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlNha2luXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJIYWZpZiBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQXogUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk9ydGEgU2V2aXllIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiS3V2dmV0bGkgUlxcdTAwZmN6Z2FyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJTZXJ0IFJcXHUwMGZjemdhclwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiRlxcdTAxMzFydFxcdTAxMzFuYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDE1ZWlkZGV0bGkgRlxcdTAxMzFydFxcdTAxMzFuYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiS2FzXFx1MDEzMXJnYVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDE1ZWlkZGV0bGkgS2FzXFx1MDEzMXJnYVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDBjN29rIFxcdTAxNWVpZGRldGxpIEthc1xcdTAxMzFyZ2FcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInpoX2NuXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2hpbmVzZSBTaW1wbGlmaWVkXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHU1MWJiXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1NWMwZlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTU5MjdcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHU5NmU4XFx1NTkzOVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2MzVcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHU4NTg0XFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1NzBkZlxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHU2Yzk5XFx1NjVjYlxcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTU5MjdcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHU2Njc0XFx1ZmYwY1xcdTVjMTFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTk2MzRcXHVmZjBjXFx1NTkxYVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTlmOTlcXHU1Mzc3XFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzBlZFxcdTVlMjZcXHU5OGNlXFx1NjZiNFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1OThkM1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTUxYjdcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcwZWRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTU5MjdcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHU1MWIwXFx1OTZmOVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJjelwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkN6ZWNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiYm91XFx1MDE1OWthIHNlIHNsYWJcXHUwMGZkbSBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImJvdVxcdTAxNTlrYSBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImJvdVxcdTAxNTlrYSBzZSBzaWxuXFx1MDBmZG0gZGVcXHUwMTYxdFxcdTAxMWJtXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJzbGFiXFx1MDE2MVxcdTAwZWQgYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNpbG5cXHUwMGUxIGJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiYm91XFx1MDE1OWtvdlxcdTAwZTEgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a2FcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImJvdVxcdTAxNTlrYSBzZSBzbGFiXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJib3VcXHUwMTU5a2EgcyBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImJvdVxcdTAxNTlrYSBzZSBzaWxuXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuXFx1MDBlZCBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIm1yaG9sZW5cXHUwMGVkIHMgZGVcXHUwMTYxdFxcdTAxMWJtXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZCBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIm1yaG9sZW5cXHUwMGVkIGEgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIm1yaG9sZW5cXHUwMGVkIGEgc2lsblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIm9iXFx1MDEwZGFzblxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInBydWRrXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwXFx1MDE1OVxcdTAwZWR2YWxvdlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicHJcXHUwMTZmdHJcXHUwMTdlIG1yYVxcdTAxMGRlblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibXJ6bm91Y1xcdTAwZWQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwic2xhYlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJzaWxuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibVxcdTAwZWRyblxcdTAwZTkgc25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaHVzdFxcdTAwZTkgc25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiem1yemxcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInNtXFx1MDBlZFxcdTAxNjFlblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjUgc2Ugc25cXHUwMTFiaGVtXCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJkXFx1MDBlOVxcdTAxNjFcXHUwMTY1IHNlIHNuXFx1MDExYmhlbVwiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwic2xhYlxcdTAwZTkgc25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwic2lsblxcdTAwZTkgc25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWxoYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia291XFx1MDE1OVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwib3BhclwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwicFxcdTAwZWRzZVxcdTAxMGRuXFx1MDBlOSBcXHUwMTBkaSBwcmFjaG92XFx1MDBlOSB2XFx1MDBlZHJ5XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJodXN0XFx1MDBlMSBtbGhhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwXFx1MDBlZHNla1wiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwicHJhXFx1MDE2MW5vXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJzb3BlXFx1MDEwZG5cXHUwMGZkIHBvcGVsXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJwcnVka1xcdTAwZTkgYm91XFx1MDE1OWVcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5cXHUwMGUxZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJza29ybyBqYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicG9sb2phc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJvYmxhXFx1MDEwZG5vXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ6YXRhXFx1MDE3ZWVub1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYm91XFx1MDE1OWVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInppbWFcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvcmtvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2XFx1MDExYnRybm9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImtydXBvYml0XFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiYmV6dlxcdTAxMWJ0XFx1MDE1OVxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcInZcXHUwMGUxbmVrXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJ2XFx1MDExYnRcXHUwMTU5XFx1MDBlZGtcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcInNsYWJcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIm1cXHUwMGVkcm5cXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxMGRlcnN0dlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwic2lsblxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwicHJ1ZGtcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcImJvdVxcdTAxNTlsaXZcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcInZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJzaWxuXFx1MDBlMSB2aWNoXFx1MDE1OWljZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwibW9odXRuXFx1MDBlMSB2aWNoXFx1MDE1OWljZVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwib3JrXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImtyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiS29yZWFcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGVhdnkgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwic2hvd2VyIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1vZGVyYXRlIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhlYXZ5IGludGVuc2l0eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZXJ5IGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiZnJlZXppbmcgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlnaHQgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWdodCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZWF2eSBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2tlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJoYXplXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJzYW5kXFwvZHVzdCB3aGlybHNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwic2t5IGlzIGNsZWFyXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJmZXcgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzY2F0dGVyZWQgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJicm9rZW4gY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJvdmVyY2FzdCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2FsIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWNhbmVcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImNvbGRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZHlcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhaWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZ2xcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJHYWxpY2lhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsbyBsaXhlaXJvXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsbyBpbnRlbnNvXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIm9yYmFsbG8gZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiY2hvaXZhIGUgb3JiYWxsbyBsaXhlaXJvXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJjaG9pdmEgZSBvcmJhbGxvXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJjaG9pdmEgZSBvcmJhbGxvIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIm9yYmFsbG8gZGUgZHVjaGFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImNob2l2YSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJjaG9pdmEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImNob2l2YSBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaG9pdmEgbW9pIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJjaG9pdmEgZXh0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiY2hvaXZhIHhlYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgYmFpeGEgaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNob2l2YSBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2hvaXZhIGRlIGR1Y2hhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiYXVnYW5ldmVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5ldmUgZGUgZHVjaGFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm5cXHUwMGU5Ym9hXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuXFx1MDBlOWJvYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJyZW11aVxcdTAwZjFvcyBkZSBhcmVhIGUgcG9sdm9cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjZW8gY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImFsZ28gZGUgbnViZXNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51YmVzIGRpc3BlcnNhc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViZXMgcm90YXNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0b3JtZW50YSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiZnVyYWNcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJcXHUwMGVkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcInNhcmFiaWFcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1hXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJWZW50byBmcm91eG9cIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlZlbnRvIHN1YXZlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJWZW50byBtb2RlcmFkb1wiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2FcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlZlbnRvIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50byBmb3J0ZSwgcHJcXHUwMGYzeGltbyBhIHZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhZGVcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhZGUgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkZ1cmFjXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInZpXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwidmlldG5hbWVzZVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGEgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gTVxcdTAxYjBhIGxcXHUxZWRiblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIGNcXHUwMGYzIGNoXFx1MWVkYnAgZ2lcXHUxZWFkdFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiQlxcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJCXFx1MDBlM28gdlxcdTAwZTBpIG5cXHUwMWExaVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBwaFxcdTAwZjluIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUxZWRiaSBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUxZWRiaSBtXFx1MDFiMGEgcGhcXHUwMGY5biBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwMGUxbmggc1xcdTAwZTFuZyBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibVxcdTAxYjBhIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJtXFx1MDFiMGEgdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW4gblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibVxcdTAxYjBhIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibVxcdTAxYjBhIHZcXHUxZWViYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwibVxcdTAxYjBhIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm1cXHUwMWIwYSByXFx1MWVhNXQgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwibVxcdTAxYjBhIGxcXHUxZWQxY1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibVxcdTAxYjBhIGxcXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInR1eVxcdTFlYmZ0IHJcXHUwMWExaSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInR1eVxcdTFlYmZ0XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJ0dXlcXHUxZWJmdCBuXFx1MWViN25nIGhcXHUxZWExdFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibVxcdTAxYjBhIFxcdTAxMTFcXHUwMGUxXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJ0dXlcXHUxZWJmdCBtXFx1MDBmOSB0clxcdTFlZGRpXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzXFx1MDFiMFxcdTAxYTFuZyBtXFx1MWVkZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia2hcXHUwMGYzaSBiXFx1MWVlNWlcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTAxMTFcXHUwMGUxbSBtXFx1MDBlMnlcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImJcXHUwMGUzbyBjXFx1MDBlMXQgdlxcdTAwZTAgbFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUwMGY5XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJiXFx1MWVhN3UgdHJcXHUxZWRkaSBxdWFuZyBcXHUwMTExXFx1MDBlM25nXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJtXFx1MDBlMnkgdGhcXHUwMWIwYVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibVxcdTAwZTJ5IHJcXHUxZWEzaSByXFx1MDBlMWNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm1cXHUwMGUyeSBjXFx1MWVlNW1cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm1cXHUwMGUyeSBcXHUwMTExZW4gdSBcXHUwMGUxbVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwibFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImNcXHUwMWExbiBiXFx1MDBlM28gbmhpXFx1MWVjN3QgXFx1MDExMVxcdTFlZGJpXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJiXFx1MDBlM28gbFxcdTFlZDFjXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJsXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJuXFx1MDBmM25nXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJnaVxcdTAwZjNcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIm1cXHUwMWIwYSBcXHUwMTExXFx1MDBlMVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiQ2hcXHUxZWJmIFxcdTAxMTFcXHUxZWNkXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJOaFxcdTFlYjkgbmhcXHUwMGUwbmdcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTAwYzFuaCBzXFx1MDBlMW5nIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR1xcdTAwZWRvIHRob1xcdTFlYTNuZ1wiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiR2lcXHUwMGYzIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiR2lcXHUwMGYzIHZcXHUxZWViYSBwaFxcdTFlYTNpXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJHaVxcdTAwZjMgbVxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiR2lcXHUwMGYzIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJMXFx1MWVkMWMgeG9cXHUwMGUxeSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJCXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkJcXHUwMGUzbyBjXFx1MWVhNXAgbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJCXFx1MDBlM28gbFxcdTFlZDFjXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJhclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkFyYWJpY1wiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjNcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNjI3XFx1MDY0NFxcdTA2MzlcXHUwNjQ4XFx1MDYyN1xcdTA2MzVcXHUwNjQxIFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ0XFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjI3XFx1MDY0NVxcdTA2MzdcXHUwNjI3XFx1MDYzMSBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJiXFx1MDY0MlxcdTA2NGFcXHUwNjQ0XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyZVxcdTA2MzRcXHUwNjQ2XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDEgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDEgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2NDVcXHUwNjJhXFx1MDY0OFxcdTA2MzNcXHUwNjM3IFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzOVxcdTA2MjdcXHUwNjQ0XFx1MDY0YSBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyOFxcdTA2MzFcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjQ3XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjIFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA2MzVcXHUwNjQyXFx1MDY0YVxcdTA2MzlcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyY1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDYzNlxcdTA2MjhcXHUwNjI3XFx1MDYyOFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDYyZlxcdTA2MmVcXHUwNjI3XFx1MDY0NlwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDYzYVxcdTA2MjhcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ1XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNjMzXFx1MDY0NVxcdTA2MjdcXHUwNjIxIFxcdTA2MzVcXHUwNjI3XFx1MDY0MVxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNjNhXFx1MDYyN1xcdTA2MjZcXHUwNjQ1IFxcdTA2MmNcXHUwNjMyXFx1MDYyNlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDFcXHUwNjMxXFx1MDY0MlxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0NVxcdTA2MmFcXHUwNjQ2XFx1MDYyN1xcdTA2MmJcXHUwNjMxXFx1MDY0N1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQyXFx1MDYyN1xcdTA2MmFcXHUwNjQ1XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjM1XFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MjdcXHUwNjMzXFx1MDYyYVxcdTA2NDhcXHUwNjI3XFx1MDYyNlxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNjMyXFx1MDY0OFxcdTA2NGFcXHUwNjM5XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDYyOFxcdTA2MjdcXHUwNjMxXFx1MDYyZlwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDYyZFxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNjMxXFx1MDY0YVxcdTA2MjdcXHUwNjJkXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MmZcXHUwNjI3XFx1MDYyZlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXFx1MDY0N1xcdTA2MjdcXHUwNjJmXFx1MDYyNlwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDRcXHUwNjM3XFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NVxcdTA2MzlcXHUwNjJhXFx1MDYyZlxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDYzOVxcdTA2NDRcXHUwNjRhXFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA2MzFcXHUwNjRhXFx1MDYyN1xcdTA2MmQgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZlxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjM5XFx1MDY0NlxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjM1XFx1MDYyN1xcdTA2MzFcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIm1rXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiTWFjZWRvbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQzY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzZlxcdTA0MzBcXHUwNDMyXFx1MDQzOFxcdTA0NDZcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0M2ZcXHUwNDMwXFx1MDQzMlxcdTA0MzhcXHUwNDQ2XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDFcXHUwNDNjXFx1MDQzZVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MzdcXHUwNDMwXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzVcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQzNVxcdTA0NDFcXHUwNDNlXFx1MDQ0N1xcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDQwXFx1MDQ0MlxcdTA0M2JcXHUwNDNlXFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NDdcXHUwNDM4XFx1MDQ0MVxcdTA0NDJcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0M2RcXHUwNDM1XFx1MDQzYVxcdTA0M2VcXHUwNDNiXFx1MDQzYVxcdTA0NDMgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDNlXFx1MDQzNFxcdTA0MzJcXHUwNDNlXFx1MDQzNVxcdTA0M2RcXHUwNDM4IFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0NDNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQzZlxcdTA0M2JcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0MlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA0MTdcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM3XCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcXHUwNDFjXFx1MDQzOFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXFx1MDQxMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTA0MjFcXHUwNDMyXFx1MDQzNVxcdTA0MzYgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwNDFjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiXFx1MDQxZFxcdTA0MzVcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXFx1MDQxMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJza1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlNsb3Zha1wiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImJcXHUwMGZhcmthIHNvIHNsYWJcXHUwMGZkbSBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImJcXHUwMGZhcmthIHMgZGFcXHUwMTdlXFx1MDEwZm9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gZGFcXHUwMTdlXFx1MDEwZm9tXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJtaWVybmEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzaWxuXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwicHJ1ZGtcXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJiXFx1MDBmYXJrYSBzbyBzbGFiXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJiXFx1MDBmYXJrYSBzIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiYlxcdTAwZmFya2Egc28gc2lsblxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwic2xhYlxcdTAwZTkgcG9wXFx1MDE1NWNoYW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicG9wXFx1MDE1NWNoYW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwic2lsblxcdTAwZTkgcG9wXFx1MDE1NWNoYW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiamVtblxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtaWVybnkgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwic2lsblxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVcXHUwMTNlbWkgc2lsblxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0clxcdTAwZTltbnkgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibXJ6blxcdTAwZmFjaSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiXFx1MDBlOSBzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInNpbG5cXHUwMGU5IHNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJkXFx1MDBlMVxcdTAxN2VcXHUwMTBmIHNvIHNuZWhvbVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25laG92XFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiaG1sYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZHltXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJvcGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwaWVza292XFx1MDBlOVxcL3ByYVxcdTAxNjFuXFx1MDBlOSB2XFx1MDBlZHJ5XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJobWxhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJqYXNuXFx1MDBlMSBvYmxvaGFcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInRha21lciBqYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicG9sb2phc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJvYmxhXFx1MDEwZG5vXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ6YW1yYVxcdTAxMGRlblxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2tcXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJpa1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJ6aW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3JcXHUwMGZhY29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZldGVybm9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImtydXBvYml0aWVcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIk5hc3RhdmVuaWVcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkJlenZldHJpZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiU2xhYlxcdTAwZmQgdlxcdTAwZTFub2tcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkplbW5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiU3RyZWRuXFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxMGNlcnN0dlxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTaWxuXFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlNpbG5cXHUwMGZkIHZpZXRvciwgdGFrbWVyIHZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWXFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2lsblxcdTAwZTEgdlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJOaVxcdTAxMGRpdlxcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmlrXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImh1XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiSHVuZ2FyaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidmloYXIgZW55aGUgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ2aWhhciBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInZpaGFyIGhldmVzIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiZW55aGUgeml2YXRhclwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidmloYXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImhldmVzIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJkdXJ2YSB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidmloYXIgZW55aGUgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInZpaGFyIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ2aWhhciBlclxcdTAxNTFzIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwic3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwielxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImVueWhlIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwia1xcdTAwZjZ6ZXBlcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhldmVzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibmFneW9uIGhldmVzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0clxcdTAwZTltIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDBmM25vcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSB6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiZW55aGUgaGF2YXpcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiaGF2YXpcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZXJcXHUwMTUxcyBoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJoYXZhcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImhcXHUwMGYzelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImd5ZW5nZSBrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJob21va3ZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInRpc3p0YSBcXHUwMGU5Z2JvbHRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImtldlxcdTAwZTlzIGZlbGhcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzelxcdTAwZjNydlxcdTAwZTFueW9zIGZlbGhcXHUwMTUxemV0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJlclxcdTAxNTFzIGZlbGhcXHUwMTUxemV0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJib3JcXHUwMGZhcyBcXHUwMGU5Z2JvbHRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZFxcdTAwZjNcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyXFx1MDBmM3B1c2kgdmloYXJcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpa1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJoXFx1MDE3MXZcXHUwMGY2c1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiZm9yclxcdTAwZjNcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInN6ZWxlc1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwialxcdTAwZTlnZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJOeXVnb2R0XCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDc2VuZGVzXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJFbnloZSBzemVsbFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkZpbm9tIHN6ZWxsXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiS1xcdTAwZjZ6ZXBlcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMGM5bFxcdTAwZTluayBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJFclxcdTAxNTFzIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkVyXFx1MDE1MXMsIG1cXHUwMGUxciB2aWhhcm9zIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiRXJcXHUwMTUxc2VuIHZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3pcXHUwMGU5bHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUb21ib2xcXHUwMGYzIHN6XFx1MDBlOWx2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmlrXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImNhXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2F0YWxhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJUZW1wZXN0YSBhbWIgcGx1amFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJUZW1wZXN0YSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJUZW1wZXN0YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiVGVtcGVzdGEgZm9ydGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlRlbXBlc3RhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiVGVtcGVzdGEgYW1iIHBsdWdpbSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2luXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJUZW1wZXN0YSBhbWIgbW9sdCBwbHVnaW1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlBsdWdpbSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJQbHVnaW1cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlBsdWdpbSBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlBsdWdpbSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJQbHVnaW1cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlBsdWdpbSBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIlBsdWphXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJQbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJQbHVnaW1cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlBsdWphXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJQbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJQbHVqYSBtb2x0IGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlBsdWphIGV4dHJlbWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlBsdWphIGdsYVxcdTAwZTdhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIlBsdWphIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTmV2YWRhIHN1YXVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIk5ldmFkYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkFpZ3VhbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJQbHVqYSBkJ2FpZ3VhbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJQbHVnaW0gaSBuZXVcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcIlBsdWphIGkgbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJOZXZhZGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiTmV2YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiQm9pcmFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIkZ1bVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiQm9pcmluYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiU29ycmFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIkJvaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJTb3JyYVwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiUG9sc1wiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwiQ2VuZHJhIHZvbGNcXHUwMGUwbmljYVwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiWFxcdTAwZTBmZWNcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcIlRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkNlbCBuZXRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkxsZXVnZXJhbWVudCBlbm51dm9sYXRcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIk5cXHUwMGZhdm9scyBkaXNwZXJzb3NcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIk51dm9sb3NpdGF0IHZhcmlhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJFbm51dm9sYXRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRlbXBlc3RhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJhY1xcdTAwZTBcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIkZyZWRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIkNhbG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJWZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJQZWRyYVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtYXRcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkJyaXNhIHN1YXVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyaXNhIGFncmFkYWJsZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2EgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhIGZyZXNjYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiQnJpc2NhIGZvcmFcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgaW50ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgc2V2ZXJcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWNcXHUwMGUwXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJoclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNyb2F0aWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgc2xhYm9tIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgamFrb20ga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJhIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJqYWthIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib3JrYW5za2EgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJncm1samF2aW5za2Egb2x1amEgc2Egc2xhYm9tIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJncm1samF2aW5za2Egb2x1amEgcyByb3N1bGpvbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JtbGphdmluc2thIG9sdWphIHNhIGpha29tIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJyb3N1bGphIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwicm9zdWxqYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwicm9zdWxqYSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb20gamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcInBsanVza292aSBpIHJvc3VsamFcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcInJvc3VsamEgcyBqYWtpbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwicm9zdWxqYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJ1bWplcmVuYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJraVxcdTAxNjFhIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2cmxvIGpha2Ega2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZWtzdHJlbW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImxlZGVuYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwbGp1c2FrIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicGxqdXNha1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxqdXNhayBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwib2x1am5hIGtpXFx1MDE2MWEgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwic2xhYmkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImd1c3RpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic3VzbmplXFx1MDE3ZWljYVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic3VzbmplXFx1MDE3ZWljYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJzbGFiYSBraVxcdTAxNjFhIGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJraVxcdTAxNjFhIGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbmlqZWcgcyBwb3ZyZW1lbmltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmlqZWcgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwic25pamVnIHMgamFraW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInN1bWFnbGljYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZGltXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJpem1hZ2xpY2FcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImtvdml0bGFjaSBwaWplc2thIGlsaSBwcmFcXHUwMTYxaW5lXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtYWdsYVwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwicGlqZXNha1wiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwicHJhXFx1MDE2MWluYVwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwidnVsa2Fuc2tpIHBlcGVvXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJ6YXB1c2kgdmpldHJhIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInZlZHJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJibGFnYSBuYW9ibGFrYVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicmFcXHUwMTYxdHJrYW5pIG9ibGFjaVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiaXNwcmVraWRhbmkgb2JsYWNpXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJvYmxhXFx1MDEwZG5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9wc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiaGxhZG5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJ2cnVcXHUwMTA3ZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmpldHJvdml0b1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwidHVcXHUwMTBkYVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJsYWhvclwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwicG92amV0YXJhY1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYiB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcInVtamVyZW4gdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJ1bWplcmVubyBqYWsgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJqYWsgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwMTdlZXN0b2sgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJvbHVqbmkgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJqYWsgb2x1am5pIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwib3JrYW5za2kgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJqYWsgb3JrYW5za2kgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmthblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiYmxhbmtcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDYXRhbGFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMC4xMC4yMDE2LlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHdpbmRTcGVlZCA9IHtcclxuICAgIFwiZW5cIjp7XHJcbiAgICAgICAgXCJTZXR0aW5nc1wiOiB7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzAuMCwgMC4zXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMC0xICAgU21va2UgcmlzZXMgc3RyYWlnaHQgdXBcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJDYWxtXCI6IHtcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4zLCAxLjZdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxLTMgT25lIGNhbiBzZWUgZG93bndpbmQgb2YgdGhlIHNtb2tlIGRyaWZ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiTGlnaHQgYnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxLjYsIDMuM10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQtNiBPbmUgY2FuIGZlZWwgdGhlIHdpbmQuIFRoZSBsZWF2ZXMgb24gdGhlIHRyZWVzIG1vdmUsIHRoZSB3aW5kIGNhbiBsaWZ0IHNtYWxsIHN0cmVhbWVycy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJHZW50bGUgQnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFszLjQsIDUuNV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjctMTAgTGVhdmVzIGFuZCB0d2lncyBtb3ZlLiBXaW5kIGV4dGVuZHMgbGlnaHQgZmxhZyBhbmQgcGVubmFudHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJNb2RlcmF0ZSBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzUuNSwgOC4wXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMTEtMTYgICBUaGUgd2luZCByYWlzZXMgZHVzdCBhbmQgbG9vc2UgcGFwZXJzLCB0b3VjaGVzIG9uIHRoZSB0d2lncyBhbmQgc21hbGwgYnJhbmNoZXMsIHN0cmV0Y2hlcyBsYXJnZXIgZmxhZ3MgYW5kIHBlbm5hbnRzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiRnJlc2ggQnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFs4LjAsIDEwLjhdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxNy0yMSAgIFNtYWxsIHRyZWVzIGluIGxlYWYgYmVnaW4gdG8gc3dheS4gVGhlIHdhdGVyIGJlZ2lucyBsaXR0bGUgd2F2ZXMgdG8gcGVha1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlN0cm9uZyBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEwLjgsIDEzLjldLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIyMi0yNyAgIExhcmdlIGJyYW5jaGVzIGFuZCBzbWFsbGVyIHRyaWJlcyBtb3Zlcy4gVGhlIHdoaXogb2YgdGVsZXBob25lIGxpbmVzLiBJdCBpcyBkaWZmaWN1bHQgdG8gdXNlIHRoZSB1bWJyZWxsYS4gQSByZXNpc3RhbmNlIHdoZW4gcnVubmluZy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTMuOSwgMTcuMl0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjI4LTMzICAgV2hvbGUgdHJlZXMgaW4gbW90aW9uLiBJdCBpcyBoYXJkIHRvIGdvIGFnYWluc3QgdGhlIHdpbmQuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiR2FsZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTcuMiwgMjAuN10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjM0LTQwICAgVGhlIHdpbmQgYnJlYWsgdHdpZ3Mgb2YgdHJlZXMuIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJTZXZlcmUgR2FsZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjAuOCwgMjQuNV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQxLTQ3ICAgQWxsIGxhcmdlIHRyZWVzIHN3YXlpbmcgYW5kIHRocm93cy4gVGlsZXMgY2FuIGJsb3cgZG93bi5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJTdG9ybVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjQuNSwgMjguNV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQ4LTU1ICAgUmFyZSBpbmxhbmQuIFRyZWVzIHVwcm9vdGVkLiBTZXJpb3VzIGRhbWFnZSB0byBob3VzZXMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiVmlvbGVudCBTdG9ybVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjguNSwgMzIuN10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjU2LTYzICAgT2NjdXJzIHJhcmVseSBhbmQgaXMgZm9sbG93ZWQgYnkgZGVzdHJ1Y3Rpb24uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiSHVycmljYW5lXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFszMi43LCA2NF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIk9jY3VycyB2ZXJ5IHJhcmVseS4gVW51c3VhbGx5IHNldmVyZSBkYW1hZ2UuXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07LyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cclxuICovXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDEzLjEwLjIwMTYuXHJcbiAqL1xyXG5pbXBvcnQgQ29va2llcyBmcm9tICcuL0Nvb2tpZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdG9yV2lkZ2V0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSBgJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd21gO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0RDNTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL2xpYnMvZDMubWluLmpzYDtcclxuICAgICAgICB0aGlzLnNjcmlwdFNSQyA9IGAke3RoaXMuYmFzZVVSTH0vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzYDtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldCA9IHtcclxuICAgICAgICAgICAgLy8g0J/QtdGA0LLQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICAgICAgICBjaXR5TmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1sZWZ0LW1lbnVfX2hlYWRlcicpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19udW1iZXInKSxcclxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbWVhbnMnKSxcclxuICAgICAgICAgICAgd2luZFNwZWVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX3dpbmQnKSxcclxuICAgICAgICAgICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX2ltZycpLFxyXG4gICAgICAgICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYWxlbmRhcl9faXRlbScpLFxyXG4gICAgICAgICAgICBncmFwaGljOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpLFxyXG4gICAgICAgICAgICAvLyDQktGC0L7RgNCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXHJcbiAgICAgICAgICAgIGNpdHlOYW1lMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fdGl0bGUnKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmUyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fdGVtcGVyYXR1cmUnKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmVGZWVsczogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2ZlZWxzJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWluOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1taW4nKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmVNYXg6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0LWNhcmRfX3RlbXBlcmF0dXJlLW1heCcpLFxyXG4gICAgICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX2Rlc2NyaXB0aW9uJyksXHJcbiAgICAgICAgICAgIHdpbmRTcGVlZDI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X193aW5kLXNwZWVkJyksXHJcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19pY29uJyksXHJcbiAgICAgICAgICAgIGh1bWlkaXR5OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faHVtaWRpdHknKSxcclxuICAgICAgICAgICAgcHJlc3N1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19wcmVzc3VyZScpLFxyXG4gICAgICAgICAgICBkYXRlUmVwb3J0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0X19kYXRlJyksXHJcbiAgICAgICAgICAgIGFwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKSxcclxuICAgICAgICAgICAgZXJyb3JLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1rZXknKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRpYWxNZXRyaWNUZW1wZXJhdHVyZSgpO1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvbkFQSWtleSgpO1xyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xyXG5cclxuICAgICAgICAvLyDQvtCx0YrQtdC60YIt0LrQsNGA0YLQsCDQtNC70Y8g0YHQvtC/0L7RgdGC0LDQstC70LXQvdC40Y8g0LLRgdC10YUg0LLQuNC00LbQtdGC0L7QsiDRgSDQutC90L7Qv9C60L7QuS3QuNC90LjRhtC40LDRgtC+0YDQvtC8INC40YUg0LLRi9C30L7QstCwINC00LvRjyDQs9C10L3QtdGA0LDRhtC40Lgg0LrQvtC00LBcclxuICAgICAgICB0aGlzLm1hcFdpZGdldHMgPSB7XHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTUtcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDUpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA2LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC03LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg3KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTgtcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogOCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDgpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA5LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDExLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMy1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEzKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDE0LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTUtcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDE1LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTUpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTYtcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDE2LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTYpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDE3LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTcpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTgtcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDE4LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTgpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTktcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDE5LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIyLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjIpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMy1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIzKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zMS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMzEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgzMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQtdC00LjQvdC40YYg0LjQt9C80LXRgNC10L3QuNGPINCyINCy0LjQtNC20LXRgtCw0YVcclxuICAgICAqICovXHJcbiAgICBpbml0aWFsTWV0cmljVGVtcGVyYXR1cmUoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNldFVuaXRzID0gZnVuY3Rpb24oY2hlY2tib3gsIGNvb2tpZSl7XHJcbiAgICAgICAgICAgIHZhciB1bml0cyA9ICdtZXRyaWMnO1xyXG4gICAgICAgICAgICBpZihjaGVja2JveC5jaGVja2VkID09IGZhbHNlKXtcclxuICAgICAgICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHVuaXRzID0gJ2ltcGVyaWFsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb29raWUuc2V0Q29va2llKCd1bml0cycsIHVuaXRzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBnZXRVbml0cyA9IGZ1bmN0aW9uKHVuaXRzKXtcclxuICAgICAgICAgICAgc3dpdGNoKHVuaXRzKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ21ldHJpYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt1bml0cywgJ8KwQyddO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnaW1wZXJpYWwnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbdW5pdHMsICfCsEYnXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gWydtZXRyaWMnLCAnwrBDJ107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGNvb2tpZSA9IG5ldyBDb29raWVzKCk7XHJcbiAgICAgICAgLy/QntC/0YDQtdC00LXQu9C10L3QuNC1INC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y9cclxuICAgICAgICB2YXIgdW5pdHNDaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5pdHNfY2hlY2tcIik7XHJcblxyXG4gICAgICAgIHVuaXRzQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgIHNldFVuaXRzKHVuaXRzQ2hlY2ssIGNvb2tpZSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIHVuaXRzID0gXCJtZXRyaWNcIjtcclxuICAgICAgICB2YXIgdGV4dF91bml0X3RlbXAgPSBudWxsO1xyXG4gICAgICAgIGlmKGNvb2tpZS5nZXRDb29raWUoJ3VuaXRzJykpe1xyXG4gICAgICAgICAgICB0aGlzLnVuaXRzVGVtcCA9IGdldFVuaXRzKGNvb2tpZS5nZXRDb29raWUoJ3VuaXRzJykpIHx8IFsnbWV0cmljJywgJ8KwQyddO1xyXG4gICAgICAgICAgICBbdW5pdHMsIHRleHRfdW5pdF90ZW1wXSA9IHRoaXMudW5pdHNUZW1wO1xyXG4gICAgICAgICAgICBpZih1bml0cyA9PSBcIm1ldHJpY1wiKVxyXG4gICAgICAgICAgICAgICAgdW5pdHNDaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdW5pdHNDaGVjay5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHVuaXRzQ2hlY2suY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNldFVuaXRzKHVuaXRzQ2hlY2ssIGNvb2tpZSk7XHJcbiAgICAgICAgICAgIHRoaXMudW5pdHNUZW1wID0gZ2V0VW5pdHModW5pdHMpO1xyXG4gICAgICAgICAgICBbdW5pdHMsIHRleHRfdW5pdF90ZW1wXSA9IHRoaXMudW5pdHNUZW1wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCh0LLQvtC50YHRgtCy0L4g0YPRgdGC0LDQvdC+0LLQutC4INC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y8g0LTQu9GPINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAqIEBwYXJhbSB1bml0c1xyXG4gICAgICovXHJcbiAgICBzZXQgdW5pdHNUZW1wKHVuaXRzKSB7XHJcbiAgICAgICAgdGhpcy51bml0cyA9IHVuaXRzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQodCy0L7QudGB0YLQstC+INC/0L7Qu9GD0YfQtdC90LjRjyDQtdC00LjQvdC40YYg0LjQt9C80LXRgNC10L3QuNGPINC00LvRjyDQstC40LTQttC10YLQvtCyXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHVuaXRzVGVtcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51bml0cztcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0aW9uQVBJa2V5KCkge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uQVBJID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseT9pZD01MjQ5MDEmdW5pdHM9JHt0aGlzLnVuaXRzVGVtcFswXX0mY250PTgmYXBwaWQ9JHt0aGlzLmNvbnRyb2xzV2lkZ2V0LmFwaUtleS52YWx1ZX1gO1xyXG4gICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGFjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1nb29kJyk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGVycm9yJztcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGDQntGI0LjQsdC60LAg0LLQsNC70LjQtNCw0YbQuNC4ICR7ZX1gKTtcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gZXJyb3InO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ib3VuZFZhbGlkYXRpb25NZXRob2QgPSB2YWxpZGF0aW9uQVBJLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldC5hcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyx0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XHJcbiAgICAgICAgLy90aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5ib3VuZFZhbGlkYXRpb25NZXRob2QpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvZGVGb3JHZW5lcmF0ZVdpZGdldChpZCkge1xyXG4gICAgICAgIGlmKGlkICYmICh0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWQgfHwgdGhpcy5wYXJhbXNXaWRnZXQuY2l0eU5hbWUpICYmIHRoaXMucGFyYW1zV2lkZ2V0LmFwcGlkKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlID0gJyc7XHJcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGlkKSA9PT0gMSB8fCBwYXJzZUludChpZCkgPT09IDExIHx8IHBhcnNlSW50KGlkKSA9PT0gMjEgfHwgcGFyc2VJbnQoaWQpID09PSAzMSkge1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IGA8c2NyaXB0IHNyYz0nJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvZDMubWluLmpzJz48L3NjcmlwdD5gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtjb2RlfTxkaXYgaWQ9J29wZW53ZWF0aGVybWFwLXdpZGdldCc+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPSd0ZXh0L2phdmFzY3JpcHQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJHtpZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHlpZDogJHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBpZDogJyR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWQucmVwbGFjZShgMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjdgLCcnKX0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0czogJyR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSAnJHtkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbH0vL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBzKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgICA8L3NjcmlwdD5gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5pdGlhbFN0YXRlRm9ybShjaXR5SWQ9MjY0Mzc0MywgY2l0eU5hbWU9J0xvbmRvbicpIHtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXNXaWRnZXQgPSB7XHJcbiAgICAgICAgICAgIGNpdHlJZDogY2l0eUlkLFxyXG4gICAgICAgICAgICBjaXR5TmFtZTogY2l0eU5hbWUsXHJcbiAgICAgICAgICAgIGxhbmc6ICdlbicsXHJcbiAgICAgICAgICAgIGFwcGlkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpLnZhbHVlIHx8ICAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICAgICAgICB1bml0czogdGhpcy51bml0c1RlbXBbMF0sXHJcbiAgICAgICAgICAgIHRleHRVbml0VGVtcDogdGhpcy51bml0c1RlbXBbMV0sICAvLyAyNDhcclxuICAgICAgICAgICAgYmFzZVVSTDogdGhpcy5iYXNlVVJMLFxyXG4gICAgICAgICAgICB1cmxEb21haW46IGAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ2AsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxyXG4gICAgICAgIHRoaXMuY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcblxyXG4gICAgICAgIHRoaXMudXJscyA9IHtcclxuICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXI/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICBwYXJhbXNVcmxGb3JlRGFpbHk6IGAke3RoaXMucGFyYW1zV2lkZ2V0LnVybERvbWFpbn0vZGF0YS8yLjUvZm9yZWNhc3QvZGFpbHk/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IGAke3RoaXMuYmFzZVVSTH0vZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvbmAsXHJcbiAgICAgICAgd2luZERpcmVjdGlvbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbmAsXHJcbiAgICAgICAgY2xvdWRzOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvY2xvdWRzLWRhdGEuanNvbmAsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGAke3RoaXMuYmFzZVVSTH0vZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uYCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcblxyXG4vKipcclxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xyXG4gQGNsYXNzIEdyYXBoaWNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC00LvRjyDRgNCw0YHRh9C10YLQsCDQvtGC0YDQuNGB0L7QstC60Lgg0L7RgdC90L7QstC90L7QuSDQu9C40L3QuNC4INC/0LDRgNCw0LzQtdGC0YDQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAqIFtsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxyXG4gICAgLngoKGQpID0+IHtcclxuICAgICAgcmV0dXJuIGQueDtcclxuICAgIH0pXHJcbiAgICAueSgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC55O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINCyINC80LDRgdGB0LjQsiDQtNC70Y8g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPINCz0YDQsNGE0LjQutCwXHJcbiAgICAgKiBAcGFyYW0gIHtbYm9vbGVhbl19IHRlbXBlcmF0dXJlIFvQv9GA0LjQt9C90LDQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAgICAqL1xyXG4gIHByZXBhcmVEYXRhKCkge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IFtdO1xyXG5cclxuICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICByYXdEYXRhLnB1c2goeyB4OiBpLCBkYXRlOiBpLCBtYXhUOiBlbGVtLm1heCwgbWluVDogZWxlbS5taW4gfSk7XHJcbiAgICAgIGkgKz0gMTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmF3RGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0LXQvCDQuNC30L7QsdGA0LDQttC10L3QuNC1INGBINC60L7QvdGC0LXQutGB0YLQvtC8INC+0LHRitC10LrRgtCwIHN2Z1xyXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX1cclxuICAgICAqL1xyXG4gIG1ha2VTVkcoKSB7XHJcbiAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzJylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5wYXJhbXMud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnBhcmFtcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnI2ZmZmZmZicpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC80LjQvdC40LzQsNC70LvRjNC90L7Qs9C+INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L/QviDQv9Cw0YDQsNC80LXRgtGA0YMg0LTQsNGC0YtcclxuICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICogQHJldHVybiB7W29iamVjdF19IGRhdGEgW9C+0LHRitC10LrRgiDRgSDQvNC40L3QuNC80LDQu9GM0L3Ri9C8INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQvCDQt9C90LDRh9C10L3QuNC10LxdXHJcbiAgKi9cclxuICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpIHtcclxuICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWF4RGF0ZTogMCxcclxuICAgICAgbWluRGF0ZTogMTAwMDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkge1xyXG4gICAgICAgIGRhdGEubWF4RGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW5EYXRlID49IGVsZW0uZGF0ZSkge1xyXG4gICAgICAgIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG5cclxuICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKSB7XHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtaW46IDEwMCxcclxuICAgICAgbWF4OiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ubWluVCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1heCA8PSBlbGVtLm1heFQpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMCxcclxuICAgICAgbWF4OiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0uaHVtaWRpdHkpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LTQu9C40L3RgyDQvtGB0LXQuSBYLFlcclxuICAqIFttYWtlQXhlc1hZIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0JzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHJldHVybiB7W2Z1bmN0aW9uXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcykge1xyXG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWD0g0YjQuNGA0LjQvdCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdC70LXQstCwINC4INGB0L/RgNCw0LLQsFxyXG4gICAgY29uc3QgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAoMiAqIHBhcmFtcy5tYXJnaW4pO1xyXG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcclxuICAgIGNvbnN0IHlBeGlzTGVuZ3RoID0gcGFyYW1zLmhlaWdodCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXHJcbiAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgKi9cclxuICBzY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG1heERhdGUsIG1pbkRhdGUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgICogW3NjYWxlVGltZSBkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAqIFtzY2FsZUxpbmVhciBkZXNjcmlwdGlvbl1cclxuICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAqL1xyXG4gICAgY29uc3Qgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxyXG4gICAgLmRvbWFpbihbbWF4ICsgNSwgbWluIC0gNV0pXHJcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IFtdO1xyXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgbWF4VDogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtaW5UOiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICBzY2FsZUF4ZXNYWVdlYXRoZXIocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBtYXJnaW4pIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXgsIG1pbl0pXHJcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcblxyXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgbWFyZ2luLFxyXG4gICAgICAgIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sXHJcbiAgICAgICAgcmFpbmZhbGxBbW91bnQ6IHNjYWxlWShlbGVtLnJhaW5mYWxsQW1vdW50KSArIG1hcmdpbixcclxuICAgICAgICBjb2xvcjogZWxlbS5jb2xvcixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4geyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9O1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxyXG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBtYWtlUG9seWxpbmUoZGF0YSwgcGFyYW1zLCBzY2FsZVgsIHNjYWxlWSkge1xyXG4gICAgY29uc3QgYXJyUG9seWxpbmUgPSBbXTtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIHk6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFkgfSxcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgZGF0YS5yZXZlcnNlKCkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIHk6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFksXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgeDogc2NhbGVYKGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLm1heFQpICsgcGFyYW1zLm9mZnNldFksXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gYXJyUG9seWxpbmU7XHJcbiAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L/QvtC70LjQu9C40L3QuNC5INGBINC30LDQu9C40LLQutC+0Lkg0L7RgdC90L7QstC90L7QuSDQuCDQuNC80LjRgtCw0YbQuNGPINC10LUg0YLQtdC90LhcclxuICAgICAqIFtkcmF3UG9sdWxpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBkcmF3UG9seWxpbmUoc3ZnLCBkYXRhKSB7XHJcbiAgICAgICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC4INGA0LjRgdGD0LXQvCDQu9C40L3QuNC4XHJcblxyXG4gICAgc3ZnLmFwcGVuZCgnZycpLmFwcGVuZCgncGF0aCcpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5wYXJhbXMuc3Ryb2tlV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LTQv9C40YHQtdC5INGBINC/0L7QutCw0LfQsNGC0LXQu9GP0LzQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC90LAg0L7RgdGP0YVcclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICovXHJcbiAgZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgcGFyYW1zKSB7XHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpID0+IHtcclxuICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINGC0LXQutGB0YLQsFxyXG4gICAgICBzdmcuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgLmF0dHIoJ3gnLCBlbGVtLngpXHJcbiAgICAgIC5hdHRyKCd5JywgKGVsZW0ubWF4VCAtIDIpIC0gKHBhcmFtcy5vZmZzZXRYIC8gMikpXHJcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxyXG4gICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgLnN0eWxlKCdzdHJva2UnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAudGV4dChgJHtwYXJhbXMuZGF0YVtpdGVtXS5tYXh9wrBgKTtcclxuXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5taW5UICsgNykgKyAocGFyYW1zLm9mZnNldFkgLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1pbn3CsGApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQtNC40YHQv9C10YLRh9C10YAg0L/RgNC+0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YHQviDQstGB0LXQvNC4INGN0LvQtdC80LXQvdGC0LDQvNC4XHJcbiAgICAgKiBbcmVuZGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBzdmcgPSB0aGlzLm1ha2VTVkcoKTtcclxuICAgIGNvbnN0IHJhd0RhdGEgPSB0aGlzLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgY29uc3QgeyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9ID0gdGhpcy5tYWtlQXhlc1hZKHJhd0RhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5tYWtlUG9seWxpbmUocmF3RGF0YSwgdGhpcy5wYXJhbXMsIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xyXG4gICAgdGhpcy5kcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgLy8gdGhpcy5kcmF3TWFya2VycyhzdmcsIHBvbHlsaW5lLCB0aGlzLm1hcmdpbik7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJccmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcciAgICB2YXIgZ2VuZXJhdG9yID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJtLWxhbmRpbmctd2lkZ2V0Jyk7XHIgICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAnKTtcciAgICBjb25zdCBwb3B1cFNoYWRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1zaGFkb3cnKTtcciAgICBjb25zdCBwb3B1cENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNsb3NlJyk7XHIgICAgY29uc3QgY29udGVudEpTR2VuZXJhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jb2RlLWdlbmVyYXRlJyk7XHIgICAgY29uc3QgY29weUNvbnRlbnRKU0NvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29weS1qcy1jb2RlJyk7XHIgICAgY29uc3QgYXBpS2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKTtcclxyICAgIC8vINCk0LjQutGB0LjRgNGD0LXQvCDQutC70LjQutC4INC90LAg0YTQvtGA0LzQtSwg0Lgg0L7RgtC60YDRi9Cy0LDQtdC8IHBvcHVwINC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRg1xyICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyICAgICAgICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcciAgICAgICAgaWYoZWxlbWVudC5pZCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29udGFpbmVyLWN1c3RvbS1jYXJkX19idG4nKSkge1xyICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgICAgICAgICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSh3aW5kb3cuY2l0eUlkLCB3aW5kb3cuY2l0eU5hbWUpO1xyXHJcciAgICAgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24udmFsdWUgPSBnZW5lcmF0ZVdpZGdldC5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoZ2VuZXJhdGVXaWRnZXQubWFwV2lkZ2V0c1tlbGVtZW50LmlkXVsnaWQnXSk7XHIgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKSB7XHIgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgICAgICAgICAgcG9wdXBTaGFkb3cuY2xhc3NMaXN0LmFkZCgncG9wdXAtc2hhZG93LS12aXNpYmxlJylcciAgICAgICAgICAgICAgICBzd2l0Y2goZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnc2NoZW1hJ10pIHtcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmx1ZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdub25lJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICB9XHJcciAgICAgICAgfVxyICAgIH0pO1xyXHIgICAgdmFyIGV2ZW50UG9wdXBDbG9zZSA9IGZ1bmN0aW9uKGV2ZW50KXtcciAgICAgIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyICAgICAgaWYoKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBDbG9zZScpIHx8IGVsZW1lbnQgPT09IHBvcHVwKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbnRhaW5lci1jdXN0b20tY2FyZF9fYnRuJylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9fdGl0bGUnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19pdGVtcycpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2xheW91dCcpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2J0bicpKSB7XHIgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpO1xyICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyICAgICAgfVxyICAgIH07XHJcciAgICBldmVudFBvcHVwQ2xvc2UgPSBldmVudFBvcHVwQ2xvc2UuYmluZCh0aGlzKTtcciAgICAvLyDQl9Cw0LrRgNGL0LLQsNC10Lwg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrRgNC10YHRgtC40LpcciAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50UG9wdXBDbG9zZSk7XHJcclxyXHIgICAgY29weUNvbnRlbnRKU0NvZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIC8vdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcciAgICAgICAgLy9yYW5nZS5zZWxlY3ROb2RlKGNvbnRlbnRKU0dlbmVyYXRpb24pO1xyICAgICAgICAvL3dpbmRvdy5nZXRTZWxlY3Rpb24oKS5hZGRSYW5nZShyYW5nZSk7XHIgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24uc2VsZWN0KCk7XHJcciAgICAgICAgdHJ5e1xyICAgICAgICAgICAgY29uc3QgdHh0Q29weSA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XHIgICAgICAgICAgICB2YXIgbXNnID0gdHh0Q29weSA/ICdzdWNjZXNzZnVsJyA6ICd1bnN1Y2Nlc3NmdWwnO1xyICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvcHkgZW1haWwgY29tbWFuZCB3YXMgJyArIG1zZyk7XHIgICAgICAgIH1cciAgICAgICAgY2F0Y2goZSl7XHIgICAgICAgICAgICBjb25zb2xlLmxvZyhg0J7RiNC40LHQutCwINC60L7Qv9C40YDQvtCy0LDQvdC40Y8gJHtlLmVyckxvZ1RvQ29uc29sZX1gKTtcciAgICAgICAgfVxyXHIgICAgICAgIC8vINCh0L3Rj9GC0LjQtSDQstGL0LTQtdC70LXQvdC40Y8gLSDQktCd0JjQnNCQ0J3QmNCVOiDQstGLINC00L7Qu9C20L3RiyDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YxcciAgICAgICAgLy8gcmVtb3ZlUmFuZ2UocmFuZ2UpINC60L7Qs9C00LAg0Y3RgtC+INCy0L7Qt9C80L7QttC90L5cciAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xyXHIgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpO1xyICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyICAgIH0pO1xyXHIgICAgY29weUNvbnRlbnRKU0NvZGUuZGlzYWJsZWQgPSAhZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkKCdjb3B5Jyk7XHJ9KTtcciIsIi8vINCc0L7QtNGD0LvRjCDQtNC40YHQv9C10YLRh9C10YAg0LTQu9GPINC+0YLRgNC40YHQvtCy0LrQuCDQsdCw0L3QvdC10YDRgNC+0LIg0L3QsCDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LVcclxuaW1wb3J0IENpdGllcyBmcm9tICcuL2NpdGllcyc7XHJcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblxyXG4gICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxyXG4gICAgY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbiAgICBjb25zdCBjaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XHJcbiAgICBjb25zdCBzZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcblxyXG4gICAgY29uc3Qgb2JqQ2l0aWVzID0gbmV3IENpdGllcyhjaXR5TmFtZSwgY2l0aWVzKTtcclxuICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuXHJcbiAgICBzZWFyY2hDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcbmltcG9ydCBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYy1kM2pzJztcclxuaW1wb3J0ICogYXMgbmF0dXJhbFBoZW5vbWVub24gIGZyb20gJy4vZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YSc7XHJcbmltcG9ydCAqIGFzIHdpbmRTcGVlZCBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcclxuaW1wb3J0ICogYXMgd2luZERpcmVjdGlvbiBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYXRoZXJXaWRnZXQgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xyXG4gICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgdGhpcy53ZWF0aGVyID0ge1xyXG4gICAgICBmcm9tQVBJOiB7XHJcbiAgICAgICAgY29vcmQ6IHtcclxuICAgICAgICAgIGxvbjogJzAnLFxyXG4gICAgICAgICAgbGF0OiAnMCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3ZWF0aGVyOiBbe1xyXG4gICAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICAgIG1haW46ICcgJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnICcsXHJcbiAgICAgICAgICBpY29uOiAnICcsXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgYmFzZTogJyAnLFxyXG4gICAgICAgIG1haW46IHtcclxuICAgICAgICAgIHRlbXA6IDAsXHJcbiAgICAgICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICAgICAgaHVtaWRpdHk6ICcgJyxcclxuICAgICAgICAgIHRlbXBfbWluOiAnICcsXHJcbiAgICAgICAgICB0ZW1wX21heDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2luZDoge1xyXG4gICAgICAgICAgc3BlZWQ6IDAsXHJcbiAgICAgICAgICBkZWc6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJhaW46IHt9LFxyXG4gICAgICAgIGNsb3Vkczoge1xyXG4gICAgICAgICAgYWxsOiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdDogJycsXHJcbiAgICAgICAgc3lzOiB7XHJcbiAgICAgICAgICB0eXBlOiAnICcsXHJcbiAgICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJyAnLFxyXG4gICAgICAgICAgY291bnRyeTogJyAnLFxyXG4gICAgICAgICAgc3VucmlzZTogJyAnLFxyXG4gICAgICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgIG5hbWU6ICdVbmRlZmluZWQnLFxyXG4gICAgICAgIGNvZDogJyAnLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAqIEBwYXJhbSB1cmxcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cclxuICBodHRwR2V0KHVybCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgKi9cclxuICBnZXRXZWF0aGVyRnJvbUFwaSgpIHtcclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSBuYXR1cmFsUGhlbm9tZW5vbi5uYXR1cmFsUGhlbm9tZW5vblt0aGlzLnBhcmFtcy5sYW5nXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gd2luZFNwZWVkLndpbmRTcGVlZFt0aGlzLnBhcmFtcy5sYW5nXTtcclxuICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnBhcmFtc1VybEZvcmVEYWlseSlcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgKiBAcGFyYW0ge29iamVjdH0gSlNPTlxyXG4gICAqIEBwYXJhbSB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9INCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAqL1xyXG4gIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpIHtcclxuICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdID09PSAnb2JqZWN0JyAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwINGBINC00LLRg9C80Y8g0Y3Qu9C10LzQtdC90YLQsNC80Lgg0LIgSlNPTlxyXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnROYW1lMiAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZTJdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgcGFyc2VEYXRhRnJvbVNlcnZlcigpIHtcclxuICAgIGNvbnN0IHdlYXRoZXIgPSB0aGlzLndlYXRoZXI7XHJcblxyXG4gICAgaWYgKHdlYXRoZXIuZnJvbUFQSS5uYW1lID09PSAnVW5kZWZpbmVkJyB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSAnNDA0Jykge1xyXG4gICAgICBjb25zb2xlLmxvZygn0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7XHJcbiAgICAgIGNsb3VkaW5lc3M6ICcgJyxcclxuICAgICAgZHQ6ICcgJyxcclxuICAgICAgY2l0eU5hbWU6ICcgJyxcclxuICAgICAgaWNvbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZTogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1BeDogJyAnLFxyXG4gICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICBodW1pZGl0eTogJyAnLFxyXG4gICAgICBzdW5yaXNlOiAnICcsXHJcbiAgICAgIHN1bnNldDogJyAnLFxyXG4gICAgICBjb29yZDogJyAnLFxyXG4gICAgICB3aW5kOiAnICcsXHJcbiAgICAgIHdlYXRoZXI6ICcgJyxcclxuICAgIH07XHJcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSwgMTApICsgMDtcclxuICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmUgPSB0ZW1wZXJhdHVyZTsgLy8gYCR7dGVtcCA+IDAgPyBgKyR7dGVtcH1gIDogdGVtcH1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNaW4gPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21pbi50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNYXggPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21heC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgaWYgKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pIHtcclxuICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIud2luZFNwZWVkKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIud2luZFNwZWVkLCB3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpLCAnc3BlZWRfaW50ZXJ2YWwnKX1gO1xyXG4gICAgICBtZXRhZGF0YS53aW5kU3BlZWQyID0gYCR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci53aW5kU3BlZWQsIHdlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSksICdzcGVlZF9pbnRlcnZhbCcpLnN1YnN0cigwLDEpfWA7XHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci53aW5kRGlyZWN0aW9uKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX1gXHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci5jbG91ZHMpIHtcclxuICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci5jbG91ZHMsIHdlYXRoZXIuZnJvbUFQSS5jbG91ZHMuYWxsLCAnbWluJywgJ21heCcpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgbWV0YWRhdGEuaHVtaWRpdHkgPSBgJHt3ZWF0aGVyLmZyb21BUEkubWFpbi5odW1pZGl0eX0lYDtcclxuICAgIG1ldGFkYXRhLnByZXNzdXJlID0gIGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wibWFpblwiXVtcInByZXNzdXJlXCJdfSBtYmA7XHJcbiAgICBtZXRhZGF0YS5pY29uID0gYCR7d2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWNvbn1gO1xyXG5cclxuICAgIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xyXG4gICAgLy8g0J7QvtGC0YDQuNGB0L7QstC60LAg0L/QtdGA0LLRi9GFINGH0LXRgtGL0YDQtdGFINCy0LjQtNC20LXRgtC+0LJcclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuIGNsYXNzPSd3ZWF0aGVyLWxlZnQtY2FyZF9fZGVncmVlJz4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndlYXRoZXIpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtZXRhZGF0YS53aW5kU3BlZWQpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDQv9GP0YLQuCDQv9C+0YHQu9C10LTQvdC40YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMltlbGVtXS5pbm5lckhUTUwgPSBtZXRhZGF0YS5jaXR5TmFtZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyW2VsZW1dKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMltlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVscy5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHNbZWxlbV0pIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVsc1tlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4pIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4KSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heFtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XHJcbiAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZDIgJiYgbWV0YWRhdGEud2luZERpcmVjdGlvbikge1xyXG4gICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkMikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMud2luZFNwZWVkMltlbGVtXS5pbm5lclRleHQgPSBgJHttZXRhZGF0YS53aW5kU3BlZWQyfSAke21ldGFkYXRhLndpbmREaXJlY3Rpb259YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEuaHVtaWRpdHkpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmh1bWlkaXR5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuaHVtaWRpdHkuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMuaHVtaWRpdHlbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEuaHVtaWRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLnByZXNzdXJlKSB7XHJcbiAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5wcmVzc3VyZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnByZXNzdXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLnByZXNzdXJlW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLnByZXNzdXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g0J/RgNC+0L/QuNGB0YvQstCw0LXQvCDRgtC10LrRg9GJ0YPRjiDQtNCw0YLRgyDQsiDQstC40LTQttC10YLRi1xyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnQpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydFtlbGVtXS5pbm5lclRleHQgPSB0aGlzLmdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KSB7XHJcbiAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKSB7XHJcbiAgICBjb25zdCBhcnIgPSBbXTtcclxuXHJcbiAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0LmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKGVsZW0uZHQpKTtcclxuICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgIG1pbjogTWF0aC5yb3VuZChlbGVtLnRlbXAubWluKSxcclxuICAgICAgICBtYXg6IE1hdGgucm91bmQoZWxlbS50ZW1wLm1heCksXHJcbiAgICAgICAgZGF5OiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgaWNvbjogZWxlbS53ZWF0aGVyWzBdLmljb24sXHJcbiAgICAgICAgZGF0ZTogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKGVsZW0uZHQpLFxyXG4gICAgICAgIGR0OiBlbGVtLmR0LFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXMuZHJhd0dyYXBoaWNEMyhhcnIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxyXG4gICAqIEBwYXJhbSBkYXRhXHJcbiAgICovXHJcbiAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGVsZW0uZHQgKiAxMDAwKTtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDE4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyAyOF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGJyPiR7ZGF0ZS5nZXREYXRlKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0VVJMTWFpbkljb24obmFtZUljb24sIGNvbG9yID0gZmFsc2UpIHtcclxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxyXG4gICAgY29uc3QgbWFwSWNvbnMgPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgaWYgKCFjb2xvcikge1xyXG4gICAgICAvL1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAxZCcsICcwMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA2ZCcsICcwNmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA5ZCcsICcwOWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEzZCcsICcxM2RidycpO1xyXG4gICAgICAvLyDQndC+0YfQvdGL0LVcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMm4nLCAnMDJkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNG4nLCAnMDRkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwN24nLCAnMDdkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMG4nLCAnMTBkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgIGlmIChtYXBJY29ucy5nZXQobmFtZUljb24pKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHt0aGlzLnBhcmFtcy5iYXNlVVJMfS9pbWcvd2lkZ2V0cy8ke25hbWVJY29ufS5wbmdgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGBINC/0L7QvNC+0YnRjNGOINCx0LjQsdC70LjQvtGC0LXQutC4IEQzXHJcbiAgICovXHJcbiAgZHJhd0dyYXBoaWNEMyhkYXRhKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKTtcclxuXHJcbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQutC+0L3RgtC10LnQvdC10YDQvtCyINC00LvRjyDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpO1xyXG4gICAgY29uc3Qgc3ZnMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMScpO1xyXG4gICAgY29uc3Qgc3ZnMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMicpO1xyXG4gICAgY29uc3Qgc3ZnMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMycpO1xyXG5cclxuICAgIGlmKHN2Zy5xdWVyeVNlbGVjdG9yKCdzdmcnKSkge1xyXG4gICAgICBzdmcucmVtb3ZlQ2hpbGQoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzEucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcclxuICAgICAgc3ZnMS5yZW1vdmVDaGlsZChzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xyXG4gICAgICBzdmcyLnJlbW92ZUNoaWxkKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xyXG4gICAgfVxyXG4gICAgaWYoc3ZnMy5xdWVyeVNlbGVjdG9yKCdzdmcnKSl7XHJcbiAgICAgICAgc3ZnMy5yZW1vdmVDaGlsZChzdmczLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8g0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIGlkOiAnI2dyYXBoaWMnLFxyXG4gICAgICBkYXRhLFxyXG4gICAgICBvZmZzZXRYOiAxNSxcclxuICAgICAgb2Zmc2V0WTogMTAsXHJcbiAgICAgIHdpZHRoOiA0MjAsXHJcbiAgICAgIGhlaWdodDogNzksXHJcbiAgICAgIHJhd0RhdGE6IFtdLFxyXG4gICAgICBtYXJnaW46IDEwLFxyXG4gICAgICBjb2xvclBvbGlseW5lOiAnIzMzMycsXHJcbiAgICAgIGZvbnRTaXplOiAnMTJweCcsXHJcbiAgICAgIGZvbnRDb2xvcjogJyMzMzMnLFxyXG4gICAgICBzdHJva2VXaWR0aDogJzFweCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICBsZXQgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0L7RgdGC0LDQu9GM0L3Ri9GFINCz0YDQsNGE0LjQutC+0LJcclxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzEnO1xyXG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0RERjczMCc7XHJcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG5cclxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzInO1xyXG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0ZFQjAyMCc7XHJcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG5cclxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzMnO1xyXG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0ZFQjAyMCc7XHJcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqINCe0YLQvtCx0YDQsNC20LXQvdC40LUg0LPRgNCw0YTQuNC60LAg0L/QvtCz0L7QtNGLINC90LAg0L3QtdC00LXQu9GOXHJcbiAgICovXHJcbiAgZHJhd0dyYXBoaWMoYXJyKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aCA9IDQ2NTtcclxuICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmJztcclxuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgNjAwLCAzMDApO1xyXG5cclxuICAgIGNvbnRleHQuZm9udCA9ICdPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHgnO1xyXG5cclxuICAgIGxldCBzdGVwID0gNTU7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBjb25zdCB6b29tID0gNDtcclxuICAgIGNvbnN0IHN0ZXBZID0gNjQ7XHJcbiAgICBjb25zdCBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0RG93biA9IDc1O1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5tYXh9wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWVRleHRVcCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGkgKz0gMTtcclxuICAgIHdoaWxlIChpIDwgYXJyLmxlbmd0aCkge1xyXG4gICAgICBzdGVwICs9IDU1O1xyXG4gICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBpIC09IDE7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIHN0ZXAgPSA1NTtcclxuICAgIGkgPSAwO1xyXG4gICAgY29udGV4dC5tb3ZlVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1pbn3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZVGV4dERvd24pO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1pbn3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZVGV4dERvd24pO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBpIC09IDE7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMzMzMnO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHRoaXMuZ2V0V2VhdGhlckZyb21BcGkoKTtcclxuICB9XHJcblxyXG59XHJcbiIsIi8qISBodHRwOi8vbXRocy5iZS9mcm9tY29kZXBvaW50IHYwLjIuMSBieSBAbWF0aGlhcyAqL1xuaWYgKCFTdHJpbmcuZnJvbUNvZGVQb2ludCkge1xuXHQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gSUUgOCBvbmx5IHN1cHBvcnRzIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG9uIERPTSBlbGVtZW50c1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIG9iamVjdCA9IHt9O1xuXHRcdFx0XHR2YXIgJGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gJGRlZmluZVByb3BlcnR5KG9iamVjdCwgb2JqZWN0LCBvYmplY3QpICYmICRkZWZpbmVQcm9wZXJ0eTtcblx0XHRcdH0gY2F0Y2goZXJyb3IpIHt9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0oKSk7XG5cdFx0dmFyIHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cdFx0dmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblx0XHR2YXIgZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRcdHZhciBNQVhfU0laRSA9IDB4NDAwMDtcblx0XHRcdHZhciBjb2RlVW5pdHMgPSBbXTtcblx0XHRcdHZhciBoaWdoU3Vycm9nYXRlO1xuXHRcdFx0dmFyIGxvd1N1cnJvZ2F0ZTtcblx0XHRcdHZhciBpbmRleCA9IC0xO1xuXHRcdFx0dmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFx0XHRpZiAoIWxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0XHR3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHRcdFx0XHR2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0IWlzRmluaXRlKGNvZGVQb2ludCkgfHwgLy8gYE5hTmAsIGArSW5maW5pdHlgLCBvciBgLUluZmluaXR5YFxuXHRcdFx0XHRcdGNvZGVQb2ludCA8IDAgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHRcdFx0Y29kZVBvaW50ID4gMHgxMEZGRkYgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHRcdFx0Zmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQgLy8gbm90IGFuIGludGVnZXJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29kZVBvaW50IDw9IDB4RkZGRikgeyAvLyBCTVAgY29kZSBwb2ludFxuXHRcdFx0XHRcdGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXG5cdFx0XHRcdFx0Ly8gaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdFx0XHRjb2RlUG9pbnQgLT0gMHgxMDAwMDtcblx0XHRcdFx0XHRoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG5cdFx0XHRcdFx0bG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcblx0XHRcdFx0XHRjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpbmRleCArIDEgPT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xuXHRcdFx0XHRcdHJlc3VsdCArPSBzdHJpbmdGcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcblx0XHRcdFx0XHRjb2RlVW5pdHMubGVuZ3RoID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuXHRcdFx0ZGVmaW5lUHJvcGVydHkoU3RyaW5nLCAnZnJvbUNvZGVQb2ludCcsIHtcblx0XHRcdFx0J3ZhbHVlJzogZnJvbUNvZGVQb2ludCxcblx0XHRcdFx0J2NvbmZpZ3VyYWJsZSc6IHRydWUsXG5cdFx0XHRcdCd3cml0YWJsZSc6IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRTdHJpbmcuZnJvbUNvZGVQb2ludCA9IGZyb21Db2RlUG9pbnQ7XG5cdFx0fVxuXHR9KCkpO1xufVxuIiwiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjEuMFxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHIgPSByZXF1aXJlO1xuICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHVuZGVmaW5lZDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICBpZiAoX3N0YXRlKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IF9hcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlc29sdmVkIHdpdGggdGhlXG4gIHBhc3NlZCBgdmFsdWVgLiBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3Jlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBQRU5ESU5HID0gdm9pZCAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgPSAyO1xuXG52YXIgR0VUX1RIRU5fRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbihwcm9taXNlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBHRVRfVEhFTl9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgdHJ5IHtcbiAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgYXNhcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICB2YXIgZXJyb3IgPSB0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfVxuICB9LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQgPT09IEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgIEdFVF9USEVOX0VSUk9SLmVycm9yID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoZW4kJCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0aGVuJCQpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBzZWxmRnVsZmlsbG1lbnQoKSk7XG4gIH0gZWxzZSBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBnZXRUaGVuKHZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcblxuICBhc2FwKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9zdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBfc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBFcnJvck9iamVjdCgpIHtcbiAgdGhpcy5lcnJvciA9IG51bGw7XG59XG5cbnZhciBUUllfQ0FUQ0hfRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICByZXR1cm4gVFJZX0NBVENIX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkLFxuICAgICAgc3VjY2VlZGVkID0gdW5kZWZpbmVkLFxuICAgICAgZmFpbGVkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHZhbHVlID0gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICB2YWx1ZS5lcnJvciA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gIH1cblxuICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIF9yZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGlvbkVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgdmFyIF9pbnB1dCA9IHRoaXMuX2lucHV0O1xuXG4gIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lYWNoRW50cnkoX2lucHV0W2ldLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIChlbnRyeSwgaSkge1xuICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gIHZhciByZXNvbHZlJCQgPSBjLnJlc29sdmU7XG5cbiAgaWYgKHJlc29sdmUkJCA9PT0gcmVzb2x2ZSkge1xuICAgIHZhciBfdGhlbiA9IGdldFRoZW4oZW50cnkpO1xuXG4gICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XG4gICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKG5vb3ApO1xuICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24gKHJlc29sdmUkJCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSQkKGVudHJ5KTtcbiAgICAgIH0pLCBpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUkJChlbnRyeSksIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gKHN0YXRlLCBpLCB2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gKHByb21pc2UsIGkpIHtcbiAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gIHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KFJFSkVDVEVELCBpLCByZWFzb24pO1xuICB9KTtcbn07XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbChlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvcih0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIHRoaXNbUFJPTUlTRV9JRF0gPSBuZXh0SWQoKTtcbiAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaWYgKG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gIH1cbn1cblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLnJhY2UgPSByYWNlO1xuUHJvbWlzZS5yZXNvbHZlID0gcmVzb2x2ZTtcblByb21pc2UucmVqZWN0ID0gcmVqZWN0O1xuUHJvbWlzZS5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZS5fc2V0QXNhcCA9IHNldEFzYXA7XG5Qcm9taXNlLl9hc2FwID0gYXNhcDtcblxuUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQcm9taXNlLFxuXG4gIC8qKlxuICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIENoYWluaW5nXG4gICAgLS0tLS0tLS1cbiAgXG4gICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgfSk7XG4gIFxuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgIH0pO1xuICAgIGBgYFxuICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBc3NpbWlsYXRpb25cbiAgICAtLS0tLS0tLS0tLS1cbiAgXG4gICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgU2ltcGxlIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgcmVzdWx0O1xuICBcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgYXV0aG9yLCBib29rcztcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICBcbiAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgXG4gICAgfVxuICBcbiAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRBdXRob3IoKS5cbiAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgdGhlblxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICB0aGVuOiB0aGVuLFxuXG4gIC8qKlxuICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBcbiAgICBgYGBqc1xuICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgIH1cbiAgXG4gICAgLy8gc3luY2hyb25vdXNcbiAgICB0cnkge1xuICAgICAgZmluZEF1dGhvcigpO1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH1cbiAgXG4gICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCBjYXRjaFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gICdjYXRjaCc6IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgICB2YXIgbG9jYWwgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICBpZiAoUCkge1xuICAgICAgICB2YXIgcHJvbWlzZVRvU3RyaW5nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZS5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuUHJvbWlzZS5Qcm9taXNlID0gUHJvbWlzZTtcblxucmV0dXJuIFByb21pc2U7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczYtcHJvbWlzZS5tYXBcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iXX0=
