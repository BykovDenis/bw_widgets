(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"./custom-date":1}],3:[function(require,module,exports){
'use strict';

var _weatherWidget = require('./weather-widget');

var _weatherWidget2 = _interopRequireDefault(_weatherWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
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
    textUnitTemp: String.fromCodePoint(0x00B0) };

  var controlsWidget = {
    // Первая половина виджетов
    cityName: document.querySelectorAll('.widget-dark-menu__header'),
    temperature: document.querySelectorAll('.weather-dark-card__number'),
    naturalPhenomenon: document.querySelectorAll('.weather-dark-card__means'),
    windSpeed: document.querySelectorAll('.weather-dark-card__wind'),
    mainIconWeather: document.querySelectorAll('.weather-dark-card__img'),
    calendarItem: document.querySelectorAll('.calendar__item'),
    graphic: document.getElementById('graphic'),
    // Вторая половина виджетов
    cityName2: document.querySelectorAll('.widget-lite__title'),
    temperature2: document.querySelectorAll('.weather-lite__temperature'),
    temperatureFeels: document.querySelectorAll('.weather-lite__feels'),
    temperatureMin: document.querySelectorAll('.weather-lite-card__temperature-min'),
    temperatureMax: document.querySelectorAll('.weather-lite-card__temperature-max'),
    naturalPhenomenon2: document.querySelectorAll('.widget-lite__description'),
    windSpeed2: document.querySelectorAll('.weather-lite__wind-speed'),
    mainIconWeather2: document.querySelectorAll('.weather-lite__icon'),
    humidity: document.querySelectorAll('.weather-lite__humidity'),
    pressure: document.querySelectorAll('.weather-lite__pressure'),
    dateReport: document.querySelectorAll(".widget-lite__date")
  };

  var urls = {
    urlWeatherAPI: urlDomain + '/data/2.5/weather' + q + '&units=' + paramsWidget.units + '&appid=' + paramsWidget.appid,
    paramsUrlForeDaily: urlDomain + '/data/2.5/forecast/daily' + q + '&units=' + paramsWidget.units + '&cnt=8&appid=' + paramsWidget.appid,
    windSpeed: 'data/wind-speed-data.json',
    windDirection: 'data/wind-direction-data.json',
    clouds: 'data/clouds-data.json',
    naturalPhenomenon: 'data/natural-phenomenon-data.json'
  };

  var objWidget = new _weatherWidget2.default(paramsWidget, controlsWidget, urls);
  objWidget.render();
}); // Модуль диспетчер для отрисовки баннерров на конструкторе

},{"./weather-widget":4}],4:[function(require,module,exports){
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
        _this2.httpGet(_this2.urls.naturalPhenomenon).then(function (response) {
          _this2.weather.naturalPhenomenon = response[_this2.params.lang].description;
          _this2.httpGet(_this2.urls.windSpeed).then(function (response) {
            _this2.weather.windSpeed = response[_this2.params.lang];
            _this2.httpGet(_this2.urls.paramsUrlForeDaily).then(function (response) {
              _this2.weather.forecastDaily = response;
              _this2.httpGet(_this2.urls.windDirection).then(function (response) {
                _this2.weather.windDirection = response[_this2.params.lang];
                _this2.parseDataFromServer();
              }, function (error) {
                console.log('Возникла ошибка ' + error);
                _this2.parseDataFromServer();
              });
            }, function (error) {
              console.log('Возникла ошибка ' + error);
              _this2.parseDataFromServer();
            });
          }, function (error) {
            console.log('Возникла ошибка ' + error);
            _this2.parseDataFromServer();
          });
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
          this.controls.temperature[_elem].innerHTML = metadata.temperature + '<span class=\'weather-dark-card__degree\'>' + this.params.textUnitTemp + '</span>';
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
          return 'img/' + mapIcons.get(nameIcon) + '.png';
        }
        return 'http://openweathermap.org/img/w/' + nameIcon + '.png';
      }
      return 'img/' + nameIcon + '.png';
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

},{"./custom-date":1,"./graphic-d3js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjdXN0b20tZGF0ZS5qcyIsImFzc2V0c1xcanNcXGdyYXBoaWMtZDNqcy5qcyIsImFzc2V0c1xcanNcXHNjcmlwdC5qcyIsImFzc2V0c1xcanNcXHdlYXRoZXItd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztBQUlBO0lBQ3FCLFU7Ozs7Ozs7Ozs7Ozs7QUFFbkI7Ozs7O3dDQUtvQixNLEVBQVE7QUFDMUIsVUFBSSxTQUFTLEdBQWIsRUFBa0I7QUFDaEIsZUFBTyxLQUFQO0FBQ0Q7QUFDRCxVQUFJLFNBQVMsRUFBYixFQUFpQjtBQUNmLHNCQUFZLE1BQVo7QUFDRCxPQUZELE1BRU8sSUFBSSxTQUFTLEdBQWIsRUFBa0I7QUFDdkIscUJBQVcsTUFBWDtBQUNEO0FBQ0QsYUFBTyxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJDQUt1QixJLEVBQU07QUFDM0IsVUFBTSxNQUFNLElBQUksSUFBSixDQUFTLElBQVQsQ0FBWjtBQUNBLFVBQU0sUUFBUSxJQUFJLElBQUosQ0FBUyxJQUFJLFdBQUosRUFBVCxFQUE0QixDQUE1QixFQUErQixDQUEvQixDQUFkO0FBQ0EsVUFBTSxPQUFPLE1BQU0sS0FBbkI7QUFDQSxVQUFNLFNBQVMsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUFoQztBQUNBLFVBQU0sTUFBTSxLQUFLLEtBQUwsQ0FBVyxPQUFPLE1BQWxCLENBQVo7QUFDQSxhQUFVLElBQUksV0FBSixFQUFWLFNBQStCLEtBQUssbUJBQUwsQ0FBeUIsR0FBekIsQ0FBL0I7QUFDRDs7QUFFRDs7Ozs7Ozs7MkNBS3VCLEksRUFBTTtBQUMzQixVQUFNLEtBQUssbUJBQVg7QUFDQSxVQUFNLE9BQU8sR0FBRyxJQUFILENBQVEsSUFBUixDQUFiO0FBQ0EsVUFBTSxZQUFZLElBQUksSUFBSixDQUFTLEtBQUssQ0FB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QixHQUEyQixLQUFyRDtBQUNBLGNBQVEsU0FBUixHQUFvQixNQUFwQjtBQUNBLGNBQVEsTUFBUixDQUFlLE9BQU8sRUFBdEIsRUFBMkIsQ0FBQyxDQUFELEdBQUssSUFBSSxDQUFKLEVBQU8sR0FBWixHQUFrQixJQUFuQixHQUEyQixLQUFyRDtBQUNBLGNBQVEsU0FBUjtBQUNBLGNBQVEsV0FBUixHQUFzQixNQUF0QjtBQUNBLGNBQVEsTUFBUjtBQUNBLGNBQVEsSUFBUjtBQUNEOzs7NkJBRVE7QUFDUCxXQUFLLGlCQUFMO0FBQ0Q7Ozs7OztrQkEzZmtCLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRGVuaXMgb24gMjguMDkuMjAxNi5cclxuKi9cclxuXHJcbi8vINCg0LDQsdC+0YLQsCDRgSDQtNCw0YLQvtC5XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbURhdGUgZXh0ZW5kcyBEYXRlIHtcclxuXHJcbiAgLyoqXHJcbiAgKiDQvNC10YLQvtC0INC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0L3QvtC80LXRgNCwINC00L3RjyDQsiDQs9C+0LTRgyDQsiDRgtGA0LXRhdGA0LDQt9GA0Y/QtNC90L7QtSDRh9C40YHQu9C+INCy0LLQuNC00LUg0YHRgtGA0L7QutC4XHJcbiAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG51bWJlciBb0YfQuNGB0LvQviDQvNC10L3QtdC1IDk5OV1cclxuICAqIEByZXR1cm4ge1tzdHJpbmddfSAgICAgICAgW9GC0YDQtdGF0LfQvdCw0YfQvdC+0LUg0YfQuNGB0LvQviDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDQv9C+0YDRj9C00LrQvtCy0L7Qs9C+INC90L7QvNC10YDQsCDQtNC90Y8g0LIg0LPQvtC00YNdXHJcbiAgKi9cclxuICBudW1iZXJEYXlzT2ZZZWFyWFhYKG51bWJlcikge1xyXG4gICAgaWYgKG51bWJlciA+IDM2NSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAobnVtYmVyIDwgMTApIHtcclxuICAgICAgcmV0dXJuIGAwMCR7bnVtYmVyfWA7XHJcbiAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMCkge1xyXG4gICAgICByZXR1cm4gYDAke251bWJlcn1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bWJlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0JzQtdGC0L7QtCDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7RgNGP0LTQutC+0LLQvtCz0L4g0L3QvtC80LXRgNCwINCyINCz0L7QtNGDXHJcbiAgKiBAcGFyYW0gIHtkYXRlfSBkYXRlINCU0LDRgtCwINGE0L7RgNC80LDRgtCwIHl5eXktbW0tZGRcclxuICAqIEByZXR1cm4ge2ludGVnZXJ9ICDQn9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINCyINCz0L7QtNGDXHJcbiAgKi9cclxuICBjb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGRhdGUpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgY29uc3QgZGF5ID0gTWF0aC5mbG9vcihkaWZmIC8gb25lRGF5KTtcclxuICAgIHJldHVybiBgJHtub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm51bWJlckRheXNPZlllYXJYWFgoZGF5KX1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiDQnNC10YLQvtC0INC/0YDQtdC+0L7QsdGA0LDQt9GD0LXRgiDQtNCw0YLRgyDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+INCyIHl5eXktbW0tZGRcclxuICAqIEBwYXJhbSAge3N0cmluZ30gZGF0ZSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKiBAcmV0dXJuIHtkYXRlfSDQtNCw0YLQsCDRhNC+0YDQvNCw0YLQsCB5eXl5LW1tLWRkXHJcbiAgKi9cclxuICBjb252ZXJ0TnVtYmVyRGF5VG9EYXRlKGRhdGUpIHtcclxuICAgIGNvbnN0IHJlID0gLyhcXGR7NH0pKC0pKFxcZHszfSkvO1xyXG4gICAgY29uc3QgbGluZSA9IHJlLmV4ZWMoZGF0ZSk7XHJcbiAgICBjb25zdCBiZWdpbnllYXIgPSBuZXcgRGF0ZShsaW5lWzFdKTtcclxuICAgIGNvbnN0IHVuaXh0aW1lID0gYmVnaW55ZWFyLmdldFRpbWUoKSArIChsaW5lWzNdICogMTAwMCAqIDYwICogNjAgKiAyNCk7XHJcbiAgICBjb25zdCByZXMgPSBuZXcgRGF0ZSh1bml4dGltZSk7XHJcblxyXG4gICAgY29uc3QgbW9udGggPSByZXMuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBjb25zdCBkYXlzID0gcmVzLmdldERhdGUoKTtcclxuICAgIGNvbnN0IHllYXIgPSByZXMuZ2V0RnVsbFllYXIoKTtcclxuICAgIHJldHVybiBgJHtkYXlzIDwgMTAgPyBgMCR7ZGF5c31gIDogZGF5c30uJHttb250aCA8IDEwID8gYDAke21vbnRofWAgOiBtb250aH0uJHt5ZWFyfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQtNCw0YLRiyDQstC40LTQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKiBAcGFyYW0gIHtkYXRlMX0gZGF0ZSDQtNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtzdHJpbmd9ICDQtNCw0YLQsCDQstCy0LjQtNC1INGB0YLRgNC+0LrQuCDRhNC+0YDQvNCw0YLQsCB5eXl5LTxudW1iZXIgZGF5IGluIHllYXI+XHJcbiAgKi9cclxuICBmb3JtYXREYXRlKGRhdGUxKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZTEpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcclxuICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG5cclxuICAgIHJldHVybiBgJHt5ZWFyfS0keyhtb250aCA8IDEwKSA/IGAwJHttb250aH1gIDogbW9udGh9IC0gJHsoZGF5IDwgMTApID8gYDAke2RheX1gIDogZGF5fWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqINCc0LXRgtC+0LQg0LLQvtC30LLRgNCw0YnQsNC10YIg0YLQtdC60YPRidGD0Y4g0L7RgtGE0L7RgNC80LDRgtC40YDQvtCy0LDQvdC90YPRjiDQtNCw0YLRgyB5eXl5LW1tLWRkXHJcbiAgKiBAcmV0dXJuIHtbc3RyaW5nXX0g0YLQtdC60YPRidCw0Y8g0LTQsNGC0LBcclxuICAqL1xyXG4gIGdldEN1cnJlbnREYXRlKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiB0aGlzLmZvcm1hdERhdGUobm93KTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC/0L7RgdC70LXQtNC90LjQtSDRgtGA0Lgg0LzQtdGB0Y/RhtCwXHJcbiAgZ2V0RGF0ZUxhc3RUaHJlZU1vbnRoKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIGxldCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgMCwgMCk7XHJcbiAgICBjb25zdCBkaWZmID0gbm93IC0gc3RhcnQ7XHJcbiAgICBjb25zdCBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgbGV0IGRheSA9IE1hdGguZmxvb3IoZGlmZiAvIG9uZURheSk7XHJcbiAgICBkYXkgLT0gOTA7XHJcbiAgICBpZiAoZGF5IDwgMCkge1xyXG4gICAgICB5ZWFyIC09IDE7XHJcbiAgICAgIGRheSA9IDM2NSAtIGRheTtcclxuICAgIH1cclxuICAgIHJldHVybiBgJHt5ZWFyfS0ke3RoaXMubnVtYmVyRGF5c09mWWVhclhYWChkYXkpfWA7XHJcbiAgfVxyXG5cclxuICAvLyDQktC+0LfQstGA0LDRidCw0LXRgiDQuNC90YLQtdGA0LLQsNC7INC00LDRgiDRgtC10LrRg9GJ0LXQs9C+INC70LXRgtCwXHJcbiAgZ2V0Q3VycmVudFN1bW1lckRhdGUoKSB7XHJcbiAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgLy8g0JLQvtC30LLRgNCw0YnQsNC10YIg0LjQvdGC0LXRgNCy0LDQuyDQtNCw0YIg0YLQtdC60YPRidC10LPQviDQu9C10YLQsFxyXG4gIGdldEN1cnJlbnRTcHJpbmdEYXRlKCkge1xyXG4gICAgY29uc3QgeWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRhdGVGciA9IHRoaXMuY29udmVydERhdGVUb051bWJlckRheShgJHt5ZWFyfS0wMy0wMWApO1xyXG4gICAgY29uc3QgZGF0ZVRvID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA1LTMxYCk7XHJcbiAgICByZXR1cm4gW2RhdGVGciwgZGF0ZVRvXTtcclxuICB9XHJcblxyXG4gIC8vINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC40L3RgtC10YDQstCw0Lsg0LTQsNGCINC/0YDQtdC00YvQtNGD0YnQtdCz0L4g0LvQtdGC0LBcclxuICBnZXRMYXN0U3VtbWVyRGF0ZSgpIHtcclxuICAgIGNvbnN0IHllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCkgLSAxO1xyXG4gICAgY29uc3QgZGF0ZUZyID0gdGhpcy5jb252ZXJ0RGF0ZVRvTnVtYmVyRGF5KGAke3llYXJ9LTA2LTAxYCk7XHJcbiAgICBjb25zdCBkYXRlVG8gPSB0aGlzLmNvbnZlcnREYXRlVG9OdW1iZXJEYXkoYCR7eWVhcn0tMDgtMzFgKTtcclxuICAgIHJldHVybiBbZGF0ZUZyLCBkYXRlVG9dO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rmlyc3REYXRlQ3VyWWVhcigpIHtcclxuICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9IC0gMDAxYDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBkZC5tbS55eXl5IGhoOm1tXVxyXG4gICogQHBhcmFtICB7W3R5cGVdfSB0aW1lc3RhbXAgW2Rlc2NyaXB0aW9uXVxyXG4gICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgdGltZXN0YW1wVG9EYXRlVGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygpLnJlcGxhY2UoLywvLCAnJykucmVwbGFjZSgvOlxcdyskLywgJycpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICogW3RpbWVzdGFtcFRvRGF0ZSB1bml4dGltZSB0byBoaDptbV1cclxuICAqIEBwYXJhbSAge1t0eXBlXX0gdGltZXN0YW1wIFtkZXNjcmlwdGlvbl1cclxuICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICAqL1xyXG4gIHRpbWVzdGFtcFRvVGltZSh1bml4dGltZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHVuaXh0aW1lICogMTAwMCk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgIHJldHVybiBgJHtob3VycyA8IDEwID8gYDAke2hvdXJzfWAgOiBob3Vyc30gOiAke21pbnV0ZXMgPCAxMCA/IGAwJHttaW51dGVzfWAgOiBtaW51dGVzfSBgO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICog0JLQvtC30YDQsNGJ0LXQvdC40LUg0L3QvtC80LXRgNCwINC00L3RjyDQsiDQvdC10LTQtdC70LUg0L/QviB1bml4dGltZSB0aW1lc3RhbXBcclxuICAqIEBwYXJhbSB1bml4dGltZVxyXG4gICogQHJldHVybnMge251bWJlcn1cclxuICAqL1xyXG4gIGdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodW5peHRpbWUpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh1bml4dGltZSAqIDEwMDApO1xyXG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF5KCk7XHJcbiAgfVxyXG5cclxuICAvKiog0JLQtdGA0L3Rg9GC0Ywg0L3QsNC40LzQtdC90L7QstCw0L3QuNC1INC00L3RjyDQvdC10LTQtdC70LhcclxuICAqIEBwYXJhbSBkYXlOdW1iZXJcclxuICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgKi9cclxuICBnZXREYXlOYW1lT2ZXZWVrQnlEYXlOdW1iZXIoZGF5TnVtYmVyKSB7XHJcbiAgICBjb25zdCBkYXlzID0ge1xyXG4gICAgICAwOiAnU3VuJyxcclxuICAgICAgMTogJ01vbicsXHJcbiAgICAgIDI6ICdUdWUnLFxyXG4gICAgICAzOiAnV2VkJyxcclxuICAgICAgNDogJ1RodScsXHJcbiAgICAgIDU6ICdGcmknLFxyXG4gICAgICA2OiAnU2F0JyxcclxuICAgIH07XHJcbiAgICByZXR1cm4gZGF5c1tkYXlOdW1iZXJdO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQtdGA0L3Rg9GC0Ywg0J3QsNC40LzQtdC90L7QstCw0L3QuNC1INC80LXRgdGP0YbQsCDQv9C+INC10LPQviDQvdC+0LzQtdGA0YNcclxuICAgKiBAcGFyYW0gbnVtTW9udGhcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBnZXRNb250aE5hbWVCeU1vbnRoTnVtYmVyKG51bU1vbnRoKXtcclxuXHJcbiAgICBpZih0eXBlb2YgbnVtTW9udGggIT09IFwibnVtYmVyXCIgfHwgbnVtTW9udGggPD0wICYmIG51bU1vbnRoID49IDEyKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoTmFtZSA9IHtcclxuICAgICAgMDogXCJKYW5cIixcclxuICAgICAgMTogXCJGZWJcIixcclxuICAgICAgMjogXCJNYXJcIixcclxuICAgICAgMzogXCJBcHJcIixcclxuICAgICAgNDogXCJNYXlcIixcclxuICAgICAgNTogXCJKdW5cIixcclxuICAgICAgNjogXCJKdWxcIixcclxuICAgICAgNzogXCJBdWdcIixcclxuICAgICAgODogXCJTZXBcIixcclxuICAgICAgOTogXCJPY3RcIixcclxuICAgICAgMTA6IFwiTm92XCIsXHJcbiAgICAgIDExOiBcIkRlY1wiXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBtb250aE5hbWVbbnVtTW9udGhdO1xyXG4gIH1cclxuXHJcbiAgLyoqINCh0YDQsNCy0L3QtdC90LjQtSDQtNCw0YLRiyDQsiDRhNC+0YDQvNCw0YLQtSBkZC5tbS55eXl5ID0gZGQubW0ueXl5eSDRgSDRgtC10LrRg9GJ0LjQvCDQtNC90LXQvFxyXG4gICpcclxuICAqL1xyXG4gIGNvbXBhcmVEYXRlc1dpdGhUb2RheShkYXRlKSB7XHJcbiAgICByZXR1cm4gZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKSA9PT0gKG5ldyBEYXRlKCkpLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgY29udmVydFN0cmluZ0RhdGVNTUREWVlZSEhUb0RhdGUoZGF0ZSkge1xyXG4gICAgY29uc3QgcmUgPSAvKFxcZHsyfSkoXFwuezF9KShcXGR7Mn0pKFxcLnsxfSkoXFxkezR9KS87XHJcbiAgICBjb25zdCByZXNEYXRlID0gcmUuZXhlYyhkYXRlKTtcclxuICAgIGlmIChyZXNEYXRlLmxlbmd0aCA9PT0gNikge1xyXG4gICAgICByZXR1cm4gbmV3IERhdGUoYCR7cmVzRGF0ZVs1XX0tJHtyZXNEYXRlWzNdfS0ke3Jlc0RhdGVbMV19YCk7XHJcbiAgICB9XHJcbiAgICAvLyDQldGB0LvQuCDQtNCw0YLQsCDQvdC1INGA0LDRgdC/0LDRgNGB0LXQvdCwINCx0LXRgNC10Lwg0YLQtdC60YPRidGD0Y5cclxuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0LTQsNGC0YMg0LIg0YTQvtGA0LzQsNGC0LUgSEg6TU0gTW9udGhOYW1lIE51bWJlckRhdGVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICByZXR1cm4gYCR7ZGF0ZS5nZXRIb3VycygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRIb3VycygpfWAgOiBkYXRlLmdldEhvdXJzKCkgfToke2RhdGUuZ2V0TWludXRlcygpIDwgMTAgPyBgMCR7ZGF0ZS5nZXRNaW51dGVzKCl9YCA6IGRhdGUuZ2V0TWludXRlcygpfSAke3RoaXMuZ2V0TW9udGhOYW1lQnlNb250aE51bWJlcihkYXRlLmdldE1vbnRoKCkpfSAke2RhdGUuZ2V0RGF0ZSgpfWA7XHJcbiAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuXHJcbmltcG9ydCBDdXN0b21EYXRlIGZyb20gJy4vY3VzdG9tLWRhdGUnO1xyXG5cclxuLyoqXHJcbiDQk9GA0LDRhNC40Log0YLQtdC80L/QtdGA0LDRgtGD0YDRiyDQuCDQv9C+0LPQvtC00YtcclxuIEBjbGFzcyBHcmFwaGljXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaGljIGV4dGVuZHMgQ3VzdG9tRGF0ZSB7XHJcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICAvKipcclxuICAgICog0LzQtdGC0L7QtCDQtNC70Y8g0YDQsNGB0YfQtdGC0LAg0L7RgtGA0LjRgdC+0LLQutC4INC+0YHQvdC+0LLQvdC+0Lkg0LvQuNC90LjQuCDQv9Cw0YDQsNC80LXRgtGA0LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgKiBbbGluZSBkZXNjcmlwdGlvbl1cclxuICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICAqL1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZVBvbHlnb24gPSBkMy5saW5lKClcclxuICAgIC54KChkKSA9PiB7XHJcbiAgICAgIHJldHVybiBkLng7XHJcbiAgICB9KVxyXG4gICAgLnkoKGQpID0+IHtcclxuICAgICAgcmV0dXJuIGQueTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQtdC+0LHRgNCw0LfRg9C10Lwg0L7QsdGK0LXQutGCINC00LDQvdC90YvRhSDQsiDQvNCw0YHRgdC40LIg0LTQu9GPINGE0L7RgNC80LjRgNC+0LLQsNC90LjRjyDQs9GA0LDRhNC40LrQsFxyXG4gICAgICogQHBhcmFtICB7W2Jvb2xlYW5dfSB0ZW1wZXJhdHVyZSBb0L/RgNC40LfQvdCw0Log0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINCz0YDQsNGE0LjQutCwXVxyXG4gICAgICogQHJldHVybiB7W2FycmF5XX0gICByYXdEYXRhIFvQvNCw0YHRgdC40LIg0YEg0LDQtNCw0L/RgtC40YDQvtCy0LDQvdC90YvQvNC4INC/0L4g0YLQuNC/0YMg0LPRgNCw0YTQuNC60LAg0LTQsNC90L3Ri9C80LhdXHJcbiAgICAgKi9cclxuICBwcmVwYXJlRGF0YSgpIHtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGNvbnN0IHJhd0RhdGEgPSBbXTtcclxuXHJcbiAgICB0aGlzLnBhcmFtcy5kYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgcmF3RGF0YS5wdXNoKHsgeDogaSwgZGF0ZTogaSwgbWF4VDogZWxlbS5tYXgsIG1pblQ6IGVsZW0ubWluIH0pO1xyXG4gICAgICBpICs9IDE7IC8vINCh0LzQtdGJ0LXQvdC40LUg0L/QviDQvtGB0LggWFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJhd0RhdGE7XHJcbiAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10Lwg0LjQt9C+0LHRgNCw0LbQtdC90LjQtSDRgSDQutC+0L3RgtC10LrRgdGC0L7QvCDQvtCx0YrQtdC60YLQsCBzdmdcclxuICAgICAqIFttYWtlU1ZHIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHJldHVybiB7W29iamVjdF19XHJcbiAgICAgKi9cclxuICBtYWtlU1ZHKCkge1xyXG4gICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLnBhcmFtcy5pZCkuYXBwZW5kKCdzdmcnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcycpXHJcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMucGFyYW1zLndpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGVpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlJywgJyNmZmZmZmYnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICog0J7Qv9GA0LXQtNC10LvQtdC90LjQtSDQvNC40L3QuNC80LDQu9C70YzQvdC+0LPQviDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LPQviDRjdC70LXQvNC10L3RgtCwINC/0L4g0L/QsNGA0LDQvNC10YLRgNGDINC00LDRgtGLXHJcbiAgKiBbZ2V0TWluTWF4RGF0ZSBkZXNjcmlwdGlvbl1cclxuICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9C80LDRgdGB0LjQsiDRgSDQsNC00LDQv9GC0LjRgNC+0LLQsNC90L3Ri9C80Lgg0L/QviDRgtC40L/RgyDQs9GA0LDRhNC40LrQsCDQtNCw0L3QvdGL0LzQuF1cclxuICAqIEByZXR1cm4ge1tvYmplY3RdfSBkYXRhIFvQvtCx0YrQtdC60YIg0YEg0LzQuNC90LjQvNCw0LvRjNC90YvQvCDQuCDQvNCw0LrRgdC40LzQsNC70YzQvdGL0Lwg0LfQvdCw0YfQtdC90LjQtdC8XVxyXG4gICovXHJcbiAgZ2V0TWluTWF4RGF0ZShyYXdEYXRhKSB7XHJcbiAgICAvKiDQntC/0YDQtdC00LXQu9GP0LXQvCDQvNC40L3QuNC80LDQu9GM0L3Ri9C1INC4INC80LDQutGB0LzQsNC70YzQvdGL0LUg0LfQvdCw0YfQtdC90LjRjyDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0L7RgdC10LkgKi9cclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIG1heERhdGU6IDAsXHJcbiAgICAgIG1pbkRhdGU6IDEwMDAwLFxyXG4gICAgfTtcclxuXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgaWYgKGRhdGEubWF4RGF0ZSA8PSBlbGVtLmRhdGUpIHtcclxuICAgICAgICBkYXRhLm1heERhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEubWluRGF0ZSA+PSBlbGVtLmRhdGUpIHtcclxuICAgICAgICBkYXRhLm1pbkRhdGUgPSBlbGVtLmRhdGU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQsNGCINC4INGC0LXQvNC/0LXRgNCw0YLRg9GA0YtcclxuICAgICAqIFtnZXRNaW5NYXhEYXRlVGVtcGVyYXR1cmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbb2JqZWN0XX0gICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAgICAgKi9cclxuXHJcbiAgZ2V0TWluTWF4VGVtcGVyYXR1cmUocmF3RGF0YSkge1xyXG4gICAgICAgIC8qINCe0L/RgNC10LTQtdC70Y/QtdC8INC80LjQvdC40LzQsNC70YzQvdGL0LUg0Lgg0LzQsNC60YHQvNCw0LvRjNC90YvQtSDQt9C90LDRh9C10L3QuNGPINC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvtGB0LXQuSAqL1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgbWluOiAxMDAsXHJcbiAgICAgIG1heDogMCxcclxuICAgIH07XHJcblxyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLm1pbiA+PSBlbGVtLm1pblQpIHtcclxuICAgICAgICBkYXRhLm1pbiA9IGVsZW0ubWluVDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YS5tYXggPD0gZWxlbS5tYXhUKSB7XHJcbiAgICAgICAgZGF0YS5tYXggPSBlbGVtLm1heFQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBbZ2V0TWluTWF4V2VhdGhlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcmF3RGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKSB7XHJcbiAgICAgICAgLyog0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LzQuNC90LjQvNCw0LvRjNC90YvQtSDQuCDQvNCw0LrRgdC80LDQu9GM0L3Ri9C1INC30L3QsNGH0LXQvdC40Y8g0LTQu9GPINC/0L7RgdGC0YDQvtC10L3QuNGPINC+0YHQtdC5ICovXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICBtaW46IDAsXHJcbiAgICAgIG1heDogMCxcclxuICAgIH07XHJcblxyXG4gICAgcmF3RGF0YS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLm1pbiA+PSBlbGVtLmh1bWlkaXR5KSB7XHJcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1pbiA+PSBlbGVtLnJhaW5mYWxsQW1vdW50KSB7XHJcbiAgICAgICAgZGF0YS5taW4gPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1heCA8PSBlbGVtLmh1bWlkaXR5KSB7XHJcbiAgICAgICAgZGF0YS5tYXggPSBlbGVtLmh1bWlkaXR5O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLm1heCA8PSBlbGVtLnJhaW5mYWxsQW1vdW50KSB7XHJcbiAgICAgICAgZGF0YS5tYXggPSBlbGVtLnJhaW5mYWxsQW1vdW50O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAqINCe0L/RgNC10LTQtdC70Y/QtdC8INC00LvQuNC90YMg0L7RgdC10LkgWCxZXHJcbiAgKiBbbWFrZUF4ZXNYWSBkZXNjcmlwdGlvbl1cclxuICAqIEBwYXJhbSAge1thcnJheV19IHJhd0RhdGEgW9Cc0LDRgdGB0LjQsiDRgSDQtNCw0L3QvdGL0LzQuCDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LPRgNCw0YTQuNC60LBdXHJcbiAgKiBAcGFyYW0gIHtbaW50ZWdlcl19IG1hcmdpbiAgW9C+0YLRgdGC0YPQv9GLINC+0YIg0LrRgNCw0LXQsiDQs9GA0LDRhNC40LrQsF1cclxuICAqIEByZXR1cm4ge1tmdW5jdGlvbl19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICovXHJcbiAgbWFrZUF4ZXNYWShyYXdEYXRhLCBwYXJhbXMpIHtcclxuICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFg9INGI0LjRgNC40L3QsCDQutC+0L3RgtC10LnQvdC10YDQsCBzdmcgLSDQvtGC0YHRgtGD0L8g0YHQu9C10LLQsCDQuCDRgdC/0YDQsNCy0LBcclxuICAgIGNvbnN0IHhBeGlzTGVuZ3RoID0gcGFyYW1zLndpZHRoIC0gKDIgKiBwYXJhbXMubWFyZ2luKTtcclxuICAgIC8vINC00LvQuNC90LAg0L7RgdC4IFkgPSDQstGL0YHQvtGC0LAg0LrQvtC90YLQtdC50L3QtdGA0LAgc3ZnIC0g0L7RgtGB0YLRg9C/INGB0LLQtdGA0YXRgyDQuCDRgdC90LjQt9GDXHJcbiAgICBjb25zdCB5QXhpc0xlbmd0aCA9IHBhcmFtcy5oZWlnaHQgLSAoMiAqIHBhcmFtcy5tYXJnaW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnNjYWxlQXhlc1hZVGVtcGVyYXR1cmUocmF3RGF0YSwgeEF4aXNMZW5ndGgsIHlBeGlzTGVuZ3RoLCBwYXJhbXMpO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICogLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0Lgg0KUg0LggWVxyXG4gICogW3NjYWxlQXhlc1hZIGRlc2NyaXB0aW9uXVxyXG4gICogQHBhcmFtICB7W29iamVjdF19ICByYXdEYXRhICAgICBb0J7QsdGK0LXQutGCINGBINC00LDQvdC90YvQvNC4INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQs9GA0LDRhNC40LrQsF1cclxuICAqIEBwYXJhbSAge2Z1bmN0aW9ufSB4QXhpc0xlbmd0aCBb0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC40LUg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCBYXVxyXG4gICogQHBhcmFtICB7ZnVuY3Rpb259IHlBeGlzTGVuZ3RoIFvQuNC90YLQtdGA0L/QvtC70LjRgNC+0LLQsNC90LjQtSDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMIFldXHJcbiAgKiBAcGFyYW0gIHtbdHlwZV19ICBtYXJnaW4gICAgICBb0L7RgtGB0YLRg9C/0Ysg0L7RgiDQutGA0LDQtdCyINCz0YDQsNGE0LjQutCwXVxyXG4gICogQHJldHVybiB7W2FycmF5XX0gICAgICAgICAgICAgIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxyXG4gICovXHJcbiAgc2NhbGVBeGVzWFlUZW1wZXJhdHVyZShyYXdEYXRhLCB4QXhpc0xlbmd0aCwgeUF4aXNMZW5ndGgsIHBhcmFtcykge1xyXG4gICAgY29uc3QgeyBtYXhEYXRlLCBtaW5EYXRlIH0gPSB0aGlzLmdldE1pbk1heERhdGUocmF3RGF0YSk7XHJcbiAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzLmdldE1pbk1heFRlbXBlcmF0dXJlKHJhd0RhdGEpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiDQvNC10YLQvtC0INC40L3RgtC10YDQv9C+0LvRj9GG0LjQuCDQt9C90LDRh9C10L3QuNC5INC90LAg0L7RgdGMINClXHJcbiAgICAqIFtzY2FsZVRpbWUgZGVzY3JpcHRpb25dXHJcbiAgICAqL1xyXG4gICAgY29uc3Qgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcclxuICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAucmFuZ2UoWzAsIHhBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqINC80LXRgtC+0LQg0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxyXG4gICAgKiBbc2NhbGVMaW5lYXIgZGVzY3JpcHRpb25dXHJcbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgKi9cclxuICAgIGNvbnN0IHNjYWxlWSA9IGQzLnNjYWxlTGluZWFyKClcclxuICAgIC5kb21haW4oW21heCArIDUsIG1pbiAtIDVdKVxyXG4gICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG5cclxuICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIHBhcmFtcy5vZmZzZXRYLFxyXG4gICAgICAgIG1heFQ6IHNjYWxlWShlbGVtLm1heFQpICsgcGFyYW1zLm9mZnNldFgsXHJcbiAgICAgICAgbWluVDogc2NhbGVZKGVsZW0ubWluVCkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4geyBzY2FsZVgsIHNjYWxlWSwgZGF0YSB9O1xyXG4gIH1cclxuXHJcbiAgc2NhbGVBeGVzWFlXZWF0aGVyKHJhd0RhdGEsIHhBeGlzTGVuZ3RoLCB5QXhpc0xlbmd0aCwgbWFyZ2luKSB7XHJcbiAgICBjb25zdCB7IG1heERhdGUsIG1pbkRhdGUgfSA9IHRoaXMuZ2V0TWluTWF4RGF0ZShyYXdEYXRhKTtcclxuICAgIGNvbnN0IHsgbWluLCBtYXggfSA9IHRoaXMuZ2V0TWluTWF4V2VhdGhlcihyYXdEYXRhKTtcclxuXHJcbiAgICAvLyDRhNGD0L3QutGG0LjRjyDQuNC90YLQtdGA0L/QvtC70Y/RhtC40Lgg0LfQvdCw0YfQtdC90LjQuSDQvdCwINC+0YHRjCDQpVxyXG4gICAgY29uc3Qgc2NhbGVYID0gZDMuc2NhbGVUaW1lKClcclxuICAgIC5kb21haW4oW25ldyBEYXRlKG1pbkRhdGUpLCBuZXcgRGF0ZShtYXhEYXRlKV0pXHJcbiAgICAucmFuZ2UoWzAsIHhBeGlzTGVuZ3RoXSk7XHJcblxyXG4gICAgLy8g0YTRg9C90LrRhtC40Y8g0LjQvdGC0LXRgNC/0L7Qu9GP0YbQuNC4INC30L3QsNGH0LXQvdC40Lkg0L3QsCDQvtGB0YwgWVxyXG4gICAgY29uc3Qgc2NhbGVZID0gZDMuc2NhbGVMaW5lYXIoKVxyXG4gICAgLmRvbWFpbihbbWF4LCBtaW5dKVxyXG4gICAgLnJhbmdlKFswLCB5QXhpc0xlbmd0aF0pO1xyXG4gICAgY29uc3QgZGF0YSA9IFtdO1xyXG5cclxuICAgIC8vINC80LDRgdGI0YLQsNCx0LjRgNC+0LLQsNC90LjQtSDRgNC10LDQu9GM0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQtNCw0L3QvdGL0LUg0LTQu9GPINC90LDRiNC10Lkg0LrQvtC+0YDQtNC40L3QsNGC0L3QvtC5INGB0LjRgdGC0LXQvNGLXHJcbiAgICByYXdEYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgZGF0YS5wdXNoKHtcclxuICAgICAgICB4OiBzY2FsZVgoZWxlbS5kYXRlKSArIG1hcmdpbixcclxuICAgICAgICBodW1pZGl0eTogc2NhbGVZKGVsZW0uaHVtaWRpdHkpICsgbWFyZ2luLFxyXG4gICAgICAgIHJhaW5mYWxsQW1vdW50OiBzY2FsZVkoZWxlbS5yYWluZmFsbEFtb3VudCkgKyBtYXJnaW4sXHJcbiAgICAgICAgY29sb3I6IGVsZW0uY29sb3IsXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfTtcclxuICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC+0YDQvNC40LLQsNGA0L7QvdC40LUg0LzQsNGB0YHQuNCy0LAg0LTQu9GPINGA0LjRgdC+0LLQsNC90LjRjyDQv9C+0LvQuNC70LjQvdC40LhcclxuICAgICAqIFttYWtlUG9seWxpbmUgZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcGFyYW0gIHtbYXJyYXldfSBkYXRhIFvQvNCw0YHRgdC40LIg0YEg0LjQvdGC0LXRgNC/0L7Qu9C40YDQvtCy0LDQvdC90YvQvNC4INC30L3QsNGH0LXQvdC40Y/QvNC4XVxyXG4gICAgICogQHBhcmFtICB7W2ludGVnZXJdfSBtYXJnaW4gW9C+0YLRgdGC0YPQvyDQvtGCINC60YDQsNC10LIg0LPRgNCw0YTQuNC60LBdXHJcbiAgICAgKiBAcGFyYW0gIHtbb2JqZWN0XX0gc2NhbGVYLCBzY2FsZVkgW9C+0LHRitC10LrRgtGLINGBINGE0YPQvdC60YbQuNGP0LzQuCDQuNC90YLQtdGA0L/QvtC70Y/RhtC40LggWCxZXVxyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgbWFrZVBvbHlsaW5lKGRhdGEsIHBhcmFtcywgc2NhbGVYLCBzY2FsZVkpIHtcclxuICAgIGNvbnN0IGFyclBvbHlsaW5lID0gW107XHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgYXJyUG9seWxpbmUucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICB5OiBzY2FsZVkoZWxlbS5tYXhUKSArIHBhcmFtcy5vZmZzZXRZIH0sXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICAgIGRhdGEucmV2ZXJzZSgpLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgYXJyUG9seWxpbmUucHVzaCh7XHJcbiAgICAgICAgeDogc2NhbGVYKGVsZW0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgICB5OiBzY2FsZVkoZWxlbS5taW5UKSArIHBhcmFtcy5vZmZzZXRZLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgYXJyUG9seWxpbmUucHVzaCh7XHJcbiAgICAgIHg6IHNjYWxlWChkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0ZSkgKyBwYXJhbXMub2Zmc2V0WCxcclxuICAgICAgeTogc2NhbGVZKGRhdGFbZGF0YS5sZW5ndGggLSAxXS5tYXhUKSArIHBhcmFtcy5vZmZzZXRZLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGFyclBvbHlsaW5lO1xyXG4gIH1cclxuICAgIC8qKlxyXG4gICAgICog0J7RgtGA0LjRgdC+0LLQutCwINC/0L7Qu9C40LvQuNC90LjQuSDRgSDQt9Cw0LvQuNCy0LrQvtC5INC+0YHQvdC+0LLQvdC+0Lkg0Lgg0LjQvNC40YLQsNGG0LjRjyDQtdC1INGC0LXQvdC4XHJcbiAgICAgKiBbZHJhd1BvbHVsaW5lIGRlc2NyaXB0aW9uXVxyXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBzdmcgIFtkZXNjcmlwdGlvbl1cclxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgZHJhd1BvbHlsaW5lKHN2ZywgZGF0YSkge1xyXG4gICAgICAgIC8vINC00L7QsdCw0LLQu9GP0LXQvCDQv9GD0YLRjCDQuCDRgNC40YHRg9C10Lwg0LvQuNC90LjQuFxyXG5cclxuICAgIHN2Zy5hcHBlbmQoJ2cnKS5hcHBlbmQoJ3BhdGgnKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIHRoaXMucGFyYW1zLnN0cm9rZVdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cignZCcsIHRoaXMudGVtcGVyYXR1cmVQb2x5Z29uKGRhdGEpKVxyXG4gICAgICAgICAgICAuc3R5bGUoJ3N0cm9rZScsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbCcsIHRoaXMucGFyYW1zLmNvbG9yUG9saWx5bmUpXHJcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xyXG4gIH1cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0L3QsNC00L/QuNGB0LXQuSDRgSDQv9C+0LrQsNC30LDRgtC10LvRj9C80Lgg0YLQtdC80L/QtdGA0LDRgtGD0YDRiyDQvdCwINC+0YHRj9GFXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSBzdmcgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSAgIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHBhcmFtcyBbZGVzY3JpcHRpb25dXHJcbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIGRyYXdMYWJlbHNUZW1wZXJhdHVyZShzdmcsIGRhdGEsIHBhcmFtcykge1xyXG4gICAgZGF0YS5mb3JFYWNoKChlbGVtLCBpdGVtLCBkYXRhKSA9PiB7XHJcbiAgICAgIC8vINC+0YLRgNC40YHQvtCy0LrQsCDRgtC10LrRgdGC0LBcclxuICAgICAgc3ZnLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgIC5hdHRyKCd4JywgZWxlbS54KVxyXG4gICAgICAuYXR0cigneScsIChlbGVtLm1heFQgLSAyKSAtIChwYXJhbXMub2Zmc2V0WCAvIDIpKVxyXG4gICAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcclxuICAgICAgLnN0eWxlKCdmb250LXNpemUnLCBwYXJhbXMuZm9udFNpemUpXHJcbiAgICAgIC5zdHlsZSgnc3Ryb2tlJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnN0eWxlKCdmaWxsJywgcGFyYW1zLmZvbnRDb2xvcilcclxuICAgICAgLnRleHQoYCR7cGFyYW1zLmRhdGFbaXRlbV0ubWF4fcKwYCk7XHJcblxyXG4gICAgICBzdmcuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgLmF0dHIoJ3gnLCBlbGVtLngpXHJcbiAgICAgIC5hdHRyKCd5JywgKGVsZW0ubWluVCArIDcpICsgKHBhcmFtcy5vZmZzZXRZIC8gMikpXHJcbiAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxyXG4gICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIHBhcmFtcy5mb250U2l6ZSlcclxuICAgICAgLnN0eWxlKCdzdHJva2UnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCBwYXJhbXMuZm9udENvbG9yKVxyXG4gICAgICAudGV4dChgJHtwYXJhbXMuZGF0YVtpdGVtXS5taW59wrBgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXRgtC+0LQg0LTQuNGB0L/QtdGC0YfQtdGAINC/0YDQvtGA0LjRgdC+0LLQutCwINCz0YDQsNGE0LjQutCwINGB0L4g0LLRgdC10LzQuCDRjdC70LXQvNC10L3RgtCw0LzQuFxyXG4gICAgICogW3JlbmRlciBkZXNjcmlwdGlvbl1cclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAgICovXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3Qgc3ZnID0gdGhpcy5tYWtlU1ZHKCk7XHJcbiAgICBjb25zdCByYXdEYXRhID0gdGhpcy5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgIGNvbnN0IHsgc2NhbGVYLCBzY2FsZVksIGRhdGEgfSA9IHRoaXMubWFrZUF4ZXNYWShyYXdEYXRhLCB0aGlzLnBhcmFtcyk7XHJcbiAgICBjb25zdCBwb2x5bGluZSA9IHRoaXMubWFrZVBvbHlsaW5lKHJhd0RhdGEsIHRoaXMucGFyYW1zLCBzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICB0aGlzLmRyYXdQb2x5bGluZShzdmcsIHBvbHlsaW5lKTtcclxuICAgIHRoaXMuZHJhd0xhYmVsc1RlbXBlcmF0dXJlKHN2ZywgZGF0YSwgdGhpcy5wYXJhbXMpO1xyXG4gICAgICAgIC8vIHRoaXMuZHJhd01hcmtlcnMoc3ZnLCBwb2x5bGluZSwgdGhpcy5tYXJnaW4pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiLy8g0JzQvtC00YPQu9GMINC00LjRgdC/0LXRgtGH0LXRgCDQtNC70Y8g0L7RgtGA0LjRgdC+0LLQutC4INCx0LDQvdC90LXRgNGA0L7QsiDQvdCwINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtVxyXG5pbXBvcnQgV2VhdGhlcldpZGdldCBmcm9tICcuL3dlYXRoZXItd2lkZ2V0JztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICAvLyDQpNC+0YDQvNC40YDRg9C10Lwg0L/QsNGA0LDQvNC10YLRgCDRhNC40LvRjNGC0YDQsCDQv9C+INCz0L7RgNC+0LTRg1xyXG4gIGxldCBxID0gJyc7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpIHtcclxuICAgIHEgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBxID0gJz9xPUxvbmRvbic7XHJcbiAgfVxyXG5cclxuICBjb25zdCB1cmxEb21haW4gPSAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcnO1xyXG5cclxuICBjb25zdCBwYXJhbXNXaWRnZXQgPSB7XHJcbiAgICBjaXR5TmFtZTogJ01vc2NvdycsXHJcbiAgICBsYW5nOiAnZW4nLFxyXG4gICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICB1bml0czogJ21ldHJpYycsXHJcbiAgICB0ZXh0VW5pdFRlbXA6IFN0cmluZy5mcm9tQ29kZVBvaW50KDB4MDBCMCksICAvLyAyNDhcclxuICB9O1xyXG5cclxuICBjb25zdCBjb250cm9sc1dpZGdldCA9IHtcclxuICAgIC8vINCf0LXRgNCy0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcclxuICAgIGNpdHlOYW1lOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LWRhcmstbWVudV9faGVhZGVyJyksXHJcbiAgICB0ZW1wZXJhdHVyZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItZGFyay1jYXJkX19udW1iZXInKSxcclxuICAgIG5hdHVyYWxQaGVub21lbm9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1kYXJrLWNhcmRfX21lYW5zJyksXHJcbiAgICB3aW5kU3BlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWRhcmstY2FyZF9fd2luZCcpLFxyXG4gICAgbWFpbkljb25XZWF0aGVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1kYXJrLWNhcmRfX2ltZycpLFxyXG4gICAgY2FsZW5kYXJJdGVtOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FsZW5kYXJfX2l0ZW0nKSxcclxuICAgIGdyYXBoaWM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncmFwaGljJyksXHJcbiAgICAvLyDQktGC0L7RgNCw0Y8g0L/QvtC70L7QstC40L3QsCDQstC40LTQttC10YLQvtCyXHJcbiAgICBjaXR5TmFtZTI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtbGl0ZV9fdGl0bGUnKSxcclxuICAgIHRlbXBlcmF0dXJlMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGl0ZV9fdGVtcGVyYXR1cmUnKSxcclxuICAgIHRlbXBlcmF0dXJlRmVlbHM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxpdGVfX2ZlZWxzJyksXHJcbiAgICB0ZW1wZXJhdHVyZU1pbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGl0ZS1jYXJkX190ZW1wZXJhdHVyZS1taW4nKSxcclxuICAgIHRlbXBlcmF0dXJlTWF4OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1saXRlLWNhcmRfX3RlbXBlcmF0dXJlLW1heCcpLFxyXG4gICAgbmF0dXJhbFBoZW5vbWVub24yOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2lkZ2V0LWxpdGVfX2Rlc2NyaXB0aW9uJyksXHJcbiAgICB3aW5kU3BlZWQyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1saXRlX193aW5kLXNwZWVkJyksXHJcbiAgICBtYWluSWNvbldlYXRoZXIyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1saXRlX19pY29uJyksXHJcbiAgICBodW1pZGl0eTogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGl0ZV9faHVtaWRpdHknKSxcclxuICAgIHByZXNzdXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1saXRlX19wcmVzc3VyZScpLFxyXG4gICAgZGF0ZVJlcG9ydDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aWRnZXQtbGl0ZV9fZGF0ZVwiKSxcclxuICB9O1xyXG5cclxuICBjb25zdCB1cmxzID0ge1xyXG4gICAgdXJsV2VhdGhlckFQSTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS93ZWF0aGVyJHtxfSZ1bml0cz0ke3BhcmFtc1dpZGdldC51bml0c30mYXBwaWQ9JHtwYXJhbXNXaWRnZXQuYXBwaWR9YCxcclxuICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dXJsRG9tYWlufS9kYXRhLzIuNS9mb3JlY2FzdC9kYWlseSR7cX0mdW5pdHM9JHtwYXJhbXNXaWRnZXQudW5pdHN9JmNudD04JmFwcGlkPSR7cGFyYW1zV2lkZ2V0LmFwcGlkfWAsXHJcbiAgICB3aW5kU3BlZWQ6ICdkYXRhL3dpbmQtc3BlZWQtZGF0YS5qc29uJyxcclxuICAgIHdpbmREaXJlY3Rpb246ICdkYXRhL3dpbmQtZGlyZWN0aW9uLWRhdGEuanNvbicsXHJcbiAgICBjbG91ZHM6ICdkYXRhL2Nsb3Vkcy1kYXRhLmpzb24nLFxyXG4gICAgbmF0dXJhbFBoZW5vbWVub246ICdkYXRhL25hdHVyYWwtcGhlbm9tZW5vbi1kYXRhLmpzb24nLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9ialdpZGdldCA9IG5ldyBXZWF0aGVyV2lkZ2V0KHBhcmFtc1dpZGdldCwgY29udHJvbHNXaWRnZXQsIHVybHMpO1xyXG4gIG9ialdpZGdldC5yZW5kZXIoKTtcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IERlbmlzIG9uIDI5LjA5LjIwMTYuXHJcbiAqL1xyXG5cclxuaW1wb3J0IEN1c3RvbURhdGUgZnJvbSAnLi9jdXN0b20tZGF0ZSc7XHJcbmltcG9ydCBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYy1kM2pzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYXRoZXJXaWRnZXQgZXh0ZW5kcyBDdXN0b21EYXRlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocGFyYW1zLCBjb250cm9scywgdXJscykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xyXG4gICAgdGhpcy51cmxzID0gdXJscztcclxuXHJcbiAgICAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC+0LHRitC10LrRgiDQv9GD0YHRgtGL0LzQuCDQt9C90LDRh9C10L3QuNGP0LzQuFxyXG4gICAgdGhpcy53ZWF0aGVyID0ge1xyXG4gICAgICBmcm9tQVBJOiB7XHJcbiAgICAgICAgY29vcmQ6IHtcclxuICAgICAgICAgIGxvbjogJzAnLFxyXG4gICAgICAgICAgbGF0OiAnMCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB3ZWF0aGVyOiBbe1xyXG4gICAgICAgICAgaWQ6ICcgJyxcclxuICAgICAgICAgIG1haW46ICcgJyxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnICcsXHJcbiAgICAgICAgICBpY29uOiAnICcsXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgYmFzZTogJyAnLFxyXG4gICAgICAgIG1haW46IHtcclxuICAgICAgICAgIHRlbXA6IDAsXHJcbiAgICAgICAgICBwcmVzc3VyZTogJyAnLFxyXG4gICAgICAgICAgaHVtaWRpdHk6ICcgJyxcclxuICAgICAgICAgIHRlbXBfbWluOiAnICcsXHJcbiAgICAgICAgICB0ZW1wX21heDogJyAnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2luZDoge1xyXG4gICAgICAgICAgc3BlZWQ6IDAsXHJcbiAgICAgICAgICBkZWc6ICcgJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJhaW46IHt9LFxyXG4gICAgICAgIGNsb3Vkczoge1xyXG4gICAgICAgICAgYWxsOiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdDogJycsXHJcbiAgICAgICAgc3lzOiB7XHJcbiAgICAgICAgICB0eXBlOiAnICcsXHJcbiAgICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJyAnLFxyXG4gICAgICAgICAgY291bnRyeTogJyAnLFxyXG4gICAgICAgICAgc3VucmlzZTogJyAnLFxyXG4gICAgICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpZDogJyAnLFxyXG4gICAgICAgIG5hbWU6ICdVbmRlZmluZWQnLFxyXG4gICAgICAgIGNvZDogJyAnLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxyXG4gICAqIEBwYXJhbSB1cmxcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cclxuICBodHRwR2V0KHVybCkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICBlcnJvci5jb2RlID0gdGhpcy5zdGF0dXM7XHJcbiAgICAgICAgICByZWplY3QodGhhdC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICByZWplY3QobmV3IEVycm9yKGDQktGA0LXQvNGPINC+0LbQuNC00LDQvdC40Y8g0L7QsdGA0LDRidC10L3QuNGPINC6INGB0LXRgNCy0LXRgNGDIEFQSSDQuNGB0YLQtdC60LvQviAke2UudHlwZX0gJHtlLnRpbWVTdGFtcC50b0ZpeGVkKDIpfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYNCe0YjQuNCx0LrQsCDQvtCx0YDQsNGJ0LXQvdC40Y8g0Log0YHQtdGA0LLQtdGA0YMgJHtlfWApKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2VuZChudWxsKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JfQsNC/0YDQvtGBINC6IEFQSSDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgtC10LrRg9GJ0LXQuSDQv9C+0LPQvtC00YtcclxuICAgKi9cclxuICBnZXRXZWF0aGVyRnJvbUFwaSgpIHtcclxuICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMudXJsV2VhdGhlckFQSSlcclxuICAgICAgLnRoZW4oXHJcbiAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLndlYXRoZXIuZnJvbUFQSSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgdGhpcy5odHRwR2V0KHRoaXMudXJscy5uYXR1cmFsUGhlbm9tZW5vbilcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYXRoZXIubmF0dXJhbFBoZW5vbWVub24gPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMud2luZFNwZWVkKVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci53aW5kU3BlZWQgPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHR0cEdldCh0aGlzLnVybHMucGFyYW1zVXJsRm9yZURhaWx5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh0dHBHZXQodGhpcy51cmxzLndpbmREaXJlY3Rpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWF0aGVyLndpbmREaXJlY3Rpb24gPSByZXNwb25zZVt0aGlzLnBhcmFtcy5sYW5nXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg0JLQvtC30L3QuNC60LvQsCDQvtGI0LjQsdC60LAgJHtlcnJvcn1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEYXRhRnJvbVNlcnZlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRGF0YUZyb21TZXJ2ZXIoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGDQktC+0LfQvdC40LrQu9CwINC+0YjQuNCx0LrQsCAke2Vycm9yfWApO1xyXG4gICAgICAgICAgdGhpcy5wYXJzZURhdGFGcm9tU2VydmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog0JzQtdGC0L7QtCDQstC+0LfQstGA0LDRidCw0LXRgiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0YHQtdC70LXQutGC0L7RgCDQv9C+INC30L3QsNGH0LXQvdC40Y4g0LTQvtGH0LXRgNC90LXQs9C+INGD0LfQu9CwINCyIEpTT05cclxuICAgKiBAcGFyYW0ge29iamVjdH0gSlNPTlxyXG4gICAqIEBwYXJhbSB7dmFyaWFudH0gZWxlbWVudCDQl9C90LDRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LDRgNC90L7Qs9C+INGC0LjQv9CwLCDQtNC+0YfQtdGA0L3QtdCz0L4g0YPQt9C70LAg0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQvlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50TmFtZSDQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0LjRgdC60L7QvNC+0LPQviDRgdC10LvQtdC60YLQvtGA0LAs0LTQu9GPINC/0L7QuNGB0LrQsCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0LPQviDRgdC10LvQtdC60YLQvtGA0LBcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9INCd0LDQuNC80LXQvdC+0LLQsNC90LjQtSDQuNGB0LrQvtC80L7Qs9C+INGB0LXQu9C10LrRgtC+0YDQsFxyXG4gICAqL1xyXG4gIGdldFBhcmVudFNlbGVjdG9yRnJvbU9iamVjdChvYmplY3QsIGVsZW1lbnQsIGVsZW1lbnROYW1lLCBlbGVtZW50TmFtZTIpIHtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iamVjdCkge1xyXG4gICAgICAvLyDQldGB0LvQuCDRgdGA0LDQstC90LXQvdC40LUg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINGBINC+0LHRitC10LrRgtC+0Lwg0LjQtyDQtNCy0YPRhSDRjdC70LXQvNC10L3RgtC+0LIg0LLQstC40LTQtSDQuNC90YLQtdGA0LLQsNC70LBcclxuICAgICAgaWYgKHR5cGVvZiBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gPT09ICdvYmplY3QnICYmIGVsZW1lbnROYW1lMiA9PSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPj0gb2JqZWN0W2tleV1bZWxlbWVudE5hbWVdWzBdICYmIGVsZW1lbnQgPCBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV1bMV0pIHtcclxuICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vINGB0YDQsNCy0L3QtdC90LjQtSDQv9GA0L7QuNC30LLQvtC00LjRgtGB0Y8g0YHQviDQt9C90LDRh9C10L3QuNC10Lwg0Y3Qu9C10LzQtdC90YLQsNGA0L3QvtCz0L4g0YLQuNC/0LAg0YEg0LTQstGD0LzRjyDRjdC70LXQvNC10L3RgtCw0LzQuCDQsiBKU09OXHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudE5hbWUyICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZWxlbWVudCA+PSBvYmplY3Rba2V5XVtlbGVtZW50TmFtZV0gJiYgZWxlbWVudCA8IG9iamVjdFtrZXldW2VsZW1lbnROYW1lMl0pIHtcclxuICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQktC+0LfQstGA0LDRidCw0LXRgiBKU09OINGBINC80LXRgtC10L7QtNCw0L3Ri9C80LhcclxuICAgKiBAcGFyYW0ganNvbkRhdGFcclxuICAgKiBAcmV0dXJucyB7Kn1cclxuICAgKi9cclxuICBwYXJzZURhdGFGcm9tU2VydmVyKCkge1xyXG4gICAgY29uc3Qgd2VhdGhlciA9IHRoaXMud2VhdGhlcjtcclxuXHJcbiAgICBpZiAod2VhdGhlci5mcm9tQVBJLm5hbWUgPT09ICdVbmRlZmluZWQnIHx8IHdlYXRoZXIuZnJvbUFQSS5jb2QgPT09ICc0MDQnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCfQlNCw0L3QvdGL0LUg0L7RgiDRgdC10YDQstC10YDQsCDQvdC1INC/0L7Qu9GD0YfQtdC90YsnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0L7QsdGK0LXQutGCXHJcbiAgICBjb25zdCBtZXRhZGF0YSA9IHtcclxuICAgICAgY2xvdWRpbmVzczogJyAnLFxyXG4gICAgICBkdDogJyAnLFxyXG4gICAgICBjaXR5TmFtZTogJyAnLFxyXG4gICAgICBpY29uOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlTWluOiAnICcsXHJcbiAgICAgIHRlbXBlcmF0dXJlTUF4OiAnICcsXHJcbiAgICAgIHByZXNzdXJlOiAnICcsXHJcbiAgICAgIGh1bWlkaXR5OiAnICcsXHJcbiAgICAgIHN1bnJpc2U6ICcgJyxcclxuICAgICAgc3Vuc2V0OiAnICcsXHJcbiAgICAgIGNvb3JkOiAnICcsXHJcbiAgICAgIHdpbmQ6ICcgJyxcclxuICAgICAgd2VhdGhlcjogJyAnLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gcGFyc2VJbnQod2VhdGhlci5mcm9tQVBJLm1haW4udGVtcC50b0ZpeGVkKDApLCAxMCkgKyAwO1xyXG4gICAgbWV0YWRhdGEuY2l0eU5hbWUgPSBgJHt3ZWF0aGVyLmZyb21BUEkubmFtZX0sICR7d2VhdGhlci5mcm9tQVBJLnN5cy5jb3VudHJ5fWA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZSA9IHRlbXBlcmF0dXJlOyAvLyBgJHt0ZW1wID4gMCA/IGArJHt0ZW1wfWAgOiB0ZW1wfWA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1pbiA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWluLnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBtZXRhZGF0YS50ZW1wZXJhdHVyZU1heCA9IHBhcnNlSW50KHdlYXRoZXIuZnJvbUFQSS5tYWluLnRlbXBfbWF4LnRvRml4ZWQoMCksIDEwKSArIDA7XHJcbiAgICBpZiAod2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vbikge1xyXG4gICAgICBtZXRhZGF0YS53ZWF0aGVyID0gd2VhdGhlci5uYXR1cmFsUGhlbm9tZW5vblt3ZWF0aGVyLmZyb21BUEkud2VhdGhlclswXS5pZF07XHJcbiAgICB9XHJcbiAgICBpZiAod2VhdGhlci53aW5kU3BlZWQpIHtcclxuICAgICAgbWV0YWRhdGEud2luZFNwZWVkID0gYFdpbmQ6ICR7d2VhdGhlci5mcm9tQVBJLndpbmQuc3BlZWQudG9GaXhlZCgxKX0gbS9zICR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlci53aW5kU3BlZWQsIHdlYXRoZXIuZnJvbUFQSS53aW5kLnNwZWVkLnRvRml4ZWQoMSksICdzcGVlZF9pbnRlcnZhbCcpfWA7XHJcbiAgICAgIG1ldGFkYXRhLndpbmRTcGVlZDIgPSBgJHt3ZWF0aGVyLmZyb21BUEkud2luZC5zcGVlZC50b0ZpeGVkKDEpfSBtL3NgO1xyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIud2luZERpcmVjdGlvbikge1xyXG4gICAgICBtZXRhZGF0YS53aW5kRGlyZWN0aW9uID0gYCR7dGhpcy5nZXRQYXJlbnRTZWxlY3RvckZyb21PYmplY3Qod2VhdGhlcltcIndpbmREaXJlY3Rpb25cIl0sIHdlYXRoZXJbXCJmcm9tQVBJXCJdW1wid2luZFwiXVtcImRlZ1wiXSwgXCJkZWdfaW50ZXJ2YWxcIil9YFxyXG4gICAgfVxyXG4gICAgaWYgKHdlYXRoZXIuY2xvdWRzKSB7XHJcbiAgICAgIG1ldGFkYXRhLmNsb3VkcyA9IGAke3RoaXMuZ2V0UGFyZW50U2VsZWN0b3JGcm9tT2JqZWN0KHdlYXRoZXIuY2xvdWRzLCB3ZWF0aGVyLmZyb21BUEkuY2xvdWRzLmFsbCwgJ21pbicsICdtYXgnKX1gO1xyXG4gICAgfVxyXG5cclxuICAgIG1ldGFkYXRhLmh1bWlkaXR5ID0gYCR7d2VhdGhlci5mcm9tQVBJLm1haW4uaHVtaWRpdHl9JWA7XHJcbiAgICBtZXRhZGF0YS5wcmVzc3VyZSA9ICBgJHt3ZWF0aGVyW1wiZnJvbUFQSVwiXVtcIm1haW5cIl1bXCJwcmVzc3VyZVwiXX0gbWJgO1xyXG4gICAgbWV0YWRhdGEuaWNvbiA9IGAke3dlYXRoZXIuZnJvbUFQSS53ZWF0aGVyWzBdLmljb259YDtcclxuXHJcbiAgICB0aGlzLnJlbmRlcldpZGdldChtZXRhZGF0YSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXJXaWRnZXQobWV0YWRhdGEpIHtcclxuICAgIC8vINCe0L7RgtGA0LjRgdC+0LLQutCwINC/0LXRgNCy0YvRhSDRh9C10YLRi9GA0LXRhSDQstC40LTQttC10YLQvtCyXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5jaXR5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuY2l0eU5hbWVbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZSkge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy50ZW1wZXJhdHVyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4gY2xhc3M9J3dlYXRoZXItZGFyay1jYXJkX19kZWdyZWUnPiR7dGhpcy5wYXJhbXMudGV4dFVuaXRUZW1wfTwvc3Bhbj5gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm1haW5JY29uV2VhdGhlci5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXJbZWxlbV0uYWx0ID0gYFdlYXRoZXIgaW4gJHttZXRhZGF0YS5jaXR5TmFtZSA/IG1ldGFkYXRhLmNpdHlOYW1lIDogJyd9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub24uaGFzT3duUHJvcGVydHkoZWxlbSkpIHtcclxuICAgICAgICAgIHRoaXMuY29udHJvbHMubmF0dXJhbFBoZW5vbWVub25bZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtZXRhZGF0YS53aW5kU3BlZWQpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMud2luZFNwZWVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbHMud2luZFNwZWVkLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZFtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS53aW5kU3BlZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J7RgtGA0LjRgdC+0LLQutCwINC/0Y/RgtC4INC/0L7RgdC70LXQtNC90LjRhSDQstC40LTQttC10YLQvtCyXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy5jaXR5TmFtZTIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuY2l0eU5hbWUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5jaXR5TmFtZTJbZWxlbV0uaW5uZXJIVE1MID0gbWV0YWRhdGEuY2l0eU5hbWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTIpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmUyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZTJbZWxlbV0uaW5uZXJIVE1MID0gYCR7bWV0YWRhdGEudGVtcGVyYXR1cmV9PHNwYW4+JHt0aGlzLnBhcmFtcy50ZXh0VW5pdFRlbXB9PC9zcGFuPmA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVscy5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMudGVtcGVyYXR1cmVGZWVsc1tlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWluLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1pbltlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4KSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzLnRlbXBlcmF0dXJlTWF4Lmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy50ZW1wZXJhdHVyZU1heFtlbGVtXS5pbm5lckhUTUwgPSBgJHttZXRhZGF0YS50ZW1wZXJhdHVyZX08c3Bhbj4ke3RoaXMucGFyYW1zLnRleHRVbml0VGVtcH08L3NwYW4+YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRhZGF0YS53ZWF0aGVyKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMikge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xzLm5hdHVyYWxQaGVub21lbm9uMi5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5uYXR1cmFsUGhlbm9tZW5vbjJbZWxlbV0uaW5uZXJUZXh0ID0gbWV0YWRhdGEud2VhdGhlcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEud2luZFNwZWVkMiAmJiBtZXRhZGF0YS53aW5kRGlyZWN0aW9uKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDIpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy53aW5kU3BlZWQyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xzLndpbmRTcGVlZDJbZWxlbV0uaW5uZXJUZXh0ID0gYCR7bWV0YWRhdGEud2luZFNwZWVkMn0gJHttZXRhZGF0YS53aW5kRGlyZWN0aW9ufWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMubWFpbkljb25XZWF0aGVyMikge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLnNyYyA9IHRoaXMuZ2V0VVJMTWFpbkljb24obWV0YWRhdGEuaWNvbiwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5tYWluSWNvbldlYXRoZXIyW2VsZW1dLmFsdCA9IGBXZWF0aGVyIGluICR7bWV0YWRhdGEuY2l0eU5hbWUgPyBtZXRhZGF0YS5jaXR5TmFtZSA6ICcnfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEuaHVtaWRpdHkpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMuaHVtaWRpdHkpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5odW1pZGl0eS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5odW1pZGl0eVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5odW1pZGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWV0YWRhdGEucHJlc3N1cmUpIHtcclxuICAgICAgZm9yIChjb25zdCBlbGVtIGluIHRoaXMuY29udHJvbHMucHJlc3N1cmUpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250cm9scy5wcmVzc3VyZS5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgICAgdGhpcy5jb250cm9scy5wcmVzc3VyZVtlbGVtXS5pbm5lclRleHQgPSBtZXRhZGF0YS5wcmVzc3VyZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vINCf0YDQvtC/0LjRgdGL0LLQsNC10Lwg0YLQtdC60YPRidGD0Y4g0LTQsNGC0YMg0LIg0LLQuNC00LbQtdGC0YtcclxuICAgIGZvciAoY29uc3QgZWxlbSBpbiB0aGlzLmNvbnRyb2xzLmRhdGVSZXBvcnQpIHtcclxuICAgICAgaWYgKHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydC5oYXNPd25Qcm9wZXJ0eShlbGVtKSkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZGF0ZVJlcG9ydFtlbGVtXS5pbm5lclRleHQgPSB0aGlzLmdldFRpbWVEYXRlSEhNTU1vbnRoRGF5KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5KSB7XHJcbiAgICAgIHRoaXMucHJlcGFyZURhdGFGb3JHcmFwaGljKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcmVwYXJlRGF0YUZvckdyYXBoaWMoKSB7XHJcbiAgICBjb25zdCBhcnIgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW0gaW4gdGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdCkge1xyXG4gICAgICBjb25zdCBkYXkgPSB0aGlzLmdldERheU5hbWVPZldlZWtCeURheU51bWJlcih0aGlzLmdldE51bWJlckRheUluV2Vla0J5VW5peFRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCkpO1xyXG4gICAgICBhcnIucHVzaCh7XHJcbiAgICAgICAgbWluOiBNYXRoLnJvdW5kKHRoaXMud2VhdGhlci5mb3JlY2FzdERhaWx5Lmxpc3RbZWxlbV0udGVtcC5taW4pLFxyXG4gICAgICAgIG1heDogTWF0aC5yb3VuZCh0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLnRlbXAubWF4KSxcclxuICAgICAgICBkYXk6IChlbGVtICE9IDApID8gZGF5IDogJ1RvZGF5JyxcclxuICAgICAgICBpY29uOiB0aGlzLndlYXRoZXIuZm9yZWNhc3REYWlseS5saXN0W2VsZW1dLndlYXRoZXJbMF0uaWNvbixcclxuICAgICAgICBkYXRlOiB0aGlzLnRpbWVzdGFtcFRvRGF0ZVRpbWUodGhpcy53ZWF0aGVyLmZvcmVjYXN0RGFpbHkubGlzdFtlbGVtXS5kdCksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmRyYXdHcmFwaGljRDMoYXJyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqINCe0YLRgNC40YHQvtCy0LrQsCDQvdCw0LfQstCw0L3QuNGPINC00L3QtdC5INC90LXQtNC10LvQuCDQuCDQuNC60L7QvdC+0Log0YEg0L/QvtCz0L7QtNC+0LlcclxuICAgKiBAcGFyYW0gZGF0YVxyXG4gICAqL1xyXG4gIHJlbmRlckljb25zRGF5c09mV2VlayhkYXRhKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICBkYXRhLmZvckVhY2goKGVsZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4XS5pbm5lckhUTUwgPSBgJHtlbGVtLmRheX08aW1nIHNyYz1cImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtlbGVtLmljb259LnBuZ1wiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiIGFsdD1cIiR7ZWxlbS5kYXl9XCI+YDtcclxuICAgICAgdGhhdC5jb250cm9scy5jYWxlbmRhckl0ZW1baW5kZXggKyAxMF0uaW5uZXJIVE1MID0gYCR7ZWxlbS5kYXl9PGltZyBzcmM9XCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LyR7ZWxlbS5pY29ufS5wbmdcIiB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiBhbHQ9XCIke2VsZW0uZGF5fVwiPmA7XHJcbiAgICAgIHRoYXQuY29udHJvbHMuY2FsZW5kYXJJdGVtW2luZGV4ICsgMjBdLmlubmVySFRNTCA9IGAke2VsZW0uZGF5fTxpbWcgc3JjPVwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8ke2VsZW0uaWNvbn0ucG5nXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYWx0PVwiJHtlbGVtLmRheX1cIj5gO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIGdldFVSTE1haW5JY29uKG5hbWVJY29uLCBjb2xvciA9IGZhbHNlKSB7XHJcbiAgICAvLyDQodC+0LfQtNCw0LXQvCDQuCDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INC60LDRgNGC0YMg0YHQvtC/0L7RgdGC0LDQstC70LXQvdC40LlcclxuICAgIGNvbnN0IG1hcEljb25zID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIGlmICghY29sb3IpIHtcclxuICAgICAgLy9cclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMWQnLCAnMDFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwMmQnLCAnMDJkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM2QnLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwM2QnLCAnMDNkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNGQnLCAnMDRkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNWQnLCAnMDVkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwNmQnLCAnMDZkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwN2QnLCAnMDdkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOGQnLCAnMDhkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcwOWQnLCAnMDlkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMGQnLCAnMTBkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxMWQnLCAnMTFkYncnKTtcclxuICAgICAgbWFwSWNvbnMuc2V0KCcxM2QnLCAnMTNkYncnKTtcclxuICAgICAgLy8g0J3QvtGH0L3Ri9C1XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDFuJywgJzAxZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDJuJywgJzAyZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDNuJywgJzAzZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDRuJywgJzA0ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDVuJywgJzA1ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDZuJywgJzA2ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDduJywgJzA3ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDhuJywgJzA4ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMDluJywgJzA5ZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTBuJywgJzEwZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTFuJywgJzExZGJ3Jyk7XHJcbiAgICAgIG1hcEljb25zLnNldCgnMTNuJywgJzEzZGJ3Jyk7XHJcblxyXG4gICAgICBpZiAobWFwSWNvbnMuZ2V0KG5hbWVJY29uKSkge1xyXG4gICAgICAgIHJldHVybiBgaW1nLyR7bWFwSWNvbnMuZ2V0KG5hbWVJY29uKX0ucG5nYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvJHtuYW1lSWNvbn0ucG5nYDtcclxuICAgIH1cclxuICAgIHJldHVybiBgaW1nLyR7bmFtZUljb259LnBuZ2A7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDQntGC0YDQuNGB0L7QstC60LAg0LPRgNCw0YTQuNC60LAg0YEg0L/QvtC80L7RidGM0Y4g0LHQuNCx0LvQuNC+0YLQtdC60LggRDNcclxuICAgKi9cclxuICBkcmF3R3JhcGhpY0QzKGRhdGEpIHtcclxuICAgIHRoaXMucmVuZGVySWNvbnNEYXlzT2ZXZWVrKGRhdGEpO1xyXG5cclxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDQuNC30YPQtdC8INC+0LHQu9Cw0YHRgtGMINC+0YLRgNC40YHQvtCy0LrQuCDQs9GA0LDRhNC40LrQsFxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBpZDogJyNncmFwaGljJyxcclxuICAgICAgZGF0YSxcclxuICAgICAgb2Zmc2V0WDogMTUsXHJcbiAgICAgIG9mZnNldFk6IDEwLFxyXG4gICAgICB3aWR0aDogNDIwLFxyXG4gICAgICBoZWlnaHQ6IDc5LFxyXG4gICAgICByYXdEYXRhOiBbXSxcclxuICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgY29sb3JQb2xpbHluZTogJyMzMzMnLFxyXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxyXG4gICAgICBmb250Q29sb3I6ICcjMzMzJyxcclxuICAgICAgc3Ryb2tlV2lkdGg6ICcxcHgnLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQoNC10LrQvtC90YHRgtGA0YPQutGG0LjRjyDQv9GA0L7RhtC10LTRg9GA0Ysg0YDQtdC90LTQtdGA0LjQvdCz0LAg0LPRgNCw0YTQuNC60LAg0YLQtdC80L/QtdGA0LDRgtGD0YDRi1xyXG4gICAgbGV0IG9iakdyYXBoaWNEMyA9IG5ldyBHcmFwaGljKHBhcmFtcyk7XHJcbiAgICBvYmpHcmFwaGljRDMucmVuZGVyKCk7XHJcblxyXG4gICAgLy8g0L7RgtGA0LjRgdC+0LLQutCwINC+0YHRgtCw0LvRjNC90YvRhSDQs9GA0LDRhNC40LrQvtCyXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMxJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNEREY3MzAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuXHJcbiAgICBwYXJhbXMuaWQgPSAnI2dyYXBoaWMyJztcclxuICAgIHBhcmFtcy5jb2xvclBvbGlseW5lID0gJyNGRUIwMjAnO1xyXG4gICAgb2JqR3JhcGhpY0QzID0gbmV3IEdyYXBoaWMocGFyYW1zKTtcclxuICAgIG9iakdyYXBoaWNEMy5yZW5kZXIoKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiDQntGC0L7QsdGA0LDQttC10L3QuNC1INCz0YDQsNGE0LjQutCwINC/0L7Qs9C+0LTRiyDQvdCwINC90LXQtNC10LvRjlxyXG4gICAqL1xyXG4gIGRyYXdHcmFwaGljKGFycikge1xyXG4gICAgdGhpcy5yZW5kZXJJY29uc0RheXNPZldlZWsoYXJyKTtcclxuXHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jb250cm9scy5ncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMud2lkdGggPSA0NjU7XHJcbiAgICB0aGlzLmNvbnRyb2xzLmdyYXBoaWMuaGVpZ2h0ID0gNzA7XHJcblxyXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDYwMCwgMzAwKTtcclxuXHJcbiAgICBjb250ZXh0LmZvbnQgPSAnT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4JztcclxuXHJcbiAgICBsZXQgc3RlcCA9IDU1O1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgY29uc3Qgem9vbSA9IDQ7XHJcbiAgICBjb25zdCBzdGVwWSA9IDY0O1xyXG4gICAgY29uc3Qgc3RlcFlUZXh0VXAgPSA1ODtcclxuICAgIGNvbnN0IHN0ZXBZVGV4dERvd24gPSA3NTtcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0Lm1vdmVUbyhzdGVwIC0gMTAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlVGV4dChgJHthcnJbaV0ubWF4fcK6YCwgc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFlUZXh0VXApO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCAtIDEwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBpICs9IDE7XHJcbiAgICB3aGlsZSAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgc3RlcCArPSA1NTtcclxuICAgICAgY29udGV4dC5saW5lVG8oc3RlcCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgICBjb250ZXh0LnN0cm9rZVRleHQoYCR7YXJyW2ldLm1heH3CumAsIHN0ZXAsICgtMSAqIGFycltpXS5tYXggKiB6b29tKSArIHN0ZXBZVGV4dFVwKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWF4ICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBzdGVwID0gNTU7XHJcbiAgICBpID0gMDtcclxuICAgIGNvbnRleHQubW92ZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgLSAxMCwgKC0xICogYXJyW2ldLm1pbiAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgaSArPSAxO1xyXG4gICAgd2hpbGUgKGkgPCBhcnIubGVuZ3RoKSB7XHJcbiAgICAgIHN0ZXAgKz0gNTU7XHJcbiAgICAgIGNvbnRleHQubGluZVRvKHN0ZXAsICgtMSAqIGFycltpXS5taW4gKiB6b29tKSArIHN0ZXBZKTtcclxuICAgICAgY29udGV4dC5zdHJva2VUZXh0KGAke2FycltpXS5taW59wrpgLCBzdGVwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWVRleHREb3duKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgaSAtPSAxO1xyXG4gICAgY29udGV4dC5saW5lVG8oc3RlcCArIDMwLCAoLTEgKiBhcnJbaV0ubWluICogem9vbSkgKyBzdGVwWSk7XHJcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzMzJztcclxuICAgIGNvbnRleHQubGluZVRvKHN0ZXAgKyAzMCwgKC0xICogYXJyW2ldLm1heCAqIHpvb20pICsgc3RlcFkpO1xyXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzMzMyc7XHJcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgY29udGV4dC5maWxsKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB0aGlzLmdldFdlYXRoZXJGcm9tQXBpKCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
