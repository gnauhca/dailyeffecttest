import './index.scss';
import * as THREE from 'three';

class Leaf {

}

class Branch {
  constructor(start, vector) {
    this.vector;
    this.start;
    this.progress;
    this.end;

    this.deep;
    this.children; // [] leaf or branch
  }
  setStart() {

  }
  setVector() {

  }

  // grow
  update() {

  }
}

class Tree {
  constructor() {
    this.roots; // 根，三个？
    this.branches; // 枝
    this.leaves; // 叶
  }

  
}
