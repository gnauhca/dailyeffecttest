import Page from '../page.js';
import AvatarSelectorWidget from './avatarselector-widget.js';

export default class AvatarPage extends Page {

    createWidgetConstructors() {
        return { AvatarSelector: AvatarSelectorWidget}
    }

}