import BaseView from '../base-view/view.js';
import AvatarPage from './avatar/avatar-page.js';
import GatePage from './gate/gate-page.js';
import PlayPage from './play/play-page.js';

export default class View extends BaseView {
  constructor() {
    super();
    this.pages = {};
  }

  init() {
    const avatarElem = document.querySelector('#avatar');
    const gateElem = document.querySelector('#gate');
    const playElem = document.querySelector('#play');
    const avatar = new AvatarPage(avatarElem);
    const gate = new GatePage(gateElem);
    const play = new PlayPage(playElem);

    this.pages = { avatar, gate, play };
  }
}
