// Модуль диспетчер для отрисовки баннерров на конструкторе
import WeatherWidget from './weather-widget';
import GeneratorWidget from './generator-widget';
import Cities from './cities';
import Popup from './popup';

document.addEventListener('DOMContentLoaded', () => {

  const generateWidget = new GeneratorWidget();
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
    baseURL: generateWidget.baseURL,
    urlDomain: 'http://api.openweathermap.org',
  };

  const controlsWidget = {
    // Первая половина виджетов
    cityName: document.querySelectorAll('.widget-left-menu__header'),
    temperature: document.querySelectorAll('.weather-left-card__number'),
    naturalPhenomenon: document.querySelectorAll('.weather-left-card__means'),
    windSpeed: document.querySelectorAll('.weather-left-card__wind'),
    mainIconWeather: document.querySelectorAll('.weather-left-card__img'),
    calendarItem: document.querySelectorAll('.calendar__item'),
    graphic: document.getElementById('graphic'),
    // Вторая половина виджетов
    cityName2: document.querySelectorAll('.widget-right__title'),
    temperature2: document.querySelectorAll('.weather-right__temperature'),
    temperatureFeels: document.querySelectorAll('.weather-right__feels'),
    temperatureMin: document.querySelectorAll('.weather-right-card__temperature-min'),
    temperatureMax: document.querySelectorAll('.weather-right-card__temperature-max'),
    naturalPhenomenon2: document.querySelectorAll('.widget-right__description'),
    windSpeed2: document.querySelectorAll('.weather-right__wind-speed'),
    mainIconWeather2: document.querySelectorAll('.weather-right__icon'),
    humidity: document.querySelectorAll('.weather-right__humidity'),
    pressure: document.querySelectorAll('.weather-right__pressure'),
    dateReport: document.querySelectorAll('.widget-right__date'),
  };

  const urls = {
    urlWeatherAPI: `${paramsWidget.urlDomain}/data/2.5/weather${q}&units=${paramsWidget.units}&appid=${paramsWidget.appid}`,
    paramsUrlForeDaily: `${paramsWidget.urlDomain}/data/2.5/forecast/daily${q}&units=${paramsWidget.units}&cnt=8&appid=${paramsWidget.appid}`,
    windSpeed: `${paramsWidget.baseURL}/data/wind-speed-data.json`,
    windDirection: `${paramsWidget.baseURL}/data/wind-direction-data.json`,
    clouds: `${paramsWidget.baseURL}data/clouds-data.json`,
    naturalPhenomenon: `${paramsWidget.baseURL}/data/natural-phenomenon-data.json`,
  };

    // Работа с формой для инициали
    const cityNameValue = document.getElementById('city-name').value;
    const cities = document.getElementById('cities');
    const searchCity = document.getElementById('search-city');
    searchCity.addEventListener('click', function() {

      const objWidget = new WeatherWidget(paramsWidget, controlsWidget, urls);
      objWidget.render();

      var objCities = new Cities(cityNameValue, cities);
      objCities.getCities();

    });

});
