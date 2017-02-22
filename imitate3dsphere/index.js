// import * as F3 from './f3/f3.js'

class Point extends F3.Obj {
    constructor(radius=5) {
        super();
        this.radius = radius;
        this.color = 'rgba('+[Math.random()*255|0,Math.random()*255|0,Math.random()*255|0, Math.random()].join(',')+')';
        this.prevCrood = null;
    }
    render(ctx) {
        this.prevCrood = this.prevCrood || this.croods2D.position.clone();

        ctx.fillStyle = "#fff";
        // ctx.fillStyle = this.color;
        ctx.beginPath();


        // console.log(
        //     this.croods2D.position.x, 
        //     this.croods2D.position.y,
        //     this.radius * this.croods2D.scale + 1, 
        //     this.radius * this.croods2D.scale + 1
        // );

        // if (this.croods2D.scale < 5)
        // ctx.fillRect(
        //     this.croods2D.position.x, 
        //     this.croods2D.position.y,
        //     this.radius * this.croods2D.scale * this.yScale, 
        //     this.radius * this.croods2D.scale * this.yScale
        // );
        ctx.arc(
            this.croods2D.position.x, 
            this.croods2D.position.y, 
            this.radius * this.croods2D.scale * this.yScale, 0, Math.PI * 2);
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

class Effect extends F3.Time {
    constructor(renderer, scene, cvs) {
        super();
        this.renderer = renderer;
        this.scene = scene;
        this.cvs = cvs;
        
        this.xOffset = 0;
        this.waveHeight = 0.4; // 波高
        this.waveWidth = 8; // 波长

        this.col = 25;
        this.colPointNum = 25;
        
        this.pointGroup = new F3.Obj();
        this.scene.add(this.pointGroup);

        this.resize(cvs.width, cvs.height);
        this.init();
    }
    resize(width, height) {
        this.cvs.width = width;
        this.cvs.height = height;
        this.pointGroup.position.set(this.cvs.width/2, this.cvs.height, 0);

        // this.waveHeight = height/2;
        // this.waveWidth = this.waveHeight * 4;
        this.stepWidth = width * 1.5 / this.col;
        // console.log(this.stepWidth);
    }
    init() {
        // create point
        for (let i = 0; i < this.col * this.colPointNum; i++) {
            this.pointGroup.add(
                new Point(3)
            );
        }
    }
    update(delta) {
        this.xOffset += (delta/2000);
        // if (this.xOffset > this.waveWidth*2) {
        //     this.xOffset -= this.waveWidth*2;
        // }
        // console.log(this.xOffset);
        for (let x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
            // let zOffset = Math.cos((x + this.xOffset) * Math.PI / this.waveWidth) * this.waveWidth * 2;

                // let zOffset =  Math.cos(( x ) * Math.PI / this.waveWidth ) * this.waveWidth * 2 + this.xOffset;
            
            // for (let z = 2; z > 2 - this.colPointNum; z-- ) {   
            for (let z = -2; z > -this.colPointNum - 2 ; z-- ) {    

                // let waveHeight = (Math.cos(( x + z + this.xOffset) * Math.PI / this.waveWidth) + 1) * this.waveHeight / 2;
                // console.log(waveHeight);
                // let y = Math.cos((z + zOffset) * Math.PI / this.waveWidth) * this.waveHeight;


                let y = Math.cos(x*Math.PI/this.waveWidth + this.xOffset)*Math.sin(z*Math.PI/this.waveWidth + this.xOffset) * this.waveHeight;
                // console.log(count);
                // console.log(x)
                this.pointGroup.children[count].yScale = (-y + 0.6)/(this.waveHeight);
                this.pointGroup.children[count].position.set(
                    x * this.stepWidth,
                    y * this.stepWidth,
                    z * this.stepWidth
                );
                count++;
            }
        }
        // this.pointGroup.rotation.y += 0.002;
        // this.pointGroup.rotation.x += 0.002;
        // this.pointGroup.rotation.z += 0.002;
    }
    animate() {
        this.addTick((delta)=>{
            this.update(delta);
            this.renderer.render(this.scene);
        });
    }
}

window.bannerInit = function(cvs) {
    let ctx = cvs.getContext('2d');

    let scene = new F3.Scene()
    let renderer = new F3.Renderer(ctx, cvs);
    let effect = new Effect(renderer, scene, cvs);
    F3.perspective.origin = new F3.Vector3(cvs.width/2, 0);
    F3.perspective.p = 1200;
    effect.animate();

    F3.TIME.start();
}
bannerInit(document.querySelector('canvas'));