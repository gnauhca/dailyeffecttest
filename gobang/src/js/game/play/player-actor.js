import Actor from '../actor.js';


export default class PlayerActor extends Actor {
    init(role) {
        super.init(...arguments);
        // 因玩家公用一个 playerActor 类，需根据玩家角色构建对象
        this.role = role;
        this.pieceType;
        this.myTurn = false;
        this.lock = false;
    }

    initWidget() {
        this.widget.init(this.role, this.isRobot); 
    }

    handleStageBoardcast() {
        return {
            setPlaying: (playingActor, chessboardData, pieceStack) => {

                // 自己有没有下子，判断悔棋炒作是否可行
                let hasPut = (pieceStack)=>{
                    if (pieceStack.length === 0 || (pieceStack.length === 1 && pieceStack[0].pieceType !== this.pieceType)) {
                        return false;
                    } else {
                        return true;
                    }
                }

                this.myTurn = playingActor === this;
                this.widgetData.undoState = !hasPut(pieceStack) ? 'disabled' : (this.myTurn?'playing':'wait');
                this.widgetData.playerState = this.myTurn?'playing':'wait';
            },
            lock: ()=>{
                this.lock = true;
                this.widgetData.prevent = true;
                this.widgetData.playerState = 'wait';
            },

            unlock: ()=>{
                this.lock = false;
                this.widgetData.prevent = false;
                this.widgetData.playerState = this.myTurn?'playing':'wait';
            },
            gameover: (overData)=>{
                this.widgetData.playerState = overData.winner===this? 'win': (overData.winner==null? 'wait': 'lose');
            }
        }
    }

    handleWidgetEvent() {
        return {
            undo: ()=>{
                this.dispatch('undo', this, (isSuccess)=>{ 
                    this.widgetData.undoState = isSuccess?'undoundo':'undo';
                });
            },
            undoundo: ()=>{
                this.dispatch('undoundo', this);
                this.widgetData.undoState = 'undo';
            },
            askDraw: ()=>{
                this.dispatch('askDraw', this);
            },
            giveIn: ()=>{
                this.dispatch('giveIn', this);
            }
        }
    }

    putPiece(crood) {
        if (this.myTurn) {
            this.dispatch('putPiece', {pieceType: this.pieceType, crood: crood});
        }
    }

    makeWidgetData(resetData) {
        if (!resetData) return{};
        return {
            avatar: resetData.avatar,
            pieceType: resetData.pieceType,
            playerState: 'wait',
            undoState: 'disabled'
        };
    }

    reset(data) {
        super.reset(...arguments);
        if (!data) return;
        this.hasPut = 0;
        this.pieceType = data.pieceType;
        this.avatar = data.avatar;
    }

}