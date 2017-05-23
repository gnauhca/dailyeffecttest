import PlayActor from '../actor.js';


export default class ChessboardActor extends PlayActor {
    init() {
        super.init(...arguments);
        this.horizontal = 15; // 格子个数
        this.vertical = 15; // 格子个数
        this.pieceData = (new Array(this.vertical)).fill(1).map((a)=>{
            return new Array(this.horizontal);
        });;
        
        this.playingActor;

        this.lock = false;
    }

    initWidget() {
        super.initWidget();
        this.widget.createSquares(this.horizontal, this.vertical);
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
                this.setWidgetPrevent();
            },

            unlock: ()=>{
                this.lock = false;
                this.setWidgetPrevent();
            }
        }
    }

    makeWidgetData(resetData) {
        return {
            forbidden: true
        };
    }


    setWidgetPrevent() {
        if ((this.playingActor && this.playingActor.isRobot) || this.lock) {
            this.widgetData.forbidden = true;
        } else {
            this.widgetData.forbidden = false;
        }
    }

    tellPlayActorPutPiece(crood) {
        if (!this.playingActor.isRobot) {
            this.playingActor.putPiece(crood);
        }
    }

    // 传入刚下的子，判断是否获胜，向四个方向发散计算，到 5 个就赢啦
    isWin(piece, crood) {
        let directions = [
            {x:1},//横
            {y:1},//竖
            {x:1, y:-1},//斜
            {x:1, y:1} //反斜
        ];

        let calPiece = (crood, step, piece)=>{
            let pCount = 0;

            crood = {x: crood.x, y: crood.y};
            while(true) {
                for(var key in step) {
                    crood[key] += step[key]; //console.log(crood.x, crood.y);
                }
                if (
                    crood.x >= 0 && 
                    crood.y >=0 && 
                    crood.x < this.horizontal && 
                    crood.y < this.vertical &&
                    this.pieceData[crood.x][crood.y] === piece
                ) {
                    pCount++;
                } else {
                    break;
                }
            }
            return pCount;
        }

        for(let i = 0; i < directions.length; i++) {
            let direction = directions[i];
            let pieceCount = 1;

            let step;
            let curCrood = {x: Number(crood.x), y: Number(crood.y)}; // 当前判断的子

            // 正向
            step = direction;
            pieceCount += calPiece(curCrood, step, piece);

            // 反向
            step = {};
            step = direction;
            for(let key in direction) {
                step[key] = direction[key] * -1;
            }
            pieceCount += calPiece(curCrood, step, piece);

            if (pieceCount >= 5) {
                // console.log(1);
                return true;
            }
        }

    }

    // 放子
    receivePiece(pieceType, crood) {
        this.pieceData[crood.x][crood.y] = pieceType;
        this.widget.setSquare(pieceType, crood);

        return this.isWin(pieceType, crood);
        // console.log(pieceType, crood, this.playingActor.pieceType);
    }

    // 删除某个子，悔棋调用
    deletePiece(crood) {
        this.pieceData[crood.x][crood.y] = undefined;
        this.widget.setSquare('', crood);
    }

    getChessboardData() {
        return this.pieceData;
    }
}