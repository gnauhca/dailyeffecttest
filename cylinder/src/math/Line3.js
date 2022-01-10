import { Vector3 } from './Vector3';
import { _Math } from './Math';

/**
 * @author bhouston / http://clara.io
 */

function Line3(start, end) {
  this.start = (start !== undefined) ? start : new Vector3();
  this.end = (end !== undefined) ? end : new Vector3();
}

Object.assign(Line3.prototype, {

  set(start, end) {
    this.start.copy(start);
    this.end.copy(end);

    return this;
  },

  clone() {
    return new this.constructor().copy(this);
  },

  copy(line) {
    this.start.copy(line.start);
    this.end.copy(line.end);

    return this;
  },

  getCenter(optionalTarget) {
    const result = optionalTarget || new Vector3();
    return result.addVectors(this.start, this.end).multiplyScalar(0.5);
  },

  delta(optionalTarget) {
    const result = optionalTarget || new Vector3();
    return result.subVectors(this.end, this.start);
  },

  distanceSq() {
    return this.start.distanceToSquared(this.end);
  },

  distance() {
    return this.start.distanceTo(this.end);
  },

  at(t, optionalTarget) {
    const result = optionalTarget || new Vector3();

    return this.delta(result).multiplyScalar(t).add(this.start);
  },

  closestPointToPointParameter: (function () {
    const startP = new Vector3();
    const startEnd = new Vector3();

    return function closestPointToPointParameter(point, clampToLine) {
      startP.subVectors(point, this.start);
      startEnd.subVectors(this.end, this.start);

      const startEnd2 = startEnd.dot(startEnd);
      const startEnd_startP = startEnd.dot(startP);

      let t = startEnd_startP / startEnd2;

      if (clampToLine) {
        t = _Math.clamp(t, 0, 1);
      }

      return t;
    };
  }()),

  closestPointToPoint(point, clampToLine, optionalTarget) {
    const t = this.closestPointToPointParameter(point, clampToLine);

    const result = optionalTarget || new Vector3();

    return this.delta(result).multiplyScalar(t).add(this.start);
  },

  applyMatrix4(matrix) {
    this.start.applyMatrix4(matrix);
    this.end.applyMatrix4(matrix);

    return this;
  },

  equals(line) {
    return line.start.equals(this.start) && line.end.equals(this.end);
  },

});

export { Line3 };
