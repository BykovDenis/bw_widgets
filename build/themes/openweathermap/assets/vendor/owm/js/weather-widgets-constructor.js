(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Created by Denis on 21.10.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cities = function () {
  function Cities(cityName, container) {
    _classCallCheck(this, Cities);

    var generateWidget = new _generatorWidget2.default();
    generateWidget.setInitialStateForm();

    if (!cityName.value) {
      return false;
    }

    this.cityName = cityName.value;
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
            window.cityId = event.target.id;

            var generateWidget = new _generatorWidget2.default();

            // Подстановка найденого города
            generateWidget.paramsWidget.cityId = event.target.id;
            generateWidget.paramsWidget.cityName = event.target.textContent;
            generateWidget.setInitialStateForm(event.target.id, event.target.textContent);

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

},{"./generator-widget":5,"./weather-widget":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Denis on 13.10.2016.
 */
var GeneratorWidget = function () {
    function GeneratorWidget() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var city_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 524901;
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '2d90837ddbaeda36ab487f257829b66711';

        _classCallCheck(this, GeneratorWidget);

        this.baseURL = 'themes/openweathermap/assets/vendor/owm';
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
            dateReport: document.querySelectorAll('.widget-right__date')
        };

        this.setInitialStateForm();

        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue': {
                id: 1,
                code: this.getCodeForGenerateWidget(1, city_id, key),
                schema: 'blue'
            },
            'widget-2-left-blue': {
                id: 2,
                code: this.getCodeForGenerateWidget(2, city_id, key),
                schema: 'blue'
            },
            'widget-3-left-blue': {
                id: 3,
                code: this.getCodeForGenerateWidget(3, city_id, key),
                schema: 'blue'
            },
            'widget-4-left-blue': {
                id: 4,
                code: this.getCodeForGenerateWidget(4, city_id, key),
                schema: 'blue'
            },
            'widget-5-right-blue': {
                id: 5,
                code: this.getCodeForGenerateWidget(5, city_id, key),
                schema: 'blue'
            },
            'widget-6-right-blue': {
                id: 6,
                code: this.getCodeForGenerateWidget(6, city_id, key),
                schema: 'blue'
            },
            'widget-7-right-blue': {
                id: 7,
                code: this.getCodeForGenerateWidget(7, city_id, key),
                schema: 'blue'
            },
            'widget-8-right-blue': {
                id: 8,
                code: this.getCodeForGenerateWidget(8, city_id, key),
                schema: 'blue'
            },
            'widget-9-right-blue': {
                id: 9,
                code: this.getCodeForGenerateWidget(9, city_id, key),
                schema: 'blue'
            },
            'widget-1-left-brown': {
                id: 11,
                code: this.getCodeForGenerateWidget(11, city_id, key),
                schema: 'brown'
            },
            'widget-2-left-brown': {
                id: 12,
                code: this.getCodeForGenerateWidget(12, city_id, key),
                schema: 'brown'
            },
            'widget-3-left-brown': {
                id: 13,
                code: this.getCodeForGenerateWidget(13, city_id, key),
                schema: 'brown'
            },
            'widget-4-left-brown': {
                id: 14,
                code: this.getCodeForGenerateWidget(14, city_id, key),
                schema: 'brown'
            },
            'widget-5-right-brown': {
                id: 15,
                code: this.getCodeForGenerateWidget(15, city_id, key),
                schema: 'brown'
            },
            'widget-6-right-brown': {
                id: 16,
                code: this.getCodeForGenerateWidget(16, city_id, key),
                schema: 'brown'
            },
            'widget-7-right-brown': {
                id: 17,
                code: this.getCodeForGenerateWidget(17, city_id, key),
                schema: 'brown'
            },
            'widget-8-right-brown': {
                id: 18,
                code: this.getCodeForGenerateWidget(18, city_id, key),
                schema: 'brown'
            },
            'widget-9-right-brown': {
                id: 19,
                code: this.getCodeForGenerateWidget(19, city_id, key),
                schema: 'brown'
            },
            'widget-1-left-white': {
                id: 21,
                code: this.getCodeForGenerateWidget(21, city_id, key),
                schema: 'none'
            },
            'widget-2-left-white': {
                id: 22,
                code: this.getCodeForGenerateWidget(22, city_id, key),
                schema: 'none'
            },
            'widget-3-left-white': {
                id: 23,
                code: this.getCodeForGenerateWidget(23, city_id, key),
                schema: 'none'
            },
            'widget-4-left-white': {
                id: 24,
                code: this.getCodeForGenerateWidget(24, city_id, key),
                schema: 'none'
            }
        };
    }

    _createClass(GeneratorWidget, [{
        key: 'getCodeForGenerateWidget',
        value: function getCodeForGenerateWidget(id) {
            var cityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var key = arguments[2];
            var cityName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (id && (cityId || cityName) && key) {
                var code = '';
                if (id === 1 && id === 11 && id == 21) {
                    code = '<script src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>';
                }
                return code + '<div id=\'openweathermap-widget\'></div>\n                    <script type="text/javascript">\n                    window.myWidgetParam = {\n                        id: ' + id + ',\n                        cityid: ' + cityId + ',\n                        appid: "' + key + '",\n                        containerid: \'openweathermap-widget\',\n                    };\n                    (function() {\n                        var script = document.createElement(\'script\');\n                        script.type = \'text/javascript\';\n                        script.async = true;\n                        script.src = \'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js\';\n                        var s = document.getElementsByTagName(\'script\')[0];\n                        s.parentNode.insertBefore(script, s);\n                    })();\n                  </script>';
            }

            return null;
        }
    }, {
        key: 'setInitialStateForm',
        value: function setInitialStateForm() {
            var cityId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 524901;
            var cityName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Moscow';


            this.paramsWidget = {
                cityId: cityId,
                cityName: cityName,
                lang: 'en',
                appid: document.getElementById('api-key').value,
                units: 'metric',
                textUnitTemp: String.fromCodePoint(0x00B0), // 248
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
    }]);

    return GeneratorWidget;
}();

exports.default = GeneratorWidget;

},{}],6:[function(require,module,exports){
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

},{"./custom-date":2}],7:[function(require,module,exports){
'use strict';

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var generator = new _generatorWidget2.default();
  var form = document.getElementById('frm-landing-widget');
  var popup = document.getElementById('popup');
  var popupClose = document.getElementById('popup-close');
  var contentJSGeneration = document.getElementById('js-code-generate');
  var copyContentJSCode = document.getElementById('copy-js-code');
  var apiKey = document.getElementById('api-key');

  // Фиксируем клики на форме, и открываем popup окно при нажатии на кнопку
  form.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.id && event.target.classList.contains('container-custom-card__btn')) {
      var generateWidget = new _generatorWidget2.default(event.target.id, window.cityId, apiKey.value);
      debugger;
      if (window.cityid && apiKey.value) console.log(generateWidget(generateWidget.mapWidgets[event.target.id]['id'], window.cityId, apiKey.value));
      contentJSGeneration.value = generator.mapWidgets[event.target.id]['code'];
      if (!popup.classList.contains('popup--visible')) {
        popup.classList.add('popup--visible');
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

  // Закрываем окно при нажатии на крестик
  popupClose.addEventListener('click', function () {
    if (popup.classList.contains('popup--visible')) popup.classList.remove('popup--visible');
  });

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

},{"./generator-widget":5}],8:[function(require,module,exports){
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

},{"./cities":1,"./popup":7}],9:[function(require,module,exports){
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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Denis on 29.09.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

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
        metadata.windSpeed2 = weather.fromAPI.wind.speed.toFixed(1) + ' m/s';
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
          this.controls.temperature2[_elem6].innerHTML = metadata.temperature + '<span>' + this.params.textUnitTemp + '</span>';
        }
        if (this.controls.temperatureFeels.hasOwnProperty(_elem6)) {
          this.controls.temperatureFeels[_elem6].innerHTML = metadata.temperature + '<span>' + this.params.textUnitTemp + '</span>';
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
      var that = this;

      data.forEach(function (elem, index) {
        that.controls.calendarItem[index].innerHTML = elem.day + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 10].innerHTML = elem.day + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
        that.controls.calendarItem[index + 20].innerHTML = elem.day + '<img src="http://openweathermap.org/img/w/' + elem.icon + '.png" width="32" height="32" alt="' + elem.day + '">';
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

      if (svg.querySelector('svg')) {
        svg.removeChild(svg.querySelector('svg'));
      }
      if (svg1.querySelector('svg')) {
        svg1.removeChild(svg1.querySelector('svg'));
      }
      if (svg2.querySelector('svg')) {
        svg2.removeChild(svg2.querySelector('svg'));
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

},{"./custom-date":2,"./data/natural-phenomenon-data":3,"./data/wind-speed-data":4,"./graphic-d3js":6}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvY2l0aWVzLmpzIiwiYXNzZXRzL2pzL2N1c3RvbS1kYXRlLmpzIiwiYXNzZXRzL2pzL2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanMiLCJhc3NldHMvanMvZGF0YS93aW5kLXNwZWVkLWRhdGEuanMiLCJhc3NldHMvanMvZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0cy9qcy9ncmFwaGljLWQzanMuanMiLCJhc3NldHMvanMvcG9wdXAuanMiLCJhc3NldHMvanMvc2NyaXB0LmpzIiwiYXNzZXRzL2pzL3dlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O3FqQkNBQTs7OztBQUlBOzs7O0FBQ0E7Ozs7Ozs7O0lBRXFCLE07QUFFbkIsa0JBQVksUUFBWixFQUFzQixTQUF0QixFQUFpQztBQUFBOztBQUUvQixRQUFNLGlCQUFpQiwrQkFBdkI7QUFDQSxtQkFBZSxtQkFBZjs7QUFFQSxRQUFJLENBQUMsU0FBUyxLQUFkLEVBQXFCO0FBQ25CLGFBQU8sS0FBUDtBQUNEOztBQUVELFNBQUssUUFBTCxHQUFnQixTQUFTLEtBQXpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLGFBQWEsRUFBOUI7QUFDQSxTQUFLLEdBQUwsa0RBQXdELEtBQUssUUFBN0Q7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFuQjtBQUNBLFNBQUssV0FBTCxDQUFpQixTQUFqQixHQUE2QixZQUE3QjtBQUNBLFNBQUssV0FBTCxDQUFpQixLQUFqQixHQUF5Qix1QkFBekI7O0FBRUEsUUFBTSxZQUFZLDRCQUFrQixlQUFlLFlBQWpDLEVBQStDLGVBQWUsY0FBOUQsRUFBOEUsZUFBZSxJQUE3RixDQUFsQjtBQUNBLGNBQVUsTUFBVjtBQUVEOzs7O2dDQUVXO0FBQUE7O0FBQ1Ys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ekJJO0FBMEJWLG1CQUFNLEVBMUJJO0FBMkJWLG1CQUFNLEVBM0JJO0FBNEJWLG1CQUFNLEVBNUJJO0FBNkJWLG1CQUFNLEVBN0JJO0FBOEJWLG1CQUFNLEVBOUJJO0FBK0JWLG1CQUFNLEVBL0JJO0FBZ0NWLG1CQUFNLEVBaENJO0FBaUNWLG1CQUFNLEVBakNJO0FBa0NWLG1CQUFNLEVBbENJO0FBbUNWLG1CQUFNLEVBbkNJO0FBb0NWLG1CQUFNLEVBcENJO0FBcUNWLG1CQUFNLEVBckNJO0FBc0NWLG1CQUFNLEVBdENJO0FBdUNWLG1CQUFNLEVBdkNJO0FBd0NWLG1CQUFNLEVBeENJO0FBeUNWLG1CQUFNLEVBekNJO0FBMENWLG1CQUFNLEVBMUNJO0FBMkNWLG1CQUFNLEVBM0NJO0FBNENWLG1CQUFNLEVBNUNJO0FBNkNWLG1CQUFNLEVBN0NJO0FBOENWLG1CQUFNLEVBOUNJO0FBK0NWLG1CQUFNLEVBL0NJO0FBZ0RWLG1CQUFNLEVBaERJO0FBaURWLG1CQUFNLEVBakRJO0FBa0RWLG1CQUFNLEVBbERJO0FBbURWLG1CQUFNLEVBbkRJO0FBb0RWLG1CQUFNLEVBcERJO0FBcURWLG1CQUFNLEVBckRJO0FBc0RWLG1CQUFNLEVBdERJO0FBdURWLG1CQUFNLEVBdkRJO0FBd0RWLG1CQUFNLEVBeERJO0FBeURWLG1CQUFNLEVBekRJO0FBMERWLG1CQUFNLEVBMURJO0FBMkRWLG1CQUFNLEVBM0RJO0FBNERWLG1CQUFNLEVBNURJO0FBNkRWLG1CQUFNLEVBN0RJO0FBOERWLG1CQUFNLEVBOURJO0FBK0RWLG1CQUFNLEVBL0RJO0FBZ0VWLG1CQUFNLEVBaEVJO0FBaUVWLG1CQUFNLEVBakVJO0FBa0VWLG1CQUFNLEVBbEVJO0FBbUVWLG1CQUFNLEVBbkVJO0FBb0VWLG1CQUFNLEVBcEVJO0FBcUVWLG1CQUFNLEVBckVJO0FBc0VWLG1CQUFNLEVBdEVJO0FBdUVWLG1CQUFNLEVBdkVJO0FBd0VWLG1CQUFNLEVBeEVJO0FBeUVWLG1CQUFNLEVBekVJO0FBMEVWLG1CQUFNO0FBMUVJO0FBSFY7QUFyMERvQixD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QUFDLENBQUQsR0FBSyxJQUFJLENBQUosRUFBTyxHQUFaLEdBQWtCLElBQW5CLEdBQTJCLEtBQXJEO0FBQ0EsY0FBUSxTQUFSLEdBQW9CLE1BQXBCO0FBQ0EsY0FBUSxNQUFSLENBQWUsT0FBTyxFQUF0QixFQUEyQixDQUFDLENBQUQsR0FBSyxJQUFJLENBQUosRUFBTyxHQUFaLEdBQWtCLElBQW5CLEdBQTJCLEtBQXJEO0FBQ0EsY0FBUSxTQUFSO0FBQ0EsY0FBUSxXQUFSLEdBQXNCLE1BQXRCO0FBQ0EsY0FBUSxNQUFSO0FBQ0EsY0FBUSxJQUFSO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUssaUJBQUw7QUFDRDs7Ozs7O2tCQTlla0IsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxuKi9cblxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XG5pbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdGllcyB7XG5cbiAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lcikge1xuXG4gICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XG4gICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xuXG4gICAgaWYgKCFjaXR5TmFtZS52YWx1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY2l0eU5hbWUgPSBjaXR5TmFtZS52YWx1ZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCAnJztcbiAgICB0aGlzLnVybCA9IGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/cT0ke3RoaXMuY2l0eU5hbWV9JnR5cGU9bGlrZSZzb3J0PXBvcHVsYXRpb24mY250PTMwJmFwcGlkPWIxYjE1ZTg4ZmE3OTcyMjU0MTI0MjljMWM1MGMxMjJhMWA7XG5cbiAgICB0aGlzLnNlbENpdHlTaWduID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRoaXMuc2VsQ2l0eVNpZ24uaW5uZXJUZXh0ID0gJyBzZWxlY3RlZCAnO1xuICAgIHRoaXMuc2VsQ2l0eVNpZ24uY2xhc3MgPSAnd2lkZ2V0LWZvcm1fX3NlbGVjdGVkJztcblxuICAgIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQuY29udHJvbHNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LnVybHMpO1xuICAgIG9ialdpZGdldC5yZW5kZXIoKTtcblxuICB9XG5cbiAgZ2V0Q2l0aWVzKCkge1xuICAgIGlmICghdGhpcy5jaXR5TmFtZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJsKVxuICAgICAgLnRoZW4oXG4gICAgICAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdGhpcy5nZXRTZWFyY2hEYXRhKHJlc3BvbnNlKTtcbiAgICAgIH0sXG4gICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgZ2V0U2VhcmNoRGF0YShKU09Ob2JqZWN0KSB7XG4gICAgaWYgKCFKU09Ob2JqZWN0Lmxpc3QubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLmxvZygnQ2l0eSBub3QgZm91bmQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDQo9C00LDQu9GP0LXQvCDRgtCw0LHQu9C40YbRgywg0LXRgdC70Lgg0LXRgdGC0YxcbiAgICBjb25zdCB0YWJsZUNpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XG4gICAgaWYgKHRhYmxlQ2l0eSkge1xuICAgICAgdGFibGVDaXR5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFibGVDaXR5KTtcbiAgICB9XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgSlNPTm9iamVjdC5saXN0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBuYW1lID0gYCR7SlNPTm9iamVjdC5saXN0W2ldLm5hbWV9LCAke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeX1gO1xuICAgICAgY29uc3QgZmxhZyA9IGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltYWdlcy9mbGFncy8ke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeS50b0xvd2VyQ2FzZSgpfS5wbmdgO1xuICAgICAgaHRtbCArPSBgPHRyPjx0ZCBjbGFzcz1cIndpZGdldC1mb3JtX19pdGVtXCI+PGEgaHJlZj1cIi9jaXR5LyR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGlkPVwiJHtKU09Ob2JqZWN0Lmxpc3RbaV0uaWR9XCIgY2xhc3M9XCJ3aWRnZXQtZm9ybV9fbGlua1wiPiR7bmFtZX08L2E+PGltZyBzcmM9XCIke2ZsYWd9XCI+PC9wPjwvdGQ+PC90cj5gO1xuICAgIH1cblxuICAgIGh0bWwgPSBgPHRhYmxlIGNsYXNzPVwidGFibGVcIiBpZD1cInRhYmxlLWNpdGllc1wiPiR7aHRtbH08L3RhYmxlPmA7XG4gICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XG4gICAgY29uc3QgdGFibGVDaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XG5cbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgdGFibGVDaXRpZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAoJ0EnKS50b0xvd2VyQ2FzZSgpICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dpZGdldC1mb3JtX19saW5rJykpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2l0eSA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZENpdHknKTtcbiAgICAgICAgaWYgKCFzZWxlY3RlZENpdHkpIHtcbiAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhhdC5zZWxDaXR5U2lnbiwgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xuICAgICAgICAgIHdpbmRvdy5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XG5cbiAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcbiAgICAgICAgICBcbiAgICAgICAgICAvLyDQn9C+0LTRgdGC0LDQvdC+0LLQutCwINC90LDQudC00LXQvdC+0LPQviDQs9C+0YDQvtC00LBcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQuY2l0eUlkID0gZXZlbnQudGFyZ2V0LmlkO1xuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC5jaXR5TmFtZSA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKGV2ZW50LnRhcmdldC5pZCwgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcblxuXG4gICAgICAgICAgY29uc3Qgb2JqV2lkZ2V0ID0gbmV3IFdlYXRoZXJXaWRnZXQoZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC5jb250cm9sc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQudXJscyk7XG4gICAgICAgICAgb2JqV2lkZ2V0LnJlbmRlcigpO1xuICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxuICAqIEBwYXJhbSB1cmxcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgKi9cbiAgaHR0cEdldCh1cmwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xuICAgICAgfTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2VuZChudWxsKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cbiovXG5cbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21EYXRlIGV4dGVuZHMgRGF0ZSB7XG5cbiAgLyoqXG4gICog0LzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YMg0LIg0YLRgNC10YXRgNCw0LfRgNGP0LTQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuFxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbnVtYmVyIFvRh9C40YHQu9C+INC80LXQvdC10LUgOTk5XVxuICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXG4gICovXG4gIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKSB7XG4gICAgaWYgKG51bWJlciA+IDM2NSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgIHJldHVybiBgMDAke251bWJlcn1gO1xuICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwKSB7XG4gICAgICByZXR1cm4gYDAke251bWJlcn1gO1xuICAgIH1cbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG5cbiAgLyoqXG4gICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXG4gICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXG4gICogQHJldHVybiB7aW50ZWdlcn0gINCf0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0LIg0LPQvtC00YNcbiAgKi9cbiAgY29udmVydERhdGVUb051bWJlckRheShkYXRlKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHN0YXJ0O1xuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgY29uc3QgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcbiAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcbiAgfVxuXG4gIC8qKlxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxuICAqIEBwYXJhbSAge3N0cmluZ30gZGF0ZSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XG4gICogQHJldHVybiB7ZGF0ZX0g0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxuICAqL1xuICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpIHtcbiAgICBjb25zdCByZSA9IC8oXFxkezR9KSgtKShcXGR7M30pLztcbiAgICBjb25zdCBsaW5lID0gcmUuZXhlYyhkYXRlKTtcbiAgICBjb25zdCBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcbiAgICBjb25zdCB1bml4dGltZSA9IGJlZ2lueWVhci5nZXRUaW1lKCkgKyAobGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICogMjQpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBEYXRlKHVuaXh0aW1lKTtcblxuICAgIGNvbnN0IG1vbnRoID0gcmVzLmdldE1vbnRoKCkgKyAxO1xuICAgIGNvbnN0IGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcbiAgICByZXR1cm4gYCR7ZGF5cyA8IDEwID8gYDAke2RheXN9YCA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gIDogbW9udGh9LiR7eWVhcn1gO1xuICB9XG5cbiAgLyoqXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC00LDRgtGLINCy0LjQtNCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cbiAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXG4gICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxuICAqL1xuICBmb3JtYXREYXRlKGRhdGUxKSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcblxuICAgIHJldHVybiBgJHt5ZWFyfS0keyhtb250aCA8IDEwKSA/IGAwJHttb250aH1gIDogbW9udGh9IC0gJHsoZGF5IDwgMTApID8gYDAke2RheX1gIDogZGF5fWA7XG4gIH1cblxuICAvKipcbiAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGC0LXQutGD0YnRg9GOINC+0YLRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdGD0Y4g0LTQsNGC0YMgeXl5eS1tbS1kZFxuICAqIEByZXR1cm4ge1tzdHJpbmddfSDRgtC10LrRg9GJ0LDRjyDQtNCw0YLQsFxuICAqL1xuICBnZXRDdXJyZW50RGF0ZSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcbiAgfVxuXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC/0L7RgdC70LXQtNC90LjQtSDRgtGA0Lgg0LzQtdGB0Y/RhtCwXG4gIGdldERhdGVMYXN0VGhyZWVNb250aCgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICAgIGxldCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xuICAgIGRheSAtPSA5MDtcbiAgICBpZiAoZGF5IDwgMCkge1xuICAgICAgeWVhciAtPSAxO1xuICAgICAgZGF5ID0gMzY1IC0gZGF5O1xuICAgIH1cbiAgICByZXR1cm4gYCR7eWVhcn0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xuICB9XG5cbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxuICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpIHtcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xuICB9XG5cbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxuICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpIHtcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNS0zMWApO1xuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xuICB9XG5cbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0L/RgNC10LTRi9C00YPRidC10LPQviDQu9C10YLQsFxuICBnZXRMYXN0U3VtbWVyRGF0ZSgpIHtcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpIC0gMTtcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcbiAgfVxuXG4gIGdldEZpcnN0RGF0ZUN1clllYXIoKSB7XG4gICAgcmV0dXJuIGAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gLSAwMDFgO1xuICB9XG5cbiAgLyoqXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICovXG4gIHRpbWVzdGFtcFRvRGF0ZVRpbWUodW5peHRpbWUpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygpLnJlcGxhY2UoLywvLCAnJykucmVwbGFjZSgvOlxcdyskLywgJycpO1xuICB9XG5cblxuICAvKipcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGhoOm1tXVxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICovXG4gIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSkge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xuICAgIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgICByZXR1cm4gYCR7aG91cnMgPCAxMCA/IGAwJHtob3Vyc31gIDogaG91cnN9IDogJHttaW51dGVzIDwgMTAgPyBgMCR7bWludXRlc31gIDogbWludXRlc30gYDtcbiAgfVxuXG5cbiAgLyoqXG4gICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcbiAgKiBAcGFyYW0gdW5peHRpbWVcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBnZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHVuaXh0aW1lKSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7XG4gIH1cblxuICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcbiAgKiBAcGFyYW0gZGF5TnVtYmVyXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKGRheU51bWJlcikge1xuICAgIGNvbnN0IGRheXMgPSB7XG4gICAgICAwOiAnU3VuJyxcbiAgICAgIDE6ICdNb24nLFxuICAgICAgMjogJ1R1ZScsXG4gICAgICAzOiAnV2VkJyxcbiAgICAgIDQ6ICdUaHUnLFxuICAgICAgNTogJ0ZyaScsXG4gICAgICA2OiAnU2F0JyxcbiAgICB9O1xuICAgIHJldHVybiBkYXlzW2RheU51bWJlcl07XG4gIH1cblxuICAvKipcbiAgICog0JLQtdGA0L3Rg9GC0Ywg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC80LXRgdGP0YbQsCDQv9C+INC10LPQviDQvdC+0LzQtdGA0YNcbiAgICogQHBhcmFtIG51bU1vbnRoXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihudW1Nb250aCl7XG5cbiAgICBpZih0eXBlb2YgbnVtTW9udGggIT09IFwibnVtYmVyXCIgfHwgbnVtTW9udGggPD0wICYmIG51bU1vbnRoID49IDEyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBtb250aE5hbWUgPSB7XG4gICAgICAwOiBcIkphblwiLFxuICAgICAgMTogXCJGZWJcIixcbiAgICAgIDI6IFwiTWFyXCIsXG4gICAgICAzOiBcIkFwclwiLFxuICAgICAgNDogXCJNYXlcIixcbiAgICAgIDU6IFwiSnVuXCIsXG4gICAgICA2OiBcIkp1bFwiLFxuICAgICAgNzogXCJBdWdcIixcbiAgICAgIDg6IFwiU2VwXCIsXG4gICAgICA5OiBcIk9jdFwiLFxuICAgICAgMTA6IFwiTm92XCIsXG4gICAgICAxMTogXCJEZWNcIlxuICAgIH07XG5cbiAgICByZXR1cm4gbW9udGhOYW1lW251bU1vbnRoXTtcbiAgfVxuXG4gIC8qKiDQodGA0LDQstC90LXQvdC40LUg0LTQsNGC0Ysg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eSA9IGRkLm1tLnl5eXkg0YEg0YLQtdC60YPRidC40Lwg0LTQvdC10LxcbiAgKlxuICAqL1xuICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gIH1cblxuICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKSB7XG4gICAgY29uc3QgcmUgPSAvKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XG4gICAgY29uc3QgcmVzRGF0ZSA9IHJlLmV4ZWMoZGF0ZSk7XG4gICAgaWYgKHJlc0RhdGUubGVuZ3RoID09PSA2KSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YCk7XG4gICAgfVxuICAgIC8vINCV0YHQu9C4INC00LDRgtCwINC90LUg0YDQsNGB0L/QsNGA0YHQtdC90LAg0LHQtdGA0LXQvCDRgtC10LrRg9GJ0YPRjlxuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IEhIOk1NIE1vbnRoTmFtZSBOdW1iZXJEYXRlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBnZXRUaW1lRGF0ZUhITU1Nb250aERheSgpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gYCR7ZGF0ZS5nZXRIb3VycygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRIb3VycygpfWAgOiBkYXRlLmdldEhvdXJzKCkgfToke2RhdGUuZ2V0TWludXRlcygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRNaW51dGVzKCl9YCA6IGRhdGUuZ2V0TWludXRlcygpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfSAke2RhdGUuZ2V0RGF0ZSgpfWA7XG4gIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMC4xMC4yMDE2LlxuICovXG5leHBvcnQgY29uc3QgbmF0dXJhbFBoZW5vbWVub24gPXtcbiAgICBcImVuXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkVuZ2xpc2hcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggcmFpblwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxuICAgICAgICAgICAgXCIzMTNcIjpcInNob3dlciByYWluIGFuZCBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMxNFwiOlwiaGVhdnkgc2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcImxpZ2h0IHJhaW5cIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtb2RlcmF0ZSByYWluXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZXJ5IGhlYXZ5IHJhaW5cIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlnaHQgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwic2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTMxXCI6XCJyYWdnZWQgc2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWdodCBzbm93XCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJzbGVldFwiLFxuICAgICAgICAgICAgXCI2MTJcIjpcInNob3dlciBzbGVldFwiLFxuICAgICAgICAgICAgXCI2MTVcIjpcImxpZ2h0IHJhaW4gYW5kIHNub3dcIixcbiAgICAgICAgICAgIFwiNjE2XCI6XCJyYWluIGFuZCBzbm93XCIsXG4gICAgICAgICAgICBcIjYyMFwiOlwibGlnaHQgc2hvd2VyIHNub3dcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzaG93ZXIgc25vd1wiLFxuICAgICAgICAgICAgXCI2MjJcIjpcImhlYXZ5IHNob3dlciBzbm93XCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2tlXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiaGF6ZVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmQsZHVzdCB3aGlybHNcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJmb2dcIixcbiAgICAgICAgICAgIFwiNzUxXCI6XCJzYW5kXCIsXG4gICAgICAgICAgICBcIjc2MVwiOlwiZHVzdFwiLFxuICAgICAgICAgICAgXCI3NjJcIjpcInZvbGNhbmljIGFzaFwiLFxuICAgICAgICAgICAgXCI3NzFcIjpcInNxdWFsbHNcIixcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2xlYXIgc2t5XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiZmV3IGNsb3Vkc1wiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJicm9rZW4gY2xvdWRzXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwib3ZlcmNhc3QgY2xvdWRzXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2FsIHN0b3JtXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmljYW5lXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImhvdFwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmR5XCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcInNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwibGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiZ2VudGxlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIm1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcImZyZXNoIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcInN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJoaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcImdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJzZXZlcmUgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcInN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwidmlvbGVudCBzdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcImh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwicnVcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiUnVzc2lhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQ0YlxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQzMlxcdTA0M2VcXHUwNDM3XFx1MDQzY1xcdTA0M2VcXHUwNDM2XFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDM2XFx1MDQzNVxcdTA0NDFcXHUwNDQyXFx1MDQzZVxcdTA0M2FcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQzZVxcdTA0NDdcXHUwNDM1XFx1MDQzZFxcdTA0NGMgXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0MzhcXHUwNDNkXFx1MDQ0MlxcdTA0MzVcXHUwNDNkXFx1MDQ0MVxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQzZlxcdTA0NDBcXHUwNDNlXFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0M2VcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXFx1MDQzYlxcdTA0NGNcXHUwNDQ4XFx1MDQzZVxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0NGZcXHUwNDNhXFx1MDQzZVxcdTA0NDJcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQ0N1xcdTA0MzBcXHUwNDNkXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDRmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQzZlxcdTA0MzBcXHUwNDQxXFx1MDQzY1xcdTA0NDNcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQ0MVxcdTA0M2FcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0MzZcXHUwNDMwXFx1MDQ0MFxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzNVxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcIml0XCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkl0YWxpYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2lhXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2lhIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwidGVtcG9yYWxlXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidGVtcG9yYWxlXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwidGVtcG9yYWxlIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwidGVtcG9yYWxlXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwicGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcInBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwicGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcImZvcnRlIHBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiYWNxdWF6em9uZVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcInBpb2dnaWEgbGVnZ2VyYVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcInBpb2dnaWEgbW9kZXJhdGFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJmb3J0ZSBwaW9nZ2lhXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwicGlvZ2dpYSBmb3J0aXNzaW1hXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwicGlvZ2dpYSBlc3RyZW1hXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwicGlvZ2dpYSBnZWxhdGFcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcImFjcXVhenpvbmVcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJhY3F1YXp6b25lXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2ZVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZSBuZXZpY2F0YVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIm5ldmlzY2hpb1wiLFxuICAgICAgICAgICAgXCI2MjFcIjpcImZvcnRlIG5ldmljYXRhXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiZm9zY2hpYVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bW9cIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJmb3NjaGlhXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwibXVsaW5lbGxpIGRpIHNhYmJpYVxcL3BvbHZlcmVcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJuZWJiaWFcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBzZXJlbm9cIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJwb2NoZSBudXZvbGVcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJpIHNwYXJzZVwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIm51Ymkgc3BhcnNlXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiY2llbG8gY29wZXJ0b1wiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YSB0cm9waWNhbGVcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJ1cmFnYW5vXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJlZGRvXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2FsZG9cIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JhbmRpbmVcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbW9cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCYXZhIGRpIHZlbnRvXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJlenphIGxlZ2dlcmFcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmV6emEgdGVzYVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGEgdmlvbGVudGFcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJVcmFnYW5vXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJzcFwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJTcGFuaXNoXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBsaWdlcmFcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnZXJhIHRvcm1lbnRhXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidG9ybWVudGFcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdWVydGUgdG9ybWVudGFcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0b3JtZW50YSBpcnJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgbGlnZXJhXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsbG92aXpuYSBsaWdlcmFcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJsbG92aXpuYVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcImxsb3Zpem5hIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcImxsdXZpYSB5IGxsb3Zpem5hIGxpZ2VyYVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcImxsdXZpYSB5IGxsb3Zpem5hXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwibGx1dmlhIHkgbGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiY2h1YmFzY29cIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsbHV2aWEgbGlnZXJhXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwibGx1dmlhIG1vZGVyYWRhXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwibGx1dmlhIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcImxsdXZpYSBtdXkgZnVlcnRlXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwibGx1dmlhIG11eSBmdWVydGVcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJsbHV2aWEgaGVsYWRhXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1YmFzY28gZGUgbGlnZXJhIGludGVuc2lkYWRcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHViYXNjb1wiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImNodWJhc2NvIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaWdlcmFcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuaWV2ZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiYWd1YW5pZXZlXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiY2h1YmFzY28gZGUgbmlldmVcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJuaWVibGFcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJodW1vXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwibmllYmxhXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwidG9yYmVsbGlub3MgZGUgYXJlbmFcXC9wb2x2b1wiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2llbG8gY2xhcm9cIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJhbGdvIGRlIG51YmVzXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViZXMgcm90YXNcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJudWJlc1wiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0b3JtZW50YSB0cm9waWNhbFwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmFjXFx1MDBlMW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2Fsb3JcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtYVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIlZpZW50byBmbG9qb1wiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIlZpZW50byBzdWF2ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIlZpZW50byBtb2RlcmFkb1wiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiVmllbnRvIGZ1ZXJ0ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlZpZW50byBmdWVydGUsIHByXFx1MDBmM3hpbW8gYSB2ZW5kYXZhbFwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgZnVlcnRlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkIHZpb2xlbnRhXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWNcXHUwMGUxblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwidWFcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiVWtyYWluaWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzN1xcdTA0NTYgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2VcXHUwNDRlXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0M2FcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDQyXFx1MDQzYVxcdTA0M2VcXHUwNDQ3XFx1MDQzMFxcdTA0NDFcXHUwNDNkXFx1MDQ1NiBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQzZlxcdTA0M2VcXHUwNDNjXFx1MDQ1NlxcdTA0NDBcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0M2FcXHUwNDQwXFx1MDQzOFxcdTA0MzZcXHUwNDMwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzMgXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0M2NcXHUwNDNlXFx1MDQzYVxcdTA0NDBcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQ0MVxcdTA0MzVcXHUwNDQwXFx1MDQzZlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0M2FcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQ1NlxcdTA0NDlcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzNVxcdTA0NDJcXHUwNDU2XFx1MDQzYlxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NDdcXHUwNDM4XFx1MDQ0MVxcdTA0NDJcXHUwNDM1IFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDQ1XFx1MDQzOCBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDU2XFx1MDQ0MFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0NTYgXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0MzhcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0NTZcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzVcXHUwNDMyXFx1MDQ1NlxcdTA0MzlcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQ0MVxcdTA0M2ZcXHUwNDM1XFx1MDQzYVxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQ1NlxcdTA0NDJcXHUwNDQwXFx1MDQ0ZlxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiZGVcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiR2VybWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIFJlZ2VuXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiR2V3aXR0ZXIgbWl0IFJlZ2VuXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gUmVnZW5cIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsZWljaHRlIEdld2l0dGVyXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiR2V3aXR0ZXJcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzY2h3ZXJlIEdld2l0dGVyXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiZWluaWdlIEdld2l0dGVyXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIE5pZXNlbHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiR2V3aXR0ZXIgbWl0IE5pZXNlbHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gTmllc2VscmVnZW5cIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsZWljaHRlcyBOaWVzZWxuXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiTmllc2VsblwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcInN0YXJrZXMgTmllc2VsblwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcImxlaWNodGVyIE5pZXNlbHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiTmllc2VscmVnZW5cIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzdGFya2VyIE5pZXNlbHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiTmllc2Vsc2NoYXVlclwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcImxlaWNodGVyIFJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBSZWdlblwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcInNlaHIgc3RhcmtlciBSZWdlblwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInNlaHIgc3RhcmtlciBSZWdlblwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlN0YXJrcmVnZW5cIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJFaXNyZWdlblwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcImxlaWNodGUgUmVnZW5zY2hhdWVyXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiUmVnZW5zY2hhdWVyXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVmdGlnZSBSZWdlbnNjaGF1ZXJcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtXFx1MDBlNFxcdTAwZGZpZ2VyIFNjaG5lZVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlNjaG5lZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImhlZnRpZ2VyIFNjaG5lZWZhbGxcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJHcmF1cGVsXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiU2NobmVlc2NoYXVlclwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcInRyXFx1MDBmY2JcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJSYXVjaFwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIkR1bnN0XCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiU2FuZCBcXC8gU3RhdWJzdHVybVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIk5lYmVsXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhcmVyIEhpbW1lbFwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImVpbiBwYWFyIFdvbGtlblwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTAwZmNiZXJ3aWVnZW5kIGJld1xcdTAwZjZsa3RcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwid29sa2VuYmVkZWNrdFwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9wZW5zdHVybVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cnJpa2FuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwia2FsdFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImhlaVxcdTAwZGZcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5kaWdcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJIYWdlbFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJXaW5kc3RpbGxlXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGVpY2h0ZSBCcmlzZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIk1pbGRlIEJyaXNlXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTVxcdTAwZTRcXHUwMGRmaWdlIEJyaXNlXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJpc2NoZSBCcmlzZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0YXJrZSBCcmlzZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhvY2h3aW5kLCBhbm5cXHUwMGU0aGVuZGVyIFN0dXJtXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3R1cm1cIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTY2h3ZXJlciBTdHVybVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIkdld2l0dGVyXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiSGVmdGlnZXMgR2V3aXR0ZXJcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwicHRcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiUG9ydHVndWVzZVwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YSBsZXZlXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidHJvdm9hZGEgY29tIGNodXZhXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwidHJvdm9hZGEgY29tIGNodXZhIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwidHJvdm9hZGEgbGV2ZVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcInRyb3ZvYWRhXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwidHJvdm9hZGEgcGVzYWRhXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwidHJvdm9hZGEgaXJyZWd1bGFyXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidHJvdm9hZGEgY29tIGdhcm9hIGZyYWNhXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidHJvdm9hZGEgY29tIGdhcm9hXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwidHJvdm9hZGEgY29tIGdhcm9hIHBlc2FkYVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImdhcm9hIGZyYWNhXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiZ2Fyb2FcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJnYXJvYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiY2h1dmEgbGV2ZVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcImNodXZhIGZyYWNhXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiY2h1dmEgZm9ydGVcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJjaHV2YSBkZSBnYXJvYVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcImNodXZhIGZyYWNhXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiQ2h1dmEgbW9kZXJhZGFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJjaHV2YSBkZSBpbnRlbnNpZGFkZSBwZXNhZG9cIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaHV2YSBtdWl0byBmb3J0ZVwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIkNodXZhIEZvcnRlXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiY2h1dmEgY29tIGNvbmdlbGFtZW50b1wiLFxuICAgICAgICAgICAgXCI1MjBcIjpcImNodXZhIG1vZGVyYWRhXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2h1dmFcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaHV2YSBkZSBpbnRlbnNpZGFkZSBwZXNhZGFcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZlIGJyYW5kYVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZlIHBlc2FkYVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcImNodXZhIGNvbSBuZXZlXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiYmFuaG8gZGUgbmV2ZVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIk5cXHUwMGU5dm9hXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtYVxcdTAwZTdhXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwibmVibGluYVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInR1cmJpbGhcXHUwMGY1ZXMgZGUgYXJlaWFcXC9wb2VpcmFcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJsaW5hXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiY1xcdTAwZTl1IGNsYXJvXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiQWxndW1hcyBudXZlbnNcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJudXZlbnMgZGlzcGVyc2FzXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwibnV2ZW5zIHF1ZWJyYWRvc1wiLFxuICAgICAgICAgICAgXCI4MDRcIjpcInRlbXBvIG51YmxhZG9cIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcGVzdGFkZSB0cm9waWNhbFwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImZ1cmFjXFx1MDBlM29cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmlvXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwicXVlbnRlXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiY29tIHZlbnRvXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwicm9cIjp7XG4gICAgICAgIFwibmFtZVwiOlwiUm9tYW5pYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVydHVuXFx1MDEwMyBjdSBwbG9haWUgcHV0ZXJuaWNcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiZnVydHVuXFx1MDEwMyB1XFx1MDIxOW9hclxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiZnVydHVuXFx1MDEwMyBwdXRlcm5pY1xcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJmdXJ0dW5cXHUwMTAzIGFwcmlnXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIyMzBcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIyMzFcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIyMzJcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgam9hc1xcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBtYXJlXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIzMTFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIG1hcmVcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwicGxvYWllIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI1MDFcIjpcInBsb2FpZVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcInBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwbG9haWUgdG9yZW5cXHUwMjFiaWFsXFx1MDEwMyBcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwbG9haWUgZXh0cmVtXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI1MTFcIjpcInBsb2FpZSBcXHUwMGVlbmdoZVxcdTAyMWJhdFxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI1MjFcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuaW5zb2FyZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuaW5zb2FyZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIm5pbnNvYXJlIHB1dGVybmljXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI2MTFcIjpcImxhcG92aVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwibmluc29hcmUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI3MDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInZcXHUwMGUycnRlanVyaSBkZSBuaXNpcFwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2VyIHNlbmluXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiY1xcdTAwZTJcXHUwMjFiaXZhIG5vcmlcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJub3JpIFxcdTAwZWVtcHJcXHUwMTAzXFx1MDIxOXRpYVxcdTAyMWJpXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiY2VyIGZyYWdtZW50YXRcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJjZXIgYWNvcGVyaXQgZGUgbm9yaVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZFxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJmdXJ0dW5hIHRyb3BpY2FsXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhblwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcInJlY2VcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmaWVyYmludGVcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2YW50IHB1dGVybmljXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JpbmRpblxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInBsXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIlBvbGlzaFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIkJ1cnphIHogbGVra2ltaSBvcGFkYW1pIGRlc3pjenVcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJCdXJ6YSB6IG9wYWRhbWkgZGVzemN6dVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIkJ1cnphIHogaW50ZW5zeXdueW1pIG9wYWRhbWkgZGVzemN6dVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIkxla2thIGJ1cnphXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiQnVyemFcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJTaWxuYSBidXJ6YVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIkJ1cnphXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiQnVyemEgeiBsZWtrXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJCdXJ6YSB6IG1cXHUwMTdjYXdrYVwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIkJ1cnphIHogaW50ZW5zeXduXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJMZWtrYSBtXFx1MDE3Y2F3a2FcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJNXFx1MDE3Y2F3a2FcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJJbnRlbnN5d25hIG1cXHUwMTdjYXdrYVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIkxla2tpZSBvcGFkeSBkcm9ibmVnbyBkZXN6Y3p1XCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiRGVzemN6IFxcLyBtXFx1MDE3Y2F3a2FcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJJbnRlbnN5d255IGRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiU2lsbmEgbVxcdTAxN2Nhd2thXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiTGVra2kgZGVzemN6XCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiVW1pYXJrb3dhbnkgZGVzemN6XCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiSW50ZW5zeXdueSBkZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJiYXJkem8gc2lsbnkgZGVzemN6XCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiVWxld2FcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJNYXJ6blxcdTAxMDVjeSBkZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJLclxcdTAwZjN0a2EgdWxld2FcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJEZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJJbnRlbnN5d255LCBsZWtraSBkZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJMZWtraWUgb3BhZHkgXFx1MDE1Ym5pZWd1XCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDE1YW5pZWdcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJNb2NuZSBvcGFkeSBcXHUwMTVibmllZ3VcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJEZXN6Y3ogemUgXFx1MDE1Ym5pZWdlbVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTAxNWFuaWVcXHUwMTdjeWNhXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiTWdpZVxcdTAxNDJrYVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlNtb2dcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJaYW1nbGVuaWFcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJaYW1pZVxcdTAxMDcgcGlhc2tvd2FcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJNZ1xcdTAxNDJhXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiQmV6Y2htdXJuaWVcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJMZWtraWUgemFjaG11cnplbmllXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiUm96cHJvc3pvbmUgY2htdXJ5XCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiUG9jaG11cm5vIHogcHJ6ZWphXFx1MDE1Ym5pZW5pYW1pXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiUG9jaG11cm5vXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcImJ1cnphIHRyb3Bpa2FsbmFcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJhZ2FuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiQ2hcXHUwMTQyb2Rub1wiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIkdvclxcdTAxMDVjb1wiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIndpZXRyem5pZVwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIkdyYWRcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiU3Bva29qbmllXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGVra2EgYnJ5emFcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJEZWxpa2F0bmEgYnJ5emFcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJVbWlhcmtvd2FuYSBicnl6YVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxNWF3aWVcXHUwMTdjYSBicnl6YVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5hIGJyeXphXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiUHJhd2llIHdpY2h1cmFcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJXaWNodXJhXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2lsbmEgd2ljaHVyYVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN6dG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIkd3YVxcdTAxNDJ0b3dueSBzenRvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhZ2FuXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJmaVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJGaW5uaXNoXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwidWtrb3NteXJza3kgamEga2V2eXQgc2FkZVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcInVra29zbXlyc2t5IGphIHNhZGVcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHNhZGVcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJwaWVuaSB1a2tvc215cnNreVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcInVra29zbXlyc2t5XCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwia292YSB1a2tvc215cnNreVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcImxpZXZcXHUwMGU0IHVra29zbXlyc2t5XCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidWtrb3NteXJza3kgamEga2V2eXQgdGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidWtrb3NteXJza3kgamEgdGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwidWtrb3NteXJza3kgamEga292YSB0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWV2XFx1MDBlNCB0aWh1dHRhaW5lblwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcInRpaHV0dGFhXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwia292YSB0aWh1dHRhaW5lblwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZXZcXHUwMGU0IHRpaGt1c2FkZVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcInRpaGt1c2FkZVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcImtvdmEgdGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwidGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwicGllbmkgc2FkZVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcImtvaHRhbGFpbmVuIHNhZGVcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJrb3ZhIHNhZGVcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJlcml0dFxcdTAwZTRpbiBydW5zYXN0YSBzYWRldHRhXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwia292YSBzYWRlXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwialxcdTAwZTRcXHUwMGU0dFxcdTAwZTR2XFx1MDBlNCBzYWRlXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwidGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwia292YSBzYWRlXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwicGllbmkgbHVtaXNhZGVcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJsdW1pXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwicGFsam9uIGx1bnRhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiclxcdTAwZTRudFxcdTAwZTRcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJsdW1pa3V1cm9cIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzdW11XCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwic2F2dVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcInN1bXVcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJoaWVra2FcXC9wXFx1MDBmNmx5IHB5XFx1MDBmNnJyZVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcInN1bXVcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJ0YWl2YXMgb24gc2Vsa2VcXHUwMGU0XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwidlxcdTAwZTRoXFx1MDBlNG4gcGlsdmlcXHUwMGU0XCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiYWpvaXR0YWlzaWEgcGlsdmlcXHUwMGU0XCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiaGFqYW5haXNpYSBwaWx2aVxcdTAwZTRcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJwaWx2aW5lblwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9vcHBpbmVuIG15cnNreVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImhpcm11bXlyc2t5XCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwia3lsbVxcdTAwZTRcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJrdXVtYVwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInR1dWxpbmVuXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwicmFrZWl0YVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwibmxcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiRHV0Y2hcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJvbndlZXJzYnVpIG1ldCBsaWNodGUgcmVnZW5cIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvbndlZXJzYnVpIG1ldCByZWdlblwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIm9ud2VlcnNidWkgbWV0IHp3YXJlIHJlZ2VudmFsXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwibGljaHRlIG9ud2VlcnNidWlcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJvbndlZXJzYnVpXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiendhcmUgb253ZWVyc2J1aVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIm9ucmVnZWxtYXRpZyBvbndlZXJzYnVpXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIG1vdHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwib253ZWVyc2J1aSBtZXQgbW90cmVnZW5cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJvbndlZXJzYnVpIG1ldCB6d2FyZSBtb3RyZWdlblwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImxpY2h0ZSBtb3RyZWdlblwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIm1vdHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiendhcmUgbW90cmVnZW5cIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWNodGUgbW90cmVnZW5cXC9yZWdlblwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIm1vdHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiendhcmUgbW90cmVnZW5cXC9yZWdlblwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibGljaHRlIHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwibWF0aWdlIHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiendhcmUgcmVnZW52YWxcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ6ZWVyIHp3YXJlIHJlZ2VudmFsXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByZWdlblwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIktvdWRlIGJ1aWVuXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwibGljaHRlIHN0b3J0cmVnZW5cIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzdG9ydHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiendhcmUgc3RvcnRyZWdlblwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcImxpY2h0ZSBzbmVldXdcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVldXdcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZXZpZ2Ugc25lZXV3XCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiaWp6ZWxcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuYXR0ZSBzbmVldXdcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwibWlzdFwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIm5ldmVsXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiemFuZFxcL3N0b2Ygd2VydmVsaW5nXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwibWlzdFwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIm9uYmV3b2xrdFwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImxpY2h0IGJld29sa3RcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJoYWxmIGJld29sa3RcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJ6d2FhciBiZXdvbGt0XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiZ2VoZWVsIGJld29sa3RcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlzY2hlIHN0b3JtXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYWFuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwia291ZFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImhlZXRcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzdG9ybWFjaHRpZ1wiLFxuICAgICAgICAgICAgXCI5MDZcIjpcImhhZ2VsXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiV2luZHN0aWxcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJLYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGljaHRlIGJyaWVzXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiWmFjaHRlIGJyaWVzXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTWF0aWdlIGJyaWVzXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiVnJpaiBrcmFjaHRpZ2Ugd2luZFwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIktyYWNodGlnZSB3aW5kXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGFyZGUgd2luZFwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIlN0b3JtYWNodGlnXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJad2FyZSBzdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlplZXIgendhcmUgc3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthYW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImZyXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkZyZW5jaFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIm9yYWdlIGV0IHBsdWllIGZpbmVcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvcmFnZSBldCBwbHVpZVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIm9yYWdlIGV0IGZvcnRlcyBwbHVpZXNcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJvcmFnZXMgbFxcdTAwZTlnZXJzXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwib3JhZ2VzXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiZ3JvcyBvcmFnZXNcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIk9yYWdlIGF2ZWMgbFxcdTAwZTlnXFx1MDBlOHJlIGJydWluZVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIm9yYWdlcyBcXHUwMGU5cGFyc2VzXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JvcyBvcmFnZVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIkJydWluZSBsXFx1MDBlOWdcXHUwMGU4cmVcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJCcnVpbmVcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJGb3J0ZXMgYnJ1aW5lc1wiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlBsdWllIGZpbmUgXFx1MDBlOXBhcnNlXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwicGx1aWUgZmluZVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIkNyYWNoaW4gaW50ZW5zZVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIkF2ZXJzZXMgZGUgYnJ1aW5lXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibFxcdTAwZTlnXFx1MDBlOHJlcyBwbHVpZXNcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbHVpZXMgbW9kXFx1MDBlOXJcXHUwMGU5ZXNcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJGb3J0ZXMgcGx1aWVzXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwidHJcXHUwMGU4cyBmb3J0ZXMgcHJcXHUwMGU5Y2lwaXRhdGlvbnNcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJncm9zc2VzIHBsdWllc1wiLFxuICAgICAgICAgICAgXCI1MTFcIjpcInBsdWllIHZlcmdsYVxcdTAwZTdhbnRlXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwicGV0aXRlcyBhdmVyc2VzXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiYXZlcnNlcyBkZSBwbHVpZVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImF2ZXJzZXMgaW50ZW5zZXNcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsXFx1MDBlOWdcXHUwMGU4cmVzIG5laWdlc1wiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIm5laWdlXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiZm9ydGVzIGNodXRlcyBkZSBuZWlnZVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIm5laWdlIGZvbmR1ZVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcImF2ZXJzZXMgZGUgbmVpZ2VcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJicnVtZVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIkJyb3VpbGxhcmRcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJicnVtZVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInRlbXBcXHUwMGVhdGVzIGRlIHNhYmxlXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJvdWlsbGFyZFwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImVuc29sZWlsbFxcdTAwZTlcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJwZXUgbnVhZ2V1eFwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInBhcnRpZWxsZW1lbnQgZW5zb2xlaWxsXFx1MDBlOVwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YWdldXhcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJDb3V2ZXJ0XCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkZVwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBcXHUwMGVhdGUgdHJvcGljYWxlXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwib3VyYWdhblwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImZyb2lkXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2hhdWRcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50ZXV4XCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JcXHUwMGVhbGVcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbWVcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCcmlzZSBsXFx1MDBlOWdcXHUwMGU4cmVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzZSBkb3VjZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyaXNlIG1vZFxcdTAwZTlyXFx1MDBlOWVcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzZSBmcmFpY2hlXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiQnJpc2UgZm9ydGVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50IGZvcnQsIHByZXNxdWUgdmlvbGVudFwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbnQgdmlvbGVudFwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbnQgdHJcXHUwMGU4cyB2aW9sZW50XCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcFxcdTAwZWF0ZVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcImVtcFxcdTAwZWF0ZSB2aW9sZW50ZVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIk91cmFnYW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImJnXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkJ1bGdhcmlhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDNmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0M2FcXHUwNDRhXFx1MDQ0MVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQzOFwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQ0ZlxcdTA0NDkgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDIzXFx1MDQzY1xcdTA0MzVcXHUwNDQwXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDFjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDE0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0IFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDFmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0MjFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQxOFxcdTA0MzdcXHUwNDNkXFx1MDQzNVxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0MzJcXHUwNDMwXFx1MDQ0OSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0MWVcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQxY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDE0XFx1MDQzOFxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDFkXFx1MDQzOFxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDNjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0MWZcXHUwNDRmXFx1MDQ0MVxcdTA0NGFcXHUwNDQ3XFx1MDQzZFxcdTA0MzBcXC9cXHUwNDFmXFx1MDQ0MFxcdTA0MzBcXHUwNDQ4XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQyZlxcdTA0NDFcXHUwNDNkXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQxZFxcdTA0MzhcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0NDFcXHUwNDM1XFx1MDQ0ZlxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0MjJcXHUwNDRhXFx1MDQzY1xcdTA0M2RcXHUwNDM4IFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0MjJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcXC9cXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDIyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDIxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XFx1MDQzNVxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQxM1xcdTA0M2VcXHUwNDQwXFx1MDQzNVxcdTA0NDlcXHUwNDNlIFxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQxMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDJcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwic2VcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiU3dlZGlzaFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcImZ1bGx0IFxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTAwZTVza2FcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwMGU1c2thXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwib2pcXHUwMGU0bW50IG92XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcImZ1bGx0IFxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIm1qdWt0IGR1Z2dyZWduXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHVnZ3JlZ25cIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoXFx1MDBlNXJ0IGR1Z2dyZWduXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwibWp1a3QgcmVnblwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcInJlZ25cIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJkdWdncmVnblwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIm1qdWt0IHJlZ25cIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJNXFx1MDBlNXR0bGlnIHJlZ25cIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJteWNrZXQga3JhZnRpZ3QgcmVnblwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTAwZjZzcmVnblwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcInVuZGVya3lsdCByZWduXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwibWp1a3QgXFx1MDBmNnNyZWduXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiZHVzY2gtcmVnblwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcInJlZ25hciBzbVxcdTAwZTVzcGlrXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwibWp1ayBzblxcdTAwZjZcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAwZjZcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJrcmFmdGlndCBzblxcdTAwZjZmYWxsXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwic25cXHUwMGY2YmxhbmRhdCByZWduXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwic25cXHUwMGY2b3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiZGltbWFcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9nZ1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcImRpc1wiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRzdG9ybVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImRpbW1pZ3RcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJrbGFyIGhpbW1lbFwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIm5cXHUwMGU1Z3JhIG1vbG5cIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJzcHJpZGRhIG1vbG5cIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJtb2xuaWd0XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDBmNnZlcnNrdWdnYW5kZSBtb2xuXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwic3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waXNrIHN0b3JtXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrYWxsdFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcInZhcm10XCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiYmxcXHUwMGU1c2lndFwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcImhhZ2VsXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJ6aF90d1wiOntcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFRyYWRpdGlvbmFsXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1NTFjZFxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHU1OTI3XFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTNlXFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2NjNcXHU5NmVhXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1ODU4NFxcdTk3MjdcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MTU5XFx1OTcyN1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NzI3XCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1NmM5OVxcdTY1Y2JcXHU5OGE4XCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk3MjdcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1NjY3NFxcdWZmMGNcXHU1YzExXFx1OTZmMlwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU5NmYyXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTk2ZjJcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHU5NjcwXFx1ZmYwY1xcdTU5MWFcXHU5NmYyXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY4ZFxcdTYzNzJcXHU5OGE4XCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzFiMVxcdTVlMzZcXHU5OGE4XFx1NjZiNFwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTk4YjZcXHU5OGE4XCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcxYjFcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHU1OTI3XFx1OThhOFwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJ0clwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJUdXJraXNoXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBoYWZpZiB5YVxcdTAxMWZtdXJsdVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgeWFcXHUwMTFmbXVybHVcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIkhhZmlmIHNhXFx1MDExZmFuYWtcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJTYVxcdTAxMWZhbmFrXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDE1ZWlkZGV0bGkgc2FcXHUwMTFmYW5ha1wiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIkFyYWxcXHUwMTMxa2xcXHUwMTMxIHNhXFx1MDExZmFuYWtcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJZZXIgeWVyIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJZZXIgeWVyIHlvXFx1MDExZnVuIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJZZXIgeWVyIGhhZmlmIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJZZXIgeWVyIHlvXFx1MDExZnVuIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJZZXIgeWVyIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIkhhZmlmIHlhXFx1MDExZm11clwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIk9ydGEgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDE1ZWlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDBjN29rIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIkFcXHUwMTVmXFx1MDEzMXJcXHUwMTMxIHlhXFx1MDExZm11clwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIllhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzEgdmUgc29cXHUwMTFmdWsgaGF2YVwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwiSGFmaWYga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJLYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIllvXFx1MDExZnVuIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiS2FybGEga2FyXFx1MDEzMVxcdTAxNWZcXHUwMTMxayB5YVxcdTAxMWZtdXJsdVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxcXHUwMGZjIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJTaXNsaVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlNpc2xpXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiSGFmaWYgc2lzbGlcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJLdW1cXC9Ub3ogZlxcdTAxMzFydFxcdTAxMzFuYXNcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiU2lzbGlcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJBXFx1MDBlN1xcdTAxMzFrXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiQXogYnVsdXRsdVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYXogYnVsdXRsdVwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYnVsdXRsdVwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIkthcGFsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIkthc1xcdTAxMzFyZ2FcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9waWsgZlxcdTAxMzFydFxcdTAxMzFuYVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIkhvcnR1bVwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTAwYzdvayBTb1xcdTAxMWZ1a1wiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTAwYzdvayBTXFx1MDEzMWNha1wiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiRG9sdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJEdXJndW5cIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTYWtpblwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkhhZmlmIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiQXogUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJPcnRhIFNldml5ZSBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiS3V2dmV0bGkgUlxcdTAwZmN6Z2FyXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2VydCBSXFx1MDBmY3pnYXJcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDE1ZWlkZGV0bGkgRlxcdTAxMzFydFxcdTAxMzFuYVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIkthc1xcdTAxMzFyZ2FcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwMTVlaWRkZXRsaSBLYXNcXHUwMTMxcmdhXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDBjN29rIFxcdTAxNWVpZGRldGxpIEthc1xcdTAxMzFyZ2FcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInpoX2NuXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkNoaW5lc2UgU2ltcGxpZmllZFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHU0ZTJkXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHU2NmI0XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTUxYmJcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1OTYzNVxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1NWMwZlxcdTk2ZWFcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHU5NmVhXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1NTkyN1xcdTk2ZWFcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHU5NmU4XFx1NTkzOVxcdTk2ZWFcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHU5NjM1XFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1NzBkZlxcdTk2ZmVcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHU4NTg0XFx1OTZmZVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTZjOTlcXHU2NWNiXFx1OThjZVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTU5MjdcXHU5NmZlXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1NjY3NFwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTY2NzRcXHVmZjBjXFx1NWMxMVxcdTRlOTFcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHU1OTFhXFx1NGU5MVwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1OTYzNFxcdWZmMGNcXHU1OTFhXFx1NGU5MVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTlmOTlcXHU1Mzc3XFx1OThjZVwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTcwZWRcXHU1ZTI2XFx1OThjZVxcdTY2YjRcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHU5OGQzXFx1OThjZVwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTUxYjdcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHU3MGVkXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1NTkyN1xcdTk4Y2VcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHU1MWIwXFx1OTZmOVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiY3pcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQ3plY2hcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2xhYlxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcImJvdVxcdTAxNTlrYSBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2lsblxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJcXHUwMTYxXFx1MDBlZCBib3VcXHUwMTU5a2FcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJib3VcXHUwMTU5a2FcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzaWxuXFx1MDBlMSBib3VcXHUwMTU5a2FcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJib3VcXHUwMTU5a292XFx1MDBlMSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhrYVwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcImJvdVxcdTAxNTlrYSBzZSBzbGFiXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiYm91XFx1MDE1OWthIHMgbXJob2xlblxcdTAwZWRtXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIm1yaG9sZW5cXHUwMGVkXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuXFx1MDBlZCBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJtcmhvbGVuXFx1MDBlZCBzIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxuICAgICAgICAgICAgXCIzMTNcIjpcIm1yaG9sZW5cXHUwMGVkIGEgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcbiAgICAgICAgICAgIFwiMzE0XCI6XCJtcmhvbGVuXFx1MDBlZCBhIHNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwicHJ1ZGtcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwXFx1MDE1OVxcdTAwZWR2YWxvdlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcInByXFx1MDE2ZnRyXFx1MDE3ZSBtcmFcXHUwMTBkZW5cIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpub3VjXFx1MDBlZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwic2xhYlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjUzMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIm1cXHUwMGVkcm5cXHUwMGU5IHNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiaHVzdFxcdTAwZTkgc25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcInptcnpsXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXG4gICAgICAgICAgICBcIjYxMlwiOlwic21cXHUwMGVkXFx1MDE2MWVuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCI2MTVcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjUgc2Ugc25cXHUwMTFiaGVtXCIsXG4gICAgICAgICAgICBcIjYxNlwiOlwiZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbGFiXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwic25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCI2MjJcIjpcInNpbG5cXHUwMGU5IHNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtbGhhXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwia291XFx1MDE1OVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwXFx1MDBlZHNlXFx1MDEwZG5cXHUwMGU5IFxcdTAxMGRpIHByYWNob3ZcXHUwMGU5IHZcXHUwMGVkcnlcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJodXN0XFx1MDBlMSBtbGhhXCIsXG4gICAgICAgICAgICBcIjc1MVwiOlwicFxcdTAwZWRzZWtcIixcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxbm9cIixcbiAgICAgICAgICAgIFwiNzYyXCI6XCJzb3BlXFx1MDEwZG5cXHUwMGZkIHBvcGVsXCIsXG4gICAgICAgICAgICBcIjc3MVwiOlwicHJ1ZGtcXHUwMGU5IGJvdVxcdTAxNTllXCIsXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9yblxcdTAwZTFkb1wiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25vXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwic2tvcm8gamFzbm9cIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJvYmxhXFx1MDEwZG5vXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiemF0YVxcdTAxN2Vlbm9cIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYm91XFx1MDE1OWVcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJpa1xcdTAwZTFuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImhvcmtvXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwidlxcdTAxMWJ0cm5vXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRcXHUwMGVkXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiYmV6dlxcdTAxMWJ0XFx1MDE1OVxcdTAwZWRcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJ2XFx1MDBlMW5la1wiLFxuICAgICAgICAgICAgXCI5NTJcIjpcInZcXHUwMTFidFxcdTAxNTlcXHUwMGVka1wiLFxuICAgICAgICAgICAgXCI5NTNcIjpcInNsYWJcXHUwMGZkIHZcXHUwMGVkdHJcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJtXFx1MDBlZHJuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwZGVyc3R2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwic2lsblxcdTAwZmQgdlxcdTAwZWR0clwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcInBydWRrXFx1MDBmZCB2XFx1MDBlZHRyXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiYm91XFx1MDE1OWxpdlxcdTAwZmQgdlxcdTAwZWR0clwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcInZpY2hcXHUwMTU5aWNlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwic2lsblxcdTAwZTEgdmljaFxcdTAxNTlpY2VcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJtb2h1dG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwib3JrXFx1MDBlMW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImtyXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIktvcmVhXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgcmFpblwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcInRodW5kZXJzdG9ybSB3aXRoIHJhaW5cIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnaHQgdGh1bmRlcnN0b3JtXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidGh1bmRlcnN0b3JtXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGVhdnkgdGh1bmRlcnN0b3JtXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwicmFnZ2VkIHRodW5kZXJzdG9ybVwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcImRyaXp6bGUgcmFpblwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcImxpZ2h0IHJhaW5cIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtb2RlcmF0ZSByYWluXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZXJ5IGhlYXZ5IHJhaW5cIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlnaHQgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwic2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWdodCBzbm93XCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJzbGVldFwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2tlXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiaGF6ZVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRcXC9kdXN0IHdoaXJsc1wiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxuICAgICAgICAgICAgXCI4MDBcIjpcInNreSBpcyBjbGVhclwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJzY2F0dGVyZWQgY2xvdWRzXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiYnJva2VuIGNsb3Vkc1wiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNhbCBzdG9ybVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImNvbGRcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3RcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcImhhaWxcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImdsXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkdhbGljaWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgbGl4ZWlyYVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBsaXhlaXJhXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGlycmVndWxhclwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsbyBsaXhlaXJvXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGludGVuc29cIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJvcmJhbGxvIGxpeGVpcm9cIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJvcmJhbGxvXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwib3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiY2hvaXZhIGUgb3JiYWxsbyBsaXhlaXJvXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiY2hvaXZhIGUgb3JiYWxsb1wiLFxuICAgICAgICAgICAgXCIzMTJcIjpcImNob2l2YSBlIG9yYmFsbG8gZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIm9yYmFsbG8gZGUgZHVjaGFcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJjaG9pdmEgbGl4ZWlyYVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcImNob2l2YSBtb2RlcmFkYVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImNob2l2YSBkZSBncmFuIGludGVuc2lkYWRlXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiY2hvaXZhIG1vaSBmb3J0ZVwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcImNob2l2YSBleHRyZW1hXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiY2hvaXZhIHhlYWRhXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2hvaXZhIGRlIGR1Y2hhIGRlIGJhaXhhIGludGVuc2lkYWRlXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2hvaXZhIGRlIGR1Y2hhXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2hvaXZhIGRlIGR1Y2hhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZhZGEgbGl4ZWlyYVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuZXZhZGEgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcImF1Z2FuZXZlXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwibmV2ZSBkZSBkdWNoYVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIm5cXHUwMGU5Ym9hXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtZVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIm5cXHUwMGU5Ym9hIGxpeGVpcmFcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJyZW11aVxcdTAwZjFvcyBkZSBhcmVhIGUgcG9sdm9cIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicnVtYVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImNlbyBjbGFyb1wiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImFsZ28gZGUgbnViZXNcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJlcyBkaXNwZXJzYXNcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIm51YmVzXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiZnVyYWNcXHUwMGUxblwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImZyXFx1MDBlZG9cIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJzYXJhYmlhXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJWZW50byBmcm91eG9cIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJWZW50byBzdWF2ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIlZlbnRvIG1vZGVyYWRvXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2FcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWZW50byBmb3J0ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnRvIGZvcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkZVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhZGUgdmlvbGVudGFcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJGdXJhY1xcdTAwZTFuXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJ2aVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJ2aWV0bmFtZXNlXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBuaFxcdTFlYjlcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIE1cXHUwMWIwYSBsXFx1MWVkYm5cIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gY1xcdTAwZjMgY2hcXHUxZWRicCBnaVxcdTFlYWR0XCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiQlxcdTAwZTNvXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIGxcXHUxZWRiblwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIkJcXHUwMGUzbyB2XFx1MDBlMGkgblxcdTAxYTFpXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBwaFxcdTAwZjluIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MWVkYmkgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwMGUxbmggc1xcdTAwZTFuZyBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5biBuXFx1MWViN25nXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIm1cXHUwMWIwYSBuaFxcdTFlYjlcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDFiMGEgdlxcdTFlZWJhXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwibVxcdTAxYjBhIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJtXFx1MDFiMGEgclxcdTFlYTV0IG5cXHUxZWI3bmdcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJtXFx1MDFiMGEgbFxcdTFlZDFjXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwibVxcdTAxYjBhIGxcXHUxZWExbmhcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG9cIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJ0dXlcXHUxZWJmdCByXFx1MDFhMWkgbmhcXHUxZWI5XCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwidHV5XFx1MWViZnRcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJ0dXlcXHUxZWJmdCBuXFx1MWViN25nIGhcXHUxZWExdFwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIm1cXHUwMWIwYSBcXHUwMTExXFx1MDBlMVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcInR1eVxcdTFlYmZ0IG1cXHUwMGY5IHRyXFx1MWVkZGlcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzXFx1MDFiMFxcdTAxYTFuZyBtXFx1MWVkZFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcImtoXFx1MDBmM2kgYlxcdTFlZTVpXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDExMVxcdTAwZTFtIG1cXHUwMGUyeVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcImJcXHUwMGUzbyBjXFx1MDBlMXQgdlxcdTAwZTAgbFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJzXFx1MDFiMFxcdTAxYTFuZyBtXFx1MDBmOVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImJcXHUxZWE3dSB0clxcdTFlZGRpIHF1YW5nIFxcdTAxMTFcXHUwMGUzbmdcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJtXFx1MDBlMnkgdGhcXHUwMWIwYVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIm1cXHUwMGUyeSByXFx1MWVhM2kgclxcdTAwZTFjXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwibVxcdTAwZTJ5IGNcXHUxZWU1bVwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIm1cXHUwMGUyeSBcXHUwMTExZW4gdSBcXHUwMGUxbVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcImxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiY1xcdTAxYTFuIGJcXHUwMGUzbyBuaGlcXHUxZWM3dCBcXHUwMTExXFx1MWVkYmlcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJiXFx1MDBlM28gbFxcdTFlZDFjXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwibFxcdTFlYTFuaFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIm5cXHUwMGYzbmdcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJnaVxcdTAwZjNcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJtXFx1MDFiMGEgXFx1MDExMVxcdTAwZTFcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJDaFxcdTFlYmYgXFx1MDExMVxcdTFlY2RcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJOaFxcdTFlYjkgbmhcXHUwMGUwbmdcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwMGMxbmggc1xcdTAwZTFuZyBuaFxcdTFlYjlcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHXFx1MDBlZG8gdGhvXFx1MWVhM25nXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiR2lcXHUwMGYzIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkdpXFx1MDBmMyB2XFx1MWVlYmEgcGhcXHUxZWEzaVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIkdpXFx1MDBmMyBtXFx1MWVhMW5oXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiR2lcXHUwMGYzIHhvXFx1MDBlMXlcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJMXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5IG5cXHUxZWI3bmdcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJCXFx1MDBlM29cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJCXFx1MDBlM28gY1xcdTFlYTVwIGxcXHUxZWRiblwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkJcXHUwMGUzbyBsXFx1MWVkMWNcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImFyXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkFyYWJpY1wiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjNcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDYyN1xcdTA2NDRcXHUwNjM5XFx1MDY0OFxcdTA2MjdcXHUwNjM1XFx1MDY0MSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjI3XFx1MDY0NFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmJcXHUwNjQyXFx1MDY0YVxcdTA2NDRcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyZVxcdTA2MzRcXHUwNjQ2XFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2NDVcXHUwNjJhXFx1MDY0OFxcdTA2MzNcXHUwNjM3IFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzOVxcdTA2MjdcXHUwNjQ0XFx1MDY0YSBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MjhcXHUwNjMxXFx1MDYyZlwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2NDdcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyYyBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDYzNVxcdTA2NDJcXHUwNjRhXFx1MDYzOVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyY1wiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA2MzZcXHUwNjI4XFx1MDYyN1xcdTA2MjhcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNjJmXFx1MDYyZVxcdTA2MjdcXHUwNjQ2XCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA2M2FcXHUwNjI4XFx1MDYyN1xcdTA2MzFcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDVcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNjMzXFx1MDY0NVxcdTA2MjdcXHUwNjIxIFxcdTA2MzVcXHUwNjI3XFx1MDY0MVxcdTA2NGFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDYzYVxcdTA2MjdcXHUwNjI2XFx1MDY0NSBcXHUwNjJjXFx1MDYzMlxcdTA2MjZcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDVcXHUwNjJhXFx1MDY0MVxcdTA2MzFcXHUwNjQyXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0NVxcdTA2MmFcXHUwNjQ2XFx1MDYyN1xcdTA2MmJcXHUwNjMxXFx1MDY0N1wiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0MlxcdTA2MjdcXHUwNjJhXFx1MDY0NVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MjdcXHUwNjMzXFx1MDYyYVxcdTA2NDhcXHUwNjI3XFx1MDYyNlxcdTA2NGFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDYzMlxcdTA2NDhcXHUwNjRhXFx1MDYzOVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNjI4XFx1MDYyN1xcdTA2MzFcXHUwNjJmXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDYyZFxcdTA2MjdcXHUwNjMxXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDYzMVxcdTA2NGFcXHUwNjI3XFx1MDYyZFwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDRcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MmZcXHUwNjI3XFx1MDYyZlwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA2NDdcXHUwNjI3XFx1MDYyZlxcdTA2MjZcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDRcXHUwNjM3XFx1MDY0YVxcdTA2NDFcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDVcXHUwNjM5XFx1MDYyYVxcdTA2MmZcXHUwNjQ0XCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjM5XFx1MDY0NFxcdTA2NGFcXHUwNjQ0XCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwNjMxXFx1MDY0YVxcdTA2MjdcXHUwNjJkIFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZlxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzlcXHUwNjQ2XFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjM1XFx1MDYyN1xcdTA2MzFcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcIm1rXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIk1hY2Vkb25pYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0M2NcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQzY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzhcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzZlxcdTA0MzBcXHUwNDMyXFx1MDQzOFxcdTA0NDZcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDFcXHUwNDNjXFx1MDQzZVxcdTA0MzNcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDM3XFx1MDQzMFxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDM1XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDM1XFx1MDQ0MVxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0NDBcXHUwNDQyXFx1MDQzYlxcdTA0M2VcXHUwNDMzXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDQ3XFx1MDQzOFxcdTA0NDFcXHUwNDQyXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZFxcdTA0MzVcXHUwNDNhXFx1MDQzZVxcdTA0M2JcXHUwNDNhXFx1MDQ0MyBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDNlXFx1MDQzNFxcdTA0MzJcXHUwNDNlXFx1MDQzNVxcdTA0M2RcXHUwNDM4IFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0M2ZcXHUwNDNiXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcXHUwNDE3XFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzN1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA0MWNcXHUwNDM4XFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTA0MjFcXHUwNDMyXFx1MDQzNVxcdTA0MzYgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiXFx1MDQxZFxcdTA0MzVcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNDExXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwic2tcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiU2xvdmFrXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiYlxcdTAwZmFya2Egc28gc2xhYlxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcImJcXHUwMGZhcmthIHMgZGFcXHUwMTdlXFx1MDEwZm9tXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiYlxcdTAwZmFya2Egc28gc2lsblxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIm1pZXJuYSBiXFx1MDBmYXJrYVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcImJcXHUwMGZhcmthXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwic2lsblxcdTAwZTEgYlxcdTAwZmFya2FcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJwcnVka1xcdTAwZTEgYlxcdTAwZmFya2FcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJiXFx1MDBmYXJrYSBzbyBzbGFiXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiYlxcdTAwZmFya2EgcyBtcmhvbGVuXFx1MDBlZG1cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlbmllXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwibXJob2xlbmllXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlbmllXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwic2xhYlxcdTAwZTkgcG9wXFx1MDE1NWNoYW5pZVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcInBvcFxcdTAxNTVjaGFuaWVcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzaWxuXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiamVtblxcdTAwZTkgbXJob2xlbmllXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIm1pZXJueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwic2lsblxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInZlXFx1MDEzZW1pIHNpbG5cXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW1ueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwibXJ6blxcdTAwZmFjaSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwic2xhYlxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwcmVoXFx1MDBlMW5rYVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwic2xhYlxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVcXHUwMTdlZW5pZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcInNpbG5cXHUwMGU5IHNuZVxcdTAxN2VlbmllXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiZFxcdTAwZTFcXHUwMTdlXFx1MDEwZiBzbyBzbmVob21cIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmVob3ZcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiaG1sYVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcImR5bVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwaWVza292XFx1MDBlOVxcL3ByYVxcdTAxNjFuXFx1MDBlOSB2XFx1MDBlZHJ5XCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiaG1sYVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25cXHUwMGUxIG9ibG9oYVwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcInRha21lciBqYXNub1wiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInBvbG9qYXNub1wiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJ6YW1yYVxcdTAxMGRlblxcdTAwZTlcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYlxcdTAwZmFya2FcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJpa1xcdTAwZTFuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImhvclxcdTAwZmFjb1wiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZldGVybm9cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJrcnVwb2JpdGllXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiTmFzdGF2ZW5pZVwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkJlenZldHJpZVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIlNsYWJcXHUwMGZkIHZcXHUwMGUxbm9rXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiSmVtblxcdTAwZmQgdmlldG9yXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiU3RyZWRuXFx1MDBmZCB2aWV0b3JcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTBjZXJzdHZcXHUwMGZkIHZpZXRvclwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5cXHUwMGZkIHZpZXRvclwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlNpbG5cXHUwMGZkIHZpZXRvciwgdGFrbWVyIHZcXHUwMGVkY2hyaWNhXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiVlxcdTAwZWRjaHJpY2FcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuXFx1MDBlMSB2XFx1MDBlZGNocmljYVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGZhcmthXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiTmlcXHUwMTBkaXZcXHUwMGUxIGJcXHUwMGZhcmthXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyaWtcXHUwMGUxblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiaHVcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiSHVuZ2FyaWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwidmloYXIgZW55aGUgZXNcXHUwMTUxdmVsXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidmloYXIgZXNcXHUwMTUxdmVsXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwidmloYXIgaGV2ZXMgZXNcXHUwMTUxdmVsXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiZW55aGUgeml2YXRhclwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcInZpaGFyXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGV2ZXMgdmloYXJcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJkdXJ2YSB2aWhhclwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcInZpaGFyIGVueWhlIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidmloYXIgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ2aWhhciBlclxcdTAxNTFzIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxuICAgICAgICAgICAgXCIzMDJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcInpcXHUwMGUxcG9yXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiZW55aGUgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwia1xcdTAwZjZ6ZXBlcyBlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZXZlcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJuYWd5b24gaGV2ZXMgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0clxcdTAwZTltIGVzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTAwZjNub3MgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ6XFx1MDBlMXBvclwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJlbnloZSBoYXZhelxcdTAwZTFzXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwiaGF2YXpcXHUwMGUxc1wiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImVyXFx1MDE1MXMgaGF2YXpcXHUwMGUxc1wiLFxuICAgICAgICAgICAgXCI2MTFcIjpcImhhdmFzIGVzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcImhcXHUwMGYzelxcdTAwZTFwb3JcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJneWVuZ2Uga1xcdTAwZjZkXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwia1xcdTAwZjZkXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwia1xcdTAwZjZkXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiaG9tb2t2aWhhclwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImtcXHUwMGY2ZFwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcInRpc3p0YSBcXHUwMGU5Z2JvbHRcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJrZXZcXHUwMGU5cyBmZWxoXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInN6XFx1MDBmM3J2XFx1MDBlMW55b3MgZmVsaFxcdTAxNTF6ZXRcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJlclxcdTAxNTFzIGZlbGhcXHUwMTUxemV0XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiYm9yXFx1MDBmYXMgXFx1MDBlOWdib2x0XCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkXFx1MDBmM1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRyXFx1MDBmM3B1c2kgdmloYXJcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWtcXHUwMGUxblwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImhcXHUwMTcxdlxcdTAwZjZzXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiZm9yclxcdTAwZjNcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzemVsZXNcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJqXFx1MDBlOWdlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJOeXVnb2R0XCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ3NlbmRlc1wiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkVueWhlIHN6ZWxsXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkZpbm9tIHN6ZWxsXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIktcXHUwMGY2emVwZXMgc3pcXHUwMGU5bFwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAwYzlsXFx1MDBlOW5rIHN6XFx1MDBlOWxcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJFclxcdTAxNTFzIHN6XFx1MDBlOWxcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJFclxcdTAxNTFzLCBtXFx1MDBlMXIgdmloYXJvcyBzelxcdTAwZTlsXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmloYXJvcyBzelxcdTAwZTlsXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiRXJcXHUwMTUxc2VuIHZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN6XFx1MDBlOWx2aWhhclwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlRvbWJvbFxcdTAwZjMgc3pcXHUwMGU5bHZpaGFyXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmlrXFx1MDBlMW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImNhXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJUZW1wZXN0YSBhbWIgcGx1amEgc3VhdVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiVGVtcGVzdGEgc3VhdVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlRlbXBlc3RhXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiVGVtcGVzdGEgZm9ydGFcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJUZW1wZXN0YSBpcnJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2ltIHN1YXVcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2luXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiVGVtcGVzdGEgYW1iIG1vbHQgcGx1Z2ltXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiUGx1Z2ltIHN1YXVcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJQbHVnaW1cIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJQbHVnaW0gaW50ZW5zXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1Z2ltIHN1YXVcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJQbHVnaW1cIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJQbHVnaW0gaW50ZW5zXCIsXG4gICAgICAgICAgICBcIjMxM1wiOlwiUGx1amFcIixcbiAgICAgICAgICAgIFwiMzE0XCI6XCJQbHVqYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiUGx1Z2ltXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiUGx1amEgc3VhdVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIlBsdWphXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiUGx1amEgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIlBsdWphIG1vbHQgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlBsdWphIGV4dHJlbWFcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJQbHVqYSBnbGFcXHUwMGU3YWRhXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiUGx1amEgc3VhdVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlBsdWphIHN1YXVcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJQbHVqYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjUzMVwiOlwiUGx1amEgaXJyZWd1bGFyXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwiTmV2YWRhIHN1YXVcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJOZXZhZGFcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIkFpZ3VhbmV1XCIsXG4gICAgICAgICAgICBcIjYxMlwiOlwiUGx1amEgZCdhaWd1YW5ldVwiLFxuICAgICAgICAgICAgXCI2MTVcIjpcIlBsdWdpbSBpIG5ldVwiLFxuICAgICAgICAgICAgXCI2MTZcIjpcIlBsdWphIGkgbmV1XCIsXG4gICAgICAgICAgICBcIjYyMFwiOlwiTmV2YWRhIHN1YXVcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJOZXZhZGFcIixcbiAgICAgICAgICAgIFwiNjIyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIkJvaXJhXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiRnVtXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiQm9pcmluYVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlNvcnJhXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiQm9pcmFcIixcbiAgICAgICAgICAgIFwiNzUxXCI6XCJTb3JyYVwiLFxuICAgICAgICAgICAgXCI3NjFcIjpcIlBvbHNcIixcbiAgICAgICAgICAgIFwiNzYyXCI6XCJDZW5kcmEgdm9sY1xcdTAwZTBuaWNhXCIsXG4gICAgICAgICAgICBcIjc3MVwiOlwiWFxcdTAwZTBmZWNcIixcbiAgICAgICAgICAgIFwiNzgxXCI6XCJUb3JuYWRvXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiQ2VsIG5ldFwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIkxsZXVnZXJhbWVudCBlbm51dm9sYXRcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJOXFx1MDBmYXZvbHMgZGlzcGVyc29zXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiTnV2b2xvc2l0YXQgdmFyaWFibGVcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJFbm51dm9sYXRcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJUb3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiVGVtcGVzdGEgdHJvcGljYWxcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJhY1xcdTAwZTBcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJGcmVkXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiQ2Fsb3JcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJWZW50XCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiUGVkcmFcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtYXRcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCcmlzYSBzdWF1XCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJpc2EgYWdyYWRhYmxlXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2EgbW9kZXJhZGFcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYSBmcmVzY2FcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzY2EgZm9yYVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgaW50ZW5zXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBzZXZlclwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGEgdmlvbGVudGFcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTBcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImhyXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkNyb2F0aWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgc2xhYm9tIGtpXFx1MDE2MW9tXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMga2lcXHUwMTYxb21cIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBqYWtvbSBraVxcdTAxNjFvbVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJhIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcImdybWxqYXZpbnNrYSBvbHVqYVwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcImpha2EgZ3JtbGphdmluc2thIG9sdWphXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwib3JrYW5za2EgZ3JtbGphdmluc2thIG9sdWphXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiZ3JtbGphdmluc2thIG9sdWphIHNhIHNsYWJvbSByb3N1bGpvbVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIHJvc3Vsam9tXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JtbGphdmluc2thIG9sdWphIHNhIGpha29tIHJvc3Vsam9tXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwicm9zdWxqYSBzbGFib2cgaW50ZW56aXRldGFcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJyb3N1bGphXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwicm9zdWxqYSBqYWtvZyBpbnRlbnppdGV0YVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBzbGFib2cgaW50ZW56aXRldGFcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb21cIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb20gamFrb2cgaW50ZW56aXRldGFcIixcbiAgICAgICAgICAgIFwiMzEzXCI6XCJwbGp1c2tvdmkgaSByb3N1bGphXCIsXG4gICAgICAgICAgICBcIjMxNFwiOlwicm9zdWxqYSBzIGpha2ltIHBsanVza292aW1hXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwicm9zdWxqYSBzIHBsanVza292aW1hXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYmEga2lcXHUwMTYxYVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcInVtamVyZW5hIGtpXFx1MDE2MWFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJraVxcdTAxNjFhIGpha29nIGludGVueml0ZXRhXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwidnJsbyBqYWthIGtpXFx1MDE2MWFcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJla3N0cmVtbmEga2lcXHUwMTYxYVwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcImxlZGVuYSBraVxcdTAxNjFhXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwicGxqdXNhayBzbGFib2cgaW50ZW56aXRldGFcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbGp1c2FrXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxqdXNhayBqYWtvZyBpbnRlbnppdGV0YVwiLFxuICAgICAgICAgICAgXCI1MzFcIjpcIm9sdWpuYSBraVxcdTAxNjFhIHMgcGxqdXNrb3ZpbWFcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiaSBzbmlqZWdcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmlqZWdcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJndXN0aSBzbmlqZWdcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJzdXNuamVcXHUwMTdlaWNhXCIsXG4gICAgICAgICAgICBcIjYxMlwiOlwic3VzbmplXFx1MDE3ZWljYSBzIHBsanVza292aW1hXCIsXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYmEga2lcXHUwMTYxYSBpIHNuaWplZ1wiLFxuICAgICAgICAgICAgXCI2MTZcIjpcImtpXFx1MDE2MWEgaSBzbmlqZWdcIixcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbmlqZWcgcyBwb3ZyZW1lbmltIHBsanVza292aW1hXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwic25pamVnIHMgcGxqdXNrb3ZpbWFcIixcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzbmlqZWcgcyBqYWtpbSBwbGp1c2tvdmltYVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcInN1bWFnbGljYVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcImRpbVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIml6bWFnbGljYVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcImtvdml0bGFjaSBwaWplc2thIGlsaSBwcmFcXHUwMTYxaW5lXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwibWFnbGFcIixcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwaWplc2FrXCIsXG4gICAgICAgICAgICBcIjc2MVwiOlwicHJhXFx1MDE2MWluYVwiLFxuICAgICAgICAgICAgXCI3NjJcIjpcInZ1bGthbnNraSBwZXBlb1wiLFxuICAgICAgICAgICAgXCI3NzFcIjpcInphcHVzaSB2amV0cmEgcyBraVxcdTAxNjFvbVwiLFxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJ2ZWRyb1wiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImJsYWdhIG5hb2JsYWthXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwicmFcXHUwMTYxdHJrYW5pIG9ibGFjaVwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcImlzcHJla2lkYW5pIG9ibGFjaVwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIm9ibGFcXHUwMTBkbm9cIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcHNrYSBvbHVqYVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiaGxhZG5vXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwidnJ1XFx1MDEwN2VcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2amV0cm92aXRvXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwidHVcXHUwMTBkYVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcImxhaG9yXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwicG92amV0YXJhY1wiLFxuICAgICAgICAgICAgXCI5NTNcIjpcInNsYWIgdmpldGFyXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwidW1qZXJlbiB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJ1bWplcmVubyBqYWsgdmpldGFyXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiamFrIHZqZXRhclwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTAxN2Vlc3RvayB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJvbHVqbmkgdmpldGFyXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiamFrIG9sdWpuaSB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJvcmthbnNraSB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJqYWsgb3JrYW5za2kgdmpldGFyXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwib3JrYW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImJsYW5rXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzEzXCI6XCJcIixcbiAgICAgICAgICAgIFwiMzE0XCI6XCJcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcIixcbiAgICAgICAgICAgIFwiNTMxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjEyXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjE1XCI6XCJcIixcbiAgICAgICAgICAgIFwiNjE2XCI6XCJcIixcbiAgICAgICAgICAgIFwiNjIwXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNjIyXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzUxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzYxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzYyXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzcxXCI6XCJcIixcbiAgICAgICAgICAgIFwiNzgxXCI6XCJcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcIlxuICAgICAgICB9XG4gICAgfVxufTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjAuMTAuMjAxNi5cbiAqL1xuZXhwb3J0IGNvbnN0IHdpbmRTcGVlZCA9IHtcbiAgICBcImVuXCI6e1xuICAgICAgICBcIlNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzAuMCwgMC4zXSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjAtMSAgIFNtb2tlIHJpc2VzIHN0cmFpZ2h0IHVwXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJDYWxtXCI6IHtcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzAuMywgMS42XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjEtMyBPbmUgY2FuIHNlZSBkb3dud2luZCBvZiB0aGUgc21va2UgZHJpZnRcIlxuICAgICAgICB9LFxuICAgICAgICBcIkxpZ2h0IGJyZWV6ZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEuNiwgMy4zXSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQtNiBPbmUgY2FuIGZlZWwgdGhlIHdpbmQuIFRoZSBsZWF2ZXMgb24gdGhlIHRyZWVzIG1vdmUsIHRoZSB3aW5kIGNhbiBsaWZ0IHNtYWxsIHN0cmVhbWVycy5cIlxuICAgICAgICB9LFxuICAgICAgICBcIkdlbnRsZSBCcmVlemVcIjp7XG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFszLjQsIDUuNV0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCI3LTEwIExlYXZlcyBhbmQgdHdpZ3MgbW92ZS4gV2luZCBleHRlbmRzIGxpZ2h0IGZsYWcgYW5kIHBlbm5hbnRzXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJNb2RlcmF0ZSBicmVlemVcIjp7XG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFs1LjUsIDguMF0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxMS0xNiAgIFRoZSB3aW5kIHJhaXNlcyBkdXN0IGFuZCBsb29zZSBwYXBlcnMsIHRvdWNoZXMgb24gdGhlIHR3aWdzIGFuZCBzbWFsbCBicmFuY2hlcywgc3RyZXRjaGVzIGxhcmdlciBmbGFncyBhbmQgcGVubmFudHNcIlxuICAgICAgICB9LFxuICAgICAgICBcIkZyZXNoIEJyZWV6ZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzguMCwgMTAuOF0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxNy0yMSAgIFNtYWxsIHRyZWVzIGluIGxlYWYgYmVnaW4gdG8gc3dheS4gVGhlIHdhdGVyIGJlZ2lucyBsaXR0bGUgd2F2ZXMgdG8gcGVha1wiXG4gICAgICAgIH0sXG4gICAgICAgIFwiU3Ryb25nIGJyZWV6ZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEwLjgsIDEzLjldLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjItMjcgICBMYXJnZSBicmFuY2hlcyBhbmQgc21hbGxlciB0cmliZXMgbW92ZXMuIFRoZSB3aGl6IG9mIHRlbGVwaG9uZSBsaW5lcy4gSXQgaXMgZGlmZmljdWx0IHRvIHVzZSB0aGUgdW1icmVsbGEuIEEgcmVzaXN0YW5jZSB3aGVuIHJ1bm5pbmcuXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEzLjksIDE3LjJdLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjgtMzMgICBXaG9sZSB0cmVlcyBpbiBtb3Rpb24uIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxuICAgICAgICB9LFxuICAgICAgICBcIkdhbGVcIjp7XG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxNy4yLCAyMC43XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjM0LTQwICAgVGhlIHdpbmQgYnJlYWsgdHdpZ3Mgb2YgdHJlZXMuIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxuICAgICAgICB9LFxuICAgICAgICBcIlNldmVyZSBHYWxlXCI6e1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjAuOCwgMjQuNV0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0MS00NyAgIEFsbCBsYXJnZSB0cmVlcyBzd2F5aW5nIGFuZCB0aHJvd3MuIFRpbGVzIGNhbiBibG93IGRvd24uXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJTdG9ybVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzI0LjUsIDI4LjVdLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDgtNTUgICBSYXJlIGlubGFuZC4gVHJlZXMgdXByb290ZWQuIFNlcmlvdXMgZGFtYWdlIHRvIGhvdXNlcy5cIlxuICAgICAgICB9LFxuICAgICAgICBcIlZpb2xlbnQgU3Rvcm1cIjp7XG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyOC41LCAzMi43XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjU2LTYzICAgT2NjdXJzIHJhcmVseSBhbmQgaXMgZm9sbG93ZWQgYnkgZGVzdHJ1Y3Rpb24uXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJIdXJyaWNhbmVcIjp7XG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFszMi43LCA2NF0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCJPY2N1cnMgdmVyeSByYXJlbHkuIFVudXN1YWxseSBzZXZlcmUgZGFtYWdlLlwiXG4gICAgICAgIH1cbiAgICB9XG59Oy8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxuICovXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMTMuMTAuMjAxNi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdG9yV2lkZ2V0IHtcbiAgICBjb25zdHJ1Y3RvcihpZCA9IDEsIGNpdHlfaWQgPSA1MjQ5MDEsIGtleSA9ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NzExJykge1xuXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9ICd0aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20nO1xuICAgICAgICB0aGlzLnNjcmlwdEQzU1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy9saWJzL2QzLm1pbi5qc2A7XG4gICAgICAgIHRoaXMuc2NyaXB0U1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanNgO1xuXG4gICAgICAgIHRoaXMuY29udHJvbHNXaWRnZXQgPSB7XG4gICAgICAgICAgICAvLyDQn9C10YDQstCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXG4gICAgICAgICAgICBjaXR5TmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1sZWZ0LW1lbnVfX2hlYWRlcicpLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbnVtYmVyJyksXG4gICAgICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19tZWFucycpLFxuICAgICAgICAgICAgd2luZFNwZWVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX3dpbmQnKSxcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19pbWcnKSxcbiAgICAgICAgICAgIGNhbGVuZGFySXRlbTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhbGVuZGFyX19pdGVtJyksXG4gICAgICAgICAgICBncmFwaGljOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpLFxuICAgICAgICAgICAgLy8g0JLRgtC+0YDQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxuICAgICAgICAgICAgY2l0eU5hbWUyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X190aXRsZScpLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmUyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fdGVtcGVyYXR1cmUnKSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlRmVlbHM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19mZWVscycpLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmVNaW46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0LWNhcmRfX3RlbXBlcmF0dXJlLW1pbicpLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmVNYXg6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0LWNhcmRfX3RlbXBlcmF0dXJlLW1heCcpLFxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub24yOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X19kZXNjcmlwdGlvbicpLFxuICAgICAgICAgICAgd2luZFNwZWVkMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3dpbmQtc3BlZWQnKSxcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19pY29uJyksXG4gICAgICAgICAgICBodW1pZGl0eTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2h1bWlkaXR5JyksXG4gICAgICAgICAgICBwcmVzc3VyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3ByZXNzdXJlJyksXG4gICAgICAgICAgICBkYXRlUmVwb3J0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X19kYXRlJyksXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XG5cbiAgICAgICAgLy8g0L7QsdGK0LXQutGCLdC60LDRgNGC0LAg0LTQu9GPINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNGPINCy0YHQtdGFINCy0LjQtNC20LXRgtC+0LIg0YEg0LrQvdC+0L/QutC+0Lkt0LjQvdC40YbQuNCw0YLQvtGA0L7QvCDQuNGFINCy0YvQt9C+0LLQsCDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INC60L7QtNCwXG4gICAgICAgIHRoaXMubWFwV2lkZ2V0cyA9IHtcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtYmx1ZScgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMiwgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgzLCBjaXR5X2lkLCBrZXkpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA0LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDQsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC01LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA1LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDUsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA2LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDYsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC03LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA3LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDcsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC04LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA4LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDgsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA5LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDksIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxMSxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMSwgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxMixcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMiwgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxMyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMywgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxNCxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCwgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC01LXJpZ2h0LWJyb3duJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMTUsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTUsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDE2LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE2LCBjaXR5X2lkLCBrZXkpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxNyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNywgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC04LXJpZ2h0LWJyb3duJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMTgsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTgsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDE5LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE5LCBjaXR5X2lkLCBrZXkpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC13aGl0ZScgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDIxLFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxLCBjaXR5X2lkLCBrZXkpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LXdoaXRlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMjIsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjIsIGNpdHlfaWQsIGtleSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiAyMyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMywgY2l0eV9pZCwga2V5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC13aGl0ZScgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDI0LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDI0LCBjaXR5X2lkLCBrZXkpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENvZGVGb3JHZW5lcmF0ZVdpZGdldChpZCwgY2l0eUlkID0gbnVsbCwga2V5LCBjaXR5TmFtZSA9IG51bGwpIHsgICAgICAgIFxuICAgICAgICBpZihpZCAmJiAoY2l0eUlkIHx8IGNpdHlOYW1lKSAmJiBrZXkpIHtcbiAgICAgICAgICAgIGxldCBjb2RlID0gJyc7XG4gICAgICAgICAgICBpZihpZCA9PT0gMSAmJiBpZCA9PT0gMTEgJiYgaWQ9PSAyMSkge1xuICAgICAgICAgICAgICAgIGNvZGUgPSBgPHNjcmlwdCBzcmM9XCJodHRwczovL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvZDMubWluLmpzXCI+PC9zY3JpcHQ+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBgJHtjb2RlfTxkaXYgaWQ9J29wZW53ZWF0aGVybWFwLXdpZGdldCc+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAke2lkfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHlpZDogJHtjaXR5SWR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwaWQ6IFwiJHtrZXl9XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldCcsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9ICdodHRwczovL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgPC9zY3JpcHQ+YDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNldEluaXRpYWxTdGF0ZUZvcm0oY2l0eUlkPTUyNDkwMSwgY2l0eU5hbWU9J01vc2NvdycpIHtcblxuICAgICAgICB0aGlzLnBhcmFtc1dpZGdldCA9IHtcbiAgICAgICAgICAgIGNpdHlJZDogY2l0eUlkLFxuICAgICAgICAgICAgY2l0eU5hbWU6IGNpdHlOYW1lLFxuICAgICAgICAgICAgbGFuZzogJ2VuJyxcbiAgICAgICAgICAgIGFwcGlkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpLnZhbHVlLFxuICAgICAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxuICAgICAgICAgICAgdGV4dFVuaXRUZW1wOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgweDAwQjApLCAgLy8gMjQ4XG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmJhc2VVUkwsXG4gICAgICAgICAgICB1cmxEb21haW46ICdodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZycsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxuICAgICAgICB0aGlzLmNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xuICAgICAgICB0aGlzLmNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXRpZXMnKTtcbiAgICAgICAgdGhpcy5zZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XG5cbiAgICAgICAgdGhpcy51cmxzID0ge1xuICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXI/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZjbnQ9OCZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXG4gICAgICAgIHdpbmRTcGVlZDogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uYCxcbiAgICAgICAgd2luZERpcmVjdGlvbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbmAsXG4gICAgICAgIGNsb3VkczogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL2Nsb3Vkcy1kYXRhLmpzb25gLFxuICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25gLFxuICAgICAgICB9O1xuICAgIH1cblxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXG4gKi9cblxuXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcblxuLyoqXG4g0JPRgNCw0YTQuNC6INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0Lgg0L/QvtCz0L7QtNGLXG4gQGNsYXNzIEdyYXBoaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpYyBleHRlbmRzIEN1c3RvbURhdGUge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIC8qKlxuICAgICog0LzQtdGC0L7QtCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0L7RgtGA0LjRgdC+0LLQutC4INC+0YHQvdC+0LLQvdC+0Lkg0LvQuNC90LjQuCDQv9Cw0YDQsNC80LXRgtGA0LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xuICAgICogW2xpbmUgZGVzY3JpcHRpb25dXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAqL1xuICAgIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uID0gZDMubGluZSgpXG4gICAgLngoKGQpID0+IHtcbiAgICAgIHJldHVybiBkLng7XG4gICAgfSlcbiAgICAueSgoZCkgPT4ge1xuICAgICAgcmV0dXJuIGQueTtcbiAgICB9KTtcbiAgfVxuXG4gICAgLyoqXG4gICAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINCyINC80LDRgdGB0LjQsiDQtNC70Y8g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPINCz0YDQsNGE0LjQutCwXG4gICAgICogQHBhcmFtICB7W2Jvb2xlYW5dfSB0ZW1wZXJhdHVyZSBb0L/RgNC40LfQvdCw0Log0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxuICAgICAqL1xuICBwcmVwYXJlRGF0YSgpIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3QgcmF3RGF0YSA9IFtdO1xuXG4gICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICByYXdEYXRhLnB1c2goeyB4OiBpLCBkYXRlOiBpLCBtYXhUOiBlbGVtLm1heCwgbWluVDogZWxlbS5taW4gfSk7XG4gICAgICBpICs9IDE7IC8vINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQvtGB0LggWFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJhd0RhdGE7XG4gIH1cblxuICAgIC8qKlxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W29iamVjdF19XG4gICAgICovXG4gIG1ha2VTVkcoKSB7XG4gICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLnBhcmFtcy5pZCkuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMnKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5wYXJhbXMud2lkdGgpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnI2ZmZmZmZicpO1xuICB9XG5cbiAgLyoqXG4gICog0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQvNC40L3QuNC80LDQu9C70YzQvdC+0LPQviDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINC/0L4g0L/QsNGA0LDQvNC10YLRgNGDINC00LDRgtGLXG4gICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxuICAqIEByZXR1cm4ge1tvYmplY3RdfSBkYXRhIFvQvtCx0YrQtdC60YIg0YEg0LzQuNC90LjQvNCw0LvRjNC90YvQvCDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0Lwg0LfQvdCw0YfQtdC90LjQtdC8XVxuICAqL1xuICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpIHtcbiAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgbWF4RGF0ZTogMCxcbiAgICAgIG1pbkRhdGU6IDEwMDAwLFxuICAgIH07XG5cbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGlmIChkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSB7XG4gICAgICAgIGRhdGEubWF4RGF0ZSA9IGVsZW0uZGF0ZTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSB7XG4gICAgICAgIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgICAvKipcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuXG4gIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpIHtcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIG1pbjogMTAwLFxuICAgICAgbWF4OiAwLFxuICAgIH07XG5cbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGlmIChkYXRhLm1pbiA+PSBlbGVtLm1pblQpIHtcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLm1pblQ7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5tYXhUKSB7XG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpIHtcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIG1pbjogMCxcbiAgICAgIG1heDogMCxcbiAgICB9O1xuXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5odW1pZGl0eSkge1xuICAgICAgICBkYXRhLm1pbiA9IGVsZW0uaHVtaWRpdHk7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xuICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSkge1xuICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xuICAgICAgICBkYXRhLm1heCA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG5cbiAgLyoqXG4gICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LTQu9C40L3RgyDQvtGB0LXQuSBYLFlcbiAgKiBbbWFrZUF4ZXNYWSBkZXNjcmlwdGlvbl1cbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxuICAqIEByZXR1cm4ge1tmdW5jdGlvbl19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAqL1xuICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcykge1xuICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFg9INGI0LjRgNC40L3QsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQu9C10LLQsCDQuCDRgdC/0YDQsNCy0LBcbiAgICBjb25zdCB4QXhpc0xlbmd0aCA9IHBhcmFtcy53aWR0aCAtICgyICogcGFyYW1zLm1hcmdpbik7XG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcbiAgICBjb25zdCB5QXhpc0xlbmd0aCA9IHBhcmFtcy5oZWlnaHQgLSAoMiAqIHBhcmFtcy5tYXJnaW4pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcbiAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXG4gICogQHBhcmFtICB7W29iamVjdF19ICByYXdEYXRhICAgICBb0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cbiAgKiBAcGFyYW0gIHtbdHlwZV19ICBtYXJnaW4gICAgICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxuICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cbiAgKi9cbiAgc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcykge1xuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSk7XG5cbiAgICAvKipcbiAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcbiAgICAqIFtzY2FsZVRpbWUgZGVzY3JpcHRpb25dXG4gICAgKi9cbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxuICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xuXG4gICAgLyoqXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcbiAgICAqIFtzY2FsZUxpbmVhciBkZXNjcmlwdGlvbl1cbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICovXG4gICAgY29uc3Qgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oW21heCArIDUsIG1pbiAtIDVdKVxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcblxuICAgIGNvbnN0IGRhdGEgPSBbXTtcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcbiAgICAgICAgbWF4VDogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WCxcbiAgICAgICAgbWluVDogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcbiAgfVxuXG4gIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbikge1xuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKTtcblxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXG4gICAgY29uc3Qgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcblxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihbbWF4LCBtaW5dKVxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sXG4gICAgICAgIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sXG4gICAgICAgIHJhaW5mYWxsQW1vdW50OiBzY2FsZVkoZWxlbS5yYWluZmFsbEFtb3VudCkgKyBtYXJnaW4sXG4gICAgICAgIGNvbG9yOiBlbGVtLmNvbG9yLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4geyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9O1xuICB9XG5cbiAgICAvKipcbiAgICAgKiDQpNC+0YDQvNC40LLQsNGA0L7QvdC40LUg0LzQsNGB0YHQuNCy0LAg0LTQu9GPINGA0LjRgdC+0LLQsNC90LjRjyDQv9C+0LvQuNC70LjQvdC40LhcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gW9C+0YLRgdGC0YPQvyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKSB7XG4gICAgY29uc3QgYXJyUG9seWxpbmUgPSBbXTtcbiAgICBkYXRhLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxuICAgICAgICB5OiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRZIH0sXG4gICAgICApO1xuICAgIH0pO1xuICAgIGRhdGEucmV2ZXJzZSgpLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxuICAgICAgICB5OiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRZLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgYXJyUG9seWxpbmUucHVzaCh7XG4gICAgICB4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXG4gICAgICB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLm1heFQpICsgcGFyYW1zLm9mZnNldFksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXJyUG9seWxpbmU7XG4gIH1cbiAgICAvKipcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L/QvtC70LjQu9C40L3QuNC5INGBINC30LDQu9C40LLQutC+0Lkg0L7RgdC90L7QstC90L7QuSDQuCDQuNC80LjRgtCw0YbQuNGPINC10LUg0YLQtdC90LhcbiAgICAgKiBbZHJhd1BvbHVsaW5lIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICBkcmF3UG9seWxpbmUoc3ZnLCBkYXRhKSB7XG4gICAgICAgIC8vINC00L7QsdCw0LLQu9GP0LXQvCDQv9GD0YLRjCDQuCDRgNC40YHRg9C10Lwg0LvQuNC90LjQuFxuXG4gICAgc3ZnLmFwcGVuZCgnZycpLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMucGFyYW1zLnN0cm9rZVdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfVxuICAvKipcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQtNC/0LjRgdC10Lkg0YEg0L/QvtC60LDQt9Cw0YLQtdC70Y/QvNC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0L3QsCDQvtGB0Y/RhVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpIHtcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpID0+IHtcbiAgICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDRgtC10LrRgdGC0LBcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCBlbGVtLngpXG4gICAgICAuYXR0cigneScsIChlbGVtLm1heFQgLSAyKSAtIChwYXJhbXMub2Zmc2V0WCAvIDIpKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIHBhcmFtcy5mb250U2l6ZSlcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXG4gICAgICAudGV4dChgJHtwYXJhbXMuZGF0YVtpdGVtXS5tYXh9wrBgKTtcblxuICAgICAgc3ZnLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcbiAgICAgIC5hdHRyKCd5JywgKGVsZW0ubWluVCArIDcpICsgKHBhcmFtcy5vZmZzZXRZIC8gMikpXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxuICAgICAgLnN0eWxlKCdzdHJva2UnLCBwYXJhbXMuZm9udENvbG9yKVxuICAgICAgLnN0eWxlKCdmaWxsJywgcGFyYW1zLmZvbnRDb2xvcilcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1pbn3CsGApO1xuICAgIH0pO1xuICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcbiAgICAgKiBbcmVuZGVyIGRlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3ZnID0gdGhpcy5tYWtlU1ZHKCk7XG4gICAgY29uc3QgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcblxuICAgIGNvbnN0IHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfSA9IHRoaXMubWFrZUF4ZXNYWShyYXdEYXRhLCB0aGlzLnBhcmFtcyk7XG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xuICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xuICAgIHRoaXMuZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICAvLyB0aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJccmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcciAgICB2YXIgZ2VuZXJhdG9yID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJtLWxhbmRpbmctd2lkZ2V0Jyk7XHIgICAgY29uc3QgcG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAnKTtcciAgICBjb25zdCBwb3B1cENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNsb3NlJyk7XHIgICAgY29uc3QgY29udGVudEpTR2VuZXJhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1jb2RlLWdlbmVyYXRlJyk7XHIgICAgY29uc3QgY29weUNvbnRlbnRKU0NvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29weS1qcy1jb2RlJyk7XHIgICAgY29uc3QgYXBpS2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKTtcclxyICAgIC8vINCk0LjQutGB0LjRgNGD0LXQvCDQutC70LjQutC4INC90LAg0YTQvtGA0LzQtSwg0Lgg0L7RgtC60YDRi9Cy0LDQtdC8IHBvcHVwINC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRg1xyICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyICAgICAgICBpZihldmVudC50YXJnZXQuaWQgJiYgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY29udGFpbmVyLWN1c3RvbS1jYXJkX19idG4nKSkge1xyICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KGV2ZW50LnRhcmdldC5pZCwgd2luZG93LmNpdHlJZCwgYXBpS2V5LnZhbHVlKTtcciAgICAgICAgICAgIGRlYnVnZ2VyO1xyICAgICAgICAgICAgaWYgKHdpbmRvdy5jaXR5aWQgJiYgYXBpS2V5LnZhbHVlKVxyICAgICAgICAgICAgY29uc29sZS5sb2coZ2VuZXJhdGVXaWRnZXQoZ2VuZXJhdGVXaWRnZXQubWFwV2lkZ2V0c1tldmVudC50YXJnZXQuaWRdWydpZCddLCB3aW5kb3cuY2l0eUlkLCBhcGlLZXkudmFsdWUpKTsgICAgXHIgICAgICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnY29kZSddO1xyICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLXZpc2libGUnKSl7XHIgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLXZpc2libGUnKTtcciAgICAgICAgICAgICAgICBzd2l0Y2goZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnc2NoZW1hJ10pIHtcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmx1ZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdub25lJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgfVxyICAgICAgICB9XHIgICAgfSk7XHJcciAgICAvLyDQl9Cw0LrRgNGL0LLQsNC10Lwg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrRgNC10YHRgtC40LpcciAgICBwb3B1cENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHIgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS12aXNpYmxlJykpXHIgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLXZpc2libGUnKTtcciAgICB9KTtcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyICAgICAgICAvL3ZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHIgICAgICAgIC8vcmFuZ2Uuc2VsZWN0Tm9kZShjb250ZW50SlNHZW5lcmF0aW9uKTtcciAgICAgICAgLy93aW5kb3cuZ2V0U2VsZWN0aW9uKCkuYWRkUmFuZ2UocmFuZ2UpO1xyICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnNlbGVjdCgpO1xyXHIgICAgICAgIHRyeXtcciAgICAgICAgICAgIGNvbnN0IHR4dENvcHkgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xyICAgICAgICAgICAgdmFyIG1zZyA9IHR4dENvcHkgPyAnc3VjY2Vzc2Z1bCcgOiAndW5zdWNjZXNzZnVsJztcciAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3B5IGVtYWlsIGNvbW1hbmQgd2FzICcgKyBtc2cpO1xyICAgICAgICB9XHIgICAgICAgIGNhdGNoKGUpe1xyICAgICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQutC+0L/QuNGA0L7QstCw0L3QuNGPICR7ZS5lcnJMb2dUb0NvbnNvbGV9YCk7XHIgICAgICAgIH1cclxyICAgICAgICAvLyDQodC90Y/RgtC40LUg0LLRi9C00LXQu9C10L3QuNGPIC0g0JLQndCY0JzQkNCd0JjQlTog0LLRiyDQtNC+0LvQttC90Ysg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMXHIgICAgICAgIC8vIHJlbW92ZVJhbmdlKHJhbmdlKSDQutC+0LPQtNCwINGN0YLQviDQstC+0LfQvNC+0LbQvdC+XHIgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcciAgICB9KTtcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmRpc2FibGVkID0gIWRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCgnY29weScpO1xyfSk7XHJcciIsIi8vINCc0L7QtNGD0LvRjCDQtNC40YHQv9C10YLRh9C10YAg0LTQu9GPINC+0YLRgNC40YHQvtCy0LrQuCDQsdCw0L3QvdC10YDRgNC+0LIg0L3QsCDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LVcbmltcG9ydCBDaXRpZXMgZnJvbSAnLi9jaXRpZXMnO1xuaW1wb3J0IFBvcHVwIGZyb20gJy4vcG9wdXAnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXG4gICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxuICAgIGNvbnN0IGNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xuICAgIGNvbnN0IGNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXRpZXMnKTtcbiAgICBjb25zdCBzZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XG5cbiAgICBjb25zdCBvYmpDaXRpZXMgPSBuZXcgQ2l0aWVzKGNpdHlOYW1lLCBjaXRpZXMpO1xuICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcblxuXG4gICAgc2VhcmNoQ2l0eS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICBjb25zdCBvYmpDaXRpZXMgPSBuZXcgQ2l0aWVzKGNpdHlOYW1lLCBjaXRpZXMpO1xuICAgICAgb2JqQ2l0aWVzLmdldENpdGllcygpO1xuXG4gICAgfSk7XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXG4gKi9cblxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XG5pbXBvcnQgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMtZDNqcyc7XG5pbXBvcnQgKiBhcyBuYXR1cmFsUGhlbm9tZW5vbiAgZnJvbSAnLi9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhJztcbmltcG9ydCAqIGFzIHdpbmRTcGVlZCBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcbmltcG9ydCAqIGFzIHdpbmREaXJlY3Rpb24gZnJvbSAnLi9kYXRhL3dpbmQtc3BlZWQtZGF0YSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYXRoZXJXaWRnZXQgZXh0ZW5kcyBDdXN0b21EYXRlIHtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XG4gICAgdGhpcy51cmxzID0gdXJscztcblxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCINC/0YPRgdGC0YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XG4gICAgdGhpcy53ZWF0aGVyID0ge1xuICAgICAgZnJvbUFQSToge1xuICAgICAgICBjb29yZDoge1xuICAgICAgICAgIGxvbjogJzAnLFxuICAgICAgICAgIGxhdDogJzAnLFxuICAgICAgICB9LFxuICAgICAgICB3ZWF0aGVyOiBbe1xuICAgICAgICAgIGlkOiAnICcsXG4gICAgICAgICAgbWFpbjogJyAnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnICcsXG4gICAgICAgICAgaWNvbjogJyAnLFxuICAgICAgICB9XSxcbiAgICAgICAgYmFzZTogJyAnLFxuICAgICAgICBtYWluOiB7XG4gICAgICAgICAgdGVtcDogMCxcbiAgICAgICAgICBwcmVzc3VyZTogJyAnLFxuICAgICAgICAgIGh1bWlkaXR5OiAnICcsXG4gICAgICAgICAgdGVtcF9taW46ICcgJyxcbiAgICAgICAgICB0ZW1wX21heDogJyAnLFxuICAgICAgICB9LFxuICAgICAgICB3aW5kOiB7XG4gICAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgICAgZGVnOiAnICcsXG4gICAgICAgIH0sXG4gICAgICAgIHJhaW46IHt9LFxuICAgICAgICBjbG91ZHM6IHtcbiAgICAgICAgICBhbGw6ICcgJyxcbiAgICAgICAgfSxcbiAgICAgICAgZHQ6ICcnLFxuICAgICAgICBzeXM6IHtcbiAgICAgICAgICB0eXBlOiAnICcsXG4gICAgICAgICAgaWQ6ICcgJyxcbiAgICAgICAgICBtZXNzYWdlOiAnICcsXG4gICAgICAgICAgY291bnRyeTogJyAnLFxuICAgICAgICAgIHN1bnJpc2U6ICcgJyxcbiAgICAgICAgICBzdW5zZXQ6ICcgJyxcbiAgICAgICAgfSxcbiAgICAgICAgaWQ6ICcgJyxcbiAgICAgICAgbmFtZTogJ1VuZGVmaW5lZCcsXG4gICAgICAgIGNvZDogJyAnLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgaHR0cEdldCh1cmwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xuICAgICAgfTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2VuZChudWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xuICAgKi9cbiAgZ2V0V2VhdGhlckZyb21BcGkoKSB7XG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy51cmxXZWF0aGVyQVBJKVxuICAgICAgICAudGhlbihcbiAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZnJvbUFQSSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSBuYXR1cmFsUGhlbm9tZW5vbi5uYXR1cmFsUGhlbm9tZW5vblt0aGlzLnBhcmFtcy5sYW5nXS5kZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHdpbmRTcGVlZC53aW5kU3BlZWRbdGhpcy5wYXJhbXMubGFuZ107XG4gICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxuICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INGB0LXQu9C10LrRgtC+0YAg0L/QviDQt9C90LDRh9C10L3QuNGOINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQsiBKU09OXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBKU09OXG4gICAqIEBwYXJhbSB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWxlbWVudE5hbWUg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwLNC00LvRjyDQv9C+0LjRgdC60LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXG4gICAqIEByZXR1cm4ge3N0cmluZ30g0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXG4gICAqL1xuICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdID09PSAnb2JqZWN0JyAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCkge1xuICAgICAgICBpZiAoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSkge1xuICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgdC+INC30L3QsNGH0LXQvdC40LXQvCDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCDRgSDQtNCy0YPQvNGPINGN0LvQtdC80LXQvdGC0LDQvNC4INCyIEpTT05cbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudE5hbWUyICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZTJdKSB7XG4gICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiBKU09OINGBINC80LXRgtC10L7QtNCw0L3Ri9C80LhcbiAgICogQHBhcmFtIGpzb25EYXRhXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgcGFyc2VEYXRhRnJvbVNlcnZlcigpIHtcbiAgICBjb25zdCB3ZWF0aGVyID0gdGhpcy53ZWF0aGVyO1xuXG4gICAgaWYgKHdlYXRoZXIuZnJvbUFQSS5uYW1lID09PSAnVW5kZWZpbmVkJyB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSAnNDA0Jykge1xuICAgICAgY29uc29sZS5sb2coJ9CU0LDQvdC90YvQtSDQvtGCINGB0LXRgNCy0LXRgNCwINC90LUg0L/QvtC70YPRh9C10L3RiycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7XG4gICAgICBjbG91ZGluZXNzOiAnICcsXG4gICAgICBkdDogJyAnLFxuICAgICAgY2l0eU5hbWU6ICcgJyxcbiAgICAgIGljb246ICcgJyxcbiAgICAgIHRlbXBlcmF0dXJlOiAnICcsXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogJyAnLFxuICAgICAgdGVtcGVyYXR1cmVNQXg6ICcgJyxcbiAgICAgIHByZXNzdXJlOiAnICcsXG4gICAgICBodW1pZGl0eTogJyAnLFxuICAgICAgc3VucmlzZTogJyAnLFxuICAgICAgc3Vuc2V0OiAnICcsXG4gICAgICBjb29yZDogJyAnLFxuICAgICAgd2luZDogJyAnLFxuICAgICAgd2VhdGhlcjogJyAnLFxuICAgIH07XG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wLnRvRml4ZWQoMCksIDEwKSArIDA7XG4gICAgbWV0YWRhdGEuY2l0eU5hbWUgPSBgJHt3ZWF0aGVyLmZyb21BUEkubmFtZX0sICR7d2VhdGhlci5mcm9tQVBJLnN5cy5jb3VudHJ5fWA7XG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmUgPSB0ZW1wZXJhdHVyZTsgLy8gYCR7dGVtcCA+IDAgPyBgKyR7dGVtcH1gIDogdGVtcH1gO1xuICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlTWluID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcF9taW4udG9GaXhlZCgwKSwgMTApICsgMDtcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1heCA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWF4LnRvRml4ZWQoMCksIDEwKSArIDA7XG4gICAgaWYgKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pIHtcbiAgICAgIG1ldGFkYXRhLndlYXRoZXIgPSB3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uW3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmlkXTtcbiAgICB9XG4gICAgaWYgKHdlYXRoZXIud2luZFNwZWVkKSB7XG4gICAgICBtZXRhZGF0YS53aW5kU3BlZWQgPSBgV2luZDogJHt3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpfSBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyLndpbmRTcGVlZCwgd2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKSwgJ3NwZWVkX2ludGVydmFsJyl9YDtcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZDIgPSBgJHt3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpfSBtL3NgO1xuICAgIH1cbiAgICBpZiAod2VhdGhlci53aW5kRGlyZWN0aW9uKSB7XG4gICAgICBtZXRhZGF0YS53aW5kRGlyZWN0aW9uID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXSwgXCJkZWdfaW50ZXJ2YWxcIil9YFxuICAgIH1cbiAgICBpZiAod2VhdGhlci5jbG91ZHMpIHtcbiAgICAgIG1ldGFkYXRhLmNsb3VkcyA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIuY2xvdWRzLCB3ZWF0aGVyLmZyb21BUEkuY2xvdWRzLmFsbCwgJ21pbicsICdtYXgnKX1gO1xuICAgIH1cblxuICAgIG1ldGFkYXRhLmh1bWlkaXR5ID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4uaHVtaWRpdHl9JWA7XG4gICAgbWV0YWRhdGEucHJlc3N1cmUgPSAgYCR7d2VhdGhlcltcImZyb21BUElcIl1bXCJtYWluXCJdW1wicHJlc3N1cmVcIl19IG1iYDtcbiAgICBtZXRhZGF0YS5pY29uID0gYCR7d2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWNvbn1gO1xuXG4gICAgdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xuICB9XG5cbiAgcmVuZGVyV2lkZ2V0KG1ldGFkYXRhKSB7XG4gICAgLy8g0J7QvtGC0YDQuNGB0L7QstC60LAg0L/QtdGA0LLRi9GFINGH0LXRgtGL0YDQtdGFINCy0LjQtNC20LXRgtC+0LJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBtZXRhZGF0YS5jaXR5TmFtZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZSkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZVtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3BhbiBjbGFzcz0nd2VhdGhlci1sZWZ0LWNhcmRfX2RlZ3JlZSc+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24pIHtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZCkge1xuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICAgIHRoaXMuY29udHJvbHMud2luZFNwZWVkW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndpbmRTcGVlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDQv9GP0YLQuCDQv9C+0YHQu9C10LTQvdC40YUg0LLQuNC00LbQtdGC0L7QslxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMikge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMikge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVscy5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHNbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4pIHtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW5bZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXgpIHtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXhbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1ldGFkYXRhLndlYXRoZXIpIHtcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMikge1xuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZDIgJiYgbWV0YWRhdGEud2luZERpcmVjdGlvbikge1xuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkMikge1xuICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWQyW2VsZW1dLmlubmVyVGV4dCA9IGAke21ldGFkYXRhLndpbmRTcGVlZDJ9ICR7bWV0YWRhdGEud2luZERpcmVjdGlvbn1gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMikge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1ldGFkYXRhLmh1bWlkaXR5KSB7XG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5odW1pZGl0eSkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9scy5odW1pZGl0eS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICAgIHRoaXMuY29udHJvbHMuaHVtaWRpdHlbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEuaHVtaWRpdHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEucHJlc3N1cmUpIHtcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnByZXNzdXJlKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnByZXNzdXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgICAgdGhpcy5jb250cm9scy5wcmVzc3VyZVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5wcmVzc3VyZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyDQn9GA0L7Qv9C40YHRi9Cy0LDQtdC8INGC0LXQutGD0YnRg9GOINC00LDRgtGDINCyINCy0LjQtNC20LXRgtGLXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydCkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnRbZWxlbV0uaW5uZXJUZXh0ID0gdGhpcy5nZXRUaW1lRGF0ZUhITU1Nb250aERheSgpO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgaWYgKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KSB7XG4gICAgICB0aGlzLnByZXBhcmVEYXRhRm9yR3JhcGhpYygpO1xuICAgIH1cbiAgfVxuXG4gIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpIHtcbiAgICBjb25zdCBhcnIgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0KSB7XG4gICAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheU5hbWVPZldlZWtCeURheU51bWJlcih0aGlzLmdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCkpO1xuICAgICAgYXJyLnB1c2goe1xuICAgICAgICBtaW46IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXG4gICAgICAgIG1heDogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcbiAgICAgICAgZGF5OiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXG4gICAgICAgIGljb246IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICBkYXRlOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XG4gIH1cblxuICAvKipcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaW5kZXgpID0+IHtcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMTBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyAyMF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbiwgY29sb3IgPSBmYWxzZSkge1xuICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxuICAgIGNvbnN0IG1hcEljb25zID0gbmV3IE1hcCgpO1xuXG4gICAgaWYgKCFjb2xvcikge1xuICAgICAgLy9cbiAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwM2QnLCAnMDNkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwNWQnLCAnMDVkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwOGQnLCAnMDhkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcxMWQnLCAnMTFkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XG4gICAgICAvLyDQndC+0YfQvdGL0LVcbiAgICAgIG1hcEljb25zLnNldCgnMDFuJywgJzAxZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDZuJywgJzA2ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDluJywgJzA5ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMTNuJywgJzEzZGJ3Jyk7XG5cbiAgICAgIGlmIChtYXBJY29ucy5nZXQobmFtZUljb24pKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLnBhcmFtcy5iYXNlVVJMfS9pbWcvd2lkZ2V0cy8ke21hcEljb25zLmdldChuYW1lSWNvbil9LnBuZ2A7XG4gICAgICB9XG4gICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcbiAgICB9XG4gICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bmFtZUljb259LnBuZ2A7XG4gIH1cblxuICAvKipcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGBINC/0L7QvNC+0YnRjNGOINCx0LjQsdC70LjQvtGC0LXQutC4IEQzXG4gICAqL1xuICBkcmF3R3JhcGhpY0QzKGRhdGEpIHtcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKTtcblxuICAgIC8vINCe0YfQuNGB0YLQutCwINC60L7QvdGC0LXQudC90LXRgNC+0LIg0LTQu9GPINCz0YDQsNGE0LjQutC+0LIgICAgXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKTtcbiAgICBjb25zdCBzdmcxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMxJyk7XG4gICAgY29uc3Qgc3ZnMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMicpO1xuXG4gICAgaWYoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKSB7XG4gICAgICBzdmcucmVtb3ZlQ2hpbGQoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcbiAgICB9XG4gICAgaWYoc3ZnMS5xdWVyeVNlbGVjdG9yKCdzdmcnKSkge1xuICAgICAgc3ZnMS5yZW1vdmVDaGlsZChzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcbiAgICB9XG4gICAgaWYoc3ZnMi5xdWVyeVNlbGVjdG9yKCdzdmcnKSl7XG4gICAgICBzdmcyLnJlbW92ZUNoaWxkKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xuICAgIH1cblxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGlkOiAnI2dyYXBoaWMnLFxuICAgICAgZGF0YSxcbiAgICAgIG9mZnNldFg6IDE1LFxuICAgICAgb2Zmc2V0WTogMTAsXG4gICAgICB3aWR0aDogNDIwLFxuICAgICAgaGVpZ2h0OiA3OSxcbiAgICAgIHJhd0RhdGE6IFtdLFxuICAgICAgbWFyZ2luOiAxMCxcbiAgICAgIGNvbG9yUG9saWx5bmU6ICcjMzMzJyxcbiAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICBmb250Q29sb3I6ICcjMzMzJyxcbiAgICAgIHN0cm9rZVdpZHRoOiAnMXB4JyxcbiAgICB9O1xuXG4gICAgLy8g0KDQtdC60L7QvdGB0YLRgNGD0LrRhtC40Y8g0L/RgNC+0YbQtdC00YPRgNGLINGA0LXQvdC00LXRgNC40L3Qs9CwINCz0YDQsNGE0LjQutCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcbiAgICBsZXQgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XG5cbiAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0L7RgdGC0LDQu9GM0L3Ri9GFINCz0YDQsNGE0LjQutC+0LJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMxJztcbiAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9ICcjRERGNzMwJztcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcblxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzInO1xuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xuICAgIG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xuICB9XG5cblxuICAvKipcbiAgICog0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDQs9GA0LDRhNC40LrQsCDQv9C+0LPQvtC00Ysg0L3QsCDQvdC10LTQtdC70Y5cbiAgICovXG4gIGRyYXdHcmFwaGljKGFycikge1xuICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGFycik7XG5cbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jb250cm9scy5ncmFwaGljLndpZHRoID0gNDY1O1xuICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcblxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgNjAwLCAzMDApO1xuXG4gICAgY29udGV4dC5mb250ID0gJ09zd2FsZC1NZWRpdW0sIEFyaWFsLCBzYW5zLXNlcmkgMTRweCc7XG5cbiAgICBsZXQgc3RlcCA9IDU1O1xuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCB6b29tID0gNDtcbiAgICBjb25zdCBzdGVwWSA9IDY0O1xuICAgIGNvbnN0IHN0ZXBZVGV4dFVwID0gNTg7XG4gICAgY29uc3Qgc3RlcFlUZXh0RG93biA9IDc1O1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5tb3ZlVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5tYXh9wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWVRleHRVcCk7XG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XG4gICAgaSArPSAxO1xuICAgIHdoaWxlIChpIDwgYXJyLmxlbmd0aCkge1xuICAgICAgc3RlcCArPSA1NTtcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xuICAgICAgaSArPSAxO1xuICAgIH1cbiAgICBpIC09IDE7XG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XG4gICAgc3RlcCA9IDU1O1xuICAgIGkgPSAwO1xuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWlufcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFlUZXh0RG93bik7XG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XG4gICAgaSArPSAxO1xuICAgIHdoaWxlIChpIDwgYXJyLmxlbmd0aCkge1xuICAgICAgc3RlcCArPSA1NTtcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcbiAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWlufcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFlUZXh0RG93bik7XG4gICAgICBpICs9IDE7XG4gICAgfVxuICAgIGkgLT0gMTtcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzJztcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzMzMyc7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XG4gIH1cblxufVxuIl19
