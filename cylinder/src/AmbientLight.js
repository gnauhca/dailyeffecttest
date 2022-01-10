import Light from './Light.js';

export default class AmbientLight extends Light {
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
