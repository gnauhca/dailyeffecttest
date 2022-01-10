import Object3D from './Object3D.js';
import * as util from './util/util.js';

export default class Face extends Object3D {
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
    util.setStyles(this.elem, faceStyles);
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
