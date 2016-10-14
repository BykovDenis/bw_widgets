// Модуль диспетчер для отрисовки баннерров на конструкторе
import WeatherWidget from './weather-widget';
import Popup from './popup';

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
    // Первая половина виджетов
    cityName: document.querySelectorAll('.widget-left-menu__header'),
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
    dateReport: document.querySelectorAll(".widget-lite__date"),
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
