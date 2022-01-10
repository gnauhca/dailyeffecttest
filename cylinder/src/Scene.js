import Group from './Group.js';
import Light from './Light.js';

export default class Scene {
  constructor(container) {
    const viewWrapperStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      'transform-style': 'preserve-3d',
    };

    this.container = container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.viewWrapper = document.createElement('div');
    Object.assign(viewWrapperStyles, {
      width: this.width,
      height: this.height,
    });
    for (const item in viewWrapperStyles) {
      let value = viewWrapperStyles[item];

      if (typeof value === 'number') {
        value += 'px';
      }

      this.viewWrapper.style[item] = value;
    }

    this.container.appendChild(this.viewWrapper);
    this.objs = [];
    this.lights = [];

    this.sizeUpdated = true;
  }

  resize() {
    const viewWrapperStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      'transform-style': 'preserve-3d',
    };

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    Object.assign(viewWrapperStyles, {
      width: this.width,
      height: this.height,
    });
    for (const item in viewWrapperStyles) {
      let value = viewWrapperStyles[item];

      if (typeof value === 'number') {
        value += 'px';
      }

      this.viewWrapper.style[item] = value;
    }
    this.sizeUpdated = true;
  }

  add(obj) {
    // let add = (o) => {
    //   if (o instanceof Group) {
    //     o.children.forEach(oc => add(oc));
    //   } else {
    //     this.viewWrapper.appendChild(o.elem);
    //     this.faces.push(o);
    //   }
    // }
    // add(obj);

    this.objs.push(obj);
    if (obj.elem) {
      this.viewWrapper.appendChild(obj.elem);
    }
  }

  addLight(light) {
    this.lights.push(light);
  }

  setAmbientLightIntensity(ambientLightIntensity) {
    this.ambientLightIntensity = ambientLightIntensity;
  }
}
