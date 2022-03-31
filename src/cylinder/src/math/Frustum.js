import { Vector3 } from './Vector3';
import { Sphere } from './Sphere';
import { Plane } from './Plane';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://clara.io
 */

function Frustum(p0, p1, p2, p3, p4, p5) {
  this.planes = [

    (p0 !== undefined) ? p0 : new Plane(),
    (p1 !== undefined) ? p1 : new Plane(),
    (p2 !== undefined) ? p2 : new Plane(),
    (p3 !== undefined) ? p3 : new Plane(),
    (p4 !== undefined) ? p4 : new Plane(),
    (p5 !== undefined) ? p5 : new Plane(),

  ];
}

Object.assign(Frustum.prototype, {

  set(p0, p1, p2, p3, p4, p5) {
    const { planes } = this;

    planes[0].copy(p0);
    planes[1].copy(p1);
    planes[2].copy(p2);
    planes[3].copy(p3);
    planes[4].copy(p4);
    planes[5].copy(p5);

    return this;
  },

  clone() {
    return new this.constructor().copy(this);
  },

  copy(frustum) {
    const { planes } = this;

    for (let i = 0; i < 6; i++) {
      planes[i].copy(frustum.planes[i]);
    }

    return this;
  },

  setFromMatrix(m) {
    const { planes } = this;
    const me = m.elements;
    const me0 = me[0]; const me1 = me[1]; const me2 = me[2]; const
      me3 = me[3];
    const me4 = me[4]; const me5 = me[5]; const me6 = me[6]; const
      me7 = me[7];
    const me8 = me[8]; const me9 = me[9]; const me10 = me[10]; const
      me11 = me[11];
    const me12 = me[12]; const me13 = me[13]; const me14 = me[14]; const
      me15 = me[15];

    planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
    planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
    planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
    planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
    planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
    planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

    return this;
  },

  intersectsObject: (function () {
    const sphere = new Sphere();

    return function intersectsObject(object) {
      const { geometry } = object;

      if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

      sphere.copy(geometry.boundingSphere)
        .applyMatrix4(object.matrixWorld);

      return this.intersectsSphere(sphere);
    };
  }()),

  intersectsSprite: (function () {
    const sphere = new Sphere();

    return function intersectsSprite(sprite) {
      sphere.center.set(0, 0, 0);
      sphere.radius = 0.7071067811865476;
      sphere.applyMatrix4(sprite.matrixWorld);

      return this.intersectsSphere(sphere);
    };
  }()),

  intersectsSphere(sphere) {
    const { planes } = this;
    const { center } = sphere;
    const negRadius = -sphere.radius;

    for (let i = 0; i < 6; i++) {
      const distance = planes[i].distanceToPoint(center);

      if (distance < negRadius) {
        return false;
      }
    }

    return true;
  },

  intersectsBox: (function () {
    const p1 = new Vector3();
    const p2 = new Vector3();

    return function intersectsBox(box) {
      const { planes } = this;

      for (let i = 0; i < 6; i++) {
        const plane = planes[i];

        p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
        p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
        p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
        p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
        p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
        p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

        const d1 = plane.distanceToPoint(p1);
        const d2 = plane.distanceToPoint(p2);

        // if both outside plane, no intersection

        if (d1 < 0 && d2 < 0) {
          return false;
        }
      }

      return true;
    };
  }()),

  containsPoint(point) {
    const { planes } = this;

    for (let i = 0; i < 6; i++) {
      if (planes[i].distanceToPoint(point) < 0) {
        return false;
      }
    }

    return true;
  },

});

export { Frustum };
