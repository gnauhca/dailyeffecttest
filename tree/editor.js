import Branch from './Branch.js';
import Tree from './Tree.js';
import Ani from './Ani.js';

let ani = new Ani();

let helper = new THREE.GridHelper( 2000, 100 );
helper.position.y = 0;
helper.material.opacity = 0.25;
helper.material.transparent = true;
ani.scene.add( helper );

let axes = new THREE.AxesHelper( 1000 );
axes.position.set( 0, 0, 0 );
ani.scene.add( axes );

ani.onUpdate = function() {
  transformControl.update();
}

let transformControl = new THREE.TransformControls(ani.camera, ani.renderer.domElement);
// transformControl.addEventListener('change', render);
ani.scene.add(transformControl);

transformControl.addEventListener('objectChange', function(e) {
  updateBranchByPoints(editingBranchObj.branch);
});

let trees = [];

let editingBranchObj = null;
let hoveringBranchObj = null;
let branchObjs = [];
let branchDragcontrols = new THREE.DragControls(branchObjs, ani.camera, ani.renderer.domElement); 
branchDragcontrols.enabled = false;
branchDragcontrols.addEventListener('hoveron', function(event) {
  if (event.object !== editingBranchObj) {
    hoveringBranchObj = event.object;
    hoveringBranchObj.material.color = new THREE.Color(0xdddd33); // 黄色鼠标悬浮
  }
});

branchDragcontrols.addEventListener('hoveroff', function(event) {
  if (hoveringBranchObj) {
    hoveringBranchObj.material.color = new THREE.Color(0xdddddd);
    hoveringBranchObj = null;
  }
});

let branchPoints = [];
let branchPointsDragControlls = new THREE.DragControls(branchPoints, ani.camera, ani.renderer.domElement);
branchPointsDragControlls.enabled = false;
branchPointsDragControlls.addEventListener('hoveron', function(event) {
  transformControl.attach(event.object);
});

window.addEventListener('dblclick', function() {
  if (hoveringBranchObj) {
    changeEditingBranchObj(hoveringBranchObj);
    hoveringBranchObj = null;
  } else {
    changeEditingBranchObj(null);
  }
});

window.addEventListener('keydown', function(event) {

  switch (event.keyCode) {

    case 81: // Q
      transformControl.setSpace(transformControl.space === "local" ? "world" : "local");
      break;

    case 17: // Ctrl
      transformControl.setTranslationSnap(100);
      transformControl.setRotationSnap(THREE.Math.degToRad(15));
      break;

    case 87: // W
      transformControl.setMode("translate");
      break;

    case 69: // E
      transformControl.setMode("rotate");
      break;

    case 82: // R
      transformControl.setMode("scale");
      break;

    case 187:
    case 107: // +, =, num+
      transformControl.setSize(transformControl.size + 0.1);
      break;

    case 189:
    case 109: // -, _, num-
      transformControl.setSize(Math.max(transformControl.size - 0.1, 0.1));
      break;

    case 32: // space add branch
      if (editingBranchObj) {
        let parentBranch = editingBranchObj.branch;
        let isIsolate = !!parentBranch.connectChild;
        let newBranch = new Branch(parentBranch.tree, parentBranch, {
          isIsolate,
          radiusStart: parentBranch.radiusEnd, // 开始半径
          radiusEnd: parentBranch.radiusEnd, // 结束半径
          length: 10, // 树枝 segment 长度
          vector: isIsolate ? new THREE.Vector3(Math.random(), Math.random(), Math.random()) : parentBranch.vector.clone()
        });

        if (isIsolate) {
          parentBranch.isolatedChildren.push(newBranch);
        } else {
          parentBranch.connectedChild = newBranch;
        }
        setBranchToMax(newBranch);
        branchObjs.push(newBranch.branchObj);
        // branchPoints.push(newBranch.controls.startPoint);
        branchPoints.push(newBranch.controls.endPoint);

      } else {
        // new tree
        let tree = new Tree();
        let rootBranch = new Branch(tree, null, {
          isIsolate: true,
          radiusStart: 5, // 开始半径
          radiusEnd: 5, // 结束半径
          length: 10, // 树枝 segment 长度
          vector: new THREE.Vector3(1, 0, 0)
        });
        setBranchToMax(rootBranch);

        ani.scene.add(tree.obj);
        trees.push(tree);
        branchObjs.push(rootBranch.branchObj);
        branchPoints.push(rootBranch.controls.startPoint);
        branchPoints.push(rootBranch.controls.endPoint);
      }

  }

});

//////////////////
// let tree = new Tree();
// let geometry = new THREE.BoxGeometry( 10, 10, 10 );
// let material = new THREE.MeshBasicMaterial( {color: new THREE.Color(0x00ff00)} );
// let cube = new THREE.Mesh( geometry, material );
// tree.obj.add( cube );


// let rootBranch = new Branch(tree, null, {
//   isIsolate: true,
//   radiusStart: 5, // 开始半径
//   radiusEnd: 5, // 结束半径
//   length: 20, // 树枝 segment 长度
//   vector: new THREE.Vector3(1, 0, 0)
// });
// setBranchToMax(rootBranch);

// ani.scene.add(tree.obj);
// trees.push(tree);
// branchObjs.push(rootBranch.branchObj);
// branchPoints.push(rootBranch.controls.startPoint);
// branchPoints.push(rootBranch.controls.endPoint);
//////////////////



function changeEditingBranchObj(branchObj) {
  if (editingBranchObj) {
    let oldBranch = editingBranchObj.branch;

    oldBranch.branchObj.material.color = new THREE.Color(0xdddddd);
    oldBranch.isIsolate && oldBranch.controls.startPoint.scale.set(0.1, 0.1, 0.1);
    oldBranch.controls.endPoint.scale.set(0.1, 0.1, 0.1);
    transformControl.object &&　transformControl.detach(transformControl.object);
    editingBranchObj = null;
  }
  
  if (branchObj) {
    let branch = branchObj.branch;
    editingBranchObj = branch.branchObj;
    branch.isIsolate && branch.controls.startPoint.scale.set(1, 1, 1);
    branch.controls.endPoint.scale.set(1, 1, 1);
    editingBranchObj.material.color = new THREE.Color(0xdd3333);
  }

}

function setBranchToMax(branch) {
  branch.currentLength = branch.length;
  branch.updateBranch();
}

function updateBranchByPoints(branch) {
  branch.updateVector();
  branch.updateBranch();
  // console.log(branch.controls.endPoint.scale);
}

ani.start();