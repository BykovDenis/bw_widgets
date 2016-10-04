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
    }, {
        key: 'convertStringDateMMDDYYYHHToDate',
        value: function convertStringDateMMDDYYYHHToDate(date) {
            var re = /(\d{2})(\.{1})(\d{2})(\.{1})(\d{4})/;
            var resDate = re.exec(date);
            if (resDate.length == 6) {
                return new Date(resDate[5] + '-' + resDate[3] + '-' + resDate[1]);
            }
            // Если дата не распарсена берем текущую
            return new Date();
        }
    }]);

    return CustomDate;
}(Date);

exports.default = CustomDate;

},{}],2:[function(require,module,exports){
/**
 * Created by Denis on 29.09.2016.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _customDate = require("./custom-date");

var _customDate2 = _interopRequireDefault(_customDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        key: "prepareData",
        value: function prepareData() {
            var _this2 = this;

            var i = 0;
            var rawData = [];

            this.params.data.forEach(function (elem) {
                rawData.push({ x: i, date: _this2.convertStringDateMMDDYYYHHToDate(elem.date), maxT: elem.max, minT: elem.min });
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
        key: "makeSVG",
        value: function makeSVG() {
            return d3.select(this.params.id).append("svg").attr("class", "axis").attr("width", this.params.width).attr("height", this.params.height).attr("fill", this.params.colorPolilyne).style("stroke", "#ffffff");
        }

        /**
         * Определение минималльного и максимального элемента по параметру даты
         * [getMinMaxDate description]
         * @param  {[array]} rawData [массив с адаптированными по типу графика данными]
         * @return {[object]} data [объект с минимальным и максимальным значением]
         */

    }, {
        key: "getMinMaxDate",
        value: function getMinMaxDate(rawData) {

            /* Определяем минимальные и максмальные значения для построения осей */
            var data = {
                maxDate: new Date('1900-01-01 00:00:00'),
                minDate: new Date('2500-01-01 00:00:00')
            };

            rawData.forEach(function (elem) {
                if (data.maxDate <= elem.date) data.maxDate = elem.date;
                if (data.minDate >= elem.date) data.minDate = elem.date;
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
        key: "getMinMaxTemperature",
        value: function getMinMaxTemperature(rawData) {

            /* Определяем минимальные и максмальные значения для построения осей */
            var data = {
                min: 100,
                max: 0
            };

            rawData.forEach(function (elem) {
                if (data.min >= elem.minT) data.min = elem.minT;
                if (data.max <= elem.maxT) data.max = elem.maxT;
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
        key: "getMinMaxWeather",
        value: function getMinMaxWeather(rawData) {

            /* Определяем минимальные и максмальные значения для построения осей */
            var data = {
                min: 0,
                max: 0
            };

            rawData.forEach(function (elem) {
                if (data.min >= elem.humidity) data.min = elem.humidity;
                if (data.min >= elem.rainfallAmount) data.min = elem.rainfallAmount;
                if (data.max <= elem.humidity) data.max = elem.humidity;
                if (data.max <= elem.rainfallAmount) data.max = elem.rainfallAmount;
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
        key: "makeAxesXY",
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
        key: "scaleAxesXYTemperature",
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
                data.push({ x: scaleX(elem.date) + params.offsetX,
                    maxT: scaleY(elem.maxT) + params.offsetX,
                    minT: scaleY(elem.minT) + params.offsetX });
            });

            return { scaleX: scaleX, scaleY: scaleY, data: data };
        }
    }, {
        key: "scaleAxesXYWeather",
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
                data.push({ x: scaleX(elem.date) + margin, humidity: scaleY(elem.humidity) + margin, rainfallAmount: scaleY(elem.rainfallAmount) + margin, color: elem.color });
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
        key: "makePolyline",
        value: function makePolyline(data, params, scaleX, scaleY) {

            var arrPolyline = [];
            data.forEach(function (elem) {
                arrPolyline.push({ x: scaleX(elem.date) + params.offsetX, y: scaleY(elem.maxT) + params.offsetY });
            });
            data.reverse().forEach(function (elem) {
                arrPolyline.push({ x: scaleX(elem.date) + params.offsetX, y: scaleY(elem.minT) + params.offsetY });
            });
            arrPolyline.push({ x: scaleX(data[data.length - 1]['date']) + params.offsetX, y: scaleY(data[data.length - 1]['maxT']) + params.offsetY });

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
        key: "drawPolyline",
        value: function drawPolyline(svg, data) {
            // добавляем путь и рисуем линии

            svg.append("g").append("path").style("stroke-width", this.params.strokeWidth).attr("d", this.temperaturePolygon(data)).style("stroke", this.params.colorPolilyne).style("fill", this.params.colorPolilyne).style("opacity", 1);
        }
    }, {
        key: "drawLabelsTemperature",
        value: function drawLabelsTemperature(svg, data, params) {

            data.forEach(function (elem, item, data) {

                // отрисовка текста
                svg.append("text").attr("x", elem.x).attr("y", elem.maxT - params.offsetX / 2 - 2).attr("text-anchor", "middle").style("font-size", params.fontSize).style("stroke", params.fontColor).style("fill", params.fontColor).text(params.data[item].max + '°');

                svg.append("text").attr("x", elem.x).attr("y", elem.minT + params.offsetY / 2 + 10).attr("text-anchor", "middle").style("font-size", params.fontSize).style("stroke", params.fontColor).style("fill", params.fontColor).text(params.data[item].min + '°');
            });
        }

        /**
         * Метод диспетчер прорисовка графика со всеми элементами
         * [render description]
         * @return {[type]} [description]
         */

    }, {
        key: "render",
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
            //this.drawMarkers(svg, polyline, this.margin);
        }
    }]);

    return Graphic;
}(_customDate2.default);

exports.default = Graphic;

},{"./custom-date":1}],3:[function(require,module,exports){
"use strict";

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Генерация большого виджета
document.addEventListener('DOMContentLoaded', function () {

  var generatorDOM = function generatorDOM() {
    var size = arguments.length <= 0 || arguments[0] === undefined ? "full" : arguments[0];


    var html = '<link rel="stylesheet" href="css/style.css">';
    html += '<script src="js/libs/d3.min.js"></script>';
    if (size === "full") {
      html += '<div class="widget-menu widget-menu__layout"><h1 class="widget-menu__header">Weather for Moscow</h1>\n        <div class="widget-menu__links"><span>More at</span><a href="//openweathermap.org/" target="_blank" class="widget-menu__link">\n        OpenWeatherMap</a></div></div><div class="widget__body"><div class="weather-card"><div class="weather-card__row1">\n        <img src="img/10dbw.png" width="128" height="128" alt="Weather for Moscow" class="weather-card__img"/>\n        <div class="weather-card__col"><p class="weather-card__number">0<sup class="weather-card__degree">0 </sup></p>\n        <span>and rising</span></div></div><div class="weather-card__row2"><p class="weather-card__means">-</p>\n        <p class="weather-card__wind">Wind:</p></div></div><div class="widget__calendar"><ul class="calendar">\n        <li class="calendar__item">Today<img src="" width="32" height="32" alt="Today"/></li>\n        <li class="calendar__item">Sat <img src="" width="32" height="32" alt="Sat"/></li>\n        <li class="calendar__item">Sun<img src="" width="32" height="32" alt="Sun"/></li>\n        <li class="calendar__item">Mon <img src="" width="32" height="32" alt="Mon"/></li>\n        <li class="calendar__item">Tue<img src="" width="32" height="32" alt="Tue"/></li>\n        <li class="calendar__item">Wed<img src="" width="32" height="32" alt="Wed"/></li>\n        <li class="calendar__item">Thu<img src="" width="32" height="32" alt="Thu"/></li>\n        <li class="calendar__item">Fri<img src="" width="32" height="32" alt="Fri"/></li></ul>\n        <div id="graphic" class="widget__graphic"></div></div></div>';
      html += '<script src="js/weather-widget.js"></script><script>const objWidget = new WeatherWidget(paramsWidget, controlsWidget, urls);\n        if(generatorDOM()) var jsonFromAPI = objWidget.render();</script>';
    }

    document.getElementById("widget").innerHTML = html;
    return html;
  };

  //Формируем параметр фильтра по городу
  var q = '';
  if (window.location.search) q = window.location.search;else q = "?q=London";

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
    urlWeatherAPI: urlDomain + '/data/2.5/weather' + q + '&units=' + paramsWidget.units + '&appid=' + paramsWidget.appid,
    paramsUrlForeDaily: urlDomain + '/data/2.5/forecast/daily' + q + '&units=' + paramsWidget.units + '&cnt=8&appid=' + paramsWidget.appid,
    windSpeed: "data/wind-speed-data.json",
    windDirection: "data/wind-direction-data.json",
    clouds: "data/clouds-data.json",
    naturalPhenomenon: "data/natural-phenomenon-data.json"
  };
});

},{"./weather-widget":4}],4:[function(require,module,exports){
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

var _graphicD3js = require("./graphic-d3js");

var _graphicD3js2 = _interopRequireDefault(_graphicD3js);

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
            debugger;
            for (var _elem2 in this.controls.mainIconWeather) {
                if (this.controls.mainIconWeather.hasOwnProperty(_elem2)) {
                    this.controls.mainIconWeather[_elem2].src = this.getURLMainIcon(metadata.icon);
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

            for (var elem in this.weather.forecastDaily.list) {
                var day = this.getDayNameOfWeekByDayNumber(this.getNumberDayInWeekByUnixTime(this.weather.forecastDaily.list[elem].dt));
                arr.push({
                    'min': Math.round(this.weather.forecastDaily.list[elem].temp.min),
                    'max': Math.round(this.weather.forecastDaily.list[elem].temp.max),
                    'day': elem != 0 ? day : 'Today',
                    'icon': this.weather.forecastDaily.list[elem].weather[0].icon,
                    'date': this.timestampToDateTime(this.weather.forecastDaily.list[elem].dt)
                });
            }

            return this.drawGraphicD3(arr);
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

            return data;
        }
    }, {
        key: "getURLMainIcon",
        value: function getURLMainIcon(nameIcon) {
            // Создаем и инициализируем карту сопоставлений
            var mapIcons = new Map();
            // Дневные
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
                return "img/" + mapIcons.get(nameIcon) + ".png";
            } else {
                return "http://openweathermap.org/img/w/" + nameIcon + ".png";
            }
        }

        /**
         * Отрисовка графика с помощью библиотеки D3
         */

    }, {
        key: "drawGraphicD3",
        value: function drawGraphicD3(data) {

            this.renderIconsDaysOfWeek(data);

            //Параметризуем область отрисовки графика
            var params = {
                id: "#graphic",
                data: data,
                offsetX: 15,
                offsetY: 10,
                width: 420,
                height: 79,
                rawData: [],
                margin: 10,
                colorPolilyne: "#333",
                fontSize: "12px",
                fontColor: "#333",
                strokeWidth: "1px"
            };

            // Реконструкция процедуры рендеринга графика температуры
            var objGraphicD3 = new _graphicD3js2.default(params);
            objGraphicD3.render();
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

},{"./custom-date":1,"./graphic-d3js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxnZW5lcmF0b3JcXGN1c3RvbS1kYXRlLmpzIiwiYXNzZXRzXFxqc1xcZ2VuZXJhdG9yXFxncmFwaGljLWQzanMuanMiLCJhc3NldHNcXGpzXFxnZW5lcmF0b3JcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXGdlbmVyYXRvclxcd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FBR0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCLFU7OztBQUVqQiwwQkFBYTtBQUFBOztBQUFBO0FBRVo7O0FBRUQ7Ozs7Ozs7Ozs0Q0FLb0IsTSxFQUFPO0FBQ3ZCLGdCQUFHLFNBQVMsR0FBWixFQUFpQixPQUFPLEtBQVA7QUFDakIsZ0JBQUcsU0FBUyxFQUFaLEVBQ0ksY0FBWSxNQUFaLENBREosS0FFSyxJQUFHLFNBQVMsR0FBWixFQUNELGFBQVcsTUFBWDtBQUNKLG1CQUFPLE1BQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxNQUFNLElBQUksSUFBSixDQUFTLElBQVQsQ0FBVjtBQUNBLGdCQUFJLFFBQVEsSUFBSSxJQUFKLENBQVMsSUFBSSxXQUFKLEVBQVQsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBWjtBQUNBLGdCQUFJLE9BQU8sTUFBTSxLQUFqQjtBQUNBLGdCQUFJLFNBQVMsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUE5QjtBQUNBLGdCQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsT0FBTyxNQUFsQixDQUFWO0FBQ0EsbUJBQVUsSUFBSSxXQUFKLEVBQVYsU0FBK0IsS0FBSyxtQkFBTCxDQUF5QixHQUF6QixDQUEvQjtBQUNIOztBQUVEOzs7Ozs7OzsrQ0FLdUIsSSxFQUFLO0FBQ3hCLGdCQUFJLEtBQUssbUJBQVQ7QUFDQSxnQkFBSSxPQUFPLEdBQUcsSUFBSCxDQUFRLElB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QUE3QztBQUNBLG9CQUFRLFNBQVIsR0FBb0IsTUFBcEI7QUFDQSxvQkFBUSxNQUFSLENBQWUsT0FBSyxFQUFwQixFQUF3QixDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixLQUEzQztBQUNBLG9CQUFRLFNBQVI7O0FBRUEsb0JBQVEsV0FBUixHQUFzQixNQUF0Qjs7QUFFQSxvQkFBUSxNQUFSO0FBQ0Esb0JBQVEsSUFBUjtBQUNIOzs7aUNBRU87QUFDSixpQkFBSyxpQkFBTDtBQUNIOzs7Ozs7a0JBbFpnQixhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI4LjA5LjIwMTYuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vLyDQoNCw0LHQvtGC0LAg0YEg0LTQsNGC0L7QuVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21EYXRlIGV4dGVuZHMgRGF0ZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0LzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YMg0LIg0YLRgNC10YXRgNCw0LfRgNGP0LTQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuFxyXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBudW1iZXIgW9GH0LjRgdC70L4g0LzQtdC90LXQtSA5OTldXHJcbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0gICAgICAgIFvRgtGA0LXRhdC30L3QsNGH0L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDXVxyXG4gICAgICovXHJcbiAgICBudW1iZXJEYXlzT2ZZZWFyWFhYKG51bWJlcil7XHJcbiAgICAgICAgaWYobnVtYmVyID4gMzY1KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYobnVtYmVyIDwgMTApXHJcbiAgICAgICAgICAgIHJldHVybiBgMDAke251bWJlcn1gO1xyXG4gICAgICAgIGVsc2UgaWYobnVtYmVyIDwgMTAwKVxyXG4gICAgICAgICAgICByZXR1cm4gYDAke251bWJlcn1gO1xyXG4gICAgICAgIHJldHVybiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LIg0LPQvtC00YNcclxuICAgICAqIEBwYXJhbSAge2RhdGV9IGRhdGUg0JTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICAgICogQHJldHVybiB7aW50ZWdlcn0gINCf0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0LIg0LPQvtC00YNcclxuICAgICAqL1xyXG4gICAgY29udmVydERhdGVUb051bWJlckRheShkYXRlKXtcclxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgICAgIHZhciBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICAgICAgdmFyIG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcbiAgICAgICAgcmV0dXJuIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0L7QsdGA0LDQt9GD0LXRgiDQtNCw0YLRgyDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+INCyIHl5eXktbW0tZGRcclxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZGF0ZSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgICAgKiBAcmV0dXJuIHtkYXRlfSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgICAgKi9cclxuICAgIGNvbnZlcnROdW1iZXJEYXlUb0RhdGUoZGF0ZSl7XHJcbiAgICAgICAgdmFyIHJlID0gLyhcXGR7NH0pKC0pKFxcZHszfSkvO1xyXG4gICAgICAgIHZhciBsaW5lID0gcmUuZXhlYyhkYXRlKTtcclxuICAgICAgICB2YXIgYmVnaW55ZWFyID0gbmV3IERhdGUobGluZVsxXSk7XHJcbiAgICAgICAgdmFyIHVuaXh0aW1lID0gYmVnaW55ZWFyLmdldFRpbWUoKSArIGxpbmVbM10gKiAxMDAwICogNjAgKiA2MCAqMjQ7XHJcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBEYXRlKHVuaXh0aW1lKTtcclxuXHJcbiAgICAgICAgdmFyIG1vbnRoID0gcmVzLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgICAgIHZhciBkYXlzID0gcmVzLmdldERhdGUoKTtcclxuICAgICAgICB2YXIgeWVhciA9IHJlcy5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHJldHVybiBgJHtkYXlzIDwgMTAgPyBgMCR7ZGF5c31gOiBkYXlzfS4ke21vbnRoIDwgMTAgPyBgMCR7bW9udGh9YDogbW9udGh9LiR7eWVhcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC00LDRgtGLINCy0LjQtNCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAgICAqIEBwYXJhbSAge2RhdGUxfSBkYXRlINC00LDRgtCwINCyINGE0L7RgNC80LDRgtC1IHl5eXktbW0tZGRcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gINC00LDRgtCwINCy0LLQuNC00LUg0YHRgtGA0L7QutC4INGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAgICAqL1xyXG4gICAgZm9ybWF0RGF0ZShkYXRlMSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlMSk7XHJcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS0keyhtb250aDwxMCk/YDAke21vbnRofWA6IG1vbnRofS0keyhkYXk8MTApP2AwJHtkYXl9YDogZGF5fWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGC0LXQutGD0YnRg9GOINC+0YLRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdGD0Y4g0LTQsNGC0YMgeXl5eS1tbS1kZFxyXG4gICAgICogQHJldHVybiB7W3N0cmluZ119INGC0LXQutGD0YnQsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIGdldEN1cnJlbnREYXRlKCl7XHJcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0RGF0ZShub3cpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC/0L7RgdC70LXQtNC90LjQtSDRgtGA0Lgg0LzQtdGB0Y/RhtCwXHJcbiAgICBnZXREYXRlTGFzdFRocmVlTW9udGgoKXtcclxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICB2YXIgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuXHJcbiAgICAgICAgZGF5IC09OTA7XHJcblxyXG4gICAgICAgIGlmKGRheSA8IDAgKXtcclxuICAgICAgICAgICAgeWVhciAtPTE7XHJcbiAgICAgICAgICAgIGRheSA9IDM2NSAtIGRheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gICAgZ2V0Q3VycmVudFN1bW1lckRhdGUoKXtcclxuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICAgICAgdmFyIGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XHJcbiAgICAgICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gICAgZ2V0Q3VycmVudFNwcmluZ0RhdGUoKXtcclxuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTAzLTAxYCk7XHJcbiAgICAgICAgdmFyIGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNS0zMWApO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XHJcbiAgICAgICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0L/RgNC10LTRi9C00YPRidC10LPQviDQu9C10YLQsFxyXG4gICAgZ2V0TGFzdFN1bW1lckRhdGUoKXtcclxuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS0xO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaXJzdERhdGVDdXJZZWFyKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0tMDAxYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gZGQubW0ueXl5eSBoaDptbV1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgdGltZXN0YW1wVG9EYXRlVGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygpLnJlcGxhY2UoLywvLCcnKS5yZXBsYWNlKC86XFx3KyQvLCcnKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGhoOm1tXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aW1lc3RhbXBUb1RpbWUodW5peHRpbWUpe1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodW5peHRpbWUqMTAwMCk7XHJcbiAgICAgICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gICAgICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XHJcbiAgICAgICAgcmV0dXJuIGAke2hvdXJzPDEwP2AwJHtob3Vyc31gOmhvdXJzfToke21pbnV0ZXM8MTA/YDAke21pbnV0ZXN9YDptaW51dGVzfSBgO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9GA0LDRidC10L3QuNC1INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0L3QtdC00LXQu9C1INC/0L4gdW5peHRpbWUgdGltZXN0YW1wXHJcbiAgICAgKiBAcGFyYW0gdW5peHRpbWVcclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodW5peHRpbWUpe1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodW5peHRpbWUqMTAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqINCS0LXRgNC90YPRgtGMINC90LDQuNC80LXQvdC+0LLQsNC90LjQtSDQtNC90Y8g0L3QtdC00LXQu9C4XHJcbiAgICAgKiBAcGFyYW0gZGF5TnVtYmVyXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBnZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIoZGF5TnVtYmVyKXtcclxuICAgICAgICBsZXQgZGF5cyA9IHtcclxuICAgICAgICAgICAgMCA6IFwiU3VuXCIsXHJcbiAgICAgICAgICAgIDEgOiBcIk1vblwiLFxyXG4gICAgICAgICAgICAyIDogXCJUdWVcIixcclxuICAgICAgICAgICAgMyA6IFwiV2VkXCIsXHJcbiAgICAgICAgICAgIDQgOiBcIlRodVwiLFxyXG4gICAgICAgICAgICA1IDogXCJGcmlcIixcclxuICAgICAgICAgICAgNiA6IFwiU2F0XCJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkYXlzW2RheU51bWJlcl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqINCh0YDQsNCy0L3QtdC90LjQtSDQtNCw0YLRiyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5ID0gZGQubW0ueXl5eSDRgSDRgtC10LrRg9GJ0LjQvCDQtNC90LXQvFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgY29tcGFyZURhdGVzV2l0aFRvZGF5KGRhdGUpIHtcclxuICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSA9PT0gKG5ldyBEYXRlKCkpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGRhdGUpe1xyXG4gICAgICAgIGxldCByZSA9LyhcXGR7Mn0pKFxcLnsxfSkoXFxkezJ9KShcXC57MX0pKFxcZHs0fSkvO1xyXG4gICAgICAgIGxldCByZXNEYXRlID0gcmUuZXhlYyhkYXRlKTtcclxuICAgICAgICBpZihyZXNEYXRlLmxlbmd0aCA9PSA2KXtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGAke3Jlc0RhdGVbNV19LSR7cmVzRGF0ZVszXX0tJHtyZXNEYXRlWzFdfWApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINCV0YHQu9C4INC00LDRgtCwINC90LUg0YDQsNGB0L/QsNGA0YHQtdC90LAg0LHQtdGA0LXQvCDRgtC10LrRg9GJ0YPRjlxyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSBcIi4vY3VzdG9tLWRhdGVcIjtcclxuXHJcbi8qKlxyXG4g0JPRgNCw0YTQuNC6INGC0LXQvNC/0LXRgNCw0YLRg9GA0Ysg0Lgg0L/QvtCz0L7QtNGLXHJcbiBAY2xhc3MgR3JhcGhpY1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhpYyBleHRlbmRzIEN1c3RvbURhdGV7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0L7RgtGA0LjRgdC+0LLQutC4INC+0YHQvdC+0LLQvdC+0Lkg0LvQuNC90LjQuCDQv9Cw0YDQsNC80LXRgtGA0LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICAgICAqIFtsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uID0gZDMubGluZSgpXHJcbiAgICAgICAgICAgIC54KGZ1bmN0aW9uKGQpe3JldHVybiBkLng7fSlcclxuICAgICAgICAgICAgLnkoZnVuY3Rpb24oZCl7cmV0dXJuIGQueTt9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDQtNCw0L3QvdGL0YUg0LIg0LzQsNGB0YHQuNCyINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcclxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICovXHJcbiAgICBwcmVwYXJlRGF0YSgpe1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBsZXQgcmF3RGF0YSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcy5kYXRhLmZvckVhY2goKGVsZW0pPT57XHJcbiAgICAgICAgICAgIHJhd0RhdGEucHVzaCh7eDogaSwgZGF0ZTogdGhpcy5jb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShlbGVtLmRhdGUpLCBtYXhUOiBlbGVtLm1heCwgIG1pblQ6IGVsZW0ubWlufSk7XHJcbiAgICAgICAgICAgIGkgKz0xOyAvLyDQodC80LXRidC10L3QuNC1INC/0L4g0L7RgdC4IFhcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJhd0RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0LXQvCDQuNC30L7QsdGA0LDQttC10L3QuNC1INGBINC60L7QvdGC0LXQutGB0YLQvtC8INC+0LHRitC10LrRgtCwIHN2Z1xyXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX1cclxuICAgICAqL1xyXG4gICAgbWFrZVNWRygpe1xyXG4gICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcy5wYXJhbXMuaWQpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiYXhpc1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRoaXMucGFyYW1zLndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCB0aGlzLnBhcmFtcy5oZWlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZmZmZmZmXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQvNC40L3QuNC80LDQu9C70YzQvdC+0LPQviDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINC/0L4g0L/QsNGA0LDQvNC10YLRgNGDINC00LDRgtGLXHJcbiAgICAgKiBbZ2V0TWluTWF4RGF0ZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSBkYXRhIFvQvtCx0YrQtdC60YIg0YEg0LzQuNC90LjQvNCw0LvRjNC90YvQvCDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0Lwg0LfQvdCw0YfQtdC90LjQtdC8XVxyXG4gICAgICovXHJcbiAgICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpe1xyXG5cclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgbWF4RGF0ZSA6IG5ldyBEYXRlKCcxOTAwLTAxLTAxIDAwOjAwOjAwJyksXHJcbiAgICAgICAgICAgIG1pbkRhdGUgOiBuZXcgRGF0ZSgnMjUwMC0wMS0wMSAwMDowMDowMCcpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF4RGF0ZSA8PSBlbGVtLmRhdGUpIGRhdGEubWF4RGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgICAgICAgaWYoZGF0YS5taW5EYXRlID49IGVsZW0uZGF0ZSkgZGF0YS5taW5EYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgKiBbZ2V0TWluTWF4RGF0ZVRlbXBlcmF0dXJlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcblxyXG4gICAgZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSl7XHJcblxyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBtaW4gOiAxMDAsXHJcbiAgICAgICAgICAgIG1heCA6IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgaWYoZGF0YS5taW4gPj0gZWxlbS5taW5UKVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLm1pblQ7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0ubWF4VClcclxuICAgICAgICAgICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKXtcclxuXHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG1pbiA6IDAsXHJcbiAgICAgICAgICAgIG1heCA6IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgaWYoZGF0YS5taW4gPj0gZWxlbS5odW1pZGl0eSlcclxuICAgICAgICAgICAgICAgIGRhdGEubWluID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgICAgICAgaWYoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudClcclxuICAgICAgICAgICAgICAgIGRhdGEubWluID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSlcclxuICAgICAgICAgICAgICAgIGRhdGEubWF4ID0gZWxlbS5odW1pZGl0eTtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5yYWluZmFsbEFtb3VudClcclxuICAgICAgICAgICAgICAgIGRhdGEubWF4ID0gZWxlbS5yYWluZmFsbEFtb3VudDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LTQu9C40L3RgyDQvtGB0LXQuSBYLFlcclxuICAgICAqIFttYWtlQXhlc1hZIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0JzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHJldHVybiB7W2Z1bmN0aW9uXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIG1ha2VBeGVzWFkocmF3RGF0YSwgcGFyYW1zKXtcclxuXHJcbiAgICAgICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWD0g0YjQuNGA0LjQvdCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdC70LXQstCwINC4INGB0L/RgNCw0LLQsFxyXG4gICAgICAgIGxldCB4QXhpc0xlbmd0aCA9IHBhcmFtcy53aWR0aCAtIDIgKiBwYXJhbXMubWFyZ2luO1xyXG4gICAgICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFkgPSDQstGL0YHQvtGC0LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LLQtdGA0YXRgyDQuCDRgdC90LjQt9GDXHJcbiAgICAgICAgbGV0IHlBeGlzTGVuZ3RoID0gcGFyYW1zLmhlaWdodCAtIDIgKiBwYXJhbXMubWFyZ2luO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Lgg0KUg0LggWVxyXG4gICAgICogW3NjYWxlQXhlc1hZIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19ICByYXdEYXRhICAgICBb0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB4QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBYXVxyXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHlBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFldXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19ICBtYXJnaW4gICAgICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICAgICAgICAgICAgIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxyXG4gICAgICovXHJcbiAgICBzY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKXtcclxuXHJcbiAgICAgICAgbGV0IHttYXhEYXRlLCBtaW5EYXRlfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgICAgICBsZXQge21pbiwgbWF4fSA9IHRoaXMuZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgICAgICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgICAgICAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHhBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxyXG4gICAgICAgICAqIFtzY2FsZUxpbmVhciBkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxyXG4gICAgICAgICAgICAuZG9tYWluKFttYXgrNSwgbWluLTVdKVxyXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gW107XHJcbiAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgICAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgbWF4VDogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICAgICAgICAgIG1pblQ6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFh9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtzY2FsZVg6IHNjYWxlWCwgc2NhbGVZOiBzY2FsZVksIGRhdGE6IGRhdGF9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzY2FsZUF4ZXNYWVdlYXRoZXIocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBtYXJnaW4pe1xyXG5cclxuICAgICAgICBsZXQge21heERhdGUsIG1pbkRhdGV9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgICAgIGxldCB7bWluLCBtYXh9ID0gdGhpcy5nZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpO1xyXG5cclxuICAgICAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgICAgIHZhciBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxyXG4gICAgICAgICAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxyXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHhBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICAgICB2YXIgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxyXG4gICAgICAgICAgICAuZG9tYWluKFttYXgsIG1pbl0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBkYXRhLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgbWFyZ2luLCBodW1pZGl0eTogc2NhbGVZKGVsZW0uaHVtaWRpdHkpICsgbWFyZ2luLCByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luICAsIGNvbG9yOiBlbGVtLmNvbG9yfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7c2NhbGVYOiBzY2FsZVgsIHNjYWxlWTogc2NhbGVZLCBkYXRhOiBkYXRhfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC+0YDQvNC40LLQsNGA0L7QvdC40LUg0LzQsNGB0YHQuNCy0LAg0LTQu9GPINGA0LjRgdC+0LLQsNC90LjRjyDQv9C+0LvQuNC70LjQvdC40LhcclxuICAgICAqIFttYWtlUG9seWxpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSBkYXRhIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxyXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gW9C+0YLRgdGC0YPQvyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gc2NhbGVYLCBzY2FsZVkgW9C+0LHRitC10LrRgtGLINGBINGE0YPQvdC60YbQuNGP0LzQuCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40LggWCxZXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBtYWtlUG9seWxpbmUoZGF0YSwgcGFyYW1zLCBzY2FsZVgsIHNjYWxlWSl7XHJcblxyXG4gICAgICAgIGxldCBhcnJQb2x5bGluZSA9IFtdO1xyXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRZfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGF0YS5yZXZlcnNlKCkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRZfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGRhdGFbZGF0YS5sZW5ndGgtMV1bJ2RhdGUnXSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGRhdGFbZGF0YS5sZW5ndGgtMV1bJ21heFQnXSkgKyBwYXJhbXMub2Zmc2V0WX0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYXJyUG9seWxpbmU7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L/QvtC70LjQu9C40L3QuNC5INGBINC30LDQu9C40LLQutC+0Lkg0L7RgdC90L7QstC90L7QuSDQuCDQuNC80LjRgtCw0YbQuNGPINC10LUg0YLQtdC90LhcclxuICAgICAqIFtkcmF3UG9sdWxpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHN2ZyAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIGRyYXdQb2x5bGluZShzdmcsIGRhdGEpe1xyXG4gICAgICAgIC8vINC00L7QsdCw0LLQu9GP0LXQvCDQv9GD0YLRjCDQuCDRgNC40YHRg9C10Lwg0LvQuNC90LjQuFxyXG5cclxuICAgICAgICBzdmcuYXBwZW5kKFwiZ1wiKS5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uKGRhdGEpKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJvcGFjaXR5XCIsIDEpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAgZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgcGFyYW1zKXtcclxuXHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpdGVtLCBkYXRhKT0+e1xyXG5cclxuICAgICAgICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINGC0LXQutGB0YLQsFxyXG4gICAgICAgICAgICBzdmcuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGVsZW0ueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBlbGVtLm1heFQgLSBwYXJhbXMub2Zmc2V0WC8yLTIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAudGV4dChwYXJhbXMuZGF0YVtpdGVtXS5tYXgrJ8KwJyk7XHJcblxyXG4gICAgICAgICAgICBzdmcuYXBwZW5kKFwidGV4dFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGVsZW0ueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBlbGVtLm1pblQgKyBwYXJhbXMub2Zmc2V0WS8yKzEwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnRleHQocGFyYW1zLmRhdGFbaXRlbV0ubWluKyfCsCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQtNC40YHQv9C10YLRh9C10YAg0L/RgNC+0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YHQviDQstGB0LXQvNC4INGN0LvQtdC80LXQvdGC0LDQvNC4XHJcbiAgICAgKiBbcmVuZGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgc3ZnID0gdGhpcy5tYWtlU1ZHKCk7XHJcbiAgICAgICAgbGV0IHJhd0RhdGEgPSB0aGlzLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgICAgIGxldCB7c2NhbGVYLCBzY2FsZVksIGRhdGF9ID0gIHRoaXMubWFrZUF4ZXNYWShyYXdEYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgbGV0IHBvbHlsaW5lID0gdGhpcy5tYWtlUG9seWxpbmUocmF3RGF0YSwgdGhpcy5wYXJhbXMsIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICB0aGlzLmRyYXdQb2x5bGluZShzdmcsIHBvbHlsaW5lKTtcclxuICAgICAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICAvL3RoaXMuZHJhd01hcmtlcnMoc3ZnLCBwb2x5bGluZSwgdGhpcy5tYXJnaW4pO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XHJcblxyXG4vLyDQk9C10L3QtdGA0LDRhtC40Y8g0LHQvtC70YzRiNC+0LPQviDQstC40LTQttC10YLQsFxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdG9yRE9NID0gZnVuY3Rpb24oc2l6ZSA9IFwiZnVsbFwiKXtcclxuXHJcbiAgICB2YXIgaHRtbCA9IGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImNzcy9zdHlsZS5jc3NcIj5gO1xyXG4gICAgaHRtbCArPSBgPHNjcmlwdCBzcmM9XCJqcy9saWJzL2QzLm1pbi5qc1wiPjwvc2NyaXB0PmA7XHJcbiAgICBpZihzaXplID09PSBcImZ1bGxcIil7XHJcbiAgICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJ3aWRnZXQtbWVudSB3aWRnZXQtbWVudV9fbGF5b3V0XCI+PGgxIGNsYXNzPVwid2lkZ2V0LW1lbnVfX2hlYWRlclwiPldlYXRoZXIgZm9yIE1vc2NvdzwvaDE+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIndpZGdldC1tZW51X19saW5rc1wiPjxzcGFuPk1vcmUgYXQ8L3NwYW4+PGEgaHJlZj1cIi8vb3BlbndlYXRoZXJtYXAub3JnL1wiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwid2lkZ2V0LW1lbnVfX2xpbmtcIj5cclxuICAgICAgICBPcGVuV2VhdGhlck1hcDwvYT48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid2lkZ2V0X19ib2R5XCI+PGRpdiBjbGFzcz1cIndlYXRoZXItY2FyZFwiPjxkaXYgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX3JvdzFcIj5cclxuICAgICAgICA8aW1nIHNyYz1cImltZy8xMGRidy5wbmdcIiB3aWR0aD1cIjEyOFwiIGhlaWdodD1cIjEyOFwiIGFsdD1cIldlYXRoZXIgZm9yIE1vc2Nvd1wiIGNsYXNzPVwid2VhdGhlci1jYXJkX19pbWdcIi8+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIndlYXRoZXItY2FyZF9fY29sXCI+PHAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX251bWJlclwiPjA8c3VwIGNsYXNzPVwid2VhdGhlci1jYXJkX19kZWdyZWVcIj4wIDwvc3VwPjwvcD5cclxuICAgICAgICA8c3Bhbj5hbmQgcmlzaW5nPC9zcGFuPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX3JvdzJcIj48cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fbWVhbnNcIj4tPC9wPlxyXG4gICAgICAgIDxwIGNsYXNzPVwid2VhdGhlci1jYXJkX193aW5kXCI+V2luZDo8L3A+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndpZGdldF9fY2FsZW5kYXJcIj48dWwgY2xhc3M9XCJjYWxlbmRhclwiPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImNhbGVuZGFyX19pdGVtXCI+VG9kYXk8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIlRvZGF5XCIvPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5TYXQgPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJTYXRcIi8+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPlN1bjxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiU3VuXCIvPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5Nb24gPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJNb25cIi8+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPlR1ZTxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiVHVlXCIvPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5XZWQ8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIldlZFwiLz48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImNhbGVuZGFyX19pdGVtXCI+VGh1PGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJUaHVcIi8+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPkZyaTxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiRnJpXCIvPjwvbGk+PC91bD5cclxuICAgICAgICA8ZGl2IGlkPVwiZ3JhcGhpY1wiIGNsYXNzPVwid2lkZ2V0X19ncmFwaGljXCI+PC9kaXY+PC9kaXY+PC9kaXY+YDtcclxuICAgICAgaHRtbCArPWA8c2NyaXB0IHNyYz1cImpzL3dlYXRoZXItd2lkZ2V0LmpzXCI+PC9zY3JpcHQ+PHNjcmlwdD5jb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChwYXJhbXNXaWRnZXQsIGNvbnRyb2xzV2lkZ2V0LCB1cmxzKTtcclxuICAgICAgICBpZihnZW5lcmF0b3JET00oKSkgdmFyIGpzb25Gcm9tQVBJID0gb2JqV2lkZ2V0LnJlbmRlcigpOzwvc2NyaXB0PmA7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aWRnZXRcIikuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIHJldHVybiBodG1sO1xyXG5cclxuICB9O1xyXG5cclxuICAvL9Ck0L7RgNC80LjRgNGD0LXQvCDQv9Cw0YDQsNC80LXRgtGAINGE0LjQu9GM0YLRgNCwINC/0L4g0LPQvtGA0L7QtNGDXHJcbiAgbGV0IHEgPSAnJztcclxuICBpZih3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG4gICAgICBxID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICBlbHNlXHJcbiAgICAgIHEgPSBcIj9xPUxvbmRvblwiO1xyXG5cclxuICBsZXQgdXJsRG9tYWluID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xyXG5cclxuICBsZXQgcGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgICBjaXR5TmFtZTogJ01vc2NvdycsXHJcbiAgICAgIGxhbmc6ICdlbicsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICB1bml0czogJ21ldHJpYycsXHJcbiAgICAgIHRleHRVbml0VGVtcDogJzAnXHJcbiAgfTtcclxuXHJcbiAgbGV0IGNvbnRyb2xzV2lkZ2V0ID0ge1xyXG4gICAgICBjaXR5TmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aWRnZXQtbWVudV9faGVhZGVyXCIpLFxyXG4gICAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX251bWJlclwiKSxcclxuICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX19tZWFuc1wiKSxcclxuICAgICAgd2luZFNwZWVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9fd2luZFwiKSxcclxuICAgICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9faW1nXCIpLFxyXG4gICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FsZW5kYXJfX2l0ZW1cIiksXHJcbiAgICAgIGdyYXBoaWM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JhcGhpY1wiKVxyXG4gIH07XHJcblxyXG4gIGxldCB1cmxzID0ge1xyXG4gICAgICB1cmxXZWF0aGVyQVBJOiBgJHt1cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXIke3F9JnVuaXRzPSR7cGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3BhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICBwYXJhbXNVcmxGb3JlRGFpbHk6IGAke3VybERvbWFpbn0vZGF0YS8yLjUvZm9yZWNhc3QvZGFpbHkke3F9JnVuaXRzPSR7cGFyYW1zV2lkZ2V0LnVuaXRzfSZjbnQ9OCZhcHBpZD0ke3BhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICB3aW5kU3BlZWQ6IFwiZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvblwiLFxyXG4gICAgICB3aW5kRGlyZWN0aW9uOiBcImRhdGEvd2luZC1kaXJlY3Rpb24tZGF0YS5qc29uXCIsXHJcbiAgICAgIGNsb3VkczogXCJkYXRhL2Nsb3Vkcy1kYXRhLmpzb25cIixcclxuICAgICAgbmF0dXJhbFBoZW5vbWVub246IFwiZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uXCJcclxuICB9XHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSBcIi4vY3VzdG9tLWRhdGVcIjtcclxuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGV7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XHJcbiAgICAgICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAgICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcclxuICAgICAgICB0aGlzLndlYXRoZXIgPSB7XHJcbiAgICAgICAgICAgIFwiZnJvbUFQSVwiOlxyXG4gICAgICAgICAgICB7XCJjb29yZFwiOntcclxuICAgICAgICAgICAgICAgIFwibG9uXCI6XCIwXCIsXHJcbiAgICAgICAgICAgICAgICBcImxhdFwiOlwiMFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjpbe1wiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm1haW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6XCJcIlxyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICBcImJhc2VcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibWFpblwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBcIjogMCxcclxuICAgICAgICAgICAgICAgICAgICBcInByZXNzdXJlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJodW1pZGl0eVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9taW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBfbWF4XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndpbmRcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcGVlZFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVnXCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJhaW5cIjp7fSxcclxuICAgICAgICAgICAgICAgIFwiY2xvdWRzXCI6e1wiYWxsXCI6XCIgXCJ9LFxyXG4gICAgICAgICAgICAgICAgXCJkdFwiOmBgLFxyXG4gICAgICAgICAgICAgICAgXCJzeXNcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VucmlzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3Vuc2V0XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjpcIlVuZGVmaW5lZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2RcIjpcIiBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICovXHJcbiAgICBodHRwR2V0KHVybCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgICAqL1xyXG4gICAgZ2V0V2VhdGhlckZyb21BcGkoKXtcclxuICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ11bXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLndpbmRTcGVlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHJlc3BvbnNlW3RoaXMucGFyYW1zLmxhbmddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgICAqIEBwYXJhbSAge29iamVjdH0gSlNPTlxyXG4gICAgICogQHBhcmFtICB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICovXHJcbiAgICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKXtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqZWN0KXtcclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09IFwib2JqZWN0XCIgJiYgZWxlbWVudE5hbWUyID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LAg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgICAgICAgIGVsc2UgaWYoZWxlbWVudE5hbWUyICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxyXG4gICAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgcGFyc2VEYXRhRnJvbVNlcnZlcigpe1xyXG5cclxuICAgICAgICBsZXQgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICAgICAgaWYod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09IFwiVW5kZWZpbmVkXCIgfHwgd2VhdGhlci5mcm9tQVBJLmNvZCA9PT0gXCI0MDRcIil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBuYXR1cmFsUGhlbm9tZW5vbiA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kU3BlZWQgPSBgYDtcclxuICAgICAgICB2YXIgd2luZERpcmVjdGlvbiA9IGBgO1xyXG4gICAgICAgIHZhciBjbG91ZHMgPSBgYDtcclxuXHJcbiAgICAgICAgLy/QmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgICAgIHZhciBtZXRhZGF0YSA9IHtcclxuICAgICAgICAgICAgY2xvdWRpbmVzczogYCBgLFxyXG4gICAgICAgICAgICBkdCA6IGAgYCxcclxuICAgICAgICAgICAgY2l0eU5hbWUgOiAgYCBgLFxyXG4gICAgICAgICAgICBpY29uIDogYCBgLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZSA6IGAgYCxcclxuICAgICAgICAgICAgcHJlc3N1cmUgOiAgYCBgLFxyXG4gICAgICAgICAgICBodW1pZGl0eSA6IGAgYCxcclxuICAgICAgICAgICAgc3VucmlzZSA6IGAgYCxcclxuICAgICAgICAgICAgc3Vuc2V0IDogYCBgLFxyXG4gICAgICAgICAgICBjb29yZCA6IGAgYCxcclxuICAgICAgICAgICAgd2luZDogYCBgLFxyXG4gICAgICAgICAgICB3ZWF0aGVyOiBgIGBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5jaXR5TmFtZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5uYW1lfSwgJHt3ZWF0aGVyLmZyb21BUEkuc3lzLmNvdW50cnl9YDtcclxuICAgICAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKX1gO1xyXG4gICAgICAgIGlmKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndlYXRoZXIgPSB3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uW3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmlkXTtcclxuICAgICAgICBpZih3ZWF0aGVyW1wid2luZFNwZWVkXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS53aW5kU3BlZWQgPSBgV2luZDogJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpfSAgbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmRTcGVlZFwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wic3BlZWRcIl0udG9GaXhlZCgxKSwgXCJzcGVlZF9pbnRlcnZhbFwiKX1gO1xyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS53aW5kRGlyZWN0aW9uID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXSwgXCJkZWdfaW50ZXJ2YWxcIil9ICggJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl19IClgXHJcbiAgICAgICAgaWYod2VhdGhlcltcImNsb3Vkc1wiXSlcclxuICAgICAgICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcImNsb3Vkc1wiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJjbG91ZHNcIl1bXCJhbGxcIl0sIFwibWluXCIsIFwibWF4XCIpfWA7XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndlYXRoZXJcIl1bMF1bXCJpY29uXCJdfWA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcldpZGdldChtZXRhZGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICByZW5kZXJXaWRnZXQobWV0YWRhdGEpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lW2VsZW1dLmlubmVySFRNTCA9IGA8c3Bhbj5XZWF0aGVyIGZvcjwvc3Bhbj4gJHttZXRhZGF0YS5jaXR5TmFtZX1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZVtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3VwIGNsYXNzPVwid2VhdGhlci1jYXJkX19kZWdyZWVcIj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3N1cD5gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYobWV0YWRhdGEud2VhdGhlci50cmltKCkpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbil7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGlmKG1ldGFkYXRhLndpbmRTcGVlZC50cmltKCkpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KVxyXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhRm9yR3JhcGhpYygpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKXtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcblxyXG4gICAgICAgIGZvcih2YXIgZWxlbSBpbiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0KXtcclxuICAgICAgICAgICAgbGV0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdtaW4nOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgICAgICAgICAgJ21heCc6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXHJcbiAgICAgICAgICAgICAgICAnZGF5JzogKGVsZW0gIT0gMCkgPyBkYXkgOiAnVG9kYXknLFxyXG4gICAgICAgICAgICAgICAgJ2ljb24nOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLndlYXRoZXJbMF0uaWNvbixcclxuICAgICAgICAgICAgICAgICdkYXRlJzogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd0dyYXBoaWNEMyhhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxyXG4gICAgICogQHBhcmFtIGRhdGFcclxuICAgICAqL1xyXG4gICAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XHJcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbil7XHJcbiAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XHJcbiAgICAgICAgdmFyIG1hcEljb25zID0gIG5ldyBNYXAoKTtcclxuICAgICAgICAvLyDQlNC90LXQstC90YvQtVxyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwMmQnLCAnMDJkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwNGQnLCAnMDRkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwN2QnLCAnMDdkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcxMGQnLCAnMTBkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XHJcbiAgICAgICAgLy8g0J3QvtGH0L3Ri9C1XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDVuJywgJzA1ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDhuJywgJzA4ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMTFuJywgJzExZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgICAgaWYobWFwSWNvbnMuZ2V0KG5hbWVJY29uKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGltZy8ke21hcEljb25zLmdldChuYW1lSWNvbil9LnBuZ2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgICAqL1xyXG4gICAgZHJhd0dyYXBoaWNEMyhkYXRhKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XHJcblxyXG4gICAgICAgIC8v0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgaWQ6IFwiI2dyYXBoaWNcIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgICAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICAgICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgY29sb3JQb2xpbHluZTogXCIjMzMzXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgZm9udENvbG9yOiBcIiMzMzNcIixcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IFwiMXB4XCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgbGV0IG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAgICovXHJcbiAgICBkcmF3R3JhcGhpYyhhcnIpe1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aD0gNDY1O1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsMCw2MDAsMzAwKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCJPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHhcIjtcclxuXHJcbiAgICAgICAgdmFyIHN0ZXAgPSA1NTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBzdGVwWSA9IDY0O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHREb3duID0gNzU7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5tYXgqem9vbStzdGVwWSlcclxuICAgICAgICBzdGVwID0gNTU7XHJcbiAgICAgICAgaSA9IDAgO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdGVwICs9NTU7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWVRleHREb3duKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgICB9O1xyXG5cclxufSJdfQ==
