require('./index.scss');

import {Time, TIME, TWEEN} from './time.js';
import THREE from 'three.js';





class Ani extends Time {
  constructor() {
    super();
    this.tick;

    this.scene = new THREE.Scene();//场景

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);//透视相机
    this.camera.position.set(0, 6, 150);//相机位置
    this.scene.add(this.camera);//add到场景中
    // this.scene.fog = new THREE.Fog(0x000000, 100, 500);

    this.renderer = new THREE.WebGLRenderer({antialias: true , alpha: true});//渲染
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerWidth);




    let geometry = new THREE.SphereGeometry( 60, 32, 32 );
    // let texture = new THREE.TextureLoader().load( "./world-map.png" );
    let texture = new THREE.TextureLoader().load( "./earth2.jpg" );
    let material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: texture} );

    this.sphere = new THREE.Mesh( geometry, material );
    this.sphere.rotation.x = 0.8;


    this.scene.add(this.sphere);





    document.querySelector('body').appendChild(this.renderer.domElement);//将渲染
  }

  start() {
      // this.waves.forEach(w=>w.start());
      this.tick = this.addTick(this.update);
  }

  stop() {
      this.removeTick(this.tick);
  }

  update() {
    this.sphere.rotation.y += 0.001;
      this.renderer.render(this.scene, this.camera);
  }
}

let ani = new Ani

ani.start();
window.TIME.start();