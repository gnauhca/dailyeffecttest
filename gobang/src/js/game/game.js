import GateStage from './gate/gate-stage.js';
import PlayStage from './play/play-stage.js';

class Game {
    constuctor(view) {
        
        this.stages = {};
        this.currentStage = null;

        this.view = view;
        this.init();
    }

    init() {
        let gate = new GateStage(this);
        let play = new PlayStage(this);

        this.stages = {gate, play};
    }

    start() {
        this.goToStage('gate');
    }

    exit() {

    }

    goToStage(name, data) {
        if (this.currentStage) {
            this.currentStage.inactivate();
        }
        
        this.currentStage = this.stages[name];
        this.currentStage.activate(data);
    }
}


export default Game;