// Модуль диспетчер для отрисовки баннерров на конструкторе
import WeatherWidget from './weather-widget';

document.addEventListener('DOMContentLoaded', () => {
    // Формируем параметр фильтра по городу
  let q = '';
  if (window.location.search) {
    q = window.location.search;
  } else {
    q = '?q=London';
  }

  const urlDomain = 'http://api.openweathermap.org';

  const paramsWidget = {
    cityName: 'Moscow',
    lang: 'en',
    appid: '2d90837ddbaeda36ab487f257829b667',
    units: 'metric',
    textUnitTemp: String.fromCodePoint(0x00B0),  // 248
  };

  const controlsWidget = {
    cityName: document.querySelectorAll('.widget-dark-menu__header'),
    temperature: document.querySelectorAll('.weather-dark-card__number'),
    naturalPhenomenon: document.querySelectorAll('.weather-dark-card__means'),
    windSpeed: document.querySelectorAll('.weather-dark-card__wind'),
    mainIconWeather: document.querySelectorAll('.weather-dark-card__img'),
    calendarItem: document.querySelectorAll('.calendar__item'),
    graphic: document.getElementById('graphic'),
  };

  const urls = {
    urlWeatherAPI: `${urlDomain}/data/2.5/weather${q}&units=${paramsWidget.units}&appid=${paramsWidget.appid}`,
    paramsUrlForeDaily: `${urlDomain}/data/2.5/forecast/daily${q}&units=${paramsWidget.units}&cnt=8&appid=${paramsWidget.appid}`,
    windSpeed: 'data/wind-speed-data.json',
    windDirection: 'data/wind-direction-data.json',
    clouds: 'data/clouds-data.json',
    naturalPhenomenon: 'data/natural-phenomenon-data.json',
  };

  const objWidget = new WeatherWidget(paramsWidget, controlsWidget, urls);
  objWidget.render();
});
