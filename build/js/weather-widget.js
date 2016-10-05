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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQUdBOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQUNxQixVOzs7QUFFakIsMEJBQWE7QUFBQTs7QUFBQTtBQUVaOztBQUVEOzs7Ozs7Ozs7NENBS29CLE0sRUFBTztBQUN2QixnQkFBRyxTQUFTLEdBQVosRUFBaUIsT0FBTyxLQUFQO0FBQ2pCLGdCQUFHLFNBQVMsRUFBWixFQUNJLGNBQVksTUFBWixDQURKLEtBRUssSUFBRyxTQUFTLEdBQVosRUFDRCxhQUFXLE1BQVg7QUFDSixtQkFBTyxNQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OytDQUt1QixJLEVBQUs7QUFDeEIsZ0JBQUksTUFBTSxJQUFJLElBQUosQ0FBUyxJQUFULENBQVY7QUFDQSxnQkFBSSxRQUFRLElBQUksSUFBSixDQUFTLElBQUksV0FBSixFQUFULEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQVo7QUFDQSxnQkFBSSxPQUFPLE1BQU0sS0FBakI7QUFDQSxnQkFBSSxTQUFTLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBOUI7QUFDQSxnQkFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLE9BQU8sTUFBbEIsQ0FBVjtBQUNBLG1CQUFVLElBQUksV0FBSixFQUFWLFNBQStCLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBL0I7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxLQUFLLG1CQUFUO0FBQ0EsZ0JBQUksT0FBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLENBQVg7QUFDQSxnQkFBSSxZQUFZLElBQUksSUFBSixDQUFTLEtBQUss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LEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsYUFBNUQ7QUFDQSxvQkFBUSxNQUFSLENBQWUsT0FBSyxFQUFwQixFQUF3QixDQUFDLENBQUQsR0FBRyxJQUFJLEdBQUosRUFBUyxHQUFaLEdBQWdCLElBQWhCLEdBQXFCLEtBQTdDO0FBQ0EsbUJBQU0sSUFBRSxJQUFJLE1BQVosRUFBbUI7QUFDZix3QkFBTyxFQUFQO0FBQ0Esd0JBQVEsTUFBUixDQUFlLElBQWYsRUFBcUIsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsS0FBeEM7QUFDQSx3QkFBUSxVQUFSLENBQW1CLElBQUksQ0FBSixFQUFPLEdBQVAsR0FBVyxHQUE5QixFQUFtQyxJQUFuQyxFQUF5QyxDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixhQUE1RDtBQUNBO0FBQ0g7QUFDRCxvQkFBUSxNQUFSLENBQWUsT0FBSyxFQUFwQixFQUF3QixDQUFDLENBQUQsR0FBRyxJQUFJLEVBQUUsQ0FBTixFQUFTLEdBQVosR0FBZ0IsSUFBaEIsR0FBcUIsS0FBN0M7QUFDQSxvQkFBUSxTQUFSLEdBQW9CLE1BQXBCO0FBQ0Esb0JBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsS0FBM0M7QUFDQSxvQkFBUSxTQUFSOztBQUVBLG9CQUFRLFdBQVIsR0FBc0IsTUFBdEI7O0FBRUEsb0JBQVEsTUFBUjtBQUNBLG9CQUFRLElBQVI7QUFDSDs7O2lDQUVPO0FBQ0osaUJBQUssaUJBQUw7QUFDSDs7Ozs7O2tCQXZhZ0IsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAyOC4wOS4yMDE2LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8g0KDQsNCx0L7RgtCwINGBINC00LDRgtC+0LlcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRGF0ZSBleHRlbmRzIERhdGUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINC80LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINCz0L7QtNGDINCyINGC0YDQtdGF0YDQsNC30YDRj9C00L3QvtC1INGH0LjRgdC70L4g0LLQstC40LTQtSDRgdGC0YDQvtC60LhcclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbnVtYmVyIFvRh9C40YHQu9C+INC80LXQvdC10LUgOTk5XVxyXG4gICAgICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cclxuICAgICAqL1xyXG4gICAgbnVtYmVyRGF5c09mWWVhclhYWChudW1iZXIpe1xyXG4gICAgICAgIGlmKG51bWJlciA+IDM2NSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKG51bWJlciA8IDEwKVxyXG4gICAgICAgICAgICByZXR1cm4gYDAwJHtudW1iZXJ9YDtcclxuICAgICAgICBlbHNlIGlmKG51bWJlciA8IDEwMClcclxuICAgICAgICAgICAgcmV0dXJuIGAwJHtudW1iZXJ9YDtcclxuICAgICAgICByZXR1cm4gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXHJcbiAgICAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAgICAqIEByZXR1cm4ge2ludGVnZXJ9ICDQn9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINCyINCz0L7QtNGDXHJcbiAgICAgKi9cclxuICAgIGNvbnZlcnREYXRlVG9OdW1iZXJEYXkoZGF0ZSl7XHJcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcclxuICAgICAgICB2YXIgZGlmZiA9IG5vdyAtIHN0YXJ0O1xyXG4gICAgICAgIHZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xyXG4gICAgICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQv9GA0LXQvtC+0LHRgNCw0LfRg9C10YIg0LTQsNGC0YMg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPiDQsiB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGUg0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxyXG4gICAgICogQHJldHVybiB7ZGF0ZX0g0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS1tbS1kZFxyXG4gICAgICovXHJcbiAgICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpe1xyXG4gICAgICAgIHZhciByZSA9IC8oXFxkezR9KSgtKShcXGR7M30pLztcclxuICAgICAgICB2YXIgbGluZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICAgICAgdmFyIGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xyXG4gICAgICAgIHZhciB1bml4dGltZSA9IGJlZ2lueWVhci5nZXRUaW1lKCkgKyBsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKjI0O1xyXG4gICAgICAgIHZhciByZXMgPSBuZXcgRGF0ZSh1bml4dGltZSk7XHJcblxyXG4gICAgICAgIHZhciBtb250aCA9IHJlcy5nZXRNb250aCgpICsgMTtcclxuICAgICAgICB2YXIgZGF5cyA9IHJlcy5nZXREYXRlKCk7XHJcbiAgICAgICAgdmFyIHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICByZXR1cm4gYCR7ZGF5cyA8IDEwID8gYDAke2RheXN9YDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWA6IG1vbnRofS4ke3llYXJ9YDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQtNCw0YLRiyDQstC40LTQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgICAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgICAgKi9cclxuICAgIGZvcm1hdERhdGUoZGF0ZTEpe1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xyXG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHsobW9udGg8MTApP2AwJHttb250aH1gOiBtb250aH0tJHsoZGF5PDEwKT9gMCR7ZGF5fWA6IGRheX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgtC10LrRg9GJ0YPRjiDQvtGC0YTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90L3Rg9GOINC00LDRgtGDIHl5eXktbW0tZGRcclxuICAgICAqIEByZXR1cm4ge1tzdHJpbmddfSDRgtC10LrRg9GJ0LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50RGF0ZSgpe1xyXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQv9C+0YHQu9C10LTQvdC40LUg0YLRgNC4INC80LXRgdGP0YbQsFxyXG4gICAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCl7XHJcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCksIDAsIDApO1xyXG4gICAgICAgIHZhciBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICAgICAgdmFyIG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICAgICAgdmFyIGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcblxyXG4gICAgICAgIGRheSAtPTkwO1xyXG5cclxuICAgICAgICBpZihkYXkgPCAwICl7XHJcbiAgICAgICAgICAgIHllYXIgLT0xO1xyXG4gICAgICAgICAgICBkYXkgPSAzNjUgLSBkYXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICAgIGdldEN1cnJlbnRTdW1tZXJEYXRlKCl7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINGC0LXQutGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICAgIGdldEN1cnJlbnRTcHJpbmdEYXRlKCl7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xyXG4gICAgICAgIHZhciBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDUtMzFgKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xyXG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICAgIGdldExhc3RTdW1tZXJEYXRlKCl7XHJcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCktMTtcclxuICAgICAgICB2YXIgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICAgICAgdmFyIGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XHJcbiAgICAgICAgcmV0dXJuIFtkYXRlRnIsIGRhdGVUb107XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpe1xyXG4gICAgICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9LTAwMWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXHJcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRpbWVzdGFtcCBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHRpbWVzdGFtcFRvRGF0ZVRpbWUodW5peHRpbWUpe1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodW5peHRpbWUqMTAwMCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoKS5yZXBsYWNlKC8sLywnJykucmVwbGFjZSgvOlxcdyskLywnJyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBoaDptbV1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgICAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xyXG4gICAgICAgIHJldHVybiBgJHtob3VyczwxMD9gMCR7aG91cnN9YDpob3Vyc306JHttaW51dGVzPDEwP2AwJHttaW51dGVzfWA6bWludXRlc30gYDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxyXG4gICAgICogQHBhcmFtIHVuaXh0aW1lXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHVuaXh0aW1lKXtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lKjEwMDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlLmdldERheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxyXG4gICAgICogQHBhcmFtIGRheU51bWJlclxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKGRheU51bWJlcil7XHJcbiAgICAgICAgbGV0IGRheXMgPSB7XHJcbiAgICAgICAgICAgIDAgOiBcIlN1blwiLFxyXG4gICAgICAgICAgICAxIDogXCJNb25cIixcclxuICAgICAgICAgICAgMiA6IFwiVHVlXCIsXHJcbiAgICAgICAgICAgIDMgOiBcIldlZFwiLFxyXG4gICAgICAgICAgICA0IDogXCJUaHVcIixcclxuICAgICAgICAgICAgNSA6IFwiRnJpXCIsXHJcbiAgICAgICAgICAgIDYgOiBcIlNhdFwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGF5c1tkYXlOdW1iZXJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDQodGA0LDQstC90LXQvdC40LUg0LTQsNGC0Ysg0LIg0YTQvtGA0LzQsNGC0LUgZGQubW0ueXl5eSA9IGRkLm1tLnl5eXkg0YEg0YLQtdC60YPRidC40Lwg0LTQvdC10LxcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNvbXBhcmVEYXRlc1dpdGhUb2RheShkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgPT09IChuZXcgRGF0ZSgpKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKXtcclxuICAgICAgICBsZXQgcmUgPS8oXFxkezJ9KShcXC57MX0pKFxcZHsyfSkoXFwuezF9KShcXGR7NH0pLztcclxuICAgICAgICBsZXQgcmVzRGF0ZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICAgICAgaWYocmVzRGF0ZS5sZW5ndGggPT0gNil7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShgJHtyZXNEYXRlWzVdfS0ke3Jlc0RhdGVbM119LSR7cmVzRGF0ZVsxXX1gKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDQldGB0LvQuCDQtNCw0YLQsCDQvdC1INGA0LDRgdC/0LDRgNGB0LXQvdCwINCx0LXRgNC10Lwg0YLQtdC60YPRidGD0Y5cclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBDdXN0b21EYXRlIGZyb20gXCIuL2N1c3RvbS1kYXRlXCI7XHJcblxyXG4vKipcclxuINCT0YDQsNGE0LjQuiDRgtC10LzQv9C10YDQsNGC0YPRgNGLINC4INC/0L7Qs9C+0LTRi1xyXG4gQGNsYXNzIEdyYXBoaWNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXBoaWMgZXh0ZW5kcyBDdXN0b21EYXRle1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICAgICAgKiBbbGluZSBkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbiA9IGQzLmxpbmUoKVxyXG4gICAgICAgICAgICAueChmdW5jdGlvbihkKXtyZXR1cm4gZC54O30pXHJcbiAgICAgICAgICAgIC55KGZ1bmN0aW9uKGQpe3JldHVybiBkLnk7fSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC10L7QsdGA0LDQt9GD0LXQvCDQvtCx0YrQtdC60YIg0LTQsNC90L3Ri9GFINCyINC80LDRgdGB0LjQsiDQtNC70Y8g0YTQvtGA0LzQuNGA0L7QstCw0L3QuNGPINCz0YDQsNGE0LjQutCwXHJcbiAgICAgKiBAcGFyYW0gIHtbYm9vbGVhbl19IHRlbXBlcmF0dXJlIFvQv9GA0LjQt9C90LDQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgIHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAgICAqL1xyXG4gICAgcHJlcGFyZURhdGEoKXtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgbGV0IHJhd0RhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZGF0YS5mb3JFYWNoKChlbGVtKT0+e1xyXG4gICAgICAgICAgICAvL3Jhd0RhdGEucHVzaCh7eDogaSwgZGF0ZTogdGhpcy5jb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShlbGVtLmRhdGUpLCBtYXhUOiBlbGVtLm1heCwgIG1pblQ6IGVsZW0ubWlufSk7XHJcbiAgICAgICAgICAgIHJhd0RhdGEucHVzaCh7eDogaSwgZGF0ZTogaSoxMCwgbWF4VDogZWxlbS5tYXgsICBtaW5UOiBlbGVtLm1pbn0pO1xyXG4gICAgICAgICAgICBpICs9MTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByYXdEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10Lwg0LjQt9C+0LHRgNCw0LbQtdC90LjQtSDRgSDQutC+0L3RgtC10LrRgdGC0L7QvCDQvtCx0YrQtdC60YLQsCBzdmdcclxuICAgICAqIFttYWtlU1ZHIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19XHJcbiAgICAgKi9cclxuICAgIG1ha2VTVkcoKXtcclxuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXNcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB0aGlzLnBhcmFtcy53aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5wYXJhbXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiI2ZmZmZmZlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xyXG4gICAgICogW2dldE1pbk1heERhdGUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cclxuICAgICAqL1xyXG4gICAgZ2V0TWluTWF4RGF0ZShyYXdEYXRhKXtcclxuXHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgIG1heERhdGUgOiBuZXcgRGF0ZSgnMTkwMC0wMS0wMSAwMDowMDowMCcpLFxyXG4gICAgICAgICAgICBtaW5EYXRlIDogbmV3IERhdGUoJzI1MDAtMDEtMDEgMDA6MDA6MDAnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heERhdGUgPD0gZWxlbS5kYXRlKSBkYXRhLm1heERhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluRGF0ZSA+PSBlbGVtLmRhdGUpIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNCw0YIg0Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1tvYmplY3RdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG5cclxuICAgIGdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpe1xyXG5cclxuICAgICAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgbWluIDogMTAwLFxyXG4gICAgICAgICAgICBtYXggOiAwXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0ubWluVClcclxuICAgICAgICAgICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xyXG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLm1heFQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0ubWF4VDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIFtnZXRNaW5NYXhXZWF0aGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSl7XHJcblxyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICBtaW4gOiAwLFxyXG4gICAgICAgICAgICBtYXggOiAwXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdEYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0ucmFpbmZhbGxBbW91bnQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0uaHVtaWRpdHkpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0uaHVtaWRpdHk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpXHJcbiAgICAgICAgICAgICAgICBkYXRhLm1heCA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC00LvQuNC90YMg0L7RgdC10LkgWCxZXHJcbiAgICAgKiBbbWFrZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9Cc0LDRgdGB0LjQsiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1tmdW5jdGlvbl19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcyl7XHJcblxyXG4gICAgICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFg9INGI0LjRgNC40L3QsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQu9C10LLQsCDQuCDRgdC/0YDQsNCy0LBcclxuICAgICAgICBsZXQgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAyICogcGFyYW1zLm1hcmdpbjtcclxuICAgICAgICAvLyDQtNC70LjQvdCwINC+0YHQuCBZID0g0LLRi9GB0L7RgtCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdCy0LXRgNGF0YMg0Lgg0YHQvdC40LfRg1xyXG4gICAgICAgIGxldCB5QXhpc0xlbmd0aCA9IHBhcmFtcy5oZWlnaHQgLSAyICogcGFyYW1zLm1hcmdpbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdC4INClINC4IFlcclxuICAgICAqIFtzY2FsZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0geEF4aXNMZW5ndGggW9C40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWF1cclxuICAgICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB5QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAgICAqIEByZXR1cm4ge1thcnJheV19ICAgICAgICAgICAgICBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqL1xyXG4gICAgc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyl7XHJcblxyXG4gICAgICAgIGxldCB7bWF4RGF0ZSwgbWluRGF0ZX0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICAgICAgICogW3NjYWxlVGltZSBkZXNjcmlwdGlvbl1cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcclxuICAgICAgICAgKiBbc2NhbGVMaW5lYXIgZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbWF4KzUsIG1pbi01XSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGRhdGEucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICAgICAgICAgIG1heFQ6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgICAgICAgICBtaW5UOiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRYfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7c2NhbGVYOiBzY2FsZVgsIHNjYWxlWTogc2NhbGVZLCBkYXRhOiBkYXRhfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVBeGVzWFlXZWF0aGVyKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgbWFyZ2luKXtcclxuXHJcbiAgICAgICAgbGV0IHttYXhEYXRlLCBtaW5EYXRlfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgICAgICBsZXQge21pbiwgbWF4fSA9IHRoaXMuZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcclxuICAgICAgICB2YXIgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbmV3IERhdGUobWluRGF0ZSksIG5ldyBEYXRlKG1heERhdGUpXSlcclxuICAgICAgICAgICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgICAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBZXHJcbiAgICAgICAgdmFyIHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgICAgICAgICAgLmRvbWFpbihbbWF4LCBtaW5dKVxyXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcclxuICAgICAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIG1hcmdpbiwgaHVtaWRpdHk6IHNjYWxlWShlbGVtLmh1bWlkaXR5KSArIG1hcmdpbiwgcmFpbmZhbGxBbW91bnQ6IHNjYWxlWShlbGVtLnJhaW5mYWxsQW1vdW50KSArIG1hcmdpbiAgLCBjb2xvcjogZWxlbS5jb2xvcn0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4ge3NjYWxlWDogc2NhbGVYLCBzY2FsZVk6IHNjYWxlWSwgZGF0YTogZGF0YX07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XHJcbiAgICAgKiBbbWFrZVBvbHlsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gZGF0YSBb0LzQsNGB0YHQuNCyINGBINC40L3RgtC10YDQv9C+0LvQuNGA0L7QstCw0L3QvdGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuF1cclxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHBhcmFtICB7W29iamVjdF19IHNjYWxlWCwgc2NhbGVZIFvQvtCx0YrQtdC60YLRiyDRgSDRhNGD0L3QutGG0LjRj9C80Lgg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4IFgsWV1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gIFtkZXNjcmlwdGlvbl1cclxuICAgICAqL1xyXG4gICAgbWFrZVBvbHlsaW5lKGRhdGEsIHBhcmFtcywgc2NhbGVYLCBzY2FsZVkpe1xyXG5cclxuICAgICAgICBsZXQgYXJyUG9seWxpbmUgPSBbXTtcclxuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRhdGEucmV2ZXJzZSgpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgYXJyUG9seWxpbmUucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCwgeTogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFyclBvbHlsaW5lLnB1c2goe3g6IHNjYWxlWChkYXRhW2RhdGEubGVuZ3RoLTFdWydkYXRlJ10pICsgcGFyYW1zLm9mZnNldFgsIHk6IHNjYWxlWShkYXRhW2RhdGEubGVuZ3RoLTFdWydtYXhUJ10pICsgcGFyYW1zLm9mZnNldFl9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFyclBvbHlsaW5lO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC/0L7Qu9C40LvQuNC90LjQuSDRgSDQt9Cw0LvQuNCy0LrQvtC5INC+0YHQvdC+0LLQvdC+0Lkg0Lgg0LjQvNC40YLQsNGG0LjRjyDQtdC1INGC0LXQvdC4XHJcbiAgICAgKiBbZHJhd1BvbHVsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBzdmcgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgICBkcmF3UG9seWxpbmUoc3ZnLCBkYXRhKXtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0L/Rg9GC0Ywg0Lgg0YDQuNGB0YPQtdC8INC70LjQvdC40LhcclxuXHJcbiAgICAgICAgc3ZnLmFwcGVuZChcImdcIikuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy5wYXJhbXMuc3Ryb2tlV2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgdGhpcy5wYXJhbXMuY29sb3JQb2xpbHluZSlcclxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgIGRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHBhcmFtcyl7XHJcblxyXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSk9PntcclxuXHJcbiAgICAgICAgICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDRgtC10LrRgdGC0LBcclxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBlbGVtLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZWxlbS5tYXhUIC0gcGFyYW1zLm9mZnNldFgvMi0yKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnRleHQocGFyYW1zLmRhdGFbaXRlbV0ubWF4KyfCsCcpO1xyXG5cclxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBlbGVtLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZWxlbS5taW5UICsgcGFyYW1zLm9mZnNldFkvMis3KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAgICAgICAgICAgLnRleHQocGFyYW1zLmRhdGFbaXRlbV0ubWluKyfCsCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQtNC40YHQv9C10YLRh9C10YAg0L/RgNC+0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YHQviDQstGB0LXQvNC4INGN0LvQtdC80LXQvdGC0LDQvNC4XHJcbiAgICAgKiBbcmVuZGVyIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBsZXQgc3ZnID0gdGhpcy5tYWtlU1ZHKCk7XHJcbiAgICAgICAgbGV0IHJhd0RhdGEgPSB0aGlzLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgICAgIGxldCB7c2NhbGVYLCBzY2FsZVksIGRhdGF9ID0gIHRoaXMubWFrZUF4ZXNYWShyYXdEYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICAgICAgbGV0IHBvbHlsaW5lID0gdGhpcy5tYWtlUG9seWxpbmUocmF3RGF0YSwgdGhpcy5wYXJhbXMsIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICB0aGlzLmRyYXdQb2x5bGluZShzdmcsIHBvbHlsaW5lKTtcclxuICAgICAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcclxuICAgICAgICAvL3RoaXMuZHJhd01hcmtlcnMoc3ZnLCBwb2x5bGluZSwgdGhpcy5tYXJnaW4pO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiIsIi8vINCc0L7QtNGD0LvRjCDQtNC40YHQv9C10YLRh9C10YAg0LTQu9GPINC+0YLRgNC40YHQvtCy0LrQuCDQsdCw0L3QvdC10YDRgNC+0LIg0L3QsCDQutC+0L3RgdGC0YDRg9C60YLQvtGA0LVcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvL9Ck0L7RgNC80LjRgNGD0LXQvCDQv9Cw0YDQsNC80LXRgtGAINGE0LjQu9GM0YLRgNCwINC/0L4g0LPQvtGA0L7QtNGDXHJcbiAgICBsZXQgcSA9ICcnO1xyXG4gICAgaWYod2luZG93LmxvY2F0aW9uLnNlYXJjaClcclxuICAgICAgICBxID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgIGVsc2VcclxuICAgICAgICBxID0gXCI/cT1Mb25kb25cIjtcclxuXHJcbiAgICBsZXQgdXJsRG9tYWluID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xyXG5cclxuICAgIGxldCBwYXJhbXNXaWRnZXQgPSB7XHJcbiAgICAgICAgY2l0eU5hbWU6ICdNb3Njb3cnLFxyXG4gICAgICAgIGxhbmc6ICdlbicsXHJcbiAgICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgICAgdW5pdHM6ICdtZXRyaWMnLFxyXG4gICAgICAgIHRleHRVbml0VGVtcDogJyYxNzY7J1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgY29udHJvbHNXaWRnZXQgPSB7XHJcbiAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2lkZ2V0LWRhcmstbWVudV9faGVhZGVyXCIpLFxyXG4gICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItZGFyay1jYXJkX19udW1iZXJcIiksXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1kYXJrLWNhcmRfX21lYW5zXCIpLFxyXG4gICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWRhcmstY2FyZF9fd2luZFwiKSxcclxuICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1kYXJrLWNhcmRfX2ltZ1wiKSxcclxuICAgICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FsZW5kYXJfX2l0ZW1cIiksXHJcbiAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaGljXCIpXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB1cmxzID0ge1xyXG4gICAgICAgIHVybFdlYXRoZXJBUEk6IGAke3VybERvbWFpbn0vZGF0YS8yLjUvd2VhdGhlciR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt1cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5JHtxfSZ1bml0cz0ke3BhcmFtc1dpZGdldC51bml0c30mY250PTgmYXBwaWQ9JHtwYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgICAgICB3aW5kU3BlZWQ6IFwiZGF0YS93aW5kLXNwZWVkLWRhdGEuanNvblwiLFxyXG4gICAgICAgIHdpbmREaXJlY3Rpb246IFwiZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25cIixcclxuICAgICAgICBjbG91ZHM6IFwiZGF0YS9jbG91ZHMtZGF0YS5qc29uXCIsXHJcbiAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IFwiZGF0YS9uYXR1cmFsLXBoZW5vbWVub24tZGF0YS5qc29uXCJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvYmpXaWRnZXQgPSBuZXcgV2VhdGhlcldpZGdldChwYXJhbXNXaWRnZXQsIGNvbnRyb2xzV2lkZ2V0LCB1cmxzKTtcclxuICAgIHZhciBqc29uRnJvbUFQSSA9IG9ialdpZGdldC5yZW5kZXIoKTtcclxuXHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSBcIi4vY3VzdG9tLWRhdGVcIjtcclxuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VhdGhlcldpZGdldCBleHRlbmRzIEN1c3RvbURhdGV7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XHJcbiAgICAgICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAgICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQvtCx0YrQtdC60YIg0L/Rg9GB0YLRi9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhcclxuICAgICAgICB0aGlzLndlYXRoZXIgPSB7XHJcbiAgICAgICAgICAgIFwiZnJvbUFQSVwiOlxyXG4gICAgICAgICAgICB7XCJjb29yZFwiOntcclxuICAgICAgICAgICAgICAgIFwibG9uXCI6XCIwXCIsXHJcbiAgICAgICAgICAgICAgICBcImxhdFwiOlwiMFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjpbe1wiaWRcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm1haW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpY29uXCI6XCJcIlxyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICBcImJhc2VcIjpcIiBcIixcclxuICAgICAgICAgICAgICAgIFwibWFpblwiOntcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBcIjogMCxcclxuICAgICAgICAgICAgICAgICAgICBcInByZXNzdXJlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJodW1pZGl0eVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9taW5cIjpcIiBcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRlbXBfbWF4XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcIndpbmRcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJzcGVlZFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGVnXCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcInJhaW5cIjp7fSxcclxuICAgICAgICAgICAgICAgIFwiY2xvdWRzXCI6e1wiYWxsXCI6XCIgXCJ9LFxyXG4gICAgICAgICAgICAgICAgXCJkdFwiOmBgLFxyXG4gICAgICAgICAgICAgICAgXCJzeXNcIjp7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY291bnRyeVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VucmlzZVwiOlwiIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3Vuc2V0XCI6XCIgXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjpcIlVuZGVmaW5lZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2RcIjpcIiBcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0LXRgNGC0LrQsCDQvtCx0LXRidC10L3QuNC1INC00LvRjyDQsNGB0LjQvdGF0YDQvtC90L3Ri9GFINC30LDQv9GA0L7RgdC+0LJcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICovXHJcbiAgICBodHRwR2V0KHVybCl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHRoYXQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZChudWxsKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgICAqL1xyXG4gICAgZ2V0V2VhdGhlckZyb21BcGkoKXtcclxuICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnVybFdlYXRoZXJBUEkpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mcm9tQVBJID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uID0gcmVzcG9uc2VbdGhpcy5wYXJhbXMubGFuZ11bXCJkZXNjcmlwdGlvblwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLndpbmRTcGVlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHJlc3BvbnNlW3RoaXMucGFyYW1zLmxhbmddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgICAqIEBwYXJhbSAge29iamVjdH0gSlNPTlxyXG4gICAgICogQHBhcmFtICB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gINCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAgICovXHJcbiAgICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKXtcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqZWN0KXtcclxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09IFwib2JqZWN0XCIgJiYgZWxlbWVudE5hbWUyID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMF0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LAg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgICAgICAgIGVsc2UgaWYoZWxlbWVudE5hbWUyICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxyXG4gICAgICogQHBhcmFtIGpzb25EYXRhXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xyXG4gICAgcGFyc2VEYXRhRnJvbVNlcnZlcigpe1xyXG5cclxuICAgICAgICBsZXQgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICAgICAgaWYod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09IFwiVW5kZWZpbmVkXCIgfHwgd2VhdGhlci5mcm9tQVBJLmNvZCA9PT0gXCI0MDRcIil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBuYXR1cmFsUGhlbm9tZW5vbiA9IGBgO1xyXG4gICAgICAgIHZhciB3aW5kU3BlZWQgPSBgYDtcclxuICAgICAgICB2YXIgd2luZERpcmVjdGlvbiA9IGBgO1xyXG4gICAgICAgIHZhciBjbG91ZHMgPSBgYDtcclxuXHJcbiAgICAgICAgLy/QmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxyXG4gICAgICAgIHZhciBtZXRhZGF0YSA9IHtcclxuICAgICAgICAgICAgY2xvdWRpbmVzczogYCBgLFxyXG4gICAgICAgICAgICBkdCA6IGAgYCxcclxuICAgICAgICAgICAgY2l0eU5hbWUgOiAgYCBgLFxyXG4gICAgICAgICAgICBpY29uIDogYCBgLFxyXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZSA6IGAgYCxcclxuICAgICAgICAgICAgcHJlc3N1cmUgOiAgYCBgLFxyXG4gICAgICAgICAgICBodW1pZGl0eSA6IGAgYCxcclxuICAgICAgICAgICAgc3VucmlzZSA6IGAgYCxcclxuICAgICAgICAgICAgc3Vuc2V0IDogYCBgLFxyXG4gICAgICAgICAgICBjb29yZCA6IGAgYCxcclxuICAgICAgICAgICAgd2luZDogYCBgLFxyXG4gICAgICAgICAgICB3ZWF0aGVyOiBgIGBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5jaXR5TmFtZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5uYW1lfSwgJHt3ZWF0aGVyLmZyb21BUEkuc3lzLmNvdW50cnl9YDtcclxuICAgICAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IGAke3dlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXAudG9GaXhlZCgwKSA+IDAgPyBgKyR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWAgOiB3ZWF0aGVyLmZyb21BUEkubWFpbi50ZW1wLnRvRml4ZWQoMCl9YDtcclxuICAgICAgICBpZih3ZWF0aGVyLm5hdHVyYWxQaGVub21lbm9uKVxyXG4gICAgICAgICAgICBtZXRhZGF0YS53ZWF0aGVyID0gd2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vblt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pZF07XHJcbiAgICAgICAgaWYod2VhdGhlcltcIndpbmRTcGVlZFwiXSlcclxuICAgICAgICAgICAgbWV0YWRhdGEud2luZFNwZWVkID0gYFdpbmQ6ICR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wic3BlZWRcIl0udG9GaXhlZCgxKX0gIG0vcyAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kU3BlZWRcIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcInNwZWVkXCJdLnRvRml4ZWQoMSksIFwic3BlZWRfaW50ZXJ2YWxcIil9YDtcclxuICAgICAgICBpZih3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSlcclxuICAgICAgICAgICAgbWV0YWRhdGEud2luZERpcmVjdGlvbiA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJ3aW5kRGlyZWN0aW9uXCJdLCB3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJkZWdcIl0sIFwiZGVnX2ludGVydmFsXCIpfSAoICR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdfSApYFxyXG4gICAgICAgIGlmKHdlYXRoZXJbXCJjbG91ZHNcIl0pXHJcbiAgICAgICAgICAgIG1ldGFkYXRhLmNsb3VkcyA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJjbG91ZHNcIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wiY2xvdWRzXCJdW1wiYWxsXCJdLCBcIm1pblwiLCBcIm1heFwiKX1gO1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5pY29uID0gYCR7d2VhdGhlcltcImZyb21BUElcIl1bXCJ3ZWF0aGVyXCJdWzBdW1wiaWNvblwiXX1gO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJXaWRnZXQobWV0YWRhdGEpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcmVuZGVyV2lkZ2V0KG1ldGFkYXRhKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBgPHNwYW4+V2VhdGhlciBmb3I8L3NwYW4+ICR7bWV0YWRhdGEuY2l0eU5hbWV9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEudGVtcGVyYXR1cmUrXCI8c3BhbiBjbGFzcz0nd2VhdGhlci1jYXJkX19kZWdyZWUnPlwiK3RoaXMucGFyYW1zLnRleHRVbml0VGVtcCtcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5hbHQgPSBgV2VhdGhlciBpbiAke21ldGFkYXRhLmNpdHlOYW1lID8gbWV0YWRhdGEuY2l0eU5hbWUgOiAnJ31gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihtZXRhZGF0YS53ZWF0aGVyLnRyaW0oKSlcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKXtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgaWYobWV0YWRhdGEud2luZFNwZWVkLnRyaW0oKSlcclxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZCl7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkpXHJcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpe1xyXG4gICAgICAgIHZhciBhcnIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgZGF5ID0gdGhpcy5nZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIodGhpcy5nZXROdW1iZXJEYXlJbldlZWtCeVVuaXhUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpKTtcclxuICAgICAgICAgICAgYXJyLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgJ21pbic6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXHJcbiAgICAgICAgICAgICAgICAnbWF4JzogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcclxuICAgICAgICAgICAgICAgICdkYXknOiAoZWxlbSAhPSAwKSA/IGRheSA6ICdUb2RheScsXHJcbiAgICAgICAgICAgICAgICAnaWNvbic6IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGUnOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kcmF3R3JhcGhpY0QzKGFycik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XHJcbiAgICAgKiBAcGFyYW0gZGF0YVxyXG4gICAgICovXHJcbiAgICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaW5kZXgsZGF0YSl7XHJcbiAgICAgICAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YFxyXG4gICAgICAgICAgICB0aGF0LmNvbnRyb2xzLmNhbGVuZGFySXRlbVtpbmRleCsxMF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmBcclxuICAgICAgICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXgrMjBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VVJMTWFpbkljb24obmFtZUljb24sIGNvbG9yID0gZmFsc2Upe1xyXG4gICAgICAgIC8vINCh0L7Qt9C00LDQtdC8INC4INC40L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQsNGA0YLRgyDRgdC+0L/QvtGB0YLQsNCy0LvQtdC90LjQuVxyXG4gICAgICAgIHZhciBtYXBJY29ucyA9ICBuZXcgTWFwKCk7XHJcblxyXG4gICAgICAgIGlmKCFjb2xvcikge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAxZCcsICcwMWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAyZCcsICcwMmRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzAzZCcsICcwM2RidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA0ZCcsICcwNGRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA1ZCcsICcwNWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA2ZCcsICcwNmRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA3ZCcsICcwN2RidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA4ZCcsICcwOGRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzA5ZCcsICcwOWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzEwZCcsICcxMGRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzExZCcsICcxMWRidycpO1xyXG4gICAgICAgICAgICBtYXBJY29ucy5zZXQoJzEzZCcsICcxM2RidycpO1xyXG4gICAgICAgICAgICAvLyDQndC+0YfQvdGL0LVcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwMW4nLCAnMDFkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwMm4nLCAnMDJkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwM24nLCAnMDNkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNG4nLCAnMDRkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNW4nLCAnMDVkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwNm4nLCAnMDZkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwN24nLCAnMDdkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwOG4nLCAnMDhkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcwOW4nLCAnMDlkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxMG4nLCAnMTBkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxMW4nLCAnMTFkYncnKTtcclxuICAgICAgICAgICAgbWFwSWNvbnMuc2V0KCcxM24nLCAnMTNkYncnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgaW1nLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gYGltZy8ke25hbWVJY29ufS5wbmdgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgICAqL1xyXG4gICAgZHJhd0dyYXBoaWNEMyhkYXRhKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSk7XHJcblxyXG4gICAgICAgIC8v0J/QsNGA0LDQvNC10YLRgNC40LfRg9C10Lwg0L7QsdC70LDRgdGC0Ywg0L7RgtGA0LjRgdC+0LLQutC4INCz0YDQsNGE0LjQutCwXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICAgICAgaWQ6IFwiI2dyYXBoaWNcIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgICAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICAgICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgY29sb3JQb2xpbHluZTogXCIjMzMzXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcclxuICAgICAgICAgICAgZm9udENvbG9yOiBcIiMzMzNcIixcclxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IFwiMXB4XCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCg0LXQutC+0L3RgdGC0YDRg9C60YbQuNGPINC/0YDQvtGG0LXQtNGD0YDRiyDRgNC10L3QtNC10YDQuNC90LPQsCDQs9GA0LDRhNC40LrQsCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXHJcbiAgICAgICAgbGV0IG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICAgICAgcGFyYW1zLmlkID0gXCIjZ3JhcGhpYzFcIjtcclxuICAgICAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9IFwiI0RERjczMFwiO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgcGFyYW1zLmlkID0gXCIjZ3JhcGhpYzJcIjtcclxuICAgICAgICBwYXJhbXMuY29sb3JQb2xpbHluZSA9IFwiI0ZFQjAyMFwiO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xyXG4gICAgICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAgICovXHJcbiAgICBkcmF3R3JhcGhpYyhhcnIpe1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhhcnIpO1xyXG5cclxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy53aWR0aD0gNDY1O1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZ3JhcGhpYy5oZWlnaHQgPSA3MDtcclxuXHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsMCw2MDAsMzAwKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5mb250ID0gXCJPc3dhbGQtTWVkaXVtLCBBcmlhbCwgc2Fucy1zZXJpIDE0cHhcIjtcclxuXHJcbiAgICAgICAgdmFyIHN0ZXAgPSA1NTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgdmFyIHpvb20gPSA0O1xyXG4gICAgICAgIHZhciBzdGVwWSA9IDY0O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHRVcCA9IDU4O1xyXG4gICAgICAgIHZhciBzdGVwWVRleHREb3duID0gNzU7XHJcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XHJcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIHdoaWxlKGk8YXJyLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5tYXgqem9vbStzdGVwWSlcclxuICAgICAgICBzdGVwID0gNTU7XHJcbiAgICAgICAgaSA9IDAgO1xyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKHN0ZXAtMTAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZVGV4dERvd24pO1xyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1pbip6b29tK3N0ZXBZKTtcclxuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gICAgICAgICAgICBzdGVwICs9NTU7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWVRleHREb3duKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbLS1pXS5taW4qem9vbStzdGVwWSk7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xyXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuXHJcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgICB9O1xyXG5cclxufVxyXG4iXX0=
