import PlayActor from '../actor.js';


export default class ControlerActor extends PlayActor {
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