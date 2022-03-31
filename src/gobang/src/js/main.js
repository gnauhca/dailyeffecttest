import Game from './game/game.js';
import View from './view/dom-view/view.js';

const view = new View();
const game = new Game(view);

view.init();
game.init();
game.start();
