import BasePage from '../base-view/page.js'

export default class Page extends BasePage {
    constructor(elem) {
        super();
        this.elem = elem;
    }
    show() {
        this.elem.classList.add("show");
    }
    hide() {
        this.elem.classList.remove("show");
    }
}