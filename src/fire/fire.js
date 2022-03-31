class Particle {
  constructor({ pos, v, radius }) {
    this.pos = pos || new Vector2();
    this.v = v;
    this.radius = radius;
  }

  draw(ctx, step) {
    // ctx.beginPath();
    // ctx.arc(
    //   this.pos.x * step - this.radius * step / 2,
    //   this.pos.y * step - this.radius * step / 2,
    //   this.radius * step,
    //   0,
    //   Math.PI * 2
    // );
    // ctx.stroke();
    // ctx.fill();

    ctx.fillRect(
      this.pos.x * step - this.radius * step / 2,
      this.pos.y * step - this.radius * step / 2,
      this.radius * step,
      this.radius * step,
    );
  }
}

class Ani {
  constructor() {
    this.T = 0;
    this.step = 1;

    // for face particle
    this.radiusDecaySpeed = 5; // radius / s
    this.lift = 1;

    this.max = 1000;
    this.speed = 3;
    this.radius = 4.5;
    this.color = 'rgba(255, 30, 218, 0.1)';
    this.color = 'rgba(30, 144, 255, 0.1)';
    this.color = 'rgba(255, 75, 36, 0.06)';
    this.particles = [];

    this.minSpeed = this.speed * 0.8;
    this.maxSpeed = this.speed * 1.2;
    this.maxMinSpeedSub = this.maxSpeed - this.minSpeed;

    this.minRadius = this.radius * 0.8;
    this.maxRadius = this.radius * 1.2;
    this.maxMinRadiusSub = this.maxRadius - this.minRadius;

    this.faceRadius = 6;

    // for eyes
    this.eyeBlinkAt = new Date().getTime();
    this.eyeBlinkDur = 200;
    this.eyeBlinkWait = 5000;

    this.cvs = document.querySelector('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.resize();
    window.onresize = () => { this.resize(); };
  }

  resize() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.cvs.height = height;
    this.cvs.width = width;
    this.step = Math.max(height, width) / 100;
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
      // this.T = setTimeout(t, 100);
      this.T = requestAnimationFrame(t);
    };

    requestAnimationFrame(t);
  }

  tick(delta) {
    const second = delta / 1000;
    if (this.particles.length < this.max) {
      for (let i = 0; i < 20; i++) {
        const speed = this.minSpeed + Math.random() * this.maxMinSpeedSub;
        const angle = Math.PI * Math.random() * 2;
        const v = (new Vector2(Math.cos(angle), Math.sin(angle))).setLength(speed);

        const radius = this.minRadius + Math.random() * this.maxMinRadiusSub;

        const faceAngle = Math.PI * 2 * Math.random();
        this.particles.push(
          new Particle({
            pos: new Vector2(
              // Math.cos(faceAngle) * this.faceRadius * Math.random(),
              // Math.sin(faceAngle) * this.faceRadius *
              (Math.random() - 0.5) * this.faceRadius,
              (Math.random() - 0.5) * this.faceRadius,
            ),
            v,
            radius,
          }),
        );
      }
    }

    this.ctx.translate(0, 0);
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    this.ctx.save();
    this.ctx.translate(this.cvs.width / 2, this.cvs.height / 2);

    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.fillStyle = this.color;
    // console.log(this.color)

    // this.ctx.fillRect(0,0, 100, 100);

    const time = new Date().getTime();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const liftEnd = particle.pos.clone();
      liftEnd.x *= 0;
      liftEnd.y -= 10;
      const liftV = liftEnd.sub(particle.pos);

      liftV.setLength(this.lift);

      particle.v.add(liftV);
      particle.radius -= this.radiusDecaySpeed * second;
      this.ctx.globalAlpha = particle.radius / this.maxRadius;

      particle.pos.add(particle.v.clone().multiplyScalar(second));
      particle.pos.x += noise.perlin2(particle.pos.y * 2, time / 100) * Math.min(particle.pos.y / -3, 1);

      // if (particle.radius < 0) {
      particle.radius = ((20 - particle.pos.length()) / 20) * this.maxRadius;

      if (particle.pos.length() > 20) {
        this.particles.splice(i, 1);
      } else {
        // this.ctx.globalCompositeOperation = Math.random() > 0.2 ? 'lighter' : 'source-over';

        particle.draw(this.ctx, this.step);
      }
    }

    this.ctx.fillStyle = '#FF4D2E';
    this.ctx.fillStyle = '#0066C7';
    this.ctx.fillStyle = '#f00';

    // this.ctx.fillStyle = '#fff';
    this.ctx.globalAlpha = 0.6;
    this.ctx.globalCompositeOperation = 'source-over';
    const eyeXAdd = noise.perlin2(0.5, time / 500) * 0.4;
    const eyeYAdd = noise.perlin2(0.5, 10 + time / 500) * 0.4;

    const eyeX1 = (1 + eyeXAdd) * this.step;
    const eyeX2 = (-1 + eyeXAdd) * this.step;
    let eyeY = (0 + eyeYAdd) * this.step;
    const eyeWidth = 0.6 * this.step;
    let eyeScale = 1;

    if (time - this.eyeBlinkAt < this.eyeBlinkDur) {
      eyeScale = 0.2;
      eyeY += 0.4 * this.step;
    } else if (time - this.eyeBlinkAt > this.eyeBlinkWait) {
      this.eyeBlinkAt = time;
    }

    this.ctx.fillRect(eyeX1 - eyeWidth / 2, eyeY - eyeWidth / 2, eyeWidth, eyeWidth * eyeScale);
    this.ctx.fillRect(eyeX2 - eyeWidth / 2, eyeY - eyeWidth / 2, eyeWidth, eyeWidth * eyeScale);

    this.ctx.restore();
  }
}

new Ani().start();
