import Widget from '../widget.js';

export default class AvatarSelectorWidget extends Widget {
    init() {
        this.ePlayer1Avatars = this.page.elem.querySelectorAll('#player1-avatar .avatar');
        this.ePlayer2Avatars = this.page.elem.querySelectorAll('#player2-avatar .avatar');
        this.eSelectOk = this.page.elem.querySelector('#avatar-select-ok');
        this.initEvent();

        this.play1Avatar = 'avatar-1-1';
        this.play2Avatar = 'avatar-2-1';
    }

    initEvent() {
        Array.prototype.forEach.call(this.ePlayer1Avatars, (avatar)=>{
            avatar.addEventListener('click', ()=>{ 
                Array.prototype.forEach.call(this.ePlayer1Avatars, a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.play1Avatar = avatar.dataset.avatar;
            });
        });

        Array.prototype.forEach.call(this.ePlayer2Avatars, (avatar)=>{
            avatar.addEventListener('click', ()=>{
                Array.prototype.forEach.call(this.ePlayer2Avatars, a=>a.classList.remove('selected'));
                avatar.classList.add('selected');
                this.play2Avatar = avatar.dataset.avatar;
            });
        });

        this.eSelectOk.addEventListener('click', ()=>{
            this.setData();
        });

    }


    setData(data) {
        this.trigger('select-done', {
            play1Avatar: this.play1Avatar,
            play2Avatar: this.play2Avatar
        });
    }
}