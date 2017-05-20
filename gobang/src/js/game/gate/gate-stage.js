import Stage from '../stage.js';
import GatePage from 'View/gate/gate-page.js';

export default class PlayStage extends Stage {

    constructor(game) {
        super(game);
        this.data; // 配置信息，游戏模式
        this.view = new GatePage;
    }

    init() {
        super.init();
    }

    inactivate() {
        super.inactivate();
    }
}