import PlayActor from '../actor.js';


export default class ControlerActor extends PlayActor {
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