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

    this.selectedCity = this.selectedCity.bind(this);

    this.cityName = this.params.cityName.replace(/(\s)+/g,'-').toLowerCase();
    this.container = this.container || '';
    this.url = `${document.location.protocol}//openweathermap.org/data/2.5/find?q=${this.cityName}&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1`;

    this.selCitySign = document.createElement('span');
    this.selCitySign.innerText = ' selected ';
    this.selCitySign.class = 'widget-form__selected';
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

    // Удаляем таблицу, если есть
    const tableCity = document.getElementById('table-cities');
    if (tableCity) {
      tableCity.parentNode.removeChild(tableCity);
    }

    let html = '';
    for (let i = 0; i < JSONobject.list.length; i += 1) {
      const name = `${JSONobject.list[i].name}, ${JSONobject.list[i].sys.country}`;
      const flag = `http://openweathermap.org/images/flags/${JSONobject.list[i].sys.country.toLowerCase()}.png`;
      html += `<tr><td class="widget-form__item"><a href="/city/${JSONobject.list[i].id}" id="${JSONobject.list[i].id}" class="widget-form__link">${name}</a><img src="${flag}"></p></td></tr>`;
    }

    html = `<table class="table" id="table-cities">${html}</table>`;
    this.params.container.insertAdjacentHTML('afterbegin', html);
    const tableCities = document.getElementById('table-cities');

    tableCities.addEventListener('click', this.selectedCity);
  }

  selectedCity(event) {
    event.preventDefault();
    if (event.target.tagName.toLowerCase() === ('A').toLowerCase() && event.target.classList.contains('widget-form__link')) {
      let selectedCity = event.target.parentElement.querySelector('#selectedCity');
      if (!selectedCity) {
        event.target.parentElement.insertBefore(this.selCitySign, event.target.parentElement.children[1]);
        // Подстановка найденого города
        this.generateWidget.paramsWidget.cityId = event.target.id;
        this.generateWidget.paramsWidget.cityName = event.target.textContent;
        this.generateWidget.paramsWidget.units = this.units;
        this.generateWidget.setInitialStateForm(event.target.id, event.target.textContent);
        this.params.cityId = event.target.id;
        this.paramscityName = event.target.textContent;

        this.renderWidget();
      }
    }
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
