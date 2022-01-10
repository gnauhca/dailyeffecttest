import { Vector3 } from './math/Vector3.js';
import { Matrix4 } from './math/Matrix4.js';

export default class Camera {
  constructor(perspective) {
    this.position = new Vector3(0, 0, 0);
    this.lookAtPoint = new Vector3(0, 0, -1);
    this.up = new Vector3(0, 1, 0);
    this.viewMatrixNeedUpdate = true;
    this.viewMatrix = new Matrix4();

    this.perspective = perspective;
    this.configUpdated = true;
  }

  setPerspective(perspective) {
    this.perspective = perspective;
    this.configUpdated = true;
  }

  setNeedUpdate() {
    this.viewMatrixNeedUpdate = true;
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

  translateX(x) {
    this.position.x += x;
    this.setNeedUpdate();
  }

  translateY(y) {
    this.position.y += y;
    this.setNeedUpdate();
  }

  translateZ(z) {
    this.position.z += z;
    this.setNeedUpdate();
  }

  setLookAt(x, y, z) {
    this.lookAtPoint.set(x, y, z);
    this.setNeedUpdate();
  }

  lookAt({ x, y, z }) {
    // alias for setLookAt
    this.setLookAt(x, y, z);
  }

  setLookAtX(x) {
    this.lookAtPoint.x = x;
    this.setNeedUpdate();
  }

  setLookAtY(y) {
    this.lookAtPoint.y = y;
    this.setNeedUpdate();
  }

  setLookAtZ(z) {
    this.lookAtPoint.z = z;
    this.setNeedUpdate();
  }

  setUp(x, y, z) {
    this.up.set(x, y, z);
    this.setNeedUpdate();
  }

  setUpX(x) {
    this.up.x = x;
    this.setNeedUpdate();
  }

  setUpY(y) {
    this.up.y = y;
    this.setNeedUpdate();
  }

  setUpZ(z) {
    this.up.z = z;
    this.setNeedUpdate();
  }

  getViewMatrix() {
    if (!this.viewMatrixNeedUpdate) {
      return this.viewMatrix;
    }

    const position = this.position.clone();
    const up = this.up.clone();
    const lookAtPoint = this.lookAtPoint.clone();

    // position.y *= -1;
    // up.y *= -1;
    // lookAtPoint.y *= -1;

    const translateMatrix = new Matrix4().makeTranslation(position.x, position.y, position.z);
    const viewMatrix = new Matrix4().lookAt(position, lookAtPoint, up);
    this.viewMatrixNeedUpdate = false;

    this.viewMatrix = translateMatrix.multiply(viewMatrix);

    this.viewMatrix.getInverse(this.viewMatrix);
    return this.viewMatrix.clone();
  }
}
