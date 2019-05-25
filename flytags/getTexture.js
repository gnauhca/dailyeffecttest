
const cache = {};

function getTexture(type, num) {
  // if (cache[type + num]) {
  //   return cache[type + num];
  // }

  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  const imgs = document.querySelectorAll(`.${type}-img`);
  const img = imgs[num];

  cvs.width = 1024;
  cvs.height = 1024;
  cvs.realWidth = 5 * img.width / img.height;
  cvs.realHeight = 5;

  cache[type + num] = cvs;
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1024, 1024);
  // document.body.appendChild(cvs);


  // img.realWidth = 5 * img.width / img.height;
  // img.realHeight = 5;

  // img.width = 1024;
  // img.height = 1024;
  
  const texture = new THREE.TextureLoader().load(img.src);
  texture.realWidth = 10 * img.width / img.height;
  texture.realHeight = 12;
  cache[type + texture];
  return texture;
}


function createImg(options) {
  const { type, text, height: optionHeight, color } = options;
  const scale = 3;
  const height = optionHeight * scale;
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  const padding = type === 'text' ? [height / 2, height / 2] : [height / 4, 0];
  const fontSize = Math.abs(height - padding[1]);
  const globalCompositeOperation = type === 'text' ? 'source-atop' : 'destination-in';


  let heightD2 = parseInt(height / 2);

  cvs.width = 1000;
  cvs.height = 100;
  // ctx.font = fontSize | 0 + 'px ' + 'microsoft yahei';
  ctx.font = fontSize + 'px PingFang SC';
  let width = ctx.measureText(text).width;
  width += padding[0] * 2;
  let widthD2 = parseInt(width / 2);

  cvs.realWidth = width;
  cvs.realHeight = height;
  // cvs.width = width;

  ctx.fillStyle = color;

  ctx.fillRect(heightD2, 0, width - height, height);
  ctx.arc(heightD2, heightD2, heightD2, 0, Math.PI * 2);
  ctx.arc(width - heightD2, heightD2, heightD2, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = globalCompositeOperation;
  ctx.fillStyle = '#fff';

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, widthD2, heightD2);

  const cvs2 = document.createElement('canvas');
  const ctx2 = cvs2.getContext('2d');

  cvs2.width = 1024;
  cvs2.height = 1024;
  cvs2.realWidth = width / scale;
  cvs2.realHeight = height / scale;
  ctx2.drawImage(cvs, 0, 0, width, height, 0, 0, 1024, 1024);
  // document.body.appendChild(cvs2);
  return cvs2;
}