import Stats from 'stats.js';

const TWEEN = require('@tweenjs/tween.js');
const stats = new Stats();

document.body.appendChild(stats.dom);

class Scene {
  constructor() {
    this.tickT = 0;
  }

  setup() {
    this.cvs = document.createElement('canvas');
    this.cvs.width = 1000;
    this.cvs.height = 500;
    this.width = this.cvs.width;
    this.height = this.cvs.height;
    this.ctx = this.cvs.getContext('2d');
    document.body.appendChild(this.cvs);
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
      this.update && this.update();
      this.draw && this.draw();
    }

    this.tickT = window.requestAnimationFrame(_tick);
  }

  start() {
    this.tick();
  }

  stop() {
    cancelAnimationFrame(this.tickT);
  }
}

export default Scene;