import { globalData } from '../global-data.js';
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
    const avatar = new AvatarStage(this, this.view.pages.avatar);
    const gate = new GateStage(this, this.view.pages.gate);
    const play = new PlayStage(this, this.view.pages.play);

    this.view.init();
    this.stages = { avatar, gate, play };
  }

  start() {
    /* test */
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

export default Game;
