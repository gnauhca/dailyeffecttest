var cvs = document.querySelector('canvas');
var width = window.innerWidth;
var height = window.innerHeight;
cvs.width = width;
cvs.height = height;

var ctx = cvs.getContext('2d');

ctx.fillStyle = '#ff0000';
ctx.font = "200px 'microsoft yahei'";

for (var i = 0; i < parseInt(width/100); i++) {
  var r = (Math.random() * 255) | 0;
  var g = (Math.random() * 255) | 0;
  var b = (Math.random() * 255) | 0;
  var a = Math.random().toFixed(3);
  ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a +')';
  console.log('rgba(' + r + ',' + g + ',' + b + ',' + a +')');
  ctx.fillText("Chaz", Math.random()*width - 400, Math.random()*height - 100);
}


var imgBackup = ctx.getImageData(0,0, width, height);

var mWidth = 200;
var mHeight = 200;
var mSize = 25;
var cvsLeft;
var cvsTop;

document.querySelector('[name=width]').addEventListener('change', function() {
  mWidth = this.value;
});
document.querySelector('[name=height]').addEventListener('change', function() {
  mHeight = this.value;
});
document.querySelector('[name=msize]').addEventListener('change', function() {
  mSize = this.value;
});


var centerX = width/2 - mWidth/2;
var centerY = height/2 - mHeight/2;

var currentX = 0;
var currentY = 0;

var stepX = (centerX - currentX) / 40;
var stepY = (centerY - currentY) / 40;

var ani = true;

function goCenter() {
  currentX += stepX;
  currentY += stepY;
  if (currentX < centerX) {
    ctx.putImageData(imgBackup, 0,0);
    mosaic(ctx, currentX|0, currentY|0, mWidth, mHeight, mSize);
    window.requestAnimationFrame(goCenter);
  } else {
    ani =false;
  }
}
goCenter();

//console.log(cvs.width, cvs.height);
document.onmousemove = function(e) { 
  cvsLeft = cvs.getBoundingClientRect().left;
  cvsTop = cvs.getBoundingClientRect().top;

  if (!ani && e.pageX <= cvsLeft + cvs.width && e.pageY <= cvsTop + cvs.height) { 
    ctx.putImageData(imgBackup, 0,0);
    mosaic(
      ctx, 
      parseInt(e.pageX - cvsLeft - mWidth/2), 
      parseInt(e.pageY - cvsTop - mHeight/2), 
      mWidth, mHeight, mSize);
  }
}




// mosaic(ctx, 90, 20, 300,50,10);


function mosaic(ctx, startX, startY, width, height, mosaicSize) {

  // 读写像素
    function pixelData(imgData, cvswidth, row, col, colorArr) {
        var data = imgData.data;

        var index = cvswidth * 4 * row + col * 4;

        if (colorArr) {
            imgData.data[index] = colorArr[0];
            imgData.data[index + 1] = colorArr[1];
            imgData.data[index + 2] = colorArr[2];
            imgData.data[index + 3] = colorArr[3];
        } else {
            return [imgData.data[index], imgData.data[index + 1], imgData.data[index + 2], imgData.data[index + 3]];
        }
    }

    function _mosaic(ctx, startX, startY, width, height, mosaicSize) {
    var pixs = ctx.getImageData(startX, startY, width, height);

    var gridSize = mosaicSize;
    var gridCol = Math.ceil(width / gridSize);
    var gridRow = Math.ceil(height / gridSize);

    var pixelSum = [0, 0, 0, 0];
    var pixel = [0, 0, 0, 0];
    var pixelNum;
    var col, row;

    for (var i = 0; i < gridRow; i++) {

        for (var j = 0; j < gridCol; j++) {

            pixelNum = 0;
            pixelSum = [0, 0, 0, 0];
            pixel = [0, 0, 0, 0];

            for (var k = 0; k < gridSize; k++) {
                for (var l = 0; l < gridSize; l++) {
                    row = i * gridSize + k;
                    col = j * gridSize + l;

                    if (row < height && col < width) {
                        pixelNum++;
                        pixel = pixelData(pixs, width, row, col); //console.log(pixel);

                        pixelSum = pixelSum.map(function(d, index) {
                            return d + pixel[index]
                        });
                    }
                }
            }
            //console.log(pixelSum);
            pixel = pixelSum.map(function(d, index) {
                return parseInt(d / pixelNum)
            });
            //console.log(pixel);

            for (var k = 0; k < gridSize; k++) {
                for (var l = 0; l < gridSize; l++) {
                    row = i * gridSize + k;
                    col = j * gridSize + l;

                    if (row < height && col < width) {
                        pixelData(pixs, width, row, col, pixel);
                    }
                }
            }

        }

    }
    ctx.putImageData(pixs, startX, startY);

    }

    _mosaic(ctx, startX, startY, width, height, mosaicSize);
    mosaic = _mosaic;
};
