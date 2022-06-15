/* eslint-disable */
function Particle(x, y, color) {
  this.finished = false;
  this.color = color;
  this.des = { x: x, y: y };
  this.init = { x: 0, y: 0 };
  this.offset = { x: 0, y: 0 };
  this.current = { x: 0, y: 0 };
  this.prev = { x: 0, y: 0 };

  this.started = false;
  this.percent = 0;
  this.timePass = 0;
  this.dur = 2000 + Math.random() * 4000;

  this.easing = function(t, b, c, d) {
  if ((t/=d/2) < 1) return c/2*t*t*t + b;
  return c/2*((t-=2)*t*t + 2) + b;
  };
}

Particle.prototype = {
  update: function(delta) {
      if (!this.started && !this.finished) return;
      this.timePass += delta;

      this.percent = this.easing(this.timePass, 0, 1, this.dur);
      this.prev = this.current;
      this.current = {
          x: this.init.x + this.offset.x * this.percent,
          y: this.init.y + this.offset.y * this.percent
      };
      
      if (this.percent >= 1) {
          this.percent = 1;
          this.finished = true;
          this.current.x = this.des.x;
          this.current.y = this.des.y;
      }
  },
  getCrood: function() {
      return this.current;
  },
  start: function(startX, startY) {
      var width = window.innerWidth * 5;
      var height = window.innerHeight * 5;
      var angle = Math.PI * 2 * Math.random();
      var radius = Math.sqrt(width*width + height*height)/2;
      
      startX = startX || (Math.cos(angle) * radius) + window.innerWidth/2;
      startY = startY || (Math.sin(angle) * radius) + window.innerHeight/2;
      
      this.started = true;
      this.timePass = 0;
      this.finished = false;
      this.init = {x: startX, y: startY};
      // this.init = { x: this.des.x, y: this.des.y + 400 };
      // this.init = {x: startX, y: startY};
      this.current = this.prev = this.init;
      this.offset = { x: this.des.x - this.init.x, y: this.des.y - this.init.y }
  },
  reset: function(x, y) {
      this.timePass = 0;
      // this.started = false;
      this.finished = false;
      this.percent = 0;
      this.timePass = 0;
      this.dur = 1000 + Math.random() * 2000;
      //this.des = {x: x, y: y}
      this.current = this.prev = this.init;
      this.offset = { x: this.des.x - this.init.x, y: this.des.y - this.init.y }
  }
}


function Ani() {
  this.particles = [];
  this.wrap = document.querySelector('body');
  this.cvs;
  this.ctx;
  this.offlineCtx;
  this.offlineCvs;
  this.background = '#000000';
  this.img;
  this.imgPos;

  this.mouse = { x: 0, y: 0 };
  this.screen = { width: window.innerWidth, height: window.innerHeight };
  this.T;
  this.init();
}

Ani.prototype = {
  init: function() {
      var that = this;
      var img = new Image();
      this.img = document.querySelector('.logo');

      img.src = document.querySelector('.logo').src;
      img.onload = function() {
          that.create();
          that.wrap.addEventListener('mousemove', that.mouseHandle());
          that.tick();
      }
      window.addEventListener('resize', this.resize())
  },

  mouseHandle: function() {
      var that = this;

      function mouseHandle(e) {
          that.mouse.x = e.offsetX;
          that.mouse.y = e.offsetY;
      }
      that.mouseHandle = mouseHandle;
      return mouseHandle;
  },

  resize: function() {
      var that = this;

      function resize() {
          that.screen = { width: window.innerWidth, height: window.innerHeight };
          that.cvs.width = that.screen.width;
          that.cvs.height = that.screen.height;
          that.offlineCvs.width = that.screen.width;
          that.offlineCvs.height = that.screen.height;

          var lastImgPos = that.imgPos;
          that.imgPos = that.img.getBoundingClientRect();
          that.imgPos = { top: that.img.offsetTop, left: that.img.getBoundingClientRect().left };

          var imgPosOffset = {
              left: that.imgPos.left - lastImgPos.left,
              top: that.imgPos.top - lastImgPos.top
          };

          that.particles.forEach(function(particle) {
              particle.des.x += imgPosOffset.left;
              particle.des.y += imgPosOffset.top;
          });
      }
      this.resize = resize;
      return resize;
  },

  create: function() {
      var imgPos = { top: this.img.offsetTop, left: this.img.getBoundingClientRect().left };

      this.imgPos = imgPos;

      // this.cvs = document.createElement('canvas');
      //this.wrap.app//endChild(this.cvs);
      this.cvs = this.wrap.querySelector('canvas');
      this.offlineCvs = document.createElement('canvas');
      this.resize();
      this.ctx = this.cvs.getContext('2d');
      this.offlineCtx = this.offlineCvs.getContext('2d');


      // 从canvas 读取颜色信息，创建粒子
      var imgData = [];
      var imgCvs = document.createElement('canvas');
      imgCvs.width = this.img.width;
      imgCvs.height = this.img.height;
      var imgCtx = imgCvs.getContext('2d');
      imgCtx.drawImage(this.img, 0, 0);
      var pixs = imgCtx.getImageData(0, 0, this.img.width, this.img.height).data;

      for (var i = 0; i < pixs.length; i += 4) {
          var r = pixs[i],
              g = pixs[i + 1],
              b = pixs[i + 2],
              a = pixs[i + 3];

          if (a > 0) {
              var x = (i % (4 * this.img.width)) / 4;
              var y = parseInt(i / (4 * this.img.width));

              this.particles.push(new Particle(imgPos.left + x, imgPos.top + y, 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'));
              // this.particles.push(new Particle(imgPos.left + x, imgPos.top + y, `rgba(${255*Math.random() | 0}, ${255*Math.random() | 0}, ${255*Math.random() | 0})`));
          }
      }
  },

  tick: function() {
      var that = this;

      var start = 3;
      var startCount = 0;

      var now = (new Date()).getTime();
      var last = now;
      var delta;
      var reset = false;

      function _tick() {
          now = (new Date()).getTime();
          delta = now - last;
          delta = delta > 50 ? 16 : delta;
          that.cvs.innerHTML = delta;
          last = now;
          startCount = 0;

          if (!that.particles.length) { that.finish();
              return; }
          that.particles.forEach(function(particle) {
              if (!particle.started && startCount < start && Math.random() > 0.1) {
                  startCount++;
                  particle.start(/* that.mouse.x, that.mouse.y */); // no mouse ...
              } else {
                  particle.update(delta);
              }
          });

          that.draw();
          if (!reset && that.particles.every(function(particle) {
                  return particle.finished })) { 
              //that.finish();
              var tmp;
              
              reset = true;
              setTimeout(function() {
                  reset = false;
                  that.particles.forEach(function(particle) {
                      tmp = particle.des;
                      particle.des = particle.init;
                      particle.init = tmp;
                      particle.reset();
                  });                    
              }, 1000);

              //return; 
          }
          window.requestAnimationFrame(_tick);
      }

      _tick();
  },

  draw: function() {
      var particle;
      var color = this.particles[3].color;
      var r = 1;

      //this.offlineCtx.globalAlpha = 0.5;
      this.offlineCtx.save();
      this.offlineCtx.globalCompositeOperation = 'destination-in';
      this.offlineCtx.globalAlpha = 0.8;
      this.offlineCtx.strokeStyle = this.offlineCtx.fillStyle = '#ffffff';
      this.offlineCtx.fillRect(0, 0, this.screen.width, this.screen.height);
      this.offlineCtx.restore();

      this.offlineCtx.save();
      // this.offlineCtx.globalCompositeOperation = 'lighter';
      this.offlineCtx.beginPath();
      // this.offlineCtx.strokeStyle = this.offlineCtx.fillStyle = '#00c3f5';
      this.offlineCtx.lineWidth = r;
      this.offlineCtx.lineCap = this.offlineCtx.lineJoin = 'round';
      for (var i = 0; i < this.particles.length; i++) {
          particle = this.particles[i];
          // r = 5 * (1.3-particle.percent);
          this.offlineCtx.beginPath();
          this.offlineCtx.lineWidth = r;
          this.offlineCtx.moveTo(particle.current.x, particle.current.y);
          this.offlineCtx.lineTo(particle.prev.x, particle.prev.y);
          this.offlineCtx.strokeStyle = particle.color;
      this.offlineCtx.stroke();
          // console.log(particle.color);
      }
      // this.offlineCtx.stroke();

      // this.offlineCtx.beginPath();
//         for (var i = 0; i < this.particles.length; i++) {
//             particle = this.particles[i];
//             if (particle.started) {
//                 var pCrood = particle.getCrood();
//                 r = 1;
//                 // r = 5 * (1.3-particle.percent);
//                 //console.log(~~pCrood.x, ~~pCrood.y);
//                 this.offlineCtx.beginPath();
//                 this.offlineCtx.fillStyle = particle.color;
//                 this.offlineCtx.fillRect(pCrood.x-r/2, pCrood.y-r/2, r, r);
              
//                 //this.offlineCtx.moveTo(pCrood.x, pCrood.y);
//                 //this.offlineCtx.arc(pCrood.x, pCrood.y, r, 0, Math.PI * 2, false);
//             }
//         }
      //this.offlineCtx.fill();
      this.offlineCtx.restore();

      this.ctx.fillStyle = this.background;
      this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);

      this.ctx.drawImage(this.offlineCvs, 0, 0);
  },

  finish: function() {
      this.wrap.removeEventListener('mousemove', this.mouseHandle);
      window.removeEventListener('resize', this.resize);
      window.cancelAnimationFrame(this.T);
  }

}


new Ani
