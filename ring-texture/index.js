import './index.less';
import * as THREE from 'three';

var camera, scene, renderer;
var mesh;
var mesh2;
var group = new THREE.Group;

var clock = new THREE.Clock();

init();
animate();

function init() {

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  // renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setPixelRatio( 3 );
  renderer.setSize( 1000, 600 );
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 50, 10 / 6, 1, 2000 );
  camera.position.z = 400;
  camera.lookAt(new THREE.Vector3);

  scene = new THREE.Scene();
  scene.add(group);

  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 1000, 500 );
  // scene.add( spotLight );

  var light = new THREE.AmbientLight( 0x808080 ); // soft white light
  // scene.add( light );

  // var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var geometry = new THREE.TorusBufferGeometry( 100, 25, 28, 70 )
  var material = new THREE.MeshBasicMaterial({ color: 0xFF202E});
  var texture = new THREE.TextureLoader().load(require("./map-r.png"));
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 2;
  texture.repeat.y = 2;
  texture.offset.y = 0.95;
  texture.format = THREE.RGBAFormat;
  material.transparent = true;
  material.map = texture;
  material.blending = THREE.AdditiveBlending;
  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation; //default
  material.blendSrc = THREE.SrcAlphaFactor; //default
  material.blendDst = THREE.OneMinusSrcAlphaFactor; //default

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = -30
  mesh.position.y = -28
  mesh.rotation.x = -2.75
  mesh.rotation.y = -0.7

  // scene.add( mesh );
  group.add(mesh);

  var geometry = new THREE.TorusBufferGeometry( 120, 13, 30, 30 )
  var material = new THREE.MeshBasicMaterial({ color: 0x29ADFE });
  var texture = new THREE.TextureLoader().load(require("./map-r2.png"));
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 2;
  texture.repeat.y = 2;
  material.opacity = 0.7;
  material.map = texture;
  material.alphaTest = 0.5
  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation; //default
  material.blendSrc = THREE.SrcAlphaFactor; //default
  material.blendDst = THREE.OneMinusSrcAlphaFactor; //default
  material.blending = THREE.AdditiveBlending;

  mesh2 = new THREE.Mesh( geometry, material );
  // mesh2.position.z = -50
  mesh2.position.x = 57
  mesh2.position.y = 0
  mesh2.rotation.x = 1.95 + Math.PI
  mesh2.rotation.y = 0.15
  group.add( mesh2 );

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();

  // renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  var delta = clock.getDelta() * 0.5;

  mesh.rotation.z -= delta * 1;
  // group.rotation.y -= delta * 1;
  // mesh2.rotation.z += delta * 3.2;

  if (mesh.material.map) {
    // mesh.material.map.offset.y = -0.1;
  }
  if (mesh2.material.map) {
    mesh2.material.map.offset.y -= 0.006;
  }

  // mesh.material.map.needsUpdate = true;

  renderer.render( scene, camera );

}