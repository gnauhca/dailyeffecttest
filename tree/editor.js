import Branch from './Branch.js';
import Tree from './Tree.js';
import Ani from './Ani.js';
import { create } from 'domain';

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
  editor.transformControl.update();
}


let editor = {
  normalColor: new THREE.Color(0xaaaaaa),
  editingColor: new THREE.Color(0x00ff00),
  hoverColor: new THREE.Color(0xffff00)
};
editor.trees = [];
editor.editingBranchObj = null;
editor.hoveringBranchObj = null;
editor.branchObjs = [];

editor.transformControl = new THREE.TransformControls(ani.camera, ani.renderer.domElement);
// transformControl.addEventListener('change', render);
ani.scene.add(editor.transformControl);

editor.transformControl.addEventListener('objectChange', function(e) {
  updateBranchByPoints();
});


editor.branchDragcontrols = new THREE.DragControls(editor.branchObjs, ani.camera, ani.renderer.domElement); 
editor.branchDragcontrols.enabled = false;
editor.branchDragcontrols.addEventListener('hoveron', function(event) {
  if (editor.hoveringBranchObj) {
    editor.hoveringBranchObj.material.color = editor.normalColor;
    editor.hoveringBranchObj = null;
  }
  if (event.object !== editor.editingBranchObj) {
    editor.hoveringBranchObj = event.object;
    editor.hoveringBranchObj.material.color = editor.hoverColor; // 黄色鼠标悬浮
  }
});

editor.branchDragcontrols.addEventListener('hoveroff', function(event) {
  if (editor.hoveringBranchObj) {
    editor.hoveringBranchObj.material.color = editor.normalColor;
    editor.hoveringBranchObj = null;
  }
});

editor.branchPoints = [];
editor.branchPointsDragControlls = new THREE.DragControls(editor.branchPoints, ani.camera, ani.renderer.domElement);
editor.branchPointsDragControlls.enabled = false;
editor.branchPointsDragControlls.addEventListener('hoveron', function(event) {
  editor.transformControl.attach(event.object);
});

window.addEventListener('dblclick', function() {
  if (editor.hoveringBranchObj) {
    changeEditingBranchObj(editor.hoveringBranchObj);
    editor.hoveringBranchObj = null;
  } else {
    changeEditingBranchObj(null);
  }
});

window.addEventListener('keydown', function(event) {

  switch (event.keyCode) {

    case 81: // Q
      editor.transformControl.setSpace(editor.transformControl.space === "local" ? "world" : "local");
      break;

    case 17: // Ctrl
      editor.transformControl.setTranslationSnap(100);
      editor.transformControl.setRotationSnap(THREE.Math.degToRad(15));
      break;

    case 87: // W
      editor.transformControl.setMode("translate");
      break;

    case 69: // E
      editor.transformControl.setMode("rotate");
      break;

    case 82: // R
      editor.transformControl.setMode("scale");
      break;

    case 187:
    case 107: // +, =, num+
      editor.transformControl.setSize(editor.transformControl.size + 0.1);
      break;

    case 189:
    case 109: // -, _, num-
      editor.transformControl.setSize(Math.max(editor.transformControl.size - 0.1, 0.1));
      break;

    case 32: // space add branch
      let branch = createBranch(editor.editingBranchObj ? editor.editingBranchObj.branch : null);
      changeEditingBranchObj(branch.branchObj);
    break;

    case 8: // delete branch
      if (editor.editingBranchObj) {
        let branchToDelete = editor.editingBranchObj.branch;
        let branchObjToEdit = branchToDelete.parent ? branchToDelete.parent.branchObj : null;

        changeEditingBranchObj(branchObjToEdit);
        deleteBranch(branchToDelete);
      }

  }

});

function createTree() {
  let tree = new Tree();
  ani.scene.add(tree.obj)
  editor.trees.push(tree);

  return tree;
}

function createBranch(parentBranch) {
  let config;
  let tree;
  let branch;
  let startPoint;
  let endPoint;

  if (parentBranch) {
    config = {
      radiusStart: parentBranch.radiusEnd,
      radiusEnd: parentBranch.radiusEnd,
      vector: new THREE.Vector3(Math.random() - 0.5, Math.random(), Math.random() - 0.5),
      length: 10,
      currentLength: 10
    };
    tree = parentBranch.tree;
    startPoint = parentBranch.endPoint;
    branch = new Branch(tree, parentBranch, config);
    if (!parentBranch.connectedChild) {
      parentBranch.connectedChild = branch;
    } else {
      parentBranch.isolatedChildren.push(branch);
    }
  } else {
    config = {
      radiusStart: 5,
      radiusEnd: 5,
      vector: new THREE.Vector3(1, 0, 0),
      length: 10,
      currentLength: 10
    };
    tree = createTree();
    startPoint = createControlPoint(config.radiusStart);
    branch = new Branch(tree, parentBranch, config);
  }
  branch.updateBranch();

  startPoint.branchChildren.push(branch);
  
  endPoint = createControlPoint(branch.endRadius);
  endPoint.branchParent = branch;

  branch.startPoint = startPoint;
  branch.endPoint = endPoint;

  startPoint.position.copy(branch.start);
  endPoint.position.copy(branch.end);

  editor.branchObjs.push(branch.branchObj);

  return branch;
}

function deleteBranch(branch) {
  if (!branch) {
    return;
  }

  deleteBranch(branch.connectedChild);
  for (let i = branch.isolatedChildren.length; i >=0; i--) {
    deleteBranch(branch.isolatedChildren[i]);
  }

  if (!branch.parent) {
    ani.scene.remove(branch.startPoint);
    delete branch.startPoint;
  }
  ani.scene.remove(branch.endPoint);
  delete branch.endPoint;
  branch.destroy();
}

function createControlPoint(radius) {
  let sphereGeom = new THREE.SphereGeometry(0.5, 8, 8);
  let material = new THREE.MeshBasicMaterial({color: 0xff0000, visible: false});
  let point = new THREE.Mesh(sphereGeom, material);

  point.branchParent = null;
  point.branchChildren = [];
  point.scale.set(radius);
  ani.scene.add(point);
  return point;
}

function loadConfig() {

}

function saveConfig() {

}

function changeEditingBranchObj(branchObj) {
  if (editor.editingBranchObj) {
    let oldBranch = editor.editingBranchObj.branch;

    oldBranch.branchObj.material.color = editor.normalColor;
    oldBranch.startPoint.material.visible = false;
    // oldBranch.startPoint.material.needsUpdate = true;
    oldBranch.endPoint.material.visible = false;
    // oldBranch.startPoint.material.needsUpdate = true;
    editor.editingBranchObj = null;
  }
  
  if (branchObj) {
    let branch = branchObj.branch;
    editor.editingBranchObj = branch.branchObj;

    branch.startPoint.material.visible = true;
    branch.endPoint.material.visible = true;
    branch.material.color = editor.editingColor;


    // branch.startPoint.position.copy(branch.start);
    // branch.endPoint.position.copy(branch.end);

    editor.branchPoints.length = 0;
    editor.branchPoints.push(branch.startPoint, branch.endPoint);

    branch.startPoint.position.copy(branch.start);
    branch.endPoint.position.copy(branch.end);
    branch.startPoint.scale.set(branch.radiusStart, branch.radiusStart, branch.radiusStart);
    branch.endPoint.scale.set(branch.radiusEnd, branch.radiusEnd, branch.radiusEnd);
  }

  editor.transformControl.detach();
}

function updateBranchByPoints() {
  let branch = editor.editingBranchObj.branch;

  branch.radiusStart = branch.startPoint.scale.x;
  branch.radiusEnd = branch.endPoint.scale.x;
  branch.start.copy(branch.startPoint.position);
  branch.end.copy(branch.endPoint.position);

  if (branch.parent) {
    branch.parent.radiusEnd = branch.radiusStart;
    branch.parent.end = branch.start;
  }

  branch.updateVector();
  branch.updateBranch();

  if (branch.parent) {
    branch.parent.updateVector();
    branch.parent.updateBranch();
  }
}

ani.start();