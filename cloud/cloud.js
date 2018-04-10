const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

const gradient = ctx.createRadialGradient(200, 280, 0, 200, 280, 400); 
gradient.addColorStop(0, '#df9145');
gradient.addColorStop(0.5, '#1000c3');
gradient.addColorStop(1, '#1000c3');

const path = document.querySelector('path');
const pathLength = path.getTotalLength();
const pathCount = 80;
const pathSegment = pathLength / pathCount;

// let pathDrawOffset = -pathLength;
let pathDrawOffset = 0;
let pathOffset = 0;
let pointOffset = 0;

const startPoint = path.getPointAtLength(0);

function getRadian(x, y) {
  let radian = Math.atan(y / x);
  return radian < 0 ? radian + Math.PI : radian;
}

let arcs = [
  {
    startLength: 20,
    endLength: 400,
    draw: (function() {
      let startPoint = path.getPointAtLength(0);

      // startPoint = {x: 100, y: 340 }
      return function(endPoint) {
        let xSub = endPoint.x - startPoint.x;
        let ySub = endPoint.y - startPoint.y;
        let distance = Math.sqrt(Math.pow(xSub, 2) + Math.pow(ySub, 2));
        let count = easing.easeInCubic(Math.max(distance, 500) / 600) * 100;
        let x, y, percent, size, offset;
        // ctx.fillRect(endPoint.x, endPoint.y, 2, 2);
        for (let i = 0; i < count; i++) {
          percent = easing.linear(i / count);
          size = 10 * (count / 300) * (0.6 - Math.abs(percent - 0.6)) + 2;
          x = startPoint.x + xSub * percent;
          y = startPoint.y + ySub * percent;
          offset = (Math.sin((x - pointOffset) / 50) + Math.cos((y + pointOffset) / 50)) * 6;
          offset *= (1 - Math.abs(percent - 0.2))
          ctx.fillRect(x + offset, y + offset, size, size);
        }
      }
    })()
  },
  {
    startLength: 400,
    endLength: 1000,
    draw: (function() {
      let centerPoint = path.getPointAtLength(0);
      let bezierPoint = path.getPointAtLength(400);
      let bSubCx = bezierPoint.x - centerPoint.x;
      let bSubCy = bezierPoint.y - centerPoint.y;

      let bezierPointRadian = getRadian(-bSubCx, bSubCy);
      bezierPointRadian = bezierPointRadian < 0 ? bezierPointRadian + Math.PI : bezierPointRadian;

      let alignRadian = Math.PI * 45 / 180;
      let bSubARadian = bezierPointRadian - alignRadian;

      return function(drawPoint) {
        let dSubCx = drawPoint.x - centerPoint.x;
        let dSubCy = drawPoint.y - centerPoint.y;
        let drawPointRadian = getRadian(-dSubCx, dSubCy);
        let dSubARadian = drawPointRadian - alignRadian;
        // dSubARadian = Math.max(Math.min(dSubARadian, bSubARadian), 0);
        
        let percent = easing.easeInOutCubic(dSubARadian / bSubARadian) * 1.1;
        // percent = percent < 0.05 && percent > 0.02 ? 0 : percent;
        let bezierControlPointX = centerPoint.x + bSubCx * percent;
        let bezierControlPointY = centerPoint.y + bSubCy * percent;

        let bezier = new Bezier(
          centerPoint.x, centerPoint.y, 
          // centerPoint.x, centerPoint.y, 
          bezierControlPointX, bezierControlPointY,
          drawPoint.x, drawPoint.y 
        );

        let count = 100;
        let pointSize = 2.5;
        let p;
        // console.log(drawPoint)
        for (let i = 0; i < count; i++) {
          p = bezier.get(i / count);
          ctx.fillRect(p.x, p.y, pointSize, pointSize);
        }
      }
    })()
  },
  {
    startLength: 1000,
    endLength: pathLength - 12,
    draw: (function() {
      let centerPoint = path.getPointAtLength(0);
      let bezierPoint = path.getPointAtLength(pathLength);
      let bSubCx = bezierPoint.x - centerPoint.x;
      let bSubCy = bezierPoint.y - centerPoint.y;

      let bezierPointRadian = getRadian(-bSubCx, bSubCy);
      bezierPointRadian = 0
      bezierPointRadian = bezierPointRadian < 0 ? bezierPointRadian + Math.PI : bezierPointRadian;

      let alignRadian = Math.PI * 40 / 180;
      let bSubARadian = Math.abs(bezierPointRadian - alignRadian);

      return function(drawPoint) {
        let dSubCx = drawPoint.x - centerPoint.x;
        let dSubCy = drawPoint.y - centerPoint.y;
        let drawPointRadian = getRadian(-dSubCx, dSubCy);
        let dSubARadian = Math.abs(drawPointRadian - alignRadian);
        // dSubARadian = Math.max(Math.min(dSubARadian, bSubARadian), 0);
        
        let percent = easing.easeInOutCubic(dSubARadian / bSubARadian) * 1.1;
        // percent = Math.max(percent, 0.05);

        let bezierControlPointX = centerPoint.x + bSubCx * percent;
        let bezierControlPointY = centerPoint.y + bSubCy * percent;

        let bezier = new Bezier(
          centerPoint.x, centerPoint.y, 
          // centerPoint.x, centerPoint.y, 
          bezierControlPointX, bezierControlPointY,
          drawPoint.x, drawPoint.y 
        );

        let count = 100;
        let pointSize = 2.5;
        let p;
        // console.log(drawPoint)
        for (let i = 0; i < count; i++) {
          p = bezier.get(i / count);
          ctx.fillRect(p.x, p.y, pointSize, pointSize);
        }
      }
    })()
  },
];

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = '#1000c3';

  let offset = pathOffset + pathDrawOffset;
  for(let i = 0; i < pathCount; i++) {
    let pointAtLength = i * pathSegment + offset;
    pointAtLength %= pathLength;
    if (pointAtLength > 0 && pointAtLength < pathLength) {
      let endPoint = path.getPointAtLength(pointAtLength);
      for (let arc of arcs) {
        if (pointAtLength > arc.startLength && pointAtLength < arc.endLength) {
        arc.draw(endPoint);
        }
      }
    }
  }

  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.restore();
}

draw();

(function tick() {
  
  if (pathDrawOffset < 0) {
    pathDrawOffset += 20;
  }  else {
    pathDrawOffset = 0;
    pathOffset += 1;
    pointOffset += 1;
  }
  draw();
  window.requestAnimationFrame(tick);
})();