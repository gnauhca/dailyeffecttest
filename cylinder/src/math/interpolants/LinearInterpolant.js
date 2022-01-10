import { Interpolant } from '../Interpolant';

/**
 * @author tschw
 */

function LinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
  Interpolant.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
}

LinearInterpolant.prototype = Object.assign(Object.create(Interpolant.prototype), {

  constructor: LinearInterpolant,

  interpolate_(i1, t0, t, t1) {
    const result = this.resultBuffer;
    const values = this.sampleValues;
    const stride = this.valueSize;

    const offset1 = i1 * stride;
    const offset0 = offset1 - stride;

    const weight1 = (t - t0) / (t1 - t0);
    const weight0 = 1 - weight1;

    for (let i = 0; i !== stride; ++i) {
      result[i] =					values[offset0 + i] * weight0
					+ values[offset1 + i] * weight1;
    }

    return result;
  },

});

export { LinearInterpolant };
