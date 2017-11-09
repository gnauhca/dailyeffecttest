import './index.scss';
import Stats from 'stats.js';
// import * as THREE from 'three';
import { defaultsDeep } from 'lodash';
import { Time, TIME, TWEEN } from './time.js';
import TrackballControls from './trackball.js';
import {MeshLine, MeshLineMaterial} from 'three.meshline';

let stats = new Stats
document.body.appendChild( stats.dom );

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
    this.index; // 我是第几个树枝

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
    this.length = totalLength * progressSegment * (Math.random() * 0.5 + 0.5);
    this.children = []; // [] leaf or branch

    // mesh
    // this.geom = new THREE.Geometry();
    // this.geom.vertices.push(this.start, this.end);

    // this.line = new MeshLine();
    // this.line.setGeometry(this.geom, p => 1);

    // let texture = new THREE.TextureLoader().load(require('./line-texture.png'));
    // this.material = new MeshLineMaterial({ 
    //   color: new THREE.Color(0xffffff), 
    //   lineWidth: Branch.maxDeep - this.deep + 1,
    //   // useMap: true,
    //   // map: texture,
    //   blending: THREE.NormalBlending,
    // });
    // this.obj = new THREE.Mesh(this.line.geometry, this.material);

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
    // this.geom.verticesNeedUpdate = true;
    // this.line.setGeometry(this.geom, p => 1);
    // this.line.geometry.verticesNeedUpdate = true;

    this.end.addVectors(this.start, this.vector.clone().multiplyScalar(this.progress));
  }

  // grow
  grow(delta) {
    if (this.progress === 1) {
      // TODO: 树枝摆动
      return;
    }
    // this.geom.verticesNeedUpdate = true;
    // this.line.setGeometry(this.geom, p => 1);
    // this.line.geometry.verticesNeedUpdate = true;
    
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
          (0.4 + 1.3 * Math.random()) * Math.PI / Math.min(this.deep + 1, 3),
          (0.4 + 1.3 * Math.random()) * Math.PI / 4 / Math.min(this.deep * 1.5 + 0.1)
        ];
        let leftStartAtPercent = 0;
        let leftEndAtPercent = Math.random() > 0.5 ? 1 : Math.random() * 0.5 + 0.2;
        let leftBranch = new Branch(this.tree, this, {
          anglesAppend: leftAnglesAppend,
          leftStartAtPercent,
          leftEndAtPercent
        });
        let rightAnglesAppend = [
          (0.4 + 1.3 * Math.random()) * -Math.PI / Math.min(this.deep + 1, 3),
          (0.4 + 1.3 * Math.random()) * Math.PI / 4 / Math.min(this.deep * 1.5 + 0.1)
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
Branch.maxDeep = 12;
Branch.maxLength = 100;
Branch.maxSpeed = 0.5; // progress/second

class Tree {
  constructor(options, camera) {
    let defaults = {
      color: 0x00000,
      thickness: 8
    };
    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    this.camera = camera;

    this.branches = []; // 枝
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

    // this.treeGeom.vertices.push(new THREE.Vector3, new THREE.Vector3, new THREE.Vector3);
    // this.treeGeom.vertices.length = 3;
    // this.treeGeom.vertices[0].copy( new THREE.Vector3( -50, -50, 0 ) );
    // this.treeGeom.vertices[1].copy( new THREE.Vector3(  50, -50, 0 ) );
    // this.treeGeom.vertices[2].copy( new THREE.Vector3(  50,  50, 0 ) );
    // this.treeGeom.faces.push(new THREE.Face3( 0, 1, 2)); 

    // this.treeGeom.computeFaceNormals();
    // this.treeGeom.computeVertexNormals();

    // setTimeout(() => {
    //   this.treeGeom.vertices.push(new THREE.Vector3( -50, 50, 0 ));
    //   this.treeGeom.faces.push(new THREE.Face3( 0, 2, 3)); 
    //   this.treeGeom.verticesNeedUpdate = true;
    //   this.treeGeom.elementsNeedUpdate = true;
    // }, 50); 

    // return;


    this.treeGeom.vertices.push(new THREE.Vector3, new THREE.Vector3);

    let rootBranch = new Branch(this, {
      // 根的 parent，用于辅助
      angles: [0, Math.PI * 0.5],
      start: new THREE.Vector3(),
      end: new THREE.Vector3(0, 0, 0),
      deep: 0,
      index: -1
    }, null);
  }

  addBranch(branch) { //return;

    
    setTimeout(() => {

      this.branches.push(branch);
      branch.index = this.branches.length - 1;
      this.treeGeom.vertices.push(new THREE.Vector3, new THREE.Vector3);

      let parentPointsIndexes = this.getPointsIndexes(branch.parent.index);
      let branchPointsIndexes = this.getPointsIndexes(branch.index);

      this.treeGeom.faces.push(
        new THREE.Face3(
          parentPointsIndexes[0], 
          parentPointsIndexes[1], 
          branchPointsIndexes[0]
        ),
        new THREE.Face3(
          parentPointsIndexes[1], 
          branchPointsIndexes[0],
          branchPointsIndexes[1]
        )
      );

    }, 0);
  }

  getPointsIndexes(branchIndexes) {
    let branchFirstPointIndex = (branchIndexes + 1) * 2;
    let branchPointsIndexes = [branchFirstPointIndex, branchFirstPointIndex + 1];
    return branchPointsIndexes;
  }

  getSurroundPoint(center, vector, cameraPosition, redius) {
    let point1 = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(cameraPosition, center),
      vector
    ).setLength(redius * 0.5).add(center);
    let point2 = center.clone();

    return [point1, point2]
  }

  grow(delta) {
    this.branches.forEach(branch => {
      branch.grow(delta);

      let thickness = Math.pow((this.thickness - branch.deep), 2);
      let vector = branch.vector;
      let center = branch.end;
      let branchPointsIndexes = this.getPointsIndexes(branch.index); 
      let surroundPoint = this.getSurroundPoint(center, vector, this.camera.position, thickness);

      this.treeGeom.vertices[branchPointsIndexes[0]].copy(surroundPoint[0]);
      this.treeGeom.vertices[branchPointsIndexes[1]].copy(surroundPoint[1]);

      if (branch.index === 0) {
        let center = branch.start;
        let surroundPoint = this.getSurroundPoint(center, vector, this.camera.position, thickness);
        this.treeGeom.vertices[0].copy(surroundPoint[0]);
        this.treeGeom.vertices[1].copy(surroundPoint[1]);
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