/**
* Created by Denis on 21.10.2016.
*/
export default class Cities {

  constructor(cityName, container) {
    if (!cityName) {
    return false;
    }
    this.url = 'http://openweathermap.org/data/2.5/find?callback=?&q=Moscow&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1';
    this.cityName = cityName;
    this.container = container || '';

    this.selCitySign = document.createElement('span');
    this.selCitySign.innerText = ' selected ';
    this.selCitySign.class = 'widget-form__selected';
  }

  getCities() {
    if (!this.cityName) {
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

  getSearchData(JSONobject) {
    if (!JSONobject.list.length) {
      console.log('City not found');
      return;
    }
    let html = '';
    for (let i = 0; i < JSONobject.list.length; i += 1) {
      const name = `${JSONobject.list[i].name}, ${JSONobject.list[i].sys.country}`;
      const flag = `http://openweathermap.org/images/flags/${JSONobject.list[i].sys.country.toLowerCase()}.png`;
      html += `<tr><td class="widget-form__item"><a href="/city/${JSONobject.list[i].id}" id="${JSONobject.list[i].id}" class="widget-form__link">${name}</a><img src="${flag}"></p></td></tr>`;
    }

    html = `<table class="table" id="table-cities">${html}</table>`;
    this.container.insertAdjacentHTML('afterbegin', html);
    const tableCities = document.getElementById('table-cities');

    let that = this;
    tableCities.addEventListener('click', function(event) {
      event.preventDefault();
      if (event.target.tagName.toLowerCase() === ('A').toLowerCase() && event.target.classList.contains('widget-form__link')) {
        let selectedCity = event.target.parentElement.querySelector('#selectedCity');
        if (!selectedCity) {
          event.target.parentElement.insertBefore(that.selCitySign, event.target.parentElement.children[1]);
          window.cityId = event.target.id;
        }
      }
      
    });
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
          resolve(JSON.parse(this.response.substring(2, this.response.length - 1)));
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
