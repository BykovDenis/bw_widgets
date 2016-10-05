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
            var i = 0;
            var rawData = [];

            this.params.data.forEach(function (elem) {
                //rawData.push({x: i, date: this.convertStringDateMMDDYYYHHToDate(elem.date), maxT: elem.max,  minT: elem.min});
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
                maxDate: 0,
                minDate: 10000
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

                svg.append("text").attr("x", elem.x).attr("y", elem.minT + params.offsetY / 2 + 7).attr("text-anchor", "middle").style("font-size", params.fontSize).style("stroke", params.fontColor).style("fill", params.fontColor).text(params.data[item].min + '°');
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
// Модуль диспетчер для отрисовки баннерров на конструкторе
'use strict';

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener("DOMContentLoaded", function () {

    //Формируем параметр фильтра по городу
    var q = '';
    if (window.location.search) q = window.location.search;else q = "?q=London";

    var urlDomain = "http://api.openweathermap.org";

    var paramsWidget = {
        cityName: 'Moscow',
        lang: 'en',
        appid: '2d90837ddbaeda36ab487f257829b667',
        units: 'metric',
        textUnitTemp: '&176;'
    };

    var controlsWidget = {
        cityName: document.querySelectorAll(".widget-dark-menu__header"),
        temperature: document.querySelectorAll(".weather-dark-card__number"),
        naturalPhenomenon: document.querySelectorAll(".weather-dark-card__means"),
        windSpeed: document.querySelectorAll(".weather-dark-card__wind"),
        mainIconWeather: document.querySelectorAll(".weather-dark-card__img"),
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

    var objWidget = new _weatherWidget2.default(paramsWidget, controlsWidget, urls);
    var jsonFromAPI = objWidget.render();
});

},{"./weather-widget":4}],4:[function(require,module,exports){
/**
 * Created by Denis on 29.09.2016.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
                    reject(new Error("\u0412\u0440\u0435\u043C\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 API \u0438\u0441\u0442\u0435\u043A\u043B\u043E " + e.type + " " + e.timeStamp.toFixed(2)));
                };

                xhr.onerror = function (e) {
                    reject(new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 " + e));
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
                            console.log("\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 " + error);
                            _this2.parseDataFromServer();
                        });
                    }, function (error) {
                        console.log("\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 " + error);
                        _this2.parseDataFromServer();
                    });
                }, function (error) {
                    console.log("\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 " + error);
                    _this2.parseDataFromServer();
                });
            }, function (error) {
                console.log("\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 " + error);
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
            metadata.temperature = "" + (weather.fromAPI.main.temp.toFixed(0) > 0 ? "+" + weather.fromAPI.main.temp.toFixed(0) : weather.fromAPI.main.temp.toFixed(0));
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
                    this.controls.temperature[_elem].innerHTML = metadata.temperature + "<span class='weather-card__degree'>" + this.params.textUnitTemp + "</span>";
                }
            }

            for (var _elem2 in this.controls.mainIconWeather) {
                if (this.controls.mainIconWeather.hasOwnProperty(_elem2)) {
                    this.controls.mainIconWeather[_elem2].src = this.getURLMainIcon(metadata.icon, true);
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
                that.controls.calendarItem[index + 10].innerHTML = elem.day + "<img src=\"http://openweathermap.org/img/w/" + elem.icon + ".png\" width=\"32\" height=\"32\" alt=\"" + elem.day + "\">";
                that.controls.calendarItem[index + 20].innerHTML = elem.day + "<img src=\"http://openweathermap.org/img/w/" + elem.icon + ".png\" width=\"32\" height=\"32\" alt=\"" + elem.day + "\">";
            });
            return data;
        }
    }, {
        key: "getURLMainIcon",
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
                    return "img/" + mapIcons.get(nameIcon) + ".png";
                } else {
                    return "http://openweathermap.org/img/w/" + nameIcon + ".png";
                }
            } else {
                return "img/" + nameIcon + ".png";
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

            // отрисовка остальных графиков
            params.id = "#graphic1";
            params.colorPolilyne = "#DDF730";
            objGraphicD3 = new _graphicD3js2.default(params);
            objGraphicD3.render();

            params.id = "#graphic2";
            params.colorPolilyne = "#FEB020";
            objGraphicD3 = new _graphicD3js2.default(params);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvY3VzdG9tLWRhdGUuanMiLCJhc3NldHMvanMvZ3JhcGhpYy1kM2pzLmpzIiwiYXNzZXRzL2pzL3NjcmlwdC5qcyIsImFzc2V0cy9qcy93ZWF0aGVyLXdpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7QUFHQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7SUFDcUIsVTs7O0FBRWpCLDBCQUFhO0FBQUE7O0FBQUE7QUFFWjs7QUFFRDs7Ozs7Ozs7OzRDQUtvQixNLEVBQU87QUFDdkIsZ0JBQUcsU0FBUyxHQUFaLEVBQWlCLE9BQU8sS0FBUDtBQUNqQixnQkFBRyxTQUFTLEVBQVosRUFDSSxjQUFZLE1BQVosQ0FESixLQUVLLElBQUcsU0FBUyxHQUFaLEVBQ0QsYUFBVyxNQUFYO0FBQ0osbUJBQU8sTUFBUDtBQUNIOztBQUVEOzs7Ozs7OzsrQ0FLdUIsSSxFQUFLO0FBQ3hCLGdCQUFJLE1BQU0sSUFBSSxJQUFKLENBQVMsSUFBVCxDQUFWO0FBQ0EsZ0JBQUksUUFBUSxJQUFJLElBQUosQ0FBUyxJQUFJLFdBQUosRUFBVCxFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUFaO0FBQ0EsZ0JBQUksT0FBTyxNQUFNLEtBQWpCO0FBQ0EsZ0JBQUksU0FBUyxPQUFPLEVBQVAsR0FBWSxFQUFaLEdBQWlCLEVBQTlCO0FBQ0EsZ0JBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxPQUFPLE1BQWxCLENBQVY7QUFDQSxtQkFBVSxJQUFJLFdBQUosRUFBVixTQUErQixLQUFLLG1CQUFMLENBQXlCLEdBQXpCLENBQS9CO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytDQUt1QixJLEVBQUs7QUFDeEIsZ0JBQUksS0FBSyxtQkFBVDtBQUNBLGdCQUFJLE9BQU8sR0FBRyxJQUFILENBQVEsSUFBUixDQUFYO0FBQ0EsZ0JBQUksWUFBWSxJQUFJ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SUFBZCxHQUFtQixhQUE1RDtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksR0FBSixFQUFTLEdBQVosR0FBZ0IsSUFBaEIsR0FBcUIsS0FBN0M7QUFDQSxtQkFBTSxJQUFFLElBQUksTUFBWixFQUFtQjtBQUNmLHdCQUFPLEVBQVA7QUFDQSx3QkFBUSxNQUFSLENBQWUsSUFBZixFQUFxQixDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixLQUF4QztBQUNBLHdCQUFRLFVBQVIsQ0FBbUIsSUFBSSxDQUFKLEVBQU8sR0FBUCxHQUFXLEdBQTlCLEVBQW1DLElBQW5DLEVBQXlDLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLGFBQTVEO0FBQ0E7QUFDSDtBQUNELG9CQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksRUFBRSxDQUFOLEVBQVMsR0FBWixHQUFnQixJQUFoQixHQUFxQixLQUE3QztBQUNBLG9CQUFRLFNBQVIsR0FBb0IsTUFBcEI7QUFDQSxvQkFBUSxNQUFSLENBQWUsT0FBSyxFQUFwQixFQUF3QixDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixLQUEzQztBQUNBLG9CQUFRLFNBQVI7O0FBRUEsb0JBQVEsV0FBUixHQUFzQixNQUF0Qjs7QUFFQSxvQkFBUSxNQUFSO0FBQ0Esb0JBQVEsSUFBUjtBQUNIOzs7aUNBRU87QUFDSixpQkFBSyxpQkFBTDtBQUNIOzs7Ozs7a0JBdmFnQixhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21EYXRlIGV4dGVuZHMgRGF0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINC80LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDINCyINGC0YDQtdGF0YDQsNC30YDRj9C00L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60LhcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0gICAgICAgIFvRgtGA0LXRhdC30L3QsNGH0L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDXVxuICAgICAqL1xuICAgIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKXtcbiAgICAgICAgaWYobnVtYmVyID4gMzY1KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKG51bWJlciA8IDEwKVxuICAgICAgICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XG4gICAgICAgIGVsc2UgaWYobnVtYmVyIDwgMTAwKVxuICAgICAgICAgICAgcmV0dXJuIGAwJHtudW1iZXJ9YDtcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L/QvtGA0Y/QtNC60L7QstC+0LPQviDQvdC+0LzQtdGA0LAg0LIg0LPQvtC00YNcbiAgICAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcbiAgICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xuICAgICAqL1xuICAgIGNvbnZlcnREYXRlVG9OdW1iZXJEYXkoZGF0ZSl7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XG4gICAgICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZGF0ZSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XG4gICAgICogQHJldHVybiB7ZGF0ZX0g0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxuICAgICAqL1xuICAgIGNvbnZlcnROdW1iZXJEYXlUb0RhdGUoZGF0ZSl7XG4gICAgICAgIHZhciByZSA9IC8oXFxkezR9KSgtKShcXGR7M30pLztcbiAgICAgICAgdmFyIGxpbmUgPSByZS5leGVjKGRhdGUpO1xuICAgICAgICB2YXIgYmVnaW55ZWFyID0gbmV3IERhdGUobGluZVsxXSk7XG4gICAgICAgIHZhciB1bml4dGltZSA9IGJlZ2lueWVhci5nZXRUaW1lKCkgKyBsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKjI0O1xuICAgICAgICB2YXIgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xuXG4gICAgICAgIHZhciBtb250aCA9IHJlcy5nZXRNb250aCgpICsgMTtcbiAgICAgICAgdmFyIGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xuICAgICAgICB2YXIgeWVhciA9IHJlcy5nZXRGdWxsWWVhcigpO1xuICAgICAgICByZXR1cm4gYCR7ZGF5cyA8IDEwID8gYDAke2RheXN9YDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWA6IG1vbnRofS4ke3llYXJ9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxuICAgICAqIEBwYXJhbSAge2RhdGUxfSBkYXRlINC00LDRgtCwINCyINGE0L7RgNC80LDRgtC1IHl5eXktbW0tZGRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XG4gICAgICovXG4gICAgZm9ybWF0RGF0ZShkYXRlMSl7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS0keyhtb250aDwxMCk/YDAke21vbnRofWA6IG1vbnRofS0keyhkYXk8MTApP2AwJHtkYXl9YDogZGF5fWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgtC10LrRg9GJ0YPRjiDQvtGC0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Rg9GOINC00LDRgtGDIHl5eXktbW0tZGRcbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcbiAgICAgKi9cbiAgICBnZXRDdXJyZW50RGF0ZSgpe1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0RGF0ZShub3cpO1xuICAgIH1cblxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC/0L7RgdC70LXQtNC90LjQtSDRgtGA0Lgg0LzQtdGB0Y/RhtCwXG4gICAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCl7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XG5cbiAgICAgICAgZGF5IC09OTA7XG5cbiAgICAgICAgaWYoZGF5IDwgMCApe1xuICAgICAgICAgICAgeWVhciAtPTE7XG4gICAgICAgICAgICBkYXkgPSAzNjUgLSBkYXk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xuICAgIH1cblxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcbiAgICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpe1xuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xuICAgIH1cblxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcbiAgICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpe1xuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xuICAgIH1cblxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0LvQtdGC0LBcbiAgICBnZXRMYXN0U3VtbWVyRGF0ZSgpe1xuICAgICAgICB2YXIgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS0xO1xuICAgICAgICB2YXIgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcbiAgICAgICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpe1xuICAgICAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfS0wMDFgO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gZGQubW0ueXl5eSBoaDptbV1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIHRpbWVzdGFtcFRvRGF0ZVRpbWUodW5peHRpbWUpe1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xuICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygpLnJlcGxhY2UoLywvLCcnKS5yZXBsYWNlKC86XFx3KyQvLCcnKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICB0aW1lc3RhbXBUb1RpbWUodW5peHRpbWUpe1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xuICAgICAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgICAgIHZhciBtaW51dGVzID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgIHJldHVybiBgJHtob3VyczwxMD9gMCR7aG91cnN9YDpob3Vyc306JHttaW51dGVzPDEwP2AwJHttaW51dGVzfWA6bWludXRlc30gYDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqINCS0L7Qt9GA0LDRidC10L3QuNC1INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0L3QtdC00LXQu9C1INC/0L4gdW5peHRpbWUgdGltZXN0YW1wXG4gICAgICogQHBhcmFtIHVuaXh0aW1lXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHVuaXh0aW1lKXtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcbiAgICAgICAgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7XG4gICAgfVxuXG4gICAgLyoqINCS0LXRgNC90YPRgtGMINC90LDQuNC80LXQvdC+0LLQsNC90LjQtSDQtNC90Y8g0L3QtdC00LXQu9C4XG4gICAgICogQHBhcmFtIGRheU51bWJlclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKGRheU51bWJlcil7XG4gICAgICAgIGxldCBkYXlzID0ge1xuICAgICAgICAgICAgMCA6IFwiU3VuXCIsXG4gICAgICAgICAgICAxIDogXCJNb25cIixcbiAgICAgICAgICAgIDIgOiBcIlR1ZVwiLFxuICAgICAgICAgICAgMyA6IFwiV2VkXCIsXG4gICAgICAgICAgICA0IDogXCJUaHVcIixcbiAgICAgICAgICAgIDUgOiBcIkZyaVwiLFxuICAgICAgICAgICAgNiA6IFwiU2F0XCJcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcbiAgICB9XG5cbiAgICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XG4gICAgICpcbiAgICAgKi9cbiAgICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xuICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSA9PT0gKG5ldyBEYXRlKCkpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xuICAgIH1cblxuICAgIGNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGRhdGUpe1xuICAgICAgICBsZXQgcmUgPS8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcbiAgICAgICAgbGV0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xuICAgICAgICBpZihyZXNEYXRlLmxlbmd0aCA9PSA2KXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKVxuICAgICAgICB9XG4gICAgICAgIC8vINCV0YHQu9C4INC00LDRgtCwINC90LUg0YDQsNGB0L/QsNGA0YHQtdC90LAg0LHQtdGA0LXQvCDRgtC10LrRg9GJ0YPRjlxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgICB9XG59XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBDdXN0b21EYXRlIGZyb20gXCIuL2N1c3RvbS1kYXRlXCI7XG5cbi8qKlxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xuIEBjbGFzcyBHcmFwaGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRle1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICAvKipcbiAgICAgICAgICog0LzQtdGC0L7QtCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0L7RgtGA0LjRgdC+0LLQutC4INC+0YHQvdC+0LLQvdC+0Lkg0LvQuNC90LjQuCDQv9Cw0YDQsNC80LXRgtGA0LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xuICAgICAgICAgKiBbbGluZSBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxuICAgICAgICAgICAgLngoZnVuY3Rpb24oZCl7cmV0dXJuIGQueDt9KVxuICAgICAgICAgICAgLnkoZnVuY3Rpb24oZCl7cmV0dXJuIGQueTt9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10Lwg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQsiDQvNCw0YHRgdC40LIg0LTQu9GPINGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyDQs9GA0LDRhNC40LrQsFxuICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gdGVtcGVyYXR1cmUgW9C/0YDQuNC30L3QsNC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cbiAgICAgKi9cbiAgICBwcmVwYXJlRGF0YSgpe1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGxldCByYXdEYXRhID0gW107XG5cbiAgICAgICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKT0+e1xuICAgICAgICAgICAgLy9yYXdEYXRhLnB1c2goe3g6IGksIGRhdGU6IHRoaXMuY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZWxlbS5kYXRlKSwgbWF4VDogZWxlbS5tYXgsICBtaW5UOiBlbGVtLm1pbn0pO1xuICAgICAgICAgICAgcmF3RGF0YS5wdXNoKHt4OiBpLCBkYXRlOiBpLCBtYXhUOiBlbGVtLm1heCwgIG1pblQ6IGVsZW0ubWlufSk7XG4gICAgICAgICAgICBpICs9MTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByYXdEYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W29iamVjdF19XG4gICAgICovXG4gICAgbWFrZVNWRygpe1xuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRoaXMucGFyYW1zLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5wYXJhbXMuaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZmZmZmZmXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xuICAgICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cbiAgICAgKi9cbiAgICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpe1xuXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIG1heERhdGUgOiAwLFxuICAgICAgICAgICAgbWluRGF0ZSA6IDEwMDAwXG4gICAgICAgIH1cblxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgICAgICBpZihkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSBkYXRhLm1heERhdGUgPSBlbGVtLmRhdGU7XG4gICAgICAgICAgICBpZihkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSBkYXRhLm1pbkRhdGUgPSBlbGVtLmRhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xuICAgICAqIFtnZXRNaW5NYXhEYXRlVGVtcGVyYXR1cmUgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHJhd0RhdGEgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cblxuICAgIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpe1xuXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIG1pbiA6IDEwMCxcbiAgICAgICAgICAgIG1heCA6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0ubWluVClcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ubWluVDtcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0ubWF4VClcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpe1xuXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIG1pbiA6IDAsXG4gICAgICAgICAgICBtYXggOiAwXG4gICAgICAgIH1cblxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLmh1bWlkaXR5KVxuICAgICAgICAgICAgICAgIGRhdGEubWluID0gZWxlbS5odW1pZGl0eTtcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5odW1pZGl0eSlcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxuICAgICAgICAgICAgICAgIGRhdGEubWF4ID0gZWxlbS5yYWluZmFsbEFtb3VudDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxuICAgICAqIFttYWtlQXhlc1hZIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9Cc0LDRgdGB0LjQsiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXG4gICAgICogQHJldHVybiB7W2Z1bmN0aW9uXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgbWFrZUF4ZXNYWShyYXdEYXRhLCBwYXJhbXMpe1xuXG4gICAgICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFg9INGI0LjRgNC40L3QsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQu9C10LLQsCDQuCDRgdC/0YDQsNCy0LBcbiAgICAgICAgbGV0IHhBeGlzTGVuZ3RoID0gcGFyYW1zLndpZHRoIC0gMiAqIHBhcmFtcy5tYXJnaW47XG4gICAgICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFkgPSDQstGL0YHQvtGC0LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LLQtdGA0YXRgyDQuCDRgdC90LjQt9GDXG4gICAgICAgIGxldCB5QXhpc0xlbmd0aCA9IHBhcmFtcy5oZWlnaHQgLSAyICogcGFyYW1zLm1hcmdpbjtcblxuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZUF4ZXNYWVRlbXBlcmF0dXJlKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgcGFyYW1zKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Lgg0KUg0LggWVxuICAgICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxuICAgICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB4QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBYXVxuICAgICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICAgICAgICAgICAgIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxuICAgICAqL1xuICAgIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpe1xuXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XG4gICAgICAgIGxldCB7bWluLCBtYXh9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxuICAgICAgICAgKiBbc2NhbGVUaW1lIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXG4gICAgICAgICAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxuICAgICAgICAgICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcbiAgICAgICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFttYXgrNSwgbWluLTVdKVxuICAgICAgICAgICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xuXG4gICAgICAgIGxldCBkYXRhID0gW107XG4gICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgZGF0YS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxuICAgICAgICAgICAgICAgIG1heFQ6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgbWluVDogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge3NjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgZGF0YTogZGF0YX07XG5cbiAgICB9XG5cbiAgICBzY2FsZUF4ZXNYWVdlYXRoZXIocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBtYXJnaW4pe1xuXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XG4gICAgICAgIGxldCB7bWluLCBtYXh9ID0gdGhpcy5nZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpO1xuXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXG4gICAgICAgIHZhciBzY2FsZVggPSBkMy5zY2FsZVRpbWUoKVxuICAgICAgICAgICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcblxuICAgICAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFttYXgsIG1pbl0pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XG4gICAgICAgIGxldCBkYXRhID0gW107XG5cbiAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICBkYXRhLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgbWFyZ2luLCBodW1pZGl0eTogc2NhbGVZKGVsZW0uaHVtaWRpdHkpICsgbWFyZ2luLCByYWluZmFsbEFtb3VudDogc2NhbGVZKGVsZW0ucmFpbmZhbGxBbW91bnQpICsgbWFyZ2luICAsIGNvbG9yOiBlbGVtLmNvbG9yfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7c2NhbGVYOiBzY2FsZVgsIHNjYWxlWTogc2NhbGVZLCBkYXRhOiBkYXRhfTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxuICAgICAqIFttYWtlUG9seWxpbmUgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gc2NhbGVYLCBzY2FsZVkgW9C+0LHRitC10LrRgtGLINGBINGE0YPQvdC60YbQuNGP0LzQuCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40LggWCxZXVxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBtYWtlUG9seWxpbmUoZGF0YSwgcGFyYW1zLCBzY2FsZVgsIHNjYWxlWSl7XG5cbiAgICAgICAgbGV0IGFyclBvbHlsaW5lID0gW107XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZGF0YS5yZXZlcnNlKCkuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WX0pO1xuICAgICAgICB9KTtcbiAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGRhdGFbZGF0YS5sZW5ndGgtMV1bJ2RhdGUnXSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGRhdGFbZGF0YS5sZW5ndGgtMV1bJ21heFQnXSkgKyBwYXJhbXMub2Zmc2V0WX0pO1xuXG4gICAgICAgIHJldHVybiBhcnJQb2x5bGluZTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L/QvtC70LjQu9C40L3QuNC5INGBINC30LDQu9C40LLQutC+0Lkg0L7RgdC90L7QstC90L7QuSDQuCDQuNC80LjRgtCw0YbQuNGPINC10LUg0YLQtdC90LhcbiAgICAgKiBbZHJhd1BvbHVsaW5lIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIGRyYXdQb2x5bGluZShzdmcsIGRhdGEpe1xuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcblxuICAgICAgICBzdmcuYXBwZW5kKFwiZ1wiKS5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5wYXJhbXMuc3Ryb2tlV2lkdGgpXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XG5cbiAgICB9XG5cbiAgICAgZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgcGFyYW1zKXtcblxuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpPT57XG5cbiAgICAgICAgICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDRgtC10LrRgdGC0LBcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGVsZW0ueClcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZWxlbS5tYXhUIC0gcGFyYW1zLm9mZnNldFgvMi0yKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgcGFyYW1zLmZvbnRTaXplKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcbiAgICAgICAgICAgICAgICAudGV4dChwYXJhbXMuZGF0YVtpdGVtXS5tYXgrJ8KwJyk7XG5cbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGVsZW0ueClcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZWxlbS5taW5UICsgcGFyYW1zLm9mZnNldFkvMis3KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgcGFyYW1zLmZvbnRTaXplKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcbiAgICAgICAgICAgICAgICAudGV4dChwYXJhbXMuZGF0YVtpdGVtXS5taW4rJ8KwJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0LTQuNGB0L/QtdGC0YfQtdGAINC/0YDQvtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGB0L4g0LLRgdC10LzQuCDRjdC70LXQvNC10L3RgtCw0LzQuFxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgc3ZnID0gdGhpcy5tYWtlU1ZHKCk7XG4gICAgICAgIGxldCByYXdEYXRhID0gdGhpcy5wcmVwYXJlRGF0YSgpO1xuXG4gICAgICAgIGxldCB7c2NhbGVYLCBzY2FsZVksIGRhdGF9ID0gIHRoaXMubWFrZUF4ZXNYWShyYXdEYXRhLCB0aGlzLnBhcmFtcyk7XG4gICAgICAgIGxldCBwb2x5bGluZSA9IHRoaXMubWFrZVBvbHlsaW5lKHJhd0RhdGEsIHRoaXMucGFyYW1zLCBzY2FsZVgsIHNjYWxlWSk7XG4gICAgICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xuICAgICAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcbiAgICAgICAgLy90aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcblxuICAgIH1cblxufVxuXG4iLCIvLyDQnNC+0LTRg9C70Ywg0LTQuNGB0L/QtdGC0YfQtdGAINC00LvRjyDQvtGC0YDQuNGB0L7QstC60Lgg0LHQsNC90L3QtdGA0YDQvtCyINC90LAg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1XG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBXZWF0aGVyV2lkZ2V0IGZyb20gJy4vd2VhdGhlci13aWRnZXQnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcblxuICAgIC8v0KTQvtGA0LzQuNGA0YPQtdC8INC/0LDRgNCw0LzQtdGC0YAg0YTQuNC70YzRgtGA0LAg0L/QviDQs9C+0YDQvtC00YNcbiAgICBsZXQgcSA9ICcnO1xuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG4gICAgICAgIHEgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICAgIGVsc2VcbiAgICAgICAgcSA9IFwiP3E9TG9uZG9uXCI7XG5cbiAgICBsZXQgdXJsRG9tYWluID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xuXG4gICAgbGV0IHBhcmFtc1dpZGdldCA9IHtcbiAgICAgICAgY2l0eU5hbWU6ICdNb3Njb3cnLFxuICAgICAgICBsYW5nOiAnZW4nLFxuICAgICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcbiAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxuICAgICAgICB0ZXh0VW5pdFRlbXA6ICcmMTc2OydcbiAgICB9O1xuXG4gICAgbGV0IGNvbnRyb2xzV2lkZ2V0ID0ge1xuICAgICAgICBjaXR5TmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aWRnZXQtZGFyay1tZW51X19oZWFkZXJcIiksXG4gICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItZGFyay1jYXJkX19udW1iZXJcIiksXG4gICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItZGFyay1jYXJkX19tZWFuc1wiKSxcbiAgICAgICAgd2luZFNwZWVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItZGFyay1jYXJkX193aW5kXCIpLFxuICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1kYXJrLWNhcmRfX2ltZ1wiKSxcbiAgICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhbGVuZGFyX19pdGVtXCIpLFxuICAgICAgICBncmFwaGljOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyYXBoaWNcIilcbiAgICB9O1xuXG4gICAgbGV0IHVybHMgPSB7XG4gICAgICAgIHVybFdlYXRoZXJBUEk6IGAke3VybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlciR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXG4gICAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseSR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXG4gICAgICAgIHdpbmRTcGVlZDogXCJkYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uXCIsXG4gICAgICAgIHdpbmREaXJlY3Rpb246IFwiZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25cIixcbiAgICAgICAgY2xvdWRzOiBcImRhdGEvY2xvdWRzLWRhdGEuanNvblwiLFxuICAgICAgICBuYXR1cmFsUGhlbm9tZW5vbjogXCJkYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25cIlxuICAgIH1cblxuICAgIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KHBhcmFtc1dpZGdldCwgY29udHJvbHNXaWRnZXQsIHVybHMpO1xuICAgIHZhciBqc29uRnJvbUFQSSA9IG9ialdpZGdldC5yZW5kZXIoKTtcblxuXG59KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSBcIi4vY3VzdG9tLWRhdGVcIjtcbmltcG9ydCBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYy1kM2pzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGV7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgICAgICAgdGhpcy51cmxzID0gdXJscztcblxuICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxuICAgICAgICB0aGlzLndlYXRoZXIgPSB7XG4gICAgICAgICAgICBcImZyb21BUElcIjpcbiAgICAgICAgICAgIHtcImNvb3JkXCI6e1xuICAgICAgICAgICAgICAgIFwibG9uXCI6XCIwXCIsXG4gICAgICAgICAgICAgICAgXCJsYXRcIjpcIjBcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjpbe1wiaWRcIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtYWluXCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6XCJcIlxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIFwiYmFzZVwiOlwiIFwiLFxuICAgICAgICAgICAgICAgIFwibWFpblwiOntcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wXCI6IDAsXG4gICAgICAgICAgICAgICAgICAgIFwicHJlc3N1cmVcIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJodW1pZGl0eVwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRlbXBfbWluXCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9tYXhcIjpcIiBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ3aW5kXCI6e1xuICAgICAgICAgICAgICAgICAgICBcInNwZWVkXCI6IDAsXG4gICAgICAgICAgICAgICAgICAgIFwiZGVnXCI6XCIgXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwicmFpblwiOnt9LFxuICAgICAgICAgICAgICAgIFwiY2xvdWRzXCI6e1wiYWxsXCI6XCIgXCJ9LFxuICAgICAgICAgICAgICAgIFwiZHRcIjpgYCxcbiAgICAgICAgICAgICAgICBcInN5c1wiOntcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1bnJpc2VcIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5zZXRcIjpcIiBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJpZFwiOlwiIFwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOlwiVW5kZWZpbmVkXCIsXG4gICAgICAgICAgICAgICAgXCJjb2RcIjpcIiBcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcbiAgICAgKiBAcGFyYW0gdXJsXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICovXG4gICAgaHR0cEdldCh1cmwpe1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xuXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xuICAgICAqL1xuICAgIGdldFdlYXRoZXJGcm9tQXBpKCl7XG4gICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcbiAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5uYXR1cmFsUGhlbm9tZW5vbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ11bXCJkZXNjcmlwdGlvblwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy53aW5kU3BlZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci53aW5kU3BlZWQgPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YDQvtC00LjRgtC10LvRjNGB0LrQuNC5INGB0LXQu9C10LrRgtC+0YAg0L/QviDQt9C90LDRh9C10L3QuNGOINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQsiBKU09OXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSBKU09OXG4gICAgICogQHBhcmFtICB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZWxlbWVudE5hbWUg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwLNC00LvRjyDQv9C+0LjRgdC60LAg0YDQvtC00LjRgtC10LvRjNGB0LrQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXG4gICAgICovXG4gICAgZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KG9iamVjdCwgZWxlbWVudCwgZWxlbWVudE5hbWUsIGVsZW1lbnROYW1lMil7XG5cbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqZWN0KXtcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YEg0L7QsdGK0LXQutGC0L7QvCDQuNC3INC00LLRg9GFINGN0LvQtdC80LXQvdGC0L7QsiDQstCy0LjQtNC1INC40L3RgtC10YDQstCw0LvQsFxuICAgICAgICAgICAgaWYodHlwZW9mIG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSA9PT0gXCJvYmplY3RcIiAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgdC+INC30L3QsNGH0LXQvdC40LXQvCDRjdC70LXQvNC10L3RgtCwINGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwINGBINC00LLRg9C80Y8g0Y3Qu9C10LzQtdC90YLQsNC80Lgg0LIgSlNPTlxuICAgICAgICAgICAgZWxzZSBpZihlbGVtZW50TmFtZTIgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiBKU09OINGBINC80LXRgtC10L7QtNCw0L3Ri9C80LhcbiAgICAgKiBAcGFyYW0ganNvbkRhdGFcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBwYXJzZURhdGFGcm9tU2VydmVyKCl7XG5cbiAgICAgICAgbGV0IHdlYXRoZXIgPSB0aGlzLndlYXRoZXI7XG5cbiAgICAgICAgaWYod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09IFwiVW5kZWZpbmVkXCIgfHwgd2VhdGhlci5mcm9tQVBJLmNvZCA9PT0gXCI0MDRcIil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcItCU0LDQvdC90YvQtSDQvtGCINGB0LXRgNCy0LXRgNCwINC90LUg0L/QvtC70YPRh9C10L3Ri1wiKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5hdHVyYWxQaGVub21lbm9uID0gYGA7XG4gICAgICAgIHZhciB3aW5kU3BlZWQgPSBgYDtcbiAgICAgICAgdmFyIHdpbmREaXJlY3Rpb24gPSBgYDtcbiAgICAgICAgdmFyIGNsb3VkcyA9IGBgO1xuXG4gICAgICAgIC8v0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YJcbiAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgY2xvdWRpbmVzczogYCBgLFxuICAgICAgICAgICAgZHQgOiBgIGAsXG4gICAgICAgICAgICBjaXR5TmFtZSA6ICBgIGAsXG4gICAgICAgICAgICBpY29uIDogYCBgLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmUgOiBgIGAsXG4gICAgICAgICAgICBwcmVzc3VyZSA6ICBgIGAsXG4gICAgICAgICAgICBodW1pZGl0eSA6IGAgYCxcbiAgICAgICAgICAgIHN1bnJpc2UgOiBgIGAsXG4gICAgICAgICAgICBzdW5zZXQgOiBgIGAsXG4gICAgICAgICAgICBjb29yZCA6IGAgYCxcbiAgICAgICAgICAgIHdpbmQ6IGAgYCxcbiAgICAgICAgICAgIHdlYXRoZXI6IGAgYFxuICAgICAgICB9O1xuXG4gICAgICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xuICAgICAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSA+IDAgPyBgKyR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWAgOiB3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wLnRvRml4ZWQoMCl9YDtcbiAgICAgICAgaWYod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbilcbiAgICAgICAgICAgIG1ldGFkYXRhLndlYXRoZXIgPSB3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uW3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmlkXTtcbiAgICAgICAgaWYod2VhdGhlcltcIndpbmRTcGVlZFwiXSlcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcInNwZWVkXCJdLnRvRml4ZWQoMSl9ICBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZFNwZWVkXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpLCBcInNwZWVkX2ludGVydmFsXCIpfWA7XG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdKVxuICAgICAgICAgICAgbWV0YWRhdGEud2luZERpcmVjdGlvbiA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl0sIFwiZGVnX2ludGVydmFsXCIpfSAoICR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdfSApYFxuICAgICAgICBpZih3ZWF0aGVyW1wiY2xvdWRzXCJdKVxuICAgICAgICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcImNsb3Vkc1wiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJjbG91ZHNcIl1bXCJhbGxcIl0sIFwibWluXCIsIFwibWF4XCIpfWA7XG5cbiAgICAgICAgbWV0YWRhdGEuaWNvbiA9IGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2VhdGhlclwiXVswXVtcImljb25cIl19YDtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xuXG4gICAgfTtcblxuICAgIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xuXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLmNpdHlOYW1lW2VsZW1dLmlubmVySFRNTCA9IGA8c3Bhbj5XZWF0aGVyIGZvcjwvc3Bhbj4gJHttZXRhZGF0YS5jaXR5TmFtZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IG1ldGFkYXRhLnRlbXBlcmF0dXJlK1wiPHNwYW4gY2xhc3M9J3dlYXRoZXItY2FyZF9fZGVncmVlJz5cIit0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXArXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24sIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZihtZXRhZGF0YS53ZWF0aGVyLnRyaW0oKSlcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbil7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgaWYobWV0YWRhdGEud2luZFNwZWVkLnRyaW0oKSlcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlRGF0YUZvckdyYXBoaWMoKTtcblxuICAgIH1cblxuICAgIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpe1xuICAgICAgICB2YXIgYXJyID0gW107XG5cbiAgICAgICAgZm9yKHZhciBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3Qpe1xuICAgICAgICAgICAgbGV0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XG4gICAgICAgICAgICBhcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgJ21pbic6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXG4gICAgICAgICAgICAgICAgJ21heCc6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXG4gICAgICAgICAgICAgICAgJ2RheSc6IChlbGVtICE9IDApID8gZGF5IDogJ1RvZGF5JyxcbiAgICAgICAgICAgICAgICAnaWNvbic6IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICAgICAgICAgICdkYXRlJzogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdHcmFwaGljRDMoYXJyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XG4gICAgICAgICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmBcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4KzEwXS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxuICAgICAgICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXgrMjBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbiwgY29sb3IgPSBmYWxzZSl7XG4gICAgICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxuICAgICAgICB2YXIgbWFwSWNvbnMgPSAgbmV3IE1hcCgpO1xuXG4gICAgICAgIGlmKCFjb2xvcikge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwM2QnLCAnMDNkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNWQnLCAnMDVkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwOGQnLCAnMDhkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxMWQnLCAnMTFkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XG4gICAgICAgICAgICAvLyDQndC+0YfQvdGL0LVcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDFuJywgJzAxZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDZuJywgJzA2ZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMDluJywgJzA5ZGJ3Jyk7XG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcbiAgICAgICAgICAgIG1hcEljb25zLnNldCgnMTNuJywgJzEzZGJ3Jyk7XG5cbiAgICAgICAgICAgIGlmKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYGltZy8ke21hcEljb25zLmdldChuYW1lSWNvbil9LnBuZ2A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICByZXR1cm4gYGltZy8ke25hbWVJY29ufS5wbmdgO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcbiAgICAgKi9cbiAgICBkcmF3R3JhcGhpY0QzKGRhdGEpe1xuXG4gICAgICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpO1xuXG4gICAgICAgIC8v0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXG4gICAgICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgICAgICBpZDogXCIjZ3JhcGhpY1wiLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIG9mZnNldFg6IDE1LFxuICAgICAgICAgICAgb2Zmc2V0WTogMTAsXG4gICAgICAgICAgICB3aWR0aDogNDIwLFxuICAgICAgICAgICAgaGVpZ2h0OiA3OSxcbiAgICAgICAgICAgIHJhd0RhdGE6IFtdLFxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcbiAgICAgICAgICAgIGNvbG9yUG9saWx5bmU6IFwiIzMzM1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IFwiMTJweFwiLFxuICAgICAgICAgICAgZm9udENvbG9yOiBcIiMzMzNcIixcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBcIjFweFwiXG4gICAgICAgIH1cblxuICAgICAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xuICAgICAgICBsZXQgb2JqR3JhcGhpY0QzID0gIG5ldyBHcmFwaGljKHBhcmFtcyk7XG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcblxuICAgICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0L7RgdGC0LDQu9GM0L3Ri9GFINCz0YDQsNGE0LjQutC+0LJcbiAgICAgICAgcGFyYW1zLmlkID0gXCIjZ3JhcGhpYzFcIjtcbiAgICAgICAgcGFyYW1zLmNvbG9yUG9saWx5bmUgPSBcIiNEREY3MzBcIjtcbiAgICAgICAgb2JqR3JhcGhpY0QzID0gIG5ldyBHcmFwaGljKHBhcmFtcyk7XG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcblxuICAgICAgICBwYXJhbXMuaWQgPSBcIiNncmFwaGljMlwiO1xuICAgICAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9IFwiI0ZFQjAyMFwiO1xuICAgICAgICBvYmpHcmFwaGljRDMgPSAgbmV3IEdyYXBoaWMocGFyYW1zKTtcbiAgICAgICAgb2JqR3JhcGhpY0QzLnJlbmRlcigpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDQs9GA0LDRhNC40LrQsCDQv9C+0LPQvtC00Ysg0L3QsCDQvdC10LTQtdC70Y5cbiAgICAgKi9cbiAgICBkcmF3R3JhcGhpYyhhcnIpe1xuXG4gICAgICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGFycik7XG5cbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5jb250cm9scy5ncmFwaGljLndpZHRoPSA0NjU7XG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcblxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiI2ZmZlwiO1xuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsMCw2MDAsMzAwKTtcblxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIk9zd2FsZC1NZWRpdW0sIEFyaWFsLCBzYW5zLXNlcmkgMTRweFwiO1xuXG4gICAgICAgIHZhciBzdGVwID0gNTU7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIHpvb20gPSA0O1xuICAgICAgICB2YXIgc3RlcFkgPSA2NDtcbiAgICAgICAgdmFyIHN0ZXBZVGV4dFVwID0gNTg7XG4gICAgICAgIHZhciBzdGVwWVRleHREb3duID0gNzU7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1heCp6b29tK3N0ZXBZKTtcbiAgICAgICAgd2hpbGUoaTxhcnIubGVuZ3RoKXtcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWSk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1heCsnwronLCBzdGVwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFlUZXh0VXApO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFyclstLWldLm1heCp6b29tK3N0ZXBZKVxuICAgICAgICBzdGVwID0gNTU7XG4gICAgICAgIGkgPSAwIDtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RlcC0xMCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZKTtcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLTEwLCAtMSphcnJbaSsrXS5taW4qem9vbStzdGVwWSk7XG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XG4gICAgICAgICAgICBzdGVwICs9NTU7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFyclstLWldLm1pbip6b29tK3N0ZXBZKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMzMzXCI7XG5cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCl7XG4gICAgICAgIHRoaXMuZ2V0V2VhdGhlckZyb21BcGkoKTtcbiAgICB9O1xuXG59XG4iXX0=
