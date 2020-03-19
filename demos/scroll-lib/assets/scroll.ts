/**
 * 虚拟滚动条
 */
export class Scroll {
  /** 需要滚动的宿主元素 */
  private hostEle: HTMLElement;
  /** 配置项 */
  private config: any;
  /** 垂直滚动条 */
  private barYEle: HTMLElement;
  /** 垂直滚动条父级元素 */
  private barHostYEle: HTMLElement;
  /** 水平滚动条 */
  private barXEle: HTMLElement;
  /** 水平滚动条父级元素 */
  private barHostXEle: HTMLElement;
  /** 每次滚轮滚动时宿主元素移动的最小距离，单位像素 */
  private dragDropDistance = 20;
  private isDragDrop = false;
  private mouseLeaveHangUp = false;

  /** 临时缓存需要频繁访问的元素属性 */
  private viewData = {
    hostScrollTop: 0,
    barYHeight: 0,
    hostHeight: 0,
    hostContentHeight: 0,

    hostScrollLeft: 0,
    barXWidth: 0,
    hostWidth: 0,
    hostContentWidth: 0
  }

  constructor(element: HTMLElement | string, config?: ScrollConfig) {
    this.hostEle = typeof element === 'string' ? document.body.querySelector(element) : element;
    this.config = Object.assign(new ScrollConfig(), config);
    // 虚拟滚动条实现的基础，宿主元素需要定位布局，隐藏超出的内容
    const position = this.getStyleValue(this.hostEle, 'position');
    if (!position || (position !== 'absolute' && position !== 'fixed' && position !== 'relative')) {
      this.hostEle.style.position = 'relative';
    }
    this.hostEle.style.overflow = 'hidden';

    this.initEle();

    this.forWheel();

    this.forDragDrop();

    this.timeoutUpdateView();
  }

  /**
   * 以宿主元素为准，更新虚拟滚动条，确保其他库在更新宿主元素滚动位置时虚拟滚动条也能正常显示
   */
  public updateView() {
    // 获取元素属性
    const hostScrollTop = this.viewData.hostScrollTop = this.hostEle.scrollTop;
    const hostHeight = this.viewData.hostHeight = this.hostEle.clientHeight;
    const hostContentHeight = this.viewData.hostContentHeight = this.hostEle.scrollHeight;
    const hostScrollLeft = this.viewData.hostScrollLeft = this.hostEle.scrollLeft;
    const hostWidth = this.viewData.hostWidth = this.hostEle.clientWidth;
    const hostContentWidth = this.viewData.hostContentWidth = this.hostEle.scrollWidth;

    const barYHeight = this.viewData.barYHeight = (hostHeight / hostContentHeight) * hostHeight;
    const barXWidth = this.viewData.barXWidth = (hostWidth / hostContentWidth) * hostWidth;

    // 计算垂直滚动的最大范围
    const diffY = hostContentHeight - hostHeight;
    const _diffY = hostHeight - barYHeight;
    const diffX = hostContentWidth - hostWidth;
    const _diffX = hostWidth - barXWidth;

    // 更新滚动条
    // 垂直方向
    if ((this.config.scrollDir === 'all' || this.config.scrollDir === 'y') && diffY > 0) {
      this.barHostYEle.hidden = false;
      this.barYEle.style.top = hostScrollTop / diffY * _diffY + 'px';
      this.barYEle.style.height = barYHeight + 'px';

      if (this.config.offsetXTop) {
        this.barHostXEle.style.top = (hostScrollTop + this.config.offsetXTop) + 'px';
      } else if (this.config.offsetXBottom) {// 如果元素内容滚动元素定位的bottom是相对于没有滚动时的位置进行偏移的***
        this.barHostXEle.style.bottom = (this.config.offsetXBottom - hostScrollTop) + 'px';
      } else {
        this.barHostXEle.style.top = (hostScrollTop + hostHeight - 10) + 'px';
      }
      this.barHostYEle.style.top = hostScrollTop + 'px';
    } else {// 当滚动条高度和父元素相同时自动隐藏滚动条
      this.barHostYEle.hidden = true;
    }
    // 水平方向
    if ((this.config.scrollDir === 'all' || this.config.scrollDir === 'x') && diffX > 0) {
      this.barHostXEle.hidden = false;
      this.barXEle.style.left = hostScrollLeft / diffX * _diffX + 'px';
      this.barXEle.style.width = barXWidth + 'px';

      if (this.config.offsetYLeft) {
        this.barHostYEle.style.left = (hostScrollLeft + this.config.offsetYLeft) + 'px';
      } else if (this.config.offsetYRight) {// 如果元素内容滚动元素定位的right是相对于没有滚动时的位置进行偏移的***
        this.barHostYEle.style.right = (this.config.offsetYRight - hostScrollLeft) + 'px';
      } else {
        this.barHostYEle.style.left = (hostScrollLeft + hostWidth - 10) + 'px';
      }
      this.barHostXEle.style.left = hostScrollLeft + 'px';
    } else {// 当滚动条宽度和父元素相同时自动隐藏滚动条
      this.barHostXEle.hidden = true;
    }
  }

  /**
   * 延迟监听内容变化并自动更新滚动条
   */
  private timeoutUpdateView(timeout = 500) {
    const height = this.viewData.hostContentHeight;
    const width = this.viewData.hostContentWidth;
    setTimeout(() => {
      this.updateView();
      if (width !== this.viewData.hostContentWidth || height !== this.viewData.hostContentHeight) {
        this.timeoutUpdateView(timeout);
      }
    }, timeout);
  }

  /**
   * 处理鼠标滚轮滚动
   */
  private forWheel() {
    this.hostEle.addEventListener('wheel', (e: WheelEvent) => {
      if (e.deltaY === 0) {
        return;
      }

      if ((this.config.scrollDir === 'all' || this.config.scrollDir === 'y') && !this.barHostYEle.hidden && !e.shiftKey) {
        const distance = e.deltaY > 0 ? this.dragDropDistance : -this.dragDropDistance;
        this.hostEle.scrollTop += distance * this.config.speed;
      }

      // 当只有水平滚动条时不需要 shift 按键也可以滚动
      if ((this.config.scrollDir === 'all' || this.config.scrollDir === 'x') && !this.barHostXEle.hidden && (e.shiftKey || this.barHostYEle.hidden)) {
        const distance = e.deltaY > 0 ? this.dragDropDistance : -this.dragDropDistance;
        this.hostEle.scrollLeft += distance * this.config.speed;
      }
    });
  }

  /**
   * 鼠标拖拽滚动
   */
  private forDragDrop() {
    // 当鼠标按下时pageY坐标
    let mouseDownPageY = 0;
    // 当鼠标按下时pageX坐标
    let mouseDownPageX = 0;
    // 垂直滚动条坐标
    let barYTop = 0;
    // 水平滚动条坐标
    let barXLeft = 0;
    // 当前拖拽的类型：水平 x 垂直 y
    let dragDropType = '';
    let _userSelect = '';

    /**
     * 鼠标拖拽的移动事件
     */
    const mouseMoveFn = (e: MouseEvent) => {
      if (dragDropType === 'y') {
        let _barYTop = barYTop + (e.pageY - mouseDownPageY);
        if (_barYTop < 0) {
          _barYTop = 0;
        } else if (_barYTop > this.viewData.hostHeight - this.viewData.barYHeight) {
          _barYTop = this.viewData.hostHeight - this.viewData.barYHeight;
        }

        this.hostEle.scrollTop = (_barYTop / (this.viewData.hostHeight - this.viewData.barYHeight)) * (this.viewData.hostContentHeight - this.viewData.hostHeight);
      } else if (dragDropType === 'x') {
        let _barXLeft = barXLeft + (e.pageX - mouseDownPageX);
        if (_barXLeft < 0) {
          _barXLeft = 0;
        } else if (_barXLeft > this.viewData.hostWidth - this.viewData.barXWidth) {
          _barXLeft = this.viewData.hostWidth - this.viewData.barXWidth;
        }

        this.hostEle.scrollLeft = (_barXLeft / (this.viewData.hostWidth - this.viewData.barXWidth)) * (this.viewData.hostContentWidth - this.viewData.hostWidth);
      }
    }

    /**
     * 鼠标拖拽松开时接触时间监听
     */
    const mouseUpFn = (e: MouseEvent) => {
      this.hostEle.style.userSelect = _userSelect;
      window.removeEventListener('mousemove', mouseMoveFn);
      window.removeEventListener('mouseup', mouseUpFn);
      this.isDragDrop = false;
      if (this.mouseLeaveHangUp) {
        const e = new MouseEvent('mouseleave');
        this.hostEle.dispatchEvent(e);
      }
    }

    // 监听垂直滚动条鼠标拖拽前的点击按下事件
    this.barYEle.addEventListener('mousedown', (e: MouseEvent) => {
      _userSelect = this.getStyleValue(this.hostEle, 'user-select');
      this.hostEle.style.userSelect = 'none';

      mouseDownPageY = e.pageY;
      barYTop = parseInt(this.getStyleValue(this.barYEle, 'top')) || 0;

      window.addEventListener('mousemove', mouseMoveFn);
      window.addEventListener('mouseup', mouseUpFn);
      dragDropType = 'y';
      this.isDragDrop = true;
    });

    // 监听水平滚动条鼠标拖拽前的点击按下事件
    this.barXEle.addEventListener('mousedown', (e: MouseEvent) => {
      _userSelect = this.getStyleValue(this.hostEle, 'user-select');
      this.hostEle.style.userSelect = 'none';

      mouseDownPageX = e.pageX;
      barXLeft = parseInt(this.getStyleValue(this.barXEle, 'left')) || 0;

      window.addEventListener('mousemove', mouseMoveFn);
      window.addEventListener('mouseup', mouseUpFn);
      dragDropType = 'x';
      this.isDragDrop = true;
    });
  }

  /** 
   * 初始化虚拟滚动条相关的元素
  */
  private initEle() {
    // 垂直方向上的元素
    this.barYEle = this.createEle('bar_y');
    this.barHostYEle = this.createEle('bar-host_y');

    this.barHostYEle.appendChild(this.barYEle);
    this.hostEle.appendChild(this.barHostYEle);

    // 水平方向上的元素
    this.barXEle = this.createEle('bar_x');
    this.barHostXEle = this.createEle('bar-host_x');

    this.barHostXEle.appendChild(this.barXEle);
    this.hostEle.appendChild(this.barHostXEle);

    this.initEleStyle();
    this.updateView();

    this.hostEle.addEventListener('scroll', this.updateView.bind(this));
    this.hostEleToggle();
  }

  /**
   * 当鼠标移入或者移除宿主元素时自动隐藏或者显示滚动条
   */
  private hostEleToggle() {
    this.hostEle.addEventListener('mouseenter', () => {
      this.barHostXEle.style.opacity = '1';
      this.barHostYEle.style.opacity = '1';
      this.mouseLeaveHangUp = false;
    });

    this.hostEle.addEventListener('mouseleave', () => {
      if (!this.isDragDrop) {
        this.barHostXEle.style.opacity = '0';
        this.barHostYEle.style.opacity = '0';
        this.mouseLeaveHangUp = false;
      } else {
        this.mouseLeaveHangUp = true;
      }
    });
  }

  /**
   * 设置虚拟滚动条元素的样式
   */
  private initEleStyle() {
    this.barYEle.style.cssText = `
      position: absolute;
      width: 6px;
      right: 2px;
      background-color: rgba(10,10,10,0.5);
    `;

    this.barHostYEle.style.cssText = `
      position: absolute;
      top: 0;
      width: 10px;
      height: 100%;
      left: calc(100% - 10px);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.5s;
    `;
    if (this.config.offsetYLeft) {
      this.barHostYEle.style.left = this.config.offsetYLeft + 'px';
    } else if (this.config.offsetYRight) {
      this.barHostYEle.style.left = 'unset';
      this.barHostYEle.style.right = this.config.offsetYRight + 'px';
    }

    this.barXEle.style.cssText = `
      position: absolute;
      height: 6px;
      bottom: 2px;
      background-color: rgba(10,10,10,0.5);
    `;

    this.barHostXEle.style.cssText = `
      position: absolute;
      left: 0;
      height: 10px;
      width: 100%;
      top: calc(100% - 10px);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.5s;
    `;

    if (this.config.offsetXTop) {
      this.barHostXEle.style.top = this.config.offsetXTop + 'px';
    } else if (this.config.offsetXBottom) {
      this.barHostXEle.style.top = 'unset';
      this.barHostYEle.style.bottom = this.config.offsetXBottom + 'px';
    }
  }

  private createEle(className?: string, tagName?: string) {
    const ele = document.createElement(tagName || 'div');
    ele.className = className ? this.config.prefixClassName + className : '';
    return ele;
  }

  private getStyleValue(ele: HTMLElement, style: string) {
    return window.getComputedStyle(ele).getPropertyValue(style);
  }
};

export class ScrollConfig {
  constructor(
    /**
     * 虚拟滚动条相关元素统一类样式前缀
     */
    public prefixClassName = 'gdt-',
    /**
     * 滚轮滚动速度
     */
    public speed = 1,
    /**
     * 滚动方向
     */
    public scrollDir = 'all',
    /**
     * 垂直滚动条靠左的偏移量
     */
    public offsetYLeft?,
    /**
     * 垂直滚动条靠右的偏移量
     */
    public offsetYRight?,
    /**
     * 水平滚动条靠上的偏移量
     */
    public offsetXTop?,
    /**
      * 水平滚动条靠下的偏移量
      */
    public offsetXBottom?
  ) {

  }
}