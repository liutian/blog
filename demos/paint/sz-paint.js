

export class SZPaint extends HTMLElement {

  // 常量
  mousePointOffset = 20;
  pointAreaWidth = 120;
  pointAreaHeight = 90;


  // UI元素
  mousePointEle = null;
  clipInfoEle = null;
  clipFrameEle = null;
  pointColorEle = null;
  pointLocationEle = null;
  toolBarEle = null;
  primaryToolEle = null;
  secondaryToolEle = null;
  sizeToolEle = null;
  colorToolEle = null;
  fontSizeToolEle = null;
  backdropCanvas = null;
  pointAreaCanvas = null;
  persistenceCanvas = null;
  realtimeCanvas = null;
  backdropCtx = null;
  pointAreaCtx = null;
  persistenceCtx = null;
  realtimeCtx = null;
  locationMarker = null;


  // 动态变量
  primaryToolWidth = -1;
  primaryToolHeight = -1;
  secondaryToolWidth = -1;
  secondaryToolWidth = -1;

  hostData = {};
  clipFrameBox = null;

  imageData = null;
  bgImage = null;

  resizeClipFrameFn = null;
  moveClipFrameFn = null;
  posToolBarFn = null;

  toolState = null;

  currToolState = null;

  _resetTimeoutId = null;
  _shadowRoot = null;

  constructor() {
    if (new.target !== SZPaint) {
      throw new Error('must be new MaLiang()');
    }
    super();
    this._shadowRoot = this.attachShadow({ mode: 'closed' });
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

  reset() {
    if (!this.hostData.src) {
      return;
    }

    if (this._resetTimeoutId) {
      clearTimeout(this._resetTimeoutId);
    }

    this._resetTimeoutId = setTimeout(() => {
      this._resetTimeoutId = null;

      this.toolState = {
        rect: { size: 'normal', color: 'red', locationX: -1 },
        circular: { size: 'normal', color: 'red', locationX: -1 },
        arrow: { size: 'normal', color: 'red', locationX: -1 },
        paint: { size: 'normal', color: 'red', locationX: -1 },
        mosaic: { size: 'normal', locationX: -1 },
        font: { size: 'normal', color: 'red', locationX: -1 }
      };
      this.currToolState = null;

      this.bgImage = new Image();
      this.bgImage.src = this.hostData.src;
      this.bgImage.addEventListener('load', () => {
        this.hostData.width = this.bgImage.width;
        this.hostData.height = this.bgImage.height;
        this.initEle();
        this.bindEvent();
        this.initData();
      });
    }, 0);
  }

  /**
     * 创建元素
     */
  initEle() {
    this._shadowRoot.innerHTML = HOST_HTML;
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

    resizeAnchors[0].style.cssText = `
      left: -5px;
      top: -5px;
      cursor: nwse-resize;
    `;

    resizeAnchors[1].style.cssText = `
      left: calc(50% - 4px);
      top: -5px;
      cursor: ns-resize;
    `;

    resizeAnchors[2].style.cssText = `
      left: calc(100% - 3px);
      top: -5px;
      cursor: nesw-resize;
    `;

    resizeAnchors[3].style.cssText = `
      left: calc(100% - 3px);
      top: calc(50% - 4px);
      cursor: ew-resize;
    `;

    resizeAnchors[4].style.cssText = `
      left: calc(100% - 3px);
      top: calc(100% - 3px);
      cursor: nwse-resize;
    `;

    resizeAnchors[5].style.cssText = `
      left: calc(50% - 4px);
      top: calc(100% - 3px);
      cursor: ns-resize;
    `;

    resizeAnchors[6].style.cssText = `
      left: -5px;
      top: calc(100% - 3px);
      cursor: nesw-resize;
    `;

    resizeAnchors[7].style.cssText = `
      left: -5px;
      top: calc(50% - 4px);
      cursor: ew-resize;
    `;

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
    this.addEventListener('mousemove', this.hostMouseMove.bind(this));
    this.addEventListener('mousedown', this.hostMouseDown.bind(this));
    this.addEventListener('mouseup', this.hostMouseUp.bind(this));
    this.addEventListener('mouseleave', this.hostMouseLeave.bind(this));
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

    if (this.clipFrameBox === null) {
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

    if (this.clipFrameBox === null) {
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
    if (this.clipFrameBox !== null) {
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
    } else if (location === 5) {
      this.toolBarEle.style.textAlign = 'right';
      this.secondaryToolEle.style.right = '0px';
      this.secondaryToolEle.style.bottom = 'calc( 100% + 10px)';
    } else if (location === 6) {
      this.toolBarEle.style.textAlign = 'right';
      this.secondaryToolEle.style.right = '0px';
      this.secondaryToolEle.style.top = 'calc( 100% + 10px)';
    } else if (location === 10) {
      this.toolBarEle.style.textAlign = 'left';
      this.secondaryToolEle.style.left = '0px';
      this.secondaryToolEle.style.top = 'calc( 100% + 10px)';
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


const HOST_HTML = `
  <canvas class="backdrop"></canvas>
  <canvas class="persistence"></canvas>
  <canvas class="realtime"></canvas>

  <div class="mouse-point">
    <canvas class="point-area"></canvas>
    <div class="point-info">
      RGB: <span class="point-color"></span><br>
      坐标: <span class="point-location"></span>
    </div>
  </div>

  <div class="clip-frame">
    <div class="resize-anchor " data-index="0"></div>
    <div class="resize-anchor " data-index="1"></div>
    <div class="resize-anchor " data-index="2"></div>
    <div class="resize-anchor " data-index="3"></div>
    <div class="resize-anchor " data-index="4"></div>
    <div class="resize-anchor " data-index="5"></div>
    <div class="resize-anchor " data-index="6"></div>
    <div class="resize-anchor " data-index="7"></div>
    <div class="clip-info"></div>
  </div>

  <div class="tool-bar">
    <div class="primary-tool">
      <span class="graph-tool tool-item" data-type="rect" >矩</span>
      <span class="graph-tool tool-item" data-type="circular">圆</span>
      <span class="graph-tool tool-item" data-type="arrow">箭</span>
      <span class="graph-tool tool-item" data-type="paint">笔</span>
      <span class="graph-tool tool-item" data-type="mosaic">糊</span>
      <span class="graph-tool tool-item" data-type="font">字</span>
      <span class="separator"></span>
      <span class="cancel-tool tool-item" >消</span>
      <span class="save-tool tool-item" >保</span>
      <span class="separator tool-item"></span>
      <span class="exit-tool tool-item" >退</span>
      <span class="over-tool tool-item" >完</span>
    </div>

    <div class="location-marker"></div>

    <div class="secondary-tool">
      <select class="font-size-tool">
        <option value="small">小</option>
        <option value="normal">中</option>
        <option value="large">大</option>
      </select>

      <span class="size-tool">
        <span class=" tool-item" data-size="small">小</span>
        <span class=" tool-item" data-size="normal">中</span>
        <span class=" tool-item" data-size="large">大</span>
      </span>

      <span class="color-tool">
        <span class=" tool-item" data-color="red">红</span>
        <span class=" tool-item" data-color="yellow">黄</span>
        <span class=" tool-item" data-color="blue">蓝</span>
        <span class=" tool-item" data-color="green">绿</span>
        <span class=" tool-item" data-color="gray">灰</span>
        <span class=" tool-item" data-color="white">白</span>
      </span>


    </div>
  </div>
`;

const HOST_STYLE = `
  :host() {
    overflow: hidden;
    box-sizing: border-box;
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    filter: brightness(0.6);
  }

  .persistence {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }

  .realtime {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }

  .mouse-point {
    position: absolute;
    left: 10000px;
    top: 0;
    width: 120px;
    z-index: 1;
    pointer-events: none;
  }

  .point-info {
    line-height: 1.3;
    padding: 5px 0 5px 5px;
    background-color: #000;
    color: #fff;
    font-size: 12px;
    box-sizing: border-box;
    user-select: none;
  }

  .clip-frame {
    position: absolute;
    top: 0;
    left: 10000px;
    border: solid 2px #00ccff;
    box-sizing: border-box;
  }

  .resize-anchor {
    position: absolute;
    width: 8px;
    height: 8px;
    border: solid #00ccff 1px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    box-sizing: border-box;
  }

  .clip-info {
    position: absolute;
    left: 5px;
    top: 0;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
    width: 100px;
    user-select: none;
    cursor: auto;
  }

  .primary-tool {
    display: inline-block;
    background-color: #4c4c4c;
    border-radius: 4px;
    text-align: left;
    padding: 5px 20px;
  }

  .secondary-tool {
    position: absolute;
    background-color: #4c4c4c;
    border-radius: 4px;
    text-align: left;
    padding: 5px 10px;
    box-sizing: border-box;
  }

  .location-marker {
    position: absolute;  
    border: solid 5px transparent;
    border-bottom-color: #4c4c4c;
  }
`;


function resizeHighOrder({ index, rectX, rectY, rectWidth, rectHeight }) {
  let oneWayDrag, fixedPointX, fixedPointY, oneWayXLength, oneWayYLength, lastX, lastY;

  if (index === 0) {
    oneWayDrag = false;
    fixedPointX = rectX + rectWidth;
    fixedPointY = rectY + rectHeight;
  } else if (index === 1) {
    oneWayDrag = true;
    fixedPointX = rectX;
    fixedPointY = rectY + rectHeight;
    oneWayXLength = rectWidth;
  } else if (index === 2) {
    oneWayDrag = false;
    fixedPointX = rectX;
    fixedPointY = rectY + rectHeight;
  } else if (index === 3) {
    oneWayDrag = true;
    fixedPointX = rectX;
    fixedPointY = rectY;
    oneWayYLength = rectHeight;
  } else if (index === 4) {
    oneWayDrag = false;
    fixedPointX = rectX;
    fixedPointY = rectY;
  } else if (index === 5) {
    oneWayDrag = true;
    fixedPointX = rectX;
    fixedPointY = rectY;
    oneWayXLength = rectWidth;
  } else if (index === 6) {
    oneWayDrag = false;
    fixedPointX = rectX + rectWidth;
    fixedPointY = rectY;
  } else if (index === 7) {
    oneWayDrag = true;
    fixedPointX = rectX + rectWidth;
    fixedPointY = rectY;
    oneWayYLength = rectHeight;
  }


  return function resize(x, y) {
    if (oneWayDrag) {
      if (oneWayXLength !== undefined) {
        return {
          x: fixedPointX,
          y: Math.min(y, fixedPointY),
          width: oneWayXLength,
          height: Math.abs(fixedPointY - y),
        }
      } else {
        return {
          x: Math.min(x, fixedPointX),
          y: fixedPointY,
          width: Math.abs(x - fixedPointX),
          height: oneWayYLength
        }
      }
    } else {
      return {
        x: Math.min(x, fixedPointX),
        y: Math.min(y, fixedPointY),
        width: Math.abs(x - fixedPointX),
        height: Math.abs(y - fixedPointY)
      }
    }
  }
}

function moveHighOrder({ offsetX, offsetY, rectWidth, rectHeight, hostWidth, hostHeight }) {
  return function (x, y) {
    let _x = x - offsetX;
    let _y = y - offsetY;

    if (_x <= 0) {
      _x = 0;
    } else if (_x >= hostWidth - rectWidth) {
      _x = hostWidth - rectWidth;
    }

    if (_y <= 0) {
      _y = 0;
    } else if (_y >= hostHeight - rectHeight) {
      _y = hostHeight - rectHeight;
    }

    return {
      x: _x,
      y: _y
    }
  }
}

function fixedPositionHighOrder(hostWidth, hostHeight, maxWidth, maxHeight, minHeight, offsetY) {
  return function (x, y, width, height) {
    let positionX, positionY, location = 0;

    if (y + height + maxHeight + offsetY > hostHeight) {
      positionY = y - minHeight - offsetY;
      location |= 1;
    } else {
      positionY = y + height + offsetY;
      location |= 2;
    }

    if (x + maxWidth > hostWidth) {
      positionX = x + width - maxWidth;
      location |= 4;
    } else {
      positionX = x;
      location |= 8;
    }

    return {
      x: positionX,
      y: positionY,
      location // 从左到右从高到低 1001 101 110  1010
    }
  }
}

function paramsError(param) {
  throw new Error(`params(${param}) can not empty`);
}

window.customElements.define('sz-paint', SZPaint);