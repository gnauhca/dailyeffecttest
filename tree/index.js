import './index.scss';
import * as THREE from 'three';
import { defaultsDeep } from 'lodash';

class Leaf {

}

// 树枝，或者是一只不分裂的树枝的某一部分
class Branch {
  constructor(tree, parent, options) {
    let defaults = {
      anglesAppend: [0, 0],
      startAtPercent: 0, // 当前树枝属于一只树枝某部分开始点
      endAtPercent: 1, // 当前树枝属于一只树枝某部分结束点
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.tree = tree;
    this.parent = parent;
    this.anglesAppend = options.anglesAppend;
    this.angles;

    this.progress = 0; // 生长的百分比

    this.start;
    this.end;
    this.vector; // start -> end;

    // 当前深度
    this.deep = parent.deep + 1;
    let progressSegment = this.endAtPercent - this.startAtPercent;

    // 生长速度 百分比 / 每秒
    this.speed = Branch.maxSpeed * (Branch.maxDeep - this.deep) / Branch.maxDeep / progressSegment;
    // 树枝长度
    let totalLength = Branch.maxLength * (Branch.maxDeep - this.deep) / Branch.maxDeep;
    this.length = totalLength * progressSegment;
    this.children = []; // [] leaf or branch

    this.update();
  }

  // 父级树枝位置变化时要调用，层层调用直至叶子节点，导致 start & angles 变化
  update() {
    this.start = parent.end;
    this.angles = [parent.angles[0] + this.anglesAppend[0], parent.angles[1] + this.anglesAppend[1]];

    let tmp = this.length * Math.cos(this.angles[1]);
    this.vector = new THREE.Vector(
      tmp * Math.cos(this.angles[0]),
      this.length * Math.sin(this.angles[1]),
      tmp * Math.sin(this.angles[0])
    );

    this.end = new THREE.Vector3().addVectors(this.start, this.vector);
  }

  // grow
  grow(delta) {
    if (this.progress === 1) {
      // TODO: 树枝摆动
      return;
    }

    this.progress += delta / this.speed / 1000;
    this.progress = this.progress > 1 ? 1 : this.progress;
    this.end.addVectors(this.start, this.vector.clone().multiplyScalar(this.progress));

    if (this.progress === 1) {
      if (this.endAtPercent < 1) {
        // 长出一只同级树枝，此时不是分裂，而是为了实现曲线生长
      } else {
        // 生出两个子级树枝
        let leftBranch = new Branch();
        let rightBranch = new Branch();
      }

    }
  }
}
Branch.maxDeep = 6;
Branch.maxLength = 10;
Branch.maxSpeed = 1; // progress/second

class Tree {
  constructor() {
    this.branches; // 枝
    this.leaves; // 叶

    let rootBranch = new Branch({
      angles: []
    });
    this.branches.push(rootBranch);
  }

  grow(delta) {
    this.branches.forEach(branch => branch.grow());
  }
}

class Ani extends Time {
  constructor() {
    // init three tree
    this.trees = [];

    let tree1 = new Tree({

    });
    this.trees.push(tree1);
  }
  
  start() {

  }

  stop() {

  }
}


let ani = new Ani;

ani.start();