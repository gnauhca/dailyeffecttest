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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _stats = __webpack_require__(1);
	
	var _stats2 = _interopRequireDefault(_stats);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var stats = new _stats2.default();
	document.body.appendChild(stats.dom);
	
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
	            // this.prevCrood = this.prevCrood || this.croods2D.position.clone();
	
	            // ctx.fillStyle = this.color;
	            // ctx.beginPath();
	
	
	            // console.log(
	            //     this.croods2D.position.x, 
	            //     this.croods2D.position.y,
	            //     this.radius * this.croods2D.scale + 1, 
	            //     this.radius * this.croods2D.scale + 1
	            // );
	
	            // if (this.croods2D.scale < 5)
	            ctx.fillStyle = '#fff';
	            // ctx.fillRect(this.croods2D.position.x, 
	            //     this.croods2D.position.y,1,1);
	            ctx.fillRect(this.croods2D.position.x, this.croods2D.position.y, this.radius * this.croods2D.scale * this.yScale, this.radius * this.croods2D.scale * this.yScale);
	
	            // ctx.beginPath();
	            // ctx.moveTo(
	            //     this.croods2D.position.x, 
	            //     this.croods2D.position.y
	            // );
	            // ctx.arc(
	            //     this.croods2D.position.x, 
	            //     this.croods2D.position.y, 
	            //     this.radius * this.croods2D.scale * this.yScale, 0, Math.PI * 2);
	            // ctx.fill();
	
	            // ctx.strokeStyle = '#fff'//this.color;
	            // ctx.lineWidth = this.radius * this.croods2D.scale// * this.zScale;
	            // ctx.lineCap = "round";
	            // ctx.beginPath();
	            // ctx.moveTo(this.croods2D.position.x, this.croods2D.position.y);
	            // ctx.lineTo(this.croods2D.position.x, this.croods2D.position.y);
	            // // ctx.lineTo(this.prevCrood.x, this.prevCrood.y);
	            // ctx.stroke();
	            // this.prevCrood = this.croods2D.position.clone();
	        }
	    }]);
	
	    return Point;
	}(F3.Obj);
	
	var Effect = function (_F3$Time) {
	    _inherits(Effect, _F3$Time);
	
	    function Effect(renderer, scene, camera, cvs) {
	        _classCallCheck(this, Effect);
	
	        var _this2 = _possibleConstructorReturn(this, (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this));
	
	        _this2.renderer = renderer;
	        _this2.scene = scene;
	        _this2.camera = camera;
	        _this2.cvs = cvs;
	
	        _this2.xOffset = 0;
	        _this2.waveHeight = 0.4; // 波高
	        _this2.waveWidth = 8; // 波长
	
	        _this2.col = 33;
	        _this2.colPointNum = 33;
	
	        _this2.flyTime = 2000;
	        _this2.timePass = 0;
	
	        _this2.scale = 1;
	        _this2.scaleStep = 0.01;
	
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
	                    point = new Point(10);
	                    this.pointGroup.add(point);
	                    /*point.initPos = new F3.Vector3(
	                         x + Math.random() * -2 + 1,
	                         -30 + -10 * Math.random(),
	                         z + Math.random() * -2 + 1
	                    );*/
	                    point.initPos = new F3.Vector3(0, 0, 0);
	                    point.flyDelay = 0; //Math.random() * 1000 | 0;
	                }
	            }
	        }
	    }, {
	        key: 'update',
	        value: function update(delta) {
	            this.timePass += delta;
	            this.xOffset = this.timePass / 500;
	
	            var point = void 0;
	            var flyPecent = void 0;
	
	            // if (this.timePass < 100)
	            for (var x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
	                for (var z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {
	
	                    // let y = Math.cos(x*Math.PI/this.waveWidth + this.xOffset)*Math.sin(z*Math.PI/this.waveWidth + this.xOffset) * this.waveHeight;
	
	                    var v = 2; //1 + (this.timePass % 1000)/1000; 
	                    var y = Math.sin(Math.sqrt(Math.pow(x / v, 2) + Math.pow(z / v, 2)) - this.xOffset) * 1;
	
	                    point = this.pointGroup.children[count];
	                    point.yScale = 1; //(-y + 0.6)/(this.waveHeight) * 1.5;
	
	                    flyPecent = (this.timePass - point.flyDelay) / this.flyTime;
	                    flyPecent = flyPecent > 1 ? 1 : flyPecent < 0 ? 0 : flyPecent;
	
	                    point.setPosition(x * this.stepWidth, y * this.stepWidth, z * this.stepWidth);
	                    count++;
	                }
	            }
	            // if (this.timePass > this.flyTime)
	            // this.pointGroup.setRotation(
	            //     this.pointGroup.rotation.x +0.0000,
	            //     this.pointGroup.rotation.y +0.001,
	            //     this.pointGroup.rotation.z +0.000   
	            // );
	        }
	    }, {
	        key: 'animate',
	        value: function animate() {
	            var _this3 = this;
	
	            this.addTick(function (delta) {
	                stats.update();
	                _this3.update(delta);
	                _this3.renderer.render(_this3.scene, _this3.camera);
	            });
	        }
	    }]);
	
	    return Effect;
	}(F3.Time);
	
	window.bannerInit = function (cvs) {
	    var ctx = cvs.getContext('2d');
	
	    var scene = new F3.Scene();
	    var camera = new F3.Camera();
	    camera.origin = new F3.Vector3(cvs.width / 2, cvs.height / 3);
	    camera.p = 800;
	
	    var renderer = new F3.Renderer(ctx, cvs);
	    var effect = new Effect(renderer, scene, camera, cvs);
	
	    effect.animate();
	
	    F3.TIME.start();
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// stats.js - http://github.com/mrdoob/stats.js
	(function (f, e) {
	  "object" === ( false ? "undefined" : _typeof(exports)) && "undefined" !== typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : f.Stats = e();
	})(undefined, function () {
	  var f = function f() {
	    function e(a) {
	      c.appendChild(a.dom);return a;
	    }function u(a) {
	      for (var d = 0; d < c.children.length; d++) {
	        c.children[d].style.display = d === a ? "block" : "none";
	      }l = a;
	    }var l = 0,
	        c = document.createElement("div");c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click", function (a) {
	      a.preventDefault();
	      u(++l % c.children.length);
	    }, !1);var k = (performance || Date).now(),
	        g = k,
	        a = 0,
	        r = e(new f.Panel("FPS", "#0ff", "#002")),
	        h = e(new f.Panel("MS", "#0f0", "#020"));if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201"));u(0);return { REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function begin() {
	        k = (performance || Date).now();
	      }, end: function end() {
	        a++;var c = (performance || Date).now();h.update(c - k, 200);if (c > g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {
	          var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
	        }return c;
	      }, update: function update() {
	        k = this.end();
	      }, domElement: c, setMode: u };
	  };f.Panel = function (e, f, l) {
	    var c = Infinity,
	        k = 0,
	        g = Math.round,
	        a = g(window.devicePixelRatio || 1),
	        r = 80 * a,
	        h = 48 * a,
	        t = 3 * a,
	        v = 2 * a,
	        d = 3 * a,
	        m = 15 * a,
	        n = 74 * a,
	        p = 30 * a,
	        q = document.createElement("canvas");q.width = r;q.height = h;q.style.cssText = "width:80px;height:48px";var b = q.getContext("2d");b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";b.textBaseline = "top";b.fillStyle = l;b.fillRect(0, 0, r, h);b.fillStyle = f;b.fillText(e, t, v);
	    b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function update(h, w) {
	        c = Math.min(c, h);k = Math.max(k, h);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = f;b.fillText(g(h) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, g((1 - h / w) * p));
	      } };
	  };return f;
	});

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map