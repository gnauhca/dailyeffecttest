/**
 * author: zzc,
 * https://github.com/gnauhca/dailyeffecttest/tree/master/ios-select
 */
const easing = {
  easeOutCubic(pos) {
    return ((pos - 1) ** 3 + 1);
  },
  easeOutQuart(pos) {
    return -((pos - 1) ** 4 - 1);
  },
};

class IosSelector {
  constructor(options) {
    const defaults = {
      el: '', // dom
      type: 'infinite', // infinite 无限滚动，normal 非无限
      count: 20, // 圆环规格，圆环上选项个数，必须设置 4 的倍数
      sensitivity: 0.8, // 灵敏度
      source: [], // 选项 {value: xx, text: xx}
      value: null,
      onChange: null,
    };

    this.options = { ...defaults, ...options };
    this.options.count = this.options.count - this.options.count % 4;
    Object.assign(this, this.options);

    this.halfCount = this.options.count / 2;
    this.quarterCount = this.options.count / 4;
    this.a = this.options.sensitivity * 10; // 滚动减速度
    this.minV = Math.sqrt(1 / this.a); // 最小初速度
    this.selected = this.source[0];

    this.exceedA = 10; // 超出减速
    this.moveT = 0; // 滚动 tick
    this.moving = false;

    this.elems = {
      el: document.querySelector(this.options.el),
      circleList: null,
      circleItems: null, // list

      highlight: null,
      highlightList: null,
      highListItems: null, // list
    };
    this.events = {
      touchstart: null,
      touchmove: null,
      touchend: null,
    };

    this.itemHeight = this.elems.el.offsetHeight * 3 / this.options.count; // 每项高度
    this.itemAngle = 360 / this.options.count; // 每项之间旋转度数
    this.radius = this.itemHeight / Math.tan(this.itemAngle * Math.PI / 180); // 圆环半径

    this.scroll = 0; // 单位为一个 item 的高度（度数）
    this._init();
  }

  _init() {
    this._create(this.options.source);

    const touchData = {
      startY: 0,
      yArr: [],
    };

    for (const eventName in this.events) {
      this.events[eventName] = ((eventName) => (e) => {
        if (this.elems.el.contains(e.target) || e.target === this.elems.el || eventName === 'touchend') {
          e.preventDefault();
          if (this.source.length) {
            this[`_${eventName}`](e, touchData);
          }
        }
      })(eventName);
    }

    this.elems.el.addEventListener('touchstart', this.events.touchstart);
    document.addEventListener('mousedown', this.events.touchstart);
    this.elems.el.addEventListener('touchend', this.events.touchend);
    document.addEventListener('mouseup', this.events.touchend);
    if (this.source.length) {
      this.value = this.value !== null ? this.value : this.source[0].value;
      this.select(this.value);
    }
  }

  _touchstart(e, touchData) {
    this.elems.el.addEventListener('touchmove', this.events.touchmove);
    document.addEventListener('mousemove', this.events.touchmove);
    const eventY = e.clientY || e.touches[0].clientY;
    touchData.startY = eventY;
    touchData.yArr = [[eventY, new Date().getTime()]];
    touchData.touchScroll = this.scroll;
    this._stop();
  }

  _touchmove(e, touchData) {
    const eventY = e.clientY || e.touches[0].clientY;
    touchData.yArr.push([eventY, new Date().getTime()]);
    if (touchData.length > 5) {
      touchData.unshift();
    }

    const scrollAdd = (touchData.startY - eventY) / this.itemHeight;
    let moveToScroll = scrollAdd + this.scroll;

    // 非无限滚动时，超出范围使滚动变得困难
    if (this.type === 'normal') {
      if (moveToScroll < 0) {
        moveToScroll *= 0.3;
      } else if (moveToScroll > this.source.length) {
        moveToScroll = this.source.length + (moveToScroll - this.source.length) * 0.3;
      }
      // console.log(moveToScroll);
    } else {
      moveToScroll = this._normalizeScroll(moveToScroll);
    }

    touchData.touchScroll = this._moveTo(moveToScroll);
  }

  _touchend(e, touchData) {
    // console.log(e);
    this.elems.el.removeEventListener('touchmove', this.events.touchmove);
    document.removeEventListener('mousemove', this.events.touchmove);

    let v;

    if (touchData.yArr.length === 1) {
      v = 0;
    } else {
      const startTime = touchData.yArr[touchData.yArr.length - 2][1];
      const endTime = touchData.yArr[touchData.yArr.length - 1][1];
      const startY = touchData.yArr[touchData.yArr.length - 2][0];
      const endY = touchData.yArr[touchData.yArr.length - 1][0];

      // 计算速度
      v = ((startY - endY) / this.itemHeight) * 1000 / (endTime - startTime);
      const sign = v > 0 ? 1 : -1;

      v = Math.abs(v) > 30 ? 30 * sign : v;
    }

    this.scroll = touchData.touchScroll;
    this._animateMoveByInitV(v);

    // console.log('end');
  }

  _create(source) {
    if (!source.length) {
      return;
    }

    const template = `
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
    const sourceLength = source.length;

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
                    >${source[i].text}</li>`;
    }

    // 中间高亮 HTML
    let highListHTML = '';
    for (let i = 0; i < source.length; i++) {
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">
                        ${source[i].text}
                      </li>`;
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
                      >${source[sourceLength - i - 1].text}</li>${circleListHTML}`;
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
                      </li>${highListHTML}`;
      highListHTML += `<li class="highlight-item" style="height: ${this.itemHeight}px;">${source[0].text}</li>`;
    }

    this.elems.el.innerHTML = template
      .replace('{{circleListHTML}}', circleListHTML)
      .replace('{{highListHTML}}', highListHTML);
    this.elems.circleList = this.elems.el.querySelector('.select-options');
    this.elems.circleItems = this.elems.el.querySelectorAll('.select-option');

    this.elems.highlight = this.elems.el.querySelector('.highlight');
    this.elems.highlightList = this.elems.el.querySelector('.highlight-list');
    this.elems.highlightitems = this.elems.el.querySelectorAll('.highlight-item');

    if (this.type === 'infinite') {
      this.elems.highlightList.style.top = `${-this.itemHeight}px`;
    }

    this.elems.highlight.style.height = `${this.itemHeight}px`;
    this.elems.highlight.style.lineHeight = `${this.itemHeight}px`;
  }

  /**
   * 对 scroll 取模，eg source.length = 5 scroll = 6.1
   * 取模之后 normalizedScroll = 1.1
   * @param {init} scroll
   * @return 取模之后的 normalizedScroll
   */
  _normalizeScroll(scroll) {
    let normalizedScroll = scroll;

    while (normalizedScroll < 0) {
      normalizedScroll += this.source.length;
    }
    normalizedScroll %= this.source.length;
    return normalizedScroll;
  }

  /**
   * 定位到 scroll，无动画
   * @param {init} scroll
   * @return 返回指定 normalize 之后的 scroll
   */
  _moveTo(scroll) {
    if (this.type === 'infinite') {
      scroll = this._normalizeScroll(scroll);
    }
    this.elems.circleList.style.transform = `translate3d(0, 0, ${-this.radius}px) rotateX(${this.itemAngle * scroll}deg)`;
    this.elems.highlightList.style.transform = `translate3d(0, ${-(scroll) * this.itemHeight}px, 0)`;

    [...this.elems.circleItems].forEach((itemElem) => {
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

  /**
   * 以初速度 initV 滚动
   * @param {init} initV， initV 会被重置
   * 以根据加速度确保滚动到整数 scroll (保证能通过 scroll 定位到一个选中值)
   */
  async _animateMoveByInitV(initV) {
    // console.log(initV);

    let initScroll;
    let finalScroll;
    let finalV;

    let totalScrollLen;
    let a;
    let t;

    if (this.type === 'normal') {
      if (this.scroll < 0 || this.scroll > this.source.length - 1) {
        a = this.exceedA;
        initScroll = this.scroll;
        finalScroll = this.scroll < 0 ? 0 : this.source.length - 1;
        totalScrollLen = initScroll - finalScroll;

        t = Math.sqrt(Math.abs(totalScrollLen / a));
        initV = a * t;
        initV = this.scroll > 0 ? -initV : initV;
        finalV = 0;
        await this._animateToScroll(initScroll, finalScroll, t);
      } else {
        initScroll = this.scroll;
        a = initV > 0 ? -this.a : this.a; // 减速加速度
        t = Math.abs(initV / a); // 速度减到 0 花费时间
        totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
        finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数
        finalScroll = finalScroll < 0 ? 0 : (finalScroll > this.source.length - 1 ? this.source.length - 1 : finalScroll);

        totalScrollLen = finalScroll - initScroll;
        t = Math.sqrt(Math.abs(totalScrollLen / a));
        await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
      }
    } else {
      initScroll = this.scroll;

      a = initV > 0 ? -this.a : this.a; // 减速加速度
      t = Math.abs(initV / a); // 速度减到 0 花费时间
      totalScrollLen = initV * t + a * t * t / 2; // 总滚动长度
      finalScroll = Math.round(this.scroll + totalScrollLen); // 取整，确保准确最终 scroll 为整数
      await this._animateToScroll(this.scroll, finalScroll, t, 'easeOutQuart');
    }

    // await this._animateToScroll(this.scroll, finalScroll, initV, 0);

    this._selectByScroll(this.scroll);
  }

  _animateToScroll(initScroll, finalScroll, t, easingName = 'easeOutQuart') {
    if (initScroll === finalScroll || t === 0) {
      this._moveTo(initScroll);
      return;
    }

    const start = new Date().getTime() / 1000;
    let pass = 0;
    const totalScrollLen = finalScroll - initScroll;

    // console.log(initScroll, finalScroll, initV, finalV, a);
    return new Promise((resolve, reject) => {
      this.moving = true;
      const tick = () => {
        pass = new Date().getTime() / 1000 - start;

        if (pass < t) {
          this.scroll = this._moveTo(initScroll + easing[easingName](pass / t) * totalScrollLen);
          this.moveT = requestAnimationFrame(tick);
        } else {
          resolve();
          this._stop();
          this.scroll = this._moveTo(initScroll + totalScrollLen);
        }
      };
      tick();
    });
  }

  _stop() {
    this.moving = false;
    cancelAnimationFrame(this.moveT);
  }

  _selectByScroll(scroll) {
    scroll = this._normalizeScroll(scroll) | 0;
    if (scroll > this.source.length - 1) {
      scroll = this.source.length - 1;
      this._moveTo(scroll);
    }
    this._moveTo(scroll);
    this.scroll = scroll;
    this.selected = this.source[scroll];
    if (this.value !== this.selected.value) {
    	this.value = this.selected.value;
    	this.onChange && this.onChange(this.selected);
    }
  }

  updateSource(source) {
    this._create(source);

    if (!this.moving) {
      this._selectByScroll(this.scroll);
    }
  }

  select(value) {
    for (let i = 0; i < this.source.length; i++) {
      if (this.source[i].value === value) {
        window.cancelAnimationFrame(this.moveT);
        // this.scroll = this._moveTo(i);
        const initScroll = this._normalizeScroll(this.scroll);
        const finalScroll = i;
        const t = Math.sqrt(Math.abs((finalScroll - initScroll) / this.a));
        this._animateToScroll(initScroll, finalScroll, t);
        setTimeout(() => this._selectByScroll(i));
        return;
      }
    }
    throw new Error(`can not select value: ${value}, ${value} match nothing in current source`);
  }

  destroy() {
    this._stop();
    // document 事件解绑
    for (const eventName in this.events) {
      this.elems.el.removeEventListener('eventName', this.events[eventName]);
    }
    document.removeEventListener('mousedown', this.events.touchstart);
    document.removeEventListener('mousemove', this.events.touchmove);
    document.removeEventListener('mouseup', this.events.touchend);
    // 元素移除
    this.elems.el.innerHTML = '';
    this.elems = null;
  }
}

export default IosSelector;
