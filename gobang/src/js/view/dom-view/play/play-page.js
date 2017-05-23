import Page from '../page.js';
import ChessboardWidget from './chessboard-widget.js';
import TimekeeperWidget from './timekeeper-widget.js';
import PlayerWidget from './player-widget.js';
import ControlerWidget from './controler-widget.js';

export default class PlayPage extends Page {
    createWidgetConstructors() {
        return {
            Chessboard: ChessboardWidget,
            Timekeeper: TimekeeperWidget,
            Player: PlayerWidget,
            Robot: PlayerWidget,
            Controler: ControlerWidget
        }
    }  
}