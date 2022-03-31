/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

function Vector2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Object.defineProperties(Vector2.prototype, {

  width: {

    get() {
      return this.x;
    },

    set(value) {
      this.x = value;
    },

  },

  height: {

    get() {
      return this.y;
    },

    set(value) {
      this.y = value;
    },

  },

});

Object.assign(Vector2.prototype, {

  isVector2: true,

  set(x, y) {
    this.x = x;
    this.y = y;

    return this;
  },

  setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;

    return this;
  },

  setX(x) {
    this.x = x;

    return this;
  },

  setY(y) {
    this.y = y;

    return this;
  },

  setComponent(index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      default: throw new Error(`index is out of range: ${index}`);
    }

    return this;
  },

  getComponent(index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      default: throw new Error(`index is out of range: ${index}`);
    }
  },

  clone() {
    return new this.constructor(this.x, this.y);
  },

  copy(v) {
    this.x = v.x;
    this.y = v.y;

    return this;
  },

  add(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
      return this.addVectors(v, w);
    }

    this.x += v.x;
    this.y += v.y;

    return this;
  },

  addScalar(s) {
    this.x += s;
    this.y += s;

    return this;
  },

  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;

    return this;
  },

  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;

    return this;
  },

  sub(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
      return this.subVectors(v, w);
    }

    this.x -= v.x;
    this.y -= v.y;

    return this;
  },

  subScalar(s) {
    this.x -= s;
    this.y -= s;

    return this;
  },

  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;

    return this;
  },

  multiply(v) {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  },

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  },

  divide(v) {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  },

  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  },

  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);

    return this;
  },

  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);

    return this;
  },

  clamp(min, max) {
    // assumes min < max, componentwise

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));

    return this;
  },

  clampScalar: (function () {
    const min = new Vector2();
    const max = new Vector2();

    return function clampScalar(minVal, maxVal) {
      min.set(minVal, minVal);
      max.set(maxVal, maxVal);

      return this.clamp(min, max);
    };
  }()),

  clampLength(min, max) {
    const length = this.length();

    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
  },

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  },

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  },

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  },

  roundToZero() {
    this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);

    return this;
  },

  negate() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  },

  dot(v) {
    return this.x * v.x + this.y * v.y;
  },

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  },

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  lengthManhattan() {
    return Math.abs(this.x) + Math.abs(this.y);
  },

  normalize() {
    return this.divideScalar(this.length() || 1);
  },

  angle() {
    // computes the angle in radians with respect to the positive x-axis

    let angle = Math.atan2(this.y, this.x);

    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  },

  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  },

  distanceToSquared(v) {
    const dx = this.x - v.x; const
      dy = this.y - v.y;
    return dx * dx + dy * dy;
  },

  distanceToManhattan(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  },

  setLength(length) {
    return this.normalize().multiplyScalar(length);
  },

  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  },

  lerpVectors(v1, v2, alpha) {
    return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  },

  equals(v) {
    return ((v.x === this.x) && (v.y === this.y));
  },

  fromArray(array, offset) {
    if (offset === undefined) offset = 0;

    this.x = array[offset];
    this.y = array[offset + 1];

    return this;
  },

  toArray(array, offset) {
    if (array === undefined) array = [];
    if (offset === undefined) offset = 0;

    array[offset] = this.x;
    array[offset + 1] = this.y;

    return array;
  },

  fromBufferAttribute(attribute, index, offset) {
    if (offset !== undefined) {
      console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');
    }

    this.x = attribute.getX(index);
    this.y = attribute.getY(index);

    return this;
  },

  rotateAround(center, angle) {
    const c = Math.cos(angle); const
      s = Math.sin(angle);

    const x = this.x - center.x;
    const y = this.y - center.y;

    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;

    return this;
  },

});
