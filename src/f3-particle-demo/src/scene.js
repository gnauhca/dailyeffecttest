class Scene {
  constructor() {
    this.objs = [];
  }

  add(obj) {
    this.objs.push(obj);
  }

  remove(obj) {
    this.objs = this.objs.filter((o) => o !== obj);
  }
}

export { Scene };
