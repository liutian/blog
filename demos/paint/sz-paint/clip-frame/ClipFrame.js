import { UIElement } from '../UIElement.js';
import { installListener, getPositionAreaColors, initCanvas, parseCursor, detectPositionAnchor } from '../util.js';
import { setHandlePoints, reverseColor } from '../tool.js';
import CanvasRender from '../CanvasRender.js';

const positionDetectOffset = 2;
export default class ClipFrame extends UIElement {
  clipInfoEle = null;
  detectCanvas = null;
  detectCtx = null;
  canvasRender = new CanvasRender();
  inputData = {
    moveEnableFlag: false,
    imageData: null,
    containerX: 0,
    containerY: 0,
    graphInfoList: [],
    hoverFlag: false
  };

  initView() {
    const resizeAnchors = this.queryAll('.resize-anchor');
    setHandlePoints(resizeAnchors);
    this.clipInfoEle = this.query('.clip-info');
    this.detectCanvas = initCanvas(this._shadowRoot, '.detect', 10000, 10000);
  }

  bindEvent() {
    this.unbindEventFn = installListener([
      [this._shadowRoot, 'mousedown', this.hostMouseDownListener],
      [this._shadowRoot, 'mousemove', this.hostMouseMoveListener],
    ]);
  }

  start() {
    this.detectCtx = this.detectCanvas.getContext('2d');
    this.detectCtx.imageSmoothingEnabled = false;
  }

  hostMouseMoveListener = (e) => {
    if (this.inputData.hoverFlag) {
      if (!this.inputData.imageData) {
        return;
      }

      const pointX = e.pageX - this.inputData.containerX;
      const pointY = e.pageY - this.inputData.containerY;
      const [graphIndex, anchorIndex] = this.detectGraphIndex(pointX, pointY);

      // 考虑锚点颜色和本身颜色不同
      if (graphIndex !== -1) {
        this.style.cursor = 'move';

        if (anchorIndex !== -1) {
          this.style.cursor = parseCursor(anchorIndex);
        }

      } else {
        this.style.cursor = 'default';
      }
    }
  }

  hostMouseDownListener = (e) => {
    if (e.target.classList.contains('resize-anchor')) {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('resize', {
        detail: e.target.dataset.index
      }));
    } else if (this.inputData.moveEnableFlag) {
      e.stopPropagation();
      const pointX = e.pageX - this.inputData.containerX;
      const pointY = e.pageY - this.inputData.containerY;
      this.dispatchEvent(new CustomEvent('move', { detail: { x: pointX, y: pointY } }));
    } else {
      e.stopPropagation();

      if (this.inputData.imageData) {
        const pointX = e.pageX - this.inputData.containerX;
        const pointY = e.pageY - this.inputData.containerY;
        const [graphIndex, anchorIndex] = this.detectGraphIndex(pointX, pointY);
        if (graphIndex !== -1) {
          this.style.cursor = 'move';
          const graph = this.inputData.graphInfoList[graphIndex];

          if (graph.select !== true) {
            // 移动
            this.dispatchEvent(new CustomEvent('select', {
              detail: { graphIndex, x: pointX, y: pointY },
            }));
          } else if (anchorIndex !== -1) {
            this.style.cursor = parseCursor(anchorIndex);
            // 缩放
            this.dispatchEvent(new CustomEvent('select', {
              detail: { graphIndex, anchorIndex }
            }));
          } else {
            // 移动
            this.dispatchEvent(new CustomEvent('select', {
              detail: { graphIndex, x: pointX, y: pointY }
            }));
          }
          return;
        }
      }

      const pointX = e.pageX - this.inputData.containerX;
      const pointY = e.pageY - this.inputData.containerY;
      this.dispatchEvent(new CustomEvent('draw', { detail: { x: pointX, y: pointY } }));
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
    let colors = getPositionAreaColors(this.inputData.imageData, x, y, positionDetectOffset);
    if (colors.length === 0) {
      return [-1, -1];
    }

    let matchGraphIndexs = [];
    let graphIndex = -1;
    let anchorIndex = -1;
    colors = [...new Set(colors.map(c => reverseColor(c)))];
    matchGraphIndexs = this.inputData.graphInfoList.reduce((arr, item, index) => {
      if (colors.includes(item.color) && !arr.includes(index)) {
        arr.push(index);
      } else if (item.select) {
        arr.push(index);
      }
      return arr;
    }, matchGraphIndexs).sort((a, b) => {
      return a > b ? -1 : 1;
    });

    this.detectCtx.save();
    for (let i = 0; i < matchGraphIndexs.length; i++) {
      const index = matchGraphIndexs[i];
      const graph = this.inputData.graphInfoList[index];
      if (graph.select) {
        const _anchorIndex = detectPositionAnchor(graph.startX, graph.startY, graph.width, graph.height, x, y, 5);
        if (_anchorIndex !== -1) {
          graphIndex = index;
          anchorIndex = _anchorIndex;
          break;
        }
      }

      this.canvasRender.draw(this.detectCtx, [graph]);
      const imageData = this.detectCtx.getImageData(x - positionDetectOffset, y - positionDetectOffset, positionDetectOffset * 2 + 1, positionDetectOffset * 2 + 1);
      const colors = getPositionAreaColors(imageData, positionDetectOffset, positionDetectOffset);
      if (colors.length > 0) {
        graphIndex = index;
        anchorIndex = -1;
        break;
      }
    }
    this.detectCtx.restore();

    return [graphIndex, anchorIndex];
  }
}