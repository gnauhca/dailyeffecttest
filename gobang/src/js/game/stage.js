export default class Stage {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.isInit = false;
        this.active = false;
        this.activateData;

        this.actors = [];
        this.actorBroadcastHandlers = this.handleActorBroadcast();
        this.actorFactory;
    }

    init() {

        let ActorConstructors = this.createActorConstructors();
        this.actorFactory = {
            constructors: ActorConstructors,
            getActor: (name)=>{
                // console.log(name);
                return ( new ActorConstructors[name](this, this.view.createWidget(name)) );
            }
        }
    }

    createActorConstructors() {
        // 重写此方法，返回包含本 stage 要用到的所有 Actor 构造函数，用于按需创建 actor
    }

    createActor(name, ...initArgs) {
        // 创建舞台演员
        let actor = this.actorFactory.getActor(name);

        actor.name = name;
        actor.id = 'actor_' + (new Date).getTime() + (Math.random() * 1000000)|0;
        this.actors.push(actor);
        actor.init(...initArgs);
        actor.initWidget();

        return actor;
    }

    removeActor(actor) {
        this.actors.splice(this.actors.indexOf(actor), 1);
    }


    handleActorBroadcast() {
        // 重写此方法，返回包含多个消息处理函数的对象，用于处理 actor 对 stage 发出的消息
        return {};
    }

    // 向当前 stage 所有的 actor 发送消息
    dispatch() {
        let args = [...arguments];
        let msg = args.shift();
        this.actors.forEach(
            a=>a.stageDispatchHandlers[msg] && a.stageDispatchHandlers[msg](...args)
        );
    }

    getActorResetDatas(activateData) {
        return {};
    }

    _activate(data) {
        this.active = true;
        // 首次激活需要初始化
        if (!this.isInit) {
            this.isInit = true;
            this.view.init();
            this.init();
            // return false; 
        }
        this.activateData = data;

        let actorResetDatas = this.getActorResetDatas(this.activateData);

        this.actors.forEach(w=>w.reset(actorResetDatas[w.name]));
        this.activate(data);
        this.view && this.view.show();
    }

    activate() {
        // 重写此方法，激活之后的操作，在视图显示之前
    }

    _inactivate() {
        this.active = false;
        this.view && this.view.hide();

        this.inactivate();
    }

    inactivate() {
        // 重写此方法，离开之后的操作，在视图消失之后
    }
}