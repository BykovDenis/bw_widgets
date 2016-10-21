/**
 * Created by Denis on 21.10.2016.
 */
export default class Cities {

    constructor(cityName, container, cityId){
        if(!cityName) {
            return false;
        }
        this.url = 'http://openweathermap.org/data/2.5/find?callback=?&q=Moscow&type=like&sort=population&cnt=30&appid=b1b15e88fa797225412429c1c50c122a1';
        this.cityName = cityName;
        this.container = container;
        this.cityId = cityId;
    }

    getCities() {
        if(!this.cityName) return null;

        this.httpGet(this.url)
            .then(
                (response) => {
                    this.getSearchData(response);
                },
                (error) => {
                    console.log(`Возникла ошибка ${error}`);
                }
            );

    };

    getSearchData(JSONobject) {
        //console.log( JSONobject  );
        //JSONobject = ParseJson(JSONtext);

        let city = JSONobject.list;
        if( city.length == 0 ) {
            ShowAlertMess( 'not found' );
            return;
        }

        let html = '';

        for(var i = 0; i <  JSONobject.list.length; i ++){


            var name = JSONobject.list[i].name +', '+JSONobject.list[i].sys.country;

            var temp = Math.round(10*(JSONobject.list[i].main.temp -273.15))/10 ;
            var tmin = Math.round(10*(JSONobject.list[i].main.temp_min -273.15)) / 10;
            var tmax = Math.round(10*(JSONobject.list[i].main.temp_max -273.15)) / 10 ;

            var text = JSONobject.list[i].weather[0].description;
            var img =  "http://openweathermap.org/img/w/" +JSONobject.list[i].weather[0].icon + ".png";
            var flag = "http://openweathermap.org/images/flags/" +JSONobject.list[i].sys.country.toLowerCase()  + ".png";
            var gust = JSONobject.list[i].wind.speed;
            var pressure = JSONobject.list[i].main.pressure ;
            var cloud=JSONobject.list[i].clouds.all ;

              html +=`<tr><td><b><a href="/city/${JSONobject.list[i].id}" id="${JSONobject.list[i].id}">${name}</a></b><img src="${flag}"></p></td></tr>`;

        }

        html='<table class="table" id="table-cities">'+html+'</table>';

        this.container.insertAdjacentHTML('afterbegin', html);

        const tableCities = document.getElementById('table-cities');
        var that = this;
        tableCities.addEventListener('click', function(event){
            event.preventDefault();
            that.cityId.value = event.target.id;
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
