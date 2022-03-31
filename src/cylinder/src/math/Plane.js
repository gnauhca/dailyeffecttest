import { Matrix3 } from './Matrix3';
import { Vector3 } from './Vector3';

/**
 * @author bhouston / http://clara.io
 */

function Plane(normal, constant) {
  this.normal = (normal !== undefined) ? normal : new Vector3(1, 0, 0);
  this.constant = (constant !== undefined) ? constant : 0;
}

Object.assign(Plane.prototype, {

  set(normal, constant) {
    this.normal.copy(normal);
    this.constant = constant;

    return this;
  },

  setComponents(x, y, z, w) {
    this.normal.set(x, y, z);
    this.constant = w;

    return this;
  },

  setFromNormalAndCoplanarPoint(normal, point) {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);

    return this;
  },

  setFromCoplanarPoints: (function () {
    const v1 = new Vector3();
    const v2 = new Vector3();

    return function setFromCoplanarPoints(a, b, c) {
      const normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();

      // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

      this.setFromNormalAndCoplanarPoint(normal, a);

      return this;
    };
  }()),

  clone() {
    return new this.constructor().copy(this);
  },

  copy(plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;
  },

  normalize() {
    // Note: will lead to a divide by zero if the plane is invalid.

    const inverseNormalLength = 1.0 / this.normal.length();
    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;

    return this;
  },

  negate() {
    this.constant *= -1;
    this.normal.negate();

    return this;
  },

  distanceToPoint(point) {
    return this.normal.dot(point) + this.constant;
  },

  distanceToSphere(sphere) {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  },

  projectPoint(point, optionalTarget) {
    const result = optionalTarget || new Vector3();

    return result.copy(this.normal).multiplyScalar(-this.distanceToPoint(point)).add(point);
  },

  intersectLine: (function () {
    const v1 = new Vector3();

    return function intersectLine(line, optionalTarget) {
      const result = optionalTarget || new Vector3();

      const direction = line.delta(v1);

      const denominator = this.normal.dot(direction);

      if (denominator === 0) {
        // line is coplanar, return origin
        if (this.distanceToPoint(line.start) === 0) {
          return result.copy(line.start);
        }

        // Unsure if this is the correct method to handle this case.
        return undefined;
      }

      const t = -(line.start.dot(this.normal) + this.constant) / denominator;

      if (t < 0 || t > 1) {
        return undefined;
      }

      return result.copy(direction).multiplyScalar(t).add(line.start);
    };
  }()),

  intersectsLine(line) {
    // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

    const startSign = this.distanceToPoint(line.start);
    const endSign = this.distanceToPoint(line.end);

    return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
  },

  intersectsBox(box) {
    return box.intersectsPlane(this);
  },

  intersectsSphere(sphere) {
    return sphere.intersectsPlane(this);
  },

  coplanarPoint(optionalTarget) {
    const result = optionalTarget || new Vector3();

    return result.copy(this.normal).multiplyScalar(-this.constant);
  },

  applyMatrix4: (function () {
    const v1 = new Vector3();
    const m1 = new Matrix3();

    return function applyMatrix4(matrix, optionalNormalMatrix) {
      const normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);

      const referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix);

      const normal = this.normal.applyMatrix3(normalMatrix).normalize();

      this.constant = -referencePoint.dot(normal);

      return this;
    };
  }()),

  translate(offset) {
    this.constant -= offset.dot(this.normal);

    return this;
  },

  equals(plane) {
    return plane.normal.equals(this.normal) && (plane.constant === this.constant);
  },

});

export { Plane };
