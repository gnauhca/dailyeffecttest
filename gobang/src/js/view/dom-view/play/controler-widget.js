import Widget from '../widget.js';

export default class ControlerWidget extends Widget {
    init() {
        this.eConfirm = this.page.elem.querySelector('.confirm');
        this.eConfirmMsg = this.eConfirm.querySelector('.confirm-msg');

        this.eConfirmHandle = this.eConfirm.querySelector('.confirm-handle');
        this.eConfirmYesBtn = this.eConfirm.querySelector('.confirm-yes');
        this.eConfirmNoBtn = this.eConfirm.querySelector('.confirm-no');

        this.confirmCallback;
        this.refuseCallback;
    }

    initEvent() {
        this.eConfirmYesBtn.addEventListener('click', function() {
            this.eConfirm.classList.remove('show');
            this.confirmCallback();
        });

        this.eConfirmNoBtn.addEventListener('click', function() {
            this.eConfirm.classList.remove('show');
            this.refuseCallback();
        });
    }

    showMsg(msg, dur, callback) {
        this.eConfirmHandle.classList.add('hide');
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

        this.eConfirm.classList.add('show');
    }

}