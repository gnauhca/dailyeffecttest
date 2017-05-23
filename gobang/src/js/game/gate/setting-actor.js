import Actor from '../actor.js';


export default class SettingActor extends Actor {
    init() {
        super.init();

        this.widget.addEventListener('setting-done', (setting) => {
            this.doSetting(setting);
        });
    }

    handleWidgetEvent() {
        // 处理 widget 交互事件
        return {
            'setting-done': (setting) => {
                this.doSetting(setting);
            },
            'back': () => {
                this.broadcast('back');
            }
        }
    }

    doSetting(setting) {
        this.broadcast('doSetting', setting);
    }

    makeWidgetData() {
        return {
            time: 5
        }
    }
}