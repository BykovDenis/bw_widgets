"use strict";

import WeatherWidget from './weather-widget';

// Генерация большого виджета
document.addEventListener('DOMContentLoaded', function(){

  const generatorDOM = function(size = "full"){

    var html = `<link rel="stylesheet" href="css/style.css">`;
    html += `<script src="js/libs/d3.min.js"></script>`;
    if(size === "full"){
      html += `<div class="widget-menu widget-menu__layout"><h1 class="widget-menu__header">Weather for Moscow</h1>
        <div class="widget-menu__links"><span>More at</span><a href="//openweathermap.org/" target="_blank" class="widget-menu__link">
        OpenWeatherMap</a></div></div><div class="widget__body"><div class="weather-card"><div class="weather-card__row1">
        <img src="img/10dbw.png" width="128" height="128" alt="Weather for Moscow" class="weather-card__img"/>
        <div class="weather-card__col"><p class="weather-card__number">0<sup class="weather-card__degree">0 </sup></p>
        <span>and rising</span></div></div><div class="weather-card__row2"><p class="weather-card__means">-</p>
        <p class="weather-card__wind">Wind:</p></div></div><div class="widget__calendar"><ul class="calendar">
        <li class="calendar__item">Today<img src="" width="32" height="32" alt="Today"/></li>
        <li class="calendar__item">Sat <img src="" width="32" height="32" alt="Sat"/></li>
        <li class="calendar__item">Sun<img src="" width="32" height="32" alt="Sun"/></li>
        <li class="calendar__item">Mon <img src="" width="32" height="32" alt="Mon"/></li>
        <li class="calendar__item">Tue<img src="" width="32" height="32" alt="Tue"/></li>
        <li class="calendar__item">Wed<img src="" width="32" height="32" alt="Wed"/></li>
        <li class="calendar__item">Thu<img src="" width="32" height="32" alt="Thu"/></li>
        <li class="calendar__item">Fri<img src="" width="32" height="32" alt="Fri"/></li></ul>
        <div id="graphic" class="widget__graphic"></div></div></div>`;
      html +=`<script src="js/weather-widget.js"></script><script>const objWidget = new WeatherWidget(paramsWidget, controlsWidget, urls);
        if(generatorDOM()) var jsonFromAPI = objWidget.render();</script>`;
    }

    document.getElementById("widget").innerHTML = html;
    return html;

  };

  //Формируем параметр фильтра по городу
  let q = '';
  if(window.location.search)
      q = window.location.search;
  else
      q = "?q=London";

  let urlDomain = "http://api.openweathermap.org";

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
      urlWeatherAPI: `${urlDomain}/data/2.5/weather${q}&units=${paramsWidget.units}&appid=${paramsWidget.appid}`,
      paramsUrlForeDaily: `${urlDomain}/data/2.5/forecast/daily${q}&units=${paramsWidget.units}&cnt=8&appid=${paramsWidget.appid}`,
      windSpeed: "data/wind-speed-data.json",
      windDirection: "data/wind-direction-data.json",
      clouds: "data/clouds-data.json",
      naturalPhenomenon: "data/natural-phenomenon-data.json"
  }

});
