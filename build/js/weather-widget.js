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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQUdBOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQUNxQixVOzs7QUFFakIsMEJBQWE7QUFBQTs7QUFBQTtBQUVaOztBQUVEOzs7Ozs7Ozs7NENBS29CLE0sRUFBTztBQUN2QixnQkFBRyxTQUFTLEdBQVosRUFBaUIsT0FBTyxLQUFQO0FBQ2pCLGdCQUFHLFNBQVMsRUFBWixFQUNJLGNBQVksTUFBWixDQURKLEtBRUssSUFBRyxTQUFTLEdBQVosRUFDRCxhQUFXLE1BQVg7QUFDSixtQkFBTyxNQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytDQUt1QixJLEVBQUs7QUFDeEIsZ0JBQUksTUFBTSxJQUFJLElBQUosQ0FBUyxJQUFULENBQVY7QUFDQSxnQkFBSSxRQUFRLElBQUksSUFBSixDQUFTLElBQUksV0FBSixFQUFULEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQVo7QUFDQSxnQkFBSSxPQUFPLE1BQU0sS0FBakI7QUFDQSxnQkFBSSxTQUFTLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBOUI7QUFDQSxnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLE9BQU8sTUFBbEIsQ0FBVjtBQUNBLG1CQUFVLElBQUksV0FBSixFQUFWLFNBQStCLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxLQUFLLG1CQUFUO0FBQ0EsZ0JBQUksT0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLENBQVg7QUFDQSxnQkFBSSxZQUFZLElBQUksSUFBSixDQUFTLEtBQUss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R0FBc0IsTUFBdEI7O0FBRUEsb0JBQVEsTUFBUjtBQUNBLG9CQUFRLElBQVI7QUFDSDs7O2lDQUVPO0FBQ0osaUJBQUssaUJBQUw7QUFDSDs7Ozs7O2tCQWxaZ0IsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8g0KDQsNCx0L7RgtCwINGBINC00LDRgtC+0LlcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRGF0ZSBleHRlbmRzIERhdGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINC80LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDINCyINGC0YDQtdGF0YDQsNC30YDRj9C00L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60LhcclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbnVtYmVyIFvRh9C40YHQu9C+INC80LXQvdC10LUgOTk5XVxyXG4gICAgICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cclxuICAgICAqL1xyXG4gICAgbnVtYmVyRGF5c09mWWVhclhYWChudW1iZXIpe1xyXG4gICAgICAgIGlmKG51bWJlciA+IDM2NSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKG51bWJlciA8IDEwKVxyXG4gICAgICAgICAgICByZXR1cm4gYDAwJHtudW1iZXJ9YDtcclxuICAgICAgICBlbHNlIGlmKG51bWJlciA8IDEwMClcclxuICAgICAgICAgICAgcmV0dXJuIGAwJHtudW1iZXJ9YDtcclxuICAgICAgICByZXR1cm4gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXHJcbiAgICAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAgICAqIEByZXR1cm4ge2ludGVnZXJ9ICDQn9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINCyINCz0L7QtNGDXHJcbiAgICAgKi9cclxuICAgIGNvbnZlcnREYXRlVG9OdW1iZXJEYXkoZGF0ZSl7XHJcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgICAgIHZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQv9GA0LXQvtC+0LHRgNCw0LfRg9C10YIg0LTQsNGC0YMg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPiDQsiB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGUg0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICogQHJldHVybiB7ZGF0ZX0g0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICAgICovXHJcbiAgICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpe1xyXG4gICAgICAgIHZhciByZSA9IC8oXFxkezR9KSgtKShcXGR7M30pLztcclxuICAgICAgICB2YXIgbGluZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICAgICAgdmFyIGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xyXG4gICAgICAgIHZhciB1bml4dGltZSA9IGJlZ2lueWVhci5nZXRUaW1lKCkgKyBsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKjI0O1xyXG4gICAgICAgIHZhciByZXMgPSBuZXcgRGF0ZSh1bml4dGltZSk7XHJcblxyXG4gICAgICAgIHZhciBtb250aCA9IHJlcy5nZXRNb250aCgpICsgMTtcclxuICAgICAgICB2YXIgZGF5cyA9IHJlcy5nZXREYXRlKCk7XHJcbiAgICAgICAgdmFyIHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICByZXR1cm4gYCR7ZGF5cyA8IDEwID8gYDAke2RheXN9YDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWA6IG1vbnRofS4ke3llYXJ9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQtNCw0YLRiyDQstC40LTQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgICAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgICAgKi9cclxuICAgIGZvcm1hdERhdGUoZGF0ZTEpe1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHsobW9udGg8MTApP2AwJHttb250aH1gOiBtb250aH0tJHsoZGF5PDEwKT9gMCR7ZGF5fWA6IGRheX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgtC10LrRg9GJ0YPRjiDQvtGC0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Rg9GOINC00LDRgtGDIHl5eXktbW0tZGRcclxuICAgICAqIEByZXR1cm4ge1tzdHJpbmddfSDRgtC10LrRg9GJ0LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50RGF0ZSgpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQv9C+0YHQu9C10LTQvdC40LUg0YLRgNC4INC80LXRgdGP0YbQsFxyXG4gICAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCl7XHJcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgICAgIHZhciBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICAgICAgdmFyIG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcblxyXG4gICAgICAgIGRheSAtPTkwO1xyXG5cclxuICAgICAgICBpZihkYXkgPCAwICl7XHJcbiAgICAgICAgICAgIHllYXIgLT0xO1xyXG4gICAgICAgICAgICBkYXkgPSAzNjUgLSBkYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICAgIGdldEN1cnJlbnRTdW1tZXJEYXRlKCl7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICAgIGdldEN1cnJlbnRTcHJpbmdEYXRlKCl7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDUtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICAgIGdldExhc3RTdW1tZXJEYXRlKCl7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCktMTtcclxuICAgICAgICB2YXIgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICAgICAgdmFyIGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XHJcbiAgICAgICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpe1xyXG4gICAgICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9LTAwMWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHRpbWVzdGFtcFRvRGF0ZVRpbWUodW5peHRpbWUpe1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodW5peHRpbWUqMTAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoKS5yZXBsYWNlKC8sLywnJykucmVwbGFjZSgvOlxcdyskLywnJyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBoaDptbV1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgICAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgICAgIHJldHVybiBgJHtob3VyczwxMD9gMCR7aG91cnN9YDpob3Vyc306JHttaW51dGVzPDEwP2AwJHttaW51dGVzfWA6bWludXRlc30gYDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxyXG4gICAgICogQHBhcmFtIHVuaXh0aW1lXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlLmdldERheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxyXG4gICAgICogQHBhcmFtIGRheU51bWJlclxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKGRheU51bWJlcil7XHJcbiAgICAgICAgbGV0IGRheXMgPSB7XHJcbiAgICAgICAgICAgIDAgOiBcIlN1blwiLFxyXG4gICAgICAgICAgICAxIDogXCJNb25cIixcclxuICAgICAgICAgICAgMiA6IFwiVHVlXCIsXHJcbiAgICAgICAgICAgIDMgOiBcIldlZFwiLFxyXG4gICAgICAgICAgICA0IDogXCJUaHVcIixcclxuICAgICAgICAgICAgNSA6IFwiRnJpXCIsXHJcbiAgICAgICAgICAgIDYgOiBcIlNhdFwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGF5c1tkYXlOdW1iZXJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDQodGA0LDQstC90LXQvdC40LUg0LTQsNGC0Ysg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eSA9IGRkLm1tLnl5eXkg0YEg0YLQtdC60YPRidC40Lwg0LTQvdC10LxcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNvbXBhcmVEYXRlc1dpdGhUb2RheShkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgPT09IChuZXcgRGF0ZSgpKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKXtcclxuICAgICAgICBsZXQgcmUgPS8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcclxuICAgICAgICBsZXQgcmVzRGF0ZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICAgICAgaWYocmVzRGF0ZS5sZW5ndGggPT0gNil7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDQldGB0LvQuCDQtNCw0YLQsCDQvdC1INGA0LDRgdC/0LDRgNGB0LXQvdCwINCx0LXRgNC10Lwg0YLQtdC60YPRidGD0Y5cclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBDdXN0b21EYXRlIGZyb20gXCIuL2N1c3RvbS1kYXRlXCI7XHJcblxyXG4vKipcclxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xyXG4gQGNsYXNzIEdyYXBoaWNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRle1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICAgICAgKiBbbGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxyXG4gICAgICAgICAgICAueChmdW5jdGlvbihkKXtyZXR1cm4gZC54O30pXHJcbiAgICAgICAgICAgIC55KGZ1bmN0aW9uKGQpe3JldHVybiBkLnk7fSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINCyINC80LDRgdGB0LjQsiDQtNC70Y8g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPINCz0YDQsNGE0LjQutCwXHJcbiAgICAgKiBAcGFyYW0gIHtbYm9vbGVhbl19IHRlbXBlcmF0dXJlIFvQv9GA0LjQt9C90LDQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAgICAqL1xyXG4gICAgcHJlcGFyZURhdGEoKXtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IHJhd0RhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKT0+e1xyXG4gICAgICAgICAgICByYXdEYXRhLnB1c2goe3g6IGksIGRhdGU6IHRoaXMuY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZWxlbS5kYXRlKSwgbWF4VDogZWxlbS5tYXgsICBtaW5UOiBlbGVtLm1pbn0pO1xyXG4gICAgICAgICAgICBpICs9MTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByYXdEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10Lwg0LjQt9C+0LHRgNCw0LbQtdC90LjQtSDRgSDQutC+0L3RgtC10LrRgdGC0L7QvCDQvtCx0YrQtdC60YLQsCBzdmdcclxuICAgICAqIFttYWtlU1ZHIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19XHJcbiAgICAgKi9cclxuICAgIG1ha2VTVkcoKXtcclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXNcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLnBhcmFtcy53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5wYXJhbXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2ZmZmZmZlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xyXG4gICAgICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cclxuICAgICAqL1xyXG4gICAgZ2V0TWluTWF4RGF0ZShyYXdEYXRhKXtcclxuXHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG1heERhdGUgOiBuZXcgRGF0ZSgnMTkwMC0wMS0wMSAwMDowMDowMCcpLFxyXG4gICAgICAgICAgICBtaW5EYXRlIDogbmV3IERhdGUoJzI1MDAtMDEtMDEgMDA6MDA6MDAnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSBkYXRhLm1heERhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluRGF0ZSA+PSBlbGVtLmRhdGUpIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG5cclxuICAgIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpe1xyXG5cclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgbWluIDogMTAwLFxyXG4gICAgICAgICAgICBtYXggOiAwXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0ubWluVClcclxuICAgICAgICAgICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLm1heFQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSl7XHJcblxyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBtaW4gOiAwLFxyXG4gICAgICAgICAgICBtYXggOiAwXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0uaHVtaWRpdHkpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC00LvQuNC90YMg0L7RgdC10LkgWCxZXHJcbiAgICAgKiBbbWFrZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9Cc0LDRgdGB0LjQsiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1tmdW5jdGlvbl19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcyl7XHJcblxyXG4gICAgICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFg9INGI0LjRgNC40L3QsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQu9C10LLQsCDQuCDRgdC/0YDQsNCy0LBcclxuICAgICAgICBsZXQgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAyICogcGFyYW1zLm1hcmdpbjtcclxuICAgICAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBZID0g0LLRi9GB0L7RgtCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YMg0Lgg0YHQvdC40LfRg1xyXG4gICAgICAgIGxldCB5QXhpc0xlbmd0aCA9IHBhcmFtcy5oZWlnaHQgLSAyICogcGFyYW1zLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcclxuICAgICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cclxuICAgICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqL1xyXG4gICAgc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyl7XHJcblxyXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICAgICAgICogW3NjYWxlVGltZSBkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICAgICAgKiBbc2NhbGVMaW5lYXIgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbWF4KzUsIG1pbi01XSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICAgICAgICAgIG1heFQ6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgICAgICAgICBtaW5UOiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRYfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7c2NhbGVYOiBzY2FsZVgsIHNjYWxlWTogc2NhbGVZLCBkYXRhOiBkYXRhfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVBeGVzWFlXZWF0aGVyKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgbWFyZ2luKXtcclxuXHJcbiAgICAgICAgbGV0IHttYXhEYXRlLCBtaW5EYXRlfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgICAgICBsZXQge21pbiwgbWF4fSA9IHRoaXMuZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgICAgICB2YXIgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgICAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbWF4LCBtaW5dKVxyXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgICAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIG1hcmdpbiwgaHVtaWRpdHk6IHNjYWxlWShlbGVtLmh1bWlkaXR5KSArIG1hcmdpbiwgcmFpbmZhbGxBbW91bnQ6IHNjYWxlWShlbGVtLnJhaW5mYWxsQW1vdW50KSArIG1hcmdpbiAgLCBjb2xvcjogZWxlbS5jb2xvcn0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4ge3NjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgZGF0YTogZGF0YX07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XHJcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgbWFrZVBvbHlsaW5lKGRhdGEsIHBhcmFtcywgc2NhbGVYLCBzY2FsZVkpe1xyXG5cclxuICAgICAgICBsZXQgYXJyUG9seWxpbmUgPSBbXTtcclxuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRhdGEucmV2ZXJzZSgpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChkYXRhW2RhdGEubGVuZ3RoLTFdWydkYXRlJ10pICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShkYXRhW2RhdGEubGVuZ3RoLTFdWydtYXhUJ10pICsgcGFyYW1zLm9mZnNldFl9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFyclBvbHlsaW5lO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC/0L7Qu9C40LvQuNC90LjQuSDRgSDQt9Cw0LvQuNCy0LrQvtC5INC+0YHQvdC+0LLQvdC+0Lkg0Lgg0LjQvNC40YLQsNGG0LjRjyDQtdC1INGC0LXQvdC4XHJcbiAgICAgKiBbZHJhd1BvbHVsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBzdmcgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBkcmF3UG9seWxpbmUoc3ZnLCBkYXRhKXtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcclxuXHJcbiAgICAgICAgc3ZnLmFwcGVuZChcImdcIikuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5wYXJhbXMuc3Ryb2tlV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgIGRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHBhcmFtcyl7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSk9PntcclxuXHJcbiAgICAgICAgICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDRgtC10LrRgdGC0LBcclxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBlbGVtLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZWxlbS5tYXhUIC0gcGFyYW1zLm9mZnNldFgvMi0yKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnRleHQocGFyYW1zLmRhdGFbaXRlbV0ubWF4KyfCsCcpO1xyXG5cclxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBlbGVtLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZWxlbS5taW5UICsgcGFyYW1zLm9mZnNldFkvMisxMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC50ZXh0KHBhcmFtcy5kYXRhW2l0ZW1dLm1pbisnwrAnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LTQuNGB0L/QtdGC0YfQtdGAINC/0YDQvtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGB0L4g0LLRgdC10LzQuCDRjdC70LXQvNC10L3RgtCw0LzQuFxyXG4gICAgICogW3JlbmRlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xyXG4gICAgICAgIGxldCByYXdEYXRhID0gdGhpcy5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgICAgICBsZXQge3NjYWxlWCwgc2NhbGVZLCBkYXRhfSA9ICB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgICAgIGxldCBwb2x5bGluZSA9IHRoaXMubWFrZVBvbHlsaW5lKHJhd0RhdGEsIHRoaXMucGFyYW1zLCBzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgICAgdGhpcy5kcmF3UG9seWxpbmUoc3ZnLCBwb2x5bGluZSk7XHJcbiAgICAgICAgdGhpcy5kcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgLy90aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgV2VhdGhlcldpZGdldCBmcm9tICcuL3dlYXRoZXItd2lkZ2V0JztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8v0KTQvtGA0LzQuNGA0YPQtdC8INC/0LDRgNCw0LzQtdGC0YAg0YTQuNC70YzRgtGA0LAg0L/QviDQs9C+0YDQvtC00YNcclxuICAgIGxldCBxID0gJyc7XHJcbiAgICBpZih3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxyXG4gICAgICAgIHEgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHEgPSBcIj9xPUxvbmRvblwiO1xyXG5cclxuICAgIGxldCB1cmxEb21haW4gPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnXCI7XHJcblxyXG4gICAgbGV0IHBhcmFtc1dpZGdldCA9IHtcclxuICAgICAgICBjaXR5TmFtZTogJ01vc2NvdycsXHJcbiAgICAgICAgbGFuZzogJ2VuJyxcclxuICAgICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgICB1bml0czogJ21ldHJpYycsXHJcbiAgICAgICAgdGV4dFVuaXRUZW1wOiAnMCdcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGNvbnRyb2xzV2lkZ2V0ID0ge1xyXG4gICAgICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpZGdldC1tZW51X19oZWFkZXJcIiksXHJcbiAgICAgICAgdGVtcGVyYXR1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX19udW1iZXJcIiksXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX19tZWFuc1wiKSxcclxuICAgICAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX193aW5kXCIpLFxyXG4gICAgICAgIG1haW5JY29uV2VhdGhlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX2ltZ1wiKSxcclxuICAgICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FsZW5kYXJfX2l0ZW1cIiksXHJcbiAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaGljXCIpXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB1cmxzID0ge1xyXG4gICAgICAgIHVybFdlYXRoZXJBUEk6IGAke3VybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlciR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt1cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5JHtxfSZ1bml0cz0ke3BhcmFtc1dpZGdldC51bml0c30mY250PTgmYXBwaWQ9JHtwYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IFwiZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvblwiLFxyXG4gICAgICAgIHdpbmREaXJlY3Rpb246IFwiZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25cIixcclxuICAgICAgICBjbG91ZHM6IFwiZGF0YS9jbG91ZHMtZGF0YS5qc29uXCIsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IFwiZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uXCJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChwYXJhbXNXaWRnZXQsIGNvbnRyb2xzV2lkZ2V0LCB1cmxzKTtcclxuICAgIHZhciBqc29uRnJvbUFQSSA9IG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOS4wOS4yMDE2LlxyXG4gKi9cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xyXG5pbXBvcnQgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMtZDNqcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWF0aGVyV2lkZ2V0IGV4dGVuZHMgQ3VzdG9tRGF0ZXtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMsIGNvbnRyb2xzLCB1cmxzKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcclxuICAgICAgICB0aGlzLnVybHMgPSB1cmxzO1xyXG5cclxuICAgICAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgICAgIHRoaXMud2VhdGhlciA9IHtcclxuICAgICAgICAgICAgXCJmcm9tQVBJXCI6XHJcbiAgICAgICAgICAgIHtcImNvb3JkXCI6e1xyXG4gICAgICAgICAgICAgICAgXCJsb25cIjpcIjBcIixcclxuICAgICAgICAgICAgICAgIFwibGF0XCI6XCIwXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwid2VhdGhlclwiOlt7XCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWFpblwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjpcIlwiXHJcbiAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgIFwiYmFzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgXCJtYWluXCI6e1xyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHJlc3N1cmVcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImh1bWlkaXR5XCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wX21pblwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9tYXhcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwid2luZFwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInNwZWVkXCI6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkZWdcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwicmFpblwiOnt9LFxyXG4gICAgICAgICAgICAgICAgXCJjbG91ZHNcIjp7XCJhbGxcIjpcIiBcIn0sXHJcbiAgICAgICAgICAgICAgICBcImR0XCI6YGAsXHJcbiAgICAgICAgICAgICAgICBcInN5c1wiOntcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5yaXNlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdW5zZXRcIjpcIiBcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibmFtZVwiOlwiVW5kZWZpbmVkXCIsXHJcbiAgICAgICAgICAgICAgICBcImNvZFwiOlwiIFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAgICogQHBhcmFtIHVybFxyXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgKi9cclxuICAgIGh0dHBHZXQodXJsKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLnN0YXR1c1RleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmNvZGUgPSB0aGlzLnN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQntGI0LjQsdC60LAg0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDICR7ZX1gKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKG51bGwpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0L/RgNC+0YEg0LogQVBJINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LTQsNC90L3Ri9GFINGC0LXQutGD0YnQtdC5INC/0L7Qs9C+0LTRi1xyXG4gICAgICovXHJcbiAgICBnZXRXZWF0aGVyRnJvbUFwaSgpe1xyXG4gICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZyb21BUEkgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLm5hdHVyYWxQaGVub21lbm9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXVtcImRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMud2luZFNwZWVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIud2luZFNwZWVkID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5wYXJhbXNVcmxGb3JlRGFpbHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGA0L7QtNC40YLQtdC70YzRgdC60LjQuSDRgdC10LvQtdC60YLQvtGAINC/0L4g0LfQvdCw0YfQtdC90LjRjiDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LIgSlNPTlxyXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSBKU09OXHJcbiAgICAgKiBAcGFyYW0gIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XHJcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGVsZW1lbnROYW1lINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsCzQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC40YHQutC+0LzQvtCz0L4g0YHQtdC70LXQutGC0L7RgNCwXHJcbiAgICAgKi9cclxuICAgIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpe1xyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmplY3Qpe1xyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcclxuICAgICAgICAgICAgaWYodHlwZW9mIG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSA9PT0gXCJvYmplY3RcIiAmJiBlbGVtZW50TmFtZTIgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YHQviDQt9C90LDRh9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQsCDRjdC70LXQvNC10L3RgtCw0YDQvdC+0LPQviDRgtC40L/QsCDRgSDQtNCy0YPQvNGPINGN0LvQtdC80LXQvdGC0LDQvNC4INCyIEpTT05cclxuICAgICAgICAgICAgZWxzZSBpZihlbGVtZW50TmFtZTIgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWUyXSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIgSlNPTiDRgSDQvNC10YLQtdC+0LTQsNC90YvQvNC4XHJcbiAgICAgKiBAcGFyYW0ganNvbkRhdGFcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBwYXJzZURhdGFGcm9tU2VydmVyKCl7XHJcblxyXG4gICAgICAgIGxldCB3ZWF0aGVyID0gdGhpcy53ZWF0aGVyO1xyXG5cclxuICAgICAgICBpZih3ZWF0aGVyLmZyb21BUEkubmFtZSA9PT0gXCJVbmRlZmluZWRcIiB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSBcIjQwNFwiKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLQlNCw0L3QvdGL0LUg0L7RgiDRgdC10YDQstC10YDQsCDQvdC1INC/0L7Qu9GD0YfQtdC90YtcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5hdHVyYWxQaGVub21lbm9uID0gYGA7XHJcbiAgICAgICAgdmFyIHdpbmRTcGVlZCA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kRGlyZWN0aW9uID0gYGA7XHJcbiAgICAgICAgdmFyIGNsb3VkcyA9IGBgO1xyXG5cclxuICAgICAgICAvL9CY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXHJcbiAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICBjbG91ZGluZXNzOiBgIGAsXHJcbiAgICAgICAgICAgIGR0IDogYCBgLFxyXG4gICAgICAgICAgICBjaXR5TmFtZSA6ICBgIGAsXHJcbiAgICAgICAgICAgIGljb24gOiBgIGAsXHJcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlIDogYCBgLFxyXG4gICAgICAgICAgICBwcmVzc3VyZSA6ICBgIGAsXHJcbiAgICAgICAgICAgIGh1bWlkaXR5IDogYCBgLFxyXG4gICAgICAgICAgICBzdW5yaXNlIDogYCBgLFxyXG4gICAgICAgICAgICBzdW5zZXQgOiBgIGAsXHJcbiAgICAgICAgICAgIGNvb3JkIDogYCBgLFxyXG4gICAgICAgICAgICB3aW5kOiBgIGAsXHJcbiAgICAgICAgICAgIHdlYXRoZXI6IGAgYFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmNpdHlOYW1lID0gYCR7d2VhdGhlci5mcm9tQVBJLm5hbWV9LCAke3dlYXRoZXIuZnJvbUFQSS5zeXMuY291bnRyeX1gO1xyXG4gICAgICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWA7XHJcbiAgICAgICAgaWYod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgbWV0YWRhdGEud2VhdGhlciA9IHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub25bd2VhdGhlci5mcm9tQVBJLndlYXRoZXJbMF0uaWRdO1xyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kU3BlZWRcIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmRTcGVlZCA9IGBXaW5kOiAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcInNwZWVkXCJdLnRvRml4ZWQoMSl9ICBtL3MgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZFNwZWVkXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpLCBcInNwZWVkX2ludGVydmFsXCIpfWA7XHJcbiAgICAgICAgaWYod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX0gKCAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXX0gKWBcclxuICAgICAgICBpZih3ZWF0aGVyW1wiY2xvdWRzXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS5jbG91ZHMgPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wiY2xvdWRzXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcImNsb3Vkc1wiXVtcImFsbFwiXSwgXCJtaW5cIiwgXCJtYXhcIil9YDtcclxuXHJcbiAgICAgICAgbWV0YWRhdGEuaWNvbiA9IGAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2VhdGhlclwiXVswXVtcImljb25cIl19YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJlbmRlcldpZGdldChtZXRhZGF0YSkge1xyXG5cclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gYDxzcGFuPldlYXRoZXIgZm9yPC9zcGFuPiAke21ldGFkYXRhLmNpdHlOYW1lfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzdXAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX2RlZ3JlZVwiPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3VwPmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYobWV0YWRhdGEud2VhdGhlci50cmltKCkpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbil7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGlmKG1ldGFkYXRhLndpbmRTcGVlZC50cmltKCkpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy53aW5kU3BlZWRbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2luZFNwZWVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KVxyXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhRm9yR3JhcGhpYygpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKXtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcblxyXG4gICAgICAgIGZvcih2YXIgZWxlbSBpbiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0KXtcclxuICAgICAgICAgICAgbGV0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XHJcbiAgICAgICAgICAgIGFyci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdtaW4nOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgICAgICAgICAgJ21heCc6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXHJcbiAgICAgICAgICAgICAgICAnZGF5JzogKGVsZW0gIT0gMCkgPyBkYXkgOiAnVG9kYXknLFxyXG4gICAgICAgICAgICAgICAgJ2ljb24nOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLndlYXRoZXJbMF0uaWNvbixcclxuICAgICAgICAgICAgICAgICdkYXRlJzogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHJhd0dyYXBoaWNEMyhhcnIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC90LDQt9Cy0LDQvdC40Y8g0LTQvdC10Lkg0L3QtdC00LXQu9C4INC4INC40LrQvtC90L7QuiDRgSDQv9C+0LPQvtC00L7QuVxyXG4gICAgICogQHBhcmFtIGRhdGFcclxuICAgICAqL1xyXG4gICAgcmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XHJcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRVUkxNYWluSWNvbihuYW1lSWNvbil7XHJcbiAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XHJcbiAgICAgICAgdmFyIG1hcEljb25zID0gIG5ldyBNYXAoKTtcclxuICAgICAgICAvLyDQlNC90LXQstC90YvQtVxyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwMmQnLCAnMDJkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwNGQnLCAnMDRkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwN2QnLCAnMDdkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcxMGQnLCAnMTBkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XHJcbiAgICAgICAgLy8g0J3QvtGH0L3Ri9C1XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDVuJywgJzA1ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMDhuJywgJzA4ZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xyXG4gICAgICAgIG1hcEljb25zLnNldCgnMTFuJywgJzExZGJ3Jyk7XHJcbiAgICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgICAgaWYobWFwSWNvbnMuZ2V0KG5hbWVJY29uKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYGltZy8ke21hcEljb25zLmdldChuYW1lSWNvbil9LnBuZ2A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgICAqL1xyXG4gICAgZHJhd0dyYXBoaWNEMyhkYXRhKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XHJcblxyXG4gICAgICAgIC8v0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgaWQ6IFwiI2dyYXBoaWNcIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgICAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICAgICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgY29sb3JQb2xpbHluZTogXCIjMzMzXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgZm9udENvbG9yOiBcIiMzMzNcIixcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IFwiMXB4XCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgbGV0IG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAgICovXHJcbiAgICBkcmF3R3JhcGhpYyhhcnIpe1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aD0gNDY1O1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsMCw2MDAsMzAwKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCJPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHhcIjtcclxuXHJcbiAgICAgICAgdmFyIHN0ZXAgPSA1NTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBzdGVwWSA9IDY0O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHREb3duID0gNzU7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5tYXgqem9vbStzdGVwWSlcclxuICAgICAgICBzdGVwID0gNTU7XHJcbiAgICAgICAgaSA9IDAgO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdGVwICs9NTU7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWVRleHREb3duKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgICB9O1xyXG5cclxufSJdfQ==
