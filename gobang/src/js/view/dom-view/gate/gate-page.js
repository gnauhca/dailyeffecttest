import Page from '../page.js';
import SettingWidget from './setting-widget.js';

export default class GatePage extends Page {
    createWidgetConstructors() {
        return { Setting: SettingWidget}
    }    
}