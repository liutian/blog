import { UIElement } from '../UIElement.js';
import { initCanvas, resizeHighOrder, moveHighOrder, loadImage, getPositionColor } from '../util.js';
import CanvasRender from '../CanvasRender.js';

const NOClipFrameFlag = 2;
const ResizeClipFrameFlag = 4;
const MoveClipFrameFlag = 8;
const DrawReadyFlag = 16;
const DrawFlag = 32;
const SelectGraphFlag = 64;
const ResizeGraphFlag = 128;
const MoveGraphFlag = 256;

export default class Paint extends UIElement {
  mousePointEle = null;
  clipFrameEle = null;
  toolBarEle = null;

  flag = 2;
  hostWidth = 0;
  hostHeight = 0;
  hostX = 0;
  hostY = 0;
  resizeClipFrameFn = null;
  moveClipFrameFn = null;
  resizeGraphFn = null;
  moveGraphFn = null;
  clipFrameBox = null;
  currGraphState = null;
  currGraphInfo = null;
  graphInfoList = [];
  graphInfoHistory = [];
  graphInfoHistoryCursor = -1;
  persistenceImageData = null;
  canvasRender = new CanvasRender();

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'src' && newValue) {
      this.reset();
    }
  }

  set src(src) {
    if (src) {
      this.inputData.src = src;
      this.reset();
    }
  }

  static get observedAttributes() {
    return ['src'];
  }

  async reset() {
    if (!this.inputData.src) {
      return;
    }

    this.bgImage = await loadImage(this.inputData.src);
    super.reset();
    this.graphInfoList = [];
    this.hostWidth = this.bgImage.width;
    this.hostHeight = this.bgImage.height;
    this.flag = NOClipFrameFlag;

    [this.mousePointEle, this.clipFrameEle, this.toolBarEle].forEach(item => {
      item && item.reset();
    });

    await this.loadResource();
    this.initView();

    const childList = [this.mousePointEle, this.clipFrameEle, this.toolBarEle];
    for (let i = 0; i < childList.length; i++) {
      const item = childList[i];
      await item.loadResource();
      item.initView();
      item.bindEvent();
      item.start();
    }

    this.bindEvent();
    this.start();
  }

  initView() {
    this.mousePointEle = this.query('sz-mouse-point');
    this.clipFrameEle = this.query('sz-clip-frame');
    this.toolBarEle = this.query('sz-tool-bar');

    let position = window.getComputedStyle(this).getPropertyValue('position');
    // 纠正容器定位属性，便于子元素定位
    if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
      position = 'relative';
    }

    this.style.cssText = `
      position: ${position};  
      width: ${this.hostWidth}px;
      height: ${this.hostHeight}px;
    `;

    this.backdropCanvas = initCanvas(this._shadowRoot, '.backdrop', this.hostWidth, this.hostHeight);
    this.persistenceCanvas = initCanvas(this._shadowRoot, '.persistence', this.hostWidth, this.hostHeight);
    this.realtimeCanvas = initCanvas(this._shadowRoot, '.realtime', this.hostWidth, this.hostHeight);
  }

  bindEvent() {
    this._shadowRoot.addEventListener('mousedown', this.hostMouseDownListener);
    this._shadowRoot.addEventListener('mousemove', this.hostMouseMoveListener);
    this._shadowRoot.addEventListener('mouseup', this.hostMouseUpListener);
    this._shadowRoot.addEventListener('mouseleave', this.hostMouseLeaveListener);
    this._shadowRoot.addEventListener('contextmenu', this.hostContextmenuListener);
    this.toolBarEle.addEventListener('change', this.toolBarChangeListener);
    this.clipFrameEle.addEventListener('select', this.clipFrameSelectListener);
    this.clipFrameEle.addEventListener('resize', this.clipFrameResizeListener);
    this.clipFrameEle.addEventListener('move', this.clipFrameMoveListener);
    this.clipFrameEle.addEventListener('draw', this.clipFrameDrawListener);
    this.toolBarEle.addEventListener('undo', this.toolBarUndoListener);

    this.unBindEventFn = () => {
      this._shadowRoot.removeEventListener('mousedown', this.hostMouseDownListener);
      this._shadowRoot.removeEventListener('mousemove', this.hostMouseMoveListener);
      this._shadowRoot.removeEventListener('mouseup', this.hostMouseUpListener);
      this._shadowRoot.removeEventListener('mouseleave', this.hostMouseLeaveListener);
      this._shadowRoot.removeEventListener('contextmenu', this.hostContextmenuListener);
      this.toolBarEle.removeEventListener('change', this.toolBarChangeListener);
      this.clipFrameEle.removeEventListener('select', this.clipFrameSelectListener);
      this.clipFrameEle.removeEventListener('resize', this.clipFrameResizeListener);
      this.clipFrameEle.removeEventListener('move', this.clipFrameMoveListener);
      this.clipFrameEle.removeEventListener('draw', this.clipFrameDrawListener);
      this.toolBarEle.removeEventListener('undo', this.toolBarUndoListener);
    }
  }

  start() {
    ({
      left: this.hostX,
      top: this.hostY
    } = this.getBoundingClientRect());

    this.clipFrameEle.setInputData({
      containerX: this.hostX,
      containerY: this.hostY,
      graphInfoList: this.graphInfoList
    });

    this.backdropCtx = this.backdropCanvas.getContext('2d', { alpha: false });
    this.persistenceCtx = this.persistenceCanvas.getContext('2d');
    this.realtimeCtx = this.realtimeCanvas.getContext('2d');

    this.backdropCtx.drawImage(this.bgImage, 0, 0);
    this.imageData = this.backdropCtx.getImageData(0, 0, this.hostWidth, this.hostHeight);
    this.clipFrameEle.style.backgroundImage = `url(${this.backdropCanvas.toDataURL()})`;

    this.posToolBarFn = this.toolBarEle.fixedPositionHighOrder(this.hostWidth, this.hostHeight);
  }

  hostMouseDownListener = async (e) => {
    const pointX = e.pageX - this.hostX;
    const pointY = e.pageY - this.hostY;

    // 右键重置
    if (e.button === 2) {
      this.clearView();
      this.mousePointEle.render({ pointX, pointY, imageData: this.imageData, originCanvas: this.backdropCanvas });
      return;
    }

    if (this.flag === NOClipFrameFlag) {
      this.resizeClipFrameFn = resizeHighOrder({ index: 4, rectX: pointX, rectY: pointY, rectWidth: 0, rectHeight: 0 });
      this.flag |= ResizeClipFrameFlag;
      this.flag &= ~NOClipFrameFlag;
    }
  }

  hostMouseMoveListener = (e) => {
    const pointX = e.pageX - this.hostX;
    const pointY = e.pageY - this.hostY;

    if (this.flag === NOClipFrameFlag) {
      this.mousePointEle.render({ pointX, pointY, imageData: this.imageData, originCanvas: this.backdropCanvas });
    } else if (this.flag & ResizeClipFrameFlag) {
      this.mousePointEle.render({ pointX, pointY, imageData: this.imageData, originCanvas: this.backdropCanvas });
      this.clipFrameBox = this.resizeClipFrameFn(pointX, pointY);
      this.clipFrameEle.render(this.clipFrameBox);
    } else if (this.flag & MoveClipFrameFlag) {
      ({
        x: this.clipFrameBox.x,
        y: this.clipFrameBox.y,
      } = this.moveClipFrameFn(pointX, pointY));
      this.clipFrameEle.render(this.clipFrameBox);
    } else if (this.flag & DrawFlag || this.flag & ResizeGraphFlag) {
      const graphBox = this.resizeGraphFn(pointX, pointY);
      this.currGraphInfo.startX = graphBox.x;
      this.currGraphInfo.startY = graphBox.y;
      this.currGraphInfo.endX = graphBox.x + graphBox.width;
      this.currGraphInfo.endY = graphBox.y + graphBox.height;
      this.currGraphInfo.width = graphBox.width;
      this.currGraphInfo.height = graphBox.height;
      this.canvasRender.draw(this.realtimeCtx, [this.currGraphInfo]);
    } else if (this.flag & MoveGraphFlag) {
      const graphBox = this.moveGraphFn(pointX, pointY);
      this.currGraphInfo.startX = graphBox.x;
      this.currGraphInfo.startY = graphBox.y;
      this.currGraphInfo.endX = graphBox.x + this.currGraphInfo.width;
      this.currGraphInfo.endY = graphBox.y + this.currGraphInfo.height;
      this.canvasRender.draw(this.realtimeCtx, [this.currGraphInfo]);
    }
  }

  hostMouseUpListener = (e) => {
    if (this.flag & ResizeClipFrameFlag || this.flag & MoveClipFrameFlag) {
      this.mousePointEle.style.left = '10000px';
      this.clipFrameEle.style.cursor = 'move';
      this.resizeClipFrameFn = null;
      this.moveClipFrameFn = null;
      this.flag &= ~ResizeClipFrameFlag;
      this.flag &= ~MoveClipFrameFlag;
      this.flag &= ~NOClipFrameFlag;

      const toolBarRenderData = this.posToolBarFn(this.clipFrameBox.x, this.clipFrameBox.y, this.clipFrameBox.width, this.clipFrameBox.height);
      this.toolBarEle.render(toolBarRenderData);
    } else if (this.flag & DrawFlag) {
      this.graphInfoList.forEach(item => item.select = false);
      if (this.currGraphInfo.width > 4 || this.currGraphInfo.height > 4) {
        this.graphInfoList.push(this.currGraphInfo);
      }
      this.saveGraphInfo();

      this.flag &= ~DrawFlag;
      this.flag |= DrawReadyFlag;
      this.clipFrameEle.setInputData({ hoverFlag: true });
    } else if (this.flag & ResizeGraphFlag || this.flag & MoveGraphFlag) {
      if (this.currGraphInfo.width > 4 || this.currGraphInfo.height > 4) {
        this.graphInfoList.push(this.currGraphInfo);
      }
      this.saveGraphInfo();

      this.flag &= ~ResizeGraphFlag;
      this.flag &= ~MoveGraphFlag;
      this.flag &= ~SelectGraphFlag;
      this.resizeGraphFn = null;
      this.moveGraphFn = null;
      this.clipFrameEle.setInputData({ hoverFlag: true });
    }
  }

  hostMouseLeaveListener = () => {
    this.mousePointEle.style.left = '10000px';
  }

  hostContextmenuListener = (e) => {
    e.preventDefault();
  }

  toolBarChangeListener = (e) => {
    if (e.detail) {
      this.clipFrameEle.style.cursor = 'auto';
      this.flag |= DrawReadyFlag;
      this.clipFrameEle.setInputData({ moveEnableFlag: false });
    } else {
      this.clipFrameEle.style.cursor = 'move';
      this.flag &= ~DrawReadyFlag;
      this.clipFrameEle.setInputData({ moveEnableFlag: true });
    }
    this.currToolBarState = e.detail;
  }

  clipFrameSelectListener = (e) => {
    const [selectGraphInfo] = this.graphInfoList.splice(e.detail.graphIndex, 1);
    if (this.flag & SelectGraphFlag) {
      this.graphInfoList.push(this.currGraphInfo);
    }
    this.graphInfoList.push(selectGraphInfo);
    this.graphInfoList.forEach(item => item.select = false);
    selectGraphInfo.select = true;

    this.saveGraphInfo();
    this.graphInfoList.pop();
    this.drawPersistence();
    this.canvasRender.draw(this.realtimeCtx, [selectGraphInfo]);

    this.currGraphInfo = selectGraphInfo;
    this.toolBarEle.refreshView({ ...selectGraphInfo });
    this.clipFrameEle.setInputData({ hoverFlag: false });
    this.flag |= SelectGraphFlag;

    if (Number.isInteger(e.detail.anchorIndex) && e.detail.anchorIndex > -1) {
      this.flag |= ResizeGraphFlag;
      this.resizeGraphFn = resizeHighOrder({
        index: +e.detail.anchorIndex,
        rectX: selectGraphInfo.startX,
        rectY: selectGraphInfo.startY,
        rectWidth: selectGraphInfo.width,
        rectHeight: selectGraphInfo.height
      });
    } else {
      this.flag |= MoveGraphFlag;
      this.moveGraphFn = moveHighOrder({
        offsetX: e.detail.x - selectGraphInfo.startX,
        offsetY: e.detail.y - selectGraphInfo.startY,
        rectWidth: selectGraphInfo.width,
        rectHeight: selectGraphInfo.height,
        hostWidth: this.hostWidth,
        hostHeight: this.hostHeight
      });
    }

  }

  clipFrameResizeListener = (e) => {
    this.toolBarEle.hidden = true;
    this.resizeClipFrameFn = resizeHighOrder({
      index: +e.detail,
      rectX: this.clipFrameBox.x,
      rectY: this.clipFrameBox.y,
      rectWidth: this.clipFrameBox.width,
      rectHeight: this.clipFrameBox.height,
    });
    this.flag |= ResizeClipFrameFlag;
  }

  clipFrameMoveListener = (e) => {
    this.toolBarEle.hidden = true;
    this.moveClipFrameFn = moveHighOrder({
      offsetX: e.detail.x - this.clipFrameBox.x,
      offsetY: e.detail.y - this.clipFrameBox.y,
      rectWidth: this.clipFrameBox.width,
      rectHeight: this.clipFrameBox.height,
      hostWidth: this.hostWidth,
      hostHeight: this.hostHeight
    });
    this.flag |= MoveClipFrameFlag;
  }

  clipFrameDrawListener = (e) => {
    this.flag &= ~DrawReadyFlag;
    this.flag |= DrawFlag;
    this.clipFrameEle.setInputData({ hoverFlag: false });
    this.currGraphInfo = {
      startX: e.detail.x,
      startY: e.detail.y,
      ...this.currToolBarState
    }
    this.resizeGraphFn = resizeHighOrder({
      index: 4,
      rectX: e.detail.x,
      rectY: e.detail.y,
      rectWidth: 0,
      rectHeight: 0
    });
  }

  toolBarUndoListener = (e) => {
    if (this.graphInfoHistoryCursor >= 0) {
      this.graphInfoHistoryCursor -= 1;
      this.graphInfoList = this.graphInfoHistoryCursor === -1 ? [] : [...this.graphInfoHistory[this.graphInfoHistoryCursor]];
      this.drawPersistence();
      this.canvasRender.draw(this.realtimeCtx, []);

      if (this.graphInfoHistoryCursor === 0) {
        this.flag = 0;
        this.clipFrameEle.setInputData({ moveEnableFlag: true });
        this.clipFrameEle.style.cursor = 'move';
      }
    }
  }

  saveGraphInfo() {
    this.drawPersistence();
    this.canvasRender.draw(this.realtimeCtx, []);

    if (this.graphInfoHistoryCursor !== this.graphInfoHistory.length - 1) {
      this.graphInfoHistory.length = this.graphInfoHistoryCursor + 1;
    }
    this.graphInfoHistory.push([...this.graphInfoList]);
    this.graphInfoHistoryCursor = this.graphInfoHistory.length - 1;
  }

  drawPersistence() {
    this.canvasRender.draw(this.persistenceCtx, this.graphInfoList);
    this.persistenceImageData = this.persistenceCtx.getImageData(0, 0, this.hostWidth, this.hostHeight);
    this.clipFrameEle.setInputData({ imageData: this.persistenceImageData, graphInfoList: this.graphInfoList });
  }

  clearView() {
    this.persistenceCtx.clearRect(0, 0, 10000, 10000);
    this.realtimeCtx.clearRect(0, 0, 10000, 10000);
    this.persistenceImageData = null;
    this.graphInfoList = [];
    this.graphInfoHistoryCursor = -1;
    this.graphInfoHistory.length = 0;
    this.toolBarEle.render({ x: 10000, y: 10000 });
    this.toolBarEle.refreshView(null);
    this.clipFrameEle.render({ x: 10000, y: 10000, width: 0, height: 0 });
    this.clipFrameEle.setInputData({ moveEnableFlag: true, imageData: null, graphInfoList: [] });
    this.clipFrameEle.style.cursor = 'auto';
    this.flag = NOClipFrameFlag;
  }

}