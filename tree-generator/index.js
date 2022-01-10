import Branch from './Branch.js';
import Tree from './Tree.js';
import Ani from './Ani.js';

const ani = new Ani();
let treeConfigs;
const trees = [];

async function loadConfig() {
  const configStr = localStorage.getItem('treeConfigs');
  let config = [];
  if (configStr) {
    config = JSON.parse(configStr);
  }

  config = require('./config1222.json');

  return config;
}

async function init() {
  treeConfigs = await loadConfig();
  ani.obj = new THREE.Group();

  treeConfigs.map((treeConfig) => {
    const tree = new Tree(treeConfig);
    const rootBranchConfig = treeConfig.branches[treeConfig.rootBranchId];
    const rootBranch = new Branch(tree, null, rootBranchConfig, treeConfig);

    ani.scene.add(tree.obj);
    trees.push(tree);
    // tree.grow();
  });

  ani.onUpdate = function (delta) {
    trees.forEach((tree) => {
      tree.grow(delta);
    });
  };
  ani.camera.position.set(-48, 40, 90);
  ani.camera.lookAt(new THREE.Vector3(-48, 40, 0));
  const helper = new THREE.GridHelper(2000, 100);
  helper.position.y = 0;
  helper.material.opacity = 0.45;
  helper.material.transparent = true;
  ani.scene.add(helper);

  const geometry = new THREE.PlaneGeometry(2000, 2000, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.y = -0.01;
  plane.rotation.x = Math.PI * 0.5;
  ani.scene.add(plane);

  ani.start();
}

init();
