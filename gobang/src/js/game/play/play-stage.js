import {globalData} from 'Src/js/global-data.js';
import Stage from '../stage.js';
import ChessboardActor from './chessboard-actor.js';
import TimekeeperActor from './timekeeper-actor.js';
import PlayerActor from './player-actor.js';
import RobotActor from './robot-actor.js';
import ControlerActor from './controler-actor.js';



export default class PlayStage extends Stage {

    constructor(game, view) {
        super(game, view);
        this.name = 'play';
        // this.settingActor;

        this.chessboradActor;
        this.timeCounterActor;
        this.player1Actor; // 玩家 1 固定玩家
        this.controlerActor;

        this.pieceStack = []; // 每一步下子记录
        this.undoStack = []; // 上一次悔棋记录，用于撤销悔棋
        this.pieceTypes = ['black', 'white'];
        this.playingActor; // 当前需要下子的玩家是黑子还是白子 ， 'black', 'white'

    }

    init() {
        super.init();
        this.chessboradActor = this.createActor('Chessboard');
        this.timekeeperActor = this.createActor('Timekeeper');
        this.player1Actor = this.createActor('Player', 'player1');
        this.controlerActor = this.createActor('Controler');
    }

    handleActorBroadcast() {
        return {
            // 下子
            putPiece: (data)=>{
                if (this.playingActor.pieceType !== data.pieceType) return;

                this.chessboradActor.receivePiece(data.pieceType, data.crood);
                this.pieceStack.push(data);
                this.togglePlaying();
            },

            // 悔棋
            undo: (player)=>{

            },

            // 撤销悔棋
            undoundo: (player)=>{

            },

            // 认输
            giveIn: (player)=>{
                // this.gameover();
            },

            // 时间到
            timeup: (data)=>{
                let winner = data.player1 === data.player2 ? null : data.player1 > data.player2 ? this.player2Actor : this.player1Actor;
                let msg = winner ? '耗时少者获胜' : '耗时相同';
                this.gameover({winner, msg});
            }
        }
    }


    createActorConstructors() {
        return {
            Chessboard: ChessboardActor,
            Timekeeper: TimekeeperActor,
            Player: PlayerActor,
            Robot: RobotActor,
            Controler: ControlerActor
        }
    }

    activate(data) {
        super.activate();
        this.time = data.time;
        this.mode = data.mode;

        if (this.mode === 'duet') {
            this.player2Actor = this.createActor('Player', 'player2');
        } else {
            this.player2Actor = this.createActor('Robot', 'player2', true);
        }

        this.timekeeperActor.setLimitTime(this.time);
        this.start();
    }

    start() {
        this.pieceStack = [];
        this.undoStack = [];

        // 重新分配两个玩家黑白子
        let player1PieceTypeIndex = (Math.random() * 2)|0;

        let play1ResetData = {
            pieceType: this.pieceTypes[player1PieceTypeIndex],
            avatar: globalData.player1.avatar
        };

        let play2ResetData = {
            pieceType: this.pieceTypes[1 - player1PieceTypeIndex],
            avatar: this.player2Actor.isRobot ? 'robot' : globalData.player2.avatar
        };

        this.player1Actor.reset(play1ResetData);
        this.player2Actor.reset(play2ResetData);


        let playingActor = play1ResetData.pieceType === this.pieceTypes[0] ? this.player1Actor: this.player2Actor;

        this.controlerActor.showMsg('正在重新分配黑白子...', 20, ()=>{
            this.setPlaying(playingActor); // 黑子先走
            this.unlock();

            this.dispatch('start');
        });
    }

    setPlaying(playingActor) {
        this.playingActor = playingActor;
        this.dispatch('setPlaying', this.playingActor);
    }

    togglePlaying() {
        this.setPlaying(this.playingActor===this.player1Actor?this.player2Actor:this.player1Actor)
    }

    // 执行确认操作时，需要锁定游戏
    lock() {
        this.dispatch('lock');
    }

    unlock() {
        this.dispatch('unlock');
    }

    gameover(overData) {
        this.dispatch('gameover', overData);
    }




}