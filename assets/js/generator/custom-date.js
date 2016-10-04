/**
 * Created by Denis on 28.09.2016.
 */
'use strict';

// Работа с датой
export default class CustomDate extends Date {

    constructor(){
        super();
    }

    /**
     * метод преобразования номера дня в году в трехразрядное число ввиде строки
     * @param  {[integer]} number [число менее 999]
     * @return {[string]}        [трехзначное число ввиде строки порядкового номера дня в году]
     */
    numberDaysOfYearXXX(number){
        if(number > 365) return false;
        if(number < 10)
            return `00${number}`;
        else if(number < 100)
            return `0${number}`;
        return number;
    }

    /**
     * Метод определения порядкового номера в году
     * @param  {date} date Дата формата yyyy-mm-dd
     * @return {integer}  Порядковый номер в году
     */
    convertDateToNumberDay(date){
        var now = new Date(date);
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return `${now.getFullYear()}-${this.numberDaysOfYearXXX(day)}`;
    }

    /**
     * Метод преообразует дату формата yyyy-<number day in year> в yyyy-mm-dd
     * @param  {string} date дата формата yyyy-<number day in year>
     * @return {date} дата формата yyyy-mm-dd
     */
    convertNumberDayToDate(date){
        var re = /(\d{4})(-)(\d{3})/;
        var line = re.exec(date);
        var beginyear = new Date(line[1]);
        var unixtime = beginyear.getTime() + line[3] * 1000 * 60 * 60 *24;
        var res = new Date(unixtime);

        var month = res.getMonth() + 1;
        var days = res.getDate();
        var year = res.getFullYear();
        return `${days < 10 ? `0${days}`: days}.${month < 10 ? `0${month}`: month}.${year}`;
    }

    /**
     * Метод преобразования даты вида yyyy-<number day in year>
     * @param  {date1} date дата в формате yyyy-mm-dd
     * @return {string}  дата ввиде строки формата yyyy-<number day in year>
     */
    formatDate(date1){
        var date = new Date(date1);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        return `${year}-${(month<10)?`0${month}`: month}-${(day<10)?`0${day}`: day}`;
    }

    /**
     * Метод возвращает текущую отформатированную дату yyyy-mm-dd
     * @return {[string]} текущая дата
     */
    getCurrentDate(){
        var now = new Date();
        return this.formatDate(now);
    }

    // Возвращает последние три месяца
    getDateLastThreeMonth(){
        var now = new Date();
        var year = new Date().getFullYear();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);

        day -=90;

        if(day < 0 ){
            year -=1;
            day = 365 - day;
        }

        return `${year}-${this.numberDaysOfYearXXX(day)}`;
    }

    // Возвращает интервал дат текущего лета
    getCurrentSummerDate(){
        var year = new Date().getFullYear();
        var dateFr = this.convertDateToNumberDay(`${year}-06-01`);
        var dateTo = this.convertDateToNumberDay(`${year}-08-31`);
        //console.log(`${dateFr}  ${dateTo}`);
        return [dateFr, dateTo];
    }

    // Возвращает интервал дат текущего лета
    getCurrentSpringDate(){
        var year = new Date().getFullYear();
        var dateFr = this.convertDateToNumberDay(`${year}-03-01`);
        var dateTo = this.convertDateToNumberDay(`${year}-05-31`);
        //console.log(`${dateFr}  ${dateTo}`);
        return [dateFr, dateTo];
    }

    // Возвращает интервал дат предыдущего лета
    getLastSummerDate(){
        var year = new Date().getFullYear()-1;
        var dateFr = this.convertDateToNumberDay(`${year}-06-01`);
        var dateTo = this.convertDateToNumberDay(`${year}-08-31`);
        //console.log(`${dateFr}  ${dateTo}`);
        return [dateFr, dateTo];
    }

    getFirstDateCurYear(){
        return `${new Date().getFullYear()}-001`;
    }

    /**
     * [timestampToDate unixtime to dd.mm.yyyy hh:mm]
     * @param  {[type]} timestamp [description]
     * @return {string}           [description]
     */
    timestampToDateTime(unixtime){
        var date = new Date(unixtime*1000);
        return date.toLocaleString().replace(/,/,'').replace(/:\w+$/,'');
    }


    /**
     * [timestampToDate unixtime to hh:mm]
     * @param  {[type]} timestamp [description]
     * @return {string}           [description]
     */
    timestampToTime(unixtime){
        var date = new Date(unixtime*1000);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return `${hours<10?`0${hours}`:hours}:${minutes<10?`0${minutes}`:minutes} `;
    }


    /**
     * Возращение номера дня в неделе по unixtime timestamp
     * @param unixtime
     * @returns {number}
     */
    getNumberDayInWeekByUnixTime(unixtime){
        var date = new Date(unixtime*1000);
        return date.getDay();
    }

    /** Вернуть наименование дня недели
     * @param dayNumber
     * @returns {string}
     */
    getDayNameOfWeekByDayNumber(dayNumber){
        let days = {
            0 : "Sun",
            1 : "Mon",
            2 : "Tue",
            3 : "Wed",
            4 : "Thu",
            5 : "Fri",
            6 : "Sat"
        };
        return days[dayNumber];
    }

    /** Сравнение даты в формате dd.mm.yyyy = dd.mm.yyyy с текущим днем
     *
     */
    compareDatesWithToday(date) {
        return date.toLocaleDateString() === (new Date()).toLocaleDateString();
    }

    convertStringDateMMDDYYYHHToDate(date){
        let re =/(\d{2})(\.{1})(\d{2})(\.{1})(\d{4})/;
        let resDate = re.exec(date);
        if(resDate.length == 6){
            return new Date(`${resDate[5]}-${resDate[3]}-${resDate[1]}`)
        }
        // Если дата не распарсена берем текущую
        return new Date();
    }
}

