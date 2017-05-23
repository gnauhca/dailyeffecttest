import Widget from '../widget.js';

export default class TimekeeperWidget extends Widget {
    init() {
        this.eLeft = this.page.elem.querySelector('.time-left');
        this.eTotal = this.page.elem.querySelector('.time-total');
        this.eRight = this.page.elem.querySelector('.time-right');
    }

    watch() {
        return {
            'left': ()=>{this.eLeft.innerHTML = this.widgetData.left;},
            'right': ()=>{this.eRight.innerHTML = this.widgetData.right;},
            'total': ()=>{
                this.eTotal.innerHTML = this.widgetData.total;
            }
        }
    }

}