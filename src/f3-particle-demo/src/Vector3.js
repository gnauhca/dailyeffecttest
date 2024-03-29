import { _Math } from './Math';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector3.prototype = {

  constructor: Vector3,

  isVector3: true,

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  },

  setScalar(scalar) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;

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

  setZ(z) {
    this.z = z;

    return this;
  },

  setComponent(index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error(`index is out of range: ${index}`);
    }

    return this;
  },

  getComponent(index) {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error(`index is out of range: ${index}`);
    }
  },

  clone() {
    return new this.constructor(this.x, this.y, this.z);
  },

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  },

  add(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
      return this.addVectors(v, w);
    }

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  },

  addScalar(s) {
    this.x += s;
    this.y += s;
    this.z += s;

    return this;
  },

  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;

    return this;
  },

  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;

    return this;
  },

  sub(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
      return this.subVectors(v, w);
    }

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  },

  subScalar(s) {
    this.x -= s;
    this.y -= s;
    this.z -= s;

    return this;
  },

  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;

    return this;
  },

  multiply(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
      return this.multiplyVectors(v, w);
    }

    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  },

  multiplyScalar(scalar) {
    if (isFinite(scalar)) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this;
  },

  multiplyVectors(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;

    return this;
  },

  applyEuler: (function () {
    let quaternion;

    return function applyEuler(euler) {
      if ((euler && euler.isEuler) === false) {
        console.error('THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.');
      }

      if (quaternion === undefined) quaternion = new Quaternion();

      return this.applyQuaternion(quaternion.setFromEuler(euler));
    };
  }()),

  applyAxisAngle: (function () {
    let quaternion;

    return function applyAxisAngle(axis, angle) {
      if (quaternion === undefined) quaternion = new Quaternion();

      return this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
    };
  }()),

  applyMatrix3(m) {
    const { x } = this;
    const { y } = this;
    const { z } = this;
    const e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;

    return this;
  },

  applyMatrix4(m) {
    const { x } = this;
    const { y } = this;
    const { z } = this;
    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
    const w = e[3] * x + e[7] * y + e[11] * z + e[15];

    return this.divideScalar(w);
  },

  applyQuaternion(q) {
    const { x } = this;
    const { y } = this;
    const { z } = this;
    const qx = q.x; const qy = q.y; const qz = q.z; const
      qw = q.w;

    // calculate quat * vector

    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat

    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
  },

  project: (function () {
    let matrix;

    return function project(camera) {
      if (matrix === undefined) matrix = new Matrix4();

      matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
      return this.applyMatrix4(matrix);
    };
  }()),

  unproject: (function () {
    let matrix;

    return function unproject(camera) {
      if (matrix === undefined) matrix = new Matrix4();

      matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
      return this.applyMatrix4(matrix);
    };
  }()),

  transformDirection(m) {
    // input: THREE.Matrix4 affine matrix
    // vector interpreted as a direction

    const { x } = this;
    const { y } = this;
    const { z } = this;
    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;

    return this.normalize();
  },

  divide(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  },

  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  },

  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);

    return this;
  },

  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);

    return this;
  },

  clamp(min, max) {
    // This function assumes min < max, if this assumption isn't true it will not operate correctly

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));

    return this;
  },

  clampScalar: (function () {
    let min; let
      max;

    return function clampScalar(minVal, maxVal) {
      if (min === undefined) {
        min = new Vector3();
        max = new Vector3();
      }

      min.set(minVal, minVal, minVal);
      max.set(maxVal, maxVal, maxVal);

      return this.clamp(min, max);
    };
  }()),

  clampLength(min, max) {
    const length = this.length();

    return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);
  },

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  },

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  },

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  },

  roundToZero() {
    this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);

    return this;
  },

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  },

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },

  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  },

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },

  lengthManhattan() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  },

  normalize() {
    return this.divideScalar(this.length());
  },

  setLength(length) {
    return this.multiplyScalar(length / this.length());
  },

  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;

    return this;
  },

  lerpVectors(v1, v2, alpha) {
    return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  },

  cross(v, w) {
    if (w !== undefined) {
      console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
      return this.crossVectors(v, w);
    }

    const { x } = this;
    const { y } = this;
    const { z } = this;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
  },

  crossVectors(a, b) {
    const ax = a.x; const ay = a.y; const
      az = a.z;
    const bx = b.x; const by = b.y; const
      bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  },

  projectOnVector(vector) {
    const scalar = vector.dot(this) / vector.lengthSq();

    return this.copy(vector).multiplyScalar(scalar);
  },

  projectOnPlane: (function () {
    let v1;

    return function projectOnPlane(planeNormal) {
      if (v1 === undefined) v1 = new Vector3();

      v1.copy(this).projectOnVector(planeNormal);

      return this.sub(v1);
    };
  }()),

  reflect: (function () {
    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length

    let v1;

    return function reflect(normal) {
      if (v1 === undefined) v1 = new Vector3();

      return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
    };
  }()),

  angleTo(v) {
    const theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));

    // clamp, to handle numerical problems

    return Math.acos(_Math.clamp(theta, -1, 1));
  },

  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  },

  distanceToSquared(v) {
    const dx = this.x - v.x; const dy = this.y - v.y; const
      dz = this.z - v.z;

    return dx * dx + dy * dy + dz * dz;
  },

  distanceToManhattan(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  },

  setFromSpherical(s) {
    const sinPhiRadius = Math.sin(s.phi) * s.radius;

    this.x = sinPhiRadius * Math.sin(s.theta);
    this.y = Math.cos(s.phi) * s.radius;
    this.z = sinPhiRadius * Math.cos(s.theta);

    return this;
  },

  setFromCylindrical(c) {
    this.x = c.radius * Math.sin(c.theta);
    this.y = c.y;
    this.z = c.radius * Math.cos(c.theta);

    return this;
  },

  setFromMatrixPosition(m) {
    return this.setFromMatrixColumn(m, 3);
  },

  setFromMatrixScale(m) {
    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();

    this.x = sx;
    this.y = sy;
    this.z = sz;

    return this;
  },

  setFromMatrixColumn(m, index) {
    if (typeof m === 'number') {
      console.warn('THREE.Vector3: setFromMatrixColumn now expects ( matrix, index ).');
      const temp = m;
      m = index;
      index = temp;
    }

    return this.fromArray(m.elements, index * 4);
  },

  equals(v) {
    return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
  },

  fromArray(array, offset) {
    if (offset === undefined) offset = 0;

    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];

    return this;
  },

  toArray(array, offset) {
    if (array === undefined) array = [];
    if (offset === undefined) offset = 0;

    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;

    return array;
  },

  fromBufferAttribute(attribute, index, offset) {
    if (offset !== undefined) {
      console.warn('THREE.Vector3: offset has been removed from .fromBufferAttribute().');
    }

    this.x = attribute.getX(index);
    this.y = attribute.getY(index);
    this.z = attribute.getZ(index);

    return this;
  },

};

export { Vector3 };
