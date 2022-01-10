export default class Stage {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.isInit = false;
    this.active = false;
    this.activateData;

    this.actors = [];
    this.actorDispatchHandlers = this.handleActorDispatch();
    this.actorFactory;
  }

  init() {
    const ActorConstructors = this.createActorConstructors();
    this.actorFactory = {
      constructors: ActorConstructors,
      getActor: (name) =>
      // console.log(name);
        (new ActorConstructors[name](this, this.view.createWidget(name)))
      ,
    };
  }

  createActorConstructors() {
    // 重写此方法，返回包含本 stage 要用到的所有 Actor 构造函数，用于按需创建 actor
  }

  createActor(name, ...initArgs) {
    // 创建舞台演员
    const actor = this.actorFactory.getActor(name);

    actor.name = name;
    actor.id = `actor_${(new Date()).getTime()}${Math.random() * 1000000}` | 0;
    this.actors.push(actor);
    actor.init(...initArgs);
    actor.initWidget();

    return actor;
  }

  removeActor(actor) {
    this.actors.splice(this.actors.indexOf(actor), 1);
  }

  handleActorDispatch() {
    // 重写此方法，返回包含多个消息处理函数的对象，用于处理 actor 对 stage 发出的消息
    return {};
  }

  // 向当前 stage 所有的 actor 发送消息
  broadcast() {
    const args = [...arguments];
    const msg = args.shift();
    this.actors.forEach(
      (a) => a.stageBroadcastHandlers[msg] && a.stageBroadcastHandlers[msg](...args),
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

    const actorResetDatas = this.getActorResetDatas(this.activateData);

    this.actors.forEach((w) => w.reset(actorResetDatas[w.name]));
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
