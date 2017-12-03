import { defaultsDeep } from 'lodash';

let getSurroundPoints = (function() { 
  let cache = {};
  let up = new THREE.Vector3(0, 1, 0);
  let xStart = new THREE.Vector3(1, 0, 0);

  return function(center, vector, radius, pointNum, zScale=1, xzAngle=0) { // console.log(vector.clone().normalize());

    let mesh = cache[pointNum];
    let angle = up.angleTo(vector);
    // let xzAngle = Math.atan(-vector.z / vector.x);
    let cross = new THREE.Vector3().crossVectors(up, vector).normalize();
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
      let geom = new THREE.CylinderGeometry(1, 1, 1, pointNum, 1, true);
      // geom.rotateX(Math.PI / 2);
      geom.scale(1, 1, 1);
      geom.translate(0, -0.5, 0);
      mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial);
      cache[pointNum] = mesh;
    }

    let vertices = mesh.geometry.vertices.slice(0, pointNum).map(v => {

      return v.clone()
              .setZ(v.z * zScale)
              .applyAxisAngle(up, xzAngle)
              .applyAxisAngle(cross, angle)
              .multiplyScalar(radius).add(center);
    });
    return vertices;
  }
})();


// 树枝，或者是一只不分裂的树枝的某一部分
export default class Branch {
  constructor(tree, parent, options) {
    let defaults = {
      start: undefined,
      // end: undefined,
      isIsolate: false,
      angles: [0, 0], 
      radiusStart: 1, // 开始半径
      radiusEnd: 1, // 结束半径
      length: 1, // 树枝 segment 长度
      currentLength: 0, // 树枝当前长度
      speed: 1, // 生长速度
      vector: null, 
      crossSection: [], // 横截面，由 xz 平面环绕 0, 0 的点组成,
      surroundPointZScale: undefined,
      surroundPointXZAngle: undefined
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.id = Branch.id++;
    this.tree = tree;
    this.parent = parent;
    this.deep = this.parent ? this.parent.deep + (this.endAtPercent < 1 ? 0 : 1) : 0;

    // if (typeof this.start === 'undefined') 
    this.start = this.parent ? parent.end : new THREE.Vector3; // 开始点

    if (typeof this.surroundPointZScale === 'undefined') 
    this.surroundPointZScale = this.parent ? parent.surroundPointZScale : 1;
    if (typeof this.surroundPointXZAngle === 'undefined') 
    this.surroundPointXZAngle = this.parent ? parent.surroundPointXZAngle : 1;

    let tmp = this.length * Math.cos(this.angles[1]);

    if (!this.vector) {
      this.vector = new THREE.Vector3(
        tmp * Math.cos(this.angles[0]),
        this.length * Math.sin(this.angles[1]),
        tmp * Math.sin(this.angles[0])
      );
    }

    this.end = new THREE.Vector3();

    this.connectedChild; // 直系子树枝，公用点
    this.isolatedChildren = []; // 非直系子树枝

    this.childrenConfig = {};

    this.createObjs();
    this.tree.addBranch(this);
  }

  createObjs() {
    // branch
    this.branchGeom = new THREE.Geometry();
    // this.material = new THREE.MeshBasicMaterial( { color : 0xdddddd, wireframe: true } );
    this.material = new THREE.MeshPhongMaterial( { color : 0xdddddd } );
    // this.material = new THREE.MeshNormalMaterial( { color : 0xdddddd, wireframe: 0 } );
    this.branchObj = new THREE.Mesh(this.branchGeom, this.material);
    this.branchObj.branch = this;

    for (let i = 0; i < 26; i++) {
      this.branchGeom.vertices.push(new THREE.Vector3);
    }

    let startPointIndex = 0;
    let endPointIndex = 13;
    let startPointNum = 13;
    let endPointNum = 13;

    for (let i = 0; i < endPointNum; i++) {
      this.branchGeom.faces.push(
        new THREE.Face3(
          startPointIndex + i,
          startPointIndex + (i + 1) % (startPointNum),
          endPointIndex + i
        ),
        new THREE.Face3(
          endPointIndex + i,
          startPointIndex + (i + 1) % (startPointNum),
          endPointIndex + (i + 1) % (endPointNum)
        )
      );
    }    

  }

  updateVector() {
    this.vector.subVectors(this.end, this.start); 
    this.length = this.vector.length();
    this.currentLength = this.length;
    this.vector.normalize();
  }

  updateBranch() {
    this.radiusStart = this.parent && !this.isIsolate ? this.parent.radiusEnd : this.radiusStart;

    let startSurroundVector = this.parent && !this.isIsolate ? this.parent.vector : this.vector;
    let surroundPointZScale = this.parent && !this.isIsolate ? this.parent.surroundPointZScale : this.surroundPointZScale;
    let surroundPointXZAngle = this.parent && !this.isIsolate ? this.parent.surroundPointXZAngle : this.surroundPointXZAngle;
    let startSurroundPoints = getSurroundPoints(this.start, startSurroundVector, this.radiusStart, 13, surroundPointZScale, surroundPointXZAngle);
    startSurroundPoints.forEach((point, i) => {
      this.branchGeom.vertices[i].copy(point);
    });

    // 更新 end
    this.end.addVectors(this.start, this.vector.clone().setLength(this.currentLength));

    let percent = this.currentLength / this.length
    let connectedChildVector = (this.connectedChild instanceof Branch) ? this.connectedChild.vector.clone() : this.vector.clone();
    let endSurroundPointVector = new THREE.Vector3().addVectors(
      this.vector, 
      connectedChildVector.setLength(percent)
    ).normalize();
    let endSurroundPoints = getSurroundPoints(this.end, this.vector/* , endSurroundPointVector */, this.radiusEnd, 13, this.surroundPointZScale, this.surroundPointXZAngle);
    endSurroundPoints.forEach((point, i) => {
      this.branchGeom.vertices[i + 13].copy(point);
    });


    if (this.connectedChild) {
      this.connectedChild.updateBranch();
    }
    this.isolatedChildren.forEach(branch => (branch instanceof Branch) && branch.updateBranch());

    this.branchGeom.verticesNeedUpdate = true; 
    this.branchGeom.normalsNeedUpdate = true; 
    this.branchGeom.computeFaceNormals(); 
    this.branchGeom.computeVertexNormals(); 
    this.branchGeom.computeBoundingSphere();
  }

  // grow
  grow(delta) { }

  generateChildBaseOptions() { }

  removeChild(child) {
    if (child === this.connectedChild) {
      this.connectedChild = null;
    } else {
      this.isolatedChildren = this.isolatedChildren.filter(isolatedChild => isolatedChild !== child);
    }
  }

  destroy() {
    this.connectedChild && this.connectedChild.destroy();
    this.isolatedChildren.forEach(child => child.destroy());
    this.tree.obj.remove(this.branchObj);
    this.parent && this.parent.removeChild(this);
    this.branchObj = null;
    this.tree = null;
    this.parent = null;
  }
}

Branch.id = 0;