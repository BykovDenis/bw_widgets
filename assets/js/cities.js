/**
* Created by Denis on 21.10.2016.
*/

const Promise = require('es6-promise').Promise;
require('String.fromCodePoint');
import GeneratorWidget from './generator-widget';

import renderWidgets from './renderWidgets';
import clearWidgetContainer from './clearWidgetContainer';

export default class Cities {

  constructor(params) {
    //cityName, container, widgetTypeActive
    this.params = params;
    this.generateWidget = new GeneratorWidget();
    this.generateWidget.setInitialStateForm();
    this.params.units = this.generateWidget.unitsTemp[0];
    if (!this.params.cityName) {
      return false;
    }

    this.chooseCity = this.chooseCity.bind(this);
    this.cityName = this.params.cityName.replace(/(\s)+/g,'-').toLowerCase();
    this.container = this.container || '';
    this.url = `${document.location.protocol}//openweathermap.org/data/2.5/find?q=${this.cityName}&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1`;
  }

  getCities() {
    if (!this.params.cityName) {
      return null;
    }

    this.httpGet(this.url)
      .then(
      (response) => {
        this.getSearchData(response);
      },
      (error) => {
        console.log(`Возникла ошибка ${error}`);
      }
      );
  }

  renderWidget() {
    clearWidgetContainer();
    renderWidgets(this.params.cityId, this.params.widgetTypeActive, this.params.units);
  }

  getSearchData(JSONobject) {
    if (!JSONobject.list.length) {
      console.log('City not found');
      return;
    }
    this.cityList = document.getElementById('city-list');
    if (this.cityList) {
      this.cityList.removeEventListener('click', this.selectedCity);
      this.cityList.parentNode.removeChild(this.cityList);
    }

    let html = '';
    for (let i = 0; i < JSONobject.list.length; i += 1) {
      const name = `${JSONobject.list[i].name}, ${JSONobject.list[i].sys.country}`;
      const flag = `http://openweathermap.org/images/flags/${JSONobject.list[i].sys.country.toLowerCase()}.png`;
      html += `
      <li class="city-list__item">
        <label class="city-list__label">
          <input
            type="radio"
            class="city-list__radio"
            name="city-list"
            id="${JSONobject.list[i].id}"
            value="${name}"
          >
          <span class="city-list__link">
            ${name}
            <img src="${flag}" width="16" height="11" alt="${name}">
          </span>
        </label>
      </li>`;
    }

    html = `<ul class="city-list" id="city-list">${html}</ul>`;
    this.params.container.insertAdjacentHTML('afterbegin', html);

    this.cityList = document.getElementById('city-list');
    this.cityList.addEventListener('click', this.chooseCity);
    // активируем первый пункт списка
    if (this.cityList.children[0]) {
      const radio = this.cityList.children[0].querySelector('.city-list__radio');
      if (radio) {
        radio.checked = true;
        this.selectedCity(radio.id, radio.value);
      }
    }
  }

  /**
   * [chooseCity description Обработка события по выбору города]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  chooseCity(e) {
    const element = e.target;
    if (element.classList.contains('city-list__radio')) {
      this.selectedCity(element.id, element.value);
    }
  }

  /**
   * [selectedCity Выбор города и перерисовка виджетов]
   * @param  {[type]} cityID   [description]
   * @param  {[type]} cityName [description]
   * @return {[type]}          [description]
   */
  selectedCity(cityID, cityName) {
    this.generateWidget.setInitialStateForm(cityID, cityName);
    this.params.cityId = cityID;
    this.paramscityName = cityName;
    this.renderWidget();
  }

  /**
  * Обертка обещение для асинхронных запросов
  * @param url
  * @returns {Promise}
  */
  httpGet(url) {
    const that = this;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve(JSON.parse(this.response));
        } else {
          const error = new Error(this.statusText);
          error.code = this.status;
          reject(that.error);
        }
      };

      xhr.ontimeout = function(e) {
        reject(new Error(`Время ожидания обращения к серверу API истекло ${e.type} ${e.timeStamp.toFixed(2)}`));
      };

      xhr.onerror = function(e) {
        reject(new Error(`Ошибка обращения к серверу ${e}`));
      };

      xhr.open('GET', url, true);
      xhr.send(null);
    });
  }

}
