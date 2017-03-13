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
    this.url = 'http://openweathermap.org/data/2.5/find?q=' + this.cityName + '&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1';

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
        console.log('Возникла ошибка ' + error);
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
          reject(new Error('Время ожидания обращения к серверу API истекло ' + e.type + ' ' + e.timeStamp.toFixed(2)));
        };

        xhr.onerror = function (e) {
          reject(new Error('Ошибка обращения к серверу ' + e));
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
      return date.toLocaleString().replace(/,/, '').replace(/:\w+$/, '');
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
            "200": "гроза с мелким дождём",
            "201": "гроза с дождём",
            "202": "гроза с проливным дождём",
            "210": "возможна гроза",
            "211": "гроза",
            "212": "буря",
            "221": "жестокая гроза",
            "230": "гроза с мелким дождём",
            "231": "гроза с дождём",
            "232": "гроза с сильным дождём",
            "300": "сыро",
            "301": "сыро",
            "302": "очень сыро",
            "310": "лёгкий дождь",
            "311": "лёгкий дождь",
            "312": "интенсивный дождь",
            "321": "мелкий дождь",
            "500": "легкий дождь",
            "501": "дождь",
            "502": "сильный дождь",
            "503": "проливной дождь",
            "504": "сильный дождь",
            "511": "холодный дождь",
            "520": "дождь",
            "521": "дождь",
            "522": "сильный дождь",
            "600": "небольшой снегопад",
            "601": "снегопад",
            "602": "сильный снегопад",
            "611": "слякоть",
            "621": "снегопад",
            "701": "туман",
            "711": "туманно",
            "721": "туманно",
            "731": "песчаная буря",
            "741": "туманно",
            "800": "ясно",
            "801": "облачно",
            "802": "слегка облачно",
            "803": "пасмурно",
            "804": "пасмурно",
            "900": "торнадо",
            "901": "тропическая буря",
            "902": "ураган",
            "903": "холодно",
            "904": "жара",
            "905": "ветренно",
            "906": "град",
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
            "902": "huracán",
            "903": "frío",
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
            "957": "Viento fuerte, próximo a vendaval",
            "958": "Vendaval",
            "959": "Vendaval fuerte",
            "960": "Tempestad",
            "961": "Tempestad violenta",
            "962": "Huracán"
        }
    },
    "ua": {
        "name": "Ukrainian",
        "main": "",
        "description": {
            "200": "гроза з легким дощем",
            "201": "гроза з дощем",
            "202": "гроза зі зливою",
            "210": "легка гроза",
            "211": "гроза",
            "212": "сильна гроза",
            "221": "короткочасні грози",
            "230": "гроза з дрібним дощем",
            "231": "гроза з дощем",
            "232": "гроза з сильним дрібним дощем",
            "300": "легка мряка",
            "301": "мряка",
            "302": "сильна мряка",
            "310": "легкий дрібний дощ",
            "311": "дрібний дощ",
            "312": "сильний дрібний дощ",
            "321": "дрібний дощ",
            "500": "легка злива",
            "501": "помірний дощ",
            "502": "сильний дощ",
            "503": "сильна злива",
            "504": "злива",
            "511": "крижаний дощ",
            "520": "дощ",
            "521": "дощ",
            "522": "сильна злива",
            "600": "легкий снігопад",
            "601": "сніг ",
            "602": "сильний снігопад",
            "611": "мокрий сніг",
            "621": "снігопад",
            "701": "туман",
            "711": "туман",
            "721": "серпанок",
            "731": "піщана заметіль",
            "741": "туман",
            "800": "чисте небо",
            "801": "трохи хмарно",
            "802": "розірвані хмари",
            "803": "хмарно",
            "804": "хмарно",
            "900": "торнадо",
            "901": "тропічна буря",
            "902": "буревій",
            "903": "холодно",
            "904": "спека",
            "905": "вітряно",
            "906": "град",
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
            "501": "mäßiger Regen",
            "502": "sehr starker Regen",
            "503": "sehr starker Regen",
            "504": "Starkregen",
            "511": "Eisregen",
            "520": "leichte Regenschauer",
            "521": "Regenschauer",
            "522": "heftige Regenschauer",
            "600": "mäßiger Schnee",
            "601": "Schnee",
            "602": "heftiger Schneefall",
            "611": "Graupel",
            "621": "Schneeschauer",
            "701": "trüb",
            "711": "Rauch",
            "721": "Dunst",
            "731": "Sand \/ Staubsturm",
            "741": "Nebel",
            "800": "klarer Himmel",
            "801": "ein paar Wolken",
            "802": "überwiegend bewölkt",
            "803": "überwiegend bewölkt",
            "804": "wolkenbedeckt",
            "900": "Tornado",
            "901": "Tropensturm",
            "902": "Hurrikan",
            "903": "kalt",
            "904": "heiß",
            "905": "windig",
            "906": "Hagel",
            "950": "Setting",
            "951": "Windstille",
            "952": "Leichte Brise",
            "953": "Milde Brise",
            "954": "Mäßige Brise",
            "955": "Frische Brise",
            "956": "Starke Brise",
            "957": "Hochwind, annähender Sturm",
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
            "701": "Névoa",
            "711": "fumaça",
            "721": "neblina",
            "731": "turbilhões de areia/poeira",
            "741": "Neblina",
            "800": "céu claro",
            "801": "Algumas nuvens",
            "802": "nuvens dispersas",
            "803": "nuvens quebrados",
            "804": "tempo nublado",
            "900": "tornado",
            "901": "tempestade tropical",
            "902": "furacão",
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
            "200": "furtună cu ploaie ușoară",
            "201": "furtună",
            "202": "furtună cu ploaie puternică",
            "210": "furtună ușoară",
            "211": "furtună",
            "212": "furtună puternică",
            "221": "furtună aprigă",
            "230": "furtună cu burniță",
            "231": "furtună cu burniță",
            "232": "furtună cu burniță",
            "300": "burniță de intensitate joasă",
            "301": "burniță",
            "302": "burniță de intensitate mare",
            "310": "burniță de intensitate joasă",
            "311": "burniță",
            "312": "burniță de intensitate mare",
            "321": "burniță",
            "500": "ploaie ușoară",
            "501": "ploaie",
            "502": "ploaie puternică",
            "503": "ploaie torențială ",
            "504": "ploaie extremă",
            "511": "ploaie înghețată",
            "520": "ploaie de scurtă durată",
            "521": "ploaie de scurtă durată",
            "522": "ploaie de scurtă durată",
            "600": "ninsoare ușoară",
            "601": "ninsoare",
            "602": "ninsoare puternică",
            "611": "lapoviță",
            "621": "ninsoare de scurtă durată",
            "701": "ceață",
            "711": "ceață",
            "721": "ceață",
            "731": "vârtejuri de nisip",
            "741": "ceață",
            "800": "cer senin",
            "801": "câțiva nori",
            "802": "nori împrăștiați",
            "803": "cer fragmentat",
            "804": "cer acoperit de nori",
            "900": "tornadă",
            "901": "furtuna tropicală",
            "902": "uragan",
            "903": "rece",
            "904": "fierbinte",
            "905": "vant puternic",
            "906": "grindină",
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
            "230": "Burza z lekką mżawką",
            "231": "Burza z mżawka",
            "232": "Burza z intensywną mżawką",
            "300": "Lekka mżawka",
            "301": "Mżawka",
            "302": "Intensywna mżawka",
            "310": "Lekkie opady drobnego deszczu",
            "311": "Deszcz / mżawka",
            "312": "Intensywny deszcz / mżawka",
            "321": "Silna mżawka",
            "500": "Lekki deszcz",
            "501": "Umiarkowany deszcz",
            "502": "Intensywny deszcz",
            "503": "bardzo silny deszcz",
            "504": "Ulewa",
            "511": "Marznący deszcz",
            "520": "Krótka ulewa",
            "521": "Deszcz",
            "522": "Intensywny, lekki deszcz",
            "600": "Lekkie opady śniegu",
            "601": "Śnieg",
            "602": "Mocne opady śniegu",
            "611": "Deszcz ze śniegem",
            "621": "Śnieżyca",
            "701": "Mgiełka",
            "711": "Smog",
            "721": "Zamglenia",
            "731": "Zamieć piaskowa",
            "741": "Mgła",
            "800": "Bezchmurnie",
            "801": "Lekkie zachmurzenie",
            "802": "Rozproszone chmury",
            "803": "Pochmurno z przejaśnieniami",
            "804": "Pochmurno",
            "900": "tornado",
            "901": "burza tropikalna",
            "902": "Huragan",
            "903": "Chłodno",
            "904": "Gorąco",
            "905": "wietrznie",
            "906": "Grad",
            "950": "Setting",
            "951": "Spokojnie",
            "952": "Lekka bryza",
            "953": "Delikatna bryza",
            "954": "Umiarkowana bryza",
            "955": "Świeża bryza",
            "956": "Silna bryza",
            "957": "Prawie wichura",
            "958": "Wichura",
            "959": "Silna wichura",
            "960": "Sztorm",
            "961": "Gwałtowny sztorm",
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
            "221": "lievä ukkosmyrsky",
            "230": "ukkosmyrsky ja kevyt tihkusade",
            "231": "ukkosmyrsky ja tihkusade",
            "232": "ukkosmyrsky ja kova tihkusade",
            "300": "lievä tihuttainen",
            "301": "tihuttaa",
            "302": "kova tihuttainen",
            "310": "lievä tihkusade",
            "311": "tihkusade",
            "312": "kova tihkusade",
            "321": "tihkusade",
            "500": "pieni sade",
            "501": "kohtalainen sade",
            "502": "kova sade",
            "503": "erittäin runsasta sadetta",
            "504": "kova sade",
            "511": "jäätävä sade",
            "520": "lievä tihkusade",
            "521": "tihkusade",
            "522": "kova sade",
            "600": "pieni lumisade",
            "601": "lumi",
            "602": "paljon lunta",
            "611": "räntä",
            "621": "lumikuuro",
            "701": "sumu",
            "711": "savu",
            "721": "sumu",
            "731": "hiekka/pöly pyörre",
            "741": "sumu",
            "800": "taivas on selkeä",
            "801": "vähän pilviä",
            "802": "ajoittaisia pilviä",
            "803": "hajanaisia pilviä",
            "804": "pilvinen",
            "900": "tornado",
            "901": "trooppinen myrsky",
            "902": "hirmumyrsky",
            "903": "kylmä",
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
            "210": "orages légers",
            "211": "orages",
            "212": "gros orages",
            "221": "orages éparses",
            "230": "Orage avec légère bruine",
            "231": "orages éparses",
            "232": "gros orage",
            "300": "Bruine légère",
            "301": "Bruine",
            "302": "Fortes bruines",
            "310": "Pluie fine éparse",
            "311": "pluie fine",
            "312": "Crachin intense",
            "321": "Averses de bruine",
            "500": "légères pluies",
            "501": "pluies modérées",
            "502": "Fortes pluies",
            "503": "très fortes précipitations",
            "504": "grosses pluies",
            "511": "pluie verglaçante",
            "520": "petites averses",
            "521": "averses de pluie",
            "522": "averses intenses",
            "600": "légères neiges",
            "601": "neige",
            "602": "fortes chutes de neige",
            "611": "neige fondue",
            "621": "averses de neige",
            "701": "brume",
            "711": "Brouillard",
            "721": "brume",
            "731": "tempêtes de sable",
            "741": "brouillard",
            "800": "ensoleillé",
            "801": "peu nuageux",
            "802": "partiellement ensoleillé",
            "803": "nuageux",
            "804": "Couvert",
            "900": "tornade",
            "901": "tempête tropicale",
            "902": "ouragan",
            "903": "froid",
            "904": "chaud",
            "905": "venteux",
            "906": "grêle",
            "950": "Setting",
            "951": "Calme",
            "952": "Brise légère",
            "953": "Brise douce",
            "954": "Brise modérée",
            "955": "Brise fraiche",
            "956": "Brise forte",
            "957": "Vent fort, presque violent",
            "958": "Vent violent",
            "959": "Vent très violent",
            "960": "Tempête",
            "961": "empête violente",
            "962": "Ouragan"
        }
    },
    "bg": {
        "name": "Bulgarian",
        "main": "",
        "description": {
            "200": "Гръмотевична буря със слаб дъжд",
            "201": "Гръмотевична буря с валеж",
            "202": "Гръмотевична буря с порой",
            "210": "Слаба гръмотевична буря",
            "211": "Гръмотевична буря",
            "212": "Силна гръмотевична буря",
            "221": "Разкъсана облачност",
            "230": "Гръмотевична буря със слаб ръмеж",
            "231": "Гръмотевична буря с ръмеж",
            "232": "Гръмотевична буря със силен ръмеж",
            "300": "Слаб ръмеж",
            "301": "Ръми",
            "302": "Силен ръмеж",
            "310": "Слаб дъжд",
            "311": "Ръмящ дъжд",
            "312": "Силен ръмеж",
            "321": "Силен ръмеж",
            "500": "Слаб дъжд",
            "501": "Умерен дъжд",
            "502": "Силен дъжд",
            "503": "Много силен валеж",
            "504": "Силен дъжд",
            "511": "Дъжд със студ",
            "520": "Слаб дъжд",
            "521": "Обилен дъжд",
            "522": "Порой",
            "600": "Слаб снеговалеж",
            "601": "Снеговалеж",
            "602": "Силен снеговалеж",
            "611": "Изненадващ валеж",
            "621": "Обилен снеговалеж",
            "701": "Мъгла",
            "711": "Дим",
            "721": "Ниска мъгла",
            "731": "Пясъчна/Прашна буря",
            "741": "Мъгла",
            "800": "Ясно небе",
            "801": "Ниска облачност",
            "802": "Разкъсана облачност",
            "803": "Разсеяна облачност",
            "804": "Тъмни облаци",
            "900": "Торнадо/Ураган",
            "901": "Тропическа буря",
            "902": "Ураган",
            "903": "Студено",
            "904": "Горещо време",
            "905": "Ветровито",
            "906": "Град",
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
            "200": "åskoväder",
            "201": "åskoväder",
            "202": "fullt åskoväder",
            "210": "åska",
            "211": "åskoväder",
            "212": "åska",
            "221": "ojämnt oväder",
            "230": "åskoväder",
            "231": "åskoväder",
            "232": "fullt åskoväder",
            "300": "mjukt duggregn",
            "301": "duggregn",
            "302": "hårt duggregn",
            "310": "mjukt regn",
            "311": "regn",
            "312": "hårt regn",
            "321": "duggregn",
            "500": "mjukt regn",
            "501": "Måttlig regn",
            "502": "hårt regn",
            "503": "mycket kraftigt regn",
            "504": "ösregn",
            "511": "underkylt regn",
            "520": "mjukt ösregn",
            "521": "dusch-regn",
            "522": "regnar småspik",
            "600": "mjuk snö",
            "601": "snö",
            "602": "kraftigt snöfall",
            "611": "snöblandat regn",
            "621": "snöoväder",
            "701": "dimma",
            "711": "smogg",
            "721": "dis",
            "731": "sandstorm",
            "741": "dimmigt",
            "800": "klar himmel",
            "801": "några moln",
            "802": "spridda moln",
            "803": "molnigt",
            "804": "överskuggande moln",
            "900": "storm",
            "901": "tropisk storm",
            "902": "orkan",
            "903": "kallt",
            "904": "varmt",
            "905": "blåsigt",
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
            "200": "雷陣雨",
            "201": "雷陣雨",
            "202": "雷陣雨",
            "210": "雷陣雨",
            "211": "雷陣雨",
            "212": "雷陣雨",
            "221": "雷陣雨",
            "230": "雷陣雨",
            "231": "雷陣雨",
            "232": "雷陣雨",
            "300": "小雨",
            "301": "小雨",
            "302": "大雨",
            "310": "小雨",
            "311": "小雨",
            "312": "大雨",
            "321": "陣雨",
            "500": "小雨",
            "501": "中雨",
            "502": "大雨",
            "503": "大雨",
            "504": "暴雨",
            "511": "凍雨",
            "520": "陣雨",
            "521": "陣雨",
            "522": "大雨",
            "600": "小雪",
            "601": "雪",
            "602": "大雪",
            "611": "雨夾雪",
            "621": "陣雪",
            "701": "薄霧",
            "711": "煙霧",
            "721": "薄霧",
            "731": "沙旋風",
            "741": "大霧",
            "800": "晴",
            "801": "晴，少雲",
            "802": "多雲",
            "803": "多雲",
            "804": "陰，多雲",
            "900": "龍捲風",
            "901": "熱帶風暴",
            "902": "颶風",
            "903": "冷",
            "904": "熱",
            "905": "大風",
            "906": "冰雹",
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
            "200": "Gök gürültülü hafif yağmurlu",
            "201": "Gök gürültülü yağmurlu",
            "202": "Gök gürültülü sağanak yağışlı",
            "210": "Hafif sağanak",
            "211": "Sağanak",
            "212": "Şiddetli sağanak",
            "221": "Aralıklı sağanak",
            "230": "Gök gürültülü hafif yağışlı",
            "231": "Gök gürültülü yağışlı",
            "232": "Gök gürültülü şiddetli yağışlı",
            "300": "Yer yer hafif yoğunluklu yağış",
            "301": "Yer yer yağışlı",
            "302": "Yer yer yoğun yağışlı",
            "310": "Yer yer hafif yağışlı",
            "311": "Yer yer yağışlı",
            "312": "Yer yer yoğun yağışlı",
            "321": "Yer yer sağanak yağışlı",
            "500": "Hafif yağmur",
            "501": "Orta şiddetli yağmur",
            "502": "Şiddetli yağmur",
            "503": "Çok şiddetli yağmur",
            "504": "Aşırı yağmur",
            "511": "Yağışlı ve soğuk hava",
            "520": "Kısa süreli hafif yoğunluklu yağmur",
            "521": "Kısa süreli yağmur",
            "522": "Kısa süreli şiddetli yağmur",
            "600": "Hafif kar yağışlı",
            "601": "Kar yağışlı",
            "602": "Yoğun kar yağışlı",
            "611": "Karla karışık yağmurlu",
            "621": "Kısa sürelü kar yağışı",
            "701": "Sisli",
            "711": "Sisli",
            "721": "Hafif sisli",
            "731": "Kum/Toz fırtınası",
            "741": "Sisli",
            "800": "Açık",
            "801": "Az bulutlu",
            "802": "Parçalı az bulutlu",
            "803": "Parçalı bulutlu",
            "804": "Kapalı",
            "900": "Kasırga",
            "901": "Tropik fırtına",
            "902": "Hortum",
            "903": "Çok Soğuk",
            "904": "Çok Sıcak",
            "905": "Rüzgarlı",
            "906": "Dolu yağışı",
            "950": "Durgun",
            "951": "Sakin",
            "952": "Hafif Rüzgarlı",
            "953": "Az Rüzgarlı",
            "954": "Orta Seviye Rüzgarlı",
            "955": "Rüzgarlı",
            "956": "Kuvvetli Rüzgar",
            "957": "Sert Rüzgar",
            "958": "Fırtına",
            "959": "Şiddetli Fırtına",
            "960": "Kasırga",
            "961": "Şiddetli Kasırga",
            "962": "Çok Şiddetli Kasırga"
        }
    },
    "zh_cn": {
        "name": "Chinese Simplified",
        "main": "",
        "description": {
            "200": "雷阵雨",
            "201": "雷阵雨",
            "202": "雷阵雨",
            "210": "雷阵雨",
            "211": "雷阵雨",
            "212": "雷阵雨",
            "221": "雷阵雨",
            "230": "雷阵雨",
            "231": "雷阵雨",
            "232": "雷阵雨",
            "300": "小雨",
            "301": "小雨",
            "302": "大雨",
            "310": "小雨",
            "311": "小雨",
            "312": "大雨",
            "321": "阵雨",
            "500": "小雨",
            "501": "中雨",
            "502": "大雨",
            "503": "大雨",
            "504": "暴雨",
            "511": "冻雨",
            "520": "阵雨",
            "521": "阵雨",
            "522": "大雨",
            "600": "小雪",
            "601": "雪",
            "602": "大雪",
            "611": "雨夹雪",
            "621": "阵雪",
            "701": "薄雾",
            "711": "烟雾",
            "721": "薄雾",
            "731": "沙旋风",
            "741": "大雾",
            "800": "晴",
            "801": "晴，少云",
            "802": "多云",
            "803": "多云",
            "804": "阴，多云",
            "900": "龙卷风",
            "901": "热带风暴",
            "902": "飓风",
            "903": "冷",
            "904": "热",
            "905": "大风",
            "906": "冰雹",
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
            "200": "bouřka se slabým deštěm",
            "201": "bouřka a déšť",
            "202": "bouřka se silným deštěm",
            "210": "slabší bouřka",
            "211": "bouřka",
            "212": "silná bouřka",
            "221": "bouřková přeháňka",
            "230": "bouřka se slabým mrholením",
            "231": "bouřka s mrholením",
            "232": "bouřka se silným mrholením",
            "300": "slabé mrholení",
            "301": "mrholení",
            "302": "silné mrholení",
            "310": "slabé mrholení a déšť",
            "311": "mrholení s deštěm",
            "312": "silné mrholení a déšť",
            "313": "mrholení a přeháňky",
            "314": "mrholení a silné přeháňky",
            "321": "občasné mrholení",
            "500": "slabý déšť",
            "501": "déšť",
            "502": "prudký déšť",
            "503": "přívalový déšť",
            "504": "průtrž mračen",
            "511": "mrznoucí déšť",
            "520": "slabé přeháňky",
            "521": "přeháňky",
            "522": "silné přeháňky",
            "531": "občasné přeháňky",
            "600": "mírné sněžení",
            "601": "sněžení",
            "602": "husté sněžení",
            "611": "zmrzlý déšť",
            "612": "smíšené přeháňky",
            "615": "slabý déšť se sněhem",
            "616": "déšť se sněhem",
            "620": "slabé sněhové přeháňky",
            "621": "sněhové přeháňky",
            "622": "silné sněhové přeháňky",
            "701": "mlha",
            "711": "kouř",
            "721": "opar",
            "731": "písečné či prachové víry",
            "741": "hustá mlha",
            "751": "písek",
            "761": "prašno",
            "762": "sopečný popel",
            "771": "prudké bouře",
            "781": "tornádo",
            "800": "jasno",
            "801": "skoro jasno",
            "802": "polojasno",
            "803": "oblačno",
            "804": "zataženo",
            "900": "tornádo",
            "901": "tropická bouře",
            "902": "hurikán",
            "903": "zima",
            "904": "horko",
            "905": "větrno",
            "906": "krupobití",
            "950": "bezvětří",
            "951": "vánek",
            "952": "větřík",
            "953": "slabý vítr",
            "954": "mírný vítr",
            "955": "čerstvý vítr",
            "956": "silný vítr",
            "957": "prudký vítr",
            "958": "bouřlivý vítr",
            "959": "vichřice",
            "960": "silná vichřice",
            "961": "mohutná vichřice",
            "962": "orkán"
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
            "200": "tormenta eléctrica con choiva lixeira",
            "201": "tormenta eléctrica con choiva",
            "202": "tormenta eléctrica con choiva intensa",
            "210": "tormenta eléctrica lixeira",
            "211": "tormenta eléctrica",
            "212": "tormenta eléctrica forte",
            "221": "tormenta eléctrica irregular",
            "230": "tormenta eléctrica con orballo lixeiro",
            "231": "tormenta eléctrica con orballo",
            "232": "tormenta eléctrica con orballo intenso",
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
            "701": "néboa",
            "711": "fume",
            "721": "néboa lixeira",
            "731": "remuiños de area e polvo",
            "741": "bruma",
            "800": "ceo claro",
            "801": "algo de nubes",
            "802": "nubes dispersas",
            "803": "nubes rotas",
            "804": "nubes",
            "900": "tornado",
            "901": "tormenta tropical",
            "902": "furacán",
            "903": "frío",
            "904": "calor",
            "905": "ventoso",
            "906": "sarabia",
            "951": "calma",
            "952": "Vento frouxo",
            "953": "Vento suave",
            "954": "Vento moderado",
            "955": "Brisa",
            "956": "Vento forte",
            "957": "Vento forte, próximo a vendaval",
            "958": "Vendaval",
            "959": "Vendaval forte",
            "960": "Tempestade",
            "961": "Tempestade violenta",
            "962": "Furacán"
        }
    },
    "vi": {
        "name": "vietnamese",
        "main": "",
        "description": {
            "200": "Giông bão và Mưa nhẹ",
            "201": "Giông bão và Mưa",
            "202": "Giông bão Mưa lớn",
            "210": "Giông bão có chớp giật",
            "211": "Bão",
            "212": "Giông bão lớn",
            "221": "Bão vài nơi",
            "230": "Giông bão và Mưa phùn nhẹ",
            "231": "Giông bão với mưa phùn",
            "232": "Giông bão với mưa phùn nặng",
            "300": "ánh sáng cường độ mưa phùn",
            "301": "mưa phùn",
            "302": "mưa phùn cường độ nặng",
            "310": "mưa phùn nhẹ",
            "311": "mưa và mưa phùn",
            "312": "mưa và mưa phùn nặng",
            "321": "mưa rào và mưa phùn",
            "500": "mưa nhẹ",
            "501": "mưa vừa",
            "502": "mưa cường độ nặng",
            "503": "mưa rất nặng",
            "504": "mưa lốc",
            "511": "mưa lạnh",
            "520": "mưa rào nhẹ",
            "521": "mưa rào",
            "522": "mưa rào cường độ nặng",
            "600": "tuyết rơi nhẹ",
            "601": "tuyết",
            "602": "tuyết nặng hạt",
            "611": "mưa đá",
            "621": "tuyết mù trời",
            "701": "sương mờ",
            "711": "khói bụi",
            "721": "đám mây",
            "731": "bão cát và lốc xoáy",
            "741": "sương mù",
            "800": "bầu trời quang đãng",
            "801": "mây thưa",
            "802": "mây rải rác",
            "803": "mây cụm",
            "804": "mây đen u ám",
            "900": "lốc xoáy",
            "901": "cơn bão nhiệt đới",
            "902": "bão lốc",
            "903": "lạnh",
            "904": "nóng",
            "905": "gió",
            "906": "mưa đá",
            "950": "Chế đọ",
            "951": "Nhẹ nhàng",
            "952": "Ánh sáng nhẹ",
            "953": "Gío thoảng",
            "954": "Gió nhẹ",
            "955": "Gió vừa phải",
            "956": "Gió mạnh",
            "957": "Gió xoáy",
            "958": "Lốc xoáy",
            "959": "Lốc xoáy nặng",
            "960": "Bão",
            "961": "Bão cấp lớn",
            "962": "Bão lốc"
        }
    },
    "ar": {
        "name": "Arabic",
        "main": "",
        "description": {
            "200": "عاصفة رعدية مع أمطار خفيفة",
            "201": "العواصف رعدية مع المطر",
            "202": "عاصفة رعدية مع امطار غزيرة",
            "210": "عاصفة رعدية خفيفة",
            "211": "عاصفة رعدية",
            "212": "عاصفة رعدية ثقيلة",
            "221": "عاصفة رعدية خشنة",
            "230": "عاصفة رعدية مع رذاذ خفيف",
            "231": "عاصفة رعدية مع رذاذ",
            "232": "عاصفة رعدية مع رذاذ غزيرة",
            "300": "رذاذ خفيف الكثافة",
            "301": "رذاذ",
            "302": "رذاذ شديد الكثافة",
            "310": "رذاذ مطر خفيف الكثافة",
            "311": "رذاذ مطر",
            "312": "رذاذ مطر شديد الكثافة",
            "321": "وابل رذاذ",
            "500": "مطر خفيف",
            "501": "مطر متوسط الغزارة",
            "502": "مطر غزير",
            "503": "مطر شديد الغزارة",
            "504": "مطر عالي الغزارة",
            "511": "مطر برد",
            "520": "وابل مطر خفيف",
            "521": "وابل مطر",
            "522": "وابل مطر شديد الكثافة",
            "600": "ثلوج خفيفه",
            "601": "ثلوج",
            "602": "ثلوج قوية",
            "611": "صقيع",
            "621": "وابل ثلوج",
            "701": "ضباب",
            "711": "دخان",
            "721": "غيوم",
            "731": "غبار",
            "741": "غيم",
            "800": "سماء صافية",
            "801": "غائم جزئ",
            "802": "غيوم متفرقة",
            "803": "غيوم متناثره",
            "804": "غيوم قاتمة",
            "900": "إعصار",
            "901": "عاصفة استوائية",
            "902": "زويعة",
            "903": "بارد",
            "904": "حار",
            "905": "رياح",
            "906": "وابل",
            "950": "إعداد",
            "951": "هادئ",
            "952": "نسيم خفيف",
            "953": "نسيم لطيف",
            "954": "نسيم معتدل",
            "955": "نسيم عليل",
            "956": "نسيم قوي",
            "957": "رياح قوية",
            "958": "عاصف",
            "959": "عاصفة شديدة",
            "960": "عاصفة",
            "961": "عاصفة عنيفة",
            "962": "إعصار"
        }
    },
    "mk": {
        "name": "Macedonian",
        "main": "",
        "description": {
            "200": "грмежи со слаб дожд",
            "201": "грмежи со дожд",
            "202": "грмежи со силен дожд",
            "210": "слаби грмежи",
            "211": "грмежи",
            "212": "силни грмежи",
            "221": "многу силни грмежи",
            "230": "грмежи со слабо росење",
            "231": "грмежи со росење",
            "232": "грмежи со силно росење",
            "300": "слабо росење",
            "301": "росење",
            "302": "силно росење",
            "310": "слабо росење",
            "311": "росење",
            "312": "силно росење",
            "321": "дожд",
            "500": "слаб дожд",
            "501": "слаб дожд",
            "502": "силен дожд",
            "503": "многу силен дожд",
            "504": "обилен дожд",
            "511": "град",
            "520": "слабо росење",
            "521": "роси",
            "522": "силно росење",
            "600": "слаб снег",
            "601": "снег",
            "602": "силен снег",
            "611": "лапавица",
            "621": "лапавица",
            "701": "магла",
            "711": "смог",
            "721": "замагленост",
            "731": "песочен вртлог",
            "741": "магла",
            "800": "чисто небо",
            "801": "неколку облаци",
            "802": "одвоени облаци",
            "803": "облаци",
            "804": "облачно",
            "900": "торнадо",
            "901": "тропска бура",
            "902": "ураган",
            "903": "ладно",
            "904": "топло",
            "905": "ветровито",
            "906": "град",
            "950": "Залез",
            "951": "Мирно",
            "952": "Слаб ветар",
            "953": "Слаб ветар",
            "954": "Ветар",
            "955": "Свеж ветар",
            "956": "Силен ветар",
            "957": "Многу силен ветар",
            "958": "Невреме",
            "959": "Силно невреме",
            "960": "Бура",
            "961": "Силна бура",
            "962": "Ураган"
        }
    },
    "sk": {
        "name": "Slovak",
        "main": "",
        "description": {
            "200": "búrka so slabým dažďom",
            "201": "búrka s dažďom",
            "202": "búrka so silným dažďom",
            "210": "mierna búrka",
            "211": "búrka",
            "212": "silná búrka",
            "221": "prudká búrka",
            "230": "búrka so slabým mrholením",
            "231": "búrka s mrholením",
            "232": "búrka so silným mrholením",
            "300": "slabé mrholenie",
            "301": "mrholenie",
            "302": "silné mrholenie",
            "310": "slabé popŕchanie",
            "311": "popŕchanie",
            "312": "silné popŕchanie",
            "321": "jemné mrholenie",
            "500": "slabý dážď",
            "501": "mierny dážď",
            "502": "silný dážď",
            "503": "veľmi silný dážď",
            "504": "extrémny dážď",
            "511": "mrznúci dážď",
            "520": "slabá prehánka",
            "521": "prehánka",
            "522": "silná prehánka",
            "600": "slabé sneženie",
            "601": "sneženie",
            "602": "silné sneženie",
            "611": "dážď so snehom",
            "621": "snehová prehánka",
            "701": "hmla",
            "711": "dym",
            "721": "opar",
            "731": "pieskové/prašné víry",
            "741": "hmla",
            "800": "jasná obloha",
            "801": "takmer jasno",
            "802": "polojasno",
            "803": "oblačno",
            "804": "zamračené",
            "900": "tornádo",
            "901": "tropická búrka",
            "902": "hurikán",
            "903": "zima",
            "904": "horúco",
            "905": "veterno",
            "906": "krupobitie",
            "950": "Nastavenie",
            "951": "Bezvetrie",
            "952": "Slabý vánok",
            "953": "Jemný vietor",
            "954": "Stredný vietor",
            "955": "Čerstvý vietor",
            "956": "Silný vietor",
            "957": "Silný vietor, takmer víchrica",
            "958": "Víchrica",
            "959": "Silná víchrica",
            "960": "Búrka",
            "961": "Ničivá búrka",
            "962": "Hurikán"
        }
    },
    "hu": {
        "name": "Hungarian",
        "main": "",
        "description": {
            "200": "vihar enyhe esővel",
            "201": "vihar esővel",
            "202": "vihar heves esővel",
            "210": "enyhe zivatar",
            "211": "vihar",
            "212": "heves vihar",
            "221": "durva vihar",
            "230": "vihar enyhe szitálással",
            "231": "vihar szitálással",
            "232": "vihar erős szitálással",
            "300": "enyhe intenzitású szitálás",
            "301": "szitálás",
            "302": "erős intenzitású szitálás",
            "310": "enyhe intenzitású szitáló eső",
            "311": "szitáló eső",
            "312": "erős intenzitású szitáló eső",
            "321": "zápor",
            "500": "enyhe eső",
            "501": "közepes eső",
            "502": "heves intenzitású eső",
            "503": "nagyon heves eső",
            "504": "extrém eső",
            "511": "ónos eső",
            "520": "enyhe intenzitású zápor",
            "521": "zápor",
            "522": "erős intenzitású zápor",
            "600": "enyhe havazás",
            "601": "havazás",
            "602": "erős havazás",
            "611": "havas eső",
            "621": "hózápor",
            "701": "gyenge köd",
            "711": "köd",
            "721": "köd",
            "731": "homokvihar",
            "741": "köd",
            "800": "tiszta égbolt",
            "801": "kevés felhő",
            "802": "szórványos felhőzet",
            "803": "erős felhőzet",
            "804": "borús égbolt",
            "900": "tornádó",
            "901": "trópusi vihar",
            "902": "hurrikán",
            "903": "hűvös",
            "904": "forró",
            "905": "szeles",
            "906": "jégeső",
            "950": "Nyugodt",
            "951": "Csendes",
            "952": "Enyhe szellő",
            "953": "Finom szellő",
            "954": "Közepes szél",
            "955": "Élénk szél",
            "956": "Erős szél",
            "957": "Erős, már viharos szél",
            "958": "Viharos szél",
            "959": "Erősen viharos szél",
            "960": "Szélvihar",
            "961": "Tomboló szélvihar",
            "962": "Hurrikán"
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
            "511": "Pluja glaçada",
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
            "762": "Cendra volcànica",
            "771": "Xàfec",
            "781": "Tornado",
            "800": "Cel net",
            "801": "Lleugerament ennuvolat",
            "802": "Núvols dispersos",
            "803": "Nuvolositat variable",
            "804": "Ennuvolat",
            "900": "Tornado",
            "901": "Tempesta tropical",
            "902": "Huracà",
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
            "962": "Huracà"
        }
    },
    "hr": {
        "name": "Croatian",
        "main": "",
        "description": {
            "200": "grmljavinska oluja s slabom kišom",
            "201": "grmljavinska oluja s kišom",
            "202": "grmljavinska oluja s jakom kišom",
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
            "310": "rosulja s kišom slabog intenziteta",
            "311": "rosulja s kišom",
            "312": "rosulja s kišom jakog intenziteta",
            "313": "pljuskovi i rosulja",
            "314": "rosulja s jakim pljuskovima",
            "321": "rosulja s pljuskovima",
            "500": "slaba kiša",
            "501": "umjerena kiša",
            "502": "kiša jakog intenziteta",
            "503": "vrlo jaka kiša",
            "504": "ekstremna kiša",
            "511": "ledena kiša",
            "520": "pljusak slabog intenziteta",
            "521": "pljusak",
            "522": "pljusak jakog intenziteta",
            "531": "olujna kiša s pljuskovima",
            "600": "slabi snijeg",
            "601": "snijeg",
            "602": "gusti snijeg",
            "611": "susnježica",
            "612": "susnježica s pljuskovima",
            "615": "slaba kiša i snijeg",
            "616": "kiša i snijeg",
            "620": "snijeg s povremenim pljuskovima",
            "621": "snijeg s pljuskovima",
            "622": "snijeg s jakim pljuskovima",
            "701": "sumaglica",
            "711": "dim",
            "721": "izmaglica",
            "731": "kovitlaci pijeska ili prašine",
            "741": "magla",
            "751": "pijesak",
            "761": "prašina",
            "762": "vulkanski pepeo",
            "771": "zapusi vjetra s kišom",
            "781": "tornado",
            "800": "vedro",
            "801": "blaga naoblaka",
            "802": "raštrkani oblaci",
            "803": "isprekidani oblaci",
            "804": "oblačno",
            "900": "tornado",
            "901": "tropska oluja",
            "902": "orkan",
            "903": "hladno",
            "904": "vruće",
            "905": "vjetrovito",
            "906": "tuča",
            "950": "",
            "951": "lahor",
            "952": "povjetarac",
            "953": "slab vjetar",
            "954": "umjeren vjetar",
            "955": "umjereno jak vjetar",
            "956": "jak vjetar",
            "957": "žestok vjetar",
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

        this.baseURL = 'http://openweathermap.org/themes/openweathermap/assets/vendor/owm';
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
                var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&units=' + this.unitsTemp[0] + '&cnt=8&appid=' + this.controlsWidget.apiKey.value;
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
                    console.log('Ошибка валидации ' + e);
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
                    code = '<script src=\'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js\'></script>';
                }
                return code + '<div id=\'openweathermap-widget\'></div>\n                    <script type=\'text/javascript\'>\n                    window.myWidgetParam = {\n                        id: ' + id + ',\n                        cityid: ' + this.paramsWidget.cityId + ',\n                        appid: \'' + this.paramsWidget.appid.replace('2d90837ddbaeda36ab487f257829b667', '') + '\',\n                        containerid: \'openweathermap-widget\',\n                    };\n                    (function() {\n                        var script = document.createElement(\'script\');\n                        script.type = \'text/javascript\';\n                        script.async = true;\n                        script.src = \'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js\';\n                        var s = document.getElementsByTagName(\'script\')[0];\n                        s.parentNode.insertBefore(script, s);\n                    })();\n                  </script>';
            }

            return null;
        }
    }, {
        key: 'setInitialStateForm',
        value: function setInitialStateForm() {
            var cityId = arguments.length <= 0 || arguments[0] === undefined ? 2022572 : arguments[0];
            var cityName = arguments.length <= 1 || arguments[1] === undefined ? 'Moscow' : arguments[1];


            this.paramsWidget = {
                cityId: cityId,
                cityName: cityName,
                lang: 'en',
                appid: document.getElementById('api-key').value || '2d90837ddbaeda36ab487f257829b667',
                units: this.unitsTemp[0],
                textUnitTemp: this.unitsTemp[1], // 248
                baseURL: this.baseURL,
                urlDomain: 'http://api.openweathermap.org'
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
      var _getMinMaxDate = this.getMinMaxDate(rawData);

      var maxDate = _getMinMaxDate.maxDate;
      var minDate = _getMinMaxDate.minDate;

      var _getMinMaxTemperature = this.getMinMaxTemperature(rawData);

      var min = _getMinMaxTemperature.min;
      var max = _getMinMaxTemperature.max;

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
      var _getMinMaxDate2 = this.getMinMaxDate(rawData);

      var maxDate = _getMinMaxDate2.maxDate;
      var minDate = _getMinMaxDate2.minDate;

      var _getMinMaxWeather = this.getMinMaxWeather(rawData);

      var min = _getMinMaxWeather.min;
      var max = _getMinMaxWeather.max;

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
        svg.append('text').attr('x', elem.x).attr('y', elem.maxT - 2 - params.offsetX / 2).attr('text-anchor', 'middle').style('font-size', params.fontSize).style('stroke', params.fontColor).style('fill', params.fontColor).text(params.data[item].max + '°');

        svg.append('text').attr('x', elem.x).attr('y', elem.minT + 7 + params.offsetY / 2).attr('text-anchor', 'middle').style('font-size', params.fontSize).style('stroke', params.fontColor).style('fill', params.fontColor).text(params.data[item].min + '°');
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

      var _makeAxesXY = this.makeAxesXY(rawData, this.params);

      var scaleX = _makeAxesXY.scaleX;
      var scaleY = _makeAxesXY.scaleY;
      var data = _makeAxesXY.data;

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
      console.log('Ошибка копирования ' + e.errLogToConsole);
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
          reject(new Error('Время ожидания обращения к серверу API истекло ' + e.type + ' ' + e.timeStamp.toFixed(2)));
        };

        xhr.onerror = function (e) {
          reject(new Error('Ошибка обращения к серверу ' + e));
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
          console.log('Возникла ошибка ' + error);
          _this2.parseDataFromServer();
        });
      }, function (error) {
        console.log('Возникла ошибка ' + error);
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
      var arr = [];

      for (var elem in this.weather.forecastDaily.list) {
        var day = this.getDayNameOfWeekByDayNumber(this.getNumberDayInWeekByUnixTime(this.weather.forecastDaily.list[elem].dt));
        arr.push({
          min: Math.round(this.weather.forecastDaily.list[elem].temp.min),
          max: Math.round(this.weather.forecastDaily.list[elem].temp.max),
          day: elem != 0 ? day : 'Today',
          icon: this.weather.forecastDaily.list[elem].weather[0].icon,
          date: this.timestampToDateTime(this.weather.forecastDaily.list[elem].dt)
        });
      }

      return this.drawGraphicD3(arr);
    }

    /**
     * Отрисовка названия дней недели и иконок с погодой
     * @param data
     */

  }, {
    key: 'renderIconsDaysOfWeek',
    value: function renderIconsDaysOfWeek(data) {
      var _this3 = this;

      var that = this;

      data.forEach(function (elem, index) {
        var date = void 0;
        date = new Date(elem.date.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1'));
        // для edge строим другой алгоритм даты
        if (date.toString() === 'Invalid Date') {
          var reg = /(\d)+/ig;
          var found = elem.date.match(reg);
          date = new Date(found[2] + '-' + found[1] + '-' + found[0] + ' ' + found[3] + ':' + (found[4] ? found[4] : '00') + ':' + (found[5] ? found[5] : '00'));
          if (date.toString() === 'Invalid Date') {
            date = new Date(found[2], found[1] - 1, found[0], found[3], found[4] ? found[4] : '00', found[5] ? found[5] : '00');
          }
        }
        that.controls.calendarItem[index].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this3.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 8].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this3.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 18].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this3.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 28].innerHTML = elem.day + '<br>' + date.getDate() + ' ' + _this3.getMonthNameByMonthNumber(date.getMonth()) + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
      });
      return data;
    }
  }, {
    key: 'getURLMainIcon',
    value: function getURLMainIcon(nameIcon) {
      var color = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
      context.strokeText(arr[i].max + 'º', step, -1 * arr[i].max * zoom + stepYTextUp);
      context.lineTo(step - 10, -1 * arr[i].max * zoom + stepY);
      i += 1;
      while (i < arr.length) {
        step += 55;
        context.lineTo(step, -1 * arr[i].max * zoom + stepY);
        context.strokeText(arr[i].max + 'º', step, -1 * arr[i].max * zoom + stepYTextUp);
        i += 1;
      }
      i -= 1;
      context.lineTo(step + 30, -1 * arr[i].max * zoom + stepY);
      step = 55;
      i = 0;
      context.moveTo(step - 10, -1 * arr[i].min * zoom + stepY);
      context.strokeText(arr[i].min + 'º', step, -1 * arr[i].min * zoom + stepYTextDown);
      context.lineTo(step - 10, -1 * arr[i].min * zoom + stepY);
      i += 1;
      while (i < arr.length) {
        step += 55;
        context.lineTo(step, -1 * arr[i].min * zoom + stepY);
        context.strokeText(arr[i].min + 'º', step, -1 * arr[i].min * zoom + stepYTextDown);
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
 * @version   4.0.5
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
      value = null;
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxDb29raWVzLmpzIiwiYXNzZXRzXFxqc1xcY2l0aWVzLmpzIiwiYXNzZXRzXFxqc1xcY3VzdG9tLWRhdGUuanMiLCJhc3NldHNcXGpzXFxkYXRhXFxuYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXHdpbmQtc3BlZWQtZGF0YS5qcyIsImFzc2V0c1xcanNcXGdlbmVyYXRvci13aWRnZXQuanMiLCJhc3NldHNcXGpzXFxncmFwaGljLWQzanMuanMiLCJhc3NldHNcXGpzXFxwb3B1cC5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIiwibm9kZV9tb2R1bGVzL1N0cmluZy5mcm9tQ29kZVBvaW50L2Zyb21jb2RlcG9pbnQuanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7SUFDcUIsTzs7Ozs7Ozs4QkFFVCxJLEVBQU0sSyxFQUFPO0FBQ3JCLFVBQUksVUFBVSxJQUFJLElBQUosRUFBZDtBQUNBLGNBQVEsT0FBUixDQUFnQixRQUFRLE9BQVIsS0FBcUIsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUF0RDtBQUNBLGVBQVMsTUFBVCxHQUFrQixPQUFPLEdBQVAsR0FBYSxPQUFPLEtBQVAsQ0FBYixHQUE2QixZQUE3QixHQUE0QyxRQUFRLFdBQVIsRUFBNUMsR0FBcUUsVUFBdkY7QUFDRDs7QUFFRDs7Ozs4QkFDVSxJLEVBQU07QUFDZCxVQUFJLFVBQVUsU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLElBQUksTUFBSixDQUNsQyxhQUFhLEtBQUssT0FBTCxDQUFhLDhCQUFiLEVBQTZDLE1B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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vINCg0LDQsdC+0YLQsCDRgSDQutGD0LrQsNC80LhcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29va2llcyB7XHJcblxyXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSkge1xyXG4gICAgdmFyIGV4cGlyZXMgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZXhwaXJlcy5zZXRUaW1lKGV4cGlyZXMuZ2V0VGltZSgpICsgKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjsgZXhwaXJlcz1cIiArIGV4cGlyZXMudG9HTVRTdHJpbmcoKSArICBcIjsgcGF0aD0vXCI7XHJcbiAgfVxyXG5cclxuICAvLyDQstC+0LfQstGA0LDRidCw0LXRgiBjb29raWUg0YEg0LjQvNC10L3QtdC8IG5hbWUsINC10YHQu9C4INC10YHRgtGMLCDQtdGB0LvQuCDQvdC10YIsINGC0L4gdW5kZWZpbmVkXHJcbiAgZ2V0Q29va2llKG5hbWUpIHtcclxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXHJcbiAgICAgIFwiKD86Xnw7IClcIiArIG5hbWUucmVwbGFjZSgvKFtcXC4kPyp8e31cXChcXClcXFtcXF1cXFxcXFwvXFwrXl0pL2csICdcXFxcJDEnKSArIFwiPShbXjtdKilcIlxyXG4gICAgKSk7XHJcbiAgICByZXR1cm4gbWF0Y2hlcyA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaGVzWzFdKSA6IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUNvb2tpZSgpIHtcclxuICAgIHRoaXMuc2V0Q29va2llKG5hbWUsIFwiXCIsIHtcclxuICAgICAgZXhwaXJlczogLTFcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4qIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cclxuKi9cclxuXHJcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XHJcbnJlcXVpcmUoJ1N0cmluZy5mcm9tQ29kZVBvaW50Jyk7XHJcbmltcG9ydCBXZWF0aGVyV2lkZ2V0IGZyb20gJy4vd2VhdGhlci13aWRnZXQnO1xyXG5pbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0aWVzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lcikge1xyXG5cclxuICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xyXG4gICAgdGhpcy51bml0cyA9IGdlbmVyYXRlV2lkZ2V0LnVuaXRzVGVtcFsxXTtcclxuICAgIGlmICghY2l0eU5hbWUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2l0eU5hbWUgPSBjaXR5TmFtZS52YWx1ZS5yZXBsYWNlKC8oXFxzKSsvZywnLScpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCAnJztcclxuICAgIHRoaXMudXJsID0gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZmluZD9xPSR7dGhpcy5jaXR5TmFtZX0mdHlwZT1saWtlJnNvcnQ9cG9wdWxhdGlvbiZjbnQ9MzAmYXBwaWQ9YjFiMTVlODhmYTc5NzIyNTQxMjQyOWMxYzUwYzEyMmExYDtcclxuXHJcbiAgICB0aGlzLnNlbENpdHlTaWduID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGhpcy5zZWxDaXR5U2lnbi5pbm5lclRleHQgPSAnIHNlbGVjdGVkICc7XHJcbiAgICB0aGlzLnNlbENpdHlTaWduLmNsYXNzID0gJ3dpZGdldC1mb3JtX19zZWxlY3RlZCc7XHJcblxyXG4gICAgY29uc3Qgb2JqV2lkZ2V0ID0gbmV3IFdlYXRoZXJXaWRnZXQoZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC5jb250cm9sc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQudXJscyk7XHJcblxyXG4gICAgb2JqV2lkZ2V0LnJlbmRlcigpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldENpdGllcygpIHtcclxuICAgIGlmICghdGhpcy5jaXR5TmFtZSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmh0dHBHZXQodGhpcy51cmwpXHJcbiAgICAgIC50aGVuKFxyXG4gICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0aGlzLmdldFNlYXJjaERhdGEocmVzcG9uc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgfVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VhcmNoRGF0YShKU09Ob2JqZWN0KSB7XHJcbiAgICBpZiAoIUpTT05vYmplY3QubGlzdC5sZW5ndGgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0NpdHkgbm90IGZvdW5kJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQo9C00LDQu9GP0LXQvCDRgtCw0LHQu9C40YbRgywg0LXRgdC70Lgg0LXRgdGC0YxcclxuICAgIGNvbnN0IHRhYmxlQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1jaXRpZXMnKTtcclxuICAgIGlmICh0YWJsZUNpdHkpIHtcclxuICAgICAgdGFibGVDaXR5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFibGVDaXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBKU09Ob2JqZWN0Lmxpc3QubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY29uc3QgbmFtZSA9IGAke0pTT05vYmplY3QubGlzdFtpXS5uYW1lfSwgJHtKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnl9YDtcclxuICAgICAgY29uc3QgZmxhZyA9IGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltYWdlcy9mbGFncy8ke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeS50b0xvd2VyQ2FzZSgpfS5wbmdgO1xyXG4gICAgICBodG1sICs9IGA8dHI+PHRkIGNsYXNzPVwid2lkZ2V0LWZvcm1fX2l0ZW1cIj48YSBocmVmPVwiL2NpdHkvJHtKU09Ob2JqZWN0Lmxpc3RbaV0uaWR9XCIgaWQ9XCIke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIiBjbGFzcz1cIndpZGdldC1mb3JtX19saW5rXCI+JHtuYW1lfTwvYT48aW1nIHNyYz1cIiR7ZmxhZ31cIj48L3A+PC90ZD48L3RyPmA7XHJcbiAgICB9XHJcblxyXG4gICAgaHRtbCA9IGA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiIGlkPVwidGFibGUtY2l0aWVzXCI+JHtodG1sfTwvdGFibGU+YDtcclxuICAgIHRoaXMuY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgY29uc3QgdGFibGVDaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XHJcblxyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgdGFibGVDaXRpZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gKCdBJykudG9Mb3dlckNhc2UoKSAmJiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aWRnZXQtZm9ybV9fbGluaycpKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2l0eSA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZENpdHknKTtcclxuICAgICAgICBpZiAoIXNlbGVjdGVkQ2l0eSkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoYXQuc2VsQ2l0eVNpZ24sIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8g0J/QvtC00YHRgtCw0L3QvtCy0LrQsCDQvdCw0LnQtNC10L3QvtCz0L4g0LPQvtGA0L7QtNCwXHJcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQuY2l0eUlkID0gZXZlbnQudGFyZ2V0LmlkO1xyXG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xyXG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LnVuaXRzID0gdGhpcy51bml0cztcclxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0oZXZlbnQudGFyZ2V0LmlkLCBldmVudC50YXJnZXQudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgd2luZG93LmNpdHlJZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICAgIHdpbmRvdy5jaXR5TmFtZSA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcclxuXHJcblxyXG4gICAgICAgICAgY29uc3Qgb2JqV2lkZ2V0ID0gbmV3IFdlYXRoZXJXaWRnZXQoZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC5jb250cm9sc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQudXJscyk7XHJcbiAgICAgICAgICBvYmpXaWRnZXQucmVuZGVyKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXHJcbiAgKiBAcGFyYW0gdXJsXHJcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAqL1xyXG4gIGh0dHBHZXQodXJsKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKG51bGwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxyXG4qL1xyXG5cclxuLy8g0KDQsNCx0L7RgtCwINGBINC00LDRgtC+0LlcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRGF0ZSBleHRlbmRzIERhdGUge1xyXG5cclxuICAvKipcclxuICAqINC80LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDINCyINGC0YDQtdGF0YDQsNC30YDRj9C00L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60LhcclxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbnVtYmVyIFvRh9C40YHQu9C+INC80LXQvdC10LUgOTk5XVxyXG4gICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cclxuICAqL1xyXG4gIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKSB7XHJcbiAgICBpZiAobnVtYmVyID4gMzY1KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChudW1iZXIgPCAxMCkge1xyXG4gICAgICByZXR1cm4gYDAwJHtudW1iZXJ9YDtcclxuICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwKSB7XHJcbiAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVtYmVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LIg0LPQvtC00YNcclxuICAqIEBwYXJhbSAge2RhdGV9IGRhdGUg0JTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7aW50ZWdlcn0gINCf0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0LIg0LPQvtC00YNcclxuICAqL1xyXG4gIGNvbnZlcnREYXRlVG9OdW1iZXJEYXkoZGF0ZSkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICBjb25zdCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgcmV0dXJuIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAqL1xyXG4gIGNvbnZlcnROdW1iZXJEYXlUb0RhdGUoZGF0ZSkge1xyXG4gICAgY29uc3QgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICBjb25zdCBsaW5lID0gcmUuZXhlYyhkYXRlKTtcclxuICAgIGNvbnN0IGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xyXG4gICAgY29uc3QgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgKGxpbmVbM10gKiAxMDAwICogNjAgKiA2MCAqIDI0KTtcclxuICAgIGNvbnN0IHJlcyA9IG5ldyBEYXRlKHVuaXh0aW1lKTtcclxuXHJcbiAgICBjb25zdCBtb250aCA9IHJlcy5nZXRNb250aCgpICsgMTtcclxuICAgIGNvbnN0IGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgeWVhciA9IHJlcy5nZXRGdWxsWWVhcigpO1xyXG4gICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWAgOiBkYXlzfS4ke21vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRofS4ke3llYXJ9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC00LDRgtGLINCy0LjQtNCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqIEBwYXJhbSAge2RhdGUxfSBkYXRlINC00LDRgtCwINCyINGE0L7RgNC80LDRgtC1IHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge3N0cmluZ30gINC00LDRgtCwINCy0LLQuNC00LUg0YHRgtGA0L7QutC4INGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqL1xyXG4gIGZvcm1hdERhdGUoZGF0ZTEpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlMSk7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcblxyXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoIDwgMTApID8gYDAke21vbnRofWAgOiBtb250aH0gLSAkeyhkYXkgPCAxMCkgPyBgMCR7ZGF5fWAgOiBkYXl9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgtC10LrRg9GJ0YPRjiDQvtGC0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Rg9GOINC00LDRgtGDIHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge1tzdHJpbmddfSDRgtC10LrRg9GJ0LDRjyDQtNCw0YLQsFxyXG4gICovXHJcbiAgZ2V0Q3VycmVudERhdGUoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0RGF0ZShub3cpO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICBnZXREYXRlTGFzdFRocmVlTW9udGgoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICBsZXQgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgIGRheSAtPSA5MDtcclxuICAgIGlmIChkYXkgPCAwKSB7XHJcbiAgICAgIHllYXIgLT0gMTtcclxuICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0Q3VycmVudFNwcmluZ0RhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTAzLTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDUtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0L/RgNC10LTRi9C00YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldExhc3RTdW1tZXJEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSAtIDE7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICBnZXRGaXJzdERhdGVDdXJZZWFyKCkge1xyXG4gICAgcmV0dXJuIGAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gLSAwMDFgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sICcnKS5yZXBsYWNlKC86XFx3KyQvLCAnJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGhoOm1tXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgY29uc3QgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgcmV0dXJuIGAke2hvdXJzIDwgMTAgPyBgMCR7aG91cnN9YCA6IGhvdXJzfSA6ICR7bWludXRlcyA8IDEwID8gYDAke21pbnV0ZXN9YCA6IG1pbnV0ZXN9IGA7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxyXG4gICogQHBhcmFtIHVuaXh0aW1lXHJcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICovXHJcbiAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICB9XHJcblxyXG4gIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxyXG4gICogQHBhcmFtIGRheU51bWJlclxyXG4gICogQHJldHVybnMge3N0cmluZ31cclxuICAqL1xyXG4gIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpIHtcclxuICAgIGNvbnN0IGRheXMgPSB7XHJcbiAgICAgIDA6ICdTdW4nLFxyXG4gICAgICAxOiAnTW9uJyxcclxuICAgICAgMjogJ1R1ZScsXHJcbiAgICAgIDM6ICdXZWQnLFxyXG4gICAgICA0OiAnVGh1JyxcclxuICAgICAgNTogJ0ZyaScsXHJcbiAgICAgIDY6ICdTYXQnLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBkYXlzW2RheU51bWJlcl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC10YDQvdGD0YLRjCDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LzQtdGB0Y/RhtCwINC/0L4g0LXQs9C+INC90L7QvNC10YDRg1xyXG4gICAqIEBwYXJhbSBudW1Nb250aFxyXG4gICAqIEByZXR1cm5zIHsqfVxyXG4gICAqL1xyXG4gIGdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIobnVtTW9udGgpe1xyXG5cclxuICAgIGlmKHR5cGVvZiBudW1Nb250aCAhPT0gXCJudW1iZXJcIiB8fCBudW1Nb250aCA8PTAgJiYgbnVtTW9udGggPj0gMTIpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGhOYW1lID0ge1xyXG4gICAgICAwOiBcIkphblwiLFxyXG4gICAgICAxOiBcIkZlYlwiLFxyXG4gICAgICAyOiBcIk1hclwiLFxyXG4gICAgICAzOiBcIkFwclwiLFxyXG4gICAgICA0OiBcIk1heVwiLFxyXG4gICAgICA1OiBcIkp1blwiLFxyXG4gICAgICA2OiBcIkp1bFwiLFxyXG4gICAgICA3OiBcIkF1Z1wiLFxyXG4gICAgICA4OiBcIlNlcFwiLFxyXG4gICAgICA5OiBcIk9jdFwiLFxyXG4gICAgICAxMDogXCJOb3ZcIixcclxuICAgICAgMTE6IFwiRGVjXCJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG1vbnRoTmFtZVtudW1Nb250aF07XHJcbiAgfVxyXG5cclxuICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgKlxyXG4gICovXHJcbiAgY29tcGFyZURhdGVzV2l0aFRvZGF5KGRhdGUpIHtcclxuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKSB7XHJcbiAgICBjb25zdCByZSA9IC8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcclxuICAgIGNvbnN0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgaWYgKHJlc0RhdGUubGVuZ3RoID09PSA2KSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKTtcclxuICAgIH1cclxuICAgIC8vINCV0YHQu9C4INC00LDRgtCwINC90LUg0YDQsNGB0L/QsNGA0YHQtdC90LAg0LHQtdGA0LXQvCDRgtC10LrRg9GJ0YPRjlxyXG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBISDpNTSBNb250aE5hbWUgTnVtYmVyRGF0ZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0VGltZURhdGVISE1NTW9udGhEYXkoKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiBgJHtkYXRlLmdldEhvdXJzKCkgPCAxMCA/IGAwJHtkYXRlLmdldEhvdXJzKCl9YCA6IGRhdGUuZ2V0SG91cnMoKSB9OiR7ZGF0ZS5nZXRNaW51dGVzKCkgPCAxMCA/IGAwJHtkYXRlLmdldE1pbnV0ZXMoKX1gIDogZGF0ZS5nZXRNaW51dGVzKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9ICR7ZGF0ZS5nZXREYXRlKCl9YDtcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjAuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBjb25zdCBuYXR1cmFsUGhlbm9tZW5vbiA9e1xyXG4gICAgXCJlblwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkVuZ2xpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGVhdnkgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwic2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcImhlYXZ5IHNob3dlciByYWluIGFuZCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibW9kZXJhdGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcInJhZ2dlZCBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGlnaHQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInNob3dlciBzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwibGlnaHQgcmFpbiBhbmQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwicmFpbiBhbmQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwibGlnaHQgc2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJoZWF2eSBzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImhhemVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmQsZHVzdCB3aGlybHNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwic2FuZFwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiZHVzdFwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwidm9sY2FuaWMgYXNoXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJzcXVhbGxzXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjbGVhciBza3lcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwic2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwibGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJnZW50bGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJtb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcImZyZXNoIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwic3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiaGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcImdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcInNldmVyZSBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwidmlvbGVudCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiaHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJydVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlJ1c3NpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2ZcXHUwNDQwXFx1MDQzZVxcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0MzJcXHUwNDNlXFx1MDQzN1xcdTA0M2NcXHUwNDNlXFx1MDQzNlxcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzNlxcdTA0MzVcXHUwNDQxXFx1MDQ0MlxcdTA0M2VcXHUwNDNhXFx1MDQzMFxcdTA0NGYgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2RcXHUwNDRjIFxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDM4XFx1MDQzZFxcdTA0NDJcXHUwNDM1XFx1MDQzZFxcdTA0NDFcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQzZVxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcXHUwNDNiXFx1MDQ0Y1xcdTA0NDhcXHUwNDNlXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQ0ZlxcdTA0M2FcXHUwNDNlXFx1MDQ0MlxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQ0N1xcdTA0MzBcXHUwNDNkXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0ZlxcdTA0NDFcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0M2ZcXHUwNDMwXFx1MDQ0MVxcdTA0M2NcXHUwNDQzXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0MzhcXHUwNDQ3XFx1MDQzNVxcdTA0NDFcXHUwNDNhXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDM2XFx1MDQzMFxcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzNVxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJpdFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkl0YWxpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dpYSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRlbXBvcmFsZSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImZvcnRlIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwaW9nZ2lhIGxlZ2dlcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBpb2dnaWEgbW9kZXJhdGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImZvcnRlIHBpb2dnaWFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBpb2dnaWEgZm9ydGlzc2ltYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicGlvZ2dpYSBlc3RyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwaW9nZ2lhIGdlbGF0YVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImZvcnRlIG5ldmljYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJuZXZpc2NoaW9cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImZvcnRlIG5ldmljYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJmb3NjaGlhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1vXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJmb3NjaGlhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJtdWxpbmVsbGkgZGkgc2FiYmlhXFwvcG9sdmVyZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibmViYmlhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBzZXJlbm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInBvY2hlIG51dm9sZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViaSBzcGFyc2VcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51Ymkgc3BhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJjaWVsbyBjb3BlcnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YSB0cm9waWNhbGVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhbm9cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyZWRkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2FsZG9cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5kaW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtb1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQmF2YSBkaSB2ZW50b1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJlenphIGxlZ2dlcmFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyZXp6YSB0ZXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJVcmFnYW5vXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJzcFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlNwYW5pc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgY29uIGxsdXZpYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdlcmEgdG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdWVydGUgdG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRvcm1lbnRhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwibGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImxsdXZpYSB5IGxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImNodWJhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsbHV2aWEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJsbHV2aWEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImxsdXZpYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImxsdXZpYSBtdXkgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJsbHV2aWEgbXV5IGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibGx1dmlhIGhlbGFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1YmFzY28gZGUgbGlnZXJhIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNodWJhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaHViYXNjbyBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiYWd1YW5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJjaHViYXNjbyBkZSBuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJodW1vXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuaWVibGFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInRvcmJlbGxpbm9zIGRlIGFyZW5hXFwvcG9sdm9cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJhY1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlZpZW50byBmbG9qb1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmllbnRvIHN1YXZlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJWaWVudG8gbW9kZXJhZG9cIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWaWVudG8gZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWaWVudG8gZnVlcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhZFwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ1YVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlVrcmFpbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3XFx1MDQ1NiBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZVxcdTA0NGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDNhXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQ0MlxcdTA0M2FcXHUwNDNlXFx1MDQ0N1xcdTA0MzBcXHUwNDQxXFx1MDQzZFxcdTA0NTYgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0M2ZcXHUwNDNlXFx1MDQzY1xcdTA0NTZcXHUwNDQwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0M2FcXHUwNDQwXFx1MDQzOFxcdTA0MzZcXHUwNDMwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzIFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzY1xcdTA0M2VcXHUwNDNhXFx1MDQ0MFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0NDFcXHUwNDM1XFx1MDQ0MFxcdTA0M2ZcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDNhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQ1NlxcdTA0NDlcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzNVxcdTA0NDJcXHUwNDU2XFx1MDQzYlxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDQ3XFx1MDQzOFxcdTA0NDFcXHUwNDQyXFx1MDQzNSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDQ1XFx1MDQzOCBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0NTZcXHUwNDQwXFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQ1NiBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDU2XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzVcXHUwNDMyXFx1MDQ1NlxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0NDFcXHUwNDNmXFx1MDQzNVxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQ1NlxcdTA0NDJcXHUwNDQwXFx1MDQ0ZlxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImRlXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiR2VybWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHZXdpdHRlciBtaXQgUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdld2l0dGVyIG1pdCBzdGFya2VtIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsZWljaHRlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2Nod2VyZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZWluaWdlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdld2l0dGVyIG1pdCBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxlaWNodGVzIE5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIk5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInN0YXJrZXMgTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGVpY2h0ZXIgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIk5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzdGFya2VyIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJOaWVzZWxzY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsZWljaHRlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJzZWhyIHN0YXJrZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlN0YXJrcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIkVpc3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsZWljaHRlIFJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWZ0aWdlIFJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBTY2huZWVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlNjaG5lZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVmdGlnZXIgU2NobmVlZmFsbFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiR3JhdXBlbFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiU2NobmVlc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwidHJcXHUwMGZjYlwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiUmF1Y2hcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkR1bnN0XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTYW5kIFxcLyBTdGF1YnN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJlbFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhcmVyIEhpbW1lbFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZWluIHBhYXIgV29sa2VuXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ3b2xrZW5iZWRlY2t0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9wZW5zdHVybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVycmlrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImthbHRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhlaVxcdTAwZGZcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmRpZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiSGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIldpbmRzdGlsbGVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxlaWNodGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIk1pbGRlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNXFx1MDBlNFxcdTAwZGZpZ2UgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyaXNjaGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0YXJrZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSG9jaHdpbmQsIGFublxcdTAwZTRoZW5kZXIgU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTY2h3ZXJlciBTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkhlZnRpZ2VzIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicHRcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJQb3J0dWd1ZXNlXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidHJvdm9hZGEgY29tIGNodXZhIGxldmVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidHJvdm9hZGEgY29tIGNodXZhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0cm92b2FkYSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0cm92b2FkYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidHJvdm9hZGEgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0cm92b2FkYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidHJvdm9hZGEgY29tIGdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJnYXJvYSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImdhcm9hIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImNodXZhIGxldmVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImNodXZhIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJjaHV2YSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiY2h1dmEgZGUgZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImNodXZhIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJDaHV2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2h1dmEgZGUgaW50ZW5zaWRhZGUgcGVzYWRvXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaHV2YSBtdWl0byBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiQ2h1dmEgRm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImNodXZhIGNvbSBjb25nZWxhbWVudG9cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNodXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHV2YVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2h1dmEgZGUgaW50ZW5zaWRhZGUgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZlIGJyYW5kYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTmV2ZSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImNodXZhIGNvbSBuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJiYW5obyBkZSBuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJOXFx1MDBlOXZvYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtYVxcdTAwZTdhXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZWJsaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0dXJiaWxoXFx1MDBmNWVzIGRlIGFyZWlhXFwvcG9laXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJsaW5hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjXFx1MDBlOXUgY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkFsZ3VtYXMgbnV2ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudXZlbnMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudXZlbnMgcXVlYnJhZG9zXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ0ZW1wbyBudWJsYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YWRlIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmlvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJxdWVudGVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImNvbSB2ZW50b1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJyb1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlJvbWFuaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiZnVydHVuXFx1MDEwMyBjdSBwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImZ1cnR1blxcdTAxMDMgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdXJ0dW5cXHUwMTAzIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZnVydHVuXFx1MDEwMyBhcHJpZ1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgam9hc1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgbWFyZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBtYXJlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbG9haWVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBsb2FpZSB0b3JlblxcdTAyMWJpYWxcXHUwMTAzIFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicGxvYWllIGV4dHJlbVxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBsb2FpZSBcXHUwMGVlbmdoZVxcdTAyMWJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5pbnNvYXJlIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmluc29hcmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5pbnNvYXJlIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibGFwb3ZpXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5pbnNvYXJlIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInZcXHUwMGUycnRlanVyaSBkZSBuaXNpcFwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNlciBzZW5pblwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiY1xcdTAwZTJcXHUwMjFiaXZhIG5vcmlcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm5vcmkgXFx1MDBlZW1wclxcdTAxMDNcXHUwMjE5dGlhXFx1MDIxYmlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImNlciBmcmFnbWVudGF0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJjZXIgYWNvcGVyaXQgZGUgbm9yaVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiZnVydHVuYSB0cm9waWNhbFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwicmVjZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiZmllcmJpbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2YW50IHB1dGVybmljXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmluZGluXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJwbFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlBvbGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkJ1cnphIHogbGVra2ltaSBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkJ1cnphIHogb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJCdXJ6YSB6IGludGVuc3l3bnltaSBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkxla2thIGJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJCdXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiU2lsbmEgYnVyemFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJCdXJ6YSB6IGxla2tcXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiQnVyemEgeiBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkJ1cnphIHogaW50ZW5zeXduXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIkxla2thIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiTVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJJbnRlbnN5d25hIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiTGVra2llIG9wYWR5IGRyb2JuZWdvIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIkRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJJbnRlbnN5d255IGRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJTaWxuYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIkxla2tpIGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiVW1pYXJrb3dhbnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJJbnRlbnN5d255IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiYmFyZHpvIHNpbG55IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiVWxld2FcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIk1hcnpuXFx1MDEwNWN5IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiS3JcXHUwMGYzdGthIHVsZXdhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJEZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIkludGVuc3l3bnksIGxla2tpIGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTGVra2llIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDE1YW5pZWdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk1vY25lIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiRGVzemN6IHplIFxcdTAxNWJuaWVnZW1cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTAxNWFuaWVcXHUwMTdjeWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJNZ2llXFx1MDE0MmthXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJTbW9nXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJaYW1nbGVuaWFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlphbWllXFx1MDEwNyBwaWFza293YVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTWdcXHUwMTQyYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQmV6Y2htdXJuaWVcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkxla2tpZSB6YWNobXVyemVuaWVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlJvenByb3N6b25lIGNobXVyeVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiUG9jaG11cm5vIHogcHJ6ZWphXFx1MDE1Ym5pZW5pYW1pXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJQb2NobXVybm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImJ1cnphIHRyb3Bpa2FsbmFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIkNoXFx1MDE0Mm9kbm9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIkdvclxcdTAxMDVjb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2lldHJ6bmllXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJHcmFkXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTcG9rb2puaWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxla2thIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJEZWxpa2F0bmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlVtaWFya293YW5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTVhd2llXFx1MDE3Y2EgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJQcmF3aWUgd2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiV2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2lsbmEgd2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3p0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJHd2FcXHUwMTQydG93bnkgc3p0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhZ2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJmaVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkZpbm5pc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ1a2tvc215cnNreSBqYSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInBpZW5pIHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwia292YSB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwibGlldlxcdTAwZTQgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInVra29zbXlyc2t5IGphIGtldnl0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidWtrb3NteXJza3kgamEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlldlxcdTAwZTQgdGlodXR0YWluZW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInRpaHV0dGFhXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJrb3ZhIHRpaHV0dGFpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWV2XFx1MDBlNCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwia292YSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGllbmkgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwia29odGFsYWluZW4gc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJlcml0dFxcdTAwZTRpbiBydW5zYXN0YSBzYWRldHRhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImpcXHUwMGU0XFx1MDBlNHRcXHUwMGU0dlxcdTAwZTQgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwicGllbmkgbHVtaXNhZGVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcImx1bWlcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInBhbGpvbiBsdW50YVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiclxcdTAwZTRudFxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImx1bWlrdXVyb1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic2F2dVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiaGlla2thXFwvcFxcdTAwZjZseSBweVxcdTAwZjZycmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInRhaXZhcyBvbiBzZWxrZVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInZcXHUwMGU0aFxcdTAwZTRuIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiYWpvaXR0YWlzaWEgcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJoYWphbmFpc2lhIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwicGlsdmluZW5cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb29wcGluZW4gbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJoaXJtdW15cnNreVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia3lsbVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImt1dW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ0dXVsaW5lblwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwicmFrZWl0YVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJubFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkR1dGNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvbndlZXJzYnVpIG1ldCByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpY2h0ZSBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ6d2FyZSBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvbnJlZ2VsbWF0aWcgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvbndlZXJzYnVpIG1ldCBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpY2h0ZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWNodGUgbW90cmVnZW5cXC9yZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInp3YXJlIG1vdHJlZ2VuXFwvcmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWNodGUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1hdGlnZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInplZXIgendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIktvdWRlIGJ1aWVuXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWNodGUgc3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiendhcmUgc3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGljaHRlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZXZpZ2Ugc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJpanplbFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmF0dGUgc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZXZlbFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiemFuZFxcL3N0b2Ygd2VydmVsaW5nXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJvbmJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImxpY2h0IGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcImhhbGYgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiendhYXIgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiZ2VoZWVsIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bpc2NoZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYWFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrb3VkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJoZWV0XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzdG9ybWFjaHRpZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIldpbmRzdGlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJLYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWNodGUgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlphY2h0ZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTWF0aWdlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJWcmlqIGtyYWNodGlnZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLcmFjaHRpZ2Ugd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGFyZGUgd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3Rvcm1hY2h0aWdcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJad2FyZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiWmVlciB6d2FyZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3JrYWFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJmclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkZyZW5jaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIm9yYWdlIGV0IHBsdWllIGZpbmVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIm9yYWdlIGV0IHBsdWllXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJvcmFnZSBldCBmb3J0ZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJvcmFnZXMgbFxcdTAwZTlnZXJzXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJvcmFnZXNcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImdyb3Mgb3JhZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiT3JhZ2UgYXZlYyBsXFx1MDBlOWdcXHUwMGU4cmUgYnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JvcyBvcmFnZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiQnJ1aW5lIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiQnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJGb3J0ZXMgYnJ1aW5lc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1aWUgZmluZSBcXHUwMGU5cGFyc2VcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBsdWllIGZpbmVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIkNyYWNoaW4gaW50ZW5zZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiQXZlcnNlcyBkZSBicnVpbmVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxcXHUwMGU5Z1xcdTAwZThyZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbHVpZXMgbW9kXFx1MDBlOXJcXHUwMGU5ZXNcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIkZvcnRlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInRyXFx1MDBlOHMgZm9ydGVzIHByXFx1MDBlOWNpcGl0YXRpb25zXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJncm9zc2VzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGx1aWUgdmVyZ2xhXFx1MDBlN2FudGVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBldGl0ZXMgYXZlcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiYXZlcnNlcyBkZSBwbHVpZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiYXZlcnNlcyBpbnRlbnNlc1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibFxcdTAwZTlnXFx1MDBlOHJlcyBuZWlnZXNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZXMgY2h1dGVzIGRlIG5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJuZWlnZSBmb25kdWVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImF2ZXJzZXMgZGUgbmVpZ2VcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImJydW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJCcm91aWxsYXJkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJicnVtZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidGVtcFxcdTAwZWF0ZXMgZGUgc2FibGVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJyb3VpbGxhcmRcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImVuc29sZWlsbFxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInBldSBudWFnZXV4XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwYXJ0aWVsbGVtZW50IGVuc29sZWlsbFxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YWdldXhcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkNvdXZlcnRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZGVcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBcXHUwMGVhdGUgdHJvcGljYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvdXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcm9pZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2hhdWRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRldXhcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyXFx1MDBlYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQnJpc2UgbFxcdTAwZTlnXFx1MDBlOHJlXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzZSBkb3VjZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2UgbW9kXFx1MDBlOXJcXHUwMGU5ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2UgZnJhaWNoZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiQnJpc2UgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgZm9ydCwgcHJlc3F1ZSB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW50IHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbnQgdHJcXHUwMGU4cyB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wXFx1MDBlYXRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJlbXBcXHUwMGVhdGUgdmlvbGVudGVcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk91cmFnYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImJnXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQnVsZ2FyaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDNmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQ0ZlxcdTA0NDkgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MjNcXHUwNDNjXFx1MDQzNVxcdTA0NDBcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDFjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQxNFxcdTA0NGFcXHUwNDM2XFx1MDQzNCBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0NDJcXHUwNDQzXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDFlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQxZlxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQyMVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQxOFxcdTA0MzdcXHUwNDNkXFx1MDQzNVxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0MzJcXHUwNDMwXFx1MDQ0OSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDE0XFx1MDQzOFxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDFmXFx1MDQ0ZlxcdTA0NDFcXHUwNDRhXFx1MDQ0N1xcdTA0M2RcXHUwNDMwXFwvXFx1MDQxZlxcdTA0NDBcXHUwNDMwXFx1MDQ0OFxcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDJmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQ0MVxcdTA0MzVcXHUwNDRmXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDIyXFx1MDQ0YVxcdTA0M2NcXHUwNDNkXFx1MDQzOCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0MjJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcXC9cXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0MjJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDIxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XFx1MDQzNVxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDEzXFx1MDQzZVxcdTA0NDBcXHUwNDM1XFx1MDQ0OVxcdTA0M2UgXFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MTJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJzZVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlN3ZWRpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwMGU1c2thXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTAwZTVza2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9qXFx1MDBlNG1udCBvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJmdWxsdCBcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIm1qdWt0IGR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaFxcdTAwZTVydCBkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibWp1a3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaFxcdTAwZTVydCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibWp1a3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiTVxcdTAwZTV0dGxpZyByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm15Y2tldCBrcmFmdGlndCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwMGY2c3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInVuZGVya3lsdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtanVrdCBcXHUwMGY2c3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImR1c2NoLXJlZ25cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInJlZ25hciBzbVxcdTAwZTVzcGlrXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtanVrIHNuXFx1MDBmNlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25cXHUwMGY2XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJrcmFmdGlndCBzblxcdTAwZjZmYWxsXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzblxcdTAwZjZibGFuZGF0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuXFx1MDBmNm92XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZGltbWFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2dnXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJkaXNcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZGltbWlndFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhciBoaW1tZWxcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIm5cXHUwMGU1Z3JhIG1vbG5cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNwcmlkZGEgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibW9sbmlndFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDBmNnZlcnNrdWdnYW5kZSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlzayBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImthbGx0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJ2YXJtdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiYmxcXHUwMGU1c2lndFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiemhfdHdcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFRyYWRpdGlvbmFsXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHU1MWNkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1NWMwZlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTU5MjdcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHU5NmU4XFx1NTkzZVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2NjNcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHU4NTg0XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1NzE1OVxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHU2Yzk5XFx1NjVjYlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTU5MjdcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHU2Njc0XFx1ZmYwY1xcdTVjMTFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTk2NzBcXHVmZjBjXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTlmOGRcXHU2MzcyXFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzFiMVxcdTVlMzZcXHU5OGE4XFx1NjZiNFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1OThiNlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTUxYjdcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcxYjFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTU5MjdcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHU1MWIwXFx1OTZmOVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ0clwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlR1cmtpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiSGFmaWYgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiU2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDE1ZWlkZGV0bGkgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQXJhbFxcdTAxMzFrbFxcdTAxMzEgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBoYWZpZiB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiWWVyIHllciBoYWZpZiB5b1xcdTAxMWZ1bmx1a2x1IHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiWWVyIHllciBoYWZpZiB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiWWVyIHllciBzYVxcdTAxMWZhbmFrIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIkhhZmlmIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiT3J0YSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTAxNWVpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDBjN29rIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiQVxcdTAxNWZcXHUwMTMxclxcdTAxMzEgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJZYVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxIHZlIHNvXFx1MDExZnVrIGhhdmFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiSGFmaWYga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIkthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJZb1xcdTAxMWZ1biBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiS2FybGEga2FyXFx1MDEzMVxcdTAxNWZcXHUwMTMxayB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbFxcdTAwZmMga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJIYWZpZiBzaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiS3VtXFwvVG96IGZcXHUwMTMxcnRcXHUwMTMxbmFzXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkFcXHUwMGU3XFx1MDEzMWtcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkF6IGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYXogYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJLYXBhbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIkthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BpayBmXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIb3J0dW1cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTAwYzdvayBTb1xcdTAxMWZ1a1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDBjN29rIFNcXHUwMTMxY2FrXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiRG9sdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIkR1cmd1blwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiU2FraW5cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkhhZmlmIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJBeiBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiT3J0YSBTZXZpeWUgUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLdXZ2ZXRsaSBSXFx1MDBmY3pnYXJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlNlcnQgUlxcdTAwZmN6Z2FyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwMTVlaWRkZXRsaSBGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwMTVlaWRkZXRsaSBLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZWlkZGV0bGkgS2FzXFx1MDEzMXJnYVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiemhfY25cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFNpbXBsaWZpZWRcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1NGUyZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1NjZiNFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTUxYmJcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1NTkyN1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTM5XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1OTYzNVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MGRmXFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1ODU4NFxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTZjOTlcXHU2NWNiXFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTY2NzRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTY2NzRcXHVmZjBjXFx1NWMxMVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1OTYzNFxcdWZmMGNcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY5OVxcdTUzNzdcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHU3MGVkXFx1NWUyNlxcdTk4Y2VcXHU2NmI0XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHU5OGQzXFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1NzBlZFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1NTkyN1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImN6XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ3plY2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2xhYlxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiYm91XFx1MDE1OWthIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJcXHUwMTYxXFx1MDBlZCBib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2lsblxcdTAwZTEgYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJib3VcXHUwMTU5a292XFx1MDBlMSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiYm91XFx1MDE1OWthIHNlIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImJvdVxcdTAxNTlrYSBzIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibXJob2xlblxcdTAwZWQgcyBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwibXJob2xlblxcdTAwZWQgYSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwibXJob2xlblxcdTAwZWQgYSBzaWxuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwicHJ1ZGtcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBcXHUwMTU5XFx1MDBlZHZhbG92XFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwclxcdTAxNmZ0clxcdTAxN2UgbXJhXFx1MDEwZGVuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpub3VjXFx1MDBlZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtXFx1MDBlZHJuXFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJodXN0XFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJ6bXJ6bFxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic21cXHUwMGVkXFx1MDE2MWVuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcImRcXHUwMGU5XFx1MDE2MVxcdTAxNjUgc2Ugc25cXHUwMTFiaGVtXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbGFiXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzaWxuXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtbGhhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJrb3VcXHUwMTU5XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJvcGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwXFx1MDBlZHNlXFx1MDEwZG5cXHUwMGU5IFxcdTAxMGRpIHByYWNob3ZcXHUwMGU5IHZcXHUwMGVkcnlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImh1c3RcXHUwMGUxIG1saGFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInBcXHUwMGVkc2VrXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxbm9cIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInNvcGVcXHUwMTBkblxcdTAwZmQgcG9wZWxcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInBydWRrXFx1MDBlOSBib3VcXHUwMTU5ZVwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInNrb3JvIGphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInphdGFcXHUwMTdlZW5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBib3VcXHUwMTU5ZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9ya29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZcXHUwMTFidHJub1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRcXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJiZXp2XFx1MDExYnRcXHUwMTU5XFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwidlxcdTAwZTFuZWtcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcInZcXHUwMTFidFxcdTAxNTlcXHUwMGVka1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwibVxcdTAwZWRyblxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwZGVyc3R2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJzaWxuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJwcnVka1xcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiYm91XFx1MDE1OWxpdlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwidmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcInNpbG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJtb2h1dG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwia3JcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJLb3JlYVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRodW5kZXJzdG9ybSB3aXRoIHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2h0IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInJhZ2dlZCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibW9kZXJhdGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNub3dcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImhhemVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRcXC9kdXN0IHdoaXJsc1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZm9nXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJza3kgaXMgY2xlYXJcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJnbFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkdhbGljaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGludGVuc29cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIm9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwib3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwib3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaG9pdmEgZSBvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImNob2l2YSBlIG9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImNob2l2YSBlIG9yYmFsbG8gZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwib3JiYWxsbyBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiY2hvaXZhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImNob2l2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2hvaXZhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImNob2l2YSBtb2kgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImNob2l2YSBleHRyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaG9pdmEgeGVhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNob2l2YSBkZSBkdWNoYSBkZSBiYWl4YSBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2hvaXZhIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2YWRhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJhdWdhbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmV2ZSBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiblxcdTAwZTlib2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bWVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5cXHUwMGU5Ym9hIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInJlbXVpXFx1MDBmMW9zIGRlIGFyZWEgZSBwb2x2b1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJ1bWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNlbyBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwic2FyYWJpYVwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlZlbnRvIGZyb3V4b1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmVudG8gc3VhdmVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlZlbnRvIG1vZGVyYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiVmVudG8gZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnRvIGZvcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkZSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiRnVyYWNcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidmlcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJ2aWV0bmFtZXNlXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBNXFx1MDFiMGEgbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gY1xcdTAwZjMgY2hcXHUxZWRicCBnaVxcdTFlYWR0XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJCXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkJcXHUwMGUzbyB2XFx1MDBlMGkgblxcdTAxYTFpXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTAwZTFuaCBzXFx1MDBlMW5nIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtXFx1MDFiMGEgdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5biBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJtXFx1MDFiMGEgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDFiMGEgdlxcdTFlZWJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJtXFx1MDFiMGEgY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibVxcdTAxYjBhIHJcXHUxZWE1dCBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJtXFx1MDFiMGEgbFxcdTFlZDFjXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtXFx1MDFiMGEgbFxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG9cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwidHV5XFx1MWViZnQgclxcdTAxYTFpIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwidHV5XFx1MWViZnRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInR1eVxcdTFlYmZ0IG5cXHUxZWI3bmcgaFxcdTFlYTF0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJtXFx1MDFiMGEgXFx1MDExMVxcdTAwZTFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInR1eVxcdTFlYmZ0IG1cXHUwMGY5IHRyXFx1MWVkZGlcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUxZWRkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJraFxcdTAwZjNpIGJcXHUxZWU1aVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDExMVxcdTAwZTFtIG1cXHUwMGUyeVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiYlxcdTAwZTNvIGNcXHUwMGUxdCB2XFx1MDBlMCBsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwic1xcdTAxYjBcXHUwMWExbmcgbVxcdTAwZjlcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImJcXHUxZWE3dSB0clxcdTFlZGRpIHF1YW5nIFxcdTAxMTFcXHUwMGUzbmdcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIm1cXHUwMGUyeSB0aFxcdTAxYjBhXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJtXFx1MDBlMnkgclxcdTFlYTNpIHJcXHUwMGUxY1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibVxcdTAwZTJ5IGNcXHUxZWU1bVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibVxcdTAwZTJ5IFxcdTAxMTFlbiB1IFxcdTAwZTFtXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiY1xcdTAxYTFuIGJcXHUwMGUzbyBuaGlcXHUxZWM3dCBcXHUwMTExXFx1MWVkYmlcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImJcXHUwMGUzbyBsXFx1MWVkMWNcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImxcXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIm5cXHUwMGYzbmdcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImdpXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwibVxcdTAxYjBhIFxcdTAxMTFcXHUwMGUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJDaFxcdTFlYmYgXFx1MDExMVxcdTFlY2RcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIk5oXFx1MWViOSBuaFxcdTAwZTBuZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDBjMW5oIHNcXHUwMGUxbmcgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHXFx1MDBlZG8gdGhvXFx1MWVhM25nXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJHaVxcdTAwZjMgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJHaVxcdTAwZjMgdlxcdTFlZWJhIHBoXFx1MWVhM2lcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkdpXFx1MDBmMyBtXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJHaVxcdTAwZjMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiTFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiQlxcdTAwZTNvIGNcXHUxZWE1cCBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkJcXHUwMGUzbyBsXFx1MWVkMWNcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImFyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQXJhYmljXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyM1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA2MjdcXHUwNjQ0XFx1MDYzOVxcdTA2NDhcXHUwNjI3XFx1MDYzNVxcdTA2NDEgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyN1xcdTA2NDRcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmJcXHUwNjQyXFx1MDY0YVxcdTA2NDRcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDYzNFxcdTA2NDZcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MSBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MSBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDY0NVxcdTA2MmFcXHUwNjQ4XFx1MDYzM1xcdTA2MzcgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM5XFx1MDYyN1xcdTA2NDRcXHUwNjRhIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjI4XFx1MDYzMVxcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2NDdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDYzNVxcdTA2NDJcXHUwNjRhXFx1MDYzOVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNjM2XFx1MDYyOFxcdTA2MjdcXHUwNjI4XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNjJmXFx1MDYyZVxcdTA2MjdcXHUwNjQ2XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNjNhXFx1MDYyOFxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA2MzNcXHUwNjQ1XFx1MDYyN1xcdTA2MjEgXFx1MDYzNVxcdTA2MjdcXHUwNjQxXFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA2M2FcXHUwNjI3XFx1MDYyNlxcdTA2NDUgXFx1MDYyY1xcdTA2MzJcXHUwNjI2XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDVcXHUwNjJhXFx1MDY0MVxcdTA2MzFcXHUwNjQyXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDZcXHUwNjI3XFx1MDYyYlxcdTA2MzFcXHUwNjQ3XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDJcXHUwNjI3XFx1MDYyYVxcdTA2NDVcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYyN1xcdTA2MzNcXHUwNjJhXFx1MDY0OFxcdTA2MjdcXHUwNjI2XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA2MzJcXHUwNjQ4XFx1MDY0YVxcdTA2MzlcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNjI4XFx1MDYyN1xcdTA2MzFcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNjJkXFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA2MzFcXHUwNjRhXFx1MDYyN1xcdTA2MmRcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYyZlxcdTA2MjdcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcXHUwNjQ3XFx1MDYyN1xcdTA2MmZcXHUwNjI2XCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NFxcdTA2MzdcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQ1XFx1MDYzOVxcdTA2MmFcXHUwNjJmXFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjM5XFx1MDY0NFxcdTA2NGFcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDYzMVxcdTA2NGFcXHUwNjI3XFx1MDYyZCBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzlcXHUwNjQ2XFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwibWtcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJNYWNlZG9uaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzZlxcdTA0MzBcXHUwNDMyXFx1MDQzOFxcdTA0NDZcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MVxcdTA0M2NcXHUwNDNlXFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzNVxcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDM1XFx1MDQ0MVxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0NDBcXHUwNDQyXFx1MDQzYlxcdTA0M2VcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0N1xcdTA0MzhcXHUwNDQxXFx1MDQ0MlxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZFxcdTA0MzVcXHUwNDNhXFx1MDQzZVxcdTA0M2JcXHUwNDNhXFx1MDQ0MyBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0M2VcXHUwNDM0XFx1MDQzMlxcdTA0M2VcXHUwNDM1XFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDNmXFx1MDQzYlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXFx1MDQxN1xcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA0MWNcXHUwNDM4XFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDQyMVxcdTA0MzJcXHUwNDM1XFx1MDQzNiBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNDFkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNDExXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNrXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU2xvdmFrXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiYlxcdTAwZmFya2Egc28gc2xhYlxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiYlxcdTAwZmFya2EgcyBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImJcXHUwMGZhcmthIHNvIHNpbG5cXHUwMGZkbSBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIm1pZXJuYSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNpbG5cXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJwcnVka1xcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImJcXHUwMGZhcmthIHNvIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImJcXHUwMGZhcmthIHMgbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzaWxuXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJqZW1uXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1pZXJueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZVxcdTAxM2VtaSBzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW1ueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpuXFx1MDBmYWNpIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInNsYWJcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInNsYWJcXHUwMGU5IHNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwic2lsblxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImRcXHUwMGUxXFx1MDE3ZVxcdTAxMGYgc28gc25laG9tXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmVob3ZcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJobWxhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJkeW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInBpZXNrb3ZcXHUwMGU5XFwvcHJhXFx1MDE2MW5cXHUwMGU5IHZcXHUwMGVkcnlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImhtbGFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25cXHUwMGUxIG9ibG9oYVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwidGFrbWVyIGphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInphbXJhXFx1MDEwZGVuXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInppbWFcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvclxcdTAwZmFjb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmV0ZXJub1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRpZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiTmFzdGF2ZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQmV6dmV0cmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJTbGFiXFx1MDBmZCB2XFx1MDBlMW5va1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiSmVtblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJTdHJlZG5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwY2Vyc3R2XFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2lsblxcdTAwZmQgdmlldG9yLCB0YWttZXIgdlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuXFx1MDBlMSB2XFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiQlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIk5pXFx1MDEwZGl2XFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyaWtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaHVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJIdW5nYXJpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ2aWhhciBlbnloZSBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInZpaGFyIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidmloYXIgaGV2ZXMgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJlbnloZSB6aXZhdGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGV2ZXMgdmloYXJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImR1cnZhIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ2aWhhciBlbnloZSBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidmloYXIgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInZpaGFyIGVyXFx1MDE1MXMgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiZW55aGUgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJrXFx1MDBmNnplcGVzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGV2ZXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJuYWd5b24gaGV2ZXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW0gZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwMGYzbm9zIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJlbnloZSBoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJlclxcdTAxNTFzIGhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImhhdmFzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiaFxcdTAwZjN6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZ3llbmdlIGtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImhvbW9rdmloYXJcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidGlzenRhIFxcdTAwZTlnYm9sdFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwia2V2XFx1MDBlOXMgZmVsaFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInN6XFx1MDBmM3J2XFx1MDBlMW55b3MgZmVsaFxcdTAxNTF6ZXRcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImVyXFx1MDE1MXMgZmVsaFxcdTAxNTF6ZXRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImJvclxcdTAwZmFzIFxcdTAwZTlnYm9sdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJcXHUwMGYzcHVzaSB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImhcXHUwMTcxdlxcdTAwZjZzXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmb3JyXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwic3plbGVzXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJqXFx1MDBlOWdlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIk55dWdvZHRcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNzZW5kZXNcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkVueWhlIHN6ZWxsXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiRmlub20gc3plbGxcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJLXFx1MDBmNnplcGVzIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAwYzlsXFx1MDBlOW5rIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkVyXFx1MDE1MXMgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiRXJcXHUwMTUxcywgbVxcdTAwZTFyIHZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJFclxcdTAxNTFzZW4gdmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTelxcdTAwZTlsdmloYXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRvbWJvbFxcdTAwZjMgc3pcXHUwMGU5bHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiY2FcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDYXRhbGFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlRlbXBlc3RhIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJUZW1wZXN0YSBmb3J0YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiVGVtcGVzdGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlRlbXBlc3RhIGFtYiBtb2x0IHBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiUGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiUGx1Z2ltIGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiUGx1Z2ltIGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwiUGx1amFcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiUGx1amFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlBsdWphIG1vbHQgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiUGx1amEgZXh0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiUGx1amEgZ2xhXFx1MDBlN2FkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwiUGx1amEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZhZGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiTmV2YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiQWlndWFuZXVcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcIlBsdWphIGQnYWlndWFuZXVcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcIlBsdWdpbSBpIG5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiUGx1amEgaSBuZXVcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcIk5ldmFkYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJOZXZhZGFcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJCb2lyYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiRnVtXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJCb2lyaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTb3JyYVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiQm9pcmFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcIlNvcnJhXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJQb2xzXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJDZW5kcmEgdm9sY1xcdTAwZTBuaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJYXFx1MDBlMGZlY1wiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQ2VsIG5ldFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiTGxldWdlcmFtZW50IGVubnV2b2xhdFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiTlxcdTAwZmF2b2xzIGRpc3BlcnNvc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiTnV2b2xvc2l0YXQgdmFyaWFibGVcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkVubnV2b2xhdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVGVtcGVzdGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFjXFx1MDBlMFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiRnJlZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiQ2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlZlbnRcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlBlZHJhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1hdFwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQnJpc2Egc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJpc2EgYWdyYWRhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmlzYSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2EgZnJlc2NhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzY2EgZm9yYVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudCBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBzZXZlclwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTBcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImhyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ3JvYXRpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBzbGFib20ga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBqYWtvbSBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYmEgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImpha2EgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmthbnNrYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzYSBzbGFib20gcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm1samF2aW5za2Egb2x1amEgc2EgamFrb20gcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInJvc3VsamEgc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJyb3N1bGphXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJyb3N1bGphIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb20gc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwicGxqdXNrb3ZpIGkgcm9zdWxqYVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwicm9zdWxqYSBzIGpha2ltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJyb3N1bGphIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJhIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInVtamVyZW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImtpXFx1MDE2MWEgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZybG8gamFrYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJla3N0cmVtbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibGVkZW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBsanVzYWsgc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbGp1c2FrXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbGp1c2FrIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvbHVqbmEga2lcXHUwMTYxYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZ3VzdGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzdXNuamVcXHUwMTdlaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzdXNuamVcXHUwMTdlaWNhIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcInNsYWJhIGtpXFx1MDE2MWEgaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcImtpXFx1MDE2MWEgaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcInNuaWplZyBzIHBvdnJlbWVuaW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuaWplZyBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzbmlqZWcgcyBqYWtpbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtYWdsaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJkaW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIml6bWFnbGljYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwia292aXRsYWNpIHBpamVza2EgaWxpIHByYVxcdTAxNjFpbmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm1hZ2xhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwaWplc2FrXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJ2dWxrYW5za2kgcGVwZW9cIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInphcHVzaSB2amV0cmEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidmVkcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImJsYWdhIG5hb2JsYWthXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJyYVxcdTAxNjF0cmthbmkgb2JsYWNpXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJpc3ByZWtpZGFuaSBvYmxhY2lcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bza2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJobGFkbm9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInZydVxcdTAxMDdlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2amV0cm92aXRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJ0dVxcdTAxMGRhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImxhaG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJwb3ZqZXRhcmFjXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJzbGFiIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwidW1qZXJlbiB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcInVtamVyZW5vIGphayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcImphayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTAxN2Vlc3RvayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIm9sdWpuaSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcImphayBvbHVqbmkgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJvcmthbnNraSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcImphayBvcmthbnNraSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIm9ya2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJibGFua1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIwLjEwLjIwMTYuXHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgd2luZFNwZWVkID0ge1xyXG4gICAgXCJlblwiOntcclxuICAgICAgICBcIlNldHRpbmdzXCI6IHtcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4wLCAwLjNdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIwLTEgICBTbW9rZSByaXNlcyBzdHJhaWdodCB1cFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkNhbG1cIjoge1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFswLjMsIDEuNl0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjEtMyBPbmUgY2FuIHNlZSBkb3dud2luZCBvZiB0aGUgc21va2UgZHJpZnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJMaWdodCBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEuNiwgMy4zXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNC02IE9uZSBjYW4gZmVlbCB0aGUgd2luZC4gVGhlIGxlYXZlcyBvbiB0aGUgdHJlZXMgbW92ZSwgdGhlIHdpbmQgY2FuIGxpZnQgc21hbGwgc3RyZWFtZXJzLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkdlbnRsZSBCcmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMuNCwgNS41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNy0xMCBMZWF2ZXMgYW5kIHR3aWdzIG1vdmUuIFdpbmQgZXh0ZW5kcyBsaWdodCBmbGFnIGFuZCBwZW5uYW50c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIk1vZGVyYXRlIGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbNS41LCA4LjBdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxMS0xNiAgIFRoZSB3aW5kIHJhaXNlcyBkdXN0IGFuZCBsb29zZSBwYXBlcnMsIHRvdWNoZXMgb24gdGhlIHR3aWdzIGFuZCBzbWFsbCBicmFuY2hlcywgc3RyZXRjaGVzIGxhcmdlciBmbGFncyBhbmQgcGVubmFudHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJGcmVzaCBCcmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzguMCwgMTAuOF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjE3LTIxICAgU21hbGwgdHJlZXMgaW4gbGVhZiBiZWdpbiB0byBzd2F5LiBUaGUgd2F0ZXIgYmVnaW5zIGxpdHRsZSB3YXZlcyB0byBwZWFrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU3Ryb25nIGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTAuOCwgMTMuOV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjIyLTI3ICAgTGFyZ2UgYnJhbmNoZXMgYW5kIHNtYWxsZXIgdHJpYmVzIG1vdmVzLiBUaGUgd2hpeiBvZiB0ZWxlcGhvbmUgbGluZXMuIEl0IGlzIGRpZmZpY3VsdCB0byB1c2UgdGhlIHVtYnJlbGxhLiBBIHJlc2lzdGFuY2Ugd2hlbiBydW5uaW5nLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxMy45LCAxNy4yXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjgtMzMgICBXaG9sZSB0cmVlcyBpbiBtb3Rpb24uIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJHYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxNy4yLCAyMC43XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMzQtNDAgICBUaGUgd2luZCBicmVhayB0d2lncyBvZiB0cmVlcy4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlNldmVyZSBHYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyMC44LCAyNC41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDEtNDcgICBBbGwgbGFyZ2UgdHJlZXMgc3dheWluZyBhbmQgdGhyb3dzLiBUaWxlcyBjYW4gYmxvdyBkb3duLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlN0b3JtXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyNC41LCAyOC41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDgtNTUgICBSYXJlIGlubGFuZC4gVHJlZXMgdXByb290ZWQuIFNlcmlvdXMgZGFtYWdlIHRvIGhvdXNlcy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJWaW9sZW50IFN0b3JtXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyOC41LCAzMi43XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNTYtNjMgICBPY2N1cnMgcmFyZWx5IGFuZCBpcyBmb2xsb3dlZCBieSBkZXN0cnVjdGlvbi5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJIdXJyaWNhbmVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMyLjcsIDY0XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiT2NjdXJzIHZlcnkgcmFyZWx5LiBVbnVzdWFsbHkgc2V2ZXJlIGRhbWFnZS5cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxyXG4gKi9cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMTMuMTAuMjAxNi5cclxuICovXHJcbmltcG9ydCBDb29raWVzIGZyb20gJy4vQ29va2llcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3JXaWRnZXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9ICdodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bSc7XHJcbiAgICAgICAgdGhpcy5zY3JpcHREM1NSQyA9IGAke3RoaXMuYmFzZVVSTH0vanMvbGlicy9kMy5taW4uanNgO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0U1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanNgO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xzV2lkZ2V0ID0ge1xyXG4gICAgICAgICAgICAvLyDQn9C10YDQstCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXHJcbiAgICAgICAgICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LWxlZnQtbWVudV9faGVhZGVyJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX251bWJlcicpLFxyXG4gICAgICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19tZWFucycpLFxyXG4gICAgICAgICAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fd2luZCcpLFxyXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9faW1nJyksXHJcbiAgICAgICAgICAgIGNhbGVuZGFySXRlbTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhbGVuZGFyX19pdGVtJyksXHJcbiAgICAgICAgICAgIGdyYXBoaWM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljJyksXHJcbiAgICAgICAgICAgIC8vINCS0YLQvtGA0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAgICAgICAgY2l0eU5hbWUyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X190aXRsZScpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X190ZW1wZXJhdHVyZScpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZUZlZWxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fZmVlbHMnKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmVNaW46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0LWNhcmRfX3RlbXBlcmF0dXJlLW1pbicpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1heDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWF4JyksXHJcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fZGVzY3JpcHRpb24nKSxcclxuICAgICAgICAgICAgd2luZFNwZWVkMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3dpbmQtc3BlZWQnKSxcclxuICAgICAgICAgICAgbWFpbkljb25XZWF0aGVyMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2ljb24nKSxcclxuICAgICAgICAgICAgaHVtaWRpdHk6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19odW1pZGl0eScpLFxyXG4gICAgICAgICAgICBwcmVzc3VyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3ByZXNzdXJlJyksXHJcbiAgICAgICAgICAgIGRhdGVSZXBvcnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXRfX2RhdGUnKSxcclxuICAgICAgICAgICAgYXBpS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpLFxyXG4gICAgICAgICAgICBlcnJvcktleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yLWtleScpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdGlhbE1ldHJpY1RlbXBlcmF0dXJlKCk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uQVBJa2V5KCk7XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcblxyXG4gICAgICAgIC8vINC+0LHRitC10LrRgi3QutCw0YDRgtCwINC00LvRjyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjRjyDQstGB0LXRhSDQstC40LTQttC10YLQvtCyINGBINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsFxyXG4gICAgICAgIHRoaXMubWFwV2lkZ2V0cyA9IHtcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg2KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDcpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA4LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTUsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTgsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDI0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMxLXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y8g0LIg0LLQuNC00LbQtdGC0LDRhVxyXG4gICAgICogKi9cclxuICAgIGluaXRpYWxNZXRyaWNUZW1wZXJhdHVyZSgpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0VW5pdHMgPSBmdW5jdGlvbihjaGVja2JveCwgY29va2llKXtcclxuICAgICAgICAgICAgdmFyIHVuaXRzID0gJ21ldHJpYyc7XHJcbiAgICAgICAgICAgIGlmKGNoZWNrYm94LmNoZWNrZWQgPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdW5pdHMgPSAnaW1wZXJpYWwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvb2tpZS5zZXRDb29raWUoJ3VuaXRzJywgdW5pdHMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFVuaXRzID0gZnVuY3Rpb24odW5pdHMpe1xyXG4gICAgICAgICAgICBzd2l0Y2godW5pdHMpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbWV0cmljJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3VuaXRzLCAnwrBDJ107XHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbXBlcmlhbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt1bml0cywgJ8KwRiddO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBbJ21ldHJpYycsICfCsEMnXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgY29va2llID0gbmV3IENvb2tpZXMoKTtcclxuICAgICAgICAvL9Ce0L/RgNC10LTQtdC70LXQvdC40LUg0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRj1xyXG4gICAgICAgIHZhciB1bml0c0NoZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1bml0c19jaGVja1wiKTtcclxuXHJcbiAgICAgICAgdW5pdHNDaGVjay5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgc2V0VW5pdHModW5pdHNDaGVjaywgY29va2llKTtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdW5pdHMgPSBcIm1ldHJpY1wiO1xyXG4gICAgICAgIHZhciB0ZXh0X3VuaXRfdGVtcCA9IG51bGw7XHJcbiAgICAgICAgaWYoY29va2llLmdldENvb2tpZSgndW5pdHMnKSl7XHJcbiAgICAgICAgICAgIHRoaXMudW5pdHNUZW1wID0gZ2V0VW5pdHMoY29va2llLmdldENvb2tpZSgndW5pdHMnKSkgfHwgWydtZXRyaWMnLCAnwrBDJ107XHJcbiAgICAgICAgICAgIFt1bml0cywgdGV4dF91bml0X3RlbXBdID0gdGhpcy51bml0c1RlbXA7XHJcbiAgICAgICAgICAgIGlmKHVuaXRzID09IFwibWV0cmljXCIpXHJcbiAgICAgICAgICAgICAgICB1bml0c0NoZWNrLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB1bml0c0NoZWNrLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdW5pdHNDaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2V0VW5pdHModW5pdHNDaGVjaywgY29va2llKTtcclxuICAgICAgICAgICAgdGhpcy51bml0c1RlbXAgPSBnZXRVbml0cyh1bml0cyk7XHJcbiAgICAgICAgICAgIFt1bml0cywgdGV4dF91bml0X3RlbXBdID0gdGhpcy51bml0c1RlbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0KHQstC+0LnRgdGC0LLQviDRg9GB0YLQsNC90L7QstC60Lgg0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRjyDQtNC70Y8g0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICogQHBhcmFtIHVuaXRzXHJcbiAgICAgKi9cclxuICAgIHNldCB1bml0c1RlbXAodW5pdHMpIHtcclxuICAgICAgICB0aGlzLnVuaXRzID0gdW5pdHM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCh0LLQvtC50YHRgtCy0L4g0L/QvtC70YPRh9C10L3QuNGPINC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y8g0LTQu9GPINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBnZXQgdW5pdHNUZW1wKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuaXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRpb25BUElrZXkoKSB7XHJcbiAgICAgICAgbGV0IHZhbGlkYXRpb25BUEkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgdXJsID0gYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPTUyNDkwMSZ1bml0cz0ke3RoaXMudW5pdHNUZW1wWzBdfSZjbnQ9OCZhcHBpZD0ke3RoaXMuY29udHJvbHNXaWRnZXQuYXBpS2V5LnZhbHVlfWA7XHJcbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gYWNjZXB0JztcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gZXJyb3InO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQstCw0LvQuNC00LDRhtC40LggJHtlfWApO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBlcnJvcic7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1nb29kJyk7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCA9IHZhbGlkYXRpb25BUEkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzV2lkZ2V0LmFwaUtleS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kKTtcclxuICAgICAgICAvL3RoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoaWQpIHsgICAgICAgIFxyXG4gICAgICAgIGlmKGlkICYmICh0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWQgfHwgdGhpcy5wYXJhbXNXaWRnZXQuY2l0eU5hbWUpICYmIHRoaXMucGFyYW1zV2lkZ2V0LmFwcGlkKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlID0gJyc7XHJcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGlkKSA9PT0gMSB8fCBwYXJzZUludChpZCkgPT09IDExIHx8IHBhcnNlSW50KGlkKSA9PT0gMjEgfHwgcGFyc2VJbnQoaWQpID09PSAzMSkge1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IGA8c2NyaXB0IHNyYz0naHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvZDMubWluLmpzJz48L3NjcmlwdD5gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtjb2RlfTxkaXYgaWQ9J29wZW53ZWF0aGVybWFwLXdpZGdldCc+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPSd0ZXh0L2phdmFzY3JpcHQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJHtpZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHlpZDogJHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBpZDogJyR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWQucmVwbGFjZShgMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjdgLCcnKX0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9ICdodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJbml0aWFsU3RhdGVGb3JtKGNpdHlJZD0yMDIyNTcyLCBjaXR5TmFtZT0nTW9zY293Jykge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtc1dpZGdldCA9IHtcclxuICAgICAgICAgICAgY2l0eUlkOiBjaXR5SWQsXHJcbiAgICAgICAgICAgIGNpdHlOYW1lOiBjaXR5TmFtZSxcclxuICAgICAgICAgICAgbGFuZzogJ2VuJyxcclxuICAgICAgICAgICAgYXBwaWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykudmFsdWUgfHwgICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgICAgICAgIHVuaXRzOiB0aGlzLnVuaXRzVGVtcFswXSxcclxuICAgICAgICAgICAgdGV4dFVuaXRUZW1wOiB0aGlzLnVuaXRzVGVtcFsxXSwgIC8vIDI0OFxyXG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmJhc2VVUkwsXHJcbiAgICAgICAgICAgIHVybERvbWFpbjogJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnJyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDQoNCw0LHQvtGC0LAg0YEg0YTQvtGA0LzQvtC5INC00LvRjyDQuNC90LjRhtC40LDQu9C4XHJcbiAgICAgICAgdGhpcy5jaXR5TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LW5hbWUnKTtcclxuICAgICAgICB0aGlzLmNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXRpZXMnKTtcclxuICAgICAgICB0aGlzLnNlYXJjaENpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNpdHknKTtcclxuXHJcbiAgICAgICAgdGhpcy51cmxzID0ge1xyXG4gICAgICAgIHVybFdlYXRoZXJBUEk6IGAke3RoaXMucGFyYW1zV2lkZ2V0LnVybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlcj9pZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0mdW5pdHM9JHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30mYXBwaWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dGhpcy5wYXJhbXNXaWRnZXQudXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseT9pZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0mdW5pdHM9JHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30mY250PTgmYXBwaWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICAgIHdpbmRTcGVlZDogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uYCxcclxuICAgICAgICB3aW5kRGlyZWN0aW9uOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvd2luZC1kaXJlY3Rpb24tZGF0YS5qc29uYCxcclxuICAgICAgICBjbG91ZHM6IGAke3RoaXMuYmFzZVVSTH0vZGF0YS9jbG91ZHMtZGF0YS5qc29uYCxcclxuICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25gLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcblxyXG4vKipcclxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xyXG4gQGNsYXNzIEdyYXBoaWNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC00LvRjyDRgNCw0YHRh9C10YLQsCDQvtGC0YDQuNGB0L7QstC60Lgg0L7RgdC90L7QstC90L7QuSDQu9C40L3QuNC4INC/0LDRgNCw0LzQtdGC0YDQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAqIFtsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxyXG4gICAgLngoKGQpID0+IHtcclxuICAgICAgcmV0dXJuIGQueDtcclxuICAgIH0pXHJcbiAgICAueSgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC55O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINCyINC80LDRgdGB0LjQsiDQtNC70Y8g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPINCz0YDQsNGE0LjQutCwXHJcbiAgICAgKiBAcGFyYW0gIHtbYm9vbGVhbl19IHRlbXBlcmF0dXJlIFvQv9GA0LjQt9C90LDQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAgICAqL1xyXG4gIHByZXBhcmVEYXRhKCkge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IFtdO1xyXG5cclxuICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICByYXdEYXRhLnB1c2goeyB4OiBpLCBkYXRlOiBpLCBtYXhUOiBlbGVtLm1heCwgbWluVDogZWxlbS5taW4gfSk7XHJcbiAgICAgIGkgKz0gMTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmF3RGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0LXQvCDQuNC30L7QsdGA0LDQttC10L3QuNC1INGBINC60L7QvdGC0LXQutGB0YLQvtC8INC+0LHRitC10LrRgtCwIHN2Z1xyXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX1cclxuICAgICAqL1xyXG4gIG1ha2VTVkcoKSB7XHJcbiAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzJylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5wYXJhbXMud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnBhcmFtcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnI2ZmZmZmZicpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC80LjQvdC40LzQsNC70LvRjNC90L7Qs9C+INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L/QviDQv9Cw0YDQsNC80LXRgtGA0YMg0LTQsNGC0YtcclxuICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICogQHJldHVybiB7W29iamVjdF19IGRhdGEgW9C+0LHRitC10LrRgiDRgSDQvNC40L3QuNC80LDQu9GM0L3Ri9C8INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQvCDQt9C90LDRh9C10L3QuNC10LxdXHJcbiAgKi9cclxuICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpIHtcclxuICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWF4RGF0ZTogMCxcclxuICAgICAgbWluRGF0ZTogMTAwMDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkge1xyXG4gICAgICAgIGRhdGEubWF4RGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW5EYXRlID49IGVsZW0uZGF0ZSkge1xyXG4gICAgICAgIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG5cclxuICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKSB7XHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtaW46IDEwMCxcclxuICAgICAgbWF4OiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ubWluVCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1heCA8PSBlbGVtLm1heFQpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMCxcclxuICAgICAgbWF4OiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0uaHVtaWRpdHkpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LTQu9C40L3RgyDQvtGB0LXQuSBYLFlcclxuICAqIFttYWtlQXhlc1hZIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0JzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHJldHVybiB7W2Z1bmN0aW9uXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcykge1xyXG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWD0g0YjQuNGA0LjQvdCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdC70LXQstCwINC4INGB0L/RgNCw0LLQsFxyXG4gICAgY29uc3QgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAoMiAqIHBhcmFtcy5tYXJnaW4pO1xyXG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcclxuICAgIGNvbnN0IHlBeGlzTGVuZ3RoID0gcGFyYW1zLmhlaWdodCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXHJcbiAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgKi9cclxuICBzY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG1heERhdGUsIG1pbkRhdGUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgICogW3NjYWxlVGltZSBkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAqIFtzY2FsZUxpbmVhciBkZXNjcmlwdGlvbl1cclxuICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAqL1xyXG4gICAgY29uc3Qgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxyXG4gICAgLmRvbWFpbihbbWF4ICsgNSwgbWluIC0gNV0pXHJcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IFtdO1xyXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgbWF4VDogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtaW5UOiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICBzY2FsZUF4ZXNYWVdlYXRoZXIocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBtYXJnaW4pIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXgsIG1pbl0pXHJcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcblxyXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgbWFyZ2luLFxyXG4gICAgICAgIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sXHJcbiAgICAgICAgcmFpbmZhbGxBbW91bnQ6IHNjYWxlWShlbGVtLnJhaW5mYWxsQW1vdW50KSArIG1hcmdpbixcclxuICAgICAgICBjb2xvcjogZWxlbS5jb2xvcixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4geyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9O1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxyXG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBtYWtlUG9seWxpbmUoZGF0YSwgcGFyYW1zLCBzY2FsZVgsIHNjYWxlWSkge1xyXG4gICAgY29uc3QgYXJyUG9seWxpbmUgPSBbXTtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIHk6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFkgfSxcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgZGF0YS5yZXZlcnNlKCkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIHk6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFksXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgeDogc2NhbGVYKGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLm1heFQpICsgcGFyYW1zLm9mZnNldFksXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gYXJyUG9seWxpbmU7XHJcbiAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L/QvtC70LjQu9C40L3QuNC5INGBINC30LDQu9C40LLQutC+0Lkg0L7RgdC90L7QstC90L7QuSDQuCDQuNC80LjRgtCw0YbQuNGPINC10LUg0YLQtdC90LhcclxuICAgICAqIFtkcmF3UG9sdWxpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBkcmF3UG9seWxpbmUoc3ZnLCBkYXRhKSB7XHJcbiAgICAgICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC4INGA0LjRgdGD0LXQvCDQu9C40L3QuNC4XHJcblxyXG4gICAgc3ZnLmFwcGVuZCgnZycpLmFwcGVuZCgncGF0aCcpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5wYXJhbXMuc3Ryb2tlV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LTQv9C40YHQtdC5INGBINC/0L7QutCw0LfQsNGC0LXQu9GP0LzQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC90LAg0L7RgdGP0YVcclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICovXHJcbiAgZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgcGFyYW1zKSB7XHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpID0+IHtcclxuICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINGC0LXQutGB0YLQsFxyXG4gICAgICBzdmcuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgLmF0dHIoJ3gnLCBlbGVtLngpXHJcbiAgICAgIC5hdHRyKCd5JywgKGVsZW0ubWF4VCAtIDIpIC0gKHBhcmFtcy5vZmZzZXRYIC8gMikpXHJcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxyXG4gICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgLnN0eWxlKCdzdHJva2UnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAudGV4dChgJHtwYXJhbXMuZGF0YVtpdGVtXS5tYXh9wrBgKTtcclxuXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5taW5UICsgNykgKyAocGFyYW1zLm9mZnNldFkgLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1pbn3CsGApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQtNC40YHQv9C10YLRh9C10YAg0L/RgNC+0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YHQviDQstGB0LXQvNC4INGN0LvQtdC80LXQvdGC0LDQvNC4XHJcbiAgICAgKiBbcmVuZGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBzdmcgPSB0aGlzLm1ha2VTVkcoKTtcclxuICAgIGNvbnN0IHJhd0RhdGEgPSB0aGlzLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgY29uc3QgeyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9ID0gdGhpcy5tYWtlQXhlc1hZKHJhd0RhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5tYWtlUG9seWxpbmUocmF3RGF0YSwgdGhpcy5wYXJhbXMsIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xyXG4gICAgdGhpcy5kcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgLy8gdGhpcy5kcmF3TWFya2VycyhzdmcsIHBvbHlsaW5lLCB0aGlzLm1hcmdpbik7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJccmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcciAgICB2YXIgZ2VuZXJhdG9yID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJtLWxhbmRpbmctd2lkZ2V0Jyk7XHIgICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAnKTtcciAgICBjb25zdCBwb3B1cFNoYWRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1zaGFkb3cnKTtcciAgICBjb25zdCBwb3B1cENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNsb3NlJyk7XHIgICAgY29uc3QgY29udGVudEpTR2VuZXJhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jb2RlLWdlbmVyYXRlJyk7XHIgICAgY29uc3QgY29weUNvbnRlbnRKU0NvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29weS1qcy1jb2RlJyk7XHIgICAgY29uc3QgYXBpS2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKTtcclxyICAgIC8vINCk0LjQutGB0LjRgNGD0LXQvCDQutC70LjQutC4INC90LAg0YTQvtGA0LzQtSwg0Lgg0L7RgtC60YDRi9Cy0LDQtdC8IHBvcHVwINC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRg1xyICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyICAgICAgICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcciAgICAgICAgaWYoZWxlbWVudC5pZCAmJiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29udGFpbmVyLWN1c3RvbS1jYXJkX19idG4nKSkge1xyICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHIgICAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKHdpbmRvdy5jaXR5SWQsIHdpbmRvdy5jaXR5TmFtZSk7ICAgICAgICAgXHIgICAgICAgICAgICBcciAgICAgICAgICAgIFxyICAgICAgICAgICAgY29udGVudEpTR2VuZXJhdGlvbi52YWx1ZSA9IGdlbmVyYXRlV2lkZ2V0LmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldChnZW5lcmF0ZVdpZGdldC5tYXBXaWRnZXRzW2VsZW1lbnQuaWRdWydpZCddKTtcciAgICAgICAgICAgIGlmKCFwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS12aXNpYmxlJykpIHtcciAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHIgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLXZpc2libGUnKTtcciAgICAgICAgICAgICAgICBwb3B1cFNoYWRvdy5jbGFzc0xpc3QuYWRkKCdwb3B1cC1zaGFkb3ctLXZpc2libGUnKVxyICAgICAgICAgICAgICAgIHN3aXRjaChnZW5lcmF0b3IubWFwV2lkZ2V0c1tldmVudC50YXJnZXQuaWRdWydzY2hlbWEnXSkge1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdibHVlJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1ibHVlJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC0tYmx1ZScpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHIgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Jyb3duJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1icm93bicpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJyb3duJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1ibHVlJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYmx1ZScpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHIgICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vbmUnOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgIFxyICAgICAgICB9XHIgICAgfSk7XHJcciAgICB2YXIgZXZlbnRQb3B1cENsb3NlID0gZnVuY3Rpb24oZXZlbnQpe1xyICAgICAgdmFyIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHIgICAgICBpZigoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cENsb3NlJykgfHwgZWxlbWVudCA9PT0gcG9wdXApXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY29udGFpbmVyLWN1c3RvbS1jYXJkX19idG4nKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX190aXRsZScpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2l0ZW1zJylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9fbGF5b3V0JylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9fYnRuJykpIHtcciAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLXZpc2libGUnKTtcciAgICAgICAgcG9wdXBTaGFkb3cuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtc2hhZG93LS12aXNpYmxlJyk7XHIgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XHIgICAgICB9XHIgICAgfTtcclxyICAgIGV2ZW50UG9wdXBDbG9zZSA9IGV2ZW50UG9wdXBDbG9zZS5iaW5kKHRoaXMpO1xyICAgIC8vINCX0LDQutGA0YvQstCw0LXQvCDQvtC60L3QviDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCDQutGA0LXRgdGC0LjQulxyICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnRQb3B1cENsb3NlKTtcclxyXHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcciAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgLy92YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyICAgICAgICAvL3JhbmdlLnNlbGVjdE5vZGUoY29udGVudEpTR2VuZXJhdGlvbik7XHIgICAgICAgIC8vd2luZG93LmdldFNlbGVjdGlvbigpLmFkZFJhbmdlKHJhbmdlKTtcciAgICAgICAgY29udGVudEpTR2VuZXJhdGlvbi5zZWxlY3QoKTtcclxyICAgICAgICB0cnl7XHIgICAgICAgICAgICBjb25zdCB0eHRDb3B5ID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcciAgICAgICAgICAgIHZhciBtc2cgPSB0eHRDb3B5ID8gJ3N1Y2Nlc3NmdWwnIDogJ3Vuc3VjY2Vzc2Z1bCc7XHIgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29weSBlbWFpbCBjb21tYW5kIHdhcyAnICsgbXNnKTtcciAgICAgICAgfVxyICAgICAgICBjYXRjaChlKXtcciAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQntGI0LjQsdC60LAg0LrQvtC/0LjRgNC+0LLQsNC90LjRjyAke2UuZXJyTG9nVG9Db25zb2xlfWApO1xyICAgICAgICB9XHJcciAgICAgICAgLy8g0KHQvdGP0YLQuNC1INCy0YvQtNC10LvQtdC90LjRjyAtINCS0J3QmNCc0JDQndCY0JU6INCy0Ysg0LTQvtC70LbQvdGLINC40YHQv9C+0LvRjNC30L7QstCw0YLRjFxyICAgICAgICAvLyByZW1vdmVSYW5nZShyYW5nZSkg0LrQvtCz0LTQsCDRjdGC0L4g0LLQvtC30LzQvtC20L3QvlxyICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHIgICAgfSk7XHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5kaXNhYmxlZCA9ICFkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQoJ2NvcHknKTtccn0pO1xyXHIiLCIvLyDQnNC+0LTRg9C70Ywg0LTQuNGB0L/QtdGC0YfQtdGAINC00LvRjyDQvtGC0YDQuNGB0L7QstC60Lgg0LHQsNC90L3QtdGA0YDQvtCyINC90LAg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1XHJcbmltcG9ydCBDaXRpZXMgZnJvbSAnLi9jaXRpZXMnO1xyXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cclxuICAgIC8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcclxuICAgIGNvbnN0IGNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xyXG4gICAgY29uc3QgY2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdGllcycpO1xyXG4gICAgY29uc3Qgc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG5cclxuICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICBvYmpDaXRpZXMuZ2V0Q2l0aWVzKCk7XHJcblxyXG4gICAgICBzZWFyY2hDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICBjb25zdCBvYmpDaXRpZXMgPSBuZXcgQ2l0aWVzKGNpdHlOYW1lLCBjaXRpZXMpO1xyXG4gICAgICBvYmpDaXRpZXMuZ2V0Q2l0aWVzKCk7XHJcblxyXG4gICAgfSk7XHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblxyXG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKS5Qcm9taXNlO1xyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcclxuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xyXG5pbXBvcnQgKiBhcyBuYXR1cmFsUGhlbm9tZW5vbiAgZnJvbSAnLi9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhJztcclxuaW1wb3J0ICogYXMgd2luZFNwZWVkIGZyb20gJy4vZGF0YS93aW5kLXNwZWVkLWRhdGEnO1xyXG5pbXBvcnQgKiBhcyB3aW5kRGlyZWN0aW9uIGZyb20gJy4vZGF0YS93aW5kLXNwZWVkLWRhdGEnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGUge1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XHJcbiAgICB0aGlzLnVybHMgPSB1cmxzO1xyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCINC/0YPRgdGC0YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XHJcbiAgICB0aGlzLndlYXRoZXIgPSB7XHJcbiAgICAgIGZyb21BUEk6IHtcclxuICAgICAgICBjb29yZDoge1xyXG4gICAgICAgICAgbG9uOiAnMCcsXHJcbiAgICAgICAgICBsYXQ6ICcwJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdlYXRoZXI6IFt7XHJcbiAgICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgICAgbWFpbjogJyAnLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcgJyxcclxuICAgICAgICAgIGljb246ICcgJyxcclxuICAgICAgICB9XSxcclxuICAgICAgICBiYXNlOiAnICcsXHJcbiAgICAgICAgbWFpbjoge1xyXG4gICAgICAgICAgdGVtcDogMCxcclxuICAgICAgICAgIHByZXNzdXJlOiAnICcsXHJcbiAgICAgICAgICBodW1pZGl0eTogJyAnLFxyXG4gICAgICAgICAgdGVtcF9taW46ICcgJyxcclxuICAgICAgICAgIHRlbXBfbWF4OiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3aW5kOiB7XHJcbiAgICAgICAgICBzcGVlZDogMCxcclxuICAgICAgICAgIGRlZzogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmFpbjoge30sXHJcbiAgICAgICAgY2xvdWRzOiB7XHJcbiAgICAgICAgICBhbGw6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGR0OiAnJyxcclxuICAgICAgICBzeXM6IHtcclxuICAgICAgICAgIHR5cGU6ICcgJyxcclxuICAgICAgICAgIGlkOiAnICcsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnICcsXHJcbiAgICAgICAgICBjb3VudHJ5OiAnICcsXHJcbiAgICAgICAgICBzdW5yaXNlOiAnICcsXHJcbiAgICAgICAgICBzdW5zZXQ6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlkOiAnICcsXHJcbiAgICAgICAgbmFtZTogJ1VuZGVmaW5lZCcsXHJcbiAgICAgICAgY29kOiAnICcsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXHJcbiAgICogQHBhcmFtIHVybFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAqL1xyXG4gIGh0dHBHZXQodXJsKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKG51bGwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xyXG4gICAqL1xyXG4gIGdldFdlYXRoZXJGcm9tQXBpKCkge1xyXG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy51cmxXZWF0aGVyQVBJKVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZnJvbUFQSSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbiA9IG5hdHVyYWxQaGVub21lbm9uLm5hdHVyYWxQaGVub21lbm9uW3RoaXMucGFyYW1zLmxhbmddLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci53aW5kU3BlZWQgPSB3aW5kU3BlZWQud2luZFNwZWVkW3RoaXMucGFyYW1zLmxhbmddO1xyXG4gICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDRgdC10LvQtdC60YLQvtGAINC/0L4g0LfQvdCw0YfQtdC90LjRjiDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LIgSlNPTlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBKU09OXHJcbiAgICogQHBhcmFtIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVsZW1lbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsCzQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAqIEByZXR1cm4ge3N0cmluZ30g0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICovXHJcbiAgZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KG9iamVjdCwgZWxlbWVudCwgZWxlbWVudE5hbWUsIGVsZW1lbnROYW1lMikge1xyXG4gICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcclxuICAgICAgaWYgKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09ICdvYmplY3QnICYmIGVsZW1lbnROYW1lMiA9PSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzBdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMV0pIHtcclxuICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YHQviDQt9C90LDRh9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudE5hbWUyICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pIHtcclxuICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiBKU09OINGBINC80LXRgtC10L7QtNCw0L3Ri9C80LhcclxuICAgKiBAcGFyYW0ganNvbkRhdGFcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBwYXJzZURhdGFGcm9tU2VydmVyKCkge1xyXG4gICAgY29uc3Qgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICBpZiAod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09ICdVbmRlZmluZWQnIHx8IHdlYXRoZXIuZnJvbUFQSS5jb2QgPT09ICc0MDQnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCfQlNCw0L3QvdGL0LUg0L7RgiDRgdC10YDQstC10YDQsCDQvdC1INC/0L7Qu9GD0YfQtdC90YsnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXHJcbiAgICBjb25zdCBtZXRhZGF0YSA9IHtcclxuICAgICAgY2xvdWRpbmVzczogJyAnLFxyXG4gICAgICBkdDogJyAnLFxyXG4gICAgICBjaXR5TmFtZTogJyAnLFxyXG4gICAgICBpY29uOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlTWluOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlTUF4OiAnICcsXHJcbiAgICAgIHByZXNzdXJlOiAnICcsXHJcbiAgICAgIGh1bWlkaXR5OiAnICcsXHJcbiAgICAgIHN1bnJpc2U6ICcgJyxcclxuICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgIGNvb3JkOiAnICcsXHJcbiAgICAgIHdpbmQ6ICcgJyxcclxuICAgICAgd2VhdGhlcjogJyAnLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEuY2l0eU5hbWUgPSBgJHt3ZWF0aGVyLmZyb21BUEkubmFtZX0sICR7d2VhdGhlci5mcm9tQVBJLnN5cy5jb3VudHJ5fWA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IHRlbXBlcmF0dXJlOyAvLyBgJHt0ZW1wID4gMCA/IGArJHt0ZW1wfWAgOiB0ZW1wfWA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1pbiA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWluLnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1heCA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWF4LnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBpZiAod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbikge1xyXG4gICAgICBtZXRhZGF0YS53ZWF0aGVyID0gd2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vblt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pZF07XHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci53aW5kU3BlZWQpIHtcclxuICAgICAgbWV0YWRhdGEud2luZFNwZWVkID0gYFdpbmQ6ICR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci53aW5kU3BlZWQsIHdlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSksICdzcGVlZF9pbnRlcnZhbCcpfWA7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZDIgPSBgJHt3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpfSBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyLndpbmRTcGVlZCwgd2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKSwgJ3NwZWVkX2ludGVydmFsJykuc3Vic3RyKDAsMSl9YDtcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLndpbmREaXJlY3Rpb24pIHtcclxuICAgICAgbWV0YWRhdGEud2luZERpcmVjdGlvbiA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl0sIFwiZGVnX2ludGVydmFsXCIpfWBcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLmNsb3Vkcykge1xyXG4gICAgICBtZXRhZGF0YS5jbG91ZHMgPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyLmNsb3Vkcywgd2VhdGhlci5mcm9tQVBJLmNsb3Vkcy5hbGwsICdtaW4nLCAnbWF4Jyl9YDtcclxuICAgIH1cclxuXHJcbiAgICBtZXRhZGF0YS5odW1pZGl0eSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLmh1bWlkaXR5fSVgO1xyXG4gICAgbWV0YWRhdGEucHJlc3N1cmUgPSAgYCR7d2VhdGhlcltcImZyb21BUElcIl1bXCJtYWluXCJdW1wicHJlc3N1cmVcIl19IG1iYDtcclxuICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pY29ufWA7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyV2lkZ2V0KG1ldGFkYXRhKSB7XHJcbiAgICAvLyDQntC+0YLRgNC40YHQvtCy0LrQsCDQv9C10YDQstGL0YUg0YfQtdGC0YvRgNC10YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBtZXRhZGF0YS5jaXR5TmFtZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4gY2xhc3M9J3dlYXRoZXItbGVmdC1jYXJkX19kZWdyZWUnPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xyXG4gICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24pIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZCkge1xyXG4gICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINC/0Y/RgtC4INC/0L7RgdC70LXQtNC90LjRhSDQstC40LTQttC10YLQvtCyXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTJbZWxlbV0pIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZUZlZWxzLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVsc1tlbGVtXSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZUZlZWxzW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW5bZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXgpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXguaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4W2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndlYXRoZXIpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjJbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkMiAmJiBtZXRhZGF0YS53aW5kRGlyZWN0aW9uKSB7XHJcbiAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWQyW2VsZW1dLmlubmVyVGV4dCA9IGAke21ldGFkYXRhLndpbmRTcGVlZDJ9ICR7bWV0YWRhdGEud2luZERpcmVjdGlvbn1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS5odW1pZGl0eSkge1xyXG4gICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuaHVtaWRpdHkpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5odW1pZGl0eS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5odW1pZGl0eVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5odW1pZGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEucHJlc3N1cmUpIHtcclxuICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnByZXNzdXJlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMucHJlc3N1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMucHJlc3N1cmVbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEucHJlc3N1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDQn9GA0L7Qv9C40YHRi9Cy0LDQtdC8INGC0LXQutGD0YnRg9GOINC00LDRgtGDINCyINCy0LjQtNC20LXRgtGLXHJcbiAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydCkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5kYXRlUmVwb3J0Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5kYXRlUmVwb3J0W2VsZW1dLmlubmVyVGV4dCA9IHRoaXMuZ2V0VGltZURhdGVISE1NTW9udGhEYXkoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkpIHtcclxuICAgICAgdGhpcy5wcmVwYXJlRGF0YUZvckdyYXBoaWMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpIHtcclxuICAgIGNvbnN0IGFyciA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdCkge1xyXG4gICAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheU5hbWVPZldlZWtCeURheU51bWJlcih0aGlzLmdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCkpO1xyXG4gICAgICBhcnIucHVzaCh7XHJcbiAgICAgICAgbWluOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgIG1heDogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcclxuICAgICAgICBkYXk6IChlbGVtICE9IDApID8gZGF5IDogJ1RvZGF5JyxcclxuICAgICAgICBpY29uOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLndlYXRoZXJbMF0uaWNvbixcclxuICAgICAgICBkYXRlOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRyYXdHcmFwaGljRDMoYXJyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LfQstCw0L3QuNGPINC00L3QtdC5INC90LXQtNC10LvQuCDQuCDQuNC60L7QvdC+0Log0YEg0L/QvtCz0L7QtNC+0LlcclxuICAgKiBAcGFyYW0gZGF0YVxyXG4gICAqL1xyXG4gIHJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIGxldCBkYXRlO1xyXG4gICAgICBkYXRlID0gbmV3IERhdGUoZWxlbS5kYXRlLnJlcGxhY2UoLyhcXGQrKS4oXFxkKykuKFxcZCspLywgJyQzLSQyLSQxJykpO1xyXG4gICAgICAvLyDQtNC70Y8gZWRnZSDRgdGC0YDQvtC40Lwg0LTRgNGD0LPQvtC5INCw0LvQs9C+0YDQuNGC0Lwg0LTQsNGC0YtcclxuICAgICAgaWYgKGRhdGUudG9TdHJpbmcoKSA9PT0gJ0ludmFsaWQgRGF0ZScpIHtcclxuICAgICAgICB2YXIgcmVnID0gLyhcXGQpKy9pZztcclxuICAgICAgICB2YXIgZm91bmQgPSAoZWxlbS5kYXRlKS5tYXRjaChyZWcpO1xyXG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZShgJHtmb3VuZFsyXX0tJHtmb3VuZFsxXX0tJHtmb3VuZFswXX0gJHtmb3VuZFszXX06JHtmb3VuZFs0XSA/IGZvdW5kWzRdIDogJzAwJyB9OiR7Zm91bmRbNV0gPyBmb3VuZFs1XSA6ICcwMCd9YCk7XHJcbiAgICAgICAgaWYgKGRhdGUudG9TdHJpbmcoKSA9PT0gJ0ludmFsaWQgRGF0ZScpIHtcclxuICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShmb3VuZFsyXSxmb3VuZFsxXSAtIDEsZm91bmRbMF0sZm91bmRbM10sZm91bmRbNF0gPyBmb3VuZFs0XSA6ICcwMCcsIGZvdW5kWzVdID8gZm91bmRbNV0gOiAnMDAnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDE4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyAyOF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGJyPiR7ZGF0ZS5nZXREYXRlKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0VVJMTWFpbkljb24obmFtZUljb24sIGNvbG9yID0gZmFsc2UpIHtcclxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxyXG4gICAgY29uc3QgbWFwSWNvbnMgPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgaWYgKCFjb2xvcikge1xyXG4gICAgICAvL1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAxZCcsICcwMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA2ZCcsICcwNmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA5ZCcsICcwOWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEzZCcsICcxM2RidycpO1xyXG4gICAgICAvLyDQndC+0YfQvdGL0LVcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMm4nLCAnMDJkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNG4nLCAnMDRkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwN24nLCAnMDdkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMG4nLCAnMTBkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgIGlmIChtYXBJY29ucy5nZXQobmFtZUljb24pKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHt0aGlzLnBhcmFtcy5iYXNlVVJMfS9pbWcvd2lkZ2V0cy8ke25hbWVJY29ufS5wbmdgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGBINC/0L7QvNC+0YnRjNGOINCx0LjQsdC70LjQvtGC0LXQutC4IEQzXHJcbiAgICovXHJcbiAgZHJhd0dyYXBoaWNEMyhkYXRhKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKTtcclxuXHJcbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQutC+0L3RgtC10LnQvdC10YDQvtCyINC00LvRjyDQs9GA0LDRhNC40LrQvtCyICAgIFxyXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKTtcclxuICAgIGNvbnN0IHN2ZzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzEnKTtcclxuICAgIGNvbnN0IHN2ZzIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzInKTtcclxuICAgIGNvbnN0IHN2ZzMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzMnKTtcclxuXHJcbiAgICBpZihzdmcucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcclxuICAgICAgc3ZnLnJlbW92ZUNoaWxkKHN2Zy5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XHJcbiAgICB9XHJcbiAgICBpZihzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKSB7XHJcbiAgICAgIHN2ZzEucmVtb3ZlQ2hpbGQoc3ZnMS5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XHJcbiAgICB9XHJcbiAgICBpZihzdmcyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKXtcclxuICAgICAgc3ZnMi5yZW1vdmVDaGlsZChzdmcyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzMucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xyXG4gICAgICAgIHN2ZzMucmVtb3ZlQ2hpbGQoc3ZnMy5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBpZDogJyNncmFwaGljJyxcclxuICAgICAgZGF0YSxcclxuICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICB3aWR0aDogNDIwLFxyXG4gICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgY29sb3JQb2xpbHluZTogJyMzMzMnLFxyXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxyXG4gICAgICBmb250Q29sb3I6ICcjMzMzJyxcclxuICAgICAgc3Ryb2tlV2lkdGg6ICcxcHgnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgbGV0IG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcblxyXG4gICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMxJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNEREY3MzAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMyJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMzJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAqL1xyXG4gIGRyYXdHcmFwaGljKGFycikge1xyXG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGggPSA0NjU7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDYwMCwgMzAwKTtcclxuXHJcbiAgICBjb250ZXh0LmZvbnQgPSAnT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4JztcclxuXHJcbiAgICBsZXQgc3RlcCA9IDU1O1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3Qgem9vbSA9IDQ7XHJcbiAgICBjb25zdCBzdGVwWSA9IDY0O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0VXAgPSA1ODtcclxuICAgIGNvbnN0IHN0ZXBZVGV4dERvd24gPSA3NTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBzdGVwID0gNTU7XHJcbiAgICBpID0gMDtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgaSArPSAxO1xyXG4gICAgd2hpbGUgKGkgPCBhcnIubGVuZ3RoKSB7XHJcbiAgICAgIHN0ZXAgKz0gNTU7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzMzMyc7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvKiEgaHR0cDovL210aHMuYmUvZnJvbWNvZGVwb2ludCB2MC4yLjEgYnkgQG1hdGhpYXMgKi9cbmlmICghU3RyaW5nLmZyb21Db2RlUG9pbnQpIHtcblx0KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcblx0XHRcdC8vIElFIDggb25seSBzdXBwb3J0cyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBvbiBET00gZWxlbWVudHNcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHZhciBvYmplY3QgPSB7fTtcblx0XHRcdFx0dmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblx0XHRcdFx0dmFyIHJlc3VsdCA9ICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG9iamVjdCwgb2JqZWN0KSAmJiAkZGVmaW5lUHJvcGVydHk7XG5cdFx0XHR9IGNhdGNoKGVycm9yKSB7fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9KCkpO1xuXHRcdHZhciBzdHJpbmdGcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXHRcdHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cdFx0dmFyIGZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbihfKSB7XG5cdFx0XHR2YXIgTUFYX1NJWkUgPSAweDQwMDA7XG5cdFx0XHR2YXIgY29kZVVuaXRzID0gW107XG5cdFx0XHR2YXIgaGlnaFN1cnJvZ2F0ZTtcblx0XHRcdHZhciBsb3dTdXJyb2dhdGU7XG5cdFx0XHR2YXIgaW5kZXggPSAtMTtcblx0XHRcdHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdFx0aWYgKCFsZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xuXHRcdFx0d2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcblx0XHRcdFx0dmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IC8vIGBOYU5gLCBgK0luZmluaXR5YCwgb3IgYC1JbmZpbml0eWBcblx0XHRcdFx0XHRjb2RlUG9pbnQgPCAwIHx8IC8vIG5vdCBhIHZhbGlkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0XHRcdGNvZGVQb2ludCA+IDB4MTBGRkZGIHx8IC8vIG5vdCBhIHZhbGlkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0XHRcdGZsb29yKGNvZGVQb2ludCkgIT0gY29kZVBvaW50IC8vIG5vdCBhbiBpbnRlZ2VyXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHsgLy8gQk1QIGNvZGUgcG9pbnRcblx0XHRcdFx0XHRjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuXHRcdFx0XHR9IGVsc2UgeyAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuXHRcdFx0XHRcdC8vIGh0dHA6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXG5cdFx0XHRcdFx0Y29kZVBvaW50IC09IDB4MTAwMDA7XG5cdFx0XHRcdFx0aGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuXHRcdFx0XHRcdGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG5cdFx0XHRcdFx0Y29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaW5kZXggKyAxID09IGxlbmd0aCB8fCBjb2RlVW5pdHMubGVuZ3RoID4gTUFYX1NJWkUpIHtcblx0XHRcdFx0XHRyZXN1bHQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG5cdFx0XHRcdFx0Y29kZVVuaXRzLmxlbmd0aCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0XHRpZiAoZGVmaW5lUHJvcGVydHkpIHtcblx0XHRcdGRlZmluZVByb3BlcnR5KFN0cmluZywgJ2Zyb21Db2RlUG9pbnQnLCB7XG5cdFx0XHRcdCd2YWx1ZSc6IGZyb21Db2RlUG9pbnQsXG5cdFx0XHRcdCdjb25maWd1cmFibGUnOiB0cnVlLFxuXHRcdFx0XHQnd3JpdGFibGUnOiB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0U3RyaW5nLmZyb21Db2RlUG9pbnQgPSBmcm9tQ29kZVBvaW50O1xuXHRcdH1cblx0fSgpKTtcbn1cbiIsIi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zdGVmYW5wZW5uZXIvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgNC4wLjVcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIChnbG9iYWwuRVM2UHJvbWlzZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxudmFyIF9pc0FycmF5ID0gdW5kZWZpbmVkO1xuaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gIF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xufSBlbHNlIHtcbiAgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xufVxuXG52YXIgaXNBcnJheSA9IF9pc0FycmF5O1xuXG52YXIgbGVuID0gMDtcbnZhciB2ZXJ0eE5leHQgPSB1bmRlZmluZWQ7XG52YXIgY3VzdG9tU2NoZWR1bGVyRm4gPSB1bmRlZmluZWQ7XG5cbnZhciBhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gIGxlbiArPSAyO1xuICBpZiAobGVuID09PSAyKSB7XG4gICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIGlmIChjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgY3VzdG9tU2NoZWR1bGVyRm4oZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICBjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG59XG5cbmZ1bmN0aW9uIHNldEFzYXAoYXNhcEZuKSB7XG4gIGFzYXAgPSBhc2FwRm47XG59XG5cbnZhciBicm93c2VyV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG52YXIgYnJvd3Nlckdsb2JhbCA9IGJyb3dzZXJXaW5kb3cgfHwge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHt9KS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbi8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG52YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbn1cblxuLy8gdmVydHhcbmZ1bmN0aW9uIHVzZVZlcnR4VGltZXIoKSB7XG4gIGlmICh0eXBlb2YgdmVydHhOZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2ZXJ0eE5leHQoZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIG5vZGUuZGF0YSA9IGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyO1xuICB9O1xufVxuXG4vLyB3ZWIgd29ya2VyXG5mdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gZXM2LXByb21pc2Ugd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgZ2xvYmFsU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdsb2JhbFNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgIHZhciBhcmcgPSBxdWV1ZVtpICsgMV07XG5cbiAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gYXR0ZW1wdFZlcnR4KCkge1xuICB0cnkge1xuICAgIHZhciByID0gcmVxdWlyZTtcbiAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB1bmRlZmluZWQ7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgaWYgKF9zdGF0ZSkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBfYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2VDYWxsYmFjayhfc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG52YXIgUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxudmFyIEdFVF9USEVOX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW4ocHJvbWlzZSkge1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gR0VUX1RIRU5fRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKSB7XG4gIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmIHRoZW4kJCA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUpIHtcbiAgICBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhlbiQkID09PSBHRVRfVEhFTl9FUlJPUikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgfSBlbHNlIGlmICh0aGVuJCQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkKSkge1xuICAgICAgaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgZ2V0VGhlbih2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgfVxuXG4gIHB1Ymxpc2gocHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEO1xuXG4gIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHByb21pc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHVuZGVmaW5lZCxcbiAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gRXJyb3JPYmplY3QoKSB7XG4gIHRoaXMuZXJyb3IgPSBudWxsO1xufVxuXG52YXIgVFJZX0NBVENIX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgcmV0dXJuIFRSWV9DQVRDSF9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2NlZWRlZCA9IHVuZGVmaW5lZCxcbiAgICAgIGZhaWxlZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICB2YWx1ZSA9IHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAvLyBub29wXG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gRlVMRklMTEVEKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBlKTtcbiAgfVxufVxuXG52YXIgaWQgPSAwO1xuZnVuY3Rpb24gbmV4dElkKCkge1xuICByZXR1cm4gaWQrKztcbn1cblxuZnVuY3Rpb24gbWFrZVByb21pc2UocHJvbWlzZSkge1xuICBwcm9taXNlW1BST01JU0VfSURdID0gaWQrKztcbiAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICBtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBfcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gIHZhciBfaW5wdXQgPSB0aGlzLl9pbnB1dDtcblxuICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fZWFjaEVudHJ5KF9pbnB1dFtpXSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICB2YXIgcmVzb2x2ZSQkID0gYy5yZXNvbHZlO1xuXG4gIGlmIChyZXNvbHZlJCQgPT09IHJlc29sdmUpIHtcbiAgICB2YXIgX3RoZW4gPSBnZXRUaGVuKGVudHJ5KTtcblxuICAgIGlmIChfdGhlbiA9PT0gdGhlbiAmJiBlbnRyeS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIF90aGVuKTtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUkJChlbnRyeSk7XG4gICAgICB9KSwgaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQoZW50cnkpLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uIChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uIChwcm9taXNlLCBpKSB7XG4gIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgfSk7XG59O1xuXG4vKipcbiAgYFByb21pc2UuYWxsYCBhY2NlcHRzIGFuIGFycmF5IG9mIHByb21pc2VzLCBhbmQgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IG9mIGZ1bGZpbGxtZW50IHZhbHVlcyBmb3IgdGhlIHBhc3NlZCBwcm9taXNlcywgb3JcbiAgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBiZSByZWplY3RlZC4gSXQgY2FzdHMgYWxsXG4gIGVsZW1lbnRzIG9mIHRoZSBwYXNzZWQgaXRlcmFibGUgdG8gcHJvbWlzZXMgYXMgaXQgcnVucyB0aGlzIGFsZ29yaXRobS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVzb2x2ZSgyKTtcbiAgbGV0IHByb21pc2UzID0gcmVzb2x2ZSgzKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBhbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICBsZXQgcHJvbWlzZTMgPSByZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIGFycmF5IG9mIHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4gIEBzdGF0aWNcbiovXG5mdW5jdGlvbiBhbGwoZW50cmllcykge1xuICByZXR1cm4gbmV3IEVudW1lcmF0b3IodGhpcywgZW50cmllcykucHJvbWlzZTtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJhY2VgIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaCBpcyBzZXR0bGVkIGluIHRoZSBzYW1lIHdheSBhcyB0aGVcbiAgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gc2V0dGxlLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAyJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUHJvbWlzZS5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0XG4gIHNldHRsZWQgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGVcbiAgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3Qgc2V0dGxlZCBwcm9taXNlIGhhc1xuICBiZWNvbWUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAgcHJvbWlzZSB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdwcm9taXNlIDInKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnNcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBBbiBleGFtcGxlIHJlYWwtd29ybGQgdXNlIGNhc2UgaXMgaW1wbGVtZW50aW5nIHRpbWVvdXRzOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgUHJvbWlzZS5yYWNlKFthamF4KCdmb28uanNvbicpLCB0aW1lb3V0KDUwMDApXSlcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB3aGljaCBzZXR0bGVzIGluIHRoZSBzYW1lIHdheSBhcyB0aGUgZmlyc3QgcGFzc2VkXG4gIHByb21pc2UgdG8gc2V0dGxlLlxuKi9cbmZ1bmN0aW9uIHJhY2UoZW50cmllcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKF8sIHJlamVjdCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgYFByb21pc2UucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWQgYHJlYXNvbmAuXG4gIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UgPyBpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBuZWVkc05ldygpO1xuICB9XG59XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHJlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHJlamVjdDtcblByb21pc2UuX3NldFNjaGVkdWxlciA9IHNldFNjaGVkdWxlcjtcblByb21pc2UuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZS5fYXNhcCA9IGFzYXA7XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICAvKipcbiAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBDaGFpbmluZ1xuICAgIC0tLS0tLS0tXG4gIFxuICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgIH0pO1xuICBcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICB9KTtcbiAgICBgYGBcbiAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQXNzaW1pbGF0aW9uXG4gICAgLS0tLS0tLS0tLS0tXG4gIFxuICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IHJlc3VsdDtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IGF1dGhvciwgYm9va3M7XG4gIFxuICAgIHRyeSB7XG4gICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgXG4gICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICBcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kQXV0aG9yKCkuXG4gICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIHRoZW5cbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgdGhlbjogdGhlbixcblxuICAvKipcbiAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cbiAgXG4gICAgYGBganNcbiAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICB9XG4gIFxuICAgIC8vIHN5bmNocm9ub3VzXG4gICAgdHJ5IHtcbiAgICAgIGZpbmRBdXRob3IoKTtcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9XG4gIFxuICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgY2F0Y2hcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICAnY2F0Y2gnOiBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgdmFyIGxvY2FsID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gICAgaWYgKFApIHtcbiAgICAgICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBzaWxlbnRseSBpZ25vcmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2U7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UucG9seWZpbGwgPSBwb2x5ZmlsbDtcblByb21pc2UuUHJvbWlzZSA9IFByb21pc2U7XG5cbnJldHVybiBQcm9taXNlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXM2LXByb21pc2UubWFwIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
