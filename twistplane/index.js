const vertexShader = `
precision highp float;

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

  uniform float time;
  varying vec2 vUv;
  varying vec3 vWPosition;

  void main() { 
    vUv = uv;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    
    // worldPosition.y += sin(worldPosition.x / 5.0 + time) * 1.0;
    worldPosition.z += cn(vec3(worldPosition / 80.0) + time) * 20.0;
    // worldPosition.z += sin(worldPosition.x / 15.0 + time) * cos(worldPosition.y / 15.0 + time) * 10.0;

    vWPosition = vec3(worldPosition);
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition; 
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }

`;

const fragmentShader = `
  uniform sampler2D texture;
  //纹理坐标
  varying vec2 vUv;
  varying vec3 vWPosition;

  void main(void){
      vec4 color = texture2D(texture, vUv);
      // if (color.x > 0.1) {
      //   color.a = 0.0;
      // }
      // // color.a *= 0.5;

      float dark = (1.0 - abs(vWPosition.z / 10.0)) * 0.15 + 0.1;

      gl_FragColor = vec4(vec3(color - dark), 1.0);
      // gl_FragColor = color;
      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;


class Ani {
  constructor() {
    const width = Math.min(window.innerWidth * 1, 1600);
    // const width = window.innerWidth;
    const height = width //* 9 / 16;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(100, 0, 100);
    this.camera.lookAt(new THREE.Vector3);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(2);
    this.renderer.setSize(width, height);
    // this.renderer.setPixelRatio(4);
    // this.renderer.setSize(width, height, false);
    // this.renderer.setViewport(0, 0, width, height);
    document.querySelector('body').appendChild(this.renderer.domElement);

    const gridHelper = new THREE.GridHelper(10, 10, 0xff0000, 0xdddddd);
    gridHelper.rotation.x = Math.PI / 2;
    // this.scene.add(gridHelper);
    this.setup();
    this.startTime = Date.now();
  }

  setup() {
    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const texture = new THREE.TextureLoader().load('./images/w.png');
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true, map: texture });

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        texture: { value: texture },

        time: {
          type: 'float',
          value: 0.0
        },
      },
      transparent: true,
      // wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, shaderMaterial);

    this.mesh = mesh;
    this.scene.add(mesh);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.startTime = Date.now();
    this.tick = window.requestAnimationFrame(() => this.update());
  }

  stop() {
    window.cancelAnimationFrame(this.tick);
  }

  update() {
    this.render();

    this.mesh.material.uniforms.time.value = (Date.now() - this.startTime) / 1000;
    // setTimeout(() => {
    //   this.update();
    // }, 100);
    this.tick = window.requestAnimationFrame(() => this.update());
  }
  // update() {
  //   setTimeout(() => {
  //     this.render();
  //   }, 300);
  // }
}

let ani;
window.onload = function () {
  ani = new Ani();

  ani.start();
}
