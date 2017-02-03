// Модуль диспетчер для отрисовки баннерров на конструкторе
import Cities from './cities';
import Popup from './popup';

document.addEventListener('DOMContentLoaded', () => {

    // Работа с формой для инициали
    const cityName = document.getElementById('city-name');
    const cities = document.getElementById('cities');
    const searchCity = document.getElementById('search-city');

    const objCities = new Cities(cityName, cities);
    objCities.getCities();

      searchCity.addEventListener('click', function() {

      const objCities = new Cities(cityName, cities);
      objCities.getCities();

    });

});
