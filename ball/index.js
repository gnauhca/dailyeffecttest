import {Vector2 as Vec2} from './vec2.js';
import {TIME, Time} from './time.js';

require('./index.scss');

let objs = [];
let balls = [];
let connections = [];


let obstruction = 0.1; // 物体每过一秒损失速度

let C = 0;
class Obj {
    constructor(ttl=0) {
        this.isDie = false;
        this.ttl = ttl;
        this.dieTtl = 100000;
        this.maxBlur = 5; // 5px
        this.opacity;
        this.blur;
        objs.push(this);
    }
    update(delta) {
        this.ttl += delta;
        if (this.ttl >= this.dieTtl) {
            this.ttl = this.dieTtl;
            this.die();
            return false;
        }
        this.opacity = (this.dieTtl - this.ttl) / this.dieTtl;
        this.blur = (1 - this.opacity) * this.maxBlur;
    }
    die() {
        this.isDie = true;
        objs.splice(balls.indexOf(this), 1);
    }
}

class Ball extends Obj{
    constructor(options) {
        super(options.initTtl);
        this.aid = C++;
        let defaults = {
            radius: 20,
            initTtl: 0, // 寿命值
            initPosition: new Vec2(),
            a: new Vec2(), // 加速度 v/s Vec2
            aTime: 1000, // 加速时间
            breakTtl: 0, // 分裂时间
            initV: new Vec2, // 初始速度
        };

        for (let key in defaults) {
            options[key] = options[key] || defaults[key];
        }
        this.position = options.initPosition;
        this.v = options.initV;
        this.aTimePass = 0;

        this.leaveTtl; // 与对方球分开的时间

        this.options = options;
        balls.push(this);
    }

    break() {
        let breakA1 = new Vec2(-4, -4);
        // let breakA1 = new Vec2(Math.random(), Math.random()).setLength(Math.random() * 10);
        let breakA2 = breakA1.clone().multiplyScalar(-1);

        let ball1 = new Ball({
            radius: 15,
            initTtl: this.ttl, // 寿命值
            initPosition: this.position.clone(),
            a: breakA1, // 加速度 v/s Vec2
            aTime: 1000, // 加速时间
            breakTtl: this.ttl + 8000, // 分裂时间
            initV: this.v.clone(), // 初始速度
        });
        let ball2 = new Ball({
            radius: 10,
            initTtl: this.ttl, // 寿命值
            initPosition: this.position.clone(),
            a: breakA2, // 加速度 v/s Vec2
            aTime: 1000, // 加速时间
            breakTtl: 0, // 分裂时间
            initV: this.v.clone(), // 初始速度
        });

        let connection = new Connection(ball1, ball2, this.ttl);

        this.die();
    }

    leaveFromOtherBall() {
        this.leaveTtl = this.ttl;
    }

    update(delta) {
        super.update(delta);

        if (this.isDie) return;

        let second = delta * 0.001;
        let options = this.options;

        this.aTimePass += delta;
        if (this.aTimePass <= options.aTime) {
            this.v.add(this.options.a.clone().multiplyScalar(second));
        }

        if (options.radius >= 15 && this.ttl > options.breakTtl) { 
            // 分裂
            this.break();
        }
        
        this.v.sub(this.v.clone().setLength(obstruction * second)); // 阻力减速
        this.position.add(this.v.clone().multiplyScalar(second));
    }

    draw(ctx) {
        let options = this.options;

        ctx.save();

        ctx.shadowColor = 'red';
        ctx.shadowBlur = this.blur;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'red';

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
        ctx.fill();

        let grd = ctx.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, options.radius * 0.8);
        grd.addColorStop(0, 'rgba(255,0,255,0.3)');
        grd.addColorStop(1, 'rgba(255,0,255,0)');

        // 中间透明
        let mOpacity = 0;
        if (typeof this.leaveTtl !== 'undefined') {
            if (this.options.breakTtl) {
                // 此球还会分裂
                let mOpacityHalfTtl = (this.options.breakTtl - this.leaveTtl) * 0.5;
                mOpacity = (mOpacityHalfTtl - Math.abs(this.ttl - this.leaveTtl - mOpacityHalfTtl)) / mOpacityHalfTtl;
            } else {
                // 此球不会分裂
                mOpacity = (this.ttl - this.leaveTtl) / (this.dieTtl - this.leaveTtl);
            }
            // console.log(mOpacity);
            ctx.globalAlpha = mOpacity;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    die() {
        super.die();
        // console.log(balls.length);
        balls.splice(balls.indexOf(this), 1);
    }
}

class Connection extends Obj{
    constructor(ball1, ball2, ttl) {
        super(ttl);
        this.maxDis = (ball1.options.radius + ball2.options.radius) * 1.5;

        this.ball1 = ball1;
        this.ball2 = ball2;

        // ball1.connection = this;
        // ball2.connection = this;

        // ball1.otherBall = ball2;
        // ball2.otherBall = ball1;

        this.dieTtl = ttl + 4000;

        connections.push(this);
    }

    update() {
        let dis = new Vec2().subVectors( this.ball1.position, this.ball2.position );
        let disLength = dis.length();

        // console.log(this.ball1.leaveTtl, disLength, this.ball1.options.radius + this.ball2.options.radius);
        if (!this.leaveTtl && disLength > this.ball1.options.radius + this.ball2.options.radius) {
            this.ball1.leaveFromOtherBall();
            this.ball2.leaveFromOtherBall();
        }
        if (this.ball1.isDie || this.ball2.isDie || disLength > this.maxDis) {//disLength >= this.maxDis) {
            this.isDie || this.die(); 
            return false;
        }
    }

    calPoints(c1, r1, c2, r2, v, h, max) {
        var pi2 = Math.PI / 2;
        var c2ToC1 = new Vec2().subVectors(c1, c2);
        var d = c2ToC1.length();
        var u1, u2;

        function getVec2(radians, length) {
            return new Vec2(-Math.cos(radians), -Math.sin(radians)).setLength(length);
        }

        if (r1 == 0 || r2 == 0)
            return;
        if (d > max || d <= Math.abs(r1 - r2)) {
            return;
        } else if (d < r1 + r2) { // case circles are overlapping
            u1 = Math.acos((r1 * r1 + d * d - r2 * r2) /
                    (2 * r1 * d));
            u2 = Math.acos((r2 * r2 + d * d - r1 * r1) /
                    (2 * r2 * d));
        } else {
            u1 = 0;
            u2 = 0;
        }

        var angle1 = c2ToC1.angle();
        var angle2 = Math.acos((r1 - r2) / d);
        var angle1a = angle1 + u1 + (angle2 - u1) * v;
        var angle1b = angle1 - u1 - (angle2 - u1) * v;
        var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
        var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
        var p1a = c1.clone().add(getVec2(angle1a, r1));
        var p1b = c1.clone().add(getVec2(angle1b, r1));
        var p2a = c2.clone().add(getVec2(angle2a, r2));
        var p2b = c2.clone().add(getVec2(angle2b, r2));

        // define handle length by the distance between
        // both ends of the curve to draw
        var totalr = (r1 + r2);
        var d2 = Math.min(v * h, new Vec2().subVectors(p1a, p2a).length() / totalr);

        // case circles are overlapping:
        d2 *= Math.min(1, d * 2 / (r1 + r2));

        r1 *= d2;
        r2 *= d2;

        let handle1 = p1a.clone().add(getVec2(angle1a - pi2, r1));
        let handle2 = p2a.clone().add(getVec2(angle2a + pi2, r2));
        let handle3 = p2b.clone().add(getVec2(angle2b - pi2, r2));
        let handle4 = p1b.clone().add(getVec2(angle1b + pi2, r1));
        return [p1a, p2a, p2b, p1b, handle1, handle2, handle3, handle4];
    }

    draw(ctx) {
        let keyPoints = this.calPoints(
            this.ball1.position, 
            this.ball1.options.radius,
            this.ball2.position, 
            this.ball2.options.radius, 
            0.3,
            5.4,
            this.maxDis
        );

        ctx.save();
        if (keyPoints) {
            ctx.shadowColor = 'red';
            ctx.shadowBlur = this.blur;
            ctx.globalAlpha = this.opacity;
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(keyPoints[0].x, keyPoints[0].y);
            ctx.bezierCurveTo(keyPoints[4].x, keyPoints[4].y, keyPoints[5].x,keyPoints[5].y, keyPoints[1].x, keyPoints[1].y);
            ctx.lineTo(keyPoints[2].x, keyPoints[2].y);
            ctx.bezierCurveTo(keyPoints[6].x, keyPoints[6].y, keyPoints[7].x,keyPoints[7].y, keyPoints[3].x, keyPoints[3].y);
            ctx.lineTo(keyPoints[0].x, keyPoints[0].y);

            ctx.fill();
        }
        ctx.restore();
    }

    die() {
        super.die();
        this.ball1.connection = null;
        this.ball2.connection = null;
        connections.splice(connections.indexOf(this), 1);
    }
}

class Gradient {} 


class Painter extends Time {
    constructor(cvs) {
        super();
        this.cvs = cvs;
        this.width = cvs.width;
        this.height = cvs.height;
        this.ctx = this.cvs.getContext('2d');
        this.tick;

        this.offCvs = document.createElement('canvas');
        this.offCvs.width = this.width;
        this.offCvs.height = this.height;
        this.offCtx = this.offCvs.getContext('2d');

        let grd=this.offCtx.createLinearGradient(0, 0, this.width, this.height);
        for (let i = 0; i <= 20; i++) {
            grd.addColorStop(i/20, i % 2 === 0 ? 'yellow' : 'green');
        }
        this.offCtx.fillStyle = grd;
        this.offCtx.fillRect(0, 0, this.width, this.height);

        this.maxBallCount = 10;
    }

    start() {
        this.tick = this.addTick(this.tick);
    }

    tick(delta) {
        if (balls.length < this.maxBallCount) {
            let a = new Vec2(Math.random() * 1, Math.random() * 1).setLength(Math.random() * 200);
            let initTtl = Math.random() * 1000;

            /*new Ball({
                radius: 20,
                initTtl: initTtl, // 寿命值
                initPosition: new Vec2(Math.random() * this.width, Math.random() * this.height),
                a: a, // 加速度 v/s Vec2
                aTime: Math.random() * 1000, // 加速时间
                breakTtl: initTtl + Math.random() * 2000, // 分裂时间
                initV: this.v, // 初始速度
            });*/ 

            new Ball({
                radius: 15,
                initTtl: 0, // 寿命值
                initPosition: new Vec2(500, 300),
                a: new Vec2(-50, 30), // 加速度 v/s Vec2
                aTime: 1000, // 加速时间
                breakTtl: 2000, // 分裂时间
                initV: new Vec2(5, 3), // 初始速度
            });
        }
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
        balls.forEach(b=>{
            b.update(delta);
            if (!b.connection) {
                b.draw(this.ctx);
            }
        });
        connections.forEach(c=>{
            c.update(delta);
            c.ball1.draw(this.ctx);
            c.ball2.draw(this.ctx);
            c.draw(this.ctx);
        });

        

        this.ctx.globalCompositeOperation = "source-in";
        // this.ctx.drawImage(this.offCvs, 0, 0);
        // console.log(balls.length);
        this.ctx.restore();
    }
}



let cvs = document.createElement('canvas');

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

document.body.appendChild(cvs);

let painter = new Painter(cvs);

painter.start();
TIME.start();