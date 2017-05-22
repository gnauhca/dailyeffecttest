import {EventEmitter} from 'Src/js/common.js';

export default class Widget extends EventEmitter {
    constructor(page) {
        super();
        this.page = page;
        this.widgetData;
    }

    // 组件初始化
    init() {

    }

    handleActorOrder() {
        // 处理 actor 指令
        return {};
    }

    // 更新组件
    setData(data) {
        this.widgetData = data;
        // update 
    }

}