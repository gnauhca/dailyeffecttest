import Actor from '../actor.js';


export default class ControlerActor extends Actor {
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

            lock: ()=>{
                this.stopTick()
            },

            unlock: ()=>{
                this.stopTick()
                this.startTick()
            },
            gameover: ()=>{
                this.stopTick();
            }
        }
    }

    makeWidgetData() {
        // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
        return {
            'total': '00 : 00',
            'left': '00 : 00',
            'right': '00 : 00',
        }
    }

    reset() {
        super.reset();
        this.totalTime = 0;
        this.playerTime = {
            'player1': 0,
            'player2': 0
        };
    }

    fillZero(num) {
        if (num < 10) {
            return '0' + num;
        }
        return num;
    }

    getTimeText(second) {
        let minuteStr = this.fillZero((second / 60) | 0);
        let secondStr = this.fillZero(second % 60);
        return `${minuteStr} : ${secondStr}`;
    }

    setWidgetData() {
        this.widgetData['total'] = this.getTimeText(this.totalTime);
        this.widgetData['left'] = this.getTimeText(this.playerTime['player1']);
        this.widgetData['right'] = this.getTimeText(this.playerTime['player2']);
    }

    timeup() {
        this.broadcast('timeup', this.playerTime);
    }

    startTick() {
        this.T = setInterval(()=>{
            // console.log(this.totalTime);
            this.totalTime += 1;

            this.playerTime[this.playingPlayer] += 1;
            this.playerTime[(this.playingPlayer==='player1'?'player2':'player1')] = this.totalTime - this.playerTime[this.playingPlayer];

            this.setWidgetData();
            if (this.totalTime > this.limitTime * 60) {
                this.timeup();
                return;
            }

        }, 1000);
    }

    stopTick() {
        clearInterval(this.T);
    }

}