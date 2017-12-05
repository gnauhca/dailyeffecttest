import Branch from './Branch.js';
import Tree from './Tree.js';
import Ani from './Ani.js';

let ani = new Ani();
let treeConfigs;
let trees = [];


async function loadConfig() {
  let configStr = localStorage.getItem('treeConfigs');
  let config = [];
  if (configStr) {
    config = JSON.parse(configStr);
  } 
  // config.push(require('./treeConfig.json')[0]);
  // config.push(require('./root.json')[0]);
  return config;
}

async function init() {

  treeConfigs = await loadConfig();
  
  treeConfigs.map(function(treeConfig) {
    let tree = new Tree(treeConfig);
    let rootBranchConfig = treeConfig.branches[treeConfig.rootBranchId];
    let rootBranch = new Branch(tree, null, rootBranchConfig, treeConfig);

    ani.scene.add(tree.obj);
    trees.push(tree);
    // tree.grow();
  });

  ani.onUpdate = function(delta) {
    trees.forEach(tree => {
      tree.grow(delta);
    });
  }

  ani.start();
}

init();