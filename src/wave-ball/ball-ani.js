import * as THREE from 'three';
import { TIME, Time } from './time.js';
// import Stats from './stats.js';
// var stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );

const Vec2 = THREE.Vector2;
const obstruction = 0.01; // 空气阻力
const bigRaduis = 15;
const smallRaduis = 10;

class Ball {
  constructor(options) {
    const defaults = {
      initPosition: new Vec2(),
      radius: 15,
      initV: new Vec2(), // 初始速度
    };

    for (const key in defaults) {
      options[key] = options[key] || defaults[key];
    }
    this.position = options.initPosition.clone();
    this.v = options.initV;
    this.a = new Vec2(); // 加速度

    this.options = options;
  }

  update(delta) {
    const second = delta * 0.001;
    const { options } = this;

    this.v.add(this.a.clone().multiplyScalar(second));

    this.v.sub(this.v.clone().setLength(obstruction * second)); // 阻力减速
    this.position.add(this.v.clone().multiplyScalar(second));
    // console.log(this.position);
  }

  draw(ctx, opacity, blur) {
    const { options } = this;

    opacity = Math.min(opacity, 1);

    ctx.save();

    // ctx.shadowColor = 'red';
    // ctx.shadowBlur = blur;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = 'red';

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
    ctx.fill();

    // 中间透明

    /* if (typeof this.isBreakBall) {
            let grd = ctx.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, options.radius * 0.8);
            grd.addColorStop(0, 'rgba(255,0,255,0.2)');
            grd.addColorStop(1, 'rgba(255,0,255,0)');

            ctx.globalAlpha = (1 - opacity) * 0.5;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
            ctx.fill();
        } */

    ctx.restore();
  }

  die() {
    //
  }
}

class Connection {
  constructor(ball1, ball2) {
    this.maxDis = (ball1.options.radius + ball2.options.radius) * 1.5;

    this.isDie = false;

    this.isSeparate = false;
    this.ball1 = ball1;
    this.ball2 = ball2;
  }

  update() {
    this.isSeparate = this.isSeparate || (new Vec2().subVectors(this.ball1.position, this.ball2.position)).length() > this.ball1.options.radius + this.ball2.options.radius + 10;
    // console.log(this.isSeparate);
  }

  calPoints(c1, r1, c2, r2, v, h, max) {
    const pi2 = Math.PI / 2;
    const c2ToC1 = new Vec2().subVectors(c1, c2);
    const d = c2ToC1.length();
    let u1; let
      u2;

    function getVec2(radians, length) {
      return new Vec2(-Math.cos(radians), -Math.sin(radians)).setLength(length);
    }

    if (r1 == 0 || r2 == 0) return;
    if (d > max || d <= Math.abs(r1 - r2)) {
      return;
    } if (d < r1 + r2) { // case circles are overlapping
      u1 = Math.acos((r1 * r1 + d * d - r2 * r2)
                    / (2 * r1 * d));
      u2 = Math.acos((r2 * r2 + d * d - r1 * r1)
                    / (2 * r2 * d));
    } else {
      u1 = 0;
      u2 = 0;
    }

    const angle1 = c2ToC1.angle();
    const angle2 = Math.acos((r1 - r2) / d);
    const angle1a = angle1 + u1 + (angle2 - u1) * v;
    const angle1b = angle1 - u1 - (angle2 - u1) * v;
    const angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
    const angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
    const p1a = c1.clone().add(getVec2(angle1a, r1));
    const p1b = c1.clone().add(getVec2(angle1b, r1));
    const p2a = c2.clone().add(getVec2(angle2a, r2));
    const p2b = c2.clone().add(getVec2(angle2b, r2));

    // define handle length by the distance between
    // both ends of the curve to draw
    const totalr = (r1 + r2);
    let d2 = Math.min(v * h, new Vec2().subVectors(p1a, p2a).length() / totalr);

    // case circles are overlapping:
    d2 *= Math.min(1, d * 2 / (r1 + r2));

    r1 *= d2;
    r2 *= d2;

    const handle1 = p1a.clone().add(getVec2(angle1a - pi2, r1));
    const handle2 = p2a.clone().add(getVec2(angle2a + pi2, r2));
    const handle3 = p2b.clone().add(getVec2(angle2b - pi2, r2));
    const handle4 = p1b.clone().add(getVec2(angle1b + pi2, r1));
    return [p1a, p2a, p2b, p1b, handle1, handle2, handle3, handle4];
  }

  draw(ctx, opacity, blur) {
    const keyPoints = this.calPoints(
      this.ball1.position.clone(),
      this.ball1.options.radius,
      this.ball2.position.clone(),
      this.ball2.options.radius,
      0.3,
      5.4,
      this.maxDis,
    );

    ctx.save();
    if (keyPoints) {
      // ctx.shadowColor = 'red';
      // ctx.shadowBlur = blur;
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(keyPoints[0].x, keyPoints[0].y);
      ctx.bezierCurveTo(keyPoints[4].x, keyPoints[4].y, keyPoints[5].x, keyPoints[5].y, keyPoints[1].x, keyPoints[1].y);
      ctx.lineTo(keyPoints[2].x, keyPoints[2].y);
      ctx.bezierCurveTo(keyPoints[6].x, keyPoints[6].y, keyPoints[7].x, keyPoints[7].y, keyPoints[3].x, keyPoints[3].y);
      ctx.lineTo(keyPoints[0].x, keyPoints[0].y);

      ctx.fill();
    }
    ctx.restore();
  }

  die() {
    this.isDie = true;
    this.ball1 = null;
    this.ball2 = null;
  }
}

class BreakBall {
  constructor(options) {
    const defaults = {
      maxOpacity: 1,
      blur: 0,

      bornPos: new Vec2(),
      bornA: new Vec2(5, 5), // 出生加速
      bornADur: 1000, // 出生加速耗时

      breakTime: 2000, // 分裂时间
      breakA: 5, // 标量，方向在运行的时候确定
      breakADur: 1000, // 分裂加速耗时
      destoryDur: 1000, // 消亡耗时
    };

    for (const key in defaults) {
      options[key] = options[key] || defaults[key];
    }
    this.options = options;

    // 0 born
    // 1 a done
    // 2 break
    // 3 break a done
    // 4 die
    this.status = 0;

    this.timePass = 0;
    this.separateTime = 0;
    this.opacity = 1;
    this.blur = options.blur;

    this.ball1Radius = bigRaduis * (1.2 - Math.random() * 0.4);
    this.ball2Radius = smallRaduis * (1.2 - Math.random() * 0.4);

    this.ball1 = new Ball({
      initPosition: options.bornPos.clone(),
      radius: this.ball1Radius,
      initV: new Vec2(), // 初始速度
    });
    this.ball1.a = options.bornA;
    this.ball2;
    this.connection;
  }

  update(delta) {
    const { options } = this;
    const second = delta / 1000;
    let opacity = 1;

    this.timePass += delta;

    switch (this.status) {
      case 0:
        if (this.timePass < options.bornADur) {
          opacity = this.timePass / options.bornADur;
        } else {
          this.status = 1;
          this.ball1.a = new Vec2();
        }
        break;
      case 1:
        if (this.timePass >= options.breakTime) {
          this.status = 2;
          this.break(); // 生成 ball2, 设置分裂加速度
        }
        break;
      case 2:
        // console.log(this.ball1.v, this.ball2.v);
        // console.log(this.ball1.v, this.ball2.v);
        // console.log(this.ball1.position, this.ball2.position);
        if (this.timePass >= options.breakTime + options.breakADur) {
          this.status = 3;
          this.ball1.a = new Vec2();
          this.ball2.a = new Vec2();
        }
        break;
      case 3:
        if (!this.separateTime && this.connection.isSeparate) {
          this.separateTime = this.timePass;
        }
        if (this.separateTime) {
          if (this.timePass < this.separateTime + this.options.destoryDur) {
            opacity = 1 - (this.timePass - this.separateTime)
                                    / this.options.destoryDur;
          } else {
            this.status = 4;
            this.die();
          }
        }
        break;
    }

    // console.log(this.status, opacity);
    this.opacity = Math.min(opacity, 1) * this.options.maxOpacity;

    this.ball1 && this.ball1.update(delta);
    this.ball2 && this.ball2.update(delta);
    this.connection && !this.connection.isDie && this.connection.update(delta);
  }

  draw(ctx) {
    this.ball1 && this.ball1.draw(ctx, this.opacity, this.blur);
    this.ball2 && this.ball2.draw(ctx, this.opacity, this.blur);
    this.connection && !this.isDie && this.connection.draw(ctx, this.opacity, this.blur);
  }

  break() {
    this.ball2 = new Ball({
      initPosition: this.ball1.position,
      radius: this.ball2Radius,
      initV: new Vec2(), // 初始速度
    });

    const breakA1 = new Vec2(Math.random(), Math.random());
    breakA1.setLength(this.options.breakA);

    const breakA2 = breakA1.clone().multiplyScalar(-1);

    this.ball1.a = breakA1;// 分裂加速度
    this.ball2.a = breakA2;// 分裂加速度
    this.connection = new Connection(this.ball1, this.ball2);
  }

  die() {
    this.isDie = true;
    this.ball1.die();
    this.ball2.die();
    this.connection.die();
    this.ball1 = null;
    this.ball2 = null;
    this.connection = null;
  }
}

class Ani extends Time {
  constructor() {
    super();

    this.cvs;
    this.width;
    this.height;
    this.offCtx;

    this.tick;
    this.breakBalls = [];

    this.maxBallCount = 6;
  }

  setUp(cvs) {
    this.cvs = cvs;
    this.width = cvs.width;
    this.height = cvs.height;
    this.ctx = this.cvs.getContext('2d');

    this.offCvs = document.createElement('canvas');
    this.offCvs.width = this.width;
    this.offCvs.height = this.height;
    this.offCtx = this.offCvs.getContext('2d');

    const grd = this.offCtx.createLinearGradient(0, 0, this.width, 0);
    for (let i = 0; i <= 10; i++) {
      grd.addColorStop(i / 10, i % 2 === 0 ? '#077cd0' : '#1cb5b9');
    }
    this.offCtx.fillStyle = grd;
    this.offCtx.fillRect(0, 0, this.width, this.height);
  }

  start() {
    this.tick = this.addTick(this.tick);
  }

  stop() {
    this.removeTick(this.tick);
    this.tick = null;
  }

  tick(delta) {
    // stats.update();
    if (this.breakBalls.length < this.maxBallCount) {
      const maxOpacity = Math.random() + 0.8;
      const blur = (Math.random() * 8) | 0;
      const bornPos = new Vec2(
        this.width * 0.1 + Math.random() * this.width * 0.3 + (Math.random() > 0.5 ? this.width * 0.6 : 0),
        Math.random() * this.height * 0.3 + this.height * 0.3,
      );
      const bornA = new Vec2(Math.random() - 0.5, Math.random() - 0.5).setLength(Math.random() * 20);

      const aniTime = Math.random() * 3000 + 5000;
      const bornADur = aniTime * 0.2;
      const breakTime = aniTime * 0.4;
      const breakADur = aniTime * 0.2;
      const breakA = 8 + Math.random() * 6;
      const destoryDur = Math.random() * 300 + 1000;

      this.breakBalls.push(new BreakBall({
        maxOpacity,
        blur,

        bornPos,
        bornA, // 出生加速度
        bornADur, // 出生加速耗时

        breakTime, // 分裂时间
        breakA, // 标量，方向在运行的时候确定
        breakADur, // 分裂加速耗时
        destoryDur, // 消亡耗时
      }));
    }
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.breakBalls.length - 1; i >= 0; i--) {
      if (this.breakBalls[i].isDie) {
        this.breakBalls.splice(i, 1);
      } else {
        this.breakBalls[i].update(delta);
        this.breakBalls[i].draw(this.ctx);
      }
    }

    this.ctx.globalCompositeOperation = 'source-in';
    this.ctx.drawImage(this.offCvs, 0, 0);
    // console.log(balls.length);
    this.ctx.restore();
  }
}

const ani = new Ani();

export { ani };
