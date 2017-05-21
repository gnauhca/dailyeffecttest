export default class Actor {
    constructor(stage, widget) {
        this.stage = stage;
        this.widget = widget;
        this.widgetData;
    }

    init() {
        this.widget.init();
    }

    getWidgetData(data) {
        return data;
    }

    updateWidget() {
        this.widgetData = getWidgetData(this.data);
        this.widget.setData(this.widgetData);
    }

    activate(data) {
        this.data = data;
        updateWidget();
    }

    inactivate() {
        // inactivate
    }
}