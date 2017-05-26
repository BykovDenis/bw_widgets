'use strict';
// Модуль диспетчер для отрисовки баннерров на конструкторе
import Cities from './cities';
import Popup from './popup';

const searchCity = document.getElementById('search-city');
const btnRenderWidgets = document.getElementById('append-scripts');
const scripts = document.getElementById('scripts');
// Работа с формой для инициали
const cityName = document.getElementById('city-name');
const cities = document.getElementById('cities');

const objCities = new Cities(cityName, cities);
objCities.getCities();

searchCity.addEventListener('click', function() {
  const objCities = new Cities(cityName, cities);
  objCities.getCities();
});
