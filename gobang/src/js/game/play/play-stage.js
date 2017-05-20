import Stage from '../stage.js';

export default class PlayStage extends Stage {

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