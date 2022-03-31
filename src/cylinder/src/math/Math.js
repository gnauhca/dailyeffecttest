/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

var _Math = {

  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,

  generateUUID: (function () {
    // http://www.broofa.com/Tools/Math.uuid.htm

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = new Array(36);
    let rnd = 0; let
      r;

    return function generateUUID() {
      for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
          uuid[i] = '-';
        } else if (i === 14) {
          uuid[i] = '4';
        } else {
          if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
          r = rnd & 0xf;
          rnd >>= 4;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }

      return uuid.join('');
    };
  }()),

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  // compute euclidian modulo of m % n
  // https://en.wikipedia.org/wiki/Modulo_operation

  euclideanModulo(n, m) {
    return ((n % m) + m) % m;
  },

  // Linear mapping from range <a1, a2> to range <b1, b2>

  mapLinear(x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  },

  // https://en.wikipedia.org/wiki/Linear_interpolation

  lerp(x, y, t) {
    return (1 - t) * x + t * y;
  },

  // http://en.wikipedia.org/wiki/Smoothstep

  smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
  },

  smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
  },

  // Random integer from <low, high> interval

  randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
  },

  // Random float from <low, high> interval

  randFloat(low, high) {
    return low + Math.random() * (high - low);
  },

  // Random float from <-range/2, range/2> interval

  randFloatSpread(range) {
    return range * (0.5 - Math.random());
  },

  degToRad(degrees) {
    return degrees * _Math.DEG2RAD;
  },

  radToDeg(radians) {
    return radians * _Math.RAD2DEG;
  },

  isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
  },

  nearestPowerOfTwo(value) {
    return 2 ** Math.round(Math.log(value) / Math.LN2);
  },

  nextPowerOfTwo(value) {
    value--;
    value |= value >> 1;
    value |= value >> 2;
    value |= value >> 4;
    value |= value >> 8;
    value |= value >> 16;
    value++;

    return value;
  },

};

export { _Math };
