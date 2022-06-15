/* eslint-disable */
var extend = (function () {
  let copyIsArray;
  const { toString } = Object.prototype;
  const hasOwn = Object.prototype.hasOwnProperty;

  class2type = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Object]': 'object',
  },

  type = function (obj) {
    return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
  },

  isWindow = function (obj) {
    return obj && typeof obj === 'object' && 'setInterval' in obj;
  },

  isArray = Array.isArray || function (obj) {
    return type(obj) === 'array';
  },

  isPlainObject = function (obj) {
    if (!obj || type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
      return false;
    }

    if (obj.constructor && !hasOwn.call(obj, 'constructor')
              && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }

    let key;
    for (key in obj) {
    }

    return key === undefined || hasOwn.call(obj, key);
  },

  extend = function (deep, target, options) {
    for (name in options) {
      src = target[name];
      copy = options[name];

      if (target === copy) { continue; }

      if (deep && copy
                  && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
        if (copyIsArray) {
          copyIsArray = false;
          clone = src && isArray(src) ? src : [];
        } else {
          clone = src && isPlainObject(src) ? src : {};
        }

        target[name] = extend(deep, clone, copy);
      } else if (copy !== undefined) {
        target[name] = copy;
      }
    }

    return target;
  };

  return extend;
}());

/*
* class extend 继承
*/
(function (global) {
  // Helper method for creating an super copied object clone
  function initialize(method) {
    // Recursivly execute parent methods.
    if (method.parent instanceof Function) {
      initialize.apply(this, [method.parent]);
      this.super = cloneCopy(
        this,
        superCopy(this, this.constructor),
      );
    }
    method.apply(this, arguments);
  }
  // Helper method which allows for super referances.
  function cloneCopy(from, to) {
    for (const x in from) {
      if (
        x !== 'super' // Never clone the super referance
  && from[x] instanceof Function // Only overwrite functions
  && !(from[x].prototype instanceof Class) // Never overwrite referances to classes
      ) {
        // Never create circular super referances.
        to[x] = from[x].super || superCopy(from, from[x]);
      }
    }
    return to;
  }
  function superCopy(scope, method) {
    const scopeSuper = scope.super;
    return method.super = function () {
      scope.super = scopeSuper;
      return method.apply(scope, arguments);
    };
    return method;
  }
  // Create Class object
  global.Class = function () {};
  global.Class.extend = function ext(to) {
    function child() {
      // Prevent the prototype scope set executing the constructor.
      if (initialize !== arguments[0]) {
        // Create inhereted object
        initialize.apply(this, [to]);
        // Setup scope for class instance method calls
        cloneCopy(this, this);
        this.constructor.apply(this, arguments);
        if (this.initializer instanceof Function) { this.initializer.apply(this); }
      }
    }
    // Set prototype and constructor enabeling propper type checking.
    child.prototype = new this(initialize);
    child.prototype.constructor = child;
    // Return expected result from toString
    child.toString = function () {
      return to.toString();
    };
    // Allow the child to be extended.
    child.extend = function (target) {
      // Create parent referance and inherentence path.
      target.parent = to;
      return ext.apply(child, arguments);
    };

    return child;
  };
  // Bootstrap Class by inheriting itself with empty constructor.
  global.Class = global.Class.extend(function () {
    this.constructor = function () {};
  });
}(this));
/*
* 计算切点
*/
function getTangentPoint(circleCentrePoint, radius, outPoint) {
  const dx = circleCentrePoint.x - outPoint.x;
  const dy = circleCentrePoint.y - outPoint.y;
  const r1 = Math.atan2(dy, dx);
  const d1 = Math.sqrt(dx * dx + dy * dy);
  const r2 = Math.asin(radius / d1);
  const r3 = r1 - r2;
  const r4 = r3 - Math.PI / 2;
  const x1 = radius * Math.cos(r4);
  const y1 = radius * Math.sin(r4);
  const r5 = Math.PI / 2 - r1 - r2;
  const r6 = -r5;
  const x2 = radius * Math.cos(r6);
  const y2 = radius * Math.sin(r6);
  return ({
    point1: { x: circleCentrePoint.x + x1, y: circleCentrePoint.y + y1 },
    point2: { x: circleCentrePoint.x - x2, y: circleCentrePoint.y - y2 },
  });
}
const cvs = document.querySelectorAll('canvas')[0];
const cvsWidth = document.body.clientWidth || document.documentElement.clientWidth;
const cvsHeight = document.body.clientHeight || document.documentElement.clientHeight;
console.log(cvsWidth, cvsHeight);
cvs.width = cvsWidth;
cvs.height = cvsHeight;
const ctx = cvs.getContext('2d');
const mcvs = document.createElement('canvas');
mcvs.width = cvsWidth;
mcvs.height = cvsHeight;
const mctx = mcvs.getContext('2d');
/*
* 时间对象
*/
time = {
  mctx: ctx,
  mcvs,
  ctx: mctx,
  last: (new Date()).getTime(),
  ani: 1,
  timeBodys: [],
  add(timeBody) {
    time.timeBodys.push(timeBody);
  },
  remove(timeBody) {
    const index = time.timeBodys.indexOf(timeBody); // console.log(index);
    if (index !== -1) time.timeBodys.splice(index, 1);
  },
  clock() {
    const now = (new Date()).getTime();
    detal = (now - time.last) / 1000; // frameInfo.innerHTML = parseInt(1000/(now - time.last));
    time.last = now;
    time.ctx.clearRect(0, 0, cvs.width, cvs.height);
    time.mctx.clearRect(0, 0, cvs.width, cvs.height);
    time.timeBodys.forEach((timeBody) => {
      time.ctx.save();
      timeBody.clock(detal);
      time.ctx.restore();
    });
    time.mctx.drawImage(mcvs, 0, 0);
    time.ani = window.requestAnimationFrame(time.clock);
  },
};
time.clock();
// 离屏canvas 池
var offCvsPool = {
  offCvses: [],
  getCvs() {
    let cvs;
    if (offCvsPool.offCvses.length) {
      cvs = offCvsPool.offCvses.pop();
    }
    cvs = document.createElement('canvas');
    cvs.width = cvs.height = 0;
    return cvs;
  },
  removeCvs(cvs) {
    offCvsPool.offCvses.push(cvs);
  },
};
const AniTask = Class.extend(function () {
  this.constructor = function (time) {
    this.time = time;
    this.offCvs = offCvsPool.getCvs();
  };
  this.setNext = function (task) {
    this.nextTask = task;
  };
  this.next = function () {
    if (this.nextTask) { this.nextTask.start(); }
  };
  this.clock = function (detal) {};
  this.start = function () {
    this.time.add(this);
  };
  this.finish = function () {
    const that = this;
    setTimeout(() => {
      offCvsPool.removeCvs(that.offCvs);
      that.time.remove(that);
    }, 0);
  };
});
const AniLine = AniTask.extend(function () {
  const defaults = {
    lineWeight: 6,
    weightDecay: 0.06,
    initAlpha: 0,
    finalAlpha: 0.3,
    startPos: { x: 0, y: 0 },
    endPos: { x: 0, y: 0 },
    initColor: 'rgba(255,0,0)',
    finalColor: 'rgba(255,0,0)',
    initV: 20,
    finalV: 20,
  };
  this.options;
  this.constructor = function (time, options) {
    this.super(time);
    this.options = extend({}, defaults, options);
    this.dx = this.options.endPos.x - this.options.startPos.x;
    this.dy = this.options.endPos.y - this.options.startPos.y;
    this.disPass = 0;// 走过的距离
    this.totalDis = Math.sqrt(this.dx * this.dx + this.dy * this.dy);// 总距离
    this.angle = Math.atan2(this.dy, this.dx); // 轨迹角度
    this.options = extend({}, defaults, options);
    this.lineWidth = parseInt(this.options.lineWeight / this.options.weightDecay) - 1;
    this.currentAlpha;
    this.currentColor;
    this.currentV = this.options.initV;
    this.arrived = false;
  };
  this.clock = function (detal) {
    let progress;
    const that = this;
    this.disPass += this.currentV * detal;

    progress = this.disPass / this.totalDis;
    progress = progress < 1 ? progress : 1;
    this.currentAlpha = this.options.initAlpha + (this.options.finalAlpha - this.options.initAlpha) * progress;
    this.currentV = this.options.initV + (this.options.finalV - this.options.initV) * progress;
    this.currentColor = this.options.initColor.replace(/(\d+)\s*\,\s*(\d+)\s*\,\s*(\d+)/g, function () {
      const finalColor = that.options.finalColor.match(/\d+/g).map((c) => parseInt(c));
      let color = [];
      for (let i = 0; i < 3; i++) {
        color.push(parseInt(arguments[i + 1]) + (finalColor[i] - parseInt(arguments[i + 1])) * progress);
      }
      color = color.map((v) => parseInt(v));
      color.push('$');
      return color.join(',');
    });
    this.draw();
    if (!this.arrived && this.disPass >= this.totalDis) {
      // arriveCallback 此处可能会改变速度
      this.next();
      this.arrived = true;
    }
    if (this.disPass - this.lineWidth >= this.totalDis) {
      // 停止动画 finishCallback
      this.finish(); // extend from AniStuff
    }
  };
  this.draw = function () {
    let drawing = this.disPass;
    let { lineWeight } = this.options;
    const opacityDecay = 1 / this.lineWidth;
    let ratio = drawing / this.totalDis;
    let drawX = this.options.startPos.x + this.dx * ratio;
    drawY = this.options.startPos.y + this.dy * ratio;
    // draw light
    if (!this.arrived) {
      this.time.ctx.globalAlpha = this.currentAlpha;
      const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, 100);
      grd.addColorStop(0, this.currentColor.replace('$', 0.6));
      grd.addColorStop(1, this.currentColor.replace('$', 0));
      this.time.ctx.fillStyle = grd;
      this.time.ctx.beginPath();
      this.time.ctx.arc(drawX, drawY, 100, 0, Math.PI * 2);
      this.time.ctx.fill();
    }
    this.time.ctx.globalAlpha = this.currentAlpha;
    for (let i = 0; i < this.lineWidth; i++) {
      drawing--;
      lineWeight -= this.options.weightDecay;
      if (drawing >= this.totalDis) continue;
      ratio = drawing / this.totalDis;
      drawX = this.options.startPos.x + this.dx * ratio;
      drawY = this.options.startPos.y + this.dy * ratio;
      this.time.ctx.fillStyle = this.currentColor.replace('$', (1 - opacityDecay * i));
      this.time.ctx.beginPath();
      this.time.ctx.arc(drawX, drawY, lineWeight / 2, 0, Math.PI * 2);
      this.time.ctx.fill();
      if (drawing <= 0) {
        break;
      }
    }
  };
});
const AniArc = AniTask.extend(function () {
  const defaults = {
    lineWeight: 6,
    weightDecay: 0.06,
    circleCentre: { x: 0, y: 0 },
    radius: 100,
    startAngle: 2 * Math.PI,
    endAngle: Math.PI,
    initAlpha: 0,
    finalAlpha: 0.3,
    initColor: 'rgba(255,0,0)',
    finalColor: 'rgba(255,0,0)',
    initV: 20,
    finalV: 20,
  };
  this.constructor = function (time, options) {
    this.super(time);
    this.options = extend({}, defaults, options);
    this.disPass = 0;// 走过的距离
    this.totalDis = Math.abs(this.options.startAngle - this.options.endAngle) * this.options.radius;// 总距离
    this.counterclockwise = !(this.options.startAngle < this.options.endAngle);// 顺时针or逆时针
    this.options = extend({}, defaults, options);
    this.lineWidth = parseInt(this.options.lineWeight / this.options.weightDecay) - 1;
    this.currentAlpha;
    this.currentColor;
    this.currentV = this.options.initV;
    this.arrived = false;
  },
  this.clock = function (detal) {
    let progress;
    const that = this;
    this.disPass += this.currentV * detal;
    progress = (this.disPass - this.lineWidth) / (this.totalDis - this.lineWidth);
    progress = progress < 1 ? (progress < 0 ? 0 : progress) : 1;
    this.currentAlpha = this.options.initAlpha + (this.options.finalAlpha - this.options.initAlpha) * progress;
    this.currentV = this.options.initV + (this.options.finalV - this.options.initV) * progress;
    this.currentColor = this.options.initColor.replace(/(\d+)\s*\,\s*(\d+)\s*\,\s*(\d+)/g, function () {
      const finalColor = that.options.finalColor.match(/\d+/g).map((c) => parseInt(c));
      let color = [];
      for (let i = 0; i < 3; i++) {
        color.push(parseInt(arguments[i + 1]) + (finalColor[i] - parseInt(arguments[i + 1])) * progress);
      }
      color = color.map((v) => parseInt(v));
      color.push('$');
      return color.join(',');
    });
    this.draw();
    if (!this.arrived && this.disPass >= this.totalDis) {
      // arriveCallback 此处可能会改变速度
      this.next();
      this.arrived = true;
    }
    if (this.disPass - this.lineWidth >= this.totalDis) {
      // 停止动画 finishCallback
      this.finish(); // extend from AniStuff
    }
  };
  this.draw = function () {
    let drawing = this.disPass;
    let { lineWeight } = this.options;
    const opacityDecay = 1 / this.lineWidth;
    const dir = this.counterclockwise ? -1 : 1;
    let angle = dir * drawing / this.options.radius + this.options.startAngle;
    let drawX = this.options.circleCentre.x + Math.cos(angle) * this.options.radius;
    let drawY = this.options.circleCentre.y + Math.sin(angle) * this.options.radius;
    // draw circle
    this.time.ctx.globalAlpha = 0.05;
    this.time.ctx.strokeStyle = this.currentColor.replace('$', 1);
    this.time.ctx.beginPath();
    this.time.ctx.arc(this.options.circleCentre.x, this.options.circleCentre.y, this.options.radius, 0, Math.PI * 2);
    this.time.ctx.stroke();
    // draw light
    if (!this.arrived) {
      this.time.ctx.globalAlpha = this.currentAlpha;
      const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, 100);
      grd.addColorStop(0, this.currentColor.replace('$', 0.6));
      grd.addColorStop(1, this.currentColor.replace('$', 0));
      this.time.ctx.fillStyle = grd;
      this.time.ctx.beginPath();
      this.time.ctx.arc(drawX, drawY, 100, 0, Math.PI * 2);
      this.time.ctx.fill();
    }
    this.time.ctx.globalAlpha = this.currentAlpha;
    for (let i = 0; i < this.lineWidth; i++) {
      lineWeight -= this.options.weightDecay;
      angle = dir * drawing / this.options.radius + this.options.startAngle;
      if (drawing < this.totalDis) {
        drawX = this.options.circleCentre.x + Math.cos(angle) * this.options.radius;
        drawY = this.options.circleCentre.y + Math.sin(angle) * this.options.radius;
        this.time.ctx.fillStyle = this.currentColor.replace('$', (1 - opacityDecay * i));
        this.time.ctx.beginPath();
        this.time.ctx.arc(drawX, drawY, lineWeight / 2, 0, Math.PI * 2);
        this.time.ctx.fill();
      }
      preEngel = angle;
      drawing--;
      if (drawing <= 0) {
        break;
      }
    }
  };
});
const AniCircle = AniTask.extend(function () {
  const defaults = {
    pos: { x: 0, y: 0 },
    color: 'rgba(210, 230, 250)',
  };
  this.constructor = function (time, options) {
    this.super(time);
    this.options = extend({}, defaults, options);
    this.disPass = 0;
    this.totalDis = 30;
    this.arrived = false;
  };
  this.clock = function () {
    this.disPass += 0.5;
    const alpha = (1 - (this.disPass / this.totalDis)) / 2;
    this.time.ctx.globalAlpha = alpha > 0 ? alpha : 0;
    this.time.ctx.strokeStyle = this.options.color.replace(')', ', 1)');
    this.time.ctx.fillStyle = this.options.color.replace(')', ', 1)');
    this.time.ctx.beginPath();
    this.time.ctx.arc(this.options.pos.x, this.options.pos.y, this.disPass / 2, 0, Math.PI * 2);
    this.time.ctx.stroke();
    this.time.ctx.beginPath();
    this.time.ctx.arc(this.options.pos.x, this.options.pos.y, this.disPass / 2.4, 0, Math.PI * 2);
    this.time.ctx.fill();
    if (this.disPass > this.totalDis) {
      this.finish();
      return;
    }
    if (!this.arrived && this.disPass > 10) {
      this.arrived = true;
      this.next();
    }
  };
});
const createMovingStar = function (time, startPos, endPos, circleCentre, radius, options) {
  const defaults = {
    lineWeight: 6,
    laps: 0, // 在园中转的圈数
    weightDecay: 0.06,
    counterclockwise: false,
    initColor: 'rgba(255,0,0)',
    finalColor: 'rgba(255,0,0)',
    line1: {
      initAlpha: 0,
      finalAlpha: 0.5,
      initV: 200,
      finalV: 200,
    },
    arc: {
      radius: 200,
      initAlpha: 0.5,
      finalAlpha: 0.5,
      initV: 200,
      finalV: 400,
    },
    line2: {
      initAlpha: 0.5,
      finalAlpha: 0,
      initV: 400,
      finalV: 400,
    },
  };
  var options = extend({}, defaults, options);
  // startPos 和圆的两个切点
  const stPoints = getTangentPoint({ x: circleCentre.x, y: circleCentre.y }, radius, startPos);
  // endPos 和圆的两个切点
  const etPoints = getTangentPoint({ x: circleCentre.x, y: circleCentre.y }, radius, endPos);
  // 进入切点坐标，根据顺时针逆时针选一个切点
  const enterPoint = getEnterPoint(startPos, stPoints.point1, stPoints.point2, circleCentre, options.counterclockwise);
  // 离开切点坐标，根据顺时针逆时针选一个切点
  const outPoint = getEnterPoint(endPos, etPoints.point1, etPoints.point2, circleCentre, !options.counterclockwise);
  // 根据切点得到的圆路径的起始结束角度
  let startAngle = Math.atan2(enterPoint.y - circleCentre.y, enterPoint.x - circleCentre.x);
  let endAngle = Math.atan2(outPoint.y - circleCentre.y, outPoint.x - circleCentre.x);
  if (options.counterclockwise) { // 逆时 出去的角度要大于入角度
    if (endAngle > startAngle) {
      startAngle += 2 * Math.PI;
    }
  } else if (endAngle < startAngle) {
    endAngle += 2 * Math.PI;
  }
  endAngle += options.laps * 2 * Math.PI * (options.counterclockwise ? -1 : 1);
  /* console.log(enterPoint,outPoint);
console.log(startAngle*180/Math.PI,endAngle*180/Math.PI);
return; */
  const circle1 = new AniCircle(time, { pos: startPos, color: options.initColor });
  const circle2 = new AniCircle(time, { pos: endPos, color: options.finalColor });
  const line1 = new AniLine(time, extend({}, options.line1, {
    startPos,
    endPos: enterPoint,
    initColor: options.initColor,
    finalColor: options.initColor,
    lineWeight: options.lineWeight,
    weightDecay: options.weightDecay,
  }));
  const arc = new AniArc(time, extend({}, options.arc, {
    circleCentre,
    startAngle,
    endAngle,
    radius,
    initColor: options.initColor,
    finalColor: options.finalColor,
    lineWeight: options.lineWeight,
    weightDecay: options.weightDecay,
  }));
  const line2 = new AniLine(time, extend({}, options.line2, {
    startPos: outPoint,
    endPos,
    initColor: options.finalColor,
    finalColor: options.finalColor,
    lineWeight: options.lineWeight,
    weightDecay: options.weightDecay,
  }));
  circle1.setNext(line1);
  line1.setNext(arc);
  arc.setNext(line2);
  line2.setNext(circle2);
  circle1.start();
  function getEnterPoint(startPos, tPoint1, tPoint2, circleCentre, counterclockwise) {
    let angle1 = Math.atan2(tPoint1.y - circleCentre.y, tPoint1.x - circleCentre.x);
    let angle2 = Math.atan2(tPoint2.y - circleCentre.y, tPoint2.x - circleCentre.x);
    let sAngle = Math.atan2(startPos.y - circleCentre.y, startPos.x - circleCentre.x);
    angle1 += (angle1 < 0 ? Math.PI * 2 : 0);
    angle2 += (angle2 < 0 ? Math.PI * 2 : 0);
    sAngle += (sAngle < 0 ? Math.PI * 2 : 0);
    if (sAngle > Math.max(angle1, angle2)) {
      if (angle1 > angle2) {
        angle2 += 2 * Math.PI;
      } else {
        angle1 += 2 * Math.PI;
      }
    } else if (sAngle < Math.min(angle1, angle2)) {
      sAngle += 2 * Math.PI;
      if (angle1 > angle2) {
        angle2 += 2 * Math.PI;
      } else {
        angle1 += 2 * Math.PI;
      }
    }
    // console.log(angle1, sAngle, angle2);
    if (counterclockwise) {
      return (angle1 > angle2 ? tPoint2 : tPoint1);
    }
    return (angle1 > angle2 ? tPoint1 : tPoint2);
  }
};
function hehe() {
  const initColor = `rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)})`;
  const finalColor = `rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)})`;
  const lineWeight = parseInt(Math.random() * 3 + 3);
  const weightDecay = lineWeight / 150;
  const circleCentre = { x: Math.random() * (cvs.width - 200) + 100, y: Math.random() * (cvs.height - 200) + 100 };
  const radius = parseInt((Math.random() * 200 + 100) / 20) * 20;
  const startPos = { x: parseInt((circleCentre.x - radius) - Math.random() * 300), y: parseInt(Math.random() * 500) };
  const endPos = { x: parseInt((circleCentre.x + radius) + Math.random() * 300), y: parseInt(Math.random() * 500) };
  // console.log(startPos, endPos, circleCentre, radius);
  // console.log(time.timeBodys);
  // if (time.timeBodys.length < 30)
  createMovingStar(time, startPos, endPos, circleCentre, radius, {
    counterclockwise: !(Math.random() > 0.5),
    laps: parseInt(Math.random() * 2),
    initColor,
    finalColor,
    lineWeight,
    weightDecay,
  });
  setTimeout(() => {
    // console.log(time.timeBodys.length);
    hehe();
  }, parseInt(Math.random() * 3000));
}
hehe();
/* createMovingStar(time, {x: 300,y:100}, {x: 450, y: 100}, {x: 300, y: 300}, 100, {
initColor: 'rgba(255,0,0)',
finalColor: 'rgba(111,133,155)'
}); */
