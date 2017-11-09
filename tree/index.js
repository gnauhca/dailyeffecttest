import './index.scss';
import Stats from 'stats.js';
// import * as THREE from 'three';
import { defaultsDeep } from 'lodash';
import { Time, TIME, TWEEN } from './time.js';
import TrackballControls from './trackball.js';
import {MeshLine, MeshLineMaterial} from 'three.meshline';

const RADIAN = Math.PI / 180;

let stats = new Stats
document.body.appendChild( stats.dom );


let getSurroundPoint = (function() {
  let meshCache = {};
  return function(center, vector, radius, pointNum) {
    let mesh = meshCache[pointNum]
    if (!mesh) {
      let geom = new THREE.CylinderGeometry(1, 1, 1, pointNum, 1, true);
      geom.rotateX(RADIAN * -90);
      geom.translate(0, 0, -0.5);
      mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial);
      meshCache[pointNum] = mesh;
    }
    mesh.lookAt(vector);
    let vertices = mesh.geometry.vertices.slice(0, pointNum - 1).map(v => {
      return mesh.localToWorld(v).setLength(radius);
    });
    return vertices;
  }
})();

class Leaf {

}

// 树枝，或者是一只不分裂的树枝的某一部分
class Branch {
  constructor(tree, parent, options) {
    let defaults = {
      isIsolate: false,
      angles: [0, 0],
      startAtPercent: 0, // 当前树枝属于一只树枝某部分开始点
      endAtPercent: 1, // 当前树枝属于一只树枝某部分结束点
      percentSegment: 1, 
      radiusStart: 1,
      radiusEnd: 1,
      branchLength: 1,
      length: 1,
      speed: 1 // 生长速度
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.tree = tree;
    this.parent = parent;
    this.deep = this.parent.deep + 1;
    this.start = parent.end; // 开始点

    let tmp = this.length * Math.cos(this.angles[1]);
    this.vector = new THREE.Vector3(
      tmp * Math.cos(this.angles[0]),
      this.length * Math.sin(this.angles[1]),
      tmp * Math.sin(this.angles[0])
    );
    this.end = this.start.clone();

    this.connectedChild; // 直系子树枝，公用点
    this.isolatedChildren = []; // 非直系子树枝

    this.progress = 0; // 生长的百分比

    let progressSegment = this.endAtPercent - this.startAtPercent;

    // 生长速度 百分比 / 每秒
    this.speed = this.tree.maxSpeed * (this.tree.maxDeep - this.deep) / this.tree.maxDeep / progressSegment;

    // this.update();
    this.tree.addBranch(this);
  }

  // grow
  grow(delta) {

    if (this.progress === 1) {
      // TODO: 树枝摆动, wind
      return;
    }
    
    this.progress += delta / this.speed / 1000;
    this.progress = this.progress > 1 ? 1 : this.progress;
    this.end.addVectors(this.start, this.vector.clone().multiplyScalar(this.progress));

    if (this.progress < 1) { 
      return; 
    }

    if (this.endAtPercent < 1) {
      // 长出一只同级树枝，此时不是分裂，而是为了实现曲线生长
      let angles = [
        this.angles[0] + (Math.random() - 0.5) * RADIAN * 20,
        this.angles[1] + (Math.random() - 0.5) * RADIAN * 20,
      ];
      let startAtPercent = this.endAtPercent;
      let endAtPercent = Math.min(startAtPercent + 0.3 + Math.random(), 1);
      let percentSegment = endAtPercent - startAtPercent;
      let branchLength = this.branchLength;
      let length = branchLength * percentSegment;
      let radiusStart = this.radiusEnd;
      let radiusEnd = rediusStart - this.tree.radiusReduceSpeed * length;
      let speed = this.speed;

      let sameDeepBranch = new Branch(this.tree, this, {
        angles,
        startAtPercent,
        endAtPercent,
        percentSegment,
        radiusStart,
        radiusEnd,
        branchLength,
        length,
        speed,
      });

    } else if (this.deep < this.tree.maxDeep - 1) {

      // 生出两个子级树枝，有且仅有一个直系子树枝

      // 直系 connected
      let cOptions = this.generateChildBaseOptions();
      let cRadiusStart = this.radiusEnd;
      let cRadiusEnd = cRadiusStart - this.tree.radiusReduceSpeed * cOptions.length;
      let cAngles = [
        this.angles[0] + 30 * RADIAN,
        this.angles[1] + 30 * RADIAN
      ];
      let cBranch = new Branch(this.tree, this, Object.assign({
        angles: cAngles,
        rediusStart: cRadiusStart,
        radiusEnd: cRadiusEnd,
      }, cOptions));
      this.connectedChild = cBranch;

      // 非直系 isolated
      let iOptions = this.generateChildBaseOptions();
      let iRadiusStart = this.radiusEnd * (0.6 + Math.random() * 0.2); 
      let iRadiusEnd = iRadiusStart - this.tree.radiusReduceSpeed * iOptions.length;
      let iAngles = [
        this.angles[0] + 30 * RADIAN,
        this.angles[1] + -30 * RADIAN
      ];
      let iBranch = new Branch(this.tree, this, Object.assign({
        angles: iAngles,
        rediusStart: iRadiusStart,
        radiusEnd: iRadiusEnd,
        isIsolate: true,
      }, iOptions));
      this.isolatedChildren.push(iBranch);
    }

  }

  generateChildBaseOptions() {
    let length = this.tree.maxDeep * this.tree.maxLength * (0.8 + 0.2 * Math.random()) / (this.deep + 1)

    return {
      startAtPercent: 0,
      endAtPercent: Math.random() > 0.5 ? Math.random() * 0.3 + 0.3: 1,
      length: length,
      branchLength: length,
      speed: 0.5 + Math.random() * 0.5
    };
  }
}


class Tree {
  constructor(options, camera) {
    let defaults = {
      color: 0x00000,
      maxDeep: 12,
      maxLength: 100,
      maxSpeed: 0.5, // progress/second
      radiusReduceSpeed: 0.05 / 100, // 每 1 长度减少的 radius 百分比
      rootRadius: 20,
    };
    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.camera = camera;

    this.branches = []; // 枝
    this.branchesPointInfo = {}; // 树枝对应几何体顶点开始的 index

    this.leaves = []; // 叶
    this.obj = new THREE.Group();

    this.material = new THREE.MeshBasicMaterial({ 
      wireframe: true, 
      color: 0xff0000,
      side: THREE.DoubleSide
    });

    this.material = new THREE.MeshBasicMaterial( { color : 0x345678, side: THREE.DoubleSide } );

    this.treeGeom = new THREE.Geometry();
    this.treeMesh = new THREE.Mesh(this.treeGeom, this.material);
    this.obj.add(this.treeMesh);

    let rootBranch = new Branch(this, {
      // 根的 parent，用于辅助
      angles: [0, Math.PI * 0.5],
      start: new THREE.Vector3(),
      end: new THREE.Vector3(0, 0, 0),
      deep: 0,
      index: -1
    }, null);
  }

  getPointNumByBranchRadius(radius) {
    return Math.max(3, Math.min(parseInt(radius / 3), 6));
  }

  addBranch(branch) {
    
    setTimeout(() => {
      let pointInfo = {
        startIndex: null,
        startNum: null,
        endIndex: null,
        endNum: null
      }

      let startPointIndex;
      let startPointNum;

      if (branch.isIsolate) {
        // 同时拥有头尾的点，增加头部分的点
        startPointIndex = this.treeGeom.vertices.length;
        startPointNum = this.getPointNumByBranchRadius(branch.rediusStart);

        pointInfo.startIndex = startPointIndex;
        pointInfo.startNum = startPointNum;

        for (let i = 0; i < startPointNum; i++) {
          this.treeGeom.vertices.push(new THREE.Vector3);
        }

      }

      let endPointIndex = this.treeGeom.vertices.length;
      let endPointNum = this.getPointNumByBranchRadius(branch.rediusEnd);

      pointInfo.endIndex = endPointIndex;
      pointInfo.endNum = endPointNum;

      for (let i = 0; i < startPointNum - 1; i++) {
        if (i < endPointNum - 1) {
          this.treeGeom.faces.push(
            new THREE.Face3(
              startPointIndex + i,
              startPointIndex + i + 1,
              endPointIndex + i
            ),
            new THREE.Face3(
              endPointIndex + i,
              endPointIndex + i + 1,
              startPointIndex + i + 1
            )
          );
        } else {
          this.treeGeom.faces.push(
            new THREE.Face3(
              endPointIndex + endPointNum - 1,
              startPointIndex + i,
              startPointIndex + i + 1,
            )
          );
        }
      }

      this.branchesPointInfo[branch] = pointInfo;
      this.branches.push(branch);

    }, 0);

  }

  getPointsIndexes(branchIndexes) {
    let branchFirstPointIndex = (branchIndexes + 1) * 2;
    let branchPointsIndexes = [branchFirstPointIndex, branchFirstPointIndex + 1];
    return branchPointsIndexes;
  }

  grow(delta) {
    this.branches.forEach(branch => {
      branch.grow(delta);

      let pointInfo = this.branchesPointInfo[branch];
      let vector = branch.vector;

      // end point
      let surroundPoint = getSurroundPoint(branch.end, branch.vector, branch.rediusEnd, pointInfo.endNum);

      for (let i = 0; i < pointInfo.endNum; i++) {
        this.treeGeom.vertices[pointInfo.endIndex + i].copy(surroundPoint[i]);
      }

      if (branch.isIsolate) {
        surroundPoint = getSurroundPoint(branch.start, branch.vector, branch.rediusStart, pointInfo.startNum);

        for (let i = 0; i < pointInfo.startNum; i++) {
          this.treeGeom.vertices[pointInfo.startIndex + i].copy(surroundPoint[i]);
        }
      }

    });
    this.treeGeom.verticesNeedUpdate = true;
    this.treeGeom.elementsNeedUpdate = true;
    this.treeGeom.computeFaceNormals();
    this.treeGeom.computeVertexNormals();
    
  }
}

class Ani extends Time {
  constructor() {
    super();
    // init three tree
    this.scene = new THREE.Scene();//场景

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);//透视相机
    this.camera.position.set(0, 100, 800);//相机位置
    this.scene.add(this.camera);//add到场景中
    this.camera.lookAt(new THREE.Vector3(0, 100, 0));
    // this.scene.fog = new THREE.Fog(0x000000, 100, 500);
    this.control = new TrackballControls(this.camera, document.body);
    this.control.travel = true;
    this.travelSpeed = 20000;

    this.spotLight = new THREE.SpotLight(0xffffff);
    this.scene.add(this.spotLight);
    this.spotLight.position.set(-200, -200, 100);

    this.renderer = new THREE.WebGLRenderer({antialias: true , alpha: true});//渲染
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('body').appendChild(this.renderer.domElement);//将渲染Element添加到Dom中

    this.trees = [];
    this.tick;

    let tree1 = new Tree({ color: 0x23498f }, this.camera);
    let tree2 = new Tree({ color: 0x3dafff }, this.camera);
    this.trees.push(tree1);

    this.trees.forEach(tree => this.scene.add(tree.obj));
  }

  tick(delta) {
    this.trees.forEach(tree => tree.grow(delta));
    // this.trees.forEach(tree => tree.obj.rotation.y += 0.006);
    this.renderer.render(this.scene, this.camera);
    this.control.update(delta);
    stats.update();
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