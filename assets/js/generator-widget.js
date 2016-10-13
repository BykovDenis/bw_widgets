/**
 * Created by Denis on 13.10.2016.
 */
export default class GeneratorWidget {
    constructor(){
        // объект-карта для сопоставления всех виджетов с кнопкой-инициатором их вызова для генерации кода
        this.mapWidgets = {
            'widget-1-dark-blue' : {
                code: "script.js?type=1&schema=dark&color=blue",
            },
            'widget-2-dark-blue' : {
                code: "script.js?type=2&schema=dark&color=blue",
            },
            'widget-3-dark-blue' : {
                code: "script.js?type=3&schema=dark&color=blue",
            },
            'widget-4-dark-blue' : {
                code: "script.js?type=4&schema=dark&color=blue",
            },
            'widget-5-lite-blue' : {
                code: "script.js?type=5&schema=lite&color=blue",
            },
            'widget-6-lite-blue' : {
                code: "script.js?type=6&schema=lite&color=blue",
            },
            'widget-7-lite-blue' : {
                code: "script.js?type=7&schema=lite&color=blue",
            },
            'widget-8-lite-blue' : {
                code: "script.js?type=8&schema=lite&color=blue",
            },
            'widget-9-lite-blue' : {
                code: "script.js?type=9&schema=lite&color=blue",
            },
            'widget-1-dark-brown' : {
                code: "script.js?type=1&schema=dark&color=brown",
            },
            'widget-2-dark-brown' : {
                code: "script.js?type=2&schema=dark&color=brown",
            },
            'widget-3-dark-brown' : {
                code: "script.js?type=3&schema=dark&color=brown",
            },
            'widget-4-dark-brown' : {
                code: "script.js?type=4&schema=dark&color=brown",
            },
            'widget-5-lite-brown' : {
                code: "script.js?type=5&schema=lite&color=brown",
            },
            'widget-6-lite-brown' : {
                code: "script.js?type=6&schema=lite&color=brown",
            },
            'widget-7-lite-brown' : {
                code: "script.js?type=7&schema=lite&color=brown",
            },
            'widget-8-lite-brown' : {
                code: "script.js?type=8&schema=lite&color=brown",
            },
            'widget-9-lite-brown' : {
                code: "script.js?type=9&schema=lite&color=brown",
            },
            'widget-1-lite-white' : {
                code: "script.js?type=1&schema=lite&color=white",
            },
            'widget-2-lite-white' : {
                code: "script.js?type=2&schema=lite&color=white",
            },
            'widget-3-lite-white' : {
                code: "script.js?type=3&schema=lite&color=white",
            },
            'widget-4-lite-white' : {
                code: "script.js?type=4&schema=lite&color=white",
            },
        }
    }
}
