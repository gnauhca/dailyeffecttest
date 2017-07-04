import {Time, TIME, TWEEN} from './time.js';
import THREE from 'three';


let waveVertexShader = `
    uniform float size;
    uniform float frequency1;
    uniform float frequency2;
    uniform float offset1;
    uniform float offset2;
    uniform float waveHeight1;
    uniform float waveHeight2;


    void main() { 
        vec3 curPos;
        curPos = vec3(position.x, 1, position.z);
        curPos[1] = cos(position.x * frequency1 + offset1) * sin(position.z * frequency1 + offset1) * waveHeight1 + cos(position.x * frequency2 + offset2) * sin(position.z * frequency2 + offset2) * waveHeight2;


        gl_PointSize = size;//min(size * curPos[1] * 0.2, 4.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( curPos, 1.0 ); 
    }

`;

let waveFragmentShader = `

    uniform sampler2D texture; 
    uniform vec3 color; 
    uniform float opacity; 
    void main() { 
        
        gl_FragColor = vec4(color, opacity) * texture2D( texture, gl_PointCoord ); 
    }

`;

let pointImg = './point.png';

class Wave extends Time {
    constructor(options) {
        super();

        let defaults = {
            color: '#ffffff',
            opacity: 1,
            position: new THREE.Vector3,
            xCount: 100,
            zCount: 100,

            xDis: 200,
            zDis: 200,

            size: 1, // 点大小
            frequency1: 0.2,
            frequency2: 0.1,

            maxWaveHeight1: 10,
            minWaveHeight1: 3,
            maxWaveHeight2: 8,
            minWaveHeight2: 5,

            initOffset1: 0,
            initOffset2: 0,
            offsetSpeed1: 2,
            offsetSpeed2: 4,
            offsetSign: 1 // -1 or 1
        };


        for (let key in defaults) {
            options[key] = options[key] || defaults[key];
        }
        options.xStep = options.xDis / options.xCount;
        options.zStep = options.zDis / options.zCount;

        this.options = options;

        this.tick;

        this.offset1 = options.initOffset1;
        this.offset2 = options.initOffset2;

        this.particlePositions;
        this.obj = this.create();
    }

    create() {
        let options = this.options;

        let particlesGeom = new THREE.BufferGeometry();
        let particlePositions = new Float32Array( options.xCount * options.zCount * 3 );

        let uniforms = {

            texture: {
                value: new THREE.TextureLoader().load( pointImg )
            },
            color: {
                value: new THREE.Color(options.color)
            },
            opacity: {
                type: 'float',
                value: options.opacity
            },
            size: {
                type: 'float',
                value: options.size * 10
            },
            frequency1: {
                type: 'float',
                value: options.frequency1
            },
            frequency2: {
                type: 'float',
                value: options.frequency2
            },
            offset1: {
                type: 'float',
                value: 0
            },
            offset2: {
                type: 'float',
                value: 0
            },
            waveHeight1: {
                type: 'float',
                value: 0
            },
            waveHeight2: {
                type: 'float',
                value: 0
            }
            

        };

        var shaderMaterial = new THREE.ShaderMaterial({

            uniforms: uniforms,
            vertexShader: waveVertexShader,
            fragmentShader: waveFragmentShader,

            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true

        });


        let count = 0;
        for (let x = 0; x < options.xCount; x++) {
            for (let z = 0; z < options.zCount; z++) {

                particlePositions[count++] = x * options.xStep;
                particlePositions[count++] = 0; // y
                particlePositions[count++] = z * options.zStep;
            }
        }

        this.particlePositions = particlePositions;

        particlesGeom.setDrawRange( 0, options.xCount * options.zCount );
        particlesGeom.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );
        particlesGeom.computeBoundingBox();
        particlesGeom.center();

        let points = new THREE.Points(particlesGeom, shaderMaterial);
        points.position.copy(options.position);
        points.rotation.y = Math.random() * 0.2;
        
        return points;
    }

    start() {
        this.tick = this.addTick(this.update);

        let that = this;
        function changeWHP() {
            that.obj.material.uniforms.waveHeight1.value = this.waveHeight1;
            that.obj.material.uniforms.waveHeight2.value = this.waveHeight2;
        }

        let waveHeight = {
            waveHeight1: this.options.minWaveHeight1,
            waveHeight2: this.options.minWaveHeight2
        };
        let tween1 = new TWEEN.Tween(waveHeight)
                        .to({
                            waveHeight1: this.options.maxWaveHeight1,
                            waveHeight2: this.options.maxWaveHeight2,
                        }, 3000)
                        .easing(TWEEN.Easing.Cubic.InOut)
                        .onUpdate(changeWHP);
                        
        let tween2 = new TWEEN.Tween(waveHeight)
                        .to({
                            waveHeight1: this.options.minWaveHeight1,
                            waveHeight2: this.options.minWaveHeight2
                        }, 3000)
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

    update(delta) {
        let options = this.options;
        let second = delta / 1000;
        let particlePositions = this.particlePositions;

        this.obj.material.uniforms.offset1.value += second * options.offsetSpeed1 * options.offsetSign;
        this.obj.material.uniforms.offset2.value += second * options.offsetSpeed2 * options.offsetSign;
    }
}

class Ani extends Time {

    constructor(cvs) {
        super();
        this.waves = [];
        this.tick;

        this.scene = new THREE.Scene();//场景

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);//透视相机
        this.camera.position.set(0, 6, 150);//相机位置
        // this.camera.lookAt(new THREE.Vector3(0, 30, -1));

        this.scene.add(this.camera);//add到场景中
        // this.scene.fog = new THREE.Fog(0x000000, 100, 500);
    }

    setUp(cvs) {
        this.renderer = new THREE.WebGLRenderer({canvas: cvs, antialias: true , alpha: true});//渲染
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
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
        this.tick = null;
    }

    resize() {
        // console.log(this.camera);
        this.camera.aspect = (window.innerWidth / window.innerHeight * 0.8);
        this.camera.updateProjectionMatrix ()
        this.renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }
}

let wave1 = new Wave({
    color: 0x3062ff,
    opacity: 0.5,
    position: new THREE.Vector3,
    xCount: 250,
    zCount: 250,
    xDis: 200, // x 宽
    zDis: 200, // z 宽
    size: 0.6, // 点大小
    frequency1: 0.03,
    frequency2: 0.06,

    maxWaveHeight1: 10,
    minWaveHeight1: 3,
    maxWaveHeight2: 8,
    minWaveHeight2: 5,

    initOffset1: 0,
    initOffset2: 0,
    offsetSpeed1: 0.6,
    offsetSpeed2: 0.4,
    offsetSign: 1 // -1 or 1
});
let wave2 = new Wave({
    color: 0x3bdee0,
    opacity: 0.2,
    position: new THREE.Vector3(0, 6, -50),
    xCount: 180,
    zCount: 180,
    xDis: 200, // x 宽
    zDis: 200, // z 宽
    size: 0.4, // 点大小
    frequency1: 0.06,
    frequency2: 0.052,

    maxWaveHeight1: 8,
    minWaveHeight1: 4,
    maxWaveHeight2: 6,
    minWaveHeight2: 4,

    initOffset1: 0,
    initOffset2: 0,
    offsetSpeed1: 0.3,
    offsetSpeed2: 0.1,
    offsetSign: -1 // -1 or 1
});




let ani = new Ani();
ani.addWave(wave1);
ani.addWave(wave2);

export {ani};