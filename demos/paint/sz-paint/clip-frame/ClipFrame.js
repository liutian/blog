import { UIElement } from '../UIElement.js';
import { installListener, getPositionColor, initCanvas } from '../util.js';
import { setHandlePoints, reverseColor } from '../tool.js';
import CanvasRender from '../CanvasRender.js';

export default class ClipFrame extends UIElement {
  clipInfoEle = null;
  detectCanvas = null;
  detectCtx = null;
  canvasRender = new CanvasRender();
  inputData = {
    drawEnableFlag: false,
    imageData: null,
    containerX: 0,
    containerY: 0,
    graphInfoList: []
  }

  initView() {
    const resizeAnchors = this.queryAll('.resize-anchor');
    setHandlePoints(resizeAnchors);
    this.clipInfoEle = this.query('.clip-info');
    this.detectCanvas = initCanvas(this._shadowRoot, '.detect', 10000, 10000);
  }

  bindEvent() {
    this.unbindEventFn = installListener([
      [this._shadowRoot, 'mousedown', this.hostMouseDownListener],
      [this._shadowRoot, 'mousemove', this.hostMouseMoveListener]
    ]);
  }

  start() {
    this.detectCtx = this.detectCanvas.getContext('2d');
    this.detectCtx.imageSmoothingEnabled = false;
  }

  hostMouseMoveListener = (e) => {
    if (this.inputData.drawEnableFlag) {
      if (!this.inputData.imageData) {
        return;
      }

      const pointX = e.pageX - this.inputData.containerX;
      const pointY = e.pageY - this.inputData.containerY;
      const colors = getPositionColor(this.inputData.imageData, pointX, pointY);
      if (colors[0] > 0 || colors[1] > 0 || colors[2] > 0) {
        this.style.cursor = 'move';
      } else {
        this.style.cursor = 'default';
      }
    }
  }

  hostMouseDownListener = (e) => {
    if (this.inputData.drawEnableFlag) {
      e.stopPropagation();
      if (this.inputData.imageData) {
        const pointX = e.pageX - this.inputData.containerX;
        const pointY = e.pageY - this.inputData.containerY;
        const graphIndex = this.detectGraphIndex(pointX, pointY);
        if (graphIndex !== -1) {
          this.dispatchEvent(new CustomEvent('select', {
            detail: graphIndex
          }));
          return;
        }
      }

      const pointX = e.pageX - this.inputData.containerX;
      const pointY = e.pageY - this.inputData.containerY;
      this.dispatchEvent(new CustomEvent('draw', { detail: { x: pointX, y: pointY } }));
    } else if (e.target.classList.contains('resize-anchor')) {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('resize', {
        detail: e.target.dataset.index
      }));
    } else {
      e.stopPropagation();
      const pointX = e.pageX - this.inputData.containerX;
      const pointY = e.pageY - this.inputData.containerY;
      this.dispatchEvent(new CustomEvent('move', { detail: { x: pointX, y: pointY } }));
    }
  }

  render({ x, y, width, height }) {
    // this.detectCanvas.style.width = `${width || 0}px`;
    // this.detectCanvas.style.height = `${height || 0}px`;
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
    this.style.backgroundPosition = `-${x + 2}px -${y + 2}px`;

    if (y < 20) {
      this.clipInfoEle.style.top = `0px`;
    } else {
      this.clipInfoEle.style.top = `-20px`;
    }

    this.style.width = `${width}px`;
    this.style.height = `${height}px`;
    this.clipInfoEle.textContent = `${width} x ${height}`;
  }

  detectGraphIndex(x, y) {
    const colors = getPositionColor(this.inputData.imageData, x, y);
    if (colors.reduce((total, curr) => total + curr, 0) === 0) {
      return -1;
    }

    const color = reverseColor(colors);
    const matchGraphIndexs = this.inputData.graphInfoList.reduce((arr, item, index) => {
      if (item.color === color) {
        arr.push(index);
      }
      return arr;
    }, []);
    let graphIndex = -1;

    this.detectCtx.save();
    matchGraphIndexs.forEach((index) => {
      this.canvasRender.draw(this.detectCtx, [this.inputData.graphInfoList[index]]);
      const imageData = this.detectCtx.getImageData(x, y, 1, 1);
      if (imageData.data[0] === colors[0] && imageData.data[1] === colors[1] && imageData.data[2] === colors[2]) {
        graphIndex = index;
      }
    });
    this.detectCtx.restore();

    return graphIndex;
  }
}