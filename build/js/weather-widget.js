(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Denis on 28.09.2016.
 */
'use strict';

// Работа с датой

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomDate = function (_Date) {
    _inherits(CustomDate, _Date);

    function CustomDate() {
        _classCallCheck(this, CustomDate);

        return _possibleConstructorReturn(this, (CustomDate.__proto__ || Object.getPrototypeOf(CustomDate)).call(this));
    }

    /**
     * метод преобразования номера дня в году в трехразрядное число ввиде строки
     * @param  {[integer]} number [число менее 999]
     * @return {[string]}        [трехзначное число ввиде строки порядкового номера дня в году]
     */


    _createClass(CustomDate, [{
        key: 'numberDaysOfYearXXX',
        value: function numberDaysOfYearXXX(number) {
            if (number > 365) return false;
            if (number < 10) return '00' + number;else if (number < 100) return '0' + number;
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

            return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
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
            //console.log(`${dateFr}  ${dateTo}`);
            return [dateFr, dateTo];
        }

        // Возвращает интервал дат текущего лета

    }, {
        key: 'getCurrentSpringDate',
        value: function getCurrentSpringDate() {
            var year = new Date().getFullYear();
            var dateFr = this.convertDateToNumberDay(year + '-03-01');
            var dateTo = this.convertDateToNumberDay(year + '-05-31');
            //console.log(`${dateFr}  ${dateTo}`);
            return [dateFr, dateTo];
        }

        // Возвращает интервал дат предыдущего лета

    }, {
        key: 'getLastSummerDate',
        value: function getLastSummerDate() {
            var year = new Date().getFullYear() - 1;
            var dateFr = this.convertDateToNumberDay(year + '-06-01');
            var dateTo = this.convertDateToNumberDay(year + '-08-31');
            //console.log(`${dateFr}  ${dateTo}`);
            return [dateFr, dateTo];
        }
    }, {
        key: 'getFirstDateCurYear',
        value: function getFirstDateCurYear() {
            return new Date().getFullYear() + '-001';
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
            return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ';
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
                0: "Sun",
                1: "Mon",
                2: "Tue",
                3: "Wed",
                4: "Thu",
                5: "Fri",
                6: "Sat"
            };
            return days[dayNumber];
        }

        /** Сравнение даты в формате dd.mm.yyyy = dd.mm.yyyy с текущим днем
         *
         */

    }, {
        key: 'compareDatesWithToday',
        value: function compareDatesWithToday(date) {
            return date.toLocaleDateString() === new Date().toLocaleDateString();
        }
    }]);

    return CustomDate;
}(Date);

exports.default = CustomDate;

},{}],2:[function(require,module,exports){
'use strict';

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {

    var urlDomain = "http://api.openweathermap.org";

    var paramsWidget = {
        cityName: 'Moscow',
        lang: 'en',
        appid: '2d90837ddbaeda36ab487f257829b667',
        units: 'metric',
        textUnitTemp: '0'
    };

    var controlsWidget = {
        cityName: document.querySelectorAll(".widget-menu__header"),
        temperature: document.querySelectorAll(".weather-card__number"),
        naturalPhenomenon: document.querySelectorAll(".weather-card__means"),
        windSpeed: document.querySelectorAll(".weather-card__wind"),
        mainIconWeather: document.querySelectorAll(".weather-card__img"),
        calendarItem: document.querySelectorAll(".calendar__item"),
        graphic: document.getElementById("graphic")
    };

    var urls = {
        urlWeatherAPI: urlDomain + '/data/2.5/weather?q=' + paramsWidget.cityName + '&units=' + paramsWidget.units + '&appid=' + paramsWidget.appid,
        paramsUrlForeDaily: urlDomain + '/data/2.5/forecast/daily?q=' + paramsWidget.cityName + '&units=' + paramsWidget.units + '&appid=' + paramsWidget.appid,
        windSpeed: "data/wind-speed-data.json",
        windDirection: "data/wind-direction-data.json",
        clouds: "data/clouds-data.json",
        naturalPhenomenon: "data/natural-phenomenon-data.json"
    };

    var objWidget = new _weatherWidget2.default(paramsWidget, controlsWidget, urls);
    var jsonFromAPI = objWidget.render();
});

},{"./weather-widget":3}],3:[function(require,module,exports){
/**
 * Created by Denis on 29.09.2016.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customDate = require("./custom-date");

var _customDate2 = _interopRequireDefault(_customDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
            "fromAPI": { "coord": {
                    "lon": "0",
                    "lat": "0"
                },
                "weather": [{ "id": " ",
                    "main": " ",
                    "description": " ",
                    "icon": ""
                }],
                "base": " ",
                "main": {
                    "temp": 0,
                    "pressure": " ",
                    "humidity": " ",
                    "temp_min": " ",
                    "temp_max": " "
                },
                "wind": {
                    "speed": 0,
                    "deg": " "
                },
                "rain": {},
                "clouds": { "all": " " },
                "dt": "",
                "sys": {
                    "type": " ",
                    "id": " ",
                    "message": " ",
                    "country": " ",
                    "sunrise": " ",
                    "sunset": " "
                },
                "id": " ",
                "name": "Undefined",
                "cod": " "
            }
        };
        return _this;
    }

    _createClass(WeatherWidget, [{
        key: "httpGet",


        /**
         * Обертка обещение для асинхронных запросов
         * @param url
         * @returns {Promise}
         */
        value: function httpGet(url) {
            var that = this;
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(this.response));
                    } else {
                        var error = new Error(this.statusText);
                        error.code = this.status;
                        reject(that.error);
                    }
                };

                xhr.ontimeout = function (e) {
                    reject(new Error("Время ожидания обращения к серверу API истекло " + e.type + " " + e.timeStamp.toFixed(2)));
                };

                xhr.onerror = function (e) {
                    reject(new Error("Ошибка обращения к серверу " + e));
                };

                xhr.open("GET", url, true);
                xhr.send(null);
            });
        }
    }, {
        key: "getWeatherFromApi",


        /**
         * Запрос к API для получения данных текущей погоды
         */
        value: function getWeatherFromApi() {
            var _this2 = this;

            this.httpGet(this.urls.urlWeatherAPI).then(function (response) {
                _this2.weather.fromAPI = response;
                _this2.httpGet(_this2.urls.naturalPhenomenon).then(function (response) {
                    _this2.weather.naturalPhenomenon = response[_this2.params.lang]["description"];
                    _this2.httpGet(_this2.urls.windSpeed).then(function (response) {
                        _this2.weather.windSpeed = response[_this2.params.lang];
                        _this2.httpGet(_this2.urls.paramsUrlForeDaily).then(function (response) {
                            _this2.weather.forecastDaily = response;
                            _this2.parseDataFromServer();
                        }, function (error) {
                            console.log("Возникла ошибка " + error);
                            _this2.parseDataFromServer();
                        });
                    }, function (error) {
                        console.log("Возникла ошибка " + error);
                        _this2.parseDataFromServer();
                    });
                }, function (error) {
                    console.log("Возникла ошибка " + error);
                    _this2.parseDataFromServer();
                });
            }, function (error) {
                console.log("Возникла ошибка " + error);
                _this2.parseDataFromServer();
            });
        }
    }, {
        key: "getParentSelectorFromObject",


        /**
         * Метод возвращает родительский селектор по значению дочернего узла в JSON
         * @param  {object} JSON
         * @param  {variant} element Значение элементарного типа, дочернего узла для поиска родительского
         * @param  {string} elementName Наименование искомого селектора,для поиска родительского селектора
         * @return {string}  Наименование искомого селектора
         */
        value: function getParentSelectorFromObject(object, element, elementName, elementName2) {

            for (var key in object) {
                // Если сравнение производится с объектом из двух элементов ввиде интервала
                if (_typeof(object[key][elementName]) === "object" && elementName2 == null) {
                    if (element >= object[key][elementName][0] && element < object[key][elementName][1]) {
                        return key;
                    }
                }
                // Если сравнение производится со значением элемента элементарного типа с двумя элементами в JSON
                else if (elementName2 != null) {
                        if (element >= object[key][elementName] && element < object[key][elementName2]) return key;
                    }
            }
        }

        /**
         * Возвращает JSON с метеодаными
         * @param jsonData
         * @returns {*}
         */

    }, {
        key: "parseDataFromServer",
        value: function parseDataFromServer() {

            var weather = this.weather;

            if (weather.fromAPI.name === "Undefined" || weather.fromAPI.cod === "404") {
                console.log("Данные от сервера не получены");
                return;
            }

            var naturalPhenomenon = "";
            var windSpeed = "";
            var windDirection = "";
            var clouds = "";

            //Инициализируем объект
            var metadata = {
                cloudiness: " ",
                dt: " ",
                cityName: " ",
                icon: " ",
                temperature: " ",
                pressure: " ",
                humidity: " ",
                sunrise: " ",
                sunset: " ",
                coord: " ",
                wind: " ",
                weather: " "
            };

            metadata.cityName = weather.fromAPI.name + ", " + weather.fromAPI.sys.country;
            metadata.temperature = "" + weather.fromAPI.main.temp.toFixed(0);
            if (weather.naturalPhenomenon) metadata.weather = weather.naturalPhenomenon[weather.fromAPI.weather[0].id];
            if (weather["windSpeed"]) metadata.windSpeed = "Wind: " + weather["fromAPI"]["wind"]["speed"].toFixed(1) + "  m/s " + this.getParentSelectorFromObject(weather["windSpeed"], weather["fromAPI"]["wind"]["speed"].toFixed(1), "speed_interval");
            if (weather["windDirection"]) metadata.windDirection = this.getParentSelectorFromObject(weather["windDirection"], weather["fromAPI"]["wind"]["deg"], "deg_interval") + " ( " + weather["fromAPI"]["wind"]["deg"] + " )";
            if (weather["clouds"]) metadata.clouds = "" + this.getParentSelectorFromObject(weather["clouds"], weather["fromAPI"]["clouds"]["all"], "min", "max");

            metadata.icon = "" + weather["fromAPI"]["weather"][0]["icon"];

            return this.renderWidget(metadata);
        }
    }, {
        key: "renderWidget",
        value: function renderWidget(metadata) {
            for (var elem in this.controls.cityName) {
                if (this.controls.cityName.hasOwnProperty(elem)) {
                    this.controls.cityName[elem].innerHTML = "<span>Weather for</span> " + metadata.cityName;
                }
            }
            for (var _elem in this.controls.temperature) {
                if (this.controls.temperature.hasOwnProperty(_elem)) {
                    this.controls.temperature[_elem].innerHTML = metadata.temperature + "<sup class=\"weather-card__degree\">" + this.params.textUnitTemp + "</sup>";
                }
            }

            for (var _elem2 in this.controls.mainIconWeather) {
                if (this.controls.mainIconWeather.hasOwnProperty(_elem2)) {
                    this.controls.mainIconWeather[_elem2].src = "http://openweathermap.org/img/w/" + metadata.icon + ".png";
                    this.controls.mainIconWeather[_elem2].alt = "Weather in " + (metadata.cityName ? metadata.cityName : '');
                }
            }

            if (metadata.weather.trim()) for (var _elem3 in this.controls.naturalPhenomenon) {
                if (this.controls.naturalPhenomenon.hasOwnProperty(_elem3)) {
                    this.controls.naturalPhenomenon[_elem3].innerText = metadata.weather;
                }
            }
            if (metadata.windSpeed.trim()) for (var _elem4 in this.controls.windSpeed) {
                if (this.controls.windSpeed.hasOwnProperty(_elem4)) {
                    this.controls.windSpeed[_elem4].innerText = metadata.windSpeed;
                }
            }

            if (this.weather.forecastDaily) this.prepareDataForGraphic();
        }
    }, {
        key: "prepareDataForGraphic",
        value: function prepareDataForGraphic() {
            var arr = [];

            arr.push({
                'min': Math.round(this.weather.forecastDaily.list[0].temp.min),
                'max': Math.round(this.weather.forecastDaily.list[0].temp.max),
                'day': 'Today',
                'icon': this.weather.forecastDaily.list[0].weather[0].icon
            });

            for (var elem in this.weather.forecastDaily.list) {
                arr.push({
                    'min': Math.round(this.weather.forecastDaily.list[elem].temp.min),
                    'max': Math.round(this.weather.forecastDaily.list[elem].temp.max),
                    'day': this.getDayNameOfWeekByDayNumber(this.getNumberDayInWeekByUnixTime(this.weather.forecastDaily.list[elem].dt)),
                    'icon': this.weather.forecastDaily.list[elem].weather[0].icon
                });
            }

            return this.drawGraphic(arr);
        }

        /**
         * Отрисовка названия дней недели и иконок с погодой
         * @param data
         */

    }, {
        key: "renderIconsDaysOfWeek",
        value: function renderIconsDaysOfWeek(data) {
            var that = this;
            data.forEach(function (elem, index, data) {
                that.controls.calendarItem[index].innerHTML = elem.day + "<img src=\"http://openweathermap.org/img/w/" + elem.icon + ".png\" width=\"32\" height=\"32\" alt=\"" + elem.day + "\">";
            });
        }

        /**
         * Отображение графика погоды на неделю
         */

    }, {
        key: "drawGraphic",
        value: function drawGraphic(arr) {

            this.renderIconsDaysOfWeek(arr);

            var context = this.controls.graphic.getContext('2d');
            this.controls.graphic.width = 465;
            this.controls.graphic.height = 70;

            context.fillStyle = "#fff";
            context.fillRect(0, 0, 600, 300);

            context.font = "Oswald-Medium, Arial, sans-seri 14px";

            var step = 55;
            var i = 0;
            var zoom = 4;
            var stepY = 64;
            var stepYTextUp = 58;
            var stepYTextDown = 75;
            context.beginPath();
            context.moveTo(step - 10, -1 * arr[i].min * zoom + stepY);
            context.strokeText(arr[i].max + 'º', step, -1 * arr[i].max * zoom + stepYTextUp);
            context.lineTo(step - 10, -1 * arr[i++].max * zoom + stepY);
            while (i < arr.length) {
                step += 55;
                context.lineTo(step, -1 * arr[i].max * zoom + stepY);
                context.strokeText(arr[i].max + 'º', step, -1 * arr[i].max * zoom + stepYTextUp);
                i++;
            }
            context.lineTo(step + 30, -1 * arr[--i].max * zoom + stepY);
            step = 55;
            i = 0;
            context.moveTo(step - 10, -1 * arr[i].min * zoom + stepY);
            context.strokeText(arr[i].min + 'º', step, -1 * arr[i].min * zoom + stepYTextDown);
            context.lineTo(step - 10, -1 * arr[i++].min * zoom + stepY);
            while (i < arr.length) {
                step += 55;
                context.lineTo(step, -1 * arr[i].min * zoom + stepY);
                context.strokeText(arr[i].min + 'º', step, -1 * arr[i].min * zoom + stepYTextDown);
                i++;
            }
            context.lineTo(step + 30, -1 * arr[--i].min * zoom + stepY);
            context.fillStyle = "#333";
            context.lineTo(step + 30, -1 * arr[i].max * zoom + stepY);
            context.closePath();

            context.strokeStyle = "#333";

            context.stroke();
            context.fill();
        }
    }, {
        key: "render",
        value: function render() {
            this.getWeatherFromApi();
        }
    }]);

    return WeatherWidget;
}(_customDate2.default);

exports.default = WeatherWidget;

},{"./custom-date":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQUdBOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQUNxQixVOzs7QUFFakIsMEJBQWE7QUFBQTs7QUFBQTtBQUVaOztBQUVEOzs7Ozs7Ozs7NENBS29CLE0sRUFBTztBQUN2QixnQkFBRyxTQUFTLEdBQVosRUFBaUIsT0FBTyxLQUFQO0FBQ2pCLGdCQUFHLFNBQVMsRUFBWixFQUNJLGNBQVksTUFBWixDQURKLEtBRUssSUFBRyxTQUFTLEdBQVosRUFDRCxhQUFXLE1BQVg7QUFDSixtQkFBTyxNQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytDQUt1QixJLEVBQUs7QUFDeEIsZ0JBQUksTUFBTSxJQUFJLElBQUosQ0FBUyxJQUFULENBQVY7QUFDQSxnQkFBSSxRQUFRLElBQUksSUFBSixDQUFTLElBQUksV0FBSixFQUFULEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQVo7QUFDQSxnQkFBSSxPQUFPLE1BQU0sS0FBakI7QUFDQSxnQkFBSSxTQUFTLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBOUI7QUFDQSxnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLE9BQU8sTUFBbEIsQ0FBVjtBQUNBLG1CQUFVLElBQUksV0FBSixFQUFWLFNBQStCLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxLQUFLLG1CQUFUO0FBQ0EsZ0JBQUksT0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLENBQVg7QUFDQSxnQkFBSSxZQUFZLElBQUksSUFBSixDQUFTLEtBQUssQ0FBTCxDQUFULENBQWhCO0FBQ0EsZ0JBQUksV0FB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LEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsYUFBNUQ7QUFDQTtBQUNIO0FBQ0Qsb0JBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxFQUFFLENBQU4sRUFBUyxHQUFaLEdBQWdCLElBQWhCLEdBQXFCLEtBQTdDO0FBQ0Esb0JBQVEsU0FBUixHQUFvQixNQUFwQjtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEtBQTNDO0FBQ0Esb0JBQVEsU0FBUjs7QUFFQSxvQkFBUSxXQUFSLEdBQXNCLE1BQXRCOztBQUVBLG9CQUFRLE1BQVI7QUFDQSxvQkFBUSxJQUFSO0FBQ0g7OztpQ0FFTztBQUNKLGlCQUFLLGlCQUFMO0FBQ0g7Ozs7OztrQkFoVmdCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAgICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgICAgKi9cclxuICAgIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKXtcclxuICAgICAgICBpZihudW1iZXIgPiAzNjUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihudW1iZXIgPCAxMClcclxuICAgICAgICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgZWxzZSBpZihudW1iZXIgPCAxMDApXHJcbiAgICAgICAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQsiDQs9C+0LTRg1xyXG4gICAgICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xyXG4gICAgICovXHJcbiAgICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICB2YXIgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgICAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAgICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAgICAqL1xyXG4gICAgY29udmVydE51bWJlckRheVRvRGF0ZShkYXRlKXtcclxuICAgICAgICB2YXIgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICAgICAgdmFyIGxpbmUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIHZhciBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgICAgICB2YXIgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgbGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICoyNDtcclxuICAgICAgICB2YXIgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xyXG5cclxuICAgICAgICB2YXIgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgdmFyIGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gcmVzLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICogQHBhcmFtICB7ZGF0ZTF9IGRhdGUg0LTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgeXl5eS1tbS1kZFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICovXHJcbiAgICBmb3JtYXREYXRlKGRhdGUxKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoPDEwKT9gMCR7bW9udGh9YDogbW9udGh9LSR7KGRheTwxMCk/YDAke2RheX1gOiBkYXl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudERhdGUoKXtcclxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRlKG5vdyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICAgIGdldERhdGVMYXN0VGhyZWVNb250aCgpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgICAgIHZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG5cclxuICAgICAgICBkYXkgLT05MDtcclxuXHJcbiAgICAgICAgaWYoZGF5IDwgMCApe1xyXG4gICAgICAgICAgICB5ZWFyIC09MTtcclxuICAgICAgICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRMYXN0U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLTE7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0RGF0ZUN1clllYXIoKXtcclxuICAgICAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfS0wMDFgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sJycpLnJlcGxhY2UoLzpcXHcrJC8sJycpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICByZXR1cm4gYCR7aG91cnM8MTA/YDAke2hvdXJzfWA6aG91cnN9OiR7bWludXRlczwxMD9gMCR7bWludXRlc31gOm1pbnV0ZXN9IGA7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAgICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpe1xyXG4gICAgICAgIGxldCBkYXlzID0ge1xyXG4gICAgICAgICAgICAwIDogXCJTdW5cIixcclxuICAgICAgICAgICAgMSA6IFwiTW9uXCIsXHJcbiAgICAgICAgICAgIDIgOiBcIlR1ZVwiLFxyXG4gICAgICAgICAgICAzIDogXCJXZWRcIixcclxuICAgICAgICAgICAgNCA6IFwiVGh1XCIsXHJcbiAgICAgICAgICAgIDUgOiBcIkZyaVwiLFxyXG4gICAgICAgICAgICA2IDogXCJTYXRcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBXZWF0aGVyV2lkZ2V0IGZyb20gJy4vd2VhdGhlci13aWRnZXQnO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyIHVybERvbWFpbiA9IFwiaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcclxuXHJcbiAgICBsZXQgcGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgICAgIGNpdHlOYW1lOiAnTW9zY293JyxcclxuICAgICAgICBsYW5nOiAnZW4nLFxyXG4gICAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICAgIHVuaXRzOiAnbWV0cmljJyxcclxuICAgICAgICB0ZXh0VW5pdFRlbXA6ICcwJ1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2lkZ2V0LW1lbnVfX2hlYWRlclwiKSxcclxuICAgICAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX251bWJlclwiKSxcclxuICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX21lYW5zXCIpLFxyXG4gICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX3dpbmRcIiksXHJcbiAgICAgICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9faW1nXCIpLFxyXG4gICAgICAgIGNhbGVuZGFySXRlbTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYWxlbmRhcl9faXRlbVwiKSxcclxuICAgICAgICBncmFwaGljOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXBoaWNcIilcclxuICAgIH07XHJcblxyXG4gICAgbGV0IHVybHMgPSB7XHJcbiAgICAgICAgdXJsV2VhdGhlckFQSTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS93ZWF0aGVyP3E9JHtwYXJhbXNXaWRnZXQuY2l0eU5hbWV9JnVuaXRzPSR7cGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3BhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseT9xPSR7cGFyYW1zV2lkZ2V0LmNpdHlOYW1lfSZ1bml0cz0ke3BhcmFtc1dpZGdldC51bml0c30mYXBwaWQ9JHtwYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IFwiZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvblwiLFxyXG4gICAgICAgIHdpbmREaXJlY3Rpb246IFwiZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25cIixcclxuICAgICAgICBjbG91ZHM6IFwiZGF0YS9jbG91ZHMtZGF0YS5qc29uXCIsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IFwiZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uXCJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChwYXJhbXNXaWRnZXQsIGNvbnRyb2xzV2lkZ2V0LCB1cmxzKTtcclxuICAgIGxldCBqc29uRnJvbUFQSSA9IG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbmltcG9ydCBDdXN0b21EYXRlIGZyb20gXCIuL2N1c3RvbS1kYXRlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWF0aGVyV2lkZ2V0IGV4dGVuZHMgQ3VzdG9tRGF0ZXtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcclxuICAgICAgICB0aGlzLnVybHMgPSB1cmxzO1xyXG5cclxuICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgICAgIHRoaXMud2VhdGhlciA9IHtcclxuICAgICAgICAgICAgXCJmcm9tQVBJXCI6XHJcbiAgICAgICAgICAgIHtcImNvb3JkXCI6e1xyXG4gICAgICAgICAgICAgICAgXCJsb25cIjpcIjBcIixcclxuICAgICAgICAgICAgICAgIFwibGF0XCI6XCIwXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwid2VhdGhlclwiOlt7XCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWFpblwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjpcIlwiXHJcbiAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgIFwiYmFzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgXCJtYWluXCI6e1xyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJlc3N1cmVcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImh1bWlkaXR5XCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wX21pblwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9tYXhcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwid2luZFwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInNwZWVkXCI6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZWdcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmFpblwiOnt9LFxyXG4gICAgICAgICAgICAgICAgXCJjbG91ZHNcIjp7XCJhbGxcIjpcIiBcIn0sXHJcbiAgICAgICAgICAgICAgICBcImR0XCI6YGAsXHJcbiAgICAgICAgICAgICAgICBcInN5c1wiOntcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5yaXNlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5zZXRcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOlwiVW5kZWZpbmVkXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvZFwiOlwiIFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAgICogQHBhcmFtIHVybFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgKi9cclxuICAgIGh0dHBHZXQodXJsKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xyXG4gICAgICovXHJcbiAgICBnZXRXZWF0aGVyRnJvbUFwaSgpe1xyXG4gICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLm5hdHVyYWxQaGVub21lbm9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMud2luZFNwZWVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDRgdC10LvQtdC60YLQvtGAINC/0L4g0LfQvdCw0YfQtdC90LjRjiDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LIgSlNPTlxyXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSBKU09OXHJcbiAgICAgKiBAcGFyYW0gIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XHJcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGVsZW1lbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsCzQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICAgKi9cclxuICAgIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpe1xyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmplY3Qpe1xyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcclxuICAgICAgICAgICAgaWYodHlwZW9mIG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSA9PT0gXCJvYmplY3RcIiAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YHQviDQt9C90LDRh9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQsCDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCDRgSDQtNCy0YPQvNGPINGN0LvQtdC80LXQvdGC0LDQvNC4INCyIEpTT05cclxuICAgICAgICAgICAgZWxzZSBpZihlbGVtZW50TmFtZTIgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWUyXSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICAgKiBAcGFyYW0ganNvbkRhdGFcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBwYXJzZURhdGFGcm9tU2VydmVyKCl7XHJcblxyXG4gICAgICAgIGxldCB3ZWF0aGVyID0gdGhpcy53ZWF0aGVyO1xyXG5cclxuICAgICAgICBpZih3ZWF0aGVyLmZyb21BUEkubmFtZSA9PT0gXCJVbmRlZmluZWRcIiB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSBcIjQwNFwiKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLQlNCw0L3QvdGL0LUg0L7RgiDRgdC10YDQstC10YDQsCDQvdC1INC/0L7Qu9GD0YfQtdC90YtcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5hdHVyYWxQaGVub21lbm9uID0gYGA7XHJcbiAgICAgICAgdmFyIHdpbmRTcGVlZCA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kRGlyZWN0aW9uID0gYGA7XHJcbiAgICAgICAgdmFyIGNsb3VkcyA9IGBgO1xyXG5cclxuICAgICAgICAvL9CY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXHJcbiAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICBjbG91ZGluZXNzOiBgIGAsXHJcbiAgICAgICAgICAgIGR0IDogYCBgLFxyXG4gICAgICAgICAgICBjaXR5TmFtZSA6ICBgIGAsXHJcbiAgICAgICAgICAgIGljb24gOiBgIGAsXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlIDogYCBgLFxyXG4gICAgICAgICAgICBwcmVzc3VyZSA6ICBgIGAsXHJcbiAgICAgICAgICAgIGh1bWlkaXR5IDogYCBgLFxyXG4gICAgICAgICAgICBzdW5yaXNlIDogYCBgLFxyXG4gICAgICAgICAgICBzdW5zZXQgOiBgIGAsXHJcbiAgICAgICAgICAgIGNvb3JkIDogYCBgLFxyXG4gICAgICAgICAgICB3aW5kOiBgIGAsXHJcbiAgICAgICAgICAgIHdlYXRoZXI6IGAgYFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWA7XHJcbiAgICAgICAgaWYod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kU3BlZWRcIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcInNwZWVkXCJdLnRvRml4ZWQoMSl9ICBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZFNwZWVkXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpLCBcInNwZWVkX2ludGVydmFsXCIpfWA7XHJcbiAgICAgICAgaWYod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX0gKCAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXX0gKWBcclxuICAgICAgICBpZih3ZWF0aGVyW1wiY2xvdWRzXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS5jbG91ZHMgPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wiY2xvdWRzXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcImNsb3Vkc1wiXVtcImFsbFwiXSwgXCJtaW5cIiwgXCJtYXhcIil9YDtcclxuXHJcbiAgICAgICAgbWV0YWRhdGEuaWNvbiA9IGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2VhdGhlclwiXVswXVtcImljb25cIl19YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBgPHNwYW4+V2VhdGhlciBmb3I8L3NwYW4+ICR7bWV0YWRhdGEuY2l0eU5hbWV9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHN1cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fZGVncmVlXCI+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zdXA+YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLnNyYyA9IGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7bWV0YWRhdGEuaWNvbn0ucG5nYDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKG1ldGFkYXRhLndlYXRoZXIudHJpbSgpKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24pe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndlYXRoZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBpZihtZXRhZGF0YS53aW5kU3BlZWQudHJpbSgpKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMud2luZFNwZWVkW2VsZW1dLmlubmVyVGV4dCA9IG1ldGFkYXRhLndpbmRTcGVlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSlcclxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlRGF0YUZvckdyYXBoaWMoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGFyZURhdGFGb3JHcmFwaGljKCl7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG5cclxuICAgICAgICBhcnIucHVzaCh7XHJcbiAgICAgICAgICAgICdtaW4nOk1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFswXS50ZW1wLm1pbiksXHJcbiAgICAgICAgICAgICdtYXgnOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbMF0udGVtcC5tYXgpLFxyXG4gICAgICAgICAgICAnZGF5JzogJ1RvZGF5JyxcclxuICAgICAgICAgICAgJ2ljb24nOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0WzBdLndlYXRoZXJbMF0uaWNvblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IodmFyIGVsZW0gaW4gdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdCl7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdtaW4nOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgICAgICAgICAgJ21heCc6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXHJcbiAgICAgICAgICAgICAgICAnZGF5JzogdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpKSxcclxuICAgICAgICAgICAgICAgICdpY29uJzogdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS53ZWF0aGVyWzBdLmljb25cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpYyhhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxyXG4gICAgICogQHBhcmFtIGRhdGFcclxuICAgICAqL1xyXG4gICAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XHJcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQvtCx0YDQsNC20LXQvdC40LUg0LPRgNCw0YTQuNC60LAg0L/QvtCz0L7QtNGLINC90LAg0L3QtdC00LXQu9GOXHJcbiAgICAgKi9cclxuICAgIGRyYXdHcmFwaGljKGFycil7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGFycik7XHJcblxyXG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ncmFwaGljLndpZHRoPSA0NjU7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ncmFwaGljLmhlaWdodCA9IDcwO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiI2ZmZlwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwwLDYwMCwzMDApO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIk9zd2FsZC1NZWRpdW0sIEFyaWFsLCBzYW5zLXNlcmkgMTRweFwiO1xyXG5cclxuICAgICAgICB2YXIgc3RlcCA9IDU1O1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICB2YXIgem9vbSA9IDQ7XHJcbiAgICAgICAgdmFyIHN0ZXBZID0gNjQ7XHJcbiAgICAgICAgdmFyIHN0ZXBZVGV4dFVwID0gNTg7XHJcbiAgICAgICAgdmFyIHN0ZXBZVGV4dERvd24gPSA3NTtcclxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLTEwLCAtMSphcnJbaSsrXS5tYXgqem9vbStzdGVwWSk7XHJcbiAgICAgICAgd2hpbGUoaTxhcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgc3RlcCArPTU1O1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1heCsnwronLCBzdGVwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFlUZXh0VXApO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFyclstLWldLm1heCp6b29tK3N0ZXBZKVxyXG4gICAgICAgIHN0ZXAgPSA1NTtcclxuICAgICAgICBpID0gMCA7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RlcC0xMCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1pbisnwronLCBzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFlUZXh0RG93bik7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFyclstLWldLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiIzMzM1wiO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwiIzMzM1wiO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIHRoaXMuZ2V0V2VhdGhlckZyb21BcGkoKTtcclxuICAgIH07XHJcblxyXG59Il19
