import Branch from './Branch.js';
import Tree from './Tree.js';
import Ani from './Ani.js';

const ani = new Ani();

const gui = new dat.GUI();
const guiOptions = {
  treeName: 'treename',
  branchDelay: 0,
  branchZScale: 1,
  branchXZAngle: 0,

  resetCamera() {
    ani.camera.position.set(-13, 3, 50);
    ani.camera.lookAt(new THREE.Vector3(-13, 3, 0));
    ani.control.target = (new THREE.Vector3(-13, 3, 0));
  },

  leftView() {
    ani.camera.position.set(-50, 0, 0);
    ani.camera.lookAt(new THREE.Vector3());
    ani.control.target = (new THREE.Vector3());
  },
  frontView() {
    ani.camera.position.set(0, 0, 50);
    ani.camera.lookAt(new THREE.Vector3());
    ani.control.target = (new THREE.Vector3());
  },
  rightView() {
    ani.camera.position.set(50, 0, 0);
    ani.camera.lookAt(new THREE.Vector3());
    ani.control.target = (new THREE.Vector3());
  },
  backView() {
    ani.camera.position.set(0, 0, -50);
    ani.camera.lookAt(new THREE.Vector3());
    ani.control.target = (new THREE.Vector3());
  },
  topView() {
    ani.camera.position.set(0, 100, 0);
    ani.camera.lookAt(new THREE.Vector3());
    ani.control.target = (new THREE.Vector3());
  },

  save() {
    saveConfig();
  },

};

const resetCamera = gui.add(guiOptions, 'resetCamera');
const leftView = gui.add(guiOptions, 'leftView');
const frontView = gui.add(guiOptions, 'frontView');
const rightView = gui.add(guiOptions, 'rightView');
const backView = gui.add(guiOptions, 'backView');
const topView = gui.add(guiOptions, 'topView');

const save = gui.add(guiOptions, 'save');

const treeName = gui.add(guiOptions, 'treeName').listen();
const branchDelay = gui.add(guiOptions, 'branchDelay', 0, 16).listen();
const branchZScale = gui.add(guiOptions, 'branchZScale', 0, 1).listen();
const branchXZAngle = gui.add(guiOptions, 'branchXZAngle', 0, 360).listen();

treeName.onChange((value) => {
  if (!editor.editingBranchObj) return;
  editor.editingBranchObj.branch.tree.name = value;
});

branchDelay.onChange((value) => {
  if (!editor.editingBranchObj) return;
  editor.editingBranchObj.branch.delay = value;
});

branchZScale.onChange((value) => {
  if (!editor.editingBranchObj) return;
  editor.editingBranchObj.branch.pointsZScale = value;
  updateBranchByControls();
});

branchXZAngle.onChange((value) => {
  if (!editor.editingBranchObj) return;
  editor.editingBranchObj.branch.pointsXZAngle = value * Math.PI / 180;
  updateBranchByControls();
});
guiOptions.resetCamera();

const helper = new THREE.GridHelper(2000, 100);
helper.position.y = 0;
helper.material.opacity = 0.45;
helper.material.transparent = true;
ani.scene.add(helper);

const axes = new THREE.AxesHelper(1000);
axes.position.set(0, 0, 0);
ani.scene.add(axes);

ani.onUpdate = function () {
  editor.transformControl.update();
};

let editor = {
  normalColor: new THREE.Color(0xaaaaaa),
  editingColor: new THREE.Color(0x00ff00),
  hoverColor: new THREE.Color(0xffff00),
};
editor.trees = [];
editor.editingBranchObj = null;
editor.hoveringBranchObj = null;
editor.branchObjs = [];

editor.transformControl = new THREE.TransformControls(ani.camera, ani.renderer.domElement);
// transformControl.addEventListener('change', render);
ani.scene.add(editor.transformControl);

editor.transformControl.addEventListener('objectChange', (e) => {
  updateBranchByControls();
});

editor.branchDragcontrols = new THREE.DragControls(editor.branchObjs, ani.camera, ani.domWrap);
editor.branchDragcontrols.enabled = false;
editor.branchDragcontrols.addEventListener('hoveron', (event) => {
  if (editor.hoveringBranchObj) {
    editor.hoveringBranchObj.material.color = editor.normalColor;
    editor.hoveringBranchObj = null;
  }
  if (event.object !== editor.editingBranchObj) {
    editor.hoveringBranchObj = event.object;
    editor.hoveringBranchObj.material.color = editor.hoverColor; // 黄色鼠标悬浮
  }
});

editor.branchDragcontrols.addEventListener('hoveroff', (event) => {
  if (editor.hoveringBranchObj) {
    editor.hoveringBranchObj.material.color = editor.normalColor;
    editor.hoveringBranchObj = null;
  }
});

editor.branchPoints = [];
editor.branchPointsDragControlls = new THREE.DragControls(editor.branchPoints, ani.camera, ani.domWrap);
editor.branchPointsDragControlls.enabled = false;
editor.branchPointsDragControlls.addEventListener('hoveron', (event) => {
  editor.transformControl.attach(event.object);
});

window.addEventListener('dblclick', () => {
  if (editor.hoveringBranchObj) {
    changeEditingBranchObj(editor.hoveringBranchObj);
    editor.hoveringBranchObj = null;
  } else {
    changeEditingBranchObj(null);
  }
});

window.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case 81: // Q
      editor.transformControl.setSpace(editor.transformControl.space === 'local' ? 'world' : 'local');
      break;

    case 17: // Ctrl
      editor.transformControl.setTranslationSnap(100);
      editor.transformControl.setRotationSnap(THREE.Math.degToRad(15));
      break;

    case 87: // W
      editor.transformControl.setMode('translate');
      break;

    case 69: // E
      editor.transformControl.setMode('rotate');
      break;

    case 82: // R
      editor.transformControl.setMode('scale');
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
      const branch = createBranch(editor.editingBranchObj ? editor.editingBranchObj.branch : null);
      changeEditingBranchObj(branch.branchObj);
      break;

    case 8: // delete branch
      if (editor.editingBranchObj) {
        const branchToDelete = editor.editingBranchObj.branch;
        const branchObjToEdit = branchToDelete.parent ? branchToDelete.parent.branchObj : null;

        changeEditingBranchObj(branchObjToEdit);
        deleteBranch(branchToDelete);
      }
  }
});

function createTree(config) {
  const tree = new Tree(config);
  ani.scene.add(tree.obj);
  editor.trees.push(tree);
  tree.radiusPercent = 1;
  tree.lengthPercent = 1;
  return tree;
}

function createBranch(parentBranch, tree, config) {
  // let config;
  // let tree;
  let branch;
  let startPoint;
  let endPoint;

  if (parentBranch) {
    config = config || {
      startRadius: parentBranch.endRadius,
      endRadius: parentBranch.endRadius,
      vector: parentBranch.vector.clone(),
      length: parentBranch.length,
      currentLength: parentBranch.length,
      pointsZScale: parentBranch.pointsZScale,
      pointsXZAngle: parentBranch.pointsXZAngle,
    };
    config.currentLength = config.length;
    tree = parentBranch.tree;
    startPoint = parentBranch.endPoint;
    branch = new Branch(tree, parentBranch, config);
    if (!parentBranch.connectedChild) {
      parentBranch.connectedChild = branch;
    } else {
      // branch.vector.set(Math.random(), 0, Math.random());
      parentBranch.isolatedChildren.push(branch);
      branch.isIsolate = true;
    }
  } else {
    config = config || {
      isIsolate: true,
      startRadius: 5,
      endRadius: 5,
      vector: new THREE.Vector3(1, 0, 0),
      length: 10,
      currentLength: 10,
    };
    config.currentLength = config.length;
    tree = tree || createTree();
    startPoint = createControlPoint(config.startRadius);
    branch = new Branch(tree, parentBranch, config);
  }
  branch.branchObj.material.transparent = true;
  branch.branchObj.material.opacity = 0.5;
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
  for (let i = branch.isolatedChildren.length; i >= 0; i--) {
    deleteBranch(branch.isolatedChildren[i]);
  }

  if (!branch.parent) {
    ani.scene.remove(branch.startPoint);
    editor.trees = editor.trees.filter((tree) => tree !== branch.tree);

    ani.scene.remove(branch.tree.obj);
    delete branch.startPoint;
  }

  const branchObjsIndex = editor.branchObjs.indexOf(branch.branchObj);
  editor.branchObjs.splice(branchObjsIndex, 1);
  ani.scene.remove(branch.endPoint);
  delete branch.endPoint;
  branch.destroy();
}

function createControlPoint(radius) {
  const sphereGeom = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
  const point = new THREE.Mesh(sphereGeom, material);

  point.branchParent = null;
  point.branchChildren = [];
  point.scale.set(radius);
  ani.scene.add(point);
  return point;
}

function loadConfig(config) {
  function createBranchByConfig(parentBranch, tree, branchConfig, branchConfigs) {
    // for (let key in branchConfig) {
    //   if (['start', 'end', 'vector'].indexOf(key) > -1) {
    //     branchConfig[key] = new THREE.Vector3(...branchConfig[key]);
    //   }
    // }

    const branch = createBranch(parentBranch, tree, branchConfig);

    if (branchConfig.connectedChildId) {
      createBranchByConfig(branch, tree, branchConfigs[branchConfig.connectedChildId], branchConfigs);
    }

    for (let i = 0; i < branchConfig.isolatedChildrenIds.length; i++) {
      createBranchByConfig(branch, tree, branchConfigs[branchConfig.isolatedChildrenIds[i]], branchConfigs);
    }
  }

  config.forEach((treeConfig) => {
    treeConfig.name = treeConfig.treeName;

    const tree = createTree(treeConfig);
    createBranchByConfig(null, tree, treeConfig.branches[treeConfig.rootBranchId], treeConfig.branches);

    /* if (treeConfig.treeName.indexOf('root') > -1) {
      // let branches = {};
      for (let id in treeConfig.branches) {
        //

        let branch = treeConfig.branches[id]
        for(let key in branch) {
          if (['start', 'end', 'vector'].indexOf(key) > -1) {
            branch[key][0] *= -1;
            branch[key][2] *= -1;
          }
        }
      }

      // treeConfig.branches = branches;

      let tree = createTree(treeConfig);
      createBranchByConfig(null, tree, treeConfig.branches[treeConfig.rootBranchId], treeConfig.branches);
    } */
  });
}

function saveConfig() {
  const config = [];

  function saveBranchConfig(branch, branchConfigs) {
    const branchConfig = {
      id: branch.id,
      delay: branch.delay,
      start: [branch.start.x, branch.start.y, branch.start.z],
      end: [branch.end.x, branch.end.y, branch.end.z],
      startRadius: branch.startRadius,
      endRadius: branch.endRadius,
      length: branch.length,
      vector: [branch.vector.x, branch.vector.y, branch.vector.z],
      isIsolate: branch.isIsolate,
      parentId: branch.parent ? branch.parent.id : null,
      pointsZScale: branch.pointsZScale,
      pointsXZAngle: branch.pointsXZAngle,
      connectedChildId: branch.connectedChild ? branch.connectedChild.id : null,
      isolatedChildrenIds: branch.isolatedChildren.map((child) => child.id),
    };
    branchConfigs[branchConfig.id] = branchConfig;

    if (branch.connectedChild) {
      saveBranchConfig(branch.connectedChild, branchConfigs);
    }
    branch.isolatedChildren.forEach((child) => saveBranchConfig(child, branchConfigs));
  }

  editor.trees = editor.trees.filter((tree) => tree.branches.length);
  editor.trees.forEach((tree) => {
    const treeConfig = {
      treeName: tree.name,
      treeDelay: tree.delay,
      rootBranchId: tree.branches[0].id,
      branches: {},
    };

    saveBranchConfig(tree.branches[0], treeConfig.branches);
    config.push(treeConfig);
  });

  console.log(config);
  localStorage.setItem('treeConfigs', JSON.stringify(config));
}

function changeEditingBranchObj(branchObj) {
  if (editor.editingBranchObj) {
    const oldBranch = editor.editingBranchObj.branch;

    oldBranch.branchObj.material.color = editor.normalColor;
    oldBranch.startPoint.material.visible = false;
    // oldBranch.startPoint.material.needsUpdate = true;
    oldBranch.endPoint.material.visible = false;
    // oldBranch.startPoint.material.needsUpdate = true;
    editor.editingBranchObj = null;
  }

  if (branchObj) {
    const { branch } = branchObj;
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
    branch.startPoint.scale.set(branch.startRadius, branch.startRadius, branch.startRadius);
    branch.endPoint.scale.set(branch.endRadius, branch.endRadius, branch.endRadius);

    guiOptions.treeName = branch.tree.name;
    guiOptions.branchDelay = branch.delay;
    guiOptions.branchZScale = branch.pointsZScale;
    guiOptions.branchXZAngle = branch.pointsXZAngle / (Math.PI / 180);
  }

  editor.transformControl.detach();
}

function updateBranchByControls() {
  const { branch } = editor.editingBranchObj;

  branch.startRadius = branch.startPoint.scale.x;
  branch.endRadius = branch.endPoint.scale.x;
  branch.start.copy(branch.startPoint.position);
  branch.end.copy(branch.endPoint.position);

  if (branch.parent) {
    branch.parent.end = branch.start;
    if (!branch.isIsolate) {
      branch.parent.endRadius = branch.startRadius;
    }
  }

  branch.updateVector();
  branch.updateBranch();

  if (branch.parent) {
    branch.parent.updateVector();
    branch.parent.updateBranch();
  }
}

ani.start();

function init() {
  const configStr = localStorage.getItem('treeConfigs');
  let config = [];
  if (configStr) {
    config = JSON.parse(configStr);
  }
  // config.push(require('./treeConfig.json')[0]);
  // config.push(require('./root.json')[0]);
  // config.push(require('./config.json')[0]);
  config = require('./config1222.json');
  loadConfig(config);
}

init();
