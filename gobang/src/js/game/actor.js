export default class Actor {
  constructor(stage, widget) {
    this.stage = stage;
    this.widget = widget;
    this.widgetData;
    this.resetData;
    this.stageBroadcastHandlers = this.handleStageBoardcast();
    this.widgetEventHandlers = this.handleWidgetEvent();
  }

  init() {
    for (const eventName in this.widgetEventHandlers) {
      this.widget.addEventListener(eventName, this.widgetEventHandlers[eventName]);
    }
  }

  initWidget() {
    this.widget.init();
  }

  handleStageBoardcast() {
    // 重写此方法，返回包含多个消息处理函数的对象，用于处理 stage 对 actor 发出的消息
    return {};
  }

  handleWidgetEvent() {
    // 处理 widget 交互事件
    return {};
  }

  // 向 stage 发送消息
  dispatch() {
    const args = [...arguments];
    const msg = args.shift();

    this.stage.actorDispatchHandlers[msg] && this.stage.actorDispatchHandlers[msg](...args);
  }

  makeWidgetData(actorResetData) {
    // 重置 actor 时，需要重置它所使用的 widget, 这里返回的对象，就是用来记录一些 widget 初始状态的数据
    return actorResetData;
  }

  reset(actorResetData) {
    this.resetData = actorResetData;
    // 重置，在 stage 离开时，需要重置持久(生命周期与stage想同)的 actor
    this.widgetData = this.makeWidgetData(actorResetData);
    this.widget.setData(this.widgetData);
    this.widget.reset();
  }

  distory() {
    this.widget.distory();
    this.stage.removeActor(this);
    this.stage = null;
    this.widget = null;
    this.widgetData = null;
  }
}
