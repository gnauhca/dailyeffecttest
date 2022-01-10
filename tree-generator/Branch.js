import { defaultsDeep } from 'lodash';

const getSurroundPoints = (function () {
  const cache = {};
  const up = new THREE.Vector3(0, 1, 0);
  const xStart = new THREE.Vector3(1, 0, 0);

  return function (center, vector, radius, pointNum, zScale = 1, xzAngle = 0) { // console.log(vector.clone().normalize());
    let mesh = cache[pointNum];
    const angle = up.angleTo(vector);
    // let xzAngle = Math.atan(-vector.z / vector.x);
    const cross = new THREE.Vector3().crossVectors(up, vector.clone().normalize());
    // let sign = 1;

    // if (xzAngle > Math.PI / 2) {
    //   xzAngle -= Math.PI;
    // }

    // if (vector.z > 0) {
    //   xzAngle *= -1;
    // }

    // if (isNaN(xzAngle)) {
    //   xzAngle = 0;
    // }
    // if (vector.x < 0 /*&& vector.y < 0*/) {
    //   sign = -1;
    // }

    if (!mesh) {
      const geom = new THREE.CylinderGeometry(1, 1, 1, pointNum, 1, true);
      // geom.rotateX(Math.PI / 2);
      geom.scale(1, 1, 1);
      geom.translate(0, -0.5, 0);
      mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial());
      cache[pointNum] = mesh;
    }

    const vertices = mesh.geometry.vertices.slice(0, pointNum).map((v) => {
      const vector = v.clone().setZ(v.z * zScale);

      if (xzAngle) {
        vector.applyAxisAngle(up, xzAngle);
      }
      vector.applyAxisAngle(cross, angle).multiplyScalar(radius).add(center);

      vector.multiplyScalar(100).floor().multiplyScalar(0.01);

      return vector;
    });
    return vertices;
  };
}());

// 树枝，或者是一只不分裂的树枝的某一部分
export default class Branch {
  constructor(tree, parent, options, treeConfig) {
    const defaults = {
      delay: 0,
      start: undefined,
      // end: undefined,
      isIsolate: false,
      angles: [0, 0],
      startRadius: 1, // 开始半径
      endRadius: 1, // 结束半径
      length: 1, // 树枝 segment 长度
      currentLength: 0, // 树枝当前长度
      speed: 10, // 生长速度
      vector: null,
      crossSection: [], // 横截面，由 xz 平面环绕 0, 0 的点组成,
      pointsZScale: undefined,
      pointsXZAngle: undefined,

      startPointNum: 10,
      endPointNum: 10,
    };

    options = defaultsDeep({}, options, defaults);
    Object.assign(this, options);

    this.treeConfig = treeConfig;
    this.id = Branch.id++;
    this.tree = tree;
    this.parent = parent;
    this.deep = this.parent ? this.parent.deep + (this.endAtPercent < 1 ? 0 : 1) : 0;

    if (Array.isArray(this.start)) {
      this.start = new THREE.Vector3(...this.start);
    }
    if (Array.isArray(this.end)) {
      this.end = new THREE.Vector3(...this.end);
    }
    if (Array.isArray(this.vector)) {
      this.vector = new THREE.Vector3(...this.vector);
    }

    // if (typeof this.start === 'undefined')
    this.start = this.parent ? parent.end : (this.start || new THREE.Vector3()); // 开始点

    if (typeof this.pointsZScale === 'undefined') { this.pointsZScale = this.parent ? parent.pointsZScale : 1; }
    if (typeof this.pointsXZAngle === 'undefined') { this.pointsXZAngle = this.parent ? parent.pointsXZAngle : 0; }

    this.startPointNum = 10;// Math.max((this.startRadius / 0.5) | 0, 3);
    this.endPointNum = 10;// Math.max((this.endRadius / 0.5) | 0, 3);

    if (!this.vector) {
      const tmp = this.length * Math.cos(this.angles[1]);
      this.vector = new THREE.Vector3(
        tmp * Math.cos(this.angles[0]),
        this.length * Math.sin(this.angles[1]),
        tmp * Math.sin(this.angles[0]),
      );
    }

    this.end = new THREE.Vector3();

    this.childGenerated = false; // 是否已经生成了孩子
    this.connectedChild; // 直系子树枝，公用点
    this.isolatedChildren = []; // 非直系子树枝

    this.timePass = 0;

    this.childrenConfig = {};

    this.createObjs();
    this.tree.addBranch(this);
  }

  createObjs() {
    // branch
    this.branchGeom = new THREE.Geometry();
    // this.material = new THREE.MeshBasicMaterial( { color : 0xdddddd, wireframe: true } );
    // this.material = new THREE.MeshPhongMaterial( { color : 0xffffff } );
    this.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    this.material.opacity = 0.6;
    this.material.transparent = true;
    // this.material = new THREE.MeshNormalMaterial( { color : 0xdddddd, wireframe: 0 } );
    this.branchObj = new THREE.Mesh(this.branchGeom, this.material);
    this.branchObj.branch = this;

    const vecticeNum = this.startPointNum + this.endPointNum;
    for (let i = 0; i < vecticeNum; i++) {
      this.branchGeom.vertices.push(new THREE.Vector3());
    }

    for (let i = 0; i < this.startPointNum; i++) {
      this.branchGeom.faces.push(
        new THREE.Face3(
          i,
          (i + 1) % (this.startPointNum),
          this.startPointNum + i,
        ),
        new THREE.Face3(
          this.startPointNum + i,
          (i + 1) % (this.startPointNum),
          this.startPointNum + (i + 1) % (this.endPointNum),
        ),
      );
    }
  }

  updateVector() {
    this.vector.subVectors(this.end, this.start);
    this.length = this.vector.length();
    this.currentLength = this.length;
    this.vector.normalize();
  }

  getEndVertices() {
    return this.branchGeom.vertices.slice(this.endPointNum);
  }

  updateBranch() {
    this.startRadius = this.parent && !this.isIsolate ? this.parent.endRadius : this.startRadius;

    // 开始点
    let startPoints;
    if (this.isIsolate) {
      const startRadius = this.startRadius * this.tree.radiusPercent;
      startPoints = getSurroundPoints(
        this.start,
        this.vector,
        startRadius,
        this.startPointNum,
        this.pointsZScale,
        this.pointsXZAngle,
      );
    } else {
      startPoints = this.parent.getEndVertices();
    }

    startPoints.forEach((point, i) => {
      this.branchGeom.vertices[i].copy(point);
    });

    // 更新 end
    const currentLength = this.currentLength * this.tree.lengthPercent;
    this.end.addVectors(this.start, this.vector.clone().setLength(currentLength));

    const percent = this.currentLength / this.length;
    // let connectedChildVector = (this.connectedChild instanceof Branch) ? this.connectedChild.vector.clone() : this.vector.clone();
    // let endSurroundPointVector = new THREE.Vector3().addVectors(
    //   this.vector,
    //   connectedChildVector.setLength(percent)
    // ).normalize();
    const endRadius = this.endRadius * this.tree.radiusPercent;
    const endVector = new THREE.Vector3().addVectors(
      this.vector.clone().multiplyScalar(percent),
      (this.parent ? this.parent.vector : this.vector).clone().multiplyScalar(1 - percent),
    );
    // if (!this.childGenerated) {
    //   endRadius = 0;
    // }

    const endSurroundPoints = getSurroundPoints(
      this.end,
      endVector,
      endRadius,
      this.endPointNum,
      this.pointsZScale,
      this.pointsXZAngle,
    );
    endSurroundPoints.forEach((point, i) => {
      this.branchGeom.vertices[i + this.startPointNum].copy(point);
    });

    if (this.connectedChild) {
      this.connectedChild.updateBranch();
    }
    this.isolatedChildren.forEach((branch) => (branch instanceof Branch) && branch.updateBranch());

    this.branchGeom.verticesNeedUpdate = true;
    this.branchGeom.normalsNeedUpdate = true;
    this.branchGeom.computeFaceNormals();
    // this.branchGeom.computeVertexNormals();
    this.branchGeom.computeBoundingSphere();
  }

  // grow
  grow(delta) {
    const second = delta / 1000;
    this.timePass += delta;
    if (this.timePass < this.delay * 1000) {
      return;
    }

    if (this.currentLength >= this.length) {
      this.currentLength = this.length;
      !this.childGenerated && this.generateChildren();
    } else {
      this.currentLength += this.speed * second;
    }

    this.updateBranch();
  }

  generateChildren() {
    const configured = this.connectedChildId || this.isolatedChildrenIds;
    if (configured) {
      if (this.connectedChildId) {
        const connectedChildConfig = this.treeConfig.branches[this.connectedChildId];
        this.connectedChild = new Branch(this.tree, this, connectedChildConfig, this.treeConfig);
      }
      this.isolatedChildrenIds.forEach((isolatedChildId) => {
        const isolatedChildConfig = this.treeConfig.branches[isolatedChildId];
        this.isolatedChildren.push(
          new Branch(this.tree, this, isolatedChildConfig, this.treeConfig),
        );
      });
    }
    this.childGenerated = true;
  }

  generateChildBaseOptions() { }

  removeChild(child) {
    if (child === this.connectedChild) {
      this.connectedChild = null;
    } else {
      this.isolatedChildren = this.isolatedChildren.filter((isolatedChild) => isolatedChild !== child);
    }
  }

  destroy() {
    this.connectedChild && this.connectedChild.destroy();
    this.isolatedChildren.forEach((child) => child.destroy());
    this.tree.obj.remove(this.branchObj);
    this.parent && this.parent.removeChild(this);
    this.branchObj = null;
    this.tree = null;
    this.parent = null;
  }
}

Branch.id = 0;
