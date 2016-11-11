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
                if (parseInt(id) === 1 || parseInt(id) === 11 || parseInt(id) === 21) {
                    code = '<script src=\'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js\'></script>';
                }
                return code + '<div id=\'openweathermap-widget\'></div>\n                    <script type=\'text/javascript\'>\n                    window.myWidgetParam = {\n                        id: ' + id + ',\n                        cityid: ' + this.paramsWidget.cityId + ',\n                        appid: \'' + this.paramsWidget.appid.replace('2d90837ddbaeda36ab487f257829b667', '') + '\',\n                        containerid: \'openweathermap-widget\',\n                    };\n                    (function() {\n                        var script = document.createElement(\'script\');\n                        script.type = \'text/javascript\';\n                        script.async = true;\n                        script.src = \'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js\';\n                        var s = document.getElementsByTagName(\'script\')[0];\n                        s.parentNode.insertBefore(script, s);\n                    })();\n                  </script>';
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
  var popupClose = document.getElementById('popup-close');
  var contentJSGeneration = document.getElementById('js-code-generate');
  var copyContentJSCode = document.getElementById('copy-js-code');
  var apiKey = document.getElementById('api-key');

  // Фиксируем клики на форме, и открываем popup окно при нажатии на кнопку
  form.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.id && event.target.classList.contains('container-custom-card__btn')) {
      var generateWidget = new _generatorWidget2.default();
      generateWidget.setInitialStateForm(window.cityId, window.cityName);

      contentJSGeneration.value = generateWidget.getCodeForGenerateWidget(generateWidget.mapWidgets[event.target.id]['id']);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjaXRpZXMuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXG5hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZGF0YVxcd2luZC1zcGVlZC1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHBvcHVwLmpzIiwiYXNzZXRzXFxqc1xcc2NyaXB0LmpzIiwiYXNzZXRzXFxqc1xcd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7cWpCQ0FBOzs7O0FBSUE7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUIsTTtBQUVuQixrQkFBWSxRQUFaLEVBQXNCLFNBQXRCLEVBQWlDO0FBQUE7O0FBRS9CLFFBQU0saUJBQWlCLCtCQUF2QjtBQUNBLG1CQUFlLG1CQUFmOztBQUVBLFFBQUksQ0FBQyxTQUFTLEtBQWQsRUFBcUI7QUFDbkIsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLEdBQWdCLFNBQVMsS0FBVCxDQUFlLE9BQWYsQ0FBdUIsUUFBdkIsRUFBZ0MsR0FBaEMsRUFBcUMsV0FBckMsRUFBaEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsYUFBYSxFQUE5QjtBQUNBLFNBQUssR0FBTCxrREFBd0QsS0FBSyxRQUE3RDs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQW5CO0FBQ0EsU0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLFlBQTdCO0FBQ0EsU0FBSyxXQUFMLENBQWlCLEtBQWpCLEdBQXlCLHVCQUF6Qjs7QUFFQSxRQUFNLFlBQVksNEJBQWtCLGVBQWUsWUFBakMsRUFBK0MsZUFBZSxjQUE5RCxFQUE4RSxlQUFlLElBQTdG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MkIsS0FBaEQ7QUFDQSxnQkFBUSxVQUFSLENBQXNCLElBQUksQ0FBSixFQUFPLEdBQTdCLFFBQXFDLElBQXJDLEVBQTRDLENBQUMsQ0FBRCxHQUFLLElBQUksQ0FBSixFQUFPLEdBQVosR0FBa0IsSUFBbkIsR0FBMkIsYUFBdEU7QUFDQSxhQUFLLENBQUw7QUFDRDtBQUNELFdBQUssQ0FBTDtBQUNBLGNBQVEsTUFBUixDQUFlLE9BQU8sRUFBdEIsRUFBMkIsQ0FBQyxDQUFELEdBQUssSUFBSSxDQUFKLEVBQU8sR0FBWixHQUFrQixJQUFuQixHQUEyQixLQUFyRDtBQUNBLGNBQVEsU0FBUixHQUFvQixNQUFwQjtBQUNBLGNBQVEsTUFBUixDQUFlLE9BQU8sRUFBdEIsRUFBMkIsQ0FBQyxDQUFELEdBQUssSUFBSSxDQUFKLEVBQU8sR0FBWixHQUFrQixJQUFuQixHQUEyQixLQUFyRDtBQUNBLGNBQVEsU0FBUjtBQUNBLGNBQVEsV0FBUixHQUFzQixNQUF0QjtBQUNBLGNBQVEsTUFBUjtBQUNBLGNBQVEsSUFBUjtBQUNEOzs7NkJBRVE7QUFDUCxXQUFLLGlCQUFMO0FBQ0Q7Ozs7OztrQkE5ZWtCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMS4xMC4yMDE2LlxyXG4qL1xyXG5cclxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XHJcbmltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdGllcyB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNpdHlOYW1lLCBjb250YWluZXIpIHtcclxuXHJcbiAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcclxuICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0oKTtcclxuXHJcbiAgICBpZiAoIWNpdHlOYW1lLnZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNpdHlOYW1lID0gY2l0eU5hbWUudmFsdWUucmVwbGFjZSgvKFxccykrL2csJy0nKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXIgfHwgJyc7XHJcbiAgICB0aGlzLnVybCA9IGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/cT0ke3RoaXMuY2l0eU5hbWV9JnR5cGU9bGlrZSZzb3J0PXBvcHVsYXRpb24mY250PTMwJmFwcGlkPWIxYjE1ZTg4ZmE3OTcyMjU0MTI0MjljMWM1MGMxMjJhMWA7XHJcblxyXG4gICAgdGhpcy5zZWxDaXR5U2lnbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHRoaXMuc2VsQ2l0eVNpZ24uaW5uZXJUZXh0ID0gJyBzZWxlY3RlZCAnO1xyXG4gICAgdGhpcy5zZWxDaXR5U2lnbi5jbGFzcyA9ICd3aWRnZXQtZm9ybV9fc2VsZWN0ZWQnO1xyXG5cclxuICAgIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQuY29udHJvbHNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LnVybHMpO1xyXG4gICAgb2JqV2lkZ2V0LnJlbmRlcigpO1xyXG5cclxuICB9XHJcblxyXG4gIGdldENpdGllcygpIHtcclxuICAgIGlmICghdGhpcy5jaXR5TmFtZSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmh0dHBHZXQodGhpcy51cmwpXHJcbiAgICAgIC50aGVuKFxyXG4gICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICB0aGlzLmdldFNlYXJjaERhdGEocmVzcG9uc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgfVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VhcmNoRGF0YShKU09Ob2JqZWN0KSB7XHJcbiAgICBpZiAoIUpTT05vYmplY3QubGlzdC5sZW5ndGgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0NpdHkgbm90IGZvdW5kJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQo9C00LDQu9GP0LXQvCDRgtCw0LHQu9C40YbRgywg0LXRgdC70Lgg0LXRgdGC0YxcclxuICAgIGNvbnN0IHRhYmxlQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1jaXRpZXMnKTtcclxuICAgIGlmICh0YWJsZUNpdHkpIHtcclxuICAgICAgdGFibGVDaXR5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFibGVDaXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaHRtbCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBKU09Ob2JqZWN0Lmxpc3QubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY29uc3QgbmFtZSA9IGAke0pTT05vYmplY3QubGlzdFtpXS5uYW1lfSwgJHtKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnl9YDtcclxuICAgICAgY29uc3QgZmxhZyA9IGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltYWdlcy9mbGFncy8ke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeS50b0xvd2VyQ2FzZSgpfS5wbmdgO1xyXG4gICAgICBodG1sICs9IGA8dHI+PHRkIGNsYXNzPVwid2lkZ2V0LWZvcm1fX2l0ZW1cIj48YSBocmVmPVwiL2NpdHkvJHtKU09Ob2JqZWN0Lmxpc3RbaV0uaWR9XCIgaWQ9XCIke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIiBjbGFzcz1cIndpZGdldC1mb3JtX19saW5rXCI+JHtuYW1lfTwvYT48aW1nIHNyYz1cIiR7ZmxhZ31cIj48L3A+PC90ZD48L3RyPmA7XHJcbiAgICB9XHJcblxyXG4gICAgaHRtbCA9IGA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiIGlkPVwidGFibGUtY2l0aWVzXCI+JHtodG1sfTwvdGFibGU+YDtcclxuICAgIHRoaXMuY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgY29uc3QgdGFibGVDaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XHJcblxyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgdGFibGVDaXRpZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gKCdBJykudG9Mb3dlckNhc2UoKSAmJiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aWRnZXQtZm9ybV9fbGluaycpKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGVkQ2l0eSA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZENpdHknKTtcclxuICAgICAgICBpZiAoIXNlbGVjdGVkQ2l0eSkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoYXQuc2VsQ2l0eVNpZ24sIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8g0J/QvtC00YHRgtCw0L3QvtCy0LrQsCDQvdCw0LnQtNC10L3QvtCz0L4g0LPQvtGA0L7QtNCwXHJcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQuY2l0eUlkID0gZXZlbnQudGFyZ2V0LmlkO1xyXG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xyXG4gICAgICAgICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybShldmVudC50YXJnZXQuaWQsIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgICB3aW5kb3cuY2l0eUlkID0gZXZlbnQudGFyZ2V0LmlkO1xyXG4gICAgICAgICAgd2luZG93LmNpdHlOYW1lID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50O1xyXG5cclxuXHJcbiAgICAgICAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LmNvbnRyb2xzV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC51cmxzKTtcclxuICAgICAgICAgIG9ialdpZGdldC5yZW5kZXIoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAqIEBwYXJhbSB1cmxcclxuICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICovXHJcbiAgaHR0cEdldCh1cmwpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI4LjA5LjIwMTYuXHJcbiovXHJcblxyXG4vLyDQoNCw0LHQvtGC0LAg0YEg0LTQsNGC0L7QuVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21EYXRlIGV4dGVuZHMgRGF0ZSB7XHJcblxyXG4gIC8qKlxyXG4gICog0LzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YMg0LIg0YLRgNC10YXRgNCw0LfRgNGP0LTQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuFxyXG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBudW1iZXIgW9GH0LjRgdC70L4g0LzQtdC90LXQtSA5OTldXHJcbiAgKiBAcmV0dXJuIHtbc3RyaW5nXX0gICAgICAgIFvRgtGA0LXRhdC30L3QsNGH0L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDXVxyXG4gICovXHJcbiAgbnVtYmVyRGF5c09mWWVhclhYWChudW1iZXIpIHtcclxuICAgIGlmIChudW1iZXIgPiAzNjUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKG51bWJlciA8IDEwKSB7XHJcbiAgICAgIHJldHVybiBgMDAke251bWJlcn1gO1xyXG4gICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDApIHtcclxuICAgICAgcmV0dXJuIGAwJHtudW1iZXJ9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQsiDQs9C+0LTRg1xyXG4gICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xyXG4gICovXHJcbiAgY29udmVydERhdGVUb051bWJlckRheShkYXRlKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgY29uc3Qgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgIGNvbnN0IGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcbiAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtC+0LHRgNCw0LfRg9C10YIg0LTQsNGC0YMg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPiDQsiB5eXl5LW1tLWRkXHJcbiAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGUg0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICogQHJldHVybiB7ZGF0ZX0g0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICovXHJcbiAgY29udmVydE51bWJlckRheVRvRGF0ZShkYXRlKSB7XHJcbiAgICBjb25zdCByZSA9IC8oXFxkezR9KSgtKShcXGR7M30pLztcclxuICAgIGNvbnN0IGxpbmUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgY29uc3QgYmVnaW55ZWFyID0gbmV3IERhdGUobGluZVsxXSk7XHJcbiAgICBjb25zdCB1bml4dGltZSA9IGJlZ2lueWVhci5nZXRUaW1lKCkgKyAobGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICogMjQpO1xyXG4gICAgY29uc3QgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xyXG5cclxuICAgIGNvbnN0IG1vbnRoID0gcmVzLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgY29uc3QgZGF5cyA9IHJlcy5nZXREYXRlKCk7XHJcbiAgICBjb25zdCB5ZWFyID0gcmVzLmdldEZ1bGxZZWFyKCk7XHJcbiAgICByZXR1cm4gYCR7ZGF5cyA8IDEwID8gYDAke2RheXN9YCA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gIDogbW9udGh9LiR7eWVhcn1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICogQHBhcmFtICB7ZGF0ZTF9IGRhdGUg0LTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICovXHJcbiAgZm9ybWF0RGF0ZShkYXRlMSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuXHJcbiAgICByZXR1cm4gYCR7eWVhcn0tJHsobW9udGggPCAxMCkgPyBgMCR7bW9udGh9YCA6IG1vbnRofSAtICR7KGRheSA8IDEwKSA/IGAwJHtkYXl9YCA6IGRheX1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGC0LXQutGD0YnRg9GOINC+0YLRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdGD0Y4g0LTQsNGC0YMgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7W3N0cmluZ119INGC0LXQutGD0YnQsNGPINC00LDRgtCwXHJcbiAgKi9cclxuICBnZXRDdXJyZW50RGF0ZSgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRlKG5vdyk7XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQv9C+0YHQu9C10LTQvdC40LUg0YLRgNC4INC80LXRgdGP0YbQsFxyXG4gIGdldERhdGVMYXN0VGhyZWVNb250aCgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgY29uc3Qgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgIGxldCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgZGF5IC09IDkwO1xyXG4gICAgaWYgKGRheSA8IDApIHtcclxuICAgICAgeWVhciAtPSAxO1xyXG4gICAgICBkYXkgPSAzNjUgLSBkYXk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7eWVhcn0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldEN1cnJlbnRTdW1tZXJEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNS0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0TGFzdFN1bW1lckRhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpIC0gMTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIGdldEZpcnN0RGF0ZUN1clllYXIoKSB7XHJcbiAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfSAtIDAwMWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gZGQubW0ueXl5eSBoaDptbV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIHRpbWVzdGFtcFRvRGF0ZVRpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoKS5yZXBsYWNlKC8sLywgJycpLnJlcGxhY2UoLzpcXHcrJC8sICcnKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICB0aW1lc3RhbXBUb1RpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgICByZXR1cm4gYCR7aG91cnMgPCAxMCA/IGAwJHtob3Vyc31gIDogaG91cnN9IDogJHttaW51dGVzIDwgMTAgPyBgMCR7bWludXRlc31gIDogbWludXRlc30gYDtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqINCS0L7Qt9GA0LDRidC10L3QuNC1INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0L3QtdC00LXQu9C1INC/0L4gdW5peHRpbWUgdGltZXN0YW1wXHJcbiAgKiBAcGFyYW0gdW5peHRpbWVcclxuICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgKi9cclxuICBnZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIHJldHVybiBkYXRlLmdldERheSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqINCS0LXRgNC90YPRgtGMINC90LDQuNC80LXQvdC+0LLQsNC90LjQtSDQtNC90Y8g0L3QtdC00LXQu9C4XHJcbiAgKiBAcGFyYW0gZGF5TnVtYmVyXHJcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICovXHJcbiAgZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKGRheU51bWJlcikge1xyXG4gICAgY29uc3QgZGF5cyA9IHtcclxuICAgICAgMDogJ1N1bicsXHJcbiAgICAgIDE6ICdNb24nLFxyXG4gICAgICAyOiAnVHVlJyxcclxuICAgICAgMzogJ1dlZCcsXHJcbiAgICAgIDQ6ICdUaHUnLFxyXG4gICAgICA1OiAnRnJpJyxcclxuICAgICAgNjogJ1NhdCcsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0LXRgNC90YPRgtGMINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQvNC10YHRj9GG0LAg0L/QviDQtdCz0L4g0L3QvtC80LXRgNGDXHJcbiAgICogQHBhcmFtIG51bU1vbnRoXHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihudW1Nb250aCl7XHJcblxyXG4gICAgaWYodHlwZW9mIG51bU1vbnRoICE9PSBcIm51bWJlclwiIHx8IG51bU1vbnRoIDw9MCAmJiBudW1Nb250aCA+PSAxMikge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aE5hbWUgPSB7XHJcbiAgICAgIDA6IFwiSmFuXCIsXHJcbiAgICAgIDE6IFwiRmViXCIsXHJcbiAgICAgIDI6IFwiTWFyXCIsXHJcbiAgICAgIDM6IFwiQXByXCIsXHJcbiAgICAgIDQ6IFwiTWF5XCIsXHJcbiAgICAgIDU6IFwiSnVuXCIsXHJcbiAgICAgIDY6IFwiSnVsXCIsXHJcbiAgICAgIDc6IFwiQXVnXCIsXHJcbiAgICAgIDg6IFwiU2VwXCIsXHJcbiAgICAgIDk6IFwiT2N0XCIsXHJcbiAgICAgIDEwOiBcIk5vdlwiLFxyXG4gICAgICAxMTogXCJEZWNcIlxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gbW9udGhOYW1lW251bU1vbnRoXTtcclxuICB9XHJcblxyXG4gIC8qKiDQodGA0LDQstC90LXQvdC40LUg0LTQsNGC0Ysg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eSA9IGRkLm1tLnl5eXkg0YEg0YLQtdC60YPRidC40Lwg0LTQvdC10LxcclxuICAqXHJcbiAgKi9cclxuICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgPT09IChuZXcgRGF0ZSgpKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGRhdGUpIHtcclxuICAgIGNvbnN0IHJlID0gLyhcXGR7Mn0pKFxcLnsxfSkoXFxkezJ9KShcXC57MX0pKFxcZHs0fSkvO1xyXG4gICAgY29uc3QgcmVzRGF0ZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICBpZiAocmVzRGF0ZS5sZW5ndGggPT09IDYpIHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKGAke3Jlc0RhdGVbNV19LSR7cmVzRGF0ZVszXX0tJHtyZXNEYXRlWzFdfWApO1xyXG4gICAgfVxyXG4gICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0L3QtSDRgNCw0YHQv9Cw0YDRgdC10L3QsCDQsdC10YDQtdC8INGC0LXQutGD0YnRg9GOXHJcbiAgICByZXR1cm4gbmV3IERhdGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IEhIOk1NIE1vbnRoTmFtZSBOdW1iZXJEYXRlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBnZXRUaW1lRGF0ZUhITU1Nb250aERheSgpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgcmV0dXJuIGAke2RhdGUuZ2V0SG91cnMoKSA8IDEwID8gYDAke2RhdGUuZ2V0SG91cnMoKX1gIDogZGF0ZS5nZXRIb3VycygpIH06JHtkYXRlLmdldE1pbnV0ZXMoKSA8IDEwID8gYDAke2RhdGUuZ2V0TWludXRlcygpfWAgOiBkYXRlLmdldE1pbnV0ZXMoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX0gJHtkYXRlLmdldERhdGUoKX1gO1xyXG4gIH1cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMC4xMC4yMDE2LlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG5hdHVyYWxQaGVub21lbm9uID17XHJcbiAgICBcImVuXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRW5nbGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRodW5kZXJzdG9ybSB3aXRoIHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2h0IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInJhZ2dlZCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJzaG93ZXIgcmFpbiBhbmQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiaGVhdnkgc2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInNob3dlciBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtb2RlcmF0ZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVyeSBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImZyZWV6aW5nIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpZ2h0IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImhlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwicmFnZ2VkIHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWdodCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZWF2eSBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic2hvd2VyIHNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJsaWdodCByYWluIGFuZCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJyYWluIGFuZCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJsaWdodCBzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcImhlYXZ5IHNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9rZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiaGF6ZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZCxkdXN0IHdoaXJsc1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZm9nXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJzYW5kXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJkdXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJ2b2xjYW5pYyBhc2hcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInNxdWFsbHNcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNsZWFyIHNreVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZmV3IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic2NhdHRlcmVkIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiYnJva2VuIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwib3ZlcmNhc3QgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNhbCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmljYW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJjb2xkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3RcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmR5XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJzZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJsaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcImdlbnRsZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIm1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiZnJlc2ggYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJzdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJoaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwic2V2ZXJlIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcInN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJ2aW9sZW50IHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJodXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInJ1XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUnVzc2lhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzZlxcdTA0NDBcXHUwNDNlXFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0NGJcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQzMlxcdTA0M2VcXHUwNDM3XFx1MDQzY1xcdTA0M2VcXHUwNDM2XFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDM2XFx1MDQzNVxcdTA0NDFcXHUwNDQyXFx1MDQzZVxcdTA0M2FcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQzZVxcdTA0NDdcXHUwNDM1XFx1MDQzZFxcdTA0NGMgXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDNiXFx1MDQ1MVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0MzhcXHUwNDNkXFx1MDQ0MlxcdTA0MzVcXHUwNDNkXFx1MDQ0MVxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0M2ZcXHUwNDQwXFx1MDQzZVxcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDNlXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVxcdTA0M2JcXHUwNDRjXFx1MDQ0OFxcdTA0M2VcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDRmXFx1MDQzYVxcdTA0M2VcXHUwNDQyXFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQzNVxcdTA0NDFcXHUwNDQ3XFx1MDQzMFxcdTA0M2RcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDRmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQzZlxcdTA0MzBcXHUwNDQxXFx1MDQzY1xcdTA0NDNcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2ZcXHUwNDMwXFx1MDQ0MVxcdTA0M2NcXHUwNDQzXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQ0MVxcdTA0M2FcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0MzZcXHUwNDMwXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDM1XFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIml0XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiSXRhbGlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dpYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2lhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRlbXBvcmFsZVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidGVtcG9yYWxlIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiZm9ydGUgcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInBpb2dnaWEgbGVnZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwicGlvZ2dpYSBtb2RlcmF0YVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiZm9ydGUgcGlvZ2dpYVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwicGlvZ2dpYSBmb3J0aXNzaW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwaW9nZ2lhIGVzdHJlbWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBpb2dnaWEgZ2VsYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiYWNxdWF6em9uZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiYWNxdWF6em9uZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZm9ydGUgbmV2aWNhdGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIm5ldmlzY2hpb1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiZm9ydGUgbmV2aWNhdGFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImZvc2NoaWFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bW9cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImZvc2NoaWFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIm11bGluZWxsaSBkaSBzYWJiaWFcXC9wb2x2ZXJlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJuZWJiaWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNpZWxvIHNlcmVub1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwicG9jaGUgbnV2b2xlXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJpIHNwYXJzZVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViaSBzcGFyc2VcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImNpZWxvIGNvcGVydG9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBlc3RhIHRyb3BpY2FsZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwidXJhZ2Fub1wiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJlZGRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JhbmRpbmVcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1vXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCYXZhIGRpIHZlbnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmV6emEgbGVnZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJlenphIHRlc2FcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGEgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlVyYWdhbm9cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNwXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU3BhbmlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2VyYSB0b3JtZW50YVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImZ1ZXJ0ZSB0b3JtZW50YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidG9ybWVudGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJsbG92aXpuYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxsdXZpYSB5IGxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibGx1dmlhIHkgbGxvdml6bmFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImxsdXZpYSB5IGxsb3Zpem5hIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiY2h1YmFzY29cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxsdXZpYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImxsdXZpYSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwibGx1dmlhIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibGx1dmlhIG11eSBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImxsdXZpYSBtdXkgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJsbHV2aWEgaGVsYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaHViYXNjbyBkZSBsaWdlcmEgaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2h1YmFzY29cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImNodWJhc2NvIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2YWRhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmlldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJhZ3VhbmlldmVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImNodWJhc2NvIGRlIG5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJuaWVibGFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImh1bW9cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidG9yYmVsbGlub3MgZGUgYXJlbmFcXC9wb2x2b1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJ1bWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNpZWxvIGNsYXJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJhbGdvIGRlIG51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJlcyBkaXNwZXJzYXNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YmVzIHJvdGFzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidG9ybWVudGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmFjXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyXFx1MDBlZG9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuaXpvXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtYVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiVmllbnRvIGZsb2pvXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJWaWVudG8gc3VhdmVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlZpZW50byBtb2RlcmFkb1wiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2FcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlZpZW50byBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZpZW50byBmdWVydGUsIHByXFx1MDBmM3hpbW8gYSB2ZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YWQgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFjXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInVhXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiVWtyYWluaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzdcXHUwNDU2IFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNlXFx1MDQ0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0M2FcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDQyXFx1MDQzYVxcdTA0M2VcXHUwNDQ3XFx1MDQzMFxcdTA0NDFcXHUwNDNkXFx1MDQ1NiBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQzZlxcdTA0M2VcXHUwNDNjXFx1MDQ1NlxcdTA0NDBcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzYVxcdTA0NDBcXHUwNDM4XFx1MDQzNlxcdTA0MzBcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzMgXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDNjXFx1MDQzZVxcdTA0M2FcXHUwNDQwXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQ0MVxcdTA0MzVcXHUwNDQwXFx1MDQzZlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0M2FcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDU2XFx1MDQ0OVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzMFxcdTA0M2NcXHUwNDM1XFx1MDQ0MlxcdTA0NTZcXHUwNDNiXFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NDdcXHUwNDM4XFx1MDQ0MVxcdTA0NDJcXHUwNDM1IFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0NDVcXHUwNDM4IFxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQ1NlxcdTA0NDBcXHUwNDMyXFx1MDQzMFxcdTA0M2RcXHUwNDU2IFxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0NTZcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzNVxcdTA0MzJcXHUwNDU2XFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQ0MVxcdTA0M2ZcXHUwNDM1XFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDU2XFx1MDQ0MlxcdTA0NDBcXHUwNDRmXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZGVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJHZXJtYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdld2l0dGVyIG1pdCBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxlaWNodGUgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIkdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzY2h3ZXJlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJlaW5pZ2UgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkdld2l0dGVyIG1pdCBsZWljaHRlbSBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiR2V3aXR0ZXIgbWl0IE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHZXdpdHRlciBtaXQgc3RhcmtlbSBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGVpY2h0ZXMgTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic3RhcmtlcyBOaWVzZWxuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsZWljaHRlciBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInN0YXJrZXIgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIk5pZXNlbHNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxlaWNodGVyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDBlNFxcdTAwZGZpZ2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJzZWhyIHN0YXJrZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInNlaHIgc3RhcmtlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiU3RhcmtyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiRWlzcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxlaWNodGUgUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJSZWdlbnNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImhlZnRpZ2UgUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtXFx1MDBlNFxcdTAwZGZpZ2VyIFNjaG5lZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiU2NobmVlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZWZ0aWdlciBTY2huZWVmYWxsXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJHcmF1cGVsXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJTY2huZWVzY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJ0clxcdTAwZmNiXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJSYXVjaFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiRHVuc3RcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlNhbmQgXFwvIFN0YXVic3R1cm1cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIk5lYmVsXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJrbGFyZXIgSGltbWVsXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJlaW4gcGFhciBXb2xrZW5cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTAwZmNiZXJ3aWVnZW5kIGJld1xcdTAwZjZsa3RcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTAwZmNiZXJ3aWVnZW5kIGJld1xcdTAwZjZsa3RcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIndvbGtlbmJlZGVja3RcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BlbnN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJyaWthblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia2FsdFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaGVpXFx1MDBkZlwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZGlnXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJIYWdlbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiV2luZHN0aWxsZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGVpY2h0ZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiTWlsZGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1cXHUwMGU0XFx1MDBkZmlnZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJpc2NoZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3RhcmtlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIb2Nod2luZCwgYW5uXFx1MDBlNGhlbmRlciBTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNjaHdlcmVyIFN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiSGVmdGlnZXMgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk9ya2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJwdFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlBvcnR1Z3Vlc2VcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0cm92b2FkYSBjb20gY2h1dmEgbGV2ZVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidHJvdm9hZGEgY29tIGNodXZhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0cm92b2FkYSBjb20gY2h1dmEgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRyb3ZvYWRhIGxldmVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRyb3ZvYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0cm92b2FkYSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRyb3ZvYWRhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidHJvdm9hZGEgY29tIGdhcm9hIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImdhcm9hIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJnYXJvYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiZ2Fyb2EgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiY2h1dmEgbGV2ZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiY2h1dmEgZnJhY2FcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImNodXZhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJjaHV2YSBkZSBnYXJvYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiY2h1dmEgZnJhY2FcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIkNodXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJjaHV2YSBkZSBpbnRlbnNpZGFkZSBwZXNhZG9cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImNodXZhIG11aXRvIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJDaHV2YSBGb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiY2h1dmEgY29tIGNvbmdlbGFtZW50b1wiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1dmEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNodXZhXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaHV2YSBkZSBpbnRlbnNpZGFkZSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIk5ldmUgYnJhbmRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZlIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiY2h1dmEgY29tIG5ldmVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImJhbmhvIGRlIG5ldmVcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIk5cXHUwMGU5dm9hXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1hXFx1MDBlN2FcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5lYmxpbmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInR1cmJpbGhcXHUwMGY1ZXMgZGUgYXJlaWFcXC9wb2VpcmFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIk5lYmxpbmFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNcXHUwMGU5dSBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiQWxndW1hcyBudXZlbnNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51dmVucyBkaXNwZXJzYXNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51dmVucyBxdWVicmFkb3NcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInRlbXBvIG51YmxhZG9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBlc3RhZGUgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImZ1cmFjXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyaW9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInF1ZW50ZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiY29tIHZlbnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuaXpvXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInJvXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUm9tYW5pYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImZ1cnR1blxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImZ1cnR1blxcdTAxMDMgY3UgcGxvYWllIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiZnVydHVuXFx1MDEwMyB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImZ1cnR1blxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImZ1cnR1blxcdTAxMDMgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJmdXJ0dW5cXHUwMTAzIGFwcmlnXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBtYXJlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIGpvYXNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIG1hcmVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInBsb2FpZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBsb2FpZVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwicGxvYWllIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwicGxvYWllIHRvcmVuXFx1MDIxYmlhbFxcdTAxMDMgXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwbG9haWUgZXh0cmVtXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGxvYWllIFxcdTAwZWVuZ2hlXFx1MDIxYmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmluc29hcmUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuaW5zb2FyZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwibmluc29hcmUgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJsYXBvdmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmluc29hcmUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidlxcdTAwZTJydGVqdXJpIGRlIG5pc2lwXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2VyIHNlbmluXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJjXFx1MDBlMlxcdTAyMWJpdmEgbm9yaVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibm9yaSBcXHUwMGVlbXByXFx1MDEwM1xcdTAyMTl0aWFcXHUwMjFiaVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiY2VyIGZyYWdtZW50YXRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImNlciBhY29wZXJpdCBkZSBub3JpXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJmdXJ0dW5hIHRyb3BpY2FsXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwidXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJyZWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmaWVyYmludGVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZhbnQgcHV0ZXJuaWNcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyaW5kaW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInBsXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUG9saXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiQnVyemEgeiBsZWtraW1pIG9wYWRhbWkgZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiQnVyemEgeiBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkJ1cnphIHogaW50ZW5zeXdueW1pIG9wYWRhbWkgZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiTGVra2EgYnVyemFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIkJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJTaWxuYSBidXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQnVyemFcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkJ1cnphIHogbGVra1xcdTAxMDUgbVxcdTAxN2Nhd2tcXHUwMTA1XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJCdXJ6YSB6IG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiQnVyemEgeiBpbnRlbnN5d25cXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiTGVra2EgbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJNXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIkludGVuc3l3bmEgbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJMZWtraWUgb3BhZHkgZHJvYm5lZ28gZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiRGVzemN6IFxcLyBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIkludGVuc3l3bnkgZGVzemN6IFxcLyBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlNpbG5hIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiTGVra2kgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJVbWlhcmtvd2FueSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIkludGVuc3l3bnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJiYXJkem8gc2lsbnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJVbGV3YVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiTWFyem5cXHUwMTA1Y3kgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJLclxcdTAwZjN0a2EgdWxld2FcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIkRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiSW50ZW5zeXdueSwgbGVra2kgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJMZWtraWUgb3BhZHkgXFx1MDE1Ym5pZWd1XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwMTVhbmllZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTW9jbmUgb3BhZHkgXFx1MDE1Ym5pZWd1XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJEZXN6Y3ogemUgXFx1MDE1Ym5pZWdlbVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDE1YW5pZVxcdTAxN2N5Y2FcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIk1naWVcXHUwMTQya2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlNtb2dcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlphbWdsZW5pYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiWmFtaWVcXHUwMTA3IHBpYXNrb3dhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJNZ1xcdTAxNDJhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJCZXpjaG11cm5pZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiTGVra2llIHphY2htdXJ6ZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiUm96cHJvc3pvbmUgY2htdXJ5XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJQb2NobXVybm8geiBwcnplamFcXHUwMTVibmllbmlhbWlcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlBvY2htdXJub1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiYnVyemEgdHJvcGlrYWxuYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiQ2hcXHUwMTQyb2Rub1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiR29yXFx1MDEwNWNvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aWV0cnpuaWVcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIkdyYWRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlNwb2tvam5pZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGVra2EgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkRlbGlrYXRuYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiVW1pYXJrb3dhbmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxNWF3aWVcXHUwMTdjYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU2lsbmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlByYXdpZSB3aWNodXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJXaWNodXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuYSB3aWNodXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTenRvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkd3YVxcdTAxNDJ0b3dueSBzenRvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFnYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImZpXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRmlubmlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInVra29zbXlyc2t5IGphIGtldnl0IHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInVra29zbXlyc2t5IGphIHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInVra29zbXlyc2t5IGphIGtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwicGllbmkgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJrb3ZhIHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJsaWV2XFx1MDBlNCB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidWtrb3NteXJza3kgamEga2V2eXQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ1a2tvc215cnNreSBqYSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInVra29zbXlyc2t5IGphIGtvdmEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWV2XFx1MDBlNCB0aWh1dHRhaW5lblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwidGlodXR0YWFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImtvdmEgdGlodXR0YWluZW5cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZXZcXHUwMGU0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwidGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJrb3ZhIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwidGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwaWVuaSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJrb2h0YWxhaW5lbiBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImVyaXR0XFx1MDBlNGluIHJ1bnNhc3RhIHNhZGV0dGFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwialxcdTAwZTRcXHUwMGU0dFxcdTAwZTR2XFx1MDBlNCBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWV2XFx1MDBlNCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJwaWVuaSBsdW1pc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibHVtaVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwicGFsam9uIGx1bnRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJyXFx1MDBlNG50XFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibHVtaWt1dXJvXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzdW11XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzYXZ1XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJzdW11XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJoaWVra2FcXC9wXFx1MDBmNmx5IHB5XFx1MDBmNnJyZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidGFpdmFzIG9uIHNlbGtlXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwidlxcdTAwZTRoXFx1MDBlNG4gcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJham9pdHRhaXNpYSBwaWx2aVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImhhamFuYWlzaWEgcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJwaWx2aW5lblwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvb3BwaW5lbiBteXJza3lcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImhpcm11bXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJreWxtXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwia3V1bWFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInR1dWxpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJyYWtlaXRhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIm5sXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRHV0Y2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJvbndlZXJzYnVpIG1ldCBsaWNodGUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIm9ud2VlcnNidWkgbWV0IHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJvbndlZXJzYnVpIG1ldCB6d2FyZSByZWdlbnZhbFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGljaHRlIG9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIm9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInp3YXJlIG9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9ucmVnZWxtYXRpZyBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJvbndlZXJzYnVpIG1ldCBsaWNodGUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIm9ud2VlcnNidWkgbWV0IG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJvbndlZXJzYnVpIG1ldCB6d2FyZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGljaHRlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpY2h0ZSBtb3RyZWdlblxcL3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiendhcmUgbW90cmVnZW5cXC9yZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxpY2h0ZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibWF0aWdlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJ6d2FyZSByZWdlbnZhbFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiemVlciB6d2FyZSByZWdlbnZhbFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiS291ZGUgYnVpZW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpY2h0ZSBzdG9ydHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzdG9ydHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJ6d2FyZSBzdG9ydHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWNodGUgc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVldXdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhldmlnZSBzbmVldXdcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImlqemVsXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuYXR0ZSBzbmVldXdcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5ldmVsXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ6YW5kXFwvc3RvZiB3ZXJ2ZWxpbmdcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIm9uYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwibGljaHQgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiaGFsZiBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJ6d2FhciBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJnZWhlZWwgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlzY2hlIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImtvdWRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhlZXRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInN0b3JtYWNodGlnXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWdlbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiV2luZHN0aWxcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkthbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpY2h0ZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiWmFjaHRlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNYXRpZ2UgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlZyaWoga3JhY2h0aWdlIHdpbmRcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIktyYWNodGlnZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIYXJkZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJTdG9ybWFjaHRpZ1wiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlp3YXJlIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJaZWVyIHp3YXJlIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImZyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRnJlbmNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwib3JhZ2UgZXQgcGx1aWUgZmluZVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwib3JhZ2UgZXQgcGx1aWVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIm9yYWdlIGV0IGZvcnRlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIm9yYWdlcyBsXFx1MDBlOWdlcnNcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIm9yYWdlc1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiZ3JvcyBvcmFnZXNcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9yYWdlcyBcXHUwMGU5cGFyc2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJPcmFnZSBhdmVjIGxcXHUwMGU5Z1xcdTAwZThyZSBicnVpbmVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIm9yYWdlcyBcXHUwMGU5cGFyc2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm9zIG9yYWdlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJCcnVpbmUgbFxcdTAwZTlnXFx1MDBlOHJlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJCcnVpbmVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIkZvcnRlcyBicnVpbmVzXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJQbHVpZSBmaW5lIFxcdTAwZTlwYXJzZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicGx1aWUgZmluZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiQ3JhY2hpbiBpbnRlbnNlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJBdmVyc2VzIGRlIGJydWluZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibFxcdTAwZTlnXFx1MDBlOHJlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBsdWllcyBtb2RcXHUwMGU5clxcdTAwZTllc1wiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiRm9ydGVzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidHJcXHUwMGU4cyBmb3J0ZXMgcHJcXHUwMGU5Y2lwaXRhdGlvbnNcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImdyb3NzZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwbHVpZSB2ZXJnbGFcXHUwMGU3YW50ZVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGV0aXRlcyBhdmVyc2VzXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJhdmVyc2VzIGRlIHBsdWllXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJhdmVyc2VzIGludGVuc2VzXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsXFx1MDBlOWdcXHUwMGU4cmVzIG5laWdlc1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmVpZ2VcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImZvcnRlcyBjaHV0ZXMgZGUgbmVpZ2VcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIm5laWdlIGZvbmR1ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiYXZlcnNlcyBkZSBuZWlnZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiYnJ1bWVcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIkJyb3VpbGxhcmRcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImJydW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0ZW1wXFx1MDBlYXRlcyBkZSBzYWJsZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJvdWlsbGFyZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiZW5zb2xlaWxsXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwicGV1IG51YWdldXhcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInBhcnRpZWxsZW1lbnQgZW5zb2xlaWxsXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnVhZ2V1eFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiQ291dmVydFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcFxcdTAwZWF0ZSB0cm9waWNhbGVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm91cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyb2lkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjaGF1ZFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudGV1eFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JcXHUwMGVhbGVcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1lXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCcmlzZSBsXFx1MDBlOWdcXHUwMGU4cmVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyaXNlIGRvdWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmlzZSBtb2RcXHUwMGU5clxcdTAwZTllXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzZSBmcmFpY2hlXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzZSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudCBmb3J0LCBwcmVzcXVlIHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbnQgdmlvbGVudFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVudCB0clxcdTAwZThzIHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBcXHUwMGVhdGVcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcImVtcFxcdTAwZWF0ZSB2aW9sZW50ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3VyYWdhblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiYmdcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJCdWxnYXJpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0M2ZcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDM5XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDNhXFx1MDQ0YVxcdTA0NDFcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDIwXFx1MDQ0YVxcdTA0M2NcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDIwXFx1MDQ0YVxcdTA0M2NcXHUwNDRmXFx1MDQ0OSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQyM1xcdTA0M2NcXHUwNDM1XFx1MDQ0MFxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDE0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0IFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MWVcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDFmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDIxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDE4XFx1MDQzN1xcdTA0M2RcXHUwNDM1XFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzMlxcdTA0MzBcXHUwNDQ5IFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDFlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQxY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0MTRcXHUwNDM4XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQxZFxcdTA0MzhcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0MWZcXHUwNDRmXFx1MDQ0MVxcdTA0NGFcXHUwNDQ3XFx1MDQzZFxcdTA0MzBcXC9cXHUwNDFmXFx1MDQ0MFxcdTA0MzBcXHUwNDQ4XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQxY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0MmZcXHUwNDQxXFx1MDQzZFxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQxZFxcdTA0MzhcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDNhXFx1MDQ0YVxcdTA0NDFcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDQxXFx1MDQzNVxcdTA0NGZcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0MjJcXHUwNDRhXFx1MDQzY1xcdTA0M2RcXHUwNDM4IFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQyMlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVxcL1xcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQyMlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0MzhcXHUwNDQ3XFx1MDQzNVxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0MjFcXHUwNDQyXFx1MDQ0M1xcdTA0MzRcXHUwNDM1XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0MTNcXHUwNDNlXFx1MDQ0MFxcdTA0MzVcXHUwNDQ5XFx1MDQzZSBcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQxMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDJcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNlXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU3dlZGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJmdWxsdCBcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTAwZTVza2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDBlNXNrYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib2pcXHUwMGU0bW50IG92XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImZ1bGx0IFxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibWp1a3QgZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoXFx1MDBlNXJ0IGR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJtanVrdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJtanVrdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJNXFx1MDBlNXR0bGlnIHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhcXHUwMGU1cnQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibXlja2V0IGtyYWZ0aWd0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTAwZjZzcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwidW5kZXJreWx0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIm1qdWt0IFxcdTAwZjZzcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiZHVzY2gtcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicmVnbmFyIHNtXFx1MDBlNXNwaWtcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm1qdWsgc25cXHUwMGY2XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAwZjZcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImtyYWZ0aWd0IHNuXFx1MDBmNmZhbGxcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNuXFx1MDBmNmJsYW5kYXQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25cXHUwMGY2b3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJkaW1tYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21vZ2dcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImRpc1wiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJkaW1taWd0XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJrbGFyIGhpbW1lbFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiblxcdTAwZTVncmEgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic3ByaWRkYSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJtb2xuaWd0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwMGY2dmVyc2t1Z2dhbmRlIG1vbG5cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waXNrIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia2FsbHRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInZhcm10XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJibFxcdTAwZTVzaWd0XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWdlbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ6aF90d1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNoaW5lc2UgVHJhZGl0aW9uYWxcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1NGUyZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1NjZiNFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTUxY2RcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1NTkyN1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTNlXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1OTY2M1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTg1ODRcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MTU5XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1ODU4NFxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTZjOTlcXHU2NWNiXFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTY2NzRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTY2NzRcXHVmZjBjXFx1NWMxMVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1OTY3MFxcdWZmMGNcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY4ZFxcdTYzNzJcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHU3MWIxXFx1NWUzNlxcdTk4YThcXHU2NmI0XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHU5OGI2XFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1NzFiMVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1NTkyN1xcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInRyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiVHVya2lzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgaGFmaWYgeWFcXHUwMTFmbXVybHVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgeWFcXHUwMTFmbXVybHVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgc2FcXHUwMTFmYW5hayB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJIYWZpZiBzYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJTYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwMTVlaWRkZXRsaSBzYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJBcmFsXFx1MDEzMWtsXFx1MDEzMSBzYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJZZXIgeWVyIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlllciB5ZXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiWWVyIHllciB5b1xcdTAxMWZ1biB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJZZXIgeWVyIGhhZmlmIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlllciB5ZXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiWWVyIHllciB5b1xcdTAxMWZ1biB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJZZXIgeWVyIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiSGFmaWYgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJPcnRhIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDE1ZWlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJBXFx1MDE1ZlxcdTAxMzFyXFx1MDEzMSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIllhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzEgdmUgc29cXHUwMTFmdWsgaGF2YVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgaGFmaWYgeW9cXHUwMTFmdW5sdWtsdSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJIYWZpZiBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiS2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIllvXFx1MDExZnVuIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJLYXJsYSBrYXJcXHUwMTMxXFx1MDE1ZlxcdTAxMzFrIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsXFx1MDBmYyBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJTaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkhhZmlmIHNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJLdW1cXC9Ub3ogZlxcdTAxMzFydFxcdTAxMzFuYXNcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJTaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQVxcdTAwZTdcXHUwMTMxa1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiQXogYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBheiBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJQYXJcXHUwMGU3YWxcXHUwMTMxIGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkthcGFsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiS2FzXFx1MDEzMXJnYVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVHJvcGlrIGZcXHUwMTMxcnRcXHUwMTMxbmFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkhvcnR1bVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDBjN29rIFNvXFx1MDExZnVrXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwMGM3b2sgU1xcdTAxMzFjYWtcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJEb2x1IHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiRHVyZ3VuXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTYWtpblwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiSGFmaWYgUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkF6IFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJPcnRhIFNldml5ZSBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkt1dnZldGxpIFJcXHUwMGZjemdhclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2VydCBSXFx1MDBmY3pnYXJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkZcXHUwMTMxcnRcXHUwMTMxbmFcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTAxNWVpZGRldGxpIEZcXHUwMTMxcnRcXHUwMTMxbmFcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTAxNWVpZGRldGxpIEthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTAwYzdvayBcXHUwMTVlaWRkZXRsaSBLYXNcXHUwMTMxcmdhXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ6aF9jblwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNoaW5lc2UgU2ltcGxpZmllZFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHU0ZTJkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHU2NmI0XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1NTFiYlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTVjMGZcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHU1OTI3XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1OTZlOFxcdTU5MzlcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHU5NjM1XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1ODU4NFxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTcwZGZcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHU4NTg0XFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1NmM5OVxcdTY1Y2JcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHU1OTI3XFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1NjY3NFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1NjY3NFxcdWZmMGNcXHU1YzExXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1NTkxYVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHU5NjM0XFx1ZmYwY1xcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHU5Zjk5XFx1NTM3N1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTcwZWRcXHU1ZTI2XFx1OThjZVxcdTY2YjRcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTk4ZDNcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHU1MWI3XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHU3MGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHU1OTI3XFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1NTFiMFxcdTk2ZjlcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiY3pcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDemVjaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImJvdVxcdTAxNTlrYSBzZSBzbGFiXFx1MDBmZG0gZGVcXHUwMTYxdFxcdTAxMWJtXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJib3VcXHUwMTU5a2EgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2lsblxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYlxcdTAxNjFcXHUwMGVkIGJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzaWxuXFx1MDBlMSBib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImJvdVxcdTAxNTlrb3ZcXHUwMGUxIHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGthXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2xhYlxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiYm91XFx1MDE1OWthIHMgbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2lsblxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlblxcdTAwZWQgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtcmhvbGVuXFx1MDBlZCBzIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWQgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJtcmhvbGVuXFx1MDBlZCBhIHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJtcmhvbGVuXFx1MDBlZCBhIHNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJwcnVka1xcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwicFxcdTAxNTlcXHUwMGVkdmFsb3ZcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcInByXFx1MDE2ZnRyXFx1MDE3ZSBtcmFcXHUwMTBkZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIm1yem5vdWNcXHUwMGVkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInNsYWJcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIm9iXFx1MDEwZGFzblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm1cXHUwMGVkcm5cXHUwMGU5IHNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImh1c3RcXHUwMGU5IHNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInptcnpsXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzbVxcdTAwZWRcXHUwMTYxZW5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1IHNlIHNuXFx1MDExYmhlbVwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcInNsYWJcXHUwMGU5IHNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcInNpbG5cXHUwMGU5IHNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1saGFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImtvdVxcdTAxNTlcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInBcXHUwMGVkc2VcXHUwMTBkblxcdTAwZTkgXFx1MDEwZGkgcHJhY2hvdlxcdTAwZTkgdlxcdTAwZWRyeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiaHVzdFxcdTAwZTEgbWxoYVwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwicFxcdTAwZWRzZWtcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcInByYVxcdTAxNjFub1wiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwic29wZVxcdTAxMGRuXFx1MDBmZCBwb3BlbFwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwicHJ1ZGtcXHUwMGU5IGJvdVxcdTAxNTllXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJqYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwic2tvcm8gamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInBvbG9qYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwib2JsYVxcdTAxMGRub1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiemF0YVxcdTAxN2Vlbm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2tcXHUwMGUxIGJvdVxcdTAxNTllXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJpa1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJ6aW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3Jrb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidlxcdTAxMWJ0cm5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJrcnVwb2JpdFxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcImJlenZcXHUwMTFidFxcdTAxNTlcXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJ2XFx1MDBlMW5la1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwidlxcdTAxMWJ0XFx1MDE1OVxcdTAwZWRrXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJzbGFiXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJtXFx1MDBlZHJuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTBkZXJzdHZcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcInNpbG5cXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcInBydWRrXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJib3VcXHUwMTU5bGl2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJ2aWNoXFx1MDE1OWljZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwic2lsblxcdTAwZTEgdmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIm1vaHV0blxcdTAwZTEgdmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIm9ya1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJrclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIktvcmVhXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnaHQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImhlYXZ5IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwicmFnZ2VkIHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInNob3dlciBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtb2RlcmF0ZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVyeSBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImZyZWV6aW5nIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpZ2h0IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImhlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGlnaHQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9rZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiaGF6ZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZFxcL2R1c3Qgd2hpcmxzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJmb2dcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInNreSBpcyBjbGVhclwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZmV3IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic2NhdHRlcmVkIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiYnJva2VuIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwib3ZlcmNhc3QgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNhbCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmljYW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJjb2xkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3RcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmR5XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImdsXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiR2FsaWNpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG8gaW50ZW5zb1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwib3JiYWxsbyBsaXhlaXJvXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJvcmJhbGxvXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJvcmJhbGxvIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImNob2l2YSBlIG9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiY2hvaXZhIGUgb3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiY2hvaXZhIGUgb3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJvcmJhbGxvIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJjaG9pdmEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiY2hvaXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJjaG9pdmEgZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiY2hvaXZhIG1vaSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiY2hvaXZhIGV4dHJlbWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImNob2l2YSB4ZWFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2hvaXZhIGRlIGR1Y2hhIGRlIGJhaXhhIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaG9pdmEgZGUgZHVjaGFcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImNob2l2YSBkZSBkdWNoYSBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZhZGEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwibmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImF1Z2FuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuZXZlIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJuXFx1MDBlOWJvYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiblxcdTAwZTlib2EgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwicmVtdWlcXHUwMGYxb3MgZGUgYXJlYSBlIHBvbHZvXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicnVtYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2VvIGNsYXJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJhbGdvIGRlIG51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJlcyBkaXNwZXJzYXNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YmVzIHJvdGFzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidG9ybWVudGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImZ1cmFjXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyXFx1MDBlZG9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJzYXJhYmlhXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtYVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiVmVudG8gZnJvdXhvXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJWZW50byBzdWF2ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiVmVudG8gbW9kZXJhZG9cIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWZW50byBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudG8gZm9ydGUsIHByXFx1MDBmM3hpbW8gYSB2ZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YWRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YWRlIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJGdXJhY1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ2aVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcInZpZXRuYW1lc2VcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIE1cXHUwMWIwYSBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBjXFx1MDBmMyBjaFxcdTFlZGJwIGdpXFx1MWVhZHRcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIkJcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIGxcXHUxZWRiblwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQlxcdTAwZTNvIHZcXHUwMGUwaSBuXFx1MDFhMWlcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGEgcGhcXHUwMGY5biBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MWVkYmkgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MWVkYmkgbVxcdTAxYjBhIHBoXFx1MDBmOW4gblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDBlMW5oIHNcXHUwMGUxbmcgY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5biBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5biBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwibVxcdTAxYjBhIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIm1cXHUwMWIwYSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1cXHUwMWIwYSB2XFx1MWVlYmFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIm1cXHUwMWIwYSBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJtXFx1MDFiMGEgclxcdTFlYTV0IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIm1cXHUwMWIwYSBsXFx1MWVkMWNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIm1cXHUwMWIwYSBsXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwibVxcdTAxYjBhIHJcXHUwMGUwb1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJ0dXlcXHUxZWJmdCByXFx1MDFhMWkgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJ0dXlcXHUxZWJmdFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwidHV5XFx1MWViZnQgblxcdTFlYjduZyBoXFx1MWVhMXRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIm1cXHUwMWIwYSBcXHUwMTExXFx1MDBlMVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwidHV5XFx1MWViZnQgbVxcdTAwZjkgdHJcXHUxZWRkaVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic1xcdTAxYjBcXHUwMWExbmcgbVxcdTFlZGRcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImtoXFx1MDBmM2kgYlxcdTFlZTVpXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwMTExXFx1MDBlMW0gbVxcdTAwZTJ5XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJiXFx1MDBlM28gY1xcdTAwZTF0IHZcXHUwMGUwIGxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJzXFx1MDFiMFxcdTAxYTFuZyBtXFx1MDBmOVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiYlxcdTFlYTd1IHRyXFx1MWVkZGkgcXVhbmcgXFx1MDExMVxcdTAwZTNuZ1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwibVxcdTAwZTJ5IHRoXFx1MDFiMGFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm1cXHUwMGUyeSByXFx1MWVhM2kgclxcdTAwZTFjXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJtXFx1MDBlMnkgY1xcdTFlZTVtXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJtXFx1MDBlMnkgXFx1MDExMWVuIHUgXFx1MDBlMW1cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcImxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJjXFx1MDFhMW4gYlxcdTAwZTNvIG5oaVxcdTFlYzd0IFxcdTAxMTFcXHUxZWRiaVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiYlxcdTAwZTNvIGxcXHUxZWQxY1wiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwibFxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiblxcdTAwZjNuZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiZ2lcXHUwMGYzXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJtXFx1MDFiMGEgXFx1MDExMVxcdTAwZTFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIkNoXFx1MWViZiBcXHUwMTExXFx1MWVjZFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiTmhcXHUxZWI5IG5oXFx1MDBlMG5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwMGMxbmggc1xcdTAwZTFuZyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdcXHUwMGVkbyB0aG9cXHUxZWEzbmdcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkdpXFx1MDBmMyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkdpXFx1MDBmMyB2XFx1MWVlYmEgcGhcXHUxZWEzaVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiR2lcXHUwMGYzIG1cXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkdpXFx1MDBmMyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJMXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiTFxcdTFlZDFjIHhvXFx1MDBlMXkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiQlxcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJCXFx1MDBlM28gY1xcdTFlYTVwIGxcXHUxZWRiblwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiQlxcdTAwZTNvIGxcXHUxZWQxY1wiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiYXJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJBcmFiaWNcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjIzXFx1MDY0NVxcdTA2MzdcXHUwNjI3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDYyN1xcdTA2NDRcXHUwNjM5XFx1MDY0OFxcdTA2MjdcXHUwNjM1XFx1MDY0MSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjI3XFx1MDY0NFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyN1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyYlxcdTA2NDJcXHUwNjRhXFx1MDY0NFxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmVcXHUwNjM0XFx1MDY0NlxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDhcXHUwNjMzXFx1MDYzNyBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzlcXHUwNjI3XFx1MDY0NFxcdTA2NGEgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MjhcXHUwNjMxXFx1MDYyZlwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyYyBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDY0N1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyY1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyYyBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNjM1XFx1MDY0MlxcdTA2NGFcXHUwNjM5XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmNcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA2MzZcXHUwNjI4XFx1MDYyN1xcdTA2MjhcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA2MmZcXHUwNjJlXFx1MDYyN1xcdTA2NDZcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA2M2FcXHUwNjI4XFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0NVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDYzM1xcdTA2NDVcXHUwNjI3XFx1MDYyMSBcXHUwNjM1XFx1MDYyN1xcdTA2NDFcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDYzYVxcdTA2MjdcXHUwNjI2XFx1MDY0NSBcXHUwNjJjXFx1MDYzMlxcdTA2MjZcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0NVxcdTA2MmFcXHUwNjQxXFx1MDYzMVxcdTA2NDJcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDVcXHUwNjJhXFx1MDY0NlxcdTA2MjdcXHUwNjJiXFx1MDYzMVxcdTA2NDdcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0MlxcdTA2MjdcXHUwNjJhXFx1MDY0NVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYzNVxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjI3XFx1MDYzM1xcdTA2MmFcXHUwNjQ4XFx1MDYyN1xcdTA2MjZcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDYzMlxcdTA2NDhcXHUwNjRhXFx1MDYzOVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA2MjhcXHUwNjI3XFx1MDYzMVxcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA2MmRcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDYzMVxcdTA2NGFcXHUwNjI3XFx1MDYyZFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjJmXFx1MDYyN1xcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA2NDdcXHUwNjI3XFx1MDYyZlxcdTA2MjZcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQ0XFx1MDYzN1xcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDVcXHUwNjM5XFx1MDYyYVxcdTA2MmZcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MzlcXHUwNjQ0XFx1MDY0YVxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwNjMxXFx1MDY0YVxcdTA2MjdcXHUwNjJkIFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmZcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzOVxcdTA2NDZcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYzNVxcdTA2MjdcXHUwNjMxXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJta1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIk1hY2Vkb25pYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0M2NcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0M2NcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0M2ZcXHUwNDMwXFx1MDQzMlxcdTA0MzhcXHUwNDQ2XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDQxXFx1MDQzY1xcdTA0M2VcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDM3XFx1MDQzMFxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDM1XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQzZVxcdTA0NDdcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQ0MFxcdTA0NDJcXHUwNDNiXFx1MDQzZVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDQ3XFx1MDQzOFxcdTA0NDFcXHUwNDQyXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDNkXFx1MDQzNVxcdTA0M2FcXHUwNDNlXFx1MDQzYlxcdTA0M2FcXHUwNDQzIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQzZVxcdTA0MzRcXHUwNDMyXFx1MDQzZVxcdTA0MzVcXHUwNDNkXFx1MDQzOCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0M2ZcXHUwNDNiXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDJcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcXHUwNDE3XFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzN1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXFx1MDQxY1xcdTA0MzhcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlxcdTA0MTJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwNDIxXFx1MDQzMlxcdTA0MzVcXHUwNDM2IFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDQxY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlxcdTA0MWRcXHUwNDM1XFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlxcdTA0MTFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwic2tcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJTbG92YWtcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJiXFx1MDBmYXJrYSBzbyBzbGFiXFx1MDBmZG0gZGFcXHUwMTdlXFx1MDEwZm9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJiXFx1MDBmYXJrYSBzIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiYlxcdTAwZmFya2Egc28gc2lsblxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibWllcm5hIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2lsblxcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInBydWRrXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiYlxcdTAwZmFya2Egc28gc2xhYlxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiYlxcdTAwZmFya2EgcyBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImJcXHUwMGZhcmthIHNvIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInNsYWJcXHUwMGU5IHBvcFxcdTAxNTVjaGFuaWVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBvcFxcdTAxNTVjaGFuaWVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IHBvcFxcdTAxNTVjaGFuaWVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImplbW5cXHUwMGU5IG1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibWllcm55IGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInNpbG5cXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlXFx1MDEzZW1pIHNpbG5cXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJcXHUwMGU5bW55IGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIm1yem5cXHUwMGZhY2kgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwic2xhYlxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJzaWxuXFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwic2xhYlxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJzaWxuXFx1MDBlOSBzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiZFxcdTAwZTFcXHUwMTdlXFx1MDEwZiBzbyBzbmVob21cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuZWhvdlxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImhtbGFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImR5bVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwib3BhclwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwicGllc2tvdlxcdTAwZTlcXC9wcmFcXHUwMTYxblxcdTAwZTkgdlxcdTAwZWRyeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiaG1sYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzblxcdTAwZTEgb2Jsb2hhXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJ0YWttZXIgamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInBvbG9qYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwib2JsYVxcdTAxMGRub1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiemFtcmFcXHUwMTBkZW5cXHUwMGU5XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9yXFx1MDBmYWNvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZXRlcm5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJrcnVwb2JpdGllXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJOYXN0YXZlbmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJCZXp2ZXRyaWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlNsYWJcXHUwMGZkIHZcXHUwMGUxbm9rXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJKZW1uXFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlN0cmVkblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTBjZXJzdHZcXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU2lsblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJTaWxuXFx1MDBmZCB2aWV0b3IsIHRha21lciB2XFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNpbG5cXHUwMGUxIHZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJCXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiTmlcXHUwMTBkaXZcXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJpa1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJodVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkh1bmdhcmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInZpaGFyIGVueWhlIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidmloYXIgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ2aWhhciBoZXZlcyBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImVueWhlIHppdmF0YXJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZXZlcyB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZHVydmEgdmloYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInZpaGFyIGVueWhlIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ2aWhhciBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidmloYXIgZXJcXHUwMTUxcyBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwic3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJlbnloZSBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImtcXHUwMGY2emVwZXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZXZlcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm5hZ3lvbiBoZXZlcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJcXHUwMGU5bSBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTAwZjNub3MgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSB6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwielxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImVueWhlIGhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcImhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImVyXFx1MDE1MXMgaGF2YXpcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiaGF2YXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJoXFx1MDBmM3pcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJneWVuZ2Uga1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiaG9tb2t2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJ0aXN6dGEgXFx1MDBlOWdib2x0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJrZXZcXHUwMGU5cyBmZWxoXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic3pcXHUwMGYzcnZcXHUwMGUxbnlvcyBmZWxoXFx1MDE1MXpldFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiZXJcXHUwMTUxcyBmZWxoXFx1MDE1MXpldFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiYm9yXFx1MDBmYXMgXFx1MDBlOWdib2x0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRcXHUwMGYzXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0clxcdTAwZjNwdXNpIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiaFxcdTAxNzF2XFx1MDBmNnNcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImZvcnJcXHUwMGYzXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzemVsZXNcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImpcXHUwMGU5Z2VzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiTnl1Z29kdFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ3NlbmRlc1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiRW55aGUgc3plbGxcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJGaW5vbSBzemVsbFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIktcXHUwMGY2emVwZXMgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDBjOWxcXHUwMGU5bmsgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiRXJcXHUwMTUxcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJFclxcdTAxNTFzLCBtXFx1MDBlMXIgdmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWaWhhcm9zIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIkVyXFx1MDE1MXNlbiB2aWhhcm9zIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN6XFx1MDBlOWx2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVG9tYm9sXFx1MDBmMyBzelxcdTAwZTlsdmloYXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpa1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJjYVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJUZW1wZXN0YSBhbWIgcGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiVGVtcGVzdGEgYW1iIHBsdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJUZW1wZXN0YSBhbWIgcGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiVGVtcGVzdGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlRlbXBlc3RhIGZvcnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJUZW1wZXN0YSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW0gc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiVGVtcGVzdGEgYW1iIHBsdWdpblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiVGVtcGVzdGEgYW1iIG1vbHQgcGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJQbHVnaW0gc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiUGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJQbHVnaW0gaW50ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJQbHVnaW0gc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiUGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJQbHVnaW0gaW50ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJQbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiUGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJQbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJQbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiUGx1amEgbW9sdCBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJQbHVqYSBleHRyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJQbHVqYSBnbGFcXHUwMGU3YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJQbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJQbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJQbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJQbHVqYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIk5ldmFkYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJOZXZhZGFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJBaWd1YW5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwiUGx1amEgZCdhaWd1YW5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwiUGx1Z2ltIGkgbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJQbHVqYSBpIG5ldVwiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwiTmV2YWRhIHN1YXVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIk5ldmFkYVwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiTmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIkJvaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJGdW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkJvaXJpbmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlNvcnJhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJCb2lyYVwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwiU29ycmFcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcIlBvbHNcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcIkNlbmRyYSB2b2xjXFx1MDBlMG5pY2FcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcIlhcXHUwMGUwZmVjXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJDZWwgbmV0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJMbGV1Z2VyYW1lbnQgZW5udXZvbGF0XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJOXFx1MDBmYXZvbHMgZGlzcGVyc29zXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJOdXZvbG9zaXRhdCB2YXJpYWJsZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiRW5udXZvbGF0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUZW1wZXN0YSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVyYWNcXHUwMGUwXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJGcmVkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJDYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiVmVudFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiUGVkcmFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbWF0XCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCcmlzYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzYSBhZ3JhZGFibGVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyaXNhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYSBmcmVzY2FcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkJyaXNjYSBmb3JhXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50IGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIHNldmVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGEgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFjXFx1MDBlMFwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaHJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDcm9hdGlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIHNsYWJvbSBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIGpha29tIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJzbGFiYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiamFrYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9ya2Fuc2thIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiZ3JtbGphdmluc2thIG9sdWphIHNhIHNsYWJvbSByb3N1bGpvbVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzYSBqYWtvbSByb3N1bGpvbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwicm9zdWxqYSBzbGFib2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInJvc3VsamFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInJvc3VsamEgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBzbGFib2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJwbGp1c2tvdmkgaSByb3N1bGphXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJyb3N1bGphIHMgamFraW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInJvc3VsamEgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwidW1qZXJlbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwia2lcXHUwMTYxYSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidnJsbyBqYWthIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImVrc3RyZW1uYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJsZWRlbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGxqdXNhayBzbGFib2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInBsanVzYWtcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInBsanVzYWsgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIm9sdWpuYSBraVxcdTAxNjFhIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInNsYWJpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJndXN0aSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInN1c25qZVxcdTAxN2VpY2FcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInN1c25qZVxcdTAxN2VpY2EgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYmEga2lcXHUwMTYxYSBpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwia2lcXHUwMTYxYSBpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwic25pamVnIHMgcG92cmVtZW5pbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25pamVnIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcInNuaWplZyBzIGpha2ltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzdW1hZ2xpY2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImRpbVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiaXptYWdsaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJrb3ZpdGxhY2kgcGlqZXNrYSBpbGkgcHJhXFx1MDE2MWluZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibWFnbGFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInBpamVzYWtcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcInByYVxcdTAxNjFpbmFcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInZ1bGthbnNraSBwZXBlb1wiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiemFwdXNpIHZqZXRyYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJ2ZWRyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYmxhZ2EgbmFvYmxha2FcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInJhXFx1MDE2MXRya2FuaSBvYmxhY2lcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImlzcHJla2lkYW5pIG9ibGFjaVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwib2JsYVxcdTAxMGRub1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcHNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImhsYWRub1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwidnJ1XFx1MDEwN2VcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZqZXRyb3ZpdG9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcInR1XFx1MDEwZGFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwibGFob3JcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcInBvdmpldGFyYWNcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcInNsYWIgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJ1bWplcmVuIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwidW1qZXJlbm8gamFrIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiamFrIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDE3ZWVzdG9rIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwib2x1am5pIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiamFrIG9sdWpuaSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIm9ya2Fuc2tpIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiamFrIG9ya2Fuc2tpIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwib3JrYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImJsYW5rXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2F0YWxhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjAuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBjb25zdCB3aW5kU3BlZWQgPSB7XHJcbiAgICBcImVuXCI6e1xyXG4gICAgICAgIFwiU2V0dGluZ3NcIjoge1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFswLjAsIDAuM10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjAtMSAgIFNtb2tlIHJpc2VzIHN0cmFpZ2h0IHVwXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQ2FsbVwiOiB7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzAuMywgMS42XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMS0zIE9uZSBjYW4gc2VlIGRvd253aW5kIG9mIHRoZSBzbW9rZSBkcmlmdFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkxpZ2h0IGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMS42LCAzLjNdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0LTYgT25lIGNhbiBmZWVsIHRoZSB3aW5kLiBUaGUgbGVhdmVzIG9uIHRoZSB0cmVlcyBtb3ZlLCB0aGUgd2luZCBjYW4gbGlmdCBzbWFsbCBzdHJlYW1lcnMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiR2VudGxlIEJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMy40LCA1LjVdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI3LTEwIExlYXZlcyBhbmQgdHdpZ3MgbW92ZS4gV2luZCBleHRlbmRzIGxpZ2h0IGZsYWcgYW5kIHBlbm5hbnRzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiTW9kZXJhdGUgYnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFs1LjUsIDguMF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjExLTE2ICAgVGhlIHdpbmQgcmFpc2VzIGR1c3QgYW5kIGxvb3NlIHBhcGVycywgdG91Y2hlcyBvbiB0aGUgdHdpZ3MgYW5kIHNtYWxsIGJyYW5jaGVzLCBzdHJldGNoZXMgbGFyZ2VyIGZsYWdzIGFuZCBwZW5uYW50c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkZyZXNoIEJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbOC4wLCAxMC44XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMTctMjEgICBTbWFsbCB0cmVlcyBpbiBsZWFmIGJlZ2luIHRvIHN3YXkuIFRoZSB3YXRlciBiZWdpbnMgbGl0dGxlIHdhdmVzIHRvIHBlYWtcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJTdHJvbmcgYnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxMC44LCAxMy45XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjItMjcgICBMYXJnZSBicmFuY2hlcyBhbmQgc21hbGxlciB0cmliZXMgbW92ZXMuIFRoZSB3aGl6IG9mIHRlbGVwaG9uZSBsaW5lcy4gSXQgaXMgZGlmZmljdWx0IHRvIHVzZSB0aGUgdW1icmVsbGEuIEEgcmVzaXN0YW5jZSB3aGVuIHJ1bm5pbmcuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEzLjksIDE3LjJdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIyOC0zMyAgIFdob2xlIHRyZWVzIGluIG1vdGlvbi4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkdhbGVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzE3LjIsIDIwLjddLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIzNC00MCAgIFRoZSB3aW5kIGJyZWFrIHR3aWdzIG9mIHRyZWVzLiBJdCBpcyBoYXJkIHRvIGdvIGFnYWluc3QgdGhlIHdpbmQuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU2V2ZXJlIEdhbGVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzIwLjgsIDI0LjVdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0MS00NyAgIEFsbCBsYXJnZSB0cmVlcyBzd2F5aW5nIGFuZCB0aHJvd3MuIFRpbGVzIGNhbiBibG93IGRvd24uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU3Rvcm1cIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzI0LjUsIDI4LjVdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0OC01NSAgIFJhcmUgaW5sYW5kLiBUcmVlcyB1cHJvb3RlZC4gU2VyaW91cyBkYW1hZ2UgdG8gaG91c2VzLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlZpb2xlbnQgU3Rvcm1cIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzI4LjUsIDMyLjddLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI1Ni02MyAgIE9jY3VycyByYXJlbHkgYW5kIGlzIGZvbGxvd2VkIGJ5IGRlc3RydWN0aW9uLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkh1cnJpY2FuZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMzIuNywgNjRdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCJPY2N1cnMgdmVyeSByYXJlbHkuIFVudXN1YWxseSBzZXZlcmUgZGFtYWdlLlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Oy8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIxLjEwLjIwMTYuXHJcbiAqL1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAxMy4xMC4yMDE2LlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdG9yV2lkZ2V0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSAndGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtJztcclxuICAgICAgICB0aGlzLnNjcmlwdEQzU1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy9saWJzL2QzLm1pbi5qc2A7XHJcbiAgICAgICAgdGhpcy5zY3JpcHRTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL3dlYXRoZXItd2lkZ2V0LWdlbmVyYXRvci5qc2A7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgICAgICAgIC8vINCf0LXRgNCy0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgICAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtbGVmdC1tZW51X19oZWFkZXInKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbnVtYmVyJyksXHJcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX21lYW5zJyksXHJcbiAgICAgICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX193aW5kJyksXHJcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19pbWcnKSxcclxuICAgICAgICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FsZW5kYXJfX2l0ZW0nKSxcclxuICAgICAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKSxcclxuICAgICAgICAgICAgLy8g0JLRgtC+0YDQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICAgICAgICBjaXR5TmFtZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX3RpdGxlJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3RlbXBlcmF0dXJlJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlRmVlbHM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19mZWVscycpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZU1pbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHQtY2FyZF9fdGVtcGVyYXR1cmUtbWluJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWF4OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1tYXgnKSxcclxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub24yOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X19kZXNjcmlwdGlvbicpLFxyXG4gICAgICAgICAgICB3aW5kU3BlZWQyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fd2luZC1zcGVlZCcpLFxyXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXIyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faWNvbicpLFxyXG4gICAgICAgICAgICBodW1pZGl0eTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2h1bWlkaXR5JyksXHJcbiAgICAgICAgICAgIHByZXNzdXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fcHJlc3N1cmUnKSxcclxuICAgICAgICAgICAgZGF0ZVJlcG9ydDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fZGF0ZScpLFxyXG4gICAgICAgICAgICBhcGlLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JyksXHJcbiAgICAgICAgICAgIGVycm9yS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3Ita2V5JyksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uQVBJa2V5KCk7XHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcblxyXG4gICAgICAgIC8vINC+0LHRitC10LrRgi3QutCw0YDRgtCwINC00LvRjyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjRjyDQstGB0LXRhSDQstC40LTQttC10YLQvtCyINGBINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsFxyXG4gICAgICAgIHRoaXMubWFwV2lkZ2V0cyA9IHtcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg2KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDcpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA4LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTUsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTgsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDI0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGlvbkFQSWtleSgpIHtcclxuICAgICAgICBsZXQgdmFsaWRhdGlvbkFQSSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCB1cmwgPSBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZm9yZWNhc3QvZGFpbHk/aWQ9NTI0OTAxJnVuaXRzPW1ldHJpYyZjbnQ9OCZhcHBpZD0ke3RoaXMuY29udHJvbHNXaWRnZXQuYXBpS2V5LnZhbHVlfWA7XHJcbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gYWNjZXB0JztcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0LWZvcm0tLWVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuaW5uZXJUZXh0ID0gJ1ZhbGlkYXRpb24gZXJyb3InO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXQtZm9ybS0tZ29vZCcpO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQstCw0LvQuNC00LDRhtC40LggJHtlfWApO1xyXG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBlcnJvcic7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1nb29kJyk7XHJcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5hZGQoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcclxuICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCA9IHZhbGlkYXRpb25BUEkuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzV2lkZ2V0LmFwaUtleS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kKTtcclxuICAgICAgICAvL3RoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoaWQpIHsgICAgICAgIFxyXG4gICAgICAgIGlmKGlkICYmICh0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWQgfHwgdGhpcy5wYXJhbXNXaWRnZXQuY2l0eU5hbWUpICYmIHRoaXMucGFyYW1zV2lkZ2V0LmFwcGlkKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlID0gJyc7XHJcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGlkKSA9PT0gMSB8fCBwYXJzZUludChpZCkgPT09IDExIHx8IHBhcnNlSW50KGlkKSA9PT0gMjEpIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBgPHNjcmlwdCBzcmM9J2h0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy9kMy5taW4uanMnPjwvc2NyaXB0PmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGAke2NvZGV9PGRpdiBpZD0nb3BlbndlYXRoZXJtYXAtd2lkZ2V0Jz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvamF2YXNjcmlwdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAke2lkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eWlkOiAke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGlkOiAnJHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZC5yZXBsYWNlKGAyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2N2AsJycpfScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0JyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gJ2h0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJbml0aWFsU3RhdGVGb3JtKGNpdHlJZD01MjQ5MDEsIGNpdHlOYW1lPSdNb3Njb3cnKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgICAgICAgICBjaXR5SWQ6IGNpdHlJZCxcclxuICAgICAgICAgICAgY2l0eU5hbWU6IGNpdHlOYW1lLFxyXG4gICAgICAgICAgICBsYW5nOiAnZW4nLFxyXG4gICAgICAgICAgICBhcHBpZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKS52YWx1ZSB8fCAgJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxyXG4gICAgICAgICAgICB0ZXh0VW5pdFRlbXA6IFN0cmluZy5mcm9tQ29kZVBvaW50KDB4MDBCMCksICAvLyAyNDhcclxuICAgICAgICAgICAgYmFzZVVSTDogdGhpcy5iYXNlVVJMLFxyXG4gICAgICAgICAgICB1cmxEb21haW46ICdodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZycsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxyXG4gICAgICAgIHRoaXMuY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcblxyXG4gICAgICAgIHRoaXMudXJscyA9IHtcclxuICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXI/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICBwYXJhbXNVcmxGb3JlRGFpbHk6IGAke3RoaXMucGFyYW1zV2lkZ2V0LnVybERvbWFpbn0vZGF0YS8yLjUvZm9yZWNhc3QvZGFpbHk/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IGAke3RoaXMuYmFzZVVSTH0vZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvbmAsXHJcbiAgICAgICAgd2luZERpcmVjdGlvbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbmAsXHJcbiAgICAgICAgY2xvdWRzOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvY2xvdWRzLWRhdGEuanNvbmAsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGAke3RoaXMuYmFzZVVSTH0vZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uYCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuXHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcclxuXHJcbi8qKlxyXG4g0JPRgNCw0YTQuNC6INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0Lgg0L/QvtCz0L7QtNGLXHJcbiBAY2xhc3MgR3JhcGhpY1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpYyBleHRlbmRzIEN1c3RvbURhdGUge1xyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uID0gZDMubGluZSgpXHJcbiAgICAueCgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC54O1xyXG4gICAgfSlcclxuICAgIC55KChkKSA9PiB7XHJcbiAgICAgIHJldHVybiBkLnk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDQtNCw0L3QvdGL0YUg0LIg0LzQsNGB0YHQuNCyINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcclxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICovXHJcbiAgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBjb25zdCByYXdEYXRhID0gW107XHJcblxyXG4gICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIHJhd0RhdGEucHVzaCh7IHg6IGksIGRhdGU6IGksIG1heFQ6IGVsZW0ubWF4LCBtaW5UOiBlbGVtLm1pbiB9KTtcclxuICAgICAgaSArPSAxOyAvLyDQodC80LXRidC10L3QuNC1INC/0L4g0L7RgdC4IFhcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByYXdEYXRhO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgbWFrZVNWRygpIHtcclxuICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5wYXJhbXMuaWQpLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMnKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnBhcmFtcy53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmZmZmJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xyXG4gICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cclxuICAqL1xyXG4gIGdldE1pbk1heERhdGUocmF3RGF0YSkge1xyXG4gICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtYXhEYXRlOiAwLFxyXG4gICAgICBtaW5EYXRlOiAxMDAwMCxcclxuICAgIH07XHJcblxyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5taW5EYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgKiBbZ2V0TWluTWF4RGF0ZVRlbXBlcmF0dXJlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcblxyXG4gIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMTAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5taW5UKSB7XHJcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLm1pblQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ubWF4VCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSkge1xyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWluOiAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIG1ha2VBeGVzWFkocmF3RGF0YSwgcGFyYW1zKSB7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICBjb25zdCB4QXhpc0xlbmd0aCA9IHBhcmFtcy53aWR0aCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBZID0g0LLRi9GB0L7RgtCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YMg0Lgg0YHQvdC40LfRg1xyXG4gICAgY29uc3QgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gKDIgKiBwYXJhbXMubWFyZ2luKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcclxuICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cclxuICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAqL1xyXG4gIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXggKyA1LCBtaW4gLSA1XSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIG1pblQ6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcclxuICB9XHJcblxyXG4gIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbikge1xyXG4gICAgY29uc3QgeyBtYXhEYXRlLCBtaW5EYXRlIH0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgIGNvbnN0IHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuXHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sXHJcbiAgICAgICAgaHVtaWRpdHk6IHNjYWxlWShlbGVtLmh1bWlkaXR5KSArIG1hcmdpbixcclxuICAgICAgICByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luLFxyXG4gICAgICAgIGNvbG9yOiBlbGVtLmNvbG9yLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XHJcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKSB7XHJcbiAgICBjb25zdCBhcnJQb2x5bGluZSA9IFtdO1xyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSB9LFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICB4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIHk6IHNjYWxlWShkYXRhW2RhdGEubGVuZ3RoIC0gMV0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGRyYXdQb2x5bGluZShzdmcsIGRhdGEpIHtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcclxuXHJcbiAgICBzdmcuYXBwZW5kKCdnJykuYXBwZW5kKCdwYXRoJylcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQtNC/0LjRgdC10Lkg0YEg0L/QvtC60LDQt9Cw0YLQtdC70Y/QvNC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0L3QsCDQvtGB0Y/RhVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKi9cclxuICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpIHtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSkgPT4ge1xyXG4gICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5tYXhUIC0gMikgLSAocGFyYW1zLm9mZnNldFggLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1heH3CsGApO1xyXG5cclxuICAgICAgc3ZnLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgIC5hdHRyKCd4JywgZWxlbS54KVxyXG4gICAgICAuYXR0cigneScsIChlbGVtLm1pblQgKyA3KSArIChwYXJhbXMub2Zmc2V0WSAvIDIpKVxyXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnN0eWxlKCdmaWxsJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnRleHQoYCR7cGFyYW1zLmRhdGFbaXRlbV0ubWlufcKwYCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICBjb25zdCB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH0gPSB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgdGhpcy5kcmF3UG9seWxpbmUoc3ZnLCBwb2x5bGluZSk7XHJcbiAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICAvLyB0aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxyZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHIgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcm0tbGFuZGluZy13aWRnZXQnKTtcciAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpO1xyICAgIGNvbnN0IHBvcHVwQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtY2xvc2UnKTtcciAgICBjb25zdCBjb250ZW50SlNHZW5lcmF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWNvZGUtZ2VuZXJhdGUnKTtcciAgICBjb25zdCBjb3B5Q29udGVudEpTQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5LWpzLWNvZGUnKTtcciAgICBjb25zdCBhcGlLZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpO1xyXHIgICAgLy8g0KTQuNC60YHQuNGA0YPQtdC8INC60LvQuNC60Lgg0L3QsCDRhNC+0YDQvNC1LCDQuCDQvtGC0LrRgNGL0LLQsNC10LwgcG9wdXAg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDXHIgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIGlmKGV2ZW50LnRhcmdldC5pZCAmJiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpKSB7XHIgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcciAgICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0od2luZG93LmNpdHlJZCwgd2luZG93LmNpdHlOYW1lKTsgICAgICAgICBcciAgICAgICAgICAgIFxyICAgICAgICAgICAgXHIgICAgICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gZ2VuZXJhdGVXaWRnZXQuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0Lm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnaWQnXSk7XHIgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKSB7XHIgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLXZpc2libGUnKTtcciAgICAgICAgICAgICAgICBzd2l0Y2goZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnc2NoZW1hJ10pIHtcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmx1ZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdub25lJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICBcciAgICAgICAgfVxyICAgIH0pO1xyXHIgICAgLy8g0JfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60YDQtdGB0YLQuNC6XHIgICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKVxyICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgfSk7XHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcciAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgLy92YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyICAgICAgICAvL3JhbmdlLnNlbGVjdE5vZGUoY29udGVudEpTR2VuZXJhdGlvbik7XHIgICAgICAgIC8vd2luZG93LmdldFNlbGVjdGlvbigpLmFkZFJhbmdlKHJhbmdlKTtcciAgICAgICAgY29udGVudEpTR2VuZXJhdGlvbi5zZWxlY3QoKTtcclxyICAgICAgICB0cnl7XHIgICAgICAgICAgICBjb25zdCB0eHRDb3B5ID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcciAgICAgICAgICAgIHZhciBtc2cgPSB0eHRDb3B5ID8gJ3N1Y2Nlc3NmdWwnIDogJ3Vuc3VjY2Vzc2Z1bCc7XHIgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29weSBlbWFpbCBjb21tYW5kIHdhcyAnICsgbXNnKTtcciAgICAgICAgfVxyICAgICAgICBjYXRjaChlKXtcciAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQntGI0LjQsdC60LAg0LrQvtC/0LjRgNC+0LLQsNC90LjRjyAke2UuZXJyTG9nVG9Db25zb2xlfWApO1xyICAgICAgICB9XHJcciAgICAgICAgLy8g0KHQvdGP0YLQuNC1INCy0YvQtNC10LvQtdC90LjRjyAtINCS0J3QmNCc0JDQndCY0JU6INCy0Ysg0LTQvtC70LbQvdGLINC40YHQv9C+0LvRjNC30L7QstCw0YLRjFxyICAgICAgICAvLyByZW1vdmVSYW5nZShyYW5nZSkg0LrQvtCz0LTQsCDRjdGC0L4g0LLQvtC30LzQvtC20L3QvlxyICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHIgICAgfSk7XHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5kaXNhYmxlZCA9ICFkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQoJ2NvcHknKTtccn0pO1xyXHIiLCIvLyDQnNC+0LTRg9C70Ywg0LTQuNGB0L/QtdGC0YfQtdGAINC00LvRjyDQvtGC0YDQuNGB0L7QstC60Lgg0LHQsNC90L3QtdGA0YDQvtCyINC90LAg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1XHJcbmltcG9ydCBDaXRpZXMgZnJvbSAnLi9jaXRpZXMnO1xyXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cclxuICAgIC8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcclxuICAgIGNvbnN0IGNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xyXG4gICAgY29uc3QgY2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdGllcycpO1xyXG4gICAgY29uc3Qgc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG5cclxuICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICBvYmpDaXRpZXMuZ2V0Q2l0aWVzKCk7XHJcblxyXG5cclxuICAgIHNlYXJjaENpdHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuXHJcbmltcG9ydCBDdXN0b21EYXRlIGZyb20gJy4vY3VzdG9tLWRhdGUnO1xyXG5pbXBvcnQgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMtZDNqcyc7XHJcbmltcG9ydCAqIGFzIG5hdHVyYWxQaGVub21lbm9uICBmcm9tICcuL2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEnO1xyXG5pbXBvcnQgKiBhcyB3aW5kU3BlZWQgZnJvbSAnLi9kYXRhL3dpbmQtc3BlZWQtZGF0YSc7XHJcbmltcG9ydCAqIGFzIHdpbmREaXJlY3Rpb24gZnJvbSAnLi9kYXRhL3dpbmQtc3BlZWQtZGF0YSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWF0aGVyV2lkZ2V0IGV4dGVuZHMgQ3VzdG9tRGF0ZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcywgY29udHJvbHMsIHVybHMpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcclxuICAgIHRoaXMudXJscyA9IHVybHM7XHJcblxyXG4gICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcclxuICAgIHRoaXMud2VhdGhlciA9IHtcclxuICAgICAgZnJvbUFQSToge1xyXG4gICAgICAgIGNvb3JkOiB7XHJcbiAgICAgICAgICBsb246ICcwJyxcclxuICAgICAgICAgIGxhdDogJzAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2VhdGhlcjogW3tcclxuICAgICAgICAgIGlkOiAnICcsXHJcbiAgICAgICAgICBtYWluOiAnICcsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJyAnLFxyXG4gICAgICAgICAgaWNvbjogJyAnLFxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIGJhc2U6ICcgJyxcclxuICAgICAgICBtYWluOiB7XHJcbiAgICAgICAgICB0ZW1wOiAwLFxyXG4gICAgICAgICAgcHJlc3N1cmU6ICcgJyxcclxuICAgICAgICAgIGh1bWlkaXR5OiAnICcsXHJcbiAgICAgICAgICB0ZW1wX21pbjogJyAnLFxyXG4gICAgICAgICAgdGVtcF9tYXg6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdpbmQ6IHtcclxuICAgICAgICAgIHNwZWVkOiAwLFxyXG4gICAgICAgICAgZGVnOiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByYWluOiB7fSxcclxuICAgICAgICBjbG91ZHM6IHtcclxuICAgICAgICAgIGFsbDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZHQ6ICcnLFxyXG4gICAgICAgIHN5czoge1xyXG4gICAgICAgICAgdHlwZTogJyAnLFxyXG4gICAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICAgIG1lc3NhZ2U6ICcgJyxcclxuICAgICAgICAgIGNvdW50cnk6ICcgJyxcclxuICAgICAgICAgIHN1bnJpc2U6ICcgJyxcclxuICAgICAgICAgIHN1bnNldDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICBuYW1lOiAnVW5kZWZpbmVkJyxcclxuICAgICAgICBjb2Q6ICcgJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgKiBAcGFyYW0gdXJsXHJcbiAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICovXHJcbiAgaHR0cEdldCh1cmwpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCX0LDQv9GA0L7RgSDQuiBBUEkg0LTQu9GPINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YUg0YLQtdC60YPRidC10Lkg0L/QvtCz0L7QtNGLXHJcbiAgICovXHJcbiAgZ2V0V2VhdGhlckZyb21BcGkoKSB7XHJcbiAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gbmF0dXJhbFBoZW5vbWVub24ubmF0dXJhbFBoZW5vbWVub25bdGhpcy5wYXJhbXMubGFuZ10uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHdpbmRTcGVlZC53aW5kU3BlZWRbdGhpcy5wYXJhbXMubGFuZ107XHJcbiAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INGB0LXQu9C10LrRgtC+0YAg0L/QviDQt9C90LDRh9C10L3QuNGOINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQsiBKU09OXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IEpTT05cclxuICAgKiBAcGFyYW0ge3ZhcmlhbnR9IGVsZW1lbnQg0JfQvdCw0YfQtdC90LjQtSDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCwg0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINC00LvRjyDQv9C+0LjRgdC60LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWxlbWVudE5hbWUg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwLNC00LvRjyDQv9C+0LjRgdC60LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICogQHJldHVybiB7c3RyaW5nfSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgKi9cclxuICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdID09PSAnb2JqZWN0JyAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwINGBINC00LLRg9C80Y8g0Y3Qu9C10LzQtdC90YLQsNC80Lgg0LIgSlNPTlxyXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnROYW1lMiAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZTJdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgcGFyc2VEYXRhRnJvbVNlcnZlcigpIHtcclxuICAgIGNvbnN0IHdlYXRoZXIgPSB0aGlzLndlYXRoZXI7XHJcblxyXG4gICAgaWYgKHdlYXRoZXIuZnJvbUFQSS5uYW1lID09PSAnVW5kZWZpbmVkJyB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSAnNDA0Jykge1xyXG4gICAgICBjb25zb2xlLmxvZygn0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7XHJcbiAgICAgIGNsb3VkaW5lc3M6ICcgJyxcclxuICAgICAgZHQ6ICcgJyxcclxuICAgICAgY2l0eU5hbWU6ICcgJyxcclxuICAgICAgaWNvbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZTogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1BeDogJyAnLFxyXG4gICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICBodW1pZGl0eTogJyAnLFxyXG4gICAgICBzdW5yaXNlOiAnICcsXHJcbiAgICAgIHN1bnNldDogJyAnLFxyXG4gICAgICBjb29yZDogJyAnLFxyXG4gICAgICB3aW5kOiAnICcsXHJcbiAgICAgIHdlYXRoZXI6ICcgJyxcclxuICAgIH07XHJcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSwgMTApICsgMDtcclxuICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmUgPSB0ZW1wZXJhdHVyZTsgLy8gYCR7dGVtcCA+IDAgPyBgKyR7dGVtcH1gIDogdGVtcH1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNaW4gPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21pbi50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNYXggPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21heC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgaWYgKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pIHtcclxuICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIud2luZFNwZWVkKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIud2luZFNwZWVkLCB3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpLCAnc3BlZWRfaW50ZXJ2YWwnKX1gO1xyXG4gICAgICBtZXRhZGF0YS53aW5kU3BlZWQyID0gYCR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zYDtcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLndpbmREaXJlY3Rpb24pIHtcclxuICAgICAgbWV0YWRhdGEud2luZERpcmVjdGlvbiA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl0sIFwiZGVnX2ludGVydmFsXCIpfWBcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLmNsb3Vkcykge1xyXG4gICAgICBtZXRhZGF0YS5jbG91ZHMgPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyLmNsb3Vkcywgd2VhdGhlci5mcm9tQVBJLmNsb3Vkcy5hbGwsICdtaW4nLCAnbWF4Jyl9YDtcclxuICAgIH1cclxuXHJcbiAgICBtZXRhZGF0YS5odW1pZGl0eSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLmh1bWlkaXR5fSVgO1xyXG4gICAgbWV0YWRhdGEucHJlc3N1cmUgPSAgYCR7d2VhdGhlcltcImZyb21BUElcIl1bXCJtYWluXCJdW1wicHJlc3N1cmVcIl19IG1iYDtcclxuICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pY29ufWA7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyV2lkZ2V0KG1ldGFkYXRhKSB7XHJcbiAgICAvLyDQntC+0YLRgNC40YHQvtCy0LrQsCDQv9C10YDQstGL0YUg0YfQtdGC0YvRgNC10YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuIGNsYXNzPSd3ZWF0aGVyLWxlZnQtY2FyZF9fZGVncmVlJz4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDQv9GP0YLQuCDQv9C+0YHQu9C10LTQvdC40YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHMuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHNbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW5bZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heCkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXhbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZDIgJiYgbWV0YWRhdGEud2luZERpcmVjdGlvbikge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWQyW2VsZW1dLmlubmVyVGV4dCA9IGAke21ldGFkYXRhLndpbmRTcGVlZDJ9ICR7bWV0YWRhdGEud2luZERpcmVjdGlvbn1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLmh1bWlkaXR5KSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmh1bWlkaXR5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuaHVtaWRpdHkuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMuaHVtaWRpdHlbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEuaHVtaWRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLnByZXNzdXJlKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnByZXNzdXJlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMucHJlc3N1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMucHJlc3N1cmVbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEucHJlc3N1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDQn9GA0L7Qv9C40YHRi9Cy0LDQtdC8INGC0LXQutGD0YnRg9GOINC00LDRgtGDINCyINCy0LjQtNC20LXRgtGLXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5kYXRlUmVwb3J0KSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnQuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnRbZWxlbV0uaW5uZXJUZXh0ID0gdGhpcy5nZXRUaW1lRGF0ZUhITU1Nb250aERheSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSkge1xyXG4gICAgICB0aGlzLnByZXBhcmVEYXRhRm9yR3JhcGhpYygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJlcGFyZURhdGFGb3JHcmFwaGljKCkge1xyXG4gICAgY29uc3QgYXJyID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3QpIHtcclxuICAgICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpKTtcclxuICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgIG1pbjogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWluKSxcclxuICAgICAgICBtYXg6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXHJcbiAgICAgICAgZGF5OiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgaWNvbjogdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS53ZWF0aGVyWzBdLmljb24sXHJcbiAgICAgICAgZGF0ZTogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XHJcbiAgICogQHBhcmFtIGRhdGFcclxuICAgKi9cclxuICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMTBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDIwXS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbiwgY29sb3IgPSBmYWxzZSkge1xyXG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XHJcbiAgICBjb25zdCBtYXBJY29ucyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBpZiAoIWNvbG9yKSB7XHJcbiAgICAgIC8vXHJcbiAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDJkJywgJzAyZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDRkJywgJzA0ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDVkJywgJzA1ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDdkJywgJzA3ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDhkJywgJzA4ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTBkJywgJzEwZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTFkJywgJzExZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XHJcbiAgICAgIC8vINCd0L7Rh9C90YvQtVxyXG4gICAgICBtYXBJY29ucy5zZXQoJzAxbicsICcwMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA1bicsICcwNWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA2bicsICcwNmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA4bicsICcwOGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA5bicsICcwOWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzExbicsICcxMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEzbicsICcxM2RidycpO1xyXG5cclxuICAgICAgaWYgKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXJhbXMuYmFzZVVSTH0vaW1nL3dpZGdldHMvJHttYXBJY29ucy5nZXQobmFtZUljb24pfS5wbmdgO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bmFtZUljb259LnBuZ2A7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgKi9cclxuICBkcmF3R3JhcGhpY0QzKGRhdGEpIHtcclxuICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpO1xyXG5cclxuICAgIC8vINCe0YfQuNGB0YLQutCwINC60L7QvdGC0LXQudC90LXRgNC+0LIg0LTQu9GPINCz0YDQsNGE0LjQutC+0LIgICAgXHJcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpO1xyXG4gICAgY29uc3Qgc3ZnMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMScpO1xyXG4gICAgY29uc3Qgc3ZnMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMicpO1xyXG5cclxuICAgIGlmKHN2Zy5xdWVyeVNlbGVjdG9yKCdzdmcnKSkge1xyXG4gICAgICBzdmcucmVtb3ZlQ2hpbGQoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzEucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcclxuICAgICAgc3ZnMS5yZW1vdmVDaGlsZChzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xyXG4gICAgICBzdmcyLnJlbW92ZUNoaWxkKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBpZDogJyNncmFwaGljJyxcclxuICAgICAgZGF0YSxcclxuICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICB3aWR0aDogNDIwLFxyXG4gICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgY29sb3JQb2xpbHluZTogJyMzMzMnLFxyXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxyXG4gICAgICBmb250Q29sb3I6ICcjMzMzJyxcclxuICAgICAgc3Ryb2tlV2lkdGg6ICcxcHgnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgbGV0IG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcblxyXG4gICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMxJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNEREY3MzAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMyJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAqL1xyXG4gIGRyYXdHcmFwaGljKGFycikge1xyXG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGggPSA0NjU7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDYwMCwgMzAwKTtcclxuXHJcbiAgICBjb250ZXh0LmZvbnQgPSAnT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4JztcclxuXHJcbiAgICBsZXQgc3RlcCA9IDU1O1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3Qgem9vbSA9IDQ7XHJcbiAgICBjb25zdCBzdGVwWSA9IDY0O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0VXAgPSA1ODtcclxuICAgIGNvbnN0IHN0ZXBZVGV4dERvd24gPSA3NTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBzdGVwID0gNTU7XHJcbiAgICBpID0gMDtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgaSArPSAxO1xyXG4gICAgd2hpbGUgKGkgPCBhcnIubGVuZ3RoKSB7XHJcbiAgICAgIHN0ZXAgKz0gNTU7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzMzMyc7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
