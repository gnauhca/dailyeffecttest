const gui = new dat.GUI();

const texts = [
  '一块捐 一起爱',
  '一起种希望',
  '一起关注公益',
  '一起节约用水',
  '一起捐微笑',
  '一起做好事',
];
const textsEn = [
  'Give together Love together',
  'Planting hope together',
  'Do good things',
  'Focus on public welfare together',
  'Conserve water together',
  'Give a smile together',
  'Do good things together',
];
const colors = [
  '#ffc648',
  '#f9b8e0',
  '#5277ef',
  '#51e5e5',
  '#afd16d',
  '#ffb176',
];
const icons = [
  '\uf43f',
  '\uf268',
  '\uf328',
  '\uf0f4',
  '\uf25e',
  '\uf798',
];

const tagRowCount = 7;
const tagMargin = 1;
const tagHeight = 10;
const tagRowGap = 6;
const tagsTotalWidthHeightRatio = 10;
const tagRowHeight = tagHeight + tagRowGap;
const tagsTotalRowHeight = tagRowHeight * tagRowCount;
const tagsHalfRowHeight = tagsTotalRowHeight / 2;
const tagsTotalRowWidth = tagsTotalRowHeight * tagsTotalWidthHeightRatio;
const tagsHalfRowWidth = tagsTotalRowWidth / 2;
const cameraFov = 60;
const cameraZTotalRowHeightRatio = 4;
const cameraZ = tagsTotalRowHeight * cameraZTotalRowHeightRatio;

const config = {
  tagRowCount: {
    type: 'float',
    value: tagRowCount,
    // range: [4, 12]
  },
  tagHeight: {
    type: 'float',
    value: tagHeight,
    range: [5, 50]
  },
  tagMargin: {
    type: 'float',
    value: tagMargin,
    range: [0, 30]
  },
  tagRowGap: {
    type: 'float',
    value: tagRowGap,
    range: [0, 100]
  },
  tagsTotalWidthHeightRatio: {
    type: 'float',
    value: tagsTotalWidthHeightRatio,
    range: [0, 20]
  },
  tagRowHeight: {
    type: 'float',
    value: tagRowHeight,
  },
  tagsTotalRowHeight: {
    type: 'float',
    value: tagsTotalRowHeight
  },
  tagsHalfRowHeight: {
    type: 'float',
    value: tagsHalfRowHeight,
  },
  tagsHalfRowWidth: {
    type: 'float',
    value: tagsHalfRowWidth
  },
  tagsTotalRowWidth: {
    type: 'float',
    value: tagsTotalRowWidth
  },
  cameraZTotalRowHeightRatio: {
    type: 'float',
    value: cameraZTotalRowHeightRatio,
  },
  cameraZ: {
    type: 'float',
    value: cameraZ,
    range: [0, 1000]

  },
};
configListeners = [];

function updateConfig() {
  config.tagRowHeight.value = config.tagHeight.value + config.tagRowGap.value;
  config.tagsTotalRowHeight.value = config.tagRowHeight.value * config.tagRowCount.value;
  config.tagsHalfRowHeight.value = config.tagsTotalRowHeight.value / 2;
  config.tagsTotalRowWidth.value = config.tagsTotalRowHeight.value * config.tagsTotalWidthHeightRatio.value;
  config.tagsHalfRowWidth.value = config.tagsTotalRowWidth.value / 2;
  // config.cameraZ.value = config.tagsTotalRowHeight.value * config.cameraZTotalRowHeightRatio.value;
  // console.log(config);
  configListeners.forEach(listener => listener());
}

for (let key in config) {
  const configItem = config[key];
  configItem[key] = configItem.value;
  if (config[key].range) {
    gui.add(config[key], key, configItem.range[0], configItem.range[1]).listen().onChange(value => {
      config[key].value = value;
      updateConfig();
    });
  }
}

const uniform = {
  ...config
}

function getTexture(typeIndex, type) {

  const types = ['icon', 'text', 'texten'];
  const typeName = types[typeIndex];
  const imgs = document.querySelectorAll(`.${typeName}-img`);
  const img = imgs[type];

  const texture = new THREE.TextureLoader().load(img.src);
  texture.img = img;
  return texture;
}

function step(min, max, value) {
  return Math.max(Math.min(value, max), min);
}

class Base {
  constructor() {
    configListeners.push(() => this.onConfigUpdate());
  }
  onConfigUpdate() {

  }
}

class Path extends Base {
  constructor(options, scene) {
    super();
    const defaults = {
      initialTagType: 0,
      angle: 0,
      v: 0
    };
    this.scene = scene;
    this.options = Object.assign({}, defaults, options);
    Object.assign(this, this.options);
    this.v = this.options.v * config.tagHeight.value / 1000;
    this.width = config.tagsTotalRowWidth.value;
    this.y = this.options.yIndex * tagRowHeight;
    this.startX = this.width / -2;
    this.endX = this.width / 2;
    this.tags = [];

    this.tagType = this.options.initialTagType || (Math.random() * 6) | 0;
    this.tagTypeIndex = 0;
    this.addTags();
  }

  addTags() {
    let lastTag = this.tags[this.tags.length - 1];
    let lastX = lastTag ? lastTag.x + lastTag.width / 2 : this.startX;
    
    while (lastX < this.endX) {
      
      this.tagTypeIndex += 1;
      if (this.tagTypeIndex === 3) {
        this.tagTypeIndex = 0;
        this.tagType += 1;
        this.tagType = this.tagType % 6;
      }
      
      const texture = getTexture(this.tagTypeIndex, this.tagType);
      const tagWidth = config.tagHeight.value * texture.img.width / texture.img.height;
      lastX += tagWidth / 2;
      const tag = new Tag({ 
        x: lastX, 
        y: this.y,
        texture,
        width: tagWidth,
        height: config.tagHeight.value
      }, this, this.scene);
      this.tags.push(tag);

      lastX += tagWidth / 2 + config.tagMargin.value;
    }
  }

  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      tag.destroy();
      this.tags.splice(index, 1);
    }
  }

  update() {
    for (let i = this.tags.length - 1; i >= 0; i--) {
      const tag = this.tags[i];
      const newX = tag.x + this.v;

      if (newX < this.startX || newX > this.endX) {
        this.removeTag(tag);
      } else {
        tag.updatePos(newX, this.y);
      }
      this.addTags();
    }
  }

  onConfigUpdate = () => {
    const prevWidth = this.width;
    const currWidth = config.tagsTotalRowWidth.value;
    const ratio = currWidth / prevWidth;

    this.v = this.options.v * config.tagHeight.value / 1000;
    this.width = config.tagsTotalRowWidth.value;
    this.y = this.options.yIndex * config.tagRowHeight.value;
    this.startX = this.width / -2;
    this.endX = this.width / 2;
    
    if (this.tags.length > 0) {
      this.tags.forEach(tag => {
        tag.updateOptions({
          width: config.tagHeight.value * tag.texture.img.width / tag.texture.img.height,
          height: config.tagHeight.value
        });
      });

      let removeTags = [];
      let lastX = this.tags[0].x * ratio - this.tags[0].width / 2;
      
      this.tags.forEach(tag => {
        lastX += tag.width / 2;
        if (lastX < this.startX || lastX > this.endX) {
          removeTags.push(tag);
        } else {
          tag.updatePos(lastX, this.y);
        }
        lastX += tag.width / 2 + config.tagMargin.value;
      });
      removeTags.forEach(tag => this.removeTag(tag));
    }
  }

}

class Tag {

  constructor(options, path, scene) {

    Object.assign(this, options);
    this.options = options;
    this.scene = scene;
    this.path = path;
    this.plane = this.createPlane();
    this.gemo = this.plane.geometry;
    this.initGemo = this.plane.geometry.clone();

    // this.updatePos(this.x, this.y);
    this.scene.add(this.plane);
  }

  getTexture(type, num) {

    const imgs = document.querySelectorAll(`.${type}-img`);
    const img = imgs[num];

    const texture = new THREE.TextureLoader().load(img.src);
    texture.realWidth = tagHeight * img.width / img.height;
    texture.realHeight = tagHeight * 1.0;
    cache[type + texture];
    return texture;
  }

  createPlane() {
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 10, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: false, map: this.texture });
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        ...uniform,
        texture1: { value: this.texture },
        objPos: {
          type: 'vec3',
          value: new THREE.Vector3(this.x, this.options.y, 0)
        },
        opacity: {
          type: 'float',
          value: 1
        },
      },
      depthTest: false,
      transparent: true,
      side: THREE.DoubleSide,
      // wireframe: true
    });

    const plane = new THREE.Mesh(geometry, shaderMaterial);
    // const plane = new THREE.Mesh(geometry, material);
    return plane;
  }

  updateOptions(options) {
    this.options = Object.assign(this.options, options);
    Object.assign(this, options);
    this.scene.remove(this.plane);
    this.plane = this.createPlane();
    this.gemo = this.plane.geometry;
    this.scene.add(this.plane);
    this.initGemo = this.plane.geometry.clone();
  }

  updatePos(x, y) {
    this.x = x;
    this.y = y;
    console.log(x, y);
    const position = new THREE.Vector3(this.x, this.options.y);
    let scale = step(0, 1, Math.abs(this.x / config.tagsHalfRowWidth.value / 0.8));
    scale = easing.easeOutQuad(scale);
    scale = step(0, 1, scale);

    let opacity = step(0, 1, Math.abs(this.x / config.tagsHalfRowWidth.value / 0.4));
    opacity = easing.easeOutQuad(opacity);
    opacity = step(0, 1, opacity);


    this.plane.material.uniforms.objPos.value = position;
    this.plane.material.uniforms.opacity.value = opacity;

    for(let uniformKey in this.plane.material.uniforms) {
      if (config[uniformKey]) {
        this.plane.material.uniforms[uniformKey].value = config[uniformKey].value;
      }
    }

    this.plane.position.x = x;
    this.plane.position.y = y;

    // this.plane.scale.copy(new THREE.Vector3(scale, scale, scale));
    if (this.x < 0) {
      this.plane.rotation.x += Math.PI;
    }


    
    // this.gemo.vertices.forEach(vec => {
    //   const pos = this.path.getPos(vec.x + x, vec.y);
    //   vec.x = pos.x;
    //   vec.y = pos.y;
    // });

    // const pos = this.path.getPos(x, 0);
    // this.plane.position.copy(new THREE.Vector3(pos.x, pos.y));

    // this.gemo.verticesNeedUpdate = true;
  }

  destroy() {
    this.scene.remove(this.plane);
    this.patch = null;
    this.gemo = null;
    this.initGemo = null;
  }
}

class TagRender extends Base {
  constructor() {
    super();

    const width = window.innerWidth * 1;
    const height = width * 9 / 16;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(cameraFov, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.position.set(0, 0, config.cameraZ.value * 2);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    // this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(3);
    this.renderer.setSize(width, height);
    // this.renderer.setPixelRatio(4);
    // this.renderer.setSize(width, height, false);
    // this.renderer.setViewport(0, 0, width, height);
    document.querySelector('body').appendChild(this.renderer.domElement);

    const gridHelper = new THREE.GridHelper(500, 10, 0xddddd, 0xff0000);
    gridHelper.rotation.x = Math.PI / 2;
    this.scene.add(gridHelper);

    this.paths = this.createPaths();
  }

  createPaths() {
    const paths = [];

    for (let i = -tagRowCount / 2; i < tagRowCount / 2 + 1; i++) {
      const path = new Path({
        yIndex: i,
        initialTagType: (Math.random() * 6) | 0
      }, this.scene);
      paths.push(path);
    }
    return paths;
  }

  update() {
    this.paths.forEach(path => {
      path.update();
    });
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
    
  onConfigUpdate = () => {
    this.camera.position.z = config.cameraZ.value * 2;
    this.update();
    setTimeout(() => {
      this.render();
    }, 300);
    setTimeout(() => {
      this.render();
    }, 600);
  }
}

class Ani {
  constructor() {
    this.renderer = new TagRender();
  }

  start() {
    this.tick = window.requestAnimationFrame(() => this.update());
  }

  stop() {
    window.cancelAnimationFrame(this.tick);
  }

  update() {
    this.renderer.update();
    setTimeout(() => {
      this.renderer.render();
    }, 300);
    // this.tick = window.requestAnimationFrame(() => this.update());
  }
}

let ani;
window.onload = function () {
  ani = new Ani();

  ani.start();
}

// download img
function download() {
  // document.getElementById("downloader").download = "image.png";
  // document.getElementById("downloader").href = document.querySelector("canvas").toDataURL("image/png");
  window.open(ani.renderer.renderer.domElement.toDataURL('image/png'), 'screenshot');
}

document.querySelector('a').addEventListener('click', download);