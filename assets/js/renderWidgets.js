'use strict';
const renderWidgets = function(cityId, typeActive = 'widget-brown') {
  window.myWidgetParam = [];
  const widgetBrownContainer = document.getElementById('widget-brown-container');
  const widgetBlueContainer = document.getElementById('widget-blue-container');
  const widgetGrayContainer = document.getElementById('widget-gray-container');
  widgetBrownContainer.classList.remove('widget__layout--visible');
  widgetBlueContainer.classList.remove('widget__layout--visible');
  widgetGrayContainer.classList.remove('widget__layout--visible');
  if (typeActive === 'widget-brown') {
    widgetBrownContainer.classList.add('widget__layout--visible');
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
  } else if (typeActive === 'widget-blue') {
      widgetBlueContainer.classList.add('widget__layout--visible');
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
  } else if (typeActive === 'widget-gray') {
      widgetGrayContainer.classList.add('widget__layout--visible');
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
  }
  const scripts = document.getElementById('scripts');
  if (scripts) {
    const script = document.createElement('script');
    script.async = true;
    script.src = '//phase.owm.io/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator-2.0.js';
    scripts.textContent = '';
    scripts.appendChild(script);
  }
};

export default renderWidgets;
