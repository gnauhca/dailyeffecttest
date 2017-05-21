import {EventEmitter} from 'Src/js/common.js';

export default class Widget extends EventEmitter {
    constructor(page) {
        super();
        this.page = page;
    }

    // 组件初始化
    init() {

    }

    // 更新组件
    setData(data) {
        // update 
    }

}