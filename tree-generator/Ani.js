import Stats from 'stats.js';
import { Time, TIME, TWEEN } from './time.js';

export default class Ani extends Time {
  constructor() {
    super();
    this.domWrap = document.body.querySelector('.render-area');

    // init three tree
    this.scene = new THREE.Scene();// 场景

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);// 透视相机

    this.camera.setViewOffset(
      window.innerWidth,
      window.innerHeight,
      0,
      window.innerHeight * -0.28,
      window.innerWidth,
      window.innerHeight,
    );
    this.camera.position.set(0, 50, 150);// 相机位置
    this.scene.add(this.camera);// add到场景中
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.scene.fog = new THREE.Fog(0x000000, 100, 500);
    this.control = new THREE.OrbitControls(this.camera, this.domWrap);
    // this.control.autoRotate = true;
    // this.control.enabled = false;
    // this.control.travel = true;
    this.travelSpeed = 20000;

    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight = new THREE.DirectionalLight(0xffffff, 1);
    this.scene.add(this.spotLight);
    this.spotLight.position.set(-200, -200, 100);

    this.spotLight2 = this.spotLight.clone();
    this.scene.add(this.spotLight2);
    this.spotLight2.position.set(50, 500, -100);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });// 渲染
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.domWrap.appendChild(this.renderer.domElement);// 将渲染Element添加到Dom中

    this.tick;

    this.stats = new Stats();
    // document.body.appendChild( this.stats.dom );
  }

  tick(delta) {
    this.renderer.render(this.scene, this.camera);
    this.control.update(delta);
    this.stats.update();

    this.onUpdate(delta);
  }

  onUpdate(delta) {
    // overWrite
  }

  start() {
    this.tick = this.addTick(this.tick.bind(this));
    TIME.start();
  }

  stop() {
    this.removeTick(this.tick);
  }
}
