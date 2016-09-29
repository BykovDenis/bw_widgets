/**
 * Created by Denis on 29.09.2016.
 */
"use strict";

import CustomDate from "./custom-date";

export default class WeatherWidget extends CustomDate{

    constructor(params, controls, urls){
        super();
        this.params = params;
        this.controls = controls;
        this.urls = urls;

        // Инициализируем объект пустыми значениями
        this.weather = {
            "fromAPI":
            {"coord":{
                "lon":"0",
                "lat":"0"
            },
                "weather":[{"id":" ",
                    "main":" ",
                    "description":" ",
                    "icon":""
                }],
                "base":" ",
                "main":{
                    "temp": 0,
                    "pressure":" ",
                    "humidity":" ",
                    "temp_min":" ",
                    "temp_max":" "
                },
                "wind":{
                    "speed": 0,
                    "deg":" "
                },
                "rain":{},
                "clouds":{"all":" "},
                "dt":``,
                "sys":{
                    "type":" ",
                    "id":" ",
                    "message":" ",
                    "country":" ",
                    "sunrise":" ",
                    "sunset":" "
                },
                "id":" ",
                "name":"Undefined",
                "cod":" "
            }
        };
    };

    /**
     * Обертка обещение для асинхронных запросов
     * @param url
     * @returns {Promise}
     */
    httpGet(url){
        var that = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    resolve(JSON.parse(this.response));
                }
                else{
                    const error = new Error(this.statusText);
                    error.code = this.status;
                    reject(that.error);
                }

            }

            xhr.ontimeout = function (e) {
                reject(new Error(`Время ожидания обращения к серверу API истекло ${e.type} ${e.timeStamp.toFixed(2)}`));
            }

            xhr.onerror = function (e) {
                reject(new Error(`Ошибка обращения к серверу ${e}`));
            }

            xhr.open("GET", url, true);
            xhr.send(null);

        });
    };

    /**
     * Запрос к API для получения данных текущей погоды
     */
    getWeatherFromApi(){
        this.httpGet(this.urls.urlWeatherAPI)
            .then(
                response => {
                    this.weather.fromAPI = response;
                    this.httpGet(this.urls.naturalPhenomenon)
                        .then(
                            response => {
                                this.weather.naturalPhenomenon = response[this.params.lang]["description"];
                                this.httpGet(this.urls.windSpeed)
                                    .then(
                                        response => {
                                            this.weather.windSpeed = response[this.params.lang];
                                            this.parseDataFromServer()
                                        },
                                        error => {
                                            console.log(`Возникла ошибка ${error}`);
                                            this.parseDataFromServer();
                                        }
                                    )
                            },
                            error => {
                                console.log(`Возникла ошибка ${error}`);
                                this.parseDataFromServer();
                            }
                        )
                },
                error => {
                    console.log(`Возникла ошибка ${error}`);
                    this.parseDataFromServer();
                }
            )
    };

    /**
     * Метод возвращает родительский селектор по значению дочернего узла в JSON
     * @param  {object} JSON
     * @param  {variant} element Значение элементарного типа, дочернего узла для поиска родительского
     * @param  {string} elementName Наименование искомого селектора,для поиска родительского селектора
     * @return {string}  Наименование искомого селектора
     */
    getParentSelectorFromObject(object, element, elementName, elementName2){

        for(var key in object){
            // Если сравнение производится с объектом из двух элементов ввиде интервала
            if(typeof object[key][elementName] === "object" && elementName2 == null){
                if(element >= object[key][elementName][0] && element < object[key][elementName][1]){
                    return key;
                }
            }
            // Если сравнение производится со значением элемента элементарного типа с двумя элементами в JSON
            else if(elementName2 != null){
                if(element >= object[key][elementName] && element < object[key][elementName2])
                    return key;
            }
        }
    }

    /**
     * Возвращает JSON с метеодаными
     * @param jsonData
     * @returns {*}
     */
    parseDataFromServer(){

        let weather = this.weather;

        if(weather.fromAPI.name === "Undefined" || weather.fromAPI.cod === "404"){
            console.log("Данные от сервера не получены")
            return;
        }

        var naturalPhenomenon = ``;
        var windSpeed = ``;
        var windDirection = ``;
        var clouds = ``;

        //Инициализируем объект
        var metadata = {
            cloudiness: ` `,
            dt : ` `,
            cityName :  ` `,
            icon : ` `,
            temperature : ` `,
            pressure :  ` `,
            humidity : ` `,
            sunrise : ` `,
            sunset : ` `,
            coord : ` `,
            wind: ` `,
            weather: ` `
        };

        metadata.cityName = `${weather.fromAPI.name}, ${weather.fromAPI.sys.country}`;
        metadata.temperature = `${weather.fromAPI.main.temp.toFixed(0)}`;
        if(weather.naturalPhenomenon)
            metadata.weather = weather.naturalPhenomenon[weather.fromAPI.weather[0].id];
        if(weather["windSpeed"])
            metadata.windSpeed = `Wind: ${weather["fromAPI"]["wind"]["speed"].toFixed(1)}  m/s ${this.getParentSelectorFromObject(weather["windSpeed"], weather["fromAPI"]["wind"]["speed"].toFixed(1), "speed_interval")}`;
        if(weather["windDirection"])
            metadata.windDirection = `${this.getParentSelectorFromObject(weather["windDirection"], weather["fromAPI"]["wind"]["deg"], "deg_interval")} ( ${weather["fromAPI"]["wind"]["deg"]} )`
        if(weather["clouds"])
            metadata.clouds = `${this.getParentSelectorFromObject(weather["clouds"], weather["fromAPI"]["clouds"]["all"], "min", "max")}`;

        metadata.icon = `${weather["fromAPI"]["weather"][0]["icon"]}`;

        return this.renderWidget(metadata);

    };

    renderWidget(metadata) {
        for (let elem in this.controls.cityName) {
            if (this.controls.cityName.hasOwnProperty(elem)) {
                this.controls.cityName[elem].innerHTML = `<span>Weather in</span> ${metadata.cityName}`;
            }
        }
        for (let elem in this.controls.temperature) {
            if (this.controls.temperature.hasOwnProperty(elem)) {
                this.controls.temperature[elem].innerHTML = `${metadata.temperature}<sup class="weather-card__degree">${this.params.textUnitTemp}</sup>`;
            }
        }

        for (let elem in this.controls.mainIconWeather) {
            if (this.controls.mainIconWeather.hasOwnProperty(elem)) {
                this.controls.mainIconWeather[elem].src = `http://openweathermap.org/img/w/${metadata.icon}.png`;
                this.controls.mainIconWeather[elem].alt = `Weather in ${metadata.cityName ? metadata.cityName : ''}`;
            }
        }

        if(metadata.weather.trim())
            for (let elem in this.controls.naturalPhenomenon){
                if (this.controls.naturalPhenomenon.hasOwnProperty(elem)) {
                    this.controls.naturalPhenomenon[elem].innerText = metadata.weather;
                }
            }
        if(metadata.windSpeed.trim())
            for (let elem in this.controls.windSpeed){
                if (this.controls.windSpeed.hasOwnProperty(elem)) {
                    this.controls.windSpeed[elem].innerText = metadata.windSpeed;
                }
            }

    }

    render(){
        this.getWeatherFromApi();
    };

}