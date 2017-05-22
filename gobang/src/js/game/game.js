import {globalData} from 'Src/js/global-data.js';
import AvatarStage from './avatar/avatar-stage.js';
import GateStage from './gate/gate-stage.js';
import PlayStage from './play/play-stage.js';

class Game {
    constructor(view) {
        
        this.stages = {};
        this.currentStage = null;

        this.view = view;
    }

    init() {
        let avatar = new AvatarStage(this, this.view.pages.avatar);
        let gate = new GateStage(this, this.view.pages.gate);
        let play = new PlayStage(this, this.view.pages.play);

        this.view.init();
        this.stages = {avatar, gate, play};
    }

    start() {
        /* test*/
        this.goToStage('play', {time: 5, mode: 'duet'}); return;

        // console.log(globalData);
        if (!!globalData.player1.avatar) {
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


export default Game;