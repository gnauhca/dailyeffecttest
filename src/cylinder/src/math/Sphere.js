import { Box3 } from './Box3';
import { Vector3 } from './Vector3';

/**
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

function Sphere(center, radius) {
  this.center = (center !== undefined) ? center : new Vector3();
  this.radius = (radius !== undefined) ? radius : 0;
}

Object.assign(Sphere.prototype, {

  set(center, radius) {
    this.center.copy(center);
    this.radius = radius;

    return this;
  },

  setFromPoints: (function () {
    const box = new Box3();

    return function setFromPoints(points, optionalCenter) {
      const { center } = this;

      if (optionalCenter !== undefined) {
        center.copy(optionalCenter);
      } else {
        box.setFromPoints(points).getCenter(center);
      }

      let maxRadiusSq = 0;

      for (let i = 0, il = points.length; i < il; i++) {
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
      }

      this.radius = Math.sqrt(maxRadiusSq);

      return this;
    };
  }()),

  clone() {
    return new this.constructor().copy(this);
  },

  copy(sphere) {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;

    return this;
  },

  empty() {
    return (this.radius <= 0);
  },

  containsPoint(point) {
    return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
  },

  distanceToPoint(point) {
    return (point.distanceTo(this.center) - this.radius);
  },

  intersectsSphere(sphere) {
    const radiusSum = this.radius + sphere.radius;

    return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
  },

  intersectsBox(box) {
    return box.intersectsSphere(this);
  },

  intersectsPlane(plane) {
    // We use the following equation to compute the signed distance from
    // the center of the sphere to the plane.
    //
    // distance = q * n - d
    //
    // If this distance is greater than the radius of the sphere,
    // then there is no intersection.

    return Math.abs(this.center.dot(plane.normal) - plane.constant) <= this.radius;
  },

  clampPoint(point, optionalTarget) {
    const deltaLengthSq = this.center.distanceToSquared(point);

    const result = optionalTarget || new Vector3();

    result.copy(point);

    if (deltaLengthSq > (this.radius * this.radius)) {
      result.sub(this.center).normalize();
      result.multiplyScalar(this.radius).add(this.center);
    }

    return result;
  },

  getBoundingBox(optionalTarget) {
    const box = optionalTarget || new Box3();

    box.set(this.center, this.center);
    box.expandByScalar(this.radius);

    return box;
  },

  applyMatrix4(matrix) {
    this.center.applyMatrix4(matrix);
    this.radius *= matrix.getMaxScaleOnAxis();

    return this;
  },

  translate(offset) {
    this.center.add(offset);

    return this;
  },

  equals(sphere) {
    return sphere.center.equals(this.center) && (sphere.radius === this.radius);
  },

});

export { Sphere };
