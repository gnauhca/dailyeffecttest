import Game from './game/game.js';
import View from './view/dom-view/view.js';

var view = new View();
var game = new Game(view);

view.init();
game.init();
game.start();