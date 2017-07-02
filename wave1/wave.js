
class Wave extends Time {
    constructor(options) {
        super();

        let defaults = {
            color: '#ffffff',
            opacity: 1,
            position: new THREE.Vector3,
            xCount: 100,
            zCount: 100,
            step: 2, // 间隙
            size: 1, // 点大小
            frequency1: 0.2,
            frequency2: 0.1,

            initWaveHeightPercent: 1,
            maxWaveHeightPercent: 1.2,
            minWaveHeightPercent: 0.6,
            waveHeightPercentSpeed: 0.1,

            maxWaveHeight1: 10,
            maxWaveHeight2: 5,

            initOffset1: 0,
            initOffset2: 0,
            offsetSpeed1: 2,
            offsetSpeed2: 4,
            offsetSign: 1 // -1 or 1
        };


        for (let key in defaults) {
            options.key = options[key] || defaults[key];
        }

        this.options = options;

        this.tick;

        this.waveHeightPercent = options.initWaveHeightPercent;
        this.waveHeightPercentSign = Math.random() > 0.5 ? 1 : -1;

        this.offset1 = options.initOffset1;
        this.offset2 = options.initOffset2;

        this.particlePositions;
        this.obj = this.create();
    }

    /*create() {
        let options = this.options;
        let geom = new THREE.Geometry();
        //粒子系统材质，
        let material = new THREE.PointCloudMaterial({
            size: options.size,
            transparent: true,
            opacity: 0.3,
            // vertexColors: true,
            // sizeAttenuation: sizeAttenuation,
            blending: true,
            color: new THREE.Color(options.color)
        });

        let range = 500;
        for (let x = 0; x < options.xCount; x++) {
            for (let z = 0; z < options.zCount; z++) {

                let particle = new THREE.Vector3(
                    x * options.step, 0, z * options.step
                );
                geom.vertices.push(particle);//点加入
                // let color = new THREE.Color(0x00ff00);//默认,关于颜色的设置只在vertexColors设置为true时使用
                // color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
                // geom.colors.push(color);//颜色加入
            }
        }
        geom.computeBoundingBox();
        geom.center();

        let cloud = new THREE.PointCloud(geom, material);//粒子云系统
        cloud.name = 'particles';//命名名字，在重绘的时候使用
        cloud.position .copy(options.position);
        cloud.rotation.y = Math.random() * 0.2;
        return cloud;
    }*/

    create() {
        let options = this.options;

        let particlesGeom = new THREE.BufferGeometry();
        let particlePositions = new Float32Array( options.xCount * options.zCount * 3 );

        //粒子系统材质，
        let material = new THREE.PointCloudMaterial({
            size: options.size,
            transparent: true,
            opacity: options.opacity,
            // vertexColors: true,
            // sizeAttenuation: sizeAttenuation,
            blending: true,
            color: new THREE.Color(options.color)
        });

        let count = 0;
        for (let x = 0; x < options.xCount; x++) {
            for (let z = 0; z < options.zCount; z++) {

                particlePositions[count++] = x * options.step;
                particlePositions[count++] = 0; // y
                particlePositions[count++] = z * options.step;
            }
        }

        this.particlePositions = particlePositions;

        particlesGeom.setDrawRange( 0, options.xCount * options.zCount );
        particlesGeom.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );
        particlesGeom.computeBoundingBox();
        particlesGeom.center();

        let cloud = new THREE.PointCloud(particlesGeom, material);//粒子云系统
        cloud.name = 'particles';//命名名字，在重绘的时候使用
        cloud.position.copy(options.position);
        cloud.rotation.y = Math.random() * 0.2;
        
        return cloud;
    }

    start() {
        this.tick = this.addTick(this.update);

        let that = this;
        function changeWHP() {
            that.waveHeightPercent = this.whp;
            // console.log(this.whp);
        }

        let whp = {whp: this.options.minWaveHeightPercent};
        let tween1 = new TWEEN.Tween(whp)
                        .to({whp: this.options.maxWaveHeightPercent}, 3000)
                        .easing(TWEEN.Easing.Cubic.InOut)
                        .onUpdate(changeWHP);
                        
        let tween2 = new TWEEN.Tween(whp)
                        .to({whp: this.options.minWaveHeightPercent}, 3000)
                        .easing(TWEEN.Easing.Cubic.InOut)
                        .onUpdate(changeWHP);
        
        this.addTween(tween1);
        // this.addTween(tween2);
        tween1.chain(tween2);
        tween2.chain(tween1);
        tween1.start();
                        
    }

    stop() {
        this.removeTick(this.tick);
    }

    /*update(delta) {
        let options = this.options;
        let second = delta / 1000;
        // console.log(delta);
        this.offset1 += second * options.offsetSpeed1 * options.offsetSign;
        this.offset2 += second * options.offsetSpeed2 * options.offsetSign;

        // 波峰变化
        // if (this.waveHeightPercent > options.maxWaveHeightPercent) {
        //     this.waveHeightPercent = options.maxWaveHeightPercent;
        //     this.waveHeightPercentSign = -1;
        // } else if (this.waveHeightPercent < options.minWaveHeightPercent) {
        //     this.waveHeightPercent = options.minWaveHeightPercent;
        //     this.waveHeightPercentSign = 1;
        // }

        // this.waveHeightPercent += this.waveHeightPercentSign * second * options.waveHeightPercentSpeed;


        for (let x = 0, i=0; x < options.xCount; x++) {
            for (let z = 0; z < options.zCount; z++) {

                let y = Math.cos(x * options.frequency1 + this.offset1) 
                        * Math.sin(z * options.frequency1 + this.offset1) * options.maxWaveHeight1 * this.waveHeightPercent
                        + 
                        Math.cos(x * options.frequency2 + this.offset2) 
                        * Math.sin(z * options.frequency2 + this.offset2) * options.maxWaveHeight2 * this.waveHeightPercent;

                this.obj.geometry.vertices[i++].setY(y);
                this.obj.geometry.verticesNeedUpdate = true;

            }
        }
    }*/
    update(delta) {
        let options = this.options;
        let second = delta / 1000;
        let particlePositions = this.particlePositions;
        // console.log(delta);
        this.offset1 += second * options.offsetSpeed1 * options.offsetSign;
        this.offset2 += second * options.offsetSpeed2 * options.offsetSign;

        // 波峰变化
        // if (this.waveHeightPercent > options.maxWaveHeightPercent) {
        //     this.waveHeightPercent = options.maxWaveHeightPercent;
        //     this.waveHeightPercentSign = -1;
        // } else if (this.waveHeightPercent < options.minWaveHeightPercent) {
        //     this.waveHeightPercent = options.minWaveHeightPercent;
        //     this.waveHeightPercentSign = 1;
        // }

        // this.waveHeightPercent += this.waveHeightPercentSign * second * options.waveHeightPercentSpeed;

        let count = 0;
        for (let x = 0, i=0; x < options.xCount; x++) {
            for (let z = 0; z < options.zCount; z++) {


                let y = Math.cos(x * options.frequency1 + this.offset1) 
                        * Math.sin(z * options.frequency1 + this.offset1) * options.maxWaveHeight1 * this.waveHeightPercent
                        + 
                        Math.cos(x * options.frequency2 + this.offset2) 
                        * Math.sin(z * options.frequency2 + this.offset2) * options.maxWaveHeight2 * this.waveHeightPercent;

                particlePositions[count + 1] = y;
                count += 3;
            }
        }
        this.obj.geometry.attributes.position.needsUpdate = true;
    }
}

class Scene extends Time {

    constructor() {
        super();
        this.waves = [];
        this.tick;

        this.scene = new THREE.Scene();//场景

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);//透视相机
        this.camera.position.set(0, 6, 150);//相机位置
        this.scene.add(this.camera);//add到场景中
        // this.scene.fog = new THREE.Fog(0x000000, 100, 500);

        let spot1 = new THREE.SpotLight(0xffffff, 1);//点光源
        spot1.position.set(100, 500, 100);
        // this.scene.add(spot1);

        this.renderer = new THREE.WebGLRenderer({antialias: true});//渲染
        this.renderer.setClearColor(0x00000);//设置可以认为是底图的颜色
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.shadowMapEnabled = true;//shadow，阴影，表明能渲染阴影

        // cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);//相机控制器
        // cameraControls.target.set(0, 0, 0);//控制器始终指向原点
        document.querySelector('body').appendChild(this.renderer.domElement);//将渲染Element添加到Dom中


        let composer = new THREE.EffectComposer( this.renderer );
        //Create Shader Passes
        let renderPass = new THREE.RenderPass( this.scene, this.camera );
        let testPass = new THREE.ShaderPass( THREE.TestShader );
        //Add Shader Passes to Composer - order is important
        composer.addPass( renderPass );
        composer.addPass( testPass );
        //set last pass in composer chain to renderToScreen
        testPass.renderToScreen = true;

        testPass.uniforms[ "amount" ].value = 1;
        this.composer = composer;
    }

    addWave(wave) {
        this.waves.push(wave);
        this.scene.add(wave.obj);
    }

    start() {
        this.waves.forEach(w=>w.start());
        this.tick = this.addTick(this.update);
    }

    stop() {
        this.removeTick(this.tick);
    }

    update() {
        this.composer.render( 0.1);
        // this.renderer.render(this.scene, this.camera);
    }
}

let wave1 = new Wave({
    color: 0x2bb2ff,
    opacity: 0.5,
    position: new THREE.Vector3,
    xCount: 200,
    zCount: 200,
    step: 0.8, // 间隙
    size: 0.4, // 点大小
    frequency1: 0.03,
    frequency2: 0.06,

    initWaveHeightPercent: 1,
    maxWaveHeightPercent: 1.2,
    minWaveHeightPercent: 0.6,
    waveHeightPercentSpeed: 0.3,

    maxWaveHeight1: 8,
    maxWaveHeight2: 3,

    initOffset1: 0,
    initOffset2: 0,
    offsetSpeed1: 0.6,
    offsetSpeed2: 0.4,
    offsetSign: 1 // -1 or 1
});

let wave2 = new Wave({
    color: 0x3bdee0,
    opacity: 0.3,
    position: new THREE.Vector3(0, 6, -50),
    xCount: 200,
    zCount: 200,
    step: 0.8, // 间隙
    size: 0.1, // 点大小
    frequency1: 0.06,
    frequency2: 0.052,

    initWaveHeightPercent: 1,
    maxWaveHeightPercent: 1.2,
    minWaveHeightPercent: 0.6,
    waveHeightPercentSpeed: 0.3,

    maxWaveHeight1: 4,
    maxWaveHeight2: 2,

    initOffset1: 0,
    initOffset2: 0,
    offsetSpeed1: 0.3,
    offsetSpeed2: 0.1,
    offsetSign: -1 // -1 or 1
});




let scene = new Scene();
scene.addWave(wave1);
scene.addWave(wave2);

scene.start();

window.TIME.start();