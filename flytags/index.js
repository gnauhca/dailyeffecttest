
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

const vertexShader = `
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  float cn(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  uniform vec3 objPos;
  uniform float opacity;

  uniform float tagRowCount;
  uniform float tagHeight;
  uniform float tagRowGap;
  uniform float tagRowHeight;
  uniform float tagsTotalRowHeight;
  uniform float tagsHalfRowHeight;
  uniform float tagsHalfRowWidth;
  uniform float tagsTotalRowWidth;
  uniform float cameraFov;
  uniform float cameraZ;

  varying vec2 vUv;

  float PI = 3.14159;
  float PI2 = 3.14159 * 2.0;
  float PIM2 = 3.14159 / 2.0;

  float cubicOut(float t) {
    float f = t - 1.0;
    return f * f * f + 1.0;
  }

  float quarticOut(float t) {
    return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
  }

  float qinticIn(float t) {
    return pow(t, 5.0);
  }

  float qinticOut(float t) {
    return 1.0 - (pow(t - 1.0, 5.0));
  }

  void main() { 
    vUv = uv;

    vec3 objWorldPos = vec3(modelMatrix * vec4(objPos, 1.0));

    float objOffset = tagRowHeight;
    float objWorldNoise = cn(objWorldPos / tagsHalfRowWidth / 2.0);
    float objWorldPosAddX = cos(objWorldNoise * PI2) * objOffset;
    float objWorldPosAddY = sin(objWorldNoise * PI2) * objOffset;

    vec3 newPosition = vec3(position);
    newPosition.x = newPosition.x + objWorldPosAddX;
    newPosition.y = newPosition.y + objWorldPosAddY;
    // newPosition.z = objWorldPosAddX;

    vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vec3 initWorldPos = vec3(worldPosition);
    float absWorldX = abs(initWorldPos.x);
    float absWorldPer = absWorldX / tagsHalfRowWidth;

    // float scale = quarticOut(absWorldPer);

    // vec3 newPosition = position * scale;
    // worldPosition = modelMatrix * vec4(newPosition, 1.0);
    // initWorldPos = vec3(worldPosition);
    // absWorldX = abs(initWorldPos.x);

    float noise = cn(vec3(initWorldPos / tagsTotalRowHeight / 2.6) + 200.0) - 0.5;

    float xPer = (initWorldPos.x / tagsHalfRowWidth);
    float yPer = (initWorldPos.y / tagsHalfRowHeight);
    // float z = xPer * yPer * tagRowHeight ;

    // worldPosition.z = z;

    // 螺旋
    float widthPer = min(absWorldX / tagsHalfRowWidth / 2.0, 1.0);
    float anglePer = cubicOut(widthPer);
    float angle = anglePer * PI / 2.0 - PI / 2.0;
    angle = angle + initWorldPos.y / tagsTotalRowHeight * PI / 6.0;

    float lenPer = qinticOut(widthPer);
    // float angleX = initWorldPos.x + lenPer * tagsHalfRowWidth;
    float angleX = initWorldPos.x;
    
    worldPosition.x = angleX * cos(angle);
    worldPosition.y = angleX * sin(angle);

    // noise
    float xadd = cos(noise * PI2) * tagRowHeight;
    float yadd = sin(noise * PI2) * tagRowHeight;

    worldPosition.x = worldPosition.x + xadd;
    worldPosition.y = worldPosition.y + yadd;

    gl_Position = projectionMatrix * viewMatrix * worldPosition; 
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }

`;

const fragmentShader = `
  uniform sampler2D texture1;
  //纹理坐标
  varying vec2 vUv;
  uniform float opacity;

  void main(void){
      vec4 color = texture2D(texture1, vUv);
      
      color.a = color.a * opacity;
      gl_FragColor = color;
      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const height = 5;
const tagRowCount = 6;
const tagHeight = 10;
const tagRowGap = 6;
const tagRowHeight = tagHeight + tagRowGap;
const tagsTotalRowHeight = tagRowHeight * tagRowCount;
const tagsHalfRowHeight = tagsTotalRowHeight / 2;
const tagsTotalRowWidth = tagsTotalRowHeight * 8;
const tagsHalfRowWidth = tagsTotalRowHeight / 2;
const cameraFov = 60;
const cameraZ = tagsTotalRowHeight * 2;

const uniform = {
  tagRowCount: { type: 'float', value: tagRowCount },
  tagHeight: { type: 'float', value: tagHeight },
  tagRowGap: { type: 'float', value: tagRowGap },
  tagRowHeight: { type: 'float', value: tagRowHeight },
  tagsTotalRowHeight: { type: 'float', value: tagsTotalRowHeight },
  tagsHalfRowHeight: { type: 'float', value: tagsHalfRowHeight },
  tagsHalfRowWidth: { type: 'float', value: tagsHalfRowWidth },
  tagsTotalRowWidth: { type: 'float', value: tagsTotalRowWidth },
  cameraZ: { type: 'float', value: cameraZ },
}


class Path {
  constructor(options, scene) {
    const defaults = {
      tagType: 0,
      angle: 0,
      v: 1
    };
    this.scene = scene;
    this.options = Object.assign({}, defaults, options);
    this.endX = tagsTotalRowWidth / 2;
    this.currX = -1 * tagsTotalRowWidth - Math.random() * 100;
    this.tags = [];
    this.createTags();

    this.tagType = options.tagType;
    this.tagTypeIndex = 0;
  }

  createTags() {

    while (this.currX < this.endX) {
      console.log(this.currX);
      this.currX = this.addTypeTags(parseInt(Math.random() * 6), this.currX);
    }
  }

  addTypeTags(num, x) {
    let currX = x;
    const iconTag = new Tag({
      x: currX,
      y: this.options.y,
      type: 'icon',
      num, num,
      text: icons[num],
      height: this.options.height,
      color: colors[num]
    }, this, this.scene);
    currX += iconTag.width + 2;
    this.tags.push(iconTag);

    if (currX > this.endX) return currX;
    const textTag = new Tag({
      x: currX,
      y: this.options.y,
      type: 'text',
      num, num,
      text: texts[num],
      height: this.options.height,
      color: colors[num]
    }, this, this.scene);
    currX += textTag.width + 2;
    this.tags.push(textTag);

    if (currX > this.endX) return currX;
    const textEnTag = new Tag({
      x: currX,
      y: this.options.y,
      type: 'text',
      num, num,
      text: textsEn[num],
      height: this.options.height,
      color: colors[num]
    }, this, this.scene);

    this.tags.push(textEnTag);
    currX += textEnTag.width + 2;
    return currX;
  }

  getPos(x, y) {
    return getSpiralPos(this.options.angle, x, y);
  }

  // getV(x) {

  // }

  // getRotation(x) {

  // }

  update() {
    for (let i = this.tags.length - 1; i > 0; i--) {
      const tag = this.tags[i];

      tag.updatePos(tag.x);
      // tag.updatePos(tag.x - this.options.v);
      // if (tag.x < 0) {
      //   tag.destroy();
      //   this.tags.splice(i, 1);
      // }
    }
  }
}

class Tag {

  constructor(options, path, scene) {

    const { x } = options;
    this.scene = scene;
    this.x = x;
    this.options = options;
    this.path = path;
    this.img = this.getTexture(options.type, options.num);
    // this.texture = new THREE.TextureLoader().load(`./images/${options.type}${options.num+1}@3x.png`);
    this.width = this.img.realWidth;
    this.height = this.img.realHeight;

    this.plane = this.createPlane();
    this.gemo = this.plane.geometry;
    this.initGemo = this.plane.geometry.clone();
    // this.updatePos(x);
  }

  getTexture(type, num) {
    // if (cache[type + num]) {
    //   return cache[type + num];
    // }


    const imgs = document.querySelectorAll(`.${type}-img`);
    const img = imgs[num];

    // const ctx = cvs.getContext('2d');
    // cvs.width = 1024;
    // cvs.height = 1024;
    // cvs.realWidth = 5 * img.width / img.height;
    // cvs.realHeight = 5;

    // cache[type + num] = cvs;
    // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1024, 1024);
    // document.body.appendChild(cvs);


    // img.realWidth = 5 * img.width / img.height;
    // img.realHeight = 5;

    // img.width = 1024;
    // img.height = 1024;

    const texture = new THREE.TextureLoader().load(img.src);
    texture.realWidth = tagHeight * img.width / img.height;
    texture.realHeight = tagHeight * 1.0;
    cache[type + texture];
    return texture;
  }

  createPlane() {
    const scale = easing.easeOutQuint(Math.abs(this.options.x) / tagsTotalRowWidth) + 0.01;

    const position = new THREE.Vector3(this.options.x, this.options.y);
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 10, 5);
    const material = new THREE.MeshBasicMaterial({ color: this.options.color, side: THREE.DoubleSide, wireframe: false, map: this.img });
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        ...uniform,
        texture1: { value: this.img },
        pos: new THREE.Uniform(position),
        objPos: {
          type: 'vec3',
          value: new THREE.Vector3(this.options.x, this.options.y, 0)
        },
        opacity: {
          type: 'float',
          value: Math.max(scale, 0.02)
        },
      },
      depthTest: false,
      transparent: true,
      side: THREE.DoubleSide,
      // wireframe: true
    });

    const plane = new THREE.Mesh(geometry, shaderMaterial);
    // const plane = new THREE.Mesh(geometry, material);

    plane.position.x = this.options.x;
    plane.position.y = this.options.y;


    plane.scale.copy(new THREE.Vector3(scale, scale, scale));
    if (this.options.x < 0) {
      plane.rotation.x += Math.PI;
    }
    this.scene.add(plane);

    return plane;
  }

  updatePos(x) {
    this.x = x;

    // this.gemo.vertices.forEach(vec => {
    //   const pos = this.path.getPos(vec.x + x, vec.y);
    //   vec.x = pos.x;
    //   vec.y = pos.y;
    // });

    // const pos = this.path.getPos(x, 0);
    // this.plane.position.copy(new THREE.Vector3(pos.x, pos.y));
    this.plane.position.x = x + this.width / 2;

    // this.gemo.verticesNeedUpdate = true;
  }

  destroy() {
    this.scene.remove(this.plane);
    this.gemo = null;
    this.initGemo = null;
  }
}

class TagRender {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(cameraFov, window.innerWidth / window.innerHeight, 0.1, cameraZ * 3);
    this.camera.position.set(0, 0, cameraZ * 2);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(3);
    this.renderer.setSize(window.innerWidth, window.innerWidth * 9 / 16);
    document.querySelector('body').appendChild(this.renderer.domElement);//将渲染Element添加到Dom中


    const gridHelper = new THREE.GridHelper(500, 10, 0xddddd, 0xff0000);
    gridHelper.rotation.x = Math.PI / 2;
    // this.scene.add(gridHelper);

    this.paths = this.createPaths();
  }

  createPaths() {
    const paths = [];
    const step = tagRowHeight;
    const start = Math.PI / 2;
    const start2 = Math.PI / -2;

    for (let i = -tagRowCount / 2; i < tagRowCount / 2 + 1; i++) {
      const path = new Path({
        angle: start + step * i,
        y: step * i,
        height: 10,
      }, this.scene);
      // const path2 = new Path({
      //   angle: start2 + step * i
      // }, this.scene);
      paths.push(path);
      // paths.push(path2);
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
    setTimeout(() => {
      this.renderer.render();
    }, 600);
    // this.tick = window.requestAnimationFrame(() => this.update());
  }
}


window.onload = function () {
  const ani = new Ani();

  ani.start();
}




// for (let i = 0; i < 6; i++) {
//   const y = i * height * 1.3 + 50;

//   let x = 0;

//   let iconTag = new Tag({
//     type: 'icon',
//     text: icons[i],
//     height,
//     color: colors[i]
//   });
//   ctx.drawImage(iconTag.img, x, y);
//   x += iconTag.width + 20;


//   let textTag = new Tag({
//     type: 'text',
//     text: texts[i],
//     height,
//     color: colors[i]
//   });
//   ctx.drawImage(textTag.img, x, y);
//   x += textTag.width + 20;

//   let textEnTag = new Tag({
//     type: 'text',
//     text: textsEn[i],
//     height,
//     color: colors[i]
//   });

//   ctx.drawImage(textEnTag.img, x, y);
//   x += textsEn.width + 20;
// }