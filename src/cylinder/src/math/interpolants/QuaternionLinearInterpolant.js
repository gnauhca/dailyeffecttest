import { Interpolant } from '../Interpolant';
import { Quaternion } from '../Quaternion';

/**
 * Spherical linear unit quaternion interpolant.
 *
 * @author tschw
 */

function QuaternionLinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
  Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
}

QuaternionLinearInterpolant.prototype = Object.assign(Object.create(Interpolant.prototype), {

  constructor: QuaternionLinearInterpolant,

  interpolate_(i1, t0, t, t1) {
    const result = this.resultBuffer;
    const values = this.sampleValues;
    const stride = this.valueSize;

    let offset = i1 * stride;

    const alpha = (t - t0) / (t1 - t0);

    for (let end = offset + stride; offset !== end; offset += 4) {
      Quaternion.slerpFlat(
        result,
        0,
        values,
        offset - stride,
        values,
        offset,
        alpha,
      );
    }

    return result;
  },

});

export { QuaternionLinearInterpolant };
