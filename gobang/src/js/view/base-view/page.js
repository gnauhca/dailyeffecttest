export default class Page {
    constructor() {
        this.widgets = [];
        this.data;
        this.widgetFactory;
    }

    init() {
        let WidgetConstructors = this.createWidgetConstructors();
        this.widgetFactory = {
            constructors: WidgetConstructors,
            getWidget: (name)=>{
                return (new WidgetConstructors[name](this));
            }
        }
    }

    createWidgetConstructors() {
        // 重写此方法，返回包含本 page 要用到的所有 widget 构造函数，用于按需创建 widget
    }

    createWidget(name) {
        // create widget
        let widget = this.widgetFactory.getWidget(name);
        widget.id = 'widget_' + (new Date).getTime() + (Math.random() * 1000000)|0;
        this.widgets.push(widget);

        return widget;
    }

    removeWidget(widget) {
        this.widgets = this.widgets.filter( w => w !== widget );
    }

    show(data) {
        this.data = data;
    }

    hide() {
        
    }
}