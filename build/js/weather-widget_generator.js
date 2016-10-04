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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxnZW5lcmF0b3JcXGN1c3RvbS1kYXRlLmpzIiwiYXNzZXRzXFxqc1xcZ2VuZXJhdG9yXFxncmFwaGljLWQzanMuanMiLCJhc3NldHNcXGpzXFxnZW5lcmF0b3JcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXGdlbmVyYXRvclxcd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FBR0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCLFU7OztBQUVqQiwwQkFBYTtBQUFBOztBQUFBO0FBRVo7O0FBRUQ7Ozs7Ozs7Ozs0Q0FLb0IsTSxFQUFPO0FBQ3ZCLGdCQUFHLFNBQVMsR0FBWixFQUFpQixPQUFPLEtBQVA7QUFDakIsZ0JBQUcsU0FBUyxFQUFaLEVBQ0ksY0FBWSxNQUFaLENBREosS0FFSyxJQUFHLFNBQVMsR0FBWixFQUNELGFBQVcsTUFBWDtBQUNKLG1CQUFPLE1BQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxNQUFNLElBQUksSUFBSixDQUFTLElBQVQsQ0FBVjtBQUNBLGdCQUFJLFFBQVEsSUFBSSxJQUFKLENBQVMsSUFBSSxXQUFKLEVBQVQsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBWjtBQUNBLGdCQUFJLE9BQU8sTUFBTSxLQUFqQjtBQUNBLGdCQUFJLFNBQVMsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUE5QjtBQUNBLGdCQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsT0FBTyxNQUFsQixDQUFWO0FBQ0EsbUJBQVUsSUFBSSxXQUFKLEVBQVYsU0FBK0IsS0FBSyxtQkFBTCxDQUF5QixHQUF6QixDQUEvQjtBQUNIOztBQUVEOzs7Ozs7OzsrQ0FLdUIsSSxFQUFLO0FBQ3hCLGdCQUFJLEtBQUssbUJBQVQ7QUFDQSxnQkFBSSxPQUFPLEdBQUcsSUFBSCxDQUFRLElB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O0FBQ0Esb0JBQVEsU0FBUixHQUFvQixNQUFwQjtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEtBQTNDO0FBQ0Esb0JBQVEsU0FBUjs7QUFFQSxvQkFBUSxXQUFSLEdBQXNCLE1BQXRCOztBQUVBLG9CQUFRLE1BQVI7QUFDQSxvQkFBUSxJQUFSO0FBQ0g7OztpQ0FFTztBQUNKLGlCQUFLLGlCQUFMO0FBQ0g7Ozs7OztrQkFsWmdCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAgICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgICAgKi9cclxuICAgIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKXtcclxuICAgICAgICBpZihudW1iZXIgPiAzNjUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihudW1iZXIgPCAxMClcclxuICAgICAgICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgZWxzZSBpZihudW1iZXIgPCAxMDApXHJcbiAgICAgICAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQsiDQs9C+0LTRg1xyXG4gICAgICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xyXG4gICAgICovXHJcbiAgICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICB2YXIgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgICAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAgICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAgICAqL1xyXG4gICAgY29udmVydE51bWJlckRheVRvRGF0ZShkYXRlKXtcclxuICAgICAgICB2YXIgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICAgICAgdmFyIGxpbmUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIHZhciBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgICAgICB2YXIgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgbGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICoyNDtcclxuICAgICAgICB2YXIgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xyXG5cclxuICAgICAgICB2YXIgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgdmFyIGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gcmVzLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICogQHBhcmFtICB7ZGF0ZTF9IGRhdGUg0LTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgeXl5eS1tbS1kZFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICovXHJcbiAgICBmb3JtYXREYXRlKGRhdGUxKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoPDEwKT9gMCR7bW9udGh9YDogbW9udGh9LSR7KGRheTwxMCk/YDAke2RheX1gOiBkYXl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudERhdGUoKXtcclxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRlKG5vdyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICAgIGdldERhdGVMYXN0VGhyZWVNb250aCgpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgICAgIHZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG5cclxuICAgICAgICBkYXkgLT05MDtcclxuXHJcbiAgICAgICAgaWYoZGF5IDwgMCApe1xyXG4gICAgICAgICAgICB5ZWFyIC09MTtcclxuICAgICAgICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRMYXN0U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLTE7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0RGF0ZUN1clllYXIoKXtcclxuICAgICAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfS0wMDFgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sJycpLnJlcGxhY2UoLzpcXHcrJC8sJycpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICByZXR1cm4gYCR7aG91cnM8MTA/YDAke2hvdXJzfWA6aG91cnN9OiR7bWludXRlczwxMD9gMCR7bWludXRlc31gOm1pbnV0ZXN9IGA7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAgICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpe1xyXG4gICAgICAgIGxldCBkYXlzID0ge1xyXG4gICAgICAgICAgICAwIDogXCJTdW5cIixcclxuICAgICAgICAgICAgMSA6IFwiTW9uXCIsXHJcbiAgICAgICAgICAgIDIgOiBcIlR1ZVwiLFxyXG4gICAgICAgICAgICAzIDogXCJXZWRcIixcclxuICAgICAgICAgICAgNCA6IFwiVGh1XCIsXHJcbiAgICAgICAgICAgIDUgOiBcIkZyaVwiLFxyXG4gICAgICAgICAgICA2IDogXCJTYXRcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZGF0ZSl7XHJcbiAgICAgICAgbGV0IHJlID0vKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XHJcbiAgICAgICAgbGV0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIGlmKHJlc0RhdGUubGVuZ3RoID09IDYpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YClcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0L3QtSDRgNCw0YHQv9Cw0YDRgdC10L3QsCDQsdC10YDQtdC8INGC0LXQutGD0YnRg9GOXHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xyXG5cclxuLyoqXHJcbiDQk9GA0LDRhNC40Log0YLQtdC80L/QtdGA0LDRgtGD0YDRiyDQuCDQv9C+0LPQvtC00YtcclxuIEBjbGFzcyBHcmFwaGljXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljIGV4dGVuZHMgQ3VzdG9tRGF0ZXtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC00LvRjyDRgNCw0YHRh9C10YLQsCDQvtGC0YDQuNGB0L7QstC60Lgg0L7RgdC90L7QstC90L7QuSDQu9C40L3QuNC4INC/0LDRgNCw0LzQtdGC0YDQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24gPSBkMy5saW5lKClcclxuICAgICAgICAgICAgLngoZnVuY3Rpb24oZCl7cmV0dXJuIGQueDt9KVxyXG4gICAgICAgICAgICAueShmdW5jdGlvbihkKXtyZXR1cm4gZC55O30pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10Lwg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQsiDQvNCw0YHRgdC40LIg0LTQu9GPINGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyDQs9GA0LDRhNC40LrQsFxyXG4gICAgICogQHBhcmFtICB7W2Jvb2xlYW5dfSB0ZW1wZXJhdHVyZSBb0L/RgNC40LfQvdCw0Log0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgICAgKi9cclxuICAgIHByZXBhcmVEYXRhKCl7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCByYXdEYXRhID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSk9PntcclxuICAgICAgICAgICAgcmF3RGF0YS5wdXNoKHt4OiBpLCBkYXRlOiB0aGlzLmNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGVsZW0uZGF0ZSksIG1heFQ6IGVsZW0ubWF4LCAgbWluVDogZWxlbS5taW59KTtcclxuICAgICAgICAgICAgaSArPTE7IC8vINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQvtGB0LggWFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF3RGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgICBtYWtlU1ZHKCl7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLnBhcmFtcy5pZCkuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy5wYXJhbXMud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiNmZmZmZmZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC80LjQvdC40LzQsNC70LvRjNC90L7Qs9C+INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L/QviDQv9Cw0YDQsNC80LXRgtGA0YMg0LTQsNGC0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19IGRhdGEgW9C+0LHRitC10LrRgiDRgSDQvNC40L3QuNC80LDQu9GM0L3Ri9C8INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQvCDQt9C90LDRh9C10L3QuNC10LxdXHJcbiAgICAgKi9cclxuICAgIGdldE1pbk1heERhdGUocmF3RGF0YSl7XHJcblxyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBtYXhEYXRlIDogbmV3IERhdGUoJzE5MDAtMDEtMDEgMDA6MDA6MDAnKSxcclxuICAgICAgICAgICAgbWluRGF0ZSA6IG5ldyBEYXRlKCcyNTAwLTAxLTAxIDAwOjAwOjAwJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSBkYXRhLm1pbkRhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQsNGCINC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlVGVtcGVyYXR1cmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuXHJcbiAgICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKXtcclxuXHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG1pbiA6IDEwMCxcclxuICAgICAgICAgICAgbWF4IDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLm1pblQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ubWluVDtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5tYXhUKVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLm1heFQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBbZ2V0TWluTWF4V2VhdGhlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpe1xyXG5cclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgbWluIDogMCxcclxuICAgICAgICAgICAgbWF4IDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLmh1bWlkaXR5KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLmh1bWlkaXR5KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICAgICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgbWFrZUF4ZXNYWShyYXdEYXRhLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICAgICAgbGV0IHhBeGlzTGVuZ3RoID0gcGFyYW1zLndpZHRoIC0gMiAqIHBhcmFtcy5tYXJnaW47XHJcbiAgICAgICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcclxuICAgICAgICBsZXQgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gMiAqIHBhcmFtcy5tYXJnaW47XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXHJcbiAgICAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXHJcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKi9cclxuICAgIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICBsZXQge21heERhdGUsIG1pbkRhdGV9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgICAgIGxldCB7bWluLCBtYXh9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgICAgICAqIFtzY2FsZVRpbWUgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAgICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oW21heCs1LCBtaW4tNV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuICAgICAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBkYXRhLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgbWluVDogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4ge3NjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgZGF0YTogZGF0YX07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbil7XHJcblxyXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxyXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG4gICAgICAgIGxldCBkYXRhID0gW107XHJcblxyXG4gICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sIHJhaW5mYWxsQW1vdW50OiBzY2FsZVkoZWxlbS5yYWluZmFsbEFtb3VudCkgKyBtYXJnaW4gICwgY29sb3I6IGVsZW0uY29sb3J9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtzY2FsZVg6IHNjYWxlWCwgc2NhbGVZOiBzY2FsZVksIGRhdGE6IGRhdGF9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxyXG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKXtcclxuXHJcbiAgICAgICAgbGV0IGFyclBvbHlsaW5lID0gW107XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFl9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFl9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aC0xXVsnZGF0ZSddKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aC0xXVsnbWF4VCddKSArIHBhcmFtcy5vZmZzZXRZfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgZHJhd1BvbHlsaW5lKHN2ZywgZGF0YSl7XHJcbiAgICAgICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC4INGA0LjRgdGD0LXQvCDQu9C40L3QuNC4XHJcblxyXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJnXCIpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMucGFyYW1zLnN0cm9rZVdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpPT57XHJcblxyXG4gICAgICAgICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGVsZW0ubWF4VCAtIHBhcmFtcy5vZmZzZXRYLzItMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC50ZXh0KHBhcmFtcy5kYXRhW2l0ZW1dLm1heCsnwrAnKTtcclxuXHJcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGVsZW0ubWluVCArIHBhcmFtcy5vZmZzZXRZLzIrMTApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAudGV4dChwYXJhbXMuZGF0YVtpdGVtXS5taW4rJ8KwJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBzdmcgPSB0aGlzLm1ha2VTVkcoKTtcclxuICAgICAgICBsZXQgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICAgICAgbGV0IHtzY2FsZVgsIHNjYWxlWSwgZGF0YX0gPSAgdGhpcy5tYWtlQXhlc1hZKHJhd0RhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICBsZXQgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xyXG4gICAgICAgIHRoaXMuZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgICAgIC8vdGhpcy5kcmF3TWFya2VycyhzdmcsIHBvbHlsaW5lLCB0aGlzLm1hcmdpbik7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgV2VhdGhlcldpZGdldCBmcm9tICcuL3dlYXRoZXItd2lkZ2V0JztcclxuXHJcbi8vINCT0LXQvdC10YDQsNGG0LjRjyDQsdC+0LvRjNGI0L7Qs9C+INCy0LjQtNC20LXRgtCwXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpe1xyXG5cclxuICBjb25zdCBnZW5lcmF0b3JET00gPSBmdW5jdGlvbihzaXplID0gXCJmdWxsXCIpe1xyXG5cclxuICAgIHZhciBodG1sID0gYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiY3NzL3N0eWxlLmNzc1wiPmA7XHJcbiAgICBodG1sICs9IGA8c2NyaXB0IHNyYz1cImpzL2xpYnMvZDMubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgIGlmKHNpemUgPT09IFwiZnVsbFwiKXtcclxuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cIndpZGdldC1tZW51IHdpZGdldC1tZW51X19sYXlvdXRcIj48aDEgY2xhc3M9XCJ3aWRnZXQtbWVudV9faGVhZGVyXCI+V2VhdGhlciBmb3IgTW9zY293PC9oMT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwid2lkZ2V0LW1lbnVfX2xpbmtzXCI+PHNwYW4+TW9yZSBhdDwvc3Bhbj48YSBocmVmPVwiLy9vcGVud2VhdGhlcm1hcC5vcmcvXCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJ3aWRnZXQtbWVudV9fbGlua1wiPlxyXG4gICAgICAgIE9wZW5XZWF0aGVyTWFwPC9hPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3aWRnZXRfX2JvZHlcIj48ZGl2IGNsYXNzPVwid2VhdGhlci1jYXJkXCI+PGRpdiBjbGFzcz1cIndlYXRoZXItY2FyZF9fcm93MVwiPlxyXG4gICAgICAgIDxpbWcgc3JjPVwiaW1nLzEwZGJ3LnBuZ1wiIHdpZHRoPVwiMTI4XCIgaGVpZ2h0PVwiMTI4XCIgYWx0PVwiV2VhdGhlciBmb3IgTW9zY293XCIgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX2ltZ1wiLz5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwid2VhdGhlci1jYXJkX19jb2xcIj48cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fbnVtYmVyXCI+MDxzdXAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX2RlZ3JlZVwiPjAgPC9zdXA+PC9wPlxyXG4gICAgICAgIDxzcGFuPmFuZCByaXNpbmc8L3NwYW4+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cIndlYXRoZXItY2FyZF9fcm93MlwiPjxwIGNsYXNzPVwid2VhdGhlci1jYXJkX19tZWFuc1wiPi08L3A+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX3dpbmRcIj5XaW5kOjwvcD48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid2lkZ2V0X19jYWxlbmRhclwiPjx1bCBjbGFzcz1cImNhbGVuZGFyXCI+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5Ub2RheTxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiVG9kYXlcIi8+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPlNhdCA8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIlNhdFwiLz48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImNhbGVuZGFyX19pdGVtXCI+U3VuPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJTdW5cIi8+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPk1vbiA8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIk1vblwiLz48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImNhbGVuZGFyX19pdGVtXCI+VHVlPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJUdWVcIi8+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPldlZDxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiV2VkXCIvPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5UaHU8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIlRodVwiLz48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzcz1cImNhbGVuZGFyX19pdGVtXCI+RnJpPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJGcmlcIi8+PC9saT48L3VsPlxyXG4gICAgICAgIDxkaXYgaWQ9XCJncmFwaGljXCIgY2xhc3M9XCJ3aWRnZXRfX2dyYXBoaWNcIj48L2Rpdj48L2Rpdj48L2Rpdj5gO1xyXG4gICAgICBodG1sICs9YDxzY3JpcHQgc3JjPVwianMvd2VhdGhlci13aWRnZXQuanNcIj48L3NjcmlwdD48c2NyaXB0PmNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KHBhcmFtc1dpZGdldCwgY29udHJvbHNXaWRnZXQsIHVybHMpO1xyXG4gICAgICAgIGlmKGdlbmVyYXRvckRPTSgpKSB2YXIganNvbkZyb21BUEkgPSBvYmpXaWRnZXQucmVuZGVyKCk7PC9zY3JpcHQ+YDtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpZGdldFwiKS5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgcmV0dXJuIGh0bWw7XHJcblxyXG4gIH07XHJcblxyXG4gIC8v0KTQvtGA0LzQuNGA0YPQtdC8INC/0LDRgNCw0LzQtdGC0YAg0YTQuNC70YzRgtGA0LAg0L/QviDQs9C+0YDQvtC00YNcclxuICBsZXQgcSA9ICcnO1xyXG4gIGlmKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXHJcbiAgICAgIHEgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gIGVsc2VcclxuICAgICAgcSA9IFwiP3E9TG9uZG9uXCI7XHJcblxyXG4gIGxldCB1cmxEb21haW4gPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnXCI7XHJcblxyXG4gIGxldCBwYXJhbXNXaWRnZXQgPSB7XHJcbiAgICAgIGNpdHlOYW1lOiAnTW9zY293JyxcclxuICAgICAgbGFuZzogJ2VuJyxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIHVuaXRzOiAnbWV0cmljJyxcclxuICAgICAgdGV4dFVuaXRUZW1wOiAnMCdcclxuICB9O1xyXG5cclxuICBsZXQgY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpZGdldC1tZW51X19oZWFkZXJcIiksXHJcbiAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9fbnVtYmVyXCIpLFxyXG4gICAgICBuYXR1cmFsUGhlbm9tZW5vbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX21lYW5zXCIpLFxyXG4gICAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX193aW5kXCIpLFxyXG4gICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX19pbWdcIiksXHJcbiAgICAgIGNhbGVuZGFySXRlbTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYWxlbmRhcl9faXRlbVwiKSxcclxuICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaGljXCIpXHJcbiAgfTtcclxuXHJcbiAgbGV0IHVybHMgPSB7XHJcbiAgICAgIHVybFdlYXRoZXJBUEk6IGAke3VybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlciR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseSR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgIHdpbmRTcGVlZDogXCJkYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uXCIsXHJcbiAgICAgIHdpbmREaXJlY3Rpb246IFwiZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25cIixcclxuICAgICAgY2xvdWRzOiBcImRhdGEvY2xvdWRzLWRhdGEuanNvblwiLFxyXG4gICAgICBuYXR1cmFsUGhlbm9tZW5vbjogXCJkYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25cIlxyXG4gIH1cclxuXHJcbn0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xyXG5pbXBvcnQgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMtZDNqcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWF0aGVyV2lkZ2V0IGV4dGVuZHMgQ3VzdG9tRGF0ZXtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcclxuICAgICAgICB0aGlzLnVybHMgPSB1cmxzO1xyXG5cclxuICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgICAgIHRoaXMud2VhdGhlciA9IHtcclxuICAgICAgICAgICAgXCJmcm9tQVBJXCI6XHJcbiAgICAgICAgICAgIHtcImNvb3JkXCI6e1xyXG4gICAgICAgICAgICAgICAgXCJsb25cIjpcIjBcIixcclxuICAgICAgICAgICAgICAgIFwibGF0XCI6XCIwXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwid2VhdGhlclwiOlt7XCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWFpblwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjpcIlwiXHJcbiAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgIFwiYmFzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgXCJtYWluXCI6e1xyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJlc3N1cmVcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImh1bWlkaXR5XCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wX21pblwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9tYXhcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwid2luZFwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInNwZWVkXCI6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZWdcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmFpblwiOnt9LFxyXG4gICAgICAgICAgICAgICAgXCJjbG91ZHNcIjp7XCJhbGxcIjpcIiBcIn0sXHJcbiAgICAgICAgICAgICAgICBcImR0XCI6YGAsXHJcbiAgICAgICAgICAgICAgICBcInN5c1wiOntcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5yaXNlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5zZXRcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOlwiVW5kZWZpbmVkXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvZFwiOlwiIFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAgICogQHBhcmFtIHVybFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgKi9cclxuICAgIGh0dHBHZXQodXJsKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xyXG4gICAgICovXHJcbiAgICBnZXRXZWF0aGVyRnJvbUFwaSgpe1xyXG4gICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLm5hdHVyYWxQaGVub21lbm9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMud2luZFNwZWVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDRgdC10LvQtdC60YLQvtGAINC/0L4g0LfQvdCw0YfQtdC90LjRjiDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LIgSlNPTlxyXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSBKU09OXHJcbiAgICAgKiBAcGFyYW0gIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XHJcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGVsZW1lbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsCzQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICAgKi9cclxuICAgIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpe1xyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmplY3Qpe1xyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcclxuICAgICAgICAgICAgaWYodHlwZW9mIG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSA9PT0gXCJvYmplY3RcIiAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YHQviDQt9C90LDRh9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQsCDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCDRgSDQtNCy0YPQvNGPINGN0LvQtdC80LXQvdGC0LDQvNC4INCyIEpTT05cclxuICAgICAgICAgICAgZWxzZSBpZihlbGVtZW50TmFtZTIgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWUyXSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICAgKiBAcGFyYW0ganNvbkRhdGFcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBwYXJzZURhdGFGcm9tU2VydmVyKCl7XHJcblxyXG4gICAgICAgIGxldCB3ZWF0aGVyID0gdGhpcy53ZWF0aGVyO1xyXG5cclxuICAgICAgICBpZih3ZWF0aGVyLmZyb21BUEkubmFtZSA9PT0gXCJVbmRlZmluZWRcIiB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSBcIjQwNFwiKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLQlNCw0L3QvdGL0LUg0L7RgiDRgdC10YDQstC10YDQsCDQvdC1INC/0L7Qu9GD0YfQtdC90YtcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5hdHVyYWxQaGVub21lbm9uID0gYGA7XHJcbiAgICAgICAgdmFyIHdpbmRTcGVlZCA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kRGlyZWN0aW9uID0gYGA7XHJcbiAgICAgICAgdmFyIGNsb3VkcyA9IGBgO1xyXG5cclxuICAgICAgICAvL9CY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXHJcbiAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICBjbG91ZGluZXNzOiBgIGAsXHJcbiAgICAgICAgICAgIGR0IDogYCBgLFxyXG4gICAgICAgICAgICBjaXR5TmFtZSA6ICBgIGAsXHJcbiAgICAgICAgICAgIGljb24gOiBgIGAsXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlIDogYCBgLFxyXG4gICAgICAgICAgICBwcmVzc3VyZSA6ICBgIGAsXHJcbiAgICAgICAgICAgIGh1bWlkaXR5IDogYCBgLFxyXG4gICAgICAgICAgICBzdW5yaXNlIDogYCBgLFxyXG4gICAgICAgICAgICBzdW5zZXQgOiBgIGAsXHJcbiAgICAgICAgICAgIGNvb3JkIDogYCBgLFxyXG4gICAgICAgICAgICB3aW5kOiBgIGAsXHJcbiAgICAgICAgICAgIHdlYXRoZXI6IGAgYFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWA7XHJcbiAgICAgICAgaWYod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kU3BlZWRcIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcInNwZWVkXCJdLnRvRml4ZWQoMSl9ICBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZFNwZWVkXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpLCBcInNwZWVkX2ludGVydmFsXCIpfWA7XHJcbiAgICAgICAgaWYod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX0gKCAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXX0gKWBcclxuICAgICAgICBpZih3ZWF0aGVyW1wiY2xvdWRzXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS5jbG91ZHMgPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wiY2xvdWRzXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcImNsb3Vkc1wiXVtcImFsbFwiXSwgXCJtaW5cIiwgXCJtYXhcIil9YDtcclxuXHJcbiAgICAgICAgbWV0YWRhdGEuaWNvbiA9IGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2VhdGhlclwiXVswXVtcImljb25cIl19YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gYDxzcGFuPldlYXRoZXIgZm9yPC9zcGFuPiAke21ldGFkYXRhLmNpdHlOYW1lfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzdXAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX2RlZ3JlZVwiPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3VwPmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYobWV0YWRhdGEud2VhdGhlci50cmltKCkpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbil7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGlmKG1ldGFkYXRhLndpbmRTcGVlZC50cmltKCkpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KVxyXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhRm9yR3JhcGhpYygpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKXtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcblxyXG4gICAgICAgIGZvcih2YXIgZWxlbSBpbiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0KXtcclxuICAgICAgICAgICAgbGV0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdtaW4nOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgICAgICAgICAgJ21heCc6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXHJcbiAgICAgICAgICAgICAgICAnZGF5JzogKGVsZW0gIT0gMCkgPyBkYXkgOiAnVG9kYXknLFxyXG4gICAgICAgICAgICAgICAgJ2ljb24nOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLndlYXRoZXJbMF0uaWNvbixcclxuICAgICAgICAgICAgICAgICdkYXRlJzogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd0dyYXBoaWNEMyhhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxyXG4gICAgICogQHBhcmFtIGRhdGFcclxuICAgICAqL1xyXG4gICAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XHJcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbil7XHJcbiAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XHJcbiAgICAgICAgdmFyIG1hcEljb25zID0gIG5ldyBNYXAoKTtcclxuICAgICAgICAvLyDQlNC90LXQstC90YvQtVxyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwMmQnLCAnMDJkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwNGQnLCAnMDRkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwN2QnLCAnMDdkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcxMGQnLCAnMTBkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XHJcbiAgICAgICAgLy8g0J3QvtGH0L3Ri9C1XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDVuJywgJzA1ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDhuJywgJzA4ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMTFuJywgJzExZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgICAgaWYobWFwSWNvbnMuZ2V0KG5hbWVJY29uKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGltZy8ke21hcEljb25zLmdldChuYW1lSWNvbil9LnBuZ2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgICAqL1xyXG4gICAgZHJhd0dyYXBoaWNEMyhkYXRhKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XHJcblxyXG4gICAgICAgIC8v0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgaWQ6IFwiI2dyYXBoaWNcIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgICAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICAgICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgY29sb3JQb2xpbHluZTogXCIjMzMzXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgZm9udENvbG9yOiBcIiMzMzNcIixcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IFwiMXB4XCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgbGV0IG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAgICovXHJcbiAgICBkcmF3R3JhcGhpYyhhcnIpe1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aD0gNDY1O1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsMCw2MDAsMzAwKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCJPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHhcIjtcclxuXHJcbiAgICAgICAgdmFyIHN0ZXAgPSA1NTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBzdGVwWSA9IDY0O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHREb3duID0gNzU7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5tYXgqem9vbStzdGVwWSlcclxuICAgICAgICBzdGVwID0gNTU7XHJcbiAgICAgICAgaSA9IDAgO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdGVwICs9NTU7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWVRleHREb3duKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgICB9O1xyXG5cclxufSJdfQ==
