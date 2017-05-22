import Widget from '../widget.js';

export default class SettingWidget extends Widget {
    init() {
        this.eTime = this.page.elem.querySelectorAll('#gate-time .option');
        this.eMode = this.page.elem.querySelectorAll('#gate-mode .option');
        this.initEvent();

        this.time = 5;
        this.mode = 'duet';
    }

    initEvent() {
        [...this.eTime].forEach((time)=>{
            time.addEventListener('click', ()=>{ 
                [...this.eTime].forEach(t=>t.classList.remove('selected'));
                time.classList.add('selected');
                this.time = time.dataset.time;
            });
        });

        [...this.eMode].forEach((mode)=>{
            mode.addEventListener('click', ()=>{
                this.mode = mode.dataset.mode;
                this.settingDone();
            });
        });

    }


    settingDone() {
        this.trigger('setting-done', {
            time: this.time,
            mode: this.mode
        });
    }
}
