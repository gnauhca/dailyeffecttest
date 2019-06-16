import { Vector3 } from './math/Vector3.js';

export default class Light {
  constructor() {
    this.updated = true;
  }

  setNeedUpdate() {
    this.updated = true;;
  }

  calBrightness(position, normal, backSide) {
    // overwrite

    return 0;
  }

}