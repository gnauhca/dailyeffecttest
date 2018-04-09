const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

const path = document.querySelector('path');
const pathLength = path.getTotalLength();
const pathCount = 80;
const pathSegment = pathLength / pathCount;

// let pathDrawOffset = -pathLength;
let pathDrawOffset = 0;
let pathOffset = 0;
let pointOffset = 0;

const startPoint = path.getPointAtLength(0);

function draw() {

  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = '#00f';

  let offset = pathOffset + pathDrawOffset;
  for(let i = 0; i < pathCount; i++) {
    let pointAtLength = i * pathSegment + offset;
    pointAtLength %= pathLength;
    if (pointAtLength > 0 && pointAtLength < pathLength) {
      let endPoint = path.getPointAtLength(pointAtLength);
      drawLine(startPoint, endPoint);
      // console.log(startPoint, endPoint);
    }
  }
}

function drawLine(startPoint, endPoint) {
  let xSub = endPoint.x - startPoint.x;
  let ySub = endPoint.y - startPoint.y;
  let distance = Math.sqrt(Math.pow(xSub, 2) + Math.pow(ySub, 2));
  let count = easing.easeInCubic(Math.max(distance, 500) / 600) * 100 + 10;
  let x, y, percent, size, offset;
  // ctx.fillRect(endPoint.x, endPoint.y, 2, 2);
  for (let i = 0; i < count; i++) {
    percent = easing.easeOutCubic(i / count);
    size = 10 * (count / 300) * (0.6 - Math.abs(percent - 0.6)) + 1;
    x = startPoint.x + xSub * percent;
    y = startPoint.y + ySub * percent;
    offset = (Math.sin((x - pointOffset) / 50) + Math.cos((y + pointOffset) / 50)) * 6;
    offset *= (1 - Math.abs(percent - 0.2))
    ctx.fillRect(x + offset, y + offset, size, size);
  }
}

// draw();

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