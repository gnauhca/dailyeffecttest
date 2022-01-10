/* globals noise */
const cvs = document.querySelector('canvas');
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
function m(step) {
  return (cvs.width / 100) * step;
}

class Strip {
  constructor({
    height, angle, color, waveHeight,
  }) {
    this.height = height;
    this.angle = angle;
    this.color = color;
    this.waveHeight = waveHeight;
    this.scale = Math.random() > 0.99 ? -1 : 1;
    this.steps = 150;
    this.startTime = Math.random() * 10000;
    this.waveFreq = Math.random() + 0.3;
    this.angleSpeed = (Math.random() - 0.5) * 0.01;
  }

  draw(ctx, time) {
    this.angle += this.angleSpeed;
    ctx.scale(1, this.scale);
    ctx.rotate(this.angle);
    ctx.beginPath();
    // ctx.fillStyle = "rgba(100, 100, 100, 0.8)";
    ctx.fillStyle = this.color;
    // ctx.strokeStyle = "red";
    let first = {};
    const pointsT = [];
    for (let i = 0; i < this.steps; i++) {
      const extra = Math.abs(i - this.steps / 2) * 2;
      const add = 0 - (extra / this.steps / 0.5) ** 2 * this.waveHeight;
      let y = -this.height / 2 + add * this.scale;
      const x = i - this.steps / 2;

      y -= noise.perlin3(this.angle / 3.14, extra * 0.02, this.startTime + (time / 2000) * this.waveFreq) * 0.1 * extra;

      pointsT.push({ x, y });
      if (i === 0) {
        first = { x, y };
        ctx.moveTo(m(x), m(y));
      } else if (i === 1) {
        ctx.lineTo(m(x), m(y));
      } else {
        ctx.quadraticCurveTo(
          m(pointsT[pointsT.length - 1].x),
          m(pointsT[pointsT.length - 1].y),
          m(x),

          m(y),
        );
      }
    }
    ctx.lineTo(m(this.steps / 2), m(60));
    ctx.lineTo(m(0 - this.steps / 2), m(60));

    // for (let i = this.steps - 1; i > 0; i--) {
    //   let extra = Math.abs(i - this.steps / 2) * 2;
    //   let add = 0 + Math.pow((extra / this.steps / 0.5), 2) * 30
    //   let y = this.height / 2 + add;
    //   let x = i - this.steps / 2;

    //   y += noise.perlin3(this.angle / 3, i / 10, time / 2000) * extra / this.steps * 4;

    //   pointsB.push({ x, y });
    //   ctx.lineTo(m(x), m(y));
    // }

    // for (let i = 0; i < pointsT.length; i++) {
    //   ctx.fillRect(m(pointsT[i].x), m(pointsT[i].y), 5, 5);
    // }

    // for (let i = 0; i < pointsB.length; i++) {
    //   ctx.fillStyle = "green";
    //   ctx.fillRect(m(pointsB[i].x), m(pointsB[i].y), 5, 5);
    // }

    ctx.lineTo(m(first.x), m(first.y));
    // ctx.stroke();
    ctx.fill();
  }
}

class Ani {
  constructor() {
    this.stripNum = 30;
    this.stripHeight = 4;
    this.strips = [];

    this.cvs = document.querySelector('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.gradient = this.ctx.createRadialGradient(this.cvs.width / 2, this.cvs.height / 2, 0, this.cvs.width / 2, this.cvs.height / 2, this.cvs.width / 2);
    this.gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    this.gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.setup();
  }

  setup() {
    for (let i = 0; i < this.stripNum; i++) {
      const colorSec = (Math.random() * 70 + 10) | 0;
      const color1 = `rgba(${colorSec}, ${colorSec * 1.3}, ${colorSec * 1.6}, ${Math.random() * 0.2})`;
      const color2 = `rgba(${colorSec}, ${colorSec * 1.3}, ${colorSec * 1.6}, 0.1)`;
      const color3 = `rgba(${colorSec}, ${colorSec * 1.3}, ${colorSec * 1.6}, 0)`;

      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.cvs.height / 5);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(Math.random() * 0.5, color2);
      gradient.addColorStop(1, color3);
      this.strips.push(
        new Strip({
          height: this.stripHeight,
          // angle: Math.PI * 2 / this.stripNum * i,
          angle: Math.PI * 2 * Math.random() * 100,
          color: gradient,
          waveHeight: Math.random() * 30,
        }),
      );
    }
  }

  start() {
    let now = new Date().getTime();
    let pre = now;
    let delta = 0;

    const t = () => {
      now = new Date().getTime();
      delta = now - pre;
      pre = now;
      this.tick(delta);
      // this.tick(delta);
      // this.T = setTimeout(t, 100);
      this.T = requestAnimationFrame(t);
    };

    requestAnimationFrame(t);
  }

  tick() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    this.ctx.save();
    this.ctx.translate(this.cvs.width / 2, this.cvs.height / 2);
    this.ctx.globalCompositeOperation = 'lighter';

    this.strips.forEach((strip) => {
      this.ctx.save();
      strip.draw(this.ctx, new Date().getTime());
      this.ctx.restore();
    });

    // this.ctx.beginPath();
    // this.ctx.fillStyle = '#3a4b5b';
    // this.ctx.strokeStyle = 'red';
    // this.ctx.arc(0, 0, m(this.stripHeight / 2), 0, Math.PI * 2);
    // // this.ctx.stroke();
    // this.ctx.fill();

    this.ctx.restore();

    // this.ctx.save();
    // this.ctx.globalCompositeOperation = 'destination-in';
    // this.ctx.fillStyle = this.gradient;
    // this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    // this.ctx.restore();
  }
}

new Ani().start();
