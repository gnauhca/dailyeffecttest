import Object3D from './Object3D.js';
import * as util from './util/util.js';

export default class Group extends Object3D {
  constructor(elem) {
    super();
    this.elemMatrixNeedUpdate = true; // 元素 Matrix 是否需要更新

    this.children = [];
    this.elem = elem || document.createElement('div');

    const groupStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      'transform-style': 'preserve-3d',
    };

    util.setStyles(this.elem, groupStyle);
  }

  setNeedUpdate() {
    // overwrite
    super.setNeedUpdate();
    this.elemMatrixNeedUpdate = true;

    this.children.forEach((child) => {
      child.normalNeedUpdate = true;
      child.worldModelMatrixNeedUpdate = true;
    });
  }

  add(obj) {
    this.children.push(obj);
    obj.parent = this;

    if (obj.elem) {
      this.elem.appendChild(obj.elem);
    }
  }

  // updateElemMatrix() {
  //   if (this.elemMatrixNeedUpdate) {
  //     let modelMatrix = this.getModelMatrix().elements.map(num => num.toFixed(6));

  //     this.elem.style.transform = `translate(-50%, -50%) matrix3d(${modelMatrix.join(',')})`;
  //     this.elemMatrixNeedUpdate = false;
  //   }
  // }
}
