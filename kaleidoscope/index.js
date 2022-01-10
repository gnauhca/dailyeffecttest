class Obj {
  draw() {

  }
}

class BaseImage {
  constructor() {
    const cvs = document.createElement('canvas');
    cvs.width = 1024;
    cvs.height = 1024;

    this.ctx = cvs.getContext('2d');
    this.cvs = cvs;
    this.objs = [];
    this.ctx.translate(this.cvs.width / 2, this.cvs.height / 2);
    // document.body.appendChild(cvs);
  }

  addObj(obj) {
    this.objs.push(obj);
  }

  draw(delta) {
    this.objs.forEach((obj) => {
      this.ctx.save();
      obj.draw(this.ctx, delta);
      this.ctx.restore();
    });
  }
}

class Lines {
  constructor() {
    this.angle = 0;
    this.count = 20;
    this.colors = new Array(this.count).fill('').map((item) => `rgb(${(Math.random() * 255) | 0}, ${(Math.random() * 255) | 0}, ${(Math.random() * 255) | 0})`);
    this.colors = ['#ffffff', '#ea3526', '#50af66', '#000000', '#f8d14a', '#235bc9'];
  }

  draw(ctx, delta) {
    this.angle += delta;

    const stepAngle = Math.PI * 2 / this.count;
    const radius = 1000;
    let { angle } = this;
    let nextAngle = angle;
    for (let i = 0; i < this.count; i++) {
      nextAngle += stepAngle;

      ctx.fillStyle = this.colors[i % 6];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
      ctx.lineTo(radius * Math.cos(nextAngle), radius * Math.sin(nextAngle));
      ctx.fill();

      angle += stepAngle;
    }
    // ctx.globalCompositeOperation = 'lighter';
    // ctx.fillStyle = '#ffffff';
    // ctx.beginPath();
    // ctx.arc(0, 0, 100, 100, 0);
    // ctx.fill();
  }
}

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
      space: false, // space background
    };
    this.clock = new THREE.Clock();
    this.baseImg = new BaseImage();
    const lines = new Lines();
    this.baseImg.addObj(lines);
    this.init();

    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  destory() {
    clearTimeout(this.animation);
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetWidth);
    this.container.appendChild(this.renderer.domElement);

    if (this.config.smooth) {
      this.geometry = new THREE.SphereGeometry(this.config.size, 3, 3);
    } else {
	    this.geometry = new THREE.IcosahedronGeometry(this.config.size, 0);
    }
    this.geometry = new THREE.OctahedronGeometry(this.config.size, 0);

    this.material = new THREE.MeshNormalMaterial({
      wireframe: this.config.wireframe,
    });

    this.group = new THREE.Object3D();

    // for (var i = 0; i < this.config.number; i++) {

    //   let mesh = new THREE.Mesh(this.geometry, this.material);

    //   let b = this.config.boundaries;
    //   mesh.position.set(
    //     THREE.Math.randInt(-b, b),
    //     THREE.Math.randInt(-b, b),
    //     THREE.Math.randInt(-b, b)
    //   );

    //   this.group.add(mesh);

    // }

    const geometry = new THREE.PlaneGeometry(80, 80, 5, 5);
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: false });
    this.texture = new THREE.CanvasTexture(this.baseImg.cvs);
    material.map = this.texture;
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(5, 0, 0);
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

    this.group.add(plane);

    this.scene.add(this.group);

    this.light = new THREE.DirectionalLight(0xFFFFFF);
    this.light.position.set(0, 0, 250);
    this.scene.add(this.light);

    this.camera.position.set(0, 0, 40);

    // postprocessing
    if (this.config.kaleidoscope || this.config.colorshift) {
      // support transparency thanks to https://codepen.io/SephReed/pen/jWWEQE
      const renderTarget = new THREE.WebGLRenderTarget(
        window.innerHeight,
        window.innerHeight,
        {
          // texture: {
          	minFilter: THREE.LinearFilter,
          	magFilter: THREE.LinearFilter,
	          format: THREE.RGBAFormat,
          // },
          stencilBuffer: false,
        },
      );

      this.composer = new THREE.EffectComposer(this.renderer, renderTarget);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    }

    if (this.config.kaleidoscope) {
      var effect = new THREE.ShaderPass(THREE.KaleidoShader);
      console.log(effect);
      effect.uniforms.sides.value = this.config.sides;
      effect.uniforms.angle.value = this.config.angle * Math.PI / 180;
      this.composer.addPass(effect);
    }

    if (this.config.colorshift) {
      var effect = new THREE.ShaderPass(THREE.RGBShiftShader);
      effect.uniforms.amount.value = 0.005;
      this.composer.addPass(effect);
    }

    if (this.config.kaleidoscope || this.config.colorshift) {
      effect.renderToScreen = true;
    }
  }

  animate() {
    this.animation = setTimeout(this.animate, 30);

    this.baseImg.draw(this.clock.getDelta());
    // return;
    this.texture.needsUpdate = true;
  	// this.group.rotation.x -= 0.05;
  	// this.group.rotation.y -= 0.05;
    this.group.rotation.z -= 0.05;
    // this.group.children.forEach(child => {
    //   child.rotation.x -= 0.01;
    //   child.rotation.y -= 0.01;
    //   child.rotation.z -= 0.02;
    // });

  	this.renderScene();
  }

  renderScene() {
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
