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
                rawData.push({ x: i, date: i * 10, maxT: elem.max, minT: elem.min });
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
        textUnitTemp: '0'
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
                    this.controls.temperature[_elem].innerHTML = metadata.temperature + "<sup class=\"weather-card__degree\">" + this.params.textUnitTemp + "</sup>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQUdBOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQUNxQixVOzs7QUFFakIsMEJBQWE7QUFBQTs7QUFBQTtBQUVaOztBQUVEOzs7Ozs7Ozs7NENBS29CLE0sRUFBTztBQUN2QixnQkFBRyxTQUFTLEdBQVosRUFBaUIsT0FBTyxLQUFQO0FBQ2pCLGdCQUFHLFNBQVMsRUFBWixFQUNJLGNBQVksTUFBWixDQURKLEtBRUssSUFBRyxTQUFTLEdBQVosRUFDRCxhQUFXLE1BQVg7QUFDSixtQkFBTyxNQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytDQUt1QixJLEVBQUs7QUFDeEIsZ0JBQUksTUFBTSxJQUFJLElBQUosQ0FBUyxJQUFULENBQVY7QUFDQSxnQkFBSSxRQUFRLElBQUksSUFBSixDQUFTLElBQUksV0FBSixFQUFULEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQVo7QUFDQSxnQkFBSSxPQUFPLE1BQU0sS0FBakI7QUFDQSxnQkFBSSxTQUFTLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBOUI7QUFDQSxnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLE9BQU8sTUFBbEIsQ0FBVjtBQUNBLG1CQUFVLElBQUksV0FBSixFQUFWLFNBQStCLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxLQUFLLG1CQUFUO0FBQ0EsZ0JBQUksT0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLENBQVg7QUFDQSxnQkFBSSxZQUFZLElBQUksSUFBSixDQUFTLEtBQUss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QVYsR0FBYyxJQUFkLEdBQW1CLGFBQTVEO0FBQ0Esb0JBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxHQUFKLEVBQVMsR0FBWixHQUFnQixJQUFoQixHQUFxQixLQUE3QztBQUNBLG1CQUFNLElBQUUsSUFBSSxNQUFaLEVBQW1CO0FBQ2Ysd0JBQU8sRUFBUDtBQUNBLHdCQUFRLE1BQVIsQ0FBZSxJQUFmLEVBQXFCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEtBQXhDO0FBQ0Esd0JBQVEsVUFBUixDQUFtQixJQUFJLENBQUosRUFBTyxHQUFQLEdBQVcsR0FBOUIsRUFBbUMsSUFBbkMsRUFBeUMsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsYUFBNUQ7QUFDQTtBQUNIO0FBQ0Qsb0JBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxFQUFFLENBQU4sRUFBUyxHQUFaLEdBQWdCLElBQWhCLEdBQXFCLEtBQTdDO0FBQ0Esb0JBQVEsU0FBUixHQUFvQixNQUFwQjtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEtBQTNDO0FBQ0Esb0JBQVEsU0FBUjs7QUFFQSxvQkFBUSxXQUFSLEdBQXNCLE1BQXRCOztBQUVBLG9CQUFRLE1BQVI7QUFDQSxvQkFBUSxJQUFSO0FBQ0g7OztpQ0FFTztBQUNKLGlCQUFLLGlCQUFMO0FBQ0g7Ozs7OztrQkF2YWdCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAgICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgICAgKi9cclxuICAgIG51bWJlckRheXNPZlllYXJYWFgobnVtYmVyKXtcclxuICAgICAgICBpZihudW1iZXIgPiAzNjUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihudW1iZXIgPCAxMClcclxuICAgICAgICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgZWxzZSBpZihudW1iZXIgPCAxMDApXHJcbiAgICAgICAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XHJcbiAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQsiDQs9C+0LTRg1xyXG4gICAgICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAg0J/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQsiDQs9C+0LTRg1xyXG4gICAgICovXHJcbiAgICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcclxuICAgICAgICB2YXIgb25lRGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICB2YXIgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgICAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QvtCx0YDQsNC30YPQtdGCINC00LDRgtGDINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj4g0LIgeXl5eS1tbS1kZFxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBkYXRlINC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cclxuICAgICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAgICAqL1xyXG4gICAgY29udmVydE51bWJlckRheVRvRGF0ZShkYXRlKXtcclxuICAgICAgICB2YXIgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XHJcbiAgICAgICAgdmFyIGxpbmUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIHZhciBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgICAgICB2YXIgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgbGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICoyNDtcclxuICAgICAgICB2YXIgcmVzID0gbmV3IERhdGUodW5peHRpbWUpO1xyXG5cclxuICAgICAgICB2YXIgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgdmFyIGRheXMgPSByZXMuZ2V0RGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gcmVzLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0LTQsNGC0Ysg0LLQuNC00LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICogQHBhcmFtICB7ZGF0ZTF9IGRhdGUg0LTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgeXl5eS1tbS1kZFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICovXHJcbiAgICBmb3JtYXREYXRlKGRhdGUxKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7KG1vbnRoPDEwKT9gMCR7bW9udGh9YDogbW9udGh9LSR7KGRheTwxMCk/YDAke2RheX1gOiBkYXl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudERhdGUoKXtcclxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXREYXRlKG5vdyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0L/QvtGB0LvQtdC00L3QuNC1INGC0YDQuCDQvNC10YHRj9GG0LBcclxuICAgIGdldERhdGVMYXN0VGhyZWVNb250aCgpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgICAgIHZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG5cclxuICAgICAgICBkYXkgLT05MDtcclxuXHJcbiAgICAgICAgaWYoZGF5IDwgMCApe1xyXG4gICAgICAgICAgICB5ZWFyIC09MTtcclxuICAgICAgICAgICAgZGF5ID0gMzY1IC0gZGF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRDdXJyZW50U3ByaW5nRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcclxuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgJHtkYXRlRnJ9ICAke2RhdGVUb31gKTtcclxuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgICBnZXRMYXN0U3VtbWVyRGF0ZSgpe1xyXG4gICAgICAgIHZhciB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLTE7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpcnN0RGF0ZUN1clllYXIoKXtcclxuICAgICAgICByZXR1cm4gYCR7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfS0wMDFgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvLC8sJycpLnJlcGxhY2UoLzpcXHcrJC8sJycpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFt0aW1lc3RhbXBUb0RhdGUgdW5peHRpbWUgdG8gaGg6bW1dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICB2YXIgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgICAgdmFyIG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgICAgICByZXR1cm4gYCR7aG91cnM8MTA/YDAke2hvdXJzfWA6aG91cnN9OiR7bWludXRlczwxMD9gMCR7bWludXRlc31gOm1pbnV0ZXN9IGA7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAgICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICAgICogQHJldHVybnMge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSl7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS5nZXREYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpe1xyXG4gICAgICAgIGxldCBkYXlzID0ge1xyXG4gICAgICAgICAgICAwIDogXCJTdW5cIixcclxuICAgICAgICAgICAgMSA6IFwiTW9uXCIsXHJcbiAgICAgICAgICAgIDIgOiBcIlR1ZVwiLFxyXG4gICAgICAgICAgICAzIDogXCJXZWRcIixcclxuICAgICAgICAgICAgNCA6IFwiVGh1XCIsXHJcbiAgICAgICAgICAgIDUgOiBcIkZyaVwiLFxyXG4gICAgICAgICAgICA2IDogXCJTYXRcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRheXNbZGF5TnVtYmVyXTtcclxuICAgIH1cclxuXHJcbiAgICAvKiog0KHRgNCw0LLQvdC10L3QuNC1INC00LDRgtGLINCyINGE0L7RgNC80LDRgtC1IGRkLm1tLnl5eXkgPSBkZC5tbS55eXl5INGBINGC0LXQutGD0YnQuNC8INC00L3QtdC8XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb21wYXJlRGF0ZXNXaXRoVG9kYXkoZGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygpID09PSAobmV3IERhdGUoKSkudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZGF0ZSl7XHJcbiAgICAgICAgbGV0IHJlID0vKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XHJcbiAgICAgICAgbGV0IHJlc0RhdGUgPSByZS5leGVjKGRhdGUpO1xyXG4gICAgICAgIGlmKHJlc0RhdGUubGVuZ3RoID09IDYpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YClcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0LTQsNGC0LAg0L3QtSDRgNCw0YHQv9Cw0YDRgdC10L3QsCDQsdC10YDQtdC8INGC0LXQutGD0YnRg9GOXHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xyXG5cclxuLyoqXHJcbiDQk9GA0LDRhNC40Log0YLQtdC80L/QtdGA0LDRgtGD0YDRiyDQuCDQv9C+0LPQvtC00YtcclxuIEBjbGFzcyBHcmFwaGljXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljIGV4dGVuZHMgQ3VzdG9tRGF0ZXtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC00LvRjyDRgNCw0YHRh9C10YLQsCDQvtGC0YDQuNGB0L7QstC60Lgg0L7RgdC90L7QstC90L7QuSDQu9C40L3QuNC4INC/0LDRgNCw0LzQtdGC0YDQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgICogW2xpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24gPSBkMy5saW5lKClcclxuICAgICAgICAgICAgLngoZnVuY3Rpb24oZCl7cmV0dXJuIGQueDt9KVxyXG4gICAgICAgICAgICAueShmdW5jdGlvbihkKXtyZXR1cm4gZC55O30pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10Lwg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQsiDQvNCw0YHRgdC40LIg0LTQu9GPINGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyDQs9GA0LDRhNC40LrQsFxyXG4gICAgICogQHBhcmFtICB7W2Jvb2xlYW5dfSB0ZW1wZXJhdHVyZSBb0L/RgNC40LfQvdCw0Log0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgICAgKi9cclxuICAgIHByZXBhcmVEYXRhKCl7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGxldCByYXdEYXRhID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSk9PntcclxuICAgICAgICAgICAgLy9yYXdEYXRhLnB1c2goe3g6IGksIGRhdGU6IHRoaXMuY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZWxlbS5kYXRlKSwgbWF4VDogZWxlbS5tYXgsICBtaW5UOiBlbGVtLm1pbn0pO1xyXG4gICAgICAgICAgICByYXdEYXRhLnB1c2goe3g6IGksIGRhdGU6IGkqMTAsIG1heFQ6IGVsZW0ubWF4LCAgbWluVDogZWxlbS5taW59KTtcclxuICAgICAgICAgICAgaSArPTE7IC8vINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQvtGB0LggWFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmF3RGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXHJcbiAgICAgKiBbbWFrZVNWRyBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfVxyXG4gICAgICovXHJcbiAgICBtYWtlU1ZHKCl7XHJcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLnBhcmFtcy5pZCkuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdGhpcy5wYXJhbXMud2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHRoaXMucGFyYW1zLmhlaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcIiNmZmZmZmZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC80LjQvdC40LzQsNC70LvRjNC90L7Qs9C+INC4INC80LDQutGB0LjQvNCw0LvRjNC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L/QviDQv9Cw0YDQsNC80LXRgtGA0YMg0LTQsNGC0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0LzQsNGB0YHQuNCyINGBINCw0LTQsNC/0YLQuNGA0L7QstCw0L3QvdGL0LzQuCDQv9C+INGC0LjQv9GDINCz0YDQsNGE0LjQutCwINC00LDQvdC90YvQvNC4XVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19IGRhdGEgW9C+0LHRitC10LrRgiDRgSDQvNC40L3QuNC80LDQu9GM0L3Ri9C8INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQvCDQt9C90LDRh9C10L3QuNC10LxdXHJcbiAgICAgKi9cclxuICAgIGdldE1pbk1heERhdGUocmF3RGF0YSl7XHJcblxyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBtYXhEYXRlIDogbmV3IERhdGUoJzE5MDAtMDEtMDEgMDA6MDA6MDAnKSxcclxuICAgICAgICAgICAgbWluRGF0ZSA6IG5ldyBEYXRlKCcyNTAwLTAxLTAxIDAwOjAwOjAwJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXhEYXRlIDw9IGVsZW0uZGF0ZSkgZGF0YS5tYXhEYXRlID0gZWxlbS5kYXRlO1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbkRhdGUgPj0gZWxlbS5kYXRlKSBkYXRhLm1pbkRhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQsNGCINC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlVGVtcGVyYXR1cmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuXHJcbiAgICBnZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKXtcclxuXHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG1pbiA6IDEwMCxcclxuICAgICAgICAgICAgbWF4IDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLm1pblQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ubWluVDtcclxuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5tYXhUKVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLm1heFQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBbZ2V0TWluTWF4V2VhdGhlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBnZXRNaW5NYXhXZWF0aGVyKHJhd0RhdGEpe1xyXG5cclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgbWluIDogMCxcclxuICAgICAgICAgICAgbWF4IDogMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLmh1bWlkaXR5KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1pbiA+PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLmh1bWlkaXR5KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLnJhaW5mYWxsQW1vdW50KVxyXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQtNC70LjQvdGDINC+0YHQtdC5IFgsWVxyXG4gICAgICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQnNCw0YHRgdC40LIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgbWFrZUF4ZXNYWShyYXdEYXRhLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBYPSDRiNC40YDQuNC90LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LvQtdCy0LAg0Lgg0YHQv9GA0LDQstCwXHJcbiAgICAgICAgbGV0IHhBeGlzTGVuZ3RoID0gcGFyYW1zLndpZHRoIC0gMiAqIHBhcmFtcy5tYXJnaW47XHJcbiAgICAgICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcclxuICAgICAgICBsZXQgeUF4aXNMZW5ndGggPSBwYXJhbXMuaGVpZ2h0IC0gMiAqIHBhcmFtcy5tYXJnaW47XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXHJcbiAgICAgKiBbc2NhbGVBeGVzWFkgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gIHJhd0RhdGEgICAgIFvQntCx0YrQtdC60YIg0YEg0LTQsNC90L3Ri9C80Lgg0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXHJcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geUF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWV1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gIG1hcmdpbiAgICAgIFvQvtGC0YHRgtGD0L/RiyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKi9cclxuICAgIHNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICBsZXQge21heERhdGUsIG1pbkRhdGV9ID0gdGhpcy5nZXRNaW5NYXhEYXRlKHJhd0RhdGEpO1xyXG4gICAgICAgIGxldCB7bWluLCBtYXh9ID0gdGhpcy5nZXRNaW5NYXhUZW1wZXJhdHVyZShyYXdEYXRhKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgICAgICAqIFtzY2FsZVRpbWUgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog0LzQtdGC0L7QtCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAgICAgICogW3NjYWxlTGluZWFyIGRlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oW21heCs1LCBtaW4tNV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuICAgICAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xyXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICBkYXRhLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgICAgICAgICBtYXhUOiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgbWluVDogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4ge3NjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgZGF0YTogZGF0YX07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbil7XHJcblxyXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXHJcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeEF4aXNMZW5ndGhdKTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxyXG4gICAgICAgIHZhciBzY2FsZVkgPSBkMy5zY2FsZUxpbmVhcigpXHJcbiAgICAgICAgICAgIC5kb21haW4oW21heCwgbWluXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG4gICAgICAgIGxldCBkYXRhID0gW107XHJcblxyXG4gICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sIHJhaW5mYWxsQW1vdW50OiBzY2FsZVkoZWxlbS5yYWluZmFsbEFtb3VudCkgKyBtYXJnaW4gICwgY29sb3I6IGVsZW0uY29sb3J9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtzY2FsZVg6IHNjYWxlWCwgc2NhbGVZOiBzY2FsZVksIGRhdGE6IGRhdGF9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LjQstCw0YDQvtC90LjQtSDQvNCw0YHRgdC40LLQsCDQtNC70Y8g0YDQuNGB0L7QstCw0L3QuNGPINC/0L7Qu9C40LvQuNC90LjQuFxyXG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IGRhdGEgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiBb0L7RgtGB0YLRg9C/INC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKXtcclxuXHJcbiAgICAgICAgbGV0IGFyclBvbHlsaW5lID0gW107XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFl9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShlbGVtLm1pblQpICsgcGFyYW1zLm9mZnNldFl9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aC0xXVsnZGF0ZSddKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aC0xXVsnbWF4VCddKSArIHBhcmFtcy5vZmZzZXRZfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJQb2x5bGluZTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxyXG4gICAgICogW2RyYXdQb2x1bGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gc3ZnICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgZHJhd1BvbHlsaW5lKHN2ZywgZGF0YSl7XHJcbiAgICAgICAgLy8g0LTQvtCx0LDQstC70Y/QtdC8INC/0YPRgtGMINC4INGA0LjRgdGD0LXQvCDQu9C40L3QuNC4XHJcblxyXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJnXCIpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMucGFyYW1zLnN0cm9rZVdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24oZGF0YSkpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcIm9wYWNpdHlcIiwgMSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpe1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW0sIGl0ZW0sIGRhdGEpPT57XHJcblxyXG4gICAgICAgICAgICAvLyDQvtGC0YDQuNGB0L7QstC60LAg0YLQtdC60YHRgtCwXHJcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGVsZW0ubWF4VCAtIHBhcmFtcy5vZmZzZXRYLzItMilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC50ZXh0KHBhcmFtcy5kYXRhW2l0ZW1dLm1heCsnwrAnKTtcclxuXHJcbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGVsZW0ubWluVCArIHBhcmFtcy5vZmZzZXRZLzIrNylcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgICAgICAgICAgIC50ZXh0KHBhcmFtcy5kYXRhW2l0ZW1dLm1pbisnwrAnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LTQuNGB0L/QtdGC0YfQtdGAINC/0YDQvtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGB0L4g0LLRgdC10LzQuCDRjdC70LXQvNC10L3RgtCw0LzQuFxyXG4gICAgICogW3JlbmRlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgbGV0IHN2ZyA9IHRoaXMubWFrZVNWRygpO1xyXG4gICAgICAgIGxldCByYXdEYXRhID0gdGhpcy5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgICAgICBsZXQge3NjYWxlWCwgc2NhbGVZLCBkYXRhfSA9ICB0aGlzLm1ha2VBeGVzWFkocmF3RGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgICAgIGxldCBwb2x5bGluZSA9IHRoaXMubWFrZVBvbHlsaW5lKHJhd0RhdGEsIHRoaXMucGFyYW1zLCBzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgICAgdGhpcy5kcmF3UG9seWxpbmUoc3ZnLCBwb2x5bGluZSk7XHJcbiAgICAgICAgdGhpcy5kcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgLy90aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCIvLyDQnNC+0LTRg9C70Ywg0LTQuNGB0L/QtdGC0YfQtdGAINC00LvRjyDQvtGC0YDQuNGB0L7QstC60Lgg0LHQsNC90L3QtdGA0YDQvtCyINC90LAg0LrQvtC90YHRgtGA0YPQutGC0L7RgNC1XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBXZWF0aGVyV2lkZ2V0IGZyb20gJy4vd2VhdGhlci13aWRnZXQnO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLy/QpNC+0YDQvNC40YDRg9C10Lwg0L/QsNGA0LDQvNC10YLRgCDRhNC40LvRjNGC0YDQsCDQv9C+INCz0L7RgNC+0LTRg1xyXG4gICAgbGV0IHEgPSAnJztcclxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXHJcbiAgICAgICAgcSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcSA9IFwiP3E9TG9uZG9uXCI7XHJcblxyXG4gICAgbGV0IHVybERvbWFpbiA9IFwiaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmdcIjtcclxuXHJcbiAgICBsZXQgcGFyYW1zV2lkZ2V0ID0ge1xyXG4gICAgICAgIGNpdHlOYW1lOiAnTW9zY293JyxcclxuICAgICAgICBsYW5nOiAnZW4nLFxyXG4gICAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICAgIHVuaXRzOiAnbWV0cmljJyxcclxuICAgICAgICB0ZXh0VW5pdFRlbXA6ICcwJ1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2lkZ2V0LWRhcmstbWVudV9faGVhZGVyXCIpLFxyXG4gICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItZGFyay1jYXJkX19udW1iZXJcIiksXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1kYXJrLWNhcmRfX21lYW5zXCIpLFxyXG4gICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWRhcmstY2FyZF9fd2luZFwiKSxcclxuICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1kYXJrLWNhcmRfX2ltZ1wiKSxcclxuICAgICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FsZW5kYXJfX2l0ZW1cIiksXHJcbiAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaGljXCIpXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB1cmxzID0ge1xyXG4gICAgICAgIHVybFdlYXRoZXJBUEk6IGAke3VybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlciR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt1cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5JHtxfSZ1bml0cz0ke3BhcmFtc1dpZGdldC51bml0c30mY250PTgmYXBwaWQ9JHtwYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IFwiZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvblwiLFxyXG4gICAgICAgIHdpbmREaXJlY3Rpb246IFwiZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25cIixcclxuICAgICAgICBjbG91ZHM6IFwiZGF0YS9jbG91ZHMtZGF0YS5qc29uXCIsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IFwiZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uXCJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChwYXJhbXNXaWRnZXQsIGNvbnRyb2xzV2lkZ2V0LCB1cmxzKTtcclxuICAgIHZhciBqc29uRnJvbUFQSSA9IG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSBcIi4vY3VzdG9tLWRhdGVcIjtcclxuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGV7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XHJcbiAgICAgICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAgICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcclxuICAgICAgICB0aGlzLndlYXRoZXIgPSB7XHJcbiAgICAgICAgICAgIFwiZnJvbUFQSVwiOlxyXG4gICAgICAgICAgICB7XCJjb29yZFwiOntcclxuICAgICAgICAgICAgICAgIFwibG9uXCI6XCIwXCIsXHJcbiAgICAgICAgICAgICAgICBcImxhdFwiOlwiMFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjpbe1wiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm1haW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6XCJcIlxyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICBcImJhc2VcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibWFpblwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBcIjogMCxcclxuICAgICAgICAgICAgICAgICAgICBcInByZXNzdXJlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJodW1pZGl0eVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9taW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBfbWF4XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndpbmRcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcGVlZFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVnXCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJhaW5cIjp7fSxcclxuICAgICAgICAgICAgICAgIFwiY2xvdWRzXCI6e1wiYWxsXCI6XCIgXCJ9LFxyXG4gICAgICAgICAgICAgICAgXCJkdFwiOmBgLFxyXG4gICAgICAgICAgICAgICAgXCJzeXNcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VucmlzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3Vuc2V0XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjpcIlVuZGVmaW5lZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2RcIjpcIiBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICovXHJcbiAgICBodHRwR2V0KHVybCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgICAqL1xyXG4gICAgZ2V0V2VhdGhlckZyb21BcGkoKXtcclxuICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ11bXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLndpbmRTcGVlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHJlc3BvbnNlW3RoaXMucGFyYW1zLmxhbmddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgICAqIEBwYXJhbSAge29iamVjdH0gSlNPTlxyXG4gICAgICogQHBhcmFtICB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICovXHJcbiAgICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKXtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqZWN0KXtcclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09IFwib2JqZWN0XCIgJiYgZWxlbWVudE5hbWUyID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LAg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgICAgICAgIGVsc2UgaWYoZWxlbWVudE5hbWUyICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxyXG4gICAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgcGFyc2VEYXRhRnJvbVNlcnZlcigpe1xyXG5cclxuICAgICAgICBsZXQgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICAgICAgaWYod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09IFwiVW5kZWZpbmVkXCIgfHwgd2VhdGhlci5mcm9tQVBJLmNvZCA9PT0gXCI0MDRcIil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBuYXR1cmFsUGhlbm9tZW5vbiA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kU3BlZWQgPSBgYDtcclxuICAgICAgICB2YXIgd2luZERpcmVjdGlvbiA9IGBgO1xyXG4gICAgICAgIHZhciBjbG91ZHMgPSBgYDtcclxuXHJcbiAgICAgICAgLy/QmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgICAgIHZhciBtZXRhZGF0YSA9IHtcclxuICAgICAgICAgICAgY2xvdWRpbmVzczogYCBgLFxyXG4gICAgICAgICAgICBkdCA6IGAgYCxcclxuICAgICAgICAgICAgY2l0eU5hbWUgOiAgYCBgLFxyXG4gICAgICAgICAgICBpY29uIDogYCBgLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZSA6IGAgYCxcclxuICAgICAgICAgICAgcHJlc3N1cmUgOiAgYCBgLFxyXG4gICAgICAgICAgICBodW1pZGl0eSA6IGAgYCxcclxuICAgICAgICAgICAgc3VucmlzZSA6IGAgYCxcclxuICAgICAgICAgICAgc3Vuc2V0IDogYCBgLFxyXG4gICAgICAgICAgICBjb29yZCA6IGAgYCxcclxuICAgICAgICAgICAgd2luZDogYCBgLFxyXG4gICAgICAgICAgICB3ZWF0aGVyOiBgIGBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5jaXR5TmFtZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5uYW1lfSwgJHt3ZWF0aGVyLmZyb21BUEkuc3lzLmNvdW50cnl9YDtcclxuICAgICAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSA+IDAgPyBgKyR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWAgOiB3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wLnRvRml4ZWQoMCl9YDtcclxuICAgICAgICBpZih3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS53ZWF0aGVyID0gd2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vblt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pZF07XHJcbiAgICAgICAgaWYod2VhdGhlcltcIndpbmRTcGVlZFwiXSlcclxuICAgICAgICAgICAgbWV0YWRhdGEud2luZFNwZWVkID0gYFdpbmQ6ICR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wic3BlZWRcIl0udG9GaXhlZCgxKX0gIG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kU3BlZWRcIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcInNwZWVkXCJdLnRvRml4ZWQoMSksIFwic3BlZWRfaW50ZXJ2YWxcIil9YDtcclxuICAgICAgICBpZih3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSlcclxuICAgICAgICAgICAgbWV0YWRhdGEud2luZERpcmVjdGlvbiA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl0sIFwiZGVnX2ludGVydmFsXCIpfSAoICR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdfSApYFxyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJjbG91ZHNcIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLmNsb3VkcyA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJjbG91ZHNcIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wiY2xvdWRzXCJdW1wiYWxsXCJdLCBcIm1pblwiLCBcIm1heFwiKX1gO1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5pY29uID0gYCR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3ZWF0aGVyXCJdWzBdW1wiaWNvblwiXX1gO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmVuZGVyV2lkZ2V0KG1ldGFkYXRhKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBgPHNwYW4+V2VhdGhlciBmb3I8L3NwYW4+ICR7bWV0YWRhdGEuY2l0eU5hbWV9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHN1cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fZGVncmVlXCI+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zdXA+YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihtZXRhZGF0YS53ZWF0aGVyLnRyaW0oKSlcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgaWYobWV0YWRhdGEud2luZFNwZWVkLnRyaW0oKSlcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkpXHJcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpe1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpKTtcclxuICAgICAgICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgJ21pbic6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXHJcbiAgICAgICAgICAgICAgICAnbWF4JzogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcclxuICAgICAgICAgICAgICAgICdkYXknOiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgICAgICAgICAnaWNvbic6IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGUnOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XHJcbiAgICAgKiBAcGFyYW0gZGF0YVxyXG4gICAgICovXHJcbiAgICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XHJcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxyXG4gICAgICAgICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCsxMF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmBcclxuICAgICAgICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXgrMjBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VVJMTWFpbkljb24obmFtZUljb24sIGNvbG9yID0gZmFsc2Upe1xyXG4gICAgICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxyXG4gICAgICAgIHZhciBtYXBJY29ucyA9ICBuZXcgTWFwKCk7XHJcblxyXG4gICAgICAgIGlmKCFjb2xvcikge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAxZCcsICcwMWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA2ZCcsICcwNmRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA5ZCcsICcwOWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzEzZCcsICcxM2RidycpO1xyXG4gICAgICAgICAgICAvLyDQndC+0YfQvdGL0LVcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwMm4nLCAnMDJkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNG4nLCAnMDRkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwN24nLCAnMDdkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxMG4nLCAnMTBkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgaW1nLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gYGltZy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgICAqL1xyXG4gICAgZHJhd0dyYXBoaWNEMyhkYXRhKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XHJcblxyXG4gICAgICAgIC8v0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgaWQ6IFwiI2dyYXBoaWNcIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgICAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICAgICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgY29sb3JQb2xpbHluZTogXCIjMzMzXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgZm9udENvbG9yOiBcIiMzMzNcIixcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IFwiMXB4XCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgbGV0IG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICAgICAgcGFyYW1zLmlkID0gXCIjZ3JhcGhpYzFcIjtcclxuICAgICAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9IFwiI0RERjczMFwiO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgcGFyYW1zLmlkID0gXCIjZ3JhcGhpYzJcIjtcclxuICAgICAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9IFwiI0ZFQjAyMFwiO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAgICovXHJcbiAgICBkcmF3R3JhcGhpYyhhcnIpe1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aD0gNDY1O1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsMCw2MDAsMzAwKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCJPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHhcIjtcclxuXHJcbiAgICAgICAgdmFyIHN0ZXAgPSA1NTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBzdGVwWSA9IDY0O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHREb3duID0gNzU7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5tYXgqem9vbStzdGVwWSlcclxuICAgICAgICBzdGVwID0gNTU7XHJcbiAgICAgICAgaSA9IDAgO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdGVwICs9NTU7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWVRleHREb3duKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgICB9O1xyXG5cclxufVxyXG4iXX0=
