export default class Stage {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isInit = false;
        this.active = false;
        this.data;

        this.actors = [];
        this._orders;
        this.actorFactory;
    }

    init() {
        this.isInit = true;
        this.activate && this.activate();

        this._orders = this.orders();

        let ActorConstructors = this.createActorConstructors();
        this.actorFactory = {
            constructors: ActorConstructors,
            getActor: (name)=>{
                return ( new ActorConstructors[name](this, this.view.createWidget(name)) );
            }
        }
    }

    createActorConstructors() {
        // 重写此方法，返回包含本 stage 要用到的所有 Actor 构造函数，用于按需创建 actor
    }

    createActor(name) {
        // 创建舞台演员
        let actor = this.actorFactory.getActor(name);
        actor.id = 'actor_' + (new Date).getTime() + (Math.random() * 1000000)|0;
        this.actors.push(actor);
        actor.init();

        return actor;
    }


    orders() {
        // 重写此方法，返回包含多个命令函数的对象，用于 actor 发送公共命令
    }

    // 收到信息，执行命令
    excuteOrder(orderName, data) {
        this._orders[orderName](data);
    }

    getActorsData(data) {
        return data;
    }

    activate(data) {
        this.active = true;
        // 首次激活需要初始化
        if (!this.isInit) {
            this.view.init();
            this.init();
            return; 
        }
        this.data = data;
        
        
        let actorsData = this.getActorsData(data);

        // 每个 actor 各自激活
        for (let actorName in this.actors) {
            this.actors[actorName].activate(actorsData[actorName]);
        }

        this.view && this.view.show();
    }

    inactivate() {
        this.active = false;
        this.view && this.view.hide();

        // 每个 actor 各自休眠
        for (let actorName in this.actors) {
            this.actors[actorName].inactivate();
        }
    }
}