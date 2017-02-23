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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// import * as F3 from './f3/f3.js'
	
	var Point = function (_F3$Obj) {
	    _inherits(Point, _F3$Obj);
	
	    function Point() {
	        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
	
	        _classCallCheck(this, Point);
	
	        var _this = _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));
	
	        _this.radius = radius;
	        _this.color = 'rgba(' + [Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random()].join(',') + ')';
	        _this.prevCrood = null;
	        return _this;
	    }
	
	    _createClass(Point, [{
	        key: 'render',
	        value: function render(ctx) {
	            this.prevCrood = this.prevCrood || this.croods2D.position.clone();
	
	            // ctx.fillStyle = this.color;
	            // ctx.beginPath();
	
	
	            // console.log(
	            //     this.croods2D.position.x, 
	            //     this.croods2D.position.y,
	            //     this.radius * this.croods2D.scale + 1, 
	            //     this.radius * this.croods2D.scale + 1
	            // );
	
	            // if (this.croods2D.scale < 5)
	            /*ctx.fillStyle = '#fff'
	            ctx.fillRect(
	                this.croods2D.position.x, 
	                this.croods2D.position.y,
	                this.radius * this.croods2D.scale * this.yScale, 
	                this.radius * this.croods2D.scale * this.yScale
	            );*/
	
	            // ctx.beginPath();
	            ctx.moveTo(this.croods2D.position.x, this.croods2D.position.y);
	            ctx.arc(this.croods2D.position.x, this.croods2D.position.y, this.radius * this.croods2D.scale * this.yScale, 0, Math.PI * 2);
	            // ctx.fill();
	
	            // ctx.strokeStyle = this.color;
	            // ctx.lineWidth = this.radius * this.zScale;
	            // ctx.lineCap = "round";
	            // ctx.beginPath();
	            // ctx.moveTo(this.croods2D.position.x, this.croods2D.position.y);
	            // ctx.lineTo(this.prevCrood.x, this.prevCrood.y);
	            // ctx.stroke();
	            this.prevCrood = this.croods2D.position.clone();
	        }
	    }]);
	
	    return Point;
	}(F3.Obj);
	
	var Effect = function (_F3$Time) {
	    _inherits(Effect, _F3$Time);
	
	    function Effect(renderer, scene, cvs) {
	        _classCallCheck(this, Effect);
	
	        var _this2 = _possibleConstructorReturn(this, (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this));
	
	        _this2.renderer = renderer;
	        _this2.scene = scene;
	        _this2.cvs = cvs;
	
	        _this2.xOffset = 0;
	        _this2.waveHeight = 0.4; // 波高
	        _this2.waveWidth = 8; // 波长
	
	        _this2.col = 30;
	        _this2.colPointNum = 30;
	
	        _this2.flyTime = 3000;
	        _this2.timePass = 0;
	
	        _this2.pointGroup = new F3.Obj();
	        _this2.scene.add(_this2.pointGroup);
	
	        _this2.resize(cvs.width, cvs.height);
	        _this2.init();
	        return _this2;
	    }
	
	    _createClass(Effect, [{
	        key: 'resize',
	        value: function resize(width, height) {
	            this.cvs.width = width;
	            this.cvs.height = height;
	            // this.pointGroup.position.set(this.cvs.width/2, this.cvs.height, 0);
	            this.stepWidth = width * 1.8 / this.col;
	            this.pointGroup.setPosition(this.cvs.width / 2, this.cvs.height * 1.2, -this.col * this.stepWidth / 2);
	            this.pointGroup.setRotation(0.1, 0, 0);
	            // this.waveHeight = height/2;
	            // this.waveWidth = this.waveHeight * 4;
	            // console.log(this.stepWidth);
	        }
	    }, {
	        key: 'init',
	        value: function init() {
	            // create point
	            var point;
	            for (var x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
	                for (var z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {
	                    point = new Point(2);
	                    this.pointGroup.add(point);
	                    point.initPos = new F3.Vector3(x + Math.random() * -2 + 1, -20 + -10 * Math.random(), z + Math.random() * -2 + 1);
	                    point.flyDelay = Math.random() * 2000 | 0;
	                }
	            }
	        }
	    }, {
	        key: 'update',
	        value: function update(delta) {
	            this.timePass += delta;
	            this.xOffset = this.timePass / 2000;
	
	            var point = void 0;
	            var flyPecent = void 0;
	
	            for (var x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
	                for (var z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {
	
	                    var y = Math.cos(x * Math.PI / this.waveWidth + this.xOffset) * Math.sin(z * Math.PI / this.waveWidth + this.xOffset) * this.waveHeight;
	
	                    point = this.pointGroup.children[count];
	                    point.yScale = (-y + 0.6) / this.waveHeight * 1.5;
	
	                    flyPecent = (this.timePass - point.flyDelay) / this.flyTime;
	                    flyPecent = flyPecent > 1 ? 1 : flyPecent < 0 ? 0 : flyPecent;
	
	                    point.setPosition((x + (point.initPos.x - x) * (1 - flyPecent)) * this.stepWidth, (y + (point.initPos.y - y) * (1 - flyPecent)) * this.stepWidth, (z + (point.initPos.z - z) * (1 - flyPecent)) * this.stepWidth);
	                    count++;
	                }
	            }
	            if (this.timePass > this.flyTime) this.pointGroup.setRotation(this.pointGroup.rotation.x + 0.0000, this.pointGroup.rotation.y + 0.0002, this.pointGroup.rotation.z + 0.000);
	        }
	    }, {
	        key: 'animate',
	        value: function animate() {
	            var _this3 = this;
	
	            this.addTick(function (delta) {
	                _this3.update(delta);
	                _this3.renderer.render(_this3.scene);
	            });
	        }
	    }]);
	
	    return Effect;
	}(F3.Time);
	
	var EffectRander = function (_F3$Renderer) {
	    _inherits(EffectRander, _F3$Renderer);
	
	    function EffectRander(ctx, cvs) {
	        _classCallCheck(this, EffectRander);
	
	        return _possibleConstructorReturn(this, (EffectRander.__proto__ || Object.getPrototypeOf(EffectRander)).call(this, ctx, cvs));
	    }
	
	    _createClass(EffectRander, [{
	        key: 'beforeRender',
	        value: function beforeRender() {
	            _get(EffectRander.prototype.__proto__ || Object.getPrototypeOf(EffectRander.prototype), 'beforeRender', this).call(this);
	            this.ctx.beginPath();
	        }
	    }, {
	        key: 'afterRender',
	        value: function afterRender() {
	            this.ctx.fillStyle = "#fff";
	            this.ctx.fill();
	        }
	    }]);
	
	    return EffectRander;
	}(F3.Renderer);
	
	window.bannerInit = function (cvs) {
	    var ctx = cvs.getContext('2d');
	
	    var scene = new F3.Scene();
	    var renderer = new EffectRander(ctx, cvs);
	    var effect = new Effect(renderer, scene, cvs);
	    F3.perspective.origin = new F3.Vector3(cvs.width / 2, cvs.height / 1.6);
	    F3.perspective.p = 800;
	    effect.animate();
	
	    F3.TIME.start();
	};

/***/ }
/******/ ]);
//# sourceMappingURL=entry.js.map