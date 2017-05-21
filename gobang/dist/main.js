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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Stage {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isInit = false;
        this.active = false;
        this.data;

        this.actors = [];
        this._orders;
        this.actorFactory;
    }

    init() {
        this.isInit = true;
        this.activate && this.activate();

        this._orders = this.orders();

        let ActorConstructors = this.createActorConstructors();
        this.actorFactory = {
            constructors: ActorConstructors,
            getActor: (name)=>{
                return ( new ActorConstructors[name](this, this.view.createWidget(name)) );
            }
        }
    }

    createActorConstructors() {
        // 重写此方法，返回包含本 stage 要用到的所有 Actor 构造函数，用于按需创建 actor
    }

    createActor(name) {
        // 创建舞台演员
        let actor = this.actorFactory.getActor(name);
        actor.id = 'actor_' + (new Date).getTime() + (Math.random() * 1000000)|0;
        this.actors.push(actor);
        actor.init();

        return actor;
    }


    orders() {
        // 重写此方法，返回包含多个命令函数的对象，用于 actor 发送公共命令
    }

    // 收到信息，执行命令
    excuteOrder(orderName, data) {
        this._orders[orderName](data);
    }

    getActorsData(data) {
        return data;
    }

    activate(data) {
        this.active = true;
        // 首次激活需要初始化
        if (!this.isInit) {
            this.view.init();
            this.init();
            return; 
        }
        this.data = data;
        
        
        let actorsData = this.getActorsData(data);

        // 每个 actor 各自激活
        for (let actorName in this.actors) {
            this.actors[actorName].activate(actorsData[actorName]);
        }

        this.view && this.view.show();
    }

    inactivate() {
        this.active = false;
        this.view && this.view.hide();

        // 每个 actor 各自休眠
        for (let actorName in this.actors) {
            this.actors[actorName].inactivate();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stage;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_page_js__ = __webpack_require__(22);


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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_stage_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gate_gate_stage_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__play_play_stage_js__ = __webpack_require__(19);





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
            this.currentStage.inactivate();
        }
        
        this.currentStage = this.stages[name];
        this.currentStage.activate(data);
    }
}


/* harmony default export */ __webpack_exports__["a"] = (Game);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_view_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_page_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gate_gate_page_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__play_play_page_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_Src_css_style_scss__ = __webpack_require__(13);
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, "/* RESET*/\nhtml, body, div, ul, ol, li, dl, dt, dd, h1, h2, h3, h4, h5, h6, pre, form, p, blockquote, fieldset, input, abbr, article, aside, command, details, figcaption, figure, footer, header, hgroup, mark, meter, nav, output, progress, section, summary, time {\n  margin: 0;\n  padding: 0; }\n\nh1, h2, h3, h4, h5, h6, pre, code, address, caption, cite, code, em, strong, th, figcaption {\n  font-size: 1em;\n  font-weight: normal;\n  font-style: normal; }\n\nfieldset, iframe {\n  border: none; }\n\ncaption, th {\n  text-align: left; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\narticle, aside, footer, header, hgroup, nav, section, figure, figcaption {\n  display: block; }\n\n/* LAYOUT */\n* {\n  margin: 0;\n  padding: 0; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  position: relative; }\n\nhtml {\n  background-color: #fff; }\n\n.clear {\n  clear: both; }\n\n.clearer {\n  clear: both;\n  display: block;\n  margin: 0;\n  padding: 0;\n  height: 0;\n  line-height: 1px;\n  font-size: 1px; }\n\n.selfclear {\n  zoom: 1; }\n\n.selfclear:after {\n  content: '.';\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden; }\n\nimg {\n  border: 0; }\n\na {\n  text-decoration: none;\n  color: #515151; }\n  a:focus {\n    outline: none; }\n\ni {\n  font-style: normal; }\n\nul, li {\n  list-style: none; }\n\nbody {\n  font: 14px/1.5 'microsoft yahei';\n  color: #515151; }\n\n.clearfix:after, .clearfix:before {\n  content: \"\";\n  display: table;\n  height: 0px;\n  clear: both;\n  visibility: hidden; }\n\n.clearfix {\n  *zoom: 1; }\n\n.fl {\n  float: left; }\n\n.fr {\n  float: right; }\n\n.br0 {\n  border: none; }\n\n.key-color {\n  color: #333; }\n\n.maim-color {\n  color: #666; }\n\n.auxiliary-color {\n  color: #999; }\n\n.pic {\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: 100%; }\n\n.pointer {\n  cursor: pointer; }\n\n.page {\n  display: none; }\n\n.page.show {\n  display: block; }\n\n.avatars {\n  display: flex;\n  width: 50%; }\n  .avatars .avatar {\n    width: 100px;\n    height: 100px; }\n    .avatars .avatar.selected {\n      box-shadow: inset 2px 2px 2px #666; }\n  .avatars .avatar-1-1 {\n    background-image: url(" + __webpack_require__(6) + "); }\n  .avatars .avatar-1-2 {\n    background-image: url(" + __webpack_require__(7) + "); }\n  .avatars .avatar-1-3 {\n    background-image: url(" + __webpack_require__(8) + "); }\n  .avatars .avatar-2-1 {\n    background-image: url(" + __webpack_require__(9) + "); }\n  .avatars .avatar-2-2 {\n    background-image: url(" + __webpack_require__(10) + "); }\n  .avatars .avatar-2-3 {\n    background-image: url(" + __webpack_require__(11) + "); }\n\n.options {\n  display: flex;\n  justify-content: space-around;\n  width: 400px;\n  height: 100px; }\n  .options .option {\n    width: 100px;\n    height: 50px;\n    line-height: 50px;\n    text-align: center;\n    outline: 1px solid #666; }\n    .options .option.selected {\n      box-shadow: inset 2px 2px 2px #666; }\n", ""]);

// exports


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1.jpg";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2.jpg";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-3.jpg";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1.jpg";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2.jpg";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-3.jpg";

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(12)(content, {});
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
/* 14 */
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Actor {
    constructor(stage, widget) {
        this.stage = stage;
        this.widget = widget;
        this.widgetData;
    }

    init() {
        this.widget.init();
    }

    getWidgetData(data) {
        return data;
    }

    updateWidget() {
        this.widgetData = getWidgetData(this.data);
        this.widget.setData(this.widgetData);
    }

    activate(data) {
        this.data = data;
        updateWidget();
    }

    inactivate() {
        // inactivate
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actor;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__avatarselector_actor_js__ = __webpack_require__(17);





class AvatarStage extends __WEBPACK_IMPORTED_MODULE_1__stage_js__["a" /* default */] {

    constructor(game, view) {
        super(game, view);
        this.name = 'avatar';
        this.data;
        this.avatarSelector;
    }

    init() {
        super.init();
        this.avatarSelector = this.createActor('AvatarSelector');
    }


    orders() {
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
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(15);



class AvatarSelectorActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init();

        this.widget.addEventListener('select-done', (selected) => {
            this.selectAvatar(selected);
        });
    }

    selectAvatar(selected) {
        console.log(selected);
        this.stage.excuteOrder('selectAvatar', selected);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarSelectorActor;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stage_js__ = __webpack_require__(0);


class PlayStage extends __WEBPACK_IMPORTED_MODULE_0__stage_js__["a" /* default */] {

    constructor(game, view) {
        super(game, view);
        this.name = 'gate';
        this.data; // 配置信息，游戏模式
    }

    init() {
        super.init();
    }

    inactivate() {
        super.inactivate();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayStage;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stage_js__ = __webpack_require__(0);


class PlayStage extends __WEBPACK_IMPORTED_MODULE_0__stage_js__["a" /* default */] {

    constructor(game) {
        super(game);
        this.data; // 配置信息，游戏模式
    }

    init() {
        super.init();
        console.log('play init');
    }

    inactivate() {
        super.inactivate();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayStage;


/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_game_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_dom_view_view_js__ = __webpack_require__(3);



var view = new __WEBPACK_IMPORTED_MODULE_1__view_dom_view_view_js__["a" /* default */]();
var game = new __WEBPACK_IMPORTED_MODULE_0__game_game_js__["a" /* default */](view);

view.init();
game.init();
game.start();

/***/ }),
/* 22 */
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
/* 23 */
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
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_common_js__ = __webpack_require__(14);


class Widget extends __WEBPACK_IMPORTED_MODULE_0_Src_js_common_js__["a" /* EventEmitter */] {
    constructor(page) {
        super();
        this.page = page;
    }

    // 组件初始化
    init() {

    }

    // 更新组件
    setData(data) {
        // update 
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Widget;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatarselector_widget_js__ = __webpack_require__(26);



class AvatarPage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    constructor(elem) {
        super(elem);
    }

    createWidgetConstructors() {
        return { AvatarSelector: __WEBPACK_IMPORTED_MODULE_1__avatarselector_widget_js__["a" /* default */]}
    }

    show() {
        super.show();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarPage;


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(29);


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
        Array.prototype.forEach.call(this.ePlayer1Avatars, (avatar)=>{
            avatar.addEventListener('click', ()=>{ 
                Array.prototype.forEach.call(this.ePlayer1Avatars, a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.play1Avatar = avatar.dataset.avatar;
            });
        });

        Array.prototype.forEach.call(this.ePlayer2Avatars, (avatar)=>{
            avatar.addEventListener('click', ()=>{
                Array.prototype.forEach.call(this.ePlayer2Avatars, a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.play2Avatar = avatar.dataset.avatar;
            });
        });

        this.eSelectOk.addEventListener('click', ()=>{
            this.setData();
        });

    }


    setData(data) {
        this.trigger('select-done', {
            play1Avatar: this.play1Avatar,
            play2Avatar: this.play2Avatar
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarSelectorWidget;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(1);


class GatePage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    constructor(elem) {
        super(elem);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GatePage;


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(1);


class PlayPage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    constructor(elem) {
        super(elem);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayPage;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_widget_js__ = __webpack_require__(24);


class Widget extends __WEBPACK_IMPORTED_MODULE_0__base_view_widget_js__["a" /* default */] {

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Widget;


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map