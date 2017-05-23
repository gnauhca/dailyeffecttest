import {EventEmitter} from 'Src/js/common.js';

export default class Widget extends EventEmitter {
    constructor(page) {
        super();
        this.page = page;
        this.widgetData;
        this.watchMethods = this.watch();
    }

    // 组件初始化
    init() {

    }

    watch() {
        // 返回对 widgetData 的每个值的监听函数
        return {};
    }

    // 更新组件
    setData(data) {
        let that = this;

        /*for (let key in this.widgetData) {
            this.widgetData.__defineSetter__(key, ()=>{});
            this.widgetData.__defineGetter__(key, ()=>{});
        }*/

        this.widgetData = data;

        // 为新的 widgetData 设置 setter 监听
        for (let key in data) {
            data['____' + key] = data[key];
            data.__defineSetter__(key, function(val){
                that.watchMethods['*'] && that.watchMethods['*']();
                that.watchMethods[key] && that.watchMethods[key](val);
                this['____' + key] = val;
            });
            data.__defineGetter__(key, function(){ return this['____' + key];});
            this.watchMethods[key] && this.watchMethods[key](data[key]);
        }
    }

    reset() {}

    distory() {
        this.page = null;
    }

}