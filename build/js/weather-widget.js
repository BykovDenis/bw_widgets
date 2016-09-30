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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQUdBOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQUNxQixVOzs7QUFFakIsMEJBQWE7QUFBQTs7QUFBQTtBQUVaOztBQUVEOzs7Ozs7Ozs7NENBS29CLE0sRUFBTztBQUN2QixnQkFBRyxTQUFTLEdBQVosRUFBaUIsT0FBTyxLQUFQO0FBQ2pCLGdCQUFHLFNBQVMsRUFBWixFQUNJLGNBQVksTUFBWixDQURKLEtBRUssSUFBRyxTQUFTLEdBQVosRUFDRCxhQUFXLE1BQVg7QUFDSixtQkFBTyxNQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytDQUt1QixJLEVBQUs7QUFDeEIsZ0JBQUksTUFBTSxJQUFJLElBQUosQ0FBUyxJQUFULENBQVY7QUFDQSxnQkFBSSxRQUFRLElBQUksSUFBSixDQUFTLElBQUksV0FBSixFQUFULEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQVo7QUFDQSxnQkFBSSxPQUFPLE1BQU0sS0FBakI7QUFDQSxnQkFBSSxTQUFTLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBOUI7QUFDQSxnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLE9BQU8sTUFBbEIsQ0FBVjtBQUNBLG1CQUFVLElBQUksV0FBSixFQUFWLFNBQStCLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxLQUFLLG1CQUFUO0FBQ0EsZ0JBQUksT0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLENBQVg7QUFDQSxnQkFBSSxZQUFZLElBQUksSUFBSixDQUFTLEtBQUss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RUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxHQUFKLEVBQVMsR0FBWixHQUFnQixJQUFoQixHQUFxQixLQUE3QztBQUNBLG1CQUFNLElBQUUsSUFBSSxNQUFaLEVBQW1CO0FBQ2Ysd0JBQU8sRUFBUDtBQUNBLHdCQUFRLE1BQVIsQ0FBZSxJQUFmLEVBQXFCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEtBQXhDO0FBQ0Esd0JBQVEsVUFBUixDQUFtQixJQUFJLENBQUosRUFBTyxHQUFQLEdBQVcsR0FBOUIsRUFBbUMsSUFBbkMsRUFBeUMsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsYUFBNUQ7QUFDQTtBQUNIO0FBQ0Qsb0JBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxFQUFFLENBQU4sRUFBUyxHQUFaLEdBQWdCLElBQWhCLEdBQXFCLEtBQTdDO0FBQ0Esb0JBQVEsU0FBUixHQUFvQixNQUFwQjtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEtBQTNDO0FBQ0Esb0JBQVEsU0FBUjs7QUFFQSxvQkFBUSxXQUFSLEdBQXNCLE1BQXRCOztBQUVBLG9CQUFRLE1BQVI7QUFDQSxvQkFBUSxJQUFSO0FBQ0g7OztpQ0FFTztBQUNKLGlCQUFLLGlCQUFMO0FBQ0g7Ozs7OztrQkF6V2dCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAgICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgICAgKi9cclxuICAgIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKXtcclxuICAgICAgICBpZihudW1iZXIgPiAzNjUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihudW1iZXIgPCAxMClcclxuICAgICAgICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgZWxzZSBpZihudW1iZXIgPCAxMDApXHJcbiAgICAgICAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQsiDQs9C+0LTRg1xyXG4gICAgICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xyXG4gICAgICovXHJcbiAgICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICB2YXIgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgICAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAgICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAgICAqL1xyXG4gICAgY29udmVydE51bWJlckRheVRvRGF0ZShkYXRlKXtcclxuICAgICAgICB2YXIgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICAgICAgdmFyIGxpbmUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIHZhciBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgICAgICB2YXIgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgbGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICoyNDtcclxuICAgICAgICB2YXIgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xyXG5cclxuICAgICAgICB2YXIgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgdmFyIGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gcmVzLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICogQHBhcmFtICB7ZGF0ZTF9IGRhdGUg0LTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgeXl5eS1tbS1kZFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICovXHJcbiAgICBmb3JtYXREYXRlKGRhdGUxKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoPDEwKT9gMCR7bW9udGh9YDogbW9udGh9LSR7KGRheTwxMCk/YDAke2RheX1gOiBkYXl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudERhdGUoKXtcclxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRlKG5vdyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICAgIGdldERhdGVMYXN0VGhyZWVNb250aCgpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgICAgIHZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG5cclxuICAgICAgICBkYXkgLT05MDtcclxuXHJcbiAgICAgICAgaWYoZGF5IDwgMCApe1xyXG4gICAgICAgICAgICB5ZWFyIC09MTtcclxuICAgICAgICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRMYXN0U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLTE7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0RGF0ZUN1clllYXIoKXtcclxuICAgICAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfS0wMDFgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sJycpLnJlcGxhY2UoLzpcXHcrJC8sJycpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICByZXR1cm4gYCR7aG91cnM8MTA/YDAke2hvdXJzfWA6aG91cnN9OiR7bWludXRlczwxMD9gMCR7bWludXRlc31gOm1pbnV0ZXN9IGA7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAgICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpe1xyXG4gICAgICAgIGxldCBkYXlzID0ge1xyXG4gICAgICAgICAgICAwIDogXCJTdW5cIixcclxuICAgICAgICAgICAgMSA6IFwiTW9uXCIsXHJcbiAgICAgICAgICAgIDIgOiBcIlR1ZVwiLFxyXG4gICAgICAgICAgICAzIDogXCJXZWRcIixcclxuICAgICAgICAgICAgNCA6IFwiVGh1XCIsXHJcbiAgICAgICAgICAgIDUgOiBcIkZyaVwiLFxyXG4gICAgICAgICAgICA2IDogXCJTYXRcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZGF0ZSl7XHJcbiAgICAgICAgbGV0IHJlID0vKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XHJcbiAgICAgICAgbGV0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIGlmKHJlc0RhdGUubGVuZ3RoID09IDYpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YClcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0L3QtSDRgNCw0YHQv9Cw0YDRgdC10L3QsCDQsdC10YDQtdC8INGC0LXQutGD0YnRg9GOXHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xyXG5cclxuLyoqXHJcbiDQk9GA0LDRhNC40Log0YLQtdC80L/QtdGA0LDRgtGD0YDRiyDQuCDQv9C+0LPQvtC00YtcclxuIEBjbGFzcyBHcmFwaGljXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljIGV4dGVuZHMgQ3VzdG9tRGF0ZXtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC00LvRjyDRgNCw0YHRh9C10YLQsCDQvtGC0YDQuNGB0L7QstC60Lgg0L7RgdC90L7QstC90L7QuSDQu9C40L3QuNC4INC/0LDRgNCw0LzQtdGC0YDQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24gPSBkMy5saW5lKClcclxuICAgICAgICAgICAgLngoZnVuY3Rpb24oZCl7cmV0dXJuIGQueDt9KVxyXG4gICAgICAgICAgICAueShmdW5jdGlvbihkKXtyZXR1cm4gZC55O30pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10Lwg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQsiDQvNCw0YHRgdC40LIg0LTQu9GPINGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyDQs9GA0LDRhNC40LrQsFxyXG4gICAgICogQHBhcmFtICB7W2Jvb2xlYW5dfSB0ZW1wZXJhdHVyZSBb0L/RgNC40LfQvdCw0Log0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgICAgKi9cclxuICAgIHByZXBhcmVEYXRhKCl7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCByYXdEYXRhID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSk9PntcclxuICAgICAgICAgICAgcmF3RGF0YS5wdXNoKHt4OiBpLCBkYXRlOiB0aGlzLmNvbnZlcnRTdHJpbmdEYXRlTU1ERFlZWUhIVG9EYXRlKGVsZW0uZGF0ZSksIG1heFQ6IGVsZW0ubWF4LCAgbWluVDogZWxlbS5taW59KTtcclxuICAgICAgICAgICAgaSArPTE7IC8vINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQvtGB0LggWFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF3RGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgICBtYWtlU1ZHKCl7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLnBhcmFtcy5pZCkuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy5wYXJhbXMud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiNmZmZmZmZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC80LjQvdC40LzQsNC70LvRjNC90L7Qs9C+INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L/QviDQv9Cw0YDQsNC80LXRgtGA0YMg0LTQsNGC0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19IGRhdGEgW9C+0LHRitC10LrRgiDRgSDQvNC40L3QuNC80LDQu9GM0L3Ri9C8INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQvCDQt9C90LDRh9C10L3QuNC10LxdXHJcbiAgICAgKi9cclxuICAgIGdldE1pbk1heERhdGUocmF3RGF0YSl7XHJcblxyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBtYXhEYXRlIDogbmV3IERhdGUoJzE5MDAtMDEtMDEgMDA6MDA6MDAnKSxcclxuICAgICAgICAgICAgbWluRGF0ZSA6IG5ldyBEYXRlKCcyNTAwLTAxLTAxIDAwOjAwOjAwJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSBkYXRhLm1pbkRhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQsNGCINC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlVGVtcGVyYXR1cmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuXHJcbiAgICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKXtcclxuXHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG1pbiA6IDEwMCxcclxuICAgICAgICAgICAgbWF4IDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLm1pblQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ubWluVDtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5tYXhUKVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLm1heFQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBbZ2V0TWluTWF4V2VhdGhlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpe1xyXG5cclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgbWluIDogMCxcclxuICAgICAgICAgICAgbWF4IDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLmh1bWlkaXR5KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLmh1bWlkaXR5KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICAgICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgbWFrZUF4ZXNYWShyYXdEYXRhLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICAgICAgbGV0IHhBeGlzTGVuZ3RoID0gcGFyYW1zLndpZHRoIC0gMiAqIHBhcmFtcy5tYXJnaW47XHJcbiAgICAgICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcclxuICAgICAgICBsZXQgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gMiAqIHBhcmFtcy5tYXJnaW47XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXHJcbiAgICAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXHJcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKi9cclxuICAgIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICBsZXQge21heERhdGUsIG1pbkRhdGV9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgICAgIGxldCB7bWluLCBtYXh9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgICAgICAqIFtzY2FsZVRpbWUgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAgICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oW21heCs1LCBtaW4tNV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuICAgICAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBkYXRhLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgbWluVDogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4ge3NjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgZGF0YTogZGF0YX07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbil7XHJcblxyXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxyXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG4gICAgICAgIGxldCBkYXRhID0gW107XHJcblxyXG4gICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sIHJhaW5mYWxsQW1vdW50OiBzY2FsZVkoZWxlbS5yYWluZmFsbEFtb3VudCkgKyBtYXJnaW4gICwgY29sb3I6IGVsZW0uY29sb3J9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtzY2FsZVg6IHNjYWxlWCwgc2NhbGVZOiBzY2FsZVksIGRhdGE6IGRhdGF9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxyXG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKXtcclxuXHJcbiAgICAgICAgbGV0IGFyclBvbHlsaW5lID0gW107XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFl9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFl9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aC0xXVsnZGF0ZSddKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aC0xXVsnbWF4VCddKSArIHBhcmFtcy5vZmZzZXRZfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgZHJhd1BvbHlsaW5lKHN2ZywgZGF0YSl7XHJcbiAgICAgICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC4INGA0LjRgdGD0LXQvCDQu9C40L3QuNC4XHJcblxyXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJnXCIpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMucGFyYW1zLnN0cm9rZVdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpPT57XHJcblxyXG4gICAgICAgICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGVsZW0ubWF4VCAtIHBhcmFtcy5vZmZzZXRYLzItMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC50ZXh0KHBhcmFtcy5kYXRhW2l0ZW1dLm1heCsnwrAnKTtcclxuXHJcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGVsZW0ubWluVCArIHBhcmFtcy5vZmZzZXRZLzIrMTApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgcGFyYW1zLmZvbnRTaXplKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHBhcmFtcy5mb250Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAudGV4dChwYXJhbXMuZGF0YVtpdGVtXS5taW4rJ8KwJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC00LjRgdC/0LXRgtGH0LXRgCDQv9GA0L7RgNC40YHQvtCy0LrQsCDQs9GA0LDRhNC40LrQsCDRgdC+INCy0YHQtdC80Lgg0Y3Qu9C10LzQtdC90YLQsNC80LhcclxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBzdmcgPSB0aGlzLm1ha2VTVkcoKTtcclxuICAgICAgICBsZXQgcmF3RGF0YSA9IHRoaXMucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICAgICAgbGV0IHtzY2FsZVgsIHNjYWxlWSwgZGF0YX0gPSAgdGhpcy5tYWtlQXhlc1hZKHJhd0RhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICBsZXQgcG9seWxpbmUgPSB0aGlzLm1ha2VQb2x5bGluZShyYXdEYXRhLCB0aGlzLnBhcmFtcywgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xyXG4gICAgICAgIHRoaXMuZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgICAgIC8vdGhpcy5kcmF3TWFya2VycyhzdmcsIHBvbHlsaW5lLCB0aGlzLm1hcmdpbik7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvL9Ck0L7RgNC80LjRgNGD0LXQvCDQv9Cw0YDQsNC80LXRgtGAINGE0LjQu9GM0YLRgNCwINC/0L4g0LPQvtGA0L7QtNGDXHJcbiAgICBsZXQgcSA9ICcnO1xyXG4gICAgaWYod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICAgICAgICBxID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgIGVsc2VcclxuICAgICAgICBxID0gXCI/cT1Mb25kb25cIjtcclxuXHJcbiAgICBsZXQgdXJsRG9tYWluID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xyXG5cclxuICAgIGxldCBwYXJhbXNXaWRnZXQgPSB7XHJcbiAgICAgICAgY2l0eU5hbWU6ICdNb3Njb3cnLFxyXG4gICAgICAgIGxhbmc6ICdlbicsXHJcbiAgICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxyXG4gICAgICAgIHRleHRVbml0VGVtcDogJzAnXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBjb250cm9sc1dpZGdldCA9IHtcclxuICAgICAgICBjaXR5TmFtZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aWRnZXQtbWVudV9faGVhZGVyXCIpLFxyXG4gICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9fbnVtYmVyXCIpLFxyXG4gICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9fbWVhbnNcIiksXHJcbiAgICAgICAgd2luZFNwZWVkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9fd2luZFwiKSxcclxuICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX19pbWdcIiksXHJcbiAgICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhbGVuZGFyX19pdGVtXCIpLFxyXG4gICAgICAgIGdyYXBoaWM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JhcGhpY1wiKVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdXJscyA9IHtcclxuICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt1cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXIke3F9JnVuaXRzPSR7cGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3BhcmFtc1dpZGdldC5hcHBpZH1gLFxyXG4gICAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseSR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgd2luZFNwZWVkOiBcImRhdGEvd2luZC1zcGVlZC1kYXRhLmpzb25cIixcclxuICAgICAgICB3aW5kRGlyZWN0aW9uOiBcImRhdGEvd2luZC1kaXJlY3Rpb24tZGF0YS5qc29uXCIsXHJcbiAgICAgICAgY2xvdWRzOiBcImRhdGEvY2xvdWRzLWRhdGEuanNvblwiLFxyXG4gICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBcImRhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanNvblwiXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgb2JqV2lkZ2V0ID0gbmV3IFdlYXRoZXJXaWRnZXQocGFyYW1zV2lkZ2V0LCBjb250cm9sc1dpZGdldCwgdXJscyk7XHJcbiAgICB2YXIganNvbkZyb21BUEkgPSBvYmpXaWRnZXQucmVuZGVyKCk7XHJcblxyXG5cclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSBcIi4vY3VzdG9tLWRhdGVcIjtcclxuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGV7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XHJcbiAgICAgICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAgICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcclxuICAgICAgICB0aGlzLndlYXRoZXIgPSB7XHJcbiAgICAgICAgICAgIFwiZnJvbUFQSVwiOlxyXG4gICAgICAgICAgICB7XCJjb29yZFwiOntcclxuICAgICAgICAgICAgICAgIFwibG9uXCI6XCIwXCIsXHJcbiAgICAgICAgICAgICAgICBcImxhdFwiOlwiMFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjpbe1wiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm1haW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6XCJcIlxyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICBcImJhc2VcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibWFpblwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBcIjogMCxcclxuICAgICAgICAgICAgICAgICAgICBcInByZXNzdXJlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJodW1pZGl0eVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9taW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBfbWF4XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndpbmRcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcGVlZFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVnXCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJhaW5cIjp7fSxcclxuICAgICAgICAgICAgICAgIFwiY2xvdWRzXCI6e1wiYWxsXCI6XCIgXCJ9LFxyXG4gICAgICAgICAgICAgICAgXCJkdFwiOmBgLFxyXG4gICAgICAgICAgICAgICAgXCJzeXNcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VucmlzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3Vuc2V0XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjpcIlVuZGVmaW5lZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2RcIjpcIiBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICovXHJcbiAgICBodHRwR2V0KHVybCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgICAqL1xyXG4gICAgZ2V0V2VhdGhlckZyb21BcGkoKXtcclxuICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ11bXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLndpbmRTcGVlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHJlc3BvbnNlW3RoaXMucGFyYW1zLmxhbmddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgICAqIEBwYXJhbSAge29iamVjdH0gSlNPTlxyXG4gICAgICogQHBhcmFtICB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICovXHJcbiAgICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKXtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqZWN0KXtcclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09IFwib2JqZWN0XCIgJiYgZWxlbWVudE5hbWUyID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LAg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgICAgICAgIGVsc2UgaWYoZWxlbWVudE5hbWUyICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxyXG4gICAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgcGFyc2VEYXRhRnJvbVNlcnZlcigpe1xyXG5cclxuICAgICAgICBsZXQgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICAgICAgaWYod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09IFwiVW5kZWZpbmVkXCIgfHwgd2VhdGhlci5mcm9tQVBJLmNvZCA9PT0gXCI0MDRcIil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBuYXR1cmFsUGhlbm9tZW5vbiA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kU3BlZWQgPSBgYDtcclxuICAgICAgICB2YXIgd2luZERpcmVjdGlvbiA9IGBgO1xyXG4gICAgICAgIHZhciBjbG91ZHMgPSBgYDtcclxuXHJcbiAgICAgICAgLy/QmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgICAgIHZhciBtZXRhZGF0YSA9IHtcclxuICAgICAgICAgICAgY2xvdWRpbmVzczogYCBgLFxyXG4gICAgICAgICAgICBkdCA6IGAgYCxcclxuICAgICAgICAgICAgY2l0eU5hbWUgOiAgYCBgLFxyXG4gICAgICAgICAgICBpY29uIDogYCBgLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZSA6IGAgYCxcclxuICAgICAgICAgICAgcHJlc3N1cmUgOiAgYCBgLFxyXG4gICAgICAgICAgICBodW1pZGl0eSA6IGAgYCxcclxuICAgICAgICAgICAgc3VucmlzZSA6IGAgYCxcclxuICAgICAgICAgICAgc3Vuc2V0IDogYCBgLFxyXG4gICAgICAgICAgICBjb29yZCA6IGAgYCxcclxuICAgICAgICAgICAgd2luZDogYCBgLFxyXG4gICAgICAgICAgICB3ZWF0aGVyOiBgIGBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5jaXR5TmFtZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5uYW1lfSwgJHt3ZWF0aGVyLmZyb21BUEkuc3lzLmNvdW50cnl9YDtcclxuICAgICAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKX1gO1xyXG4gICAgICAgIGlmKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLndlYXRoZXIgPSB3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uW3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmlkXTtcclxuICAgICAgICBpZih3ZWF0aGVyW1wid2luZFNwZWVkXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS53aW5kU3BlZWQgPSBgV2luZDogJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpfSAgbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmRTcGVlZFwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wic3BlZWRcIl0udG9GaXhlZCgxKSwgXCJzcGVlZF9pbnRlcnZhbFwiKX1gO1xyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS53aW5kRGlyZWN0aW9uID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXSwgXCJkZWdfaW50ZXJ2YWxcIil9ICggJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl19IClgXHJcbiAgICAgICAgaWYod2VhdGhlcltcImNsb3Vkc1wiXSlcclxuICAgICAgICAgICAgbWV0YWRhdGEuY2xvdWRzID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcImNsb3Vkc1wiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJjbG91ZHNcIl1bXCJhbGxcIl0sIFwibWluXCIsIFwibWF4XCIpfWA7XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndlYXRoZXJcIl1bMF1bXCJpY29uXCJdfWA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcldpZGdldChtZXRhZGF0YSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICByZW5kZXJXaWRnZXQobWV0YWRhdGEpIHtcclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gYDxzcGFuPldlYXRoZXIgZm9yPC9zcGFuPiAke21ldGFkYXRhLmNpdHlOYW1lfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlW2VsZW1dLmlubmVySFRNTCA9IGAke21ldGFkYXRhLnRlbXBlcmF0dXJlfTxzdXAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX2RlZ3JlZVwiPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3VwPmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke21ldGFkYXRhLmljb259LnBuZ2A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihtZXRhZGF0YS53ZWF0aGVyLnRyaW0oKSlcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgaWYobWV0YWRhdGEud2luZFNwZWVkLnRyaW0oKSlcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkpXHJcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpe1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpKTtcclxuICAgICAgICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgJ21pbic6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXHJcbiAgICAgICAgICAgICAgICAnbWF4JzogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcclxuICAgICAgICAgICAgICAgICdkYXknOiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgICAgICAgICAnaWNvbic6IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGUnOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XHJcbiAgICAgKiBAcGFyYW0gZGF0YVxyXG4gICAgICovXHJcbiAgICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtLCBpbmRleCxkYXRhKXtcclxuICAgICAgICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGBINC/0L7QvNC+0YnRjNGOINCx0LjQsdC70LjQvtGC0LXQutC4IEQzXHJcbiAgICAgKi9cclxuICAgIGRyYXdHcmFwaGljRDMoZGF0YSl7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpO1xyXG5cclxuICAgICAgICAvL9Cf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxyXG4gICAgICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGlkOiBcIiNncmFwaGljXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIG9mZnNldFg6IDE1LFxyXG4gICAgICAgICAgICBvZmZzZXRZOiAxMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA3OSxcclxuICAgICAgICAgICAgcmF3RGF0YTogW10sXHJcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgIGNvbG9yUG9saWx5bmU6IFwiIzMzM1wiLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogXCIxMnB4XCIsXHJcbiAgICAgICAgICAgIGZvbnRDb2xvcjogXCIjMzMzXCIsXHJcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBcIjFweFwiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICAgIGxldCBvYmpHcmFwaGljRDMgPSAgbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgICAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDQs9GA0LDRhNC40LrQsCDQv9C+0LPQvtC00Ysg0L3QsCDQvdC10LTQtdC70Y5cclxuICAgICAqL1xyXG4gICAgZHJhd0dyYXBoaWMoYXJyKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGg9IDQ2NTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmXCI7XHJcbiAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLDAsNjAwLDMwMCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4XCI7XHJcblxyXG4gICAgICAgIHZhciBzdGVwID0gNTU7XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIHZhciB6b29tID0gNDtcclxuICAgICAgICB2YXIgc3RlcFkgPSA2NDtcclxuICAgICAgICB2YXIgc3RlcFlUZXh0VXAgPSA1ODtcclxuICAgICAgICB2YXIgc3RlcFlUZXh0RG93biA9IDc1O1xyXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RlcC0xMCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1heCsnwronLCBzdGVwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFlUZXh0VXApO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdGVwICs9NTU7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyWy0taV0ubWF4Knpvb20rc3RlcFkpXHJcbiAgICAgICAgc3RlcCA9IDU1O1xyXG4gICAgICAgIGkgPSAwIDtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWVRleHREb3duKTtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLTEwLCAtMSphcnJbaSsrXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgd2hpbGUoaTxhcnIubGVuZ3RoKXtcclxuICAgICAgICAgICAgc3RlcCArPTU1O1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1pbisnwronLCBzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFlUZXh0RG93bik7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyWy0taV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCIjMzMzXCI7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMzMzXCI7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCl7XHJcbiAgICAgICAgdGhpcy5nZXRXZWF0aGVyRnJvbUFwaSgpO1xyXG4gICAgfTtcclxuXHJcbn0iXX0=
