
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
