import Stage from '../stage.js';
import SettingActor from './setting-actor';

export default class PlayStage extends Stage {
  constructor(game, view) {
    super(game, view);
    this.name = 'gate';
    this.settingActor;
  }

  init() {
    super.init();
    this.settingActor = this.createActor('Setting');
  }

  handleActorDispatch() {
    return {
      doSetting: (setting) => {
        this.game.goToStage('play', setting);
      },
      back: (setting) => {
        this.game.goToStage('avatar');
      },
    };
  }

  createActorConstructors() {
    return {
      Setting: SettingActor,
    };
  }
}
