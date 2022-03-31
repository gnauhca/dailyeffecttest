const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

const gradient = ctx.createRadialGradient(240, 280, 0, 240, 280, 400);
gradient.addColorStop(0, '#dc8f21');
gradient.addColorStop(0.2, '#dc8f21');
gradient.addColorStop(0.5, '#1000c3');
gradient.addColorStop(1, '#1000c3');

const path = document.querySelector('path');
const pathLength = path.getTotalLength();
const pathCount = 80;
const pathSegment = pathLength / pathCount;

let pathDrawOffset = -pathLength;
// let pathDrawOffset = 0;
let pathOffset = 0;
let pointOffset = 0;

const startPoint = path.getPointAtLength(0);

function getRadian(x, y) {
  const radian = Math.atan(y / x);
  return radian < 0 ? radian + Math.PI : radian;
}

const arcs = [
  {
    startLength: 20,
    endLength: 400,
    draw: (function () {
      const startPoint = path.getPointAtLength(0);

      // startPoint = {x: 100, y: 340 }
      return function (endPoint) {
        const xSub = endPoint.x - startPoint.x;
        const ySub = endPoint.y - startPoint.y;
        const distance = Math.sqrt(xSub ** 2 + ySub ** 2);
        const count = easing.easeInCubic(Math.max(distance, 500) / 600) * 100;
        let x; let y; let percent; let size; let
          offset;
        // ctx.fillRect(endPoint.x, endPoint.y, 2, 2);
        for (let i = 0; i < count; i++) {
          percent = easing.linear(i / count);
          size = 10 * (count / 300) * (0.6 - Math.abs(percent - 0.6)) + 2;
          x = startPoint.x + xSub * percent;
          y = startPoint.y + ySub * percent;
          offset = (Math.sin((x - pointOffset) / 18) + Math.cos((y + pointOffset) / 18)) * 6;
          offset *= (1 - Math.abs(percent - 0.2));
          ctx.fillRect(x + offset, y + offset, size, size);
        }
      };
    }()),
  },
  {
    startLength: 400,
    endLength: 1000,
    draw: (function () {
      const centerPoint = path.getPointAtLength(0);
      const bezierPoint = path.getPointAtLength(400);
      const bSubCx = bezierPoint.x - centerPoint.x;
      const bSubCy = bezierPoint.y - centerPoint.y;

      let bezierPointRadian = getRadian(-bSubCx, bSubCy);
      bezierPointRadian = bezierPointRadian < 0 ? bezierPointRadian + Math.PI : bezierPointRadian;

      const alignRadian = Math.PI * 45 / 180;
      const bSubARadian = bezierPointRadian - alignRadian;

      return function (drawPoint) {
        const dSubCx = drawPoint.x - centerPoint.x;
        const dSubCy = drawPoint.y - centerPoint.y;
        const drawPointRadian = getRadian(-dSubCx, dSubCy);
        const dSubARadian = drawPointRadian - alignRadian;
        // dSubARadian = Math.max(Math.min(dSubARadian, bSubARadian), 0);

        const percent = easing.easeInOutCubic(dSubARadian / bSubARadian) * 1.1;
        // percent = percent < 0.05 && percent > 0.02 ? 0 : percent;
        const bezierControlPointX = centerPoint.x + bSubCx * percent;
        const bezierControlPointY = centerPoint.y + bSubCy * percent;

        const bezier = new Bezier(
          centerPoint.x,
          centerPoint.y,
          // centerPoint.x, centerPoint.y,
          bezierControlPointX,
          bezierControlPointY,
          drawPoint.x,
          drawPoint.y,
        );

        const count = 100;
        const pointSize = 2.5;
        let offset;
        // console.log(drawPoint)
        for (let i = 0; i < count; i++) {
          p = bezier.get(i / count);
          offset = (Math.sin((p.x - pointOffset) / 20) + Math.cos((p.y + pointOffset) / 20)) * 6;
          offset *= (1 - Math.abs(percent - 0.2));
          ctx.fillRect(p.x + offset, p.y + offset, pointSize, pointSize);
        }
      };
    }()),
  },
  {
    startLength: 1000,
    endLength: pathLength - 12,
    draw: (function () {
      const centerPoint = path.getPointAtLength(0);
      const bezierPoint = path.getPointAtLength(pathLength);
      const bSubCx = bezierPoint.x - centerPoint.x;
      const bSubCy = bezierPoint.y - centerPoint.y;

      let bezierPointRadian = getRadian(-bSubCx, bSubCy);
      bezierPointRadian = 0;
      bezierPointRadian = bezierPointRadian < 0 ? bezierPointRadian + Math.PI : bezierPointRadian;

      const alignRadian = Math.PI * 40 / 180;
      const bSubARadian = Math.abs(bezierPointRadian - alignRadian);

      return function (drawPoint) {
        const dSubCx = drawPoint.x - centerPoint.x;
        const dSubCy = drawPoint.y - centerPoint.y;
        const drawPointRadian = getRadian(-dSubCx, dSubCy);
        const dSubARadian = Math.abs(drawPointRadian - alignRadian);
        // dSubARadian = Math.max(Math.min(dSubARadian, bSubARadian), 0);

        const percent = easing.easeInOutCubic(dSubARadian / bSubARadian) * 1.1;
        // percent = Math.max(percent, 0.05);

        const bezierControlPointX = centerPoint.x + bSubCx * percent;
        const bezierControlPointY = centerPoint.y + bSubCy * percent;

        const bezier = new Bezier(
          centerPoint.x,
          centerPoint.y,
          // centerPoint.x, centerPoint.y,
          bezierControlPointX,
          bezierControlPointY,
          drawPoint.x,
          drawPoint.y,
        );

        const count = 100;
        const pointSize = 2.5;
        let p;
        let offset;
        // console.log(drawPoint)
        for (let i = 0; i < count; i++) {
          p = bezier.get(i / count);
          offset = (Math.sin((p.x - pointOffset) / 20) + Math.cos((p.y + pointOffset) / 20)) * 6;
          offset *= (1 - Math.abs(percent - 0.2));
          ctx.fillRect(p.x + offset, p.y + offset, pointSize, pointSize);
        }
      };
    }()),
  },
];

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = '#1000c3';

  const offset = pathOffset + pathDrawOffset;
  for (let i = 0; i < pathCount; i++) {
    let pointAtLength = i * pathSegment + offset;
    pointAtLength %= pathLength;
    if (pointAtLength > 0 && pointAtLength < pathLength) {
      const endPoint = path.getPointAtLength(pointAtLength);
      for (const arc of arcs) {
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
    pathDrawOffset += 10;
  } else {
    pathDrawOffset = 0;
    pathOffset += 1;
    pointOffset += 0.3;
  }
  draw();
  window.requestAnimationFrame(tick);
}());
