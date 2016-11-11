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
            dateReport: document.querySelectorAll('.widget-right__date')
        };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjaXRpZXMuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXG5hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZGF0YVxcd2luZC1zcGVlZC1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHBvcHVwLmpzIiwiYXNzZXRzXFxqc1xcc2NyaXB0LmpzIiwiYXNzZXRzXFxqc1xcd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7cWpCQ0FBOzs7O0FBSUE7Ozs7QUFDQTs7Ozs7Ozs7SUFFcUIsTTtBQUVuQixrQkFBWSxRQUFaLEVBQXNCLFNBQXRCLEVBQWlDO0FBQUE7O0FBRS9CLFFBQU0saUJBQWlCLCtCQUF2QjtBQUNBLG1CQUFlLG1CQUFmOztBQUVBLFFBQUksQ0FBQyxTQUFTLEtBQWQsRUFBcUI7QUFDbkIsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBSyxRQUFMLEdBQWdCLFNBQVMsS0FBVCxDQUFlLE9BQWYsQ0FBdUIsUUFBdkIsRUFBZ0MsR0FBaEMsRUFBcUMsV0FBckMsRUFBaEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsYUFBYSxFQUE5QjtBQUNBLFNBQUssR0FBTCxrREFBd0QsS0FBSyxRQUE3RDs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQW5CO0FBQ0EsU0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLFlBQTdCO0FBQ0EsU0FBSyxXQUFMLENBQWlCLEtBQWpCLEdBQXlCLHVCQUF6Qjs7QUFFQSxRQUFNLFlBQVksNEJBQWtCLGVBQWUsWUFBakMsRUFBK0MsZUFBZSxjQUE5RCxFQUE4RSxlQUFlLElBQTdG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Q0EsY0FBUSxTQUFSLEdBQW9CLE1BQXBCO0FBQ0EsY0FBUSxNQUFSLENBQWUsT0FBTyxFQUF0QixFQUEyQixDQUFDLENBQUQsR0FBSyxJQUFJLENBQUosRUFBTyxHQUFaLEdBQWtCLElBQW5CLEdBQTJCLEtBQXJEO0FBQ0EsY0FBUSxTQUFSO0FBQ0EsY0FBUSxXQUFSLEdBQXNCLE1BQXRCO0FBQ0EsY0FBUSxNQUFSO0FBQ0EsY0FBUSxJQUFSO0FBQ0Q7Ozs2QkFFUTtBQUNQLFdBQUssaUJBQUw7QUFDRDs7Ozs7O2tCQTlla0IsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIxLjEwLjIwMTYuXHJcbiovXHJcblxyXG5pbXBvcnQgV2VhdGhlcldpZGdldCBmcm9tICcuL3dlYXRoZXItd2lkZ2V0JztcclxuaW1wb3J0IEdlbmVyYXRvcldpZGdldCBmcm9tICcuL2dlbmVyYXRvci13aWRnZXQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2l0aWVzIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lcikge1xyXG5cclxuICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybSgpO1xyXG5cclxuICAgIGlmICghY2l0eU5hbWUudmFsdWUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2l0eU5hbWUgPSBjaXR5TmFtZS52YWx1ZS5yZXBsYWNlKC8oXFxzKSsvZywnLScpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCAnJztcclxuICAgIHRoaXMudXJsID0gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvZmluZD9xPSR7dGhpcy5jaXR5TmFtZX0mdHlwZT1saWtlJnNvcnQ9cG9wdWxhdGlvbiZjbnQ9MzAmYXBwaWQ9YjFiMTVlODhmYTc5NzIyNTQxMjQyOWMxYzUwYzEyMmExYDtcclxuXHJcbiAgICB0aGlzLnNlbENpdHlTaWduID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGhpcy5zZWxDaXR5U2lnbi5pbm5lclRleHQgPSAnIHNlbGVjdGVkICc7XHJcbiAgICB0aGlzLnNlbENpdHlTaWduLmNsYXNzID0gJ3dpZGdldC1mb3JtX19zZWxlY3RlZCc7XHJcblxyXG4gICAgY29uc3Qgb2JqV2lkZ2V0ID0gbmV3IFdlYXRoZXJXaWRnZXQoZ2VuZXJhdGVXaWRnZXQucGFyYW1zV2lkZ2V0LCBnZW5lcmF0ZVdpZGdldC5jb250cm9sc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQudXJscyk7XHJcbiAgICBvYmpXaWRnZXQucmVuZGVyKCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q2l0aWVzKCkge1xyXG4gICAgaWYgKCF0aGlzLmNpdHlOYW1lKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybClcclxuICAgICAgLnRoZW4oXHJcbiAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoRGF0YShyZXNwb25zZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXRTZWFyY2hEYXRhKEpTT05vYmplY3QpIHtcclxuICAgIGlmICghSlNPTm9iamVjdC5saXN0Lmxlbmd0aCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnQ2l0eSBub3QgZm91bmQnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCj0LTQsNC70Y/QtdC8INGC0LDQsdC70LjRhtGDLCDQtdGB0LvQuCDQtdGB0YLRjFxyXG4gICAgY29uc3QgdGFibGVDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYmxlLWNpdGllcycpO1xyXG4gICAgaWYgKHRhYmxlQ2l0eSkge1xyXG4gICAgICB0YWJsZUNpdHkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YWJsZUNpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBodG1sID0gJyc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IEpTT05vYmplY3QubGlzdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBuYW1lID0gYCR7SlNPTm9iamVjdC5saXN0W2ldLm5hbWV9LCAke0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeX1gO1xyXG4gICAgICBjb25zdCBmbGFnID0gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1hZ2VzL2ZsYWdzLyR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5LnRvTG93ZXJDYXNlKCl9LnBuZ2A7XHJcbiAgICAgIGh0bWwgKz0gYDx0cj48dGQgY2xhc3M9XCJ3aWRnZXQtZm9ybV9faXRlbVwiPjxhIGhyZWY9XCIvY2l0eS8ke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIiBpZD1cIiR7SlNPTm9iamVjdC5saXN0W2ldLmlkfVwiIGNsYXNzPVwid2lkZ2V0LWZvcm1fX2xpbmtcIj4ke25hbWV9PC9hPjxpbWcgc3JjPVwiJHtmbGFnfVwiPjwvcD48L3RkPjwvdHI+YDtcclxuICAgIH1cclxuXHJcbiAgICBodG1sID0gYDx0YWJsZSBjbGFzcz1cInRhYmxlXCIgaWQ9XCJ0YWJsZS1jaXRpZXNcIj4ke2h0bWx9PC90YWJsZT5gO1xyXG4gICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICBjb25zdCB0YWJsZUNpdGllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YWJsZS1jaXRpZXMnKTtcclxuXHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICB0YWJsZUNpdGllcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAoJ0EnKS50b0xvd2VyQ2FzZSgpICYmIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dpZGdldC1mb3JtX19saW5rJykpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDaXR5ID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkQ2l0eScpO1xyXG4gICAgICAgIGlmICghc2VsZWN0ZWRDaXR5KSB7XHJcbiAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhhdC5zZWxDaXR5U2lnbiwgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyDQn9C+0LTRgdGC0LDQvdC+0LLQutCwINC90LDQudC00LXQvdC+0LPQviDQs9C+0YDQvtC00LBcclxuICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldC5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XHJcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5wYXJhbXNXaWRnZXQuY2l0eU5hbWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICBnZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKGV2ZW50LnRhcmdldC5pZCwgZXZlbnQudGFyZ2V0LnRleHRDb250ZW50KTtcclxuICAgICAgICAgIHdpbmRvdy5jaXR5SWQgPSBldmVudC50YXJnZXQuaWQ7XHJcbiAgICAgICAgICB3aW5kb3cuY2l0eU5hbWUgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnQ7XHJcblxyXG5cclxuICAgICAgICAgIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0LnBhcmFtc1dpZGdldCwgZ2VuZXJhdGVXaWRnZXQuY29udHJvbHNXaWRnZXQsIGdlbmVyYXRlV2lkZ2V0LnVybHMpO1xyXG4gICAgICAgICAgb2JqV2lkZ2V0LnJlbmRlcigpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICogQHBhcmFtIHVybFxyXG4gICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgKi9cclxuICBodHRwR2V0KHVybCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuKi9cclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgLyoqXHJcbiAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgKi9cclxuICBudW1iZXJEYXlzT2ZZZWFyWFhYKG51bWJlcikge1xyXG4gICAgaWYgKG51bWJlciA+IDM2NSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAobnVtYmVyIDwgMTApIHtcclxuICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMCkge1xyXG4gICAgICByZXR1cm4gYDAke251bWJlcn1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bWJlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXHJcbiAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge2ludGVnZXJ9ICDQn9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINCyINCz0L7QtNGDXHJcbiAgKi9cclxuICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgY29uc3QgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC/0YDQtdC+0L7QsdGA0LDQt9GD0LXRgiDQtNCw0YLRgyDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+INCyIHl5eXktbW0tZGRcclxuICAqIEBwYXJhbSAge3N0cmluZ30gZGF0ZSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKiBAcmV0dXJuIHtkYXRlfSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgKi9cclxuICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpIHtcclxuICAgIGNvbnN0IHJlID0gLyhcXGR7NH0pKC0pKFxcZHszfSkvO1xyXG4gICAgY29uc3QgbGluZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICBjb25zdCBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgIGNvbnN0IHVuaXh0aW1lID0gYmVnaW55ZWFyLmdldFRpbWUoKSArIChsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKiAyNCk7XHJcbiAgICBjb25zdCByZXMgPSBuZXcgRGF0ZSh1bml4dGltZSk7XHJcblxyXG4gICAgY29uc3QgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBjb25zdCBkYXlzID0gcmVzLmdldERhdGUoKTtcclxuICAgIGNvbnN0IHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcclxuICAgIHJldHVybiBgJHtkYXlzIDwgMTAgPyBgMCR7ZGF5c31gIDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQtNCw0YLRiyDQstC40LTQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKi9cclxuICBmb3JtYXREYXRlKGRhdGUxKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG5cclxuICAgIHJldHVybiBgJHt5ZWFyfS0keyhtb250aCA8IDEwKSA/IGAwJHttb250aH1gIDogbW9udGh9IC0gJHsoZGF5IDwgMTApID8gYDAke2RheX1gIDogZGF5fWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAqL1xyXG4gIGdldEN1cnJlbnREYXRlKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC/0L7RgdC70LXQtNC90LjQtSDRgtGA0Lgg0LzQtdGB0Y/RhtCwXHJcbiAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIGxldCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgbGV0IGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcbiAgICBkYXkgLT0gOTA7XHJcbiAgICBpZiAoZGF5IDwgMCkge1xyXG4gICAgICB5ZWFyIC09IDE7XHJcbiAgICAgIGRheSA9IDM2NSAtIGRheTtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHt5ZWFyfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0Q3VycmVudFN1bW1lckRhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldEN1cnJlbnRTcHJpbmdEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRMYXN0U3VtbWVyRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgLSAxO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpIHtcclxuICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IC0gMDAxYDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgdGltZXN0YW1wVG9EYXRlVGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygpLnJlcGxhY2UoLywvLCAnJykucmVwbGFjZSgvOlxcdyskLywgJycpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBoaDptbV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgIHJldHVybiBgJHtob3VycyA8IDEwID8gYDAke2hvdXJzfWAgOiBob3Vyc30gOiAke21pbnV0ZXMgPCAxMCA/IGAwJHttaW51dGVzfWAgOiBtaW51dGVzfSBgO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICogQHJldHVybnMge251bWJlcn1cclxuICAqL1xyXG4gIGdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7XHJcbiAgfVxyXG5cclxuICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgKi9cclxuICBnZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIoZGF5TnVtYmVyKSB7XHJcbiAgICBjb25zdCBkYXlzID0ge1xyXG4gICAgICAwOiAnU3VuJyxcclxuICAgICAgMTogJ01vbicsXHJcbiAgICAgIDI6ICdUdWUnLFxyXG4gICAgICAzOiAnV2VkJyxcclxuICAgICAgNDogJ1RodScsXHJcbiAgICAgIDU6ICdGcmknLFxyXG4gICAgICA2OiAnU2F0JyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGF5c1tkYXlOdW1iZXJdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQtdGA0L3Rg9GC0Ywg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC80LXRgdGP0YbQsCDQv9C+INC10LPQviDQvdC+0LzQtdGA0YNcclxuICAgKiBAcGFyYW0gbnVtTW9udGhcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBnZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKG51bU1vbnRoKXtcclxuXHJcbiAgICBpZih0eXBlb2YgbnVtTW9udGggIT09IFwibnVtYmVyXCIgfHwgbnVtTW9udGggPD0wICYmIG51bU1vbnRoID49IDEyKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoTmFtZSA9IHtcclxuICAgICAgMDogXCJKYW5cIixcclxuICAgICAgMTogXCJGZWJcIixcclxuICAgICAgMjogXCJNYXJcIixcclxuICAgICAgMzogXCJBcHJcIixcclxuICAgICAgNDogXCJNYXlcIixcclxuICAgICAgNTogXCJKdW5cIixcclxuICAgICAgNjogXCJKdWxcIixcclxuICAgICAgNzogXCJBdWdcIixcclxuICAgICAgODogXCJTZXBcIixcclxuICAgICAgOTogXCJPY3RcIixcclxuICAgICAgMTA6IFwiTm92XCIsXHJcbiAgICAgIDExOiBcIkRlY1wiXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBtb250aE5hbWVbbnVtTW9udGhdO1xyXG4gIH1cclxuXHJcbiAgLyoqINCh0YDQsNCy0L3QtdC90LjQtSDQtNCw0YLRiyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5ID0gZGQubW0ueXl5eSDRgSDRgtC10LrRg9GJ0LjQvCDQtNC90LXQvFxyXG4gICpcclxuICAqL1xyXG4gIGNvbXBhcmVEYXRlc1dpdGhUb2RheShkYXRlKSB7XHJcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSA9PT0gKG5ldyBEYXRlKCkpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZGF0ZSkge1xyXG4gICAgY29uc3QgcmUgPSAvKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XHJcbiAgICBjb25zdCByZXNEYXRlID0gcmUuZXhlYyhkYXRlKTtcclxuICAgIGlmIChyZXNEYXRlLmxlbmd0aCA9PT0gNikge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YCk7XHJcbiAgICB9XHJcbiAgICAvLyDQldGB0LvQuCDQtNCw0YLQsCDQvdC1INGA0LDRgdC/0LDRgNGB0LXQvdCwINCx0LXRgNC10Lwg0YLQtdC60YPRidGD0Y5cclxuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgSEg6TU0gTW9udGhOYW1lIE51bWJlckRhdGVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICByZXR1cm4gYCR7ZGF0ZS5nZXRIb3VycygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRIb3VycygpfWAgOiBkYXRlLmdldEhvdXJzKCkgfToke2RhdGUuZ2V0TWludXRlcygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRNaW51dGVzKCl9YCA6IGRhdGUuZ2V0TWludXRlcygpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfSAke2RhdGUuZ2V0RGF0ZSgpfWA7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIwLjEwLjIwMTYuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbmF0dXJhbFBoZW5vbWVub24gPXtcclxuICAgIFwiZW5cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJFbmdsaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnaHQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImhlYXZ5IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwicmFnZ2VkIHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcInNob3dlciByYWluIGFuZCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJoZWF2eSBzaG93ZXIgcmFpbiBhbmQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwic2hvd2VyIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1vZGVyYXRlIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhlYXZ5IGludGVuc2l0eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZXJ5IGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiZnJlZXppbmcgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlnaHQgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJyYWdnZWQgc2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpZ2h0IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNub3dcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlYXZ5IHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzaG93ZXIgc2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcImxpZ2h0IHJhaW4gYW5kIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcInJhaW4gYW5kIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcImxpZ2h0IHNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiaGVhdnkgc2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2tlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJoYXplXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJzYW5kLGR1c3Qgd2hpcmxzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJmb2dcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInNhbmRcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcImR1c3RcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInZvbGNhbmljIGFzaFwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwic3F1YWxsc1wiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2xlYXIgc2t5XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJmZXcgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzY2F0dGVyZWQgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJicm9rZW4gY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJvdmVyY2FzdCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2FsIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWNhbmVcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImNvbGRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZHlcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhaWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcInNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcImxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiZ2VudGxlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwibW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJmcmVzaCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcInN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcImhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJzZXZlcmUgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwic3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcInZpb2xlbnQgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcImh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicnVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJSdXNzaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNmXFx1MDQ0MFxcdTA0M2VcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQ0YlxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDMyXFx1MDQzZVxcdTA0MzdcXHUwNDNjXFx1MDQzZVxcdTA0MzZcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0MzZcXHUwNDM1XFx1MDQ0MVxcdTA0NDJcXHUwNDNlXFx1MDQzYVxcdTA0MzBcXHUwNDRmIFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDNlXFx1MDQ0N1xcdTA0MzVcXHUwNDNkXFx1MDQ0YyBcXHUwNDQxXFx1MDQ0YlxcdTA0NDBcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDNiXFx1MDQ1MVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0M2JcXHUwNDUxXFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQzOFxcdTA0M2RcXHUwNDQyXFx1MDQzNVxcdTA0M2RcXHUwNDQxXFx1MDQzOFxcdTA0MzJcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0M2NcXHUwNDM1XFx1MDQzYlxcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQzZlxcdTA0NDBcXHUwNDNlXFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0M2VcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXFx1MDQzYlxcdTA0NGNcXHUwNDQ4XFx1MDQzZVxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0NGZcXHUwNDNhXFx1MDQzZVxcdTA0NDJcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDM1XFx1MDQ0MVxcdTA0NDdcXHUwNDMwXFx1MDQzZFxcdTA0MzBcXHUwNDRmIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NGZcXHUwNDQxXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDNmXFx1MDQzMFxcdTA0NDFcXHUwNDNjXFx1MDQ0M1xcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQzZlxcdTA0MzBcXHUwNDQxXFx1MDQzY1xcdTA0NDNcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQ0MFxcdTA0M2RcXHUwNDMwXFx1MDQzNFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0M2ZcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQzYVxcdTA0MzBcXHUwNDRmIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0NDNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQzNlxcdTA0MzBcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0MzVcXHUwNDNkXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaXRcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJJdGFsaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2lhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0ZW1wb3JhbGUgY29uIHBpb2dnaWEgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRlbXBvcmFsZVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGVtcG9yYWxlXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0ZW1wb3JhbGUgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRlbXBvcmFsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJmb3J0ZSBwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiYWNxdWF6em9uZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGlvZ2dpYSBsZWdnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJwaW9nZ2lhIG1vZGVyYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJmb3J0ZSBwaW9nZ2lhXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwaW9nZ2lhIGZvcnRpc3NpbWFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcInBpb2dnaWEgZXN0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGlvZ2dpYSBnZWxhdGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJhY3F1YXp6b25lXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJmb3J0ZSBuZXZpY2F0YVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibmV2aXNjaGlvXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJmb3J0ZSBuZXZpY2F0YVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiZm9zY2hpYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtb1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiZm9zY2hpYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwibXVsaW5lbGxpIGRpIHNhYmJpYVxcL3BvbHZlcmVcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm5lYmJpYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2llbG8gc2VyZW5vXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJwb2NoZSBudXZvbGVcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51Ymkgc3BhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWJpIHNwYXJzZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiY2llbG8gY29wZXJ0b1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcGVzdGEgdHJvcGljYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJ1cmFnYW5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJmcmVkZG9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbGRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuZGluZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbW9cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkJhdmEgZGkgdmVudG9cIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyZXp6YSBsZWdnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmV6emEgdGVzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiVXJhZ2Fub1wiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwic3BcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJTcGFuaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidG9ybWVudGEgY29uIGxsdXZpYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnZXJhIHRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0b3JtZW50YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiZnVlcnRlIHRvcm1lbnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0b3JtZW50YSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidG9ybWVudGEgY29uIGxsb3Zpem5hIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibGxvdml6bmFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImxsb3Zpem5hIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGx1dmlhIHkgbGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJsbHV2aWEgeSBsbG92aXpuYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwibGx1dmlhIHkgbGxvdml6bmEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJjaHViYXNjb1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGx1dmlhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibGx1dmlhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJsbHV2aWEgZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJsbHV2aWEgbXV5IGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwibGx1dmlhIG11eSBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImxsdXZpYSBoZWxhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImNodWJhc2NvIGRlIGxpZ2VyYSBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaHViYXNjb1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2h1YmFzY28gZGUgZ3JhbiBpbnRlbnNpZGFkXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZhZGEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwibmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImFndWFuaWV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiY2h1YmFzY28gZGUgbmlldmVcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiaHVtb1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwibmllYmxhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0b3JiZWxsaW5vcyBkZSBhcmVuYVxcL3BvbHZvXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicnVtYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2llbG8gY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImFsZ28gZGUgbnViZXNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51YmVzIGRpc3BlcnNhc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViZXMgcm90YXNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0b3JtZW50YSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyYWNcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJcXHUwMGVkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5pem9cIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1hXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJWaWVudG8gZmxvam9cIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlZpZW50byBzdWF2ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiVmllbnRvIG1vZGVyYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiVmllbnRvIGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmllbnRvIGZ1ZXJ0ZSwgcHJcXHUwMGYzeGltbyBhIHZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YWRcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhZCB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWNcXHUwMGUxblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidWFcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJVa3JhaW5pYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzN1xcdTA0NTYgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2VcXHUwNDRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzYVxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0NDJcXHUwNDNhXFx1MDQzZVxcdTA0NDdcXHUwNDMwXFx1MDQ0MVxcdTA0M2RcXHUwNDU2IFxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzMCBcXHUwNDNjXFx1MDQ0MFxcdTA0NGZcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDNmXFx1MDQzZVxcdTA0M2NcXHUwNDU2XFx1MDQ0MFxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDNhXFx1MDQ0MFxcdTA0MzhcXHUwNDM2XFx1MDQzMFxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzN1xcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzMyBcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0M2NcXHUwNDNlXFx1MDQzYVxcdTA0NDBcXHUwNDM4XFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0NTZcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDQxXFx1MDQzNVxcdTA0NDBcXHUwNDNmXFx1MDQzMFxcdTA0M2RcXHUwNDNlXFx1MDQzYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0NTZcXHUwNDQ5XFx1MDQzMFxcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDMwXFx1MDQzY1xcdTA0MzVcXHUwNDQyXFx1MDQ1NlxcdTA0M2JcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQ0N1xcdTA0MzhcXHUwNDQxXFx1MDQ0MlxcdTA0MzUgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQ0NVxcdTA0MzggXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDU2XFx1MDQ0MFxcdTA0MzJcXHUwNDMwXFx1MDQzZFxcdTA0NTYgXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQ0NVxcdTA0M2NcXHUwNDMwXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQ1NlxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDM1XFx1MDQzMlxcdTA0NTZcXHUwNDM5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwNDQ1XFx1MDQzZVxcdTA0M2JcXHUwNDNlXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDQxXFx1MDQzZlxcdTA0MzVcXHUwNDNhXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0NTZcXHUwNDQyXFx1MDQ0MFxcdTA0NGZcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJkZVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkdlcm1hblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkdld2l0dGVyIG1pdCBsZWljaHRlbSBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiR2V3aXR0ZXIgbWl0IFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHZXdpdHRlciBtaXQgc3RhcmtlbSBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGVpY2h0ZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNjaHdlcmUgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImVpbmlnZSBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR2V3aXR0ZXIgbWl0IGxlaWNodGVtIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJHZXdpdHRlciBtaXQgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdld2l0dGVyIG1pdCBzdGFya2VtIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsZWljaHRlcyBOaWVzZWxuXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJOaWVzZWxuXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzdGFya2VzIE5pZXNlbG5cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxlaWNodGVyIE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwic3RhcmtlciBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiTmllc2Vsc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGVpY2h0ZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1cXHUwMGU0XFx1MDBkZmlnZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInNlaHIgc3RhcmtlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwic2VociBzdGFya2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJTdGFya3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJFaXNyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGVpY2h0ZSBSZWdlbnNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlJlZ2Vuc2NoYXVlclwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVmdGlnZSBSZWdlbnNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm1cXHUwMGU0XFx1MDBkZmlnZXIgU2NobmVlXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJTY2huZWVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhlZnRpZ2VyIFNjaG5lZWZhbGxcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkdyYXVwZWxcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlNjaG5lZXNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInRyXFx1MDBmY2JcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlJhdWNoXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJEdW5zdFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiU2FuZCBcXC8gU3RhdWJzdHVybVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTmViZWxcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImtsYXJlciBIaW1tZWxcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImVpbiBwYWFyIFdvbGtlblwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDBmY2JlcndpZWdlbmQgYmV3XFx1MDBmNmxrdFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDBmY2JlcndpZWdlbmQgYmV3XFx1MDBmNmxrdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwid29sa2VuYmVkZWNrdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiVG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVHJvcGVuc3R1cm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkh1cnJpa2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrYWx0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJoZWlcXHUwMGRmXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aW5kaWdcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIkhhZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJXaW5kc3RpbGxlXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMZWljaHRlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJNaWxkZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTVxcdTAwZTRcXHUwMGRmaWdlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmlzY2hlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdGFya2UgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhvY2h3aW5kLCBhbm5cXHUwMGU0aGVuZGVyIFN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2Nod2VyZXIgU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJIZWZ0aWdlcyBHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3JrYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInB0XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUG9ydHVndWVzZVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0cm92b2FkYSBjb20gY2h1dmFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRyb3ZvYWRhIGNvbSBjaHV2YSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidHJvdm9hZGEgbGV2ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidHJvdm9hZGFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInRyb3ZvYWRhIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidHJvdm9hZGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2EgZnJhY2FcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidHJvdm9hZGEgY29tIGdhcm9hIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiZ2Fyb2EgZnJhY2FcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJnYXJvYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJjaHV2YSBsZXZlXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJjaHV2YSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiY2h1dmEgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImNodXZhIGRlIGdhcm9hXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJjaHV2YSBmcmFjYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiQ2h1dmEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImNodXZhIGRlIGludGVuc2lkYWRlIHBlc2Fkb1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiY2h1dmEgbXVpdG8gZm9ydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIkNodXZhIEZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJjaHV2YSBjb20gY29uZ2VsYW1lbnRvXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaHV2YSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2h1dmFcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImNodXZhIGRlIGludGVuc2lkYWRlIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTmV2ZSBicmFuZGFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5ldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk5ldmUgcGVzYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJjaHV2YSBjb20gbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiYmFuaG8gZGUgbmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiTlxcdTAwZTl2b2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bWFcXHUwMGU3YVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwibmVibGluYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidHVyYmlsaFxcdTAwZjVlcyBkZSBhcmVpYVxcL3BvZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiTmVibGluYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY1xcdTAwZTl1IGNsYXJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJBbGd1bWFzIG51dmVuc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibnV2ZW5zIGRpc3BlcnNhc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnV2ZW5zIHF1ZWJyYWRvc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwidGVtcG8gbnVibGFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcGVzdGFkZSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiZnVyYWNcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJpb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwicXVlbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJjb20gdmVudG9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyYW5pem9cIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicm9cIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJSb21hbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImZ1cnR1blxcdTAxMDMgY3UgcGxvYWllIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiZnVydHVuXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZnVydHVuXFx1MDEwMyBjdSBwbG9haWUgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJmdXJ0dW5cXHUwMTAzIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiZnVydHVuXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiZnVydHVuXFx1MDEwMyBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImZ1cnR1blxcdTAxMDMgYXByaWdcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIGpvYXNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIG1hcmVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgam9hc1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDMgZGUgaW50ZW5zaXRhdGUgbWFyZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwicGxvYWllIHVcXHUwMjE5b2FyXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwicGxvYWllXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJwbG9haWUgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwbG9haWUgdG9yZW5cXHUwMjFiaWFsXFx1MDEwMyBcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcInBsb2FpZSBleHRyZW1cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwbG9haWUgXFx1MDBlZW5naGVcXHUwMjFiYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuaW5zb2FyZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIm5pbnNvYXJlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuaW5zb2FyZSBwdXRlcm5pY1xcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImxhcG92aVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuaW5zb2FyZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ2XFx1MDBlMnJ0ZWp1cmkgZGUgbmlzaXBcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjZXIgc2VuaW5cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImNcXHUwMGUyXFx1MDIxYml2YSBub3JpXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJub3JpIFxcdTAwZWVtcHJcXHUwMTAzXFx1MDIxOXRpYVxcdTAyMWJpXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJjZXIgZnJhZ21lbnRhdFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiY2VyIGFjb3Blcml0IGRlIG5vcmlcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImZ1cnR1bmEgdHJvcGljYWxcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJ1cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInJlY2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImZpZXJiaW50ZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmFudCBwdXRlcm5pY1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JpbmRpblxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwicGxcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJQb2xpc2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJCdXJ6YSB6IGxla2tpbWkgb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJCdXJ6YSB6IG9wYWRhbWkgZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiQnVyemEgeiBpbnRlbnN5d255bWkgb3BhZGFtaSBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJMZWtrYSBidXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiQnVyemFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlNpbG5hIGJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJCdXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiQnVyemEgeiBsZWtrXFx1MDEwNSBtXFx1MDE3Y2F3a1xcdTAxMDVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkJ1cnphIHogbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJCdXJ6YSB6IGludGVuc3l3blxcdTAxMDUgbVxcdTAxN2Nhd2tcXHUwMTA1XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJMZWtrYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIk1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiSW50ZW5zeXduYSBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIkxla2tpZSBvcGFkeSBkcm9ibmVnbyBkZXN6Y3p1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJEZXN6Y3ogXFwvIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiSW50ZW5zeXdueSBkZXN6Y3ogXFwvIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiU2lsbmEgbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJMZWtraSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlVtaWFya293YW55IGRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiSW50ZW5zeXdueSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImJhcmR6byBzaWxueSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlVsZXdhXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJNYXJ6blxcdTAxMDVjeSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIktyXFx1MDBmM3RrYSB1bGV3YVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiRGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJJbnRlbnN5d255LCBsZWtraSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIkxla2tpZSBvcGFkeSBcXHUwMTVibmllZ3VcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTAxNWFuaWVnXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJNb2NuZSBvcGFkeSBcXHUwMTVibmllZ3VcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkRlc3pjeiB6ZSBcXHUwMTVibmllZ2VtXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwMTVhbmllXFx1MDE3Y3ljYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiTWdpZVxcdTAxNDJrYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiU21vZ1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiWmFtZ2xlbmlhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJaYW1pZVxcdTAxMDcgcGlhc2tvd2FcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIk1nXFx1MDE0MmFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkJlemNobXVybmllXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJMZWtraWUgemFjaG11cnplbmllXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJSb3pwcm9zem9uZSBjaG11cnlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlBvY2htdXJubyB6IHByemVqYVxcdTAxNWJuaWVuaWFtaVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiUG9jaG11cm5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJidXJ6YSB0cm9waWthbG5hXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJDaFxcdTAxNDJvZG5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJHb3JcXHUwMTA1Y29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpZXRyem5pZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiR3JhZFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiU3Bva29qbmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMZWtrYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiRGVsaWthdG5hIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJVbWlhcmtvd2FuYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDE1YXdpZVxcdTAxN2NhIGJyeXphXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTaWxuYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiUHJhd2llIHdpY2h1cmFcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIldpY2h1cmFcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNpbG5hIHdpY2h1cmFcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN6dG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiR3dhXFx1MDE0MnRvd255IHN6dG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWdhblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZmlcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJGaW5uaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidWtrb3NteXJza3kgamEga2V2eXQgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidWtrb3NteXJza3kgamEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidWtrb3NteXJza3kgamEga292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJwaWVuaSB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImtvdmEgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImxpZXZcXHUwMGU0IHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ1a2tvc215cnNreSBqYSBrZXZ5dCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInVra29zbXlyc2t5IGphIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidWtrb3NteXJza3kgamEga292YSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZXZcXHUwMGU0IHRpaHV0dGFpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJ0aWh1dHRhYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwia292YSB0aWh1dHRhaW5lblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlldlxcdTAwZTQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImtvdmEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInBpZW5pIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImtvaHRhbGFpbmVuIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiZXJpdHRcXHUwMGU0aW4gcnVuc2FzdGEgc2FkZXR0YVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJqXFx1MDBlNFxcdTAwZTR0XFx1MDBlNHZcXHUwMGU0IHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpZXZcXHUwMGU0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwidGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInBpZW5pIGx1bWlzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJsdW1pXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJwYWxqb24gbHVudGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInJcXHUwMGU0bnRcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJsdW1pa3V1cm9cIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNhdnVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcInN1bXVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImhpZWtrYVxcL3BcXHUwMGY2bHkgcHlcXHUwMGY2cnJlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJzdW11XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJ0YWl2YXMgb24gc2Vsa2VcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJ2XFx1MDBlNGhcXHUwMGU0biBwaWx2aVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcImFqb2l0dGFpc2lhIHBpbHZpXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiaGFqYW5haXNpYSBwaWx2aVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInBpbHZpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9vcHBpbmVuIG15cnNreVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaGlybXVteXJza3lcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImt5bG1cXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJrdXVtYVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidHV1bGluZW5cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcInJha2VpdGFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwibmxcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJEdXRjaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIm9ud2VlcnNidWkgbWV0IGxpY2h0ZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwib253ZWVyc2J1aSBtZXQgcmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIm9ud2VlcnNidWkgbWV0IHp3YXJlIHJlZ2VudmFsXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWNodGUgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwib253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiendhcmUgb253ZWVyc2J1aVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib25yZWdlbG1hdGlnIG9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIm9ud2VlcnNidWkgbWV0IGxpY2h0ZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwib253ZWVyc2J1aSBtZXQgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIm9ud2VlcnNidWkgbWV0IHp3YXJlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWNodGUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJ6d2FyZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGljaHRlIG1vdHJlZ2VuXFwvcmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIm1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJ6d2FyZSBtb3RyZWdlblxcL3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJ6d2FyZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibGljaHRlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtYXRpZ2UgcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInp3YXJlIHJlZ2VudmFsXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ6ZWVyIHp3YXJlIHJlZ2VudmFsXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJLb3VkZSBidWllblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGljaHRlIHN0b3J0cmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInN0b3J0cmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInp3YXJlIHN0b3J0cmVnZW5cIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxpY2h0ZSBzbmVldXdcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGV2aWdlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiaWp6ZWxcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5hdHRlIHNuZWV1d1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwibmV2ZWxcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInphbmRcXC9zdG9mIHdlcnZlbGluZ1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibWlzdFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwib25iZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJsaWNodCBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJoYWxmIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcInp3YWFyIGJld29sa3RcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImdlaGVlbCBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waXNjaGUgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia291ZFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaGVldFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwic3Rvcm1hY2h0aWdcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJXaW5kc3RpbFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiS2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGljaHRlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJaYWNodGUgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1hdGlnZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiVnJpaiBrcmFjaHRpZ2Ugd2luZFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiS3JhY2h0aWdlIHdpbmRcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhhcmRlIHdpbmRcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlN0b3JtYWNodGlnXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiWndhcmUgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlplZXIgendhcmUgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk9ya2FhblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZnJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJGcmVuY2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJvcmFnZSBldCBwbHVpZSBmaW5lXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJvcmFnZSBldCBwbHVpZVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwib3JhZ2UgZXQgZm9ydGVzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwib3JhZ2VzIGxcXHUwMGU5Z2Vyc1wiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwib3JhZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJncm9zIG9yYWdlc1wiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib3JhZ2VzIFxcdTAwZTlwYXJzZXNcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIk9yYWdlIGF2ZWMgbFxcdTAwZTlnXFx1MDBlOHJlIGJydWluZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwib3JhZ2VzIFxcdTAwZTlwYXJzZXNcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImdyb3Mgb3JhZ2VcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIkJydWluZSBsXFx1MDBlOWdcXHUwMGU4cmVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIkJydWluZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiRm9ydGVzIGJydWluZXNcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlBsdWllIGZpbmUgXFx1MDBlOXBhcnNlXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwbHVpZSBmaW5lXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJDcmFjaGluIGludGVuc2VcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIkF2ZXJzZXMgZGUgYnJ1aW5lXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsXFx1MDBlOWdcXHUwMGU4cmVzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwicGx1aWVzIG1vZFxcdTAwZTlyXFx1MDBlOWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJGb3J0ZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ0clxcdTAwZThzIGZvcnRlcyBwclxcdTAwZTljaXBpdGF0aW9uc1wiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZ3Jvc3NlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBsdWllIHZlcmdsYVxcdTAwZTdhbnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwZXRpdGVzIGF2ZXJzZXNcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImF2ZXJzZXMgZGUgcGx1aWVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImF2ZXJzZXMgaW50ZW5zZXNcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImxcXHUwMGU5Z1xcdTAwZThyZXMgbmVpZ2VzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZWlnZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZm9ydGVzIGNodXRlcyBkZSBuZWlnZVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibmVpZ2UgZm9uZHVlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJhdmVyc2VzIGRlIG5laWdlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJicnVtZVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiQnJvdWlsbGFyZFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiYnJ1bWVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInRlbXBcXHUwMGVhdGVzIGRlIHNhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicm91aWxsYXJkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJlbnNvbGVpbGxcXHUwMGU5XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJwZXUgbnVhZ2V1eFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicGFydGllbGxlbWVudCBlbnNvbGVpbGxcXHUwMGU5XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJudWFnZXV4XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJDb3V2ZXJ0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0ZW1wXFx1MDBlYXRlIHRyb3BpY2FsZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3VyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJvaWRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNoYXVkXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50ZXV4XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJnclxcdTAwZWFsZVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkJyaXNlIGxcXHUwMGU5Z1xcdTAwZThyZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQnJpc2UgZG91Y2VcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyaXNlIG1vZFxcdTAwZTlyXFx1MDBlOWVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNlIGZyYWljaGVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkJyaXNlIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50IGZvcnQsIHByZXNxdWUgdmlvbGVudFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVudCB2aW9sZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJWZW50IHRyXFx1MDBlOHMgdmlvbGVudFwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcFxcdTAwZWF0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiZW1wXFx1MDBlYXRlIHZpb2xlbnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPdXJhZ2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJiZ1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkJ1bGdhcmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDEgXFx1MDQzZlxcdTA0M2VcXHUwNDQwXFx1MDQzZVxcdTA0MzlcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0M2FcXHUwNDRhXFx1MDQ0MVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmIFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0MjBcXHUwNDRhXFx1MDQzY1xcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0MjBcXHUwNDRhXFx1MDQzY1xcdTA0NGZcXHUwNDQ5IFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDIzXFx1MDQzY1xcdTA0MzVcXHUwNDQwXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQxY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0MTRcXHUwNDRhXFx1MDQzNlxcdTA0MzQgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDQyXFx1MDQ0M1xcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQxZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0MWZcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDM5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0MjFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0MThcXHUwNDM3XFx1MDQzZFxcdTA0MzVcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDMyXFx1MDQzMFxcdTA0NDkgXFx1MDQzMlxcdTA0MzBcXHUwNDNiXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA0MWVcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHUwNDFjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDQxNFxcdTA0MzhcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDFkXFx1MDQzOFxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDNjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQxZlxcdTA0NGZcXHUwNDQxXFx1MDQ0YVxcdTA0NDdcXHUwNDNkXFx1MDQzMFxcL1xcdTA0MWZcXHUwNDQwXFx1MDQzMFxcdTA0NDhcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDFjXFx1MDQ0YVxcdTA0MzNcXHUwNDNiXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDQyZlxcdTA0NDFcXHUwNDNkXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDFkXFx1MDQzOFxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0M2FcXHUwNDRhXFx1MDQ0MVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0MjBcXHUwNDMwXFx1MDQzN1xcdTA0NDFcXHUwNDM1XFx1MDQ0ZlxcdTA0M2RcXHUwNDMwIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ3XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQyMlxcdTA0NGFcXHUwNDNjXFx1MDQzZFxcdTA0MzggXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDIyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXFwvXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDIyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQyMVxcdTA0NDJcXHUwNDQzXFx1MDQzNFxcdTA0MzVcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQxM1xcdTA0M2VcXHUwNDQwXFx1MDQzNVxcdTA0NDlcXHUwNDNlIFxcdTA0MzJcXHUwNDQwXFx1MDQzNVxcdTA0M2NcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDEyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0MlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MTNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwic2VcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJTd2VkaXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImZ1bGx0IFxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDBlNXNrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwMGU1c2thXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJvalxcdTAwZTRtbnQgb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZnVsbHQgXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJtanVrdCBkdWdncmVnblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImhcXHUwMGU1cnQgZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIm1qdWt0IHJlZ25cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInJlZ25cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImhcXHUwMGU1cnQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIm1qdWt0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIk1cXHUwMGU1dHRsaWcgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiaFxcdTAwZTVydCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJteWNrZXQga3JhZnRpZ3QgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDBmNnNyZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJ1bmRlcmt5bHQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibWp1a3QgXFx1MDBmNnNyZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJkdXNjaC1yZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJyZWduYXIgc21cXHUwMGU1c3Bpa1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibWp1ayBzblxcdTAwZjZcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuXFx1MDBmNlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwia3JhZnRpZ3Qgc25cXHUwMGY2ZmFsbFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic25cXHUwMGY2YmxhbmRhdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzblxcdTAwZjZvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImRpbW1hXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9nZ1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiZGlzXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJzYW5kc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImRpbW1pZ3RcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImtsYXIgaGltbWVsXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJuXFx1MDBlNWdyYSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzcHJpZGRhIG1vbG5cIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm1vbG5pZ3RcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTAwZjZ2ZXJza3VnZ2FuZGUgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwic3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3Bpc2sgc3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm9ya2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJrYWxsdFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwidmFybXRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcImJsXFx1MDBlNXNpZ3RcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInpoX3R3XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2hpbmVzZSBUcmFkaXRpb25hbFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHU0ZTJkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHU2NmI0XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1NTFjZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTVjMGZcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHU1OTI3XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1OTZlOFxcdTU5M2VcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHU5NjYzXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1ODU4NFxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTcxNTlcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHU4NTg0XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1NmM5OVxcdTY1Y2JcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHU1OTI3XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1NjY3NFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1NjY3NFxcdWZmMGNcXHU1YzExXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1NTkxYVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTU5MWFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHU5NjcwXFx1ZmYwY1xcdTU5MWFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHU5ZjhkXFx1NjM3MlxcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTcxYjFcXHU1ZTM2XFx1OThhOFxcdTY2YjRcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTk4YjZcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHU1MWI3XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHU3MWIxXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHU1OTI3XFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1NTFiMFxcdTk2ZjlcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwidHJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJUdXJraXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBoYWZpZiB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyB5YVxcdTAxMWZtdXJsdVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBzYVxcdTAxMWZhbmFrIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkhhZmlmIHNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTAxNWVpZGRldGxpIHNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIkFyYWxcXHUwMTMxa2xcXHUwMTMxIHNhXFx1MDExZmFuYWtcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgaGFmaWYgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlllciB5ZXIgaGFmaWYgeW9cXHUwMTFmdW5sdWtsdSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiWWVyIHllciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJZZXIgeWVyIHlvXFx1MDExZnVuIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlllciB5ZXIgaGFmaWYgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiWWVyIHllciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJZZXIgeWVyIHlvXFx1MDExZnVuIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlllciB5ZXIgc2FcXHUwMTFmYW5hayB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJIYWZpZiB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIk9ydGEgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwMTVlaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTAwYzdvayBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIkFcXHUwMTVmXFx1MDEzMXJcXHUwMTMxIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiWWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMSB2ZSBzb1xcdTAxMWZ1ayBoYXZhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSBoYWZpZiB5b1xcdTAxMWZ1bmx1a2x1IHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsaSBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIkhhZmlmIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJLYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiWW9cXHUwMTFmdW4ga2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkthcmxhIGthclxcdTAxMzFcXHUwMTVmXFx1MDEzMWsgeWFcXHUwMTFmbXVybHVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxcXHUwMGZjIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZlxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJTaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiSGFmaWYgc2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIkt1bVxcL1RveiBmXFx1MDEzMXJ0XFx1MDEzMW5hc1xcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJBXFx1MDBlN1xcdTAxMzFrXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJBeiBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJQYXJcXHUwMGU3YWxcXHUwMTMxIGF6IGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlBhclxcdTAwZTdhbFxcdTAxMzEgYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiS2FwYWxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJLYXNcXHUwMTMxcmdhXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUcm9waWsgZlxcdTAxMzFydFxcdTAxMzFuYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSG9ydHVtXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHUwMGM3b2sgU29cXHUwMTFmdWtcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTAwYzdvayBTXFx1MDEzMWNha1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIkRvbHUgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJEdXJndW5cIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlNha2luXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJIYWZpZiBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiQXogUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk9ydGEgU2V2aXllIFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiS3V2dmV0bGkgUlxcdTAwZmN6Z2FyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJTZXJ0IFJcXHUwMGZjemdhclwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiRlxcdTAxMzFydFxcdTAxMzFuYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDE1ZWlkZGV0bGkgRlxcdTAxMzFydFxcdTAxMzFuYVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiS2FzXFx1MDEzMXJnYVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDE1ZWlkZGV0bGkgS2FzXFx1MDEzMXJnYVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDBjN29rIFxcdTAxNWVpZGRldGxpIEthc1xcdTAxMzFyZ2FcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInpoX2NuXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2hpbmVzZSBTaW1wbGlmaWVkXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTRlMmRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTY2YjRcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHU1MWJiXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1NWMwZlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTU5MjdcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHU5NmU4XFx1NTkzOVxcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTk2MzVcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJcXHU4NTg0XFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1NzBkZlxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTg1ODRcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHU2Yzk5XFx1NjVjYlxcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTU5MjdcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHU2Njc0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHU2Njc0XFx1ZmYwY1xcdTVjMTFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHU1OTFhXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1NTkxYVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTk2MzRcXHVmZjBjXFx1NTkxYVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTlmOTlcXHU1Mzc3XFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1NzBlZFxcdTVlMjZcXHU5OGNlXFx1NjZiNFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1OThkM1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTUxYjdcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTcwZWRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTU5MjdcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHU1MWIwXFx1OTZmOVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJjelwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkN6ZWNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiYm91XFx1MDE1OWthIHNlIHNsYWJcXHUwMGZkbSBkZVxcdTAxNjF0XFx1MDExYm1cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImJvdVxcdTAxNTlrYSBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImJvdVxcdTAxNTlrYSBzZSBzaWxuXFx1MDBmZG0gZGVcXHUwMTYxdFxcdTAxMWJtXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJzbGFiXFx1MDE2MVxcdTAwZWQgYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInNpbG5cXHUwMGUxIGJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiYm91XFx1MDE1OWtvdlxcdTAwZTEgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a2FcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcImJvdVxcdTAxNTlrYSBzZSBzbGFiXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJib3VcXHUwMTU5a2EgcyBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImJvdVxcdTAxNTlrYSBzZSBzaWxuXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJzbGFiXFx1MDBlOSBtcmhvbGVuXFx1MDBlZCBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIm1yaG9sZW5cXHUwMGVkIHMgZGVcXHUwMTYxdFxcdTAxMWJtXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZCBhIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIm1yaG9sZW5cXHUwMGVkIGEgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIm1yaG9sZW5cXHUwMGVkIGEgc2lsblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIm9iXFx1MDEwZGFzblxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInBydWRrXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJwXFx1MDE1OVxcdTAwZWR2YWxvdlxcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwicHJcXHUwMTZmdHJcXHUwMTdlIG1yYVxcdTAxMGRlblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibXJ6bm91Y1xcdTAwZWQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwic2xhYlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJzaWxuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwib2JcXHUwMTBkYXNuXFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibVxcdTAwZWRyblxcdTAwZTkgc25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaHVzdFxcdTAwZTkgc25cXHUwMTFiXFx1MDE3ZWVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiem1yemxcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInNtXFx1MDBlZFxcdTAxNjFlblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MTVcIjpcInNsYWJcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjUgc2Ugc25cXHUwMTFiaGVtXCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJkXFx1MDBlOVxcdTAxNjFcXHUwMTY1IHNlIHNuXFx1MDExYmhlbVwiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwic2xhYlxcdTAwZTkgc25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwic2lsblxcdTAwZTkgc25cXHUwMTFiaG92XFx1MDBlOSBwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwibWxoYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia291XFx1MDE1OVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwib3BhclwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwicFxcdTAwZWRzZVxcdTAxMGRuXFx1MDBlOSBcXHUwMTBkaSBwcmFjaG92XFx1MDBlOSB2XFx1MDBlZHJ5XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJodXN0XFx1MDBlMSBtbGhhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJwXFx1MDBlZHNla1wiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwicHJhXFx1MDE2MW5vXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJzb3BlXFx1MDEwZG5cXHUwMGZkIHBvcGVsXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJwcnVka1xcdTAwZTkgYm91XFx1MDE1OWVcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5cXHUwMGUxZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImphc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJza29ybyBqYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicG9sb2phc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJvYmxhXFx1MDEwZG5vXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ6YXRhXFx1MDE3ZWVub1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9yblxcdTAwZTFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlja1xcdTAwZTEgYm91XFx1MDE1OWVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmlrXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcInppbWFcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvcmtvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2XFx1MDExYnRybm9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImtydXBvYml0XFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiYmV6dlxcdTAxMWJ0XFx1MDE1OVxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcInZcXHUwMGUxbmVrXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJ2XFx1MDExYnRcXHUwMTU5XFx1MDBlZGtcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcInNsYWJcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIm1cXHUwMGVkcm5cXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxMGRlcnN0dlxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwic2lsblxcdTAwZmQgdlxcdTAwZWR0clwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwicHJ1ZGtcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcImJvdVxcdTAxNTlsaXZcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcInZpY2hcXHUwMTU5aWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJzaWxuXFx1MDBlMSB2aWNoXFx1MDE1OWljZVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwibW9odXRuXFx1MDBlMSB2aWNoXFx1MDE1OWljZVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwib3JrXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImtyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiS29yZWFcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJsaWdodCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiaGVhdnkgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJyYWdnZWQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBsaWdodCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0aHVuZGVyc3Rvcm0gd2l0aCBoZWF2eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcImRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiaGVhdnkgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwic2hvd2VyIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1vZGVyYXRlIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhlYXZ5IGludGVuc2l0eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2ZXJ5IGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJlbWUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiZnJlZXppbmcgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwibGlnaHQgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiaGVhdnkgaW50ZW5zaXR5IHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWdodCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZWF2eSBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcInNtb2tlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJoYXplXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJzYW5kXFwvZHVzdCB3aGlybHNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImZvZ1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwic2t5IGlzIGNsZWFyXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJmZXcgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzY2F0dGVyZWQgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJicm9rZW4gY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJvdmVyY2FzdCBjbG91ZHNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2FsIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWNhbmVcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImNvbGRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhvdFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZHlcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImhhaWxcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZ2xcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJHYWxpY2lhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gY2hvaXZhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsbyBsaXhlaXJvXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYSBjb24gb3JiYWxsbyBpbnRlbnNvXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJvcmJhbGxvIGxpeGVpcm9cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm9yYmFsbG9cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIm9yYmFsbG8gZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiY2hvaXZhIGUgb3JiYWxsbyBsaXhlaXJvXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJjaG9pdmEgZSBvcmJhbGxvXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJjaG9pdmEgZSBvcmJhbGxvIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIm9yYmFsbG8gZGUgZHVjaGFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImNob2l2YSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJjaG9pdmEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImNob2l2YSBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJjaG9pdmEgbW9pIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJjaG9pdmEgZXh0cmVtYVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiY2hvaXZhIHhlYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaG9pdmEgZGUgZHVjaGEgZGUgYmFpeGEgaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNob2l2YSBkZSBkdWNoYVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiY2hvaXZhIGRlIGR1Y2hhIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm5ldmFkYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJuZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiYXVnYW5ldmVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIm5ldmUgZGUgZHVjaGFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm5cXHUwMGU5Ym9hXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJuXFx1MDBlOWJvYSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJyZW11aVxcdTAwZjFvcyBkZSBhcmVhIGUgcG9sdm9cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcImJydW1hXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJjZW8gY2xhcm9cIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImFsZ28gZGUgbnViZXNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51YmVzIGRpc3BlcnNhc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViZXMgcm90YXNcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0b3JtZW50YSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiZnVyYWNcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJcXHUwMGVkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiY2Fsb3JcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZlbnRvc29cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcInNhcmFiaWFcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcImNhbG1hXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJWZW50byBmcm91eG9cIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlZlbnRvIHN1YXZlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJWZW50byBtb2RlcmFkb1wiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2FcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlZlbnRvIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50byBmb3J0ZSwgcHJcXHUwMGYzeGltbyBhIHZlbmRhdmFsXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgZm9ydGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhZGVcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlRlbXBlc3RhZGUgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkZ1cmFjXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInZpXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwidmlldG5hbWVzZVwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGEgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gTVxcdTAxYjBhIGxcXHUxZWRiblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIGNcXHUwMGYzIGNoXFx1MWVkYnAgZ2lcXHUxZWFkdFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiQlxcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJCXFx1MDBlM28gdlxcdTAwZTBpIG5cXHUwMWExaVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYSBwaFxcdTAwZjluIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUxZWRiaSBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUxZWRiaSBtXFx1MDFiMGEgcGhcXHUwMGY5biBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwMGUxbmggc1xcdTAwZTFuZyBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibVxcdTAxYjBhIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJtXFx1MDFiMGEgdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW4gblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibVxcdTAxYjBhIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibVxcdTAxYjBhIHZcXHUxZWViYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwibVxcdTAxYjBhIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm1cXHUwMWIwYSByXFx1MWVhNXQgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwibVxcdTAxYjBhIGxcXHUxZWQxY1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibVxcdTAxYjBhIGxcXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIGNcXHUwMWIwXFx1MWVkZG5nIFxcdTAxMTFcXHUxZWQ5IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInR1eVxcdTFlYmZ0IHJcXHUwMWExaSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInR1eVxcdTFlYmZ0XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJ0dXlcXHUxZWJmdCBuXFx1MWViN25nIGhcXHUxZWExdFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwibVxcdTAxYjBhIFxcdTAxMTFcXHUwMGUxXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJ0dXlcXHUxZWJmdCBtXFx1MDBmOSB0clxcdTFlZGRpXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzXFx1MDFiMFxcdTAxYTFuZyBtXFx1MWVkZFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwia2hcXHUwMGYzaSBiXFx1MWVlNWlcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTAxMTFcXHUwMGUxbSBtXFx1MDBlMnlcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImJcXHUwMGUzbyBjXFx1MDBlMXQgdlxcdTAwZTAgbFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcInNcXHUwMWIwXFx1MDFhMW5nIG1cXHUwMGY5XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJiXFx1MWVhN3UgdHJcXHUxZWRkaSBxdWFuZyBcXHUwMTExXFx1MDBlM25nXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJtXFx1MDBlMnkgdGhcXHUwMWIwYVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibVxcdTAwZTJ5IHJcXHUxZWEzaSByXFx1MDBlMWNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm1cXHUwMGUyeSBjXFx1MWVlNW1cIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIm1cXHUwMGUyeSBcXHUwMTExZW4gdSBcXHUwMGUxbVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwibFxcdTFlZDFjIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcImNcXHUwMWExbiBiXFx1MDBlM28gbmhpXFx1MWVjN3QgXFx1MDExMVxcdTFlZGJpXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJiXFx1MDBlM28gbFxcdTFlZDFjXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJsXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJuXFx1MDBmM25nXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJnaVxcdTAwZjNcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIm1cXHUwMWIwYSBcXHUwMTExXFx1MDBlMVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiQ2hcXHUxZWJmIFxcdTAxMTFcXHUxZWNkXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJOaFxcdTFlYjkgbmhcXHUwMGUwbmdcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTAwYzFuaCBzXFx1MDBlMW5nIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR1xcdTAwZWRvIHRob1xcdTFlYTNuZ1wiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiR2lcXHUwMGYzIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiR2lcXHUwMGYzIHZcXHUxZWViYSBwaFxcdTFlYTNpXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJHaVxcdTAwZjMgbVxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiR2lcXHUwMGYzIHhvXFx1MDBlMXlcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJMXFx1MWVkMWMgeG9cXHUwMGUxeSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJCXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkJcXHUwMGUzbyBjXFx1MWVhNXAgbFxcdTFlZGJuXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJCXFx1MDBlM28gbFxcdTFlZDFjXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJhclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkFyYWJpY1wiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjNcXHUwNjQ1XFx1MDYzN1xcdTA2MjdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNjI3XFx1MDY0NFxcdTA2MzlcXHUwNjQ4XFx1MDYyN1xcdTA2MzVcXHUwNjQxIFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MjdcXHUwNjQ0XFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjI3XFx1MDY0NVxcdTA2MzdcXHUwNjI3XFx1MDYzMSBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjJiXFx1MDY0MlxcdTA2NGFcXHUwNjQ0XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyZVxcdTA2MzRcXHUwNjQ2XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2M2FcXHUwNjMyXFx1MDY0YVxcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDEgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDEgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2NDVcXHUwNjJhXFx1MDY0OFxcdTA2MzNcXHUwNjM3IFxcdTA2MjdcXHUwNjQ0XFx1MDYzYVxcdTA2MzJcXHUwNjI3XFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzOVxcdTA2MjdcXHUwNjQ0XFx1MDY0YSBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyOFxcdTA2MzFcXHUwNjJmXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjQ3XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNjJiXFx1MDY0NFxcdTA2NDhcXHUwNjJjIFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA2MzVcXHUwNjQyXFx1MDY0YVxcdTA2MzlcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyY1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDYzNlxcdTA2MjhcXHUwNjI3XFx1MDYyOFwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXFx1MDYyZlxcdTA2MmVcXHUwNjI3XFx1MDY0NlwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDYzYVxcdTA2MjhcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ1XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNjMzXFx1MDY0NVxcdTA2MjdcXHUwNjIxIFxcdTA2MzVcXHUwNjI3XFx1MDY0MVxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNjNhXFx1MDYyN1xcdTA2MjZcXHUwNjQ1IFxcdTA2MmNcXHUwNjMyXFx1MDYyNlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDFcXHUwNjMxXFx1MDY0MlxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0NVxcdTA2MmFcXHUwNjQ2XFx1MDYyN1xcdTA2MmJcXHUwNjMxXFx1MDY0N1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDYzYVxcdTA2NGFcXHUwNjQ4XFx1MDY0NSBcXHUwNjQyXFx1MDYyN1xcdTA2MmFcXHUwNjQ1XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjM1XFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MjdcXHUwNjMzXFx1MDYyYVxcdTA2NDhcXHUwNjI3XFx1MDYyNlxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNjMyXFx1MDY0OFxcdTA2NGFcXHUwNjM5XFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDYyOFxcdTA2MjdcXHUwNjMxXFx1MDYyZlwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDYyZFxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNjMxXFx1MDY0YVxcdTA2MjdcXHUwNjJkXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcXHUwNjI1XFx1MDYzOVxcdTA2MmZcXHUwNjI3XFx1MDYyZlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXFx1MDY0N1xcdTA2MjdcXHUwNjJmXFx1MDYyNlwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDRcXHUwNjM3XFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0NVxcdTA2MzlcXHUwNjJhXFx1MDYyZlxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDYzOVxcdTA2NDRcXHUwNjRhXFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlxcdTA2MzFcXHUwNjRhXFx1MDYyN1xcdTA2MmQgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZlxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjM5XFx1MDY0NlxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjM1XFx1MDYyN1xcdTA2MzFcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIm1rXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiTWFjZWRvbmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOCBcXHUwNDQxXFx1MDQzZSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXFx1MDQzY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzggXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQzY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzZlxcdTA0MzBcXHUwNDMyXFx1MDQzOFxcdTA0NDZcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0M2ZcXHUwNDMwXFx1MDQzMlxcdTA0MzhcXHUwNDQ2XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0NDFcXHUwNDNjXFx1MDQzZVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA0MzdcXHUwNDMwXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzVcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQzNVxcdTA0NDFcXHUwNDNlXFx1MDQ0N1xcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDQwXFx1MDQ0MlxcdTA0M2JcXHUwNDNlXFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQzY1xcdTA0MzBcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NDdcXHUwNDM4XFx1MDQ0MVxcdTA0NDJcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0M2RcXHUwNDM1XFx1MDQzYVxcdTA0M2VcXHUwNDNiXFx1MDQzYVxcdTA0NDMgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDNlXFx1MDQzNFxcdTA0MzJcXHUwNDNlXFx1MDQzNVxcdTA0M2RcXHUwNDM4IFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQ0MVxcdTA0M2FcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTA0NDNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0NDJcXHUwNDNlXFx1MDQzZlxcdTA0M2JcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0MzJcXHUwNDM4XFx1MDQ0MlxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlxcdTA0MTdcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM3XCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcXHUwNDFjXFx1MDQzOFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiXFx1MDQxMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTA0MjFcXHUwNDMyXFx1MDQzNVxcdTA0MzYgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwNDFjXFx1MDQzZFxcdTA0M2VcXHUwNDMzXFx1MDQ0MyBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiXFx1MDQxZFxcdTA0MzVcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiXFx1MDQxMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXFx1MDQyM1xcdTA0NDBcXHUwNDMwXFx1MDQzM1xcdTA0MzBcXHUwNDNkXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJza1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlNsb3Zha1wiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImJcXHUwMGZhcmthIHNvIHNsYWJcXHUwMGZkbSBkYVxcdTAxN2VcXHUwMTBmb21cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImJcXHUwMGZhcmthIHMgZGFcXHUwMTdlXFx1MDEwZm9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJiXFx1MDBmYXJrYSBzbyBzaWxuXFx1MDBmZG0gZGFcXHUwMTdlXFx1MDEwZm9tXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJtaWVybmEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzaWxuXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwicHJ1ZGtcXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJiXFx1MDBmYXJrYSBzbyBzbGFiXFx1MDBmZG0gbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJiXFx1MDBmYXJrYSBzIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiYlxcdTAwZmFya2Egc28gc2lsblxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInNpbG5cXHUwMGU5IG1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwic2xhYlxcdTAwZTkgcG9wXFx1MDE1NWNoYW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicG9wXFx1MDE1NWNoYW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwic2lsblxcdTAwZTkgcG9wXFx1MDE1NWNoYW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiamVtblxcdTAwZTkgbXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtaWVybnkgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwic2lsblxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVcXHUwMTNlbWkgc2lsblxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0clxcdTAwZTltbnkgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwibXJ6blxcdTAwZmFjaSBkXFx1MDBlMVxcdTAxN2VcXHUwMTBmXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJzbGFiXFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInNpbG5cXHUwMGUxIHByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJzbGFiXFx1MDBlOSBzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcInNpbG5cXHUwMGU5IHNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJkXFx1MDBlMVxcdTAxN2VcXHUwMTBmIHNvIHNuZWhvbVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25laG92XFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiaG1sYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZHltXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJvcGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJwaWVza292XFx1MDBlOVxcL3ByYVxcdTAxNjFuXFx1MDBlOSB2XFx1MDBlZHJ5XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJobWxhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJqYXNuXFx1MDBlMSBvYmxvaGFcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcInRha21lciBqYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicG9sb2phc25vXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJvYmxhXFx1MDEwZG5vXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJ6YW1yYVxcdTAxMGRlblxcdTAwZTlcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2tcXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJpa1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJ6aW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3JcXHUwMGZhY29cIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZldGVybm9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImtydXBvYml0aWVcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIk5hc3RhdmVuaWVcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkJlenZldHJpZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiU2xhYlxcdTAwZmQgdlxcdTAwZTFub2tcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkplbW5cXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiU3RyZWRuXFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxMGNlcnN0dlxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTaWxuXFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlNpbG5cXHUwMGZkIHZpZXRvciwgdGFrbWVyIHZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWXFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2lsblxcdTAwZTEgdlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJOaVxcdTAxMGRpdlxcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmlrXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImh1XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiSHVuZ2FyaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidmloYXIgZW55aGUgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ2aWhhciBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInZpaGFyIGhldmVzIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiZW55aGUgeml2YXRhclwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidmloYXJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImhldmVzIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJkdXJ2YSB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidmloYXIgZW55aGUgc3ppdFxcdTAwZTFsXFx1MDBlMXNzYWxcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInZpaGFyIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ2aWhhciBlclxcdTAxNTFzIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwic3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZjMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwielxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImVueWhlIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwia1xcdTAwZjZ6ZXBlcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhldmVzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibmFneW9uIGhldmVzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0clxcdTAwZTltIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDBmM25vcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImVueWhlIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJ6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiZXJcXHUwMTUxcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSB6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiZW55aGUgaGF2YXpcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiaGF2YXpcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZXJcXHUwMTUxcyBoYXZhelxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJoYXZhcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImhcXHUwMGYzelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImd5ZW5nZSBrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJob21va3ZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInRpc3p0YSBcXHUwMGU5Z2JvbHRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcImtldlxcdTAwZTlzIGZlbGhcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJzelxcdTAwZjNydlxcdTAwZTFueW9zIGZlbGhcXHUwMTUxemV0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJlclxcdTAxNTFzIGZlbGhcXHUwMTUxemV0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJib3JcXHUwMGZhcyBcXHUwMGU5Z2JvbHRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZFxcdTAwZjNcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyXFx1MDBmM3B1c2kgdmloYXJcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cnJpa1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJoXFx1MDE3MXZcXHUwMGY2c1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiZm9yclxcdTAwZjNcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInN6ZWxlc1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwialxcdTAwZTlnZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJOeXVnb2R0XCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDc2VuZGVzXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJFbnloZSBzemVsbFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkZpbm9tIHN6ZWxsXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiS1xcdTAwZjZ6ZXBlcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMGM5bFxcdTAwZTluayBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJFclxcdTAxNTFzIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkVyXFx1MDE1MXMsIG1cXHUwMGUxciB2aWhhcm9zIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiRXJcXHUwMTUxc2VuIHZpaGFyb3Mgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3pcXHUwMGU5bHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUb21ib2xcXHUwMGYzIHN6XFx1MDBlOWx2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmlrXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImNhXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2F0YWxhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJUZW1wZXN0YSBhbWIgcGx1amFcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlRlbXBlc3RhIGFtYiBwbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJUZW1wZXN0YSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJUZW1wZXN0YVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiVGVtcGVzdGEgZm9ydGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlRlbXBlc3RhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiVGVtcGVzdGEgYW1iIHBsdWdpbSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJUZW1wZXN0YSBhbWIgcGx1Z2luXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJUZW1wZXN0YSBhbWIgbW9sdCBwbHVnaW1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlBsdWdpbSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJQbHVnaW1cIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlBsdWdpbSBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlBsdWdpbSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJQbHVnaW1cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlBsdWdpbSBpbnRlbnNcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcIlBsdWphXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJQbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJQbHVnaW1cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlBsdWphXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJQbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJQbHVqYSBtb2x0IGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlBsdWphIGV4dHJlbWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlBsdWphIGdsYVxcdTAwZTdhZGFcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlBsdWphIHN1YXVcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlBsdWphIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIlBsdWphIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiTmV2YWRhIHN1YXVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIk5ldmFkYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIkFpZ3VhbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJQbHVqYSBkJ2FpZ3VhbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJQbHVnaW0gaSBuZXVcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcIlBsdWphIGkgbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJOZXZhZGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiTmV2YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJOZXZhZGEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiQm9pcmFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIkZ1bVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiQm9pcmluYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiU29ycmFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIkJvaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJTb3JyYVwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiUG9sc1wiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwiQ2VuZHJhIHZvbGNcXHUwMGUwbmljYVwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiWFxcdTAwZTBmZWNcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcIlRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIkNlbCBuZXRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIkxsZXVnZXJhbWVudCBlbm51dm9sYXRcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIk5cXHUwMGZhdm9scyBkaXNwZXJzb3NcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIk51dm9sb3NpdGF0IHZhcmlhYmxlXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJFbm51dm9sYXRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRlbXBlc3RhIHRyb3BpY2FsXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJhY1xcdTAwZTBcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIkZyZWRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIkNhbG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJWZW50XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJQZWRyYVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtYXRcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkJyaXNhIHN1YXVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyaXNhIGFncmFkYWJsZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJpc2EgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhIGZyZXNjYVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiQnJpc2NhIGZvcmFcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZlbnQgaW50ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVuZGF2YWwgc2V2ZXJcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBlc3RhXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YSB2aW9sZW50YVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVyYWNcXHUwMGUwXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJoclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNyb2F0aWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgc2xhYm9tIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJncm1samF2aW5za2Egb2x1amEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgamFrb20ga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInNsYWJhIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJqYWthIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib3JrYW5za2EgZ3JtbGphdmluc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJncm1samF2aW5za2Egb2x1amEgc2Egc2xhYm9tIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJncm1samF2aW5za2Egb2x1amEgcyByb3N1bGpvbVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiZ3JtbGphdmluc2thIG9sdWphIHNhIGpha29tIHJvc3Vsam9tXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJyb3N1bGphIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwicm9zdWxqYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwicm9zdWxqYSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJyb3N1bGphIHMga2lcXHUwMTYxb20gamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMTNcIjpcInBsanVza292aSBpIHJvc3VsamFcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcInJvc3VsamEgcyBqYWtpbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwicm9zdWxqYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJ1bWplcmVuYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJraVxcdTAxNjFhIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJ2cmxvIGpha2Ega2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZWtzdHJlbW5hIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImxlZGVuYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwbGp1c2FrIHNsYWJvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwicGxqdXNha1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicGxqdXNhayBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwib2x1am5hIGtpXFx1MDE2MWEgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwic2xhYmkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImd1c3RpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic3VzbmplXFx1MDE3ZWljYVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic3VzbmplXFx1MDE3ZWljYSBzIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJzbGFiYSBraVxcdTAxNjFhIGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJraVxcdTAxNjFhIGkgc25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJzbmlqZWcgcyBwb3ZyZW1lbmltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJzbmlqZWcgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwic25pamVnIHMgamFraW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcInN1bWFnbGljYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZGltXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJpem1hZ2xpY2FcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcImtvdml0bGFjaSBwaWplc2thIGlsaSBwcmFcXHUwMTYxaW5lXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJtYWdsYVwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwicGlqZXNha1wiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwicHJhXFx1MDE2MWluYVwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwidnVsa2Fuc2tpIHBlcGVvXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJ6YXB1c2kgdmpldHJhIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInZlZHJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJibGFnYSBuYW9ibGFrYVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwicmFcXHUwMTYxdHJrYW5pIG9ibGFjaVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiaXNwcmVraWRhbmkgb2JsYWNpXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJvYmxhXFx1MDEwZG5vXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9wc2thIG9sdWphXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiaGxhZG5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJ2cnVcXHUwMTA3ZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmpldHJvdml0b1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwidHVcXHUwMTBkYVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJsYWhvclwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwicG92amV0YXJhY1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwic2xhYiB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcInVtamVyZW4gdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJ1bWplcmVubyBqYWsgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJqYWsgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwMTdlZXN0b2sgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJvbHVqbmkgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJqYWsgb2x1am5pIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwib3JrYW5za2kgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJqYWsgb3JrYW5za2kgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJvcmthblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiYmxhbmtcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDYXRhbGFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc2MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc4MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMC4xMC4yMDE2LlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHdpbmRTcGVlZCA9IHtcclxuICAgIFwiZW5cIjp7XHJcbiAgICAgICAgXCJTZXR0aW5nc1wiOiB7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzAuMCwgMC4zXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMC0xICAgU21va2UgcmlzZXMgc3RyYWlnaHQgdXBcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJDYWxtXCI6IHtcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMC4zLCAxLjZdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxLTMgT25lIGNhbiBzZWUgZG93bndpbmQgb2YgdGhlIHNtb2tlIGRyaWZ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiTGlnaHQgYnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxLjYsIDMuM10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQtNiBPbmUgY2FuIGZlZWwgdGhlIHdpbmQuIFRoZSBsZWF2ZXMgb24gdGhlIHRyZWVzIG1vdmUsIHRoZSB3aW5kIGNhbiBsaWZ0IHNtYWxsIHN0cmVhbWVycy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJHZW50bGUgQnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFszLjQsIDUuNV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjctMTAgTGVhdmVzIGFuZCB0d2lncyBtb3ZlLiBXaW5kIGV4dGVuZHMgbGlnaHQgZmxhZyBhbmQgcGVubmFudHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJNb2RlcmF0ZSBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzUuNSwgOC4wXSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMTEtMTYgICBUaGUgd2luZCByYWlzZXMgZHVzdCBhbmQgbG9vc2UgcGFwZXJzLCB0b3VjaGVzIG9uIHRoZSB0d2lncyBhbmQgc21hbGwgYnJhbmNoZXMsIHN0cmV0Y2hlcyBsYXJnZXIgZmxhZ3MgYW5kIHBlbm5hbnRzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiRnJlc2ggQnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFs4LjAsIDEwLjhdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIxNy0yMSAgIFNtYWxsIHRyZWVzIGluIGxlYWYgYmVnaW4gdG8gc3dheS4gVGhlIHdhdGVyIGJlZ2lucyBsaXR0bGUgd2F2ZXMgdG8gcGVha1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlN0cm9uZyBicmVlemVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEwLjgsIDEzLjldLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIyMi0yNyAgIExhcmdlIGJyYW5jaGVzIGFuZCBzbWFsbGVyIHRyaWJlcyBtb3Zlcy4gVGhlIHdoaXogb2YgdGVsZXBob25lIGxpbmVzLiBJdCBpcyBkaWZmaWN1bHQgdG8gdXNlIHRoZSB1bWJyZWxsYS4gQSByZXNpc3RhbmNlIHdoZW4gcnVubmluZy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTMuOSwgMTcuMl0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjI4LTMzICAgV2hvbGUgdHJlZXMgaW4gbW90aW9uLiBJdCBpcyBoYXJkIHRvIGdvIGFnYWluc3QgdGhlIHdpbmQuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiR2FsZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMTcuMiwgMjAuN10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjM0LTQwICAgVGhlIHdpbmQgYnJlYWsgdHdpZ3Mgb2YgdHJlZXMuIEl0IGlzIGhhcmQgdG8gZ28gYWdhaW5zdCB0aGUgd2luZC5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJTZXZlcmUgR2FsZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjAuOCwgMjQuNV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQxLTQ3ICAgQWxsIGxhcmdlIHRyZWVzIHN3YXlpbmcgYW5kIHRocm93cy4gVGlsZXMgY2FuIGJsb3cgZG93bi5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJTdG9ybVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjQuNSwgMjguNV0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjQ4LTU1ICAgUmFyZSBpbmxhbmQuIFRyZWVzIHVwcm9vdGVkLiBTZXJpb3VzIGRhbWFnZSB0byBob3VzZXMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiVmlvbGVudCBTdG9ybVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMjguNSwgMzIuN10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjU2LTYzICAgT2NjdXJzIHJhcmVseSBhbmQgaXMgZm9sbG93ZWQgYnkgZGVzdHJ1Y3Rpb24uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiSHVycmljYW5lXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFszMi43LCA2NF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIk9jY3VycyB2ZXJ5IHJhcmVseS4gVW51c3VhbGx5IHNldmVyZSBkYW1hZ2UuXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07LyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cclxuICovXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDEzLjEwLjIwMTYuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3JXaWRnZXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYmFzZVVSTCA9ICd0aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20nO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0RDNTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL2xpYnMvZDMubWluLmpzYDtcclxuICAgICAgICB0aGlzLnNjcmlwdFNSQyA9IGAke3RoaXMuYmFzZVVSTH0vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzYDtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldCA9IHtcclxuICAgICAgICAgICAgLy8g0J/QtdGA0LLQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgICAgICAgICBjaXR5TmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1sZWZ0LW1lbnVfX2hlYWRlcicpLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX19udW1iZXInKSxcclxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbWVhbnMnKSxcclxuICAgICAgICAgICAgd2luZFNwZWVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX3dpbmQnKSxcclxuICAgICAgICAgICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX2ltZycpLFxyXG4gICAgICAgICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYWxlbmRhcl9faXRlbScpLFxyXG4gICAgICAgICAgICBncmFwaGljOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpLFxyXG4gICAgICAgICAgICAvLyDQktGC0L7RgNCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXHJcbiAgICAgICAgICAgIGNpdHlOYW1lMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fdGl0bGUnKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmUyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fdGVtcGVyYXR1cmUnKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmVGZWVsczogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX2ZlZWxzJyksXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWluOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1taW4nKSxcclxuICAgICAgICAgICAgdGVtcGVyYXR1cmVNYXg6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0LWNhcmRfX3RlbXBlcmF0dXJlLW1heCcpLFxyXG4gICAgICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtcmlnaHRfX2Rlc2NyaXB0aW9uJyksXHJcbiAgICAgICAgICAgIHdpbmRTcGVlZDI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X193aW5kLXNwZWVkJyksXHJcbiAgICAgICAgICAgIG1haW5JY29uV2VhdGhlcjI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19pY29uJyksXHJcbiAgICAgICAgICAgIGh1bWlkaXR5OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faHVtaWRpdHknKSxcclxuICAgICAgICAgICAgcHJlc3N1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19wcmVzc3VyZScpLFxyXG4gICAgICAgICAgICBkYXRlUmVwb3J0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LXJpZ2h0X19kYXRlJyksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XHJcblxyXG4gICAgICAgIC8vINC+0LHRitC10LrRgi3QutCw0YDRgtCwINC00LvRjyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjRjyDQstGB0LXRhSDQstC40LTQttC10YLQvtCyINGBINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsFxyXG4gICAgICAgIHRoaXMubWFwV2lkZ2V0cyA9IHtcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTMtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDQpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC02LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg2KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTctcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogNyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDcpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiA4LFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC05LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTEsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxMSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMi1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAxMixcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDEzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTUsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTYsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNyksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOC1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTgsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMTksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyMSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxKSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC13aGl0ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogMjIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgaWQ6IDIzLFxyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjMpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAyNCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDI0KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoaWQpIHsgICAgICAgIFxyXG4gICAgICAgIGlmKGlkICYmICh0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWQgfHwgdGhpcy5wYXJhbXNXaWRnZXQuY2l0eU5hbWUpICYmIHRoaXMucGFyYW1zV2lkZ2V0LmFwcGlkKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2RlID0gJyc7XHJcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGlkKSA9PT0gMSB8fCBwYXJzZUludChpZCkgPT09IDExIHx8IHBhcnNlSW50KGlkKSA9PT0gMjEpIHtcclxuICAgICAgICAgICAgICAgIGNvZGUgPSBgPHNjcmlwdCBzcmM9J2h0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy9kMy5taW4uanMnPjwvc2NyaXB0PmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGAke2NvZGV9PGRpdiBpZD0nb3BlbndlYXRoZXJtYXAtd2lkZ2V0Jz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvamF2YXNjcmlwdCc+XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAke2lkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eWlkOiAke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGlkOiAnJHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZC5yZXBsYWNlKGAyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2N2AsJycpfScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0JyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gJ2h0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJbml0aWFsU3RhdGVGb3JtKGNpdHlJZD01MjQ5MDEsIGNpdHlOYW1lPSdNb3Njb3cnKSB7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgICAgICAgICBjaXR5SWQ6IGNpdHlJZCxcclxuICAgICAgICAgICAgY2l0eU5hbWU6IGNpdHlOYW1lLFxyXG4gICAgICAgICAgICBsYW5nOiAnZW4nLFxyXG4gICAgICAgICAgICBhcHBpZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKS52YWx1ZSB8fCAgJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxyXG4gICAgICAgICAgICB0ZXh0VW5pdFRlbXA6IFN0cmluZy5mcm9tQ29kZVBvaW50KDB4MDBCMCksICAvLyAyNDhcclxuICAgICAgICAgICAgYmFzZVVSTDogdGhpcy5iYXNlVVJMLFxyXG4gICAgICAgICAgICB1cmxEb21haW46ICdodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZycsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxyXG4gICAgICAgIHRoaXMuY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jaXR5Jyk7XHJcblxyXG4gICAgICAgIHRoaXMudXJscyA9IHtcclxuICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXI/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICBwYXJhbXNVcmxGb3JlRGFpbHk6IGAke3RoaXMucGFyYW1zV2lkZ2V0LnVybERvbWFpbn0vZGF0YS8yLjUvZm9yZWNhc3QvZGFpbHk/aWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5jaXR5SWR9JnVuaXRzPSR7dGhpcy5wYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7dGhpcy5wYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IGAke3RoaXMuYmFzZVVSTH0vZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvbmAsXHJcbiAgICAgICAgd2luZERpcmVjdGlvbjogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbmAsXHJcbiAgICAgICAgY2xvdWRzOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvY2xvdWRzLWRhdGEuanNvbmAsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGAke3RoaXMuYmFzZVVSTH0vZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uYCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuXHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcclxuXHJcbi8qKlxyXG4g0JPRgNCw0YTQuNC6INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0Lgg0L/QvtCz0L7QtNGLXHJcbiBAY2xhc3MgR3JhcGhpY1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpYyBleHRlbmRzIEN1c3RvbURhdGUge1xyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uID0gZDMubGluZSgpXHJcbiAgICAueCgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC54O1xyXG4gICAgfSlcclxuICAgIC55KChkKSA9PiB7XHJcbiAgICAgIHJldHVybiBkLnk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDQtNCw0L3QvdGL0YUg0LIg0LzQsNGB0YHQuNCyINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcclxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICovXHJcbiAgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBjb25zdCByYXdEYXRhID0gW107XHJcblxyXG4gICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIHJhd0RhdGEucHVzaCh7IHg6IGksIGRhdGU6IGksIG1heFQ6IGVsZW0ubWF4LCBtaW5UOiBlbGVtLm1pbiB9KTtcclxuICAgICAgaSArPSAxOyAvLyDQodC80LXRidC10L3QuNC1INC/0L4g0L7RgdC4IFhcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByYXdEYXRhO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgbWFrZVNWRygpIHtcclxuICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5wYXJhbXMuaWQpLmFwcGVuZCgnc3ZnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMnKVxyXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLnBhcmFtcy53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsICcjZmZmZmZmJyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xyXG4gICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cclxuICAqL1xyXG4gIGdldE1pbk1heERhdGUocmF3RGF0YSkge1xyXG4gICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtYXhEYXRlOiAwLFxyXG4gICAgICBtaW5EYXRlOiAxMDAwMCxcclxuICAgIH07XHJcblxyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSB7XHJcbiAgICAgICAgZGF0YS5taW5EYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgKiBbZ2V0TWluTWF4RGF0ZVRlbXBlcmF0dXJlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcblxyXG4gIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMTAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5taW5UKSB7XHJcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLm1pblQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ubWF4VCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSkge1xyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWluOiAwLFxyXG4gICAgICBtYXg6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5yYWluZmFsbEFtb3VudCkge1xyXG4gICAgICAgIGRhdGEubWF4ID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIG1ha2VBeGVzWFkocmF3RGF0YSwgcGFyYW1zKSB7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICBjb25zdCB4QXhpc0xlbmd0aCA9IHBhcmFtcy53aWR0aCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcbiAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBZID0g0LLRi9GB0L7RgtCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YMg0Lgg0YHQvdC40LfRg1xyXG4gICAgY29uc3QgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gKDIgKiBwYXJhbXMubWFyZ2luKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcclxuICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cclxuICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAqL1xyXG4gIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXggKyA1LCBtaW4gLSA1XSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIG1pblQ6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcclxuICB9XHJcblxyXG4gIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbikge1xyXG4gICAgY29uc3QgeyBtYXhEYXRlLCBtaW5EYXRlIH0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgIGNvbnN0IHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgIGNvbnN0IHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuXHJcbiAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGRhdGEucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sXHJcbiAgICAgICAgaHVtaWRpdHk6IHNjYWxlWShlbGVtLmh1bWlkaXR5KSArIG1hcmdpbixcclxuICAgICAgICByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luLFxyXG4gICAgICAgIGNvbG9yOiBlbGVtLmNvbG9yLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XHJcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKSB7XHJcbiAgICBjb25zdCBhcnJQb2x5bGluZSA9IFtdO1xyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSB9LFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGFyclBvbHlsaW5lLnB1c2goe1xyXG4gICAgICB4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgIHk6IHNjYWxlWShkYXRhW2RhdGEubGVuZ3RoIC0gMV0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WSxcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIGRyYXdQb2x5bGluZShzdmcsIGRhdGEpIHtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcclxuXHJcbiAgICBzdmcuYXBwZW5kKCdnJykuYXBwZW5kKCdwYXRoJylcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoJ2QnLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ2ZpbGwnLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQtNC/0LjRgdC10Lkg0YEg0L/QvtC60LDQt9Cw0YLQtdC70Y/QvNC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0L3QsCDQvtGB0Y/RhVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgKi9cclxuICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpIHtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSkgPT4ge1xyXG4gICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5tYXhUIC0gMikgLSAocGFyYW1zLm9mZnNldFggLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1heH3CsGApO1xyXG5cclxuICAgICAgc3ZnLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgIC5hdHRyKCd4JywgZWxlbS54KVxyXG4gICAgICAuYXR0cigneScsIChlbGVtLm1pblQgKyA3KSArIChwYXJhbXMub2Zmc2V0WSAvIDIpKVxyXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnN0eWxlKCdmaWxsJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnRleHQoYCR7cGFyYW1zLmRhdGFbaXRlbV0ubWlufcKwYCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICBjb25zdCB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH0gPSB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgY29uc3QgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgdGhpcy5kcmF3UG9seWxpbmUoc3ZnLCBwb2x5bGluZSk7XHJcbiAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICAvLyB0aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxyZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xyICAgIHZhciBnZW5lcmF0b3IgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XHIgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcm0tbGFuZGluZy13aWRnZXQnKTtcciAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpO1xyICAgIGNvbnN0IHBvcHVwQ2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9wdXAtY2xvc2UnKTtcciAgICBjb25zdCBjb250ZW50SlNHZW5lcmF0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWNvZGUtZ2VuZXJhdGUnKTtcciAgICBjb25zdCBjb3B5Q29udGVudEpTQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5LWpzLWNvZGUnKTtcciAgICBjb25zdCBhcGlLZXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpO1xyXHIgICAgLy8g0KTQuNC60YHQuNGA0YPQtdC8INC60LvQuNC60Lgg0L3QsCDRhNC+0YDQvNC1LCDQuCDQvtGC0LrRgNGL0LLQsNC10LwgcG9wdXAg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDXHIgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHIgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHIgICAgICAgIGlmKGV2ZW50LnRhcmdldC5pZCAmJiBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpKSB7XHIgICAgICAgICAgICBjb25zdCBnZW5lcmF0ZVdpZGdldCA9IG5ldyBHZW5lcmF0b3JXaWRnZXQoKTtcciAgICAgICAgICAgIGdlbmVyYXRlV2lkZ2V0LnNldEluaXRpYWxTdGF0ZUZvcm0od2luZG93LmNpdHlJZCwgd2luZG93LmNpdHlOYW1lKTsgICAgICAgICBcciAgICAgICAgICAgIFxyICAgICAgICAgICAgXHIgICAgICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gZ2VuZXJhdGVXaWRnZXQuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGdlbmVyYXRlV2lkZ2V0Lm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnaWQnXSk7XHIgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKSB7XHIgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLXZpc2libGUnKTtcciAgICAgICAgICAgICAgICBzd2l0Y2goZ2VuZXJhdG9yLm1hcFdpZGdldHNbZXZlbnQudGFyZ2V0LmlkXVsnc2NoZW1hJ10pIHtcciAgICAgICAgICAgICAgICAgICAgY2FzZSAnYmx1ZSc6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYnJvd24nKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoJ3BvcHVwLS1icm93bicpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tYmx1ZScpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtLWJsdWUnKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdub25lJzpcciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJyb3duJykpIHtcciAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tYnJvd24nKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygncG9wdXAtLWJsdWUnKSkge1xyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS1ibHVlJyk7XHIgICAgICAgICAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICB9XHIgICAgICAgICAgICBcciAgICAgICAgfVxyICAgIH0pO1xyXHIgICAgLy8g0JfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60YDQtdGB0YLQuNC6XHIgICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKVxyICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLS12aXNpYmxlJyk7XHIgICAgfSk7XHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcciAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgLy92YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyICAgICAgICAvL3JhbmdlLnNlbGVjdE5vZGUoY29udGVudEpTR2VuZXJhdGlvbik7XHIgICAgICAgIC8vd2luZG93LmdldFNlbGVjdGlvbigpLmFkZFJhbmdlKHJhbmdlKTtcciAgICAgICAgY29udGVudEpTR2VuZXJhdGlvbi5zZWxlY3QoKTtcclxyICAgICAgICB0cnl7XHIgICAgICAgICAgICBjb25zdCB0eHRDb3B5ID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcciAgICAgICAgICAgIHZhciBtc2cgPSB0eHRDb3B5ID8gJ3N1Y2Nlc3NmdWwnIDogJ3Vuc3VjY2Vzc2Z1bCc7XHIgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29weSBlbWFpbCBjb21tYW5kIHdhcyAnICsgbXNnKTtcciAgICAgICAgfVxyICAgICAgICBjYXRjaChlKXtcciAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQntGI0LjQsdC60LAg0LrQvtC/0LjRgNC+0LLQsNC90LjRjyAke2UuZXJyTG9nVG9Db25zb2xlfWApO1xyICAgICAgICB9XHJcciAgICAgICAgLy8g0KHQvdGP0YLQuNC1INCy0YvQtNC10LvQtdC90LjRjyAtINCS0J3QmNCc0JDQndCY0JU6INCy0Ysg0LTQvtC70LbQvdGLINC40YHQv9C+0LvRjNC30L7QstCw0YLRjFxyICAgICAgICAvLyByZW1vdmVSYW5nZShyYW5nZSkg0LrQvtCz0LTQsCDRjdGC0L4g0LLQvtC30LzQvtC20L3QvlxyICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHIgICAgfSk7XHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5kaXNhYmxlZCA9ICFkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQoJ2NvcHknKTtccn0pO1xyXHIiLCIvLyDQnNC+0LTRg9C70Ywg0LTQuNGB0L/QtdGC0YfQtdGAINC00LvRjyDQvtGC0YDQuNGB0L7QstC60Lgg0LHQsNC90L3QtdGA0YDQvtCyINC90LAg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1XHJcbmltcG9ydCBDaXRpZXMgZnJvbSAnLi9jaXRpZXMnO1xyXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cclxuICAgIC8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcclxuICAgIGNvbnN0IGNpdHlOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpO1xyXG4gICAgY29uc3QgY2l0aWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdGllcycpO1xyXG4gICAgY29uc3Qgc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG5cclxuICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICBvYmpDaXRpZXMuZ2V0Q2l0aWVzKCk7XHJcblxyXG5cclxuICAgIHNlYXJjaENpdHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWUsIGNpdGllcyk7XHJcbiAgICAgIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuXHJcbmltcG9ydCBDdXN0b21EYXRlIGZyb20gJy4vY3VzdG9tLWRhdGUnO1xyXG5pbXBvcnQgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMtZDNqcyc7XHJcbmltcG9ydCAqIGFzIG5hdHVyYWxQaGVub21lbm9uICBmcm9tICcuL2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEnO1xyXG5pbXBvcnQgKiBhcyB3aW5kU3BlZWQgZnJvbSAnLi9kYXRhL3dpbmQtc3BlZWQtZGF0YSc7XHJcbmltcG9ydCAqIGFzIHdpbmREaXJlY3Rpb24gZnJvbSAnLi9kYXRhL3dpbmQtc3BlZWQtZGF0YSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWF0aGVyV2lkZ2V0IGV4dGVuZHMgQ3VzdG9tRGF0ZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBhcmFtcywgY29udHJvbHMsIHVybHMpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcclxuICAgIHRoaXMudXJscyA9IHVybHM7XHJcblxyXG4gICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcclxuICAgIHRoaXMud2VhdGhlciA9IHtcclxuICAgICAgZnJvbUFQSToge1xyXG4gICAgICAgIGNvb3JkOiB7XHJcbiAgICAgICAgICBsb246ICcwJyxcclxuICAgICAgICAgIGxhdDogJzAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2VhdGhlcjogW3tcclxuICAgICAgICAgIGlkOiAnICcsXHJcbiAgICAgICAgICBtYWluOiAnICcsXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJyAnLFxyXG4gICAgICAgICAgaWNvbjogJyAnLFxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIGJhc2U6ICcgJyxcclxuICAgICAgICBtYWluOiB7XHJcbiAgICAgICAgICB0ZW1wOiAwLFxyXG4gICAgICAgICAgcHJlc3N1cmU6ICcgJyxcclxuICAgICAgICAgIGh1bWlkaXR5OiAnICcsXHJcbiAgICAgICAgICB0ZW1wX21pbjogJyAnLFxyXG4gICAgICAgICAgdGVtcF9tYXg6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdpbmQ6IHtcclxuICAgICAgICAgIHNwZWVkOiAwLFxyXG4gICAgICAgICAgZGVnOiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByYWluOiB7fSxcclxuICAgICAgICBjbG91ZHM6IHtcclxuICAgICAgICAgIGFsbDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZHQ6ICcnLFxyXG4gICAgICAgIHN5czoge1xyXG4gICAgICAgICAgdHlwZTogJyAnLFxyXG4gICAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICAgIG1lc3NhZ2U6ICcgJyxcclxuICAgICAgICAgIGNvdW50cnk6ICcgJyxcclxuICAgICAgICAgIHN1bnJpc2U6ICcgJyxcclxuICAgICAgICAgIHN1bnNldDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICBuYW1lOiAnVW5kZWZpbmVkJyxcclxuICAgICAgICBjb2Q6ICcgJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgKiBAcGFyYW0gdXJsXHJcbiAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICovXHJcbiAgaHR0cEdldCh1cmwpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xyXG4gICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCX0LDQv9GA0L7RgSDQuiBBUEkg0LTQu9GPINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YUg0YLQtdC60YPRidC10Lkg0L/QvtCz0L7QtNGLXHJcbiAgICovXHJcbiAgZ2V0V2VhdGhlckZyb21BcGkoKSB7XHJcbiAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gbmF0dXJhbFBoZW5vbWVub24ubmF0dXJhbFBoZW5vbWVub25bdGhpcy5wYXJhbXMubGFuZ10uZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHdpbmRTcGVlZC53aW5kU3BlZWRbdGhpcy5wYXJhbXMubGFuZ107XHJcbiAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INGB0LXQu9C10LrRgtC+0YAg0L/QviDQt9C90LDRh9C10L3QuNGOINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQsiBKU09OXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IEpTT05cclxuICAgKiBAcGFyYW0ge3ZhcmlhbnR9IGVsZW1lbnQg0JfQvdCw0YfQtdC90LjQtSDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCwg0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINC00LvRjyDQv9C+0LjRgdC60LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L5cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWxlbWVudE5hbWUg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwLNC00LvRjyDQv9C+0LjRgdC60LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICogQHJldHVybiB7c3RyaW5nfSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgKi9cclxuICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgIGlmICh0eXBlb2Ygb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdID09PSAnb2JqZWN0JyAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwINGBINC00LLRg9C80Y8g0Y3Qu9C10LzQtdC90YLQsNC80Lgg0LIgSlNPTlxyXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnROYW1lMiAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZTJdKSB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgcGFyc2VEYXRhRnJvbVNlcnZlcigpIHtcclxuICAgIGNvbnN0IHdlYXRoZXIgPSB0aGlzLndlYXRoZXI7XHJcblxyXG4gICAgaWYgKHdlYXRoZXIuZnJvbUFQSS5uYW1lID09PSAnVW5kZWZpbmVkJyB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSAnNDA0Jykge1xyXG4gICAgICBjb25zb2xlLmxvZygn0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7XHJcbiAgICAgIGNsb3VkaW5lc3M6ICcgJyxcclxuICAgICAgZHQ6ICcgJyxcclxuICAgICAgY2l0eU5hbWU6ICcgJyxcclxuICAgICAgaWNvbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZTogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1pbjogJyAnLFxyXG4gICAgICB0ZW1wZXJhdHVyZU1BeDogJyAnLFxyXG4gICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICBodW1pZGl0eTogJyAnLFxyXG4gICAgICBzdW5yaXNlOiAnICcsXHJcbiAgICAgIHN1bnNldDogJyAnLFxyXG4gICAgICBjb29yZDogJyAnLFxyXG4gICAgICB3aW5kOiAnICcsXHJcbiAgICAgIHdlYXRoZXI6ICcgJyxcclxuICAgIH07XHJcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSwgMTApICsgMDtcclxuICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmUgPSB0ZW1wZXJhdHVyZTsgLy8gYCR7dGVtcCA+IDAgPyBgKyR7dGVtcH1gIDogdGVtcH1gO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNaW4gPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21pbi50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEudGVtcGVyYXR1cmVNYXggPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wX21heC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgaWYgKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pIHtcclxuICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIud2luZFNwZWVkKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIud2luZFNwZWVkLCB3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpLCAnc3BlZWRfaW50ZXJ2YWwnKX1gO1xyXG4gICAgICBtZXRhZGF0YS53aW5kU3BlZWQyID0gYCR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zYDtcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLndpbmREaXJlY3Rpb24pIHtcclxuICAgICAgbWV0YWRhdGEud2luZERpcmVjdGlvbiA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl0sIFwiZGVnX2ludGVydmFsXCIpfWBcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLmNsb3Vkcykge1xyXG4gICAgICBtZXRhZGF0YS5jbG91ZHMgPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyLmNsb3Vkcywgd2VhdGhlci5mcm9tQVBJLmNsb3Vkcy5hbGwsICdtaW4nLCAnbWF4Jyl9YDtcclxuICAgIH1cclxuXHJcbiAgICBtZXRhZGF0YS5odW1pZGl0eSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLmh1bWlkaXR5fSVgO1xyXG4gICAgbWV0YWRhdGEucHJlc3N1cmUgPSAgYCR7d2VhdGhlcltcImZyb21BUElcIl1bXCJtYWluXCJdW1wicHJlc3N1cmVcIl19IG1iYDtcclxuICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pY29ufWA7XHJcblxyXG4gICAgdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyV2lkZ2V0KG1ldGFkYXRhKSB7XHJcbiAgICAvLyDQntC+0YLRgNC40YHQvtCy0LrQsCDQv9C10YDQstGL0YUg0YfQtdGC0YvRgNC10YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuIGNsYXNzPSd3ZWF0aGVyLWxlZnQtY2FyZF9fZGVncmVlJz4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINCe0YLRgNC40YHQvtCy0LrQsCDQv9GP0YLQuCDQv9C+0YHQu9C10LTQvdC40YUg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWUyW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLmNpdHlOYW1lO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHMuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlRmVlbHNbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW5bZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heCkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXhbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2VhdGhlcikge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZDIgJiYgbWV0YWRhdGEud2luZERpcmVjdGlvbikge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWQyW2VsZW1dLmlubmVyVGV4dCA9IGAke21ldGFkYXRhLndpbmRTcGVlZDJ9ICR7bWV0YWRhdGEud2luZERpcmVjdGlvbn1gO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLmh1bWlkaXR5KSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmh1bWlkaXR5KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuaHVtaWRpdHkuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMuaHVtaWRpdHlbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEuaHVtaWRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLnByZXNzdXJlKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnByZXNzdXJlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMucHJlc3N1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMucHJlc3N1cmVbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEucHJlc3N1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDQn9GA0L7Qv9C40YHRi9Cy0LDQtdC8INGC0LXQutGD0YnRg9GOINC00LDRgtGDINCyINCy0LjQtNC20LXRgtGLXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5kYXRlUmVwb3J0KSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnQuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnRbZWxlbV0uaW5uZXJUZXh0ID0gdGhpcy5nZXRUaW1lRGF0ZUhITU1Nb250aERheSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSkge1xyXG4gICAgICB0aGlzLnByZXBhcmVEYXRhRm9yR3JhcGhpYygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJlcGFyZURhdGFGb3JHcmFwaGljKCkge1xyXG4gICAgY29uc3QgYXJyID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3QpIHtcclxuICAgICAgY29uc3QgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpKTtcclxuICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgIG1pbjogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWluKSxcclxuICAgICAgICBtYXg6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXHJcbiAgICAgICAgZGF5OiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgaWNvbjogdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS53ZWF0aGVyWzBdLmljb24sXHJcbiAgICAgICAgZGF0ZTogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XHJcbiAgICogQHBhcmFtIGRhdGFcclxuICAgKi9cclxuICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMTBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDIwXS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbiwgY29sb3IgPSBmYWxzZSkge1xyXG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XHJcbiAgICBjb25zdCBtYXBJY29ucyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBpZiAoIWNvbG9yKSB7XHJcbiAgICAgIC8vXHJcbiAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDJkJywgJzAyZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDRkJywgJzA0ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDVkJywgJzA1ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDdkJywgJzA3ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDhkJywgJzA4ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTBkJywgJzEwZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTFkJywgJzExZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XHJcbiAgICAgIC8vINCd0L7Rh9C90YvQtVxyXG4gICAgICBtYXBJY29ucy5zZXQoJzAxbicsICcwMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA1bicsICcwNWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA2bicsICcwNmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA4bicsICcwOGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA5bicsICcwOWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzExbicsICcxMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEzbicsICcxM2RidycpO1xyXG5cclxuICAgICAgaWYgKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5wYXJhbXMuYmFzZVVSTH0vaW1nL3dpZGdldHMvJHttYXBJY29ucy5nZXQobmFtZUljb24pfS5wbmdgO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bmFtZUljb259LnBuZ2A7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgKi9cclxuICBkcmF3R3JhcGhpY0QzKGRhdGEpIHtcclxuICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpO1xyXG5cclxuICAgIC8vINCe0YfQuNGB0YLQutCwINC60L7QvdGC0LXQudC90LXRgNC+0LIg0LTQu9GPINCz0YDQsNGE0LjQutC+0LIgICAgXHJcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JhcGhpYycpO1xyXG4gICAgY29uc3Qgc3ZnMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMScpO1xyXG4gICAgY29uc3Qgc3ZnMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljMicpO1xyXG5cclxuICAgIGlmKHN2Zy5xdWVyeVNlbGVjdG9yKCdzdmcnKSkge1xyXG4gICAgICBzdmcucmVtb3ZlQ2hpbGQoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzEucXVlcnlTZWxlY3Rvcignc3ZnJykpIHtcclxuICAgICAgc3ZnMS5yZW1vdmVDaGlsZChzdmcxLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKTtcclxuICAgIH1cclxuICAgIGlmKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpe1xyXG4gICAgICBzdmcyLnJlbW92ZUNoaWxkKHN2ZzIucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBpZDogJyNncmFwaGljJyxcclxuICAgICAgZGF0YSxcclxuICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICB3aWR0aDogNDIwLFxyXG4gICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgY29sb3JQb2xpbHluZTogJyMzMzMnLFxyXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxyXG4gICAgICBmb250Q29sb3I6ICcjMzMzJyxcclxuICAgICAgc3Ryb2tlV2lkdGg6ICcxcHgnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgbGV0IG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcblxyXG4gICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMxJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNEREY3MzAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMyJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAqL1xyXG4gIGRyYXdHcmFwaGljKGFycikge1xyXG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGggPSA0NjU7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDYwMCwgMzAwKTtcclxuXHJcbiAgICBjb250ZXh0LmZvbnQgPSAnT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4JztcclxuXHJcbiAgICBsZXQgc3RlcCA9IDU1O1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3Qgem9vbSA9IDQ7XHJcbiAgICBjb25zdCBzdGVwWSA9IDY0O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0VXAgPSA1ODtcclxuICAgIGNvbnN0IHN0ZXBZVGV4dERvd24gPSA3NTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBzdGVwID0gNTU7XHJcbiAgICBpID0gMDtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgaSArPSAxO1xyXG4gICAgd2hpbGUgKGkgPCBhcnIubGVuZ3RoKSB7XHJcbiAgICAgIHN0ZXAgKz0gNTU7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzMzMyc7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
