import './index.scss';
import Stats from 'stats.js';
import * as THREE from 'three';
import { defaultsDeep } from 'lodash';
import { Time, TIME, TWEEN } from './time.js';
import TrackballControls from './trackball.js';
// import {MeshLine, MeshLineMaterial} from 'three.meshline';

let RADIAN = Math.PI / 180;

let stats = new Stats
document.body.appendChild( stats.dom );


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
      return v.clone().applyAxisAngle(cross, angle).setLength(radius);
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

    this.material = new THREE.MeshBasicMaterial({ 
      color: 0xcccccc,
      side: THREE.DoubleSide
    });

    let rootBranch = new Branch(this, null, {
      isIsolate: true,
      angles: [0, 90 * RADIAN],
      radiusStart: this.rootRadius,
      radiusEnd: this.rootRadius * 0.8,
      length: this.maxLength,
      branchLength: this.maxLength,
      speed: this.maxSpeed
    });
  }

  getPointNumByBranchRadius(radius) {
    // return 10;
    return Math.max(3, Math.min(parseInt(radius / 0.3), 10));
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
        startPointNum = this.getPointNumByBranchRadius(branch.radiusStart);

        pointInfo.startIndex = startPointIndex;
        pointInfo.startNum = startPointNum;

        for (let i = 0; i < startPointNum; i++) {
          this.treeGeom.vertices.push(new THREE.Vector3);
        }
      } else {
        startPointIndex = this.branchesPointInfo[branch.parent.id].endIndex;
        startPointNum = this.branchesPointInfo[branch.parent.id].endNum;
      }

      let endPointIndex = this.treeGeom.vertices.length;
      let endPointNum = this.getPointNumByBranchRadius(branch.radiusEnd);

      for (let i = 0; i < endPointNum; i++) {
        this.treeGeom.vertices.push(new THREE.Vector3);
      }

      pointInfo.endIndex = endPointIndex;
      pointInfo.endNum = endPointNum;

      // console.log(startPointIndex, startPointNum, endPointIndex, endPointNum);

      for (let i = 0; i < startPointNum; i++) {
        if (i < endPointNum) {
          this.treeGeom.faces.push(
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
        } else {
          this.treeGeom.faces.push(
            new THREE.Face3(
              endPointIndex,
              startPointIndex + i,
              startPointIndex + (i + 1) % (startPointNum),
            )
          );
        }
      }

      // console.log(this.treeGeom.faces);
      this.branchesPointInfo[branch.id] = pointInfo;
      this.branches.push(branch);

    }, 0);

  }

  getPointsIndexes(branchIndexes) {
    let branchFirstPointIndex = (branchIndexes + 1) * 2;
    let branchPointsIndexes = [branchFirstPointIndex, branchFirstPointIndex + 1];
    return branchPointsIndexes;
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

class Ani extends Time {
  constructor() {
    super();
    // init three tree
    this.scene = new THREE.Scene();//场景

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);//透视相机
    this.camera.position.set(0, 50, 150);//相机位置
    this.scene.add(this.camera);//add到场景中
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.scene.fog = new THREE.Fog(0x000000, 100, 500);
    this.control = new TrackballControls(this.camera, document.body);
    // this.control.travel = true;
    this.travelSpeed = 20000;

    this.spotLight = new THREE.SpotLight(0xffffff);
    this.scene.add(this.spotLight);
    this.spotLight.position.set(-200, -200, 100);

    this.spotLight2 = this.spotLight.clone();
    this.scene.add(this.spotLight2);
    this.spotLight2.position.set(50, 500, -100);

    // this.planeGeom = new THREE.PlaneGeometry(200, 200);
    // this.planeGeom.rotateX(1.577)
    // this.planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, wireFrames: 1, side: THREE.DoubleSide});
    // this.plane = new THREE.Mesh(this.planeGeom, this.planeMaterial);
    // this.scene.add(this.plane);

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

class Controller {
  constructor() {

  }
}


let ani = new Ani;

ani.start();
TIME.start();