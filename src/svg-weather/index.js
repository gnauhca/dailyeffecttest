/* eslint-disable */
var getCurveAttrByPoints = (function() {

  /*computes control points given knots K, this is the brain of the operation*/
  function computeControlPoints(K) {
      var p1 = new Array(),
          p2 = new Array(),
          n = K.length - 1,

      /*rhs vector*/
          a = new Array(),
          b = new Array(),
          c = new Array(),
          r = new Array();

      /*left most segment*/
      a[0] = 0;
      b[0] = 2;
      c[0] = 1;
      r[0] = K[0] + 2 * K[1];

      /*internal segments*/
      for (i = 1; i < n - 1; i++) {
          a[i] = 1;
          b[i] = 4;
          c[i] = 1;
          r[i] = 4 * K[i] + 2 * K[i + 1];
      }

      /*right segment*/
      a[n - 1] = 2;
      b[n - 1] = 7;
      c[n - 1] = 0;
      r[n - 1] = 8 * K[n - 1] + K[n];

      /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
      for (i = 1; i < n; i++) {
          m = a[i] / b[i - 1];
          b[i] = b[i] - m * c[i - 1];
          r[i] = r[i] - m * r[i - 1];
      }

      p1[n - 1] = r[n - 1] / b[n - 1];
      for (i = n - 2; i >= 0; --i)
          p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

      /*we have p1, now compute p2*/
      for (i = 0; i < n - 1; i++)
          p2[i] = 2 * K[i + 1] - p1[i + 1];

      p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

      return {
          'p1': p1,
          'p2': p2
      };
  }

  /*creates formated path string for SVG cubic path element*/
  function path(x1, y1, px1, py1, px2, py2, x2, y2) {
      return (" C " + px1 + " " + py1 + " " + px2 + " " + py2 + " " + x2 + " " + y2).replace(/\.\d*/g, '');
  }

  return function getCurveAttrByPoints(points) {
      var curveAttr = '',
          x = [],
          y = [],
          px = [],
          py = [];

      for (i = 0; i < points.length; i++) {
          /*use parseInt to convert string to int*/
          x[i] = points[i][0];
          y[i] = points[i][1];
      }

      /*computes control points p1 and p2 for x and y direction*/
      px = computeControlPoints(x);
      py = computeControlPoints(y);

      /*updates path settings, the browser will draw the new spline*/
      curveAttr = 'M ' + points[0].join(' ');
      for (i = 0; i < points.length - 1; i++) {
          curveAttr += path(x[i], y[i], px.p1[i], py.p1[i], px.p2[i], py.p2[i], x[i + 1], y[i + 1]);
      }
      return curveAttr;

  }
})();



var svg = document.getElementsByTagName('svg')[0];
var pathElem = document.getElementsByTagName('path')[0];
var points = [[0,236],[81,244],[189,261],[387,273],[568,250],[704,222],[826,205,1],[1005,197,1],[1173,218,1],[1341,245,1],[1510,257,1],[1676,243,1],[1820,198],[1955,183],[2113,203],[2344,261],[2560,237]];
  base = 236,
  width = 2560,
  height = 400;

var circlePoints = [];

var texts = [
  
];

points.forEach(function(point) {
  if (point[2]) {
      circlePoints.push([point[0], point[1]]);
  }
});

var drawPath = (function() {
  var dStr = '',
      dStrH = '',//M 0 ' + height + ' L 0 ' + base + ' ',
      dStrT = '',// L ' + width + ' ' + height + ' L 0 ' + height + ' Z',
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  path.setAttribute('stroke', '#abc');
  path.setAttribute('fill', 'transparent');
  path.setAttribute('stroke-width', '2');
  // path.setAttribute('d', dStrH + ' L ' + width + ' ' + base + dStrT);
  svg.appendChild(path);
  // action in here
  return function(points) {
      dStr = dStrH + getCurveAttrByPoints(points) + dStrT;
      path.setAttribute('d', dStr);
  }    
})();

var drawCircles = (function() {
  var circles = [],
      circle;

  for (var i = 0; i < 6; i++) {
      circle = circles[i] = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

      circle.setAttribute('cx', 0);
      circle.setAttribute('cy', 0);
      circle.setAttribute('r', i===1 ? 10 : 6);
      circle.setAttribute('stroke', i===1 ? '#217dbd' : '#ffffff');
      circle.setAttribute('stroke-width', 3);
      circle.setAttribute('fill', i!==1 ? '#217dbd' : '#ffffff');

      svg.appendChild(circle);
  }

  // action in here
  return function(points) {
      for (var i = circles.length - 1; i >= 0; i--) {
          circles[i].setAttribute('cx', points[i][0]);
          circles[i].setAttribute('cy', points[i][1]);
      };
  }
})();

var drawText = (function() {
  //<text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text> 
  var texts = [],
      text = [],
      offsets = [[0, -112], [0, -72], [0, -30]]

  for (var i = 0; i < 6; i++) {
      text = [];
      text[0] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text[1] = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text[2] = document.createElementNS('http://www.w3.org/2000/svg', 'text');

      for (var j = 0; j < 3; j++) {
          text[j].setAttribute('x', 0);
          text[j].setAttribute('y', 0);
          text[j].setAttribute('text-anchor', 'middle');
          text[j].textContent = svgText[i][j];
          svg.appendChild(text[j]);
      }

      text[0].setAttribute('fill', 'rgba(166,205,230,1)');
      text[1].setAttribute('fill', 'rgba(255,255,255,1)');
      text[2].setAttribute('fill', 'rgba(255,255,255,1)');

      text[0].setAttribute('font-size', '20');
      text[1].setAttribute('font-size', '26');
      text[2].setAttribute('font-size', '20');

      texts.push(text);
  }

  return function(points) {
      points.forEach(function(point, i) {
          offsets.forEach(function(offset, j) {
              //console.log(i,j)
              texts[i][j].setAttribute('x', point[0] + offset[0]);
              texts[i][j].setAttribute('y', point[1] + offset[1]);
          });
      });
  }
})();

var svgGo = (function() {
  var aniTime = 3000,
      detal = 30,
      total = 0,
      percent = 0,
      now = (new Date).getTime();
      last = now;

  var currentPoints = [];
  var currentCirclePoints = circlePoints.map(function(circlePoint) {return [circlePoint[0], base]});

  drawCircles(currentCirclePoints);
  drawText(currentCirclePoints);

  function _() {
      now = (new Date).getTime();
      detal = now - last;
      detal = detal > 100? 30: detal;
      last = now;
      total += detal;
      percent = easing.easeOutExpo(total / aniTime);

      
      percent = percent > 1? 1: percent;
      points.forEach(function(points, i) {
          if (!currentPoints[i]) currentPoints[i] = [0,0];
          currentPoints[i][0] = points[0];
          currentPoints[i][1] = base + (points[1]-base)*percent;
      });
      circlePoints.forEach(function(circlePoint, i) {
          if (!currentCirclePoints[i]) currentCirclePoints[i] = [0,0];
          currentCirclePoints[i][0] = circlePoint[0];
          currentCirclePoints[i][1] = base + (circlePoint[1]-base)*percent;
      });
      drawPath(currentPoints);
      drawCircles(currentCirclePoints);
      drawText(currentCirclePoints);
      console.log(percent)
      if (percent < 1)
      requestAnimationFrame(function() {_()});
  }

  return _;

})();

svgGo();




/*var svg = document.getElementsByTagName('svg')[0];
var pathElem = document.getElementsByTagName('path')[0];
var points = [];


function addPoint(x, y) {
//<circle cx="100" cy="50" r="4" stroke="#abc" stroke-width="2" fill="transparent"/>
var newIndex = 0,
  circles = svg.getElementsByTagName('circle'),
  circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

circle.setAttribute('cx', x);
circle.setAttribute('cy', y);
circle.setAttribute('r', 8);
circle.setAttribute('stroke', 'blue');
circle.setAttribute('stroke-width', 5);
circle.setAttribute('fill', 'transparent');

for (var i = 0; i < points.length; i++) {
  if (x > points[i][0]) {
    newIndex = i+1;
  }
}
points.splice(newIndex, 0, '');
points[newIndex] = [x,y];

//console.log(points);

circle.setAttribute('data-index', newIndex);
for (var i = circles.length - 1; i >= 0; i--) {
  var cIndex = Number(circles[i].getAttribute('data-index'));
  if (newIndex <= cIndex) {
    circles[i].setAttribute('data-index', cIndex+1);
  }
};
svg.appendChild(circle);
}

function draw() {
pathElem.setAttribute('d', getCurveAttrByPoints(points));
}

function getData() {
  var circles = svg.getElementsByTagName('circle'),
      data = [],
      index = 0;

  for (var i = 0; i < circles.length; i++) {
      index = (circles[i].getAttribute('data-index'));
      data[index] = [
          parseInt(circles[i].getAttribute('cx')),
          parseInt(circles[i].getAttribute('cy')),
      ];
      if (circles[i].getAttribute('stroke') === 'green') {
          data[index].push(1);
      }

  }
  return JSON.stringify(data);
}

function init() {
var mouseDownPos = [],
  clickCirclePos = [];

  svg.addEventListener('mousedown', function(e) {
      var target = e.target; 

      e.preventDefault(); e.stopPropagation();
      mouseDownPos = [e.clientX, e.clientY];
      if (target.tagName.toLowerCase() !== 'circle') {
          var sTOP = document.body.scrollTop,
              offset = svg.getBoundingClientRect();

          addPoint(mouseDownPos[0] - offset.left, mouseDownPos[1] - offset.top);
      } else {

          if (event.button === 2) {
              var color = target.getAttribute('stroke') === 'blue'? 'green': 'blue';
              target.setAttribute('stroke', color);
          } else {
              clickCirclePos[0] = target.getAttribute('cx');
              clickCirclePos[1] = target.getAttribute('cy');
              document.onmousemove = function(e) {move(e, target)};                
          }
      }
      draw();

      return false;
  });




function move(e, circle) {
  var currentX = e.clientX,
    currentY = e.clientY,
    index = (circle.getAttribute('data-index'));

  points[index][0] = parseInt(clickCirclePos[0]) + currentX - parseInt(mouseDownPos[0]);
  points[index][1] = parseInt(clickCirclePos[1]) + currentY - parseInt(mouseDownPos[1]);
      //console.log(points[index]);
  circle.setAttribute('cx', points[index][0]);
  circle.setAttribute('cy', points[index][1]);
  draw();
}

document.onmouseup = function(e) {
      document.onmousemove = false;
      e.preventDefault(); e.stopPropagation();
      return false;

}
  document.oncontextmenu = function(e){ return false; }
}
init();*/
