// 树枝，或者是一只不分裂的树枝的某一部分
class Branch {
  constructor(tree, parent, options) {
    let defaults = {
      isIsolate: false,
      angles: [0, 0], 
      radiusStart: 1, // 开始半径
      radiusEnd: 1, // 结束半径
      length: 1, // 树枝 segment 长度
      speed: 1 // 生长速度
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.id = Branch.id++;
    this.tree = tree;
    this.parent = parent;
    this.deep = this.parent ? this.parent.deep + (this.endAtPercent < 1 ? 0 : 1) : 0;
    this.start = this.parent ? parent.end : new THREE.Vector3; // 开始点

    let tmp = this.length * Math.cos(this.angles[1]);
    this.vector = new THREE.Vector3(
      tmp * Math.cos(this.angles[0]),
      this.length * Math.sin(this.angles[1]),
      tmp * Math.sin(this.angles[0])
    );
    this.end = this.start.clone();

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
    this.material = new THREE.MeshLambertMaterial( { color : 0xdddddd } );
    this.branchObj = new THREE.Mesh(this.branchGeom, this.material);

    for (let i = 0; i < 16; i++) {
      this.branchGeom.vertices.push(new THREE.Vector3);
    }

    if (this.isIsolate) {
      // start control point
      let sphereGeom = new THREE.SphereGeometry(this.radiusStart, 5, 5);
      let material = new THREE.MeshBasicMaterial({color: 0xff0000});
      let startPoint = new THREE.Mesh();
      startPoint.controlTarget = 'start';
      startPoint.branch = this;
      startPoint.position = this.start;
      this.controls.startPoint = startPoint;
    }

    // end control point
    let sphereGeom = new THREE.SphereGeometry(this.radiusStart, 5, 5);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let endPoint = new THREE.Mesh();
    endPoint.controlTarget = 'end';
    endPoint.branch = this;
    endPoint.position = this.end;
    this.controls.endPoint = endPoint;
  }

  updateVector() {
    this.vector.subVectors(this.end, this.start).normalize(); 
  }

  updateBranch() {
    
    if (this.isIsolate) {
      let startSurroundPoints = getSurroundPoints(this.start, this.vector, this.radiusStart, 8);
      startSurroundPoints.forEach((point, i) => {
        this.branchGeom.vertices[i].copy(point);
      });
    }

    let percent = this.currentLength / this.length
    let connectedChildVector = this.connectedChild ? this.connectedChild.vector : this.vector;
    let endSurroundPointVector = new THREE.Vector3().addVectors(
      this.vector, 
      connectedChildVector.setLength(percent)
    ).normalize();
    let endSurroundPoints = getSurroundPoints(this.end, endSurroundPointVector, this.radiusEnd, 8);
    endSurroundPoints.forEach((point, i) => {
      this.branchGeom.vertices[i + 8].copy(point);
    });

    this.branchObj.computeFaceNormals();
  }

  // grow
  grow(delta) { }

  generateChildBaseOptions() { }
}

Branch.id = 0;