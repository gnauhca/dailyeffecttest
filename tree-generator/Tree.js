import { defaultsDeep } from 'lodash';

export default class Tree {
  constructor(options) {
    const defaults = {
      color: 0x00000,
      maxDeep: 8,
      maxLength: 20,
      maxSpeed: 1.5, // progress/second
      radiusReduceSpeed: 0.4 / 10, // 每 1 长度减少的 radius 百分比
      rootRadius: 5,
      name: 'tree',
      delay: 0,
    };

    options = defaultsDeep(options, defaults);
    Object.assign(this, options);

    if (this.name.indexOf('root') > -1) {
      this.delay = 3000;
    }

    this.radiusPercent = 0;
    this.radiusPercentSpeed = 0.2;

    this.lengthPercent = 0;
    this.lengthPercentSpeed = 0.2;

    this.branches = []; // 枝

    this.leaves = []; // 叶
    this.obj = new THREE.Group();

    // let rootBranch = new Branch(this, null, {
    //   isIsolate: true,
    //   angles: [0, 90 * RADIAN],
    //   startRadius: this.rootRadius,
    //   endRadius: this.rootRadius * 0.8,
    //   length: this.maxLength,
    //   branchLength: this.maxLength,
    //   speed: this.maxSpeed
    // });
  }

  addBranch(branch) {
    this.branches.push(branch);

    this.obj.add(branch.branchObj);
  }

  grow(delta) {
    const second = delta * 0.0001;

    this.branches.forEach((branch, i) => {
      branch.grow(delta);
    });

    if (this.radiusPercent < 1) { this.radiusPercent += this.radiusPercentSpeed * delta * 0.001; }
    if (this.lengthPercent < 1) { this.lengthPercent += this.lengthPercentSpeed * delta * 0.001; }
    this.radiusPercent = Math.min(this.radiusPercent, 1);
    this.lengthPercent = Math.min(this.lengthPercent, 1);
    // console.log(this.radiusPercent );
  }
}
