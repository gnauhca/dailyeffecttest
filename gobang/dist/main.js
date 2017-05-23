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
/******/ 	return __webpack_require__(__webpack_require__.s = 56);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Actor {
    constructor(stage, widget) {
        this.stage = stage;
        this.widget = widget;
        this.widgetData;
        this.resetData;
        this.stageBroadcastHandlers = this.handleStageBoardcast();
        this.widgetEventHandlers = this.handleWidgetEvent();
    }

    init() {
        for (let eventName in this.widgetEventHandlers) {
            this.widget.addEventListener(eventName, this.widgetEventHandlers[eventName]);
        }
    }

    initWidget() {
        this.widget.init();
    }

    handleStageBoardcast() {
        // 重写此方法，返回包含多个消息处理函数的对象，用于处理 stage 对 actor 发出的消息
        return {};
    }


    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {}
    }

    // 向 stage 发送消息
    dispatch() {
        let args = [...arguments];
        let msg = args.shift();

        this.stage.actorDispatchHandlers[msg] && this.stage.actorDispatchHandlers[msg](...args);
    }

    makeWidgetData(actorResetData) {
        // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
        return actorResetData;
    }

    reset(actorResetData) {
        this.resetData = actorResetData;
        // 重置，在 stage 离开时，需要重置持久(生命周期与stage想同)的 actor
        this.widgetData = this.makeWidgetData(actorResetData);
        this.widget.setData(this.widgetData);
        this.widget.reset();
    }

    distory() {
        this.widget.distory();
        this.stage.removeActor(this);
        this.stage = null;
        this.widget = null
        this.widgetData = null;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actor;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_widget_js__ = __webpack_require__(60);


class Widget extends __WEBPACK_IMPORTED_MODULE_0__base_view_widget_js__["a" /* default */] {

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Widget;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/selected.png";

/***/ }),
/* 3 */
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
        this.actorDispatchHandlers = this.handleActorDispatch();
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
        actor.initWidget();

        return actor;
    }

    removeActor(actor) {
        this.actors.splice(this.actors.indexOf(actor), 1);
    }


    handleActorDispatch() {
        // 重写此方法，返回包含多个消息处理函数的对象，用于处理 actor 对 stage 发出的消息
        return {};
    }

    // 向当前 stage 所有的 actor 发送消息
    broadcast() {
        let args = [...arguments];
        let msg = args.shift();
        this.actors.forEach(
            a=>a.stageBroadcastHandlers[msg] && a.stageBroadcastHandlers[msg](...args)
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_page_js__ = __webpack_require__(58);


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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/css/ziti.eot";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/bg.jpg";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/black-piece.png";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/white-piece.png";

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(0);



class PlayerActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init(role) {
        super.init(...arguments);
        // 因玩家公用一个 playerActor 类，需根据玩家角色构建对象
        this.role = role;
        this.pieceType;
        this.myTurn = false;
        this.lock = false;
    }

    initWidget() {
        this.widget.init(this.role, this.isRobot); 
    }

    handleStageBoardcast() {
        return {
            setPlaying: (playingActor, chessboardData, pieceStack) => {

                // 自己有没有下子，判断悔棋炒作是否可行
                let hasPut = (pieceStack)=>{
                    if (pieceStack.length === 0 || (pieceStack.length === 1 && pieceStack[0].pieceType !== this.pieceType)) {
                        return false;
                    } else {
                        return true;
                    }
                }

                this.myTurn = playingActor === this;
                this.widgetData.undoState = !hasPut(pieceStack) ? 'disabled' : (this.myTurn?'playing':'wait');
                this.widgetData.playerState = this.myTurn?'playing':'wait';
            },
            lock: ()=>{
                this.lock = true;
                this.widgetData.prevent = true;
                this.widgetData.playerState = 'wait';
            },

            unlock: ()=>{
                this.lock = false;
                this.widgetData.prevent = false;
                this.widgetData.playerState = this.myTurn?'playing':'wait';
            },
            gameover: (overData)=>{
                this.widgetData.playerState = overData.winner===this? 'win': (overData.winner==null? 'wait': 'lose');
            }
        }
    }

    handleWidgetEvent() {
        return {
            undo: ()=>{
                this.dispatch('undo', this, (isSuccess)=>{ 
                    this.widgetData.undoState = isSuccess?'undoundo':'undo';
                });
            },
            undoundo: ()=>{
                this.dispatch('undoundo', this);
                this.widgetData.undoState = 'undo';
            },
            askDraw: ()=>{
                this.dispatch('askDraw', this);
            },
            giveIn: ()=>{
                this.dispatch('giveIn', this);
            }
        }
    }

    putPiece(crood) {
        if (this.myTurn) {
            this.dispatch('putPiece', {pieceType: this.pieceType, crood: crood});
        }
    }

    makeWidgetData(resetData) {
        if (!resetData) return{};
        return {
            avatar: resetData.avatar,
            pieceType: resetData.pieceType,
            playerState: 'wait',
            undoState: 'disabled'
        };
    }

    reset(data) {
        super.reset(...arguments);
        if (!data) return;
        this.hasPut = 0;
        this.pieceType = data.pieceType;
        this.avatar = data.avatar;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerActor;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_stage_js__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gate_gate_stage_js__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__play_play_stage_js__ = __webpack_require__(53);





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
        // globalData.player1.avatar = 'avatar-1-2';
        // globalData.player2.avatar = 'avatar-2-1';
        // this.goToStage('play', {time: 5, mode: 'duet'}); return;

        // this.goToStage('gate'); return;

        // console.log(globalData);
        // if (!!globalData.player1.avatar) {
            // 首次游戏，设置头像
            this.goToStage('avatar');
        // } else {
            // this.goToStage('gate');
        // }
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_view_view_js__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatar_avatar_page_js__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gate_gate_page_js__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__play_play_page_js__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_Src_css_style_scss__ = __webpack_require__(45);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)();
// imports


// module
exports.push([module.i, "/* RESET*/\nhtml, body, div, ul, ol, li, dl, dt, dd, h1, h2, h3, h4, h5, h6, pre, form, p, blockquote, fieldset, input, abbr, article, aside, command, details, figcaption, figure, footer, header, hgroup, mark, meter, nav, output, progress, section, summary, time {\n  margin: 0;\n  padding: 0; }\n\nh1, h2, h3, h4, h5, h6, pre, code, address, caption, cite, code, em, strong, th, figcaption {\n  font-size: 1em;\n  font-weight: normal;\n  font-style: normal; }\n\nfieldset, iframe {\n  border: none; }\n\ncaption, th {\n  text-align: left; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\narticle, aside, footer, header, hgroup, nav, section, figure, figcaption {\n  display: block; }\n\n/* LAYOUT */\n* {\n  margin: 0;\n  padding: 0; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  position: relative; }\n\nhtml {\n  background-color: #fff; }\n\n.clear {\n  clear: both; }\n\n.clearer {\n  clear: both;\n  display: block;\n  margin: 0;\n  padding: 0;\n  height: 0;\n  line-height: 1px;\n  font-size: 1px; }\n\n.selfclear {\n  zoom: 1; }\n\n.selfclear:after {\n  content: '.';\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden; }\n\nimg {\n  border: 0; }\n\na {\n  text-decoration: none;\n  color: #515151; }\n  a:focus {\n    outline: none; }\n\ni {\n  font-style: normal; }\n\nul, li {\n  list-style: none; }\n\nbody {\n  font: 14px/1.5 'microsoft yahei';\n  color: #515151; }\n\n.clearfix:after, .clearfix:before {\n  content: \"\";\n  display: table;\n  height: 0px;\n  clear: both;\n  visibility: hidden; }\n\n.clearfix {\n  *zoom: 1; }\n\n.fl {\n  float: left; }\n\n.fr {\n  float: right; }\n\n.br0 {\n  border: none; }\n\n.key-color {\n  color: #333; }\n\n.maim-color {\n  color: #666; }\n\n.auxiliary-color {\n  color: #999; }\n\n@font-face {\n  font-family: \"ziti\";\n  src: url(" + __webpack_require__(6) + ");\n  /* IE9 */\n  src: url(" + __webpack_require__(6) + "?#iefix) format(\"embedded-opentype\"), url(" + __webpack_require__(17) + ") format(\"woff\"), url(" + __webpack_require__(16) + ") format(\"truetype\"), url(" + __webpack_require__(15) + "#ziti) format(\"svg\");\n  /* iOS 4.1- */\n  font-style: normal;\n  font-weight: normal; }\n\nbody {\n  font-family: \"ziti\";\n  font-size: 30px;\n  color: #000; }\n\n.container {\n  width: 1368px;\n  height: 768px;\n  overflow: hidden;\n  background: url(" + __webpack_require__(40) + ") no-repeat;\n  background-size: 100%; }\n\n.pic {\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: 100%; }\n\n.btn {\n  display: inline-block;\n  font-size: 30px;\n  padding: 10px;\n  border: 1px solid #666; }\n\n.pointer {\n  cursor: pointer; }\n\n.show {\n  display: block !important; }\n\n.page {\n  display: none;\n  position: relative;\n  width: 100%;\n  height: 100%; }\n\n.page.show {\n  display: block; }\n\n.avatar-1-1 {\n  background-image: url(" + __webpack_require__(22) + "); }\n\n.avatar-1-2 {\n  background-image: url(" + __webpack_require__(27) + "); }\n\n.avatar-2-1 {\n  background-image: url(" + __webpack_require__(32) + "); }\n\n.avatar-2-2 {\n  background-image: url(" + __webpack_require__(37) + "); }\n\n.avatar-robot {\n  background-image: url(" + __webpack_require__(38) + "); }\n\n#avatar h1 {\n  font-size: 50px;\n  padding: 50px 80px; }\n\n#avatar .avatar-select {\n  display: flex;\n  width: 90%;\n  margin: 0 auto;\n  justify-content: space-around;\n  padding: 10px;\n  border: 1px solid rgba(0, 0, 0, 0.2); }\n\n#avatar .avatars {\n  margin-top: 30px; }\n\n#avatar .avatar {\n  position: relative;\n  display: inline-block;\n  width: 200px;\n  height: 200px;\n  margin: 30px; }\n  #avatar .avatar.selected:after {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    width: 100%;\n    padding-top: 100%;\n    transform: translate(-50%, -50%);\n    display: block;\n    content: '';\n    background: url(" + __webpack_require__(2) + ") no-repeat center;\n    background-size: 100%; }\n\n#avatar .select-ok {\n  float: right;\n  margin-top: 80px;\n  margin-right: 60px; }\n\n#gate .gate-select {\n  padding: 120px 0 0 450px; }\n  #gate .gate-select h2 {\n    font-size: 50px;\n    padding: 10px; }\n\n#gate .options {\n  width: 600px;\n  height: 160px; }\n  #gate .options .option {\n    float: left;\n    position: relative;\n    width: 130px;\n    height: 50px;\n    line-height: 50px;\n    margin: 10px;\n    text-align: center; }\n    #gate .options .option.selected:after {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      width: 100%;\n      padding-top: 100%;\n      transform: translate(-50%, -50%);\n      display: block;\n      content: '';\n      background: url(" + __webpack_require__(2) + ") no-repeat center;\n      background-size: 100%; }\n\n#gate .back {\n  position: absolute;\n  top: 30px;\n  left: 60px;\n  width: 80px;\n  height: 80px;\n  background-image: url(" + __webpack_require__(39) + "); }\n\n#play .confirm {\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 100;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.1); }\n  #play .confirm .confirm-box {\n    width: 450px;\n    height: 150px;\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    padding: 20px;\n    background-size: 70%;\n    box-shadow: 5px 3px 8px rgba(0, 0, 0, 0.3);\n    background-image: url(" + __webpack_require__(7) + "); }\n    #play .confirm .confirm-box .confirm-msg {\n      font-size: 30px;\n      margin-bottom: 30px; }\n    #play .confirm .confirm-box .confirm-handle {\n      display: none; }\n      #play .confirm .confirm-box .confirm-handle .confirm-btn {\n        margin: 20px;\n        font-size: 20px;\n        float: right;\n        cursor: pointer; }\n\n#play .chessboard {\n  position: absolute;\n  left: 50%;\n  top: 3%;\n  transform: translate(-50%, 0);\n  display: flex;\n  flex-wrap: wrap;\n  width: 600px;\n  padding: 40px;\n  background: url(" + __webpack_require__(42) + ") center no-repeat;\n  background-size: 100%; }\n  #play .chessboard .square {\n    width: 40px;\n    height: 40px;\n    cursor: pointer; }\n    #play .chessboard .square, #play .chessboard .square i {\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 100%; }\n    #play .chessboard .square i {\n      display: block;\n      width: 100%;\n      height: 100%; }\n    #play .chessboard .square.black i {\n      background-image: url(" + __webpack_require__(8) + "); }\n    #play .chessboard .square.white i {\n      background-image: url(" + __webpack_require__(9) + "); }\n  #play .chessboard.playing-black .square:hover {\n    background-image: url(" + __webpack_require__(41) + "); }\n  #play .chessboard.playing-white .square:hover {\n    background-image: url(" + __webpack_require__(43) + "); }\n  #play .chessboard .white:hover, #play .chessboard .black:hover,\n  #play .chessboard.forbidden .square:hover, #play .chessboard.forbidden .square:hover {\n    background: none !important;\n    cursor: not-allowed; }\n\n#play .time {\n  display: flex;\n  justify-content: space-around;\n  line-height: 40px; }\n  #play .time .time-total {\n    font-size: 40px; }\n\n#play .player {\n  width: 30%;\n  height: 100%;\n  box-sizing: border-box;\n  padding: 80px 60px 50px 60px; }\n  #play .player .avatar {\n    width: 160px;\n    height: 160px;\n    margin: 30px auto;\n    background-size: 100%; }\n  #play .player .piece {\n    position: relative;\n    width: 150px;\n    height: 150px;\n    margin: 0 auto; }\n    #play .player .piece.white {\n      background-image: url(" + __webpack_require__(9) + "); }\n    #play .player .piece.black {\n      background-image: url(" + __webpack_require__(8) + "); }\n    #play .player .piece:after {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      width: 100%;\n      padding-top: 100%;\n      transform: translate(-50%, -50%);\n      display: block;\n      content: '';\n      background: url(" + __webpack_require__(2) + ") no-repeat center;\n      background-size: 100%;\n      opacity: 0;\n      transition: opacity 0.3s; }\n  #play .player.playing .piece:after {\n    opacity: 1; }\n  #play .player.player1 {\n    float: left; }\n  #play .player.player2 {\n    float: right; }\n  #play .player .player-handle {\n    text-align: center; }\n  #play .player .player-btn {\n    cursor: pointer; }\n    #play .player .player-btn.disabled {\n      opacity: 0.5;\n      cursor: not-allowed; }\n  #play .player.playing .avatar-1-1 {\n    background-image: url(" + __webpack_require__(19) + "); }\n  #play .player.playing .avatar-1-2 {\n    background-image: url(" + __webpack_require__(24) + "); }\n  #play .player.playing .avatar-2-1 {\n    background-image: url(" + __webpack_require__(29) + "); }\n  #play .player.playing .avatar-2-2 {\n    background-image: url(" + __webpack_require__(34) + "); }\n  #play .player.wait .avatar-1-1 {\n    background-image: url(" + __webpack_require__(20) + "); }\n  #play .player.wait .avatar-1-2 {\n    background-image: url(" + __webpack_require__(25) + "); }\n  #play .player.wait .avatar-2-1 {\n    background-image: url(" + __webpack_require__(30) + "); }\n  #play .player.wait .avatar-2-2 {\n    background-image: url(" + __webpack_require__(35) + "); }\n  #play .player.lose .avatar-1-1 {\n    background-image: url(" + __webpack_require__(18) + "); }\n  #play .player.lose .avatar-1-2 {\n    background-image: url(" + __webpack_require__(23) + "); }\n  #play .player.lose .avatar-2-1 {\n    background-image: url(" + __webpack_require__(28) + "); }\n  #play .player.lose .avatar-2-2 {\n    background-image: url(" + __webpack_require__(33) + "); }\n  #play .player.win .avatar-1-1 {\n    background-image: url(" + __webpack_require__(21) + "); }\n  #play .player.win .avatar-1-2 {\n    background-image: url(" + __webpack_require__(26) + "); }\n  #play .player.win .avatar-2-1 {\n    background-image: url(" + __webpack_require__(31) + "); }\n  #play .player.win .avatar-2-2 {\n    background-image: url(" + __webpack_require__(36) + "); }\n\n#play .gameover {\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 100;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.1); }\n  #play .gameover .gameover-box {\n    width: 450px;\n    height: 150px;\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    background-image: url(" + __webpack_require__(7) + ");\n    padding: 20px;\n    background-size: 70%;\n    box-shadow: 5px 3px 8px rgba(0, 0, 0, 0.3); }\n    #play .gameover .gameover-box .gameover-msg {\n      font-size: 30px;\n      margin-bottom: 30px; }\n    #play .gameover .gameover-box .gameover-handle .gameover-btn {\n      margin: 20px;\n      font-size: 20px;\n      float: right;\n      cursor: pointer; }\n", ""]);

// exports


/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/css/ziti.svg";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/css/ziti.ttf";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/css/ziti.woff";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1-lose.png";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1-playing.png";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1-wait.png";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1-win.png";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-1.png";

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2-lose.png";

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2-playing.png";

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2-wait.png";

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2-win.png";

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-1-2.png";

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1-lose.png";

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1-playing.png";

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1-wait.png";

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1-win.png";

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-1.png";

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2-lose.png";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2-playing.png";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2-wait.png";

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2-win.png";

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-2-2.png";

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/avatar-robot.png";

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/back.png";

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/bg-1.jpg";

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/black-hover.png";

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/qipan.png";

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/white-hover.png";

/***/ }),
/* 44 */
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(44)(content, {});
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
/* 46 */
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
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__avatarselector_actor_js__ = __webpack_require__(48);





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


    handleActorDispatch() {
        return {
            selectAvatar: (selected)=>{
                __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player1.avatar = selected.player1Avatar;
                __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player2.avatar = selected.player2Avatar;
                this.game.goToStage('gate');
                // console.log(globalData);
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
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(0);



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
        // console.log(selected);
        this.dispatch('selectAvatar', selected);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarSelectorActor;


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stage_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setting_actor__ = __webpack_require__(50);



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


    handleActorDispatch() {
        return {
            doSetting: (setting)=>{
                this.game.goToStage('play', setting);
            },
            back: (setting)=>{
                this.game.goToStage('avatar');
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
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(0);



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
            },
            'back': () => {
                this.dispatch('back');
            }
        }
    }

    doSetting(setting) {
        this.dispatch('doSetting', setting);
    }

    makeWidgetData() {
        return {
            time: 5
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SettingActor;


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(0);



class ChessboardActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init(...arguments);
        this.horizontal = 15; // 格子个数
        this.vertical = 15; // 格子个数
        this.pieceData = (new Array(this.vertical)).fill(1).map((a)=>{
            return new Array(this.horizontal);
        });;
        
        this.playingActor;

        this.lock = false;
    }

    initWidget() {
        super.initWidget();
        this.widget.createSquares(this.horizontal, this.vertical);
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'square-click': (crood)=>{
                this.tellPlayActorPutPiece(crood);
            }
        }
    }

    handleStageBoardcast() {
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
                this.setWidgetPrevent();
            },

            unlock: ()=>{
                this.lock = false;
                this.setWidgetPrevent();
            }
        }
    }

    makeWidgetData(resetData) {
        return {
            forbidden: true
        };
    }


    setWidgetPrevent() {
        if ((this.playingActor && this.playingActor.isRobot) || this.lock) {
            this.widgetData.forbidden = true;
        } else {
            this.widgetData.forbidden = false;
        }
    }

    tellPlayActorPutPiece(crood) {
        if (!this.playingActor.isRobot) {
            this.playingActor.putPiece(crood);
        }
    }

    // 传入刚下的子，判断是否获胜，向四个方向发散计算，到 5 个就赢啦
    isWin(piece, crood) {
        let directions = [
            {x:1},//横
            {y:1},//竖
            {x:1, y:-1},//斜
            {x:1, y:1} //反斜
        ];

        let calPiece = (crood, step, piece)=>{
            let pCount = 0;

            crood = {x: crood.x, y: crood.y};
            while(true) {
                for(var key in step) {
                    crood[key] += step[key]; //console.log(crood.x, crood.y);
                }
                if (
                    crood.x >= 0 && 
                    crood.y >=0 && 
                    crood.x < this.horizontal && 
                    crood.y < this.vertical &&
                    this.pieceData[crood.x][crood.y] === piece
                ) {
                    pCount++;
                } else {
                    break;
                }
            }
            return pCount;
        }

        for(let i = 0; i < directions.length; i++) {
            let direction = directions[i];
            let pieceCount = 1;

            let step;
            let curCrood = {x: Number(crood.x), y: Number(crood.y)}; // 当前判断的子

            // 正向
            step = direction;
            pieceCount += calPiece(curCrood, step, piece);

            // 反向
            step = {};
            step = direction;
            for(let key in direction) {
                step[key] = direction[key] * -1;
            }
            pieceCount += calPiece(curCrood, step, piece);

            if (pieceCount >= 5) {
                // console.log(1);
                return true;
            }
        }

    }

    // 放子
    receivePiece(pieceType, crood) {
        this.pieceData[crood.x][crood.y] = pieceType;
        this.widget.setSquare(pieceType, crood);

        return this.isWin(pieceType, crood);
        // console.log(pieceType, crood, this.playingActor.pieceType);
    }

    // 删除某个子，悔棋调用
    deletePiece(crood) {
        this.pieceData[crood.x][crood.y] = undefined;
        this.widget.setSquare('', crood);
    }

    getChessboardData() {
        return this.pieceData;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ChessboardActor;


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(0);



class ControlerActor extends __WEBPACK_IMPORTED_MODULE_0__actor_js__["a" /* default */] {
    init() {
        super.init();
    }

    handleStageBoardcast() {
        return {
            start: ()=>{
                
            },

            gameover: (overData)=>{
                this.showGameoverMsg(overData.msg);
            }
        }
    }

    handleWidgetEvent() {
        return {
            restart: ()=>{
                this.dispatch('restart');
            },
            back: ()=>{
                this.dispatch('back');
            }
        }
    }

    showMsg(msg, dur=2000, callback) {
        this.widget.showMsg(...arguments);
    }

    showConfirm(msg, confirmCallback, refuseCallback, confirmText='sure', refuseText='no' ) {
        this.widget.showConfirm(...arguments);
    }

    showGameoverMsg(msg) {
        this.widget.showGameoverMsg(msg);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlerActor;


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stage_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__chessboard_actor_js__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__timekeeper_actor_js__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__player_actor_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__robot_actor_js__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__controler_actor_js__ = __webpack_require__(52);












class PlayStage extends __WEBPACK_IMPORTED_MODULE_2__stage_js__["a" /* default */] {

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

    handleActorDispatch() {
        return {
            // 下子
            putPiece: (data)=>{
                if (this.playingActor.pieceType !== data.pieceType) return;

                // 倘若赢棋，返回 true
                if (this.chessboradActor.receivePiece(data.pieceType, data.crood)) {
                    let winner = this.playingActor;
                    let msg = `${__WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__["a" /* default */][this.playingActor.pieceType]}获胜， 游戏结束`;
                    this.gameover({winner, msg});
                    return;
                }
                this.pieceStack.push(data);
                this.undoStack.length = 0;
                this.togglePlaying();
            },

            // 悔棋
            undo: (player, callback)=>{

                let _callback = (isAgree)=>{
                    this.unlock(); 
                    callback(isAgree);
                };
                let agree = ()=>{
                    if (this.playingActor === player) {
                        this.undoStack.push(this.pieceStack.pop());
                        this.undoStack.push(this.pieceStack.pop());
                    } else {
                        this.undoStack.push(this.pieceStack.pop());
                        this.setPlaying(player);
                    }

                    this.undoStack.forEach(p=>this.chessboradActor.deletePiece(p.crood));
                    _callback(true);
                }
                let refuse = ()=>{_callback(false);};

                this.lock();
                if (this.player2Actor.isRobot) {
                    agree();
                } else {
                    let msg = `${__WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__["a" /* default */][player.pieceType]} 想悔棋, 请问 ${__WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__["a" /* default */][this.getOtherPlayer(player).pieceType]} 答应吗？`
                    this.controlerActor.showConfirm(msg, agree, refuse, '同意', '拒绝');
                }

            },

            // 撤销悔棋
            undoundo: (player)=>{
                this.undoStack.forEach(p=>this.chessboradActor.receivePiece(p.pieceType, p.crood));
                if (this.undoStack.length === 1) {
                    this.togglePlaying();
                }
                this.pieceStack.push(...this.undoStack);
                this.undoStack.length = 0;
            },

            // 请求和棋
            askDraw: (player)=>{

                let _callback = ()=>{this.unlock();};
                let agree = ()=>{
                    let winner = null;
                    let msg = '握手言和，游戏结束';
                    this.gameover({winner, msg});
                }
                let refuse = ()=>{_callback()};

                this.lock();
                if (this.player2Actor.isRobot) {
                    agree();
                } else {
                    let msg = `${__WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__["a" /* default */][player.pieceType]} 想求和, 请问 ${__WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__["a" /* default */][this.getOtherPlayer(player).pieceType]} 答应吗？`
                    this.controlerActor.showConfirm(msg, agree, refuse, '同意', '拒绝');
                }
            },

            // 认输
            giveIn: (player)=>{
                let winner = this.getOtherPlayer(player);
                let msg = `${__WEBPACK_IMPORTED_MODULE_1_Src_js_msg_map_js__["a" /* default */][player.pieceType]} 认怂，游戏结束`;
                this.gameover({winner, msg});
            },

            // 时间到
            timeup: (data)=>{
                let winner = data.player1 === data.player2 ? null : data.player1 > data.player2 ? this.player2Actor : this.player1Actor;
                let msg = winner ? '耗时少者获胜' : '耗时相同';
                this.gameover({winner, msg});
            },

            // 回到主页
            back: ()=>{
                this.game.goToStage('gate');
            },

            restart: ()=>{
                this.start();
            }
        }
    }


    createActorConstructors() {
        return {
            Chessboard: __WEBPACK_IMPORTED_MODULE_3__chessboard_actor_js__["a" /* default */],
            Timekeeper: __WEBPACK_IMPORTED_MODULE_4__timekeeper_actor_js__["a" /* default */],
            Player: __WEBPACK_IMPORTED_MODULE_5__player_actor_js__["a" /* default */],
            Robot: __WEBPACK_IMPORTED_MODULE_6__robot_actor_js__["a" /* default */],
            Controler: __WEBPACK_IMPORTED_MODULE_7__controler_actor_js__["a" /* default */]
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

    inactivate() {
        this.player2Actor.distory();
    }

    start() {
        this.pieceStack = [];
        this.undoStack = [];

        // console.log(globalData);

        // 重新分配两个玩家黑白子
        let player1PieceTypeIndex = (Math.random() * 2)|0;

        let play1ResetData = {
            pieceType: this.pieceTypes[player1PieceTypeIndex],
            avatar: __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player1.avatar
        };

        let play2ResetData = {
            pieceType: this.pieceTypes[1 - player1PieceTypeIndex],
            avatar: this.player2Actor.isRobot ? 'avatar-robot' : __WEBPACK_IMPORTED_MODULE_0_Src_js_global_data_js__["a" /* globalData */].player2.avatar
        };

        this.player1Actor.reset(play1ResetData);
        this.player2Actor.reset(play2ResetData);
        this.timekeeperActor.reset();


        let playingActor = play1ResetData.pieceType === this.pieceTypes[0] ? this.player1Actor: this.player2Actor;

        this.controlerActor.showMsg('重新分配黑白子...', 1000, ()=>{
            this.setPlaying(playingActor); // 黑子先走
            this.broadcast('start');
            this.unlock();
        });
    }

    setPlaying(playingActor) {
        this.playingActor = playingActor;
        this.broadcast('setPlaying', this.playingActor, this.chessboradActor.getChessboardData(), this.pieceStack);
    }

    getOtherPlayer(player) {
        return player===this.player1Actor?this.player2Actor:this.player1Actor
    }

    togglePlaying() {
        this.setPlaying(this.getOtherPlayer(this.playingActor))
    }

    // 执行确认操作时，需要锁定游戏
    lock() {
        this.broadcast('lock');
    }

    unlock() {
        this.broadcast('unlock');
    }

    gameover(overData) {
        this.lock();
        this.broadcast('gameover', overData);
    }




}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayStage;


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player_actor_js__ = __webpack_require__(10);


class RobotActor extends __WEBPACK_IMPORTED_MODULE_0__player_actor_js__["a" /* default */] {
    init() {
        super.init(...arguments);
        // this.chessboardData;
        this.pieceNeedsToPut;
        this.thinkTime = 500;
        this.thinkT;
        this.isRobot = true;
    }

    initWidget() {
        this.widget.init(this.role, this.isRobot); 
    }

    handleStageBoardcast() {
        return {
            setPlaying: (playingActor, chessboardData, pieceStack) => {
                this.myTurn = playingActor === this;
                this.widgetData.playerState = this.myTurn?'playing':'waiting';
                if (!this.myTurn) return;
                // this.chessboardData = chessboardData;
                this.pieceNeedsToPut = this.calNextPiece(chessboardData);
                this.thinkT = setTimeout(()=>{
                    this.pieceNeedsToPut && this.putPiece(this.pieceNeedsToPut);
                }, this.thinkTime);
            },
            lock: ()=>{
                this.lock = true;
                this.widgetData.prevent = true;
                this.widgetData.playerState = 'waiting';
            },

            unlock: ()=>{
                this.lock = false;
                this.widgetData.prevent = false;
                this.widgetData.playerState = this.myTurn?'playing':'waiting';
                this.pieceNeedsToPut && this.putPiece(this.pieceNeedsToPut);
            },
            gameover: (overData)=>{
                this.widgetData.playerState = overData.winner===this? 'win': (overData.winner==null? 'wait': 'lose');
            }
        }
    }

    calNextPiece(chessboardData) {
        let emptySquares = [];

        for (let x = 0; x < chessboardData.length; x++) {
            for (let y = 0; y < chessboardData[x].length; y++) {
                if (!chessboardData[x][y]) {
                    emptySquares.push({x,y});
                }
            }
        }

        return emptySquares[(emptySquares.length*Math.random())|0]
    }

    putPiece(crood) {
        super.putPiece(crood);
        clearTimeout(this.thinkT);
        this.pieceNeedsToPut = null;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = RobotActor;


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actor_js__ = __webpack_require__(0);



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

    handleStageBoardcast() {
        return {
            setPlaying: (playingActor)=>{
                this.playingPlayer = playingActor.role;
            },

            lock: ()=>{
                this.stopTick()
            },

            unlock: ()=>{
                this.stopTick()
                this.startTick()
            },
            gameover: ()=>{
                this.stopTick();
            }
        }
    }

    makeWidgetData() {
        // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
        return {
            'total': '00 : 00',
            'left': '00 : 00',
            'right': '00 : 00',
        }
    }

    reset() {
        super.reset();
        this.totalTime = 0;
        this.playerTime = {
            'player1': 0,
            'player2': 0
        };
    }

    fillZero(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    }

    getTimeText(second) {
        let minuteStr = this.fillZero((second / 60) | 0);
        let secondStr = this.fillZero(second % 60);
        return `${minuteStr} : ${secondStr}`;
    }

    setWidgetData() {
        this.widgetData['total'] = this.getTimeText(this.totalTime);
        this.widgetData['left'] = this.getTimeText(this.playerTime['player1']);
        this.widgetData['right'] = this.getTimeText(this.playerTime['player2']);
    }

    timeup() {
        this.dispatch('timeup', this.playerTime);
    }

    startTick() {
        this.T = setInterval(()=>{
            // console.log(this.totalTime);
            this.totalTime += 1;

            this.playerTime[this.playingPlayer] += 1;
            this.playerTime[(this.playingPlayer==='player1'?'player2':'player1')] = this.totalTime - this.playerTime[this.playingPlayer];

            this.setWidgetData();
            if (this.totalTime > this.limitTime * 60) {
                this.timeup();
                return;
            }

        }, 1000);
    }

    stopTick() {
        clearInterval(this.T);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlerActor;


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_game_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_dom_view_view_js__ = __webpack_require__(12);



var view = new __WEBPACK_IMPORTED_MODULE_1__view_dom_view_view_js__["a" /* default */]();
var game = new __WEBPACK_IMPORTED_MODULE_0__game_game_js__["a" /* default */](view);

view.init();
game.init();
game.start();

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
 var msgMap = {
    'black': '黑棋',
    'white': '白棋'
};
/* harmony default export */ __webpack_exports__["a"] = (msgMap);

/***/ }),
/* 58 */
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
/* 59 */
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
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Src_js_common_js__ = __webpack_require__(46);


class Widget extends __WEBPACK_IMPORTED_MODULE_0_Src_js_common_js__["a" /* EventEmitter */] {
    constructor(page) {
        super();
        this.page = page;
        this.widgetData;
        this.watchMethods = this.watch();
    }

    // 组件初始化
    init() {

    }

    watch() {
        // 返回对 widgetData 的每个值的监听函数
        return {};
    }

    // 更新组件
    setData(data) {
        let that = this;

        /*for (let key in this.widgetData) {
            this.widgetData.__defineSetter__(key, ()=>{});
            this.widgetData.__defineGetter__(key, ()=>{});
        }*/

        this.widgetData = data;

        // 为新的 widgetData 设置 setter 监听
        for (let key in data) {
            data['____' + key] = data[key];
            data.__defineSetter__(key, function(val){
                that.watchMethods['*'] && that.watchMethods['*']();
                that.watchMethods[key] && that.watchMethods[key](val);
                this['____' + key] = val;
            });
            data.__defineGetter__(key, function(){ return this['____' + key];});
            this.watchMethods[key] && this.watchMethods[key](data[key]);
        }
    }

    reset() {}

    distory() {
        this.page = null;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Widget;


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__avatarselector_widget_js__ = __webpack_require__(62);



class AvatarPage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {

    createWidgetConstructors() {
        return { AvatarSelector: __WEBPACK_IMPORTED_MODULE_1__avatarselector_widget_js__["a" /* default */]}
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarPage;


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(1);


class AvatarSelectorWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.ePlayer1Avatars = this.page.elem.querySelectorAll('#player1-avatar .avatar');
        this.ePlayer2Avatars = this.page.elem.querySelectorAll('#player2-avatar .avatar');
        this.eSelectOk = this.page.elem.querySelector('#avatar-select-ok');
        
        this.initEvent();

        this.player1Avatar = 'avatar-1-1';
        this.player2Avatar = 'avatar-2-1';
    }

    initEvent() {
        [...this.ePlayer1Avatars].forEach((avatar)=>{
            avatar.addEventListener('click', ()=>{ 
                [...this.ePlayer1Avatars].forEach(a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.player1Avatar = avatar.dataset.avatar;
            });
        });

        [...this.ePlayer2Avatars].forEach((avatar)=>{
            avatar.addEventListener('click', ()=>{
                [...this.ePlayer2Avatars].forEach(a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.player2Avatar = avatar.dataset.avatar;
            });
        });

        this.eSelectOk.addEventListener('click', ()=>{
            this.trigger('select-done', {
                player1Avatar: this.player1Avatar,
                player2Avatar: this.player2Avatar
            });
        });


    }

    reset() {
        [...this.ePlayer1Avatars].forEach(a=>a.classList.remove('selected'));
        [...this.ePlayer2Avatars].forEach(a=>a.classList.remove('selected'));

        this.ePlayer1Avatars[0].classList.add('selected');
        this.ePlayer2Avatars[0].classList.add('selected');

    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AvatarSelectorWidget;


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setting_widget_js__ = __webpack_require__(64);



class GatePage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    createWidgetConstructors() {
        return { Setting: __WEBPACK_IMPORTED_MODULE_1__setting_widget_js__["a" /* default */]}
    }    
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GatePage;


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(1);


class SettingWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.eTime = this.page.elem.querySelectorAll('#gate-time .option');
        this.eMode = this.page.elem.querySelectorAll('#gate-mode .option');
        this.eBack = this.page.elem.querySelector('.back');
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
        this.eBack.addEventListener('click', ()=>{
            this.trigger('back');
        });
    }

    reset(){
        [...this.eTime].forEach((t)=>{
            t.classList.remove('selected');
        });
        this.time = 5;
        this.eTime[0].classList.add('selected');
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
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(1);


class ChessboardWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.horizontal;
        this.vertical;
        this.eChessboard = this.page.elem.querySelector('.chessboard');
        this.squares;
        this.initEvent();
    }
    watch() {
        return {
            forbidden: (forbidden)=>{
                if (forbidden) {
                    this.eChessboard.classList.add('forbidden');
                } else {
                    this.eChessboard.classList.remove('forbidden');
                }
            }
        }
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

    initEvent() {
        this.eChessboard.addEventListener('click', (e)=>{
            if (this.widgetData.forbidden||!e.target.parentNode.classList.contains('square')) {
                return;
            } 

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
        pieceType && square.classList.add(pieceType);
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
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(1);


class ControlerWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.eConfirm = this.page.elem.querySelector('.confirm');
        this.eConfirmMsg = this.eConfirm.querySelector('.confirm-msg');

        this.eConfirmHandle = this.eConfirm.querySelector('.confirm-handle');
        this.eConfirmYesBtn = this.eConfirm.querySelector('.confirm-yes');
        this.eConfirmNoBtn = this.eConfirm.querySelector('.confirm-no');


        this.eGameover = this.page.elem.querySelector('.gameover');
        this.eGameoverMsg = this.eGameover.querySelector('.gameover-msg');
        this.eGameoverRestart = this.eGameover.querySelector('.restart');
        this.eGameoverBack = this.eGameover.querySelector('.back');

        this.confirmCallback;
        this.refuseCallback;

        this.initEvent();
    }

    initEvent() {
        this.eConfirmYesBtn.addEventListener('click', ()=>{
            this.eConfirm.classList.remove('show');
            this.confirmCallback();
        });

        this.eConfirmNoBtn.addEventListener('click', ()=>{
            this.eConfirm.classList.remove('show');
            this.refuseCallback();
        });

        this.eGameoverRestart.addEventListener('click', ()=>{
            this.eGameover.classList.remove('show');
            this.trigger('restart');
        });

        this.eGameoverBack.addEventListener('click', ()=>{
            this.eGameover.classList.remove('show');
            this.trigger('back');
        });

    }

    showMsg(msg, dur, callback) {
        this.eConfirmHandle.classList.remove('show');
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
        this.refuseCallback = refuseCallback;

        this.eConfirm.classList.add('show');
    }

    showGameoverMsg(msg) {
        this.eGameoverMsg.innerHTML = msg;
        this.eGameover.classList.add('show');
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlerWidget;


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__page_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chessboard_widget_js__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__timekeeper_widget_js__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__player_widget_js__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controler_widget_js__ = __webpack_require__(66);






class PlayPage extends __WEBPACK_IMPORTED_MODULE_0__page_js__["a" /* default */] {
    createWidgetConstructors() {
        return {
            Chessboard: __WEBPACK_IMPORTED_MODULE_1__chessboard_widget_js__["a" /* default */],
            Timekeeper: __WEBPACK_IMPORTED_MODULE_2__timekeeper_widget_js__["a" /* default */],
            Player: __WEBPACK_IMPORTED_MODULE_3__player_widget_js__["a" /* default */],
            Robot: __WEBPACK_IMPORTED_MODULE_3__player_widget_js__["a" /* default */],
            Controler: __WEBPACK_IMPORTED_MODULE_4__controler_widget_js__["a" /* default */]
        }
    }  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayPage;


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(1);


class PlayerWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init(role, isRobot) {
        this.role = role;
        this.isRobot = isRobot;

        let template = this.page.elem.querySelector('#play-player-template').innerHTML;
        let eDiv = document.createElement('div');
        eDiv.innerHTML = template;

        this.ePlayer = eDiv.querySelector('div');
        this.ePlayer.classList.add(role);
        isRobot && this.ePlayer.classList.add('robot');

        this.avatar = this.ePlayer.querySelector('.avatar');

        this.page.elem.appendChild(this.ePlayer);
        this.initEvent();
    }

    initEvent() {
        let thisWidget = this;

        if (this.isRobot) {
            this.ePlayer.removeChild(this.ePlayer.querySelector('.player-handle'));
            return;
        }

        let undoBtn = this.ePlayer.querySelector('.undo-btn');
        let giveinBtn = this.ePlayer.querySelector('.givein-btn');
        let askdrawBtn = this.ePlayer.querySelector('.askdraw-btn');

        undoBtn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) {
                return;
            }
            let eventName = 'undo';
            
            if (this.classList.contains('undoundo')) {
                eventName = 'undoundo'
            }
            thisWidget.trigger(eventName);
        });

        giveinBtn.addEventListener('click', function() {
            thisWidget.trigger('giveIn');
        });

        askdrawBtn.addEventListener('click', function() {
            thisWidget.trigger('askDraw');
        });
    } 

    watch() {
        return {
            avatar: (avatar)=>{
                this.avatar.className = 'avatar ' + avatar;
                this.ePlayer.className = this.ePlayer.className.replace(/bg\-avatar\S*?/g, '');
                this.ePlayer.classList.add('bg-' + avatar);
            },
            pieceType: (pieceType)=>{
                let ePiece = this.ePlayer.querySelector('.piece');
                ePiece.classList.remove('white', 'black');
                ePiece.classList.add(pieceType);
            },
            undoState: (undoState)=>{
                if (this.isRobot) return;
                let undoBtn = this.ePlayer.querySelector('.undo-btn');
                // disabled //undoundo // undo
                undoBtn.classList.remove('disabled', 'undo', 'undoundo');
                undoBtn.innerHTML =  undoState === 'undoundo'? '撤销悔棋': '悔棋';
                undoBtn.classList.add(undoState);
            },
            playerState: (playerState)=>{
                this.ePlayer.classList.remove('playing', 'wait', 'lose', 'win');
                this.ePlayer.classList.add(playerState);
            }
        }
    }


    distory() {
        super.distory();
        this.ePlayer.parentNode.removeChild(this.ePlayer);

        // todo 事件解绑
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerWidget;


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__widget_js__ = __webpack_require__(1);


class TimekeeperWidget extends __WEBPACK_IMPORTED_MODULE_0__widget_js__["a" /* default */] {
    init() {
        this.eLeft = this.page.elem.querySelector('.time-left');
        this.eTotal = this.page.elem.querySelector('.time-total');
        this.eRight = this.page.elem.querySelector('.time-right');
    }

    watch() {
        return {
            'left': ()=>{this.eLeft.innerHTML = this.widgetData.left;},
            'right': ()=>{this.eRight.innerHTML = this.widgetData.right;},
            'total': ()=>{
                this.eTotal.innerHTML = this.widgetData.total;
            }
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = TimekeeperWidget;


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map