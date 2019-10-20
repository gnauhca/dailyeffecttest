import './index.less';
import * as THREE from 'three';

var camera, scene, renderer;
var mesh;
var mesh2;

var clock = new THREE.Clock();

init();
animate();

function init() {

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(3);
  renderer.gammaOutput = true;
  renderer.gammaFactor = 2.2;
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 500;

  scene = new THREE.Scene();

  // var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
  var geometry = new THREE.TorusBufferGeometry( 100, 30, 32, 100 )
  var material = new THREE.MeshBasicMaterial();
  var texture = new THREE.TextureLoader().load(require("./map.png"));
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  material.transparent = true;
  material.map = texture;
  material.blending = THREE.AdditiveBlending;
  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation; //default
  material.blendSrc = THREE.SrcAlphaFactor; //default
  material.blendDst = THREE.OneMinusSrcAlphaFactor; //default

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = -50
  mesh.rotation.x = -2.1
  mesh.rotation.y = -0.3

  scene.add( mesh );

  var geometry = new THREE.TorusBufferGeometry( 120, 15, 32, 100 )
  var material = new THREE.MeshBasicMaterial();
  var texture = new THREE.TextureLoader().load(require("./map2.png"));
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  material.map = texture;
  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation; //default
  material.blendSrc = THREE.SrcAlphaFactor; //default
  material.blendDst = THREE.OneMinusSrcAlphaFactor; //default
  material.blending = THREE.AdditiveBlending;

  mesh2 = new THREE.Mesh( geometry, material );
  mesh2.position.z = 10
  mesh2.position.x = 50
  mesh2.position.y = 30
  mesh2.rotation.x = 2.2 + Math.PI
  mesh2.rotation.y = 0.15
  scene.add( mesh2 );

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  var delta = clock.getDelta() * 0.5;

  mesh.rotation.z += delta;
  mesh2.rotation.z += delta * 1.2;

  if (mesh.material.map) {
    mesh.material.map.offset.y += 0.008;
  }
  if (mesh2.material.map) {
    mesh2.material.map.offset.y += 0.01;
  }

  // mesh.material.map.needsUpdate = true;

  renderer.render( scene, camera );

}