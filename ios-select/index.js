require('./index.scss');
// import { assign, assignIn } from 'lodash';


class IosSelector {
  constructor(options) {
    let defaults = {
      el: '', // dom 
      type: 'infinite', // infinite 无限滚动，normal 非无限 
      count: 20, // 圆环规格，圆环上选项个数，必须设置 4 的倍数
      sensitivity: 0.8, // 灵敏度
      source: [], // 选项 {value: xx, text: xx}
      onChange: null
    };

    this.options = Object.assign({}, defaults, options);
    this.options.count =  this.options.count - this.options.count % 4;
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 10; // 滚动减速度
    this.minV = Math.sqrt(1 / this.a); // 最小初速度
    this.selected = this.source[0];

    this.exceedA = 100; // 超出减速 
    this.moveT = 0; // 滚动 tick

    this.elems = {
      el: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null, // list

      highlight: null,
      highlightList: null,
      highListItems: null // list
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null
    }

    this.itemHeight = this.elems.el.offsetHeight * 3 / this.options.count; // 每项高度
    this.itemAngle = 360 / this.options.count; // 每项之间旋转度数
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180); // 圆环半径 


    this.scroll = 0; // 单位为一个 item 的高度（度数）
    this._init();
  }

  _init() {
    this._create(this.options.source);

    let touchData = {
      startY: 0,
      yArr: []
    };

    for (let eventName in this.events) {
      this.events[eventName] = ((eventName) => {
        return (e) => {
          if (this.elems.el.contains(e.target) || e.target === this.elems.el) {
            e.preventDefault();
            this['_' + eventName](e, touchData);
          }
        };
      })(eventName);
    }

    document.addEventListener('touchstart', this.events.touchstart);
    // document.addEventListener('touchmove', this.events.touchmove);
    document.addEventListener('touchend', this.events.touchend);
    this._moveTo(0);
  }

  _touchstart(e, touchData) {
    console.log(e);
    document.addEventListener('touchmove', this.events.touchmove);
    touchData.startY = e.touches[0].clientY;
    touchData.yArr = [[e.touches[0].clientY, new Date().getTime()]];
    touchData.touchScroll = this.scroll;
    window.cancelAnimationFrame(this.moveT);

    console.log('start');
  }

  _touchmove(e, touchData) {
    touchData.yArr.push([e.touches[0].clientY, new Date().getTime()]);
    if (touchData.length > 5) {
      touchData.unshift();
    }

    let scrollAdd = (touchData.startY - e.touches[0].clientY) / this.itemHeight;
    let moveToScroll = scrollAdd + this.scroll;

    // 非无限滚动时，超出范围使滚动变得困难
    if (this.type === 'normal') {
      if (moveToScroll < 0) {
        moveToScroll *= 0.3;
      } else if (moveToScroll > this.source.length) {
        moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
      }
    }

    touchData.touchScroll = this._moveTo(this.scroll + scrollAdd);
  }

  _touchend(e, touchData) {
    // console.log(e);
    document.removeEventListener('touchmove', this.events.touchmove);

    let v;

    if (touchData.yArr.length === 1) {
      v = 0;
    } else {
      let startTime = touchData.yArr[touchData.yArr.length - 2][1];
      let endTime = touchData.yArr[touchData.yArr.length - 1][1];
      let startY = touchData.yArr[touchData.yArr.length - 2][0];
      let endY = touchData.yArr[touchData.yArr.length - 1][0];

      // 计算速度
      v = ((startY - endY) / this.itemHeight) * 1000 / (endTime - startTime);
      let sign = v > 0 ? 1 : -1;

      v = Math.abs(v) > 30 ? 30 * sign : v;
    }

    this.scroll = touchData.touchScroll;
    this._move(v);

    // console.log('end');
  }

  _create(source) {

    if (!source.length) {
      return;
    }

    let template = `
      <div class="select-wrap">
        <ul class="select-options" style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);">
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
                      top: ${this.itemHeight * -0.5}px;
                      height: ${this.itemHeight}px;
                      line-height: ${this.itemHeight}px;
                      transform: rotateX(${-this.itemAngle * i}deg) translate3d(0, 0, ${this.radius}px);
                    "
                    data-index="${i}"
                    >${source[i].text}</li>`
    }

    // 中间高亮 HTML
    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`
    }


    if (this.options.type === 'infinite') {

      // 圆环头尾
      for (let i = 0; i < this.quarterCount; i++) {
        // 头
        circleListHTML = `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${this.itemAngle * (i + 1)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${-i - 1}"
                      >${source[sourceLength - i - 1].text}</li>` + circleListHTML;
        // 尾
        circleListHTML += `<li class="select-option"
                      style="
                        top: ${this.itemHeight * -0.5}px;
                        height: ${this.itemHeight}px;
                        line-height: ${this.itemHeight}px;
                        transform: rotateX(${-this.itemAngle * (i + sourceLength)}deg) translate3d(0, 0, ${this.radius}px);
                      "
                      data-index="${i + sourceLength}"
                      >${source[i].text}</li>`;
      }

      // 高亮头尾
      highListHTML = `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                          ${source[sourceLength - 1].text}
                      </li>` + highListHTML;
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`
    }

    this.elems.el.innerHTML = template
                                .replace('{{circleListHTML}}', circleListHTML)
                                .replace('{{highListHTML}}', highListHTML);
    this.elems.circleList = this.elems.el.querySelector('.select-options');
    this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');


    this.elems.highlight = this.elems.el.querySelector('.highlight');
    this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
    this.elems.highlightitems = this.elems.el.querySelectorAll('.highlight-item');

    this.elems.highlight.style.height = this.itemHeight + 'px';
    this.elems.highlight.style.lineHeight = this.itemHeight + 'px';

  }


  _moveTo(scroll) {
    if (this.type === 'infinite') {
      while(scroll < 0) {
        scroll += this.source.length;
      }
      scroll = scroll % this.source.length;
    }

    this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    this.elems.highlightList.style.transform = `translate3d(0, ${-(scroll + 1) * this.itemHeight}px, 0)`;

    [...this.elems.circleItems].forEach(itemElem => {
      if (Math.abs(itemElem.dataset.index - scroll) > this.quarterCount) {
        itemElem.style.visibility = 'hidden';
      } else {
        itemElem.style.visibility = 'visible';
      }
    });

    // console.log(scroll);
    // console.log(`translate3d(0, 0, ${-this.radius}px) rotateX(${-this.itemAngle * scroll}deg)`);
    return scroll;
  }


  _move(initV) {

    // console.log(initV);

    let start = new Date().getTime() / 1000;
    let pass = 0;
    let initScroll = this.scroll;

    let a = initV > 0 ? -this.a : this.a; // 减速加速度
    let t = Math.abs(initV / a); // 速度减到 0 花费时间
    let totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
    let finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数

    totalScrollLen = finalScroll - this.scroll;

    // 取整后反推加速度，初速度
    a = totalScrollLen > 0 ? -this.a : this.a; 
    t = Math.sqrt(totalScrollLen * 2 / -a);
    initV = -a * t;

    // console.log(initV, t, a, totalScrollLen);

    // scroll 取整后，微调 initV 
    initV = (totalScrollLen - a * t * t / 2) / t;

    let moveScrollLen; // 已经移动的

    let tick = () => {
      pass = new Date().getTime() / 1000 - start;

      if (pass < t) {
        moveScrollLen = initV * pass + a * pass * pass / 2;
        this.moveT = window.requestAnimationFrame(tick);
        this.scroll = this._moveTo(initScroll + moveScrollLen);
      } else {
        moveScrollLen = totalScrollLen;
        this.scroll = this._moveTo(initScroll + moveScrollLen);
        this.selected = this.source[this.scroll];
        this.onChange && this.onChange(this.selected);
      }
    }
    tick();
  }

  // 超出部分，非 infinite 情况
  _exceedMove(initV) {

  }

  // 回弹
  _exceedBackMove() {

  }

  updateSource(source) {
    this._create(source);
  }

  select(value) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].value === value) {
        this._moveTo(i);
        return;
      }
    }
  }

  destroy() {
    // document 事件解绑
    for (let eventName in this.events) {
      document.removeEventListener('eventName', this.events[eventName]);
    }
    // 元素移除
    this.elems.el.innerHTML = '';
    this.elems = null;
  }
}


export default IosSelector;


