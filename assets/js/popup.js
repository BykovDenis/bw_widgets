import GeneratorWidget from './generator-widget';document.addEventListener('DOMContentLoaded', function() {    var generator = new GeneratorWidget();    const form = document.forms[0];    const popup = document.getElementById("popup");    const popupClose = document.getElementById("popup-close");    const contentJSGeneration = document.getElementById("js-code-generate");    const copyContentJSCode = document.getElementById("copy-js-code");    // Фиксируем клики на форме, и открываем popup окно при нажатии на кнопку    form.addEventListener('click', function(event) {        if(event.target.id) {            event.preventDefault();            console.log(generator.mapWidgets[event.target.id]["code"]);            contentJSGeneration.value = generator.mapWidgets[event.target.id]["code"];            if(!popup.classList.contains("popup--visible")){                popup.classList.add("popup--visible");            }        }    });    // Закрываем окно при нажатии на крестик    popupClose.addEventListener("click", function() {      if(popup.classList.contains("popup--visible"))          popup.classList.remove("popup--visible");    });    copyContentJSCode.addEventListener("click", function(event){        event.preventDefault();        //var range = document.createRange();        //range.selectNode(contentJSGeneration);        //window.getSelection().addRange(range);        contentJSGeneration.select();        try{            const txtCopy = document.execCommand('copy');            var msg = txtCopy ? 'successful' : 'unsuccessful';            console.log('Copy email command was ' + msg);        }        catch(e){            console.log(`Ошибка копирования ${e.errLogToConsole}`);        }        // Снятие выделения - ВНИМАНИЕ: вы должны использовать        // removeRange(range) когда это возможно        window.getSelection().removeAllRanges();    });    copyContentJSCode.disabled = !document.queryCommandSupported('copy');});