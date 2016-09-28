(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var render = function render() {
  var graphic = document.getElementById("graphic");

  var context = graphic.getContext('2d');
  graphic.width = 465;
  graphic.height = 79;

  context.fillStyle = "#fff";
  context.fillRect(0, 0, 600, 300);

  var arr = [{ max: 12, min: 5 }, { max: 11, min: 5 }, { max: 8, min: 4 }, { max: 6, min: 4 }, { max: 9, min: 4 }, { max: 8, min: 2 }, { max: 10, min: 3 }, { max: 10, min: 5 }];

  context.font = "Oswald-Medium, Arial, sans-seri 14px";

  var step = 55;
  var i = 0;
  var zoom = 4;
  context.beginPath();
  context.moveTo(step - 10, -1 * arr[i].min * zoom + 64);
  context.strokeText(arr[i].max + 'º', step, -1 * arr[i].max * zoom + 58);
  context.lineTo(step - 10, -1 * arr[i++].max * zoom + 64);
  while (i < arr.length) {
    step += 55;
    context.lineTo(step, -1 * arr[i].max * zoom + 64);
    context.strokeText(arr[i].max + 'º', step, -1 * arr[i].max * zoom + 58);
    i++;
  }
  context.lineTo(step + 30, -1 * arr[--i].max * zoom + 64);
  step = 55;
  i = 0;
  context.moveTo(step - 10, -1 * arr[i].min * zoom + 64);
  context.strokeText(arr[i].min + 'º', step, -1 * arr[i].min * zoom + 75);
  context.lineTo(step - 10, -1 * arr[i++].min * zoom + 64);
  while (i < arr.length) {
    step += 55;
    context.lineTo(step, -1 * arr[i].min * zoom + 64);
    context.strokeText(arr[i].min + 'º', step, -1 * arr[i].min * zoom + 75);
    i++;
  }
  context.lineTo(step + 30, -1 * arr[--i].min * zoom + 64);
  context.fillStyle = "#333";
  context.lineTo(step + 30, -1 * arr[i].max * zoom + 64);
  context.closePath();

  context.strokeStyle = "#333";

  context.stroke();
  context.fill();
};

render();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksU0FBVSxTQUFWLE1BQVUsR0FBVTtBQUFDLE1BQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBZDs7QUFFekIsTUFBSSxVQUFVLFFBQVEsVUFBUixDQUFtQixJQUFuQixDQUFkO0FBQ0EsVUFBUSxLQUFSLEdBQWUsR0FBZjtBQUNBLFVBQVEsTUFBUixHQUFpQixFQUFqQjs7QUFFQSxVQUFRLFNBQVIsR0FBb0IsTUFBcEI7QUFDQSxVQUFRLFFBQVIsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsRUFBcUIsR0FBckIsRUFBeUIsR0FBekI7O0FBRUEsTUFBSSxNQUFNLENBQ1IsRUFBQyxLQUFJLEVBQUwsRUFBUyxLQUFJLENBQWIsRUFEUSxFQUVSLEVBQUMsS0FBSSxFQUFMLEVBQVMsS0FBSSxDQUFiLEVBRlEsRUFHUixFQUFDLEtBQUksQ0FBTCxFQUFRLEtBQUksQ0FBWixFQUhRLEVBSVIsRUFBQyxLQUFJLENBQUwsRUFBUSxLQUFJLENBQVosRUFKUSxFQUtSLEVBQUMsS0FBSSxDQUFMLEVBQVEsS0FBSSxDQUFaLEVBTFEsRUFNUixFQUFDLEtBQUksQ0FBTCxFQUFRLEtBQUksQ0FBWixFQU5RLEVBT1IsRUFBQyxLQUFJLEVBQUwsRUFBUyxLQUFJLENBQWIsRUFQUSxFQVFSLEVBQUMsS0FBSSxFQUFMLEVBQVMsS0FBSSxDQUFiLEVBUlEsQ0FBVjs7QUFXQSxVQUFRLElBQVIsR0FBZSxzQ0FBZjs7QUFFQSxNQUFJLE9BQU8sRUFBWDtBQUNBLE1BQUksSUFBSSxDQUFSO0FBQ0EsTUFBSSxPQUFPLENBQVg7QUFDQSxVQUFRLFNBQVI7QUFDQSxVQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEVBQTNDO0FBQ0EsVUFBUSxVQUFSLENBQW1CLElBQUksQ0FBSixFQUFPLEdBQVAsR0FBVyxHQUE5QixFQUFtQyxJQUFuQyxFQUF5QyxDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixFQUE1RDtBQUNBLFVBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxHQUFKLEVBQVMsR0FBWixHQUFnQixJQUFoQixHQUFxQixFQUE3QztBQUNBLFNBQU0sSUFBRSxJQUFJLE1BQVosRUFBbUI7QUFDakIsWUFBTyxFQUFQO0FBQ0EsWUFBUSxNQUFSLENBQWUsSUFBZixFQUFxQixDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixFQUF4QztBQUNBLFlBQVEsVUFBUixDQUFtQixJQUFJLENBQUosRUFBTyxHQUFQLEdBQVcsR0FBOUIsRUFBbUMsSUFBbkMsRUFBeUMsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsRUFBNUQ7QUFDQTtBQUNEO0FBQ0QsVUFBUSxNQUFSLENBQWUsT0FBSyxFQUFwQixFQUF3QixDQUFDLENBQUQsR0FBRyxJQUFJLEVBQUUsQ0FBTixFQUFTLEdBQVosR0FBZ0IsSUFBaEIsR0FBcUIsRUFBN0M7QUFDQSxTQUFPLEVBQVA7QUFDQSxNQUFJLENBQUo7QUFDQSxVQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEVBQTNDO0FBQ0EsVUFBUSxVQUFSLENBQW1CLElBQUksQ0FBSixFQUFPLEdBQVAsR0FBVyxHQUE5QixFQUFtQyxJQUFuQyxFQUF5QyxDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixFQUE1RDtBQUNBLFVBQVEsTUFBUixDQUFlLE9BQUssRUFBcEIsRUFBd0IsQ0FBQyxDQUFELEdBQUcsSUFBSSxHQUFKLEVBQVMsR0FBWixHQUFnQixJQUFoQixHQUFxQixFQUE3QztBQUNBLFNBQU0sSUFBRSxJQUFJLE1BQVosRUFBbUI7QUFDakIsWUFBTyxFQUFQO0FBQ0EsWUFBUSxNQUFSLENBQWUsSUFBZixFQUFxQixDQUFDLENBQUQsR0FBRyxJQUFJLENBQUosRUFBTyxHQUFWLEdBQWMsSUFBZCxHQUFtQixFQUF4QztBQUNBLFlBQVEsVUFBUixDQUFtQixJQUFJLENBQUosRUFBTyxHQUFQLEdBQVcsR0FBOUIsRUFBbUMsSUFBbkMsRUFBeUMsQ0FBQyxDQUFELEdBQUcsSUFBSSxDQUFKLEVBQU8sR0FBVixHQUFjLElBQWQsR0FBbUIsRUFBNUQ7QUFDQTtBQUNEO0FBQ0QsVUFBUSxNQUFSLENBQWUsT0FBSyxFQUFwQixFQUF3QixDQUFDLENBQUQsR0FBRyxJQUFJLEVBQUUsQ0FBTixFQUFTLEdBQVosR0FBZ0IsSUFBaEIsR0FBcUIsRUFBN0M7QUFDQSxVQUFRLFNBQVIsR0FBb0IsTUFBcEI7QUFDQSxVQUFRLE1BQVIsQ0FBZSxPQUFLLEVBQXBCLEVBQXdCLENBQUMsQ0FBRCxHQUFHLElBQUksQ0FBSixFQUFPLEdBQVYsR0FBYyxJQUFkLEdBQW1CLEVBQTNDO0FBQ0EsVUFBUSxTQUFSOztBQUVBLFVBQVEsV0FBUixHQUFzQixNQUF0Qjs7QUFFQSxVQUFRLE1BQVI7QUFDQSxVQUFRLElBQVI7QUFDQyxDQXhERDs7QUEwREEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlbmRlciA9IChmdW5jdGlvbigpe3ZhciBncmFwaGljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncmFwaGljXCIpO1xyXG5cclxudmFyIGNvbnRleHQgPSBncmFwaGljLmdldENvbnRleHQoJzJkJyk7XHJcbmdyYXBoaWMud2lkdGg9IDQ2NTtcclxuZ3JhcGhpYy5oZWlnaHQgPSA3OTtcclxuXHJcbmNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmXCI7XHJcbmNvbnRleHQuZmlsbFJlY3QoMCwwLDYwMCwzMDApO1xyXG5cclxudmFyIGFyciA9IFtcclxuICB7bWF4OjEyLCBtaW46NX0sXHJcbiAge21heDoxMSwgbWluOjV9LFxyXG4gIHttYXg6OCwgbWluOjR9LFxyXG4gIHttYXg6NiwgbWluOjR9LFxyXG4gIHttYXg6OSwgbWluOjR9LFxyXG4gIHttYXg6OCwgbWluOjJ9LFxyXG4gIHttYXg6MTAsIG1pbjozfSxcclxuICB7bWF4OjEwLCBtaW46NX1cclxuXTtcclxuXHJcbmNvbnRleHQuZm9udCA9IFwiT3N3YWxkLU1lZGl1bSwgQXJpYWwsIHNhbnMtc2VyaSAxNHB4XCI7XHJcblxyXG52YXIgc3RlcCA9IDU1O1xyXG52YXIgaSA9IDA7XHJcbnZhciB6b29tID0gNDtcclxuY29udGV4dC5iZWdpblBhdGgoKTtcclxuY29udGV4dC5tb3ZlVG8oc3RlcC0xMCwgLTEqYXJyW2ldLm1pbip6b29tKzY0KTtcclxuY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5tYXgrJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1heCp6b29tKzU4KTtcclxuY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWF4Knpvb20rNjQpO1xyXG53aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gIHN0ZXAgKz01NTtcclxuICBjb250ZXh0LmxpbmVUbyhzdGVwLCAtMSphcnJbaV0ubWF4Knpvb20rNjQpO1xyXG4gIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWF4KyfCuicsIHN0ZXAsIC0xKmFycltpXS5tYXgqem9vbSs1OCk7XHJcbiAgaSsrO1xyXG59XHJcbmNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFyclstLWldLm1heCp6b29tKzY0KVxyXG5zdGVwID0gNTU7XHJcbmkgPSAwIDtcclxuY29udGV4dC5tb3ZlVG8oc3RlcC0xMCwgLTEqYXJyW2ldLm1pbip6b29tKzY0KTtcclxuY29udGV4dC5zdHJva2VUZXh0KGFycltpXS5taW4rJ8K6Jywgc3RlcCwgLTEqYXJyW2ldLm1pbip6b29tKzc1KTtcclxuY29udGV4dC5saW5lVG8oc3RlcC0xMCwgLTEqYXJyW2krK10ubWluKnpvb20rNjQpO1xyXG53aGlsZShpPGFyci5sZW5ndGgpe1xyXG4gIHN0ZXAgKz01NTtcclxuICBjb250ZXh0LmxpbmVUbyhzdGVwLCAtMSphcnJbaV0ubWluKnpvb20rNjQpO1xyXG4gIGNvbnRleHQuc3Ryb2tlVGV4dChhcnJbaV0ubWluKyfCuicsIHN0ZXAsIC0xKmFycltpXS5taW4qem9vbSs3NSk7XHJcbiAgaSsrO1xyXG59XHJcbmNvbnRleHQubGluZVRvKHN0ZXArMzAsIC0xKmFyclstLWldLm1pbip6b29tKzY0KTtcclxuY29udGV4dC5maWxsU3R5bGUgPSBcIiMzMzNcIjtcclxuY29udGV4dC5saW5lVG8oc3RlcCszMCwgLTEqYXJyW2ldLm1heCp6b29tKzY0KTtcclxuY29udGV4dC5jbG9zZVBhdGgoKTtcclxuXHJcbmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMzMzNcIjtcclxuXHJcbmNvbnRleHQuc3Ryb2tlKCk7XHJcbmNvbnRleHQuZmlsbCgpO1xyXG59KTtcclxuXHJcbnJlbmRlcigpO1xyXG4iXX0=
