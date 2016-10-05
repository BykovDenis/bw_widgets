/**
 * Created by Denis on 29.09.2016.
 */
'use strict';

import CustomDate from "./custom-date";

/**
 График температуры и погоды
 @class Graphic
 */
export default class Graphic extends CustomDate{
    constructor(params){
        super();
        this.params = params;
        /**
         * метод для расчета отрисовки основной линии параметра температуры
         * [line description]
         * @return {[type]} [description]
         */
        this.temperaturePolygon = d3.line()
            .x(function(d){return d.x;})
            .y(function(d){return d.y;});

    }

    /**
     * Преобразуем объект данных в массив для формирования графика
     * @param  {[boolean]} temperature [признак для построения графика]
     * @return {[array]}   rawData [массив с адаптированными по типу графика данными]
     */
    prepareData(){
        let i = 0;
        let rawData = [];

        this.params.data.forEach((elem)=>{
            //rawData.push({x: i, date: this.convertStringDateMMDDYYYHHToDate(elem.date), maxT: elem.max,  minT: elem.min});
            rawData.push({x: i, date: i, maxT: elem.max,  minT: elem.min});
            i +=1; // Смещение по оси X
        });

        return rawData;
    }

    /**
     * Создаем изображение с контекстом объекта svg
     * [makeSVG description]
     * @return {[object]}
     */
    makeSVG(){
        return d3.select(this.params.id).append("svg")
            .attr("class", "axis")
            .attr("width", this.params.width)
            .attr("height", this.params.height)
            .attr("fill", this.params.colorPolilyne)
            .style("stroke", "#ffffff");
    }

    /**
     * Определение минималльного и максимального элемента по параметру даты
     * [getMinMaxDate description]
     * @param  {[array]} rawData [массив с адаптированными по типу графика данными]
     * @return {[object]} data [объект с минимальным и максимальным значением]
     */
    getMinMaxDate(rawData){

        /* Определяем минимальные и максмальные значения для построения осей */
        let data = {
            maxDate : 0,
            minDate : 10000
        }

        rawData.forEach(function(elem){
            if(data.maxDate <= elem.date) data.maxDate = elem.date;
            if(data.minDate >= elem.date) data.minDate = elem.date;
        });

        return data;

    }

    /**
     * Определяем минимальные и максимальные значения дат и температуры
     * [getMinMaxDateTemperature description]
     * @param  {[object]} rawData [description]
     * @return {[object]}         [description]
     */

    getMinMaxTemperature(rawData){

        /* Определяем минимальные и максмальные значения для построения осей */
        let data = {
            min : 100,
            max : 0
        }

        rawData.forEach(function(elem){
            if(data.min >= elem.minT)
                data.min = elem.minT;
            if(data.max <= elem.maxT)
                data.max = elem.maxT;
        });

        return data;

    }

    /**
     *
     * [getMinMaxWeather description]
     * @param  {[type]} rawData [description]
     * @return {[type]}         [description]
     */
    getMinMaxWeather(rawData){

        /* Определяем минимальные и максмальные значения для построения осей */
        let data = {
            min : 0,
            max : 0
        }

        rawData.forEach(function(elem){
            if(data.min >= elem.humidity)
                data.min = elem.humidity;
            if(data.min >= elem.rainfallAmount)
                data.min = elem.rainfallAmount;
            if(data.max <= elem.humidity)
                data.max = elem.humidity;
            if(data.max <= elem.rainfallAmount)
                data.max = elem.rainfallAmount;
        });

        return data;
    }


    /**
     * Определяем длину осей X,Y
     * [makeAxesXY description]
     * @param  {[array]} rawData [Массив с данными для построения графика]
     * @param  {[integer]} margin  [отступы от краев графика]
     * @return {[function]}         [description]
     */
    makeAxesXY(rawData, params){

        // длина оси X= ширина контейнера svg - отступ слева и справа
        let xAxisLength = params.width - 2 * params.margin;
        // длина оси Y = высота контейнера svg - отступ сверху и снизу
        let yAxisLength = params.height - 2 * params.margin;

        return this.scaleAxesXYTemperature(rawData, xAxisLength, yAxisLength, params);

    }


    /**
     * // функция интерполяции значений на оси Х и Y
     * [scaleAxesXY description]
     * @param  {[object]}  rawData     [Объект с данными для построения графика]
     * @param  {function} xAxisLength [интерполирование значений на ось X]
     * @param  {function} yAxisLength [интерполирование значений на ось Y]
     * @param  {[type]}  margin      [отступы от краев графика]
     * @return {[array]}              [массив с интерполированными значениями]
     */
    scaleAxesXYTemperature(rawData, xAxisLength, yAxisLength, params){

        let {maxDate, minDate} = this.getMinMaxDate(rawData);
        let {min, max} = this.getMinMaxTemperature(rawData);

        /**
         * метод интерполяции значений на ось Х
         * [scaleTime description]
         */
        var scaleX = d3.scaleTime()
            .domain([new Date(minDate), new Date(maxDate)])
            .range([0, xAxisLength]);

        /**
         * метод интерполяции значений на ось Y
         * [scaleLinear description]
         * @return {[type]} [description]
         */
        var scaleY = d3.scaleLinear()
            .domain([max+5, min-5])
            .range([0, yAxisLength]);

        let data = [];
        // масштабирование реальных данных в данные для нашей координатной системы
        rawData.forEach((elem) => {
            data.push({x: scaleX(elem.date) + params.offsetX,
                maxT: scaleY(elem.maxT) + params.offsetX,
                minT: scaleY(elem.minT) + params.offsetX});
        });

        return {scaleX: scaleX, scaleY: scaleY, data: data};

    }

    scaleAxesXYWeather(rawData, xAxisLength, yAxisLength, margin){

        let {maxDate, minDate} = this.getMinMaxDate(rawData);
        let {min, max} = this.getMinMaxWeather(rawData);

        // функция интерполяции значений на ось Х
        var scaleX = d3.scaleTime()
            .domain([new Date(minDate), new Date(maxDate)])
            .range([0, xAxisLength]);

        // функция интерполяции значений на ось Y
        var scaleY = d3.scaleLinear()
            .domain([max, min])
            .range([0, yAxisLength]);
        let data = [];

        // масштабирование реальных данных в данные для нашей координатной системы
        rawData.forEach((elem) => {
            data.push({x: scaleX(elem.date) + margin, humidity: scaleY(elem.humidity) + margin, rainfallAmount: scaleY(elem.rainfallAmount) + margin  , color: elem.color});
        });

        return {scaleX: scaleX, scaleY: scaleY, data: data};

    }

    /**
     * Формивароние массива для рисования полилинии
     * [makePolyline description]
     * @param  {[array]} data [массив с интерполированными значениями]
     * @param  {[integer]} margin [отступ от краев графика]
     * @param  {[object]} scaleX, scaleY [объекты с функциями интерполяции X,Y]
     * @return {[type]}  [description]
     */
    makePolyline(data, params, scaleX, scaleY){

        let arrPolyline = [];
        data.forEach((elem) => {
            arrPolyline.push({x: scaleX(elem.date) + params.offsetX, y: scaleY(elem.maxT) + params.offsetY});
        });
        data.reverse().forEach((elem) => {
            arrPolyline.push({x: scaleX(elem.date) + params.offsetX, y: scaleY(elem.minT) + params.offsetY});
        });
        arrPolyline.push({x: scaleX(data[data.length-1]['date']) + params.offsetX, y: scaleY(data[data.length-1]['maxT']) + params.offsetY});

        return arrPolyline;

    }
    /**
     * Отрисовка полилиний с заливкой основной и имитация ее тени
     * [drawPoluline description]
     * @param  {[type]} svg  [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    drawPolyline(svg, data){
        // добавляем путь и рисуем линии

        svg.append("g").append("path")
            .style("stroke-width", this.params.strokeWidth)
            .attr("d", this.temperaturePolygon(data))
            .style("stroke", this.params.colorPolilyne)
            .style("fill", this.params.colorPolilyne)
            .style("opacity", 1);

    }

     drawLabelsTemperature(svg, data, params){

        data.forEach((elem, item, data)=>{

            // отрисовка текста
            svg.append("text")
                .attr("x", elem.x)
                .attr("y", elem.maxT - params.offsetX/2-2)
                .attr("text-anchor", "middle")
                .style("font-size", params.fontSize)
                .style("stroke", params.fontColor)
                .style("fill", params.fontColor)
                .text(params.data[item].max+'°');

            svg.append("text")
                .attr("x", elem.x)
                .attr("y", elem.minT + params.offsetY/2+7)
                .attr("text-anchor", "middle")
                .style("font-size", params.fontSize)
                .style("stroke", params.fontColor)
                .style("fill", params.fontColor)
                .text(params.data[item].min+'°');
        });
    }

    /**
     * Метод диспетчер прорисовка графика со всеми элементами
     * [render description]
     * @return {[type]} [description]
     */
    render() {
        let svg = this.makeSVG();
        let rawData = this.prepareData();

        let {scaleX, scaleY, data} =  this.makeAxesXY(rawData, this.params);
        let polyline = this.makePolyline(rawData, this.params, scaleX, scaleY);
        this.drawPolyline(svg, polyline);
        this.drawLabelsTemperature(svg, data, this.params);
        //this.drawMarkers(svg, polyline, this.margin);

    }

}

