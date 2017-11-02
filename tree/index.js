import './index.scss';
import * as THREE from 'three';
import { defaultsDeep } from 'lodash';
import { Time, TIME, TWEEN } from './time.js';
import TrackballControls from './trackball.js';
import {MeshLine, MeshLineMaterial} from 'three.meshline';
class Leaf {

}

// 树枝，或者是一只不分裂的树枝的某一部分
class Branch {
  constructor(tree, parent, options) {
    let defaults = {
      anglesAppend: [0, 0],
      startAtPercent: 0, // 当前树枝属于一只树枝某部分开始点
      endAtPercent: 1, // 当前树枝属于一只树枝某部分结束点,
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.tree = tree;
    this.parent = parent;
    this.angles;

    this.progress = 0; // 生长的百分比

    this.start = new THREE.Vector3;
    this.end = new THREE.Vector3;
    this.vector; // start -> end;

    // 当前深度
    this.deep = parent.deep + 1;
    let progressSegment = this.endAtPercent - this.startAtPercent;

    // 生长速度 百分比 / 每秒
    this.speed = Branch.maxSpeed * (Branch.maxDeep - this.deep) / Branch.maxDeep / progressSegment;
    // 树枝长度
    let totalLength = Branch.maxLength * (Branch.maxDeep - this.deep) / Branch.maxDeep;
    this.length = totalLength * progressSegment * (Math.random() * 0.7 + 0.3);
    this.children = []; // [] leaf or branch

    // mesh
    this.geom = new THREE.Geometry();
    this.geom.vertices.push(this.start, this.end);

    this.line = new MeshLine();
    this.line.setGeometry(this.geom, p => 1);

    this.material = new MeshLineMaterial({ color: new THREE.Color(this.tree.color), lineWidth: Branch.maxDeep - this.deep + 1 });
    this.obj = new THREE.Mesh(this.line.geometry, this.material);

    this.update();
    this.tree.addBranch(this);
  }

  // 父级树枝位置变化时要调用，层层调用直至叶子节点，导致 start & angles 变化
  update() {
    this.start.copy(this.parent.end);
    this.angles = [this.parent.angles[0] + this.anglesAppend[0], this.parent.angles[1] + this.anglesAppend[1]];

    let tmp = this.length * Math.cos(this.angles[1]);
    this.vector = new THREE.Vector3(
      tmp * Math.cos(this.angles[0]),
      this.length * Math.sin(this.angles[1]),
      tmp * Math.sin(this.angles[0])
    );
    this.geom.verticesNeedUpdate = true;
    this.line.setGeometry(this.geom, p => 1);
    this.line.geometry.verticesNeedUpdate = true;

    this.end.addVectors(this.start, this.vector.clone().multiplyScalar(this.progress));
  }

  // grow
  grow(delta) {
    if (this.progress === 1) {
      // TODO: 树枝摆动
      return;
    }
    this.geom.verticesNeedUpdate = true;
    this.line.setGeometry(this.geom, p => 1);
    this.line.geometry.verticesNeedUpdate = true;
    
    this.progress += delta / this.speed / 1000;
    this.progress = this.progress > 1 ? 1 : this.progress;
    this.end.addVectors(this.start, this.vector.clone().multiplyScalar(this.progress));

    if (this.progress === 1) {
      if (this.endAtPercent < 1) {
        // 长出一只同级树枝，此时不是分裂，而是为了实现曲线生长
        let startAtPercent = this.endAtPercent;
        let endAtPercent = startAtPercent + 0.3 + Math.random();
        endAtPercent = endAtPercent > 1 ? 1 : endAtPercent;

        let anglesAppend = [
          (Math.random() - 0.5) * Math.PI * 0.1,
          (Math.random() - 0.5) * Math.PI * 0.1,
        ];

        let sameDeepBranch = new Branch(this.tree, this, {
          anglesAppend,
          startAtPercent,
          endAtPercent
        });

      } else if (this.deep < Branch.maxDeep - 1) {
        // 生出两个子级树枝
        let leftAnglesAppend = [
          (Math.random() * 0.8 + 0.3) * Math.PI / Math.min(this.deep + 1, 3),
          (Math.random() - 0.5) * Math.PI / Math.min(this.deep + 1, 3)
        ];
        let leftStartAtPercent = 0;
        let leftEndAtPercent = Math.random() > 0.5 ? 1 : Math.random() * 0.5 + 0.2;
        let leftBranch = new Branch(this.tree, this, {
          anglesAppend: leftAnglesAppend,
          leftStartAtPercent,
          leftEndAtPercent
        });
        let rightAnglesAppend = [
          -(Math.random() * 0.8 + 0.3) * Math.PI / Math.min(this.deep + 1, 3),
          (Math.random() - 0.5) * Math.PI / Math.min(this.deep + 1, 3)
        ];
        let rightStartAtPercent = 0;
        let rightEndAtPercent = Math.random() > 0.5 ? 1 : Math.random() * 0.5 + 0.2;
        let rightBranch = new Branch(this.tree, this, {
          anglesAppend: rightAnglesAppend,
          rightStartAtPercent,
          rightEndAtPercent
        });
      }

    }
  }
}
Branch.maxDeep = 10;
Branch.maxLength = 100;
Branch.maxSpeed = 1; // progress/second

class Tree {
  constructor(options) {
    let defaults = {
      color: 0x00000
    };
    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.branches = []; // 枝
    this.leaves = []; // 叶
    this.obj = new THREE.Group();

    let rootBranch = new Branch(this, {
      angles: [0, Math.PI * 0.5],
      start: new THREE.Vector3(),
      end: new THREE.Vector3(0, 0, 0),
      deep: 0
    }, null);
    this.branches.push(rootBranch);
  }

  addBranch(branch) {
    setTimeout(() => {
      this.branches.push(branch);
      this.obj.add(branch.obj);
    });
    // this.branches.push(branch);
    // this.obj.add(branch.obj);
  }

  grow(delta) {
    this.branches.forEach(branch => branch.grow(delta));
  }
}

class Ani extends Time {
  constructor() {
    super();
    // init three tree
    this.scene = new THREE.Scene();//场景

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);//透视相机
    this.camera.position.set(0, 0, 1000);//相机位置
    this.scene.add(this.camera);//add到场景中
    this.camera.lookAt(new THREE.Vector3);
    // this.scene.fog = new THREE.Fog(0x000000, 100, 500);
    this.control = new TrackballControls(this.camera, document.body);

    this.renderer = new THREE.WebGLRenderer({antialias: true , alpha: true});//渲染
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerWidth);
    document.querySelector('body').appendChild(this.renderer.domElement);//将渲染Element添加到Dom中

    this.trees = [];
    this.tick;

    let tree1 = new Tree({ color: 0x23498f });
    let tree2 = new Tree({ color: 0x3dafff });
    this.trees.push(tree1);

    this.trees.forEach(tree => this.scene.add(tree.obj));
  }

  tick(delta) {
    this.trees.forEach(tree => tree.grow(delta));
    this.trees.forEach(tree => tree.obj.rotation.y += 0.006);
    this.renderer.render(this.scene, this.camera);
    this.control.update(delta);
  }
  
  start() {
    this.tick = this.addTick(this.tick.bind(this));
    
  }

  stop() {
    this.removeTick(this.tick);
  }
}


let ani = new Ani;

ani.start();
TIME.start();