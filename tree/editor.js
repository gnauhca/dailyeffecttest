import Branch from './Branch.js';
import Tree from './Tree.js';
import Ani from './Ani.js';

let ani = new Ani();


transformControl = new THREE.TransformControls(ani.camera, ani.renderer.domElement);
transformControl.addEventListener('change', render);
ani.scene.add(transformControl);

transformControl.addEventListener('objectChange', function(e) {
  updateSplineOutline();
});

let editingBranch = null;
let branchObjs = [];
let branchDragcontrols = new THREE.DragControls(branchObjs, ani.camera, ani.renderer.domElement); //
branchDragcontrols.addEventListener('hoveron', function(event) {
  event.object;
});

branchDragcontrols.addEventListener('hoveroff', function(event) {});

let branchPoints = [];
let branchPointsDragControlls = new THREE.DragControls(branchObjs, ani.camera, ani.renderer.domElement);
branchPointsDragControlls.addEventListener('hoveron', function(event) {
  transformControl.attach(event.object);
});

window.addEventListener('keydown', function(event) {

  switch (event.keyCode) {

    case 81: // Q
      control.setSpace(control.space === "local" ? "world" : "local");
      break;

    case 17: // Ctrl
      control.setTranslationSnap(100);
      control.setRotationSnap(THREE.Math.degToRad(15));
      break;

    case 87: // W
      control.setMode("translate");
      break;

    case 69: // E
      control.setMode("rotate");
      break;

    case 82: // R
      control.setMode("scale");
      break;

    case 187:
    case 107: // +, =, num+
      control.setSize(control.size + 0.1);
      break;

    case 189:
    case 109: // -, _, num-
      control.setSize(Math.max(control.size - 0.1, 0.1));
      break;

    case 32: // space add branch
      if (editingBranch) {

      } else {
        
      }

  }

});
