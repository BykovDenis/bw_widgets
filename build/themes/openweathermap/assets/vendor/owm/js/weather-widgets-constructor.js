(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var clearWidgetContainer = function clearWidgetContainer() {
  var i = 1;
  var containers = [];
  while (i < 100) {
    var container = document.getElementById('openweathermap-widget-' + i);
    if (container) {
      containers.push(container);
    }
    i++;
  };

  containers.forEach(function (elem) {
    elem.innerText = '';
  });
};

exports.default = clearWidgetContainer;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var renderWidgets = function renderWidgets(cityId) {
    window.myWidgetParam = [];
    window.myWidgetParam.push({
        id: 11,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-11'
    });
    window.myWidgetParam.push({
        id: 12,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-12'
    });
    window.myWidgetParam.push({
        id: 13,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-13'
    });
    window.myWidgetParam.push({
        id: 14,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-14'
    });
    window.myWidgetParam.push({
        id: 15,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-15'
    });
    window.myWidgetParam.push({
        id: 16,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-16'
    });
    window.myWidgetParam.push({
        id: 17,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-17'
    });
    window.myWidgetParam.push({
        id: 18,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-18'
    });
    window.myWidgetParam.push({
        id: 19,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-19'
    });
    window.myWidgetParam.push({
        id: 1,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-1'
    });
    window.myWidgetParam.push({
        id: 2,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-2'
    });
    window.myWidgetParam.push({
        id: 3,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-3'
    });
    window.myWidgetParam.push({
        id: 4,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-4'
    });
    window.myWidgetParam.push({
        id: 5,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-5'
    });
    window.myWidgetParam.push({
        id: 6,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-6'
    });
    window.myWidgetParam.push({
        id: 7,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-7'
    });
    window.myWidgetParam.push({
        id: 8,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-8'
    });
    window.myWidgetParam.push({
        id: 9,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-9'
    });
    window.myWidgetParam.push({
        id: 21,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-21'
    });
    window.myWidgetParam.push({
        id: 22,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-22'
    });
    window.myWidgetParam.push({
        id: 23,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-23'
    });
    window.myWidgetParam.push({
        id: 24,
        cityid: cityId,
        appid: '2d90837ddbaeda36ab487f257829b667',
        containerid: 'openweathermap-widget-24'
    });
    var scripts = document.getElementById('scripts');
    if (scripts) {
        var script = document.createElement('script');
        script.async = true;
        script.src = '//phase.owm.io/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator-2.0.js';
        scripts.textContent = '';
        scripts.appendChild(script);
    }
};

exports.default = renderWidgets;

},{}],3:[function(require,module,exports){
'use strict';

var _renderWidgets = require('./renderWidgets');

var _renderWidgets2 = _interopRequireDefault(_renderWidgets);

var _clearWidgetContainer = require('./clearWidgetContainer');

var _clearWidgetContainer2 = _interopRequireDefault(_clearWidgetContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cityId = 524901;
(0, _renderWidgets2.default)(cityId);

var btn = document.getElementById('search-city');
var btnRenderWidgets = document.getElementById('append-scripts');
var scripts = document.getElementById('scripts');
var scriptsContainer = document.getElementById('container-scripts');

function reRenderDashboardWIdgets() {
  (0, _clearWidgetContainer2.default)();
  var cityId = 2988507;
  (0, _renderWidgets2.default)(cityId);
}

btn.addEventListener('click', reRenderDashboardWIdgets);

},{"./clearWidgetContainer":1,"./renderWidgets":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxjbGVhcldpZGdldENvbnRhaW5lci5qcyIsImFzc2V0c1xcanNcXHJlbmRlcldpZGdldHMuanMiLCJhc3NldHNcXGpzXFxzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7QUFDQSxJQUFNLHVCQUF1QixTQUF2QixvQkFBdUIsR0FBVztBQUN0QyxNQUFJLElBQUksQ0FBUjtBQUNBLE1BQU0sYUFBYSxFQUFuQjtBQUNBLFNBQU0sSUFBSSxHQUFWLEVBQWU7QUFDYixRQUFNLFlBQVksU0FBUyxjQUFULDRCQUFpRCxDQUFqRCxDQUFsQjtBQUNBLFFBQUksU0FBSixFQUFlO0FBQ2IsaUJBQVcsSUFBWCxDQUFnQixTQUFoQjtBQUNEO0FBQ0Q7QUFDRDs7QUFFRCxhQUFXLE9BQVgsQ0FBbUIsVUFBUyxJQUFULEVBQWU7QUFDaEMsU0FBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0QsR0FGRDtBQUlELENBZkQ7O2tCQWlCZSxvQjs7O0FDbEJmOzs7OztBQUNBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLENBQVMsTUFBVCxFQUFpQjtBQUNyQyxXQUFPLGFBQVAsR0FBdUIsRUFBdkI7QUFDQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxFQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFdBQU8sYUFBUCxDQUFxQixJQUFyQixDQUEwQjtBQUN0QixZQUFJLEVBRGtCO0FBRXRCLGdCQUFRLE1BRmM7QUFHdEIsZUFBTyxrQ0FIZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMs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ZTtBQUl0QixxQkFBYTtBQUpTLEtBQTFCO0FBTUEsV0FBTyxhQUFQLENBQXFCLElBQXJCLENBQTBCO0FBQ3RCLFlBQUksRUFEa0I7QUFFdEIsZ0JBQVEsTUFGYztBQUd0QixlQUFPLGtDQUhlO0FBSXRCLHFCQUFhO0FBSlMsS0FBMUI7QUFNQSxXQUFPLGFBQVAsQ0FBcUIsSUFBckIsQ0FBMEI7QUFDdEIsWUFBSSxFQURrQjtBQUV0QixnQkFBUSxNQUZjO0FBR3RCLGVBQU8sa0NBSGU7QUFJdEIscUJBQWE7QUFKUyxLQUExQjtBQU1BLFFBQU0sVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBaEI7QUFDQSxRQUFJLE9BQUosRUFBYTtBQUNYLFlBQU0sU0FBUyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBLGVBQU8sS0FBUCxHQUFlLElBQWY7QUFDQSxlQUFPLEdBQVAsR0FBYSwyRkFBYjtBQUNBLGdCQUFRLFdBQVIsR0FBc0IsRUFBdEI7QUFDQSxnQkFBUSxXQUFSLENBQW9CLE1BQXBCO0FBQ0Q7QUFDRixDQTlJRDs7a0JBZ0plLGE7OztBQ2pKZjs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsTUFBZjtBQUNBLDZCQUFjLE1BQWQ7O0FBRUEsSUFBSSxNQUFNLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFWO0FBQ0EsSUFBSSxtQkFBbUIsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUF2QjtBQUNBLElBQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBZDtBQUNBLElBQUksbUJBQW1CLFNBQVMsY0FBVCxDQUF3QixtQkFBeEIsQ0FBdkI7O0FBRUEsU0FBUyx3QkFBVCxHQUFvQztBQUNsQztBQUNBLE1BQU0sU0FBUyxPQUFmO0FBQ0EsK0JBQWMsTUFBZDtBQUNEOztBQUVELElBQUksZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsd0JBQTlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgY2xlYXJXaWRnZXRDb250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgaSA9IDE7XHJcbiAgY29uc3QgY29udGFpbmVycyA9IFtdO1xyXG4gIHdoaWxlKGkgPCAxMDApIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBvcGVud2VhdGhlcm1hcC13aWRnZXQtJHtpfWApO1xyXG4gICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICBjb250YWluZXJzLnB1c2goY29udGFpbmVyKTtcclxuICAgIH1cclxuICAgIGkrK1xyXG4gIH07XHJcblxyXG4gIGNvbnRhaW5lcnMuZm9yRWFjaChmdW5jdGlvbihlbGVtKSB7XHJcbiAgICBlbGVtLmlubmVyVGV4dCA9ICcnO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsZWFyV2lkZ2V0Q29udGFpbmVyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IHJlbmRlcldpZGdldHMgPSBmdW5jdGlvbihjaXR5SWQpIHtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbSA9IFtdO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMTEsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMTEnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxMixcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xMidcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDEzLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTEzJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMTQsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMTQnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxNSxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xNSdcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDE2LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE2J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMTcsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMTcnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAxOCxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xOCdcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDE5LFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE5J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMSxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0xJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMixcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0yJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMyxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0zJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogNCxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC00J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogNSxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC01J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogNixcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC02J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogNyxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC03J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogOCxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC04J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogOSxcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC05J1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMjEsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMjEnXHJcbiAgfSk7XHJcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XHJcbiAgICAgIGlkOiAyMixcclxuICAgICAgY2l0eWlkOiBjaXR5SWQsXHJcbiAgICAgIGFwcGlkOiAnMmQ5MDgzN2RkYmFlZGEzNmFiNDg3ZjI1NzgyOWI2NjcnLFxyXG4gICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0yMidcclxuICB9KTtcclxuICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcclxuICAgICAgaWQ6IDIzLFxyXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcclxuICAgICAgYXBwaWQ6ICcyZDkwODM3ZGRiYWVkYTM2YWI0ODdmMjU3ODI5YjY2NycsXHJcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTIzJ1xyXG4gIH0pO1xyXG4gIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xyXG4gICAgICBpZDogMjQsXHJcbiAgICAgIGNpdHlpZDogY2l0eUlkLFxyXG4gICAgICBhcHBpZDogJzJkOTA4MzdkZGJhZWRhMzZhYjQ4N2YyNTc4MjliNjY3JyxcclxuICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMjQnXHJcbiAgfSk7XHJcbiAgY29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JpcHRzJyk7XHJcbiAgaWYgKHNjcmlwdHMpIHtcclxuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgIHNjcmlwdC5zcmMgPSAnLy9waGFzZS5vd20uaW8vdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtL2pzL3dlYXRoZXItd2lkZ2V0LWdlbmVyYXRvci0yLjAuanMnO1xyXG4gICAgc2NyaXB0cy50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgc2NyaXB0cy5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlbmRlcldpZGdldHM7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCByZW5kZXJXaWRnZXRzIGZyb20gJy4vcmVuZGVyV2lkZ2V0cyc7XHJcbmltcG9ydCBjbGVhcldpZGdldENvbnRhaW5lciBmcm9tICcuL2NsZWFyV2lkZ2V0Q29udGFpbmVyJztcclxuXHJcbmNvbnN0IGNpdHlJZCA9IDUyNDkwMTtcclxucmVuZGVyV2lkZ2V0cyhjaXR5SWQpO1xyXG5cclxudmFyIGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xyXG52YXIgYnRuUmVuZGVyV2lkZ2V0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBlbmQtc2NyaXB0cycpO1xyXG52YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JpcHRzJyk7XHJcbnZhciBzY3JpcHRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lci1zY3JpcHRzJyk7XHJcblxyXG5mdW5jdGlvbiByZVJlbmRlckRhc2hib2FyZFdJZGdldHMoKSB7XHJcbiAgY2xlYXJXaWRnZXRDb250YWluZXIoKTtcclxuICBjb25zdCBjaXR5SWQgPSAyOTg4NTA3O1xyXG4gIHJlbmRlcldpZGdldHMoY2l0eUlkKTtcclxufVxyXG5cclxuYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVSZW5kZXJEYXNoYm9hcmRXSWRnZXRzKTtcclxuIl19
