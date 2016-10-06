/**
 * Created by Denis on 29.09.2016.
 */
"use strict";

import CustomDate from "./custom-date";
import Graphic from './graphic-d3js';

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
                                            this.httpGet(this.urls.paramsUrlForeDaily)
                                                .then(
                                                    response => {
                                                        this.weather.forecastDaily = response;
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
        metadata.temperature = `${weather.fromAPI.main.temp.toFixed(0) > 0 ? `+${weather.fromAPI.main.temp.toFixed(0)}` : weather.fromAPI.main.temp.toFixed(0)}`;
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
                this.controls.cityName[elem].innerHTML = metadata.cityName;
            }
        }
        for (let elem in this.controls.temperature) {
            if (this.controls.temperature.hasOwnProperty(elem)) {
                this.controls.temperature[elem].innerHTML = metadata.temperature+"<span class='weather-dark-card__degree'>"+this.params.textUnitTemp+"</span>";
            }
        }

        for (let elem in this.controls.mainIconWeather) {
            if (this.controls.mainIconWeather.hasOwnProperty(elem)) {
                this.controls.mainIconWeather[elem].src = this.getURLMainIcon(metadata.icon, true);
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

        if(this.weather.forecastDaily)
            this.prepareDataForGraphic();

    }

    prepareDataForGraphic(){
        var arr = [];

        for(var elem in this.weather.forecastDaily.list){
            let day = this.getDayNameOfWeekByDayNumber(this.getNumberDayInWeekByUnixTime(this.weather.forecastDaily.list[elem].dt));
            arr.push({
                'min': Math.round(this.weather.forecastDaily.list[elem].temp.min),
                'max': Math.round(this.weather.forecastDaily.list[elem].temp.max),
                'day': (elem != 0) ? day : 'Today',
                'icon': this.weather.forecastDaily.list[elem].weather[0].icon,
                'date': this.timestampToDateTime(this.weather.forecastDaily.list[elem].dt)
            });
        }

        return this.drawGraphicD3(arr);
    }

    /**
     * Отрисовка названия дней недели и иконок с погодой
     * @param data
     */
    renderIconsDaysOfWeek(data){
        var that = this;

        data.forEach(function(elem, index){
            that.controls.calendarItem[index].innerHTML = `${elem.day}<img src="http://openweathermap.org/img/w/${elem.icon}.png" width="32" height="32" alt="${elem.day}">`
            that.controls.calendarItem[index+10].innerHTML = `${elem.day}<img src="http://openweathermap.org/img/w/${elem.icon}.png" width="32" height="32" alt="${elem.day}">`
            that.controls.calendarItem[index+20].innerHTML = `${elem.day}<img src="http://openweathermap.org/img/w/${elem.icon}.png" width="32" height="32" alt="${elem.day}">`
        });
        return data;
    }

    getURLMainIcon(nameIcon, color = false){
        // Создаем и инициализируем карту сопоставлений
        var mapIcons =  new Map();

        if(!color) {
            //
            mapIcons.set('01d', '01dbw');
            mapIcons.set('02d', '02dbw');
            mapIcons.set('03d', '03dbw');
            mapIcons.set('03d', '03dbw');
            mapIcons.set('04d', '04dbw');
            mapIcons.set('05d', '05dbw');
            mapIcons.set('06d', '06dbw');
            mapIcons.set('07d', '07dbw');
            mapIcons.set('08d', '08dbw');
            mapIcons.set('09d', '09dbw');
            mapIcons.set('10d', '10dbw');
            mapIcons.set('11d', '11dbw');
            mapIcons.set('13d', '13dbw');
            // Ночные
            mapIcons.set('01n', '01dbw');
            mapIcons.set('02n', '02dbw');
            mapIcons.set('03n', '03dbw');
            mapIcons.set('03n', '03dbw');
            mapIcons.set('04n', '04dbw');
            mapIcons.set('05n', '05dbw');
            mapIcons.set('06n', '06dbw');
            mapIcons.set('07n', '07dbw');
            mapIcons.set('08n', '08dbw');
            mapIcons.set('09n', '09dbw');
            mapIcons.set('10n', '10dbw');
            mapIcons.set('11n', '11dbw');
            mapIcons.set('13n', '13dbw');

            if(mapIcons.get(nameIcon)) {
                return `img/${mapIcons.get(nameIcon)}.png`;
            }
            else {
                return `http://openweathermap.org/img/w/${nameIcon}.png`;
            }

        }
        else{
            return `img/${nameIcon}.png`;
        }

    }

    /**
     * Отрисовка графика с помощью библиотеки D3
     */
    drawGraphicD3(data){

        this.renderIconsDaysOfWeek(data);

        //Параметризуем область отрисовки графика
        let params = {
            id: "#graphic",
            data: data,
            offsetX: 15,
            offsetY: 10,
            width: 420,
            height: 79,
            rawData: [],
            margin: 10,
            colorPolilyne: "#333",
            fontSize: "12px",
            fontColor: "#333",
            strokeWidth: "1px"
        }

        // Реконструкция процедуры рендеринга графика температуры
        let objGraphicD3 =  new Graphic(params);
        objGraphicD3.render();

        // отрисовка остальных графиков
        params.id = "#graphic1";
        params.colorPolilyne = "#DDF730";
        objGraphicD3 =  new Graphic(params);
        objGraphicD3.render();

        params.id = "#graphic2";
        params.colorPolilyne = "#FEB020";
        objGraphicD3 =  new Graphic(params);
        objGraphicD3.render();
    }


    /**
     * Отображение графика погоды на неделю
     */
    drawGraphic(arr){

        this.renderIconsDaysOfWeek(arr);

        var context = this.controls.graphic.getContext('2d');
        this.controls.graphic.width= 465;
        this.controls.graphic.height = 70;

        context.fillStyle = "#fff";
        context.fillRect(0,0,600,300);

        context.font = "Oswald-Medium, Arial, sans-seri 14px";

        var step = 55;
        var i = 0;
        var zoom = 4;
        var stepY = 64;
        var stepYTextUp = 58;
        var stepYTextDown = 75;
        context.beginPath();
        context.moveTo(step-10, -1*arr[i].min*zoom+stepY);
        context.strokeText(arr[i].max+'º', step, -1*arr[i].max*zoom+stepYTextUp);
        context.lineTo(step-10, -1*arr[i++].max*zoom+stepY);
        while(i<arr.length){
            step +=55;
            context.lineTo(step, -1*arr[i].max*zoom+stepY);
            context.strokeText(arr[i].max+'º', step, -1*arr[i].max*zoom+stepYTextUp);
            i++;
        }
        context.lineTo(step+30, -1*arr[--i].max*zoom+stepY)
        step = 55;
        i = 0 ;
        context.moveTo(step-10, -1*arr[i].min*zoom+stepY);
        context.strokeText(arr[i].min+'º', step, -1*arr[i].min*zoom+stepYTextDown);
        context.lineTo(step-10, -1*arr[i++].min*zoom+stepY);
        while(i<arr.length){
            step +=55;
            context.lineTo(step, -1*arr[i].min*zoom+stepY);
            context.strokeText(arr[i].min+'º', step, -1*arr[i].min*zoom+stepYTextDown);
            i++;
        }
        context.lineTo(step+30, -1*arr[--i].min*zoom+stepY);
        context.fillStyle = "#333";
        context.lineTo(step+30, -1*arr[i].max*zoom+stepY);
        context.closePath();

        context.strokeStyle = "#333";

        context.stroke();
        context.fill();
    }

    render(){
        this.getWeatherFromApi();
    };

}
