import Face from '../Face.js';
import Group from '../Group.js';
import * as CONST from '../CONST.js';

export default class Box extends Group {
  constructor(width, height, depth, color) {
    super();
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.faces = {
      front: new Face(),
      back: new Face(),
      left: new Face(),
      right: new Face(),
      top: new Face(),
      bottom: new Face(),
    };

    this.setSize(width, height, depth);

    for (const key in this.faces) {
      this.faces[key].elem.style.background = color;
      this.faces[key].elem.style.fontSize = '60px';
      this.faces[key].elem.style.color = 'red';
      this.faces[key].elem.style.textAlign = 'center';
      // this.faces[key].elem.innerHTML = '<span>CSS camera<span>';
      // this.faces[key].elem.innerHTML = 'css css css css css css';
      this.add(this.faces[key]);
    }
  }

  setSize(width, height, depth) {
    this.faces.front.setPosition(0, 0, depth / 2);
    this.faces.front.elem.style.width = `${width}px`;
    this.faces.front.elem.style.height = `${height}px`;

    this.faces.back.setPosition(0, 0, -depth / 2);
    this.faces.back.rotation.x = CONST.R180;
    this.faces.back.elem.style.width = `${width}px`;
    this.faces.back.elem.style.height = `${height}px`;

    this.faces.left.setPosition(-width / 2, 0, 0);
    this.faces.left.rotation.y = -CONST.R90;
    this.faces.left.elem.style.width = `${depth}px`;
    this.faces.left.elem.style.height = `${height}px`;

    this.faces.right.setPosition(width / 2, 0, 0);
    this.faces.right.rotation.y = CONST.R90;
    this.faces.right.elem.style.width = `${depth}px`;
    this.faces.right.elem.style.height = `${height}px`;

    this.faces.top.setPosition(0, height / 2, 0);
    this.faces.top.rotation.x = -CONST.R90;
    this.faces.top.elem.style.width = `${width}px`;
    this.faces.top.elem.style.height = `${depth}px`;

    this.faces.bottom.setPosition(0, -height / 2, 0);
    this.faces.bottom.rotation.x = CONST.R90;
    this.faces.bottom.elem.style.width = `${width}px`;
    this.faces.bottom.elem.style.height = `${depth}px`;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }

  setColor(color) {
    if (!color) {
      return;
    }

    this.color = color;
    for (const key in this.faces) {
      this.faces[key].elem.style.color = color;
    }
  }
}
