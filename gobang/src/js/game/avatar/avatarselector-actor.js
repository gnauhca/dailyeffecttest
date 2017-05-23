import Actor from '../actor.js';


export default class AvatarSelectorActor extends Actor {
    init() {
        super.init();
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'select-done': (selected)=>{
                this.selectAvatar(selected);
            }
        }
    }

    selectAvatar(selected) {
        // console.log(selected);
        this.dispatch('selectAvatar', selected);
    }
}