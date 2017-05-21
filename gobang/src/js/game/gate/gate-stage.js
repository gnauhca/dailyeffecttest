import Stage from '../stage.js';

export default class PlayStage extends Stage {

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