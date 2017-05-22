import PlayActor from '../actor.js';


export default class ControlerActor extends PlayActor {
    init() {
        super.init();
        this.totalTime = 0;
        this.playerTime = {
            'player1': 0,
            'player2': 0
        };
        this.playingPlayer = 'player1';
        this.limitTime = 0;
        this.T;
    }

    setLimitTime(limitTime) {
        this.limitTime = limitTime;
    }

    handleStageDispatch() {
        return {
            setPlaying: (playingActor)=>{
                this.playingPlayer = playingActor.role;
            },

            start: ()=>{
                this.totalTime = 0;
                this.playerTime = {
                    'player1': 0,
                    'player2': 0
                };
                this.widget.setData(this.getWidgetTimeData());
            },

            lock: ()=>{
                this.stopTick()
            },

            unlock: ()=>{
                this.startTick()
            }
        }
    }

    makeWidgetData() {
        // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
        return this.getWidgetTimeData();
    }

    getTimeText(second) {
        return `${(second / 60) | 0} : ${(second % 60)}`;
    }

    getWidgetTimeData() {

        return {
            'total': this.getTimeText(this.totalTime),
            'left': this.getTimeText(this.playerTime['player1']),
            'right': this.getTimeText(this.playerTime['player2']),
        }
    }

    timeup() {
        this.broadcast('timeup', this.playerTime);
    }

    startTick() {
        this.T = setInterval(()=>{
            // console.log(this.totalTime);
            this.totalTime += 1;
            if (this.totalTime > this.limitTime * 60) {
                this.timeup();
                return;
            }

            this.playerTime[this.playingPlayer] += 1;
            this.playerTime[(this.playingPlayer==='player1'?'player2':'player1')] = this.totalTime - this.playerTime[this.playingPlayer];

            this.widget.updateTime(this.getWidgetTimeData());
        }, 1000);
    }

    stopTick() {
        clearInterval(this.T);
    }

}