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

//проверяем активную вкладку
const widgetChoose = document.querySelector('.widget-choose');
const widgetTypeActive = widgetChoose.querySelector('input[type="radio"]:checked');

const params = {
  cityId: 2643743,
  cityName: cityName.value,
  widgetTypeActive: widgetTypeActive.id,
  container: cities
};

widgetChoosen = widgetChoosen.bind(this);
// прослушивание событий изменения по отображению типа виджетов
widgetChoose.addEventListener('change', widgetChoosen, false);

const objCities = new Cities(params);
objCities.getCities();
objCities.renderWidget();

searchCity.addEventListener('click', function() {
  params.cityName = cityName.value;
  const objCities = new Cities(params);
  objCities.getCities();
});

function widgetChoosen(event){
  const element = event.target;
  if (element.id) {
    params.widgetTypeActive = element.id;
    const objCities = new Cities(params);
    objCities.renderWidget();
  }
}
