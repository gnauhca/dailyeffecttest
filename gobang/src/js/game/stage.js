export default class Stage {
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