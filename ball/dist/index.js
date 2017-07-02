/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _vec = __webpack_require__(1);
	
	var _time = __webpack_require__(6);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	__webpack_require__(2);
	
	var objs = [];
	var balls = [];
	var connections = [];
	
	var obstruction = 0.1; // 物体每过一秒损失速度
	
	var C = 0;
	
	var Obj = function () {
	    function Obj() {
	        var ttl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	
	        _classCallCheck(this, Obj);
	
	        this.isDie = false;
	        this.ttl = ttl;
	        this.dieTtl = 100000;
	        this.maxBlur = 5; // 5px
	        this.opacity;
	        this.blur;
	        objs.push(this);
	    }
	
	    _createClass(Obj, [{
	        key: 'update',
	        value: function update(delta) {
	            this.ttl += delta;
	            if (this.ttl >= this.dieTtl) {
	                this.ttl = this.dieTtl;
	                this.die();
	                return false;
	            }
	            this.opacity = (this.dieTtl - this.ttl) / this.dieTtl;
	            this.blur = (1 - this.opacity) * this.maxBlur;
	        }
	    }, {
	        key: 'die',
	        value: function die() {
	            this.isDie = true;
	            objs.splice(balls.indexOf(this), 1);
	        }
	    }]);
	
	    return Obj;
	}();
	
	var Ball = function (_Obj) {
	    _inherits(Ball, _Obj);
	
	    function Ball(options) {
	        _classCallCheck(this, Ball);
	
	        var _this = _possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, options.initTtl));
	
	        _this.aid = C++;
	        var defaults = {
	            radius: 20,
	            initTtl: 0, // 寿命值
	            initPosition: new _vec.Vector2(),
	            a: new _vec.Vector2(), // 加速度 v/s Vec2
	            aTime: 1000, // 加速时间
	            breakTtl: 0, // 分裂时间
	            initV: new _vec.Vector2() // 初始速度
	        };
	
	        for (var key in defaults) {
	            options[key] = options[key] || defaults[key];
	        }
	        _this.position = options.initPosition;
	        _this.v = options.initV;
	        _this.aTimePass = 0;
	
	        _this.leaveTtl; // 与对方球分开的时间
	
	        _this.options = options;
	        balls.push(_this);
	        return _this;
	    }
	
	    _createClass(Ball, [{
	        key: 'break',
	        value: function _break() {
	            var breakA1 = new _vec.Vector2(-4, -4);
	            // let breakA1 = new Vec2(Math.random(), Math.random()).setLength(Math.random() * 10);
	            var breakA2 = breakA1.clone().multiplyScalar(-1);
	
	            var ball1 = new Ball({
	                radius: 15,
	                initTtl: this.ttl, // 寿命值
	                initPosition: this.position.clone(),
	                a: breakA1, // 加速度 v/s Vec2
	                aTime: 1000, // 加速时间
	                breakTtl: this.ttl + 8000, // 分裂时间
	                initV: this.v.clone() // 初始速度
	            });
	            var ball2 = new Ball({
	                radius: 10,
	                initTtl: this.ttl, // 寿命值
	                initPosition: this.position.clone(),
	                a: breakA2, // 加速度 v/s Vec2
	                aTime: 1000, // 加速时间
	                breakTtl: 0, // 分裂时间
	                initV: this.v.clone() // 初始速度
	            });
	
	            var connection = new Connection(ball1, ball2, this.ttl);
	
	            this.die();
	        }
	    }, {
	        key: 'leaveFromOtherBall',
	        value: function leaveFromOtherBall() {
	            this.leaveTtl = this.ttl;
	        }
	    }, {
	        key: 'update',
	        value: function update(delta) {
	            _get(Ball.prototype.__proto__ || Object.getPrototypeOf(Ball.prototype), 'update', this).call(this, delta);
	
	            if (this.isDie) return;
	
	            var second = delta * 0.001;
	            var options = this.options;
	
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
	    }, {
	        key: 'draw',
	        value: function draw(ctx) {
	            var options = this.options;
	
	            ctx.save();
	
	            ctx.shadowColor = 'red';
	            ctx.shadowBlur = this.blur;
	            ctx.globalAlpha = this.opacity;
	            ctx.fillStyle = 'red';
	
	            ctx.beginPath();
	            ctx.arc(this.position.x, this.position.y, options.radius, 0, Math.PI * 2);
	            ctx.fill();
	
	            var grd = ctx.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, options.radius * 0.8);
	            grd.addColorStop(0, 'rgba(255,0,255,0.3)');
	            grd.addColorStop(1, 'rgba(255,0,255,0)');
	
	            // 中间透明
	            var mOpacity = 0;
	            if (typeof this.leaveTtl !== 'undefined') {
	                if (this.options.breakTtl) {
	                    // 此球还会分裂
	                    var mOpacityHalfTtl = (this.options.breakTtl - this.leaveTtl) * 0.5;
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
	    }, {
	        key: 'die',
	        value: function die() {
	            _get(Ball.prototype.__proto__ || Object.getPrototypeOf(Ball.prototype), 'die', this).call(this);
	            // console.log(balls.length);
	            balls.splice(balls.indexOf(this), 1);
	        }
	    }]);
	
	    return Ball;
	}(Obj);
	
	var Connection = function (_Obj2) {
	    _inherits(Connection, _Obj2);
	
	    function Connection(ball1, ball2, ttl) {
	        _classCallCheck(this, Connection);
	
	        var _this2 = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this, ttl));
	
	        _this2.maxDis = (ball1.options.radius + ball2.options.radius) * 1.5;
	
	        _this2.ball1 = ball1;
	        _this2.ball2 = ball2;
	
	        // ball1.connection = this;
	        // ball2.connection = this;
	
	        // ball1.otherBall = ball2;
	        // ball2.otherBall = ball1;
	
	        _this2.dieTtl = ttl + 4000;
	
	        connections.push(_this2);
	        return _this2;
	    }
	
	    _createClass(Connection, [{
	        key: 'update',
	        value: function update() {
	            var dis = new _vec.Vector2().subVectors(this.ball1.position, this.ball2.position);
	            var disLength = dis.length();
	
	            // console.log(this.ball1.leaveTtl, disLength, this.ball1.options.radius + this.ball2.options.radius);
	            if (!this.leaveTtl && disLength > this.ball1.options.radius + this.ball2.options.radius) {
	                this.ball1.leaveFromOtherBall();
	                this.ball2.leaveFromOtherBall();
	            }
	            if (this.ball1.isDie || this.ball2.isDie || disLength > this.maxDis) {
	                //disLength >= this.maxDis) {
	                this.isDie || this.die();
	                return false;
	            }
	        }
	    }, {
	        key: 'calPoints',
	        value: function calPoints(c1, r1, c2, r2, v, h, max) {
	            var pi2 = Math.PI / 2;
	            var c2ToC1 = new _vec.Vector2().subVectors(c1, c2);
	            var d = c2ToC1.length();
	            var u1, u2;
	
	            function getVec2(radians, length) {
	                return new _vec.Vector2(-Math.cos(radians), -Math.sin(radians)).setLength(length);
	            }
	
	            if (r1 == 0 || r2 == 0) return;
	            if (d > max || d <= Math.abs(r1 - r2)) {
	                return;
	            } else if (d < r1 + r2) {
	                // case circles are overlapping
	                u1 = Math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d));
	                u2 = Math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d));
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
	            var totalr = r1 + r2;
	            var d2 = Math.min(v * h, new _vec.Vector2().subVectors(p1a, p2a).length() / totalr);
	
	            // case circles are overlapping:
	            d2 *= Math.min(1, d * 2 / (r1 + r2));
	
	            r1 *= d2;
	            r2 *= d2;
	
	            var handle1 = p1a.clone().add(getVec2(angle1a - pi2, r1));
	            var handle2 = p2a.clone().add(getVec2(angle2a + pi2, r2));
	            var handle3 = p2b.clone().add(getVec2(angle2b - pi2, r2));
	            var handle4 = p1b.clone().add(getVec2(angle1b + pi2, r1));
	            return [p1a, p2a, p2b, p1b, handle1, handle2, handle3, handle4];
	        }
	    }, {
	        key: 'draw',
	        value: function draw(ctx) {
	            var keyPoints = this.calPoints(this.ball1.position, this.ball1.options.radius, this.ball2.position, this.ball2.options.radius, 0.3, 5.4, this.maxDis);
	
	            ctx.save();
	            if (keyPoints) {
	                ctx.shadowColor = 'red';
	                ctx.shadowBlur = this.blur;
	                ctx.globalAlpha = this.opacity;
	                ctx.globalCompositeOperation = 'source-over';
	                ctx.fillStyle = 'red';
	                ctx.beginPath();
	                ctx.moveTo(keyPoints[0].x, keyPoints[0].y);
	                ctx.bezierCurveTo(keyPoints[4].x, keyPoints[4].y, keyPoints[5].x, keyPoints[5].y, keyPoints[1].x, keyPoints[1].y);
	                ctx.lineTo(keyPoints[2].x, keyPoints[2].y);
	                ctx.bezierCurveTo(keyPoints[6].x, keyPoints[6].y, keyPoints[7].x, keyPoints[7].y, keyPoints[3].x, keyPoints[3].y);
	                ctx.lineTo(keyPoints[0].x, keyPoints[0].y);
	
	                ctx.fill();
	            }
	            ctx.restore();
	        }
	    }, {
	        key: 'die',
	        value: function die() {
	            _get(Connection.prototype.__proto__ || Object.getPrototypeOf(Connection.prototype), 'die', this).call(this);
	            this.ball1.connection = null;
	            this.ball2.connection = null;
	            connections.splice(connections.indexOf(this), 1);
	        }
	    }]);
	
	    return Connection;
	}(Obj);
	
	var Gradient = function Gradient() {
	    _classCallCheck(this, Gradient);
	};
	
	var Painter = function (_Time) {
	    _inherits(Painter, _Time);
	
	    function Painter(cvs) {
	        _classCallCheck(this, Painter);
	
	        var _this3 = _possibleConstructorReturn(this, (Painter.__proto__ || Object.getPrototypeOf(Painter)).call(this));
	
	        _this3.cvs = cvs;
	        _this3.width = cvs.width;
	        _this3.height = cvs.height;
	        _this3.ctx = _this3.cvs.getContext('2d');
	        _this3.tick;
	
	        _this3.offCvs = document.createElement('canvas');
	        _this3.offCvs.width = _this3.width;
	        _this3.offCvs.height = _this3.height;
	        _this3.offCtx = _this3.offCvs.getContext('2d');
	
	        var grd = _this3.offCtx.createLinearGradient(0, 0, _this3.width, _this3.height);
	        for (var i = 0; i <= 20; i++) {
	            grd.addColorStop(i / 20, i % 2 === 0 ? 'yellow' : 'green');
	        }
	        _this3.offCtx.fillStyle = grd;
	        _this3.offCtx.fillRect(0, 0, _this3.width, _this3.height);
	
	        _this3.maxBallCount = 10;
	        return _this3;
	    }
	
	    _createClass(Painter, [{
	        key: 'start',
	        value: function start() {
	            this.tick = this.addTick(this.tick);
	        }
	    }, {
	        key: 'tick',
	        value: function tick(delta) {
	            var _this4 = this;
	
	            if (balls.length < this.maxBallCount) {
	                var a = new _vec.Vector2(Math.random() * 1, Math.random() * 1).setLength(Math.random() * 200);
	                var initTtl = Math.random() * 1000;
	
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
	                    initPosition: new _vec.Vector2(500, 300),
	                    a: new _vec.Vector2(-50, 30), // 加速度 v/s Vec2
	                    aTime: 1000, // 加速时间
	                    breakTtl: 2000, // 分裂时间
	                    initV: new _vec.Vector2(5, 3) // 初始速度
	                });
	            }
	            this.ctx.save();
	            this.ctx.clearRect(0, 0, this.width, this.height);
	            balls.forEach(function (b) {
	                b.update(delta);
	                if (!b.connection) {
	                    b.draw(_this4.ctx);
	                }
	            });
	            connections.forEach(function (c) {
	                c.update(delta);
	                c.ball1.draw(_this4.ctx);
	                c.ball2.draw(_this4.ctx);
	                c.draw(_this4.ctx);
	            });
	
	            this.ctx.globalCompositeOperation = "source-in";
	            // this.ctx.drawImage(this.offCvs, 0, 0);
	            // console.log(balls.length);
	            this.ctx.restore();
	        }
	    }]);
	
	    return Painter;
	}(_time.Time);
	
	var cvs = document.createElement('canvas');
	
	cvs.width = window.innerWidth;
	cvs.height = window.innerHeight;
	
	document.body.appendChild(cvs);
	
	var painter = new Painter(cvs);
	
	painter.start();
	_time.TIME.start();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function Vector2(x, y) {
	
			this.x = x || 0;
			this.y = y || 0;
	}
	
	Object.defineProperties(Vector2.prototype, {
	
			"width": {
	
					get: function get() {
	
							return this.x;
					},
	
					set: function set(value) {
	
							this.x = value;
					}
	
			},
	
			"height": {
	
					get: function get() {
	
							return this.y;
					},
	
					set: function set(value) {
	
							this.y = value;
					}
	
			}
	
	});
	
	_extends(Vector2.prototype, {
	
			isVector2: true,
	
			set: function set(x, y) {
	
					this.x = x;
					this.y = y;
	
					return this;
			},
	
			setScalar: function setScalar(scalar) {
	
					this.x = scalar;
					this.y = scalar;
	
					return this;
			},
	
			setX: function setX(x) {
	
					this.x = x;
	
					return this;
			},
	
			setY: function setY(y) {
	
					this.y = y;
	
					return this;
			},
	
			setComponent: function setComponent(index, value) {
	
					switch (index) {
	
							case 0:
									this.x = value;break;
							case 1:
									this.y = value;break;
							default:
									throw new Error('index is out of range: ' + index);
	
					}
	
					return this;
			},
	
			getComponent: function getComponent(index) {
	
					switch (index) {
	
							case 0:
									return this.x;
							case 1:
									return this.y;
							default:
									throw new Error('index is out of range: ' + index);
	
					}
			},
	
			clone: function clone() {
	
					return new this.constructor(this.x, this.y);
			},
	
			copy: function copy(v) {
	
					this.x = v.x;
					this.y = v.y;
	
					return this;
			},
	
			add: function add(v, w) {
	
					if (w !== undefined) {
	
							console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
							return this.addVectors(v, w);
					}
	
					this.x += v.x;
					this.y += v.y;
	
					return this;
			},
	
			addScalar: function addScalar(s) {
	
					this.x += s;
					this.y += s;
	
					return this;
			},
	
			addVectors: function addVectors(a, b) {
	
					this.x = a.x + b.x;
					this.y = a.y + b.y;
	
					return this;
			},
	
			addScaledVector: function addScaledVector(v, s) {
	
					this.x += v.x * s;
					this.y += v.y * s;
	
					return this;
			},
	
			sub: function sub(v, w) {
	
					if (w !== undefined) {
	
							console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
							return this.subVectors(v, w);
					}
	
					this.x -= v.x;
					this.y -= v.y;
	
					return this;
			},
	
			subScalar: function subScalar(s) {
	
					this.x -= s;
					this.y -= s;
	
					return this;
			},
	
			subVectors: function subVectors(a, b) {
	
					this.x = a.x - b.x;
					this.y = a.y - b.y;
	
					return this;
			},
	
			multiply: function multiply(v) {
	
					this.x *= v.x;
					this.y *= v.y;
	
					return this;
			},
	
			multiplyScalar: function multiplyScalar(scalar) {
	
					this.x *= scalar;
					this.y *= scalar;
	
					return this;
			},
	
			divide: function divide(v) {
	
					this.x /= v.x;
					this.y /= v.y;
	
					return this;
			},
	
			divideScalar: function divideScalar(scalar) {
	
					return this.multiplyScalar(1 / scalar);
			},
	
			min: function min(v) {
	
					this.x = Math.min(this.x, v.x);
					this.y = Math.min(this.y, v.y);
	
					return this;
			},
	
			max: function max(v) {
	
					this.x = Math.max(this.x, v.x);
					this.y = Math.max(this.y, v.y);
	
					return this;
			},
	
			clamp: function clamp(min, max) {
	
					// assumes min < max, componentwise
	
					this.x = Math.max(min.x, Math.min(max.x, this.x));
					this.y = Math.max(min.y, Math.min(max.y, this.y));
	
					return this;
			},
	
			clampScalar: function () {
	
					var min = new Vector2();
					var max = new Vector2();
	
					return function clampScalar(minVal, maxVal) {
	
							min.set(minVal, minVal);
							max.set(maxVal, maxVal);
	
							return this.clamp(min, max);
					};
			}(),
	
			clampLength: function clampLength(min, max) {
	
					var length = this.length();
	
					return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
			},
	
			floor: function floor() {
	
					this.x = Math.floor(this.x);
					this.y = Math.floor(this.y);
	
					return this;
			},
	
			ceil: function ceil() {
	
					this.x = Math.ceil(this.x);
					this.y = Math.ceil(this.y);
	
					return this;
			},
	
			round: function round() {
	
					this.x = Math.round(this.x);
					this.y = Math.round(this.y);
	
					return this;
			},
	
			roundToZero: function roundToZero() {
	
					this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
					this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
	
					return this;
			},
	
			negate: function negate() {
	
					this.x = -this.x;
					this.y = -this.y;
	
					return this;
			},
	
			dot: function dot(v) {
	
					return this.x * v.x + this.y * v.y;
			},
	
			lengthSq: function lengthSq() {
	
					return this.x * this.x + this.y * this.y;
			},
	
			length: function length() {
	
					return Math.sqrt(this.x * this.x + this.y * this.y);
			},
	
			lengthManhattan: function lengthManhattan() {
	
					return Math.abs(this.x) + Math.abs(this.y);
			},
	
			normalize: function normalize() {
	
					return this.divideScalar(this.length() || 1);
			},
	
			angle: function angle() {
	
					// computes the angle in radians with respect to the positive x-axis
	
					var angle = Math.atan2(this.y, this.x);
	
					if (angle < 0) angle += 2 * Math.PI;
	
					return angle;
			},
	
			distanceTo: function distanceTo(v) {
	
					return Math.sqrt(this.distanceToSquared(v));
			},
	
			distanceToSquared: function distanceToSquared(v) {
	
					var dx = this.x - v.x,
					    dy = this.y - v.y;
					return dx * dx + dy * dy;
			},
	
			distanceToManhattan: function distanceToManhattan(v) {
	
					return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
			},
	
			setLength: function setLength(length) {
	
					return this.normalize().multiplyScalar(length);
			},
	
			lerp: function lerp(v, alpha) {
	
					this.x += (v.x - this.x) * alpha;
					this.y += (v.y - this.y) * alpha;
	
					return this;
			},
	
			lerpVectors: function lerpVectors(v1, v2, alpha) {
	
					return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
			},
	
			equals: function equals(v) {
	
					return v.x === this.x && v.y === this.y;
			},
	
			fromArray: function fromArray(array, offset) {
	
					if (offset === undefined) offset = 0;
	
					this.x = array[offset];
					this.y = array[offset + 1];
	
					return this;
			},
	
			toArray: function toArray(array, offset) {
	
					if (array === undefined) array = [];
					if (offset === undefined) offset = 0;
	
					array[offset] = this.x;
					array[offset + 1] = this.y;
	
					return array;
			},
	
			fromBufferAttribute: function fromBufferAttribute(attribute, index, offset) {
	
					if (offset !== undefined) {
	
							console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');
					}
	
					this.x = attribute.getX(index);
					this.y = attribute.getY(index);
	
					return this;
			},
	
			rotateAround: function rotateAround(center, angle) {
	
					var c = Math.cos(angle),
					    s = Math.sin(angle);
	
					var x = this.x - center.x;
					var y = this.y - center.y;
	
					this.x = x * c - y * s + center.x;
					this.y = x * s + y * c + center.y;
	
					return this;
			}
	
	});
	
	exports.Vector2 = Vector2;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "/* RESET*/\nhtml, body, div, ul, ol, li, dl, dt, dd, h1, h2, h3, h4, h5, h6, pre, form, p, blockquote, fieldset, input, abbr, article, aside, command, details, figcaption, figure, footer, header, hgroup, mark, meter, nav, output, progress, section, summary, time {\n  margin: 0;\n  padding: 0; }\n\nh1, h2, h3, h4, h5, h6, pre, code, address, caption, cite, code, em, strong, th, figcaption {\n  font-size: 1em;\n  font-weight: normal;\n  font-style: normal; }\n\nfieldset, iframe {\n  border: none; }\n\ncaption, th {\n  text-align: left; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\narticle, aside, footer, header, hgroup, nav, section, figure, figcaption {\n  display: block; }\n\n/* LAYOUT */\n* {\n  margin: 0;\n  padding: 0; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  position: relative; }\n\nhtml {\n  background-color: #fff; }\n\n.clear {\n  clear: both; }\n\n.clearer {\n  clear: both;\n  display: block;\n  margin: 0;\n  padding: 0;\n  height: 0;\n  line-height: 1px;\n  font-size: 1px; }\n\n.selfclear {\n  zoom: 1; }\n\n.selfclear:after {\n  content: '.';\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden; }\n\nimg {\n  border: 0; }\n\na {\n  text-decoration: none;\n  color: #515151; }\n  a:focus {\n    outline: none; }\n\ni {\n  font-style: normal; }\n\nul, li {\n  list-style: none; }\n\nbody {\n  font: 14px/1.5 'microsoft yahei';\n  color: #515151; }\n\n.clearfix:after, .clearfix:before {\n  content: \"\";\n  display: table;\n  height: 0px;\n  clear: both;\n  visibility: hidden; }\n\n.clearfix {\n  *zoom: 1; }\n\n.fl {\n  float: left; }\n\n.fr {\n  float: right; }\n\n.br0 {\n  border: none; }\n\n.key-color {\n  color: #333; }\n\n.maim-color {\n  color: #666; }\n\n.auxiliary-color {\n  color: #999; }\n", ""]);
	
	// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	
	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TWEEN = exports.Time = exports.TIME = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _tween = __webpack_require__(7);
	
	var _tween2 = _interopRequireDefault(_tween);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* 时间 */
	var TIME = {
		// 所有时间body对象
		bodys: [],
		delta: 16
	};
	
	var stop = false;
	var t;
	TIME.addBody = function (timeBody) {
		this.bodys.push(timeBody);
	};
	
	TIME.removeBody = function (timeBody) {
		var index = this.bodys.indexOf(timeBody);
	
		if (index !== -1) {
			this.bodys.splice(index, 1);
		}
	};
	TIME.tick = function () {
		var now = new Date().getTime();
		var last = now;
		var delta;
		return function () {
			delta = now - last;
			delta = delta > 500 ? 30 : delta < 16 ? 16 : delta;
			TIME.delta = delta;
			last = now;
	
			TIME.handleFrame(delta);
			if (!stop) {
				t = requestAnimationFrame(TIME.tick);
				// setTimeout(TIME.tick, 1000);
			}
		};
	}();
	
	TIME.start = function () {
		stop = false;
		cancelAnimationFrame(t);
		this.tick();
	};
	
	TIME.stop = function () {
		cancelAnimationFrame(t);
		stop = true;
	};
	
	TIME.handleFrame = function (delta) {
	
		TIME.bodys.forEach(function (body) {
			if (!body.isStop) {
				body.ticks.forEach(function (tick) {
					tick.fn && tick.fn(delta);
				});
			}
		});
	
		_tween2.default.update();
	};
	
	window.TIME = TIME;
	
	/* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
	
	var Time = function () {
		function Time() {
			_classCallCheck(this, Time);
	
			this.ticks = [];
			this.tweens = [];
			this.isStop = false;
			TIME.addBody(this);
		}
	
		/**
	  * 该物体灭亡
	  */
	
	
		_createClass(Time, [{
			key: 'destory',
			value: function destory() {
				TIME.removeBody(this);
			}
	
			/** 
	   * 帧更新
	   * @param timegap 与上一帧的时间间隔
	   */
	
		}, {
			key: 'addTick',
			value: function addTick(fn) {
				var tick = { 'fn': fn.bind(this) };
	
				tick.isStop = false;
				this.ticks.push(tick);
				return tick;
			}
		}, {
			key: 'removeTick',
			value: function removeTick(tick) {
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
	
		}, {
			key: 'addTween',
			value: function addTween(tween) {
				this.tweens.push(tween);
			}
		}, {
			key: 'removeTween',
			value: function removeTween(tween) {
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
	
		}, {
			key: 'stop',
			value: function stop() {
				this.isStop = true;
				this.tweens.forEach(function (tween) {
					tween.stop();
				});
			}
		}, {
			key: 'start',
			value: function start() {
				this.isStop = false;
				this.tweens.forEach(function (tween) {
					tween.start();
				});
			}
		}]);
	
		return Time;
	}();
	
	window.Time = Time;
	
	for (var i = 0; i < 10000; i += 100) {
		window['TIME_' + i] = window.env === 'develop' ? 0 : i;
	}
	
	exports.TIME = TIME;
	exports.Time = Time;
	exports.TWEEN = _tween2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Tween.js - Licensed under the MIT license
	 * https://github.com/tweenjs/tween.js
	 * ----------------------------------------------
	 *
	 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
	 * Thank you all, you're awesome!
	 */
	
	var TWEEN = TWEEN || function () {
	
		var _tweens = [];
	
		return {
	
			getAll: function getAll() {
	
				return _tweens;
			},
	
			removeAll: function removeAll() {
	
				_tweens = [];
			},
	
			add: function add(tween) {
	
				_tweens.push(tween);
			},
	
			remove: function remove(tween) {
	
				var i = _tweens.indexOf(tween);
	
				if (i !== -1) {
					_tweens.splice(i, 1);
				}
			},
	
			update: function update(time, preserve) {
	
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
	}();
	
	// Include a performance.now polyfill.
	// In node.js, use process.hrtime.
	if (typeof window === 'undefined' && typeof process !== 'undefined') {
		TWEEN.now = function () {
			var time = process.hrtime();
	
			// Convert [seconds, nanoseconds] to milliseconds.
			return time[0] * 1000 + time[1] / 1000000;
		};
	}
	// In a browser, use window.performance.now if it is available.
	else if (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {
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
	
				if (_valuesStart[property] instanceof Array === false) {
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
					if (typeof end === 'string') {
	
						if (end.charAt(0) === '+' || end.charAt(0) === '-') {
							end = start + parseFloat(end);
						} else {
							end = parseFloat(end);
						}
					}
	
					// Protect against non numeric properties.
					if (typeof end === 'number') {
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
	
						if (typeof _valuesEnd[property] === 'string') {
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
	
			None: function None(k) {
	
				return k;
			}
	
		},
	
		Quadratic: {
	
			In: function In(k) {
	
				return k * k;
			},
	
			Out: function Out(k) {
	
				return k * (2 - k);
			},
	
			InOut: function InOut(k) {
	
				if ((k *= 2) < 1) {
					return 0.5 * k * k;
				}
	
				return -0.5 * (--k * (k - 2) - 1);
			}
	
		},
	
		Cubic: {
	
			In: function In(k) {
	
				return k * k * k;
			},
	
			Out: function Out(k) {
	
				return --k * k * k + 1;
			},
	
			InOut: function InOut(k) {
	
				if ((k *= 2) < 1) {
					return 0.5 * k * k * k;
				}
	
				return 0.5 * ((k -= 2) * k * k + 2);
			}
	
		},
	
		Quartic: {
	
			In: function In(k) {
	
				return k * k * k * k;
			},
	
			Out: function Out(k) {
	
				return 1 - --k * k * k * k;
			},
	
			InOut: function InOut(k) {
	
				if ((k *= 2) < 1) {
					return 0.5 * k * k * k * k;
				}
	
				return -0.5 * ((k -= 2) * k * k * k - 2);
			}
	
		},
	
		Quintic: {
	
			In: function In(k) {
	
				return k * k * k * k * k;
			},
	
			Out: function Out(k) {
	
				return --k * k * k * k * k + 1;
			},
	
			InOut: function InOut(k) {
	
				if ((k *= 2) < 1) {
					return 0.5 * k * k * k * k * k;
				}
	
				return 0.5 * ((k -= 2) * k * k * k * k + 2);
			}
	
		},
	
		Sinusoidal: {
	
			In: function In(k) {
	
				return 1 - Math.cos(k * Math.PI / 2);
			},
	
			Out: function Out(k) {
	
				return Math.sin(k * Math.PI / 2);
			},
	
			InOut: function InOut(k) {
	
				return 0.5 * (1 - Math.cos(Math.PI * k));
			}
	
		},
	
		Exponential: {
	
			In: function In(k) {
	
				return k === 0 ? 0 : Math.pow(1024, k - 1);
			},
	
			Out: function Out(k) {
	
				return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
			},
	
			InOut: function InOut(k) {
	
				if (k === 0) {
					return 0;
				}
	
				if (k === 1) {
					return 1;
				}
	
				if ((k *= 2) < 1) {
					return 0.5 * Math.pow(1024, k - 1);
				}
	
				return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
			}
	
		},
	
		Circular: {
	
			In: function In(k) {
	
				return 1 - Math.sqrt(1 - k * k);
			},
	
			Out: function Out(k) {
	
				return Math.sqrt(1 - --k * k);
			},
	
			InOut: function InOut(k) {
	
				if ((k *= 2) < 1) {
					return -0.5 * (Math.sqrt(1 - k * k) - 1);
				}
	
				return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
			}
	
		},
	
		Elastic: {
	
			In: function In(k) {
	
				if (k === 0) {
					return 0;
				}
	
				if (k === 1) {
					return 1;
				}
	
				return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			},
	
			Out: function Out(k) {
	
				if (k === 0) {
					return 0;
				}
	
				if (k === 1) {
					return 1;
				}
	
				return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
			},
	
			InOut: function InOut(k) {
	
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
	
			In: function In(k) {
	
				var s = 1.70158;
	
				return k * k * ((s + 1) * k - s);
			},
	
			Out: function Out(k) {
	
				var s = 1.70158;
	
				return --k * k * ((s + 1) * k + s) + 1;
			},
	
			InOut: function InOut(k) {
	
				var s = 1.70158 * 1.525;
	
				if ((k *= 2) < 1) {
					return 0.5 * (k * k * ((s + 1) * k - s));
				}
	
				return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
			}
	
		},
	
		Bounce: {
	
			In: function In(k) {
	
				return 1 - TWEEN.Easing.Bounce.Out(1 - k);
			},
	
			Out: function Out(k) {
	
				if (k < 1 / 2.75) {
					return 7.5625 * k * k;
				} else if (k < 2 / 2.75) {
					return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
				} else if (k < 2.5 / 2.75) {
					return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
				} else {
					return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
				}
			},
	
			InOut: function InOut(k) {
	
				if (k < 0.5) {
					return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
				}
	
				return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
			}
	
		}
	
	};
	
	TWEEN.Interpolation = {
	
		Linear: function Linear(v, k) {
	
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
	
		Bezier: function Bezier(v, k) {
	
			var b = 0;
			var n = v.length - 1;
			var pw = Math.pow;
			var bn = TWEEN.Interpolation.Utils.Bernstein;
	
			for (var i = 0; i <= n; i++) {
				b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
			}
	
			return b;
		},
	
		CatmullRom: function CatmullRom(v, k) {
	
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
	
			Linear: function Linear(p0, p1, t) {
	
				return (p1 - p0) * t + p0;
			},
	
			Bernstein: function Bernstein(n, i) {
	
				var fc = TWEEN.Interpolation.Utils.Factorial;
	
				return fc(n) / fc(i) / fc(n - i);
			},
	
			Factorial: function () {
	
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
			}(),
	
			CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {
	
				var v0 = (p2 - p0) * 0.5;
				var v1 = (p3 - p1) * 0.5;
				var t2 = t * t;
				var t3 = t * t2;
	
				return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
			}
	
		}
	
	};
	
	// UMD (Universal Module Definition)
	(function (root) {
	
		if (true) {
	
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return TWEEN;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
	
			// Node.js
			module.exports = TWEEN;
		} else if (root !== undefined) {
	
			// Global variable
			root.TWEEN = TWEEN;
		}
	})(undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
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
	function defaultClearTimeout() {
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
	})();
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
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
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
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
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
	    while (len) {
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
	
	process.listeners = function (name) {
	    return [];
	};
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map