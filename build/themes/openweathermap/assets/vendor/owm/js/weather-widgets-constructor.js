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

    _createClass(GeneratorWidget, [{
        key: 'validationAPIkey',
        value: function validationAPIkey() {
            var validationAPI = function validationAPI() {
                var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&units=metric&cnt=8&appid=' + this.controlsWidget.apiKey.value;
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
                    code = '<script src=\'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js\'></script>';
                }
                return code + '<div id=\'openweathermap-widget\'></div>\n                    <script type=\'text/javascript\'>\n                    window.myWidgetParam = {\n                        id: ' + id + ',\n                        cityid: ' + this.paramsWidget.cityId + ',\n                        appid: \'' + this.paramsWidget.appid.replace('2d90837ddbaeda36ab487f257829b667', '') + '\',\n                        containerid: \'openweathermap-widget\',\n                    };\n                    (function() {\n                        var script = document.createElement(\'script\');\n                        script.type = \'text/javascript\';\n                        script.async = true;\n                        script.src = \'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js\';\n                        var s = document.getElementsByTagName(\'script\')[0];\n                        s.parentNode.insertBefore(script, s);\n                    })();\n                  </script>';
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
                appid: document.getElementById('api-key').value || '2d90837ddbaeda36ab487f257829b667',
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

},{"./custom-date":2,"./data/natural-phenomenon-data":3,"./data/wind-speed-data":4,"./graphic-d3js":6}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvY2l0aWVzLmpzIiwiYXNzZXRzL2pzL2N1c3RvbS1kYXRlLmpzIiwiYXNzZXRzL2pzL2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanMiLCJhc3NldHMvanMvZGF0YS93aW5kLXNwZWVkLWRhdGEuanMiLCJhc3NldHMvanMvZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0cy9qcy9ncmFwaGljLWQzanMuanMiLCJhc3NldHMvanMvcG9wdXAuanMiLCJhc3NldHMvanMvc2NyaXB0LmpzIiwiYXNzZXRzL2pzL3dlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O3FqQkNBQTs7OztBQUlBOzs7O0FBQ0E7Ozs7Ozs7O0lBRXFCLE07QUFFbkIsa0JBQVksUUFBWixFQUFzQixTQUF0QixFQUFpQztBQUFBOztBQUUvQixRQUFNLGlCQUFpQiwrQkFBdkI7QUFDQSxtQkFBZSxtQkFBZjs7QUFFQSxRQUFJLENBQUMsU0FBUyxLQUFkLEVBQXFCO0FBQ25CLGFBQU8sS0FBUDtBQUNEOztBQUVELFNBQUssUUFBTCxHQUFnQixTQUFTLEtBQVQsQ0FBZSxPQUFmLENBQXVCLFFBQXZCLEVBQWdDLEdBQWhDLEVBQXFDLFdBQXJDLEVBQWhCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLGFBQWEsRUFBOUI7QUFDQSxTQUFLLEdBQUwsa0RBQXdELEtBQUssUUFBN0Q7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFuQjtBQUNBLFNBQUssV0FBTCxDQUFpQixTQUFqQixHQUE2QixZQUE3QjtBQUNBLFNBQUssV0FBTCxDQUFpQixLQUFqQixHQUF5Qix1QkFBekI7O0FBRUEsUUFBTSxZQUFZLDRCQUFrQixlQUFlLFlBQWpDLEVBQStDLGVBQWUsY0FBOUQsRUFBOEUsZUFBZSxJ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TSxFQXBCSTtBQXFCVixtQkFBTSxFQXJCSTtBQXNCVixtQkFBTSxFQXRCSTtBQXVCVixtQkFBTSxFQXZCSTtBQXdCVixtQkFBTSxFQXhCSTtBQXlCVixtQkFBTSxFQXpCSTtBQTBCVixtQkFBTSxFQTFCSTtBQTJCVixtQkFBTSxFQTNCSTtBQTRCVixtQkFBTSxFQTVCSTtBQTZCVixtQkFBTSxFQTdCSTtBQThCVixtQkFBTSxFQTlCSTtBQStCVixtQkFBTSxFQS9CSTtBQWdDVixtQkFBTSxFQWhDSTtBQWlDVixtQkFBTSxFQWpDSTtBQWtDVixtQkFBTSxFQWxDSTtBQW1DVixtQkFBTSxFQW5DSTtBQW9DVixtQkFBTSxFQXBDSTtBQXFDVixtQkFBTSxFQXJDSTtBQXNDVixtQkFBTSxFQXRDSTtBQXVDVixtQkFBTSxFQXZDSTtBQXdDVixtQkFBTSxFQXhDSTtBQXlDVixtQkFBTSxFQXpDSTtBQTBDVixtQkFBTSxFQTFDSTtBQTJDVixtQkFBTSxFQTNDSTtBQTRDVixtQkFBTSxFQTVDSTtBQTZDVixtQkFBTSxFQTdDSTtBQThDVixtQkFBTSxFQTlDSTtBQStDVixtQkFBTSxFQS9DSTtBQWdEVixtQkFBTSxFQWhESTtBQWlEVixtQkFBTSxFQWpESTtBQWtEVixtQkFBTSxFQWxESTtBQW1EVixtQkFBTSxFQW5ESTtBQW9EVixtQkFBTSxFQXBESTtBQXFEVixtQkFBTSxFQXJESTtBQXNEVixtQkFBTSxFQXRESTtBQXVEVixtQkFBTSxFQXZESTtBQXdEVixtQkFBTSxFQXhESTtBQXlEVixtQkFBTSxFQXpESTtBQTBEVixtQkFBTSxFQTFESTtBQTJEVixtQkFBTSxFQTNESTtBQTREVixtQkFBTSxFQTVESTtBQTZEVixtQkFBTSxFQTdESTtBQThEVixtQkFBTSxFQTlESTtBQStEVixtQkFBTSxFQS9ESTtBQWdFVixtQkFBTSxFQWhFSTtBQWlFVixtQkFBTSxFQWpFSTtBQWtFVixtQkFBTSxFQWxFSTtBQW1FVixtQkFBTSxFQW5FSTtBQW9FVixtQkFBTSxFQXBFSTtBQXFFVixtQkFBTSxFQXJFSTtBQXNFVixtQkFB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QVIsQ0FBZSxPQUFPLEVBQXRCLEVBQTJCLENBQUMsQ0FBRCxHQUFLLElBQUksQ0FBSixFQUFPLEdBQVosR0FBa0IsSUFBbkIsR0FBMkIsS0FBckQ7QUFDQSxjQUFRLFNBQVI7QUFDQSxjQUFRLFdBQVIsR0FBc0IsTUFBdEI7QUFDQSxjQUFRLE1BQVI7QUFDQSxjQUFRLElBQVI7QUFDRDs7OzZCQUVRO0FBQ1AsV0FBSyxpQkFBTDtBQUNEOzs7Ozs7a0JBcGdCa0IsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxuKi9cblxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XG5pbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdGllcyB7XG5cbiAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lcikge1xuXG4gICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XG4gICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xuXG4gICAgaWYgKCFjaXR5TmFtZS52YWx1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuY2l0eU5hbWUgPSBjaXR5TmFtZS52YWx1ZS5yZXBsYWNlKC8oXFxzKSsvZywnLScpLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXIgfHwgJyc7XG4gICAgdGhpcy51cmwgPSBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9maW5kP3E9JHt0aGlzLmNpdHlOYW1lfSZ0eXBlPWxpa2Umc29ydD1wb3B1bGF0aW9uJmNudD0zMCZhcHBpZD1iMWIxNWU4OGZhNzk3MjI1NDEyNDI5YzFjNTBjMTIyYTFgO1xuXG4gICAgdGhpcy5zZWxDaXR5U2lnbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0aGlzLnNlbENpdHlTaWduLmlubmVyVGV4dCA9ICcgc2VsZWN0ZWQgJztcbiAgICB0aGlzLnNlbENpdHlTaWduLmNsYXNzID0gJ3dpZGdldC1mb3JtX19zZWxlY3RlZCc7XG5cbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LmNvbnRyb2xzV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC51cmxzKTtcbiAgICBvYmpXaWRnZXQucmVuZGVyKCk7XG5cbiAgfVxuXG4gIGdldENpdGllcygpIHtcbiAgICBpZiAoIXRoaXMuY2l0eU5hbWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybClcbiAgICAgIC50aGVuKFxuICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoRGF0YShyZXNwb25zZSk7XG4gICAgICB9LFxuICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xuICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIGdldFNlYXJjaERhdGEoSlNPTm9iamVjdCkge1xuICAgIGlmICghSlNPTm9iamVjdC5saXN0Lmxlbmd0aCkge1xuICAgICAgY29uc29sZS5sb2coJ0NpdHkgbm90IGZvdW5kJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g0KPQtNCw0LvRj9C10Lwg0YLQsNCx0LvQuNGG0YMsINC10YHQu9C4INC10YHRgtGMXG4gICAgY29uc3QgdGFibGVDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xuICAgIGlmICh0YWJsZUNpdHkpIHtcbiAgICAgIHRhYmxlQ2l0eS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhYmxlQ2l0eSk7XG4gICAgfVxuXG4gICAgbGV0IGh0bWwgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IEpTT05vYmplY3QubGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbmFtZSA9IGAke0pTT05vYmplY3QubGlzdFtpXS5uYW1lfSwgJHtKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnl9YDtcbiAgICAgIGNvbnN0IGZsYWcgPSBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWFnZXMvZmxhZ3MvJHtKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnkudG9Mb3dlckNhc2UoKX0ucG5nYDtcbiAgICAgIGh0bWwgKz0gYDx0cj48dGQgY2xhc3M9XCJ3aWRnZXQtZm9ybV9faXRlbVwiPjxhIGhyZWY9XCIvY2l0eS8ke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIiBpZD1cIiR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGNsYXNzPVwid2lkZ2V0LWZvcm1fX2xpbmtcIj4ke25hbWV9PC9hPjxpbWcgc3JjPVwiJHtmbGFnfVwiPjwvcD48L3RkPjwvdHI+YDtcbiAgICB9XG5cbiAgICBodG1sID0gYDx0YWJsZSBjbGFzcz1cInRhYmxlXCIgaWQ9XCJ0YWJsZS1jaXRpZXNcIj4ke2h0bWx9PC90YWJsZT5gO1xuICAgIHRoaXMuY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xuICAgIGNvbnN0IHRhYmxlQ2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xuXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIHRhYmxlQ2l0aWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gKCdBJykudG9Mb3dlckNhc2UoKSAmJiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aWRnZXQtZm9ybV9fbGluaycpKSB7XG4gICAgICAgIGxldCBzZWxlY3RlZENpdHkgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRDaXR5Jyk7XG4gICAgICAgIGlmICghc2VsZWN0ZWRDaXR5KSB7XG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoYXQuc2VsQ2l0eVNpZ24sIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdKTtcblxuICAgICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vINCf0L7QtNGB0YLQsNC90L7QstC60LAg0L3QsNC50LTQtdC90L7Qs9C+INCz0L7RgNC+0LTQsFxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0oZXZlbnQudGFyZ2V0LmlkLCBldmVudC50YXJnZXQudGV4dENvbnRlbnQpO1xuICAgICAgICAgIHdpbmRvdy5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XG4gICAgICAgICAgd2luZG93LmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xuXG5cbiAgICAgICAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LmNvbnRyb2xzV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC51cmxzKTtcbiAgICAgICAgICBvYmpXaWRnZXQucmVuZGVyKCk7XG4gICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXG4gICogQHBhcmFtIHVybFxuICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAqL1xuICBodHRwR2V0KHVybCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XG4gICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgIH0pO1xuICB9XG5cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxuKi9cblxuLy8g0KDQsNCx0L7RgtCwINGBINC00LDRgtC+0LlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcblxuICAvKipcbiAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBudW1iZXIgW9GH0LjRgdC70L4g0LzQtdC90LXQtSA5OTldXG4gICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cbiAgKi9cbiAgbnVtYmVyRGF5c09mWWVhclhYWChudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyID4gMzY1KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XG4gICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDApIHtcbiAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XG4gICAgfVxuICAgIHJldHVybiBudW1iZXI7XG4gIH1cblxuICAvKipcbiAgKiDQnNC10YLQvtC0INC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LIg0LPQvtC00YNcbiAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcbiAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xuICAqL1xuICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XG4gICAgY29uc3Qgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgICBjb25zdCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xuICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xuICB9XG5cbiAgLyoqXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtC+0LHRgNCw0LfRg9C10YIg0LTQsNGC0YMg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPiDQsiB5eXl5LW1tLWRkXG4gICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cbiAgKiBAcmV0dXJuIHtkYXRlfSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXG4gICovXG4gIGNvbnZlcnROdW1iZXJEYXlUb0RhdGUoZGF0ZSkge1xuICAgIGNvbnN0IHJlID0gLyhcXGR7NH0pKC0pKFxcZHszfSkvO1xuICAgIGNvbnN0IGxpbmUgPSByZS5leGVjKGRhdGUpO1xuICAgIGNvbnN0IGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xuICAgIGNvbnN0IHVuaXh0aW1lID0gYmVnaW55ZWFyLmdldFRpbWUoKSArIChsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKiAyNCk7XG4gICAgY29uc3QgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xuXG4gICAgY29uc3QgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XG4gICAgY29uc3QgZGF5cyA9IHJlcy5nZXREYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHJlcy5nZXRGdWxsWWVhcigpO1xuICAgIHJldHVybiBgJHtkYXlzIDwgMTAgPyBgMCR7ZGF5c31gIDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aH0uJHt5ZWFyfWA7XG4gIH1cblxuICAvKipcbiAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxuICAqIEBwYXJhbSAge2RhdGUxfSBkYXRlINC00LDRgtCwINCyINGE0L7RgNC80LDRgtC1IHl5eXktbW0tZGRcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XG4gICovXG4gIGZvcm1hdERhdGUoZGF0ZTEpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xuICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoIDwgMTApID8gYDAke21vbnRofWAgOiBtb250aH0gLSAkeyhkYXkgPCAxMCkgPyBgMCR7ZGF5fWAgOiBkYXl9YDtcbiAgfVxuXG4gIC8qKlxuICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXG4gICogQHJldHVybiB7W3N0cmluZ119INGC0LXQutGD0YnQsNGPINC00LDRgtCwXG4gICovXG4gIGdldEN1cnJlbnREYXRlKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0RGF0ZShub3cpO1xuICB9XG5cbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcbiAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHN0YXJ0O1xuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgbGV0IGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XG4gICAgZGF5IC09IDkwO1xuICAgIGlmIChkYXkgPCAwKSB7XG4gICAgICB5ZWFyIC09IDE7XG4gICAgICBkYXkgPSAzNjUgLSBkYXk7XG4gICAgfVxuICAgIHJldHVybiBgJHt5ZWFyfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XG4gIH1cblxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXG4gIGdldEN1cnJlbnRTdW1tZXJEYXRlKCkge1xuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XG4gIH1cblxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXG4gIGdldEN1cnJlbnRTcHJpbmdEYXRlKCkge1xuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTAzLTAxYCk7XG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XG4gIH1cblxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXG4gIGdldExhc3RTdW1tZXJEYXRlKCkge1xuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgLSAxO1xuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xuICB9XG5cbiAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpIHtcbiAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfSAtIDAwMWA7XG4gIH1cblxuICAvKipcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgKi9cbiAgdGltZXN0YW1wVG9EYXRlVGltZSh1bml4dGltZSkge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sICcnKS5yZXBsYWNlKC86XFx3KyQvLCAnJyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgKi9cbiAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XG4gICAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgY29uc3QgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIHJldHVybiBgJHtob3VycyA8IDEwID8gYDAke2hvdXJzfWAgOiBob3Vyc30gOiAke21pbnV0ZXMgPCAxMCA/IGAwJHttaW51dGVzfWAgOiBtaW51dGVzfSBgO1xuICB9XG5cblxuICAvKipcbiAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxuICAqIEBwYXJhbSB1bml4dGltZVxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodW5peHRpbWUpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcbiAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcbiAgfVxuXG4gIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxuICAqIEBwYXJhbSBkYXlOdW1iZXJcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICBnZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIoZGF5TnVtYmVyKSB7XG4gICAgY29uc3QgZGF5cyA9IHtcbiAgICAgIDA6ICdTdW4nLFxuICAgICAgMTogJ01vbicsXG4gICAgICAyOiAnVHVlJyxcbiAgICAgIDM6ICdXZWQnLFxuICAgICAgNDogJ1RodScsXG4gICAgICA1OiAnRnJpJyxcbiAgICAgIDY6ICdTYXQnLFxuICAgIH07XG4gICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQktC10YDQvdGD0YLRjCDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LzQtdGB0Y/RhtCwINC/0L4g0LXQs9C+INC90L7QvNC10YDRg1xuICAgKiBAcGFyYW0gbnVtTW9udGhcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKG51bU1vbnRoKXtcblxuICAgIGlmKHR5cGVvZiBudW1Nb250aCAhPT0gXCJudW1iZXJcIiB8fCBudW1Nb250aCA8PTAgJiYgbnVtTW9udGggPj0gMTIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG1vbnRoTmFtZSA9IHtcbiAgICAgIDA6IFwiSmFuXCIsXG4gICAgICAxOiBcIkZlYlwiLFxuICAgICAgMjogXCJNYXJcIixcbiAgICAgIDM6IFwiQXByXCIsXG4gICAgICA0OiBcIk1heVwiLFxuICAgICAgNTogXCJKdW5cIixcbiAgICAgIDY6IFwiSnVsXCIsXG4gICAgICA3OiBcIkF1Z1wiLFxuICAgICAgODogXCJTZXBcIixcbiAgICAgIDk6IFwiT2N0XCIsXG4gICAgICAxMDogXCJOb3ZcIixcbiAgICAgIDExOiBcIkRlY1wiXG4gICAgfTtcblxuICAgIHJldHVybiBtb250aE5hbWVbbnVtTW9udGhdO1xuICB9XG5cbiAgLyoqINCh0YDQsNCy0L3QtdC90LjQtSDQtNCw0YLRiyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5ID0gZGQubW0ueXl5eSDRgSDRgtC10LrRg9GJ0LjQvCDQtNC90LXQvFxuICAqXG4gICovXG4gIGNvbXBhcmVEYXRlc1dpdGhUb2RheShkYXRlKSB7XG4gICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgPT09IChuZXcgRGF0ZSgpKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgfVxuXG4gIGNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGRhdGUpIHtcbiAgICBjb25zdCByZSA9IC8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcbiAgICBjb25zdCByZXNEYXRlID0gcmUuZXhlYyhkYXRlKTtcbiAgICBpZiAocmVzRGF0ZS5sZW5ndGggPT09IDYpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKTtcbiAgICB9XG4gICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0L3QtSDRgNCw0YHQv9Cw0YDRgdC10L3QsCDQsdC10YDQtdC8INGC0LXQutGD0YnRg9GOXG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgSEg6TU0gTW9udGhOYW1lIE51bWJlckRhdGVcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCkge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiBgJHtkYXRlLmdldEhvdXJzKCkgPCAxMCA/IGAwJHtkYXRlLmdldEhvdXJzKCl9YCA6IGRhdGUuZ2V0SG91cnMoKSB9OiR7ZGF0ZS5nZXRNaW51dGVzKCkgPCAxMCA/IGAwJHtkYXRlLmdldE1pbnV0ZXMoKX1gIDogZGF0ZS5nZXRNaW51dGVzKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9ICR7ZGF0ZS5nZXREYXRlKCl9YDtcbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIwLjEwLjIwMTYuXG4gKi9cbmV4cG9ydCBjb25zdCBuYXR1cmFsUGhlbm9tZW5vbiA9e1xuICAgIFwiZW5cIjp7XG4gICAgICAgIFwibmFtZVwiOlwiRW5nbGlzaFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IHJhaW5cIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCByYWluXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgcmFpblwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2h0IHRodW5kZXJzdG9ybVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcInRodW5kZXJzdG9ybVwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcImhlYXZ5IHRodW5kZXJzdG9ybVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcInJhZ2dlZCB0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcImRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJkcml6emxlIHJhaW5cIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXG4gICAgICAgICAgICBcIjMxM1wiOlwic2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzE0XCI6XCJoZWF2eSBzaG93ZXIgcmFpbiBhbmQgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcInNob3dlciBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIm1vZGVyYXRlIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgcmFpblwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmFpblwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcImZyZWV6aW5nIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzaG93ZXIgcmFpblwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImhlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxuICAgICAgICAgICAgXCI1MzFcIjpcInJhZ2dlZCBzaG93ZXIgcmFpblwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbm93XCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXG4gICAgICAgICAgICBcIjYxMlwiOlwic2hvd2VyIHNsZWV0XCIsXG4gICAgICAgICAgICBcIjYxNVwiOlwibGlnaHQgcmFpbiBhbmQgc25vd1wiLFxuICAgICAgICAgICAgXCI2MTZcIjpcInJhaW4gYW5kIHNub3dcIixcbiAgICAgICAgICAgIFwiNjIwXCI6XCJsaWdodCBzaG93ZXIgc25vd1wiLFxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXG4gICAgICAgICAgICBcIjYyMlwiOlwiaGVhdnkgc2hvd2VyIHNub3dcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJoYXplXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZCxkdXN0IHdoaXJsc1wiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxuICAgICAgICAgICAgXCI3NTFcIjpcInNhbmRcIixcbiAgICAgICAgICAgIFwiNzYxXCI6XCJkdXN0XCIsXG4gICAgICAgICAgICBcIjc2MlwiOlwidm9sY2FuaWMgYXNoXCIsXG4gICAgICAgICAgICBcIjc3MVwiOlwic3F1YWxsc1wiLFxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJjbGVhciBza3lcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJmZXcgY2xvdWRzXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwic2NhdHRlcmVkIGNsb3Vkc1wiLFxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJvdmVyY2FzdCBjbG91ZHNcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWNhbmVcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJjb2xkXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZHlcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWlsXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwic2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJsaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJnZW50bGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwibW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiZnJlc2ggYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwic3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcImhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcInNldmVyZSBnYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwic3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJ2aW9sZW50IHN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiaHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJydVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJSdXNzaWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2ZcXHUwNDQwXFx1MDQzZVxcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDMyXFx1MDQzZVxcdTA0MzdcXHUwNDNjXFx1MDQzZVxcdTA0MzZcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0MzZcXHUwNDM1XFx1MDQ0MVxcdTA0NDJcXHUwNDNlXFx1MDQzYVxcdTA0MzBcXHUwNDRmIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDNlXFx1MDQ0N1xcdTA0MzVcXHUwNDNkXFx1MDQ0YyBcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQzOFxcdTA0M2RcXHUwNDQyXFx1MDQzNVxcdTA0M2RcXHUwNDQxXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQzZVxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcXHUwNDNiXFx1MDQ0Y1xcdTA0NDhcXHUwNDNlXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQ0ZlxcdTA0M2FcXHUwNDNlXFx1MDQ0MlxcdTA0NGNcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQzNVxcdTA0NDFcXHUwNDQ3XFx1MDQzMFxcdTA0M2RcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NGZcXHUwNDQxXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2ZcXHUwNDMwXFx1MDQ0MVxcdTA0M2NcXHUwNDQzXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzBcXHUwNDRmIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQzNlxcdTA0MzBcXHUwNDQwXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDM1XFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiaXRcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiSXRhbGlhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWFcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWEgZm9ydGVcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0ZW1wb3JhbGVcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0ZW1wb3JhbGVcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0ZW1wb3JhbGUgZm9ydGVcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0ZW1wb3JhbGVcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcInBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwicGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJwaW9nZ2VyZWxsYVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcInBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiZm9ydGUgcGlvZ2dlcmVsbGFcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJhY3F1YXp6b25lXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwicGlvZ2dpYSBsZWdnZXJhXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwicGlvZ2dpYSBtb2RlcmF0YVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImZvcnRlIHBpb2dnaWFcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwaW9nZ2lhIGZvcnRpc3NpbWFcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwaW9nZ2lhIGVzdHJlbWFcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJwaW9nZ2lhIGdlbGF0YVwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcInBpb2dnZXJlbGxhXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiYWNxdWF6em9uZVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImFjcXVhenpvbmVcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZlXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImZvcnRlIG5ldmljYXRhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwibmV2aXNjaGlvXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiZm9ydGUgbmV2aWNhdGFcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJmb3NjaGlhXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtb1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcImZvc2NoaWFcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJtdWxpbmVsbGkgZGkgc2FiYmlhXFwvcG9sdmVyZVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIm5lYmJpYVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImNpZWxvIHNlcmVub1wiLFxuICAgICAgICAgICAgXCI4MDFcIjpcInBvY2hlIG51dm9sZVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIm51Ymkgc3BhcnNlXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViaSBzcGFyc2VcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJjaWVsbyBjb3BlcnRvXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBlc3RhIHRyb3BpY2FsZVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhbm9cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmVkZG9cIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxkb1wiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuZGluZVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtb1wiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkJhdmEgZGkgdmVudG9cIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmV6emEgbGVnZ2VyYVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyZXp6YSB0ZXNhXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YSB2aW9sZW50YVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIlVyYWdhbm9cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInNwXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIlNwYW5pc2hcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGxpZ2VyYVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWFcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdlcmEgdG9ybWVudGFcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YVwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcImZ1ZXJ0ZSB0b3JtZW50YVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcInRvcm1lbnRhIGlycmVndWxhclwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYSBsaWdlcmFcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmFcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgaW50ZW5zYVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImxsb3Zpem5hIGxpZ2VyYVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcImxsb3Zpem5hXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwibGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwibGx1dmlhIHkgbGxvdml6bmEgbGlnZXJhXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwibGx1dmlhIHkgbGxvdml6bmFcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBkZSBncmFuIGludGVuc2lkYWRcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJjaHViYXNjb1wiLFxuICAgICAgICAgICAgXCI1MDBcIjpcImxsdXZpYSBsaWdlcmFcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJsbHV2aWEgbW9kZXJhZGFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJsbHV2aWEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwibGx1dmlhIG11eSBmdWVydGVcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJsbHV2aWEgbXV5IGZ1ZXJ0ZVwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcImxsdXZpYSBoZWxhZGFcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaHViYXNjbyBkZSBsaWdlcmEgaW50ZW5zaWRhZFwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcImNodWJhc2NvXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2h1YmFzY28gZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2YWRhIGxpZ2VyYVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pZXZlXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwibmV2YWRhIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJhZ3VhbmlldmVcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJjaHViYXNjbyBkZSBuaWV2ZVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIm5pZWJsYVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcImh1bW9cIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuaWVibGFcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0b3JiZWxsaW5vcyBkZSBhcmVuYVxcL3BvbHZvXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJ1bWFcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBjbGFyb1wiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImFsZ28gZGUgbnViZXNcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJlcyBkaXNwZXJzYXNcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIm51YmVzXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyYWNcXHUwMGUxblwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImZyXFx1MDBlZG9cIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuaXpvXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1hXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiVmllbnRvIGZsb2pvXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmllbnRvIHN1YXZlXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiVmllbnRvIG1vZGVyYWRvXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2FcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWaWVudG8gZnVlcnRlXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmllbnRvIGZ1ZXJ0ZSwgcHJcXHUwMGYzeGltbyBhIHZlbmRhdmFsXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmdWVydGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YWRcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YWQgdmlvbGVudGFcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTFuXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJ1YVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJVa3JhaW5pYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3XFx1MDQ1NiBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZVxcdTA0NGVcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzYVxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0NDJcXHUwNDNhXFx1MDQzZVxcdTA0NDdcXHUwNDMwXFx1MDQ0MVxcdTA0M2RcXHUwNDU2IFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDNmXFx1MDQzZVxcdTA0M2NcXHUwNDU2XFx1MDQ0MFxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzYVxcdTA0NDBcXHUwNDM4XFx1MDQzNlxcdTA0MzBcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzMyBcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzY1xcdTA0M2VcXHUwNDNhXFx1MDQ0MFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDQxXFx1MDQzNVxcdTA0NDBcXHUwNDNmXFx1MDQzMFxcdTA0M2RcXHUwNDNlXFx1MDQzYVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDU2XFx1MDQ0OVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzMFxcdTA0M2NcXHUwNDM1XFx1MDQ0MlxcdTA0NTZcXHUwNDNiXFx1MDQ0Y1wiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0N1xcdTA0MzhcXHUwNDQxXFx1MDQ0MlxcdTA0MzUgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0NDVcXHUwNDM4IFxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0NTZcXHUwNDQwXFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQ1NiBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzOFwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQ1NlxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzNVxcdTA0MzJcXHUwNDU2XFx1MDQzOVwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDQxXFx1MDQzZlxcdTA0MzVcXHUwNDNhXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDU2XFx1MDQ0MlxcdTA0NDBcXHUwNDRmXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJkZVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJHZXJtYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gUmVnZW5cIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHZXdpdHRlciBtaXQgUmVnZW5cIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHZXdpdHRlciBtaXQgc3RhcmtlbSBSZWdlblwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcImxlaWNodGUgR2V3aXR0ZXJcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJHZXdpdHRlclwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcInNjaHdlcmUgR2V3aXR0ZXJcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJlaW5pZ2UgR2V3aXR0ZXJcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gTmllc2VscmVnZW5cIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHZXdpdHRlciBtaXQgTmllc2VscmVnZW5cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHZXdpdHRlciBtaXQgc3RhcmtlbSBOaWVzZWxyZWdlblwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImxlaWNodGVzIE5pZXNlbG5cIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJOaWVzZWxuXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwic3RhcmtlcyBOaWVzZWxuXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwibGVpY2h0ZXIgTmllc2VscmVnZW5cIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJOaWVzZWxyZWdlblwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcInN0YXJrZXIgTmllc2VscmVnZW5cIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJOaWVzZWxzY2hhdWVyXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibGVpY2h0ZXIgUmVnZW5cIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDBlNFxcdTAwZGZpZ2VyIFJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiU3RhcmtyZWdlblwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIkVpc3JlZ2VuXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwibGVpY2h0ZSBSZWdlbnNjaGF1ZXJcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJSZWdlbnNjaGF1ZXJcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWZ0aWdlIFJlZ2Vuc2NoYXVlclwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIm1cXHUwMGU0XFx1MDBkZmlnZXIgU2NobmVlXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwiU2NobmVlXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVmdGlnZXIgU2NobmVlZmFsbFwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIkdyYXVwZWxcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJTY2huZWVzY2hhdWVyXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwidHJcXHUwMGZjYlwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlJhdWNoXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiRHVuc3RcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTYW5kIFxcLyBTdGF1YnN0dXJtXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiTmViZWxcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJrbGFyZXIgSGltbWVsXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiZWluIHBhYXIgV29sa2VuXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDBmY2JlcndpZWdlbmQgYmV3XFx1MDBmNmxrdFwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTAwZmNiZXJ3aWVnZW5kIGJld1xcdTAwZjZsa3RcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJ3b2xrZW5iZWRlY2t0XCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwiVG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BlbnN0dXJtXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVycmlrYW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrYWx0XCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiaGVpXFx1MDBkZlwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmRpZ1wiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIkhhZ2VsXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIldpbmRzdGlsbGVcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMZWljaHRlIEJyaXNlXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiTWlsZGUgQnJpc2VcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNXFx1MDBlNFxcdTAwZGZpZ2UgQnJpc2VcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmlzY2hlIEJyaXNlXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3RhcmtlIEJyaXNlXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSG9jaHdpbmQsIGFublxcdTAwZTRoZW5kZXIgU3R1cm1cIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJTdHVybVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNjaHdlcmVyIFN0dXJtXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiR2V3aXR0ZXJcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJIZWZ0aWdlcyBHZXdpdHRlclwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIk9ya2FuXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJwdFwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJQb3J0dWd1ZXNlXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwidHJvdm9hZGEgY29tIGNodXZhIGxldmVcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0cm92b2FkYSBjb20gY2h1dmFcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0cm92b2FkYSBjb20gY2h1dmEgZm9ydGVcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0cm92b2FkYSBsZXZlXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidHJvdm9hZGFcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0cm92b2FkYSBwZXNhZGFcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0cm92b2FkYSBpcnJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgZnJhY2FcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2FcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgcGVzYWRhXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiZ2Fyb2EgZnJhY2FcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJnYXJvYVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcImdhcm9hIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaHV2YSBsZXZlXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiY2h1dmEgZnJhY2FcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJjaHV2YSBmb3J0ZVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcImNodXZhIGRlIGdhcm9hXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiY2h1dmEgZnJhY2FcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJDaHV2YSBtb2RlcmFkYVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImNodXZhIGRlIGludGVuc2lkYWRlIHBlc2Fkb1wiLFxuICAgICAgICAgICAgXCI1MDNcIjpcImNodXZhIG11aXRvIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiQ2h1dmEgRm9ydGVcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaHV2YSBjb20gY29uZ2VsYW1lbnRvXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1dmEgbW9kZXJhZGFcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHV2YVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImNodXZhIGRlIGludGVuc2lkYWRlIHBlc2FkYVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIk5ldmUgYnJhbmRhXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIk5ldmUgcGVzYWRhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiY2h1dmEgY29tIG5ldmVcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJiYW5obyBkZSBuZXZlXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiTlxcdTAwZTl2b2FcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1hXFx1MDBlN2FcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZWJsaW5hXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwidHVyYmlsaFxcdTAwZjVlcyBkZSBhcmVpYVxcL3BvZWlyYVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIk5lYmxpbmFcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJjXFx1MDBlOXUgY2xhcm9cIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJBbGd1bWFzIG51dmVuc1wiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIm51dmVucyBkaXNwZXJzYXNcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJudXZlbnMgcXVlYnJhZG9zXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwidGVtcG8gbnVibGFkb1wiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YWRlIHRyb3BpY2FsXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiZnVyYWNcXHUwMGUzb1wiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImZyaW9cIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJxdWVudGVcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJjb20gdmVudG9cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuaXpvXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJyb1wiOntcbiAgICAgICAgXCJuYW1lXCI6XCJSb21hbmlhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcImZ1cnR1blxcdTAxMDMgY3UgcGxvYWllIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIyMDFcIjpcImZ1cnR1blxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJmdXJ0dW5cXHUwMTAzIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIyMTFcIjpcImZ1cnR1blxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdXJ0dW5cXHUwMTAzIHB1dGVybmljXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIyMjFcIjpcImZ1cnR1blxcdTAxMDMgYXByaWdcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIzMDFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIG1hcmVcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIGpvYXNcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCIzMTJcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgbWFyZVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwicGxvYWllXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwicGxvYWllIHB1dGVybmljXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInBsb2FpZSB0b3JlblxcdTAyMWJpYWxcXHUwMTAzIFwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcInBsb2FpZSBleHRyZW1cXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwicGxvYWllIFxcdTAwZWVuZ2hlXFx1MDIxYmF0XFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI1MjBcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIm5pbnNvYXJlIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pbnNvYXJlXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwibmluc29hcmUgcHV0ZXJuaWNcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwibGFwb3ZpXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuaW5zb2FyZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwidlxcdTAwZTJydGVqdXJpIGRlIG5pc2lwXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJjZXIgc2VuaW5cIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJjXFx1MDBlMlxcdTAyMWJpdmEgbm9yaVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIm5vcmkgXFx1MDBlZW1wclxcdTAxMDNcXHUwMjE5dGlhXFx1MDIxYmlcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJjZXIgZnJhZ21lbnRhdFwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcImNlciBhY29wZXJpdCBkZSBub3JpXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcImZ1cnR1bmEgdHJvcGljYWxcXHUwMTAzXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwidXJhZ2FuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwicmVjZVwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImZpZXJiaW50ZVwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZhbnQgcHV0ZXJuaWNcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmluZGluXFx1MDEwM1wiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwicGxcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiUG9saXNoXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiQnVyemEgeiBsZWtraW1pIG9wYWRhbWkgZGVzemN6dVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIkJ1cnphIHogb3BhZGFtaSBkZXN6Y3p1XCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiQnVyemEgeiBpbnRlbnN5d255bWkgb3BhZGFtaSBkZXN6Y3p1XCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiTGVra2EgYnVyemFcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJCdXJ6YVwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlNpbG5hIGJ1cnphXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiQnVyemFcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJCdXJ6YSB6IGxla2tcXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIkJ1cnphIHogbVxcdTAxN2Nhd2thXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiQnVyemEgeiBpbnRlbnN5d25cXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIkxla2thIG1cXHUwMTdjYXdrYVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIk1cXHUwMTdjYXdrYVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIkludGVuc3l3bmEgbVxcdTAxN2Nhd2thXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiTGVra2llIG9wYWR5IGRyb2JuZWdvIGRlc3pjenVcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJEZXN6Y3ogXFwvIG1cXHUwMTdjYXdrYVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIkludGVuc3l3bnkgZGVzemN6IFxcLyBtXFx1MDE3Y2F3a2FcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJTaWxuYSBtXFx1MDE3Y2F3a2FcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJMZWtraSBkZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJVbWlhcmtvd2FueSBkZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJJbnRlbnN5d255IGRlc3pjelwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcImJhcmR6byBzaWxueSBkZXN6Y3pcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJVbGV3YVwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIk1hcnpuXFx1MDEwNWN5IGRlc3pjelwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIktyXFx1MDBmM3RrYSB1bGV3YVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIkRlc3pjelwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIkludGVuc3l3bnksIGxla2tpIGRlc3pjelwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIkxla2tpZSBvcGFkeSBcXHUwMTVibmllZ3VcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwMTVhbmllZ1wiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIk1vY25lIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIkRlc3pjeiB6ZSBcXHUwMTVibmllZ2VtXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDE1YW5pZVxcdTAxN2N5Y2FcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJNZ2llXFx1MDE0MmthXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiU21vZ1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlphbWdsZW5pYVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlphbWllXFx1MDEwNyBwaWFza293YVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIk1nXFx1MDE0MmFcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJCZXpjaG11cm5pZVwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIkxla2tpZSB6YWNobXVyemVuaWVcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJSb3pwcm9zem9uZSBjaG11cnlcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJQb2NobXVybm8geiBwcnplamFcXHUwMTVibmllbmlhbWlcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJQb2NobXVybm9cIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiYnVyemEgdHJvcGlrYWxuYVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFnYW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJDaFxcdTAxNDJvZG5vXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiR29yXFx1MDEwNWNvXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwid2lldHJ6bmllXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiR3JhZFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTcG9rb2puaWVcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMZWtrYSBicnl6YVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkRlbGlrYXRuYSBicnl6YVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIlVtaWFya293YW5hIGJyeXphXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDE1YXdpZVxcdTAxN2NhIGJyeXphXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU2lsbmEgYnJ5emFcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJQcmF3aWUgd2ljaHVyYVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIldpY2h1cmFcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuYSB3aWNodXJhXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3p0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiR3dhXFx1MDE0MnRvd255IHN6dG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFnYW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImZpXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkZpbm5pc2hcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCBzYWRlXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidWtrb3NteXJza3kgamEgc2FkZVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcInVra29zbXlyc2t5IGphIGtvdmEgc2FkZVwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcInBpZW5pIHVra29zbXlyc2t5XCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidWtrb3NteXJza3lcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJrb3ZhIHVra29zbXlyc2t5XCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwibGlldlxcdTAwZTQgdWtrb3NteXJza3lcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCB0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ1a2tvc215cnNreSBqYSB0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHRpaGt1c2FkZVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZXZcXHUwMGU0IHRpaHV0dGFpbmVuXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwidGlodXR0YWFcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJrb3ZhIHRpaHV0dGFpbmVuXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwidGloa3VzYWRlXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwia292YSB0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwaWVuaSBzYWRlXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwia29odGFsYWluZW4gc2FkZVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImtvdmEgc2FkZVwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcImVyaXR0XFx1MDBlNGluIHJ1bnNhc3RhIHNhZGV0dGFcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJrb3ZhIHNhZGVcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJqXFx1MDBlNFxcdTAwZTR0XFx1MDBlNHZcXHUwMGU0IHNhZGVcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWV2XFx1MDBlNCB0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ0aWhrdXNhZGVcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJrb3ZhIHNhZGVcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJwaWVuaSBsdW1pc2FkZVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcImx1bWlcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJwYWxqb24gbHVudGFcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJyXFx1MDBlNG50XFx1MDBlNFwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcImx1bWlrdXVyb1wiLFxuICAgICAgICAgICAgXCI3MDFcIjpcInN1bXVcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJzYXZ1XCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwic3VtdVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcImhpZWtrYVxcL3BcXHUwMGY2bHkgcHlcXHUwMGY2cnJlXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwic3VtdVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcInRhaXZhcyBvbiBzZWxrZVxcdTAwZTRcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJ2XFx1MDBlNGhcXHUwMGU0biBwaWx2aVxcdTAwZTRcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJham9pdHRhaXNpYSBwaWx2aVxcdTAwZTRcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJoYWphbmFpc2lhIHBpbHZpXFx1MDBlNFwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcInBpbHZpbmVuXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb29wcGluZW4gbXlyc2t5XCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiaGlybXVteXJza3lcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJreWxtXFx1MDBlNFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImt1dW1hXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwidHV1bGluZW5cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJyYWtlaXRhXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJubFwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJEdXRjaFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIm9ud2VlcnNidWkgbWV0IGxpY2h0ZSByZWdlblwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIm9ud2VlcnNidWkgbWV0IHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgcmVnZW52YWxcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWNodGUgb253ZWVyc2J1aVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIm9ud2VlcnNidWlcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ6d2FyZSBvbndlZXJzYnVpXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwib25yZWdlbG1hdGlnIG9ud2VlcnNidWlcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJvbndlZXJzYnVpIG1ldCBsaWNodGUgbW90cmVnZW5cIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvbndlZXJzYnVpIG1ldCBtb3RyZWdlblwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIm9ud2VlcnNidWkgbWV0IHp3YXJlIG1vdHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwibGljaHRlIG1vdHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwibW90cmVnZW5cIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJ6d2FyZSBtb3RyZWdlblwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcImxpY2h0ZSBtb3RyZWdlblxcL3JlZ2VuXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwibW90cmVnZW5cIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJ6d2FyZSBtb3RyZWdlblxcL3JlZ2VuXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiendhcmUgbW90cmVnZW5cIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWNodGUgcmVnZW5cIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtYXRpZ2UgcmVnZW5cIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJ6d2FyZSByZWdlbnZhbFwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInplZXIgendhcmUgcmVnZW52YWxcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiS291ZGUgYnVpZW5cIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWNodGUgc3RvcnRyZWdlblwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcInN0b3J0cmVnZW5cIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJ6d2FyZSBzdG9ydHJlZ2VuXCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwibGljaHRlIHNuZWV1d1wiLFxuICAgICAgICAgICAgXCI2MDFcIjpcInNuZWV1d1wiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImhldmlnZSBzbmVldXdcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJpanplbFwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIm5hdHRlIHNuZWV1d1wiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJtaXN0XCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwibmV2ZWxcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ6YW5kXFwvc3RvZiB3ZXJ2ZWxpbmdcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtaXN0XCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwib25iZXdvbGt0XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwibGljaHQgYmV3b2xrdFwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcImhhbGYgYmV3b2xrdFwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcInp3YWFyIGJld29sa3RcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJnZWhlZWwgYmV3b2xrdFwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waXNjaGUgc3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthYW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrb3VkXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiaGVldFwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInN0b3JtYWNodGlnXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJXaW5kc3RpbFwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkthbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWNodGUgYnJpZXNcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJaYWNodGUgYnJpZXNcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNYXRpZ2UgYnJpZXNcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJWcmlqIGtyYWNodGlnZSB3aW5kXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiS3JhY2h0aWdlIHdpbmRcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIYXJkZSB3aW5kXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3Rvcm1hY2h0aWdcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlp3YXJlIHN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiWmVlciB6d2FyZSBzdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIk9ya2FhblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiZnJcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiRnJlbmNoXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwib3JhZ2UgZXQgcGx1aWUgZmluZVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIm9yYWdlIGV0IHBsdWllXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwib3JhZ2UgZXQgZm9ydGVzIHBsdWllc1wiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIm9yYWdlcyBsXFx1MDBlOWdlcnNcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJvcmFnZXNcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJncm9zIG9yYWdlc1wiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIm9yYWdlcyBcXHUwMGU5cGFyc2VzXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiT3JhZ2UgYXZlYyBsXFx1MDBlOWdcXHUwMGU4cmUgYnJ1aW5lXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwib3JhZ2VzIFxcdTAwZTlwYXJzZXNcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm9zIG9yYWdlXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiQnJ1aW5lIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIkJydWluZVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIkZvcnRlcyBicnVpbmVzXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1aWUgZmluZSBcXHUwMGU5cGFyc2VcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJwbHVpZSBmaW5lXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiQ3JhY2hpbiBpbnRlbnNlXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiQXZlcnNlcyBkZSBicnVpbmVcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsXFx1MDBlOWdcXHUwMGU4cmVzIHBsdWllc1wiLFxuICAgICAgICAgICAgXCI1MDFcIjpcInBsdWllcyBtb2RcXHUwMGU5clxcdTAwZTllc1wiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIkZvcnRlcyBwbHVpZXNcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ0clxcdTAwZThzIGZvcnRlcyBwclxcdTAwZTljaXBpdGF0aW9uc1wiLFxuICAgICAgICAgICAgXCI1MDRcIjpcImdyb3NzZXMgcGx1aWVzXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwicGx1aWUgdmVyZ2xhXFx1MDBlN2FudGVcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwZXRpdGVzIGF2ZXJzZXNcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJhdmVyc2VzIGRlIHBsdWllXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiYXZlcnNlcyBpbnRlbnNlc1wiLFxuICAgICAgICAgICAgXCI2MDBcIjpcImxcXHUwMGU5Z1xcdTAwZThyZXMgbmVpZ2VzXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwibmVpZ2VcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZXMgY2h1dGVzIGRlIG5laWdlXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwibmVpZ2UgZm9uZHVlXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiYXZlcnNlcyBkZSBuZWlnZVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcImJydW1lXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiQnJvdWlsbGFyZFwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcImJydW1lXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwidGVtcFxcdTAwZWF0ZXMgZGUgc2FibGVcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicm91aWxsYXJkXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiZW5zb2xlaWxsXFx1MDBlOVwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcInBldSBudWFnZXV4XCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwicGFydGllbGxlbWVudCBlbnNvbGVpbGxcXHUwMGU5XCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwibnVhZ2V1eFwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIkNvdXZlcnRcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRlXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcFxcdTAwZWF0ZSB0cm9waWNhbGVcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvdXJhZ2FuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJvaWRcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjaGF1ZFwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRldXhcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJnclxcdTAwZWFsZVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtZVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkJyaXNlIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyaXNlIGRvdWNlXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2UgbW9kXFx1MDBlOXJcXHUwMGU5ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNlIGZyYWljaGVcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzZSBmb3J0ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgZm9ydCwgcHJlc3F1ZSB2aW9sZW50XCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVudCB2aW9sZW50XCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVudCB0clxcdTAwZThzIHZpb2xlbnRcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wXFx1MDBlYXRlXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiZW1wXFx1MDBlYXRlIHZpb2xlbnRlXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3VyYWdhblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiYmdcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQnVsZ2FyaWFuXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0M2ZcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDM5XCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDIwXFx1MDQ0YVxcdTA0M2NcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDIwXFx1MDQ0YVxcdTA0M2NcXHUwNDRmXFx1MDQ0OSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MjNcXHUwNDNjXFx1MDQzNVxcdTA0NDBcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0MTRcXHUwNDRhXFx1MDQzNlxcdTA0MzQgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDQyXFx1MDQ0M1xcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDFlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0MWZcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDM5XCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQyMVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDE4XFx1MDQzN1xcdTA0M2RcXHUwNDM1XFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzMlxcdTA0MzBcXHUwNDQ5IFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDFjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0MTRcXHUwNDM4XFx1MDQzY1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQxZlxcdTA0NGZcXHUwNDQxXFx1MDQ0YVxcdTA0NDdcXHUwNDNkXFx1MDQzMFxcL1xcdTA0MWZcXHUwNDQwXFx1MDQzMFxcdTA0NDhcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQxY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDJmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0MzVcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDFkXFx1MDQzOFxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDNhXFx1MDQ0YVxcdTA0NDFcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQ0MVxcdTA0MzVcXHUwNDRmXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQyMlxcdTA0NGFcXHUwNDNjXFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQyMlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVxcL1xcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0MjJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0MjFcXHUwNDQyXFx1MDQ0M1xcdTA0MzRcXHUwNDM1XFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDEzXFx1MDQzZVxcdTA0NDBcXHUwNDM1XFx1MDQ0OVxcdTA0M2UgXFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0MlxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJzZVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJTd2VkaXNoXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDBlNXNrYVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTAwZTVza2FcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvalxcdTAwZTRtbnQgb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwibWp1a3QgZHVnZ3JlZ25cIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkdWdncmVnblwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcImhcXHUwMGU1cnQgZHVnZ3JlZ25cIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJtanVrdCByZWduXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwicmVnblwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcImhcXHUwMGU1cnQgcmVnblwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcImR1Z2dyZWduXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibWp1a3QgcmVnblwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIk1cXHUwMGU1dHRsaWcgcmVnblwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImhcXHUwMGU1cnQgcmVnblwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIm15Y2tldCBrcmFmdGlndCByZWduXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDBmNnNyZWduXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwidW5kZXJreWx0IHJlZ25cIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtanVrdCBcXHUwMGY2c3JlZ25cIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJkdXNjaC1yZWduXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwicmVnbmFyIHNtXFx1MDBlNXNwaWtcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtanVrIHNuXFx1MDBmNlwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcInNuXFx1MDBmNlwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImtyYWZ0aWd0IHNuXFx1MDBmNmZhbGxcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJzblxcdTAwZjZibGFuZGF0IHJlZ25cIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAwZjZvdlxcdTAwZTRkZXJcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJkaW1tYVwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2dnXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiZGlzXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZHN0b3JtXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiZGltbWlndFwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcImtsYXIgaGltbWVsXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiblxcdTAwZTVncmEgbW9sblwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInNwcmlkZGEgbW9sblwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIm1vbG5pZ3RcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwMGY2dmVyc2t1Z2dhbmRlIG1vbG5cIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJzdG9ybVwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bpc2sgc3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthblwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcImthbGx0XCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwidmFybXRcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJibFxcdTAwZTVzaWd0XCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInpoX3R3XCI6e1xuICAgICAgICBcIm5hbWVcIjpcIkNoaW5lc2UgVHJhZGl0aW9uYWxcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1NGUyZFxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1NjZiNFxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHU1MWNkXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1OTY2M1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTVjMGZcXHU5NmVhXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTU5MjdcXHU5NmVhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1OTZlOFxcdTU5M2VcXHU5NmVhXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1OTY2M1xcdTk2ZWFcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHU4NTg0XFx1OTcyN1wiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTcxNTlcXHU5NzI3XCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1ODU4NFxcdTk3MjdcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHU2Yzk5XFx1NjVjYlxcdTk4YThcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHU1OTI3XFx1OTcyN1wiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTY2NzRcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHU2Njc0XFx1ZmYwY1xcdTVjMTFcXHU5NmYyXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1NTkxYVxcdTk2ZjJcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHU1OTFhXFx1OTZmMlwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTk2NzBcXHVmZjBjXFx1NTkxYVxcdTk2ZjJcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHU5ZjhkXFx1NjM3MlxcdTk4YThcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHU3MWIxXFx1NWUzNlxcdTk4YThcXHU2NmI0XCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1OThiNlxcdTk4YThcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHU1MWI3XCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1NzFiMVwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTU5MjdcXHU5OGE4XCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1NTFiMFxcdTk2ZjlcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInRyXCI6e1xuICAgICAgICBcIm5hbWVcIjpcIlR1cmtpc2hcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZm11cmx1XCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyB5YVxcdTAxMWZtdXJsdVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgc2FcXHUwMTFmYW5hayB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiSGFmaWYgc2FcXHUwMTFmYW5ha1wiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlNhXFx1MDExZmFuYWtcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwMTVlaWRkZXRsaSBzYVxcdTAxMWZhbmFrXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiQXJhbFxcdTAxMzFrbFxcdTAxMzEgc2FcXHUwMTFmYW5ha1wiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgaGFmaWYgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlllciB5ZXIgaGFmaWYgeW9cXHUwMTFmdW5sdWtsdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlllciB5ZXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlllciB5ZXIgaGFmaWYgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlllciB5ZXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIlllciB5ZXIgc2FcXHUwMTFmYW5hayB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiSGFmaWYgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiT3J0YSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwMTVlaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiQVxcdTAxNWZcXHUwMTMxclxcdTAxMzEgeWFcXHUwMTFmbXVyXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiWWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMSB2ZSBzb1xcdTAxMWZ1ayBoYXZhXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgaGFmaWYgeW9cXHUwMTFmdW5sdWtsdSB5YVxcdTAxMWZtdXJcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSB5YVxcdTAxMWZtdXJcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJIYWZpZiBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIkthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiWW9cXHUwMTFmdW4ga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJLYXJsYSBrYXJcXHUwMTMxXFx1MDE1ZlxcdTAxMzFrIHlhXFx1MDExZm11cmx1XCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbFxcdTAwZmMga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlNpc2xpXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiU2lzbGlcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJIYWZpZiBzaXNsaVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIkt1bVxcL1RveiBmXFx1MDEzMXJ0XFx1MDEzMW5hc1xcdTAxMzFcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJTaXNsaVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIkFcXHUwMGU3XFx1MDEzMWtcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJBeiBidWx1dGx1XCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBheiBidWx1dGx1XCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBidWx1dGx1XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiS2FwYWxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwiS2FzXFx1MDEzMXJnYVwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BpayBmXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiSG9ydHVtXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDBjN29rIFNvXFx1MDExZnVrXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDBjN29rIFNcXHUwMTMxY2FrXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJEb2x1IHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIkR1cmd1blwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIlNha2luXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiSGFmaWYgUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJBeiBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk9ydGEgU2V2aXllIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLdXZ2ZXRsaSBSXFx1MDBmY3pnYXJcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJTZXJ0IFJcXHUwMGZjemdhclwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkZcXHUwMTMxcnRcXHUwMTMxbmFcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwMTVlaWRkZXRsaSBGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiS2FzXFx1MDEzMXJnYVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTAxNWVpZGRldGxpIEthc1xcdTAxMzFyZ2FcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZWlkZGV0bGkgS2FzXFx1MDEzMXJnYVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiemhfY25cIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQ2hpbmVzZSBTaW1wbGlmaWVkXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1OTYzNVxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1NTFiYlxcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHU1OTI3XFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTM5XFx1OTZlYVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2MzVcXHU5NmVhXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1ODU4NFxcdTk2ZmVcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MGRmXFx1OTZmZVwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1NmM5OVxcdTY1Y2JcXHU5OGNlXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk2ZmVcIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1NjY3NFxcdWZmMGNcXHU1YzExXFx1NGU5MVwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTRlOTFcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHU5NjM0XFx1ZmYwY1xcdTU5MWFcXHU0ZTkxXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY5OVxcdTUzNzdcXHU5OGNlXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzBlZFxcdTVlMjZcXHU5OGNlXFx1NjZiNFwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTk4ZDNcXHU5OGNlXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcwZWRcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHU1OTI3XFx1OThjZVwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJjelwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJDemVjaFwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcImJvdVxcdTAxNTlrYSBzZSBzbGFiXFx1MDBmZG0gZGVcXHUwMTYxdFxcdTAxMWJtXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiYm91XFx1MDE1OWthIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcImJvdVxcdTAxNTlrYSBzZSBzaWxuXFx1MDBmZG0gZGVcXHUwMTYxdFxcdTAxMWJtXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYlxcdTAxNjFcXHUwMGVkIGJvdVxcdTAxNTlrYVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcImJvdVxcdTAxNTlrYVwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcInNpbG5cXHUwMGUxIGJvdVxcdTAxNTlrYVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcImJvdVxcdTAxNTlrb3ZcXHUwMGUxIHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGthXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiYm91XFx1MDE1OWthIHNlIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJib3VcXHUwMTU5a2EgcyBtcmhvbGVuXFx1MDBlZG1cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2lsblxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwibXJob2xlblxcdTAwZWRcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIm1yaG9sZW5cXHUwMGVkIHMgZGVcXHUwMTYxdFxcdTAxMWJtXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWQgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXG4gICAgICAgICAgICBcIjMxM1wiOlwibXJob2xlblxcdTAwZWQgYSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCIzMTRcIjpcIm1yaG9sZW5cXHUwMGVkIGEgc2lsblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcImRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJwcnVka1xcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInBcXHUwMTU5XFx1MDBlZHZhbG92XFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwicHJcXHUwMTZmdHJcXHUwMTdlIG1yYVxcdTAxMGRlblwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIm1yem5vdWNcXHUwMGVkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcInBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwibVxcdTAwZWRyblxcdTAwZTkgc25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcInNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJodXN0XFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiem1yemxcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzbVxcdTAwZWRcXHUwMTYxZW5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcbiAgICAgICAgICAgIFwiNjE2XCI6XCJkXFx1MDBlOVxcdTAxNjFcXHUwMTY1IHNlIHNuXFx1MDExYmhlbVwiLFxuICAgICAgICAgICAgXCI2MjBcIjpcInNsYWJcXHUwMGU5IHNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXG4gICAgICAgICAgICBcIjYyMlwiOlwic2lsblxcdTAwZTkgc25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIm1saGFcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJrb3VcXHUwMTU5XCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwib3BhclwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInBcXHUwMGVkc2VcXHUwMTBkblxcdTAwZTkgXFx1MDEwZGkgcHJhY2hvdlxcdTAwZTkgdlxcdTAwZWRyeVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImh1c3RcXHUwMGUxIG1saGFcIixcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwXFx1MDBlZHNla1wiLFxuICAgICAgICAgICAgXCI3NjFcIjpcInByYVxcdTAxNjFub1wiLFxuICAgICAgICAgICAgXCI3NjJcIjpcInNvcGVcXHUwMTBkblxcdTAwZmQgcG9wZWxcIixcbiAgICAgICAgICAgIFwiNzcxXCI6XCJwcnVka1xcdTAwZTkgYm91XFx1MDE1OWVcIixcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzbm9cIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJza29ybyBqYXNub1wiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInBvbG9qYXNub1wiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJ6YXRhXFx1MDE3ZWVub1wiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBib3VcXHUwMTU5ZVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJ6aW1hXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9ya29cIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2XFx1MDExYnRybm9cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJrcnVwb2JpdFxcdTAwZWRcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJiZXp2XFx1MDExYnRcXHUwMTU5XFx1MDBlZFwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcInZcXHUwMGUxbmVrXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwidlxcdTAxMWJ0XFx1MDE1OVxcdTAwZWRrXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYlxcdTAwZmQgdlxcdTAwZWR0clwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIm1cXHUwMGVkcm5cXHUwMGZkIHZcXHUwMGVkdHJcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTBkZXJzdHZcXHUwMGZkIHZcXHUwMGVkdHJcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJzaWxuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwicHJ1ZGtcXHUwMGZkIHZcXHUwMGVkdHJcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJib3VcXHUwMTU5bGl2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwidmljaFxcdTAxNTlpY2VcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJzaWxuXFx1MDBlMSB2aWNoXFx1MDE1OWljZVwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIm1vaHV0blxcdTAwZTEgdmljaFxcdTAxNTlpY2VcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmtcXHUwMGUxblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwia3JcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiS29yZWFcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggcmFpblwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgZHJpenpsZVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcInNob3dlciBkcml6emxlXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIm1vZGVyYXRlIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgcmFpblwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmFpblwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcImZyZWV6aW5nIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzaG93ZXIgcmFpblwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcImhlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbm93XCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwic2hvd2VyIHNub3dcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJoYXplXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZFxcL2R1c3Qgd2hpcmxzXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwiZm9nXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwic2t5IGlzIGNsZWFyXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiZmV3IGNsb3Vkc1wiLFxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJicm9rZW4gY2xvdWRzXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwib3ZlcmNhc3QgY2xvdWRzXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2FsIHN0b3JtXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmljYW5lXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImhvdFwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmR5XCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiZ2xcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiR2FsaWNpYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YSBsaXhlaXJhXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmFcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGxpeGVpcmFcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2FcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgZm9ydGVcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgaXJyZWd1bGFyXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGxpeGVpcm9cIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG9cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG8gaW50ZW5zb1wiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIm9yYmFsbG8gbGl4ZWlyb1wiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIm9yYmFsbG9cIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJvcmJhbGxvIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaG9pdmEgZSBvcmJhbGxvIGxpeGVpcm9cIixcbiAgICAgICAgICAgIFwiMzExXCI6XCJjaG9pdmEgZSBvcmJhbGxvXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiY2hvaXZhIGUgb3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwib3JiYWxsbyBkZSBkdWNoYVwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcImNob2l2YSBsaXhlaXJhXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiY2hvaXZhIG1vZGVyYWRhXCIsXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2hvaXZhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaG9pdmEgbW9pIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiY2hvaXZhIGV4dHJlbWFcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaG9pdmEgeGVhZGFcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgYmFpeGEgaW50ZW5zaWRhZGVcIixcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaG9pdmEgZGUgZHVjaGFcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaXhlaXJhXCIsXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiYXVnYW5ldmVcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuZXZlIGRlIGR1Y2hhXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiblxcdTAwZTlib2FcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1lXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiblxcdTAwZTlib2EgbGl4ZWlyYVwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInJlbXVpXFx1MDBmMW9zIGRlIGFyZWEgZSBwb2x2b1wiLFxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2VvIGNsYXJvXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIm51YmVzIGRpc3BlcnNhc1wiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YmVzIHJvdGFzXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidG9ybWVudGEgdHJvcGljYWxcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTFuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJcXHUwMGVkb1wiLFxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbG9yXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxuICAgICAgICAgICAgXCI5MDZcIjpcInNhcmFiaWFcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtYVwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIlZlbnRvIGZyb3V4b1wiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIlZlbnRvIHN1YXZlXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiVmVudG8gbW9kZXJhZG9cIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlZlbnRvIGZvcnRlXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudG8gZm9ydGUsIHByXFx1MDBmM3hpbW8gYSB2ZW5kYXZhbFwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgZm9ydGVcIixcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YWRlXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkZSB2aW9sZW50YVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkZ1cmFjXFx1MDBlMW5cIlxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInZpXCI6e1xuICAgICAgICBcIm5hbWVcIjpcInZpZXRuYW1lc2VcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGFcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gTVxcdTAxYjBhIGxcXHUxZWRiblwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBjXFx1MDBmMyBjaFxcdTFlZGJwIGdpXFx1MWVhZHRcIixcbiAgICAgICAgICAgIFwiMjExXCI6XCJCXFx1MDBlM29cIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gbFxcdTFlZGJuXCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiQlxcdTAwZTNvIHZcXHUwMGUwaSBuXFx1MDFhMWlcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUxZWRiaSBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MWVkYmkgbVxcdTAxYjBhIHBoXFx1MDBmOW4gblxcdTFlYjduZ1wiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTAwZTFuaCBzXFx1MDBlMW5nIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5biBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwibVxcdTAxYjBhIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwibVxcdTAxYjBhIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwibVxcdTAxYjBhIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIm1cXHUwMWIwYSB2XFx1MWVlYmFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJtXFx1MDFiMGEgY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIm1cXHUwMWIwYSByXFx1MWVhNXQgblxcdTFlYjduZ1wiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIm1cXHUwMWIwYSBsXFx1MWVkMWNcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJtXFx1MDFiMGEgbFxcdTFlYTFuaFwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gbmhcXHUxZWI5XCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwibVxcdTAxYjBhIHJcXHUwMGUwb1wiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxuICAgICAgICAgICAgXCI2MDBcIjpcInR1eVxcdTFlYmZ0IHJcXHUwMWExaSBuaFxcdTFlYjlcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJ0dXlcXHUxZWJmdFwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcInR1eVxcdTFlYmZ0IG5cXHUxZWI3bmcgaFxcdTFlYTF0XCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwibVxcdTAxYjBhIFxcdTAxMTFcXHUwMGUxXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwidHV5XFx1MWViZnQgbVxcdTAwZjkgdHJcXHUxZWRkaVwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUxZWRkXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwia2hcXHUwMGYzaSBiXFx1MWVlNWlcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwMTExXFx1MDBlMW0gbVxcdTAwZTJ5XCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiYlxcdTAwZTNvIGNcXHUwMGUxdCB2XFx1MDBlMCBsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUwMGY5XCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiYlxcdTFlYTd1IHRyXFx1MWVkZGkgcXVhbmcgXFx1MDExMVxcdTAwZTNuZ1wiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIm1cXHUwMGUyeSB0aFxcdTAxYjBhXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwibVxcdTAwZTJ5IHJcXHUxZWEzaSByXFx1MDBlMWNcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJtXFx1MDBlMnkgY1xcdTFlZTVtXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwibVxcdTAwZTJ5IFxcdTAxMTFlbiB1IFxcdTAwZTFtXCIsXG4gICAgICAgICAgICBcIjkwMFwiOlwibFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJjXFx1MDFhMW4gYlxcdTAwZTNvIG5oaVxcdTFlYzd0IFxcdTAxMTFcXHUxZWRiaVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImJcXHUwMGUzbyBsXFx1MWVkMWNcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJsXFx1MWVhMW5oXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiblxcdTAwZjNuZ1wiLFxuICAgICAgICAgICAgXCI5MDVcIjpcImdpXFx1MDBmM1wiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIm1cXHUwMWIwYSBcXHUwMTExXFx1MDBlMVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIkNoXFx1MWViZiBcXHUwMTExXFx1MWVjZFwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIk5oXFx1MWViOSBuaFxcdTAwZTBuZ1wiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTAwYzFuaCBzXFx1MDBlMW5nIG5oXFx1MWViOVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIkdcXHUwMGVkbyB0aG9cXHUxZWEzbmdcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJHaVxcdTAwZjMgbmhcXHUxZWI5XCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiR2lcXHUwMGYzIHZcXHUxZWViYSBwaFxcdTFlYTNpXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiR2lcXHUwMGYzIG1cXHUxZWExbmhcIixcbiAgICAgICAgICAgIFwiOTU3XCI6XCJHaVxcdTAwZjMgeG9cXHUwMGUxeVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiTFxcdTFlZDFjIHhvXFx1MDBlMXkgblxcdTFlYjduZ1wiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGUzb1wiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIkJcXHUwMGUzbyBjXFx1MWVhNXAgbFxcdTFlZGJuXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiQlxcdTAwZTNvIGxcXHUxZWQxY1wiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiYXJcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQXJhYmljXCIsXG4gICAgICAgIFwibWFpblwiOlwiXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyM1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNjI3XFx1MDY0NFxcdTA2MzlcXHUwNjQ4XFx1MDYyN1xcdTA2MzVcXHUwNjQxIFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ0XFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyN1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyYlxcdTA2NDJcXHUwNjRhXFx1MDY0NFxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDYzNFxcdTA2NDZcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDEgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDEgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDY0NVxcdTA2MmFcXHUwNjQ4XFx1MDYzM1xcdTA2MzcgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM5XFx1MDYyN1xcdTA2NDRcXHUwNjRhIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyOFxcdTA2MzFcXHUwNjJmXCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyYyBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDY0N1wiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmNcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjIFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNjM1XFx1MDY0MlxcdTA2NGFcXHUwNjM5XCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDYzNlxcdTA2MjhcXHUwNjI3XFx1MDYyOFwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA2MmZcXHUwNjJlXFx1MDYyN1xcdTA2NDZcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1XCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDYzYVxcdTA2MjhcXHUwNjI3XFx1MDYzMVwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0NVwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA2MzNcXHUwNjQ1XFx1MDYyN1xcdTA2MjEgXFx1MDYzNVxcdTA2MjdcXHUwNjQxXFx1MDY0YVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNjNhXFx1MDYyN1xcdTA2MjZcXHUwNjQ1IFxcdTA2MmNcXHUwNjMyXFx1MDYyNlwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0NVxcdTA2MmFcXHUwNjQxXFx1MDYzMVxcdTA2NDJcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDZcXHUwNjI3XFx1MDYyYlxcdTA2MzFcXHUwNjQ3XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQyXFx1MDYyN1xcdTA2MmFcXHUwNjQ1XFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYzNVxcdTA2MjdcXHUwNjMxXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYyN1xcdTA2MzNcXHUwNjJhXFx1MDY0OFxcdTA2MjdcXHUwNjI2XFx1MDY0YVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNjMyXFx1MDY0OFxcdTA2NGFcXHUwNjM5XFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA2MjhcXHUwNjI3XFx1MDYzMVxcdTA2MmZcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNjJkXFx1MDYyN1xcdTA2MzFcIixcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNjMxXFx1MDY0YVxcdTA2MjdcXHUwNjJkXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYyZlxcdTA2MjdcXHUwNjJmXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiXFx1MDY0N1xcdTA2MjdcXHUwNjJmXFx1MDYyNlwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NFxcdTA2MzdcXHUwNjRhXFx1MDY0MVwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NVxcdTA2MzlcXHUwNjJhXFx1MDYyZlxcdTA2NDRcIixcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MzlcXHUwNjQ0XFx1MDY0YVxcdTA2NDRcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA2MzFcXHUwNjRhXFx1MDYyN1xcdTA2MmQgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmXFx1MDYyOVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5XCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzOVxcdTA2NDZcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwibWtcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiTWFjZWRvbmlhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzOFwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0M2ZcXHUwNDMwXFx1MDQzMlxcdTA0MzhcXHUwNDQ2XFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MVxcdTA0M2NcXHUwNDNlXFx1MDQzM1wiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MzdcXHUwNDMwXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzVcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQzZVxcdTA0NDdcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQ0MFxcdTA0NDJcXHUwNDNiXFx1MDQzZVxcdTA0MzNcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NDdcXHUwNDM4XFx1MDQ0MVxcdTA0NDJcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDNkXFx1MDQzNVxcdTA0M2FcXHUwNDNlXFx1MDQzYlxcdTA0M2FcXHUwNDQzIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0M2VcXHUwNDM0XFx1MDQzMlxcdTA0M2VcXHUwNDM1XFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQzZlxcdTA0M2JcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDJcXHUwNDNlXCIsXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA0MTdcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM3XCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiXFx1MDQxY1xcdTA0MzhcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIlxcdTA0MTJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDQyMVxcdTA0MzJcXHUwNDM1XFx1MDQzNiBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDQxY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNDFkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlxcdTA0MTFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJza1wiOntcbiAgICAgICAgXCJuYW1lXCI6XCJTbG92YWtcIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJiXFx1MDBmYXJrYSBzbyBzbGFiXFx1MDBmZG0gZGFcXHUwMTdlXFx1MDEwZm9tXCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiYlxcdTAwZmFya2EgcyBkYVxcdTAxN2VcXHUwMTBmb21cIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gZGFcXHUwMTdlXFx1MDEwZm9tXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwibWllcm5hIGJcXHUwMGZhcmthXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiYlxcdTAwZmFya2FcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzaWxuXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcInBydWRrXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcImJcXHUwMGZhcmthIHNvIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJiXFx1MDBmYXJrYSBzIG1yaG9sZW5cXHUwMGVkbVwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcImJcXHUwMGZhcmthIHNvIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuaWVcIixcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtcmhvbGVuaWVcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuaWVcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwicG9wXFx1MDE1NWNoYW5pZVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IHBvcFxcdTAxNTVjaGFuaWVcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJqZW1uXFx1MDBlOSBtcmhvbGVuaWVcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwibWllcm55IGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVcXHUwMTNlbWkgc2lsblxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJcXHUwMGU5bW55IGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpuXFx1MDBmYWNpIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcInByZWhcXHUwMGUxbmthXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiXFx1MDBlOSBzbmVcXHUwMTdlZW5pZVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcInNuZVxcdTAxN2VlbmllXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwic2lsblxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcbiAgICAgICAgICAgIFwiNjExXCI6XCJkXFx1MDBlMVxcdTAxN2VcXHUwMTBmIHNvIHNuZWhvbVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcInNuZWhvdlxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcbiAgICAgICAgICAgIFwiNzAxXCI6XCJobWxhXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiZHltXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwib3BhclwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcInBpZXNrb3ZcXHUwMGU5XFwvcHJhXFx1MDE2MW5cXHUwMGU5IHZcXHUwMGVkcnlcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJobWxhXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzblxcdTAwZTEgb2Jsb2hhXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwidGFrbWVyIGphc25vXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwicG9sb2phc25vXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwib2JsYVxcdTAxMGRub1wiLFxuICAgICAgICAgICAgXCI4MDRcIjpcInphbXJhXFx1MDEwZGVuXFx1MDBlOVwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJ6aW1hXCIsXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9yXFx1MDBmYWNvXCIsXG4gICAgICAgICAgICBcIjkwNVwiOlwidmV0ZXJub1wiLFxuICAgICAgICAgICAgXCI5MDZcIjpcImtydXBvYml0aWVcIixcbiAgICAgICAgICAgIFwiOTUwXCI6XCJOYXN0YXZlbmllXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwiQmV6dmV0cmllXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiU2xhYlxcdTAwZmQgdlxcdTAwZTFub2tcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJKZW1uXFx1MDBmZCB2aWV0b3JcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJTdHJlZG5cXHUwMGZkIHZpZXRvclwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxMGNlcnN0dlxcdTAwZmQgdmlldG9yXCIsXG4gICAgICAgICAgICBcIjk1NlwiOlwiU2lsblxcdTAwZmQgdmlldG9yXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2lsblxcdTAwZmQgdmlldG9yLCB0YWttZXIgdlxcdTAwZWRjaHJpY2FcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWXFx1MDBlZGNocmljYVwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlNpbG5cXHUwMGUxIHZcXHUwMGVkY2hyaWNhXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiQlxcdTAwZmFya2FcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJOaVxcdTAxMGRpdlxcdTAwZTEgYlxcdTAwZmFya2FcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJpa1xcdTAwZTFuXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJodVwiOntcbiAgICAgICAgXCJuYW1lXCI6XCJIdW5nYXJpYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ2aWhhciBlbnloZSBlc1xcdTAxNTF2ZWxcIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ2aWhhciBlc1xcdTAxNTF2ZWxcIixcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ2aWhhciBoZXZlcyBlc1xcdTAxNTF2ZWxcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJlbnloZSB6aXZhdGFyXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwidmloYXJcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZXZlcyB2aWhhclwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcImR1cnZhIHZpaGFyXCIsXG4gICAgICAgICAgICBcIjIzMFwiOlwidmloYXIgZW55aGUgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ2aWhhciBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcInZpaGFyIGVyXFx1MDE1MXMgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxuICAgICAgICAgICAgXCIzMDFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXG4gICAgICAgICAgICBcIjMwMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxuICAgICAgICAgICAgXCIzMTBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjMxMVwiOlwic3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiMzEyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjMyMVwiOlwielxcdTAwZTFwb3JcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJlbnloZSBlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiNTAxXCI6XCJrXFx1MDBmNnplcGVzIGVzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImhldmVzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIGVzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIm5hZ3lvbiBoZXZlcyBlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW0gZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDBmM25vcyBlc1xcdTAxNTFcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSB6XFx1MDBlMXBvclwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcInpcXHUwMGUxcG9yXCIsXG4gICAgICAgICAgICBcIjUyMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSB6XFx1MDBlMXBvclwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcImVueWhlIGhhdmF6XFx1MDBlMXNcIixcbiAgICAgICAgICAgIFwiNjAxXCI6XCJoYXZhelxcdTAwZTFzXCIsXG4gICAgICAgICAgICBcIjYwMlwiOlwiZXJcXHUwMTUxcyBoYXZhelxcdTAwZTFzXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiaGF2YXMgZXNcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjYyMVwiOlwiaFxcdTAwZjN6XFx1MDBlMXBvclwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcImd5ZW5nZSBrXFx1MDBmNmRcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJrXFx1MDBmNmRcIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJrXFx1MDBmNmRcIixcbiAgICAgICAgICAgIFwiNzMxXCI6XCJob21va3ZpaGFyXCIsXG4gICAgICAgICAgICBcIjc0MVwiOlwia1xcdTAwZjZkXCIsXG4gICAgICAgICAgICBcIjgwMFwiOlwidGlzenRhIFxcdTAwZTlnYm9sdFwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcImtldlxcdTAwZTlzIGZlbGhcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjgwMlwiOlwic3pcXHUwMGYzcnZcXHUwMGUxbnlvcyBmZWxoXFx1MDE1MXpldFwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcImVyXFx1MDE1MXMgZmVsaFxcdTAxNTF6ZXRcIixcbiAgICAgICAgICAgIFwiODA0XCI6XCJib3JcXHUwMGZhcyBcXHUwMGU5Z2JvbHRcIixcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRcXHUwMGYzXCIsXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJcXHUwMGYzcHVzaSB2aWhhclwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpa1xcdTAwZTFuXCIsXG4gICAgICAgICAgICBcIjkwM1wiOlwiaFxcdTAxNzF2XFx1MDBmNnNcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmb3JyXFx1MDBmM1wiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInN6ZWxlc1wiLFxuICAgICAgICAgICAgXCI5MDZcIjpcImpcXHUwMGU5Z2VzXFx1MDE1MVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIk55dWdvZHRcIixcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDc2VuZGVzXCIsXG4gICAgICAgICAgICBcIjk1MlwiOlwiRW55aGUgc3plbGxcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwiRmlub20gc3plbGxcXHUwMTUxXCIsXG4gICAgICAgICAgICBcIjk1NFwiOlwiS1xcdTAwZjZ6ZXBlcyBzelxcdTAwZTlsXCIsXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDBjOWxcXHUwMGU5bmsgc3pcXHUwMGU5bFwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIkVyXFx1MDE1MXMgc3pcXHUwMGU5bFwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIkVyXFx1MDE1MXMsIG1cXHUwMGUxciB2aWhhcm9zIHN6XFx1MDBlOWxcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWaWhhcm9zIHN6XFx1MDBlOWxcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJFclxcdTAxNTFzZW4gdmloYXJvcyBzelxcdTAwZTlsXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3pcXHUwMGU5bHZpaGFyXCIsXG4gICAgICAgICAgICBcIjk2MVwiOlwiVG9tYm9sXFx1MDBmMyBzelxcdTAwZTlsdmloYXJcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWtcXHUwMGUxblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiY2FcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQ2F0YWxhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYSBzdWF1XCIsXG4gICAgICAgICAgICBcIjIwMVwiOlwiVGVtcGVzdGEgYW1iIHBsdWphXCIsXG4gICAgICAgICAgICBcIjIwMlwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiMjEwXCI6XCJUZW1wZXN0YSBzdWF1XCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiVGVtcGVzdGFcIixcbiAgICAgICAgICAgIFwiMjEyXCI6XCJUZW1wZXN0YSBmb3J0YVwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlRlbXBlc3RhIGlycmVndWxhclwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW0gc3VhdVwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW5cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJUZW1wZXN0YSBhbWIgbW9sdCBwbHVnaW1cIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJQbHVnaW0gc3VhdVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlBsdWdpbVwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlBsdWdpbSBpbnRlbnNcIixcbiAgICAgICAgICAgIFwiMzEwXCI6XCJQbHVnaW0gc3VhdVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlBsdWdpbVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlBsdWdpbSBpbnRlbnNcIixcbiAgICAgICAgICAgIFwiMzEzXCI6XCJQbHVqYVwiLFxuICAgICAgICAgICAgXCIzMTRcIjpcIlBsdWphIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJQbHVnaW1cIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJQbHVqYSBzdWF1XCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwiUGx1amFcIixcbiAgICAgICAgICAgIFwiNTAyXCI6XCJQbHVqYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjUwM1wiOlwiUGx1amEgbW9sdCBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjUwNFwiOlwiUGx1amEgZXh0cmVtYVwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlBsdWphIGdsYVxcdTAwZTdhZGFcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJQbHVqYSBzdWF1XCIsXG4gICAgICAgICAgICBcIjUyMVwiOlwiUGx1amEgc3VhdVwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlBsdWphIGludGVuc2FcIixcbiAgICAgICAgICAgIFwiNTMxXCI6XCJQbHVqYSBpcnJlZ3VsYXJcIixcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZhZGEgc3VhdVwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIk5ldmFkYVwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjYxMVwiOlwiQWlndWFuZXVcIixcbiAgICAgICAgICAgIFwiNjEyXCI6XCJQbHVqYSBkJ2FpZ3VhbmV1XCIsXG4gICAgICAgICAgICBcIjYxNVwiOlwiUGx1Z2ltIGkgbmV1XCIsXG4gICAgICAgICAgICBcIjYxNlwiOlwiUGx1amEgaSBuZXVcIixcbiAgICAgICAgICAgIFwiNjIwXCI6XCJOZXZhZGEgc3VhdVwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIk5ldmFkYVwiLFxuICAgICAgICAgICAgXCI2MjJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwiQm9pcmFcIixcbiAgICAgICAgICAgIFwiNzExXCI6XCJGdW1cIixcbiAgICAgICAgICAgIFwiNzIxXCI6XCJCb2lyaW5hXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwiU29ycmFcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJCb2lyYVwiLFxuICAgICAgICAgICAgXCI3NTFcIjpcIlNvcnJhXCIsXG4gICAgICAgICAgICBcIjc2MVwiOlwiUG9sc1wiLFxuICAgICAgICAgICAgXCI3NjJcIjpcIkNlbmRyYSB2b2xjXFx1MDBlMG5pY2FcIixcbiAgICAgICAgICAgIFwiNzcxXCI6XCJYXFx1MDBlMGZlY1wiLFxuICAgICAgICAgICAgXCI3ODFcIjpcIlRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiODAwXCI6XCJDZWwgbmV0XCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiTGxldWdlcmFtZW50IGVubnV2b2xhdFwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIk5cXHUwMGZhdm9scyBkaXNwZXJzb3NcIixcbiAgICAgICAgICAgIFwiODAzXCI6XCJOdXZvbG9zaXRhdCB2YXJpYWJsZVwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIkVubnV2b2xhdFwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUZW1wZXN0YSB0cm9waWNhbFwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFjXFx1MDBlMFwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIkZyZWRcIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJDYWxvclwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlZlbnRcIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJQZWRyYVwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1hdFwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIkJyaXNhIHN1YXVcIixcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzYSBhZ3JhZGFibGVcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmlzYSBtb2RlcmFkYVwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhIGZyZXNjYVwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIkJyaXNjYSBmb3JhXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudCBpbnRlbnNcIixcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIHNldmVyXCIsXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YSB2aW9sZW50YVwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFjXFx1MDBlMFwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiaHJcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQ3JvYXRpYW5cIixcbiAgICAgICAgXCJtYWluXCI6XCJcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcbiAgICAgICAgICAgIFwiMjAwXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBzbGFib20ga2lcXHUwMTYxb21cIixcbiAgICAgICAgICAgIFwiMjAxXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBraVxcdTAxNjFvbVwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIGpha29tIGtpXFx1MDE2MW9tXCIsXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYmEgZ3JtbGphdmluc2thIG9sdWphXCIsXG4gICAgICAgICAgICBcIjIxMVwiOlwiZ3JtbGphdmluc2thIG9sdWphXCIsXG4gICAgICAgICAgICBcIjIxMlwiOlwiamFrYSBncm1samF2aW5za2Egb2x1amFcIixcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmthbnNrYSBncm1samF2aW5za2Egb2x1amFcIixcbiAgICAgICAgICAgIFwiMjMwXCI6XCJncm1samF2aW5za2Egb2x1amEgc2Egc2xhYm9tIHJvc3Vsam9tXCIsXG4gICAgICAgICAgICBcIjIzMVwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgcm9zdWxqb21cIixcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm1samF2aW5za2Egb2x1amEgc2EgamFrb20gcm9zdWxqb21cIixcbiAgICAgICAgICAgIFwiMzAwXCI6XCJyb3N1bGphIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcInJvc3VsamFcIixcbiAgICAgICAgICAgIFwiMzAyXCI6XCJyb3N1bGphIGpha29nIGludGVueml0ZXRhXCIsXG4gICAgICAgICAgICBcIjMxMFwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbVwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBqYWtvZyBpbnRlbnppdGV0YVwiLFxuICAgICAgICAgICAgXCIzMTNcIjpcInBsanVza292aSBpIHJvc3VsamFcIixcbiAgICAgICAgICAgIFwiMzE0XCI6XCJyb3N1bGphIHMgamFraW0gcGxqdXNrb3ZpbWFcIixcbiAgICAgICAgICAgIFwiMzIxXCI6XCJyb3N1bGphIHMgcGxqdXNrb3ZpbWFcIixcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiYSBraVxcdTAxNjFhXCIsXG4gICAgICAgICAgICBcIjUwMVwiOlwidW1qZXJlbmEga2lcXHUwMTYxYVwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcImtpXFx1MDE2MWEgamFrb2cgaW50ZW56aXRldGFcIixcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2cmxvIGpha2Ega2lcXHUwMTYxYVwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcImVrc3RyZW1uYSBraVxcdTAxNjFhXCIsXG4gICAgICAgICAgICBcIjUxMVwiOlwibGVkZW5hIGtpXFx1MDE2MWFcIixcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwbGp1c2FrIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcInBsanVzYWtcIixcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbGp1c2FrIGpha29nIGludGVueml0ZXRhXCIsXG4gICAgICAgICAgICBcIjUzMVwiOlwib2x1am5hIGtpXFx1MDE2MWEgcyBwbGp1c2tvdmltYVwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcInNsYWJpIHNuaWplZ1wiLFxuICAgICAgICAgICAgXCI2MDFcIjpcInNuaWplZ1wiLFxuICAgICAgICAgICAgXCI2MDJcIjpcImd1c3RpIHNuaWplZ1wiLFxuICAgICAgICAgICAgXCI2MTFcIjpcInN1c25qZVxcdTAxN2VpY2FcIixcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzdXNuamVcXHUwMTdlaWNhIHMgcGxqdXNrb3ZpbWFcIixcbiAgICAgICAgICAgIFwiNjE1XCI6XCJzbGFiYSBraVxcdTAxNjFhIGkgc25pamVnXCIsXG4gICAgICAgICAgICBcIjYxNlwiOlwia2lcXHUwMTYxYSBpIHNuaWplZ1wiLFxuICAgICAgICAgICAgXCI2MjBcIjpcInNuaWplZyBzIHBvdnJlbWVuaW0gcGxqdXNrb3ZpbWFcIixcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmlqZWcgcyBwbGp1c2tvdmltYVwiLFxuICAgICAgICAgICAgXCI2MjJcIjpcInNuaWplZyBzIGpha2ltIHBsanVza292aW1hXCIsXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtYWdsaWNhXCIsXG4gICAgICAgICAgICBcIjcxMVwiOlwiZGltXCIsXG4gICAgICAgICAgICBcIjcyMVwiOlwiaXptYWdsaWNhXCIsXG4gICAgICAgICAgICBcIjczMVwiOlwia292aXRsYWNpIHBpamVza2EgaWxpIHByYVxcdTAxNjFpbmVcIixcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtYWdsYVwiLFxuICAgICAgICAgICAgXCI3NTFcIjpcInBpamVzYWtcIixcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxaW5hXCIsXG4gICAgICAgICAgICBcIjc2MlwiOlwidnVsa2Fuc2tpIHBlcGVvXCIsXG4gICAgICAgICAgICBcIjc3MVwiOlwiemFwdXNpIHZqZXRyYSBzIGtpXFx1MDE2MW9tXCIsXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9ybmFkb1wiLFxuICAgICAgICAgICAgXCI4MDBcIjpcInZlZHJvXCIsXG4gICAgICAgICAgICBcIjgwMVwiOlwiYmxhZ2EgbmFvYmxha2FcIixcbiAgICAgICAgICAgIFwiODAyXCI6XCJyYVxcdTAxNjF0cmthbmkgb2JsYWNpXCIsXG4gICAgICAgICAgICBcIjgwM1wiOlwiaXNwcmVraWRhbmkgb2JsYWNpXCIsXG4gICAgICAgICAgICBcIjgwNFwiOlwib2JsYVxcdTAxMGRub1wiLFxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9wc2thIG9sdWphXCIsXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcbiAgICAgICAgICAgIFwiOTAzXCI6XCJobGFkbm9cIixcbiAgICAgICAgICAgIFwiOTA0XCI6XCJ2cnVcXHUwMTA3ZVwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcInZqZXRyb3ZpdG9cIixcbiAgICAgICAgICAgIFwiOTA2XCI6XCJ0dVxcdTAxMGRhXCIsXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXG4gICAgICAgICAgICBcIjk1MVwiOlwibGFob3JcIixcbiAgICAgICAgICAgIFwiOTUyXCI6XCJwb3ZqZXRhcmFjXCIsXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYiB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTU0XCI6XCJ1bWplcmVuIHZqZXRhclwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcInVtamVyZW5vIGphayB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTU2XCI6XCJqYWsgdmpldGFyXCIsXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDE3ZWVzdG9rIHZqZXRhclwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIm9sdWpuaSB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTU5XCI6XCJqYWsgb2x1am5pIHZqZXRhclwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIm9ya2Fuc2tpIHZqZXRhclwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcImphayBvcmthbnNraSB2amV0YXJcIixcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmthblwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiYmxhbmtcIjp7XG4gICAgICAgIFwibmFtZVwiOlwiQ2F0YWxhblwiLFxuICAgICAgICBcIm1haW5cIjpcIlwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xuICAgICAgICAgICAgXCIyMDBcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMDFcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMDJcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMTBcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMTFcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMTJcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMjFcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMzBcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMzFcIjpcIlwiLFxuICAgICAgICAgICAgXCIyMzJcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMDBcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMDFcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMDJcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMTBcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMTFcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMTJcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMTNcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMTRcIjpcIlwiLFxuICAgICAgICAgICAgXCIzMjFcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MDBcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MDFcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MDJcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MDNcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MDRcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MTFcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MjBcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MjFcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MjJcIjpcIlwiLFxuICAgICAgICAgICAgXCI1MzFcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MDBcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MDFcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MDJcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MTFcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MTJcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MTVcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MTZcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MjBcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MjFcIjpcIlwiLFxuICAgICAgICAgICAgXCI2MjJcIjpcIlwiLFxuICAgICAgICAgICAgXCI3MDFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3MTFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3MjFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3MzFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3NDFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3NTFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3NjFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3NjJcIjpcIlwiLFxuICAgICAgICAgICAgXCI3NzFcIjpcIlwiLFxuICAgICAgICAgICAgXCI3ODFcIjpcIlwiLFxuICAgICAgICAgICAgXCI4MDBcIjpcIlwiLFxuICAgICAgICAgICAgXCI4MDFcIjpcIlwiLFxuICAgICAgICAgICAgXCI4MDJcIjpcIlwiLFxuICAgICAgICAgICAgXCI4MDNcIjpcIlwiLFxuICAgICAgICAgICAgXCI4MDRcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDBcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDFcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDJcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDNcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDRcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDVcIjpcIlwiLFxuICAgICAgICAgICAgXCI5MDZcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTFcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTJcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTNcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTRcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTVcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTZcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTdcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NThcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NTlcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NjBcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NjFcIjpcIlwiLFxuICAgICAgICAgICAgXCI5NjJcIjpcIlwiXG4gICAgICAgIH1cbiAgICB9XG59OyIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMC4xMC4yMDE2LlxuICovXG5leHBvcnQgY29uc3Qgd2luZFNwZWVkID0ge1xuICAgIFwiZW5cIjp7XG4gICAgICAgIFwiU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4wLCAwLjNdLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMC0xICAgU21va2UgcmlzZXMgc3RyYWlnaHQgdXBcIlxuICAgICAgICB9LFxuICAgICAgICBcIkNhbG1cIjoge1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4zLCAxLjZdLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMS0zIE9uZSBjYW4gc2VlIGRvd253aW5kIG9mIHRoZSBzbW9rZSBkcmlmdFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiTGlnaHQgYnJlZXplXCI6e1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMS42LCAzLjNdLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNC02IE9uZSBjYW4gZmVlbCB0aGUgd2luZC4gVGhlIGxlYXZlcyBvbiB0aGUgdHJlZXMgbW92ZSwgdGhlIHdpbmQgY2FuIGxpZnQgc21hbGwgc3RyZWFtZXJzLlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiR2VudGxlIEJyZWV6ZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMuNCwgNS41XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjctMTAgTGVhdmVzIGFuZCB0d2lncyBtb3ZlLiBXaW5kIGV4dGVuZHMgbGlnaHQgZmxhZyBhbmQgcGVubmFudHNcIlxuICAgICAgICB9LFxuICAgICAgICBcIk1vZGVyYXRlIGJyZWV6ZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzUuNSwgOC4wXSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjExLTE2ICAgVGhlIHdpbmQgcmFpc2VzIGR1c3QgYW5kIGxvb3NlIHBhcGVycywgdG91Y2hlcyBvbiB0aGUgdHdpZ3MgYW5kIHNtYWxsIGJyYW5jaGVzLCBzdHJldGNoZXMgbGFyZ2VyIGZsYWdzIGFuZCBwZW5uYW50c1wiXG4gICAgICAgIH0sXG4gICAgICAgIFwiRnJlc2ggQnJlZXplXCI6e1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbOC4wLCAxMC44XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjE3LTIxICAgU21hbGwgdHJlZXMgaW4gbGVhZiBiZWdpbiB0byBzd2F5LiBUaGUgd2F0ZXIgYmVnaW5zIGxpdHRsZSB3YXZlcyB0byBwZWFrXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJTdHJvbmcgYnJlZXplXCI6e1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTAuOCwgMTMuOV0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCIyMi0yNyAgIExhcmdlIGJyYW5jaGVzIGFuZCBzbWFsbGVyIHRyaWJlcyBtb3Zlcy4gVGhlIHdoaXogb2YgdGVsZXBob25lIGxpbmVzLiBJdCBpcyBkaWZmaWN1bHQgdG8gdXNlIHRoZSB1bWJyZWxsYS4gQSByZXNpc3RhbmNlIHdoZW4gcnVubmluZy5cIlxuICAgICAgICB9LFxuICAgICAgICBcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCI6e1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTMuOSwgMTcuMl0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCIyOC0zMyAgIFdob2xlIHRyZWVzIGluIG1vdGlvbi4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiR2FsZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzE3LjIsIDIwLjddLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMzQtNDAgICBUaGUgd2luZCBicmVhayB0d2lncyBvZiB0cmVlcy4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiU2V2ZXJlIEdhbGVcIjp7XG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyMC44LCAyNC41XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQxLTQ3ICAgQWxsIGxhcmdlIHRyZWVzIHN3YXlpbmcgYW5kIHRocm93cy4gVGlsZXMgY2FuIGJsb3cgZG93bi5cIlxuICAgICAgICB9LFxuICAgICAgICBcIlN0b3JtXCI6e1xuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjQuNSwgMjguNV0sXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0OC01NSAgIFJhcmUgaW5sYW5kLiBUcmVlcyB1cHJvb3RlZC4gU2VyaW91cyBkYW1hZ2UgdG8gaG91c2VzLlwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiVmlvbGVudCBTdG9ybVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzI4LjUsIDMyLjddLFxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNTYtNjMgICBPY2N1cnMgcmFyZWx5IGFuZCBpcyBmb2xsb3dlZCBieSBkZXN0cnVjdGlvbi5cIlxuICAgICAgICB9LFxuICAgICAgICBcIkh1cnJpY2FuZVwiOntcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMyLjcsIDY0XSxcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIk9jY3VycyB2ZXJ5IHJhcmVseS4gVW51c3VhbGx5IHNldmVyZSBkYW1hZ2UuXCJcbiAgICAgICAgfVxuICAgIH1cbn07LyoqXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIxLjEwLjIwMTYuXG4gKi9cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAxMy4xMC4yMDE2LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3JXaWRnZXQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9ICdodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bSc7XG4gICAgICAgIHRoaXMuc2NyaXB0RDNTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL2xpYnMvZDMubWluLmpzYDtcbiAgICAgICAgdGhpcy5zY3JpcHRTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL3dlYXRoZXItd2lkZ2V0LWdlbmVyYXRvci5qc2A7XG5cbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldCA9IHtcbiAgICAgICAgICAgIC8vINCf0LXRgNCy0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcbiAgICAgICAgICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LWxlZnQtbWVudV9faGVhZGVyJyksXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19udW1iZXInKSxcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX21lYW5zJyksXG4gICAgICAgICAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fd2luZCcpLFxuICAgICAgICAgICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX2ltZycpLFxuICAgICAgICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FsZW5kYXJfX2l0ZW0nKSxcbiAgICAgICAgICAgIGdyYXBoaWM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljJyksXG4gICAgICAgICAgICAvLyDQktGC0L7RgNCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXG4gICAgICAgICAgICBjaXR5TmFtZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX3RpdGxlJyksXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X190ZW1wZXJhdHVyZScpLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmVGZWVsczogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2ZlZWxzJyksXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1pbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWluJyksXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1heDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWF4JyksXG4gICAgICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX2Rlc2NyaXB0aW9uJyksXG4gICAgICAgICAgICB3aW5kU3BlZWQyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fd2luZC1zcGVlZCcpLFxuICAgICAgICAgICAgbWFpbkljb25XZWF0aGVyMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2ljb24nKSxcbiAgICAgICAgICAgIGh1bWlkaXR5OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faHVtaWRpdHknKSxcbiAgICAgICAgICAgIHByZXNzdXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fcHJlc3N1cmUnKSxcbiAgICAgICAgICAgIGRhdGVSZXBvcnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXRfX2RhdGUnKSxcbiAgICAgICAgICAgIGFwaUtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKSxcbiAgICAgICAgICAgIGVycm9yS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3Ita2V5JyksXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy52YWxpZGF0aW9uQVBJa2V5KCk7XG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xuXG4gICAgICAgIC8vINC+0LHRitC10LrRgi3QutCw0YDRgtCwINC00LvRjyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjRjyDQstGB0LXRhSDQstC40LTQttC10YLQvtCyINGBINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsFxuICAgICAgICB0aGlzLm1hcFdpZGdldHMgPSB7XG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1ibHVlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxKSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC1ibHVlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMixcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgzKSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1ibHVlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogNCxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg0KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTUtcmlnaHQtYmx1ZScgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDUsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA2LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDYpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1ibHVlJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogNyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg3KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTgtcmlnaHQtYmx1ZScgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDgsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiA5LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDkpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LWJyb3duJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMTEsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTEpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC1icm93bicgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDEyLFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxMyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMyksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LWJyb3duJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMTQsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTQpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTUtcmlnaHQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxNSxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDE2LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE2KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC03LXJpZ2h0LWJyb3duJyA6IHtcbiAgICAgICAgICAgICAgICBpZDogMTcsXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTcpLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnd2lkZ2V0LTgtcmlnaHQtYnJvd24nIDoge1xuICAgICAgICAgICAgICAgIGlkOiAxOCxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDE5LFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE5KSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtd2hpdGUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiAyMSxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMSksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtd2hpdGUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiAyMixcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiAyMyxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMyksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtd2hpdGUnIDoge1xuICAgICAgICAgICAgICAgIGlkOiAyNCxcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyNCksXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3dpZGdldC0zMS1yaWdodC1icm93bicgOiB7XG4gICAgICAgICAgICAgICAgaWQ6IDMxLFxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMxKSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICB2YWxpZGF0aW9uQVBJa2V5KCkge1xuICAgICAgICBsZXQgdmFsaWRhdGlvbkFQSSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdXJsID0gYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPTUyNDkwMSZ1bml0cz1tZXRyaWMmY250PTgmYXBwaWQ9JHt0aGlzLmNvbnRyb2xzV2lkZ2V0LmFwaUtleS52YWx1ZX1gO1xuICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gYWNjZXB0JztcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1nb29kJyk7XG4gICAgICAgICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBlcnJvcic7XG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhg0J7RiNC40LHQutCwINCy0LDQu9C40LTQsNGG0LjQuCAke2V9YCk7XG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBlcnJvcic7XG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XG4gICAgICAgIH1cblxuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCA9IHZhbGlkYXRpb25BUEkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldC5hcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyx0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XG4gICAgICAgIC8vdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kKTtcblxuXG4gICAgfVxuXG4gICAgZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGlkKSB7ICAgICAgICBcbiAgICAgICAgaWYoaWQgJiYgKHRoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZCB8fCB0aGlzLnBhcmFtc1dpZGdldC5jaXR5TmFtZSkgJiYgdGhpcy5wYXJhbXNXaWRnZXQuYXBwaWQpIHtcbiAgICAgICAgICAgIGxldCBjb2RlID0gJyc7XG4gICAgICAgICAgICBpZihwYXJzZUludChpZCkgPT09IDEgfHwgcGFyc2VJbnQoaWQpID09PSAxMSB8fCBwYXJzZUludChpZCkgPT09IDIxIHx8IHBhcnNlSW50KGlkKSA9PT0gMzEpIHtcbiAgICAgICAgICAgICAgICBjb2RlID0gYDxzY3JpcHQgc3JjPSdodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy9kMy5taW4uanMnPjwvc2NyaXB0PmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYCR7Y29kZX08ZGl2IGlkPSdvcGVud2VhdGhlcm1hcC13aWRnZXQnPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvamF2YXNjcmlwdCc+XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICR7aWR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eWlkOiAke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBpZDogJyR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWQucmVwbGFjZShgMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjdgLCcnKX0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQnLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSAnaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgPC9zY3JpcHQ+YDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNldEluaXRpYWxTdGF0ZUZvcm0oY2l0eUlkPTUyNDkwMSwgY2l0eU5hbWU9J01vc2NvdycpIHtcblxuICAgICAgICB0aGlzLnBhcmFtc1dpZGdldCA9IHtcbiAgICAgICAgICAgIGNpdHlJZDogY2l0eUlkLFxuICAgICAgICAgICAgY2l0eU5hbWU6IGNpdHlOYW1lLFxuICAgICAgICAgICAgbGFuZzogJ2VuJyxcbiAgICAgICAgICAgIGFwcGlkOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpLnZhbHVlIHx8ICAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxuICAgICAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxuICAgICAgICAgICAgdGV4dFVuaXRUZW1wOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgweDAwQjApLCAgLy8gMjQ4XG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmJhc2VVUkwsXG4gICAgICAgICAgICB1cmxEb21haW46ICdodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZycsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxuICAgICAgICB0aGlzLmNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xuICAgICAgICB0aGlzLmNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXRpZXMnKTtcbiAgICAgICAgdGhpcy5zZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XG5cbiAgICAgICAgdGhpcy51cmxzID0ge1xuICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXI/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZjbnQ9OCZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXG4gICAgICAgIHdpbmRTcGVlZDogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uYCxcbiAgICAgICAgd2luZERpcmVjdGlvbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbmAsXG4gICAgICAgIGNsb3VkczogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL2Nsb3Vkcy1kYXRhLmpzb25gLFxuICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25gLFxuICAgICAgICB9O1xuICAgIH1cblxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXG4gKi9cblxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XG5cbi8qKlxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xuIEBjbGFzcyBHcmFwaGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRlIHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAvKipcbiAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcbiAgICAqIFtsaW5lIGRlc2NyaXB0aW9uXVxuICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgKi9cbiAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxuICAgIC54KChkKSA9PiB7XG4gICAgICByZXR1cm4gZC54O1xuICAgIH0pXG4gICAgLnkoKGQpID0+IHtcbiAgICAgIHJldHVybiBkLnk7XG4gICAgfSk7XG4gIH1cblxuICAgIC8qKlxuICAgICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10Lwg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQsiDQvNCw0YHRgdC40LIg0LTQu9GPINGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyDQs9GA0LDRhNC40LrQsFxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cbiAgICAgKi9cbiAgcHJlcGFyZURhdGEoKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IHJhd0RhdGEgPSBbXTtcblxuICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgcmF3RGF0YS5wdXNoKHsgeDogaSwgZGF0ZTogaSwgbWF4VDogZWxlbS5tYXgsIG1pblQ6IGVsZW0ubWluIH0pO1xuICAgICAgaSArPSAxOyAvLyDQodC80LXRidC10L3QuNC1INC/0L4g0L7RgdC4IFhcbiAgICB9KTtcblxuICAgIHJldHVybiByYXdEYXRhO1xuICB9XG5cbiAgICAvKipcbiAgICAgKiDQodC+0LfQtNCw0LXQvCDQuNC30L7QsdGA0LDQttC10L3QuNC1INGBINC60L7QvdGC0LXQutGB0YLQvtC8INC+0LHRitC10LrRgtCwIHN2Z1xuICAgICAqIFttYWtlU1ZHIGRlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxuICAgICAqL1xuICBtYWtlU1ZHKCkge1xuICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5wYXJhbXMuaWQpLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzJylcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMucGFyYW1zLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhlaWdodClcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJyNmZmZmZmYnKTtcbiAgfVxuXG4gIC8qKlxuICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xuICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxuICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cbiAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cbiAgKi9cbiAgZ2V0TWluTWF4RGF0ZShyYXdEYXRhKSB7XG4gICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIG1heERhdGU6IDAsXG4gICAgICBtaW5EYXRlOiAxMDAwMCxcbiAgICB9O1xuXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkge1xuICAgICAgICBkYXRhLm1heERhdGUgPSBlbGVtLmRhdGU7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5taW5EYXRlID49IGVsZW0uZGF0ZSkge1xuICAgICAgICBkYXRhLm1pbkRhdGUgPSBlbGVtLmRhdGU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gICAgLyoqXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xuICAgICAqIFtnZXRNaW5NYXhEYXRlVGVtcGVyYXR1cmUgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cblxuICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKSB7XG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBtaW46IDEwMCxcbiAgICAgIG1heDogMCxcbiAgICB9O1xuXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5taW5UKSB7XG4gICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ubWF4VCkge1xuICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKSB7XG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBtaW46IDAsXG4gICAgICBtYXg6IDAsXG4gICAgfTtcblxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpIHtcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLmh1bWlkaXR5O1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0uaHVtaWRpdHkpIHtcbiAgICAgICAgZGF0YS5tYXggPSBlbGVtLmh1bWlkaXR5O1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcbiAgICAgICAgZGF0YS5tYXggPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuXG4gIC8qKlxuICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC00LvQuNC90YMg0L7RgdC10LkgWCxZXG4gICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0JzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cbiAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cbiAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgKi9cbiAgbWFrZUF4ZXNYWShyYXdEYXRhLCBwYXJhbXMpIHtcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXG4gICAgY29uc3QgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAoMiAqIHBhcmFtcy5tYXJnaW4pO1xuICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFkgPSDQstGL0YHQvtGC0LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LLQtdGA0YXRgyDQuCDRgdC90LjQt9GDXG4gICAgY29uc3QgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gKDIgKiBwYXJhbXMubWFyZ2luKTtcblxuICAgIHJldHVybiB0aGlzLnNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpO1xuICB9XG5cblxuICAvKipcbiAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXG4gICogW3NjYWxlQXhlc1hZIGRlc2NyaXB0aW9uXVxuICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXG4gICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXG4gICogQHBhcmFtICB7ZnVuY3Rpb259IHlBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFldXG4gICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cbiAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXG4gICovXG4gIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpIHtcbiAgICBjb25zdCB7IG1heERhdGUsIG1pbkRhdGUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpO1xuXG4gICAgLyoqXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXG4gICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxuICAgICovXG4gICAgY29uc3Qgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcblxuICAgIC8qKlxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXG4gICAgKiBbc2NhbGVMaW5lYXIgZGVzY3JpcHRpb25dXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAqL1xuICAgIGNvbnN0IHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKFttYXggKyA1LCBtaW4gLSA1XSlcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XG5cbiAgICBjb25zdCBkYXRhID0gW107XG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXG4gICAgICAgIG1heFQ6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFgsXG4gICAgICAgIG1pblQ6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFgsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XG4gIH1cblxuICBzY2FsZUF4ZXNYWVdlYXRoZXIocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBtYXJnaW4pIHtcbiAgICBjb25zdCB7IG1heERhdGUsIG1pbkRhdGUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XG5cbiAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcbiAgICAucmFuZ2UoWzAsIHhBeGlzTGVuZ3RoXSk7XG5cbiAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXG4gICAgY29uc3Qgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oW21heCwgbWluXSlcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XG4gICAgY29uc3QgZGF0YSA9IFtdO1xuXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgbWFyZ2luLFxuICAgICAgICBodW1pZGl0eTogc2NhbGVZKGVsZW0uaHVtaWRpdHkpICsgbWFyZ2luLFxuICAgICAgICByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luLFxuICAgICAgICBjb2xvcjogZWxlbS5jb2xvcixcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcbiAgfVxuXG4gICAgLyoqXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSBkYXRhIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICBtYWtlUG9seWxpbmUoZGF0YSwgcGFyYW1zLCBzY2FsZVgsIHNjYWxlWSkge1xuICAgIGNvbnN0IGFyclBvbHlsaW5lID0gW107XG4gICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSB9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGFyclBvbHlsaW5lLnB1c2goe1xuICAgICAgeDogc2NhbGVYKGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxuICAgICAgeTogc2NhbGVZKGRhdGFbZGF0YS5sZW5ndGggLSAxXS5tYXhUKSArIHBhcmFtcy5vZmZzZXRZLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFyclBvbHlsaW5lO1xuICB9XG4gICAgLyoqXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC/0L7Qu9C40LvQuNC90LjQuSDRgSDQt9Cw0LvQuNCy0LrQvtC5INC+0YHQvdC+0LLQvdC+0Lkg0Lgg0LjQvNC40YLQsNGG0LjRjyDQtdC1INGC0LXQvdC4XG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgZHJhd1BvbHlsaW5lKHN2ZywgZGF0YSkge1xuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcblxuICAgIHN2Zy5hcHBlbmQoJ2cnKS5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdkJywgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gIH1cbiAgLyoqXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LTQv9C40YHQtdC5INGBINC/0L7QutCw0LfQsNGC0LXQu9GP0LzQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC90LAg0L7RgdGP0YVcbiAgICogQHBhcmFtICB7W3R5cGVdfSBzdmcgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgcGFyYW1zKSB7XG4gICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpdGVtLCBkYXRhKSA9PiB7XG4gICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXG4gICAgICBzdmcuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCd4JywgZWxlbS54KVxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5tYXhUIC0gMikgLSAocGFyYW1zLm9mZnNldFggLyAyKSlcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBwYXJhbXMuZm9udFNpemUpXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBwYXJhbXMuZm9udENvbG9yKVxuICAgICAgLnRleHQoYCR7cGFyYW1zLmRhdGFbaXRlbV0ubWF4fcKwYCk7XG5cbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCBlbGVtLngpXG4gICAgICAuYXR0cigneScsIChlbGVtLm1pblQgKyA3KSArIChwYXJhbXMub2Zmc2V0WSAvIDIpKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIHBhcmFtcy5mb250U2l6ZSlcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXG4gICAgICAudGV4dChgJHtwYXJhbXMuZGF0YVtpdGVtXS5taW59wrBgKTtcbiAgICB9KTtcbiAgfVxuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDQtNC40YHQv9C10YLRh9C10YAg0L/RgNC+0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YHQviDQstGB0LXQvNC4INGN0LvQtdC80LXQvdGC0LDQvNC4XG4gICAgICogW3JlbmRlciBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xuICAgIGNvbnN0IHJhd0RhdGEgPSB0aGlzLnByZXBhcmVEYXRhKCk7XG5cbiAgICBjb25zdCB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH0gPSB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5tYWtlUG9seWxpbmUocmF3RGF0YSwgdGhpcy5wYXJhbXMsIHNjYWxlWCwgc2NhbGVZKTtcbiAgICB0aGlzLmRyYXdQb2x5bGluZShzdmcsIHBvbHlsaW5lKTtcbiAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcbiAgICAgICAgLy8gdGhpcy5kcmF3TWFya2VycyhzdmcsIHBvbHlsaW5lLCB0aGlzLm1hcmdpbik7XG4gIH1cblxufVxuIiwiaW1wb3J0IEdlbmVyYXRvcldpZGdldCBmcm9tICcuL2dlbmVyYXRvci13aWRnZXQnO1xyXHJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHIgICAgdmFyIGdlbmVyYXRvciA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcciAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZybS1sYW5kaW5nLXdpZGdldCcpO1xyICAgIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwJyk7XHIgICAgY29uc3QgcG9wdXBTaGFkb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9wdXAtc2hhZG93Jyk7XHIgICAgY29uc3QgcG9wdXBDbG9zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1jbG9zZScpO1xyICAgIGNvbnN0IGNvbnRlbnRKU0dlbmVyYXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtY29kZS1nZW5lcmF0ZScpO1xyICAgIGNvbnN0IGNvcHlDb250ZW50SlNDb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvcHktanMtY29kZScpO1xyICAgIGNvbnN0IGFwaUtleSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5Jyk7XHJcciAgICAvLyDQpNC40LrRgdC40YDRg9C10Lwg0LrQu9C40LrQuCDQvdCwINGE0L7RgNC80LUsINC4INC+0YLQutGA0YvQstCw0LXQvCBwb3B1cCDQvtC60L3QviDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCDQutC90L7Qv9C60YNcciAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcciAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgbGV0IGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHIgICAgICAgIGlmKGVsZW1lbnQuaWQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbnRhaW5lci1jdXN0b20tY2FyZF9fYnRuJykpIHtcciAgICAgICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgICAgICAgICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSh3aW5kb3cuY2l0eUlkLCB3aW5kb3cuY2l0eU5hbWUpOyAgICAgICAgIFxyICAgICAgICAgICAgXHIgICAgICAgICAgICBcciAgICAgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24udmFsdWUgPSBnZW5lcmF0ZVdpZGdldC5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoZ2VuZXJhdGVXaWRnZXQubWFwV2lkZ2V0c1tlbGVtZW50LmlkXVsnaWQnXSk7XHIgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKSB7XHIgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgICAgICAgICAgcG9wdXBTaGFkb3cuY2xhc3NMaXN0LmFkZCgncG9wdXAtc2hhZG93LS12aXNpYmxlJylcciAgICAgICAgICAgICAgICBzd2l0Y2goZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnc2NoZW1hJ10pIHtcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmx1ZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdub25lJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICBcciAgICAgICAgfVxyICAgIH0pO1xyXHIgICAgdmFyIGV2ZW50UG9wdXBDbG9zZSA9IGZ1bmN0aW9uKGV2ZW50KXtcciAgICAgIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyICAgICAgaWYoKCFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBDbG9zZScpIHx8IGVsZW1lbnQgPT09IHBvcHVwKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbnRhaW5lci1jdXN0b20tY2FyZF9fYnRuJylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9fdGl0bGUnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19pdGVtcycpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2xheW91dCcpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2J0bicpKSB7XHIgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpO1xyICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyICAgICAgfVxyICAgIH07XHJcciAgICBldmVudFBvcHVwQ2xvc2UgPSBldmVudFBvcHVwQ2xvc2UuYmluZCh0aGlzKTtcciAgICAvLyDQl9Cw0LrRgNGL0LLQsNC10Lwg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrRgNC10YHRgtC40LpcciAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50UG9wdXBDbG9zZSk7XHJcclxyXHIgICAgY29weUNvbnRlbnRKU0NvZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIC8vdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcciAgICAgICAgLy9yYW5nZS5zZWxlY3ROb2RlKGNvbnRlbnRKU0dlbmVyYXRpb24pO1xyICAgICAgICAvL3dpbmRvdy5nZXRTZWxlY3Rpb24oKS5hZGRSYW5nZShyYW5nZSk7XHIgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24uc2VsZWN0KCk7XHJcciAgICAgICAgdHJ5e1xyICAgICAgICAgICAgY29uc3QgdHh0Q29weSA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XHIgICAgICAgICAgICB2YXIgbXNnID0gdHh0Q29weSA/ICdzdWNjZXNzZnVsJyA6ICd1bnN1Y2Nlc3NmdWwnO1xyICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvcHkgZW1haWwgY29tbWFuZCB3YXMgJyArIG1zZyk7XHIgICAgICAgIH1cciAgICAgICAgY2F0Y2goZSl7XHIgICAgICAgICAgICBjb25zb2xlLmxvZyhg0J7RiNC40LHQutCwINC60L7Qv9C40YDQvtCy0LDQvdC40Y8gJHtlLmVyckxvZ1RvQ29uc29sZX1gKTtcciAgICAgICAgfVxyXHIgICAgICAgIC8vINCh0L3Rj9GC0LjQtSDQstGL0LTQtdC70LXQvdC40Y8gLSDQktCd0JjQnNCQ0J3QmNCVOiDQstGLINC00L7Qu9C20L3RiyDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YxcciAgICAgICAgLy8gcmVtb3ZlUmFuZ2UocmFuZ2UpINC60L7Qs9C00LAg0Y3RgtC+INCy0L7Qt9C80L7QttC90L5cciAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLnJlbW92ZUFsbFJhbmdlcygpO1xyICAgIH0pO1xyXHIgICAgY29weUNvbnRlbnRKU0NvZGUuZGlzYWJsZWQgPSAhZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkKCdjb3B5Jyk7XHJ9KTtcclxyIiwiLy8g0JzQvtC00YPQu9GMINC00LjRgdC/0LXRgtGH0LXRgCDQtNC70Y8g0L7RgtGA0LjRgdC+0LLQutC4INCx0LDQvdC90LXRgNGA0L7QsiDQvdCwINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtVxuaW1wb3J0IENpdGllcyBmcm9tICcuL2NpdGllcyc7XG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG5cbiAgICAvLyDQoNCw0LHQvtGC0LAg0YEg0YTQvtGA0LzQvtC5INC00LvRjyDQuNC90LjRhtC40LDQu9C4XG4gICAgY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XG4gICAgY29uc3QgY2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdGllcycpO1xuICAgIGNvbnN0IHNlYXJjaENpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNpdHknKTtcblxuICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XG4gICAgb2JqQ2l0aWVzLmdldENpdGllcygpO1xuXG5cbiAgICBzZWFyY2hDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XG4gICAgICBvYmpDaXRpZXMuZ2V0Q2l0aWVzKCk7XG5cbiAgICB9KTtcblxufSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cbiAqL1xuXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcbmltcG9ydCBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYy1kM2pzJztcbmltcG9ydCAqIGFzIG5hdHVyYWxQaGVub21lbm9uICBmcm9tICcuL2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEnO1xuaW1wb3J0ICogYXMgd2luZFNwZWVkIGZyb20gJy4vZGF0YS93aW5kLXNwZWVkLWRhdGEnO1xuaW1wb3J0ICogYXMgd2luZERpcmVjdGlvbiBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGUge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtcywgY29udHJvbHMsIHVybHMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgICB0aGlzLnVybHMgPSB1cmxzO1xuXG4gICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcbiAgICB0aGlzLndlYXRoZXIgPSB7XG4gICAgICBmcm9tQVBJOiB7XG4gICAgICAgIGNvb3JkOiB7XG4gICAgICAgICAgbG9uOiAnMCcsXG4gICAgICAgICAgbGF0OiAnMCcsXG4gICAgICAgIH0sXG4gICAgICAgIHdlYXRoZXI6IFt7XG4gICAgICAgICAgaWQ6ICcgJyxcbiAgICAgICAgICBtYWluOiAnICcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcgJyxcbiAgICAgICAgICBpY29uOiAnICcsXG4gICAgICAgIH1dLFxuICAgICAgICBiYXNlOiAnICcsXG4gICAgICAgIG1haW46IHtcbiAgICAgICAgICB0ZW1wOiAwLFxuICAgICAgICAgIHByZXNzdXJlOiAnICcsXG4gICAgICAgICAgaHVtaWRpdHk6ICcgJyxcbiAgICAgICAgICB0ZW1wX21pbjogJyAnLFxuICAgICAgICAgIHRlbXBfbWF4OiAnICcsXG4gICAgICAgIH0sXG4gICAgICAgIHdpbmQ6IHtcbiAgICAgICAgICBzcGVlZDogMCxcbiAgICAgICAgICBkZWc6ICcgJyxcbiAgICAgICAgfSxcbiAgICAgICAgcmFpbjoge30sXG4gICAgICAgIGNsb3Vkczoge1xuICAgICAgICAgIGFsbDogJyAnLFxuICAgICAgICB9LFxuICAgICAgICBkdDogJycsXG4gICAgICAgIHN5czoge1xuICAgICAgICAgIHR5cGU6ICcgJyxcbiAgICAgICAgICBpZDogJyAnLFxuICAgICAgICAgIG1lc3NhZ2U6ICcgJyxcbiAgICAgICAgICBjb3VudHJ5OiAnICcsXG4gICAgICAgICAgc3VucmlzZTogJyAnLFxuICAgICAgICAgIHN1bnNldDogJyAnLFxuICAgICAgICB9LFxuICAgICAgICBpZDogJyAnLFxuICAgICAgICBuYW1lOiAnVW5kZWZpbmVkJyxcbiAgICAgICAgY29kOiAnICcsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBodHRwR2V0KHVybCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XG4gICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcbiAgICAgIH07XG5cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqINCX0LDQv9GA0L7RgSDQuiBBUEkg0LTQu9GPINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YUg0YLQtdC60YPRidC10Lkg0L/QvtCz0L7QtNGLXG4gICAqL1xuICBnZXRXZWF0aGVyRnJvbUFwaSgpIHtcbiAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbiA9IG5hdHVyYWxQaGVub21lbm9uLm5hdHVyYWxQaGVub21lbm9uW3RoaXMucGFyYW1zLmxhbmddLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gd2luZFNwZWVkLndpbmRTcGVlZFt0aGlzLnBhcmFtcy5sYW5nXTtcbiAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXG4gICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcbiAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cbiAgICogQHBhcmFtIHtvYmplY3R9IEpTT05cbiAgICogQHBhcmFtIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcbiAgICogQHJldHVybiB7c3RyaW5nfSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcbiAgICovXG4gIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgIC8vINCV0YHQu9C4INGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YEg0L7QsdGK0LXQutGC0L7QvCDQuNC3INC00LLRg9GFINGN0LvQtdC80LXQvdGC0L7QsiDQstCy0LjQtNC1INC40L3RgtC10YDQstCw0LvQsFxuICAgICAgaWYgKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09ICdvYmplY3QnICYmIGVsZW1lbnROYW1lMiA9PSBudWxsKSB7XG4gICAgICAgIGlmIChlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgfVxuICAgICAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwINGBINC00LLRg9C80Y8g0Y3Qu9C10LzQtdC90YLQsNC80Lgg0LIgSlNPTlxuICAgICAgfSBlbHNlIGlmIChlbGVtZW50TmFtZTIgIT0gbnVsbCkge1xuICAgICAgICBpZiAoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pIHtcbiAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxuICAgKiBAcGFyYW0ganNvbkRhdGFcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBwYXJzZURhdGFGcm9tU2VydmVyKCkge1xuICAgIGNvbnN0IHdlYXRoZXIgPSB0aGlzLndlYXRoZXI7XG5cbiAgICBpZiAod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09ICdVbmRlZmluZWQnIHx8IHdlYXRoZXIuZnJvbUFQSS5jb2QgPT09ICc0MDQnKSB7XG4gICAgICBjb25zb2xlLmxvZygn0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YJcbiAgICBjb25zdCBtZXRhZGF0YSA9IHtcbiAgICAgIGNsb3VkaW5lc3M6ICcgJyxcbiAgICAgIGR0OiAnICcsXG4gICAgICBjaXR5TmFtZTogJyAnLFxuICAgICAgaWNvbjogJyAnLFxuICAgICAgdGVtcGVyYXR1cmU6ICcgJyxcbiAgICAgIHRlbXBlcmF0dXJlTWluOiAnICcsXG4gICAgICB0ZW1wZXJhdHVyZU1BeDogJyAnLFxuICAgICAgcHJlc3N1cmU6ICcgJyxcbiAgICAgIGh1bWlkaXR5OiAnICcsXG4gICAgICBzdW5yaXNlOiAnICcsXG4gICAgICBzdW5zZXQ6ICcgJyxcbiAgICAgIGNvb3JkOiAnICcsXG4gICAgICB3aW5kOiAnICcsXG4gICAgICB3ZWF0aGVyOiAnICcsXG4gICAgfTtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSwgMTApICsgMDtcbiAgICBtZXRhZGF0YS5jaXR5TmFtZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5uYW1lfSwgJHt3ZWF0aGVyLmZyb21BUEkuc3lzLmNvdW50cnl9YDtcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IHRlbXBlcmF0dXJlOyAvLyBgJHt0ZW1wID4gMCA/IGArJHt0ZW1wfWAgOiB0ZW1wfWA7XG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNaW4gPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21pbi50b0ZpeGVkKDApLCAxMCkgKyAwO1xuICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlTWF4ID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcF9tYXgudG9GaXhlZCgwKSwgMTApICsgMDtcbiAgICBpZiAod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbikge1xuICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xuICAgIH1cbiAgICBpZiAod2VhdGhlci53aW5kU3BlZWQpIHtcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIud2luZFNwZWVkLCB3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpLCAnc3BlZWRfaW50ZXJ2YWwnKX1gO1xuICAgICAgbWV0YWRhdGEud2luZFNwZWVkMiA9IGAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vc2A7XG4gICAgfVxuICAgIGlmICh3ZWF0aGVyLndpbmREaXJlY3Rpb24pIHtcbiAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX1gXG4gICAgfVxuICAgIGlmICh3ZWF0aGVyLmNsb3Vkcykge1xuICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci5jbG91ZHMsIHdlYXRoZXIuZnJvbUFQSS5jbG91ZHMuYWxsLCAnbWluJywgJ21heCcpfWA7XG4gICAgfVxuXG4gICAgbWV0YWRhdGEuaHVtaWRpdHkgPSBgJHt3ZWF0aGVyLmZyb21BUEkubWFpbi5odW1pZGl0eX0lYDtcbiAgICBtZXRhZGF0YS5wcmVzc3VyZSA9ICBgJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIm1haW5cIl1bXCJwcmVzc3VyZVwiXX0gbWJgO1xuICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pY29ufWA7XG5cbiAgICB0aGlzLnJlbmRlcldpZGdldChtZXRhZGF0YSk7XG4gIH1cblxuICByZW5kZXJXaWRnZXQobWV0YWRhdGEpIHtcbiAgICAvLyDQntC+0YLRgNC40YHQvtCy0LrQsCDQv9C10YDQstGL0YUg0YfQtdGC0YvRgNC10YUg0LLQuNC00LbQtdGC0L7QslxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuIGNsYXNzPSd3ZWF0aGVyLWxlZnQtY2FyZF9fZGVncmVlJz4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlci5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbikge1xuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkKSB7XG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINC/0Y/RgtC4INC/0L7RgdC70LXQtNC90LjRhSDQstC40LTQttC10YLQvtCyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZTJbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTJbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZUZlZWxzLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVsc1tlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbikge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbltlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heCkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXguaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heFtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkMiAmJiBtZXRhZGF0YS53aW5kRGlyZWN0aW9uKSB7XG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQyKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDJbZWxlbV0uaW5uZXJUZXh0ID0gYCR7bWV0YWRhdGEud2luZFNwZWVkMn0gJHttZXRhZGF0YS53aW5kRGlyZWN0aW9ufWA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWV0YWRhdGEuaHVtaWRpdHkpIHtcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmh1bWlkaXR5KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmh1bWlkaXR5Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgICAgdGhpcy5jb250cm9scy5odW1pZGl0eVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5odW1pZGl0eTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtZXRhZGF0YS5wcmVzc3VyZSkge1xuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMucHJlc3N1cmUpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMucHJlc3N1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLnByZXNzdXJlW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLnByZXNzdXJlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vINCf0YDQvtC/0LjRgdGL0LLQsNC10Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMg0LIg0LLQuNC00LbQtdGC0YtcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5kYXRlUmVwb3J0KSB7XG4gICAgICBpZiAodGhpcy5jb250cm9scy5kYXRlUmVwb3J0Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydFtlbGVtXS5pbm5lclRleHQgPSB0aGlzLmdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBpZiAodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkpIHtcbiAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XG4gICAgfVxuICB9XG5cbiAgcHJlcGFyZURhdGFGb3JHcmFwaGljKCkge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3QpIHtcbiAgICAgIGNvbnN0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XG4gICAgICBhcnIucHVzaCh7XG4gICAgICAgIG1pbjogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWluKSxcbiAgICAgICAgbWF4OiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5tYXgpLFxuICAgICAgICBkYXk6IChlbGVtICE9IDApID8gZGF5IDogJ1RvZGF5JyxcbiAgICAgICAgaWNvbjogdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS53ZWF0aGVyWzBdLmljb24sXG4gICAgICAgIGRhdGU6IHRoaXMudGltZXN0YW1wVG9EYXRlVGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRyYXdHcmFwaGljRDMoYXJyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IGRhdGU7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZWxlbS5kYXRlLnJlcGxhY2UoLyhcXGQrKS4oXFxkKykuKFxcZCspLywgJyQzLSQyLSQxJykpO1xuICAgICAgLy8g0LTQu9GPIGVkZ2Ug0YHRgtGA0L7QuNC8INC00YDRg9Cz0L7QuSDQsNC70LPQvtGA0LjRgtC8INC00LDRgtGLXG4gICAgICBpZiAoZGF0ZS50b1N0cmluZygpID09PSAnSW52YWxpZCBEYXRlJykge1xuICAgICAgICB2YXIgcmVnID0gLyhcXGQpKy9pZztcbiAgICAgICAgdmFyIGZvdW5kID0gKGVsZW0uZGF0ZSkubWF0Y2gocmVnKTtcbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGAke2ZvdW5kWzJdfS0ke2ZvdW5kWzFdfS0ke2ZvdW5kWzBdfSAke2ZvdW5kWzNdfToke2ZvdW5kWzRdID8gZm91bmRbNF0gOiAnMDAnIH06JHtmb3VuZFs1XSA/IGZvdW5kWzVdIDogJzAwJ31gKTtcbiAgICAgICAgaWYgKGRhdGUudG9TdHJpbmcoKSA9PT0gJ0ludmFsaWQgRGF0ZScpIHtcbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUoZm91bmRbMl0sZm91bmRbMV0gLSAxLGZvdW5kWzBdLGZvdW5kWzNdLGZvdW5kWzRdID8gZm91bmRbNF0gOiAnMDAnLCBmb3VuZFs1XSA/IGZvdW5kWzVdIDogJzAwJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgOF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGJyPiR7ZGF0ZS5nZXREYXRlKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDE4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMjhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZ2V0VVJMTWFpbkljb24obmFtZUljb24sIGNvbG9yID0gZmFsc2UpIHtcbiAgICAvLyDQodC+0LfQtNCw0LXQvCDQuCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC60LDRgNGC0YMg0YHQvtC/0L7RgdGC0LDQstC70LXQvdC40LlcbiAgICBjb25zdCBtYXBJY29ucyA9IG5ldyBNYXAoKTtcblxuICAgIGlmICghY29sb3IpIHtcbiAgICAgIC8vXG4gICAgICBtYXBJY29ucy5zZXQoJzAxZCcsICcwMWRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwMmQnLCAnMDJkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwNGQnLCAnMDRkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDVkJywgJzA1ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA2ZCcsICcwNmRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwN2QnLCAnMDdkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDhkJywgJzA4ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA5ZCcsICcwOWRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcxMGQnLCAnMTBkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMTFkJywgJzExZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzEzZCcsICcxM2RidycpO1xuICAgICAgLy8g0J3QvtGH0L3Ri9C1XG4gICAgICBtYXBJY29ucy5zZXQoJzAxbicsICcwMWRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwMm4nLCAnMDJkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwNG4nLCAnMDRkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDVuJywgJzA1ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA2bicsICcwNmRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcwN24nLCAnMDdkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMDhuJywgJzA4ZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzA5bicsICcwOWRidycpO1xuICAgICAgbWFwSWNvbnMuc2V0KCcxMG4nLCAnMTBkYncnKTtcbiAgICAgIG1hcEljb25zLnNldCgnMTFuJywgJzExZGJ3Jyk7XG4gICAgICBtYXBJY29ucy5zZXQoJzEzbicsICcxM2RidycpO1xuXG4gICAgICBpZiAobWFwSWNvbnMuZ2V0KG5hbWVJY29uKSkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXJhbXMuYmFzZVVSTH0vaW1nL3dpZGdldHMvJHttYXBJY29ucy5nZXQobmFtZUljb24pfS5wbmdgO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7bmFtZUljb259LnBuZ2A7XG4gICAgfVxuICAgIHJldHVybiBgJHt0aGlzLnBhcmFtcy5iYXNlVVJMfS9pbWcvd2lkZ2V0cy8ke25hbWVJY29ufS5wbmdgO1xuICB9XG5cbiAgLyoqXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgSDQv9C+0LzQvtGJ0YzRjiDQsdC40LHQu9C40L7RgtC10LrQuCBEM1xuICAgKi9cbiAgZHJhd0dyYXBoaWNEMyhkYXRhKSB7XG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XG5cbiAgICAvLyDQntGH0LjRgdGC0LrQsCDQutC+0L3RgtC10LnQvdC10YDQvtCyINC00LvRjyDQs9GA0LDRhNC40LrQvtCyICAgIFxuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljJyk7XG4gICAgY29uc3Qgc3ZnMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMScpO1xuICAgIGNvbnN0IHN2ZzIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYzInKTtcbiAgICBjb25zdCBzdmczID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMzJyk7XG5cbiAgICBpZihzdmcucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcbiAgICAgIHN2Zy5yZW1vdmVDaGlsZChzdmcucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xuICAgIH1cbiAgICBpZihzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKSB7XG4gICAgICBzdmcxLnJlbW92ZUNoaWxkKHN2ZzEucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xuICAgIH1cbiAgICBpZihzdmcyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKXtcbiAgICAgIHN2ZzIucmVtb3ZlQ2hpbGQoc3ZnMi5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XG4gICAgfVxuICAgIGlmKHN2ZzMucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xuICAgICAgICBzdmczLnJlbW92ZUNoaWxkKHN2ZzMucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xuICAgIH1cblxuXG4gICAgLy8g0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgaWQ6ICcjZ3JhcGhpYycsXG4gICAgICBkYXRhLFxuICAgICAgb2Zmc2V0WDogMTUsXG4gICAgICBvZmZzZXRZOiAxMCxcbiAgICAgIHdpZHRoOiA0MjAsXG4gICAgICBoZWlnaHQ6IDc5LFxuICAgICAgcmF3RGF0YTogW10sXG4gICAgICBtYXJnaW46IDEwLFxuICAgICAgY29sb3JQb2xpbHluZTogJyMzMzMnLFxuICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgIGZvbnRDb2xvcjogJyMzMzMnLFxuICAgICAgc3Ryb2tlV2lkdGg6ICcxcHgnLFxuICAgIH07XG5cbiAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xuICAgIGxldCBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcblxuICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDQvtGB0YLQsNC70YzQvdGL0YUg0LPRgNCw0YTQuNC60L7QslxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzEnO1xuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNEREY3MzAnO1xuICAgIG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xuXG4gICAgcGFyYW1zLmlkID0gJyNncmFwaGljMic7XG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0ZFQjAyMCc7XG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XG5cbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMzJztcbiAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9ICcjRkVCMDIwJztcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqINCe0YLQvtCx0YDQsNC20LXQvdC40LUg0LPRgNCw0YTQuNC60LAg0L/QvtCz0L7QtNGLINC90LAg0L3QtdC00LXQu9GOXG4gICAqL1xuICBkcmF3R3JhcGhpYyhhcnIpIHtcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xuXG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aCA9IDQ2NTtcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XG5cbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmJztcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDYwMCwgMzAwKTtcblxuICAgIGNvbnRleHQuZm9udCA9ICdPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHgnO1xuXG4gICAgbGV0IHN0ZXAgPSA1NTtcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3Qgem9vbSA9IDQ7XG4gICAgY29uc3Qgc3RlcFkgPSA2NDtcbiAgICBjb25zdCBzdGVwWVRleHRVcCA9IDU4O1xuICAgIGNvbnN0IHN0ZXBZVGV4dERvd24gPSA3NTtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xuICAgIGkgKz0gMTtcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcbiAgICAgIHN0ZXAgKz0gNTU7XG4gICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgaSAtPSAxO1xuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xuICAgIHN0ZXAgPSA1NTtcbiAgICBpID0gMDtcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcbiAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1pbn3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZVGV4dERvd24pO1xuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xuICAgIGkgKz0gMTtcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcbiAgICAgIHN0ZXAgKz0gNTU7XG4gICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1pbn3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZVGV4dERvd24pO1xuICAgICAgaSArPSAxO1xuICAgIH1cbiAgICBpIC09IDE7XG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzMzMyc7XG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMzMzMnO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5nZXRXZWF0aGVyRnJvbUFwaSgpO1xuICB9XG5cbn1cbiJdfQ==
