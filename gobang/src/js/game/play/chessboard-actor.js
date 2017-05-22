import PlayActor from '../actor.js';


export default class ChessboardActor extends PlayActor {
    init() {
        super.init(...arguments);
        this.horizontal = 15; // 格子个数
        this.vertical = 15; // 格子个数
        this.pieceData = [];
        this.widget.createSquares(this.horizontal, this.vertical);
        this.playingActor;

        this.lock = false;
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'square-click': (crood)=>{
                this.tellPlayActorPutPiece(crood);
            }
        }
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor)=>{
                this.playingActor = playingActor;
                this.setWidgetPrevent();
                this.widget.setActivePiece(this.playingActor.pieceType);
            },

            start: ()=>{
                this.pieceData = (new Array(this.vertical)).fill(1).map((a)=>{
                    return new Array(this.horizontal);
                });

                this.widget.clearChessboard();
            },

            lock: ()=>{
                this.lock = true;
                setWidgetPrevent()
            },

            unlock: ()=>{
                this.lock = false;
                this.setWidgetPrevent()
            }
        }
    }

    tellPlayActorPutPiece(crood) {
        if (!this.playingActor.isRobot) {
            this.playingActor.putPiece(crood);
        }
    }

    setWidgetPrevent() {
        if ((this.playingActor && this.playingActor.isRobot) || this.lock) {
            this.widget.setPrevent(true);
        } else {
            this.widget.setPrevent(false);
        }
    }


    // 放子
    receivePiece(pieceType, crood) {
        this.pieceData[crood.x][crood.y] = pieceType;
        this.widget.setSquare(pieceType, crood);

        // console.log(pieceType, crood, this.playingActor.pieceType);
    }

    // 删除某个子，悔棋调用
    deletePiece(crood) {
        this.pieceData[crood.x][crood.y] = undefined;
        this.widget.setSquare('', crood);
    }
}