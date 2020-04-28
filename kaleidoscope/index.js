class Ani {
  constructor() {
    this.container = document.querySelector('#kaleidoscope');

    this.config = {
      number: 20, // number of objects
      boundaries: 10, // example: 20 means position = THREE.Math.randInt(-20,20)
      size: 10, // object size
      // -------------- //
      kaleidoscope: true,
      sides: 4, // number of kaleidoscope sides
      angle: 0, // kaleidoscope angle, in degrees
      // -------------- //
      colorshift: false, // RGB color shift shader filter
      smooth: false, // smooth shading
      wireframe: false, // wireframe mode
      space: false // space background
    };
    this.init();
  }

	destory() {
		clearTimeout(this.animation);
	}
  
  init() {

		this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize( window.innerHeight, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );
    
		if (this.config.smooth) {
			this.geometry = new THREE.SphereGeometry(this.config.size, 3, 3);
		} else {
	    this.geometry = new THREE.IcosahedronGeometry(this.config.size, 0);		
    }
    this.geometry = new THREE.OctahedronGeometry(this.config.size, 0);		
    

    this.material = new THREE.MeshNormalMaterial({
      wireframe: this.config.wireframe
    });


    this.group = new THREE.Object3D();
    
    for (var i = 0; i < this.config.number; i++) {
      
      let mesh = new THREE.Mesh(this.geometry, this.material);

      let b = this.config.boundaries;
      mesh.position.set(
        THREE.Math.randInt(-b, b),
        THREE.Math.randInt(-b, b),
        THREE.Math.randInt(-b, b)
      );
      
      this.group.add(mesh);
      
    }
    

    var geometry = new THREE.PlaneGeometry( 10, 10, 5, 5 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide, wireframe: true} );
    var plane = new THREE.Mesh( geometry, material );
    // plane.position.set(10, 0, 0);
    plane.rotation.set(0, 0, Math.PI / 4);
    // for (var i = 0; i < this.config.number; i++) {
      
    //   let mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({
    //     wireframe: this.config.wireframe
    //   }));

    //   let b = this.config.boundaries;
    //   let a = 20;
    //   mesh.position.set(
    //     THREE.Math.randInt(-a, a),
    //     THREE.Math.randInt(-a, a),
    //     THREE.Math.randInt(-1, 1),
    //   );
    //   mesh.rotation.set(
    //     0, THREE.Math.randInt(-b, b),
    //     THREE.Math.randInt(-b, b)
    //   );
    //   let scale = THREE.Math.randInt(0.5, 1.5);
    //   mesh.scale.set(
    //     scale,
    //     scale,
    //     scale
    //   );
      
    //   this.group.add(mesh);
    // }

    // this.group.add(plane);

    this.scene.add(this.group);

    this.light = new THREE.DirectionalLight(0xFFFFFF);
    this.light.position.set(0, 0, 250);
    this.scene.add(this.light);

    this.camera.position.set(0, 0, 40); 
    
    // postprocessing
    if (this.config.kaleidoscope || this.config.colorshift) {
      // support transparency thanks to https://codepen.io/SephReed/pen/jWWEQE
      var renderTarget = new THREE.WebGLRenderTarget(
        window.innerHeight,
        window.innerHeight,
        {
					//texture: {
          	minFilter: THREE.LinearFilter, 
          	magFilter: THREE.LinearFilter, 
	          format: THREE.RGBAFormat, 
					//},
          stencilBuffer: false 
        }
      );

      this.composer = new THREE.EffectComposer(this.renderer, renderTarget);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));    
    }

    if (this.config.kaleidoscope) {
      var effect = new THREE.ShaderPass(THREE.KaleidoShader);
      console.log(effect);
      effect.uniforms['sides'].value = this.config.sides;
      effect.uniforms['angle'].value = this.config.angle * Math.PI / 180;
      this.composer.addPass(effect);
    }
    
    if (this.config.colorshift) {
      var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
      effect.uniforms['amount'].value = 0.005;
      this.composer.addPass(effect);
    }
    
    if (this.config.kaleidoscope || this.config.colorshift) {
      effect.renderToScreen = true;
    }
  }

  animate = () => {
    this.animation = setTimeout(this.animate, 30);

  	this.group.rotation.x -= 0.05;
  	this.group.rotation.y -= 0.05;
    this.group.rotation.z -= 0.05;
    this.group.children.forEach(child => {
      child.rotation.x -= 0.01;
      child.rotation.y -= 0.01;
      child.rotation.z -= 0.02;
    });

  	this.renderScene();
  }

  renderScene = () => {
    if (this.config.kaleidoscope || this.config.colorshift) {
  		this.composer.render();	
  	} else {
  		this.renderer.render(this.scene, this.camera);
  	}
  }
}

const ani = new Ani();
// ani.init();
ani.animate();
