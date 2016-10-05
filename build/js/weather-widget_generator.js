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
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "full";


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvZ2VuZXJhdG9yL2N1c3RvbS1kYXRlLmpzIiwiYXNzZXRzL2pzL2dlbmVyYXRvci9ncmFwaGljLWQzanMuanMiLCJhc3NldHMvanMvZ2VuZXJhdG9yL3NjcmlwdC5qcyIsImFzc2V0cy9qcy9nZW5lcmF0b3Ivd2VhdGhlci13aWRnZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FBR0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0lBQ3FCLFU7OztBQUVqQiwwQkFBYTtBQUFBOztBQUFBO0FBRVo7O0FBRUQ7Ozs7Ozs7Ozs0Q0FLb0IsTSxFQUFPO0FBQ3ZCLGdCQUFHLFNBQVMsR0FBWixFQUFpQixPQUFPLEtBQVA7QUFDakIsZ0JBQUcsU0FBUyxFQUFaLEVBQ0ksY0FBWSxNQUFaLENBREosS0FFSyxJQUFHLFNBQVMsR0FBWixFQUNELGFBQVcsTUFBWDtBQUNKLG1CQUFPLE1BQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7K0NBS3VCLEksRUFBSztBQUN4QixnQkFBSSxNQUFNLElBQUksSUFBSixDQUFTLElBQVQsQ0FBVjtBQUNBLGdCQUFJLFFBQVEsSUFBSSxJQUFKLENBQVMsSUFBSSxXQUFKLEVBQVQsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBWjtBQUNBLGdCQUFJLE9BQU8sTUFBTSxLQUFqQjtBQUNBLGdCQUFJLFNBQVMsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUE5QjtBQUNBLGdCQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsT0FBTyxNQUFsQixDQUFWO0FBQ0EsbUJBQVUsSUFBSSxXQUFKLEVBQVYsU0FBK0IsS0FBSyxtQkFBTCxDQUF5QixHQUF6QixDQUEvQjtBQUNIOztBQUVEOzs7Ozs7OzsrQ0FLdUIsSSxFQUFLO0FBQ3hCLGdCQUFJLEtBQUssbUJBQVQ7QUFDQSxnQkFBSSxPQUFPLEdBQUcs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R0FBZ0IsSUFBaEIsR0FBcUIsS0FBN0M7QUFDQSxvQkFBUSxTQUFSLEdBQW9CLE1BQXBCO0FBQ0Esb0JBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsS0FBM0M7QUFDQSxvQkFBUSxTQUFSOztBQUVBLG9CQUFRLFdBQVIsR0FBc0IsTUFBdEI7O0FBRUEsb0JBQVEsTUFBUjtBQUNBLG9CQUFRLElBQVI7QUFDSDs7O2lDQUVPO0FBQ0osaUJBQUssaUJBQUw7QUFDSDs7Ozs7O2tCQWxaZ0IsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyDQoNCw0LHQvtGC0LAg0YEg0LTQsNGC0L7QuVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tRGF0ZSBleHRlbmRzIERhdGUge1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBudW1iZXIgW9GH0LjRgdC70L4g0LzQtdC90LXQtSA5OTldXG4gICAgICogQHJldHVybiB7W3N0cmluZ119ICAgICAgICBb0YLRgNC10YXQt9C90LDRh9C90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4INC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRg11cbiAgICAgKi9cbiAgICBudW1iZXJEYXlzT2ZZZWFyWFhYKG51bWJlcil7XG4gICAgICAgIGlmKG51bWJlciA+IDM2NSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZihudW1iZXIgPCAxMClcbiAgICAgICAgICAgIHJldHVybiBgMDAke251bWJlcn1gO1xuICAgICAgICBlbHNlIGlmKG51bWJlciA8IDEwMClcbiAgICAgICAgICAgIHJldHVybiBgMCR7bnVtYmVyfWA7XG4gICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXG4gICAgICogQHBhcmFtICB7ZGF0ZX0gZGF0ZSDQlNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXG4gICAgICogQHJldHVybiB7aW50ZWdlcn0gINCf0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0LIg0LPQvtC00YNcbiAgICAgKi9cbiAgICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpe1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcbiAgICAgICAgdmFyIG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xuICAgICAgICByZXR1cm4gYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQnNC10YLQvtC0INC/0YDQtdC+0L7QsdGA0LDQt9GD0LXRgiDQtNCw0YLRgyDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+INCyIHl5eXktbW0tZGRcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGUg0LTQsNGC0LAg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxuICAgICAqIEByZXR1cm4ge2RhdGV9INC00LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcbiAgICAgKi9cbiAgICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpe1xuICAgICAgICB2YXIgcmUgPSAvKFxcZHs0fSkoLSkoXFxkezN9KS87XG4gICAgICAgIHZhciBsaW5lID0gcmUuZXhlYyhkYXRlKTtcbiAgICAgICAgdmFyIGJlZ2lueWVhciA9IG5ldyBEYXRlKGxpbmVbMV0pO1xuICAgICAgICB2YXIgdW5peHRpbWUgPSBiZWdpbnllYXIuZ2V0VGltZSgpICsgbGluZVszXSAqIDEwMDAgKiA2MCAqIDYwICoyNDtcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBEYXRlKHVuaXh0aW1lKTtcblxuICAgICAgICB2YXIgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgIHZhciBkYXlzID0gcmVzLmdldERhdGUoKTtcbiAgICAgICAgdmFyIHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgcmV0dXJuIGAke2RheXMgPCAxMCA/IGAwJHtkYXlzfWA6IGRheXN9LiR7bW9udGggPCAxMCA/IGAwJHttb250aH1gOiBtb250aH0uJHt5ZWFyfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNGPINC00LDRgtGLINCy0LjQtNCwIHl5eXktPG51bWJlciBkYXkgaW4geWVhcj5cbiAgICAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAg0LTQsNGC0LAg0LLQstC40LTQtSDRgdGC0YDQvtC60Lgg0YTQvtGA0LzQsNGC0LAgeXl5eS08bnVtYmVyIGRheSBpbiB5ZWFyPlxuICAgICAqL1xuICAgIGZvcm1hdERhdGUoZGF0ZTEpe1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGUxKTtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKTtcblxuICAgICAgICByZXR1cm4gYCR7eWVhcn0tJHsobW9udGg8MTApP2AwJHttb250aH1gOiBtb250aH0tJHsoZGF5PDEwKT9gMCR7ZGF5fWA6IGRheX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXG4gICAgICogQHJldHVybiB7W3N0cmluZ119INGC0LXQutGD0YnQsNGPINC00LDRgtCwXG4gICAgICovXG4gICAgZ2V0Q3VycmVudERhdGUoKXtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcbiAgICB9XG5cbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQv9C+0YHQu9C10LTQvdC40LUg0YLRgNC4INC80LXRgdGP0YbQsFxuICAgIGdldERhdGVMYXN0VGhyZWVNb250aCgpe1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCAwLCAwKTtcbiAgICAgICAgdmFyIGRpZmYgPSBub3cgLSBzdGFydDtcbiAgICAgICAgdmFyIG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgICAgIHZhciBkYXkgPSBNYXRoLmZsb29yKGRpZmYgLyBvbmVEYXkpO1xuXG4gICAgICAgIGRheSAtPTkwO1xuXG4gICAgICAgIGlmKGRheSA8IDAgKXtcbiAgICAgICAgICAgIHllYXIgLT0xO1xuICAgICAgICAgICAgZGF5ID0gMzY1IC0gZGF5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LSR7dGhpcy5udW1iZXJEYXlzT2ZZZWFyWFhYKGRheSl9YDtcbiAgICB9XG5cbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXG4gICAgZ2V0Q3VycmVudFN1bW1lckRhdGUoKXtcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDYtMDFgKTtcbiAgICAgICAgdmFyIGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wOC0zMWApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcbiAgICB9XG5cbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXG4gICAgZ2V0Q3VycmVudFNwcmluZ0RhdGUoKXtcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBkYXRlRnIgPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDMtMDFgKTtcbiAgICAgICAgdmFyIGRhdGVUbyA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNS0zMWApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGAke2RhdGVGcn0gICR7ZGF0ZVRvfWApO1xuICAgICAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcbiAgICB9XG5cbiAgICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+INC70LXRgtCwXG4gICAgZ2V0TGFzdFN1bW1lckRhdGUoKXtcbiAgICAgICAgdmFyIHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCktMTtcbiAgICAgICAgdmFyIGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wNi0wMWApO1xuICAgICAgICB2YXIgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA4LTMxYCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coYCR7ZGF0ZUZyfSAgJHtkYXRlVG99YCk7XG4gICAgICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xuICAgIH1cblxuICAgIGdldEZpcnN0RGF0ZUN1clllYXIoKXtcbiAgICAgICAgcmV0dXJuIGAke25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX0tMDAxYDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGRkLm1tLnl5eXkgaGg6bW1dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICB0aW1lc3RhbXBUb0RhdGVUaW1lKHVuaXh0aW1lKXtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcbiAgICAgICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcoKS5yZXBsYWNlKC8sLywnJykucmVwbGFjZSgvOlxcdyskLywnJyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBbdGltZXN0YW1wVG9EYXRlIHVuaXh0aW1lIHRvIGhoOm1tXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgdGltZXN0YW1wVG9UaW1lKHVuaXh0aW1lKXtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSoxMDAwKTtcbiAgICAgICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuICAgICAgICB2YXIgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgICAgICByZXR1cm4gYCR7aG91cnM8MTA/YDAke2hvdXJzfWA6aG91cnN9OiR7bWludXRlczwxMD9gMCR7bWludXRlc31gOm1pbnV0ZXN9IGA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDQktC+0LfRgNCw0YnQtdC90LjQtSDQvdC+0LzQtdGA0LAg0LTQvdGPINCyINC90LXQtNC10LvQtSDQv9C+IHVuaXh0aW1lIHRpbWVzdGFtcFxuICAgICAqIEBwYXJhbSB1bml4dGltZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh1bml4dGltZSl7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUodW5peHRpbWUqMTAwMCk7XG4gICAgICAgIHJldHVybiBkYXRlLmdldERheSgpO1xuICAgIH1cblxuICAgIC8qKiDQktC10YDQvdGD0YLRjCDQvdCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LTQvdGPINC90LXQtNC10LvQuFxuICAgICAqIEBwYXJhbSBkYXlOdW1iZXJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldERheU5hbWVPZldlZWtCeURheU51bWJlcihkYXlOdW1iZXIpe1xuICAgICAgICBsZXQgZGF5cyA9IHtcbiAgICAgICAgICAgIDAgOiBcIlN1blwiLFxuICAgICAgICAgICAgMSA6IFwiTW9uXCIsXG4gICAgICAgICAgICAyIDogXCJUdWVcIixcbiAgICAgICAgICAgIDMgOiBcIldlZFwiLFxuICAgICAgICAgICAgNCA6IFwiVGh1XCIsXG4gICAgICAgICAgICA1IDogXCJGcmlcIixcbiAgICAgICAgICAgIDYgOiBcIlNhdFwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkYXlzW2RheU51bWJlcl07XG4gICAgfVxuXG4gICAgLyoqINCh0YDQsNCy0L3QtdC90LjQtSDQtNCw0YLRiyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5ID0gZGQubW0ueXl5eSDRgSDRgtC10LrRg9GJ0LjQvCDQtNC90LXQvFxuICAgICAqXG4gICAgICovXG4gICAgY29tcGFyZURhdGVzV2l0aFRvZGF5KGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCkgPT09IChuZXcgRGF0ZSgpKS50b0xvY2FsZURhdGVTdHJpbmcoKTtcbiAgICB9XG5cbiAgICBjb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShkYXRlKXtcbiAgICAgICAgbGV0IHJlID0vKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XG4gICAgICAgIGxldCByZXNEYXRlID0gcmUuZXhlYyhkYXRlKTtcbiAgICAgICAgaWYocmVzRGF0ZS5sZW5ndGggPT0gNil7XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YClcbiAgICAgICAgfVxuICAgICAgICAvLyDQldGB0LvQuCDQtNCw0YLQsCDQvdC1INGA0LDRgdC/0LDRgNGB0LXQvdCwINCx0LXRgNC10Lwg0YLQtdC60YPRidGD0Y5cbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gICAgfVxufVxuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjkuMDkuMjAxNi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xuXG4vKipcbiDQk9GA0LDRhNC40Log0YLQtdC80L/QtdGA0LDRgtGD0YDRiyDQuCDQv9C+0LPQvtC00YtcbiBAY2xhc3MgR3JhcGhpY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljIGV4dGVuZHMgQ3VzdG9tRGF0ZXtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqINC80LXRgtC+0LQg0LTQu9GPINGA0LDRgdGH0LXRgtCwINC+0YLRgNC40YHQvtCy0LrQuCDQvtGB0L3QvtCy0L3QvtC5INC70LjQvdC40Lgg0L/QsNGA0LDQvNC10YLRgNCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcbiAgICAgICAgICogW2xpbmUgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24gPSBkMy5saW5lKClcbiAgICAgICAgICAgIC54KGZ1bmN0aW9uKGQpe3JldHVybiBkLng7fSlcbiAgICAgICAgICAgIC55KGZ1bmN0aW9uKGQpe3JldHVybiBkLnk7fSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC+0LHRitC10LrRgiDQtNCw0L3QvdGL0YUg0LIg0LzQsNGB0YHQuNCyINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0LPRgNCw0YTQuNC60LBcbiAgICAgKiBAcGFyYW0gIHtbYm9vbGVhbl19IHRlbXBlcmF0dXJlIFvQv9GA0LjQt9C90LDQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXG4gICAgICovXG4gICAgcHJlcGFyZURhdGEoKXtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgcmF3RGF0YSA9IFtdO1xuXG4gICAgICAgIHRoaXMucGFyYW1zLmRhdGEuZm9yRWFjaCgoZWxlbSk9PntcbiAgICAgICAgICAgIHJhd0RhdGEucHVzaCh7eDogaSwgZGF0ZTogdGhpcy5jb252ZXJ0U3RyaW5nRGF0ZU1NRERZWVlISFRvRGF0ZShlbGVtLmRhdGUpLCBtYXhUOiBlbGVtLm1heCwgIG1pblQ6IGVsZW0ubWlufSk7XG4gICAgICAgICAgICBpICs9MTsgLy8g0KHQvNC10YnQtdC90LjQtSDQv9C+INC+0YHQuCBYXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByYXdEYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCh0L7Qt9C00LDQtdC8INC40LfQvtCx0YDQsNC20LXQvdC40LUg0YEg0LrQvtC90YLQtdC60YHRgtC+0Lwg0L7QsdGK0LXQutGC0LAgc3ZnXG4gICAgICogW21ha2VTVkcgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W29iamVjdF19XG4gICAgICovXG4gICAgbWFrZVNWRygpe1xuICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMucGFyYW1zLmlkKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJheGlzXCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHRoaXMucGFyYW1zLndpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5wYXJhbXMuaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgXCIjZmZmZmZmXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCe0L/RgNC10LTQtdC70LXQvdC40LUg0LzQuNC90LjQvNCw0LvQu9GM0L3QvtCz0L4g0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3QvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQv9C+INC/0LDRgNCw0LzQtdGC0YDRgyDQtNCw0YLRi1xuICAgICAqIFtnZXRNaW5NYXhEYXRlIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gZGF0YSBb0L7QsdGK0LXQutGCINGBINC80LjQvdC40LzQsNC70YzQvdGL0Lwg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C8INC30L3QsNGH0LXQvdC40LXQvF1cbiAgICAgKi9cbiAgICBnZXRNaW5NYXhEYXRlKHJhd0RhdGEpe1xuXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIG1heERhdGUgOiBuZXcgRGF0ZSgnMTkwMC0wMS0wMSAwMDowMDowMCcpLFxuICAgICAgICAgICAgbWluRGF0ZSA6IG5ldyBEYXRlKCcyNTAwLTAxLTAxIDAwOjAwOjAwJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcbiAgICAgICAgICAgIGlmKGRhdGEubWF4RGF0ZSA8PSBlbGVtLmRhdGUpIGRhdGEubWF4RGF0ZSA9IGVsZW0uZGF0ZTtcbiAgICAgICAgICAgIGlmKGRhdGEubWluRGF0ZSA+PSBlbGVtLmRhdGUpIGRhdGEubWluRGF0ZSA9IGVsZW0uZGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LjQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LDRgiDQuCDRgtC10LzQv9C10YDQsNGC0YPRgNGLXG4gICAgICogW2dldE1pbk1heERhdGVUZW1wZXJhdHVyZSBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W29iamVjdF19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuXG4gICAgZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSl7XG5cbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgbWluIDogMTAwLFxuICAgICAgICAgICAgbWF4IDogMFxuICAgICAgICB9XG5cbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xuICAgICAgICAgICAgaWYoZGF0YS5taW4gPj0gZWxlbS5taW5UKVxuICAgICAgICAgICAgICAgIGRhdGEubWluID0gZWxlbS5taW5UO1xuICAgICAgICAgICAgaWYoZGF0YS5tYXggPD0gZWxlbS5tYXhUKVxuICAgICAgICAgICAgICAgIGRhdGEubWF4ID0gZWxlbS5tYXhUO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogW2dldE1pbk1heFdlYXRoZXIgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSByYXdEYXRhIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIGdldE1pbk1heFdlYXRoZXIocmF3RGF0YSl7XG5cbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgbWluIDogMCxcbiAgICAgICAgICAgIG1heCA6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIHJhd0RhdGEuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcbiAgICAgICAgICAgIGlmKGRhdGEubWluID49IGVsZW0uaHVtaWRpdHkpXG4gICAgICAgICAgICAgICAgZGF0YS5taW4gPSBlbGVtLmh1bWlkaXR5O1xuICAgICAgICAgICAgaWYoZGF0YS5taW4gPj0gZWxlbS5yYWluZmFsbEFtb3VudClcbiAgICAgICAgICAgICAgICBkYXRhLm1pbiA9IGVsZW0ucmFpbmZhbGxBbW91bnQ7XG4gICAgICAgICAgICBpZihkYXRhLm1heCA8PSBlbGVtLmh1bWlkaXR5KVxuICAgICAgICAgICAgICAgIGRhdGEubWF4ID0gZWxlbS5odW1pZGl0eTtcbiAgICAgICAgICAgIGlmKGRhdGEubWF4IDw9IGVsZW0ucmFpbmZhbGxBbW91bnQpXG4gICAgICAgICAgICAgICAgZGF0YS5tYXggPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC00LvQuNC90YMg0L7RgdC10LkgWCxZXG4gICAgICogW21ha2VBeGVzWFkgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W2FycmF5XX0gcmF3RGF0YSBb0JzQsNGB0YHQuNCyINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cbiAgICAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cbiAgICAgKiBAcmV0dXJuIHtbZnVuY3Rpb25dfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBtYWtlQXhlc1hZKHJhd0RhdGEsIHBhcmFtcyl7XG5cbiAgICAgICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWD0g0YjQuNGA0LjQvdCwINC60L7QvdGC0LXQudC90LXRgNCwIHN2ZyAtINC+0YLRgdGC0YPQvyDRgdC70LXQstCwINC4INGB0L/RgNCw0LLQsFxuICAgICAgICBsZXQgeEF4aXNMZW5ndGggPSBwYXJhbXMud2lkdGggLSAyICogcGFyYW1zLm1hcmdpbjtcbiAgICAgICAgLy8g0LTQu9C40L3QsCDQvtGB0LggWSA9INCy0YvRgdC+0YLQsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQstC10YDRhdGDINC4INGB0L3QuNC30YNcbiAgICAgICAgbGV0IHlBeGlzTGVuZ3RoID0gcGFyYW1zLmhlaWdodCAtIDIgKiBwYXJhbXMubWFyZ2luO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHQuCDQpSDQuCBZXG4gICAgICogW3NjYWxlQXhlc1hZIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSAgcmF3RGF0YSAgICAgW9Ce0LHRitC10LrRgiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHhBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFhdXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHlBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFldXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSAgbWFyZ2luICAgICAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cbiAgICAgKiBAcmV0dXJuIHtbYXJyYXldfSAgICAgICAgICAgICAgW9C80LDRgdGB0LjQsiDRgSDQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90L3Ri9C80Lgg0LfQvdCw0YfQtdC90LjRj9C80LhdXG4gICAgICovXG4gICAgc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcyl7XG5cbiAgICAgICAgbGV0IHttYXhEYXRlLCBtaW5EYXRlfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXG4gICAgICAgICAqIFtzY2FsZVRpbWUgZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcbiAgICAgICAgICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHhBeGlzTGVuZ3RoXSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxuICAgICAgICAgKiBbc2NhbGVMaW5lYXIgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oW21heCs1LCBtaW4tNV0pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIHlBeGlzTGVuZ3RoXSk7XG5cbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcbiAgICAgICAgLy8g0LzQsNGB0YjRgtCw0LHQuNGA0L7QstCw0L3QuNC1INGA0LXQsNC70YzQvdGL0YUg0LTQsNC90L3Ri9GFINCyINC00LDQvdC90YvQtSDQtNC70Y8g0L3QsNGI0LXQuSDQutC+0L7RgNC00LjQvdCw0YLQvdC+0Lkg0YHQuNGB0YLQtdC80YtcbiAgICAgICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICBkYXRhLnB1c2goe3g6IHNjYWxlWChlbGVtLmRhdGUpICsgcGFyYW1zLm9mZnNldFgsXG4gICAgICAgICAgICAgICAgbWF4VDogc2NhbGVZKGVsZW0ubWF4VCkgKyBwYXJhbXMub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICBtaW5UOiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRYfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7c2NhbGVYOiBzY2FsZVgsIHNjYWxlWTogc2NhbGVZLCBkYXRhOiBkYXRhfTtcblxuICAgIH1cblxuICAgIHNjYWxlQXhlc1hZV2VhdGhlcihyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIG1hcmdpbil7XG5cbiAgICAgICAgbGV0IHttYXhEYXRlLCBtaW5EYXRlfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcbiAgICAgICAgbGV0IHttaW4sIG1heH0gPSB0aGlzLmdldE1pbk1heFdlYXRoZXIocmF3RGF0YSk7XG5cbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Ywg0KVcbiAgICAgICAgdmFyIHNjYWxlWCA9IGQzLnNjYWxlVGltZSgpXG4gICAgICAgICAgICAuZG9tYWluKFtuZXcgRGF0ZShtaW5EYXRlKSwgbmV3IERhdGUobWF4RGF0ZSldKVxuICAgICAgICAgICAgLnJhbmdlKFswLCB4QXhpc0xlbmd0aF0pO1xuXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFlcbiAgICAgICAgdmFyIHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oW21heCwgbWluXSlcbiAgICAgICAgICAgIC5yYW5nZShbMCwgeUF4aXNMZW5ndGhdKTtcbiAgICAgICAgbGV0IGRhdGEgPSBbXTtcblxuICAgICAgICAvLyDQvNCw0YHRiNGC0LDQsdC40YDQvtCy0LDQvdC40LUg0YDQtdCw0LvRjNC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0LTQsNC90L3Ri9C1INC00LvRjyDQvdCw0YjQtdC5INC60L7QvtGA0LTQuNC90LDRgtC90L7QuSDRgdC40YHRgtC10LzRi1xuICAgICAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgIGRhdGEucHVzaCh7eDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBtYXJnaW4sIGh1bWlkaXR5OiBzY2FsZVkoZWxlbS5odW1pZGl0eSkgKyBtYXJnaW4sIHJhaW5mYWxsQW1vdW50OiBzY2FsZVkoZWxlbS5yYWluZmFsbEFtb3VudCkgKyBtYXJnaW4gICwgY29sb3I6IGVsZW0uY29sb3J9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtzY2FsZVg6IHNjYWxlWCwgc2NhbGVZOiBzY2FsZVksIGRhdGE6IGRhdGF9O1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0KTQvtGA0LzQuNCy0LDRgNC+0L3QuNC1INC80LDRgdGB0LjQstCwINC00LvRjyDRgNC40YHQvtCy0LDQvdC40Y8g0L/QvtC70LjQu9C40L3QuNC4XG4gICAgICogW21ha2VQb2x5bGluZSBkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSBkYXRhIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxuICAgICAqIEBwYXJhbSAge1tpbnRlZ2VyXX0gbWFyZ2luIFvQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxuICAgICAqIEBwYXJhbSAge1tvYmplY3RdfSBzY2FsZVgsIHNjYWxlWSBb0L7QsdGK0LXQutGC0Ysg0YEg0YTRg9C90LrRhtC40Y/QvNC4INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCBYLFldXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIG1ha2VQb2x5bGluZShkYXRhLCBwYXJhbXMsIHNjYWxlWCwgc2NhbGVZKXtcblxuICAgICAgICBsZXQgYXJyUG9seWxpbmUgPSBbXTtcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRZfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkYXRhLnJldmVyc2UoKS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRZfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcnJQb2x5bGluZS5wdXNoKHt4OiBzY2FsZVgoZGF0YVtkYXRhLmxlbmd0aC0xXVsnZGF0ZSddKSArIHBhcmFtcy5vZmZzZXRYLCB5OiBzY2FsZVkoZGF0YVtkYXRhLmxlbmd0aC0xXVsnbWF4VCddKSArIHBhcmFtcy5vZmZzZXRZfSk7XG5cbiAgICAgICAgcmV0dXJuIGFyclBvbHlsaW5lO1xuXG4gICAgfVxuICAgIC8qKlxuICAgICAqINCe0YLRgNC40YHQvtCy0LrQsCDQv9C+0LvQuNC70LjQvdC40Lkg0YEg0LfQsNC70LjQstC60L7QuSDQvtGB0L3QvtCy0L3QvtC5INC4INC40LzQuNGC0LDRhtC40Y8g0LXQtSDRgtC10L3QuFxuICAgICAqIFtkcmF3UG9sdWxpbmUgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBzdmcgIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgZHJhd1BvbHlsaW5lKHN2ZywgZGF0YSl7XG4gICAgICAgIC8vINC00L7QsdCw0LLQu9GP0LXQvCDQv9GD0YLRjCDQuCDRgNC40YHRg9C10Lwg0LvQuNC90LjQuFxuXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJnXCIpLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLnBhcmFtcy5zdHJva2VXaWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCB0aGlzLnRlbXBlcmF0dXJlUG9seWdvbihkYXRhKSlcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCB0aGlzLnBhcmFtcy5jb2xvclBvbGlseW5lKVxuICAgICAgICAgICAgLnN0eWxlKFwib3BhY2l0eVwiLCAxKTtcblxuICAgIH1cblxuICAgICBkcmF3TGFiZWxzVGVtcGVyYXR1cmUoc3ZnLCBkYXRhLCBwYXJhbXMpe1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWxlbSwgaXRlbSwgZGF0YSk9PntcblxuICAgICAgICAgICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINGC0LXQutGB0YLQsFxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBlbGVtLm1heFQgLSBwYXJhbXMub2Zmc2V0WC8yLTIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCBwYXJhbXMuZm9udFNpemUpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIHBhcmFtcy5mb250Q29sb3IpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBwYXJhbXMuZm9udENvbG9yKVxuICAgICAgICAgICAgICAgIC50ZXh0KHBhcmFtcy5kYXRhW2l0ZW1dLm1heCsnwrAnKTtcblxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZWxlbS54KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBlbGVtLm1pblQgKyBwYXJhbXMub2Zmc2V0WS8yKzEwKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJmb250LXNpemVcIiwgcGFyYW1zLmZvbnRTaXplKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBwYXJhbXMuZm9udENvbG9yKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgcGFyYW1zLmZvbnRDb2xvcilcbiAgICAgICAgICAgICAgICAudGV4dChwYXJhbXMuZGF0YVtpdGVtXS5taW4rJ8KwJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCc0LXRgtC+0LQg0LTQuNGB0L/QtdGC0YfQtdGAINC/0YDQvtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGB0L4g0LLRgdC10LzQuCDRjdC70LXQvNC10L3RgtCw0LzQuFxuICAgICAqIFtyZW5kZXIgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgc3ZnID0gdGhpcy5tYWtlU1ZHKCk7XG4gICAgICAgIGxldCByYXdEYXRhID0gdGhpcy5wcmVwYXJlRGF0YSgpO1xuXG4gICAgICAgIGxldCB7c2NhbGVYLCBzY2FsZVksIGRhdGF9ID0gIHRoaXMubWFrZUF4ZXNYWShyYXdEYXRhLCB0aGlzLnBhcmFtcyk7XG4gICAgICAgIGxldCBwb2x5bGluZSA9IHRoaXMubWFrZVBvbHlsaW5lKHJhd0RhdGEsIHRoaXMucGFyYW1zLCBzY2FsZVgsIHNjYWxlWSk7XG4gICAgICAgIHRoaXMuZHJhd1BvbHlsaW5lKHN2ZywgcG9seWxpbmUpO1xuICAgICAgICB0aGlzLmRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHRoaXMucGFyYW1zKTtcbiAgICAgICAgLy90aGlzLmRyYXdNYXJrZXJzKHN2ZywgcG9seWxpbmUsIHRoaXMubWFyZ2luKTtcblxuICAgIH1cblxufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFdlYXRoZXJXaWRnZXQgZnJvbSAnLi93ZWF0aGVyLXdpZGdldCc7XG5cbi8vINCT0LXQvdC10YDQsNGG0LjRjyDQsdC+0LvRjNGI0L7Qs9C+INCy0LjQtNC20LXRgtCwXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKXtcblxuICBjb25zdCBnZW5lcmF0b3JET00gPSBmdW5jdGlvbihzaXplID0gXCJmdWxsXCIpe1xuXG4gICAgdmFyIGh0bWwgPSBgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJjc3Mvc3R5bGUuY3NzXCI+YDtcbiAgICBodG1sICs9IGA8c2NyaXB0IHNyYz1cImpzL2xpYnMvZDMubWluLmpzXCI+PC9zY3JpcHQ+YDtcbiAgICBpZihzaXplID09PSBcImZ1bGxcIil7XG4gICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwid2lkZ2V0LW1lbnUgd2lkZ2V0LW1lbnVfX2xheW91dFwiPjxoMSBjbGFzcz1cIndpZGdldC1tZW51X19oZWFkZXJcIj5XZWF0aGVyIGZvciBNb3Njb3c8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzPVwid2lkZ2V0LW1lbnVfX2xpbmtzXCI+PHNwYW4+TW9yZSBhdDwvc3Bhbj48YSBocmVmPVwiLy9vcGVud2VhdGhlcm1hcC5vcmcvXCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJ3aWRnZXQtbWVudV9fbGlua1wiPlxuICAgICAgICBPcGVuV2VhdGhlck1hcDwvYT48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwid2lkZ2V0X19ib2R5XCI+PGRpdiBjbGFzcz1cIndlYXRoZXItY2FyZFwiPjxkaXYgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX3JvdzFcIj5cbiAgICAgICAgPGltZyBzcmM9XCJpbWcvMTBkYncucG5nXCIgd2lkdGg9XCIxMjhcIiBoZWlnaHQ9XCIxMjhcIiBhbHQ9XCJXZWF0aGVyIGZvciBNb3Njb3dcIiBjbGFzcz1cIndlYXRoZXItY2FyZF9faW1nXCIvPlxuICAgICAgICA8ZGl2IGNsYXNzPVwid2VhdGhlci1jYXJkX19jb2xcIj48cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fbnVtYmVyXCI+MDxzdXAgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX2RlZ3JlZVwiPjAgPC9zdXA+PC9wPlxuICAgICAgICA8c3Bhbj5hbmQgcmlzaW5nPC9zcGFuPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3ZWF0aGVyLWNhcmRfX3JvdzJcIj48cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fbWVhbnNcIj4tPC9wPlxuICAgICAgICA8cCBjbGFzcz1cIndlYXRoZXItY2FyZF9fd2luZFwiPldpbmQ6PC9wPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJ3aWRnZXRfX2NhbGVuZGFyXCI+PHVsIGNsYXNzPVwiY2FsZW5kYXJcIj5cbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5Ub2RheTxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiVG9kYXlcIi8+PC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5TYXQgPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJTYXRcIi8+PC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5TdW48aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIlN1blwiLz48L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPk1vbiA8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIk1vblwiLz48L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPlR1ZTxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiVHVlXCIvPjwvbGk+XG4gICAgICAgIDxsaSBjbGFzcz1cImNhbGVuZGFyX19pdGVtXCI+V2VkPGltZyBzcmM9XCJcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCJXZWRcIi8+PC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiY2FsZW5kYXJfX2l0ZW1cIj5UaHU8aW1nIHNyYz1cIlwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIlRodVwiLz48L2xpPlxuICAgICAgICA8bGkgY2xhc3M9XCJjYWxlbmRhcl9faXRlbVwiPkZyaTxpbWcgc3JjPVwiXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiRnJpXCIvPjwvbGk+PC91bD5cbiAgICAgICAgPGRpdiBpZD1cImdyYXBoaWNcIiBjbGFzcz1cIndpZGdldF9fZ3JhcGhpY1wiPjwvZGl2PjwvZGl2PjwvZGl2PmA7XG4gICAgICBodG1sICs9YDxzY3JpcHQgc3JjPVwianMvd2VhdGhlci13aWRnZXQuanNcIj48L3NjcmlwdD48c2NyaXB0PmNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KHBhcmFtc1dpZGdldCwgY29udHJvbHNXaWRnZXQsIHVybHMpO1xuICAgICAgICBpZihnZW5lcmF0b3JET00oKSkgdmFyIGpzb25Gcm9tQVBJID0gb2JqV2lkZ2V0LnJlbmRlcigpOzwvc2NyaXB0PmA7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aWRnZXRcIikuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gaHRtbDtcblxuICB9O1xuXG4gIC8v0KTQvtGA0LzQuNGA0YPQtdC8INC/0LDRgNCw0LzQtdGC0YAg0YTQuNC70YzRgtGA0LAg0L/QviDQs9C+0YDQvtC00YNcbiAgbGV0IHEgPSAnJztcbiAgaWYod2luZG93LmxvY2F0aW9uLnNlYXJjaClcbiAgICAgIHEgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuICBlbHNlXG4gICAgICBxID0gXCI/cT1Mb25kb25cIjtcblxuICBsZXQgdXJsRG9tYWluID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZ1wiO1xuXG4gIGxldCBwYXJhbXNXaWRnZXQgPSB7XG4gICAgICBjaXR5TmFtZTogJ01vc2NvdycsXG4gICAgICBsYW5nOiAnZW4nLFxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXG4gICAgICB1bml0czogJ21ldHJpYycsXG4gICAgICB0ZXh0VW5pdFRlbXA6ICcwJ1xuICB9O1xuXG4gIGxldCBjb250cm9sc1dpZGdldCA9IHtcbiAgICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpZGdldC1tZW51X19oZWFkZXJcIiksXG4gICAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53ZWF0aGVyLWNhcmRfX251bWJlclwiKSxcbiAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9fbWVhbnNcIiksXG4gICAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2VhdGhlci1jYXJkX193aW5kXCIpLFxuICAgICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndlYXRoZXItY2FyZF9faW1nXCIpLFxuICAgICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhbGVuZGFyX19pdGVtXCIpLFxuICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaGljXCIpXG4gIH07XG5cbiAgbGV0IHVybHMgPSB7XG4gICAgICB1cmxXZWF0aGVyQVBJOiBgJHt1cmxEb21haW59L2RhdGEvMi41L3dlYXRoZXIke3F9JnVuaXRzPSR7cGFyYW1zV2lkZ2V0LnVuaXRzfSZhcHBpZD0ke3BhcmFtc1dpZGdldC5hcHBpZH1gLFxuICAgICAgcGFyYW1zVXJsRm9yZURhaWx5OiBgJHt1cmxEb21haW59L2RhdGEvMi41L2ZvcmVjYXN0L2RhaWx5JHtxfSZ1bml0cz0ke3BhcmFtc1dpZGdldC51bml0c30mY250PTgmYXBwaWQ9JHtwYXJhbXNXaWRnZXQuYXBwaWR9YCxcbiAgICAgIHdpbmRTcGVlZDogXCJkYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uXCIsXG4gICAgICB3aW5kRGlyZWN0aW9uOiBcImRhdGEvd2luZC1kaXJlY3Rpb24tZGF0YS5qc29uXCIsXG4gICAgICBjbG91ZHM6IFwiZGF0YS9jbG91ZHMtZGF0YS5qc29uXCIsXG4gICAgICBuYXR1cmFsUGhlbm9tZW5vbjogXCJkYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb25cIlxuICB9XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgQ3VzdG9tRGF0ZSBmcm9tIFwiLi9jdXN0b20tZGF0ZVwiO1xuaW1wb3J0IEdyYXBoaWMgZnJvbSAnLi9ncmFwaGljLWQzanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWF0aGVyV2lkZ2V0IGV4dGVuZHMgQ3VzdG9tRGF0ZXtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcywgY29udHJvbHMsIHVybHMpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICAgICAgICB0aGlzLnVybHMgPSB1cmxzO1xuXG4gICAgICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCINC/0YPRgdGC0YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XG4gICAgICAgIHRoaXMud2VhdGhlciA9IHtcbiAgICAgICAgICAgIFwiZnJvbUFQSVwiOlxuICAgICAgICAgICAge1wiY29vcmRcIjp7XG4gICAgICAgICAgICAgICAgXCJsb25cIjpcIjBcIixcbiAgICAgICAgICAgICAgICBcImxhdFwiOlwiMFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwid2VhdGhlclwiOlt7XCJpZFwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1haW5cIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcImljb25cIjpcIlwiXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgXCJiYXNlXCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgXCJtYWluXCI6e1xuICAgICAgICAgICAgICAgICAgICBcInRlbXBcIjogMCxcbiAgICAgICAgICAgICAgICAgICAgXCJwcmVzc3VyZVwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcImh1bWlkaXR5XCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcF9taW5cIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wX21heFwiOlwiIFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIndpbmRcIjp7XG4gICAgICAgICAgICAgICAgICAgIFwic3BlZWRcIjogMCxcbiAgICAgICAgICAgICAgICAgICAgXCJkZWdcIjpcIiBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJyYWluXCI6e30sXG4gICAgICAgICAgICAgICAgXCJjbG91ZHNcIjp7XCJhbGxcIjpcIiBcIn0sXG4gICAgICAgICAgICAgICAgXCJkdFwiOmBgLFxuICAgICAgICAgICAgICAgIFwic3lzXCI6e1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjpcIiBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjb3VudHJ5XCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VucmlzZVwiOlwiIFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1bnNldFwiOlwiIFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImlkXCI6XCIgXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6XCJVbmRlZmluZWRcIixcbiAgICAgICAgICAgICAgICBcImNvZFwiOlwiIFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBodHRwR2V0KHVybCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IodGhpcy5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCS0YDQtdC80Y8g0L7QttC40LTQsNC90LjRjyDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgQVBJINC40YHRgtC10LrQu9C+ICR7ZS50eXBlfSAke2UudGltZVN0YW1wLnRvRml4ZWQoMil9YCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgeGhyLnNlbmQobnVsbCk7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqINCX0LDQv9GA0L7RgSDQuiBBUEkg0LTQu9GPINC/0L7Qu9GD0YfQtdC90LjRjyDQtNCw0L3QvdGL0YUg0YLQtdC60YPRidC10Lkg0L/QvtCz0L7QtNGLXG4gICAgICovXG4gICAgZ2V0V2VhdGhlckZyb21BcGkoKXtcbiAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy51cmxXZWF0aGVyQVBJKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIuZnJvbUFQSSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLm5hdHVyYWxQaGVub21lbm9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXVtcImRlc2NyaXB0aW9uXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLndpbmRTcGVlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmRTcGVlZCA9IHJlc3BvbnNlW3RoaXMucGFyYW1zLmxhbmddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLnBhcmFtc1VybEZvcmVEYWlseSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cbiAgICAgKiBAcGFyYW0gIHtvYmplY3R9IEpTT05cbiAgICAgKiBAcGFyYW0gIHt2YXJpYW50fSBlbGVtZW50INCX0L3QsNGH0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAsINC00L7Rh9C10YDQvdC10LPQviDRg9C30LvQsCDQtNC70Y8g0L/QvtC40YHQutCwINGA0L7QtNC40YLQtdC70YzRgdC60L7Qs9C+XG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcbiAgICAgKi9cbiAgICBnZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qob2JqZWN0LCBlbGVtZW50LCBlbGVtZW50TmFtZSwgZWxlbWVudE5hbWUyKXtcblxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmplY3Qpe1xuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0YHRgNCw0LLQvdC10L3QuNC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDRgSDQvtCx0YrQtdC60YLQvtC8INC40Lcg0LTQstGD0YUg0Y3Qu9C10LzQtdC90YLQvtCyINCy0LLQuNC00LUg0LjQvdGC0LXRgNCy0LDQu9CwXG4gICAgICAgICAgICBpZih0eXBlb2Ygb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdID09PSBcIm9iamVjdFwiICYmIGVsZW1lbnROYW1lMiA9PSBudWxsKXtcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXVswXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzFdKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0LAg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXG4gICAgICAgICAgICBlbHNlIGlmKGVsZW1lbnROYW1lMiAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50ID49IG9iamVjdFtrZXldW2VsZW1lbnROYW1lXSAmJiBlbGVtZW50IDwgb2JqZWN0W2tleV1bZWxlbWVudE5hbWUyXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCIEpTT04g0YEg0LzQtdGC0LXQvtC00LDQvdGL0LzQuFxuICAgICAqIEBwYXJhbSBqc29uRGF0YVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHBhcnNlRGF0YUZyb21TZXJ2ZXIoKXtcblxuICAgICAgICBsZXQgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcblxuICAgICAgICBpZih3ZWF0aGVyLmZyb21BUEkubmFtZSA9PT0gXCJVbmRlZmluZWRcIiB8fCB3ZWF0aGVyLmZyb21BUEkuY29kID09PSBcIjQwNFwiKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi0JTQsNC90L3Ri9C1INC+0YIg0YHQtdGA0LLQtdGA0LAg0L3QtSDQv9C+0LvRg9GH0LXQvdGLXCIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmF0dXJhbFBoZW5vbWVub24gPSBgYDtcbiAgICAgICAgdmFyIHdpbmRTcGVlZCA9IGBgO1xuICAgICAgICB2YXIgd2luZERpcmVjdGlvbiA9IGBgO1xuICAgICAgICB2YXIgY2xvdWRzID0gYGA7XG5cbiAgICAgICAgLy/QmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRglxuICAgICAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBjbG91ZGluZXNzOiBgIGAsXG4gICAgICAgICAgICBkdCA6IGAgYCxcbiAgICAgICAgICAgIGNpdHlOYW1lIDogIGAgYCxcbiAgICAgICAgICAgIGljb24gOiBgIGAsXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZSA6IGAgYCxcbiAgICAgICAgICAgIHByZXNzdXJlIDogIGAgYCxcbiAgICAgICAgICAgIGh1bWlkaXR5IDogYCBgLFxuICAgICAgICAgICAgc3VucmlzZSA6IGAgYCxcbiAgICAgICAgICAgIHN1bnNldCA6IGAgYCxcbiAgICAgICAgICAgIGNvb3JkIDogYCBgLFxuICAgICAgICAgICAgd2luZDogYCBgLFxuICAgICAgICAgICAgd2VhdGhlcjogYCBgXG4gICAgICAgIH07XG5cbiAgICAgICAgbWV0YWRhdGEuY2l0eU5hbWUgPSBgJHt3ZWF0aGVyLmZyb21BUEkubmFtZX0sICR7d2VhdGhlci5mcm9tQVBJLnN5cy5jb3VudHJ5fWA7XG4gICAgICAgIG1ldGFkYXRhLnRlbXBlcmF0dXJlID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApfWA7XG4gICAgICAgIGlmKHdlYXRoZXIubmF0dXJhbFBoZW5vbWVub24pXG4gICAgICAgICAgICBtZXRhZGF0YS53ZWF0aGVyID0gd2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vblt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pZF07XG4gICAgICAgIGlmKHdlYXRoZXJbXCJ3aW5kU3BlZWRcIl0pXG4gICAgICAgICAgICBtZXRhZGF0YS53aW5kU3BlZWQgPSBgV2luZDogJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndpbmRcIl1bXCJzcGVlZFwiXS50b0ZpeGVkKDEpfSAgbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmRTcGVlZFwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wic3BlZWRcIl0udG9GaXhlZCgxKSwgXCJzcGVlZF9pbnRlcnZhbFwiKX1gO1xuICAgICAgICBpZih3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSlcbiAgICAgICAgICAgIG1ldGFkYXRhLndpbmREaXJlY3Rpb24gPSBgJHt0aGlzLmdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdCh3ZWF0aGVyW1wid2luZERpcmVjdGlvblwiXSwgd2VhdGhlcltcImZyb21BUElcIl1bXCJ3aW5kXCJdW1wiZGVnXCJdLCBcImRlZ19pbnRlcnZhbFwiKX0gKCAke3dlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXX0gKWBcbiAgICAgICAgaWYod2VhdGhlcltcImNsb3Vkc1wiXSlcbiAgICAgICAgICAgIG1ldGFkYXRhLmNsb3VkcyA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXJbXCJjbG91ZHNcIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wiY2xvdWRzXCJdW1wiYWxsXCJdLCBcIm1pblwiLCBcIm1heFwiKX1gO1xuXG4gICAgICAgIG1ldGFkYXRhLmljb24gPSBgJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIndlYXRoZXJcIl1bMF1bXCJpY29uXCJdfWA7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyV2lkZ2V0KG1ldGFkYXRhKTtcblxuICAgIH07XG5cbiAgICByZW5kZXJXaWRnZXQobWV0YWRhdGEpIHtcblxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMuY2l0eU5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLmNpdHlOYW1lLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZVtlbGVtXS5pbm5lckhUTUwgPSBgPHNwYW4+V2VhdGhlciBmb3I8L3NwYW4+ICR7bWV0YWRhdGEuY2l0eU5hbWV9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlLmhhc093blByb3BlcnR5KGVsZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZVtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3VwIGNsYXNzPVwid2VhdGhlci1jYXJkX19kZWdyZWVcIj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3N1cD5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICBmb3IgKGxldCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIuaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlcltlbGVtXS5zcmMgPSB0aGlzLmdldFVSTE1haW5JY29uKG1ldGFkYXRhLmljb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZihtZXRhZGF0YS53ZWF0aGVyLnRyaW0oKSlcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbil7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbltlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53ZWF0aGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgaWYobWV0YWRhdGEud2luZFNwZWVkLnRyaW0oKSlcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW0gaW4gdGhpcy5jb250cm9scy53aW5kU3BlZWQpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLndpbmRTcGVlZC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KVxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlRGF0YUZvckdyYXBoaWMoKTtcblxuICAgIH1cblxuICAgIHByZXBhcmVEYXRhRm9yR3JhcGhpYygpe1xuICAgICAgICB2YXIgYXJyID0gW107XG5cbiAgICAgICAgZm9yKHZhciBlbGVtIGluIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3Qpe1xuICAgICAgICAgICAgbGV0IGRheSA9IHRoaXMuZ2V0RGF5TmFtZU9mV2Vla0J5RGF5TnVtYmVyKHRoaXMuZ2V0TnVtYmVyRGF5SW5XZWVrQnlVbml4VGltZSh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLmR0KSk7XG4gICAgICAgICAgICBhcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgJ21pbic6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1pbiksXG4gICAgICAgICAgICAgICAgJ21heCc6IE1hdGgucm91bmQodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS50ZW1wLm1heCksXG4gICAgICAgICAgICAgICAgJ2RheSc6IChlbGVtICE9IDApID8gZGF5IDogJ1RvZGF5JyxcbiAgICAgICAgICAgICAgICAnaWNvbic6IHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICAgICAgICAgICdkYXRlJzogdGhpcy50aW1lc3RhbXBUb0RhdGVUaW1lKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0uZHQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmRyYXdHcmFwaGljRDMoYXJyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC30LLQsNC90LjRjyDQtNC90LXQuSDQvdC10LTQtdC70Lgg0Lgg0LjQutC+0L3QvtC6INGBINC/0L7Qs9C+0LTQvtC5XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICByZW5kZXJJY29uc0RheXNPZldlZWsoZGF0YSl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0sIGluZGV4LGRhdGEpe1xuICAgICAgICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXhdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGdldFVSTE1haW5JY29uKG5hbWVJY29uKXtcbiAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0Lgg0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutCw0YDRgtGDINGB0L7Qv9C+0YHRgtCw0LLQu9C10L3QuNC5XG4gICAgICAgIHZhciBtYXBJY29ucyA9ICBuZXcgTWFwKCk7XG4gICAgICAgIC8vINCU0L3QtdCy0L3Ri9C1XG4gICAgICAgIG1hcEljb25zLnNldCgnMDFkJywgJzAxZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDJkJywgJzAyZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDNkJywgJzAzZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDRkJywgJzA0ZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDVkJywgJzA1ZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDZkJywgJzA2ZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDdkJywgJzA3ZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDhkJywgJzA4ZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMDlkJywgJzA5ZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMTBkJywgJzEwZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMTFkJywgJzExZGJ3Jyk7XG4gICAgICAgIG1hcEljb25zLnNldCgnMTNkJywgJzEzZGJ3Jyk7XG4gICAgICAgIC8vINCd0L7Rh9C90YvQtVxuICAgICAgICBtYXBJY29ucy5zZXQoJzAxbicsICcwMWRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzAybicsICcwMmRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzAzbicsICcwM2RidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzA0bicsICcwNGRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzA1bicsICcwNWRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzA2bicsICcwNmRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzA3bicsICcwN2RidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzA4bicsICcwOGRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzA5bicsICcwOWRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzEwbicsICcxMGRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzExbicsICcxMWRidycpO1xuICAgICAgICBtYXBJY29ucy5zZXQoJzEzbicsICcxM2RidycpO1xuXG4gICAgICAgIGlmKG1hcEljb25zLmdldChuYW1lSWNvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBgaW1nLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke25hbWVJY29ufS5wbmdgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGBINC/0L7QvNC+0YnRjNGOINCx0LjQsdC70LjQvtGC0LXQutC4IEQzXG4gICAgICovXG4gICAgZHJhd0dyYXBoaWNEMyhkYXRhKXtcblxuICAgICAgICB0aGlzLnJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKTtcblxuICAgICAgICAvL9Cf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxuICAgICAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICAgICAgaWQ6IFwiI2dyYXBoaWNcIixcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBvZmZzZXRYOiAxNSxcbiAgICAgICAgICAgIG9mZnNldFk6IDEwLFxuICAgICAgICAgICAgd2lkdGg6IDQyMCxcbiAgICAgICAgICAgIGhlaWdodDogNzksXG4gICAgICAgICAgICByYXdEYXRhOiBbXSxcbiAgICAgICAgICAgIG1hcmdpbjogMTAsXG4gICAgICAgICAgICBjb2xvclBvbGlseW5lOiBcIiMzMzNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjEycHhcIixcbiAgICAgICAgICAgIGZvbnRDb2xvcjogXCIjMzMzXCIsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogXCIxcHhcIlxuICAgICAgICB9XG5cbiAgICAgICAgLy8g0KDQtdC60L7QvdGB0YLRgNGD0LrRhtC40Y8g0L/RgNC+0YbQtdC00YPRgNGLINGA0LXQvdC00LXRgNC40L3Qs9CwINCz0YDQsNGE0LjQutCwINGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcbiAgICAgICAgbGV0IG9iakdyYXBoaWNEMyA9ICBuZXcgR3JhcGhpYyhwYXJhbXMpO1xuICAgICAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxuICAgICAqL1xuICAgIGRyYXdHcmFwaGljKGFycil7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcblxuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY29udHJvbHMuZ3JhcGhpYy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGg9IDQ2NTtcbiAgICAgICAgdGhpcy5jb250cm9scy5ncmFwaGljLmhlaWdodCA9IDcwO1xuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmXCI7XG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwwLDYwMCwzMDApO1xuXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4XCI7XG5cbiAgICAgICAgdmFyIHN0ZXAgPSA1NTtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgem9vbSA9IDQ7XG4gICAgICAgIHZhciBzdGVwWSA9IDY0O1xuICAgICAgICB2YXIgc3RlcFlUZXh0VXAgPSA1ODtcbiAgICAgICAgdmFyIHN0ZXBZVGV4dERvd24gPSA3NTtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RlcC0xMCwgLTEqYXJyW2ldLm1pbip6b29tK3N0ZXBZKTtcbiAgICAgICAgY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZVGV4dFVwKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rc3RlcFkpO1xuICAgICAgICB3aGlsZShpPGFyci5sZW5ndGgpe1xuICAgICAgICAgICAgc3RlcCArPTU1O1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tK3N0ZXBZKTtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbStzdGVwWVRleHRVcCk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyWy0taV0ubWF4Knpvb20rc3RlcFkpXG4gICAgICAgIHN0ZXAgPSA1NTtcbiAgICAgICAgaSA9IDAgO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyhzdGVwLTEwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFkpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1pbisnwronLCBzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFlUZXh0RG93bik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAtMTAsIC0xKmFycltpKytdLm1pbip6b29tK3N0ZXBZKTtcbiAgICAgICAgd2hpbGUoaTxhcnIubGVuZ3RoKXtcbiAgICAgICAgICAgIHN0ZXAgKz01NTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsIC0xKmFycltpXS5taW4qem9vbStzdGVwWSk7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVRleHQoYXJyW2ldLm1pbisnwronLCBzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rc3RlcFlUZXh0RG93bik7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyWy0taV0ubWluKnpvb20rc3RlcFkpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiIzMzM1wiO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhzdGVwKzMwLCAtMSphcnJbaV0ubWF4Knpvb20rc3RlcFkpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcblxuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKXtcbiAgICAgICAgdGhpcy5nZXRXZWF0aGVyRnJvbUFwaSgpO1xuICAgIH07XG5cbn0iXX0=
