import { defaultsDeep } from 'lodash';

let getSurroundPoints = (function() { 
  let cache = {};
  let up = new THREE.Vector3(0, 1, 0);

  return function(center, vector, radius, pointNum) { // console.log(vector.clone().normalize());

    let mesh = cache[pointNum];
    let angle = up.angleTo(vector);
    let cross = new THREE.Vector3().crossVectors(up, vector).normalize();

    if (!mesh) {
      let geom = new THREE.CylinderGeometry(1, 1, 1, pointNum, 1, true);
      // geom.rotateX(Math.PI / 2);
      geom.translate(0, -0.5, 0);
      mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial);
      cache[pointNum] = mesh;
    }

    let vertices = mesh.geometry.vertices.slice(0, pointNum).map(v => {
      return v.clone().applyAxisAngle(cross, angle).setLength(radius).add(center);
    });
    return vertices;
  }
})();


// 树枝，或者是一只不分裂的树枝的某一部分
export default class Branch {
  constructor(tree, parent, options) {
    let defaults = {
      isIsolate: false,
      angles: [0, 0], 
      radiusStart: 1, // 开始半径
      radiusEnd: 1, // 结束半径
      length: 1, // 树枝 segment 长度
      currentLength: 0, // 树枝当前长度
      speed: 1, // 生长速度
      vector: null, 
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.id = Branch.id++;
    this.tree = tree;
    this.parent = parent;
    this.deep = this.parent ? this.parent.deep + (this.endAtPercent < 1 ? 0 : 1) : 0;
    this.start = this.parent ? parent.end : new THREE.Vector3; // 开始点

    let tmp = this.length * Math.cos(this.angles[1]);

    if (!this.vector) {
      this.vector = new THREE.Vector3(
        tmp * Math.cos(this.angles[0]),
        this.length * Math.sin(this.angles[1]),
        tmp * Math.sin(this.angles[0])
      );
    }

    this.end = new THREE.Vector3();
    this.currentLength = 0;

    this.connectedChild; // 直系子树枝，公用点
    this.isolatedChildren = []; // 非直系子树枝

    this.childrenConfig = {};

    this.controls = {};
    this.createObjs();
    this.tree.addBranch(this);
  }

  createObjs() {
    // branch
    this.branchGeom = new THREE.Geometry();
    this.material = new THREE.MeshBasicMaterial( { color : 0xdddddd, wireframe: true } );
    this.branchObj = new THREE.Mesh(this.branchGeom, this.material);
    this.branchObj.branch = this;

    for (let i = 0; i < 16; i++) {
      this.branchGeom.vertices.push(new THREE.Vector3);
    }

    let startPointIndex = 0;
    let endPointIndex = 8;
    let startPointNum = 8;
    let endPointNum = 8;

    for (let i = 0; i < 8; i++) {
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


    if (this.isIsolate) {
      // start control point
      let sphereGeom = new THREE.SphereGeometry(this.radiusStart, 8, 8);
      let material = new THREE.MeshBasicMaterial({color: 0xff0000});
      let startPoint = new THREE.Mesh(sphereGeom, material);
      startPoint.controlTarget = 'start';
      startPoint.branch = this;
      startPoint.position.copy(this.start);
      this.start = startPoint.position;
      this.controls.startPoint = startPoint;
    }

    // end control point
    let sphereGeom = new THREE.SphereGeometry(this.radiusEnd, 8, 8);
    let material = new THREE.MeshBasicMaterial({color: 0xff0000});
    let endPoint = new THREE.Mesh(sphereGeom, material);
    endPoint.controlTarget = 'end';
    endPoint.branch = this;
    endPoint.position.copy(this.end);
    this.end = endPoint.position;
    this.controls.endPoint = endPoint;
  }

  updateVector() {
    this.vector.subVectors(this.end, this.start); 
    this.length = this.vector.length();
    this.currentLength = this.length;
    this.vector.normalize();
  }

  updateBranch() {
    
    let startSurroundPoints = getSurroundPoints(this.start, this.vector, this.radiusStart, 8);
    startSurroundPoints.forEach((point, i) => {
      this.branchGeom.vertices[i].copy(point);
    });

    // 更新 end
    this.end.addVectors(this.start, this.vector.clone().setLength(this.currentLength));

    let percent = this.currentLength / this.length
    let connectedChildVector = this.connectedChild ? this.connectedChild.vector.clone() : this.vector.clone();
    let endSurroundPointVector = new THREE.Vector3().addVectors(
      this.vector, 
      connectedChildVector.setLength(percent)
    ).normalize();
    let endSurroundPoints = getSurroundPoints(this.end, endSurroundPointVector, this.radiusEnd, 8);
    endSurroundPoints.forEach((point, i) => {
      this.branchGeom.vertices[i + 8].copy(point);
    });


    if (this.connectedChild) {
      this.connectedChild.updateBranch();
    }
    this.isolatedChildren.forEach(branch => branch.updateBranch());

    this.branchGeom.verticesNeedUpdate = true; 
    this.branchGeom.normalsNeedUpdate = true; 
    this.branchGeom.computeFaceNormals(); 
    this.branchGeom.computeVertexNormals(); 
    this.branchGeom.computeBoundingSphere();
  }

  // grow
  grow(delta) { }

  generateChildBaseOptions() { }
}

Branch.id = 0;