'use strict';

import WeatherWidget from './weather-widget';

document.addEventListener("DOMContentLoaded", function() {

    var urlDomain = "http://api.openweathermap.org";

    let paramsWidget = {
        cityName: 'Moscow',
        lang: 'en',
        appid: '2d90837ddbaeda36ab487f257829b667',
        units: 'metric',
        textUnitTemp: '0'
    };

    let controlsWidget = {
        cityName: document.querySelectorAll(".widget-menu__header"),
        temperature: document.querySelectorAll(".weather-card__number"),
        naturalPhenomenon: document.querySelectorAll(".weather-card__means"),
        windSpeed: document.querySelectorAll(".weather-card__wind"),
        mainIconWeather: document.querySelectorAll(".weather-card__img"),
        calendarItem: document.querySelectorAll(".calendar__item"),
        graphic: document.getElementById("graphic")
    };

    let urls = {
        urlWeatherAPI: `${urlDomain}/data/2.5/weather?q=${paramsWidget.cityName}&units=${paramsWidget.units}&appid=${paramsWidget.appid}`,
        paramsUrlForeDaily: `${urlDomain}/data/2.5/forecast/daily?q=${paramsWidget.cityName}&units=${paramsWidget.units}&appid=${paramsWidget.appid}`,
        windSpeed: "data/wind-speed-data.json",
        windDirection: "data/wind-direction-data.json",
        clouds: "data/clouds-data.json",
        naturalPhenomenon: "data/natural-phenomenon-data.json"
    }

    const objWidget = new WeatherWidget(paramsWidget, controlsWidget, urls);
    let jsonFromAPI = objWidget.render();

});