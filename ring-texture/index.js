import { getRing, Ani } from './ring-ani.js';

let a = 0;
setTimeout(() => {
  a = 1;
}, 2000);
window.onload = function () {
  const canvas1 = document.querySelector('#canvas1');
  const control1 = document.querySelector('#control1');

  const anis = [];

  const ringRed1 = getRing('red');
  const ringBlue1 = getRing('blue');

  ringRed1.position.x = -55;
  ringRed1.position.y = 0;
  ringRed1.position.z = 0;
  ringRed1.rotation.x = Math.PI;
  ringRed1.rotation.y = 0;

  ringBlue1.position.x = 55;
  ringBlue1.position.y = 0;
  ringBlue1.position.z = 0;
  ringBlue1.rotation.x = Math.PI / -2;
  ringBlue1.rotation.y = 0;

  const ani1 = new Ani({
    canvas: canvas1,
    tick(delta) {
      if (!a) return;
      ringRed1.rotation.z -= delta * 0.001;
      ringBlue1.material.map.offset.y -= 0.006;
    },
    controlElement: control1,
  });

  ani1.group.rotation.x = 0.75;
  ani1.group.rotation.y = 0.5;
  ani1.group.rotation.z = -0.3;

  ani1.addObj(ringRed1);
  ani1.addObj(ringBlue1);

  anis.push({
    canvas: canvas1,
    ani: ani1,
  });

  const ringBlue2 = getRing('blue');

  ringBlue2.position.x = 0;
  ringBlue2.position.y = 0;
  ringBlue2.rotation.x = 1.95 + Math.PI;
  ringBlue2.rotation.y = 0.15;

  function checkVisible(elm) {
    const rect = elm.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom <= 0 || rect.top - viewHeight >= 0);
  }

  function checkPosition() {
    anis.forEach((aniItem, index) => {
      if (checkVisible(aniItem.canvas)) {
        aniItem.ani.start();
        console.log(index, 'start');
      } else {
        aniItem.ani.pause();
        console.log(index, 'pause');
      }
    });
  }

  window.addEventListener('scroll', checkPosition);
  window.addEventListener('resize', checkPosition);
  checkPosition();
};
