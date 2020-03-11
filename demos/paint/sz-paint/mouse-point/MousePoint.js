import { UIElement } from "../UIElement.js";
import { getPositionColor, initCanvas } from '../util.js';

// 鼠标点的预览区域距离鼠标的偏移量
const mousePointOffset = 20;
// 预览区的宽度
const pointAreaWidth = 120;
// 预览区的高度
const pointAreaHeight = 90;

export default class MousePoint extends UIElement {

  pointAreaCanvas = null;
  pointAreaCtx = null;
  pointLocationEle = null;
  pointColorEle = null;

  initView() {
    this.pointAreaCanvas = initCanvas(this._shadowRoot, '.point-area', pointAreaWidth, pointAreaHeight)

    this.pointLocationEle = this.query('.point-location');
    this.pointColorEle = this.query('.point-color');
  }

  start() {
    this.pointAreaCtx = this.pointAreaCanvas.getContext('2d', { alpha: false });
    this.pointAreaCtx.imageSmoothingEnabled = false;
  }

  render({ pointX, pointY, imageData, originCanvas }) {
    this.style.left = (pointX + mousePointOffset) + 'px';
    this.style.top = (pointY + mousePointOffset) + 'px';
    this.pointLocationEle.textContent = `(${pointX},${pointY})`;
    const colors = getPositionColor(imageData, pointX, pointY);
    this.pointColorEle.textContent = `(${colors[0]},${colors[1]},${colors[2]})`;

    this.pointAreaCtx.fillStyle = '#000000';
    this.pointAreaCtx.fillRect(0, 0, pointAreaWidth, pointAreaHeight);
    this.pointAreaCtx.drawImage(originCanvas, pointX - 20, pointY - 15, 40, 30, 0, 0, pointAreaWidth, pointAreaHeight);

    this.pointAreaCtx.strokeStyle = '#00ccff';
    this.pointAreaCtx.lineWidth = 1;
    this.pointAreaCtx.strokeRect(0.5, 0.5, pointAreaWidth - 1, pointAreaHeight - 1);

    this.pointAreaCtx.lineWidth = 1;

    this.pointAreaCtx.beginPath();
    this.pointAreaCtx.moveTo(Math.floor(pointAreaWidth / 2) + 0.5, 0);
    this.pointAreaCtx.lineTo(Math.floor(pointAreaWidth / 2) + 0.5, pointAreaHeight);
    this.pointAreaCtx.stroke();

    this.pointAreaCtx.beginPath();
    this.pointAreaCtx.moveTo(0, Math.floor(pointAreaHeight / 2) + 0.5);
    this.pointAreaCtx.lineTo(pointAreaWidth, Math.floor(pointAreaHeight / 2) + 0.5);
    this.pointAreaCtx.stroke();
  }
}