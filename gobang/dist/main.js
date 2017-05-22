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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_widget_js__ = __webpack_require__(37);


class Widget extends __WEBPACK_IMPORTED_MODULE_0__base_view_widget_js__["a" /* default */] {

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Widget;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Actor {
    constructor(stage, widget) {
        this.stage = stage;
        this.widget = widget;
        this.widgetData;
        this.resetData;
        this.stageDispatchHandlers = this.handleStageDispatch();
        this.widgetEventHandlers = this.handleWidgetEvent();
    }

    init() {
        this.widget.init();
        for (let eventName in this.widgetEventHandlers) {
            this.widget.addEventListener(eventName, this.widgetEventHandlers[eventName]);
        }
    }

    handleStageDispatch() {
        // 重写此方法，返回包含多个消息处理函数的对象，用于处理 stage 对 actor 发出的消息
        return {};
    }


    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {}
    }

    // 向 stage 发送消息
    broadcast(msg, data) {
        this.stage.actorBroadcastHandlers[msg] && this.stage.actorBroadcastHandlers[msg](data);
    }

    makeWidgetData(actorResetData) {
        // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
        return actorResetData;
    }

    reset(actorResetData) {
        this.resetData = actorResetData;
        // 重置，在 stage 离开时，需要重置持久(生命周期与stage想同)的 actor
        this.widget.setData(this.makeWidgetData(actorResetData));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actor;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Stage {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isInit = false;
        this.active = false;
        this.activateData;

        this.actors = [];
        this.actorBroadcastHandlers = this.handleActorBroadcast();
        this.actorFactory;
    }

    init() {

        let ActorConstructors = this.createActorConstructors();
        this.actorFactory = {
            constructors: ActorConstructors,
            getActor: (name)=>{
                // console.log(name);
                return ( new ActorConstructors[name](this, this.view.createWidget(name)) );
            }
        }
    }

    createActorConstructors() {
        // 重写此方法，返回包含本 stage 要用到的所有 Actor 构造函数，用于按需创建 actor
    }

    createActor(name, ...initArgs) {
        // 创建舞台演员
        let actor = this.actorFactory.getActor(name);

        actor.name = name;
        actor.id = 'actor_' + (new Date).getTime() + (Math.random() * 1000000)|0;
        this.actors.push(actor);
        actor.init(...initArgs);

        return actor;
    }


    handleActorBroadcast() {
        // 重写此方法，返回包含多个消息处理函数的对象，用于处理 actor 对 stage 发出的消息
        return {};
    }

    // 向当前 stage 所有的 actor 发送消息
    dispatch(msg, data) {
        this.actors.forEach(
            a=>a.stageDispatchHandlers[msg] && a.stageDispatchHandlers[msg](data)
        );
    }

    getActorResetDatas(activateData) {
        return {};
    }

    _activate(data) {
        this.active = true;
        // 首次激活需要初始化
        if (!this.isInit) {
            this.isInit = true;
            this.view.init();
            this.init();
            // return false; 
        }
        this.activateData = data;

        let actorResetDatas = this.getActorResetDatas(this.activateData);

        this.actors.forEach(w=>w.reset(actorResetDatas[w.name]));
        this.activate(data);
        this.view && this.view.show();
    }

    activate() {
        // 重写此方法，激活之后的操作，在视图显示之前
    }

    _inactivate() {
        this.active = false;
        this.view && this.view.hide();

        this.inactivate();
    }

    inactivate() {
        // 重写此方法，离开之后的操作，在视图消失之后
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stage;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_page_js__ = __webpack_require__(35);


class Page extends __WEBPACK_IMPORTED_MODULE_0__base_view_page_js__["a" /* default */] {
    constructor(elem) {
        super();
        this.elem = elem;
    }
    show() {
        this.elem.classList.add("show");
    }
    hide() {
        this.elem.classList.remove("show");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Page;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return globalData; });
/* unused harmony export clearGlobalData */
var globalData;
var initData = {
    player1: {
        avatar: null,
    },
    player2: {
        avatar: null,
    }
};

if (window.localStorage.gobang) {
    globalData = window.localStorage.gobang;
} else {
    clearGlobalData();
}

function clearGlobalData() {
    globalData = JSON.parse(JSON.stringify(initData));
}



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_stage_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gate_gate_stage_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__play_play_stage_js__ = __webpack_require__(30);





class Game {
    constructor(view) {
        
        this.stages = {};
        this.currentStage = null;

        this.view = view;
    }

    init() {
        let avatar = new __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_stage_js__["a" /* default */](this, this.view.pages.avatar);
        let gate = new __WEBPACK_IMPORTED_MODULE_2__gate_gate_stage_js__["a" /* default */](this, this.view.pages.gate);
        let play = new __WEBPACK_IMPORTED_MODULE_3__play_play_stage_js__["a" /* default */](this, this.view.pages.play);

        this.view.init();
        this.stages = {avatar, gate, play};
    }

    start() {
        /* test*/
        this.goToStage('play', {time: 5, mode: 'duet'}); return;

        // console.log(globalData);
        if (!!__WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player1.avatar) {
            // 首次游戏，设置头像
            this.goToStage('avatar');
        } else {
            this.goToStage('gate');
        }
    }

    exit() {

    }

    goToStage(name, data) {
        if (this.currentStage) {
            this.currentStage._inactivate();
        }
        
        this.currentStage = this.stages[name];
        this.currentStage._activate(data);
    }
}


/* harmony default export */ __webpack_exports__["a"] = (Game);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_view_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_page_js__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gate_gate_page_js__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__play_play_page_js__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_Src_css_style_scss__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_Src_css_style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_Src_css_style_scss__);






class View extends __WEBPACK_IMPORTED_MODULE_0__base_view_view_js__["a" /* default */] {
    constructor() {
        super();
        this.pages = {};
    }
    init() {
        let avatarElem = document.querySelector('#avatar');
        let gateElem = document.querySelector('#gate');
        let playElem = document.querySelector('#play');
        let avatar = new __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_page_js__["a" /* default */](avatarElem);
        let gate = new __WEBPACK_IMPORTED_MODULE_2__gate_gate_page_js__["a" /* default */](gateElem);
        let play = new __WEBPACK_IMPORTED_MODULE_3__play_play_page_js__["a" /* default */](playElem);

        this.pages = {avatar, gate, play};
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = View;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)();
// imports


// module
exports.push([module.i, "/* RESET*/\nhtml, body, div, ul, ol, li, dl, dt, dd, h1, h2, h3, h4, h5, h6, pre, form, p, blockquote, fieldset, input, abbr, article, aside, command, details, figcaption, figure, footer, header, hgroup, mark, meter, nav, output, progress, section, summary, time {\n  margin: 0;\n  padding: 0; }\n\nh1, h2, h3, h4, h5, h6, pre, code, address, caption, cite, code, em, strong, th, figcaption {\n  font-size: 1em;\n  font-weight: normal;\n  font-style: normal; }\n\nfieldset, iframe {\n  border: none; }\n\ncaption, th {\n  text-align: left; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\narticle, aside, footer, header, hgroup, nav, section, figure, figcaption {\n  display: block; }\n\n/* LAYOUT */\n* {\n  margin: 0;\n  padding: 0; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  position: relative; }\n\nhtml {\n  background-color: #fff; }\n\n.clear {\n  clear: both; }\n\n.clearer {\n  clear: both;\n  display: block;\n  margin: 0;\n  padding: 0;\n  height: 0;\n  line-height: 1px;\n  font-size: 1px; }\n\n.selfclear {\n  zoom: 1; }\n\n.selfclear:after {\n  content: '.';\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden; }\n\nimg {\n  border: 0; }\n\na {\n  text-decoration: none;\n  color: #515151; }\n  a:focus {\n    outline: none; }\n\ni {\n  font-style: normal; }\n\nul, li {\n  list-style: none; }\n\nbody {\n  font: 14px/1.5 'microsoft yahei';\n  color: #515151; }\n\n.clearfix:after, .clearfix:before {\n  content: \"\";\n  display: table;\n  height: 0px;\n  clear: both;\n  visibility: hidden; }\n\n.clearfix {\n  *zoom: 1; }\n\n.fl {\n  float: left; }\n\n.fr {\n  float: right; }\n\n.br0 {\n  border: none; }\n\n.key-color {\n  color: #333; }\n\n.maim-color {\n  color: #666; }\n\n.auxiliary-color {\n  color: #999; }\n\n.container {\n  width: 1368px;\n  height: 768px;\n  background: url(" + __webpack_require__(15) + ") no-repeat;\n  background-size: 100%; }\n\n.pic {\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: 100%; }\n\n.pointer {\n  cursor: pointer; }\n\n.show {\n  display: block !important; }\n\n.page {\n  display: none; }\n\n.page.show {\n  display: block; }\n\n.avatars {\n  display: flex;\n  width: 50%; }\n  .avatars .avatar {\n    width: 100px;\n    height: 100px; }\n    .avatars .avatar.selected {\n      box-shadow: inset 2px 2px 2px #666; }\n  .avatars .avatar-1-1 {\n    background-image: url(" + __webpack_require__(9) + "); }\n  .avatars .avatar-1-2 {\n    background-image: url(" + __webpack_require__(10) + "); }\n  .avatars .avatar-1-3 {\n    background-image: url(" + __webpack_require__(11) + "); }\n  .avatars .avatar-2-1 {\n    background-image: url(" + __webpack_require__(12) + "); }\n  .avatars .avatar-2-2 {\n    background-image: url(" + __webpack_require__(13) + "); }\n  .avatars .avatar-2-3 {\n    background-image: url(" + __webpack_require__(14) + "); }\n\n.options {\n  display: flex;\n  justify-content: space-around;\n  width: 400px;\n  height: 100px; }\n  .options .option {\n    width: 100px;\n    height: 50px;\n    line-height: 50px;\n    text-align: center;\n    outline: 1px solid #666; }\n    .options .option.selected {\n      box-shadow: inset 2px 2px 2px #666; }\n\n#play .confirm {\n  display: none; }\n\n#play .chessboard {\n  position: absolute;\n  left: 50%;\n  top: 3%;\n  transform: translate(-50%, 0);\n  display: flex;\n  flex-wrap: wrap;\n  width: 600px;\n  padding: 40px;\n  background: url(" + __webpack_require__(18) + ") center no-repeat;\n  background-size: 100%; }\n  #play .chessboard .square {\n    width: 40px;\n    height: 40px; }\n    #play .chessboard .square, #play .chessboard .square i {\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 100%;\n      cursor: pointer; }\n    #play .chessboard .square i {\n      display: block;\n      width: 100%;\n      height: 100%; }\n    #play .chessboard .square.black i {\n      background-image: url(" + __webpack_require__(17) + "); }\n    #play .chessboard .square.white i {\n      background-image: url(" + __webpack_require__(20) + "); }\n  #play .chessboard.playing-black .square:hover {\n    background-image: url(" + __webpack_require__(16) + "); }\n  #play .chessboard.playing-white .square:hover {\n    background-image: url(" + __webpack_require__(19) + "); }\n  #play .chessboard.playing-black .white:hover, #play .chessboard.playing-black .black:hover {\n    background: none; }\n\n#play .player .player-btn {\n  cursor: pointer; }\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1.jpg";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2.jpg";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-3.jpg";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1.jpg";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2.jpg";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-3.jpg";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/bg.jpg";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/black-hover.png";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/black-piece.png";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/qipan.png";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/white-hover.png";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/white-piece.png";

/***/ }),
/* 21 */
/***/ (function(module, exports) {

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
	if(typeof DEBUG !== "undefined" && DEBUG) {
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(21)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/index.js!./style.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/index.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    addEventListener(eventName, callback) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(callback);
    }

    removeEventListener(eventName, callback) {
        if (!this.listeners[eventName]) { return; }
        if (!callback) {
            delete this.listeners[eventName];
            return;
        }
        this.listeners[eventName].forEach((fn, i)=>{
            if (fn === callback) {
                this.listeners[eventName].splice(i, 1);
                return false;
            }
        });
    }

    trigger(eventName, data) {
        this.listeners[eventName] && this.listeners[eventName].forEach(function(fn) {
            fn(data);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventEmitter;



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__avatarselector_actor_js__ = __webpack_require__(25);





class AvatarStage extends __WEBPACK_IMPORTED_MODULE_1__stage_js__["a" /* default */] {

    constructor(game, view) {
        super(game, view);
        this.name = 'avatar';
        this.data;
        this.avatarSelectorActor;
    }

    init() {
        super.init();
        this.avatarSelectorActor = this.createActor('AvatarSelector');
    }


    handleActorBroadcast() {
        return {
            selectAvatar: (selected)=>{
                __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player1.avatar = selected.player1Avatar;
                __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player2.avatar = selected.player2Avatar;
                this.game.goToStage('gate');
            }
        }
    }

    createActorConstructors() {
        return {
            AvatarSelector: __WEBPACK_IMPORTED_MODULE_2__avatarselector_actor_js__["a" /* default */]
        }
    }

    inactivate() {
        super.inactivate();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarStage;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(1);



class AvatarSelectorActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init();
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'select-done': (selected)=>{
                this.selectAvatar(selected);
            }
        }
    }

    selectAvatar(selected) {
        console.log(selected);
        this.broadcast('selectAvatar', selected);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarSelectorActor;


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stage_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setting_actor__ = __webpack_require__(27);



class PlayStage extends __WEBPACK_IMPORTED_MODULE_0__stage_js__["a" /* default */] {

    constructor(game, view) {
        super(game, view);
        this.name = 'gate';
        this.settingActor;
    }

    init() {
        super.init();
        this.settingActor = this.createActor('Setting');
    }


    handleActorBroadcast() {
        return {
            doSetting: (setting)=>{
                this.game.goToStage('play', setting);
            }
        }
    }

    createActorConstructors() {
        return {
            Setting: __WEBPACK_IMPORTED_MODULE_1__setting_actor__["a" /* default */]
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayStage;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(1);



class SettingActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init();

        this.widget.addEventListener('setting-done', (setting) => {
            this.doSetting(setting);
        });
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'setting-done': (setting) => {
                this.doSetting(setting);
            }
        }
    }

    doSetting(setting) {
        this.broadcast('doSetting', setting);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = SettingActor;


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(1);



class ChessboardActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init(...arguments);
        this.horizontal = 15; // 格子个数
        this.vertical = 15; // 格子个数
        this.pieceData = [];
        this.widget.createSquares(this.horizontal, this.vertical);
        this.playingActor;

        this.lock = false;
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'square-click': (crood)=>{
                this.tellPlayActorPutPiece(crood);
            }
        }
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor)=>{
                this.playingActor = playingActor;
                this.setWidgetPrevent();
                this.widget.setActivePiece(this.playingActor.pieceType);
            },

            start: ()=>{
                this.pieceData = (new Array(this.vertical)).fill(1).map((a)=>{
                    return new Array(this.horizontal);
                });

                this.widget.clearChessboard();
            },

            lock: ()=>{
                this.lock = true;
                setWidgetPrevent()
            },

            unlock: ()=>{
                this.lock = false;
                this.setWidgetPrevent()
            }
        }
    }

    tellPlayActorPutPiece(crood) {
        if (!this.playingActor.isRobot) {
            this.playingActor.putPiece(crood);
        }
    }

    setWidgetPrevent() {
        if ((this.playingActor && this.playingActor.isRobot) || this.lock) {
            this.widget.setPrevent(true);
        } else {
            this.widget.setPrevent(false);
        }
    }


    // 放子
    receivePiece(pieceType, crood) {
        this.pieceData[crood.x][crood.y] = pieceType;
        this.widget.setSquare(pieceType, crood);

        // console.log(pieceType, crood, this.playingActor.pieceType);
    }

    // 删除某个子，悔棋调用
    deletePiece(crood) {
        this.pieceData[crood.x][crood.y] = undefined;
        this.widget.setSquare('', crood);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChessboardActor;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(1);



class ControlerActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init();
    }

    showMsg(msg, dur=2000, callback) {
        this.widget.showMsg(...arguments);
    }

    showConfirm(msg, confirmCallback, refuseCallback, confirmText='sure', refuseText='no' ) {
        this.widget.showConfirm(...arguments);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlerActor;


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chessboard_actor_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__timekeeper_actor_js__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__player_actor_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__robot_actor_js__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__robot_actor_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__robot_actor_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controler_actor_js__ = __webpack_require__(29);










class PlayStage extends __WEBPACK_IMPORTED_MODULE_1__stage_js__["a" /* default */] {

    constructor(game, view) {
        super(game, view);
        this.name = 'play';
        // this.settingActor;

        this.chessboradActor;
        this.timeCounterActor;
        this.player1Actor; // 玩家 1 固定玩家
        this.controlerActor;

        this.pieceStack = []; // 每一步下子记录
        this.undoStack = []; // 上一次悔棋记录，用于撤销悔棋
        this.pieceTypes = ['black', 'white'];
        this.playingActor; // 当前需要下子的玩家是黑子还是白子 ， 'black', 'white'

    }

    init() {
        super.init();
        this.chessboradActor = this.createActor('Chessboard');
        this.timekeeperActor = this.createActor('Timekeeper');
        this.player1Actor = this.createActor('Player', 'player1');
        this.controlerActor = this.createActor('Controler');
    }

    handleActorBroadcast() {
        return {
            // 下子
            putPiece: (data)=>{
                if (this.playingActor.pieceType !== data.pieceType) return;

                this.chessboradActor.receivePiece(data.pieceType, data.crood);
                this.pieceStack.push(data);
                this.togglePlaying();
            },

            // 悔棋
            undo: (player)=>{

            },

            // 撤销悔棋
            undoundo: (player)=>{

            },

            // 认输
            giveIn: (player)=>{
                // this.gameover();
            },

            // 时间到
            timeup: (data)=>{
                let winner = data.player1 === data.player2 ? null : data.player1 > data.player2 ? this.player2Actor : this.player1Actor;
                let msg = winner ? '耗时少者获胜' : '耗时相同';
                this.gameover({winner, msg});
            }
        }
    }


    createActorConstructors() {
        return {
            Chessboard: __WEBPACK_IMPORTED_MODULE_2__chessboard_actor_js__["a" /* default */],
            Timekeeper: __WEBPACK_IMPORTED_MODULE_3__timekeeper_actor_js__["a" /* default */],
            Player: __WEBPACK_IMPORTED_MODULE_4__player_actor_js__["a" /* default */],
            Robot: __WEBPACK_IMPORTED_MODULE_5__robot_actor_js___default.a,
            Controler: __WEBPACK_IMPORTED_MODULE_6__controler_actor_js__["a" /* default */]
        }
    }

    activate(data) {
        super.activate();
        this.time = data.time;
        this.mode = data.mode;

        if (this.mode === 'duet') {
            this.player2Actor = this.createActor('Player', 'player2');
        } else {
            this.player2Actor = this.createActor('Robot', 'player2', true);
        }

        this.timekeeperActor.setLimitTime(this.time);
        this.start();
    }

    start() {
        this.pieceStack = [];
        this.undoStack = [];

        // 重新分配两个玩家黑白子
        let player1PieceTypeIndex = (Math.random() * 2)|0;

        let play1ResetData = {
            pieceType: this.pieceTypes[player1PieceTypeIndex],
            avatar: __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player1.avatar
        };

        let play2ResetData = {
            pieceType: this.pieceTypes[1 - player1PieceTypeIndex],
            avatar: this.player2Actor.isRobot ? 'robot' : __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player2.avatar
        };

        this.player1Actor.reset(play1ResetData);
        this.player2Actor.reset(play2ResetData);


        let playingActor = play1ResetData.pieceType === this.pieceTypes[0] ? this.player1Actor: this.player2Actor;

        this.controlerActor.showMsg('正在重新分配黑白子...', 20, ()=>{
            this.setPlaying(playingActor); // 黑子先走
            this.unlock();

            this.dispatch('start');
        });
    }

    setPlaying(playingActor) {
        this.playingActor = playingActor;
        this.dispatch('setPlaying', this.playingActor);
    }

    togglePlaying() {
        this.setPlaying(this.playingActor===this.player1Actor?this.player2Actor:this.player1Actor)
    }

    // 执行确认操作时，需要锁定游戏
    lock() {
        this.dispatch('lock');
    }

    unlock() {
        this.dispatch('unlock');
    }

    gameover(overData) {
        this.dispatch('gameover', overData);
    }




}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayStage;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(1);



class PlayerActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init(role) {
        super.init(...arguments);
        // 因玩家公用一个 playerActor 类，需根据玩家角色构建对象
        this.role = role;
        this.pieceType;
        this.myTurn = false;
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor) => {
                this.myTurn = playingActor === this;
            }
        }
    }

    putPiece(crood) {
        if (this.myTurn) {
            this.broadcast('putPiece', {pieceType: this.pieceType, crood: crood});
        }
    }

    makeWidgetData(resetData) {
        return resetData
    }

    reset(data) {
        super.reset(...arguments);
        if (!data) return;
        this.pieceType = data.pieceType;
        this.avatar = data.avatar;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerActor;


/***/ }),
/* 32 */
/***/ (function(module, exports) {



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(1);



class ControlerActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init();
        this.totalTime = 0;
        this.playerTime = {
            'player1': 0,
            'player2': 0
        };
        this.playingPlayer = 'player1';
        this.limitTime = 0;
        this.T;
    }

    setLimitTime(limitTime) {
        this.limitTime = limitTime;
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor)=>{
                this.playingPlayer = playingActor.role;
            },

            start: ()=>{
                this.totalTime = 0;
                this.playerTime = {
                    'player1': 0,
                    'player2': 0
                };
                this.widget.setData(this.getWidgetTimeData());
            },

            lock: ()=>{
                this.stopTick()
            },

            unlock: ()=>{
                this.startTick()
            }
        }
    }

    makeWidgetData() {
        // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
        return this.getWidgetTimeData();
    }

    getTimeText(second) {
        return `${(second / 60) | 0} : ${(second % 60)}`;
    }

    getWidgetTimeData() {

        return {
            'total': this.getTimeText(this.totalTime),
            'left': this.getTimeText(this.playerTime['player1']),
            'right': this.getTimeText(this.playerTime['player2']),
        }
    }

    timeup() {
        this.broadcast('timeup', this.playerTime);
    }

    startTick() {
        this.T = setInterval(()=>{
            // console.log(this.totalTime);
            this.totalTime += 1;
            if (this.totalTime > this.limitTime * 60) {
                this.timeup();
                return;
            }

            this.playerTime[this.playingPlayer] += 1;
            this.playerTime[(this.playingPlayer==='player1'?'player2':'player1')] = this.totalTime - this.playerTime[this.playingPlayer];

            this.widget.updateTime(this.getWidgetTimeData());
        }, 1000);
    }

    stopTick() {
        clearInterval(this.T);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlerActor;


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_game_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_dom_view_view_js__ = __webpack_require__(6);



var view = new __WEBPACK_IMPORTED_MODULE_1__view_dom_view_view_js__["a" /* default */]();
var game = new __WEBPACK_IMPORTED_MODULE_0__game_game_js__["a" /* default */](view);

view.init();
game.init();
game.start();

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Page {
    constructor() {
        this.widgets = [];
        this.data;
        this.widgetFactory;
    }

    init() {
        let WidgetConstructors = this.createWidgetConstructors();
        this.widgetFactory = {
            constructors: WidgetConstructors,
            getWidget: (name)=>{
                return (new WidgetConstructors[name](this));
            }
        }
    }

    createWidgetConstructors() {
        // 重写此方法，返回包含本 page 要用到的所有 widget 构造函数，用于按需创建 widget
    }

    createWidget(name) {
        // create widget
        let widget = this.widgetFactory.getWidget(name);
        widget.id = 'widget_' + (new Date).getTime() + (Math.random() * 1000000)|0;
        this.widgets.push(widget);

        return widget;
    }

    removeWidget(widget) {
        this.widgets = this.widgets.filter( w => w !== widget );
    }

    show(data) {
        this.data = data;
    }

    hide() {
        
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Page;


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class View {
    constructor() {
        this.pages = {};
    }
    init() { }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = View;


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_common_js__ = __webpack_require__(23);


class Widget extends __WEBPACK_IMPORTED_MODULE_0_Src_js_common_js__["a" /* EventEmitter */] {
    constructor(page) {
        super();
        this.page = page;
        this.widgetData;
    }

    // 组件初始化
    init() {

    }

    handleActorOrder() {
        // 处理 actor 指令
        return {};
    }

    // 更新组件
    setData(data) {
        this.widgetData = data;
        // update 
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Widget;


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatarselector_widget_js__ = __webpack_require__(39);



class AvatarPage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {

    createWidgetConstructors() {
        return { AvatarSelector: __WEBPACK_IMPORTED_MODULE_1__avatarselector_widget_js__["a" /* default */]}
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarPage;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class AvatarSelectorWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.ePlayer1Avatars = this.page.elem.querySelectorAll('#player1-avatar .avatar');
        this.ePlayer2Avatars = this.page.elem.querySelectorAll('#player2-avatar .avatar');
        this.eSelectOk = this.page.elem.querySelector('#avatar-select-ok');
        this.initEvent();

        this.play1Avatar = 'avatar-1-1';
        this.play2Avatar = 'avatar-2-1';
    }

    initEvent() {
        [...this.ePlayer1Avatars].forEach((avatar)=>{
            avatar.addEventListener('click', ()=>{ 
                [...this.ePlayer1Avatars].forEach(a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.play1Avatar = avatar.dataset.avatar;
            });
        });

        [...this.ePlayer2Avatars].forEach((avatar)=>{
            avatar.addEventListener('click', ()=>{
                [...this.ePlayer2Avatars].forEach(a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.play2Avatar = avatar.dataset.avatar;
            });
        });

        this.eSelectOk.addEventListener('click', ()=>{
            this.trigger('select-done', {
                play1Avatar: this.play1Avatar,
                play2Avatar: this.play2Avatar
            });
        });

    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarSelectorWidget;


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setting_widget_js__ = __webpack_require__(41);



class GatePage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    createWidgetConstructors() {
        return { Setting: __WEBPACK_IMPORTED_MODULE_1__setting_widget_js__["a" /* default */]}
    }    
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GatePage;


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class SettingWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.eTime = this.page.elem.querySelectorAll('#gate-time .option');
        this.eMode = this.page.elem.querySelectorAll('#gate-mode .option');
        this.initEvent();

        this.time = 5;
        this.mode = 'duet';
    }

    initEvent() {
        [...this.eTime].forEach((time)=>{
            time.addEventListener('click', ()=>{ 
                [...this.eTime].forEach(t=>t.classList.remove('selected'));
                time.classList.add('selected');
                this.time = time.dataset.time;
            });
        });

        [...this.eMode].forEach((mode)=>{
            mode.addEventListener('click', ()=>{
                this.mode = mode.dataset.mode;
                this.settingDone();
            });
        });

    }


    settingDone() {
        this.trigger('setting-done', {
            time: this.time,
            mode: this.mode
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SettingWidget;



/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class ChessboardWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.horizontal;
        this.vertical;
        this.eChessboard = this.page.elem.querySelector('.chessboard');
        this.squares;
        this.initEvent();
    }

    createSquares(horizontal, vertical) {
        this.horizontal = horizontal; // 格子个数
        this.vertical = horizontal; // 格子个数
        let squaresHTML = new Array(this.horizontal*this.vertical).fill(1)
                            .map(a=>`<div class="square"><i></i></div>`).join('');
        this.eChessboard.innerHTML = squaresHTML;
        this.squares = this.eChessboard.querySelectorAll('.square');
        [...this.squares].forEach((s,i)=>{
            s.dataset.crood = `${(i%this.vertical)},${(i/this.horizontal)|0}`;
        });
    }


    setPrevent(isPrevent) {
        if (isPrevent) {
            this.eChessboard.classList.add('prevent');
        } else {
            this.eChessboard.classList.remove('prevent');
        }
    }

    initEvent() {
        this.eChessboard.addEventListener('click', (e)=>{
            if (this.eChessboard.classList.contains('prevent')||!e.target.parentNode.classList.contains('square')) return;

            let square = e.target.parentNode;
            let crood = square.dataset.crood.split(',');

            if (square.classList.contains('black') || square.classList.contains('white')) {
                return;
            }
            this.trigger('square-click', {x: crood[0], y: crood[1]});
        });
    }

    setSquare(pieceType, crood) {
        let square = this.squares[Number(crood.x) + crood.y * this.horizontal];

        square.classList.remove('black','white');
        square.classList.add(pieceType);
    }

    setActivePiece(pieceType) {
        this.eChessboard.classList.remove('playing-black','playing-white')
        this.eChessboard.classList.add('playing-'+pieceType);
    }

    clearChessboard() {
        // 清空棋盘
        [...this.squares].forEach(s=>s.className='square');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChessboardWidget;


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class ControlerWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.eConfirm = this.page.elem.querySelector('.confirm');
        this.eConfirmMsg = this.eConfirm.querySelector('.confirm-msg');

        this.eConfirmHandle = this.eConfirm.querySelector('.confirm-handle');
        this.eConfirmYesBtn = this.eConfirm.querySelector('.confirm-yes');
        this.eConfirmNoBtn = this.eConfirm.querySelector('.confirm-no');

        this.confirmCallback;
        this.refuseCallback;
    }

    initEvent() {
        this.eConfirmYesBtn.addEventListener('click', function() {
            this.eConfirm.classList.remove('show');
            this.confirmCallback();
        });

        this.eConfirmNoBtn.addEventListener('click', function() {
            this.eConfirm.classList.remove('show');
            this.refuseCallback();
        });
    }

    showMsg(msg, dur, callback) {
        this.eConfirmHandle.classList.add('hide');
        this.eConfirmMsg.innerHTML = msg;

        this.eConfirm.classList.add('show');

        setTimeout(()=>{
            callback();
            this.eConfirm.classList.remove('show');
        }, dur);
    }

    showConfirm(msg, confirmCallback, refuseCallback, confirmText, refuseText) {
        this.eConfirmHandle.classList.add('show');
        this.eConfirmYesBtn.innerHTML = confirmText;
        this.eConfirmNoBtn.innerHTML = refuseText;
        this.eConfirmMsg.innerHTML = msg;

        this.confirmCallback = confirmCallback;

        this.eConfirm.classList.add('show');
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlerWidget;


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chessboard_widget_js__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__timekeeper_widget_js__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__player_widget_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__robot_widget_js__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controler_widget_js__ = __webpack_require__(43);







class PlayPage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    createWidgetConstructors() {
        return {
            Chessboard: __WEBPACK_IMPORTED_MODULE_1__chessboard_widget_js__["a" /* default */],
            Timekeeper: __WEBPACK_IMPORTED_MODULE_2__timekeeper_widget_js__["a" /* default */],
            Player: __WEBPACK_IMPORTED_MODULE_3__player_widget_js__["a" /* default */],
            Robot: __WEBPACK_IMPORTED_MODULE_4__robot_widget_js__["a" /* default */],
            Controler: __WEBPACK_IMPORTED_MODULE_5__controler_widget_js__["a" /* default */]
        }
    }  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayPage;


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class PlayerWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.ePlayer;
    }

    setType(playerType) {
        thie.ePlayer = this.elem.querySelector(`.${playerType}`);
        if (is) {

        }
    }

    initEvent() {

    }

    setData(data) {
        
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerWidget;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class RobotWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {

    }

    initEvent() {

    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RobotWidget;


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(0);


class TimekeeperWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.eLeft = this.page.elem.querySelector('.time-left');
        this.eTotal = this.page.elem.querySelector('.time-total');
        this.eRight = this.page.elem.querySelector('.time-right');

    }

    updateTime(timeData) {
        this.eLeft.innerHTML = timeData.left;
        this.eRight.innerHTML = timeData.right;
        this.eTotal.innerHTML = timeData.total;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TimekeeperWidget;


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map