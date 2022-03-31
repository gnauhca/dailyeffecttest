(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof exports === 'object') exports.C3 = factory();
  else root.C3 = factory();
}(typeof self !== 'undefined' ? self : this, () =>
/** *** */ (function (modules) { // webpackBootstrap
    /** *** */ 	// The module cache
    /** *** */ 	const installedModules = {};
    /** *** */
    /** *** */ 	// The require function
    /** *** */ 	function __webpack_require__(moduleId) {
      /** *** */
      /** *** */ 		// Check if module is in cache
      /** *** */ 		if (installedModules[moduleId]) {
        /** *** */ 			return installedModules[moduleId].exports;
        /** *** */ 		}
      /** *** */ 		// Create a new module (and put it into the cache)
      /** *** */ 		const module = installedModules[moduleId] = {
        /** *** */ 			i: moduleId,
        /** *** */ 			l: false,
        /** *** */ 			exports: {},
        /** *** */ 		};
      /** *** */
      /** *** */ 		// Execute the module function
      /** *** */ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /** *** */
      /** *** */ 		// Flag the module as loaded
      /** *** */ 		module.l = true;
      /** *** */
      /** *** */ 		// Return the exports of the module
      /** *** */ 		return module.exports;
      /** *** */ 	}
    /** *** */
    /** *** */
    /** *** */ 	// expose the modules object (__webpack_modules__)
    /** *** */ 	__webpack_require__.m = modules;
    /** *** */
    /** *** */ 	// expose the module cache
    /** *** */ 	__webpack_require__.c = installedModules;
    /** *** */
    /** *** */ 	// define getter function for harmony exports
    /** *** */ 	__webpack_require__.d = function (exports, name, getter) {
      /** *** */ 		if (!__webpack_require__.o(exports, name)) {
        /** *** */ 			Object.defineProperty(exports, name, {
          /** *** */ 				configurable: false,
          /** *** */ 				enumerable: true,
          /** *** */ 				get: getter,
          /** *** */ 			});
        /** *** */ 		}
      /** *** */ 	};
    /** *** */
    /** *** */ 	// getDefaultExport function for compatibility with non-harmony modules
    /** *** */ 	__webpack_require__.n = function (module) {
      /** *** */ 		const getter = module && module.__esModule
      /** *** */ 			? function getDefault() { return module.default; }
      /** *** */ 			: function getModuleExports() { return module; };
      /** *** */ 		__webpack_require__.d(getter, 'a', getter);
      /** *** */ 		return getter;
      /** *** */ 	};
    /** *** */
    /** *** */ 	// Object.prototype.hasOwnProperty.call
    /** *** */ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /** *** */
    /** *** */ 	// __webpack_public_path__
    /** *** */ 	__webpack_require__.p = '';
    /** *** */
    /** *** */ 	// Load entry module and return exports
    /** *** */ 	return __webpack_require__(__webpack_require__.s = 11);
    /** *** */ }([
    /* 0 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', () => Vector3);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Math__ = __webpack_require__(5);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Matrix4__ = __webpack_require__(1);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_2__Quaternion__ = __webpack_require__(6);

      /**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
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

      Object.assign(Vector3.prototype, {

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
          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;

          return this;
        },

        multiplyVectors(a, b) {
          this.x = a.x * b.x;
          this.y = a.y * b.y;
          this.z = a.z * b.z;

          return this;
        },

        applyEuler: (function () {
          const quaternion = new __WEBPACK_IMPORTED_MODULE_2__Quaternion__['a' /* Quaternion */]();

          return function applyEuler(euler) {
            if (!(euler && euler.isEuler)) {
              console.error('THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.');
            }

            return this.applyQuaternion(quaternion.setFromEuler(euler));
          };
        }()),

        applyAxisAngle: (function () {
          const quaternion = new __WEBPACK_IMPORTED_MODULE_2__Quaternion__['a' /* Quaternion */]();

          return function applyAxisAngle(axis, angle) {
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

          const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

          this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
          this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
          this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

          return this;
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
          const matrix = new __WEBPACK_IMPORTED_MODULE_1__Matrix4__['a' /* Matrix4 */]();

          return function project(camera) {
            matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
            return this.applyMatrix4(matrix);
          };
        }()),

        unproject: (function () {
          const matrix = new __WEBPACK_IMPORTED_MODULE_1__Matrix4__['a' /* Matrix4 */]();

          return function unproject(camera) {
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
          // assumes min < max, componentwise

          this.x = Math.max(min.x, Math.min(max.x, this.x));
          this.y = Math.max(min.y, Math.min(max.y, this.y));
          this.z = Math.max(min.z, Math.min(max.z, this.z));

          return this;
        },

        clampScalar: (function () {
          const min = new Vector3();
          const max = new Vector3();

          return function clampScalar(minVal, maxVal) {
            min.set(minVal, minVal, minVal);
            max.set(maxVal, maxVal, maxVal);

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

        // TODO lengthSquared?

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
          return this.divideScalar(this.length() || 1);
        },

        setLength(length) {
          return this.normalize().multiplyScalar(length);
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
          const v1 = new Vector3();

          return function projectOnPlane(planeNormal) {
            v1.copy(this).projectOnVector(planeNormal);

            return this.sub(v1);
          };
        }()),

        reflect: (function () {
          // reflect incident vector off plane orthogonal to normal
          // normal is assumed to have unit length

          const v1 = new Vector3();

          return function reflect(normal) {
            return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
          };
        }()),

        angleTo(v) {
          const theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));

          // clamp, to handle numerical problems

          return Math.acos(__WEBPACK_IMPORTED_MODULE_0__Math__['a' /* _Math */].clamp(theta, -1, 1));
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
          const e = m.elements;

          this.x = e[12];
          this.y = e[13];
          this.z = e[14];

          return this;
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

      });
      /***/ }),
    /* 1 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', () => Matrix4);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Vector3__ = __webpack_require__(0);

      /**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 */

      function Matrix4() {
        this.elements = [

          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,

        ];

        if (arguments.length > 0) {
          console.error('THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.');
        }
      }

      Object.assign(Matrix4.prototype, {

        isMatrix4: true,

        set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
          const te = this.elements;

          te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
          te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
          te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
          te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

          return this;
        },

        identity() {
          this.set(

            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        clone() {
          return new Matrix4().fromArray(this.elements);
        },

        copy(m) {
          const te = this.elements;
          const me = m.elements;

          te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
          te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
          te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
          te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

          return this;
        },

        copyPosition(m) {
          const te = this.elements; const
            me = m.elements;

          te[12] = me[12];
          te[13] = me[13];
          te[14] = me[14];

          return this;
        },

        extractBasis(xAxis, yAxis, zAxis) {
          xAxis.setFromMatrixColumn(this, 0);
          yAxis.setFromMatrixColumn(this, 1);
          zAxis.setFromMatrixColumn(this, 2);

          return this;
        },

        makeBasis(xAxis, yAxis, zAxis) {
          this.set(
            xAxis.x,
            yAxis.x,
            zAxis.x,
            0,
            xAxis.y,
            yAxis.y,
            zAxis.y,
            0,
            xAxis.z,
            yAxis.z,
            zAxis.z,
            0,
            0,
            0,
            0,
            1,
          );

          return this;
        },

        extractRotation: (function () {
          const v1 = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();

          return function extractRotation(m) {
            const te = this.elements;
            const me = m.elements;

            const scaleX = 1 / v1.setFromMatrixColumn(m, 0).length();
            const scaleY = 1 / v1.setFromMatrixColumn(m, 1).length();
            const scaleZ = 1 / v1.setFromMatrixColumn(m, 2).length();

            te[0] = me[0] * scaleX;
            te[1] = me[1] * scaleX;
            te[2] = me[2] * scaleX;

            te[4] = me[4] * scaleY;
            te[5] = me[5] * scaleY;
            te[6] = me[6] * scaleY;

            te[8] = me[8] * scaleZ;
            te[9] = me[9] * scaleZ;
            te[10] = me[10] * scaleZ;

            return this;
          };
        }()),

        makeRotationFromEuler(euler) {
          if (!(euler && euler.isEuler)) {
            console.error('THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
          }

          const te = this.elements;

          const { x } = euler;
          const { y } = euler;
          const { z } = euler;
          const a = Math.cos(x); const
            b = Math.sin(x);
          const c = Math.cos(y); const
            d = Math.sin(y);
          const e = Math.cos(z); const
            f = Math.sin(z);

          if (euler.order === 'XYZ') {
            var ae = a * e; var af = a * f; var be = b * e; var
              bf = b * f;

            te[0] = c * e;
            te[4] = -c * f;
            te[8] = d;

            te[1] = af + be * d;
            te[5] = ae - bf * d;
            te[9] = -b * c;

            te[2] = bf - ae * d;
            te[6] = be + af * d;
            te[10] = a * c;
          } else if (euler.order === 'YXZ') {
            var ce = c * e; var cf = c * f; var de = d * e; var
              df = d * f;

            te[0] = ce + df * b;
            te[4] = de * b - cf;
            te[8] = a * d;

            te[1] = a * f;
            te[5] = a * e;
            te[9] = -b;

            te[2] = cf * b - de;
            te[6] = df + ce * b;
            te[10] = a * c;
          } else if (euler.order === 'ZXY') {
            var ce = c * e; var cf = c * f; var de = d * e; var
              df = d * f;

            te[0] = ce - df * b;
            te[4] = -a * f;
            te[8] = de + cf * b;

            te[1] = cf + de * b;
            te[5] = a * e;
            te[9] = df - ce * b;

            te[2] = -a * d;
            te[6] = b;
            te[10] = a * c;
          } else if (euler.order === 'ZYX') {
            var ae = a * e; var af = a * f; var be = b * e; var
              bf = b * f;

            te[0] = c * e;
            te[4] = be * d - af;
            te[8] = ae * d + bf;

            te[1] = c * f;
            te[5] = bf * d + ae;
            te[9] = af * d - be;

            te[2] = -d;
            te[6] = b * c;
            te[10] = a * c;
          } else if (euler.order === 'YZX') {
            var ac = a * c; var ad = a * d; var bc = b * c; var
              bd = b * d;

            te[0] = c * e;
            te[4] = bd - ac * f;
            te[8] = bc * f + ad;

            te[1] = f;
            te[5] = a * e;
            te[9] = -b * e;

            te[2] = -d * e;
            te[6] = ad * f + bc;
            te[10] = ac - bd * f;
          } else if (euler.order === 'XZY') {
            var ac = a * c; var ad = a * d; var bc = b * c; var
              bd = b * d;

            te[0] = c * e;
            te[4] = -f;
            te[8] = d * e;

            te[1] = ac * f + bd;
            te[5] = a * e;
            te[9] = ad * f - bc;

            te[2] = bc * f - ad;
            te[6] = b * e;
            te[10] = bd * f + ac;
          }

          // last column
          te[3] = 0;
          te[7] = 0;
          te[11] = 0;

          // bottom row
          te[12] = 0;
          te[13] = 0;
          te[14] = 0;
          te[15] = 1;

          return this;
        },

        makeRotationFromQuaternion(q) {
          const te = this.elements;

          const x = q._x; const y = q._y; const z = q._z; const
            w = q._w;
          const x2 = x + x; const y2 = y + y; const
            z2 = z + z;
          const xx = x * x2; const xy = x * y2; const
            xz = x * z2;
          const yy = y * y2; const yz = y * z2; const
            zz = z * z2;
          const wx = w * x2; const wy = w * y2; const
            wz = w * z2;

          te[0] = 1 - (yy + zz);
          te[4] = xy - wz;
          te[8] = xz + wy;

          te[1] = xy + wz;
          te[5] = 1 - (xx + zz);
          te[9] = yz - wx;

          te[2] = xz - wy;
          te[6] = yz + wx;
          te[10] = 1 - (xx + yy);

          // last column
          te[3] = 0;
          te[7] = 0;
          te[11] = 0;

          // bottom row
          te[12] = 0;
          te[13] = 0;
          te[14] = 0;
          te[15] = 1;

          return this;
        },

        lookAt: (function () {
          const x = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();
          const y = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();
          const z = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();

          return function lookAt(eye, target, up) {
            const te = this.elements;

            z.subVectors(eye, target);

            if (z.lengthSq() === 0) {
              // eye and target are in the same position

              z.z = 1;
            }

            z.normalize();
            x.crossVectors(up, z);

            if (x.lengthSq() === 0) {
              // up and z are parallel

              if (Math.abs(up.z) === 1) {
                z.x += 0.0001;
              } else {
                z.z += 0.0001;
              }

              z.normalize();
              x.crossVectors(up, z);
            }

            x.normalize();
            y.crossVectors(z, x);

            te[0] = x.x; te[4] = y.x; te[8] = z.x;
            te[1] = x.y; te[5] = y.y; te[9] = z.y;
            te[2] = x.z; te[6] = y.z; te[10] = z.z;

            return this;
          };
        }()),

        multiply(m, n) {
          if (n !== undefined) {
            console.warn('THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');
            return this.multiplyMatrices(m, n);
          }

          return this.multiplyMatrices(this, m);
        },

        premultiply(m) {
          return this.multiplyMatrices(m, this);
        },

        multiplyMatrices(a, b) {
          const ae = a.elements;
          const be = b.elements;
          const te = this.elements;

          const a11 = ae[0]; const a12 = ae[4]; const a13 = ae[8]; const
            a14 = ae[12];
          const a21 = ae[1]; const a22 = ae[5]; const a23 = ae[9]; const
            a24 = ae[13];
          const a31 = ae[2]; const a32 = ae[6]; const a33 = ae[10]; const
            a34 = ae[14];
          const a41 = ae[3]; const a42 = ae[7]; const a43 = ae[11]; const
            a44 = ae[15];

          const b11 = be[0]; const b12 = be[4]; const b13 = be[8]; const
            b14 = be[12];
          const b21 = be[1]; const b22 = be[5]; const b23 = be[9]; const
            b24 = be[13];
          const b31 = be[2]; const b32 = be[6]; const b33 = be[10]; const
            b34 = be[14];
          const b41 = be[3]; const b42 = be[7]; const b43 = be[11]; const
            b44 = be[15];

          te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
          te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
          te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
          te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

          te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
          te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
          te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
          te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

          te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
          te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
          te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
          te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

          te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
          te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
          te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
          te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

          return this;
        },

        multiplyScalar(s) {
          const te = this.elements;

          te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
          te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
          te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
          te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

          return this;
        },

        applyToBufferAttribute: (function () {
          const v1 = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();

          return function applyToBufferAttribute(attribute) {
            for (let i = 0, l = attribute.count; i < l; i++) {
              v1.x = attribute.getX(i);
              v1.y = attribute.getY(i);
              v1.z = attribute.getZ(i);

              v1.applyMatrix4(this);

              attribute.setXYZ(i, v1.x, v1.y, v1.z);
            }

            return attribute;
          };
        }()),

        determinant() {
          const te = this.elements;

          const n11 = te[0]; const n12 = te[4]; const n13 = te[8]; const
            n14 = te[12];
          const n21 = te[1]; const n22 = te[5]; const n23 = te[9]; const
            n24 = te[13];
          const n31 = te[2]; const n32 = te[6]; const n33 = te[10]; const
            n34 = te[14];
          const n41 = te[3]; const n42 = te[7]; const n43 = te[11]; const
            n44 = te[15];

          // TODO: make this more efficient
          // ( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

          return (
            n41 * (
              +n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
            )
			+ n42 * (
			  +n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			)
			+ n43 * (
			  +n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			)
			+ n44 * (
			  -n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

          );
        },

        transpose() {
          const te = this.elements;
          let tmp;

          tmp = te[1]; te[1] = te[4]; te[4] = tmp;
          tmp = te[2]; te[2] = te[8]; te[8] = tmp;
          tmp = te[6]; te[6] = te[9]; te[9] = tmp;

          tmp = te[3]; te[3] = te[12]; te[12] = tmp;
          tmp = te[7]; te[7] = te[13]; te[13] = tmp;
          tmp = te[11]; te[11] = te[14]; te[14] = tmp;

          return this;
        },

        setPosition(v) {
          const te = this.elements;

          te[12] = v.x;
          te[13] = v.y;
          te[14] = v.z;

          return this;
        },

        getInverse(m, throwOnDegenerate) {
          // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
          const te = this.elements;
          const me = m.elements;

          const n11 = me[0]; const n21 = me[1]; const n31 = me[2]; const n41 = me[3];
          const n12 = me[4]; const n22 = me[5]; const n32 = me[6]; const n42 = me[7];
          const n13 = me[8]; const n23 = me[9]; const n33 = me[10]; const n43 = me[11];
          const n14 = me[12]; const n24 = me[13]; const n34 = me[14]; const n44 = me[15];

          const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
          const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
          const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
          const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

          const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

          if (det === 0) {
            const msg = "THREE.Matrix4: .getInverse() can't invert matrix, determinant is 0";

            if (throwOnDegenerate === true) {
              throw new Error(msg);
            } else {
              console.warn(msg);
            }

            return this.identity();
          }

          const detInv = 1 / det;

          te[0] = t11 * detInv;
          te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
          te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
          te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

          te[4] = t12 * detInv;
          te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
          te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
          te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

          te[8] = t13 * detInv;
          te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
          te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
          te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

          te[12] = t14 * detInv;
          te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
          te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
          te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

          return this;
        },

        scale(v) {
          const te = this.elements;
          const { x } = v;
          const { y } = v;
          const { z } = v;

          te[0] *= x; te[4] *= y; te[8] *= z;
          te[1] *= x; te[5] *= y; te[9] *= z;
          te[2] *= x; te[6] *= y; te[10] *= z;
          te[3] *= x; te[7] *= y; te[11] *= z;

          return this;
        },

        getMaxScaleOnAxis() {
          const te = this.elements;

          const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
          const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
          const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

          return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
        },

        makeTranslation(x, y, z) {
          this.set(

            1,
            0,
            0,
            x,
            0,
            1,
            0,
            y,
            0,
            0,
            1,
            z,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        makeRotationX(theta) {
          const c = Math.cos(theta); const
            s = Math.sin(theta);

          this.set(

            1,
            0,
            0,
            0,
            0,
            c,
            -s,
            0,
            0,
            s,
            c,
            0,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        makeRotationY(theta) {
          const c = Math.cos(theta); const
            s = Math.sin(theta);

          this.set(

			 c,
            0,
            s,
            0,
            0,
            1,
            0,
            0,
            -s,
            0,
            c,
            0,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        makeRotationZ(theta) {
          const c = Math.cos(theta); const
            s = Math.sin(theta);

          this.set(

            c,
            -s,
            0,
            0,
            s,
            c,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        makeRotationAxis(axis, angle) {
          // Based on http://www.gamedev.net/reference/articles/article1199.asp

          const c = Math.cos(angle);
          const s = Math.sin(angle);
          const t = 1 - c;
          const { x } = axis;
          const { y } = axis;
          const { z } = axis;
          const tx = t * x; const
            ty = t * y;

          this.set(

            tx * x + c,
            tx * y - s * z,
            tx * z + s * y,
            0,
            tx * y + s * z,
            ty * y + c,
            ty * z - s * x,
            0,
            tx * z - s * y,
            ty * z + s * x,
            t * z * z + c,
            0,
            0,
            0,
            0,
            1,

          );

		 return this;
        },

        makeScale(x, y, z) {
          this.set(

            x,
            0,
            0,
            0,
            0,
            y,
            0,
            0,
            0,
            0,
            z,
            0,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        makeShear(x, y, z) {
          this.set(

            1,
            y,
            z,
            0,
            x,
            1,
            z,
            0,
            x,
            y,
            1,
            0,
            0,
            0,
            0,
            1,

          );

          return this;
        },

        compose(position, quaternion, scale) {
          this.makeRotationFromQuaternion(quaternion);
          this.scale(scale);
          this.setPosition(position);

          return this;
        },

        decompose: (function () {
          const vector = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();
          const matrix = new Matrix4();

          return function decompose(position, quaternion, scale) {
            const te = this.elements;

            let sx = vector.set(te[0], te[1], te[2]).length();
            const sy = vector.set(te[4], te[5], te[6]).length();
            const sz = vector.set(te[8], te[9], te[10]).length();

            // if determine is negative, we need to invert one scale
            const det = this.determinant();
            if (det < 0) sx = -sx;

            position.x = te[12];
            position.y = te[13];
            position.z = te[14];

            // scale the rotation part
            matrix.copy(this);

            const invSX = 1 / sx;
            const invSY = 1 / sy;
            const invSZ = 1 / sz;

            matrix.elements[0] *= invSX;
            matrix.elements[1] *= invSX;
            matrix.elements[2] *= invSX;

            matrix.elements[4] *= invSY;
            matrix.elements[5] *= invSY;
            matrix.elements[6] *= invSY;

            matrix.elements[8] *= invSZ;
            matrix.elements[9] *= invSZ;
            matrix.elements[10] *= invSZ;

            quaternion.setFromRotationMatrix(matrix);

            scale.x = sx;
            scale.y = sy;
            scale.z = sz;

            return this;
          };
        }()),

        makePerspective(left, right, top, bottom, near, far) {
          if (far === undefined) {
            console.warn('THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.');
          }

          const te = this.elements;
          const x = 2 * near / (right - left);
          const y = 2 * near / (top - bottom);

          const a = (right + left) / (right - left);
          const b = (top + bottom) / (top - bottom);
          const c = -(far + near) / (far - near);
          const d = -2 * far * near / (far - near);

          te[0] = x;	te[4] = 0;	te[8] = a;	te[12] = 0;
          te[1] = 0;	te[5] = y;	te[9] = b;	te[13] = 0;
          te[2] = 0;	te[6] = 0;	te[10] = c;	te[14] = d;
          te[3] = 0;	te[7] = 0;	te[11] = -1;	te[15] = 0;

          return this;
        },

        makeOrthographic(left, right, top, bottom, near, far) {
          const te = this.elements;
          const w = 1.0 / (right - left);
          const h = 1.0 / (top - bottom);
          const p = 1.0 / (far - near);

          const x = (right + left) * w;
          const y = (top + bottom) * h;
          const z = (far + near) * p;

          te[0] = 2 * w;	te[4] = 0;	te[8] = 0;	te[12] = -x;
          te[1] = 0;	te[5] = 2 * h;	te[9] = 0;	te[13] = -y;
          te[2] = 0;	te[6] = 0;	te[10] = -2 * p;	te[14] = -z;
          te[3] = 0;	te[7] = 0;	te[11] = 0;	te[15] = 1;

          return this;
        },

        equals(matrix) {
          const te = this.elements;
          const me = matrix.elements;

          for (let i = 0; i < 16; i++) {
            if (te[i] !== me[i]) return false;
          }

          return true;
        },

        fromArray(array, offset) {
          if (offset === undefined) offset = 0;

          for (let i = 0; i < 16; i++) {
            this.elements[i] = array[i + offset];
          }

          return this;
        },

        toArray(array, offset) {
          if (array === undefined) array = [];
          if (offset === undefined) offset = 0;

          const te = this.elements;

          array[offset] = te[0];
          array[offset + 1] = te[1];
          array[offset + 2] = te[2];
          array[offset + 3] = te[3];

          array[offset + 4] = te[4];
          array[offset + 5] = te[5];
          array[offset + 6] = te[6];
          array[offset + 7] = te[7];

          array[offset + 8] = te[8];
          array[offset + 9] = te[9];
          array[offset + 10] = te[10];
          array[offset + 11] = te[11];

          array[offset + 12] = te[12];
          array[offset + 13] = te[13];
          array[offset + 14] = te[14];
          array[offset + 15] = te[15];

          return array;
        },

      });
      /***/ }),
    /* 2 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Object3D_js__ = __webpack_require__(9);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__util_util_js__ = __webpack_require__(7);

      class Group extends __WEBPACK_IMPORTED_MODULE_0__Object3D_js__['a' /* default */] {
        constructor(elem) {
          super();
          this.elemMatrixNeedUpdate = true; // 元素 Matrix 是否需要更新

          this.children = [];
          this.elem = elem || document.createElement('div');

          const groupStyle = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            'transform-style': 'preserve-3d',
          };

          __WEBPACK_IMPORTED_MODULE_1__util_util_js__['a' /* setStyles */](this.elem, groupStyle);
        }

        setNeedUpdate() {
          // overwrite
          super.setNeedUpdate();
          this.elemMatrixNeedUpdate = true;

          this.children.forEach((child) => {
            child.normalNeedUpdate = true;
            child.worldModelMatrixNeedUpdate = true;
          });
        }

        add(obj) {
          this.children.push(obj);
          obj.parent = this;

          if (obj.elem) {
            this.elem.appendChild(obj.elem);
          }
        }

        // updateElemMatrix() {
        //   if (this.elemMatrixNeedUpdate) {
        //     let modelMatrix = this.getModelMatrix().elements.map(num => num.toFixed(6));

        //     this.elem.style.transform = `translate(-50%, -50%) matrix3d(${modelMatrix.join(',')})`;
        //     this.elemMatrixNeedUpdate = false;
        //   }
        // }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Group;
      /***/ }),
    /* 3 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Object3D_js__ = __webpack_require__(9);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__util_util_js__ = __webpack_require__(7);

      class Face extends __WEBPACK_IMPORTED_MODULE_0__Object3D_js__['a' /* default */] {
        constructor(elem, options = {}) {
          super();
          this.options = options;
          this.elemMatrixNeedUpdate = true; // 元素 Matrix 是否需要更新
          this.elemLightNeedUpdate = true; // 元素 亮度 是否需要更新
          this.brightness = 1; // 元素亮度
          this.backside = false;
          this.lightHandler; // 自定义光照处理，接受 brightness 作为参数

          const faceStyles = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            overflow: 'hidden',
            'box-sizing': 'border-box',
          };

          this.elem = elem || document.createElement('div');
          if (this.options.name) {
            this.elem.classList.add(`c3-face-${this.options.name}`);
          }
          __WEBPACK_IMPORTED_MODULE_1__util_util_js__['a' /* setStyles */](this.elem, faceStyles);
        }

        setNeedUpdate() {
          super.setNeedUpdate();
          this.elemMatrixNeedUpdate = true;
          this.elemLightNeedUpdate = true;
        }

        setBrightness(brightness) {
          if (this.brightness !== brightness) {
            this.brightness = brightness;
            this.elemLightNeedUpdate = true;
          }
        }

        updateElemBrightness() {
          if (this.elemLightNeedUpdate) {
            if (typeof this.lightHandler === 'function') {
              this.lightHandler(this.elem, this.brightness);
            } else {
              this.elem.style.filter = `brightness(${this.brightness})`;
            }

            this.elemLightNeedUpdate = false;
          }
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Face;
      /***/ }),
    /* 4 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__ = __webpack_require__(0);

      class Light {
        constructor() {
          this.updated = true;
        }

        setNeedUpdate() {
          this.updated = true;
        }

        calBrightness(position, normal, backSide) {
          // overwrite

          return 0;
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Light;
      /***/ }),
    /* 5 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', () => _Math);
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
      /***/ }),
    /* 6 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', () => Quaternion);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Vector3__ = __webpack_require__(0);

      /**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

      function Quaternion(x, y, z, w) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = (w !== undefined) ? w : 1;
      }

      Object.assign(Quaternion, {

        slerp(qa, qb, qm, t) {
          return qm.copy(qa).slerp(qb, t);
        },

        slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
          // fuzz-free, array-based Quaternion SLERP operation

          let x0 = src0[srcOffset0 + 0];
          let y0 = src0[srcOffset0 + 1];
          let z0 = src0[srcOffset0 + 2];
          let w0 = src0[srcOffset0 + 3];

          const x1 = src1[srcOffset1 + 0];
          const y1 = src1[srcOffset1 + 1];
          const z1 = src1[srcOffset1 + 2];
          const w1 = src1[srcOffset1 + 3];

          if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
            let s = 1 - t;

            const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;

            const dir = (cos >= 0 ? 1 : -1);
            const sqrSin = 1 - cos * cos;

            // Skip the Slerp for tiny steps to avoid numeric problems:
            if (sqrSin > Number.EPSILON) {
              const sin = Math.sqrt(sqrSin);
              const len = Math.atan2(sin, cos * dir);

              s = Math.sin(s * len) / sin;
              t = Math.sin(t * len) / sin;
            }

            const tDir = t * dir;

            x0 = x0 * s + x1 * tDir;
            y0 = y0 * s + y1 * tDir;
            z0 = z0 * s + z1 * tDir;
            w0 = w0 * s + w1 * tDir;

            // Normalize in case we just did a lerp:
            if (s === 1 - t) {
              const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

              x0 *= f;
              y0 *= f;
              z0 *= f;
              w0 *= f;
            }
          }

          dst[dstOffset] = x0;
          dst[dstOffset + 1] = y0;
          dst[dstOffset + 2] = z0;
          dst[dstOffset + 3] = w0;
        },

      });

      Object.defineProperties(Quaternion.prototype, {

        x: {

          get() {
            return this._x;
          },

          set(value) {
            this._x = value;
            this.onChangeCallback();
          },

        },

        y: {

          get() {
            return this._y;
          },

          set(value) {
            this._y = value;
            this.onChangeCallback();
          },

        },

        z: {

          get() {
            return this._z;
          },

          set(value) {
            this._z = value;
            this.onChangeCallback();
          },

        },

        w: {

          get() {
            return this._w;
          },

          set(value) {
            this._w = value;
            this.onChangeCallback();
          },

        },

      });

      Object.assign(Quaternion.prototype, {

        set(x, y, z, w) {
          this._x = x;
          this._y = y;
          this._z = z;
          this._w = w;

          this.onChangeCallback();

          return this;
        },

        clone() {
          return new this.constructor(this._x, this._y, this._z, this._w);
        },

        copy(quaternion) {
          this._x = quaternion.x;
          this._y = quaternion.y;
          this._z = quaternion.z;
          this._w = quaternion.w;

          this.onChangeCallback();

          return this;
        },

        setFromEuler(euler, update) {
          if (!(euler && euler.isEuler)) {
            throw new Error('THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.');
          }

          const x = euler._x; const y = euler._y; const z = euler._z; const
            { order } = euler;

          // http://www.mathworks.com/matlabcentral/fileexchange/
          // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
          //	content/SpinCalc.m

          const { cos } = Math;
          const { sin } = Math;

          const c1 = cos(x / 2);
          const c2 = cos(y / 2);
          const c3 = cos(z / 2);

          const s1 = sin(x / 2);
          const s2 = sin(y / 2);
          const s3 = sin(z / 2);

          if (order === 'XYZ') {
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if (order === 'YXZ') {
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          } else if (order === 'ZXY') {
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if (order === 'ZYX') {
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          } else if (order === 'YZX') {
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if (order === 'XZY') {
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          }

          if (update !== false) this.onChangeCallback();

          return this;
        },

        setFromAxisAngle(axis, angle) {
          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

          // assumes axis is normalized

          const halfAngle = angle / 2; const
            s = Math.sin(halfAngle);

          this._x = axis.x * s;
          this._y = axis.y * s;
          this._z = axis.z * s;
          this._w = Math.cos(halfAngle);

          this.onChangeCallback();

          return this;
        },

        setFromRotationMatrix(m) {
          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

          // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

          const te = m.elements;

          const m11 = te[0]; const m12 = te[4]; const m13 = te[8];
          const m21 = te[1]; const m22 = te[5]; const m23 = te[9];
          const m31 = te[2]; const m32 = te[6]; const m33 = te[10];

          const trace = m11 + m22 + m33;
          let s;

          if (trace > 0) {
            s = 0.5 / Math.sqrt(trace + 1.0);

            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;
          } else if (m11 > m22 && m11 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this._w = (m32 - m23) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21) / s;
            this._z = (m13 + m31) / s;
          } else if (m22 > m33) {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;
          } else {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this._w = (m21 - m12) / s;
            this._x = (m13 + m31) / s;
            this._y = (m23 + m32) / s;
            this._z = 0.25 * s;
          }

          this.onChangeCallback();

          return this;
        },

        setFromUnitVectors: (function () {
          // assumes direction vectors vFrom and vTo are normalized

          let v1 = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();
          let r;

          const EPS = 0.000001;

          return function setFromUnitVectors(vFrom, vTo) {
            if (v1 === undefined) v1 = new __WEBPACK_IMPORTED_MODULE_0__Vector3__['a' /* Vector3 */]();

            r = vFrom.dot(vTo) + 1;

            if (r < EPS) {
              r = 0;

              if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                v1.set(-vFrom.y, vFrom.x, 0);
              } else {
                v1.set(0, -vFrom.z, vFrom.y);
              }
            } else {
              v1.crossVectors(vFrom, vTo);
            }

            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;

            return this.normalize();
          };
        }()),

        inverse() {
          return this.conjugate().normalize();
        },

        conjugate() {
          this._x *= -1;
          this._y *= -1;
          this._z *= -1;

          this.onChangeCallback();

          return this;
        },

        dot(v) {
          return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
        },

        lengthSq() {
          return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
        },

        length() {
          return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
        },

        normalize() {
          let l = this.length();

          if (l === 0) {
            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
          } else {
            l = 1 / l;

            this._x *= l;
            this._y *= l;
            this._z *= l;
            this._w *= l;
          }

          this.onChangeCallback();

          return this;
        },

        multiply(q, p) {
          if (p !== undefined) {
            console.warn('THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
            return this.multiplyQuaternions(q, p);
          }

          return this.multiplyQuaternions(this, q);
        },

        premultiply(q) {
          return this.multiplyQuaternions(q, this);
        },

        multiplyQuaternions(a, b) {
          // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

          const qax = a._x; const qay = a._y; const qaz = a._z; const
            qaw = a._w;
          const qbx = b._x; const qby = b._y; const qbz = b._z; const
            qbw = b._w;

          this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
          this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
          this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
          this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

          this.onChangeCallback();

          return this;
        },

        slerp(qb, t) {
          if (t === 0) return this;
          if (t === 1) return this.copy(qb);

          const x = this._x; const y = this._y; const z = this._z; const
            w = this._w;

          // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

          let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

          if (cosHalfTheta < 0) {
            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;

            cosHalfTheta = -cosHalfTheta;
          } else {
            this.copy(qb);
          }

          if (cosHalfTheta >= 1.0) {
            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;

            return this;
          }

          const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

          if (Math.abs(sinHalfTheta) < 0.001) {
            this._w = 0.5 * (w + this._w);
            this._x = 0.5 * (x + this._x);
            this._y = 0.5 * (y + this._y);
            this._z = 0.5 * (z + this._z);

            return this;
          }

          const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
          const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
          const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

          this._w = (w * ratioA + this._w * ratioB);
          this._x = (x * ratioA + this._x * ratioB);
          this._y = (y * ratioA + this._y * ratioB);
          this._z = (z * ratioA + this._z * ratioB);

          this.onChangeCallback();

          return this;
        },

        equals(quaternion) {
          return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);
        },

        fromArray(array, offset) {
          if (offset === undefined) offset = 0;

          this._x = array[offset];
          this._y = array[offset + 1];
          this._z = array[offset + 2];
          this._w = array[offset + 3];

          this.onChangeCallback();

          return this;
        },

        toArray(array, offset) {
          if (array === undefined) array = [];
          if (offset === undefined) offset = 0;

          array[offset] = this._x;
          array[offset + 1] = this._y;
          array[offset + 2] = this._z;
          array[offset + 3] = this._w;

          return array;
        },

        onChange(callback) {
          this.onChangeCallback = callback;

          return this;
        },

        onChangeCallback() {},

      });
      /***/ }),
    /* 7 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (immutable) */ __webpack_exports__.a = setStyles;
      function setStyles(elem, styles) {
        for (const item in styles) {
          let value = styles[item];

          if (typeof value === 'number') {
            value += 'px';
          }

          elem.style[item] = value;
        }
      }
      /***/ }),
    /* 8 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      Object.defineProperty(__webpack_exports__, '__esModule', { value: true });
      const R360 = Math.PI * 2;
      /* harmony export (immutable) */ __webpack_exports__.R360 = R360;

      const R180 = Math.PI;
      /* harmony export (immutable) */ __webpack_exports__.R180 = R180;

      const R150 = Math.PI * 0.8333333333;
      /* harmony export (immutable) */ __webpack_exports__.R150 = R150;

      const R120 = Math.PI * 0.6666666666;
      /* harmony export (immutable) */ __webpack_exports__.R120 = R120;

      const R90 = Math.PI * 0.5;
      /* harmony export (immutable) */ __webpack_exports__.R90 = R90;

      const R60 = Math.PI * 0.3333333333;
      /* harmony export (immutable) */ __webpack_exports__.R60 = R60;

      const R45 = Math.PI * 0.25;
      /* harmony export (immutable) */ __webpack_exports__.R45 = R45;

      const R30 = Math.PI * 0.1666666667;
      /* harmony export (immutable) */ __webpack_exports__.R30 = R30;
      /***/ }),
    /* 9 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__ = __webpack_require__(0);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__ = __webpack_require__(1);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_2__math_Euler_js__ = __webpack_require__(10);

      class Object3D {
        constructor() {
          this.position = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, 0);
          this.worldPosition = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, 0);
          this.rotation = new __WEBPACK_IMPORTED_MODULE_2__math_Euler_js__['a' /* Euler */](0, 0, 0);
          this.scale = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](1, 1, 1);

          this.modelMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]();
          this.worldModelMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]();
          this.normal = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, 1);

          this.modelMatrixNeedUpdate = false;
          this.worldModelMatrixNeedUpdate = false;
          this.normalNeedUpdate = false;

          this.elem = null;
          this.userData = {};
        }

        setNeedUpdate() {
          this.modelMatrixNeedUpdate = true;
          this.worldModelMatrixNeedUpdate = true;
          this.normalNeedUpdate = true;
        }

        setPosition(x, y, z) {
          this.position.set(x, y, z);
          this.setNeedUpdate();
        }

        setPositionX(x) {
          this.position.x = x;
          this.setNeedUpdate();
        }

        setPositionY(y) {
          this.position.y = y;
          this.setNeedUpdate();
        }

        setPositionZ(z) {
          this.position.z = z;
          this.setNeedUpdate();
        }

        setRotation(x, y, z) {
          this.rotation.set(x, y, z);
          this.setNeedUpdate();
        }

        setRotationX(x) {
          this.rotation.x = x;
          this.setNeedUpdate();
        }

        setRotationY(y) {
          this.rotation.y = y;
          this.setNeedUpdate();
        }

        setRotationZ(z) {
          this.rotation.z = z;
          this.setNeedUpdate();
        }

        setScale(x, y, z) {
          this.scale.set(x, y, z);
          this.setNeedUpdate();
        }

        setScaleX(x) {
          this.scale.x = x;
          this.setNeedUpdate();
        }

        setScaleY(y) {
          this.scale.y = y;
          this.setNeedUpdate();
        }

        setScaleZ(z) {
          this.scale.z = z;
          this.setNeedUpdate();
        }

        getModelMatrix() {
          if (!this.modelMatrixNeedUpdate) {
            return this.modelMatrix;
          }

          const position = this.position.clone();
          const rotation = this.rotation.clone();
          const scale = this.scale.clone();

          // position.y *= -1;
          // rotation.y *= -1;
          // scale.y *= -1;

          const scaleMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]().makeScale(scale.x, scale.y, scale.z);
          const rotationMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]().makeRotationFromEuler(rotation);
          const translateMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]().makeTranslation(position.x, position.y, position.z);

          const modelMatrix = translateMatrix.multiply(rotationMatrix).multiply(scaleMatrix);
          // let modelMatrix = rotationMatrix.multiply(translateMatrix).multiply(scaleMatrix);

          this.modelMatrix = modelMatrix.clone();
          this.modelMatrixNeedUpdate = false;
          return modelMatrix;
        }

        getWorldModalMatrix() {
          if (!this.worldModelMatrixNeedUpdate) {
            return this.worldModelMatrix;
          }

          const { parent } = this;
          let matrix = this.getModelMatrix();

          if (parent) {
            matrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]().multiplyMatrices(parent.getWorldModalMatrix(), matrix);
          }

          this.worldModelMatrixNeedUpdate = false;
          this.worldModelMatrix = matrix.clone();
          return matrix;
        }

        getWorldNormal() {
          if (!this.normalNeedUpdate) {
            return this.normal;
          }

          let start = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, 0);
          let end = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, 1);
          const worldModelMatrix = this.getWorldModalMatrix();

          start = start.applyMatrix4(worldModelMatrix);
          end = end.applyMatrix4(worldModelMatrix);

          this.normal = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */]().subVectors(end, start);
          this.normalNeedUpdate = false;
          return this.normal.clone();
        }

        setModelMatrix(matrix) {
          this.modelMatrix = matrix;

          // todos: 根据 matrix 设置 position rotation scale

          this.elemMatrixNeedUpdate = true;
        }

        updateElemMatrix() {
          if (this.elemMatrixNeedUpdate) {
            const modelMatrix = this.getModelMatrix().elements.map((num) => num.toFixed(6));
            this.elem.style.transform = `translate(-50%, -50%) matrix3d(${modelMatrix.join(',')})`;
            this.elemMatrixNeedUpdate = false;
          }
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Object3D;
      /***/ }),
    /* 10 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', () => Euler);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Quaternion__ = __webpack_require__(6);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Vector3__ = __webpack_require__(0);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_2__Matrix4__ = __webpack_require__(1);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_3__Math__ = __webpack_require__(5);

      /**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

      function Euler(x, y, z, order) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._order = order || Euler.DefaultOrder;
      }

      Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];

      Euler.DefaultOrder = 'XYZ';

      Object.defineProperties(Euler.prototype, {

        x: {

          get() {
            return this._x;
          },

          set(value) {
            this._x = value;
            this.onChangeCallback();
          },

        },

        y: {

          get() {
            return this._y;
          },

          set(value) {
            this._y = value;
            this.onChangeCallback();
          },

        },

        z: {

          get() {
            return this._z;
          },

          set(value) {
            this._z = value;
            this.onChangeCallback();
          },

        },

        order: {

          get() {
            return this._order;
          },

          set(value) {
            this._order = value;
            this.onChangeCallback();
          },

        },

      });

      Object.assign(Euler.prototype, {

        isEuler: true,

        set(x, y, z, order) {
          this._x = x;
          this._y = y;
          this._z = z;
          this._order = order || this._order;

          this.onChangeCallback();

          return this;
        },

        clone() {
          return new this.constructor(this._x, this._y, this._z, this._order);
        },

        copy(euler) {
          this._x = euler._x;
          this._y = euler._y;
          this._z = euler._z;
          this._order = euler._order;

          this.onChangeCallback();

          return this;
        },

        setFromRotationMatrix(m, order, update) {
          const { clamp } = __WEBPACK_IMPORTED_MODULE_3__Math__['a' /* _Math */];

          // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

          const te = m.elements;
          const m11 = te[0]; const m12 = te[4]; const
            m13 = te[8];
          const m21 = te[1]; const m22 = te[5]; const
            m23 = te[9];
          const m31 = te[2]; const m32 = te[6]; const
            m33 = te[10];

          order = order || this._order;

          if (order === 'XYZ') {
            this._y = Math.asin(clamp(m13, -1, 1));

            if (Math.abs(m13) < 0.99999) {
              this._x = Math.atan2(-m23, m33);
              this._z = Math.atan2(-m12, m11);
            } else {
              this._x = Math.atan2(m32, m22);
              this._z = 0;
            }
          } else if (order === 'YXZ') {
            this._x = Math.asin(-clamp(m23, -1, 1));

            if (Math.abs(m23) < 0.99999) {
              this._y = Math.atan2(m13, m33);
              this._z = Math.atan2(m21, m22);
            } else {
              this._y = Math.atan2(-m31, m11);
              this._z = 0;
            }
          } else if (order === 'ZXY') {
            this._x = Math.asin(clamp(m32, -1, 1));

            if (Math.abs(m32) < 0.99999) {
              this._y = Math.atan2(-m31, m33);
              this._z = Math.atan2(-m12, m22);
            } else {
              this._y = 0;
              this._z = Math.atan2(m21, m11);
            }
          } else if (order === 'ZYX') {
            this._y = Math.asin(-clamp(m31, -1, 1));

            if (Math.abs(m31) < 0.99999) {
              this._x = Math.atan2(m32, m33);
              this._z = Math.atan2(m21, m11);
            } else {
              this._x = 0;
              this._z = Math.atan2(-m12, m22);
            }
          } else if (order === 'YZX') {
            this._z = Math.asin(clamp(m21, -1, 1));

            if (Math.abs(m21) < 0.99999) {
              this._x = Math.atan2(-m23, m22);
              this._y = Math.atan2(-m31, m11);
            } else {
              this._x = 0;
              this._y = Math.atan2(m13, m33);
            }
          } else if (order === 'XZY') {
            this._z = Math.asin(-clamp(m12, -1, 1));

            if (Math.abs(m12) < 0.99999) {
              this._x = Math.atan2(m32, m22);
              this._y = Math.atan2(m13, m11);
            } else {
              this._x = Math.atan2(-m23, m33);
              this._y = 0;
            }
          } else {
            console.warn(`THREE.Euler: .setFromRotationMatrix() given unsupported order: ${order}`);
          }

          this._order = order;

          if (update !== false) this.onChangeCallback();

          return this;
        },

        setFromQuaternion: (function () {
          const matrix = new __WEBPACK_IMPORTED_MODULE_2__Matrix4__['a' /* Matrix4 */]();

          return function setFromQuaternion(q, order, update) {
            matrix.makeRotationFromQuaternion(q);

            return this.setFromRotationMatrix(matrix, order, update);
          };
        }()),

        setFromVector3(v, order) {
          return this.set(v.x, v.y, v.z, order || this._order);
        },

        reorder: (function () {
          // WARNING: this discards revolution information -bhouston

          const q = new __WEBPACK_IMPORTED_MODULE_0__Quaternion__['a' /* Quaternion */]();

          return function reorder(newOrder) {
            q.setFromEuler(this);

            return this.setFromQuaternion(q, newOrder);
          };
        }()),

        equals(euler) {
          return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);
        },

        fromArray(array) {
          this._x = array[0];
          this._y = array[1];
          this._z = array[2];
          if (array[3] !== undefined) this._order = array[3];

          this.onChangeCallback();

          return this;
        },

        toArray(array, offset) {
          if (array === undefined) array = [];
          if (offset === undefined) offset = 0;

          array[offset] = this._x;
          array[offset + 1] = this._y;
          array[offset + 2] = this._z;
          array[offset + 3] = this._order;

          return array;
        },

        toVector3(optionalResult) {
          if (optionalResult) {
            return optionalResult.set(this._x, this._y, this._z);
          }

          return new __WEBPACK_IMPORTED_MODULE_1__Vector3__['a' /* Vector3 */](this._x, this._y, this._z);
        },

        onChange(callback) {
          this.onChangeCallback = callback;

          return this;
        },

        onChangeCallback() {},

      });
      /***/ }),
    /* 11 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      Object.defineProperty(__webpack_exports__, '__esModule', { value: true });
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Face_js__ = __webpack_require__(3);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Group_js__ = __webpack_require__(2);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_2__Scene_js__ = __webpack_require__(12);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_3__Camera_js__ = __webpack_require__(13);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_4__Renderer_js__ = __webpack_require__(14);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_5__Light_js__ = __webpack_require__(4);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_6__DirectionLight_js__ = __webpack_require__(15);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_7__AmbientLight_js__ = __webpack_require__(16);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_8__geometry_Box_js__ = __webpack_require__(17);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_9__geometry_Cylinder_js__ = __webpack_require__(18);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_10__CONST_js__ = __webpack_require__(8);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_11__math_Math_js__ = __webpack_require__(5);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_12__math_Vector2_js__ = __webpack_require__(19);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_13__math_Vector3_js__ = __webpack_require__(0);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_14__math_Matrix4_js__ = __webpack_require__(1);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_15__math_Euler_js__ = __webpack_require__(10);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_16__math_Quaternion_js__ = __webpack_require__(6);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Face', () => __WEBPACK_IMPORTED_MODULE_0__Face_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Group', () => __WEBPACK_IMPORTED_MODULE_1__Group_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Scene', () => __WEBPACK_IMPORTED_MODULE_2__Scene_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Camera', () => __WEBPACK_IMPORTED_MODULE_3__Camera_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Renderer', () => __WEBPACK_IMPORTED_MODULE_4__Renderer_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'AmbientLight', () => __WEBPACK_IMPORTED_MODULE_7__AmbientLight_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'DirectionLight', () => __WEBPACK_IMPORTED_MODULE_6__DirectionLight_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Box', () => __WEBPACK_IMPORTED_MODULE_8__geometry_Box_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Cylinder', () => __WEBPACK_IMPORTED_MODULE_9__geometry_Cylinder_js__.a);
      /* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, 'CONST', () => __WEBPACK_IMPORTED_MODULE_10__CONST_js__);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Math', () => __WEBPACK_IMPORTED_MODULE_11__math_Math_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Vector2', () => __WEBPACK_IMPORTED_MODULE_12__math_Vector2_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Vector3', () => __WEBPACK_IMPORTED_MODULE_13__math_Vector3_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Matrix4', () => __WEBPACK_IMPORTED_MODULE_14__math_Matrix4_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Euler', () => __WEBPACK_IMPORTED_MODULE_15__math_Euler_js__.a);
      /* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, 'Quaternion', () => __WEBPACK_IMPORTED_MODULE_16__math_Quaternion_js__.a);
      /***/ }),
    /* 12 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Group_js__ = __webpack_require__(2);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Light_js__ = __webpack_require__(4);

      class Scene {
        constructor(container) {
          const viewWrapperStyles = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            'transform-style': 'preserve-3d',
          };

          this.container = container;
          this.width = this.container.offsetWidth;
          this.height = this.container.offsetHeight;

          this.viewWrapper = document.createElement('div');
          Object.assign(viewWrapperStyles, {
            width: this.width,
            height: this.height,
          });
          for (const item in viewWrapperStyles) {
            let value = viewWrapperStyles[item];

            if (typeof value === 'number') {
              value += 'px';
            }

            this.viewWrapper.style[item] = value;
          }

          this.container.appendChild(this.viewWrapper);
          this.objs = [];
          this.lights = [];

          this.sizeUpdated = true;
        }

        add(obj) {
          // let add = (o) => {
          //   if (o instanceof Group) {
          //     o.children.forEach(oc => add(oc));
          //   } else {
          //     this.viewWrapper.appendChild(o.elem);
          //     this.faces.push(o);
          //   }
          // }
          // add(obj);

          this.objs.push(obj);
          if (obj.elem) {
            this.viewWrapper.appendChild(obj.elem);
          }
        }

        addLight(light) {
          this.lights.push(light);
        }

        setAmbientLightIntensity(ambientLightIntensity) {
          this.ambientLightIntensity = ambientLightIntensity;
        }

        resize() {
          this.width = this.container.offsetWidth;
          this.height = this.container.offsetHeight;
          this.sizeUpdated = true;
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Scene;
      /***/ }),
    /* 13 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__ = __webpack_require__(0);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__ = __webpack_require__(1);

      class Camera {
        constructor(fov) {
          this.position = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, 0);
          this.lookAtPoint = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 0, -1);
          this.up = new __WEBPACK_IMPORTED_MODULE_0__math_Vector3_js__['a' /* Vector3 */](0, 1, 0);
          this.viewMatrixNeedUpdate = true;
          this.viewMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]();

          this.fov = fov;
          this.configUpdated = true;
        }

        setFov(fov) {
          this.fov = fov;
          this.configUpdated = true;
        }

        setNeedUpdate() {
          this.viewMatrixNeedUpdate = true;
        }

        setPosition(x, y, z) {
          this.position.set(x, y, z);
          this.setNeedUpdate();
        }

        setPositionX(x) {
          this.position.x = x;
          this.setNeedUpdate();
        }

        setPositionY(y) {
          this.position.y = y;
          this.setNeedUpdate();
        }

        setPositionZ(z) {
          this.position.z = z;
          this.setNeedUpdate();
        }

        translateX(x) {
          this.position.x += x;
          this.setNeedUpdate();
        }

        translateY(y) {
          this.position.y += y;
          this.setNeedUpdate();
        }

        translateZ(z) {
          this.position.z += z;
          this.setNeedUpdate();
        }

        setLookAt(x, y, z) {
          this.lookAtPoint.set(x, y, z);
          this.setNeedUpdate();
        }

        lookAt({ x, y, z }) {
          // alias for setLookAt
          this.setLookAt(x, y, z);
        }

        setLookAtX(x) {
          this.lookAtPoint.x = x;
          this.setNeedUpdate();
        }

        setLookAtY(y) {
          this.lookAtPoint.y = y;
          this.setNeedUpdate();
        }

        setLookAtZ(z) {
          this.lookAtPoint.z = z;
          this.setNeedUpdate();
        }

        setUp(x, y, z) {
          this.up.set(x, y, z);
          this.setNeedUpdate();
        }

        setUpX(x) {
          this.up.x = x;
          this.setNeedUpdate();
        }

        setUpY(y) {
          this.up.y = y;
          this.setNeedUpdate();
        }

        setUpZ(z) {
          this.up.z = z;
          this.setNeedUpdate();
        }

        getViewMatrix() {
          if (!this.viewMatrixNeedUpdate) {
            return this.viewMatrix;
          }

          const position = this.position.clone();
          const up = this.up.clone();
          const lookAtPoint = this.lookAtPoint.clone();

          // position.y *= -1;
          // up.y *= -1;
          // lookAtPoint.y *= -1;

          const translateMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]().makeTranslation(position.x, position.y, position.z);
          const viewMatrix = new __WEBPACK_IMPORTED_MODULE_1__math_Matrix4_js__['a' /* Matrix4 */]().lookAt(position, lookAtPoint, up);
          this.viewMatrixNeedUpdate = false;

          this.viewMatrix = translateMatrix.multiply(viewMatrix);

          this.viewMatrix.getInverse(this.viewMatrix);
          return this.viewMatrix.clone();
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Camera;
      /***/ }),
    /* 14 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Group_js__ = __webpack_require__(2);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Face_js__ = __webpack_require__(3);

      class Renderer {
        constructor(options) {
          const defaults = {
            lightEffect: false,
            clearColor: '',
          };

          options = Object.assign(defaults, options);
          this.options = options;
        }

        setObj(obj, lights, lightsUpdated) {
          if (obj instanceof __WEBPACK_IMPORTED_MODULE_1__Face_js__['a' /* default */]) {
            if (this.options.lightEffect && (lightsUpdated || obj.normalNeedUpdate)) {
              const faceNormal = obj.getWorldNormal();
              let sumBrightness = 0;

              lights.forEach((light) => {
                sumBrightness += light.calBrightness(obj.position, faceNormal, obj.backside);
              });

              obj.setBrightness(sumBrightness);
              obj.updateElemBrightness();
            }

            obj.updateElemMatrix();
          } else if (obj instanceof __WEBPACK_IMPORTED_MODULE_0__Group_js__['a' /* default */] && obj.children.length > 0) {
            obj.updateElemMatrix();
            obj.children.forEach((child) => this.setObj(child, lights));
          }
        }

        render(scene, camera) {
          const viewMatrixUpdated = camera.viewMatrixNeedUpdate;
          const viewMatrix = camera.getViewMatrix().elements.map((num) => num.toFixed(6));

          let perspectiveUpdated;

          if (scene.sizeUpdated || camera.configUpdated) {
            const perspective = scene.height / 2 / Math.tan(camera.fov / 2);
            perspectiveUpdated = true;
            if (camera.fov) {
              scene.container.style.perspective = `${perspective}px`;
            }

            scene.sizeUpdated = false;
            camera.configUpdated = false;
          }

          if (perspectiveUpdated || viewMatrixUpdated) {
            const perspective = scene.height / 2 / Math.tan(camera.fov / 2);

            scene.viewWrapper.style.transform = `matrix3d(${viewMatrix.join(',')})`;
          }

          // 光照处理
          let lightsUpdated = false;

          scene.lights.forEach((light) => {
            lightsUpdated = lightsUpdated || light.updated;
            light.updated = false;
          });
          scene.lights.forEach((light) => {
            lightsUpdated = lightsUpdated || light.updated;
            light.updated = false;
          });

          scene.objs.forEach((obj) => {
            this.setObj(obj, scene.lights, lightsUpdated);
          });
        }
      }

      /* harmony default export */ __webpack_exports__.a = (Renderer);
      /***/ }),
    /* 15 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Light_js__ = __webpack_require__(4);

      class DirectionLight extends __WEBPACK_IMPORTED_MODULE_0__Light_js__['a' /* default */] {
        constructor(position, intensity) {
          super();
          this.position = position || new Vector3(0, 1, 0);
          this.intensity = intensity || 1;
          this.updated = true;
        }

        setNeedUpdate() {
          this.updated = true;
        }

        setPosition(x, y, z) {
          this.position.set(x, y, z);
          this.setNeedUpdate();
        }

        setPositionX(x) {
          this.position.x = x;
          this.setNeedUpdate();
        }

        setPositionY(y) {
          this.position.y = y;
          this.setNeedUpdate();
        }

        setPositionZ(z) {
          this.position.z = z;
          this.setNeedUpdate();
        }

        setIntensity(intense) {
          this.intensity = intensity;
          setNeedUpdate();
        }

        calBrightness(position, normal, backside) {
          // overwrite

          const lightPosition = this.position.clone();
          // lightPosition.y *= -1;

          const cosOfAngle = lightPosition.dot(normal) / (lightPosition.length() * 1);
          let brightness = 0;

          if (backside) {
            brightness = Math.abs(cosOfAngle);
          } else {
            brightness = cosOfAngle < 0 ? 0 : cosOfAngle;
          }

          // console.log(brightness);
          brightness *= this.intensity;

          return brightness;
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = DirectionLight;
      /***/ }),
    /* 16 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Light_js__ = __webpack_require__(4);

      class AmbientLight extends __WEBPACK_IMPORTED_MODULE_0__Light_js__['a' /* default */] {
        constructor(intensity) {
          super();
          this.intensity = intensity;
          this.updated = true;
        }

        setIntensity(intense) {
          this.intensity = intensity;
          setNeedUpdate();
        }

        calBrightness() {
          return this.intensity;
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = AmbientLight;
      /***/ }),
    /* 17 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Face_js__ = __webpack_require__(3);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Group_js__ = __webpack_require__(2);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_2__CONST_js__ = __webpack_require__(8);

      class Box extends __WEBPACK_IMPORTED_MODULE_1__Group_js__['a' /* default */] {
        constructor(width, height, depth, color) {
          super();
          this.width = width;
          this.height = height;
          this.depth = depth;

          this.faces = {
            front: new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](),
            back: new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](),
            left: new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](),
            right: new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](),
            top: new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](),
            bottom: new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](),
          };

          this.setSize(width, height, depth);

          for (const key in this.faces) {
            this.faces[key].elem.style.background = color;
            this.faces[key].elem.style.fontSize = '60px';
            this.faces[key].elem.style.color = 'red';
            this.faces[key].elem.style.textAlign = 'center';
            // this.faces[key].elem.innerHTML = '<span>CSS camera<span>';
            // this.faces[key].elem.innerHTML = 'css css css css css css';
            this.add(this.faces[key]);
          }
        }

        setSize(width, height, depth) {
          this.faces.front.setPosition(0, 0, depth / 2);
          this.faces.front.elem.style.width = `${width}px`;
          this.faces.front.elem.style.height = `${height}px`;

          this.faces.back.setPosition(0, 0, -depth / 2);
          this.faces.back.rotation.x = __WEBPACK_IMPORTED_MODULE_2__CONST_js__.R180;
          this.faces.back.elem.style.width = `${width}px`;
          this.faces.back.elem.style.height = `${height}px`;

          this.faces.left.setPosition(-width / 2, 0, 0);
          this.faces.left.rotation.y = -__WEBPACK_IMPORTED_MODULE_2__CONST_js__.R90;
          this.faces.left.elem.style.width = `${depth}px`;
          this.faces.left.elem.style.height = `${height}px`;

          this.faces.right.setPosition(width / 2, 0, 0);
          this.faces.right.rotation.y = __WEBPACK_IMPORTED_MODULE_2__CONST_js__.R90;
          this.faces.right.elem.style.width = `${depth}px`;
          this.faces.right.elem.style.height = `${height}px`;

          this.faces.top.setPosition(0, height / 2, 0);
          this.faces.top.rotation.x = -__WEBPACK_IMPORTED_MODULE_2__CONST_js__.R90;
          this.faces.top.elem.style.width = `${width}px`;
          this.faces.top.elem.style.height = `${depth}px`;

          this.faces.bottom.setPosition(0, -height / 2, 0);
          this.faces.bottom.rotation.x = __WEBPACK_IMPORTED_MODULE_2__CONST_js__.R90;
          this.faces.bottom.elem.style.width = `${width}px`;
          this.faces.bottom.elem.style.height = `${depth}px`;
          this.width = width;
          this.height = height;
          this.depth = depth;
        }

        setColor(color) {
          if (!color) {
            return;
          }

          this.color = color;
          for (const key in this.faces) {
            this.faces[key].elem.style.color = color;
          }
        }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Box;
      /***/ }),
    /* 18 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_0__Face_js__ = __webpack_require__(3);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_1__Group_js__ = __webpack_require__(2);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_2__math_Vector3_js__ = __webpack_require__(0);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_3__math_Matrix4_js__ = __webpack_require__(1);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_4__CONST_js__ = __webpack_require__(8);
      /* harmony import */ const __WEBPACK_IMPORTED_MODULE_5__util_util_js__ = __webpack_require__(7);

      class Cylinder extends __WEBPACK_IMPORTED_MODULE_1__Group_js__['a' /* default */] {
        constructor(options) {
          super();

          this.options = options;
          // this.radiusBottom = radiusBottom;
          // this.radiusTop = radiusTop;
          // this.height = height;
          // this.sideBackground = sideBackground;
          // this.topBackground = topBackground;
          // this.bottomBackground = bottomBackground;
          // this.radiusSegment = radiusSegment;

          this.createFaces(options);
        }

        createFaces(options) {
          const {
            radiusTop, radiusBottom, height, radiusSegment, sideBackground, topBackground, bottomBackground,
          } = options;

          const segmentRadian = Math.PI * 2 / radiusSegment;
          const segmentRadianHalf = segmentRadian / 2;
          const cosSegmentRadianHalf = Math.cos(segmentRadianHalf);
          const sinSegmentRadianHalf = Math.sin(segmentRadianHalf);

          // 顶面
          const topTriangleHeight = radiusTop * cosSegmentRadianHalf;
          const topTriangleWidth = radiusTop * sinSegmentRadianHalf * 2;

          // 底面
          const bottomTriangleHeight = radiusBottom * cosSegmentRadianHalf;
          const bottomTriangleWidth = radiusBottom * sinSegmentRadianHalf * 2;

          const maxTriangleWidth = Math.max(topTriangleWidth, bottomTriangleWidth);

          // sub
          const endHeightSub = bottomTriangleHeight - topTriangleHeight;
          const endWidthSub = bottomTriangleWidth - topTriangleWidth;
          const endWidthSubHalf = endWidthSub / 2;
          const endWidthSubHalfAbs = Math.abs(endWidthSubHalf);

          // console.log(topTriangleHeight, bottomTriangleHeight);

          // 侧面
          const sideFaceRadian = Math.atan(endHeightSub / height);
          const sideHeight = height / Math.cos(sideFaceRadian);

          const sideBaseMatrix = new __WEBPACK_IMPORTED_MODULE_3__math_Matrix4_js__['a' /* Matrix4 */]().makeTranslation(0, sideHeight / 2, 0);

          sideBaseMatrix.multiplyMatrices(
            new __WEBPACK_IMPORTED_MODULE_3__math_Matrix4_js__['a' /* Matrix4 */]().makeRotationX(sideFaceRadian),
            sideBaseMatrix,
          );

          sideBaseMatrix.multiplyMatrices(
            new __WEBPACK_IMPORTED_MODULE_3__math_Matrix4_js__['a' /* Matrix4 */]().makeTranslation(0, -height / 2, topTriangleHeight),
            sideBaseMatrix,
          );

          const sideFaceStyles = {
            height: sideHeight,
          };
          if (endWidthSub > 0) {
            Object.assign(sideFaceStyles, {
              '-webkit-clip-path': `polygon(0 100%, ${endWidthSubHalfAbs}px 0, ${Math.abs(bottomTriangleWidth) - endWidthSubHalfAbs}px 0, 100% 100%)`,
              width: bottomTriangleWidth,
            });
          } else if (endWidthSub < 0) {
            Object.assign(sideFaceStyles, {
              '-webkit-clip-path': `polygon(0 0, ${endWidthSubHalfAbs}px 100%, ${Math.abs(topTriangleWidth) - endWidthSubHalfAbs}px 100%, 100% 0%)`,
              width: topTriangleWidth,
            });
          } else {
            Object.assign(sideFaceStyles, {
              width: topTriangleWidth,
            });
          }

          if (sideBackground) {
            Object.assign(sideFaceStyles, {
              background: sideBackground,
              'background-size': `auto ${sideHeight}px`,
            });
          }

          for (let i = 0; i < radiusSegment; i++) {
            const sideFace = new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */](null, { name: `cylinder-side${i}` });
            const faceMatrix = new __WEBPACK_IMPORTED_MODULE_3__math_Matrix4_js__['a' /* Matrix4 */]().makeRotationAxis(
              new __WEBPACK_IMPORTED_MODULE_2__math_Vector3_js__['a' /* Vector3 */](0, 1, 0),
              i * segmentRadian,
            );

            __WEBPACK_IMPORTED_MODULE_5__util_util_js__['a' /* setStyles */](sideFace.elem, sideFaceStyles);
            if (sideBackground) {
              sideFace.elem.style['background-position'] = `${-maxTriangleWidth * i}px 0`;
            }

            faceMatrix.multiplyMatrices(
              faceMatrix,
              sideBaseMatrix,
            );

            sideFace.setModelMatrix(faceMatrix);
            // sideFace.elem.innerHTML = 'css css css css css css css css css css css css css css css css css css css css css css css css css '
            this.add(sideFace);
          }

          if (options.open) {
            return;
          }

          // 顶面
          const topVertices = [];
          const bottomVertices = [];
          const topStyles = {
            width: radiusTop * 2,
            height: radiusTop * 2,
            background: topBackground,
            'background-size': '100% 100%',
          };
          const bottomStyles = {
            width: radiusBottom * 2,
            height: radiusBottom * 2,
            background: bottomBackground,
            'background-size': '100%',
          };
          const startRadian = -segmentRadianHalf - __WEBPACK_IMPORTED_MODULE_4__CONST_js__.R90;

          for (let i = 0; i < radiusSegment; i++) {
            const currentRadian = startRadian - i * segmentRadian;
            topVertices.push([
              Math.cos(currentRadian) * radiusTop + radiusTop,
              Math.sin(currentRadian) * radiusTop + radiusTop,
            ]);
            bottomVertices.push([
              Math.cos(currentRadian) * radiusBottom + radiusBottom,
              Math.sin(currentRadian) * radiusBottom + radiusBottom,
            ]);
          }

          const topClipStyle = topVertices.map((vertice) => `${vertice[0]}px ${vertice[1]}px`).join(',');
          const bottomClipStyle = bottomVertices.map((vertice) => `${vertice[0]}px ${vertice[1]}px`).join(',');
          Object.assign(topStyles, { '-webkit-clip-path': `polygon(${topClipStyle})` });
          Object.assign(bottomStyles, { '-webkit-clip-path': `polygon(${bottomClipStyle})` });

          const topFace = new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */]();
          const bottomFace = new __WEBPACK_IMPORTED_MODULE_0__Face_js__['a' /* default */]();

          topFace.setPosition(0, -height / 2, 0);
          topFace.setRotation(__WEBPACK_IMPORTED_MODULE_4__CONST_js__.R90, 0, 0);

          bottomFace.setPosition(0, height / 2, 0);
          bottomFace.setRotation(-__WEBPACK_IMPORTED_MODULE_4__CONST_js__.R90, 0, 0);

          __WEBPACK_IMPORTED_MODULE_5__util_util_js__['a' /* setStyles */](topFace.elem, topStyles);
          __WEBPACK_IMPORTED_MODULE_5__util_util_js__['a' /* setStyles */](bottomFace.elem, bottomStyles);

          this.add(topFace);
          this.add(bottomFace);
        }

        // setbackground(background) {
        //   if (!background) {
        //     return;
        //   }

        //   this.background = background;
        //   for (let key in this.faces) {
        //     this.faces[key].elem.style.background = background;
        //   }
        // }
      }
      /* harmony export (immutable) */ __webpack_exports__.a = Cylinder;
      /***/ }),
    /* 19 */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', () => Vector2);
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
      /***/ }),
    /** *** */ ]))));
// # sourceMappingURL=C3.js.map
