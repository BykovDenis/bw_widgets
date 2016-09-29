'use strict';

export default function renderGraphic(){

  var graphic = document.getElementById("graphic");

  var context = graphic.getContext('2d');
  graphic.width= 465;
  graphic.height = 79;

  context.fillStyle = "#fff";
  context.fillRect(0,0,600,300);

  var arr = [
    {max:12, min:5},
    {max:11, min:5},
    {max:8, min:4},
    {max:6, min:4},
    {max:9, min:4},
    {max:8, min:2},
    {max:10, min:3},
    {max:10, min:5}
  ];

  context.font = "Oswald-Medium, Arial, sans-seri 14px";

  var step = 55;
  var i = 0;
  var zoom = 4;
  context.beginPath();
  context.moveTo(step-10, -1*arr[i].min*zoom+64);
  context.strokeText(arr[i].max+'º', step, -1*arr[i].max*zoom+58);
  context.lineTo(step-10, -1*arr[i++].max*zoom+64);
  while(i<arr.length){
    step +=55;
    context.lineTo(step, -1*arr[i].max*zoom+64);
    context.strokeText(arr[i].max+'º', step, -1*arr[i].max*zoom+58);
    i++;
  }
  context.lineTo(step+30, -1*arr[--i].max*zoom+64)
  step = 55;
  i = 0 ;
  context.moveTo(step-10, -1*arr[i].min*zoom+64);
  context.strokeText(arr[i].min+'º', step, -1*arr[i].min*zoom+75);
  context.lineTo(step-10, -1*arr[i++].min*zoom+64);
  while(i<arr.length){
    step +=55;
    context.lineTo(step, -1*arr[i].min*zoom+64);
    context.strokeText(arr[i].min+'º', step, -1*arr[i].min*zoom+75);
    i++;
  }
  context.lineTo(step+30, -1*arr[--i].min*zoom+64);
  context.fillStyle = "#333";
  context.lineTo(step+30, -1*arr[i].max*zoom+64);
  context.closePath();

  context.strokeStyle = "#333";

  context.stroke();
  context.fill();
};


