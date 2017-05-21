import Page from '../page.js';
import AvatarSelectorWidget from './avatarselector-widget.js';

export default class AvatarPage extends Page {
    constructor(elem) {
        super(elem);
    }

    createWidgetConstructors() {
        return { AvatarSelector: AvatarSelectorWidget}
    }

    show() {
        super.show();
    }
}