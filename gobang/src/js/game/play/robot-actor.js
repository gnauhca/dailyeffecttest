import PlayerActor from './player-actor.js';

export default class RobotActor extends PlayerActor {
    init() {
        super.init(...arguments);
        // this.chessboardData;
        this.pieceNeedsToPut;
        this.thinkTime = 500;
        this.thinkT;
        this.isRobot = true;
    }

    initWidget() {
        this.widget.init(this.role, this.isRobot); 
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor, chessboardData, pieceStack) => {
                this.myTurn = playingActor === this;
                this.widgetData.playerState = this.myTurn?'playing':'waiting';
                if (!this.myTurn) return;
                // this.chessboardData = chessboardData;
                this.pieceNeedsToPut = this.calNextPiece(chessboardData);
                this.thinkT = setTimeout(()=>{
                    this.pieceNeedsToPut && this.putPiece(this.pieceNeedsToPut);
                }, this.thinkTime);
            },
            lock: ()=>{
                this.lock = true;
                this.widgetData.prevent = true;
                this.widgetData.playerState = 'waiting';
            },

            unlock: ()=>{
                this.lock = false;
                this.widgetData.prevent = false;
                this.widgetData.playerState = this.myTurn?'playing':'waiting';
                this.pieceNeedsToPut && this.putPiece(this.pieceNeedsToPut);
            },
            gameover: (overData)=>{
                this.widgetData.playerState = overData.winner===this? 'win': (overData.winner==null? 'wait': 'lose');
            }
        }
    }

    calNextPiece(chessboardData) {
        let emptySquares = [];

        for (let x = 0; x < chessboardData.length; x++) {
            for (let y = 0; y < chessboardData[x].length; y++) {
                if (!chessboardData[x][y]) {
                    emptySquares.push({x,y});
                }
            }
        }

        return emptySquares[(emptySquares.length*Math.random())|0]
    }

    putPiece(crood) {
        super.putPiece(crood);
        clearTimeout(this.thinkT);
        this.pieceNeedsToPut = null;
    }

}