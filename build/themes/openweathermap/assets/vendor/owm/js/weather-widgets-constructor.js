(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Denis on 21.10.2016.
 */
var Cities = function () {
    function Cities(cityName, container, cityId) {
        _classCallCheck(this, Cities);

        if (!cityName) {
            return false;
        }
        this.url = 'http://openweathermap.org/data/2.5/find?callback=?&q=Moscow&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1';
        this.cityName = cityName;
        this.container = container;
        this.cityId = cityId;
    }

    _createClass(Cities, [{
        key: 'getCities',
        value: function getCities() {
            var _this = this;

            if (!this.cityName) return null;

            this.httpGet(this.url).then(function (response) {
                _this.getSearchData(response);
            }, function (error) {
                console.log('Возникла ошибка ' + error);
            });
        }
    }, {
        key: 'getSearchData',
        value: function getSearchData(JSONobject) {
            //console.log( JSONobject  );
            //JSONobject = ParseJson(JSONtext);

            var city = JSONobject.list;
            if (city.length == 0) {
                ShowAlertMess('not found');
                return;
            }

            var html = '';

            for (var i = 0; i < JSONobject.list.length; i++) {

                var name = JSONobject.list[i].name + ', ' + JSONobject.list[i].sys.country;

                var temp = Math.round(10 * (JSONobject.list[i].main.temp - 273.15)) / 10;
                var tmin = Math.round(10 * (JSONobject.list[i].main.temp_min - 273.15)) / 10;
                var tmax = Math.round(10 * (JSONobject.list[i].main.temp_max - 273.15)) / 10;

                var text = JSONobject.list[i].weather[0].description;
                var img = "http://openweathermap.org/img/w/" + JSONobject.list[i].weather[0].icon + ".png";
                var flag = "http://openweathermap.org/images/flags/" + JSONobject.list[i].sys.country.toLowerCase() + ".png";
                var gust = JSONobject.list[i].wind.speed;
                var pressure = JSONobject.list[i].main.pressure;
                var cloud = JSONobject.list[i].clouds.all;

                html += '<tr><td><b><a href="/city/' + JSONobject.list[i].id + '" id="' + JSONobject.list[i].id + '">' + name + '</a></b><img src="' + flag + '"></p></td></tr>';
            }

            html = '<table class="table" id="table-cities">' + html + '</table>';

            this.container.insertAdjacentHTML('afterbegin', html);

            var tableCities = document.getElementById('table-cities');
            var that = this;
            tableCities.addEventListener('click', function (event) {
                event.preventDefault();
                that.cityId.value = event.target.id;
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
                        resolve(JSON.parse(this.response.substring(2, this.response.length - 1)));
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

},{}],2:[function(require,module,exports){
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
        var id = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var city_id = arguments.length <= 1 || arguments[1] === undefined ? 524901 : arguments[1];
        var key = arguments.length <= 2 || arguments[2] === undefined ? '2d90837ddbaeda36ab487f257829b667' : arguments[2];

        _classCallCheck(this, GeneratorWidget);

        this.baseURL = 'http://openweathermap.org/themes/openweathermap/assets/vendor/owm';
        this.scriptD3SRC = this.baseURL + '/js/libs/d3.min.js';
        this.scriptSRC = this.baseURL + '/js/weather-widget-generator.js';

        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue': {
                code: '<script src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>\n                       ' + this.getCodeForGenerateWidget(1, city_id, key),
                schema: 'blue'
            },
            'widget-2-left-blue': {
                code: this.getCodeForGenerateWidget(2, city_id, key),
                schema: 'blue'
            },
            'widget-3-left-blue': {
                code: this.getCodeForGenerateWidget(3, city_id, key),
                schema: 'blue'
            },
            'widget-4-left-blue': {
                code: this.getCodeForGenerateWidget(4, city_id, key),
                schema: 'blue'
            },
            'widget-5-right-blue': {
                code: this.getCodeForGenerateWidget(5, city_id, key),
                schema: 'blue'
            },
            'widget-6-right-blue': {
                code: this.getCodeForGenerateWidget(6, city_id, key),
                schema: 'blue'
            },
            'widget-7-right-blue': {
                code: this.getCodeForGenerateWidget(7, city_id, key),
                schema: 'blue'
            },
            'widget-8-right-blue': {
                code: this.getCodeForGenerateWidget(8, city_id, key),
                schema: 'blue'
            },
            'widget-9-right-blue': {
                code: this.getCodeForGenerateWidget(9, city_id, key),
                schema: 'blue'
            },
            'widget-1-left-brown': {
                code: '<script src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>\n                       ' + this.getCodeForGenerateWidget(11, city_id, key),
                schema: 'brown'
            },
            'widget-2-left-brown': {
                code: this.getCodeForGenerateWidget(12, city_id, key),
                schema: 'brown'
            },
            'widget-3-left-brown': {
                code: this.getCodeForGenerateWidget(13, city_id, key),
                schema: 'brown'
            },
            'widget-4-left-brown': {
                code: this.getCodeForGenerateWidget(14, city_id, key),
                schema: 'brown'
            },
            'widget-5-right-brown': {
                code: this.getCodeForGenerateWidget(15, city_id, key),
                schema: 'brown'
            },
            'widget-6-right-brown': {
                code: this.getCodeForGenerateWidget(16, city_id, key),
                schema: 'brown'
            },
            'widget-7-right-brown': {
                code: this.getCodeForGenerateWidget(17, city_id, key),
                schema: 'brown'
            },
            'widget-8-right-brown': {
                code: this.getCodeForGenerateWidget(18, city_id, key),
                schema: 'brown'
            },
            'widget-9-right-brown': {
                code: this.getCodeForGenerateWidget(19, city_id, key),
                schema: 'brown'
            },
            'widget-1-left-white': {
                code: '<script src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/d3.min.js"></script>\n                       ' + this.getCodeForGenerateWidget(21, city_id, key),
                schema: 'none'
            },
            'widget-2-left-white': {
                code: this.getCodeForGenerateWidget(22, city_id, key),
                schema: 'none'
            },
            'widget-3-left-white': {
                code: this.getCodeForGenerateWidget(23, city_id, key),
                schema: 'none'
            },
            'widget-4-left-white': {
                code: this.getCodeForGenerateWidget(24, city_id, key),
                schema: 'none'
            }
        };
    }

    _createClass(GeneratorWidget, [{
        key: 'getCodeForGenerateWidget',
        value: function getCodeForGenerateWidget(id) {
            var city_id = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var key = arguments[2];
            var city_name = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            if (id && (city_id || city_name) && key) {
                return '<div id=\'openweathermap-widget\'></div>\n                    <script type="text/javascript">\n                    window.myWidgetParam = {\n                        id: ' + id + ',\n                        cityid: ' + city_id + ',\n                        appid: "' + key + '",\n                        containerid: \'openweathermap-widget\',\n                    };\n                    (function() {\n                        var script = document.createElement(\'script\');\n                        script.type = \'text/javascript\';\n                        script.async = true;\n                        script.src = \'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js\';\n                        var s = document.getElementsByTagName(\'script\')[0];\n                        s.parentNode.insertBefore(script, s);\n                    })();\n                  </script>';
            }

            return null;
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
  var form = document.getElementById("frm-landing-widget");
  var popup = document.getElementById("popup");
  var popupClose = document.getElementById("popup-close");
  var contentJSGeneration = document.getElementById("js-code-generate");
  var copyContentJSCode = document.getElementById("copy-js-code");

  // Фиксируем клики на форме, и открываем popup окно при нажатии на кнопку
  form.addEventListener('click', function (event) {
    if (event.target.id) {
      event.preventDefault();
      console.log(generator.mapWidgets[event.target.id]["code"]);
      contentJSGeneration.value = generator.mapWidgets[event.target.id]["code"];
      if (!popup.classList.contains("popup--visible")) {
        popup.classList.add("popup--visible");
        switch (generator.mapWidgets[event.target.id]["schema"]) {
          case 'blue':
            if (!popup.classList.contains("popup--blue")) {
              popup.classList.add("popup--blue");
            }
            if (popup.classList.contains("popup--brown")) {
              popup.classList.remove("popup--brown");
            }
            break;
          case 'brown':
            if (!popup.classList.contains("popup--brown")) {
              popup.classList.add("popup--brown");
            }
            if (popup.classList.contains("popup--blue")) {
              popup.classList.remove("popup--blue");
            }
            break;
          case 'none':
            if (popup.classList.contains("popup--brown")) {
              popup.classList.remove("popup--brown");
            }
            if (popup.classList.contains("popup--blue")) {
              popup.classList.remove("popup--blue");
            }
        }
      }
    }
  });

  // Закрываем окно при нажатии на крестик
  popupClose.addEventListener("click", function () {
    if (popup.classList.contains("popup--visible")) popup.classList.remove("popup--visible");
  });

  copyContentJSCode.addEventListener("click", function (event) {
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

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

var _cities = require('./cities');

var _cities2 = _interopRequireDefault(_cities);

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Модуль диспетчер для отрисовки баннерров на конструкторе
document.addEventListener('DOMContentLoaded', function () {

  var generateWidget = new _generatorWidget2.default();
  // Формируем параметр фильтра по городу
  var q = '';
  if (window.location.search) {
    q = window.location.search;
  } else {
    q = '?q=London';
  }

  var urlDomain = 'http://api.openweathermap.org';

  var paramsWidget = {
    cityName: 'Moscow',
    lang: 'en',
    appid: '2d90837ddbaeda36ab487f257829b667',
    units: 'metric',
    textUnitTemp: String.fromCodePoint(0x00B0), // 248
    baseURL: generateWidget.baseURL,
    urlDomain: 'http://api.openweathermap.org'
  };

  var controlsWidget = {
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
    dateReport: document.querySelectorAll(".widget-right__date")
  };

  var urls = {
    urlWeatherAPI: paramsWidget.urlDomain + '/data/2.5/weather' + q + '&units=' + paramsWidget.units + '&appid=' + paramsWidget.appid,
    paramsUrlForeDaily: paramsWidget.urlDomain + '/data/2.5/forecast/daily' + q + '&units=' + paramsWidget.units + '&cnt=8&appid=' + paramsWidget.appid,
    windSpeed: paramsWidget.baseURL + '/data/wind-speed-data.json',
    windDirection: paramsWidget.baseURL + '/data/wind-direction-data.json',
    clouds: paramsWidget.baseURL + 'data/clouds-data.json',
    naturalPhenomenon: paramsWidget.baseURL + '/data/natural-phenomenon-data.json'
  };

  var objWidget = new _weatherWidget2.default(paramsWidget, controlsWidget, urls);
  objWidget.render();

  // Работа с формой для инициали
  var cityNameValue = document.getElementById('city-name').valueOf();
  var cityId = document.getElementById('city-id');
  var cities = document.getElementById('cities').valueOf();
  var searchCity = document.getElementById('search-city');
  searchCity.addEventListener('click', function () {

    var objCities = new _cities2.default(cityNameValue, cities, cityId);
    objCities.getCities();
  });
});

},{"./cities":1,"./generator-widget":5,"./popup":7,"./weather-widget":9}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjaXRpZXMuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGRhdGFcXG5hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZGF0YVxcd2luZC1zcGVlZC1kYXRhLmpzIiwiYXNzZXRzXFxqc1xcZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHBvcHVwLmpzIiwiYXNzZXRzXFxqc1xcc2NyaXB0LmpzIiwiYXNzZXRzXFxqc1xcd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7OztJQUdxQixNO0FBRWpCLG9CQUFZLFFBQVosRUFBc0IsU0FBdEIsRUFBaUMsTUFBakMsRUFBd0M7QUFBQTs7QUFDcEMsWUFBRyxDQUFDLFFBQUosRUFBYztBQUNWLG1CQUFPLEtBQVA7QUFDSDtBQUNELGFBQUssR0FBTCxHQUFXLHNJQUFYO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUNIOzs7O29DQUVXO0FBQUE7O0FBQ1IsZ0JBQUcsQ0FBQyxLQUFLLFFBQVQsRUFBbUIsT0FBTyxJQUFQOztBQUVuQixpQkFBSyxPQUFMLENBQWEsS0FBSyxHQUFsQixFQUNLLElBREwsQ0FFUSxVQUFDLFFBQUQsRUFBYztBQUNWLHNCQUFLLGFBQUwsQ0FBbUIsUUFBbkI7QUFDSCxhQUpULEVBS1EsVUFBQyxLQUFELEVBQVc7QUFDUCx3QkFBUSxHQUFSLHNCQUErQixLQUEvQjtBQUNILGFBUFQ7QUFVSDs7O3NDQUVhLFUsRUFBWTtBQUN0QjtBQUNBOztBQUVBLGdCQUFJLE9BQU8sV0FBVyxJQUF0QjtBQUNBLGdCQUFJLEtB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QUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQTtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCO0FBQ0EsaUJBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsT0FBcEI7QUFDQSxpQkFBUyxHQUFULENBQWEsS0FBYixFQUFvQixPQUFwQjtBQUNBLGlCQUFTLEdBQVQs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TUFBUixDQUFlLE9BQU8sRUFBdEIsRUFBMkIsQ0FBQyxDQUFELEdBQUssSUFBSSxDQUFKLEVBQU8sR0FBWixHQUFrQixJQUFuQixHQUEyQixLQUFyRDtBQUNBLGNBQVEsU0FBUjtBQUNBLGNBQVEsV0FBUixHQUFzQixNQUF0QjtBQUNBLGNBQVEsTUFBUjtBQUNBLGNBQVEsSUFBUjtBQUNEOzs7NkJBRVE7QUFDUCxXQUFLLGlCQUFMO0FBQ0Q7Ozs7OztrQkEvZGtCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENpdGllcyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2l0eU5hbWUsIGNvbnRhaW5lciwgY2l0eUlkKXtcclxuICAgICAgICBpZighY2l0eU5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVybCA9ICdodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZpbmQ/Y2FsbGJhY2s9PyZxPU1vc2NvdyZ0eXBlPWxpa2Umc29ydD1wb3B1bGF0aW9uJmNudD0zMCZhcHBpZD1iMWIxNWU4OGZhNzk3MjI1NDEyNDI5YzFjNTBjMTIyYTEnO1xyXG4gICAgICAgIHRoaXMuY2l0eU5hbWUgPSBjaXR5TmFtZTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmNpdHlJZCA9IGNpdHlJZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDaXRpZXMoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuY2l0eU5hbWUpIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmwpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZWFyY2hEYXRhKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGdldFNlYXJjaERhdGEoSlNPTm9iamVjdCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coIEpTT05vYmplY3QgICk7XHJcbiAgICAgICAgLy9KU09Ob2JqZWN0ID0gUGFyc2VKc29uKEpTT050ZXh0KTtcclxuXHJcbiAgICAgICAgbGV0IGNpdHkgPSBKU09Ob2JqZWN0Lmxpc3Q7XHJcbiAgICAgICAgaWYoIGNpdHkubGVuZ3RoID09IDAgKSB7XHJcbiAgICAgICAgICAgIFNob3dBbGVydE1lc3MoICdub3QgZm91bmQnICk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBodG1sID0gJyc7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAgSlNPTm9iamVjdC5saXN0Lmxlbmd0aDsgaSArKyl7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBKU09Ob2JqZWN0Lmxpc3RbaV0ubmFtZSArJywgJytKU09Ob2JqZWN0Lmxpc3RbaV0uc3lzLmNvdW50cnk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IE1hdGgucm91bmQoMTAqKEpTT05vYmplY3QubGlzdFtpXS5tYWluLnRlbXAgLTI3My4xNSkpLzEwIDtcclxuICAgICAgICAgICAgdmFyIHRtaW4gPSBNYXRoLnJvdW5kKDEwKihKU09Ob2JqZWN0Lmxpc3RbaV0ubWFpbi50ZW1wX21pbiAtMjczLjE1KSkgLyAxMDtcclxuICAgICAgICAgICAgdmFyIHRtYXggPSBNYXRoLnJvdW5kKDEwKihKU09Ob2JqZWN0Lmxpc3RbaV0ubWFpbi50ZW1wX21heCAtMjczLjE1KSkgLyAxMCA7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IEpTT05vYmplY3QubGlzdFtpXS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICB2YXIgaW1nID0gIFwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy9cIiArSlNPTm9iamVjdC5saXN0W2ldLndlYXRoZXJbMF0uaWNvbiArIFwiLnBuZ1wiO1xyXG4gICAgICAgICAgICB2YXIgZmxhZyA9IFwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWFnZXMvZmxhZ3MvXCIgK0pTT05vYmplY3QubGlzdFtpXS5zeXMuY291bnRyeS50b0xvd2VyQ2FzZSgpICArIFwiLnBuZ1wiO1xyXG4gICAgICAgICAgICB2YXIgZ3VzdCA9IEpTT05vYmplY3QubGlzdFtpXS53aW5kLnNwZWVkO1xyXG4gICAgICAgICAgICB2YXIgcHJlc3N1cmUgPSBKU09Ob2JqZWN0Lmxpc3RbaV0ubWFpbi5wcmVzc3VyZSA7XHJcbiAgICAgICAgICAgIHZhciBjbG91ZD1KU09Ob2JqZWN0Lmxpc3RbaV0uY2xvdWRzLmFsbCA7XHJcblxyXG4gICAgICAgICAgICAgIGh0bWwgKz1gPHRyPjx0ZD48Yj48YSBocmVmPVwiL2NpdHkvJHtKU09Ob2JqZWN0Lmxpc3RbaV0uaWR9XCIgaWQ9XCIke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIj4ke25hbWV9PC9hPjwvYj48aW1nIHNyYz1cIiR7ZmxhZ31cIj48L3A+PC90ZD48L3RyPmA7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaHRtbD0nPHRhYmxlIGNsYXNzPVwidGFibGVcIiBpZD1cInRhYmxlLWNpdGllc1wiPicraHRtbCsnPC90YWJsZT4nO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGFibGVDaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFibGUtY2l0aWVzJyk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRhYmxlQ2l0aWVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGF0LmNpdHlJZC52YWx1ZSA9IGV2ZW50LnRhcmdldC5pZDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICovXHJcbiAgICBodHRwR2V0KHVybCkge1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2Uuc3Vic3RyaW5nKDIsIHRoaXMucmVzcG9uc2UubGVuZ3RoIC0gMSkpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI4LjA5LjIwMTYuXHJcbiovXHJcblxyXG4vLyDQoNCw0LHQvtGC0LAg0YEg0LTQsNGC0L7QuVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21EYXRlIGV4dGVuZHMgRGF0ZSB7XHJcblxyXG4gIC8qKlxyXG4gICog0LzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YMg0LIg0YLRgNC10YXRgNCw0LfRgNGP0LTQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuFxyXG4gICogQHBhcmFtICB7W2ludGVnZXJdfSBudW1iZXIgW9GH0LjRgdC70L4g0LzQtdC90LXQtSA5OTldXHJcbiAgKiBAcmV0dXJuIHtbc3RyaW5nXX0gICAgICAgIFvRgtGA0LXRhdC30L3QsNGH0L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDXVxyXG4gICovXHJcbiAgbnVtYmVyRGF5c09mWWVhclhYWChudW1iZXIpIHtcclxuICAgIGlmIChudW1iZXIgPiAzNjUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKG51bWJlciA8IDEwKSB7XHJcbiAgICAgIHJldHVybiBgMDAke251bWJlcn1gO1xyXG4gICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDApIHtcclxuICAgICAgcmV0dXJuIGAwJHtudW1iZXJ9YDtcclxuICAgIH1cclxuICAgIHJldHVybiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQsiDQs9C+0LTRg1xyXG4gICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xyXG4gICovXHJcbiAgY29udmVydERhdGVUb051bWJlckRheShkYXRlKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgY29uc3Qgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgIGNvbnN0IGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcbiAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQv9GA0LXQvtC+0LHRgNCw0LfRg9C10YIg0LTQsNGC0YMg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPiDQsiB5eXl5LW1tLWRkXHJcbiAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGUg0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICogQHJldHVybiB7ZGF0ZX0g0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICovXHJcbiAgY29udmVydE51bWJlckRheVRvRGF0ZShkYXRlKSB7XHJcbiAgICBjb25zdCByZSA9IC8oXFxkezR9KSgtKShcXGR7M30pLztcclxuICAgIGNvbnN0IGxpbmUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgY29uc3QgYmVnaW55ZWFyID0gbmV3IERhdGUobGluZVsxXSk7XHJcbiAgICBjb25zdCB1bml4dGltZSA9IGJlZ2lueWVhci5nZXRUaW1lKCkgKyAobGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICogMjQpO1xyXG4gICAgY29uc3QgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xyXG5cclxuICAgIGNvbnN0IG1vbnRoID0gcmVzLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgY29uc3QgZGF5cyA9IHJlcy5nZXREYXRlKCk7XHJcbiAgICBjb25zdCB5ZWFyID0gcmVzLmdldEZ1bGxZZWFyKCk7XHJcbiAgICByZXR1cm4gYCR7ZGF5cyA8IDEwID8gYDAke2RheXN9YCA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gIDogbW9udGh9LiR7eWVhcn1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICogQHBhcmFtICB7ZGF0ZTF9IGRhdGUg0LTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICovXHJcbiAgZm9ybWF0RGF0ZShkYXRlMSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuXHJcbiAgICByZXR1cm4gYCR7eWVhcn0tJHsobW9udGggPCAxMCkgPyBgMCR7bW9udGh9YCA6IG1vbnRofSAtICR7KGRheSA8IDEwKSA/IGAwJHtkYXl9YCA6IGRheX1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGC0LXQutGD0YnRg9GOINC+0YLRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdGD0Y4g0LTQsNGC0YMgeXl5eS1tbS1kZFxyXG4gICogQHJldHVybiB7W3N0cmluZ119INGC0LXQutGD0YnQsNGPINC00LDRgtCwXHJcbiAgKi9cclxuICBnZXRDdXJyZW50RGF0ZSgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRlKG5vdyk7XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQv9C+0YHQu9C10LTQvdC40LUg0YLRgNC4INC80LXRgdGP0YbQsFxyXG4gIGdldERhdGVMYXN0VGhyZWVNb250aCgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgY29uc3Qgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgIGxldCBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgZGF5IC09IDkwO1xyXG4gICAgaWYgKGRheSA8IDApIHtcclxuICAgICAgeWVhciAtPSAxO1xyXG4gICAgICBkYXkgPSAzNjUgLSBkYXk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7eWVhcn0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldEN1cnJlbnRTdW1tZXJEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBjb25zdCBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcclxuICAgIGNvbnN0IGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNS0zMWApO1xyXG4gICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0TGFzdFN1bW1lckRhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpIC0gMTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIGdldEZpcnN0RGF0ZUN1clllYXIoKSB7XHJcbiAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfSAtIDAwMWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gZGQubW0ueXl5eSBoaDptbV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIHRpbWVzdGFtcFRvRGF0ZVRpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoKS5yZXBsYWNlKC8sLywgJycpLnJlcGxhY2UoLzpcXHcrJC8sICcnKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICB0aW1lc3RhbXBUb1RpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgY29uc3QgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgICByZXR1cm4gYCR7aG91cnMgPCAxMCA/IGAwJHtob3Vyc31gIDogaG91cnN9IDogJHttaW51dGVzIDwgMTAgPyBgMCR7bWludXRlc31gIDogbWludXRlc30gYDtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqINCS0L7Qt9GA0LDRidC10L3QuNC1INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0L3QtdC00LXQu9C1INC/0L4gdW5peHRpbWUgdGltZXN0YW1wXHJcbiAgKiBAcGFyYW0gdW5peHRpbWVcclxuICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgKi9cclxuICBnZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHVuaXh0aW1lKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodW5peHRpbWUgKiAxMDAwKTtcclxuICAgIHJldHVybiBkYXRlLmdldERheSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqINCS0LXRgNC90YPRgtGMINC90LDQuNC80LXQvdC+0LLQsNC90LjQtSDQtNC90Y8g0L3QtdC00LXQu9C4XHJcbiAgKiBAcGFyYW0gZGF5TnVtYmVyXHJcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICovXHJcbiAgZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKGRheU51bWJlcikge1xyXG4gICAgY29uc3QgZGF5cyA9IHtcclxuICAgICAgMDogJ1N1bicsXHJcbiAgICAgIDE6ICdNb24nLFxyXG4gICAgICAyOiAnVHVlJyxcclxuICAgICAgMzogJ1dlZCcsXHJcbiAgICAgIDQ6ICdUaHUnLFxyXG4gICAgICA1OiAnRnJpJyxcclxuICAgICAgNjogJ1NhdCcsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0LXRgNC90YPRgtGMINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQvNC10YHRj9GG0LAg0L/QviDQtdCz0L4g0L3QvtC80LXRgNGDXHJcbiAgICogQHBhcmFtIG51bU1vbnRoXHJcbiAgICogQHJldHVybnMgeyp9XHJcbiAgICovXHJcbiAgZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihudW1Nb250aCl7XHJcblxyXG4gICAgaWYodHlwZW9mIG51bU1vbnRoICE9PSBcIm51bWJlclwiIHx8IG51bU1vbnRoIDw9MCAmJiBudW1Nb250aCA+PSAxMikge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aE5hbWUgPSB7XHJcbiAgICAgIDA6IFwiSmFuXCIsXHJcbiAgICAgIDE6IFwiRmViXCIsXHJcbiAgICAgIDI6IFwiTWFyXCIsXHJcbiAgICAgIDM6IFwiQXByXCIsXHJcbiAgICAgIDQ6IFwiTWF5XCIsXHJcbiAgICAgIDU6IFwiSnVuXCIsXHJcbiAgICAgIDY6IFwiSnVsXCIsXHJcbiAgICAgIDc6IFwiQXVnXCIsXHJcbiAgICAgIDg6IFwiU2VwXCIsXHJcbiAgICAgIDk6IFwiT2N0XCIsXHJcbiAgICAgIDEwOiBcIk5vdlwiLFxyXG4gICAgICAxMTogXCJEZWNcIlxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gbW9udGhOYW1lW251bU1vbnRoXTtcclxuICB9XHJcblxyXG4gIC8qKiDQodGA0LDQstC90LXQvdC40LUg0LTQsNGC0Ysg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eSA9IGRkLm1tLnl5eXkg0YEg0YLQtdC60YPRidC40Lwg0LTQvdC10LxcclxuICAqXHJcbiAgKi9cclxuICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgPT09IChuZXcgRGF0ZSgpKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGRhdGUpIHtcclxuICAgIGNvbnN0IHJlID0gLyhcXGR7Mn0pKFxcLnsxfSkoXFxkezJ9KShcXC57MX0pKFxcZHs0fSkvO1xyXG4gICAgY29uc3QgcmVzRGF0ZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICBpZiAocmVzRGF0ZS5sZW5ndGggPT09IDYpIHtcclxuICAgICAgcmV0dXJuIG5ldyBEYXRlKGAke3Jlc0RhdGVbNV19LSR7cmVzRGF0ZVszXX0tJHtyZXNEYXRlWzFdfWApO1xyXG4gICAgfVxyXG4gICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0L3QtSDRgNCw0YHQv9Cw0YDRgdC10L3QsCDQsdC10YDQtdC8INGC0LXQutGD0YnRg9GOXHJcbiAgICByZXR1cm4gbmV3IERhdGUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC00LDRgtGDINCyINGE0L7RgNC80LDRgtC1IEhIOk1NIE1vbnRoTmFtZSBOdW1iZXJEYXRlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBnZXRUaW1lRGF0ZUhITU1Nb250aERheSgpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgcmV0dXJuIGAke2RhdGUuZ2V0SG91cnMoKSA8IDEwID8gYDAke2RhdGUuZ2V0SG91cnMoKX1gIDogZGF0ZS5nZXRIb3VycygpIH06JHtkYXRlLmdldE1pbnV0ZXMoKSA8IDEwID8gYDAke2RhdGUuZ2V0TWludXRlcygpfWAgOiBkYXRlLmdldE1pbnV0ZXMoKX0gJHt0aGlzLmdldE1vbnRoTmFtZUJ5TW9udGhOdW1iZXIoZGF0ZS5nZXRNb250aCgpKX0gJHtkYXRlLmdldERhdGUoKX1gO1xyXG4gIH1cclxufVxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyMC4xMC4yMDE2LlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IG5hdHVyYWxQaGVub21lbm9uID17XHJcbiAgICBcImVuXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRW5nbGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRodW5kZXJzdG9ybSB3aXRoIHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IHJhaW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2h0IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZWF2eSB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInJhZ2dlZCB0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRodW5kZXJzdG9ybSB3aXRoIGxpZ2h0IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRodW5kZXJzdG9ybSB3aXRoIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRodW5kZXJzdG9ybSB3aXRoIGhlYXZ5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImxpZ2h0IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGUgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoZWF2eSBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJzaG93ZXIgcmFpbiBhbmQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiaGVhdnkgc2hvd2VyIHJhaW4gYW5kIGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInNob3dlciBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtb2RlcmF0ZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVyeSBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImZyZWV6aW5nIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpZ2h0IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImhlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwicmFnZ2VkIHNob3dlciByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWdodCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZWF2eSBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJzbGVldFwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwic2hvd2VyIHNsZWV0XCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJsaWdodCByYWluIGFuZCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJyYWluIGFuZCBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNjIwXCI6XCJsaWdodCBzaG93ZXIgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic2hvd2VyIHNub3dcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcImhlYXZ5IHNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9rZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiaGF6ZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZCxkdXN0IHdoaXJsc1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiZm9nXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJzYW5kXCIsXHJcbiAgICAgICAgICAgIFwiNzYxXCI6XCJkdXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzYyXCI6XCJ2b2xjYW5pYyBhc2hcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcInNxdWFsbHNcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNsZWFyIHNreVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZmV3IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic2NhdHRlcmVkIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiYnJva2VuIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwib3ZlcmNhc3QgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNhbCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmljYW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJjb2xkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3RcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmR5XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJzZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJsaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcImdlbnRsZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIm1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiZnJlc2ggYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJzdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJoaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwic2V2ZXJlIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcInN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJ2aW9sZW50IHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJodXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInJ1XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUnVzc2lhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzY1xcdTA0MzVcXHUwNDNiXFx1MDQzYVxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ1MVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0NDEgXFx1MDQzZlxcdTA0NDBcXHUwNDNlXFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0NGJcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQzMlxcdTA0M2VcXHUwNDM3XFx1MDQzY1xcdTA0M2VcXHUwNDM2XFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDM2XFx1MDQzNVxcdTA0NDFcXHUwNDQyXFx1MDQzZVxcdTA0M2FcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NTFcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDQxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0NGJcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDUxXFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1MDQzZVxcdTA0NDdcXHUwNDM1XFx1MDQzZFxcdTA0NGMgXFx1MDQ0MVxcdTA0NGJcXHUwNDQwXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQzYlxcdTA0NTFcXHUwNDMzXFx1MDQzYVxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDNiXFx1MDQ1MVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0MzhcXHUwNDNkXFx1MDQ0MlxcdTA0MzVcXHUwNDNkXFx1MDQ0MVxcdTA0MzhcXHUwNDMyXFx1MDQzZFxcdTA0NGJcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJcXHUwNDNjXFx1MDQzNVxcdTA0M2JcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0M2ZcXHUwNDQwXFx1MDQzZVxcdTA0M2JcXHUwNDM4XFx1MDQzMlxcdTA0M2RcXHUwNDNlXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQ0YlxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFxcdTA0NGNcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcXHUwNDRjXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzZVxcdTA0M2JcXHUwNDRjXFx1MDQ0OFxcdTA0M2VcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQzNVxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDRiXFx1MDQzOSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0M2ZcXHUwNDMwXFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDRmXFx1MDQzYVxcdTA0M2VcXHUwNDQyXFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJcXHUwNDNmXFx1MDQzNVxcdTA0NDFcXHUwNDQ3XFx1MDQzMFxcdTA0M2RcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDRmXFx1MDQ0MVxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXFx1MDQzZlxcdTA0MzBcXHUwNDQxXFx1MDQzY1xcdTA0NDNcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0M2ZcXHUwNDMwXFx1MDQ0MVxcdTA0M2NcXHUwNDQzXFx1MDQ0MFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0NDBcXHUwNDNkXFx1MDQzMFxcdTA0MzRcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDNmXFx1MDQzOFxcdTA0NDdcXHUwNDM1XFx1MDQ0MVxcdTA0M2FcXHUwNDMwXFx1MDQ0ZiBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0NDVcXHUwNDNlXFx1MDQzYlxcdTA0M2VcXHUwNDM0XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0MzZcXHUwNDMwXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0NDBcXHUwNDM1XFx1MDQzZFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIml0XCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiSXRhbGlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dpYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidGVtcG9yYWxlIGNvbiBwaW9nZ2lhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRlbXBvcmFsZVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidGVtcG9yYWxlIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0ZW1wb3JhbGVcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRlbXBvcmFsZSBjb24gcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwicGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInBpb2dnZXJlbGxhXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiZm9ydGUgcGlvZ2dlcmVsbGFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImFjcXVhenpvbmVcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInBpb2dnaWEgbGVnZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwicGlvZ2dpYSBtb2RlcmF0YVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiZm9ydGUgcGlvZ2dpYVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwicGlvZ2dpYSBmb3J0aXNzaW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwaW9nZ2lhIGVzdHJlbWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcInBpb2dnaWEgZ2VsYXRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJwaW9nZ2VyZWxsYVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiYWNxdWF6em9uZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiYWNxdWF6em9uZVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiZm9ydGUgbmV2aWNhdGFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIm5ldmlzY2hpb1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiZm9ydGUgbmV2aWNhdGFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImZvc2NoaWFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImZ1bW9cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImZvc2NoaWFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIm11bGluZWxsaSBkaSBzYWJiaWFcXC9wb2x2ZXJlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJuZWJiaWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNpZWxvIHNlcmVub1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwicG9jaGUgbnV2b2xlXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJpIHNwYXJzZVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnViaSBzcGFyc2VcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImNpZWxvIGNvcGVydG9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBlc3RhIHRyb3BpY2FsZVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwidXJhZ2Fub1wiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiZnJlZGRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjYWxkb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudG9zb1wiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JhbmRpbmVcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1vXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCYXZhIGRpIHZlbnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmV6emEgbGVnZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiQnJlenphIHRlc2FcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGEgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlVyYWdhbm9cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNwXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU3BhbmlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInRvcm1lbnRhIGNvbiBsbHV2aWEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0b3JtZW50YSBjb24gbGx1dmlhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxpZ2VyYSB0b3JtZW50YVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwidG9ybWVudGFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImZ1ZXJ0ZSB0b3JtZW50YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwidG9ybWVudGEgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmEgbGlnZXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0b3JtZW50YSBjb24gbGxvdml6bmFcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRvcm1lbnRhIGNvbiBsbG92aXpuYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsbG92aXpuYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImxsb3Zpem5hXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJsbG92aXpuYSBkZSBncmFuIGludGVuc2lkYWRcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxsdXZpYSB5IGxsb3Zpem5hIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwibGx1dmlhIHkgbGxvdml6bmFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImxsdXZpYSB5IGxsb3Zpem5hIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiY2h1YmFzY29cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxsdXZpYSBsaWdlcmFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImxsdXZpYSBtb2RlcmFkYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwibGx1dmlhIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibGx1dmlhIG11eSBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImxsdXZpYSBtdXkgZnVlcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJsbHV2aWEgaGVsYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJjaHViYXNjbyBkZSBsaWdlcmEgaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiY2h1YmFzY29cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImNodWJhc2NvIGRlIGdyYW4gaW50ZW5zaWRhZFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmV2YWRhIGxpZ2VyYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmlldmVcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIm5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJhZ3VhbmlldmVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImNodWJhc2NvIGRlIG5pZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJuaWVibGFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImh1bW9cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5pZWJsYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidG9yYmVsbGlub3MgZGUgYXJlbmFcXC9wb2x2b1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJ1bWFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNpZWxvIGNsYXJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJhbGdvIGRlIG51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJlcyBkaXNwZXJzYXNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YmVzIHJvdGFzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidG9ybWVudGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImh1cmFjXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyXFx1MDBlZG9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuaXpvXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtYVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiVmllbnRvIGZsb2pvXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJWaWVudG8gc3VhdmVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlZpZW50byBtb2RlcmFkb1wiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiQnJpc2FcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlZpZW50byBmdWVydGVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlZpZW50byBmdWVydGUsIHByXFx1MDBmM3hpbW8gYSB2ZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIGZ1ZXJ0ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiVGVtcGVzdGFkXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YWQgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFjXFx1MDBlMW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInVhXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiVWtyYWluaWFuXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzcgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XFx1MDQzNVxcdTA0M2NcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwIFxcdTA0MzdcXHUwNDU2IFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDNlXFx1MDQ0ZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzZVxcdTA0MzdcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0M2FcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDQyXFx1MDQzYVxcdTA0M2VcXHUwNDQ3XFx1MDQzMFxcdTA0NDFcXHUwNDNkXFx1MDQ1NiBcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNlXFx1MDQzN1xcdTA0MzAgXFx1MDQzNyBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDNjIFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVxcdTA0MzVcXHUwNDNjXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQzMCBcXHUwNDM3IFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0M2MgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzYyBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcXHUwNDM1XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQzYlxcdTA0MzVcXHUwNDMzXFx1MDQzYVxcdTA0MzAgXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA0M2NcXHUwNDQwXFx1MDQ0ZlxcdTA0M2FcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzAgXFx1MDQzY1xcdTA0NDBcXHUwNDRmXFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTA0M2JcXHUwNDM1XFx1MDQzM1xcdTA0M2FcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQ0MFxcdTA0NTZcXHUwNDMxXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0NGNcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0NDBcXHUwNDU2XFx1MDQzMVxcdTA0M2RcXHUwNDM4XFx1MDQzOSBcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA0MzRcXHUwNDQwXFx1MDQ1NlxcdTA0MzFcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzMCBcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQzZlxcdTA0M2VcXHUwNDNjXFx1MDQ1NlxcdTA0NDBcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDM3XFx1MDQzYlxcdTA0MzhcXHUwNDMyXFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDQzYVxcdTA0NDBcXHUwNDM4XFx1MDQzNlxcdTA0MzBcXHUwNDNkXFx1MDQzOFxcdTA0MzkgXFx1MDQzNFxcdTA0M2VcXHUwNDQ5XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDM0XFx1MDQzZVxcdTA0NDlcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MzRcXHUwNDNlXFx1MDQ0OVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQ0Y1xcdTA0M2RcXHUwNDMwIFxcdTA0MzdcXHUwNDNiXFx1MDQzOFxcdTA0MzJcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHUwNDNiXFx1MDQzNVxcdTA0MzNcXHUwNDNhXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzMgXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDRjXFx1MDQzZFxcdTA0MzhcXHUwNDM5IFxcdTA0NDFcXHUwNDNkXFx1MDQ1NlxcdTA0MzNcXHUwNDNlXFx1MDQzZlxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDNjXFx1MDQzZVxcdTA0M2FcXHUwNDQwXFx1MDQzOFxcdTA0MzkgXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQ0MVxcdTA0M2RcXHUwNDU2XFx1MDQzM1xcdTA0M2VcXHUwNDNmXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0NDJcXHUwNDQzXFx1MDQzY1xcdTA0MzBcXHUwNDNkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDQyXFx1MDQ0M1xcdTA0M2NcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQ0MVxcdTA0MzVcXHUwNDQwXFx1MDQzZlxcdTA0MzBcXHUwNDNkXFx1MDQzZVxcdTA0M2FcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0M2ZcXHUwNDU2XFx1MDQ0OVxcdTA0MzBcXHUwNDNkXFx1MDQzMCBcXHUwNDM3XFx1MDQzMFxcdTA0M2NcXHUwNDM1XFx1MDQ0MlxcdTA0NTZcXHUwNDNiXFx1MDQ0Y1wiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQ0MlxcdTA0NDNcXHUwNDNjXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0NDdcXHUwNDM4XFx1MDQ0MVxcdTA0NDJcXHUwNDM1IFxcdTA0M2RcXHUwNDM1XFx1MDQzMVxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTA0NDJcXHUwNDQwXFx1MDQzZVxcdTA0NDVcXHUwNDM4IFxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQ0MFxcdTA0M2VcXHUwNDM3XFx1MDQ1NlxcdTA0NDBcXHUwNDMyXFx1MDQzMFxcdTA0M2RcXHUwNDU2IFxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDQ1XFx1MDQzY1xcdTA0MzBcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0NDVcXHUwNDNjXFx1MDQzMFxcdTA0NDBcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0NTZcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQzNVxcdTA0MzJcXHUwNDU2XFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDQ0NVxcdTA0M2VcXHUwNDNiXFx1MDQzZVxcdTA0MzRcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1MDQ0MVxcdTA0M2ZcXHUwNDM1XFx1MDQzYVxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlxcdTA0MzJcXHUwNDU2XFx1MDQ0MlxcdTA0NDBcXHUwNDRmXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiZGVcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJHZXJtYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHZXdpdHRlciBtaXQgbGVpY2h0ZW0gUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdld2l0dGVyIG1pdCBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiR2V3aXR0ZXIgbWl0IHN0YXJrZW0gUmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImxlaWNodGUgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIkdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzY2h3ZXJlIEdld2l0dGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJlaW5pZ2UgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkdld2l0dGVyIG1pdCBsZWljaHRlbSBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiR2V3aXR0ZXIgbWl0IE5pZXNlbHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJHZXdpdHRlciBtaXQgc3RhcmtlbSBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGVpY2h0ZXMgTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiTmllc2VsblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwic3RhcmtlcyBOaWVzZWxuXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsZWljaHRlciBOaWVzZWxyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInN0YXJrZXIgTmllc2VscmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIk5pZXNlbHNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxlaWNodGVyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtXFx1MDBlNFxcdTAwZGZpZ2VyIFJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJzZWhyIHN0YXJrZXIgUmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInNlaHIgc3RhcmtlciBSZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiU3RhcmtyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiRWlzcmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxlaWNodGUgUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJSZWdlbnNjaGF1ZXJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImhlZnRpZ2UgUmVnZW5zY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJtXFx1MDBlNFxcdTAwZGZpZ2VyIFNjaG5lZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiU2NobmVlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJoZWZ0aWdlciBTY2huZWVmYWxsXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJHcmF1cGVsXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJTY2huZWVzY2hhdWVyXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJ0clxcdTAwZmNiXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJSYXVjaFwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiRHVuc3RcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlNhbmQgXFwvIFN0YXVic3R1cm1cIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIk5lYmVsXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJrbGFyZXIgSGltbWVsXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJlaW4gcGFhciBXb2xrZW5cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTAwZmNiZXJ3aWVnZW5kIGJld1xcdTAwZjZsa3RcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTAwZmNiZXJ3aWVnZW5kIGJld1xcdTAwZjZsa3RcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIndvbGtlbmJlZGVja3RcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlRyb3BlbnN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJIdXJyaWthblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia2FsdFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaGVpXFx1MDBkZlwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwid2luZGlnXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJIYWdlbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiV2luZHN0aWxsZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGVpY2h0ZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiTWlsZGUgQnJpc2VcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1cXHUwMGU0XFx1MDBkZmlnZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJpc2NoZSBCcmlzZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3RhcmtlIEJyaXNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIb2Nod2luZCwgYW5uXFx1MDBlNGhlbmRlciBTdHVybVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiU3R1cm1cIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNjaHdlcmVyIFN0dXJtXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJHZXdpdHRlclwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiSGVmdGlnZXMgR2V3aXR0ZXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIk9ya2FuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJwdFwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIlBvcnR1Z3Vlc2VcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0cm92b2FkYSBjb20gY2h1dmEgbGV2ZVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidHJvdm9hZGEgY29tIGNodXZhXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ0cm92b2FkYSBjb20gY2h1dmEgZm9ydGVcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcInRyb3ZvYWRhIGxldmVcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRyb3ZvYWRhXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJ0cm92b2FkYSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInRyb3ZvYWRhIGlycmVndWxhclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidHJvdm9hZGEgY29tIGdhcm9hIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ0cm92b2FkYSBjb20gZ2Fyb2FcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInRyb3ZvYWRhIGNvbSBnYXJvYSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcImdhcm9hIGZyYWNhXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJnYXJvYVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiZ2Fyb2EgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiY2h1dmEgbGV2ZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiY2h1dmEgZnJhY2FcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImNodXZhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJjaHV2YSBkZSBnYXJvYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiY2h1dmEgZnJhY2FcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIkNodXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJjaHV2YSBkZSBpbnRlbnNpZGFkZSBwZXNhZG9cIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImNodXZhIG11aXRvIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJDaHV2YSBGb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiY2h1dmEgY29tIGNvbmdlbGFtZW50b1wiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2h1dmEgbW9kZXJhZGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcImNodXZhXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJjaHV2YSBkZSBpbnRlbnNpZGFkZSBwZXNhZGFcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIk5ldmUgYnJhbmRhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJOZXZlIHBlc2FkYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiY2h1dmEgY29tIG5ldmVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcImJhbmhvIGRlIG5ldmVcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIk5cXHUwMGU5dm9hXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJmdW1hXFx1MDBlN2FcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5lYmxpbmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInR1cmJpbGhcXHUwMGY1ZXMgZGUgYXJlaWFcXC9wb2VpcmFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIk5lYmxpbmFcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcImNcXHUwMGU5dSBjbGFyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiQWxndW1hcyBudXZlbnNcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm51dmVucyBkaXNwZXJzYXNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51dmVucyBxdWVicmFkb3NcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcInRlbXBvIG51YmxhZG9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5hZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRlbXBlc3RhZGUgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImZ1cmFjXFx1MDBlM29cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyaW9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInF1ZW50ZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiY29tIHZlbnRvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJncmFuaXpvXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInJvXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUm9tYW5pYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IHBsb2FpZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcImZ1cnR1blxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImZ1cnR1blxcdTAxMDMgY3UgcGxvYWllIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiZnVydHVuXFx1MDEwMyB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImZ1cnR1blxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImZ1cnR1blxcdTAxMDMgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJmdXJ0dW5cXHUwMTAzIGFwcmlnXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiZnVydHVuXFx1MDEwMyBjdSBidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJmdXJ0dW5cXHUwMTAzIGN1IGJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImZ1cnR1blxcdTAxMDMgY3UgYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBqb2FzXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiYnVybmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiYnVybmlcXHUwMjFiXFx1MDEwMyBkZSBpbnRlbnNpdGF0ZSBtYXJlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIGpvYXNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJidXJuaVxcdTAyMWJcXHUwMTAzIGRlIGludGVuc2l0YXRlIG1hcmVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImJ1cm5pXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcInBsb2FpZSB1XFx1MDIxOW9hclxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBsb2FpZVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwicGxvYWllIHB1dGVybmljXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwicGxvYWllIHRvcmVuXFx1MDIxYmlhbFxcdTAxMDMgXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJwbG9haWUgZXh0cmVtXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwicGxvYWllIFxcdTAwZWVuZ2hlXFx1MDIxYmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGxvYWllIGRlIHNjdXJ0XFx1MDEwMyBkdXJhdFxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInBsb2FpZSBkZSBzY3VydFxcdTAxMDMgZHVyYXRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJwbG9haWUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibmluc29hcmUgdVxcdTAyMTlvYXJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJuaW5zb2FyZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwibmluc29hcmUgcHV0ZXJuaWNcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJsYXBvdmlcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibmluc29hcmUgZGUgc2N1cnRcXHUwMTAzIGR1cmF0XFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiY2VhXFx1MDIxYlxcdTAxMDNcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImNlYVxcdTAyMWJcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwidlxcdTAwZTJydGVqdXJpIGRlIG5pc2lwXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJjZWFcXHUwMjFiXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2VyIHNlbmluXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJjXFx1MDBlMlxcdTAyMWJpdmEgbm9yaVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwibm9yaSBcXHUwMGVlbXByXFx1MDEwM1xcdTAyMTl0aWFcXHUwMjFiaVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiY2VyIGZyYWdtZW50YXRcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcImNlciBhY29wZXJpdCBkZSBub3JpXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRcXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJmdXJ0dW5hIHRyb3BpY2FsXFx1MDEwM1wiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwidXJhZ2FuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJyZWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJmaWVyYmludGVcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZhbnQgcHV0ZXJuaWNcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImdyaW5kaW5cXHUwMTAzXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInBsXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiUG9saXNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwiQnVyemEgeiBsZWtraW1pIG9wYWRhbWkgZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiQnVyemEgeiBvcGFkYW1pIGRlc3pjenVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkJ1cnphIHogaW50ZW5zeXdueW1pIG9wYWRhbWkgZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiTGVra2EgYnVyemFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIkJ1cnphXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJTaWxuYSBidXJ6YVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQnVyemFcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkJ1cnphIHogbGVra1xcdTAxMDUgbVxcdTAxN2Nhd2tcXHUwMTA1XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJCdXJ6YSB6IG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiQnVyemEgeiBpbnRlbnN5d25cXHUwMTA1IG1cXHUwMTdjYXdrXFx1MDEwNVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiTGVra2EgbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJNXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIkludGVuc3l3bmEgbVxcdTAxN2Nhd2thXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJMZWtraWUgb3BhZHkgZHJvYm5lZ28gZGVzemN6dVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiRGVzemN6IFxcLyBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIkludGVuc3l3bnkgZGVzemN6IFxcLyBtXFx1MDE3Y2F3a2FcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlNpbG5hIG1cXHUwMTdjYXdrYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiTGVra2kgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJVbWlhcmtvd2FueSBkZXN6Y3pcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIkludGVuc3l3bnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJiYXJkem8gc2lsbnkgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJVbGV3YVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiTWFyem5cXHUwMTA1Y3kgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJLclxcdTAwZjN0a2EgdWxld2FcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIkRlc3pjelwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiSW50ZW5zeXdueSwgbGVra2kgZGVzemN6XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJMZWtraWUgb3BhZHkgXFx1MDE1Ym5pZWd1XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwMTVhbmllZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiTW9jbmUgb3BhZHkgXFx1MDE1Ym5pZWd1XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJEZXN6Y3ogemUgXFx1MDE1Ym5pZWdlbVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDE1YW5pZVxcdTAxN2N5Y2FcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIk1naWVcXHUwMTQya2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlNtb2dcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlphbWdsZW5pYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiWmFtaWVcXHUwMTA3IHBpYXNrb3dhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJNZ1xcdTAxNDJhXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJCZXpjaG11cm5pZVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiTGVra2llIHphY2htdXJ6ZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiUm96cHJvc3pvbmUgY2htdXJ5XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJQb2NobXVybm8geiBwcnplamFcXHUwMTVibmllbmlhbWlcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlBvY2htdXJub1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiYnVyemEgdHJvcGlrYWxuYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVyYWdhblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiQ2hcXHUwMTQyb2Rub1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiR29yXFx1MDEwNWNvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ3aWV0cnpuaWVcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIkdyYWRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlNwb2tvam5pZVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGVra2EgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkRlbGlrYXRuYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiVW1pYXJrb3dhbmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlxcdTAxNWF3aWVcXHUwMTdjYSBicnl6YVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU2lsbmEgYnJ5emFcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIlByYXdpZSB3aWNodXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJXaWNodXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTaWxuYSB3aWNodXJhXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTenRvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIkd3YVxcdTAxNDJ0b3dueSBzenRvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFnYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImZpXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRmlubmlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInVra29zbXlyc2t5IGphIGtldnl0IHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcInVra29zbXlyc2t5IGphIHNhZGVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcInVra29zbXlyc2t5IGphIGtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwicGllbmkgdWtrb3NteXJza3lcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJrb3ZhIHVra29zbXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJsaWV2XFx1MDBlNCB1a2tvc215cnNreVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidWtrb3NteXJza3kgamEga2V2eXQgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ1a2tvc215cnNreSBqYSB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcInVra29zbXlyc2t5IGphIGtvdmEgdGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJsaWV2XFx1MDBlNCB0aWh1dHRhaW5lblwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwidGlodXR0YWFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImtvdmEgdGlodXR0YWluZW5cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpZXZcXHUwMGU0IHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwidGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJrb3ZhIHRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwidGloa3VzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJwaWVuaSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJrb2h0YWxhaW5lbiBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJrb3ZhIHNhZGVcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcImVyaXR0XFx1MDBlNGluIHJ1bnNhc3RhIHNhZGV0dGFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImtvdmEgc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwialxcdTAwZTRcXHUwMGU0dFxcdTAwZTR2XFx1MDBlNCBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJsaWV2XFx1MDBlNCB0aWhrdXNhZGVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInRpaGt1c2FkZVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwia292YSBzYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJwaWVuaSBsdW1pc2FkZVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibHVtaVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwicGFsam9uIGx1bnRhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJyXFx1MDBlNG50XFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwibHVtaWt1dXJvXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzdW11XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzYXZ1XCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJzdW11XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJoaWVra2FcXC9wXFx1MDBmNmx5IHB5XFx1MDBmNnJyZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwic3VtdVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwidGFpdmFzIG9uIHNlbGtlXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwidlxcdTAwZTRoXFx1MDBlNG4gcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJham9pdHRhaXNpYSBwaWx2aVxcdTAwZTRcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImhhamFuYWlzaWEgcGlsdmlcXHUwMGU0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJwaWx2aW5lblwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvb3BwaW5lbiBteXJza3lcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImhpcm11bXlyc2t5XCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJreWxtXFx1MDBlNFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwia3V1bWFcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInR1dWxpbmVuXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJyYWtlaXRhXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcIm5sXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRHV0Y2hcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJvbndlZXJzYnVpIG1ldCBsaWNodGUgcmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIm9ud2VlcnNidWkgbWV0IHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJvbndlZXJzYnVpIG1ldCB6d2FyZSByZWdlbnZhbFwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGljaHRlIG9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIm9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcInp3YXJlIG9ud2VlcnNidWlcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9ucmVnZWxtYXRpZyBvbndlZXJzYnVpXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJvbndlZXJzYnVpIG1ldCBsaWNodGUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIm9ud2VlcnNidWkgbWV0IG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJvbndlZXJzYnVpIG1ldCB6d2FyZSBtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGljaHRlIG1vdHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImxpY2h0ZSBtb3RyZWdlblxcL3JlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtb3RyZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiendhcmUgbW90cmVnZW5cXC9yZWdlblwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiendhcmUgbW90cmVnZW5cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcImxpY2h0ZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibWF0aWdlIHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJ6d2FyZSByZWdlbnZhbFwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiemVlciB6d2FyZSByZWdlbnZhbFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiZXh0cmVtZSByZWdlblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiS291ZGUgYnVpZW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpY2h0ZSBzdG9ydHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJzdG9ydHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJ6d2FyZSBzdG9ydHJlZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsaWNodGUgc25lZXV3XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzbmVldXdcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImhldmlnZSBzbmVldXdcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImlqemVsXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuYXR0ZSBzbmVldXdcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm5ldmVsXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ6YW5kXFwvc3RvZiB3ZXJ2ZWxpbmdcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIm1pc3RcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIm9uYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwibGljaHQgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiaGFsZiBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJ6d2FhciBiZXdvbGt0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJnZWhlZWwgYmV3b2xrdFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcGlzY2hlIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImtvdWRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImhlZXRcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInN0b3JtYWNodGlnXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWdlbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiV2luZHN0aWxcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkthbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpY2h0ZSBicmllc1wiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiWmFjaHRlIGJyaWVzXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNYXRpZ2UgYnJpZXNcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlZyaWoga3JhY2h0aWdlIHdpbmRcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIktyYWNodGlnZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIYXJkZSB3aW5kXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJTdG9ybWFjaHRpZ1wiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlp3YXJlIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJaZWVyIHp3YXJlIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJPcmthYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImZyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiRnJlbmNoXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwib3JhZ2UgZXQgcGx1aWUgZmluZVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwib3JhZ2UgZXQgcGx1aWVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIm9yYWdlIGV0IGZvcnRlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIm9yYWdlcyBsXFx1MDBlOWdlcnNcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIm9yYWdlc1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiZ3JvcyBvcmFnZXNcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9yYWdlcyBcXHUwMGU5cGFyc2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJPcmFnZSBhdmVjIGxcXHUwMGU5Z1xcdTAwZThyZSBicnVpbmVcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIm9yYWdlcyBcXHUwMGU5cGFyc2VzXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJncm9zIG9yYWdlXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJCcnVpbmUgbFxcdTAwZTlnXFx1MDBlOHJlXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJCcnVpbmVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIkZvcnRlcyBicnVpbmVzXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJQbHVpZSBmaW5lIFxcdTAwZTlwYXJzZVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwicGx1aWUgZmluZVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiQ3JhY2hpbiBpbnRlbnNlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJBdmVyc2VzIGRlIGJydWluZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwibFxcdTAwZTlnXFx1MDBlOHJlcyBwbHVpZXNcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcInBsdWllcyBtb2RcXHUwMGU5clxcdTAwZTllc1wiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiRm9ydGVzIHBsdWllc1wiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidHJcXHUwMGU4cyBmb3J0ZXMgcHJcXHUwMGU5Y2lwaXRhdGlvbnNcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImdyb3NzZXMgcGx1aWVzXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJwbHVpZSB2ZXJnbGFcXHUwMGU3YW50ZVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGV0aXRlcyBhdmVyc2VzXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJhdmVyc2VzIGRlIHBsdWllXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJhdmVyc2VzIGludGVuc2VzXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJsXFx1MDBlOWdcXHUwMGU4cmVzIG5laWdlc1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmVpZ2VcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImZvcnRlcyBjaHV0ZXMgZGUgbmVpZ2VcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIm5laWdlIGZvbmR1ZVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiYXZlcnNlcyBkZSBuZWlnZVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiYnJ1bWVcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIkJyb3VpbGxhcmRcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImJydW1lXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJ0ZW1wXFx1MDBlYXRlcyBkZSBzYWJsZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiYnJvdWlsbGFyZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiZW5zb2xlaWxsXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwicGV1IG51YWdldXhcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInBhcnRpZWxsZW1lbnQgZW5zb2xlaWxsXFx1MDBlOVwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwibnVhZ2V1eFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiQ291dmVydFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidGVtcFxcdTAwZWF0ZSB0cm9waWNhbGVcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIm91cmFnYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyb2lkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJjaGF1ZFwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidmVudGV1eFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiZ3JcXHUwMGVhbGVcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1lXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCcmlzZSBsXFx1MDBlOWdcXHUwMGU4cmVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkJyaXNlIGRvdWNlXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJCcmlzZSBtb2RcXHUwMGU5clxcdTAwZTllXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzZSBmcmFpY2hlXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJCcmlzZSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudCBmb3J0LCBwcmVzcXVlIHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlZlbnQgdmlvbGVudFwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiVmVudCB0clxcdTAwZThzIHZpb2xlbnRcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlRlbXBcXHUwMGVhdGVcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcImVtcFxcdTAwZWF0ZSB2aW9sZW50ZVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiT3VyYWdhblwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiYmdcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJCdWxnYXJpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxIFxcdTA0M2ZcXHUwNDNlXFx1MDQ0MFxcdTA0M2VcXHUwNDM5XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzMCBcXHUwNDMzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGZcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDMwIFxcdTA0MzNcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDNlXFx1MDQ0MlxcdTA0MzVcXHUwNDMyXFx1MDQzOFxcdTA0NDdcXHUwNDNkXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDNhXFx1MDQ0YVxcdTA0NDFcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzZVxcdTA0NDJcXHUwNDM1XFx1MDQzMlxcdTA0MzhcXHUwNDQ3XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZiBcXHUwNDQxXFx1MDQ0YVxcdTA0NDEgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MSBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQxM1xcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0M2VcXHUwNDQyXFx1MDQzNVxcdTA0MzJcXHUwNDM4XFx1MDQ0N1xcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0NGYgXFx1MDQ0MVxcdTA0NGFcXHUwNDQxIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0NDBcXHUwNDRhXFx1MDQzY1xcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDIwXFx1MDQ0YVxcdTA0M2NcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDIwXFx1MDQ0YVxcdTA0M2NcXHUwNDRmXFx1MDQ0OSBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQwXFx1MDQ0YVxcdTA0M2NcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQyMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MFxcdTA0NGFcXHUwNDNjXFx1MDQzNVxcdTA0MzZcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzNFxcdTA0NGFcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1MDQyM1xcdTA0M2NcXHUwNDM1XFx1MDQ0MFxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0MWNcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDE0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0IFxcdTA0NDFcXHUwNDRhXFx1MDQ0MSBcXHUwNDQxXFx1MDQ0MlxcdTA0NDNcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDIxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDRhXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0MWVcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQ0YVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJcXHUwNDFmXFx1MDQzZVxcdTA0NDBcXHUwNDNlXFx1MDQzOVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQyMVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDIxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXFx1MDQzZVxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDE4XFx1MDQzN1xcdTA0M2RcXHUwNDM1XFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzMlxcdTA0MzBcXHUwNDQ5IFxcdTA0MzJcXHUwNDMwXFx1MDQzYlxcdTA0MzVcXHUwNDM2XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNDFlXFx1MDQzMVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQ0MVxcdTA0M2RcXHUwNDM1XFx1MDQzM1xcdTA0M2VcXHUwNDMyXFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzNlwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1MDQxY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA0MTRcXHUwNDM4XFx1MDQzY1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1MDQxZFxcdTA0MzhcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA0MWZcXHUwNDRmXFx1MDQ0MVxcdTA0NGFcXHUwNDQ3XFx1MDQzZFxcdTA0MzBcXC9cXHUwNDFmXFx1MDQ0MFxcdTA0MzBcXHUwNDQ4XFx1MDQzZFxcdTA0MzAgXFx1MDQzMVxcdTA0NDNcXHUwNDQwXFx1MDQ0ZlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1MDQxY1xcdTA0NGFcXHUwNDMzXFx1MDQzYlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTA0MmZcXHUwNDQxXFx1MDQzZFxcdTA0M2UgXFx1MDQzZFxcdTA0MzVcXHUwNDMxXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDQxZFxcdTA0MzhcXHUwNDQxXFx1MDQzYVxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDNhXFx1MDQ0YVxcdTA0NDFcXHUwNDMwXFx1MDQzZFxcdTA0MzAgXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVxcdTA0NDFcXHUwNDQyXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNDIwXFx1MDQzMFxcdTA0MzdcXHUwNDQxXFx1MDQzNVxcdTA0NGZcXHUwNDNkXFx1MDQzMCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0N1xcdTA0M2RcXHUwNDNlXFx1MDQ0MVxcdTA0NDJcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA0MjJcXHUwNDRhXFx1MDQzY1xcdTA0M2RcXHUwNDM4IFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQyMlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVxcL1xcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQyMlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0MzhcXHUwNDQ3XFx1MDQzNVxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDIzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0MjFcXHUwNDQyXFx1MDQ0M1xcdTA0MzRcXHUwNDM1XFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA0MTNcXHUwNDNlXFx1MDQ0MFxcdTA0MzVcXHUwNDQ5XFx1MDQzZSBcXHUwNDMyXFx1MDQ0MFxcdTA0MzVcXHUwNDNjXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQxMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDJcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDEzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInNlXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiU3dlZGlzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJmdWxsdCBcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTAwZTVza2FcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDBlNXNrYVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwib2pcXHUwMGU0bW50IG92XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDBlNXNrb3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHUwMGU1c2tvdlxcdTAwZTRkZXJcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImZ1bGx0IFxcdTAwZTVza292XFx1MDBlNGRlclwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibWp1a3QgZHVnZ3JlZ25cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJoXFx1MDBlNXJ0IGR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJtanVrdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJyZWduXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJoXFx1MDBlNXJ0IHJlZ25cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImR1Z2dyZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJtanVrdCByZWduXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJNXFx1MDBlNXR0bGlnIHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcImhcXHUwMGU1cnQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwibXlja2V0IGtyYWZ0aWd0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTAwZjZzcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwidW5kZXJreWx0IHJlZ25cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIm1qdWt0IFxcdTAwZjZzcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiZHVzY2gtcmVnblwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwicmVnbmFyIHNtXFx1MDBlNXNwaWtcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm1qdWsgc25cXHUwMGY2XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJzblxcdTAwZjZcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImtyYWZ0aWd0IHNuXFx1MDBmNmZhbGxcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInNuXFx1MDBmNmJsYW5kYXQgcmVnblwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25cXHUwMGY2b3ZcXHUwMGU0ZGVyXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJkaW1tYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwic21vZ2dcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImRpc1wiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJkaW1taWd0XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJrbGFyIGhpbW1lbFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiblxcdTAwZTVncmEgbW9sblwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic3ByaWRkYSBtb2xuXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJtb2xuaWd0XCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHUwMGY2dmVyc2t1Z2dhbmRlIG1vbG5cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waXNrIHN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJvcmthblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwia2FsbHRcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcInZhcm10XCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJibFxcdTAwZTVzaWd0XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWdlbFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiU2V0dGluZ1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiTGlnaHQgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJHZW50bGUgQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJNb2RlcmF0ZSBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkZyZXNoIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU3Ryb25nIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkdhbGVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNldmVyZSBHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVmlvbGVudCBTdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiSHVycmljYW5lXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ6aF90d1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNoaW5lc2UgVHJhZGl0aW9uYWxcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTk2ZjdcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1OTZmN1xcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJcXHU5NmY3XFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTk2NjNcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJcXHU1YzBmXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiXFx1NGUyZFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1NjZiNFxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTUxY2RcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHU5NjYzXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1OTY2M1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcXHU1YzBmXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1NTkyN1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIlxcdTk2ZThcXHU1OTNlXFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1OTY2M1xcdTk2ZWFcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTg1ODRcXHU5NzI3XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHU3MTU5XFx1OTcyN1wiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiXFx1ODU4NFxcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTZjOTlcXHU2NWNiXFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXFx1NTkyN1xcdTk3MjdcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcIlxcdTY2NzRcIixcclxuICAgICAgICAgICAgXCI4MDFcIjpcIlxcdTY2NzRcXHVmZjBjXFx1NWMxMVxcdTk2ZjJcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTU5MWFcXHU5NmYyXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1OTY3MFxcdWZmMGNcXHU1OTFhXFx1OTZmMlwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1OWY4ZFxcdTYzNzJcXHU5OGE4XCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHU3MWIxXFx1NWUzNlxcdTk4YThcXHU2NmI0XCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHU5OGI2XFx1OThhOFwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1NTFiN1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXFx1NzFiMVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1NTkyN1xcdTk4YThcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlxcdTUxYjBcXHU5NmY5XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcInRyXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiVHVya2lzaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgaGFmaWYgeWFcXHUwMTFmbXVybHVcIixcclxuICAgICAgICAgICAgXCIyMDFcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgeWFcXHUwMTFmbXVybHVcIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgc2FcXHUwMTFmYW5hayB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJIYWZpZiBzYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJTYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwMTVlaWRkZXRsaSBzYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJBcmFsXFx1MDEzMWtsXFx1MDEzMSBzYVxcdTAxMWZhbmFrXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJHXFx1MDBmNmsgZ1xcdTAwZmNyXFx1MDBmY2x0XFx1MDBmY2xcXHUwMGZjIGhhZmlmIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdcXHUwMGY2ayBnXFx1MDBmY3JcXHUwMGZjbHRcXHUwMGZjbFxcdTAwZmMgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiR1xcdTAwZjZrIGdcXHUwMGZjclxcdTAwZmNsdFxcdTAwZmNsXFx1MDBmYyBcXHUwMTVmaWRkZXRsaSB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJZZXIgeWVyIGhhZmlmIHlvXFx1MDExZnVubHVrbHUgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlllciB5ZXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMwMlwiOlwiWWVyIHllciB5b1xcdTAxMWZ1biB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJZZXIgeWVyIGhhZmlmIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlllciB5ZXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiWWVyIHllciB5b1xcdTAxMWZ1biB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJZZXIgeWVyIHNhXFx1MDExZmFuYWsgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiSGFmaWYgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJPcnRhIFxcdTAxNWZpZGRldGxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1MDE1ZWlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJcXHUwMGM3b2sgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJBXFx1MDE1ZlxcdTAxMzFyXFx1MDEzMSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIllhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzEgdmUgc29cXHUwMTFmdWsgaGF2YVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgaGFmaWYgeW9cXHUwMTFmdW5sdWtsdSB5YVxcdTAxMWZtdXJcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIktcXHUwMTMxc2Egc1xcdTAwZmNyZWxpIHlhXFx1MDExZm11clwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiS1xcdTAxMzFzYSBzXFx1MDBmY3JlbGkgXFx1MDE1ZmlkZGV0bGkgeWFcXHUwMTFmbXVyXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJIYWZpZiBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiS2FyIHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmbFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIllvXFx1MDExZnVuIGthciB5YVxcdTAxMWZcXHUwMTMxXFx1MDE1ZmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJLYXJsYSBrYXJcXHUwMTMxXFx1MDE1ZlxcdTAxMzFrIHlhXFx1MDExZm11cmx1XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJLXFx1MDEzMXNhIHNcXHUwMGZjcmVsXFx1MDBmYyBrYXIgeWFcXHUwMTFmXFx1MDEzMVxcdTAxNWZcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJTaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiU2lzbGlcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkhhZmlmIHNpc2xpXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJLdW1cXC9Ub3ogZlxcdTAxMzFydFxcdTAxMzFuYXNcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJTaXNsaVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiQVxcdTAwZTdcXHUwMTMxa1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiQXogYnVsdXRsdVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiUGFyXFx1MDBlN2FsXFx1MDEzMSBheiBidWx1dGx1XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJQYXJcXHUwMGU3YWxcXHUwMTMxIGJ1bHV0bHVcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIkthcGFsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiS2FzXFx1MDEzMXJnYVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiVHJvcGlrIGZcXHUwMTMxcnRcXHUwMTMxbmFcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIkhvcnR1bVwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiXFx1MDBjN29rIFNvXFx1MDExZnVrXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwMGM3b2sgU1xcdTAxMzFjYWtcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIlJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJEb2x1IHlhXFx1MDExZlxcdTAxMzFcXHUwMTVmXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiRHVyZ3VuXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJTYWtpblwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiSGFmaWYgUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkF6IFJcXHUwMGZjemdhcmxcXHUwMTMxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJPcnRhIFNldml5ZSBSXFx1MDBmY3pnYXJsXFx1MDEzMVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiUlxcdTAwZmN6Z2FybFxcdTAxMzFcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkt1dnZldGxpIFJcXHUwMGZjemdhclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiU2VydCBSXFx1MDBmY3pnYXJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIkZcXHUwMTMxcnRcXHUwMTMxbmFcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTAxNWVpZGRldGxpIEZcXHUwMTMxcnRcXHUwMTMxbmFcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIkthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTAxNWVpZGRldGxpIEthc1xcdTAxMzFyZ2FcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTAwYzdvayBcXHUwMTVlaWRkZXRsaSBLYXNcXHUwMTMxcmdhXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ6aF9jblwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNoaW5lc2UgU2ltcGxpZmllZFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1OTZmN1xcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcXHU5NmY3XFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlxcdTk2ZjdcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1NWMwZlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHU1OTI3XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1OTYzNVxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIlxcdTVjMGZcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHU0ZTJkXFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTU5MjdcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcXHU2NmI0XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1NTFiYlxcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcIlxcdTk2MzVcXHU5NmU4XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcXHU5NjM1XFx1OTZlOFwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwiXFx1NTkyN1xcdTk2ZThcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIlxcdTVjMGZcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHU1OTI3XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiXFx1OTZlOFxcdTU5MzlcXHU5NmVhXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHU5NjM1XFx1OTZlYVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwiXFx1ODU4NFxcdTk2ZmVcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTcwZGZcXHU5NmZlXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHU4NTg0XFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1NmM5OVxcdTY1Y2JcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJcXHU1OTI3XFx1OTZmZVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1NjY3NFwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1NjY3NFxcdWZmMGNcXHU1YzExXFx1NGU5MVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1NTkxYVxcdTRlOTFcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcXHU5NjM0XFx1ZmYwY1xcdTU5MWFcXHU0ZTkxXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJcXHU5Zjk5XFx1NTM3N1xcdTk4Y2VcIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcIlxcdTcwZWRcXHU1ZTI2XFx1OThjZVxcdTY2YjRcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcIlxcdTk4ZDNcXHU5OGNlXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJcXHU1MWI3XCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHU3MGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcXHU1OTI3XFx1OThjZVwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1NTFiMFxcdTk2ZjlcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlNldHRpbmdcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIkNhbG1cIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIkxpZ2h0IGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiR2VudGxlIEJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiTW9kZXJhdGUgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJGcmVzaCBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlN0cm9uZyBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkhpZ2ggd2luZCwgbmVhciBnYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJHYWxlXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJTZXZlcmUgR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlZpb2xlbnQgU3Rvcm1cIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpY2FuZVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiY3pcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDemVjaFwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImJvdVxcdTAxNTlrYSBzZSBzbGFiXFx1MDBmZG0gZGVcXHUwMTYxdFxcdTAxMWJtXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJib3VcXHUwMTU5a2EgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2lsblxcdTAwZmRtIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwic2xhYlxcdTAxNjFcXHUwMGVkIGJvdVxcdTAxNTlrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiYm91XFx1MDE1OWthXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJzaWxuXFx1MDBlMSBib3VcXHUwMTU5a2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcImJvdVxcdTAxNTlrb3ZcXHUwMGUxIHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGthXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2xhYlxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiYm91XFx1MDE1OWthIHMgbXJob2xlblxcdTAwZWRtXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJib3VcXHUwMTU5a2Egc2Ugc2lsblxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuXFx1MDBlZFwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwic2xhYlxcdTAwZTkgbXJob2xlblxcdTAwZWQgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJtcmhvbGVuXFx1MDBlZCBzIGRlXFx1MDE2MXRcXHUwMTFibVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwic2lsblxcdTAwZTkgbXJob2xlblxcdTAwZWQgYSBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJtcmhvbGVuXFx1MDBlZCBhIHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJtcmhvbGVuXFx1MDBlZCBhIHNpbG5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJvYlxcdTAxMGRhc25cXHUwMGU5IG1yaG9sZW5cXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJwcnVka1xcdTAwZmQgZFxcdTAwZTlcXHUwMTYxXFx1MDE2NVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwicFxcdTAxNTlcXHUwMGVkdmFsb3ZcXHUwMGZkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcInByXFx1MDE2ZnRyXFx1MDE3ZSBtcmFcXHUwMTBkZW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIm1yem5vdWNcXHUwMGVkIGRcXHUwMGU5XFx1MDE2MVxcdTAxNjVcIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcInNsYWJcXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJwXFx1MDE1OWVoXFx1MDBlMVxcdTAxNDhreVwiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwic2lsblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIm9iXFx1MDEwZGFzblxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIm1cXHUwMGVkcm5cXHUwMGU5IHNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImh1c3RcXHUwMGU5IHNuXFx1MDExYlxcdTAxN2VlblxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInptcnpsXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1XCIsXHJcbiAgICAgICAgICAgIFwiNjEyXCI6XCJzbVxcdTAwZWRcXHUwMTYxZW5cXHUwMGU5IHBcXHUwMTU5ZWhcXHUwMGUxXFx1MDE0OGt5XCIsXHJcbiAgICAgICAgICAgIFwiNjE1XCI6XCJzbGFiXFx1MDBmZCBkXFx1MDBlOVxcdTAxNjFcXHUwMTY1IHNlIHNuXFx1MDExYmhlbVwiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwiZFxcdTAwZTlcXHUwMTYxXFx1MDE2NSBzZSBzblxcdTAxMWJoZW1cIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcInNsYWJcXHUwMGU5IHNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcInNpbG5cXHUwMGU5IHNuXFx1MDExYmhvdlxcdTAwZTkgcFxcdTAxNTllaFxcdTAwZTFcXHUwMTQ4a3lcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIm1saGFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImtvdVxcdTAxNTlcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIm9wYXJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcInBcXHUwMGVkc2VcXHUwMTBkblxcdTAwZTkgXFx1MDEwZGkgcHJhY2hvdlxcdTAwZTkgdlxcdTAwZWRyeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiaHVzdFxcdTAwZTEgbWxoYVwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwicFxcdTAwZWRzZWtcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcInByYVxcdTAxNjFub1wiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwic29wZVxcdTAxMGRuXFx1MDBmZCBwb3BlbFwiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwicHJ1ZGtcXHUwMGU5IGJvdVxcdTAxNTllXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJqYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwic2tvcm8gamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInBvbG9qYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwib2JsYVxcdTAxMGRub1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiemF0YVxcdTAxN2Vlbm9cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcInRvcm5cXHUwMGUxZG9cIixcclxuICAgICAgICAgICAgXCI5MDFcIjpcInRyb3BpY2tcXHUwMGUxIGJvdVxcdTAxNTllXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJpa1xcdTAwZTFuXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJ6aW1hXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3Jrb1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwidlxcdTAxMWJ0cm5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJrcnVwb2JpdFxcdTAwZWRcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcImJlenZcXHUwMTFidFxcdTAxNTlcXHUwMGVkXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJ2XFx1MDBlMW5la1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwidlxcdTAxMWJ0XFx1MDE1OVxcdTAwZWRrXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJzbGFiXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJtXFx1MDBlZHJuXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTBkZXJzdHZcXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcInNpbG5cXHUwMGZkIHZcXHUwMGVkdHJcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcInBydWRrXFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJib3VcXHUwMTU5bGl2XFx1MDBmZCB2XFx1MDBlZHRyXCIsXHJcbiAgICAgICAgICAgIFwiOTU5XCI6XCJ2aWNoXFx1MDE1OWljZVwiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwic2lsblxcdTAwZTEgdmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIm1vaHV0blxcdTAwZTEgdmljaFxcdTAxNTlpY2VcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIm9ya1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJrclwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIktvcmVhXCIsXHJcbiAgICAgICAgXCJtYWluXCI6XCJcIixcclxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6e1xyXG4gICAgICAgICAgICBcIjIwMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibGlnaHQgdGh1bmRlcnN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJ0aHVuZGVyc3Rvcm1cIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcImhlYXZ5IHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwicmFnZ2VkIHRodW5kZXJzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwidGh1bmRlcnN0b3JtIHdpdGggbGlnaHQgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidGh1bmRlcnN0b3JtIHdpdGggZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidGh1bmRlcnN0b3JtIHdpdGggaGVhdnkgZHJpenpsZVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwibGlnaHQgaW50ZW5zaXR5IGRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcImRyaXp6bGVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJsaWdodCBpbnRlbnNpdHkgZHJpenpsZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImhlYXZ5IGludGVuc2l0eSBkcml6emxlIHJhaW5cIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInNob3dlciBkcml6emxlXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJsaWdodCByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJtb2RlcmF0ZSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZWF2eSBpbnRlbnNpdHkgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidmVyeSBoZWF2eSByYWluXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJleHRyZW1lIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImZyZWV6aW5nIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjBcIjpcImxpZ2h0IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwic2hvd2VyIHJhaW5cIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImhlYXZ5IGludGVuc2l0eSBzaG93ZXIgcmFpblwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwibGlnaHQgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25vd1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiaGVhdnkgc25vd1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwic2xlZXRcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNob3dlciBzbm93XCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJtaXN0XCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJzbW9rZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiaGF6ZVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwic2FuZFxcL2R1c3Qgd2hpcmxzXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJmb2dcIixcclxuICAgICAgICAgICAgXCI4MDBcIjpcInNreSBpcyBjbGVhclwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiZmV3IGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic2NhdHRlcmVkIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiYnJva2VuIGNsb3Vkc1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwib3ZlcmNhc3QgY2xvdWRzXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNhbCBzdG9ybVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVycmljYW5lXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJjb2xkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJob3RcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcIndpbmR5XCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJoYWlsXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJTZXR0aW5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJDYWxtXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJMaWdodCBicmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdlbnRsZSBCcmVlemVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIk1vZGVyYXRlIGJyZWV6ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiRnJlc2ggQnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJTdHJvbmcgYnJlZXplXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJIaWdoIHdpbmQsIG5lYXIgZ2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiR2FsZVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiU2V2ZXJlIEdhbGVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJWaW9sZW50IFN0b3JtXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJyaWNhbmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImdsXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiR2FsaWNpYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YSBsaXhlaXJhXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIGNob2l2YVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBjaG9pdmEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGxpeGVpcmFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInRvcm1lbnRhIGVsXFx1MDBlOWN0cmljYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgaXJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjMwXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwidG9ybWVudGEgZWxcXHUwMGU5Y3RyaWNhIGNvbiBvcmJhbGxvXCIsXHJcbiAgICAgICAgICAgIFwiMjMyXCI6XCJ0b3JtZW50YSBlbFxcdTAwZTljdHJpY2EgY29uIG9yYmFsbG8gaW50ZW5zb1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwib3JiYWxsbyBsaXhlaXJvXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJvcmJhbGxvXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJvcmJhbGxvIGRlIGdyYW4gaW50ZW5zaWRhZGVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcImNob2l2YSBlIG9yYmFsbG8gbGl4ZWlyb1wiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiY2hvaXZhIGUgb3JiYWxsb1wiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwiY2hvaXZhIGUgb3JiYWxsbyBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiMzIxXCI6XCJvcmJhbGxvIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJjaG9pdmEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwiY2hvaXZhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJjaG9pdmEgZGUgZ3JhbiBpbnRlbnNpZGFkZVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiY2hvaXZhIG1vaSBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiY2hvaXZhIGV4dHJlbWFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcImNob2l2YSB4ZWFkYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiY2hvaXZhIGRlIGR1Y2hhIGRlIGJhaXhhIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJjaG9pdmEgZGUgZHVjaGFcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImNob2l2YSBkZSBkdWNoYSBkZSBncmFuIGludGVuc2lkYWRlXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJuZXZhZGEgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwibmV2ZVwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwibmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcImF1Z2FuZXZlXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJuZXZlIGRlIGR1Y2hhXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJuXFx1MDBlOWJvYVwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiZnVtZVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiblxcdTAwZTlib2EgbGl4ZWlyYVwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwicmVtdWlcXHUwMGYxb3MgZGUgYXJlYSBlIHBvbHZvXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJicnVtYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiY2VvIGNsYXJvXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJhbGdvIGRlIG51YmVzXCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJudWJlcyBkaXNwZXJzYXNcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIm51YmVzIHJvdGFzXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJudWJlc1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidG9ybWVudGEgdHJvcGljYWxcIixcclxuICAgICAgICAgICAgXCI5MDJcIjpcImZ1cmFjXFx1MDBlMW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImZyXFx1MDBlZG9cIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImNhbG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZW50b3NvXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJzYXJhYmlhXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJjYWxtYVwiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiVmVudG8gZnJvdXhvXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJWZW50byBzdWF2ZVwiLFxyXG4gICAgICAgICAgICBcIjk1NFwiOlwiVmVudG8gbW9kZXJhZG9cIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkJyaXNhXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJWZW50byBmb3J0ZVwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiVmVudG8gZm9ydGUsIHByXFx1MDBmM3hpbW8gYSB2ZW5kYXZhbFwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIGZvcnRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YWRlXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJUZW1wZXN0YWRlIHZpb2xlbnRhXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJGdXJhY1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJ2aVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcInZpZXRuYW1lc2VcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJHaVxcdTAwZjRuZyBiXFx1MDBlM28gdlxcdTAwZTAgTVxcdTAxYjBhIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIHZcXHUwMGUwIE1cXHUwMWIwYVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIE1cXHUwMWIwYSBsXFx1MWVkYm5cIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyBjXFx1MDBmMyBjaFxcdTFlZGJwIGdpXFx1MWVhZHRcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcIkJcXHUwMGUzb1wiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiR2lcXHUwMGY0bmcgYlxcdTAwZTNvIGxcXHUxZWRiblwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiQlxcdTAwZTNvIHZcXHUwMGUwaSBuXFx1MDFhMWlcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MDBlMCBNXFx1MDFiMGEgcGhcXHUwMGY5biBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIyMzFcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MWVkYmkgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIkdpXFx1MDBmNG5nIGJcXHUwMGUzbyB2XFx1MWVkYmkgbVxcdTAxYjBhIHBoXFx1MDBmOW4gblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDBlMW5oIHNcXHUwMGUxbmcgY1xcdTAxYjBcXHUxZWRkbmcgXFx1MDExMVxcdTFlZDkgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIm1cXHUwMWIwYSBwaFxcdTAwZjluXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5biBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJtXFx1MDFiMGEgcGhcXHUwMGY5biBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIm1cXHUwMWIwYSB2XFx1MDBlMCBtXFx1MDFiMGEgcGhcXHUwMGY5blwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwibVxcdTAxYjBhIHZcXHUwMGUwIG1cXHUwMWIwYSBwaFxcdTAwZjluIG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIm1cXHUwMWIwYSByXFx1MDBlMG8gdlxcdTAwZTAgbVxcdTAxYjBhIHBoXFx1MDBmOW5cIixcclxuICAgICAgICAgICAgXCI1MDBcIjpcIm1cXHUwMWIwYSBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIm1cXHUwMWIwYSB2XFx1MWVlYmFcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIm1cXHUwMWIwYSBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNTAzXCI6XCJtXFx1MDFiMGEgclxcdTFlYTV0IG5cXHUxZWI3bmdcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIm1cXHUwMWIwYSBsXFx1MWVkMWNcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIm1cXHUwMWIwYSBsXFx1MWVhMW5oXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJtXFx1MDFiMGEgclxcdTAwZTBvIG5oXFx1MWViOVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwibVxcdTAxYjBhIHJcXHUwMGUwb1wiLFxyXG4gICAgICAgICAgICBcIjUyMlwiOlwibVxcdTAxYjBhIHJcXHUwMGUwbyBjXFx1MDFiMFxcdTFlZGRuZyBcXHUwMTExXFx1MWVkOSBuXFx1MWViN25nXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJ0dXlcXHUxZWJmdCByXFx1MDFhMWkgbmhcXHUxZWI5XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJ0dXlcXHUxZWJmdFwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwidHV5XFx1MWViZnQgblxcdTFlYjduZyBoXFx1MWVhMXRcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcIm1cXHUwMWIwYSBcXHUwMTExXFx1MDBlMVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwidHV5XFx1MWViZnQgbVxcdTAwZjkgdHJcXHUxZWRkaVwiLFxyXG4gICAgICAgICAgICBcIjcwMVwiOlwic1xcdTAxYjBcXHUwMWExbmcgbVxcdTFlZGRcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImtoXFx1MDBmM2kgYlxcdTFlZTVpXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwMTExXFx1MDBlMW0gbVxcdTAwZTJ5XCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJiXFx1MDBlM28gY1xcdTAwZTF0IHZcXHUwMGUwIGxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJzXFx1MDFiMFxcdTAxYTFuZyBtXFx1MDBmOVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiYlxcdTFlYTd1IHRyXFx1MWVkZGkgcXVhbmcgXFx1MDExMVxcdTAwZTNuZ1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwibVxcdTAwZTJ5IHRoXFx1MDFiMGFcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIm1cXHUwMGUyeSByXFx1MWVhM2kgclxcdTAwZTFjXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJtXFx1MDBlMnkgY1xcdTFlZTVtXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJtXFx1MDBlMnkgXFx1MDExMWVuIHUgXFx1MDBlMW1cIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcImxcXHUxZWQxYyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJjXFx1MDFhMW4gYlxcdTAwZTNvIG5oaVxcdTFlYzd0IFxcdTAxMTFcXHUxZWRiaVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiYlxcdTAwZTNvIGxcXHUxZWQxY1wiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwibFxcdTFlYTFuaFwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiblxcdTAwZjNuZ1wiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiZ2lcXHUwMGYzXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJtXFx1MDFiMGEgXFx1MDExMVxcdTAwZTFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIkNoXFx1MWViZiBcXHUwMTExXFx1MWVjZFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiTmhcXHUxZWI5IG5oXFx1MDBlMG5nXCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJcXHUwMGMxbmggc1xcdTAwZTFuZyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIkdcXHUwMGVkbyB0aG9cXHUxZWEzbmdcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkdpXFx1MDBmMyBuaFxcdTFlYjlcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIkdpXFx1MDBmMyB2XFx1MWVlYmEgcGhcXHUxZWEzaVwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiR2lcXHUwMGYzIG1cXHUxZWExbmhcIixcclxuICAgICAgICAgICAgXCI5NTdcIjpcIkdpXFx1MDBmMyB4b1xcdTAwZTF5XCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJMXFx1MWVkMWMgeG9cXHUwMGUxeVwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiTFxcdTFlZDFjIHhvXFx1MDBlMXkgblxcdTFlYjduZ1wiLFxyXG4gICAgICAgICAgICBcIjk2MFwiOlwiQlxcdTAwZTNvXCIsXHJcbiAgICAgICAgICAgIFwiOTYxXCI6XCJCXFx1MDBlM28gY1xcdTFlYTVwIGxcXHUxZWRiblwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiQlxcdTAwZTNvIGxcXHUxZWQxY1wiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiYXJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJBcmFiaWNcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjIzXFx1MDY0NVxcdTA2MzdcXHUwNjI3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXFx1MDYyN1xcdTA2NDRcXHUwNjM5XFx1MDY0OFxcdTA2MjdcXHUwNjM1XFx1MDY0MSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOSBcXHUwNjQ1XFx1MDYzOSBcXHUwNjI3XFx1MDY0NFxcdTA2NDVcXHUwNjM3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYyN1xcdTA2NDVcXHUwNjM3XFx1MDYyN1xcdTA2MzEgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjMxXFx1MDYzOVxcdTA2MmZcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDYyYlxcdTA2NDJcXHUwNjRhXFx1MDY0NFxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2MmVcXHUwNjM0XFx1MDY0NlxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzFcXHUwNjM5XFx1MDYyZlxcdTA2NGFcXHUwNjI5IFxcdTA2NDVcXHUwNjM5IFxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzMVxcdTA2MzlcXHUwNjJmXFx1MDY0YVxcdTA2MjkgXFx1MDY0NVxcdTA2MzkgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjNhXFx1MDYzMlxcdTA2NGFcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMCBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzBcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDYzNFxcdTA2MmZcXHUwNjRhXFx1MDYyZiBcXHUwNjI3XFx1MDY0NFxcdTA2NDNcXHUwNjJiXFx1MDYyN1xcdTA2NDFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcIlxcdTA2MzFcXHUwNjMwXFx1MDYyN1xcdTA2MzAgXFx1MDY0NVxcdTA2MzdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJcXHUwNjMxXFx1MDYzMFxcdTA2MjdcXHUwNjMwIFxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjM0XFx1MDYyZlxcdTA2NGFcXHUwNjJmIFxcdTA2MjdcXHUwNjQ0XFx1MDY0M1xcdTA2MmJcXHUwNjI3XFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDYzMVxcdTA2MzBcXHUwNjI3XFx1MDYzMFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MmVcXHUwNjQxXFx1MDY0YVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcIlxcdTA2NDVcXHUwNjM3XFx1MDYzMSBcXHUwNjQ1XFx1MDYyYVxcdTA2NDhcXHUwNjMzXFx1MDYzNyBcXHUwNjI3XFx1MDY0NFxcdTA2M2FcXHUwNjMyXFx1MDYyN1xcdTA2MzFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYzYVxcdTA2MzJcXHUwNjRhXFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUwNFwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzlcXHUwNjI3XFx1MDY0NFxcdTA2NGEgXFx1MDYyN1xcdTA2NDRcXHUwNjNhXFx1MDYzMlxcdTA2MjdcXHUwNjMxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjUxMVwiOlwiXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MjhcXHUwNjMxXFx1MDYyZlwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzEgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NCBcXHUwNjQ1XFx1MDYzN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA2NDhcXHUwNjI3XFx1MDYyOFxcdTA2NDQgXFx1MDY0NVxcdTA2MzdcXHUwNjMxIFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmYgXFx1MDYyN1xcdTA2NDRcXHUwNjQzXFx1MDYyYlxcdTA2MjdcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyYyBcXHUwNjJlXFx1MDY0MVxcdTA2NGFcXHUwNjQxXFx1MDY0N1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyY1wiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXFx1MDYyYlxcdTA2NDRcXHUwNjQ4XFx1MDYyYyBcXHUwNjQyXFx1MDY0OFxcdTA2NGFcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNjM1XFx1MDY0MlxcdTA2NGFcXHUwNjM5XCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJcXHUwNjQ4XFx1MDYyN1xcdTA2MjhcXHUwNjQ0IFxcdTA2MmJcXHUwNjQ0XFx1MDY0OFxcdTA2MmNcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA2MzZcXHUwNjI4XFx1MDYyN1xcdTA2MjhcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcIlxcdTA2MmZcXHUwNjJlXFx1MDYyN1xcdTA2NDZcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDVcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlxcdTA2M2FcXHUwNjI4XFx1MDYyN1xcdTA2MzFcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0NVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXFx1MDYzM1xcdTA2NDVcXHUwNjI3XFx1MDYyMSBcXHUwNjM1XFx1MDYyN1xcdTA2NDFcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiXFx1MDYzYVxcdTA2MjdcXHUwNjI2XFx1MDY0NSBcXHUwNjJjXFx1MDYzMlxcdTA2MjZcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0NVxcdTA2MmFcXHUwNjQxXFx1MDYzMVxcdTA2NDJcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJcXHUwNjNhXFx1MDY0YVxcdTA2NDhcXHUwNjQ1IFxcdTA2NDVcXHUwNjJhXFx1MDY0NlxcdTA2MjdcXHUwNjJiXFx1MDYzMVxcdTA2NDdcIixcclxuICAgICAgICAgICAgXCI4MDRcIjpcIlxcdTA2M2FcXHUwNjRhXFx1MDY0OFxcdTA2NDUgXFx1MDY0MlxcdTA2MjdcXHUwNjJhXFx1MDY0NVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYzNVxcdTA2MjdcXHUwNjMxXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOSBcXHUwNjI3XFx1MDYzM1xcdTA2MmFcXHUwNjQ4XFx1MDYyN1xcdTA2MjZcXHUwNjRhXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiXFx1MDYzMlxcdTA2NDhcXHUwNjRhXFx1MDYzOVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA2MjhcXHUwNjI3XFx1MDYzMVxcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcIlxcdTA2MmRcXHUwNjI3XFx1MDYzMVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDYzMVxcdTA2NGFcXHUwNjI3XFx1MDYyZFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiXFx1MDY0OFxcdTA2MjdcXHUwNjI4XFx1MDY0NFwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXFx1MDYyNVxcdTA2MzlcXHUwNjJmXFx1MDYyN1xcdTA2MmZcIixcclxuICAgICAgICAgICAgXCI5NTFcIjpcIlxcdTA2NDdcXHUwNjI3XFx1MDYyZlxcdTA2MjZcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDYyZVxcdTA2NDFcXHUwNjRhXFx1MDY0MVwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiXFx1MDY0NlxcdTA2MzNcXHUwNjRhXFx1MDY0NSBcXHUwNjQ0XFx1MDYzN1xcdTA2NGFcXHUwNjQxXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2NDVcXHUwNjM5XFx1MDYyYVxcdTA2MmZcXHUwNjQ0XCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwNjQ2XFx1MDYzM1xcdTA2NGFcXHUwNjQ1IFxcdTA2MzlcXHUwNjQ0XFx1MDY0YVxcdTA2NDRcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIlxcdTA2NDZcXHUwNjMzXFx1MDY0YVxcdTA2NDUgXFx1MDY0MlxcdTA2NDhcXHUwNjRhXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcXHUwNjMxXFx1MDY0YVxcdTA2MjdcXHUwNjJkIFxcdTA2NDJcXHUwNjQ4XFx1MDY0YVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTA2MzlcXHUwNjI3XFx1MDYzNVxcdTA2NDFcXHUwNjI5IFxcdTA2MzRcXHUwNjJmXFx1MDY0YVxcdTA2MmZcXHUwNjI5XCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcXHUwNjM5XFx1MDYyN1xcdTA2MzVcXHUwNjQxXFx1MDYyOVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiXFx1MDYzOVxcdTA2MjdcXHUwNjM1XFx1MDY0MVxcdTA2MjkgXFx1MDYzOVxcdTA2NDZcXHUwNjRhXFx1MDY0MVxcdTA2MjlcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTA2MjVcXHUwNjM5XFx1MDYzNVxcdTA2MjdcXHUwNjMxXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJta1wiOntcclxuICAgICAgICBcIm5hbWVcIjpcIk1hY2Vkb25pYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzggXFx1MDQ0MVxcdTA0M2UgXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4XCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDNkXFx1MDQzOCBcXHUwNDMzXFx1MDQ0MFxcdTA0M2NcXHUwNDM1XFx1MDQzNlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlxcdTA0M2NcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDM4IFxcdTA0MzNcXHUwNDQwXFx1MDQzY1xcdTA0MzVcXHUwNDM2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDNiXFx1MDQzMFxcdTA0MzFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiXFx1MDQzM1xcdTA0NDBcXHUwNDNjXFx1MDQzNVxcdTA0MzZcXHUwNDM4IFxcdTA0NDFcXHUwNDNlIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMVxcdTA0M2UgXFx1MDQ0MFxcdTA0M2VcXHUwNDQxXFx1MDQzNVxcdTA0NWFcXHUwNDM1XCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiXFx1MDQzNFxcdTA0M2VcXHUwNDM2XFx1MDQzNFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIlxcdTA0M2NcXHUwNDNkXFx1MDQzZVxcdTA0MzNcXHUwNDQzIFxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0MzVcXHUwNDNkIFxcdTA0MzRcXHUwNDNlXFx1MDQzNlxcdTA0MzRcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDM0XFx1MDQzZVxcdTA0MzZcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJcXHUwNDQxXFx1MDQzYlxcdTA0MzBcXHUwNDMxXFx1MDQzZSBcXHUwNDQwXFx1MDQzZVxcdTA0NDFcXHUwNDM1XFx1MDQ1YVxcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcIlxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlxcdTA0NDFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0NDBcXHUwNDNlXFx1MDQ0MVxcdTA0MzVcXHUwNDVhXFx1MDQzNVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwiXFx1MDQ0MVxcdTA0M2JcXHUwNDMwXFx1MDQzMSBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJcXHUwNDQxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDQxXFx1MDQzZFxcdTA0MzVcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcXHUwNDNiXFx1MDQzMFxcdTA0M2ZcXHUwNDMwXFx1MDQzMlxcdTA0MzhcXHUwNDQ2XFx1MDQzMFwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXFx1MDQzYlxcdTA0MzBcXHUwNDNmXFx1MDQzMFxcdTA0MzJcXHUwNDM4XFx1MDQ0NlxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJcXHUwNDQxXFx1MDQzY1xcdTA0M2VcXHUwNDMzXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcXHUwNDM3XFx1MDQzMFxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDM1XFx1MDQzZFxcdTA0M2VcXHUwNDQxXFx1MDQ0MlwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiXFx1MDQzZlxcdTA0MzVcXHUwNDQxXFx1MDQzZVxcdTA0NDdcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQ0MFxcdTA0NDJcXHUwNDNiXFx1MDQzZVxcdTA0MzNcIixcclxuICAgICAgICAgICAgXCI3NDFcIjpcIlxcdTA0M2NcXHUwNDMwXFx1MDQzM1xcdTA0M2JcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJcXHUwNDQ3XFx1MDQzOFxcdTA0NDFcXHUwNDQyXFx1MDQzZSBcXHUwNDNkXFx1MDQzNVxcdTA0MzFcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcXHUwNDNkXFx1MDQzNVxcdTA0M2FcXHUwNDNlXFx1MDQzYlxcdTA0M2FcXHUwNDQzIFxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwiXFx1MDQzZVxcdTA0MzRcXHUwNDMyXFx1MDQzZVxcdTA0MzVcXHUwNDNkXFx1MDQzOCBcXHUwNDNlXFx1MDQzMVxcdTA0M2JcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcIlxcdTA0M2VcXHUwNDMxXFx1MDQzYlxcdTA0MzBcXHUwNDQ2XFx1MDQzOFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiXFx1MDQzZVxcdTA0MzFcXHUwNDNiXFx1MDQzMFxcdTA0NDdcXHUwNDNkXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwiXFx1MDQ0MlxcdTA0M2VcXHUwNDQwXFx1MDQzZFxcdTA0MzBcXHUwNDM0XFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXFx1MDQ0MlxcdTA0NDBcXHUwNDNlXFx1MDQzZlxcdTA0NDFcXHUwNDNhXFx1MDQzMCBcXHUwNDMxXFx1MDQ0M1xcdTA0NDBcXHUwNDMwXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcXHUwNDMzXFx1MDQzMFxcdTA0M2RcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlxcdTA0M2JcXHUwNDMwXFx1MDQzNFxcdTA0M2RcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJcXHUwNDQyXFx1MDQzZVxcdTA0M2ZcXHUwNDNiXFx1MDQzZVwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQ0MFxcdTA0M2VcXHUwNDMyXFx1MDQzOFxcdTA0NDJcXHUwNDNlXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJcXHUwNDMzXFx1MDQ0MFxcdTA0MzBcXHUwNDM0XCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJcXHUwNDE3XFx1MDQzMFxcdTA0M2JcXHUwNDM1XFx1MDQzN1wiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiXFx1MDQxY1xcdTA0MzhcXHUwNDQwXFx1MDQzZFxcdTA0M2VcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcIlxcdTA0MjFcXHUwNDNiXFx1MDQzMFxcdTA0MzEgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlxcdTA0MTJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwNDIxXFx1MDQzMlxcdTA0MzVcXHUwNDM2IFxcdTA0MzJcXHUwNDM1XFx1MDQ0MlxcdTA0MzBcXHUwNDQwXCIsXHJcbiAgICAgICAgICAgIFwiOTU2XCI6XCJcXHUwNDIxXFx1MDQzOFxcdTA0M2JcXHUwNDM1XFx1MDQzZCBcXHUwNDMyXFx1MDQzNVxcdTA0NDJcXHUwNDMwXFx1MDQ0MFwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDQxY1xcdTA0M2RcXHUwNDNlXFx1MDQzM1xcdTA0NDMgXFx1MDQ0MVxcdTA0MzhcXHUwNDNiXFx1MDQzNVxcdTA0M2QgXFx1MDQzMlxcdTA0MzVcXHUwNDQyXFx1MDQzMFxcdTA0NDBcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlxcdTA0MWRcXHUwNDM1XFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDNlIFxcdTA0M2RcXHUwNDM1XFx1MDQzMlxcdTA0NDBcXHUwNDM1XFx1MDQzY1xcdTA0MzVcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlxcdTA0MTFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlxcdTA0MjFcXHUwNDM4XFx1MDQzYlxcdTA0M2RcXHUwNDMwIFxcdTA0MzFcXHUwNDQzXFx1MDQ0MFxcdTA0MzBcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIlxcdTA0MjNcXHUwNDQwXFx1MDQzMFxcdTA0MzNcXHUwNDMwXFx1MDQzZFwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwic2tcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJTbG92YWtcIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJiXFx1MDBmYXJrYSBzbyBzbGFiXFx1MDBmZG0gZGFcXHUwMTdlXFx1MDEwZm9tXCIsXHJcbiAgICAgICAgICAgIFwiMjAxXCI6XCJiXFx1MDBmYXJrYSBzIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMlwiOlwiYlxcdTAwZmFya2Egc28gc2lsblxcdTAwZmRtIGRhXFx1MDE3ZVxcdTAxMGZvbVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwibWllcm5hIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiMjExXCI6XCJiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwic2lsblxcdTAwZTEgYlxcdTAwZmFya2FcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcInBydWRrXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiYlxcdTAwZmFya2Egc28gc2xhYlxcdTAwZmRtIG1yaG9sZW5cXHUwMGVkbVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiYlxcdTAwZmFya2EgcyBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImJcXHUwMGZhcmthIHNvIHNpbG5cXHUwMGZkbSBtcmhvbGVuXFx1MDBlZG1cIixcclxuICAgICAgICAgICAgXCIzMDBcIjpcInNsYWJcXHUwMGU5IG1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwibXJob2xlbmllXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJzaWxuXFx1MDBlOSBtcmhvbGVuaWVcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInNsYWJcXHUwMGU5IHBvcFxcdTAxNTVjaGFuaWVcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInBvcFxcdTAxNTVjaGFuaWVcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcInNpbG5cXHUwMGU5IHBvcFxcdTAxNTVjaGFuaWVcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcImplbW5cXHUwMGU5IG1yaG9sZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYlxcdTAwZmQgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwibWllcm55IGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcInNpbG5cXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcInZlXFx1MDEzZW1pIHNpbG5cXHUwMGZkIGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJcXHUwMGU5bW55IGRcXHUwMGUxXFx1MDE3ZVxcdTAxMGZcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIm1yem5cXHUwMGZhY2kgZFxcdTAwZTFcXHUwMTdlXFx1MDEwZlwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwic2xhYlxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInByZWhcXHUwMGUxbmthXCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJzaWxuXFx1MDBlMSBwcmVoXFx1MDBlMW5rYVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOlwic2xhYlxcdTAwZTkgc25lXFx1MDE3ZWVuaWVcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcInNuZVxcdTAxN2VlbmllXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJzaWxuXFx1MDBlOSBzbmVcXHUwMTdlZW5pZVwiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiZFxcdTAwZTFcXHUwMTdlXFx1MDEwZiBzbyBzbmVob21cIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcInNuZWhvdlxcdTAwZTEgcHJlaFxcdTAwZTFua2FcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcImhtbGFcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImR5bVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwib3BhclwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwicGllc2tvdlxcdTAwZTlcXC9wcmFcXHUwMTYxblxcdTAwZTkgdlxcdTAwZWRyeVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiaG1sYVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiamFzblxcdTAwZTEgb2Jsb2hhXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJ0YWttZXIgamFzbm9cIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInBvbG9qYXNub1wiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwib2JsYVxcdTAxMGRub1wiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiemFtcmFcXHUwMTBkZW5cXHUwMGU5XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0cm9waWNrXFx1MDBlMSBiXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiaHVyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiemltYVwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiaG9yXFx1MDBmYWNvXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJ2ZXRlcm5vXCIsXHJcbiAgICAgICAgICAgIFwiOTA2XCI6XCJrcnVwb2JpdGllXCIsXHJcbiAgICAgICAgICAgIFwiOTUwXCI6XCJOYXN0YXZlbmllXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJCZXp2ZXRyaWVcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlNsYWJcXHUwMGZkIHZcXHUwMGUxbm9rXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJKZW1uXFx1MDBmZCB2aWV0b3JcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIlN0cmVkblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJcXHUwMTBjZXJzdHZcXHUwMGZkIHZpZXRvclwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiU2lsblxcdTAwZmQgdmlldG9yXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJTaWxuXFx1MDBmZCB2aWV0b3IsIHRha21lciB2XFx1MDBlZGNocmljYVwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVlxcdTAwZWRjaHJpY2FcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlNpbG5cXHUwMGUxIHZcXHUwMGVkY2hyaWNhXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJCXFx1MDBmYXJrYVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiTmlcXHUwMTBkaXZcXHUwMGUxIGJcXHUwMGZhcmthXCIsXHJcbiAgICAgICAgICAgIFwiOTYyXCI6XCJIdXJpa1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJodVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkh1bmdhcmlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcInZpaGFyIGVueWhlIGVzXFx1MDE1MXZlbFwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwidmloYXIgZXNcXHUwMTUxdmVsXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJ2aWhhciBoZXZlcyBlc1xcdTAxNTF2ZWxcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcImVueWhlIHppdmF0YXJcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcInZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJoZXZlcyB2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjIyMVwiOlwiZHVydmEgdmloYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcInZpaGFyIGVueWhlIHN6aXRcXHUwMGUxbFxcdTAwZTFzc2FsXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJ2aWhhciBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwidmloYXIgZXJcXHUwMTUxcyBzeml0XFx1MDBlMWxcXHUwMGUxc3NhbFwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiZW55aGUgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJlclxcdTAxNTFzIGludGVueml0XFx1MDBlMXNcXHUwMGZhIHN6aXRcXHUwMGUxbFxcdTAwZTFzXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBzeml0XFx1MDBlMWxcXHUwMGYzIGVzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwic3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgc3ppdFxcdTAwZTFsXFx1MDBmMyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInpcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJlbnloZSBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDFcIjpcImtcXHUwMGY2emVwZXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTAyXCI6XCJoZXZlcyBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDNcIjpcIm5hZ3lvbiBoZXZlcyBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImV4dHJcXHUwMGU5bSBlc1xcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlxcdTAwZjNub3MgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJlbnloZSBpbnRlbnppdFxcdTAwZTFzXFx1MDBmYSB6XFx1MDBlMXBvclwiLFxyXG4gICAgICAgICAgICBcIjUyMVwiOlwielxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcImVyXFx1MDE1MXMgaW50ZW56aXRcXHUwMGUxc1xcdTAwZmEgelxcdTAwZTFwb3JcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcImVueWhlIGhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcImhhdmF6XFx1MDBlMXNcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcImVyXFx1MDE1MXMgaGF2YXpcXHUwMGUxc1wiLFxyXG4gICAgICAgICAgICBcIjYxMVwiOlwiaGF2YXMgZXNcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiNjIxXCI6XCJoXFx1MDBmM3pcXHUwMGUxcG9yXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJneWVuZ2Uga1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJrXFx1MDBmNmRcIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcImtcXHUwMGY2ZFwiLFxyXG4gICAgICAgICAgICBcIjczMVwiOlwiaG9tb2t2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwia1xcdTAwZjZkXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJ0aXN6dGEgXFx1MDBlOWdib2x0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJrZXZcXHUwMGU5cyBmZWxoXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjgwMlwiOlwic3pcXHUwMGYzcnZcXHUwMGUxbnlvcyBmZWxoXFx1MDE1MXpldFwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiZXJcXHUwMTUxcyBmZWxoXFx1MDE1MXpldFwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiYm9yXFx1MDBmYXMgXFx1MDBlOWdib2x0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJ0b3JuXFx1MDBlMWRcXHUwMGYzXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJ0clxcdTAwZjNwdXNpIHZpaGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJodXJyaWtcXHUwMGUxblwiLFxyXG4gICAgICAgICAgICBcIjkwM1wiOlwiaFxcdTAxNzF2XFx1MDBmNnNcIixcclxuICAgICAgICAgICAgXCI5MDRcIjpcImZvcnJcXHUwMGYzXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJzemVsZXNcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcImpcXHUwMGU5Z2VzXFx1MDE1MVwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiTnl1Z29kdFwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ3NlbmRlc1wiLFxyXG4gICAgICAgICAgICBcIjk1MlwiOlwiRW55aGUgc3plbGxcXHUwMTUxXCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJGaW5vbSBzemVsbFxcdTAxNTFcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIktcXHUwMGY2emVwZXMgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwiXFx1MDBjOWxcXHUwMGU5bmsgc3pcXHUwMGU5bFwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiRXJcXHUwMTUxcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJFclxcdTAxNTFzLCBtXFx1MDBlMXIgdmloYXJvcyBzelxcdTAwZTlsXCIsXHJcbiAgICAgICAgICAgIFwiOTU4XCI6XCJWaWhhcm9zIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIkVyXFx1MDE1MXNlbiB2aWhhcm9zIHN6XFx1MDBlOWxcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIlN6XFx1MDBlOWx2aWhhclwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVG9tYm9sXFx1MDBmMyBzelxcdTAwZTlsdmloYXJcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cnJpa1xcdTAwZTFuXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXCJjYVwiOntcclxuICAgICAgICBcIm5hbWVcIjpcIkNhdGFsYW5cIixcclxuICAgICAgICBcIm1haW5cIjpcIlwiLFxyXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjp7XHJcbiAgICAgICAgICAgIFwiMjAwXCI6XCJUZW1wZXN0YSBhbWIgcGx1amEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiVGVtcGVzdGEgYW1iIHBsdWphXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJUZW1wZXN0YSBhbWIgcGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjIxMFwiOlwiVGVtcGVzdGEgc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiVGVtcGVzdGFcIixcclxuICAgICAgICAgICAgXCIyMTJcIjpcIlRlbXBlc3RhIGZvcnRhXCIsXHJcbiAgICAgICAgICAgIFwiMjIxXCI6XCJUZW1wZXN0YSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCIyMzBcIjpcIlRlbXBlc3RhIGFtYiBwbHVnaW0gc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiVGVtcGVzdGEgYW1iIHBsdWdpblwiLFxyXG4gICAgICAgICAgICBcIjIzMlwiOlwiVGVtcGVzdGEgYW1iIG1vbHQgcGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6XCJQbHVnaW0gc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjMwMVwiOlwiUGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiMzAyXCI6XCJQbHVnaW0gaW50ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiMzEwXCI6XCJQbHVnaW0gc3VhdVwiLFxyXG4gICAgICAgICAgICBcIjMxMVwiOlwiUGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiMzEyXCI6XCJQbHVnaW0gaW50ZW5zXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJQbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjMxNFwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjMyMVwiOlwiUGx1Z2ltXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6XCJQbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJQbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwiUGx1amEgaW50ZW5zYVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiUGx1amEgbW9sdCBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJQbHVqYSBleHRyZW1hXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJQbHVqYSBnbGFcXHUwMGU3YWRhXCIsXHJcbiAgICAgICAgICAgIFwiNTIwXCI6XCJQbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJQbHVqYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNTIyXCI6XCJQbHVqYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNTMxXCI6XCJQbHVqYSBpcnJlZ3VsYXJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcIk5ldmFkYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiNjAxXCI6XCJOZXZhZGFcIixcclxuICAgICAgICAgICAgXCI2MDJcIjpcIk5ldmFkYSBpbnRlbnNhXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJBaWd1YW5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxMlwiOlwiUGx1amEgZCdhaWd1YW5ldVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwiUGx1Z2ltIGkgbmV1XCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJQbHVqYSBpIG5ldVwiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwiTmV2YWRhIHN1YXVcIixcclxuICAgICAgICAgICAgXCI2MjFcIjpcIk5ldmFkYVwiLFxyXG4gICAgICAgICAgICBcIjYyMlwiOlwiTmV2YWRhIGludGVuc2FcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIkJvaXJhXCIsXHJcbiAgICAgICAgICAgIFwiNzExXCI6XCJGdW1cIixcclxuICAgICAgICAgICAgXCI3MjFcIjpcIkJvaXJpbmFcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlNvcnJhXCIsXHJcbiAgICAgICAgICAgIFwiNzQxXCI6XCJCb2lyYVwiLFxyXG4gICAgICAgICAgICBcIjc1MVwiOlwiU29ycmFcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcIlBvbHNcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcIkNlbmRyYSB2b2xjXFx1MDBlMG5pY2FcIixcclxuICAgICAgICAgICAgXCI3NzFcIjpcIlhcXHUwMGUwZmVjXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJDZWwgbmV0XCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJMbGV1Z2VyYW1lbnQgZW5udXZvbGF0XCIsXHJcbiAgICAgICAgICAgIFwiODAyXCI6XCJOXFx1MDBmYXZvbHMgZGlzcGVyc29zXCIsXHJcbiAgICAgICAgICAgIFwiODAzXCI6XCJOdXZvbG9zaXRhdCB2YXJpYWJsZVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwiRW5udXZvbGF0XCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6XCJUb3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiOTAxXCI6XCJUZW1wZXN0YSB0cm9waWNhbFwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwiSHVyYWNcXHUwMGUwXCIsXHJcbiAgICAgICAgICAgIFwiOTAzXCI6XCJGcmVkXCIsXHJcbiAgICAgICAgICAgIFwiOTA0XCI6XCJDYWxvclwiLFxyXG4gICAgICAgICAgICBcIjkwNVwiOlwiVmVudFwiLFxyXG4gICAgICAgICAgICBcIjkwNlwiOlwiUGVkcmFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwiQ2FsbWF0XCIsXHJcbiAgICAgICAgICAgIFwiOTUyXCI6XCJCcmlzYSBzdWF1XCIsXHJcbiAgICAgICAgICAgIFwiOTUzXCI6XCJCcmlzYSBhZ3JhZGFibGVcIixcclxuICAgICAgICAgICAgXCI5NTRcIjpcIkJyaXNhIG1vZGVyYWRhXCIsXHJcbiAgICAgICAgICAgIFwiOTU1XCI6XCJCcmlzYSBmcmVzY2FcIixcclxuICAgICAgICAgICAgXCI5NTZcIjpcIkJyaXNjYSBmb3JhXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJWZW50IGludGVuc1wiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwiVmVuZGF2YWxcIixcclxuICAgICAgICAgICAgXCI5NTlcIjpcIlZlbmRhdmFsIHNldmVyXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJUZW1wZXN0YVwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiVGVtcGVzdGEgdmlvbGVudGFcIixcclxuICAgICAgICAgICAgXCI5NjJcIjpcIkh1cmFjXFx1MDBlMFwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIFwiaHJcIjp7XHJcbiAgICAgICAgXCJuYW1lXCI6XCJDcm9hdGlhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIHNsYWJvbSBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMga2lcXHUwMTYxb21cIixcclxuICAgICAgICAgICAgXCIyMDJcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzIGpha29tIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiMjEwXCI6XCJzbGFiYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMTFcIjpcImdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIxMlwiOlwiamFrYSBncm1samF2aW5za2Egb2x1amFcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIm9ya2Fuc2thIGdybWxqYXZpbnNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiZ3JtbGphdmluc2thIG9sdWphIHNhIHNsYWJvbSByb3N1bGpvbVwiLFxyXG4gICAgICAgICAgICBcIjIzMVwiOlwiZ3JtbGphdmluc2thIG9sdWphIHMgcm9zdWxqb21cIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcImdybWxqYXZpbnNrYSBvbHVqYSBzYSBqYWtvbSByb3N1bGpvbVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwicm9zdWxqYSBzbGFib2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMDFcIjpcInJvc3VsamFcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcInJvc3VsamEgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMTBcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbSBzbGFib2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCIzMTFcIjpcInJvc3VsamEgcyBraVxcdTAxNjFvbVwiLFxyXG4gICAgICAgICAgICBcIjMxMlwiOlwicm9zdWxqYSBzIGtpXFx1MDE2MW9tIGpha29nIGludGVueml0ZXRhXCIsXHJcbiAgICAgICAgICAgIFwiMzEzXCI6XCJwbGp1c2tvdmkgaSByb3N1bGphXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJyb3N1bGphIHMgamFraW0gcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcInJvc3VsamEgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwic2xhYmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUwMVwiOlwidW1qZXJlbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUwMlwiOlwia2lcXHUwMTYxYSBqYWtvZyBpbnRlbnppdGV0YVwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwidnJsbyBqYWthIGtpXFx1MDE2MWFcIixcclxuICAgICAgICAgICAgXCI1MDRcIjpcImVrc3RyZW1uYSBraVxcdTAxNjFhXCIsXHJcbiAgICAgICAgICAgIFwiNTExXCI6XCJsZWRlbmEga2lcXHUwMTYxYVwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwicGxqdXNhayBzbGFib2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MjFcIjpcInBsanVzYWtcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcInBsanVzYWsgamFrb2cgaW50ZW56aXRldGFcIixcclxuICAgICAgICAgICAgXCI1MzFcIjpcIm9sdWpuYSBraVxcdTAxNjFhIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MDBcIjpcInNsYWJpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYwMVwiOlwic25pamVnXCIsXHJcbiAgICAgICAgICAgIFwiNjAyXCI6XCJndXN0aSBzbmlqZWdcIixcclxuICAgICAgICAgICAgXCI2MTFcIjpcInN1c25qZVxcdTAxN2VpY2FcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcInN1c25qZVxcdTAxN2VpY2EgcyBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwic2xhYmEga2lcXHUwMTYxYSBpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYxNlwiOlwia2lcXHUwMTYxYSBpIHNuaWplZ1wiLFxyXG4gICAgICAgICAgICBcIjYyMFwiOlwic25pamVnIHMgcG92cmVtZW5pbSBwbGp1c2tvdmltYVwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwic25pamVnIHMgcGxqdXNrb3ZpbWFcIixcclxuICAgICAgICAgICAgXCI2MjJcIjpcInNuaWplZyBzIGpha2ltIHBsanVza292aW1hXCIsXHJcbiAgICAgICAgICAgIFwiNzAxXCI6XCJzdW1hZ2xpY2FcIixcclxuICAgICAgICAgICAgXCI3MTFcIjpcImRpbVwiLFxyXG4gICAgICAgICAgICBcIjcyMVwiOlwiaXptYWdsaWNhXCIsXHJcbiAgICAgICAgICAgIFwiNzMxXCI6XCJrb3ZpdGxhY2kgcGlqZXNrYSBpbGkgcHJhXFx1MDE2MWluZVwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwibWFnbGFcIixcclxuICAgICAgICAgICAgXCI3NTFcIjpcInBpamVzYWtcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcInByYVxcdTAxNjFpbmFcIixcclxuICAgICAgICAgICAgXCI3NjJcIjpcInZ1bGthbnNraSBwZXBlb1wiLFxyXG4gICAgICAgICAgICBcIjc3MVwiOlwiemFwdXNpIHZqZXRyYSBzIGtpXFx1MDE2MW9tXCIsXHJcbiAgICAgICAgICAgIFwiNzgxXCI6XCJ0b3JuYWRvXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6XCJ2ZWRyb1wiLFxyXG4gICAgICAgICAgICBcIjgwMVwiOlwiYmxhZ2EgbmFvYmxha2FcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcInJhXFx1MDE2MXRya2FuaSBvYmxhY2lcIixcclxuICAgICAgICAgICAgXCI4MDNcIjpcImlzcHJla2lkYW5pIG9ibGFjaVwiLFxyXG4gICAgICAgICAgICBcIjgwNFwiOlwib2JsYVxcdTAxMGRub1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOlwidG9ybmFkb1wiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwidHJvcHNrYSBvbHVqYVwiLFxyXG4gICAgICAgICAgICBcIjkwMlwiOlwib3JrYW5cIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcImhsYWRub1wiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwidnJ1XFx1MDEwN2VcIixcclxuICAgICAgICAgICAgXCI5MDVcIjpcInZqZXRyb3ZpdG9cIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcInR1XFx1MDEwZGFcIixcclxuICAgICAgICAgICAgXCI5NTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MVwiOlwibGFob3JcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcInBvdmpldGFyYWNcIixcclxuICAgICAgICAgICAgXCI5NTNcIjpcInNsYWIgdmpldGFyXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJ1bWplcmVuIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NVwiOlwidW1qZXJlbm8gamFrIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiamFrIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1N1wiOlwiXFx1MDE3ZWVzdG9rIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1OFwiOlwib2x1am5pIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiamFrIG9sdWpuaSB2amV0YXJcIixcclxuICAgICAgICAgICAgXCI5NjBcIjpcIm9ya2Fuc2tpIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk2MVwiOlwiamFrIG9ya2Fuc2tpIHZqZXRhclwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwib3JrYW5cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcImJsYW5rXCI6e1xyXG4gICAgICAgIFwibmFtZVwiOlwiQ2F0YWxhblwiLFxyXG4gICAgICAgIFwibWFpblwiOlwiXCIsXHJcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOntcclxuICAgICAgICAgICAgXCIyMDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMTBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjEyXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjIzMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMjMxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIyMzJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzExXCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjMxM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiMzE0XCI6XCJcIixcclxuICAgICAgICAgICAgXCIzMjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUwM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTA0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MTFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUyMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNTIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI1MjJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjUzMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYwMlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjExXCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYxNVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjE2XCI6XCJcIixcclxuICAgICAgICAgICAgXCI2MjBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjYyMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNjIyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MDFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjcxMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzIxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3MzFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc0MVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzUxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3NjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjc2MlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiNzcxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI3ODFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODAxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI4MDJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjgwM1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiODA0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDBcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwMVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTAyXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDNcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjkwNFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTA1XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5MDZcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1MFwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTUxXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTJcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1M1wiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU0XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NTVcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1NlwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTU3XCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NThcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk1OVwiOlwiXCIsXHJcbiAgICAgICAgICAgIFwiOTYwXCI6XCJcIixcclxuICAgICAgICAgICAgXCI5NjFcIjpcIlwiLFxyXG4gICAgICAgICAgICBcIjk2MlwiOlwiXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjAuMTAuMjAxNi5cclxuICovXHJcbmV4cG9ydCBjb25zdCB3aW5kU3BlZWQgPSB7XHJcbiAgICBcImVuXCI6e1xyXG4gICAgICAgIFwiU2V0dGluZ3NcIjoge1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFswLjAsIDAuM10sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjAtMSAgIFNtb2tlIHJpc2VzIHN0cmFpZ2h0IHVwXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiQ2FsbVwiOiB7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzAuMywgMS42XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMS0zIE9uZSBjYW4gc2VlIGRvd253aW5kIG9mIHRoZSBzbW9rZSBkcmlmdFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkxpZ2h0IGJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMS42LCAzLjNdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0LTYgT25lIGNhbiBmZWVsIHRoZSB3aW5kLiBUaGUgbGVhdmVzIG9uIHRoZSB0cmVlcyBtb3ZlLCB0aGUgd2luZCBjYW4gbGlmdCBzbWFsbCBzdHJlYW1lcnMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiR2VudGxlIEJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMy40LCA1LjVdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI3LTEwIExlYXZlcyBhbmQgdHdpZ3MgbW92ZS4gV2luZCBleHRlbmRzIGxpZ2h0IGZsYWcgYW5kIHBlbm5hbnRzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiTW9kZXJhdGUgYnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFs1LjUsIDguMF0sXHJcbiAgICAgICAgICAgIFwiZGVzY1wiOiBcIjExLTE2ICAgVGhlIHdpbmQgcmFpc2VzIGR1c3QgYW5kIGxvb3NlIHBhcGVycywgdG91Y2hlcyBvbiB0aGUgdHdpZ3MgYW5kIHNtYWxsIGJyYW5jaGVzLCBzdHJldGNoZXMgbGFyZ2VyIGZsYWdzIGFuZCBwZW5uYW50c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkZyZXNoIEJyZWV6ZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbOC4wLCAxMC44XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMTctMjEgICBTbWFsbCB0cmVlcyBpbiBsZWFmIGJlZ2luIHRvIHN3YXkuIFRoZSB3YXRlciBiZWdpbnMgbGl0dGxlIHdhdmVzIHRvIHBlYWtcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJTdHJvbmcgYnJlZXplXCI6e1xyXG4gICAgICAgICAgICBcInNwZWVkX2ludGVydmFsXCI6IFsxMC44LCAxMy45XSxcclxuICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjItMjcgICBMYXJnZSBicmFuY2hlcyBhbmQgc21hbGxlciB0cmliZXMgbW92ZXMuIFRoZSB3aGl6IG9mIHRlbGVwaG9uZSBsaW5lcy4gSXQgaXMgZGlmZmljdWx0IHRvIHVzZSB0aGUgdW1icmVsbGEuIEEgcmVzaXN0YW5jZSB3aGVuIHJ1bm5pbmcuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiSGlnaCB3aW5kLCBuZWFyIGdhbGVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzEzLjksIDE3LjJdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIyOC0zMyAgIFdob2xlIHRyZWVzIGluIG1vdGlvbi4gSXQgaXMgaGFyZCB0byBnbyBhZ2FpbnN0IHRoZSB3aW5kLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkdhbGVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzE3LjIsIDIwLjddLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCIzNC00MCAgIFRoZSB3aW5kIGJyZWFrIHR3aWdzIG9mIHRyZWVzLiBJdCBpcyBoYXJkIHRvIGdvIGFnYWluc3QgdGhlIHdpbmQuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU2V2ZXJlIEdhbGVcIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzIwLjgsIDI0LjVdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0MS00NyAgIEFsbCBsYXJnZSB0cmVlcyBzd2F5aW5nIGFuZCB0aHJvd3MuIFRpbGVzIGNhbiBibG93IGRvd24uXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiU3Rvcm1cIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzI0LjUsIDI4LjVdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI0OC01NSAgIFJhcmUgaW5sYW5kLiBUcmVlcyB1cHJvb3RlZC4gU2VyaW91cyBkYW1hZ2UgdG8gaG91c2VzLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIlZpb2xlbnQgU3Rvcm1cIjp7XHJcbiAgICAgICAgICAgIFwic3BlZWRfaW50ZXJ2YWxcIjogWzI4LjUsIDMyLjddLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCI1Ni02MyAgIE9jY3VycyByYXJlbHkgYW5kIGlzIGZvbGxvd2VkIGJ5IGRlc3RydWN0aW9uLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIkh1cnJpY2FuZVwiOntcclxuICAgICAgICAgICAgXCJzcGVlZF9pbnRlcnZhbFwiOiBbMzIuNywgNjRdLFxyXG4gICAgICAgICAgICBcImRlc2NcIjogXCJPY2N1cnMgdmVyeSByYXJlbHkuIFVudXN1YWxseSBzZXZlcmUgZGFtYWdlLlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Oy8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDIxLjEwLjIwMTYuXHJcbiAqL1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAxMy4xMC4yMDE2LlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdG9yV2lkZ2V0IHtcclxuICAgIGNvbnN0cnVjdG9yKGlkID0gMSwgY2l0eV9pZCA9IDUyNDkwMSwga2V5ID0gJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyApe1xyXG5cclxuICAgICAgICB0aGlzLmJhc2VVUkwgPSAnaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd20nO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0RDNTUkMgPSBgJHt0aGlzLmJhc2VVUkx9L2pzL2xpYnMvZDMubWluLmpzYDtcclxuICAgICAgICB0aGlzLnNjcmlwdFNSQyA9IGAke3RoaXMuYmFzZVVSTH0vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzYDtcclxuXHJcbiAgICAgICAgLy8g0L7QsdGK0LXQutGCLdC60LDRgNGC0LAg0LTQu9GPINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNGPINCy0YHQtdGFINCy0LjQtNC20LXRgtC+0LIg0YEg0LrQvdC+0L/QutC+0Lkt0LjQvdC40YbQuNCw0YLQvtGA0L7QvCDQuNGFINCy0YvQt9C+0LLQsCDQtNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INC60L7QtNCwXHJcbiAgICAgICAgdGhpcy5tYXBXaWRnZXRzID0ge1xyXG4gICAgICAgICAgICAnd2lkZ2V0LTEtbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IGA8c2NyaXB0IHNyYz1cImh0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy9kMy5taW4uanNcIj48L3NjcmlwdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEsIGNpdHlfaWQsIGtleSl9YCxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTItbGVmdC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgzLCBjaXR5X2lkLCBrZXkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNC1sZWZ0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNCwgY2l0eV9pZCwga2V5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTUtcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg1LCBjaXR5X2lkLCBrZXkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNi1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDYsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC03LXJpZ2h0LWJsdWUnIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNywgY2l0eV9pZCwga2V5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTgtcmlnaHQtYmx1ZScgOiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCg4LCBjaXR5X2lkLCBrZXkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtOS1yaWdodC1ibHVlJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDksIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0xLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogYDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9vcGVud2VhdGhlcm1hcC5vcmcvdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtL2pzL2QzLm1pbi5qc1wiPjwvc2NyaXB0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICR7dGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTEsIGNpdHlfaWQsIGtleSl9YCxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTIsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMy1sZWZ0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEzLCBjaXR5X2lkLCBrZXkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTQtbGVmdC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNCwgY2l0eV9pZCwga2V5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC01LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE1LCBjaXR5X2lkLCBrZXkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTYtcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTYsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtNy1yaWdodC1icm93bicgOiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNywgY2l0eV9pZCwga2V5KSxcclxuICAgICAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC04LXJpZ2h0LWJyb3duJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE4LCBjaXR5X2lkLCBrZXkpLFxyXG4gICAgICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnd2lkZ2V0LTktcmlnaHQtYnJvd24nIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTksIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICd3aWRnZXQtMS1sZWZ0LXdoaXRlJyA6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IGA8c2NyaXB0IHNyYz1cImh0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy9kMy5taW4uanNcIj48L3NjcmlwdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIxLCBjaXR5X2lkLCBrZXkpfWAsXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0yLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjIsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC0zLWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjMsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3dpZGdldC00LWxlZnQtd2hpdGUnIDoge1xyXG4gICAgICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjQsIGNpdHlfaWQsIGtleSksXHJcbiAgICAgICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KGlkLCBjaXR5X2lkID0gbnVsbCwga2V5LCBjaXR5X25hbWUgPSBudWxsKSB7XHJcbiAgICAgICAgaWYoaWQgJiYgKGNpdHlfaWQgfHwgY2l0eV9uYW1lKSAmJiBrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPSdvcGVud2VhdGhlcm1hcC13aWRnZXQnPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvamF2YXNjcmlwdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJHtpZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHlpZDogJHtjaXR5X2lkfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwaWQ6IFwiJHtrZXl9XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0JyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gJ2h0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL3RoZW1lcy9vcGVud2VhdGhlcm1hcC9hc3NldHMvdmVuZG9yL293bS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanMnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblxyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcblxyXG4vKipcclxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xyXG4gQGNsYXNzIEdyYXBoaWNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC00LvRjyDRgNCw0YHRh9C10YLQsCDQvtGC0YDQuNGB0L7QstC60Lgg0L7RgdC90L7QstC90L7QuSDQu9C40L3QuNC4INC/0LDRgNCw0LzQtdGC0YDQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAqIFtsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxyXG4gICAgLngoKGQpID0+IHtcclxuICAgICAgcmV0dXJuIGQueDtcclxuICAgIH0pXHJcbiAgICAueSgoZCkgPT4ge1xyXG4gICAgICByZXR1cm4gZC55O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINCyINC80LDRgdGB0LjQsiDQtNC70Y8g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPINCz0YDQsNGE0LjQutCwXHJcbiAgICAgKiBAcGFyYW0gIHtbYm9vbGVhbl19IHRlbXBlcmF0dXJlIFvQv9GA0LjQt9C90LDQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAgICAqL1xyXG4gIHByZXBhcmVEYXRhKCkge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3QgcmF3RGF0YSA9IFtdO1xyXG5cclxuICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICByYXdEYXRhLnB1c2goeyB4OiBpLCBkYXRlOiBpLCBtYXhUOiBlbGVtLm1heCwgbWluVDogZWxlbS5taW4gfSk7XHJcbiAgICAgIGkgKz0gMTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmF3RGF0YTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0LXQvCDQuNC30L7QsdGA0LDQttC10L3QuNC1INGBINC60L7QvdGC0LXQutGB0YLQvtC8INC+0LHRitC10LrRgtCwIHN2Z1xyXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX1cclxuICAgICAqL1xyXG4gIG1ha2VTVkcoKSB7XHJcbiAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzJylcclxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5wYXJhbXMud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLnBhcmFtcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAnI2ZmZmZmZicpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC80LjQvdC40LzQsNC70LvRjNC90L7Qs9C+INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L/QviDQv9Cw0YDQsNC80LXRgtGA0YMg0LTQsNGC0YtcclxuICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICogQHJldHVybiB7W29iamVjdF19IGRhdGEgW9C+0LHRitC10LrRgiDRgSDQvNC40L3QuNC80LDQu9GM0L3Ri9C8INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQvCDQt9C90LDRh9C10L3QuNC10LxdXHJcbiAgKi9cclxuICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpIHtcclxuICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWF4RGF0ZTogMCxcclxuICAgICAgbWluRGF0ZTogMTAwMDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkge1xyXG4gICAgICAgIGRhdGEubWF4RGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5taW5EYXRlID49IGVsZW0uZGF0ZSkge1xyXG4gICAgICAgIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG5cclxuICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKSB7XHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtaW46IDEwMCxcclxuICAgICAgbWF4OiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ubWluVCkge1xyXG4gICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1heCA8PSBlbGVtLm1heFQpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpIHtcclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1pbjogMCxcclxuICAgICAgbWF4OiAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0uaHVtaWRpdHkpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpIHtcclxuICAgICAgICBkYXRhLm1heCA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LTQu9C40L3RgyDQvtGB0LXQuSBYLFlcclxuICAqIFttYWtlQXhlc1hZIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0JzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHJldHVybiB7W2Z1bmN0aW9uXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgKi9cclxuICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcykge1xyXG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWD0g0YjQuNGA0LjQvdCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdC70LXQstCwINC4INGB0L/RgNCw0LLQsFxyXG4gICAgY29uc3QgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAoMiAqIHBhcmFtcy5tYXJnaW4pO1xyXG4gICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcclxuICAgIGNvbnN0IHlBeGlzTGVuZ3RoID0gcGFyYW1zLmhlaWdodCAtICgyICogcGFyYW1zLm1hcmdpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXHJcbiAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXHJcbiAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgKi9cclxuICBzY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG1heERhdGUsIG1pbkRhdGUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgICogW3NjYWxlVGltZSBkZXNjcmlwdGlvbl1cclxuICAgICovXHJcbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAqIFtzY2FsZUxpbmVhciBkZXNjcmlwdGlvbl1cclxuICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAqL1xyXG4gICAgY29uc3Qgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxyXG4gICAgLmRvbWFpbihbbWF4ICsgNSwgbWluIC0gNV0pXHJcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IFtdO1xyXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgbWF4VDogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICBtaW5UOiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7IHNjYWxlWCwgc2NhbGVZLCBkYXRhIH07XHJcbiAgfVxyXG5cclxuICBzY2FsZUF4ZXNYWVdlYXRoZXIocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBtYXJnaW4pIHtcclxuICAgIGNvbnN0IHsgbWF4RGF0ZSwgbWluRGF0ZSB9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgY29uc3QgeyBtaW4sIG1heCB9ID0gdGhpcy5nZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpO1xyXG5cclxuICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICBjb25zdCBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICBjb25zdCBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAuZG9tYWluKFttYXgsIG1pbl0pXHJcbiAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcbiAgICBjb25zdCBkYXRhID0gW107XHJcblxyXG4gICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgIHg6IHNjYWxlWChlbGVtLmRhdGUpICsgbWFyZ2luLFxyXG4gICAgICAgIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sXHJcbiAgICAgICAgcmFpbmZhbGxBbW91bnQ6IHNjYWxlWShlbGVtLnJhaW5mYWxsQW1vdW50KSArIG1hcmdpbixcclxuICAgICAgICBjb2xvcjogZWxlbS5jb2xvcixcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4geyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9O1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxyXG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBtYWtlUG9seWxpbmUoZGF0YSwgcGFyYW1zLCBzY2FsZVgsIHNjYWxlWSkge1xyXG4gICAgY29uc3QgYXJyUG9seWxpbmUgPSBbXTtcclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIHk6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFkgfSxcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gICAgZGF0YS5yZXZlcnNlKCkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIHk6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFksXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBhcnJQb2x5bGluZS5wdXNoKHtcclxuICAgICAgeDogc2NhbGVYKGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aCAtIDFdLm1heFQpICsgcGFyYW1zLm9mZnNldFksXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gYXJyUG9seWxpbmU7XHJcbiAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L/QvtC70LjQu9C40L3QuNC5INGBINC30LDQu9C40LLQutC+0Lkg0L7RgdC90L7QstC90L7QuSDQuCDQuNC80LjRgtCw0YbQuNGPINC10LUg0YLQtdC90LhcclxuICAgICAqIFtkcmF3UG9sdWxpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICBkcmF3UG9seWxpbmUoc3ZnLCBkYXRhKSB7XHJcbiAgICAgICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC4INGA0LjRgdGD0LXQvCDQu9C40L3QuNC4XHJcblxyXG4gICAgc3ZnLmFwcGVuZCgnZycpLmFwcGVuZCgncGF0aCcpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgdGhpcy5wYXJhbXMuc3Ryb2tlV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkJywgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdmaWxsJywgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LTQv9C40YHQtdC5INGBINC/0L7QutCw0LfQsNGC0LXQu9GP0LzQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC90LAg0L7RgdGP0YVcclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgICBbZGVzY3JpcHRpb25dXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICovXHJcbiAgZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgcGFyYW1zKSB7XHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpID0+IHtcclxuICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINGC0LXQutGB0YLQsFxyXG4gICAgICBzdmcuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgLmF0dHIoJ3gnLCBlbGVtLngpXHJcbiAgICAgIC5hdHRyKCd5JywgKGVsZW0ubWF4VCAtIDIpIC0gKHBhcmFtcy5vZmZzZXRYIC8gMikpXHJcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxyXG4gICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgLnN0eWxlKCdzdHJva2UnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAudGV4dChgJHtwYXJhbXMuZGF0YVtpdGVtXS5tYXh9wrBgKTtcclxuXHJcbiAgICAgIHN2Zy5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cigneCcsIGVsZW0ueClcclxuICAgICAgLmF0dHIoJ3knLCAoZWxlbS5taW5UICsgNykgKyAocGFyYW1zLm9mZnNldFkgLyAyKSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAuc3R5bGUoJ3N0cm9rZScsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC5zdHlsZSgnZmlsbCcsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgIC50ZXh0KGAke3BhcmFtcy5kYXRhW2l0ZW1dLm1pbn3CsGApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQtNC40YHQv9C10YLRh9C10YAg0L/RgNC+0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YHQviDQstGB0LXQvNC4INGN0LvQtdC80LXQvdGC0LDQvNC4XHJcbiAgICAgKiBbcmVuZGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBzdmcgPSB0aGlzLm1ha2VTVkcoKTtcclxuICAgIGNvbnN0IHJhd0RhdGEgPSB0aGlzLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgY29uc3QgeyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9ID0gdGhpcy5tYWtlQXhlc1hZKHJhd0RhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgIGNvbnN0IHBvbHlsaW5lID0gdGhpcy5tYWtlUG9seWxpbmUocmF3RGF0YSwgdGhpcy5wYXJhbXMsIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xyXG4gICAgdGhpcy5kcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgLy8gdGhpcy5kcmF3TWFya2VycyhzdmcsIHBvbHlsaW5lLCB0aGlzLm1hcmdpbik7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgR2VuZXJhdG9yV2lkZ2V0IGZyb20gJy4vZ2VuZXJhdG9yLXdpZGdldCc7XHJccmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcciAgICB2YXIgZ2VuZXJhdG9yID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZybS1sYW5kaW5nLXdpZGdldFwiKTtcciAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wdXBcIik7XHIgICAgY29uc3QgcG9wdXBDbG9zZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wdXAtY2xvc2VcIik7XHIgICAgY29uc3QgY29udGVudEpTR2VuZXJhdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianMtY29kZS1nZW5lcmF0ZVwiKTtcciAgICBjb25zdCBjb3B5Q29udGVudEpTQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29weS1qcy1jb2RlXCIpO1xyXHIgICAgLy8g0KTQuNC60YHQuNGA0YPQtdC8INC60LvQuNC60Lgg0L3QsCDRhNC+0YDQvNC1LCDQuCDQvtGC0LrRgNGL0LLQsNC10LwgcG9wdXAg0L7QutC90L4g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAg0LrQvdC+0L/QutGDXHIgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHIgICAgICAgIGlmKGV2ZW50LnRhcmdldC5pZCkge1xyICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcciAgICAgICAgICAgIGNvbnNvbGUubG9nKGdlbmVyYXRvci5tYXBXaWRnZXRzW2V2ZW50LnRhcmdldC5pZF1bXCJjb2RlXCJdKTtcciAgICAgICAgICAgIGNvbnRlbnRKU0dlbmVyYXRpb24udmFsdWUgPSBnZW5lcmF0b3IubWFwV2lkZ2V0c1tldmVudC50YXJnZXQuaWRdW1wiY29kZVwiXTtcciAgICAgICAgICAgIGlmKCFwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3B1cC0tdmlzaWJsZVwiKSl7XHIgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcInBvcHVwLS12aXNpYmxlXCIpO1xyICAgICAgICAgICAgICAgIHN3aXRjaChnZW5lcmF0b3IubWFwV2lkZ2V0c1tldmVudC50YXJnZXQuaWRdW1wic2NoZW1hXCJdKSB7XHIgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JsdWUnOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXBvcHVwLmNsYXNzTGlzdC5jb250YWlucyhcInBvcHVwLS1ibHVlXCIpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcInBvcHVwLS1ibHVlXCIpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9wdXAtLWJyb3duXCIpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLS1icm93blwiKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyICAgICAgICAgICAgICAgICAgICBjYXNlICdicm93bic6XHIgICAgICAgICAgICAgICAgICAgICAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9wdXAtLWJyb3duXCIpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcInBvcHVwLS1icm93blwiKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucyhcInBvcHVwLS1ibHVlXCIpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLS1ibHVlXCIpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHIgICAgICAgICAgICAgICAgICAgIGNhc2UgJ25vbmUnOlxyICAgICAgICAgICAgICAgICAgICAgICAgaWYocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9wdXAtLWJyb3duXCIpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLS1icm93blwiKTtcciAgICAgICAgICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwLmNsYXNzTGlzdC5jb250YWlucyhcInBvcHVwLS1ibHVlXCIpKSB7XHIgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShcInBvcHVwLS1ibHVlXCIpO1xyICAgICAgICAgICAgICAgICAgICAgICAgfVxyICAgICAgICAgICAgICAgIH1cciAgICAgICAgICAgIH1cciAgICAgICAgfVxyICAgIH0pO1xyXHIgICAgLy8g0JfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60YDQtdGB0YLQuNC6XHIgICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHIgICAgICBpZihwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3B1cC0tdmlzaWJsZVwiKSlcciAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKFwicG9wdXAtLXZpc2libGVcIik7XHIgICAgfSk7XHJcciAgICBjb3B5Q29udGVudEpTQ29kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpe1xyICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyICAgICAgICAvL3ZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHIgICAgICAgIC8vcmFuZ2Uuc2VsZWN0Tm9kZShjb250ZW50SlNHZW5lcmF0aW9uKTtcciAgICAgICAgLy93aW5kb3cuZ2V0U2VsZWN0aW9uKCkuYWRkUmFuZ2UocmFuZ2UpO1xyICAgICAgICBjb250ZW50SlNHZW5lcmF0aW9uLnNlbGVjdCgpO1xyXHIgICAgICAgIHRyeXtcciAgICAgICAgICAgIGNvbnN0IHR4dENvcHkgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xyICAgICAgICAgICAgdmFyIG1zZyA9IHR4dENvcHkgPyAnc3VjY2Vzc2Z1bCcgOiAndW5zdWNjZXNzZnVsJztcciAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3B5IGVtYWlsIGNvbW1hbmQgd2FzICcgKyBtc2cpO1xyICAgICAgICB9XHIgICAgICAgIGNhdGNoKGUpe1xyICAgICAgICAgICAgY29uc29sZS5sb2coYNCe0YjQuNCx0LrQsCDQutC+0L/QuNGA0L7QstCw0L3QuNGPICR7ZS5lcnJMb2dUb0NvbnNvbGV9YCk7XHIgICAgICAgIH1cclxyICAgICAgICAvLyDQodC90Y/RgtC40LUg0LLRi9C00LXQu9C10L3QuNGPIC0g0JLQndCY0JzQkNCd0JjQlTog0LLRiyDQtNC+0LvQttC90Ysg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMXHIgICAgICAgIC8vIHJlbW92ZVJhbmdlKHJhbmdlKSDQutC+0LPQtNCwINGN0YLQviDQstC+0LfQvNC+0LbQvdC+XHIgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcciAgICB9KTtcclxyICAgIGNvcHlDb250ZW50SlNDb2RlLmRpc2FibGVkID0gIWRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCgnY29weScpO1xyfSk7XHJcciIsIi8vINCc0L7QtNGD0LvRjCDQtNC40YHQv9C10YLRh9C10YAg0LTQu9GPINC+0YLRgNC40YHQvtCy0LrQuCDQsdCw0L3QvdC10YDRgNC+0LIg0L3QsCDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LVcclxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XHJcbmltcG9ydCBHZW5lcmF0b3JXaWRnZXQgZnJvbSAnLi9nZW5lcmF0b3Itd2lkZ2V0JztcclxuaW1wb3J0IENpdGllcyBmcm9tICcuL2NpdGllcyc7XHJcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblxyXG4gIGNvbnN0IGdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgLy8g0KTQvtGA0LzQuNGA0YPQtdC8INC/0LDRgNCw0LzQtdGC0YAg0YTQuNC70YzRgtGA0LAg0L/QviDQs9C+0YDQvtC00YNcclxuICBsZXQgcSA9ICcnO1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSB7XHJcbiAgICBxID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICB9IGVsc2Uge1xyXG4gICAgcSA9ICc/cT1Mb25kb24nO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdXJsRG9tYWluID0gJ2h0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnJztcclxuXHJcbiAgY29uc3QgcGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgY2l0eU5hbWU6ICdNb3Njb3cnLFxyXG4gICAgbGFuZzogJ2VuJyxcclxuICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgdW5pdHM6ICdtZXRyaWMnLFxyXG4gICAgdGV4dFVuaXRUZW1wOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgweDAwQjApLCAgLy8gMjQ4XHJcbiAgICBiYXNlVVJMOiBnZW5lcmF0ZVdpZGdldC5iYXNlVVJMLFxyXG4gICAgdXJsRG9tYWluOiAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcnLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xzV2lkZ2V0ID0ge1xyXG4gICAgLy8g0J/QtdGA0LLQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxyXG4gICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtbGVmdC1tZW51X19oZWFkZXInKSxcclxuICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX251bWJlcicpLFxyXG4gICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbWVhbnMnKSxcclxuICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX193aW5kJyksXHJcbiAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9faW1nJyksXHJcbiAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYWxlbmRhcl9faXRlbScpLFxyXG4gICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKSxcclxuICAgIC8vINCS0YLQvtGA0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgIGNpdHlOYW1lMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fdGl0bGUnKSxcclxuICAgIHRlbXBlcmF0dXJlMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3RlbXBlcmF0dXJlJyksXHJcbiAgICB0ZW1wZXJhdHVyZUZlZWxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fZmVlbHMnKSxcclxuICAgIHRlbXBlcmF0dXJlTWluOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1taW4nKSxcclxuICAgIHRlbXBlcmF0dXJlTWF4OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1tYXgnKSxcclxuICAgIG5hdHVyYWxQaGVub21lbm9uMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fZGVzY3JpcHRpb24nKSxcclxuICAgIHdpbmRTcGVlZDI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X193aW5kLXNwZWVkJyksXHJcbiAgICBtYWluSWNvbldlYXRoZXIyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faWNvbicpLFxyXG4gICAgaHVtaWRpdHk6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19odW1pZGl0eScpLFxyXG4gICAgcHJlc3N1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19wcmVzc3VyZScpLFxyXG4gICAgZGF0ZVJlcG9ydDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aWRnZXQtcmlnaHRfX2RhdGVcIiksXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdXJscyA9IHtcclxuICAgIHVybFdlYXRoZXJBUEk6IGAke3BhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXIke3F9JnVuaXRzPSR7cGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3BhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHtwYXJhbXNXaWRnZXQudXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseSR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICB3aW5kU3BlZWQ6IGAke3BhcmFtc1dpZGdldC5iYXNlVVJMfS9kYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uYCxcclxuICAgIHdpbmREaXJlY3Rpb246IGAke3BhcmFtc1dpZGdldC5iYXNlVVJMfS9kYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbmAsXHJcbiAgICBjbG91ZHM6IGAke3BhcmFtc1dpZGdldC5iYXNlVVJMfWRhdGEvY2xvdWRzLWRhdGEuanNvbmAsXHJcbiAgICBuYXR1cmFsUGhlbm9tZW5vbjogYCR7cGFyYW1zV2lkZ2V0LmJhc2VVUkx9L2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanNvbmAsXHJcbiAgfTtcclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChwYXJhbXNXaWRnZXQsIGNvbnRyb2xzV2lkZ2V0LCB1cmxzKTtcclxuICAgIG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyDQoNCw0LHQvtGC0LAg0YEg0YTQvtGA0LzQvtC5INC00LvRjyDQuNC90LjRhtC40LDQu9C4XHJcbiAgICBjb25zdCBjaXR5TmFtZVZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbmFtZScpLnZhbHVlT2YoKTtcclxuICAgIGNvbnN0IGNpdHlJZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWlkJyk7XHJcbiAgICBjb25zdCBjaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJykudmFsdWVPZigpO1xyXG4gICAgY29uc3Qgc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG4gICAgc2VhcmNoQ2l0eS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgdmFyIG9iakNpdGllcyA9IG5ldyBDaXRpZXMoY2l0eU5hbWVWYWx1ZSwgY2l0aWVzLCBjaXR5SWQpO1xyXG4gICAgICBvYmpDaXRpZXMuZ2V0Q2l0aWVzKCk7XHJcblxyXG4gICAgfSk7XHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tICcuL2N1c3RvbS1kYXRlJztcclxuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xyXG5pbXBvcnQgKiBhcyBuYXR1cmFsUGhlbm9tZW5vbiAgZnJvbSAnLi9kYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhJztcclxuaW1wb3J0ICogYXMgd2luZFNwZWVkIGZyb20gJy4vZGF0YS93aW5kLXNwZWVkLWRhdGEnO1xyXG5pbXBvcnQgKiBhcyB3aW5kRGlyZWN0aW9uIGZyb20gJy4vZGF0YS93aW5kLXNwZWVkLWRhdGEnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGUge1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XHJcbiAgICB0aGlzLnVybHMgPSB1cmxzO1xyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCINC/0YPRgdGC0YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XHJcbiAgICB0aGlzLndlYXRoZXIgPSB7XHJcbiAgICAgIGZyb21BUEk6IHtcclxuICAgICAgICBjb29yZDoge1xyXG4gICAgICAgICAgbG9uOiAnMCcsXHJcbiAgICAgICAgICBsYXQ6ICcwJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdlYXRoZXI6IFt7XHJcbiAgICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgICAgbWFpbjogJyAnLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246ICcgJyxcclxuICAgICAgICAgIGljb246ICcgJyxcclxuICAgICAgICB9XSxcclxuICAgICAgICBiYXNlOiAnICcsXHJcbiAgICAgICAgbWFpbjoge1xyXG4gICAgICAgICAgdGVtcDogMCxcclxuICAgICAgICAgIHByZXNzdXJlOiAnICcsXHJcbiAgICAgICAgICBodW1pZGl0eTogJyAnLFxyXG4gICAgICAgICAgdGVtcF9taW46ICcgJyxcclxuICAgICAgICAgIHRlbXBfbWF4OiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3aW5kOiB7XHJcbiAgICAgICAgICBzcGVlZDogMCxcclxuICAgICAgICAgIGRlZzogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmFpbjoge30sXHJcbiAgICAgICAgY2xvdWRzOiB7XHJcbiAgICAgICAgICBhbGw6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGR0OiAnJyxcclxuICAgICAgICBzeXM6IHtcclxuICAgICAgICAgIHR5cGU6ICcgJyxcclxuICAgICAgICAgIGlkOiAnICcsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnICcsXHJcbiAgICAgICAgICBjb3VudHJ5OiAnICcsXHJcbiAgICAgICAgICBzdW5yaXNlOiAnICcsXHJcbiAgICAgICAgICBzdW5zZXQ6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlkOiAnICcsXHJcbiAgICAgICAgbmFtZTogJ1VuZGVmaW5lZCcsXHJcbiAgICAgICAgY29kOiAnICcsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7QsdC10YDRgtC60LAg0L7QsdC10YnQtdC90LjQtSDQtNC70Y8g0LDRgdC40L3RhdGA0L7QvdC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXHJcbiAgICogQHBhcmFtIHVybFxyXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAqL1xyXG4gIGh0dHBHZXQodXJsKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKG51bGwpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xyXG4gICAqL1xyXG4gIGdldFdlYXRoZXJGcm9tQXBpKCkge1xyXG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy51cmxXZWF0aGVyQVBJKVxyXG4gICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZnJvbUFQSSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbiA9IG5hdHVyYWxQaGVub21lbm9uLm5hdHVyYWxQaGVub21lbm9uW3RoaXMucGFyYW1zLmxhbmddLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgIHRoaXMud2VhdGhlci53aW5kU3BlZWQgPSB3aW5kU3BlZWQud2luZFNwZWVkW3RoaXMucGFyYW1zLmxhbmddO1xyXG4gICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDRgdC10LvQtdC60YLQvtGAINC/0L4g0LfQvdCw0YfQtdC90LjRjiDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LIgSlNPTlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBKU09OXHJcbiAgICogQHBhcmFtIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVsZW1lbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsCzQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAqIEByZXR1cm4ge3N0cmluZ30g0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICovXHJcbiAgZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KG9iamVjdCwgZWxlbWVudCwgZWxlbWVudE5hbWUsIGVsZW1lbnROYW1lMikge1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XHJcbiAgICAgIC8vINCV0YHQu9C4INGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YEg0L7QsdGK0LXQutGC0L7QvCDQuNC3INC00LLRg9GFINGN0LvQtdC80LXQvdGC0L7QsiDQstCy0LjQtNC1INC40L3RgtC10YDQstCw0LvQsFxyXG4gICAgICBpZiAodHlwZW9mIG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSA9PT0gJ29iamVjdCcgJiYgZWxlbWVudE5hbWUyID09IG51bGwpIHtcclxuICAgICAgICBpZiAoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSkge1xyXG4gICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgdC+INC30L3QsNGH0LXQvdC40LXQvCDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCDRgSDQtNCy0YPQvNGPINGN0LvQtdC80LXQvdGC0LDQvNC4INCyIEpTT05cclxuICAgICAgfSBlbHNlIGlmIChlbGVtZW50TmFtZTIgIT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWUyXSkge1xyXG4gICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxyXG4gICAqIEBwYXJhbSBqc29uRGF0YVxyXG4gICAqIEByZXR1cm5zIHsqfVxyXG4gICAqL1xyXG4gIHBhcnNlRGF0YUZyb21TZXJ2ZXIoKSB7XHJcbiAgICBjb25zdCB3ZWF0aGVyID0gdGhpcy53ZWF0aGVyO1xyXG5cclxuICAgIGlmICh3ZWF0aGVyLmZyb21BUEkubmFtZSA9PT0gJ1VuZGVmaW5lZCcgfHwgd2VhdGhlci5mcm9tQVBJLmNvZCA9PT0gJzQwNCcpIHtcclxuICAgICAgY29uc29sZS5sb2coJ9CU0LDQvdC90YvQtSDQvtGCINGB0LXRgNCy0LXRgNCwINC90LUg0L/QvtC70YPRh9C10L3RiycpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YJcclxuICAgIGNvbnN0IG1ldGFkYXRhID0ge1xyXG4gICAgICBjbG91ZGluZXNzOiAnICcsXHJcbiAgICAgIGR0OiAnICcsXHJcbiAgICAgIGNpdHlOYW1lOiAnICcsXHJcbiAgICAgIGljb246ICcgJyxcclxuICAgICAgdGVtcGVyYXR1cmU6ICcgJyxcclxuICAgICAgdGVtcGVyYXR1cmVNaW46ICcgJyxcclxuICAgICAgdGVtcGVyYXR1cmVNQXg6ICcgJyxcclxuICAgICAgcHJlc3N1cmU6ICcgJyxcclxuICAgICAgaHVtaWRpdHk6ICcgJyxcclxuICAgICAgc3VucmlzZTogJyAnLFxyXG4gICAgICBzdW5zZXQ6ICcgJyxcclxuICAgICAgY29vcmQ6ICcgJyxcclxuICAgICAgd2luZDogJyAnLFxyXG4gICAgICB3ZWF0aGVyOiAnICcsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSBwYXJzZUludCh3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wLnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBtZXRhZGF0YS5jaXR5TmFtZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5uYW1lfSwgJHt3ZWF0aGVyLmZyb21BUEkuc3lzLmNvdW50cnl9YDtcclxuICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlID0gdGVtcGVyYXR1cmU7IC8vIGAke3RlbXAgPiAwID8gYCske3RlbXB9YCA6IHRlbXB9YDtcclxuICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlTWluID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcF9taW4udG9GaXhlZCgwKSwgMTApICsgMDtcclxuICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlTWF4ID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcF9tYXgudG9GaXhlZCgwKSwgMTApICsgMDtcclxuICAgIGlmICh3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uKSB7XHJcbiAgICAgIG1ldGFkYXRhLndlYXRoZXIgPSB3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uW3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmlkXTtcclxuICAgIH1cclxuICAgIGlmICh3ZWF0aGVyLndpbmRTcGVlZCkge1xyXG4gICAgICBtZXRhZGF0YS53aW5kU3BlZWQgPSBgV2luZDogJHt3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpfSBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyLndpbmRTcGVlZCwgd2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKSwgJ3NwZWVkX2ludGVydmFsJyl9YDtcclxuICAgICAgbWV0YWRhdGEud2luZFNwZWVkMiA9IGAke3dlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSl9IG0vc2A7XHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci53aW5kRGlyZWN0aW9uKSB7XHJcbiAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX1gXHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci5jbG91ZHMpIHtcclxuICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci5jbG91ZHMsIHdlYXRoZXIuZnJvbUFQSS5jbG91ZHMuYWxsLCAnbWluJywgJ21heCcpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgbWV0YWRhdGEuaHVtaWRpdHkgPSBgJHt3ZWF0aGVyLmZyb21BUEkubWFpbi5odW1pZGl0eX0lYDtcclxuICAgIG1ldGFkYXRhLnByZXNzdXJlID0gIGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wibWFpblwiXVtcInByZXNzdXJlXCJdfSBtYmA7XHJcbiAgICBtZXRhZGF0YS5pY29uID0gYCR7d2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWNvbn1gO1xyXG5cclxuICAgIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xyXG4gICAgLy8g0J7QvtGC0YDQuNGB0L7QstC60LAg0L/QtdGA0LLRi9GFINGH0LXRgtGL0YDQtdGFINCy0LjQtNC20LXRgtC+0LJcclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBtZXRhZGF0YS5jaXR5TmFtZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZVtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3BhbiBjbGFzcz0nd2VhdGhlci1sZWZ0LWNhcmRfX2RlZ3JlZSc+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndlYXRoZXIpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24pIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG1ldGFkYXRhLndpbmRTcGVlZCkge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMud2luZFNwZWVkW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndpbmRTcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQntGC0YDQuNGB0L7QstC60LAg0L/Rj9GC0Lgg0L/QvtGB0LvQtdC00L3QuNGFINCy0LjQtNC20LXRgtC+0LJcclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lMltlbGVtXS5pbm5lckhUTUwgPSBtZXRhZGF0YS5jaXR5TmFtZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlMltlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZUZlZWxzLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZUZlZWxzW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4pIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNaW4uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXgpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVNYXguaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4W2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzcGFuPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGFkYXRhLndlYXRoZXIpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24yLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53aW5kU3BlZWQyICYmIG1ldGFkYXRhLndpbmREaXJlY3Rpb24pIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkMikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMud2luZFNwZWVkMltlbGVtXS5pbm5lclRleHQgPSBgJHttZXRhZGF0YS53aW5kU3BlZWQyfSAke21ldGFkYXRhLndpbmREaXJlY3Rpb259YDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjJbZWxlbV0uc3JjID0gdGhpcy5nZXRVUkxNYWluSWNvbihtZXRhZGF0YS5pY29uLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcjJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS5odW1pZGl0eSkge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5odW1pZGl0eSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmh1bWlkaXR5Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLmh1bWlkaXR5W2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLmh1bWlkaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS5wcmVzc3VyZSkge1xyXG4gICAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5wcmVzc3VyZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnByZXNzdXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLnByZXNzdXJlW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLnByZXNzdXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g0J/RgNC+0L/QuNGB0YvQstCw0LXQvCDRgtC10LrRg9GJ0YPRjiDQtNCw0YLRgyDQsiDQstC40LTQttC10YLRi1xyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydCkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5kYXRlUmVwb3J0Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5kYXRlUmVwb3J0W2VsZW1dLmlubmVyVGV4dCA9IHRoaXMuZ2V0VGltZURhdGVISE1NTW9udGhEYXkoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkpIHtcclxuICAgICAgdGhpcy5wcmVwYXJlRGF0YUZvckdyYXBoaWMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpIHtcclxuICAgIGNvbnN0IGFyciA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0KSB7XHJcbiAgICAgIGNvbnN0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XHJcbiAgICAgIGFyci5wdXNoKHtcclxuICAgICAgICBtaW46IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXHJcbiAgICAgICAgbWF4OiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5tYXgpLFxyXG4gICAgICAgIGRheTogKGVsZW0gIT0gMCkgPyBkYXkgOiAnVG9kYXknLFxyXG4gICAgICAgIGljb246IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxyXG4gICAgICAgIGRhdGU6IHRoaXMudGltZXN0YW1wVG9EYXRlVGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZHJhd0dyYXBoaWNEMyhhcnIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxyXG4gICAqIEBwYXJhbSBkYXRhXHJcbiAgICovXHJcbiAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaW5kZXgpID0+IHtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCArIDEwXS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyAyMF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0VVJMTWFpbkljb24obmFtZUljb24sIGNvbG9yID0gZmFsc2UpIHtcclxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxyXG4gICAgY29uc3QgbWFwSWNvbnMgPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgaWYgKCFjb2xvcikge1xyXG4gICAgICAvL1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAxZCcsICcwMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA2ZCcsICcwNmRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzA5ZCcsICcwOWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICBtYXBJY29ucy5zZXQoJzEzZCcsICcxM2RidycpO1xyXG4gICAgICAvLyDQndC+0YfQvdGL0LVcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMm4nLCAnMDJkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNG4nLCAnMDRkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwN24nLCAnMDdkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMG4nLCAnMTBkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgIGlmIChtYXBJY29ucy5nZXQobmFtZUljb24pKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMucGFyYW1zLmJhc2VVUkx9L2ltZy93aWRnZXRzLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHt0aGlzLnBhcmFtcy5iYXNlVVJMfS9pbWcvd2lkZ2V0cy8ke25hbWVJY29ufS5wbmdgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0J7RgtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGBINC/0L7QvNC+0YnRjNGOINCx0LjQsdC70LjQvtGC0LXQutC4IEQzXHJcbiAgICovXHJcbiAgZHJhd0dyYXBoaWNEMyhkYXRhKSB7XHJcbiAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKTtcclxuXHJcbiAgICAvLyDQn9Cw0YDQsNC80LXRgtGA0LjQt9GD0LXQvCDQvtCx0LvQsNGB0YLRjCDQvtGC0YDQuNGB0L7QstC60Lgg0LPRgNCw0YTQuNC60LBcclxuICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgaWQ6ICcjZ3JhcGhpYycsXHJcbiAgICAgIGRhdGEsXHJcbiAgICAgIG9mZnNldFg6IDE1LFxyXG4gICAgICBvZmZzZXRZOiAxMCxcclxuICAgICAgd2lkdGg6IDQyMCxcclxuICAgICAgaGVpZ2h0OiA3OSxcclxuICAgICAgcmF3RGF0YTogW10sXHJcbiAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgIGNvbG9yUG9saWx5bmU6ICcjMzMzJyxcclxuICAgICAgZm9udFNpemU6ICcxMnB4JyxcclxuICAgICAgZm9udENvbG9yOiAnIzMzMycsXHJcbiAgICAgIHN0cm9rZVdpZHRoOiAnMXB4JyxcclxuICAgIH07XHJcblxyXG4gICAgLy8g0KDQtdC60L7QvdGB0YLRgNGD0LrRhtC40Y8g0L/RgNC+0YbQtdC00YPRgNGLINGA0LXQvdC00LXRgNC40L3Qs9CwINCz0YDQsNGE0LjQutCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgIGxldCBvYmpHcmFwaGljRDMgPSBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xyXG5cclxuICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDQvtGB0YLQsNC70YzQvdGL0YUg0LPRgNCw0YTQuNC60L7QslxyXG4gICAgcGFyYW1zLmlkID0gJyNncmFwaGljMSc7XHJcbiAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9ICcjRERGNzMwJztcclxuICAgIG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcblxyXG4gICAgcGFyYW1zLmlkID0gJyNncmFwaGljMic7XHJcbiAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9ICcjRkVCMDIwJztcclxuICAgIG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICog0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDQs9GA0LDRhNC40LrQsCDQv9C+0LPQvtC00Ysg0L3QsCDQvdC10LTQtdC70Y5cclxuICAgKi9cclxuICBkcmF3R3JhcGhpYyhhcnIpIHtcclxuICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGFycik7XHJcblxyXG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgdGhpcy5jb250cm9scy5ncmFwaGljLndpZHRoID0gNDY1O1xyXG4gICAgdGhpcy5jb250cm9scy5ncmFwaGljLmhlaWdodCA9IDcwO1xyXG5cclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xyXG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCA2MDAsIDMwMCk7XHJcblxyXG4gICAgY29udGV4dC5mb250ID0gJ09zd2FsZC1NZWRpdW0sIEFyaWFsLCBzYW5zLXNlcmkgMTRweCc7XHJcblxyXG4gICAgbGV0IHN0ZXAgPSA1NTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGNvbnN0IHpvb20gPSA0O1xyXG4gICAgY29uc3Qgc3RlcFkgPSA2NDtcclxuICAgIGNvbnN0IHN0ZXBZVGV4dFVwID0gNTg7XHJcbiAgICBjb25zdCBzdGVwWVRleHREb3duID0gNzU7XHJcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgY29udGV4dC5tb3ZlVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgaSArPSAxO1xyXG4gICAgd2hpbGUgKGkgPCBhcnIubGVuZ3RoKSB7XHJcbiAgICAgIHN0ZXAgKz0gNTU7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5tYXh9wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWVRleHRVcCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIGkgLT0gMTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgc3RlcCA9IDU1O1xyXG4gICAgaSA9IDA7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWlufcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFlUZXh0RG93bik7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGkgKz0gMTtcclxuICAgIHdoaWxlIChpIDwgYXJyLmxlbmd0aCkge1xyXG4gICAgICBzdGVwICs9IDU1O1xyXG4gICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWlufcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFlUZXh0RG93bik7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIGkgLT0gMTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzMzMyc7XHJcbiAgICBjb250ZXh0LmxpbmVUbyhzdGVwICsgMzAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMzMzMnO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdGhpcy5nZXRXZWF0aGVyRnJvbUFwaSgpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
