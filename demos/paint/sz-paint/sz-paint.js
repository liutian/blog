
import HOST_TEMPLATE from './template.js';
import HOST_STYLE from './style.js';
import { resizeHighOrder, moveHighOrder, fixedPositionHighOrder, setHandlePoints } from './util.js';

export default class SZPaint extends HTMLElement {

  // 常量
  // 鼠标点的预览区域距离鼠标的偏移量
  mousePointOffset = 20;
  // 预览区的宽度
  pointAreaWidth = 120;
  // 预览区的高度
  pointAreaHeight = 90;


  // UI元素
  // 预览区容器
  mousePointEle = null;
  // 预览点颜色值
  pointColorEle = null;
  // 预览点位置
  pointLocationEle = null;
  // 截取区容器
  clipFrameEle = null;
  // 截取区域
  clipInfoEle = null;
  // 工具栏
  toolBarEle = null;
  // 主工具栏
  primaryToolEle = null;
  // 附属工具栏
  secondaryToolEle = null;
  // 工具栏指示箭头
  locationMarker = null;
  // 工具栏中的尺寸
  sizeToolEle = null;
  // 工具栏中的颜色
  colorToolEle = null;
  // 工具栏中的字体
  fontSizeToolEle = null;
  // 背景画布
  backdropCanvas = null;
  // 预览区画布
  pointAreaCanvas = null;
  // 创作区画布
  persistenceCanvas = null;
  // 当前创作区画布
  realtimeCanvas = null;
  backdropCtx = null;
  pointAreaCtx = null;
  persistenceCtx = null;
  realtimeCtx = null;



  // 动态变量
  primaryToolWidth = -1;
  primaryToolHeight = -1;
  secondaryToolWidth = -1;
  secondaryToolHeight = -1;

  hostData = {};
  clipFrameBox = null;

  imageData = null;
  bgImage = null;

  resizeClipFrameFn = null;
  moveClipFrameFn = null;
  posToolBarFn = null;

  toolState = null;
  currToolState = null;
  // 进入绘图阶段
  currGraphInfo = null;

  resetTimeoutId = null;
  _shadowRoot = null;

  constructor() {
    if (new.target !== SZPaint) {
      throw new Error('must be new MaLiang()');
    }
    super();
    this._shadowRoot = this.attachShadow({ mode: 'closed' });

    this._shadowRoot.addEventListener('mousemove', this.hostMouseMove.bind(this));
    this._shadowRoot.addEventListener('mousedown', this.hostMouseDown.bind(this));
    this._shadowRoot.addEventListener('mouseup', this.hostMouseUp.bind(this));
    this._shadowRoot.addEventListener('mouseleave', this.hostMouseLeave.bind(this));
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue) {
      this.hostData[name] = newValue;
      this.reset();
    }
  }

  set src(src) {
    if (src) {
      this.hostData.src = src;
      this.reset();
    }
  }

  static get observedAttributes() {
    return ['src'];
  }

  reset(callback) {
    if (!this.hostData.src) {
      return;
    }

    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = setTimeout(() => {
      this.resetTimeoutId = null;

      this.toolState = {
        rect: { size: 'normal', color: 'red', locationX: -1 },
        circular: { size: 'normal', color: 'red', locationX: -1 },
        arrow: { size: 'normal', color: 'red', locationX: -1 },
        paint: { size: 'normal', color: 'red', locationX: -1 },
        mosaic: { size: 'normal', locationX: -1 },
        font: { size: 'normal', color: 'red', locationX: -1 }
      };
      this.currToolState = null;
      this.resizeClipFrameFn = null;
      this.moveClipFrameFn = null;
      this.posToolBarFn = null;
      this.clipFrameBox = null;
      this.imageData = null;

      this.bgImage = new Image();
      this.bgImage.src = this.hostData.src;
      this.bgImage.addEventListener('load', () => {
        this.hostData.width = this.bgImage.width;
        this.hostData.height = this.bgImage.height;
        this.initEle();
        this.bindEvent();
        this.initData();
        callback && callback();
      });
    }, 0);
  }

  /**
     * 创建元素
     */
  initEle() {
    this._shadowRoot.innerHTML = HOST_TEMPLATE;
    const style = document.createElement('style');
    style.textContent = HOST_STYLE;
    this._shadowRoot.appendChild(style);

    let position = window.getComputedStyle(this).getPropertyValue('position');
    // 纠正容器定位属性，便于子元素定位
    if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
      position = 'relative';
    }

    this.style.cssText = `
      position: ${position};  
      width: ${this.hostData.width}px;
      height: ${this.hostData.height}px;
    `;

    this.backdropCanvas = this._shadowRoot.querySelector('.backdrop');
    this.backdropCanvas.width = this.hostData.width;
    this.backdropCanvas.height = this.hostData.height;

    this.persistenceCanvas = this._shadowRoot.querySelector('.persistence');
    this.persistenceCanvas.width = this.hostData.width;
    this.persistenceCanvas.height = this.hostData.height;

    this.realtimeCanvas = this._shadowRoot.querySelector('.realtime');
    this.realtimeCanvas.width = this.hostData.width;
    this.realtimeCanvas.height = this.hostData.height;

    this.mousePointEle = this._shadowRoot.querySelector('.mouse-point');

    this.pointAreaCanvas = this._shadowRoot.querySelector('.point-area');
    this.pointAreaCanvas.width = this.pointAreaWidth;
    this.pointAreaCanvas.height = this.pointAreaHeight;

    this.pointLocationEle = this._shadowRoot.querySelector('.point-location');
    this.pointColorEle = this._shadowRoot.querySelector('.point-color');

    this.clipFrameEle = this._shadowRoot.querySelector('.clip-frame');

    const resizeAnchors = this._shadowRoot.querySelectorAll('.resize-anchor');

    setHandlePoints(resizeAnchors);

    this.clipInfoEle = this._shadowRoot.querySelector('.clip-info');

    this.toolBarEle = this._shadowRoot.querySelector('.tool-bar');
    this.toolBarEle.style.color = '#fff';

    this.primaryToolEle = this._shadowRoot.querySelector('.primary-tool');

    const primaryToolStyles = window.getComputedStyle(this.primaryToolEle);
    this.primaryToolWidth = Math.ceil(window.parseFloat(primaryToolStyles.getPropertyValue('width')));
    this.primaryToolHeight = Math.ceil(window.parseFloat(primaryToolStyles.getPropertyValue('height')));

    this.secondaryToolEle = this._shadowRoot.querySelector('.secondary-tool');

    const secondaryToolStyles = window.getComputedStyle(this.secondaryToolEle);
    this.secondaryToolWidth = Math.ceil(window.parseFloat(secondaryToolStyles.getPropertyValue('width')));
    this.secondaryToolHeight = Math.ceil(window.parseFloat(secondaryToolStyles.getPropertyValue('height')));

    this.locationMarker = this._shadowRoot.querySelector('.location-marker');

    // 必须在getComputedStyle之后设置坐标
    this.toolBarEle.style.position = 'absolute';

    this.sizeToolEle = this._shadowRoot.querySelector('.size-tool');
    this.colorToolEle = this._shadowRoot.querySelector('.color-tool');
    this.fontSizeToolEle = this._shadowRoot.querySelector('.font-size-tool');
  }

  bindEvent() {
    this.toolBarEle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    this.toolBarEle.addEventListener('mouseup', (e) => {
      e.stopPropagation();
    });
    this.primaryToolEle.addEventListener('click', this.primaryToolClick.bind(this));
    this.secondaryToolEle.addEventListener('click', this.secondaryToolClick.bind(this));
    this.fontSizeToolEle.addEventListener('change', (e) => {
      this.currToolState.size = this.toolState.font.size = e.target.value;
    });
  }

  /**
   * 初始化数据
   */
  initData() {
    ({
      left: this.hostData.x,
      top: this.hostData.y
    } = this.getBoundingClientRect());
    this.primaryToolEle.querySelectorAll('.graph-tool').forEach((item) => {
      const state = this.toolState[item.dataset.type];
      state.locationX = item.offsetLeft + (item.offsetWidth / 2);
    });

    this.pointAreaCtx = this.pointAreaCanvas.getContext('2d', { alpha: false });
    this.backdropCtx = this.backdropCanvas.getContext('2d', { alpha: false });
    this.persistenceCtx = this.persistenceCanvas.getContext('2d');
    this.realtimeCtx = this.realtimeCanvas.getContext('2d');

    this.pointAreaCtx.imageSmoothingEnabled = false;
    this.backdropCtx.drawImage(this.bgImage, 0, 0);
    this.imageData = this.backdropCtx.getImageData(0, 0, this.hostData.width, this.hostData.height);
    this.clipFrameEle.style.backgroundImage = `url(${this.backdropCanvas.toDataURL()})`;

    this.toolBarEle.style.left = '10000px';
  }

  hostMouseMove(e) {
    const left = e.pageX - this.hostData.x;
    const top = e.pageY - this.hostData.y;

    if (this.currGraphInfo) {

    } else if (this.clipFrameBox === null) {
      this.refreshMousePoint(left, top);
    } else if (this.clipFrameBox !== null) {
      if (this.resizeClipFrameFn) {
        ({
          x: this.clipFrameBox.x,
          y: this.clipFrameBox.y,
          width: this.clipFrameBox.width,
          height: this.clipFrameBox.height
        } = this.resizeClipFrameFn(left, top));

        this.refreshClipInfo();
        this.refreshMousePoint(left, top);
        this.resizeClipFrame();
      } else if (this.moveClipFrameFn) {
        ({
          x: this.clipFrameBox.x,
          y: this.clipFrameBox.y
        } = this.moveClipFrameFn(left, top));

        this.refreshClipInfo();
        this.moveClipFrame();
      }
    }
  }

  hostMouseDown(e) {
    const x = e.pageX - this.hostData.x;
    const y = e.pageY - this.hostData.y;

    if (e.button === 2) {
      this.reset(() => {
        this.refreshMousePoint(x, y);
      });
      return;
    }

    if (this.currToolState) {

    } else if (this.clipFrameBox === null) {
      this.clipFrameBox = {
        x, y, width: 0, height: 0
      }
      this.resizeClipFrameFn = resizeHighOrder({
        index: 4,
        rectX: x,
        rectY: y,
        rectWidth: 0,
        rectHeight: 0,
      });

      this.posToolBarFn = fixedPositionHighOrder(
        this.hostData.width, this.hostData.height, this.primaryToolWidth,
        this.primaryToolHeight + this.secondaryToolHeight + 10, this.secondaryToolHeight, 5);
    } else if (this.clipFrameBox !== null) {
      const classList = e.target.classList;
      this.toolBarEle.hidden = true;

      if (classList.contains('resize-anchor')) {
        this.resizeClipFrameFn = resizeHighOrder({
          index: +e.target.dataset.index,
          rectX: this.clipFrameBox.x,
          rectY: this.clipFrameBox.y,
          rectWidth: this.clipFrameBox.width,
          rectHeight: this.clipFrameBox.height,
        });
      } else if (e.target === this.clipFrameEle) {
        this.moveClipFrameFn = moveHighOrder({
          offsetX: x - this.clipFrameBox.x,
          offsetY: y - this.clipFrameBox.y,
          rectWidth: this.clipFrameBox.width,
          rectHeight: this.clipFrameBox.height,
          hostWidth: this.hostData.width,
          hostHeight: this.hostData.height
        });
      }
    }
  }

  hostMouseUp(e) {
    if (this.currToolState) {

    } else if (this.clipFrameBox !== null) {
      this.mousePointEle.style.left = '10000px';
      this.clipFrameEle.style.cursor = 'move';
      this.resizeClipFrameFn = null;
      this.moveClipFrameFn = null;
      this.refreshToolBar();
    }
  }

  primaryToolClick(e) {
    const classList = e.target.classList;
    if (!classList.contains('tool-item')) {
      return;
    }

    if (classList.contains('graph-tool')) {
      if (e.target.classList.contains('active')) {
        e.target.style.backgroundColor = 'transparent';
        e.target.classList.remove('active');
        this.switchTool();
      } else {
        this.primaryToolEle.querySelectorAll('.graph-tool').forEach(item => {
          item.style.backgroundColor = 'transparent';
          item.classList.remove('active');
        });
        e.target.style.backgroundColor = '#000';
        e.target.classList.add('active');
        this.switchTool(e.target.dataset.type);
      }
    } else {
      this.switchTool();
    }
  }

  secondaryToolClick(e) {
    if (!e.target.classList.contains('tool-item')) {
      return;
    }

    const toolState = this.toolState[this.currToolState.type];
    if (e.target.dataset.size) {
      this.currToolState.size = toolState.size = e.target.dataset.size;
    } else if (e.target.dataset.color) {
      this.currToolState.color = toolState.color = e.target.dataset.color;
    }

    [...e.target.parentElement.children].forEach((item) => {
      item.style.backgroundColor = 'transparent';
    });
    e.target.style.backgroundColor = '#000';
  }

  switchTool(name, state) {
    if (!name) {
      this.secondaryToolEle.hidden = true;
      this.locationMarker.hidden = true;
      this.currToolState = null;
      return;
    }

    if (state) {
      this.toolState[name].size = state.size;
      this.toolState[name].color = state.color;
    }

    this.currToolState = {
      type: name,
      size: this.toolState[name].size,
      color: this.toolState[name].color
    }
    this.locationMarker.style.left = (this.toolState[name].locationX - 5) + 'px';

    this.sizeToolEle.querySelectorAll('.tool-item').forEach((item) => {
      if (this.currToolState.size === item.dataset.size && item.dataset.size) {
        item.style.backgroundColor = '#000';
      } else {
        item.style.backgroundColor = 'transparent';
      }
    });
    this.colorToolEle.querySelectorAll('.tool-item').forEach((item) => {
      if (this.currToolState.color === item.dataset.color && item.dataset.color) {
        item.style.backgroundColor = '#000';
      } else {
        item.style.backgroundColor = 'transparent';
      }
    });
    [...this.fontSizeToolEle.options].forEach((item) => {
      item.selected = item.value === this.currToolState.size;
    });

    if (name === 'rect' || name === 'circular' || name === 'arrow' || name === 'paint') {
      this.sizeToolEle.hidden = false;
      this.colorToolEle.hidden = false;
      this.fontSizeToolEle.hidden = true;
    } else if (name === 'mosaic') {
      this.sizeToolEle.hidden = false;
      this.colorToolEle.hidden = true;
      this.fontSizeToolEle.hidden = true;
    } else if (name === 'font') {
      this.sizeToolEle.hidden = true;
      this.colorToolEle.hidden = false;
      this.fontSizeToolEle.hidden = false;
    }

    this.secondaryToolEle.hidden = false;
    this.locationMarker.hidden = false;
    const width = window.parseInt(window.getComputedStyle(this.secondaryToolEle).getPropertyValue('width'));
    const left = this.toolState[name].locationX - width / 2;
    this.secondaryToolEle.style.left = (left <= 0 ? 0 : left) + 'px';
    this.clipFrameEle.style.cursor = 'auto';
  }

  hostMouseLeave(e) {
    this.mousePointEle.style.left = '10000px';
  }

  resizeClipFrame() {
    this.clipFrameEle.style.left = `${this.clipFrameBox.x}px`;
    this.clipFrameEle.style.top = `${this.clipFrameBox.y}px`;
    this.clipFrameEle.style.width = `${this.clipFrameBox.width}px`;
    this.clipFrameEle.style.height = `${this.clipFrameBox.height}px`;
    this.clipFrameEle.style.backgroundPosition = `-${this.clipFrameBox.x + 2}px -${this.clipFrameBox.y + 2}px`;
  }

  refreshClipInfo() {
    if (this.clipFrameBox.y < 20) {
      this.clipInfoEle.style.top = `0px`;
    } else {
      this.clipInfoEle.style.top = `-20px`;
    }

    this.clipInfoEle.textContent = `${this.clipFrameBox.width} x ${this.clipFrameBox.height}`;
  }

  refreshToolBar() {
    this.toolBarEle.hidden = false;
    this.secondaryToolEle.hidden = true;
    this.locationMarker.hidden = true;
    const { x, y, location } = this.posToolBarFn(this.clipFrameBox.x, this.clipFrameBox.y, this.clipFrameBox.width, this.clipFrameBox.height);
    this.toolBarEle.style.left = `${x}px`;
    this.toolBarEle.style.top = `${y}px`;

    const secondaryStyles = this.secondaryToolEle.style;

    secondaryStyles.left = 'unset';
    secondaryStyles.right = 'unset';
    secondaryStyles.top = 'unset';
    secondaryStyles.bottom = 'unset';

    // 从左到右从高到低 1001 101 110  1010
    if (location === 9) {
      this.toolBarEle.style.textAlign = 'left';
      this.secondaryToolEle.style.left = '0px';
      this.secondaryToolEle.style.bottom = 'calc( 100% + 10px)';
      this.locationMarker.style.bottom = 'calc(100%)';
      this.locationMarker.style.transform = 'rotate(180deg)';
    } else if (location === 5) {
      this.toolBarEle.style.textAlign = 'right';
      this.secondaryToolEle.style.right = '0px';
      this.secondaryToolEle.style.bottom = 'calc( 100% + 10px)';
      this.locationMarker.style.bottom = 'calc(100%)';
      this.locationMarker.style.transform = 'rotate(180deg)';
    } else if (location === 6) {
      this.toolBarEle.style.textAlign = 'right';
      this.secondaryToolEle.style.right = '0px';
      this.secondaryToolEle.style.top = 'calc( 100% + 10px)';
      this.locationMarker.style.bottom = 'unset';
      this.locationMarker.style.transform = 'unset';
    } else if (location === 10) {
      this.toolBarEle.style.textAlign = 'left';
      this.secondaryToolEle.style.left = '0px';
      this.secondaryToolEle.style.top = 'calc( 100% + 10px)';
      this.locationMarker.style.bottom = 'unset';
      this.locationMarker.style.transform = 'unset';
    }
  }


  moveClipFrame() {
    this.clipFrameEle.style.left = `${this.clipFrameBox.x}px`;
    this.clipFrameEle.style.top = `${this.clipFrameBox.y}px`;
    this.clipFrameEle.style.backgroundPosition = `-${this.clipFrameBox.x + 2}px -${this.clipFrameBox.y + 2}px`;
  }

  refreshMousePoint(left, top) {
    // mousePointEle.style.transform = `translateX(${x + mousePointOffset}px) translateY(${y + mousePointOffset}px)`;
    this.mousePointEle.style.left = (left + this.mousePointOffset) + 'px';
    this.mousePointEle.style.top = (top + this.mousePointOffset) + 'px';
    this.pointLocationEle.textContent = `(${left},${top})`;
    const imageDataStartIndex = this.imageData.width * top * 4 + left * 4;
    this.pointColorEle.textContent = `(${this.imageData.data[imageDataStartIndex]},${this.imageData.data[imageDataStartIndex + 1]},${this.imageData.data[imageDataStartIndex + 2]})`;

    this.pointAreaCtx.fillStyle = '#000000';
    this.pointAreaCtx.fillRect(0, 0, this.pointAreaWidth, this.pointAreaHeight);
    this.pointAreaCtx.drawImage(this.backdropCanvas, left - 20, top - 15, 40, 30, 0, 0, this.pointAreaWidth, this.pointAreaHeight);

    this.pointAreaCtx.strokeStyle = '#00ccff';
    this.pointAreaCtx.lineWidth = 2;
    this.pointAreaCtx.strokeRect(0, 0, this.pointAreaWidth, this.pointAreaHeight + 1);

    this.pointAreaCtx.lineWidth = 1;

    this.pointAreaCtx.beginPath();
    this.pointAreaCtx.moveTo(Math.floor(this.pointAreaWidth / 2) + 0.5, 0);
    this.pointAreaCtx.lineTo(Math.floor(this.pointAreaWidth / 2) + 0.5, this.pointAreaHeight);
    this.pointAreaCtx.stroke();

    this.pointAreaCtx.beginPath();
    this.pointAreaCtx.moveTo(0, Math.floor(this.pointAreaHeight / 2) + 0.5);
    this.pointAreaCtx.lineTo(this.pointAreaWidth, Math.floor(this.pointAreaHeight / 2) + 0.5);
    this.pointAreaCtx.stroke();
  }
}

