/**
 * Created by Denis on 13.10.2016.
 */
export default class GeneratorWidget {
    constructor(){
        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-left-blue' : {
                code: "script.js?type=1&schema=left&color=blue",
            },
            'widget-2-left-blue' : {
                code: "script.js?type=2&schema=left&color=blue",
            },
            'widget-3-left-blue' : {
                code: "script.js?type=3&schema=left&color=blue",
            },
            'widget-4-left-blue' : {
                code: "script.js?type=4&schema=left&color=blue",
            },
            'widget-5-right-blue' : {
                code: "script.js?type=5&schema=right&color=blue",
            },
            'widget-6-right-blue' : {
                code: "script.js?type=6&schema=right&color=blue",
            },
            'widget-7-right-blue' : {
                code: "script.js?type=7&schema=right&color=blue",
            },
            'widget-8-right-blue' : {
                code: "script.js?type=8&schema=right&color=blue",
            },
            'widget-9-right-blue' : {
                code: "script.js?type=9&schema=right&color=blue",
            },
            'widget-1-left-brown' : {
                code: "script.js?type=1&schema=left&color=brown",
            },
            'widget-2-left-brown' : {
                code: "script.js?type=2&schema=left&color=brown",
            },
            'widget-3-left-brown' : {
                code: "script.js?type=3&schema=left&color=brown",
            },
            'widget-4-left-brown' : {
                code: "script.js?type=4&schema=left&color=brown",
            },
            'widget-5-right-brown' : {
                code: "script.js?type=5&schema=right&color=brown",
            },
            'widget-6-right-brown' : {
                code: "script.js?type=6&schema=right&color=brown",
            },
            'widget-7-right-brown' : {
                code: "script.js?type=7&schema=right&color=brown",
            },
            'widget-8-right-brown' : {
                code: "script.js?type=8&schema=right&color=brown",
            },
            'widget-9-right-brown' : {
                code: "script.js?type=9&schema=right&color=brown",
            },
            'widget-1-right-white' : {
                code: "script.js?type=1&schema=right&color=white",
            },
            'widget-2-right-white' : {
                code: "script.js?type=2&schema=right&color=white",
            },
            'widget-3-right-white' : {
                code: "script.js?type=3&schema=right&color=white",
            },
            'widget-4-right-white' : {
                code: "script.js?type=4&schema=right&color=white",
            },
        }
    }
}
