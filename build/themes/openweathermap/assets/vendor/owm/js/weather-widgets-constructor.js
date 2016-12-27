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
            dateReport: document.querySelectorAll('.widget-right__date'),
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
            var cityId = arguments.length <= 0 || arguments[0] === undefined ? 524901 : arguments[0];
            var cityName = arguments.length <= 1 || arguments[1] === undefined ? 'Moscow' : arguments[1];


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
      console.log('Ошибка копирования ' + e.errLogToConsole);
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
        var date = new Date(elem.date.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
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

},{"./custom-date":2,"./data/natural-phenomenon-data":3,"./data/wind-speed-data":4,"./graphic-d3js":6}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjaXRpZXMuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXG5hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZGF0YVxcd2luZC1zcGVlZC1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHBvcHVwLmpzIiwiYXNzZXRzXFxqc1xcc2NyaXB0LmpzIiwiYXNzZXRzXFxqc1xcd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7cWpCQ0FBOzs7O0FBSUE7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUIsTTtBQUVuQixrQkFBWSxRQUFaLEVBQXNCLFNBQXRCLEVBQWlDO0FBQUE7O0FBRS9CLFFBQU0saUJBQWlCLCtCQUF2QjtBQUNBLG1CQUFlLG1CQUFmOztBQUVBLFFBQUksQ0FBQyxTQUFTLEtBQWQsRUFBcUI7QUFDbkIsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLEdBQWdCLFNBQVMsS0FBVCxDQUFlLE9BQWYsQ0FBdUIsUUFBdkIsRUFBZ0MsR0FBaEMsRUFBcUMsV0FBckMsRUFBaEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsYUFBYSxFQUE5QjtBQUNBLFNBQUssR0FBTCxrREFBd0QsS0FBSyxRQUE3RDs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQW5CO0FBQ0EsU0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLFlBQTdCO0FBQ0EsU0FBSyxXQUFMLENBQWlCLEtBQWpCLEdBQXlCLHVCQUF6Qjs7QUFFQSxRQUFNLFlBQVksNEJBQWtCLGVBQWUsWUFBakMsRUFBK0MsZUFBZSxjQUE5RCxFQUE4RSxlQUFlLElBQTdG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bkIsR0FBMkIsS0FBckQ7QUFDQSxjQUFRLFNBQVI7QUFDQSxjQUFRLFdBQVIsR0FBc0IsTUFBdEI7QUFDQSxjQUFRLE1BQVI7QUFDQSxjQUFRLElBQVI7QUFDRDs7OzZCQUVRO0FBQ1AsV0FBSyxpQkFBTDtBQUNEOzs7Ozs7a0JBMWZrQixhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cclxuKi9cclxuXHJcbmltcG9ydCBXZWF0aGVyV2lkZ2V0IGZyb20gJy4vd2VhdGhlci13aWRnZXQnO1xyXG5pbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXRpZXMge1xyXG5cclxuICBjb25zdHJ1Y3RvcihjaXR5TmFtZSwgY29udGFpbmVyKSB7XHJcblxyXG4gICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHJcbiAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcblxyXG4gICAgaWYgKCFjaXR5TmFtZS52YWx1ZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaXR5TmFtZSA9IGNpdHlOYW1lLnZhbHVlLnJlcGxhY2UoLyhcXHMpKy9nLCctJykudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyIHx8ICcnO1xyXG4gICAgdGhpcy51cmwgPSBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9maW5kP3E9JHt0aGlzLmNpdHlOYW1lfSZ0eXBlPWxpa2Umc29ydD1wb3B1bGF0aW9uJmNudD0zMCZhcHBpZD1iMWIxNWU4OGZhNzk3MjI1NDEyNDI5YzFjNTBjMTIyYTFgO1xyXG5cclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICB0aGlzLnNlbENpdHlTaWduLmlubmVyVGV4dCA9ICcgc2VsZWN0ZWQgJztcclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24uY2xhc3MgPSAnd2lkZ2V0LWZvcm1fX3NlbGVjdGVkJztcclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LmNvbnRyb2xzV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC51cmxzKTtcclxuICAgIG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRDaXRpZXMoKSB7XHJcbiAgICBpZiAoIXRoaXMuY2l0eU5hbWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJsKVxyXG4gICAgICAudGhlbihcclxuICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nZXRTZWFyY2hEYXRhKHJlc3BvbnNlKTtcclxuICAgICAgfSxcclxuICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgIH1cclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIGdldFNlYXJjaERhdGEoSlNPTm9iamVjdCkge1xyXG4gICAgaWYgKCFKU09Ob2JqZWN0Lmxpc3QubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdDaXR5IG5vdCBmb3VuZCcpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KPQtNCw0LvRj9C10Lwg0YLQsNCx0LvQuNGG0YMsINC10YHQu9C4INC10YHRgtGMXHJcbiAgICBjb25zdCB0YWJsZUNpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XHJcbiAgICBpZiAodGFibGVDaXR5KSB7XHJcbiAgICAgIHRhYmxlQ2l0eS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhYmxlQ2l0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGh0bWwgPSAnJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgSlNPTm9iamVjdC5saXN0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHtKU09Ob2JqZWN0Lmxpc3RbaV0ubmFtZX0sICR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5fWA7XHJcbiAgICAgIGNvbnN0IGZsYWcgPSBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWFnZXMvZmxhZ3MvJHtKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnkudG9Mb3dlckNhc2UoKX0ucG5nYDtcclxuICAgICAgaHRtbCArPSBgPHRyPjx0ZCBjbGFzcz1cIndpZGdldC1mb3JtX19pdGVtXCI+PGEgaHJlZj1cIi9jaXR5LyR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGlkPVwiJHtKU09Ob2JqZWN0Lmxpc3RbaV0uaWR9XCIgY2xhc3M9XCJ3aWRnZXQtZm9ybV9fbGlua1wiPiR7bmFtZX08L2E+PGltZyBzcmM9XCIke2ZsYWd9XCI+PC9wPjwvdGQ+PC90cj5gO1xyXG4gICAgfVxyXG5cclxuICAgIGh0bWwgPSBgPHRhYmxlIGNsYXNzPVwidGFibGVcIiBpZD1cInRhYmxlLWNpdGllc1wiPiR7aHRtbH08L3RhYmxlPmA7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIGNvbnN0IHRhYmxlQ2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xyXG5cclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIHRhYmxlQ2l0aWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICgnQScpLnRvTG93ZXJDYXNlKCkgJiYgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd2lkZ2V0LWZvcm1fX2xpbmsnKSkge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENpdHkgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRDaXR5Jyk7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZENpdHkpIHtcclxuICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGF0LnNlbENpdHlTaWduLCBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vINCf0L7QtNGB0YLQsNC90L7QstC60LAg0L3QsNC50LTQtdC90L7Qs9C+INCz0L7RgNC+0LTQsFxyXG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LmNpdHlJZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC5jaXR5TmFtZSA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcclxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0oZXZlbnQudGFyZ2V0LmlkLCBldmVudC50YXJnZXQudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgd2luZG93LmNpdHlJZCA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICAgIHdpbmRvdy5jaXR5TmFtZSA9IGV2ZW50LnRhcmdldC50ZXh0Q29udGVudDtcclxuXHJcblxyXG4gICAgICAgICAgY29uc3Qgb2JqV2lkZ2V0ID0gbmV3IFdlYXRoZXJXaWRnZXQoZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC5jb250cm9sc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQudXJscyk7XHJcbiAgICAgICAgICBvYmpXaWRnZXQucmVuZGVyKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXHJcbiAgKiBAcGFyYW0gdXJsXHJcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAqL1xyXG4gIGh0dHBHZXQodXJsKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKG51bGwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxyXG4qL1xyXG5cclxuLy8g0KDQsNCx0L7RgtCwINGBINC00LDRgtC+0LlcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRGF0ZSBleHRlbmRzIERhdGUge1xyXG5cclxuICAvKipcclxuICAqINC80LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDINCyINGC0YDQtdGF0YDQsNC30YDRj9C00L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60LhcclxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbnVtYmVyIFvRh9C40YHQu9C+INC80LXQvdC10LUgOTk5XVxyXG4gICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cclxuICAqL1xyXG4gIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKSB7XHJcbiAgICBpZiAobnVtYmVyID4gMzY1KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChudW1iZXIgPCAxMCkge1xyXG4gICAgICByZXR1cm4gYDAwJHtudW1iZXJ9YDtcclxuICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwKSB7XHJcbiAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVtYmVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LIg0LPQvtC00YNcclxuICAqIEBwYXJhbSAge2RhdGV9IGRhdGUg0JTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7aW50ZWdlcn0gINCf0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0LIg0LPQvtC00YNcclxuICAqL1xyXG4gIGNvbnZlcnREYXRlVG9OdW1iZXJEYXkoZGF0ZSkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICBjb25zdCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgcmV0dXJuIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAqL1xyXG4gIGNvbnZlcnROdW1iZXJEYXlUb0RhdGUoZGF0ZSkge1xyXG4gICAgY29uc3QgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICBjb25zdCBsaW5lID0gcmUuZXhlYyhkYXRlKTtcclxuICAgIGNvbnN0IGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xyXG4gICAgY29uc3QgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgKGxpbmVbM10gKiAxMDAwICogNjAgKiA2MCAqIDI0KTtcclxuICAgIGNvbnN0IHJlcyA9IG5ldyBEYXRlKHVuaXh0aW1lKTtcclxuXHJcbiAgICBjb25zdCBtb250aCA9IHJlcy5nZXRNb250aCgpICsgMTtcclxuICAgIGNvbnN0IGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgeWVhciA9IHJlcy5nZXRGdWxsWWVhcigpO1xyXG4gICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWAgOiBkYXlzfS4ke21vbnRoIDwgMTAgPyBgMCR7bW9udGh9YCA6IG1vbnRofS4ke3llYXJ9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC00LDRgtGLINCy0LjQtNCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqIEBwYXJhbSAge2RhdGUxfSBkYXRlINC00LDRgtCwINCyINGE0L7RgNC80LDRgtC1IHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge3N0cmluZ30gINC00LDRgtCwINCy0LLQuNC00LUg0YHRgtGA0L7QutC4INGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAqL1xyXG4gIGZvcm1hdERhdGUoZGF0ZTEpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlMSk7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcblxyXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoIDwgMTApID8gYDAke21vbnRofWAgOiBtb250aH0gLSAkeyhkYXkgPCAxMCkgPyBgMCR7ZGF5fWAgOiBkYXl9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgtC10LrRg9GJ0YPRjiDQvtGC0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Rg9GOINC00LDRgtGDIHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge1tzdHJpbmddfSDRgtC10LrRg9GJ0LDRjyDQtNCw0YLQsFxyXG4gICovXHJcbiAgZ2V0Q3VycmVudERhdGUoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0RGF0ZShub3cpO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICBnZXREYXRlTGFzdFRocmVlTW9udGgoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgIGNvbnN0IGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgIGNvbnN0IG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICBsZXQgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgIGRheSAtPSA5MDtcclxuICAgIGlmIChkYXkgPCAwKSB7XHJcbiAgICAgIHllYXIgLT0gMTtcclxuICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0Q3VycmVudFNwcmluZ0RhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTAzLTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDUtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0L/RgNC10LTRi9C00YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldExhc3RTdW1tZXJEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSAtIDE7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICBnZXRGaXJzdERhdGVDdXJZZWFyKCkge1xyXG4gICAgcmV0dXJuIGAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0gLSAwMDFgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sICcnKS5yZXBsYWNlKC86XFx3KyQvLCAnJyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGhoOm1tXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIGNvbnN0IGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgY29uc3QgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgcmV0dXJuIGAke2hvdXJzIDwgMTAgPyBgMCR7aG91cnN9YCA6IGhvdXJzfSA6ICR7bWludXRlcyA8IDEwID8gYDAke21pbnV0ZXN9YCA6IG1pbnV0ZXN9IGA7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxyXG4gICogQHBhcmFtIHVuaXh0aW1lXHJcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICovXHJcbiAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICB9XHJcblxyXG4gIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxyXG4gICogQHBhcmFtIGRheU51bWJlclxyXG4gICogQHJldHVybnMge3N0cmluZ31cclxuICAqL1xyXG4gIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpIHtcclxuICAgIGNvbnN0IGRheXMgPSB7XHJcbiAgICAgIDA6ICdTdW4nLFxyXG4gICAgICAxOiAnTW9uJyxcclxuICAgICAgMjogJ1R1ZScsXHJcbiAgICAgIDM6ICdXZWQnLFxyXG4gICAgICA0OiAnVGh1JyxcclxuICAgICAgNTogJ0ZyaScsXHJcbiAgICAgIDY6ICdTYXQnLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBkYXlzW2RheU51bWJlcl07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC10YDQvdGD0YLRjCDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LzQtdGB0Y/RhtCwINC/0L4g0LXQs9C+INC90L7QvNC10YDRg1xyXG4gICAqIEBwYXJhbSBudW1Nb250aFxyXG4gICAqIEByZXR1cm5zIHsqfVxyXG4gICAqL1xyXG4gIGdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIobnVtTW9udGgpe1xyXG5cclxuICAgIGlmKHR5cGVvZiBudW1Nb250aCAhPT0gXCJudW1iZXJcIiB8fCBudW1Nb250aCA8PTAgJiYgbnVtTW9udGggPj0gMTIpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGhOYW1lID0ge1xyXG4gICAgICAwOiBcIkphblwiLFxyXG4gICAgICAxOiBcIkZlYlwiLFxyXG4gICAgICAyOiBcIk1hclwiLFxyXG4gICAgICAzOiBcIkFwclwiLFxyXG4gICAgICA0OiBcIk1heVwiLFxyXG4gICAgICA1OiBcIkp1blwiLFxyXG4gICAgICA2OiBcIkp1bFwiLFxyXG4gICAgICA3OiBcIkF1Z1wiLFxyXG4gICAgICA4OiBcIlNlcFwiLFxyXG4gICAgICA5OiBcIk9jdFwiLFxyXG4gICAgICAxMDogXCJOb3ZcIixcclxuICAgICAgMTE6IFwiRGVjXCJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG1vbnRoTmFtZVtudW1Nb250aF07XHJcbiAgfVxyXG5cclxuICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgKlxyXG4gICovXHJcbiAgY29tcGFyZURhdGVzV2l0aFRvZGF5KGRhdGUpIHtcclxuICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKSB7XHJcbiAgICBjb25zdCByZSA9IC8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcclxuICAgIGNvbnN0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgaWYgKHJlc0RhdGUubGVuZ3RoID09PSA2KSB7XHJcbiAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKTtcclxuICAgIH1cclxuICAgIC8vINCV0YHQu9C4INC00LDRgtCwINC90LUg0YDQsNGB0L/QsNGA0YHQtdC90LAg0LHQtdGA0LXQvCDRgtC10LrRg9GJ0YPRjlxyXG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiDQtNCw0YLRgyDQsiDRhNC+0YDQvNCw0YLQtSBISDpNTSBNb250aE5hbWUgTnVtYmVyRGF0ZVxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0VGltZURhdGVISE1NTW9udGhEYXkoKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiBgJHtkYXRlLmdldEhvdXJzKCkgPCAxMCA/IGAwJHtkYXRlLmdldEhvdXJzKCl9YCA6IGRhdGUuZ2V0SG91cnMoKSB9OiR7ZGF0ZS5nZXRNaW51dGVzKCkgPCAxMCA/IGAwJHtkYXRlLmdldE1pbnV0ZXMoKX1gIDogZGF0ZS5nZXRNaW51dGVzKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9ICR7ZGF0ZS5nZXREYXRlKCl9YDtcclxuICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjAuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBjb25zdCBuYXR1cmFsUGhlbm9tZW5vbiA9e1xyXG4gICAgXCJlblwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkVuZ2xpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGVhdnkgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwic2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcImhlYXZ5IHNob3dlciByYWluIGFuZCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibW9kZXJhdGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcInJhZ2dlZCBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGlnaHQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInNob3dlciBzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwibGlnaHQgcmFpbiBhbmQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwicmFpbiBhbmQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwibGlnaHQgc2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJoZWF2eSBzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImhhemVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmQsZHVzdCB3aGlybHNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwic2FuZFwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiZHVzdFwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwidm9sY2FuaWMgYXNoXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJzcXVhbGxzXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjbGVhciBza3lcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwic2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwibGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJnZW50bGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJtb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcImZyZXNoIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwic3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiaGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcImdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcInNldmVyZSBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwidmlvbGVudCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiaHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJydVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlJ1c3NpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2ZcXHUwNDQwXFx1MDQzZVxcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0MzJcXHUwNDNlXFx1MDQzN1xcdTA0M2NcXHUwNDNlXFx1MDQzNlxcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzNlxcdTA0MzVcXHUwNDQxXFx1MDQ0MlxcdTA0M2VcXHUwNDNhXFx1MDQzMFxcdTA0NGYgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2RcXHUwNDRjIFxcdTA0NDFcXHUwNDRiXFx1MDQ0MFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDM4XFx1MDQzZFxcdTA0NDJcXHUwNDM1XFx1MDQzZFxcdTA0NDFcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQzZVxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcXHUwNDNiXFx1MDQ0Y1xcdTA0NDhcXHUwNDNlXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQ0ZlxcdTA0M2FcXHUwNDNlXFx1MDQ0MlxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQ0N1xcdTA0MzBcXHUwNDNkXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0ZlxcdTA0NDFcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0M2ZcXHUwNDMwXFx1MDQ0MVxcdTA0M2NcXHUwNDQzXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0MzhcXHUwNDQ3XFx1MDQzNVxcdTA0NDFcXHUwNDNhXFx1MDQzMFxcdTA0NGYgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDM2XFx1MDQzMFxcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzNVxcdTA0M2RcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJpdFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkl0YWxpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dpYSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRlbXBvcmFsZSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImZvcnRlIHBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwaW9nZ2lhIGxlZ2dlcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBpb2dnaWEgbW9kZXJhdGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImZvcnRlIHBpb2dnaWFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBpb2dnaWEgZm9ydGlzc2ltYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicGlvZ2dpYSBlc3RyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwaW9nZ2lhIGdlbGF0YVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImZvcnRlIG5ldmljYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJuZXZpc2NoaW9cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImZvcnRlIG5ldmljYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJmb3NjaGlhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1vXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJmb3NjaGlhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJtdWxpbmVsbGkgZGkgc2FiYmlhXFwvcG9sdmVyZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibmViYmlhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBzZXJlbm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInBvY2hlIG51dm9sZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViaSBzcGFyc2VcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51Ymkgc3BhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJjaWVsbyBjb3BlcnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YSB0cm9waWNhbGVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhbm9cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyZWRkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2FsZG9cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5kaW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtb1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQmF2YSBkaSB2ZW50b1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJlenphIGxlZ2dlcmFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyZXp6YSB0ZXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJVcmFnYW5vXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJzcFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlNwYW5pc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgY29uIGxsdXZpYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdlcmEgdG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdWVydGUgdG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRvcm1lbnRhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwibGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImxsdXZpYSB5IGxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJsbHV2aWEgeSBsbG92aXpuYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImNodWJhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsbHV2aWEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJsbHV2aWEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImxsdXZpYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImxsdXZpYSBtdXkgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJsbHV2aWEgbXV5IGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibGx1dmlhIGhlbGFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1YmFzY28gZGUgbGlnZXJhIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNodWJhc2NvXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaHViYXNjbyBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiYWd1YW5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJjaHViYXNjbyBkZSBuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJodW1vXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuaWVibGFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInRvcmJlbGxpbm9zIGRlIGFyZW5hXFwvcG9sdm9cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjaWVsbyBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJhY1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlZpZW50byBmbG9qb1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmllbnRvIHN1YXZlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJWaWVudG8gbW9kZXJhZG9cIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWaWVudG8gZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWaWVudG8gZnVlcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhZFwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ1YVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlVrcmFpbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3XFx1MDQ1NiBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZVxcdTA0NGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDNhXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQ0MlxcdTA0M2FcXHUwNDNlXFx1MDQ0N1xcdTA0MzBcXHUwNDQxXFx1MDQzZFxcdTA0NTYgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0M2ZcXHUwNDNlXFx1MDQzY1xcdTA0NTZcXHUwNDQwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0M2FcXHUwNDQwXFx1MDQzOFxcdTA0MzZcXHUwNDMwXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzIFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzY1xcdTA0M2VcXHUwNDNhXFx1MDQ0MFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0NDFcXHUwNDM1XFx1MDQ0MFxcdTA0M2ZcXHUwNDMwXFx1MDQzZFxcdTA0M2VcXHUwNDNhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQ1NlxcdTA0NDlcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzNVxcdTA0NDJcXHUwNDU2XFx1MDQzYlxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDQ3XFx1MDQzOFxcdTA0NDFcXHUwNDQyXFx1MDQzNSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDQ1XFx1MDQzOCBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0NTZcXHUwNDQwXFx1MDQzMlxcdTA0MzBcXHUwNDNkXFx1MDQ1NiBcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDU2XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzVcXHUwNDMyXFx1MDQ1NlxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0NDFcXHUwNDNmXFx1MDQzNVxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQ1NlxcdTA0NDJcXHUwNDQwXFx1MDQ0ZlxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImRlXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiR2VybWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHZXdpdHRlciBtaXQgUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdld2l0dGVyIG1pdCBzdGFya2VtIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsZWljaHRlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2Nod2VyZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZWluaWdlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdld2l0dGVyIG1pdCBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxlaWNodGVzIE5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIk5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInN0YXJrZXMgTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGVpY2h0ZXIgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIk5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzdGFya2VyIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJOaWVzZWxzY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsZWljaHRlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJzZWhyIHN0YXJrZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlN0YXJrcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIkVpc3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsZWljaHRlIFJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWZ0aWdlIFJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibVxcdTAwZTRcXHUwMGRmaWdlciBTY2huZWVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlNjaG5lZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVmdGlnZXIgU2NobmVlZmFsbFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiR3JhdXBlbFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiU2NobmVlc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwidHJcXHUwMGZjYlwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiUmF1Y2hcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkR1bnN0XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTYW5kIFxcLyBTdGF1YnN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJlbFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhcmVyIEhpbW1lbFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZWluIHBhYXIgV29sa2VuXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwMGZjYmVyd2llZ2VuZCBiZXdcXHUwMGY2bGt0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ3b2xrZW5iZWRlY2t0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9wZW5zdHVybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVycmlrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImthbHRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhlaVxcdTAwZGZcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmRpZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiSGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIldpbmRzdGlsbGVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxlaWNodGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIk1pbGRlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNXFx1MDBlNFxcdTAwZGZpZ2UgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyaXNjaGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0YXJrZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSG9jaHdpbmQsIGFublxcdTAwZTRoZW5kZXIgU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTY2h3ZXJlciBTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkhlZnRpZ2VzIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicHRcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJQb3J0dWd1ZXNlXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidHJvdm9hZGEgY29tIGNodXZhIGxldmVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidHJvdm9hZGEgY29tIGNodXZhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0cm92b2FkYSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0cm92b2FkYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidHJvdm9hZGEgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0cm92b2FkYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidHJvdm9hZGEgY29tIGdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJnYXJvYSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImdhcm9hIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImNodXZhIGxldmVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImNodXZhIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJjaHV2YSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiY2h1dmEgZGUgZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImNodXZhIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJDaHV2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2h1dmEgZGUgaW50ZW5zaWRhZGUgcGVzYWRvXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaHV2YSBtdWl0byBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiQ2h1dmEgRm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImNodXZhIGNvbSBjb25nZWxhbWVudG9cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNodXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHV2YVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2h1dmEgZGUgaW50ZW5zaWRhZGUgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZlIGJyYW5kYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTmV2ZSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImNodXZhIGNvbSBuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJiYW5obyBkZSBuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJOXFx1MDBlOXZvYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtYVxcdTAwZTdhXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZWJsaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0dXJiaWxoXFx1MDBmNWVzIGRlIGFyZWlhXFwvcG9laXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJOZWJsaW5hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjXFx1MDBlOXUgY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkFsZ3VtYXMgbnV2ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudXZlbnMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudXZlbnMgcXVlYnJhZG9zXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ0ZW1wbyBudWJsYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wZXN0YWRlIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmlvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJxdWVudGVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImNvbSB2ZW50b1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3Jhbml6b1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJyb1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlJvbWFuaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiZnVydHVuXFx1MDEwMyBjdSBwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImZ1cnR1blxcdTAxMDMgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJmdXJ0dW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJmdXJ0dW5cXHUwMTAzIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZnVydHVuXFx1MDEwMyBhcHJpZ1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgam9hc1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgbWFyZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBtYXJlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwbG9haWUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbG9haWVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInBsb2FpZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBsb2FpZSB0b3JlblxcdTAyMWJpYWxcXHUwMTAzIFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicGxvYWllIGV4dHJlbVxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBsb2FpZSBcXHUwMGVlbmdoZVxcdTAyMWJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5pbnNvYXJlIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmluc29hcmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5pbnNvYXJlIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibGFwb3ZpXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5pbnNvYXJlIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInZcXHUwMGUycnRlanVyaSBkZSBuaXNpcFwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNlciBzZW5pblwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiY1xcdTAwZTJcXHUwMjFiaXZhIG5vcmlcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm5vcmkgXFx1MDBlZW1wclxcdTAxMDNcXHUwMjE5dGlhXFx1MDIxYmlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImNlciBmcmFnbWVudGF0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJjZXIgYWNvcGVyaXQgZGUgbm9yaVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiZnVydHVuYSB0cm9waWNhbFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcInVyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwicmVjZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiZmllcmJpbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2YW50IHB1dGVybmljXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmluZGluXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJwbFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlBvbGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkJ1cnphIHogbGVra2ltaSBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkJ1cnphIHogb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJCdXJ6YSB6IGludGVuc3l3bnltaSBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkxla2thIGJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJCdXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiU2lsbmEgYnVyemFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJCdXJ6YSB6IGxla2tcXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiQnVyemEgeiBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkJ1cnphIHogaW50ZW5zeXduXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIkxla2thIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiTVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJJbnRlbnN5d25hIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiTGVra2llIG9wYWR5IGRyb2JuZWdvIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIkRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJJbnRlbnN5d255IGRlc3pjeiBcXC8gbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJTaWxuYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIkxla2tpIGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiVW1pYXJrb3dhbnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJJbnRlbnN5d255IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiYmFyZHpvIHNpbG55IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiVWxld2FcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIk1hcnpuXFx1MDEwNWN5IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiS3JcXHUwMGYzdGthIHVsZXdhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJEZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIkludGVuc3l3bnksIGxla2tpIGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTGVra2llIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDE1YW5pZWdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk1vY25lIG9wYWR5IFxcdTAxNWJuaWVndVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiRGVzemN6IHplIFxcdTAxNWJuaWVnZW1cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTAxNWFuaWVcXHUwMTdjeWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJNZ2llXFx1MDE0MmthXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJTbW9nXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJaYW1nbGVuaWFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlphbWllXFx1MDEwNyBwaWFza293YVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTWdcXHUwMTQyYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQmV6Y2htdXJuaWVcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkxla2tpZSB6YWNobXVyemVuaWVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlJvenByb3N6b25lIGNobXVyeVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiUG9jaG11cm5vIHogcHJ6ZWphXFx1MDE1Ym5pZW5pYW1pXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJQb2NobXVybm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImJ1cnphIHRyb3Bpa2FsbmFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIkNoXFx1MDE0Mm9kbm9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIkdvclxcdTAxMDVjb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2lldHJ6bmllXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJHcmFkXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTcG9rb2puaWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxla2thIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJEZWxpa2F0bmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlVtaWFya293YW5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTVhd2llXFx1MDE3Y2EgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJQcmF3aWUgd2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiV2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2lsbmEgd2ljaHVyYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3p0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJHd2FcXHUwMTQydG93bnkgc3p0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhZ2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJmaVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkZpbm5pc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ1a2tvc215cnNreSBqYSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInBpZW5pIHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwia292YSB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwibGlldlxcdTAwZTQgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInVra29zbXlyc2t5IGphIGtldnl0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidWtrb3NteXJza3kgamEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ1a2tvc215cnNreSBqYSBrb3ZhIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlldlxcdTAwZTQgdGlodXR0YWluZW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInRpaHV0dGFhXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJrb3ZhIHRpaHV0dGFpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWV2XFx1MDBlNCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwia292YSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGllbmkgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwia29odGFsYWluZW4gc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJlcml0dFxcdTAwZTRpbiBydW5zYXN0YSBzYWRldHRhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImpcXHUwMGU0XFx1MDBlNHRcXHUwMGU0dlxcdTAwZTQgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwicGllbmkgbHVtaXNhZGVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcImx1bWlcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInBhbGpvbiBsdW50YVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiclxcdTAwZTRudFxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImx1bWlrdXVyb1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic2F2dVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiaGlla2thXFwvcFxcdTAwZjZseSBweVxcdTAwZjZycmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInRhaXZhcyBvbiBzZWxrZVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInZcXHUwMGU0aFxcdTAwZTRuIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiYWpvaXR0YWlzaWEgcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJoYWphbmFpc2lhIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwicGlsdmluZW5cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb29wcGluZW4gbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJoaXJtdW15cnNreVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia3lsbVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImt1dW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ0dXVsaW5lblwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwicmFrZWl0YVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJubFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkR1dGNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvbndlZXJzYnVpIG1ldCByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpY2h0ZSBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ6d2FyZSBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvbnJlZ2VsbWF0aWcgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwib253ZWVyc2J1aSBtZXQgbGljaHRlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvbndlZXJzYnVpIG1ldCBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwib253ZWVyc2J1aSBtZXQgendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpY2h0ZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWNodGUgbW90cmVnZW5cXC9yZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInp3YXJlIG1vdHJlZ2VuXFwvcmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWNodGUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1hdGlnZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInplZXIgendhcmUgcmVnZW52YWxcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIktvdWRlIGJ1aWVuXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWNodGUgc3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiendhcmUgc3RvcnRyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGljaHRlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZXZpZ2Ugc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJpanplbFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmF0dGUgc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuZXZlbFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiemFuZFxcL3N0b2Ygd2VydmVsaW5nXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJvbmJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImxpY2h0IGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcImhhbGYgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiendhYXIgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiZ2VoZWVsIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bpc2NoZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYWFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrb3VkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJoZWV0XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzdG9ybWFjaHRpZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIldpbmRzdGlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJLYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWNodGUgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlphY2h0ZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTWF0aWdlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJWcmlqIGtyYWNodGlnZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLcmFjaHRpZ2Ugd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGFyZGUgd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3Rvcm1hY2h0aWdcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJad2FyZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiWmVlciB6d2FyZSBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3JrYWFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJmclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkZyZW5jaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIm9yYWdlIGV0IHBsdWllIGZpbmVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIm9yYWdlIGV0IHBsdWllXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJvcmFnZSBldCBmb3J0ZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJvcmFnZXMgbFxcdTAwZTlnZXJzXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJvcmFnZXNcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImdyb3Mgb3JhZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiT3JhZ2UgYXZlYyBsXFx1MDBlOWdcXHUwMGU4cmUgYnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJvcmFnZXMgXFx1MDBlOXBhcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JvcyBvcmFnZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiQnJ1aW5lIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiQnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJGb3J0ZXMgYnJ1aW5lc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1aWUgZmluZSBcXHUwMGU5cGFyc2VcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBsdWllIGZpbmVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIkNyYWNoaW4gaW50ZW5zZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiQXZlcnNlcyBkZSBicnVpbmVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxcXHUwMGU5Z1xcdTAwZThyZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwbHVpZXMgbW9kXFx1MDBlOXJcXHUwMGU5ZXNcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIkZvcnRlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInRyXFx1MDBlOHMgZm9ydGVzIHByXFx1MDBlOWNpcGl0YXRpb25zXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJncm9zc2VzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGx1aWUgdmVyZ2xhXFx1MDBlN2FudGVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBldGl0ZXMgYXZlcnNlc1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiYXZlcnNlcyBkZSBwbHVpZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiYXZlcnNlcyBpbnRlbnNlc1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibFxcdTAwZTlnXFx1MDBlOHJlcyBuZWlnZXNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZXMgY2h1dGVzIGRlIG5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJuZWlnZSBmb25kdWVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImF2ZXJzZXMgZGUgbmVpZ2VcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImJydW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJCcm91aWxsYXJkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJicnVtZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidGVtcFxcdTAwZWF0ZXMgZGUgc2FibGVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJyb3VpbGxhcmRcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImVuc29sZWlsbFxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInBldSBudWFnZXV4XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwYXJ0aWVsbGVtZW50IGVuc29sZWlsbFxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YWdldXhcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkNvdXZlcnRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZGVcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBcXHUwMGVhdGUgdHJvcGljYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvdXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcm9pZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2hhdWRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRldXhcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyXFx1MDBlYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQnJpc2UgbFxcdTAwZTlnXFx1MDBlOHJlXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzZSBkb3VjZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2UgbW9kXFx1MDBlOXJcXHUwMGU5ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2UgZnJhaWNoZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiQnJpc2UgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgZm9ydCwgcHJlc3F1ZSB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW50IHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbnQgdHJcXHUwMGU4cyB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wXFx1MDBlYXRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJlbXBcXHUwMGVhdGUgdmlvbGVudGVcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk91cmFnYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImJnXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQnVsZ2FyaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDNmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQyMFxcdTA0NGFcXHUwNDNjXFx1MDQ0ZlxcdTA0NDkgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0MjNcXHUwNDNjXFx1MDQzNVxcdTA0NDBcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDFjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQxNFxcdTA0NGFcXHUwNDM2XFx1MDQzNCBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0NDJcXHUwNDQzXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDFlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQxZlxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQyMVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQxOFxcdTA0MzdcXHUwNDNkXFx1MDQzNVxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0MzJcXHUwNDMwXFx1MDQ0OSBcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDE0XFx1MDQzOFxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2NcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDFmXFx1MDQ0ZlxcdTA0NDFcXHUwNDRhXFx1MDQ0N1xcdTA0M2RcXHUwNDMwXFwvXFx1MDQxZlxcdTA0NDBcXHUwNDMwXFx1MDQ0OFxcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0MWNcXHUwNDRhXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDJmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0MWRcXHUwNDM4XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQzYVxcdTA0NGFcXHUwNDQxXFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQyMFxcdTA0MzBcXHUwNDM3XFx1MDQ0MVxcdTA0MzVcXHUwNDRmXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDIyXFx1MDQ0YVxcdTA0M2NcXHUwNDNkXFx1MDQzOCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0MjJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcXC9cXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0MjJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDIxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XFx1MDQzNVxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDEzXFx1MDQzZVxcdTA0NDBcXHUwNDM1XFx1MDQ0OVxcdTA0M2UgXFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MTJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJzZVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlN3ZWRpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwMGU1c2thXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTAwZTVza2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9qXFx1MDBlNG1udCBvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJmdWxsdCBcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIm1qdWt0IGR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaFxcdTAwZTVydCBkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibWp1a3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicmVnblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaFxcdTAwZTVydCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibWp1a3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiTVxcdTAwZTV0dGxpZyByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm15Y2tldCBrcmFmdGlndCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwMGY2c3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInVuZGVya3lsdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtanVrdCBcXHUwMGY2c3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImR1c2NoLXJlZ25cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInJlZ25hciBzbVxcdTAwZTVzcGlrXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtanVrIHNuXFx1MDBmNlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25cXHUwMGY2XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJrcmFmdGlndCBzblxcdTAwZjZmYWxsXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzblxcdTAwZjZibGFuZGF0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuXFx1MDBmNm92XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZGltbWFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2dnXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJkaXNcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZGltbWlndFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwia2xhciBoaW1tZWxcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIm5cXHUwMGU1Z3JhIG1vbG5cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNwcmlkZGEgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibW9sbmlndFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDBmNnZlcnNrdWdnYW5kZSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlzayBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImthbGx0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJ2YXJtdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiYmxcXHUwMGU1c2lndFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFnZWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiemhfdHdcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFRyYWRpdGlvbmFsXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHU1MWNkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1NWMwZlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTU5MjdcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHU5NmU4XFx1NTkzZVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2NjNcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHU4NTg0XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1NzE1OVxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHU2Yzk5XFx1NjVjYlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTU5MjdcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHU2Njc0XFx1ZmYwY1xcdTVjMTFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTk2NzBcXHVmZjBjXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTlmOGRcXHU2MzcyXFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzFiMVxcdTVlMzZcXHU5OGE4XFx1NjZiNFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1OThiNlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTUxYjdcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcxYjFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTU5MjdcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHU1MWIwXFx1OTZmOVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ0clwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlR1cmtpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiSGFmaWYgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiU2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDE1ZWlkZGV0bGkgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQXJhbFxcdTAxMzFrbFxcdTAxMzEgc2FcXHUwMTFmYW5ha1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBoYWZpZiB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiWWVyIHllciBoYWZpZiB5b1xcdTAxMWZ1bmx1a2x1IHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiWWVyIHllciBoYWZpZiB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJZZXIgeWVyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlllciB5ZXIgeW9cXHUwMTFmdW4geWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiWWVyIHllciBzYVxcdTAxMWZhbmFrIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIkhhZmlmIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiT3J0YSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTAxNWVpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDBjN29rIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiQVxcdTAxNWZcXHUwMTMxclxcdTAxMzEgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJZYVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxIHZlIHNvXFx1MDExZnVrIGhhdmFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiSGFmaWYga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIkthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJZb1xcdTAxMWZ1biBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiS2FybGEga2FyXFx1MDEzMVxcdTAxNWZcXHUwMTMxayB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbFxcdTAwZmMga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJIYWZpZiBzaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiS3VtXFwvVG96IGZcXHUwMTMxcnRcXHUwMTMxbmFzXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkFcXHUwMGU3XFx1MDEzMWtcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkF6IGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYXogYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJLYXBhbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIkthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BpayBmXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIb3J0dW1cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTAwYzdvayBTb1xcdTAxMWZ1a1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDBjN29rIFNcXHUwMTMxY2FrXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiRG9sdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIkR1cmd1blwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiU2FraW5cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkhhZmlmIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJBeiBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiT3J0YSBTZXZpeWUgUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJLdXZ2ZXRsaSBSXFx1MDBmY3pnYXJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlNlcnQgUlxcdTAwZmN6Z2FyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwMTVlaWRkZXRsaSBGXFx1MDEzMXJ0XFx1MDEzMW5hXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwMTVlaWRkZXRsaSBLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZWlkZGV0bGkgS2FzXFx1MDEzMXJnYVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiemhfY25cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDaGluZXNlIFNpbXBsaWZpZWRcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1NGUyZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1NjZiNFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTUxYmJcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1NTkyN1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTM5XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1OTYzNVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MGRmXFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1ODU4NFxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTZjOTlcXHU2NWNiXFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTY2NzRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTY2NzRcXHVmZjBjXFx1NWMxMVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1OTYzNFxcdWZmMGNcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY5OVxcdTUzNzdcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHU3MGVkXFx1NWUyNlxcdTk4Y2VcXHU2NmI0XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHU5OGQzXFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1NzBlZFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1NTkyN1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImN6XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ3plY2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2xhYlxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiYm91XFx1MDE1OWthIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJcXHUwMTYxXFx1MDBlZCBib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2lsblxcdTAwZTEgYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJib3VcXHUwMTU5a292XFx1MDBlMSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiYm91XFx1MDE1OWthIHNlIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImJvdVxcdTAxNTlrYSBzIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiYm91XFx1MDE1OWthIHNlIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibXJob2xlblxcdTAwZWQgcyBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5cXHUwMGVkIGEgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwibXJob2xlblxcdTAwZWQgYSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwibXJob2xlblxcdTAwZWQgYSBzaWxuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwicHJ1ZGtcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInBcXHUwMTU5XFx1MDBlZHZhbG92XFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwclxcdTAxNmZ0clxcdTAxN2UgbXJhXFx1MDEwZGVuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpub3VjXFx1MDBlZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtXFx1MDBlZHJuXFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJodXN0XFx1MDBlOSBzblxcdTAxMWJcXHUwMTdlZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJ6bXJ6bFxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic21cXHUwMGVkXFx1MDE2MWVuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcImRcXHUwMGU5XFx1MDE2MVxcdTAxNjUgc2Ugc25cXHUwMTFiaGVtXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbGFiXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzaWxuXFx1MDBlOSBzblxcdTAxMWJob3ZcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtbGhhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJrb3VcXHUwMTU5XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJvcGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwXFx1MDBlZHNlXFx1MDEwZG5cXHUwMGU5IFxcdTAxMGRpIHByYWNob3ZcXHUwMGU5IHZcXHUwMGVkcnlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImh1c3RcXHUwMGUxIG1saGFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInBcXHUwMGVkc2VrXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxbm9cIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInNvcGVcXHUwMTBkblxcdTAwZmQgcG9wZWxcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInBydWRrXFx1MDBlOSBib3VcXHUwMTU5ZVwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInNrb3JvIGphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInphdGFcXHUwMTdlZW5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBib3VcXHUwMTU5ZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9ya29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZcXHUwMTFidHJub1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRcXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJiZXp2XFx1MDExYnRcXHUwMTU5XFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwidlxcdTAwZTFuZWtcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcInZcXHUwMTFidFxcdTAxNTlcXHUwMGVka1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwibVxcdTAwZWRyblxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwZGVyc3R2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJzaWxuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJwcnVka1xcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiYm91XFx1MDE1OWxpdlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwidmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcInNpbG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJtb2h1dG5cXHUwMGUxIHZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwia3JcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJLb3JlYVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRodW5kZXJzdG9ybSB3aXRoIHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2h0IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInJhZ2dlZCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJzaG93ZXIgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibW9kZXJhdGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlcnkgaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJmcmVlemluZyByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWdodCBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJoZWF2eSBpbnRlbnNpdHkgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNub3dcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21va2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImhhemVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInNhbmRcXC9kdXN0IHdoaXJsc1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZm9nXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJza3kgaXMgY2xlYXJcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImZldyBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInNjYXR0ZXJlZCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImJyb2tlbiBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm92ZXJjYXN0IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGljYWwgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpY2FuZVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiY29sZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG90XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5keVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiaGFpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJnbFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkdhbGljaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvIGludGVuc29cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIm9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwib3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwib3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaG9pdmEgZSBvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImNob2l2YSBlIG9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImNob2l2YSBlIG9yYmFsbG8gZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwib3JiYWxsbyBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiY2hvaXZhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImNob2l2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiY2hvaXZhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImNob2l2YSBtb2kgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImNob2l2YSBleHRyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaG9pdmEgeGVhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNob2l2YSBkZSBkdWNoYSBkZSBiYWl4YSBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2hvaXZhIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2YWRhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJhdWdhbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmV2ZSBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiblxcdTAwZTlib2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bWVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5cXHUwMGU5Ym9hIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInJlbXVpXFx1MDBmMW9zIGRlIGFyZWEgZSBwb2x2b1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJ1bWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNlbyBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYWxnbyBkZSBudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnViZXMgZGlzcGVyc2FzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJlcyByb3Rhc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibnViZXNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRvcm1lbnRhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJmdXJhY1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmclxcdTAwZWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwic2FyYWJpYVwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiY2FsbWFcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlZlbnRvIGZyb3V4b1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiVmVudG8gc3VhdmVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlZlbnRvIG1vZGVyYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiVmVudG8gZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnRvIGZvcnRlLCBwclxcdTAwZjN4aW1vIGEgdmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGFkZSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiRnVyYWNcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidmlcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJ2aWV0bmFtZXNlXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBNXFx1MDFiMGEgbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gY1xcdTAwZjMgY2hcXHUxZWRicCBnaVxcdTFlYWR0XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJCXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkJcXHUwMGUzbyB2XFx1MDBlMGkgblxcdTAxYTFpXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTFlZGJpIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTAwZTFuaCBzXFx1MDBlMW5nIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW4gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtXFx1MDFiMGEgdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5biBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJtXFx1MDFiMGEgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDFiMGEgdlxcdTFlZWJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJtXFx1MDFiMGEgY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibVxcdTAxYjBhIHJcXHUxZWE1dCBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJtXFx1MDFiMGEgbFxcdTFlZDFjXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtXFx1MDFiMGEgbFxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG9cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwidHV5XFx1MWViZnQgclxcdTAxYTFpIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwidHV5XFx1MWViZnRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInR1eVxcdTFlYmZ0IG5cXHUxZWI3bmcgaFxcdTFlYTF0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJtXFx1MDFiMGEgXFx1MDExMVxcdTAwZTFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInR1eVxcdTFlYmZ0IG1cXHUwMGY5IHRyXFx1MWVkZGlcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUxZWRkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJraFxcdTAwZjNpIGJcXHUxZWU1aVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDExMVxcdTAwZTFtIG1cXHUwMGUyeVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiYlxcdTAwZTNvIGNcXHUwMGUxdCB2XFx1MDBlMCBsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwic1xcdTAxYjBcXHUwMWExbmcgbVxcdTAwZjlcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImJcXHUxZWE3dSB0clxcdTFlZGRpIHF1YW5nIFxcdTAxMTFcXHUwMGUzbmdcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIm1cXHUwMGUyeSB0aFxcdTAxYjBhXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJtXFx1MDBlMnkgclxcdTFlYTNpIHJcXHUwMGUxY1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibVxcdTAwZTJ5IGNcXHUxZWU1bVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwibVxcdTAwZTJ5IFxcdTAxMTFlbiB1IFxcdTAwZTFtXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJsXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiY1xcdTAxYTFuIGJcXHUwMGUzbyBuaGlcXHUxZWM3dCBcXHUwMTExXFx1MWVkYmlcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImJcXHUwMGUzbyBsXFx1MWVkMWNcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImxcXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIm5cXHUwMGYzbmdcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImdpXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwibVxcdTAxYjBhIFxcdTAxMTFcXHUwMGUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJDaFxcdTFlYmYgXFx1MDExMVxcdTFlY2RcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIk5oXFx1MWViOSBuaFxcdTAwZTBuZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDBjMW5oIHNcXHUwMGUxbmcgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHXFx1MDBlZG8gdGhvXFx1MWVhM25nXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJHaVxcdTAwZjMgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJHaVxcdTAwZjMgdlxcdTFlZWJhIHBoXFx1MWVhM2lcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkdpXFx1MDBmMyBtXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJHaVxcdTAwZjMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiTFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiQlxcdTAwZTNvIGNcXHUxZWE1cCBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkJcXHUwMGUzbyBsXFx1MWVkMWNcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImFyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQXJhYmljXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyM1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA2MjdcXHUwNjQ0XFx1MDYzOVxcdTA2NDhcXHUwNjI3XFx1MDYzNVxcdTA2NDEgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyN1xcdTA2NDRcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmJcXHUwNjQyXFx1MDY0YVxcdTA2NDRcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJlXFx1MDYzNFxcdTA2NDZcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MSBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MSBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDY0NVxcdTA2MmFcXHUwNjQ4XFx1MDYzM1xcdTA2MzcgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM5XFx1MDYyN1xcdTA2NDRcXHUwNjRhIFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjI4XFx1MDYzMVxcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2NDdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmMgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDYzNVxcdTA2NDJcXHUwNjRhXFx1MDYzOVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNjM2XFx1MDYyOFxcdTA2MjdcXHUwNjI4XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNjJmXFx1MDYyZVxcdTA2MjdcXHUwNjQ2XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNjNhXFx1MDYyOFxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDVcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA2MzNcXHUwNjQ1XFx1MDYyN1xcdTA2MjEgXFx1MDYzNVxcdTA2MjdcXHUwNjQxXFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA2M2FcXHUwNjI3XFx1MDYyNlxcdTA2NDUgXFx1MDYyY1xcdTA2MzJcXHUwNjI2XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDVcXHUwNjJhXFx1MDY0MVxcdTA2MzFcXHUwNjQyXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDZcXHUwNjI3XFx1MDYyYlxcdTA2MzFcXHUwNjQ3XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDJcXHUwNjI3XFx1MDYyYVxcdTA2NDVcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYyN1xcdTA2MzNcXHUwNjJhXFx1MDY0OFxcdTA2MjdcXHUwNjI2XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA2MzJcXHUwNjQ4XFx1MDY0YVxcdTA2MzlcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNjI4XFx1MDYyN1xcdTA2MzFcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNjJkXFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA2MzFcXHUwNjRhXFx1MDYyN1xcdTA2MmRcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYyZlxcdTA2MjdcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcXHUwNjQ3XFx1MDYyN1xcdTA2MmZcXHUwNjI2XCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NFxcdTA2MzdcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQ1XFx1MDYzOVxcdTA2MmFcXHUwNjJmXFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjM5XFx1MDY0NFxcdTA2NGFcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDYzMVxcdTA2NGFcXHUwNjI3XFx1MDYyZCBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzlcXHUwNjQ2XFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MzVcXHUwNjI3XFx1MDYzMVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwibWtcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJNYWNlZG9uaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDNjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzZlxcdTA0MzBcXHUwNDMyXFx1MDQzOFxcdTA0NDZcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQ0MVxcdTA0M2NcXHUwNDNlXFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQzN1xcdTA0MzBcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzNVxcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDM1XFx1MDQ0MVxcdTA0M2VcXHUwNDQ3XFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0NDBcXHUwNDQyXFx1MDQzYlxcdTA0M2VcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDNjXFx1MDQzMFxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0N1xcdTA0MzhcXHUwNDQxXFx1MDQ0MlxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQzZFxcdTA0MzVcXHUwNDNhXFx1MDQzZVxcdTA0M2JcXHUwNDNhXFx1MDQ0MyBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0M2VcXHUwNDM0XFx1MDQzMlxcdTA0M2VcXHUwNDM1XFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDNmXFx1MDQzYlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzMlxcdTA0MzhcXHUwNDQyXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXFx1MDQxN1xcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA0MWNcXHUwNDM4XFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDQyMVxcdTA0MzJcXHUwNDM1XFx1MDQzNiBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcXHUwNDFkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNDExXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNrXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU2xvdmFrXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiYlxcdTAwZmFya2Egc28gc2xhYlxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiYlxcdTAwZmFya2EgcyBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImJcXHUwMGZhcmthIHNvIHNpbG5cXHUwMGZkbSBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIm1pZXJuYSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNpbG5cXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJwcnVka1xcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImJcXHUwMGZhcmthIHNvIHNsYWJcXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImJcXHUwMGZhcmthIHMgbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic2lsblxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzaWxuXFx1MDBlOSBwb3BcXHUwMTU1Y2hhbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJqZW1uXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1pZXJueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZVxcdTAxM2VtaSBzaWxuXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW1ueSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJtcnpuXFx1MDBmYWNpIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInNsYWJcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInNsYWJcXHUwMGU5IHNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwic2lsblxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImRcXHUwMGUxXFx1MDE3ZVxcdTAxMGYgc28gc25laG9tXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmVob3ZcXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJobWxhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJkeW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInBpZXNrb3ZcXHUwMGU5XFwvcHJhXFx1MDE2MW5cXHUwMGU5IHZcXHUwMGVkcnlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImhtbGFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25cXHUwMGUxIG9ibG9oYVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwidGFrbWVyIGphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJwb2xvamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInphbXJhXFx1MDEwZGVuXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInppbWFcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvclxcdTAwZmFjb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmV0ZXJub1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwia3J1cG9iaXRpZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiTmFzdGF2ZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQmV6dmV0cmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJTbGFiXFx1MDBmZCB2XFx1MDBlMW5va1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiSmVtblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJTdHJlZG5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDEwY2Vyc3R2XFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlNpbG5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2lsblxcdTAwZmQgdmlldG9yLCB0YWttZXIgdlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuXFx1MDBlMSB2XFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiQlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIk5pXFx1MDEwZGl2XFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyaWtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaHVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJIdW5nYXJpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ2aWhhciBlbnloZSBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInZpaGFyIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidmloYXIgaGV2ZXMgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJlbnloZSB6aXZhdGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGV2ZXMgdmloYXJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImR1cnZhIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ2aWhhciBlbnloZSBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidmloYXIgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInZpaGFyIGVyXFx1MDE1MXMgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiZW55aGUgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJrXFx1MDBmNnplcGVzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaGV2ZXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJuYWd5b24gaGV2ZXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyXFx1MDBlOW0gZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwMGYzbm9zIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJlbnloZSBoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJlclxcdTAxNTFzIGhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImhhdmFzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiaFxcdTAwZjN6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZ3llbmdlIGtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImhvbW9rdmloYXJcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidGlzenRhIFxcdTAwZTlnYm9sdFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwia2V2XFx1MDBlOXMgZmVsaFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInN6XFx1MDBmM3J2XFx1MDBlMW55b3MgZmVsaFxcdTAxNTF6ZXRcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImVyXFx1MDE1MXMgZmVsaFxcdTAxNTF6ZXRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImJvclxcdTAwZmFzIFxcdTAwZTlnYm9sdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJcXHUwMGYzcHVzaSB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImhcXHUwMTcxdlxcdTAwZjZzXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmb3JyXFx1MDBmM1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwic3plbGVzXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJqXFx1MDBlOWdlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIk55dWdvZHRcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNzZW5kZXNcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkVueWhlIHN6ZWxsXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiRmlub20gc3plbGxcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJLXFx1MDBmNnplcGVzIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAwYzlsXFx1MDBlOW5rIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkVyXFx1MDE1MXMgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiRXJcXHUwMTUxcywgbVxcdTAwZTFyIHZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJFclxcdTAxNTFzZW4gdmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTelxcdTAwZTlsdmloYXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRvbWJvbFxcdTAwZjMgc3pcXHUwMGU5bHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWtcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiY2FcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDYXRhbGFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiVGVtcGVzdGEgYW1iIHBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlRlbXBlc3RhIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJUZW1wZXN0YSBmb3J0YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiVGVtcGVzdGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlRlbXBlc3RhIGFtYiBtb2x0IHBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiUGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiUGx1Z2ltIGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiUGx1Z2ltIHN1YXVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiUGx1Z2ltIGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwiUGx1amFcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlBsdWdpbVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiUGx1amFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlBsdWphIG1vbHQgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiUGx1amEgZXh0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiUGx1amEgZ2xhXFx1MDBlN2FkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiUGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwiUGx1amEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJOZXZhZGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiTmV2YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiQWlndWFuZXVcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcIlBsdWphIGQnYWlndWFuZXVcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcIlBsdWdpbSBpIG5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiUGx1amEgaSBuZXVcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcIk5ldmFkYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJOZXZhZGFcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJCb2lyYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiRnVtXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJCb2lyaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJTb3JyYVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiQm9pcmFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcIlNvcnJhXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJQb2xzXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJDZW5kcmEgdm9sY1xcdTAwZTBuaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJYXFx1MDBlMGZlY1wiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQ2VsIG5ldFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiTGxldWdlcmFtZW50IGVubnV2b2xhdFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiTlxcdTAwZmF2b2xzIGRpc3BlcnNvc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiTnV2b2xvc2l0YXQgdmFyaWFibGVcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkVubnV2b2xhdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVGVtcGVzdGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cmFjXFx1MDBlMFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiRnJlZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiQ2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlZlbnRcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlBlZHJhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1hdFwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiQnJpc2Egc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJpc2EgYWdyYWRhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmlzYSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2EgZnJlc2NhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzY2EgZm9yYVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudCBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW5kYXZhbCBzZXZlclwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJhY1xcdTAwZTBcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImhyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ3JvYXRpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBzbGFib20ga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBqYWtvbSBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYmEgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImpha2EgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvcmthbnNrYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzYSBzbGFib20gcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm1samF2aW5za2Egb2x1amEgc2EgamFrb20gcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInJvc3VsamEgc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJyb3N1bGphXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJyb3N1bGphIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb20gc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwicGxqdXNrb3ZpIGkgcm9zdWxqYVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwicm9zdWxqYSBzIGpha2ltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJyb3N1bGphIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJhIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInVtamVyZW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImtpXFx1MDE2MWEgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZybG8gamFrYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJla3N0cmVtbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibGVkZW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBsanVzYWsgc2xhYm9nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwbGp1c2FrXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbGp1c2FrIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJvbHVqbmEga2lcXHUwMTYxYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZ3VzdGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzdXNuamVcXHUwMTdlaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzdXNuamVcXHUwMTdlaWNhIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcInNsYWJhIGtpXFx1MDE2MWEgaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcImtpXFx1MDE2MWEgaSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcInNuaWplZyBzIHBvdnJlbWVuaW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuaWplZyBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJzbmlqZWcgcyBqYWtpbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic3VtYWdsaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJkaW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIml6bWFnbGljYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwia292aXRsYWNpIHBpamVza2EgaWxpIHByYVxcdTAxNjFpbmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm1hZ2xhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwaWplc2FrXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJwcmFcXHUwMTYxaW5hXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJ2dWxrYW5za2kgcGVwZW9cIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInphcHVzaSB2amV0cmEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidmVkcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImJsYWdhIG5hb2JsYWthXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJyYVxcdTAxNjF0cmthbmkgb2JsYWNpXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJpc3ByZWtpZGFuaSBvYmxhY2lcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm9ibGFcXHUwMTBkbm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bza2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJobGFkbm9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInZydVxcdTAxMDdlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2amV0cm92aXRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJ0dVxcdTAxMGRhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImxhaG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJwb3ZqZXRhcmFjXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJzbGFiIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwidW1qZXJlbiB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcInVtamVyZW5vIGphayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcImphayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTAxN2Vlc3RvayB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIm9sdWpuaSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcImphayBvbHVqbmkgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJvcmthbnNraSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcImphayBvcmthbnNraSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIm9ya2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJibGFua1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIwLjEwLjIwMTYuXHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgd2luZFNwZWVkID0ge1xyXG4gICAgXCJlblwiOntcclxuICAgICAgICBcIlNldHRpbmdzXCI6IHtcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4wLCAwLjNdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIwLTEgICBTbW9rZSByaXNlcyBzdHJhaWdodCB1cFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkNhbG1cIjoge1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFswLjMsIDEuNl0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjEtMyBPbmUgY2FuIHNlZSBkb3dud2luZCBvZiB0aGUgc21va2UgZHJpZnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJMaWdodCBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEuNiwgMy4zXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNC02IE9uZSBjYW4gZmVlbCB0aGUgd2luZC4gVGhlIGxlYXZlcyBvbiB0aGUgdHJlZXMgbW92ZSwgdGhlIHdpbmQgY2FuIGxpZnQgc21hbGwgc3RyZWFtZXJzLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkdlbnRsZSBCcmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMuNCwgNS41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNy0xMCBMZWF2ZXMgYW5kIHR3aWdzIG1vdmUuIFdpbmQgZXh0ZW5kcyBsaWdodCBmbGFnIGFuZCBwZW5uYW50c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIk1vZGVyYXRlIGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbNS41LCA4LjBdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxMS0xNiAgIFRoZSB3aW5kIHJhaXNlcyBkdXN0IGFuZCBsb29zZSBwYXBlcnMsIHRvdWNoZXMgb24gdGhlIHR3aWdzIGFuZCBzbWFsbCBicmFuY2hlcywgc3RyZXRjaGVzIGxhcmdlciBmbGFncyBhbmQgcGVubmFudHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJGcmVzaCBCcmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzguMCwgMTAuOF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjE3LTIxICAgU21hbGwgdHJlZXMgaW4gbGVhZiBiZWdpbiB0byBzd2F5LiBUaGUgd2F0ZXIgYmVnaW5zIGxpdHRsZSB3YXZlcyB0byBwZWFrXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU3Ryb25nIGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTAuOCwgMTMuOV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjIyLTI3ICAgTGFyZ2UgYnJhbmNoZXMgYW5kIHNtYWxsZXIgdHJpYmVzIG1vdmVzLiBUaGUgd2hpeiBvZiB0ZWxlcGhvbmUgbGluZXMuIEl0IGlzIGRpZmZpY3VsdCB0byB1c2UgdGhlIHVtYnJlbGxhLiBBIHJlc2lzdGFuY2Ugd2hlbiBydW5uaW5nLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxMy45LCAxNy4yXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjgtMzMgICBXaG9sZSB0cmVlcyBpbiBtb3Rpb24uIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJHYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxNy4yLCAyMC43XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMzQtNDAgICBUaGUgd2luZCBicmVhayB0d2lncyBvZiB0cmVlcy4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlNldmVyZSBHYWxlXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyMC44LCAyNC41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDEtNDcgICBBbGwgbGFyZ2UgdHJlZXMgc3dheWluZyBhbmQgdGhyb3dzLiBUaWxlcyBjYW4gYmxvdyBkb3duLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlN0b3JtXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyNC41LCAyOC41XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDgtNTUgICBSYXJlIGlubGFuZC4gVHJlZXMgdXByb290ZWQuIFNlcmlvdXMgZGFtYWdlIHRvIGhvdXNlcy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJWaW9sZW50IFN0b3JtXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsyOC41LCAzMi43XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiNTYtNjMgICBPY2N1cnMgcmFyZWx5IGFuZCBpcyBmb2xsb3dlZCBieSBkZXN0cnVjdGlvbi5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJIdXJyaWNhbmVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzMyLjcsIDY0XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiT2NjdXJzIHZlcnkgcmFyZWx5LiBVbnVzdWFsbHkgc2V2ZXJlIGRhbWFnZS5cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxyXG4gKi9cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMTMuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdlbmVyYXRvcldpZGdldCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gJ2h0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtJztcclxuICAgICAgICB0aGlzLnNjcmlwdEQzU1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy9saWJzL2QzLm1pbi5qc2A7XHJcbiAgICAgICAgdGhpcy5zY3JpcHRTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL3dlYXRoZXItd2lkZ2V0LWdlbmVyYXRvci5qc2A7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgICAgICAgIC8vINCf0LXRgNCy0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtbGVmdC1tZW51X19oZWFkZXInKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbnVtYmVyJyksXHJcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX21lYW5zJyksXHJcbiAgICAgICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX193aW5kJyksXHJcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19pbWcnKSxcclxuICAgICAgICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FsZW5kYXJfX2l0ZW0nKSxcclxuICAgICAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKSxcclxuICAgICAgICAgICAgLy8g0JLRgtC+0YDQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICAgICAgICBjaXR5TmFtZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX3RpdGxlJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3RlbXBlcmF0dXJlJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlRmVlbHM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19mZWVscycpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1pbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWluJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWF4OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1tYXgnKSxcclxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub24yOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X19kZXNjcmlwdGlvbicpLFxyXG4gICAgICAgICAgICB3aW5kU3BlZWQyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fd2luZC1zcGVlZCcpLFxyXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXIyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faWNvbicpLFxyXG4gICAgICAgICAgICBodW1pZGl0eTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2h1bWlkaXR5JyksXHJcbiAgICAgICAgICAgIHByZXNzdXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fcHJlc3N1cmUnKSxcclxuICAgICAgICAgICAgZGF0ZVJlcG9ydDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fZGF0ZScpLFxyXG4gICAgICAgICAgICBhcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JyksXHJcbiAgICAgICAgICAgIGVycm9yS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3Ita2V5JyksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uQVBJa2V5KCk7XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcblxyXG4gICAgICAgIC8vINC+0LHRitC10LrRgi3QutCw0YDRgtCwINC00LvRjyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjRjyDQstGB0LXRhSDQstC40LTQttC10YLQvtCyINGBINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsFxyXG4gICAgICAgIHRoaXMubWFwV2lkZ2V0cyA9IHtcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg2KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDcpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA4LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTUsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTgsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDI0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMxLXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhbGlkYXRpb25BUElrZXkoKSB7XHJcbiAgICAgICAgbGV0IHZhbGlkYXRpb25BUEkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgdXJsID0gYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPTUyNDkwMSZ1bml0cz1tZXRyaWMmY250PTgmYXBwaWQ9JHt0aGlzLmNvbnRyb2xzV2lkZ2V0LmFwaUtleS52YWx1ZX1gO1xyXG4gICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGFjY2VwdCc7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1nb29kJyk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGVycm9yJztcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGDQntGI0LjQsdC60LAg0LLQsNC70LjQtNCw0YbQuNC4ICR7ZX1gKTtcclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gZXJyb3InO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ib3VuZFZhbGlkYXRpb25NZXRob2QgPSB2YWxpZGF0aW9uQVBJLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldC5hcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyx0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XHJcbiAgICAgICAgLy90aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5ib3VuZFZhbGlkYXRpb25NZXRob2QpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGlkKSB7ICAgICAgICBcclxuICAgICAgICBpZihpZCAmJiAodGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkIHx8IHRoaXMucGFyYW1zV2lkZ2V0LmNpdHlOYW1lKSAmJiB0aGlzLnBhcmFtc1dpZGdldC5hcHBpZCkge1xyXG4gICAgICAgICAgICBsZXQgY29kZSA9ICcnO1xyXG4gICAgICAgICAgICBpZihwYXJzZUludChpZCkgPT09IDEgfHwgcGFyc2VJbnQoaWQpID09PSAxMSB8fCBwYXJzZUludChpZCkgPT09IDIxIHx8IHBhcnNlSW50KGlkKSA9PT0gMzEpIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBgPHNjcmlwdCBzcmM9J2h0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtL2pzL2QzLm1pbi5qcyc+PC9zY3JpcHQ+YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYCR7Y29kZX08ZGl2IGlkPSdvcGVud2VhdGhlcm1hcC13aWRnZXQnPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT0ndGV4dC9qYXZhc2NyaXB0Jz5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICR7aWR9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXR5aWQ6ICR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwaWQ6ICcke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkLnJlcGxhY2UoYDJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3YCwnJyl9JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQnLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSAnaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBzKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgICA8L3NjcmlwdD5gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW5pdGlhbFN0YXRlRm9ybShjaXR5SWQ9NTI0OTAxLCBjaXR5TmFtZT0nTW9zY293Jykge1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtc1dpZGdldCA9IHtcclxuICAgICAgICAgICAgY2l0eUlkOiBjaXR5SWQsXHJcbiAgICAgICAgICAgIGNpdHlOYW1lOiBjaXR5TmFtZSxcclxuICAgICAgICAgICAgbGFuZzogJ2VuJyxcclxuICAgICAgICAgICAgYXBwaWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykudmFsdWUgfHwgICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgICAgICAgIHVuaXRzOiAnbWV0cmljJyxcclxuICAgICAgICAgICAgdGV4dFVuaXRUZW1wOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgweDAwQjApLCAgLy8gMjQ4XHJcbiAgICAgICAgICAgIGJhc2VVUkw6IHRoaXMuYmFzZVVSTCxcclxuICAgICAgICAgICAgdXJsRG9tYWluOiAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcnLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcclxuICAgICAgICB0aGlzLmNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdGllcycpO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG5cclxuICAgICAgICB0aGlzLnVybHMgPSB7XHJcbiAgICAgICAgdXJsV2VhdGhlckFQSTogYCR7dGhpcy5wYXJhbXNXaWRnZXQudXJsRG9tYWlufS9kYXRhLzIuNS93ZWF0aGVyP2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5P2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZjbnQ9OCZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgd2luZFNwZWVkOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvd2luZC1zcGVlZC1kYXRhLmpzb25gLFxyXG4gICAgICAgIHdpbmREaXJlY3Rpb246IGAke3RoaXMuYmFzZVVSTH0vZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25gLFxyXG4gICAgICAgIGNsb3VkczogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL2Nsb3Vkcy1kYXRhLmpzb25gLFxyXG4gICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanNvbmAsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcclxuXHJcbi8qKlxyXG4g0JPRgNCw0YTQuNC6INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0Lgg0L/QvtCz0L7QtNGLXHJcbiBAY2xhc3MgR3JhcGhpY1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpYyBleHRlbmRzIEN1c3RvbURhdGUge1xyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uID0gZDMubGluZSgpXHJcbiAgICAueCgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC54O1xyXG4gICAgfSlcclxuICAgIC55KChkKSA9PiB7XHJcbiAgICAgIHJldHVybiBkLnk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDQtNCw0L3QvdGL0YUg0LIg0LzQsNGB0YHQuNCyINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcclxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICovXHJcbiAgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBjb25zdCByYXdEYXRhID0gW107XHJcblxyXG4gICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIHJhd0RhdGEucHVzaCh7IHg6IGksIGRhdGU6IGksIG1heFQ6IGVsZW0ubWF4LCBtaW5UOiBlbGVtLm1pbiB9KTtcclxuICAgICAgaSArPSAxOyAvLyDQodC80LXRidC10L3QuNC1INC/0L4g0L7RgdC4IFhcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByYXdEYXRhO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgbWFrZVNWRygpIHtcclxuICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5wYXJhbXMuaWQpLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMnKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnBhcmFtcy53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmZmZmJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xyXG4gICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cclxuICAqL1xyXG4gIGdldE1pbk1heERhdGUocmF3RGF0YSkge1xyXG4gICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtYXhEYXRlOiAwLFxyXG4gICAgICBtaW5EYXRlOiAxMDAwMCxcclxuICAgIH07XHJcblxyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5taW5EYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgKiBbZ2V0TWluTWF4RGF0ZVRlbXBlcmF0dXJlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcblxyXG4gIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMTAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5taW5UKSB7XHJcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLm1pblQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ubWF4VCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSkge1xyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWluOiAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIG1ha2VBeGVzWFkocmF3RGF0YSwgcGFyYW1zKSB7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICBjb25zdCB4QXhpc0xlbmd0aCA9IHBhcmFtcy53aWR0aCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBZID0g0LLRi9GB0L7RgtCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YMg0Lgg0YHQvdC40LfRg1xyXG4gICAgY29uc3QgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gKDIgKiBwYXJhbXMubWFyZ2luKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcclxuICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cclxuICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAqL1xyXG4gIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXggKyA1LCBtaW4gLSA1XSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIG1pblQ6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcclxuICB9XHJcblxyXG4gIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbikge1xyXG4gICAgY29uc3QgeyBtYXhEYXRlLCBtaW5EYXRlIH0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgIGNvbnN0IHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuXHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sXHJcbiAgICAgICAgaHVtaWRpdHk6IHNjYWxlWShlbGVtLmh1bWlkaXR5KSArIG1hcmdpbixcclxuICAgICAgICByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luLFxyXG4gICAgICAgIGNvbG9yOiBlbGVtLmNvbG9yLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XHJcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKSB7XHJcbiAgICBjb25zdCBhcnJQb2x5bGluZSA9IFtdO1xyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSB9LFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICB4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIHk6IHNjYWxlWShkYXRhW2RhdGEubGVuZ3RoIC0gMV0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGRyYXdQb2x5bGluZShzdmcsIGRhdGEpIHtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcclxuXHJcbiAgICBzdmcuYXBwZW5kKCdnJykuYXBwZW5kKCdwYXRoJylcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQtNC/0LjRgdC10Lkg0YEg0L/QvtC60LDQt9Cw0YLQtdC70Y/QvNC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0L3QsCDQvtGB0Y/RhVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKi9cclxuICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpIHtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSkgPT4ge1xyXG4gICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5tYXhUIC0gMikgLSAocGFyYW1zLm9mZnNldFggLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1heH3CsGApO1xyXG5cclxuICAgICAgc3ZnLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgIC5hdHRyKCd4JywgZWxlbS54KVxyXG4gICAgICAuYXR0cigneScsIChlbGVtLm1pblQgKyA3KSArIChwYXJhbXMub2Zmc2V0WSAvIDIpKVxyXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnN0eWxlKCdmaWxsJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnRleHQoYCR7cGFyYW1zLmRhdGFbaXRlbV0ubWlufcKwYCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICBjb25zdCB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH0gPSB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgdGhpcy5kcmF3UG9seWxpbmUoc3ZnLCBwb2x5bGluZSk7XHJcbiAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICAvLyB0aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxyZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHIgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcm0tbGFuZGluZy13aWRnZXQnKTtcciAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpO1xyICAgIGNvbnN0IHBvcHVwU2hhZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcHVwLXNoYWRvdycpO1xyICAgIGNvbnN0IHBvcHVwQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtY2xvc2UnKTtcciAgICBjb25zdCBjb250ZW50SlNHZW5lcmF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWNvZGUtZ2VuZXJhdGUnKTtcciAgICBjb25zdCBjb3B5Q29udGVudEpTQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5LWpzLWNvZGUnKTtcciAgICBjb25zdCBhcGlLZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpO1xyXHIgICAgLy8g0KTQuNC60YHQuNGA0YPQtdC8INC60LvQuNC60Lgg0L3QsCDRhNC+0YDQvNC1LCDQuCDQvtGC0LrRgNGL0LLQsNC10LwgcG9wdXAg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDXHIgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyICAgICAgICBpZihlbGVtZW50LmlkICYmIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpKSB7XHIgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcciAgICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0od2luZG93LmNpdHlJZCwgd2luZG93LmNpdHlOYW1lKTsgICAgICAgICBcciAgICAgICAgICAgIFxyICAgICAgICAgICAgXHIgICAgICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gZ2VuZXJhdGVXaWRnZXQuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0Lm1hcFdpZGdldHNbZWxlbWVudC5pZF1bJ2lkJ10pO1xyICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLXZpc2libGUnKSkge1xyICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcciAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC0tdmlzaWJsZScpO1xyICAgICAgICAgICAgICAgIHBvcHVwU2hhZG93LmNsYXNzTGlzdC5hZGQoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpXHIgICAgICAgICAgICAgICAgc3dpdGNoKGdlbmVyYXRvci5tYXBXaWRnZXRzW2V2ZW50LnRhcmdldC5pZF1bJ3NjaGVtYSddKSB7XHIgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JsdWUnOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1icm93bicpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJyb3duJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYnJvd24nOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnbm9uZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1icm93bicpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJyb3duJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwLS1ibHVlJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYmx1ZScpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgXHIgICAgICAgIH1cciAgICB9KTtcclxyICAgIHZhciBldmVudFBvcHVwQ2xvc2UgPSBmdW5jdGlvbihldmVudCl7XHIgICAgICB2YXIgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcciAgICAgIGlmKCghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwQ2xvc2UnKSB8fCBlbGVtZW50ID09PSBwb3B1cClcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpXHIgICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX3RpdGxlJylcciAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9faXRlbXMnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19sYXlvdXQnKVxyICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19idG4nKSkge1xyICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tdmlzaWJsZScpO1xyICAgICAgICBwb3B1cFNoYWRvdy5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC1zaGFkb3ctLXZpc2libGUnKTtcciAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcciAgICAgIH1cciAgICB9O1xyXHIgICAgZXZlbnRQb3B1cENsb3NlID0gZXZlbnRQb3B1cENsb3NlLmJpbmQodGhpcyk7XHIgICAgLy8g0JfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60YDQtdGB0YLQuNC6XHIgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudFBvcHVwQ2xvc2UpO1xyXHJcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyICAgICAgICAvL3ZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHIgICAgICAgIC8vcmFuZ2Uuc2VsZWN0Tm9kZShjb250ZW50SlNHZW5lcmF0aW9uKTtcciAgICAgICAgLy93aW5kb3cuZ2V0U2VsZWN0aW9uKCkuYWRkUmFuZ2UocmFuZ2UpO1xyICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnNlbGVjdCgpO1xyXHIgICAgICAgIHRyeXtcciAgICAgICAgICAgIGNvbnN0IHR4dENvcHkgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xyICAgICAgICAgICAgdmFyIG1zZyA9IHR4dENvcHkgPyAnc3VjY2Vzc2Z1bCcgOiAndW5zdWNjZXNzZnVsJztcciAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3B5IGVtYWlsIGNvbW1hbmQgd2FzICcgKyBtc2cpO1xyICAgICAgICB9XHIgICAgICAgIGNhdGNoKGUpe1xyICAgICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQutC+0L/QuNGA0L7QstCw0L3QuNGPICR7ZS5lcnJMb2dUb0NvbnNvbGV9YCk7XHIgICAgICAgIH1cclxyICAgICAgICAvLyDQodC90Y/RgtC40LUg0LLRi9C00LXQu9C10L3QuNGPIC0g0JLQndCY0JzQkNCd0JjQlTog0LLRiyDQtNC+0LvQttC90Ysg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMXHIgICAgICAgIC8vIHJlbW92ZVJhbmdlKHJhbmdlKSDQutC+0LPQtNCwINGN0YLQviDQstC+0LfQvNC+0LbQvdC+XHIgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcciAgICB9KTtcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmRpc2FibGVkID0gIWRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCgnY29weScpO1xyfSk7XHJcciIsIi8vINCc0L7QtNGD0LvRjCDQtNC40YHQv9C10YLRh9C10YAg0LTQu9GPINC+0YLRgNC40YHQvtCy0LrQuCDQsdCw0L3QvdC10YDRgNC+0LIg0L3QsCDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LVcclxuaW1wb3J0IENpdGllcyBmcm9tICcuL2NpdGllcyc7XHJcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblxyXG4gICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxyXG4gICAgY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbiAgICBjb25zdCBjaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XHJcbiAgICBjb25zdCBzZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcblxyXG4gICAgY29uc3Qgb2JqQ2l0aWVzID0gbmV3IENpdGllcyhjaXR5TmFtZSwgY2l0aWVzKTtcclxuICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuXHJcblxyXG4gICAgc2VhcmNoQ2l0eS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgY29uc3Qgb2JqQ2l0aWVzID0gbmV3IENpdGllcyhjaXR5TmFtZSwgY2l0aWVzKTtcclxuICAgICAgb2JqQ2l0aWVzLmdldENpdGllcygpO1xyXG5cclxuICAgIH0pO1xyXG5cclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcbmltcG9ydCBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYy1kM2pzJztcclxuaW1wb3J0ICogYXMgbmF0dXJhbFBoZW5vbWVub24gIGZyb20gJy4vZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YSc7XHJcbmltcG9ydCAqIGFzIHdpbmRTcGVlZCBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcclxuaW1wb3J0ICogYXMgd2luZERpcmVjdGlvbiBmcm9tICcuL2RhdGEvd2luZC1zcGVlZC1kYXRhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYXRoZXJXaWRnZXQgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xyXG4gICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgdGhpcy53ZWF0aGVyID0ge1xyXG4gICAgICBmcm9tQVBJOiB7XHJcbiAgICAgICAgY29vcmQ6IHtcclxuICAgICAgICAgIGxvbjogJzAnLFxyXG4gICAgICAgICAgbGF0OiAnMCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3ZWF0aGVyOiBbe1xyXG4gICAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICAgIG1haW46ICcgJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnICcsXHJcbiAgICAgICAgICBpY29uOiAnICcsXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgYmFzZTogJyAnLFxyXG4gICAgICAgIG1haW46IHtcclxuICAgICAgICAgIHRlbXA6IDAsXHJcbiAgICAgICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICAgICAgaHVtaWRpdHk6ICcgJyxcclxuICAgICAgICAgIHRlbXBfbWluOiAnICcsXHJcbiAgICAgICAgICB0ZW1wX21heDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2luZDoge1xyXG4gICAgICAgICAgc3BlZWQ6IDAsXHJcbiAgICAgICAgICBkZWc6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJhaW46IHt9LFxyXG4gICAgICAgIGNsb3Vkczoge1xyXG4gICAgICAgICAgYWxsOiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdDogJycsXHJcbiAgICAgICAgc3lzOiB7XHJcbiAgICAgICAgICB0eXBlOiAnICcsXHJcbiAgICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJyAnLFxyXG4gICAgICAgICAgY291bnRyeTogJyAnLFxyXG4gICAgICAgICAgc3VucmlzZTogJyAnLFxyXG4gICAgICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgIG5hbWU6ICdVbmRlZmluZWQnLFxyXG4gICAgICAgIGNvZDogJyAnLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAqIEBwYXJhbSB1cmxcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cclxuICBodHRwR2V0KHVybCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgKi9cclxuICBnZXRXZWF0aGVyRnJvbUFwaSgpIHtcclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSBuYXR1cmFsUGhlbm9tZW5vbi5uYXR1cmFsUGhlbm9tZW5vblt0aGlzLnBhcmFtcy5sYW5nXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gd2luZFNwZWVkLndpbmRTcGVlZFt0aGlzLnBhcmFtcy5sYW5nXTtcclxuICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnBhcmFtc1VybEZvcmVEYWlseSlcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgKiBAcGFyYW0ge29iamVjdH0gSlNPTlxyXG4gICAqIEBwYXJhbSB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9INCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAqL1xyXG4gIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpIHtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcclxuICAgICAgaWYgKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09ICdvYmplY3QnICYmIGVsZW1lbnROYW1lMiA9PSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzBdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMV0pIHtcclxuICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YHQviDQt9C90LDRh9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudE5hbWUyICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pIHtcclxuICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiBKU09OINGBINC80LXRgtC10L7QtNCw0L3Ri9C80LhcclxuICAgKiBAcGFyYW0ganNvbkRhdGFcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBwYXJzZURhdGFGcm9tU2VydmVyKCkge1xyXG4gICAgY29uc3Qgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICBpZiAod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09ICdVbmRlZmluZWQnIHx8IHdlYXRoZXIuZnJvbUFQSS5jb2QgPT09ICc0MDQnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCfQlNCw0L3QvdGL0LUg0L7RgiDRgdC10YDQstC10YDQsCDQvdC1INC/0L7Qu9GD0YfQtdC90YsnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXHJcbiAgICBjb25zdCBtZXRhZGF0YSA9IHtcclxuICAgICAgY2xvdWRpbmVzczogJyAnLFxyXG4gICAgICBkdDogJyAnLFxyXG4gICAgICBjaXR5TmFtZTogJyAnLFxyXG4gICAgICBpY29uOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlTWluOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlTUF4OiAnICcsXHJcbiAgICAgIHByZXNzdXJlOiAnICcsXHJcbiAgICAgIGh1bWlkaXR5OiAnICcsXHJcbiAgICAgIHN1bnJpc2U6ICcgJyxcclxuICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgIGNvb3JkOiAnICcsXHJcbiAgICAgIHdpbmQ6ICcgJyxcclxuICAgICAgd2VhdGhlcjogJyAnLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEuY2l0eU5hbWUgPSBgJHt3ZWF0aGVyLmZyb21BUEkubmFtZX0sICR7d2VhdGhlci5mcm9tQVBJLnN5cy5jb3VudHJ5fWA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IHRlbXBlcmF0dXJlOyAvLyBgJHt0ZW1wID4gMCA/IGArJHt0ZW1wfWAgOiB0ZW1wfWA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1pbiA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWluLnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1heCA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWF4LnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBpZiAod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbikge1xyXG4gICAgICBtZXRhZGF0YS53ZWF0aGVyID0gd2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vblt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pZF07XHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci53aW5kU3BlZWQpIHtcclxuICAgICAgbWV0YWRhdGEud2luZFNwZWVkID0gYFdpbmQ6ICR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci53aW5kU3BlZWQsIHdlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSksICdzcGVlZF9pbnRlcnZhbCcpfWA7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZDIgPSBgJHt3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpfSBtL3NgO1xyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIud2luZERpcmVjdGlvbikge1xyXG4gICAgICBtZXRhZGF0YS53aW5kRGlyZWN0aW9uID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXSwgXCJkZWdfaW50ZXJ2YWxcIil9YFxyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIuY2xvdWRzKSB7XHJcbiAgICAgIG1ldGFkYXRhLmNsb3VkcyA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIuY2xvdWRzLCB3ZWF0aGVyLmZyb21BUEkuY2xvdWRzLmFsbCwgJ21pbicsICdtYXgnKX1gO1xyXG4gICAgfVxyXG5cclxuICAgIG1ldGFkYXRhLmh1bWlkaXR5ID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4uaHVtaWRpdHl9JWA7XHJcbiAgICBtZXRhZGF0YS5wcmVzc3VyZSA9ICBgJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIm1haW5cIl1bXCJwcmVzc3VyZVwiXX0gbWJgO1xyXG4gICAgbWV0YWRhdGEuaWNvbiA9IGAke3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmljb259YDtcclxuXHJcbiAgICB0aGlzLnJlbmRlcldpZGdldChtZXRhZGF0YSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXJXaWRnZXQobWV0YWRhdGEpIHtcclxuICAgIC8vINCe0L7RgtGA0LjRgdC+0LLQutCwINC/0LXRgNCy0YvRhSDRh9C10YLRi9GA0LXRhSDQstC40LTQttC10YLQvtCyXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4gY2xhc3M9J3dlYXRoZXItbGVmdC1jYXJkX19kZWdyZWUnPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlci5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtZXRhZGF0YS53aW5kU3BlZWQpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINC/0Y/RgtC4INC/0L7RgdC70LXQtNC90LjRhSDQstC40LTQttC10YLQvtCyXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZTIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZTJbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTJbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVscy5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVsc1tlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbltlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4KSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heFtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjJbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkMiAmJiBtZXRhZGF0YS53aW5kRGlyZWN0aW9uKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDJbZWxlbV0uaW5uZXJUZXh0ID0gYCR7bWV0YWRhdGEud2luZFNwZWVkMn0gJHttZXRhZGF0YS53aW5kRGlyZWN0aW9ufWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEuaHVtaWRpdHkpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuaHVtaWRpdHkpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5odW1pZGl0eS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5odW1pZGl0eVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5odW1pZGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEucHJlc3N1cmUpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMucHJlc3N1cmUpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5wcmVzc3VyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5wcmVzc3VyZVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5wcmVzc3VyZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vINCf0YDQvtC/0LjRgdGL0LLQsNC10Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMg0LIg0LLQuNC00LbQtdGC0YtcclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnQpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydFtlbGVtXS5pbm5lclRleHQgPSB0aGlzLmdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KSB7XHJcbiAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKSB7XHJcbiAgICBjb25zdCBhcnIgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdCkge1xyXG4gICAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheU5hbWVPZldlZWtCeURheU51bWJlcih0aGlzLmdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCkpO1xyXG4gICAgICBhcnIucHVzaCh7XHJcbiAgICAgICAgbWluOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgIG1heDogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcclxuICAgICAgICBkYXk6IChlbGVtICE9IDApID8gZGF5IDogJ1RvZGF5JyxcclxuICAgICAgICBpY29uOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLndlYXRoZXJbMF0uaWNvbixcclxuICAgICAgICBkYXRlOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRyYXdHcmFwaGljRDMoYXJyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LfQstCw0L3QuNGPINC00L3QtdC5INC90LXQtNC10LvQuCDQuCDQuNC60L7QvdC+0Log0YEg0L/QvtCz0L7QtNC+0LlcclxuICAgKiBAcGFyYW0gZGF0YVxyXG4gICAqL1xyXG4gIHJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoZWxlbS5kYXRlLnJlcGxhY2UoLyhcXGQrKS4oXFxkKykuKFxcZCspLywgJyQzLyQyLyQxJykpO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGJyPiR7ZGF0ZS5nZXREYXRlKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgOF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGJyPiR7ZGF0ZS5nZXREYXRlKCl9ICR7dGhpcy5nZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKGRhdGUuZ2V0TW9udGgoKSl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMThdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxicj4ke2RhdGUuZ2V0RGF0ZSgpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDI4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08YnI+JHtkYXRlLmdldERhdGUoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbiwgY29sb3IgPSBmYWxzZSkge1xyXG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XHJcbiAgICBjb25zdCBtYXBJY29ucyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBpZiAoIWNvbG9yKSB7XHJcbiAgICAgIC8vXHJcbiAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDJkJywgJzAyZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDRkJywgJzA0ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDVkJywgJzA1ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDdkJywgJzA3ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDhkJywgJzA4ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTBkJywgJzEwZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTFkJywgJzExZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XHJcbiAgICAgIC8vINCd0L7Rh9C90YvQtVxyXG4gICAgICBtYXBJY29ucy5zZXQoJzAxbicsICcwMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA1bicsICcwNWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA2bicsICcwNmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA4bicsICcwOGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA5bicsICcwOWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzExbicsICcxMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEzbicsICcxM2RidycpO1xyXG5cclxuICAgICAgaWYgKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXJhbXMuYmFzZVVSTH0vaW1nL3dpZGdldHMvJHttYXBJY29ucy5nZXQobmFtZUljb24pfS5wbmdgO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bmFtZUljb259LnBuZ2A7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgKi9cclxuICBkcmF3R3JhcGhpY0QzKGRhdGEpIHtcclxuICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpO1xyXG5cclxuICAgIC8vINCe0YfQuNGB0YLQutCwINC60L7QvdGC0LXQudC90LXRgNC+0LIg0LTQu9GPINCz0YDQsNGE0LjQutC+0LIgICAgXHJcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpO1xyXG4gICAgY29uc3Qgc3ZnMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMScpO1xyXG4gICAgY29uc3Qgc3ZnMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMicpO1xyXG4gICAgY29uc3Qgc3ZnMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMycpO1xyXG5cclxuICAgIGlmKHN2Zy5xdWVyeVNlbGVjdG9yKCdzdmcnKSkge1xyXG4gICAgICBzdmcucmVtb3ZlQ2hpbGQoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzEucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcclxuICAgICAgc3ZnMS5yZW1vdmVDaGlsZChzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xyXG4gICAgICBzdmcyLnJlbW92ZUNoaWxkKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xyXG4gICAgfVxyXG4gICAgaWYoc3ZnMy5xdWVyeVNlbGVjdG9yKCdzdmcnKSl7XHJcbiAgICAgICAgc3ZnMy5yZW1vdmVDaGlsZChzdmczLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8g0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIGlkOiAnI2dyYXBoaWMnLFxyXG4gICAgICBkYXRhLFxyXG4gICAgICBvZmZzZXRYOiAxNSxcclxuICAgICAgb2Zmc2V0WTogMTAsXHJcbiAgICAgIHdpZHRoOiA0MjAsXHJcbiAgICAgIGhlaWdodDogNzksXHJcbiAgICAgIHJhd0RhdGE6IFtdLFxyXG4gICAgICBtYXJnaW46IDEwLFxyXG4gICAgICBjb2xvclBvbGlseW5lOiAnIzMzMycsXHJcbiAgICAgIGZvbnRTaXplOiAnMTJweCcsXHJcbiAgICAgIGZvbnRDb2xvcjogJyMzMzMnLFxyXG4gICAgICBzdHJva2VXaWR0aDogJzFweCcsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICBsZXQgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0L7RgdGC0LDQu9GM0L3Ri9GFINCz0YDQsNGE0LjQutC+0LJcclxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzEnO1xyXG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0RERjczMCc7XHJcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG5cclxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzInO1xyXG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0ZFQjAyMCc7XHJcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG5cclxuICAgIHBhcmFtcy5pZCA9ICcjZ3JhcGhpYzMnO1xyXG4gICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSAnI0ZFQjAyMCc7XHJcbiAgICBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqINCe0YLQvtCx0YDQsNC20LXQvdC40LUg0LPRgNCw0YTQuNC60LAg0L/QvtCz0L7QtNGLINC90LAg0L3QtdC00LXQu9GOXHJcbiAgICovXHJcbiAgZHJhd0dyYXBoaWMoYXJyKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aCA9IDQ2NTtcclxuICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmJztcclxuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgNjAwLCAzMDApO1xyXG5cclxuICAgIGNvbnRleHQuZm9udCA9ICdPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHgnO1xyXG5cclxuICAgIGxldCBzdGVwID0gNTU7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBjb25zdCB6b29tID0gNDtcclxuICAgIGNvbnN0IHN0ZXBZID0gNjQ7XHJcbiAgICBjb25zdCBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0RG93biA9IDc1O1xyXG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5tYXh9wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWVRleHRVcCk7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGkgKz0gMTtcclxuICAgIHdoaWxlIChpIDwgYXJyLmxlbmd0aCkge1xyXG4gICAgICBzdGVwICs9IDU1O1xyXG4gICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBpIC09IDE7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIHN0ZXAgPSA1NTtcclxuICAgIGkgPSAwO1xyXG4gICAgY29udGV4dC5tb3ZlVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1pbn3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZVGV4dERvd24pO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1pbn3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZVGV4dERvd24pO1xyXG4gICAgICBpICs9IDE7XHJcbiAgICB9XHJcbiAgICBpIC09IDE7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMzMzMnO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHRoaXMuZ2V0V2VhdGhlckZyb21BcGkoKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
