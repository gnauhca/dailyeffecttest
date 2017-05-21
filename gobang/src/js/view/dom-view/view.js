import BaseView from '../base-view/view.js';
import AvatarPage from './avatar/avatar-page.js';
import GatePage from './gate/gate-page.js';
import PlayPage from './play/play-page.js';
import 'Src/css/style.scss';

export default class View extends BaseView {
    constructor() {
        super();
        this.pages = {};
    }
    init() {
        let avatarElem = document.querySelector('#avatar');
        let gateElem = document.querySelector('#gate');
        let playElem = document.querySelector('#play');
        let avatar = new AvatarPage(avatarElem);
        let gate = new GatePage(gateElem);
        let play = new PlayPage(playElem);

        this.pages = {avatar, gate, play};
    }
}