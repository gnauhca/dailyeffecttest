import Actor from '../actor.js';


export default class AvatarSelectorActor extends Actor {
    init() {
        super.init();

        this.widget.addEventListener('select-done', (selected) => {
            this.selectAvatar(selected);
        });
    }

    selectAvatar(selected) {
        console.log(selected);
        this.stage.excuteOrder('selectAvatar', selected);
    }

}