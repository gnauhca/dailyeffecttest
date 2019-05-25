class Path {
  constructor(options) {

  }

  getPos(x) {

  }

  getV(x) {

  }

  getRotation(x) {
    
  }
}

class Tag {
  constructor(options) {
    const { x, path } = options;
    this.options = options;
    this.path = path;
    this.width = 0;
    this.height = 0;
    this.img = null;
    this.updatePos(x);
  }

  updatePos(x) {
    this.x = x;
    this.pos = this.path.getPos(x);
    this.rotation = this.path.getRotation(x);
  }

  update() {
    const v = this.pos.getV(this.x);
    const x = this.x + v;
    this.updatePos(x);
  }
}

class TagRender {
  constructor() {

  }

  addTag() {

  }

  update() {

  }

  render() {

  }
}

class Ani {
  constructor() {

  }

  update() {

  }
}

Ani.start();