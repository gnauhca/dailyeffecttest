import domHelper from './lib/domHelper';

const TWEEN = require('@tweenjs/tween.js');
const C3 = require('./src/main.js');

const stats = new Stats();
// document.body.appendChild(stats.dom);

const renderer = new C3.Renderer({
  lightEffect: true
});

const containerElem = document.querySelector('.container');

const camera = new C3.Camera(1500);

camera.setPerspective(1500);

const scene = new C3.Scene(containerElem);

let directionLight = new C3.DirectionLight(new C3.Vector3(0, 0, 1), 1);
scene.addLight(directionLight);

const items = document.querySelectorAll('.item');
const cylinder = new C3.Group();
const faces = [];

for (let i = 0; i < items.length; i++) {

  const item = items[i];
  const face = new C3.Face(item);

  face.backside = true;
  face.frontElem = face.elem.querySelector('.item-front');
  face.frontInnerElem = face.elem.querySelector('.item-front-inner');
  face.backElem = face.elem.querySelector('.item-back');
  face.backInnerElem = face.elem.querySelector('.item-back-inner');

  face.lightHandler = function (elem, brightness) {
    let percent = Math.max(brightness, 0.5).toFixed(2);
    const blur = (1 - percent) * 4 + 'px';
    face.frontInnerElem.style.opacity = 0.3 + percent * 0.7;
    face.backInnerElem.style.opacity = 0.3 + percent * 0.7;
    face.frontInnerElem.style.filter = `blur(${blur})`;
    face.backInnerElem.style.filter = `blur(${blur})`;
  };
  cylinder.add(face);
  faces.push(face);
}

scene.add(cylinder);

function resize() {
  const containerWidth = containerElem.offsetWidth;
  const containerHeight = containerWidth * 4 / 3;
  const itemWidth = containerWidth * 60 / 93;
  const itemHeight = itemWidth * 4 / 3;

  const radius = itemWidth * 0.95;

  containerElem.style.height = containerHeight + 'px';

  camera.setPosition(0, 0, radius);
  camera.setNeedUpdate();
  faces.forEach(face => {
    face.elem.style.width = parseInt(itemWidth) + 'px';
    face.elem.style.height = parseInt(itemHeight) + 'px'
  });

  for (let i = 0; i < items.length; i++) {
    const face = faces[i];
    const angle = Math.PI * 2 * (i / items.length);
    const posAngle = angle + Math.PI / 2;

    face.initialZ = Math.sin(posAngle) * radius;
    face.initialX = Math.cos(posAngle) * radius;
    face.initialRotateY = -angle;
    face.setRotationY(-angle);
    face.setPosition(Math.cos(posAngle) * radius, 0, Math.sin(posAngle) * radius);
  }
  renderer.render(scene, camera);
  scene.resize();
}

// tick();

class Ani {
  constructor() {
    this.index = 0;
    this.stepDur = 1000;
    this.spinDur = 1000;
    this.rotateTween = null;
    this.spinTween = null;
    this.tickT;
    this.tick();
    resize();
    window.addEventListener('resize', resize);
  }

  setIndex(i) {
    if (this.rotateTween) {
      TWEEN.remove(this.rotateTween);
    }
    const indexDiff = Math.abs(this.index - i);

    if (indexDiff === 0) {
      return;
    }

    const currRotate = cylinder.rotation.y;
    const finalRotate = i * Math.PI / 3;
    const tweenObj = {
      rotate: currRotate
    };
    const dur = Math.min(3000, this.stepDur * indexDiff);
    const tween = new TWEEN.Tween(tweenObj)
      .to({ rotate: finalRotate }, dur)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        cylinder.setRotationY(obj.rotate);
        cylinder.setNeedUpdate();
      })
      .onComplete(() => {
        this.rotateTween = null;
      })
      .start();

    this.index = i;
    this.rotateTween = tween;
    this.tick();
  }

  spin() {
    if (this.spinTween) {
      TWEEN.remove(this.spinTween);
    }
    const index = this.index;
    // const initRotate = faces[index].initialRotateY;
    const initRotate = faces[index].rotation.y;
    const finalRotate = initRotate + Math.PI;
    const tweenObj = {
      rotate: initRotate,
      scale: 1
    };
    const tween = new TWEEN.Tween(tweenObj)
      .to({ rotate: finalRotate, scale: 1.2 }, this.spinDur)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        console.log(obj);
        faces[index].setRotationY(
          obj.rotate
        );
        faces[index].setScale(
          obj.scale, obj.scale, obj.scale
        );
      })
      .onComplete(() => {
        this.spinTween = null;
      })
      .start();

    this.spinTween = tween;
    this.tick();
  }

  tick() {
    cancelAnimationFrame(this.tickT);

    let last = new Date().getTime();
    let now = new Date().getTime();
    let delta;
    const _tick = () => {
      now = new Date().getTime();
      delta = now - last;
      last = now;
      stats.update(delta);
      TWEEN.update();
      // console.log(delta);
      renderer.render(scene, camera);
      if (this.rotateTween || this.spinTween) {
        this.tickT = window.requestAnimationFrame(_tick);
      }
    }

    this.tickT = window.requestAnimationFrame(_tick);
  }
};

const ani = new Ani;

window.ani = ani;
// ani.setIndex(2);
