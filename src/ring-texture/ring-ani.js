import * as THREE from 'three';
import './three-utils';
import { OrbitControls } from './orbit-controls.js';

const textureUrl = './map-r.png';
const textureUrl2 = './map-r2.png';
export function getRing(type) {
  let ring;
  if (type === 'red') {
    const geometry = new THREE.TorusBufferGeometry(100, 25, 28, 70);
    const material = new THREE.MeshBasicMaterial({ color: 0xff3957 });
    const texture = new THREE.TextureLoader().load(textureUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 2;
    texture.repeat.y = 2;
    texture.offset.y = 0.95;
    texture.format = THREE.RGBAFormat;
    material.transparent = true;
    material.map = texture;
    material.alphaTest = 0.5;
    material.blending = THREE.AdditiveBlending;
    material.blending = THREE.CustomBlending;
    material.blendEquation = THREE.AddEquation; // default
    material.blendSrc = THREE.SrcAlphaFactor; // default
    material.blendDst = THREE.OneMinusSrcAlphaFactor; // default
    ring = new THREE.Mesh(geometry, material);
  } else if (type === 'blue') {
    const geometry = new THREE.TorusBufferGeometry(120, 13, 30, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0x29ADFE });
    const texture = new THREE.TextureLoader().load(textureUrl2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 2;
    texture.repeat.y = 2;
    material.opacity = 0.7;
    material.map = texture;
    material.alphaTest = 0.5;
    material.blending = THREE.CustomBlending;
    material.blendEquation = THREE.AddEquation; // default
    material.blendSrc = THREE.SrcAlphaFactor; // default
    material.blendDst = THREE.OneMinusSrcAlphaFactor; // default
    material.blending = THREE.AdditiveBlending;
    ring = new THREE.Mesh(geometry, material);
  } else {
    const geometry = new THREE.TorusBufferGeometry(120, 13, 30, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF505E });
    const texture = new THREE.TextureLoader().load(textureUrl2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 2;
    texture.repeat.y = 2;
    material.map = texture;
    material.alphaTest = 0.5;
    material.blending = THREE.CustomBlending;
    material.blendEquation = THREE.AddEquation; // default
    material.blendSrc = THREE.SrcAlphaFactor; // default
    material.blendDst = THREE.OneMinusSrcAlphaFactor; // default
    material.blending = THREE.AdditiveBlending;
    ring = new THREE.Mesh(geometry, material);
  }
  return ring;
}

export class Ani {
  constructor(options) {
    const defaults = {

    };
    this.options = { ...options, ...defaults };
    this.clock = new THREE.Clock(false);
    this.t = 0;
    this.init();
    this.started = false;
  }

  init() {
    const { width, height } = this.options.canvas;
    const ratio = width / height;
    const cameraDistance = 500;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: this.options.canvas });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1.5);
    this.camera = new THREE.PerspectiveCamera(50, ratio, 1, 1000);
    this.camera.position.z = cameraDistance;
    this.camera.lookAt(new THREE.Vector3());

    if (this.options.controlElement) {
      this.controls = new OrbitControls(this.camera, this.options.controlElement);
      this.controls.minDistance = cameraDistance;
      this.controls.maxDistance = cameraDistance;
      this.controls.enableZoom = false;
      this.controls.enableDamping = true;
	    this.controls.dampingFactor = 0.05;

      this.controls.minPolarAngle = 1.65; // radians
      this.controls.maxPolarAngle = this.controls.minPolarAngle + 2; // radians
      this.controls.minAzimuthAngle = -1; // radians
      this.controls.maxAzimuthAngle = this.controls.minAzimuthAngle + 2; // radians

      this.controls.minPolarAngle = 0; // radians
      this.controls.maxPolarAngle = this.controls.minPolarAngle + 2 * Math.PI; // radians
      this.controls.minAzimuthAngle = -6; // radians
      this.controls.maxAzimuthAngle = this.controls.minAzimuthAngle + 2 * Math.PI; // radians
      this.controls.rotateSpeed = 0.3;

      this.controls.enablePan = false;
      this.controls.enableZoom = false;
    }

    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // const axesHelper = new THREE.AxesHelper( 50 );
    // this.scene.add( axesHelper );
  }

  addObj(obj) {
    this.group.add(obj);
  }

  pause() {
    this.started = false;
    this.clock.stop();
    cancelAnimationFrame(this.t);
  }

  tick = () => {
    this.t = requestAnimationFrame(this.tick);
    const delta = Math.min(this.clock.getDelta() * 1000, 20);
    this.options.tick && this.options.tick(delta);
    this.controls && this.controls.update(delta);
    this.renderer.render(this.scene, this.camera);
  };

  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.clock.start();
    this.tick();
  }
}
