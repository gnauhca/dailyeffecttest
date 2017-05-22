import Widget from '../widget.js';

export default class TimekeeperWidget extends Widget {
    init() {
        this.eLeft = this.page.elem.querySelector('.time-left');
        this.eTotal = this.page.elem.querySelector('.time-total');
        this.eRight = this.page.elem.querySelector('.time-right');

    }

    updateTime(timeData) {
        this.eLeft.innerHTML = timeData.left;
        this.eRight.innerHTML = timeData.right;
        this.eTotal.innerHTML = timeData.total;
    }
}