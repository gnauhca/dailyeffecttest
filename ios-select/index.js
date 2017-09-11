require('./index.scss');
import { assign, assignIn } from 'lodash';


class IosSelector {
  constructor(options) {
    let defaults = {
      el: '', // dom 
      type: 'infinite', // infinite 无限滚动，normal 非无限 
      count: 20, // 圆环规格，圆环上选项个数，必须设置 4 的倍数
      sensitivity: 1, // 灵敏度
      source: [], // 选项 {value: xx, text: xx}
    };

    this.options = assignIn(defaults, options);
    this.options.count =  this.options.count - this.options.count % 4;
    assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 2; // 滚动减速度

    this.elems = {
      el: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null, // list

      highlightList: null,
      highListItems: null // list
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null
    }

    this.itemHeight = this.elems.el.offsetHeight * 2 / this.options.count; // 每项高度
    this.itemAngle = 360 / this.options.count; // 每项之间旋转度数
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180); // 圆环半径 


    this.scroll = 0; // 单位为一个 item 的高度（度数）
    this._init();
  }

  _init() {
    this._create(this.options.source);

    let touchData = {
      startY: 0
    };

    for (let eventName in this.events) {
      this.events[eventName] = ((eventName) => {
        return (e) => {
          if (this.elems.el.contains(e.target) || e.target === this.elems.el) {
            this['_' + eventName](e, touchData);
          }
        };
      })(eventName);
    }

    document.addEventListener('touchstart', this.events.touchstart);
    // document.addEventListener('touchmove', this.events.touchmove);
    document.addEventListener('touchend', this.events.touchend);
    this.moveTo(0);
  }

  _touchstart(e, touchData) {
    document.addEventListener('touchmove', this.events.touchmove);
    touchData.startY = e.touches[0].clientY;
    touchData.startTime = new Date().getTime();
    console.log('start');
  }

  _touchmove(e, touchData) {
    // console.log('move');
    touchData.endY = e.touches[0].clientY;

    let scrollAdd = (touchData.startY - touchData.endY) / this.itemHeight;
    touchData.touchScroll = this.moveTo(this.scroll + scrollAdd);
  }

  _touchend(e, touchData) {
    document.removeEventListener('touchmove', this.events.touchmove);
    // 计算速度
    let endTime = new Date().getTime();
    let v = (touchData.touchScroll - this.scroll) * 1000 / (new Date().getTime() - touchData.startTime);

    this.scroll = touchData.touchScroll;
    this.move(v);

    console.log('end');
  }

  _create(source) {

    if (!source.length) {
      return;
    }

    let template = `
      <div class="select-wrap">
        <ul class="select-options" style="transform: translateZ(${-this.radius}px) rotateX(0deg);">
          {{circleListHTML}}
          <!-- <li class="select-option">a0</li> -->
        </ul>
        <div class="highlight">
          <ul class="highlight-list">
            <!-- <li class="highlight-item"></li> -->
            {{highListHTML}}
          </ul>
        </div>
      </div>
    `;

    // source 处理
    if (this.options.type === 'infinite') {
      let concatSource = [].concat(source);
      while (concatSource.length < this.halfCount) {
        concatSource = concatSource.concat(source);
      }
      source = concatSource;
    }
    this.source = source;
    let sourceLength = source.length;

    // 圆环 HTML
    let circleListHTML = '';
    for (let i = 0; i < source.length; i++) {
      circleListHTML += `<li class="select-option"
                    style="
                      height: ${this.itemHeight}px;
                      transform: rotateX(${-this.itemAngle * i}deg) translateZ(${this.radius}px);
                    "
                    data-index="${i}"
                    >${source[i].text}</li>`
    }

    if (this.options.type === 'infinite') {

      for (let i = 0; i < this.quarterCount; i++) {
        // 头
        circleListHTML = `<li class="select-option"
                      style="
                        height: ${this.itemHeight}px;
                        transform: rotateX(${this.itemAngle * (i + 1)}deg) translateZ(${this.radius}px);
                      "
                      data-index="${-i - 1}"
                      >${source[sourceLength - i - 1].text}</li>` + circleListHTML;
        // 尾
        circleListHTML += `<li class="select-option"
                      style="
                        height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translateZ(${this.radius}px);
                      "
                      data-index="${i + sourceLength}"
                      >${source[i].text}</li>`;
      }
    }


    // 中间高亮 HTML
    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`
    }
    // 高亮头尾补一个
    highListHTML = `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[sourceLength - 1].text}
                    </li>` + highListHTML;
    highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`


    this.elems.el.innerHTML = template
                                .replace('{{circleListHTML}}', circleListHTML)
                                .replace('{{highListHTML}}', highListHTML);
    this.elems.circleList = this.elems.el.querySelector('.select-options');
    this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');

    this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
    this.elems.highlightitem = this.elems.el.querySelectorAll('.highlight-item');
  }

  move(initV) {

  }

  moveTo(scroll) {
    while(scroll < 0) {
      scroll += this.source.length;
    }
    scroll = scroll % this.source.length;

    this.elems.circleList.style.transform = `translateZ(${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
         
    [...this.elems.circleItems].forEach(itemElem => {
      if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
        itemElem.style.visibility = 'hidden';
      } else {
        itemElem.style.visibility = 'visible';
      }
    });

    console.log(scroll);
    // console.log(`translateZ(${-this.radius}px) rotateX(${-this.itemAngle * scroll}deg)`);
    return scroll;
  }

  updateSource(source) {

  }

  select(value) {

  }



  destroy() {

  }
}



let iosSelector = new IosSelector({
  el: '#iosSelector',
  count: 20,
  source: [
    { value: 1, text: '01' },
    { value: 2, text: '02' },
    { value: 3, text: '03' },
    { value: 4, text: '04' },
    { value: 5, text: '05' },
    { value: 6, text: '06' },
    { value: 7, text: '07' },
    { value: 8, text: '08' }
  ]
});

console.log(iosSelector);


