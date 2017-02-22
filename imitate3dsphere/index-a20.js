import * as F3 from './fake3d/fake3d.js'
// import {perspective} from './fake3d/perspective.js';
// import {Time, TIME} from './fake3d/time.js';
// import {Vector3} from 'three/src/math/Vector3';
// import {Euler} from 'three/src/math/Euler';
// import {Obj} from './fake3d/obj.js';
// import {Scene} from './fake3d/scene.js';
// import {Renderer} from './fake3d/renderer.js';
require('./index.scss');


class Point extends F3.Obj {
    constructor(radius=5) {
        super();
        this.radius = radius;
        this.color = 'rgba('+[Math.random()*255|0,Math.random()*255|0,Math.random()*255|0, Math.random()].join(',')+')';
        this.prevCrood = null;
    }
    render(ctx) {
        this.prevCrood = this.prevCrood || this.croods2D.position.clone();

        ctx.fillStyle = "#648cb2";
        // ctx.fillStyle = this.color;
        ctx.beginPath();
        // ctx.fillRect(
        //     this.croods2D.position.x, this.croods2D.position.y,
        //     this.radius * this.zScale, this.radius * this.zScale
        // );
        ctx.arc(
            this.croods2D.position.x, 
            this.croods2D.position.y, 
            this.croods2D.scale * this.radius, 0, Math.PI * 2);
        ctx.fill();

        // ctx.strokeStyle = this.color;
        // ctx.lineWidth = this.radius * this.zScale;
        // ctx.lineCap = "round";
        // ctx.beginPath();
        // ctx.moveTo(this.croods2D.position.x, this.croods2D.position.y);
        // ctx.lineTo(this.prevCrood.x, this.prevCrood.y);
        // ctx.stroke();
        this.prevCrood = this.croods2D.position.clone();
    }
}

class Line extends F3.Obj {
    constructor() {
        super();
    }
}

class Sphere extends F3.Time {
    constructor(renderer, scene, cvs) {
        super();
        this.renderer = renderer;
        this.scene = scene;
        
        this.radius = 400;
        this.step = 50;
        this.pointCreate = 50; // 每过10 个弧长画一个点
        
        this.pointGroup = new F3.Obj();
        this.pointGroup.position.set(cvs.width/2, cvs.height/2, 0);
        this.scene.add(this.pointGroup);
        this.init();
    }
    init() {
        let x, z;
        let y = 0 - this.radius;
        let angleRY; // 半径与 y 轴夹角
        let xzR; // xz 平面 半径

        for (; y < this.radius; y += this.step) {
            angleRY = Math.acos(y / this.radius);
            xzR = Math.sin(angleRY) * this.radius;

            let pCount = Math.ceil(xzR * Math.PI * 2 / this.pointCreate);
            let perAngle = Math.PI * 2 / pCount;
            let point;

            for (let i = 0; i < pCount; i++) {
                x = xzR * Math.cos(perAngle * i);
                z = xzR * Math.sin(perAngle * i);
                point = new Point(3);
                point.position.set(x, y, z);
                if (Math.random() > 0.5)
                this.pointGroup.add(point);
            }
        }
        // let point = new Point(3);
        // point.position.set(100,100,10);
        // this.pointGroup.add(point);
        // this.pointGroup.add(new Point(5));
        // console.log( this.pointGroup.children.length );

        // 创建线
    }
    animate() {
        this.addTick((delta)=>{
            // console.log(delta);
            // console.log(this.pointGroup.children[0].croods2D);
            // this.pointGroup.rotation.set(
            //     this.pointGroup.rotation.x + 0.002,
            //     this.pointGroup.rotation.y + 0.002,
            //     this.pointGroup.rotation.z + 0.000
            // );
            this.pointGroup.rotation = new F3.Euler(
                this.pointGroup.rotation.x + 0.000,
                this.pointGroup.rotation.y + 0.002,
                this.pointGroup.rotation.z + 0.000
            );

            this.renderer.render(this.scene);
        });
    }
}

let cvs = document.querySelector('canvas');
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let ctx = cvs.getContext('2d');

let scene = new F3.Scene()
let renderer = new F3.Renderer(ctx, cvs);
let sphere = new Sphere(renderer, scene, cvs);
F3.perspective.origin = new F3.Vector3(cvs.width/2, cvs.height/2);
sphere.animate();

F3.TIME.start();