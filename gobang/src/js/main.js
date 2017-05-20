import Game from './game/game.js';
import view from './view/view.js';

var view = new View();
var game = new Game(view);

game.init();
game.start();