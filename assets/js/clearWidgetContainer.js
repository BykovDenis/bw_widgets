'use strict';
const clearWidgetContainer = function() {
  let i = 1;
  const containers = [];
  while(i < 100) {
    const container = document.getElementById(`openweathermap-widget-${i}`);
    if (container) {
      containers.push(container);
    }
    i++
  };

  containers.forEach(function(elem) {
    elem.innerText = '';
  });

};

export default clearWidgetContainer;
