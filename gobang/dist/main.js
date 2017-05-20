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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Stage {
    constructor(game) {
        this.game = game;
        this.view = null;
        this.isInit = false;
        this.active = false;
    }

    init() {
        this.isInit = true;
        this.activate && this.activate();
    }

    activate(data) {
        this.active = true;
        if (!this.isInit) {
            this.init();
            this.view.init();
            return; 
        }
        this.view && this.view.show();
    }

    inactivate() {
        this.active = false;
        this.view && this.view.hide();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stage;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gate_gate_stage_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__play_play_stage_js__ = __webpack_require__(3);



class Game {
    constuctor(view) {
        
        this.stages = {};
        this.currentStage = null;

        this.view = view;
        this.init();
    }

    init() {
        let gate = new __WEBPACK_IMPORTED_MODULE_0__gate_gate_stage_js__["a" /* default */](this);
        let play = new __WEBPACK_IMPORTED_MODULE_1__play_play_stage_js__["a" /* default */](this);

        this.stages = {gate, play};
    }

    start() {
        this.goToStage('gate');
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stage_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_View_gate_gate_page_js__ = __webpack_require__(5);



class PlayStage extends __WEBPACK_IMPORTED_MODULE_0__stage_js__["a" /* default */] {

    constructor(game) {
        super(game);
        this.data; // 配置信息，游戏模式
        this.view = new __WEBPACK_IMPORTED_MODULE_1_View_gate_gate_page_js__["a" /* default */];
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
/* 3 */
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_game_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_view_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_view_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__view_view_js__);



var view = new View();
var game = new __WEBPACK_IMPORTED_MODULE_0__game_game_js__["a" /* default */](view);

game.init();
game.start();

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(6);


class GatePage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    constructor() {
        super();
    }

    init() {

    }

    show() {
        console.log('gate page show');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GatePage;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Page {
    constructor() {

    }

    init() {

    }

    show() {

    }

    hide() {
        
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Page;


/***/ }),
/* 7 */
/***/ (function(module, exports) {



/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map