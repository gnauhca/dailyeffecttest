import { globalData } from '../../global-data.js';
import msgMap from '../../msg-map.js';
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

  handleActorDispatch() {
    return {
      // 下子
      putPiece: (data) => {
        if (this.playingActor.pieceType !== data.pieceType) return;

        // 倘若赢棋，返回 true
        if (this.chessboradActor.receivePiece(data.pieceType, data.crood)) {
          const winner = this.playingActor;
          const msg = `${msgMap[this.playingActor.pieceType]}获胜， 游戏结束`;
          this.gameover({ winner, msg });
          return;
        }
        this.pieceStack.push(data);
        this.undoStack.length = 0;
        this.togglePlaying();
      },

      // 悔棋
      undo: (player, callback) => {
        const _callback = (isAgree) => {
          this.unlock();
          callback(isAgree);
        };
        const agree = () => {
          if (this.playingActor === player) {
            this.undoStack.push(this.pieceStack.pop());
            this.undoStack.push(this.pieceStack.pop());
          } else {
            this.undoStack.push(this.pieceStack.pop());
            this.setPlaying(player);
          }

          this.undoStack.forEach((p) => this.chessboradActor.deletePiece(p.crood));
          _callback(true);
        };
        const refuse = () => { _callback(false); };

        this.lock();
        if (this.player2Actor.isRobot) {
          agree();
        } else {
          const msg = `${msgMap[player.pieceType]} 想悔棋, 请问 ${msgMap[this.getOtherPlayer(player).pieceType]} 答应吗？`;
          this.controlerActor.showConfirm(msg, agree, refuse, '同意', '拒绝');
        }
      },

      // 撤销悔棋
      undoundo: (player) => {
        this.undoStack.forEach((p) => this.chessboradActor.receivePiece(p.pieceType, p.crood));
        if (this.undoStack.length === 1) {
          this.togglePlaying();
        }
        this.pieceStack.push(...this.undoStack);
        this.undoStack.length = 0;
      },

      // 请求和棋
      askDraw: (player) => {
        const _callback = () => { this.unlock(); };
        const agree = () => {
          const winner = null;
          const msg = '握手言和，游戏结束';
          this.gameover({ winner, msg });
        };
        const refuse = () => { _callback(); };

        this.lock();
        if (this.player2Actor.isRobot) {
          agree();
        } else {
          const msg = `${msgMap[player.pieceType]} 想求和, 请问 ${msgMap[this.getOtherPlayer(player).pieceType]} 答应吗？`;
          this.controlerActor.showConfirm(msg, agree, refuse, '同意', '拒绝');
        }
      },

      // 认输
      giveIn: (player) => {
        const winner = this.getOtherPlayer(player);
        const msg = `${msgMap[player.pieceType]} 认怂，游戏结束`;
        this.gameover({ winner, msg });
      },

      // 时间到
      timeup: (data) => {
        const winner = data.player1 === data.player2 ? null : data.player1 > data.player2 ? this.player2Actor : this.player1Actor;
        const msg = winner ? '耗时少者获胜' : '耗时相同';
        this.gameover({ winner, msg });
      },

      // 回到主页
      back: () => {
        this.game.goToStage('gate');
      },

      restart: () => {
        this.start();
      },
    };
  }

  createActorConstructors() {
    return {
      Chessboard: ChessboardActor,
      Timekeeper: TimekeeperActor,
      Player: PlayerActor,
      Robot: RobotActor,
      Controler: ControlerActor,
    };
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

  inactivate() {
    this.player2Actor.distory();
  }

  start() {
    this.pieceStack = [];
    this.undoStack = [];

    // console.log(globalData);

    // 重新分配两个玩家黑白子
    const player1PieceTypeIndex = (Math.random() * 2) | 0;

    const play1ResetData = {
      pieceType: this.pieceTypes[player1PieceTypeIndex],
      avatar: globalData.player1.avatar,
    };

    const play2ResetData = {
      pieceType: this.pieceTypes[1 - player1PieceTypeIndex],
      avatar: this.player2Actor.isRobot ? 'avatar-robot' : globalData.player2.avatar,
    };

    this.player1Actor.reset(play1ResetData);
    this.player2Actor.reset(play2ResetData);
    this.timekeeperActor.reset();

    const playingActor = play1ResetData.pieceType === this.pieceTypes[0] ? this.player1Actor : this.player2Actor;

    this.controlerActor.showMsg('重新分配黑白子...', 1000, () => {
      this.setPlaying(playingActor); // 黑子先走
      this.broadcast('start');
      this.unlock();
    });
  }

  setPlaying(playingActor) {
    this.playingActor = playingActor;
    this.broadcast('setPlaying', this.playingActor, this.chessboradActor.getChessboardData(), this.pieceStack);
  }

  getOtherPlayer(player) {
    return player === this.player1Actor ? this.player2Actor : this.player1Actor;
  }

  togglePlaying() {
    this.setPlaying(this.getOtherPlayer(this.playingActor));
  }

  // 执行确认操作时，需要锁定游戏
  lock() {
    this.broadcast('lock');
  }

  unlock() {
    this.broadcast('unlock');
  }

  gameover(overData) {
    this.lock();
    this.broadcast('gameover', overData);
  }
}
