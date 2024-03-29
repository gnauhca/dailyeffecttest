/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || (function () {
  let _tweens = [];

  return {

    getAll() {
      return _tweens;
    },

    removeAll() {
      _tweens = [];
    },

    add(tween) {
      _tweens.push(tween);
    },

    remove(tween) {
      const i = _tweens.indexOf(tween);

      if (i !== -1) {
        _tweens.splice(i, 1);
      }
    },

    update(time, preserve) {
      if (_tweens.length === 0) {
        return false;
      }

      let i = 0;

      time = time !== undefined ? time : TWEEN.now();

      while (i < _tweens.length) {
        if (_tweens[i].update(time) || preserve) {
          i++;
        } else {
          _tweens.splice(i, 1);
        }
      }

      return true;
    },
  };
}());

// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
  TWEEN.now = function () {
    const time = process.hrtime();

    // Convert [seconds, nanoseconds] to milliseconds.
    return time[0] * 1000 + time[1] / 1000000;
  };
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined'
           && window.performance !== undefined
       && window.performance.now !== undefined) {
  // This must be bound, because directly assigning this function
  // leads to an invocation exception in Chrome.
  TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
  TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
  TWEEN.now = function () {
    return new Date().getTime();
  };
}

TWEEN.Tween = function (object) {
  const _object = object;
  const _valuesStart = {};
  let _valuesEnd = {};
  const _valuesStartRepeat = {};
  let _duration = 1000;
  let _repeat = 0;
  let _repeatDelayTime;
  let _yoyo = false;
  let _isPlaying = false;
  let _reversed = false;
  let _delayTime = 0;
  let _startTime = null;
  let _easingFunction = TWEEN.Easing.Linear.None;
  let _interpolationFunction = TWEEN.Interpolation.Linear;
  let _chainedTweens = [];
  let _onStartCallback = null;
  let _onStartCallbackFired = false;
  let _onUpdateCallback = null;
  let _onCompleteCallback = null;
  let _onStopCallback = null;

  this.to = function (properties, duration) {
    _valuesEnd = properties;

    if (duration !== undefined) {
      _duration = duration;
    }

    return this;
  };

  this.start = function (time) {
    TWEEN.add(this);

    _isPlaying = true;

    _onStartCallbackFired = false;

    _startTime = time !== undefined ? time : TWEEN.now();
    _startTime += _delayTime;

    for (const property in _valuesEnd) {
      // Check if an Array was provided as property value
      if (_valuesEnd[property] instanceof Array) {
        if (_valuesEnd[property].length === 0) {
          continue;
        }

        // Create a local copy of the Array with the start value at the front
        _valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);
      }

      // If `to()` specifies a property that doesn't exist in the source object,
      // we should not set that property in the object
      if (_object[property] === undefined) {
        continue;
      }

      // Save the starting value.
      _valuesStart[property] = _object[property];

      if ((_valuesStart[property] instanceof Array) === false) {
        _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
      }

      _valuesStartRepeat[property] = _valuesStart[property] || 0;
    }

    return this;
  };

  this.stop = function () {
    if (!_isPlaying) {
      return this;
    }

    TWEEN.remove(this);
    _isPlaying = false;

    if (_onStopCallback !== null) {
      _onStopCallback.call(_object, _object);
    }

    this.stopChainedTweens();
    return this;
  };

  this.end = function () {
    this.update(_startTime + _duration);
    return this;
  };

  this.stopChainedTweens = function () {
    for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
      _chainedTweens[i].stop();
    }
  };

  this.delay = function (amount) {
    _delayTime = amount;
    return this;
  };

  this.repeat = function (times) {
    _repeat = times;
    return this;
  };

  this.repeatDelay = function (amount) {
    _repeatDelayTime = amount;
    return this;
  };

  this.yoyo = function (yoyo) {
    _yoyo = yoyo;
    return this;
  };

  this.easing = function (easing) {
    _easingFunction = easing;
    return this;
  };

  this.interpolation = function (interpolation) {
    _interpolationFunction = interpolation;
    return this;
  };

  this.chain = function () {
    _chainedTweens = arguments;
    return this;
  };

  this.onStart = function (callback) {
    _onStartCallback = callback;
    return this;
  };

  this.onUpdate = function (callback) {
    _onUpdateCallback = callback;
    return this;
  };

  this.onComplete = function (callback) {
    _onCompleteCallback = callback;
    return this;
  };

  this.onStop = function (callback) {
    _onStopCallback = callback;
    return this;
  };

  this.update = function (time) {
    let property;
    let elapsed;
    let value;

    if (time < _startTime) {
      return true;
    }

    if (_onStartCallbackFired === false) {
      if (_onStartCallback !== null) {
        _onStartCallback.call(_object, _object);
      }

      _onStartCallbackFired = true;
    }

    elapsed = (time - _startTime) / _duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    value = _easingFunction(elapsed);

    for (property in _valuesEnd) {
      // Don't update properties that do not exist in the source object
      if (_valuesStart[property] === undefined) {
        continue;
      }

      const start = _valuesStart[property] || 0;
      let end = _valuesEnd[property];

      if (end instanceof Array) {
        _object[property] = _interpolationFunction(end, value);
      } else {
        // Parses relative end values with start as base (e.g.: +10, -3)
        if (typeof (end) === 'string') {
          if (end.charAt(0) === '+' || end.charAt(0) === '-') {
            end = start + parseFloat(end);
          } else {
            end = parseFloat(end);
          }
        }

        // Protect against non numeric properties.
        if (typeof (end) === 'number') {
          _object[property] = start + (end - start) * value;
        }
      }
    }

    if (_onUpdateCallback !== null) {
      _onUpdateCallback.call(_object, value);
    }

    if (elapsed === 1) {
      if (_repeat > 0) {
        if (isFinite(_repeat)) {
          _repeat--;
        }

        // Reassign starting values, restart by making startTime = now
        for (property in _valuesStartRepeat) {
          if (typeof (_valuesEnd[property]) === 'string') {
            _valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
          }

          if (_yoyo) {
            const tmp = _valuesStartRepeat[property];

            _valuesStartRepeat[property] = _valuesEnd[property];
            _valuesEnd[property] = tmp;
          }

          _valuesStart[property] = _valuesStartRepeat[property];
        }

        if (_yoyo) {
          _reversed = !_reversed;
        }

        if (_repeatDelayTime !== undefined) {
          _startTime = time + _repeatDelayTime;
        } else {
          _startTime = time + _delayTime;
        }

        return true;
      }

      if (_onCompleteCallback !== null) {
        _onCompleteCallback.call(_object, _object);
      }

      for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
        // Make the chained tweens start exactly at the time they should,
        // even if the `update()` method was called way past the duration of the tween
        _chainedTweens[i].start(_startTime + _duration);
      }

      return false;
    }

    return true;
  };
};

TWEEN.Easing = {

  Linear: {

    None(k) {
      return k;
    },

  },

  Quadratic: {

    In(k) {
      return k * k;
    },

    Out(k) {
      return k * (2 - k);
    },

    InOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }

      return -0.5 * (--k * (k - 2) - 1);
    },

  },

  Cubic: {

    In(k) {
      return k * k * k;
    },

    Out(k) {
      return --k * k * k + 1;
    },

    InOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k + 2);
    },

  },

  Quartic: {

    In(k) {
      return k * k * k * k;
    },

    Out(k) {
      return 1 - (--k * k * k * k);
    },

    InOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
      }

      return -0.5 * ((k -= 2) * k * k * k - 2);
    },

  },

  Quintic: {

    In(k) {
      return k * k * k * k * k;
    },

    Out(k) {
      return --k * k * k * k * k + 1;
    },

    InOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k * k * k + 2);
    },

  },

  Sinusoidal: {

    In(k) {
      return 1 - Math.cos(k * Math.PI / 2);
    },

    Out(k) {
      return Math.sin(k * Math.PI / 2);
    },

    InOut(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    },

  },

  Exponential: {

    In(k) {
      return k === 0 ? 0 : 1024 ** (k - 1);
    },

    Out(k) {
      return k === 1 ? 1 : 1 - 2 ** (-10 * k);
    },

    InOut(k) {
      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      if ((k *= 2) < 1) {
        return 0.5 * 1024 ** (k - 1);
      }

      return 0.5 * (-(2 ** (-10 * (k - 1))) + 2);
    },

  },

  Circular: {

    In(k) {
      return 1 - Math.sqrt(1 - k * k);
    },

    Out(k) {
      return Math.sqrt(1 - (--k * k));
    },

    InOut(k) {
      if ((k *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - k * k) - 1);
      }

      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    },

  },

  Elastic: {

    In(k) {
      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return -(2 ** (10 * (k - 1))) * Math.sin((k - 1.1) * 5 * Math.PI);
    },

    Out(k) {
      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return 2 ** (-10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
    },

    InOut(k) {
      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      k *= 2;

      if (k < 1) {
        return -0.5 * 2 ** (10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }

      return 0.5 * 2 ** (-10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
    },

  },

  Back: {

    In(k) {
      const s = 1.70158;

      return k * k * ((s + 1) * k - s);
    },

    Out(k) {
      const s = 1.70158;

      return --k * k * ((s + 1) * k + s) + 1;
    },

    InOut(k) {
      const s = 1.70158 * 1.525;

      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }

      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    },

  },

  Bounce: {

    In(k) {
      return 1 - TWEEN.Easing.Bounce.Out(1 - k);
    },

    Out(k) {
      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      }
      return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
    },

    InOut(k) {
      if (k < 0.5) {
        return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
      }

      return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
    },

  },

};

TWEEN.Interpolation = {

  Linear(v, k) {
    const m = v.length - 1;
    const f = m * k;
    const i = Math.floor(f);
    const fn = TWEEN.Interpolation.Utils.Linear;

    if (k < 0) {
      return fn(v[0], v[1], f);
    }

    if (k > 1) {
      return fn(v[m], v[m - 1], m - f);
    }

    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
  },

  Bezier(v, k) {
    let b = 0;
    const n = v.length - 1;
    const pw = Math.pow;
    const bn = TWEEN.Interpolation.Utils.Bernstein;

    for (let i = 0; i <= n; i++) {
      b += (1 - k) ** (n - i) * k ** i * v[i] * bn(n, i);
    }

    return b;
  },

  CatmullRom(v, k) {
    const m = v.length - 1;
    let f = m * k;
    let i = Math.floor(f);
    const fn = TWEEN.Interpolation.Utils.CatmullRom;

    if (v[0] === v[m]) {
      if (k < 0) {
        i = Math.floor(f = m * (1 + k));
      }

      return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
    }

    if (k < 0) {
      return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
    }

    if (k > 1) {
      return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
    }

    return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
  },

  Utils: {

    Linear(p0, p1, t) {
      return (p1 - p0) * t + p0;
    },

    Bernstein(n, i) {
      const fc = TWEEN.Interpolation.Utils.Factorial;

      return fc(n) / fc(i) / fc(n - i);
    },

    Factorial: (function () {
      const a = [1];

      return function (n) {
        let s = 1;

        if (a[n]) {
          return a[n];
        }

        for (let i = n; i > 1; i--) {
          s *= i;
        }

        a[n] = s;
        return s;
      };
    }()),

    CatmullRom(p0, p1, p2, p3, t) {
      const v0 = (p2 - p0) * 0.5;
      const v1 = (p3 - p1) * 0.5;
      const t2 = t * t;
      const t3 = t * t2;

      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    },

  },

};

// UMD (Universal Module Definition)
(function (root) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], () => TWEEN);
  } else if (typeof module !== 'undefined' && typeof exports === 'object') {
    // Node.js
    module.exports = TWEEN;
  } else if (root !== undefined) {
    // Global variable
    root.TWEEN = TWEEN;
  }
}(this));
