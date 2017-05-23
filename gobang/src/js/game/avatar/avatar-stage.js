import {globalData} from 'Src/js/global-data.js';
import Stage from '../stage.js';
import AvatarSelectorActor from './avatarselector-actor.js';


export default class AvatarStage extends Stage {

    constructor(game, view) {
        super(game, view);
        this.name = 'avatar';
        this.data;
        this.avatarSelectorActor;
    }

    init() {
        super.init();
        this.avatarSelectorActor = this.createActor('AvatarSelector');
    }


    handleActorBroadcast() {
        return {
            selectAvatar: (selected)=>{
                globalData.player1.avatar = selected.player1Avatar;
                globalData.player2.avatar = selected.player2Avatar;
                this.game.goToStage('gate');
                // console.log(globalData);
            }
        }
    }

    createActorConstructors() {
        return {
            AvatarSelector: AvatarSelectorActor
        }
    }

    inactivate() {
        super.inactivate();
    }
}