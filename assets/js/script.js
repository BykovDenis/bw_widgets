'use strict';

import renderWidgets from './renderWidgets';
import clearWidgetContainer from './clearWidgetContainer';

const cityId = 524901;
renderWidgets(cityId);

var btn = document.getElementById('search-city');
var btnRenderWidgets = document.getElementById('append-scripts');
var scripts = document.getElementById('scripts');
var scriptsContainer = document.getElementById('container-scripts');

function reRenderDashboardWIdgets() {
  clearWidgetContainer();
  const cityId = 2988507;
  renderWidgets(cityId);
}

btn.addEventListener('click', reRenderDashboardWIdgets);
