/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vec2_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__time_js__ = __webpack_require__(2);



// import Stats from './stats.js';
// var stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );

let obstruction = 0.01; // 空气阻力
let bigRaduis = 15;
let smallRaduis = 10;

class Ball {
    constructor(options) {
        let defaults = {
            initPosition: new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](),
            radius: 15,
            initV: new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */], // 初始速度
        };

        for (let key in defaults) {
            options[key] = options[key] || defaults[key];
        }
        this.position = options.initPosition.clone();
        this.v = options.initV;
        this.a = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */]; // 加速度

        this.options = options;
    }

    update(delta) {

        let second = delta * 0.001;
        let options = this.options;

        this.v.add(this.a.clone().multiplyScalar(second));
        
        this.v.sub(this.v.clone().setLength(obstruction * second)); // 阻力减速
        this.position.add(this.v.clone().multiplyScalar(second));
        // console.log(this.position);
    }

    draw(ctx, opacity, blur) {

        let options = this.options;

        opacity = Math.min(opacity, 1);

        ctx.save();

        // ctx.shadowColor = 'red';
        // ctx.shadowBlur = blur;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = 'red';

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
        ctx.fill();


        // 中间透明
        
        /*if (typeof this.isBreakBall) {
            let grd = ctx.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, options.radius * 0.8);
            grd.addColorStop(0, 'rgba(255,0,255,0.2)');
            grd.addColorStop(1, 'rgba(255,0,255,0)');
            
            ctx.globalAlpha = (1 - opacity) * 0.5;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
            ctx.fill();
        }*/

        ctx.restore();
    }

    die() {
        //
    }
}

class Connection {
    constructor(ball1, ball2) {
        this.maxDis = (ball1.options.radius + ball2.options.radius) * 1.5;

        this.isDie = false;

        this.isSeparate = false;
        this.ball1 = ball1;
        this.ball2 = ball2;

    }

    update() {
        this.isSeparate = this.isSeparate || (new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */]().subVectors(this.ball1.position, this.ball2.position)).length() > this.ball1.options.radius + this.ball2.options.radius + 10;
        // console.log(this.isSeparate);
    }

    calPoints(c1, r1, c2, r2, v, h, max) {
        var pi2 = Math.PI / 2;
        var c2ToC1 = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */]().subVectors(c1, c2);
        var d = c2ToC1.length();
        var u1, u2;

        function getVec2(radians, length) {
            return new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](-Math.cos(radians), -Math.sin(radians)).setLength(length);
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
        var d2 = Math.min(v * h, new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */]().subVectors(p1a, p2a).length() / totalr);

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

    draw(ctx, opacity, blur) {
        let keyPoints = this.calPoints(
            this.ball1.position.clone(), 
            this.ball1.options.radius,
            this.ball2.position.clone(), 
            this.ball2.options.radius, 
            0.3,
            5.4,
            this.maxDis
        );

        ctx.save();
        if (keyPoints) {
            // ctx.shadowColor = 'red';
            // ctx.shadowBlur = blur;
            ctx.globalAlpha = opacity;
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
        this.isDie = true;
        this.ball1 = null;
        this.ball2 = null;            
    }
}

class BreakBall {
    constructor(options) {
        let defaults = {
            maxOpacity: 1,
            blur: 0,

            bornPos: new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](),
            bornA: new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](5, 5), // 出生加速
            bornADur: 1000, // 出生加速耗时

            breakTime: 2000, // 分裂时间
            breakA: 5, // 标量，方向在运行的时候确定
            breakADur: 1000, // 分裂加速耗时
            destoryDur: 1000, // 消亡耗时
        };

        for (let key in defaults) {
            options[key] = options[key] || defaults[key];
        }
        this.options = options;

        // 0 born
        // 1 a done
        // 2 break
        // 3 break a done
        // 4 die
        this.status = 0; 


        this.timePass = 0;
        this.separateTime = 0;
        this.opacity = 1;
        this.blur = options.blur;


        this.ball1Radius = bigRaduis * (1.2 - Math.random() * 0.4);
        this.ball2Radius = smallRaduis * (1.2 - Math.random() * 0.4);

        this.ball1 = new Ball({
            initPosition: options.bornPos.clone(),
            radius: this.ball1Radius,
            initV: new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */], // 初始速度
        });
        this.ball1.a = options.bornA;
        this.ball2;
        this.connection;
    }

    update(delta) {
        let options = this.options;
        let second = delta / 1000;
        let opacity = 1;

        this.timePass += delta;

        switch (this.status) {
            case 0: 
                if (this.timePass < options.bornADur) {
                    opacity = this.timePass / options.bornADur;
                } else {
                    this.status = 1;
                    this.ball1.a = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */];
                }    
                break;
            case 1: 
                if (this.timePass >= options.breakTime) {
                    this.status = 2;
                    this.break(); // 生成 ball2, 设置分裂加速度
                }
                break;
            case 2: 
                // console.log(this.ball1.v, this.ball2.v);
                // console.log(this.ball1.v, this.ball2.v);
                // console.log(this.ball1.position, this.ball2.position);
                if (this.timePass >= options.breakTime + options.breakADur) {
                    this.status = 3;
                    this.ball1.a = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */];
                    this.ball2.a = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */];
                }
                break;
            case 3: 
                if (!this.separateTime && this.connection.isSeparate) {
                    this.separateTime = this.timePass;
                }
                if (this.separateTime) {
                    if (this.timePass < this.separateTime + this.options.destoryDur) {
                        opacity = 1 - (this.timePass - this.separateTime) / 
                                    this.options.destoryDur;
                    } else {
                        this.status = 4;
                        this.die();
                    }
                }
                break;
        }

        // console.log(this.status, opacity);
        this.opacity = Math.min(opacity, 1) * this.options.maxOpacity;

        this.ball1 && this.ball1.update(delta);
        this.ball2 && this.ball2.update(delta);
        this.connection && !this.connection.isDie && this.connection.update(delta);
    }

    draw(ctx) {
        this.ball1 && this.ball1.draw(ctx, this.opacity, this.blur);
        this.ball2 && this.ball2.draw(ctx, this.opacity, this.blur);
        this.connection && !this.isDie && this.connection.draw(ctx, this.opacity, this.blur);
    }

    break() {
        this.ball2 = new Ball({
            initPosition: this.ball1.position,
            radius: this.ball2Radius,
            initV: new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */], // 初始速度            
        });

        let breakA1 = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](Math.random(), Math.random());
        breakA1.setLength(this.options.breakA);
        
        let breakA2 = breakA1.clone().multiplyScalar(-1);

        this.ball1.a = breakA1;// 分裂加速度
        this.ball2.a = breakA2;// 分裂加速度
        this.connection = new Connection(this.ball1, this.ball2);
    }

    die() {
        this.isDie = true;
        this.ball1.die();
        this.ball2.die();
        this.connection.die();
        this.ball1 = null;
        this.ball2 = null;
        this.connection = null;
    }
}

class Painter extends __WEBPACK_IMPORTED_MODULE_1__time_js__["b" /* Time */] {
    constructor(cvs) {
        super();
        this.cvs = cvs;
        this.width = cvs.width;
        this.height = cvs.height;
        this.ctx = this.cvs.getContext('2d');

        this.tick;

        this.breakBalls = [];

        this.offCvs = document.createElement('canvas');
        this.offCvs.width = this.width;
        this.offCvs.height = this.height;
        this.offCtx = this.offCvs.getContext('2d');

        let grd=this.offCtx.createLinearGradient(0, 0, this.width, 0);
        for (let i = 0; i <= 10; i++) {
            grd.addColorStop(i/10, i % 2 === 0 ? '#0678d0' : '#1bb4ba');
        }
        this.offCtx.fillStyle = grd;
        this.offCtx.fillRect(0, 0, this.width, this.height);

        this.maxBallCount =  10;
    }

    start() {
        this.tick = this.addTick(this.tick);
    }

    tick(delta) {
        // stats.update();
        if (this.breakBalls.length < this.maxBallCount) {

            let maxOpacity = Math.random() + 0.8;
            let blur = (Math.random() * 8) | 0;
            let bornPos = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](
                // this.width * 0.1 + Math.random() * this.width * 0.3 + (Math.random() > 0.5 ? this.width * 0.6 : 0), 
                Math.random() * this.width,
                Math.random() * this.height * 0.3 + this.height * 0.3
            );
            let bornA = new __WEBPACK_IMPORTED_MODULE_0__vec2_js__["a" /* Vector2 */](Math.random() - 0.5, Math.random()-0.5).setLength(Math.random() * 20);

            let aniTime = Math.random() * 3000 + 5000;
            let bornADur = aniTime * 0.2;
            let breakTime = aniTime * 0.4;
            let breakADur = aniTime * 0.2;
            let breakA = 8 + Math.random() * 6;
            let destoryDur = Math.random() * 300 + 1000;

            this.breakBalls.push(new BreakBall({
                maxOpacity,
                blur,

                bornPos,
                bornA, // 出生加速度
                bornADur, // 出生加速耗时

                breakTime, // 分裂时间
                breakA, // 标量，方向在运行的时候确定
                breakADur, // 分裂加速耗时
                destoryDur // 消亡耗时
            }));
        }
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);

        for(let i = this.breakBalls.length - 1; i >= 0; i--) {
            if (this.breakBalls[i].isDie) {
                this.breakBalls.splice(i, 1);
            } else {
                this.breakBalls[i].update(delta);
                this.breakBalls[i].draw(this.ctx);
            }
        }

        this.ctx.globalCompositeOperation = "source-in";
        this.ctx.drawImage(this.offCvs, 0, 0);
        // console.log(balls.length);
        this.ctx.restore();
    }
}



let cvs = document.createElement('canvas');

cvs.width = 1920;
cvs.height = 1079;

document.body.appendChild(cvs);

let painter = new Painter(cvs);

painter.start();
__WEBPACK_IMPORTED_MODULE_1__time_js__["a" /* TIME */].start();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Vector2; });
function Vector2( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

}

Object.defineProperties( Vector2.prototype, {

	"width" : {

		get: function () {

			return this.x;

		},

		set: function ( value ) {

			this.x = value;

		}

	},

	"height" : {

		get: function () {

			return this.y;

		},

		set: function ( value ) {

			this.y = value;

		}

	}

} );

Object.assign( Vector2.prototype, {

	isVector2: true,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setScalar: function ( scalar ) {

		this.x = scalar;
		this.y = scalar;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

		return this;

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	clone: function () {

		return new this.constructor( this.x, this.y );

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScaledVector: function ( v, s ) {

		this.x += v.x * s;
		this.y += v.y * s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	min: function ( v ) {

		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );

		return this;

	},

	max: function ( v ) {

		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );

		return this;

	},

	clamp: function ( min, max ) {

		// assumes min < max, componentwise

		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );

		return this;

	},

	clampScalar: function () {

		var min = new Vector2();
		var max = new Vector2();

		return function clampScalar( minVal, maxVal ) {

			min.set( minVal, minVal );
			max.set( maxVal, maxVal );

			return this.clamp( min, max );

		};

	}(),

	clampLength: function ( min, max ) {

		var length = this.length();

		return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

	},

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	lengthManhattan: function() {

		return Math.abs( this.x ) + Math.abs( this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() || 1 );

	},

	angle: function () {

		// computes the angle in radians with respect to the positive x-axis

		var angle = Math.atan2( this.y, this.x );

		if ( angle < 0 ) angle += 2 * Math.PI;

		return angle;

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	distanceToManhattan: function ( v ) {

		return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

	},

	setLength: function ( length ) {

		return this.normalize().multiplyScalar( length );

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	},

	fromBufferAttribute: function ( attribute, index, offset ) {

		if ( offset !== undefined ) {

			console.warn( 'THREE.Vector2: offset has been removed from .fromBufferAttribute().' );

		}

		this.x = attribute.getX( index );
		this.y = attribute.getY( index );

		return this;

	},

	rotateAround: function ( center, angle ) {

		var c = Math.cos( angle ), s = Math.sin( angle );

		var x = this.x - center.x;
		var y = this.y - center.y;

		this.x = x * c - y * s + center.x;
		this.y = x * s + y * c + center.y;

		return this;

	}

} );




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TIME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Time; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tween_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tween_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tween_js__);
/* unused harmony reexport TWEEN */


/* 时间 */
var TIME = {
	// 所有时间body对象
	bodys : [],
	delta: 16
}

var stop = false;
var t;
TIME.addBody = function(timeBody) {
	this.bodys.push(timeBody);
}

TIME.removeBody = function(timeBody) {
	var index = this.bodys.indexOf(timeBody);

	if (index !== -1) {
		this.bodys.splice(index, 1);
	}
}
TIME.tick = (function() {
	var now = (new Date()).getTime();
	var last = now;
	var delta;
	return function() {
		delta = now - last;
		delta = delta > 500 ? 30 : (delta < 16? 16 : delta);
		TIME.delta = delta;
		last = now;

		TIME.handleFrame(delta);
		if (!stop) {
			t = requestAnimationFrame(TIME.tick);
			// setTimeout(TIME.tick, 1000);
		}		
	}	
})();


TIME.start = function() {
	stop = false;
	cancelAnimationFrame(t);
	this.tick();
}

TIME.stop = function() {
	cancelAnimationFrame(t);
	stop = true;
}

TIME.handleFrame = function(delta) { 

	TIME.bodys.forEach(function(body) {
		if (!body.isStop) {
			body.ticks.forEach(function(tick) {
				tick.fn && tick.fn(delta); 
			});
		}
	});

	__WEBPACK_IMPORTED_MODULE_0_tween_js___default.a.update();
}

window.TIME = TIME;

/* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
class Time {

	constructor() {
		this.ticks = [];
		this.tweens = [];
		this.isStop = false;
		TIME.addBody(this);
	}


	/**
	 * 该物体灭亡
	 */
	destory() {
		TIME.removeBody(this);
	}

	/** 
	 * 帧更新
	 * @param timegap 与上一帧的时间间隔
	 */
	addTick(fn) {
		var tick = {'fn': fn.bind(this)};

		tick.isStop = false;
		this.ticks.push(tick);
		return tick;
	}

	removeTick(tick) {
		if (!tick) {
			// remove all
			this.ticks = [];
			return;
		}

		var index = this.ticks.indexOf(tick);

		if (index !== -1) {
			this.ticks.splice(index, 1);
		}
	}

	/** 
	 * tween
	 */
	addTween(tween) {
		this.tweens.push(tween);
	}

	removeTween(tween) {
		if (!tween) {
			// remove all
			this.tween = [];
			return;
		}

		var index = this.tweens.indexOf(tween);

		if (index !== -1) {
			//tween.stop();
			this.tweens.splice(index, 1);
		}
	}

	// stop 暂停时间
	stop() {
		this.isStop = true;
		this.tweens.forEach(function(tween) {
			tween.stop();
		});
	}

	start() {
		this.isStop = false;
		this.tweens.forEach(function(tween) {
			tween.start();
		});
	}
}

window.Time = Time;

for (let i = 0; i < 10000; i+=100) {
	window['TIME_' + i] = window.env === 'develop' ? 0 : i;
}






/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}


TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _repeatDelayTime;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	this.to = function (properties, duration) {

		_valuesEnd = properties;

		if (duration !== undefined) {
			_duration = duration;
		}

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object, _object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.end = function () {

		this.update(_startTime + _duration);
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.repeatDelay = function (amount) {

		_repeatDelayTime = amount;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object, _object);
			}

			_onStartCallbackFired = true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				if (_repeatDelayTime !== undefined) {
					_startTime = time + _repeatDelayTime;
				} else {
					_startTime = time + _delayTime;
				}

				return true;

			} else {

				if (_onCompleteCallback !== null) {

					_onCompleteCallback.call(_object, _object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (true) {

		// AMD
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return TWEEN;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);