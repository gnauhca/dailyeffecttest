(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["IosSelector"] = factory();
	else
		root["IosSelector"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
__webpack_require__(1);
// import { assign, assignIn } from 'lodash';

const easing = {
  easeOutCubic: function(pos) {
    return (Math.pow((pos-1), 3) +1);
  },
  easeOutQuart: function(pos) {
    return -(Math.pow((pos-1), 4) -1);
  },
};

class IosSelector {
  constructor(options) {
    let defaults = {
      el: '', // dom 
      type: 'infinite', // infinite 无限滚动，normal 非无限 
      count: 20, // 圆环规格，圆环上选项个数，必须设置 4 的倍数
      sensitivity: 0.8, // 灵敏度
      source: [], // 选项 {value: xx, text: xx}
      value: null,
      onChange: null
    };

    this.options = Object.assign({}, defaults, options);
    this.options.count =  this.options.count - this.options.count % 4;
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 10; // 滚动减速度
    this.minV = Math.sqrt(1 / this.a); // 最小初速度
    this.selected = this.source[0];

    this.exceedA = 10; // 超出减速 
    this.moveT = 0; // 滚动 tick
    this.moving = false;

    this.elems = {
      el: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null, // list

      highlight: null,
      highlightList: null,
      highListItems: null // list
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null
    };

    this.itemHeight = this.elems.el.offsetHeight * 3 / this.options.count; // 每项高度
    this.itemAngle = 360 / this.options.count; // 每项之间旋转度数
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180); // 圆环半径 

    this.scroll = 0; // 单位为一个 item 的高度（度数）
    this._init();
  }

  _init() {
    this._create(this.options.source);

    let touchData = {
      startY: 0,
      yArr: []
    };

    for (let eventName in this.events) {
      this.events[eventName] = ((eventName) => {
        return (e) => {
          if (this.elems.el.contains(e.target) || e.target === this.elems.el) {
            e.preventDefault();
            if (this.source.length) {
              this['_' + eventName](e, touchData);
            }
          }
        };
      })(eventName);
    }

    document.addEventListener('touchstart', this.events.touchstart);
    // document.addEventListener('touchmove', this.events.touchmove);
    document.addEventListener('touchend', this.events.touchend);
    if (this.source.length) {
      this.value = this.value !== null ? this.value : this.source[0].value;
      this.select(this.value);
    }
  }

  _touchstart(e, touchData) {
    console.log(e);
    document.addEventListener('touchmove', this.events.touchmove);
    touchData.startY = e.touches[0].clientY;
    touchData.yArr = [[e.touches[0].clientY, new Date().getTime()]];
    touchData.touchScroll = this.scroll;
    this._stop();

    console.log('start');
  }

  _touchmove(e, touchData) {
    touchData.yArr.push([e.touches[0].clientY, new Date().getTime()]);
    if (touchData.length > 5) {
      touchData.unshift();
    }

    let scrollAdd = (touchData.startY - e.touches[0].clientY) / this.itemHeight;
    let moveToScroll = scrollAdd + this.scroll;

    // 非无限滚动时，超出范围使滚动变得困难
    if (this.type === 'normal') {
      if (moveToScroll < 0) {
        moveToScroll *= 0.3;
      } else if (moveToScroll > this.source.length) {
        moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
      }
      console.log(moveToScroll);
    } else {
      moveToScroll = this._normalizeScroll(moveToScroll);
    }

    touchData.touchScroll = this._moveTo(moveToScroll);
  }

  _touchend(e, touchData) {
    // console.log(e);
    document.removeEventListener('touchmove', this.events.touchmove);

    let v;

    if (touchData.yArr.length === 1) {
      v = 0;
    } else {
      let startTime = touchData.yArr[touchData.yArr.length - 2][1];
      let endTime = touchData.yArr[touchData.yArr.length - 1][1];
      let startY = touchData.yArr[touchData.yArr.length - 2][0];
      let endY = touchData.yArr[touchData.yArr.length - 1][0];

      // 计算速度
      v = ((startY - endY) / this.itemHeight) * 1000 / (endTime - startTime);
      let sign = v > 0 ? 1 : -1;

      v = Math.abs(v) > 30 ? 30 * sign : v;
    }

    this.scroll = touchData.touchScroll;
    this._animateMoveByInitV(v);

    // console.log('end');
  }

  _create(source) {

    if (!source.length) {
      return;
    }

    let template = `
      <div class="select-wrap">
        <ul class="select-options" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
          {{circleListHTML}}
          <!-- <li class="select-option">a0</li> -->
        </ul>
        <div class="highlight">
          <ul class="highlight-list">
            <!-- <li class="highlight-item"></li> -->
            {{highListHTML}}
          </ul>
        </div>
      </div>
    `;

    // source 处理
    if (this.options.type === 'infinite') {
      let concatSource = [].concat(source);
      while (concatSource.length < this.halfCount) {
        concatSource = concatSource.concat(source);
      }
      source = concatSource;
    }
    this.source = source;
    let sourceLength = source.length;

    // 圆环 HTML
    let circleListHTML = '';
    for (let i = 0; i < source.length; i++) {
      circleListHTML += `<li class="select-option"
                    style="
                      top: ${this.itemHeight * -0.5}px;
                      height: ${this.itemHeight}px;
                      line-height: ${this.itemHeight}px;
                      transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
                    "
                    data-index="${i}"
                    >${source[i].text}</li>`
    }

    // 中间高亮 HTML
    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`
    }


    if (this.options.type === 'infinite') {

      // 圆环头尾
      for (let i = 0; i < this.quarterCount; i++) {
        // 头
        circleListHTML = `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${-i - 1}"
                      >${source[sourceLength - i - 1].text}</li>` + circleListHTML;
        // 尾
        circleListHTML += `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${i + sourceLength}"
                      >${source[i].text}</li>`;
      }

      // 高亮头尾
      highListHTML = `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                          ${source[sourceLength - 1].text}
                      </li>` + highListHTML;
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`
    }

    this.elems.el.innerHTML = template
                                .replace('{{circleListHTML}}', circleListHTML)
                                .replace('{{highListHTML}}', highListHTML);
    this.elems.circleList = this.elems.el.querySelector('.select-options');
    this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');


    this.elems.highlight = this.elems.el.querySelector('.highlight');
    this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
    this.elems.highlightitems = this.elems.el.querySelectorAll('.highlight-item');

    if (this.type === 'infinite') {
      this.elems.highlightList.style.top = -this.itemHeight + 'px';
    }

    this.elems.highlight.style.height = this.itemHeight + 'px';
    this.elems.highlight.style.lineHeight = this.itemHeight + 'px';

  }

  /**
   * 对 scroll 取模，eg source.length = 5 scroll = 6.1 
   * 取模之后 normalizedScroll = 1.1
   * @param {init} scroll 
   * @return 取模之后的 normalizedScroll
   */
  _normalizeScroll(scroll) {
    let normalizedScroll = scroll;

    while(normalizedScroll < 0) {
      normalizedScroll += this.source.length;
    }
    normalizedScroll = normalizedScroll % this.source.length;
    return normalizedScroll;
  }

  /**
   * 定位到 scroll，无动画
   * @param {init} scroll 
   * @return 返回指定 normalize 之后的 scroll
   */
  _moveTo(scroll) {
    if (this.type === 'infinite') {
      scroll = this._normalizeScroll(scroll);
    }
    this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    this.elems.highlightList.style.transform = `translate3d(0, ${-(scroll) * this.itemHeight}px, 0)`;

    [...this.elems.circleItems].forEach(itemElem => {
      if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
        itemElem.style.visibility = 'hidden';
      } else {
        itemElem.style.visibility = 'visible';
      }
    });

    // console.log(scroll);
    // console.log(`translate3d(0, 0, ${-this.radius}px) rotateX(${-this.itemAngle * scroll}deg)`);
    return scroll;
  }

  /**
   * 以初速度 initV 滚动
   * @param {init} initV， initV 会被重置
   * 以根据加速度确保滚动到整数 scroll (保证能通过 scroll 定位到一个选中值)
   */
  async _animateMoveByInitV(initV) {

    // console.log(initV);

    let initScroll;
    let finalScroll;
    let finalV;

    let totalScrollLen;
    let a;
    let t;

    if (this.type === 'normal') {

      if (this.scroll < 0 || this.scroll > this.source.length - 1) {
        a = this.exceedA;
        initScroll = this.scroll;
        finalScroll = this.scroll < 0 ? 0 : this.source.length - 1;
        totalScrollLen = initScroll - finalScroll;

        t = Math.sqrt(Math.abs(totalScrollLen / a));
        initV = a * t;
        initV = this.scroll > 0 ? -initV : initV;
        finalV = 0;
        await this._animateToScroll(initScroll, finalScroll, t);
      } else {
        initScroll = this.scroll;
        a = initV > 0 ? -this.a : this.a; // 减速加速度
        t = Math.abs(initV / a); // 速度减到 0 花费时间
        totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
        finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数
        finalScroll = finalScroll < 0 ? 0 : (finalScroll > this.source.length - 1 ? this.source.length - 1 : finalScroll);

        totalScrollLen = finalScroll - initScroll;
        t = Math.sqrt(Math.abs(totalScrollLen / a));
        await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
      }

    } else {
      initScroll = this.scroll;

      a = initV > 0 ? -this.a : this.a; // 减速加速度
      t = Math.abs(initV / a); // 速度减到 0 花费时间
      totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
      finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数
      await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
    }

    // await this._animateToScroll(this.scroll, finalScroll, initV, 0);
    
    this._selectByScroll(this.scroll);
  }

  _animateToScroll(initScroll, finalScroll, t, easingName = 'easeOutQuart') {
    if (initScroll === finalScroll || t === 0) {
      this._moveTo(initScroll);
      return;
    }

    let start = new Date().getTime() / 1000;
    let pass = 0;
    let totalScrollLen = finalScroll - initScroll;
    
    // console.log(initScroll, finalScroll, initV, finalV, a);
    return new Promise((resolve, reject) => {
      this.moving = true;
      let tick = () => {
        pass = new Date().getTime() / 1000 - start;

        if (pass < t) {
          this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
          this.moveT = requestAnimationFrame(tick);
        } else {
          resolve();
          this._stop();
          this.scroll = this._moveTo(initScroll + totalScrollLen);
        }
      };
      tick();
    });
  }

  _stop() {
    this.moving = false;
    cancelAnimationFrame(this.moveT);
  }

  _selectByScroll(scroll) {
    scroll = this._normalizeScroll(scroll) | 0;
    this.selected = this.source[scroll];
    this.value = this.selected.value;
    this.onChange && this.onChange(this.selected);
  }

  updateSource(source) {
    this._create(source);

    if (
      !this.source.find(item => item.value === this.value) || 
      !this.moving
    ) {
      this.value = this.value !== null ? this.value : this.source[0].value;
      this.select(this.value);
    }
  }

  select(value) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].value === value) {
        window.cancelAnimationFrame(this.moveT);
        // this.scroll = this._moveTo(i);
        let initScroll = this._normalizeScroll(this.scroll);
        let finalScroll = i;
        let t = Math.sqrt(Math.abs((finalScroll -  initScroll) / this.a));
        this._animateToScroll(initScroll, finalScroll, t);
        setTimeout(() => this._selectByScroll(i));
        return;
      }
    }
    throw new Error(`can not select value: ${value}, ${value} match nothing in current source`);
  }

  destroy() {
    this._stop();
    // document 事件解绑
    for (let eventName in this.events) {
      document.removeEventListener('eventName', this.events[eventName]);
    }
    // 元素移除
    this.elems.el.innerHTML = '';
    this.elems = null;
  }
}


/* harmony default export */ __webpack_exports__["default"] = (IosSelector);




/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/* RESET*/\nhtml,\nbody,\ndiv,\nul,\nol,\nli,\ndl,\ndt,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\npre,\nform,\np,\nblockquote,\nfieldset,\ninput,\nabbr,\narticle,\naside,\ncommand,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmark,\nmeter,\nnav,\noutput,\nprogress,\nsection,\nsummary,\ntime {\n  margin: 0;\n  padding: 0; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\npre,\ncode,\naddress,\ncaption,\ncite,\ncode,\nem,\nstrong,\nth,\nfigcaption {\n  font-size: 1em;\n  font-weight: normal;\n  font-style: normal; }\n\nfieldset,\niframe {\n  border: none; }\n\ncaption,\nth {\n  text-align: left; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\narticle,\naside,\nfooter,\nheader,\nhgroup,\nnav,\nsection,\nfigure,\nfigcaption {\n  display: block; }\n\n/* LAYOUT */\n* {\n  margin: 0;\n  padding: 0; }\n\nhtml,\nbody {\n  width: 100%;\n  height: 100%;\n  position: relative; }\n\nhtml {\n  background-color: #fff; }\n\n.clear {\n  clear: both; }\n\n.clearer {\n  clear: both;\n  display: block;\n  margin: 0;\n  padding: 0;\n  height: 0;\n  line-height: 1px;\n  font-size: 1px; }\n\n.selfclear {\n  zoom: 1; }\n\n.selfclear:after {\n  content: '.';\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden; }\n\nimg {\n  border: 0; }\n\na {\n  text-decoration: none;\n  color: #515151; }\n  a:focus {\n    outline: none; }\n\ni {\n  font-style: normal; }\n\nul,\nli {\n  list-style: none; }\n\nbody {\n  font: 14px/1.5;\n  font-family: Arial, \"Hiragino Sans GB\", 冬青黑, \"Microsoft YaHei\", 微软雅黑, SimSun, 宋体, Helvetica, Tahoma, \"Arial sans-serif\";\n  color: #515151; }\n\n.clearfix:after,\n.clearfix:before {\n  content: \"\";\n  display: table;\n  height: 0px;\n  clear: both;\n  visibility: hidden; }\n\n.clearfix {\n  *zoom: 1; }\n\n.fl {\n  float: left; }\n\n.fr {\n  float: right; }\n\n.br0 {\n  border: none; }\n\n.key-color {\n  color: #333; }\n\n.maim-color {\n  color: #666; }\n\n.auxiliary-color {\n  color: #999; }\n\n.select-wrap {\n  position: relative;\n  height: 100%;\n  text-align: center;\n  overflow: hidden;\n  font-size: 20px; }\n  .select-wrap:before, .select-wrap:after {\n    position: absolute;\n    z-index: 1;\n    display: block;\n    content: '';\n    width: 100%;\n    height: 50%; }\n  .select-wrap:before {\n    top: 0;\n    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)); }\n  .select-wrap:after {\n    bottom: 0;\n    background-image: linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)); }\n  .select-wrap .select-options {\n    position: absolute;\n    top: 50%;\n    left: 0;\n    width: 100%;\n    height: 0;\n    transform-style: preserve-3d;\n    margin: 0 auto;\n    display: block;\n    transform: translateZ(-150px) rotateX(0deg);\n    -webkit-font-smoothing: subpixel-antialiased;\n    color: #666; }\n    .select-wrap .select-options .select-option {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 50px;\n      -webkit-font-smoothing: subpixel-antialiased; }\n      .select-wrap .select-options .select-option:nth-child(1) {\n        transform: rotateX(0deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(2) {\n        transform: rotateX(-18deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(3) {\n        transform: rotateX(-36deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(4) {\n        transform: rotateX(-54deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(5) {\n        transform: rotateX(-72deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(6) {\n        transform: rotateX(-90deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(7) {\n        transform: rotateX(-108deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(8) {\n        transform: rotateX(-126deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(9) {\n        transform: rotateX(-144deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(10) {\n        transform: rotateX(-162deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(11) {\n        transform: rotateX(-180deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(12) {\n        transform: rotateX(-198deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(13) {\n        transform: rotateX(-216deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(14) {\n        transform: rotateX(-234deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(15) {\n        transform: rotateX(-252deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(16) {\n        transform: rotateX(-270deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(17) {\n        transform: rotateX(-288deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(18) {\n        transform: rotateX(-306deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(19) {\n        transform: rotateX(-324deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(20) {\n        transform: rotateX(-342deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(21) {\n        transform: rotateX(-360deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(22) {\n        transform: rotateX(-378deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(23) {\n        transform: rotateX(-396deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(24) {\n        transform: rotateX(-414deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(25) {\n        transform: rotateX(-432deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(26) {\n        transform: rotateX(-450deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(27) {\n        transform: rotateX(-468deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(28) {\n        transform: rotateX(-486deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(29) {\n        transform: rotateX(-504deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(30) {\n        transform: rotateX(-522deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(31) {\n        transform: rotateX(-540deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(32) {\n        transform: rotateX(-558deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(33) {\n        transform: rotateX(-576deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(34) {\n        transform: rotateX(-594deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(35) {\n        transform: rotateX(-612deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(36) {\n        transform: rotateX(-630deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(37) {\n        transform: rotateX(-648deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(38) {\n        transform: rotateX(-666deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(39) {\n        transform: rotateX(-684deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(40) {\n        transform: rotateX(-702deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(41) {\n        transform: rotateX(-720deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(42) {\n        transform: rotateX(-738deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(43) {\n        transform: rotateX(-756deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(44) {\n        transform: rotateX(-774deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(45) {\n        transform: rotateX(-792deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(46) {\n        transform: rotateX(-810deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(47) {\n        transform: rotateX(-828deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(48) {\n        transform: rotateX(-846deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(49) {\n        transform: rotateX(-864deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(50) {\n        transform: rotateX(-882deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(51) {\n        transform: rotateX(-900deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(52) {\n        transform: rotateX(-918deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(53) {\n        transform: rotateX(-936deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(54) {\n        transform: rotateX(-954deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(55) {\n        transform: rotateX(-972deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(56) {\n        transform: rotateX(-990deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(57) {\n        transform: rotateX(-1008deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(58) {\n        transform: rotateX(-1026deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(59) {\n        transform: rotateX(-1044deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(60) {\n        transform: rotateX(-1062deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(61) {\n        transform: rotateX(-1080deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(62) {\n        transform: rotateX(-1098deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(63) {\n        transform: rotateX(-1116deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(64) {\n        transform: rotateX(-1134deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(65) {\n        transform: rotateX(-1152deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(66) {\n        transform: rotateX(-1170deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(67) {\n        transform: rotateX(-1188deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(68) {\n        transform: rotateX(-1206deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(69) {\n        transform: rotateX(-1224deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(70) {\n        transform: rotateX(-1242deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(71) {\n        transform: rotateX(-1260deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(72) {\n        transform: rotateX(-1278deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(73) {\n        transform: rotateX(-1296deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(74) {\n        transform: rotateX(-1314deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(75) {\n        transform: rotateX(-1332deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(76) {\n        transform: rotateX(-1350deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(77) {\n        transform: rotateX(-1368deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(78) {\n        transform: rotateX(-1386deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(79) {\n        transform: rotateX(-1404deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(80) {\n        transform: rotateX(-1422deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(81) {\n        transform: rotateX(-1440deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(82) {\n        transform: rotateX(-1458deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(83) {\n        transform: rotateX(-1476deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(84) {\n        transform: rotateX(-1494deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(85) {\n        transform: rotateX(-1512deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(86) {\n        transform: rotateX(-1530deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(87) {\n        transform: rotateX(-1548deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(88) {\n        transform: rotateX(-1566deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(89) {\n        transform: rotateX(-1584deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(90) {\n        transform: rotateX(-1602deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(91) {\n        transform: rotateX(-1620deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(92) {\n        transform: rotateX(-1638deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(93) {\n        transform: rotateX(-1656deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(94) {\n        transform: rotateX(-1674deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(95) {\n        transform: rotateX(-1692deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(96) {\n        transform: rotateX(-1710deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(97) {\n        transform: rotateX(-1728deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(98) {\n        transform: rotateX(-1746deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(99) {\n        transform: rotateX(-1764deg) translateZ(150px); }\n      .select-wrap .select-options .select-option:nth-child(100) {\n        transform: rotateX(-1782deg) translateZ(150px); }\n\n.highlight {\n  position: absolute;\n  top: 50%;\n  transform: translate(0, -50%);\n  width: 100%;\n  background-color: #fff;\n  border-top: 1px solid #ddd;\n  border-bottom: 1px solid #ddd;\n  font-size: 24px;\n  overflow: hidden; }\n\n.highlight-list {\n  position: absolute;\n  width: 100%; }\n\n/* date */\n.date-selector {\n  display: flex;\n  align-items: stretch;\n  justify-content: space-between;\n  height: 300px; }\n  .date-selector > div {\n    flex: 1; }\n  .date-selector .select-wrap {\n    font-size: 18px; }\n  .date-selector .highlight {\n    font-size: 20px; }\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
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

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

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

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=index.js.map