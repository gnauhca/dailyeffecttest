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

function draw() {
  ctx.save();
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = '#1000c3';

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

  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.restore();
}

function drawLine(startPoint, endPoint) {

  let xSub = endPoint.x - startPoint.x;
  let ySub = endPoint.y - startPoint.y;
  let distance = Math.sqrt(Math.pow(xSub, 2) + Math.pow(ySub, 2));
  let count = easing.easeInCubic(Math.max(distance, 500) / 600) * 100;
  let x, y, percent, size, offset;
  // ctx.fillRect(endPoint.x, endPoint.y, 2, 2);
  for (let i = 0; i < count; i++) {
    percent = easing.easeInOutQuad(i / count);
    size = 10 * (count / 300) * (0.6 - Math.abs(percent - 0.6)) + 1;
    x = startPoint.x + xSub * percent;
    y = startPoint.y + ySub * percent;
    offset = (Math.sin((x - pointOffset) / 20) + Math.cos((y + pointOffset) / 20)) * 6;
    offset *= (1 - Math.abs(percent - 0.2))
    ctx.fillRect(x + offset, y + offset, size, size);
  }

}

// draw();

(function tick() {
  
  if (pathDrawOffset < 0) {
    pathDrawOffset += 10;
  }  else {
    pathDrawOffset = 0;
    pathOffset += 1;
    pointOffset += 1;
  }
  draw();
  window.requestAnimationFrame(tick);
})();