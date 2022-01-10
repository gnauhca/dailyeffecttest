// import Stats from 'stats.js';

// const TWEEN = require('@tweenjs/tween.js');
// const stats = new Stats();

// document.body.appendChild(stats.dom);

class CvsScene {
  constructor(width, height) {
    this.tickT = 0;
    this.objs = [];
    this.setup(width, height);
  }

  setup(width = 1000, height = 500) {
    this.cvs = document.createElement('canvas');
    this.cvs.width = width;
    this.cvs.height = height;
    this.width = this.cvs.width;
    this.height = this.cvs.height;
    this.ctx = this.cvs.getContext('2d');

    this.renderer = {
      cvs: this.cvs, ctx: this.ctx,
    };
    document.body.appendChild(this.cvs);
  }

  update() {
    this.objs.forEach((obj) => {
      obj.update(this);
      this.renderer.ctx.save();
      obj.draw(this.renderer);
      this.renderer.ctx.restore();
    });
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
    };

    this.tickT = window.requestAnimationFrame(_tick);
  }

  add(obj) {
    if (this.objs.indexOf(obj) === -1) {
      this.objs.push(obj);
    }
  }

  start() {
    this.tick();
  }

  stop() {
    cancelAnimationFrame(this.tickT);
  }
}
