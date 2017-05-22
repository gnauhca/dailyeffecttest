import Actor from '../actor.js';


export default class PlayerActor extends Actor {
    init(role) {
        super.init(...arguments);
        // 因玩家公用一个 playerActor 类，需根据玩家角色构建对象
        this.role = role;
        this.pieceType;
        this.myTurn = false;
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor) => {
                this.myTurn = playingActor === this;
            }
        }
    }

    putPiece(crood) {
        if (this.myTurn) {
            this.broadcast('putPiece', {pieceType: this.pieceType, crood: crood});
        }
    }

    makeWidgetData(resetData) {
        return resetData
    }

    reset(data) {
        super.reset(...arguments);
        if (!data) return;
        this.pieceType = data.pieceType;
        this.avatar = data.avatar;
    }

}