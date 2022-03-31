import Widget from '../widget.js';

export default class AvatarSelectorWidget extends Widget {
  init() {
    this.ePlayer1Avatars = this.page.elem.querySelectorAll('#player1-avatar .avatar');
    this.ePlayer2Avatars = this.page.elem.querySelectorAll('#player2-avatar .avatar');
    this.eSelectOk = this.page.elem.querySelector('#avatar-select-ok');

    this.initEvent();

    this.player1Avatar = 'avatar-1-1';
    this.player2Avatar = 'avatar-2-1';
  }

  initEvent() {
    [...this.ePlayer1Avatars].forEach((avatar) => {
      avatar.addEventListener('click', () => {
        [...this.ePlayer1Avatars].forEach((a) => a.classList.remove('selected'));
        avatar.classList.add('selected');
        this.player1Avatar = avatar.dataset.avatar;
      });
    });

    [...this.ePlayer2Avatars].forEach((avatar) => {
      avatar.addEventListener('click', () => {
        [...this.ePlayer2Avatars].forEach((a) => a.classList.remove('selected'));
        avatar.classList.add('selected');
        this.player2Avatar = avatar.dataset.avatar;
      });
    });

    this.eSelectOk.addEventListener('click', () => {
      this.trigger('select-done', {
        player1Avatar: this.player1Avatar,
        player2Avatar: this.player2Avatar,
      });
    });
  }

  reset() {
    [...this.ePlayer1Avatars].forEach((a) => a.classList.remove('selected'));
    [...this.ePlayer2Avatars].forEach((a) => a.classList.remove('selected'));

    this.ePlayer1Avatars[0].classList.add('selected');
    this.ePlayer2Avatars[0].classList.add('selected');
  }
}
