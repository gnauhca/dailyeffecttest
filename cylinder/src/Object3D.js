import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';
import { Euler } from './math/Euler.js';

export default class Object3D {
  constructor() {
    this.position = new Vector3(0, 0, 0);
    this.worldPosition = new Vector3(0, 0, 0);
    this.rotation = new Euler(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);

    this.modelMatrix = new Matrix4();
    this.worldModelMatrix = new Matrix4();
    this.normal = new Vector3(0, 0, 1);

    this.modelMatrixNeedUpdate = false;
    this.worldModelMatrixNeedUpdate = false;
    this.normalNeedUpdate = false;

    this.elem = null;
    this.userData = {};
  }

  setNeedUpdate() {
    this.modelMatrixNeedUpdate = true;
    this.worldModelMatrixNeedUpdate = true;
    this.normalNeedUpdate = true;
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.setNeedUpdate();
  }

  setPositionX(x) {
    this.position.x = x;
    this.setNeedUpdate();
  }

  setPositionY(y) {
    this.position.y = y;
    this.setNeedUpdate();
  }

  setPositionZ(z) {
    this.position.z = z;
    this.setNeedUpdate();
  }


  setRotation(x, y, z) {
    this.rotation.set(x, y, z);
    this.setNeedUpdate();
  }

  setRotationX(x) {
    this.rotation.x = x;
    this.setNeedUpdate();
  }

  setRotationY(y) {
    this.rotation.y = y;
    this.setNeedUpdate();
  }

  setRotationZ(z) {
    this.rotation.z = z;
    this.setNeedUpdate();
  }


  setScale(x, y, z) {
    this.scale.set(x, y, z);
    this.setNeedUpdate();
  }

  setScaleX(x) {
    this.scale.x = x;
    this.setNeedUpdate();
  }

  setScaleY(y) {
    this.scale.y = y;
    this.setNeedUpdate();
  }

  setScaleZ(z) {
    this.scale.z = z;
    this.setNeedUpdate();
  }

  getModelMatrix() {
    if (!this.modelMatrixNeedUpdate) {
      return this.modelMatrix;
    }

    let position = this.position.clone();
    let rotation = this.rotation.clone();
    let scale = this.scale.clone();

    // position.y *= -1;
    // rotation.y *= -1;
    // scale.y *= -1;

    let scaleMatrix = new Matrix4().makeScale(scale.x, scale.y, scale.z);
    let rotationMatrix = new Matrix4().makeRotationFromEuler(rotation);
    let translateMatrix = new Matrix4().makeTranslation(position.x, position.y, position.z);

    let modelMatrix = translateMatrix.multiply(rotationMatrix).multiply(scaleMatrix);
    // let modelMatrix = rotationMatrix.multiply(translateMatrix).multiply(scaleMatrix);

    this.modelMatrix = modelMatrix.clone();
    this.modelMatrixNeedUpdate = false;
    return modelMatrix;
  }

  getWorldModalMatrix() {
    if (!this.worldModelMatrixNeedUpdate) {
      return this.worldModelMatrix;
    }

    let parent = this.parent;
    let matrix = this.getModelMatrix();

    if (parent) {
      matrix = new Matrix4().multiplyMatrices(parent.getWorldModalMatrix(), matrix);
    }

    this.worldModelMatrixNeedUpdate = false;
    this.worldModelMatrix = matrix.clone();
    return matrix;
  }

  getWorldNormal() {
    if (!this.normalNeedUpdate) {
      return this.normal;
    }

    let start = new Vector3(0, 0, 0);
    let end = new Vector3(0, 0, 1);
    let worldModelMatrix = this.getWorldModalMatrix();

    start = start.applyMatrix4(worldModelMatrix);
    end = end.applyMatrix4(worldModelMatrix);

    this.normal = new Vector3().subVectors(end, start);
    this.normalNeedUpdate = false;
    return this.normal.clone();
  }

  setModelMatrix(matrix) {
    this.modelMatrix = matrix;

    // todos: 根据 matrix 设置 position rotation scale

    this.elemMatrixNeedUpdate = true;
  }

  updateElemMatrix() {
    if (this.elemMatrixNeedUpdate) {
      let modelMatrix = this.getModelMatrix().elements.map(num => num.toFixed(6));
      this.elem.style.transform = `translate(-50%, -50%) matrix3d(${modelMatrix.join(',')})`;
      this.elem.style['-webkit-transform'] = `translate(-50%, -50%) matrix3d(${modelMatrix.join(',')})`;
      this.elemMatrixNeedUpdate = false;
    }
  }

}