export default class Light {
  constructor(position, intensity) {
    this.position = position || [0, -1, 0];
    this.intensity = intensity || 1;
    this.updated = true;
  }

  setNeedUpdate() {
    this.updated = true;
  }

  setPosition(vec3) {
    this.position = vec3;
    setNeedUpdate();
  }

  setIntensity(intense) {
    this.intensity = intensity;
    setNeedUpdate();
  }

  calBrightness(position, normal, backSide) {
    // overwrite

    // console.log(brightness);

    return brightness;
  }
}
