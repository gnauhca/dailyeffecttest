import Widget from '../widget.js';

export default class ControlerWidget extends Widget {
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