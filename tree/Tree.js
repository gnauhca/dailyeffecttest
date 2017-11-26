class Tree {
  constructor(options) {
    let defaults = {
      color: 0x00000,
      maxDeep: 8,
      maxLength: 20,
      maxSpeed: 0.5, // progress/second
      radiusReduceSpeed: 0.4 / 10, // 每 1 长度减少的 radius 百分比
      rootRadius: 5,
    };
    options = defaultsDeep(options, defaults);
    Object.assign(this, options);


    this.branches = []; // 枝
    this.branchesPointInfo = {}; // 树枝对应几何体顶点开始的 index

    this.leaves = []; // 叶
    this.obj = new THREE.Group();

    // let rootBranch = new Branch(this, null, {
    //   isIsolate: true,
    //   angles: [0, 90 * RADIAN],
    //   radiusStart: this.rootRadius,
    //   radiusEnd: this.rootRadius * 0.8,
    //   length: this.maxLength,
    //   branchLength: this.maxLength,
    //   speed: this.maxSpeed
    // });
  }

  addBranch(branch) {
    this.branches.push(branch);

    this.obj.add(branch.branchObj);

    if (window.env === 'edit') {
      if (branch.isIsolate) {
        this.obj.add(branch.controls.startPoint);
      }
      this.obj.add(branch.controls.endPoint);
    }
  }


  grow(delta) {
    this.branches.forEach((branch, i) => {
      branch.grow(delta);

      let pointInfo = this.branchesPointInfo[branch.id];
      let vector = branch.vector;

      // end point
      let surroundPoint = getSurroundPoints(branch.end, vector, branch.radiusEnd, pointInfo.endNum);

      for (let i = 0; i < pointInfo.endNum; i++) {
        this.treeGeom.vertices[pointInfo.endIndex + i].addVectors(branch.end, surroundPoint[i]);
      }

      if (branch.isIsolate) {
        vector = i === 0 ? new THREE.Vector3(0, 1, 0) : vector;
        surroundPoint = getSurroundPoints(branch.start, vector, branch.radiusStart, pointInfo.startNum);

        for (let i = 0; i < pointInfo.startNum; i++) {
          this.treeGeom.vertices[pointInfo.startIndex + i].addVectors(branch.start, surroundPoint[i]);
        }
      }

    });
    this.treeGeom.verticesNeedUpdate = true;
    this.treeGeom.elementsNeedUpdate = true;
    this.treeGeom.computeFaceNormals();
    // this.treeGeom.computeVertexNormals();
    
  }
}
