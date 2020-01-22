
export default class MaLiang {
  mousePointOffset = 20;
  pointAreaWidth = 120;
  pointAreaHeight = 90;
  currAction = 'init';

  containerEle = null;
  backdropCanvas = null;
  mousePointEle = null;
  clipFrameEle = null;
  pointAreaCanvas = null;
  pointColorEle = null;
  pointLocationEle = null;
  backdropCtx = null;
  pointAreaCtx = null;

  containerWidth = -1;
  containerHeight = -1;
  containerLeft = -1;
  containerTop = -1;

  clipFrameLeft = -1;
  clipFrameTop = -1;
  clipFrameWidth = -1;
  clipFrameHeight = -1;

  bgImage = null;
  imageData = null;
  resizeClipFrameFn = null;
  moveClipFrameFn = null;

  constructor({
    container = paramsError('container'),
    bgImage = paramsError('bgImage'),
    width = paramsError('width'),
    height = paramsError('height')
  } = paramsError('param')) {

    if (new.target !== MaLiang) {
      throw new Error('must new MaLiang()');
    }

    this.containerEle = typeof container === 'string' ? document.body.querySelector(container) : container;
    this.bgImage = bgImage;
    this.containerWidth = width;
    this.containerHeight = height;

    this.initEle();
    this.bindEvent();
    this.initData();
  }

  initData() {
    const clientRect = this.containerEle.getBoundingClientRect();
    this.containerLeft = clientRect.left;
    this.containerTop = clientRect.top;

    this.pointAreaCtx = this.pointAreaCanvas.getContext('2d', { alpha: false });
    this.backdropCtx = this.backdropCanvas.getContext('2d', { alpha: false });

    this.pointAreaCtx.imageSmoothingEnabled = false;
    this.backdropCtx.drawImage(this.bgImage, 0, 0);
    this.imageData = this.backdropCtx.getImageData(0, 0, this.containerWidth, this.containerHeight);
    this.clipFrameEle.style.backgroundImage = `url(${this.backdropCanvas.toDataURL()})`;
  }

  bindEvent() {
    this.containerEle.addEventListener('mousemove', this.containerMouseMove.bind(this));
    this.containerEle.addEventListener('mousedown', this.containerMouseDown.bind(this));
    this.containerEle.addEventListener('mouseup', this.containerMouseUp.bind(this));
    this.containerEle.addEventListener('mouseleave', this.containerMouseLeave.bind(this));
  }

  containerMouseMove(e) {
    const left = e.pageX - this.containerLeft;
    const top = e.pageY - this.containerTop;

    if (this.currAction === 'init') {
      this.refreshMousePoint(left, top);
    } else if (this.currAction === 'set-clip') {
      if (this.resizeClipFrameFn) {
        this.refreshMousePoint(left, top);
        this.resizeClipFrame(left, top);
      } else if (this.moveClipFrameFn) {
        this.moveClipFrame(left, top);
      }
    }
  }

  containerMouseDown(e) {
    const x = e.pageX - this.containerLeft
    const y = e.pageY - this.containerTop;

    if (this.currAction === 'init') {
      this.resizeClipFrameFn = resizeHighOrder({
        index: 4,
        rectX: x,
        rectY: y,
        rectWidth: 0,
        rectHeight: 0,
      });
      this.currAction = 'set-clip';
    } else if (this.currAction === 'set-clip') {
      const classList = e.target.classList;
      if (classList.contains('resize-anchor')) {
        this.resizeClipFrameFn = resizeHighOrder({
          index: +e.target.dataset.index,
          rectX: this.clipFrameLeft,
          rectY: this.clipFrameTop,
          rectWidth: this.clipFrameWidth,
          rectHeight: this.clipFrameHeight,
        });
      } else if (e.target === this.clipFrameEle) {
        this.moveClipFrameFn = moveHighOrder({
          offsetX: x - this.clipFrameLeft,
          offsetY: y - this.clipFrameTop,
          rectWidth: this.clipFrameWidth,
          rectHeight: this.clipFrameHeight,
          containerWidth: this.containerWidth,
          containerHeight: this.containerHeight
        });
      }
    }
  }

  containerMouseUp(e) {
    if (this.currAction === 'set-clip') {
      this.mousePointEle.style.left = '10000px';
      this.clipFrameEle.style.cursor = 'move';
      this.resizeClipFrameFn = null;
      this.moveClipFrameFn = null;
    }
  }

  containerMouseLeave(e) {
    this.mousePointEle.style.left = '10000px';
  }

  resizeClipFrame(left, top) {
    ({
      x: this.clipFrameLeft,
      y: this.clipFrameTop,
      width: this.clipFrameWidth,
      height: this.clipFrameHeight
    } = this.resizeClipFrameFn(left, top));

    this.clipFrameEle.style.left = `${this.clipFrameLeft}px`;
    this.clipFrameEle.style.top = `${this.clipFrameTop}px`;
    this.clipFrameEle.style.width = `${this.clipFrameWidth}px`;
    this.clipFrameEle.style.height = `${this.clipFrameHeight}px`;
    this.clipFrameEle.style.backgroundPosition = `-${this.clipFrameLeft + 2}px -${this.clipFrameTop + 2}px`;
  }

  moveClipFrame(left, top) {
    ({
      x: this.clipFrameLeft,
      y: this.clipFrameTop
    } = this.moveClipFrameFn(left, top));

    this.clipFrameEle.style.left = `${this.clipFrameLeft}px`;
    this.clipFrameEle.style.top = `${this.clipFrameTop}px`;
    this.clipFrameEle.style.backgroundPosition = `-${this.clipFrameLeft + 2}px -${this.clipFrameTop + 2}px`;
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


  initEle() {
    this.containerEle.innerHTML = CONTAINER_HTML;
    let position = window.getComputedStyle(this.containerEle).getPropertyValue('position');
    position = position !== 'absolute' && position !== 'relative' && position !== 'fixed' ? 'relative' : position;

    this.containerEle.style.cssText = `
      position: ${position};  
      width: ${this.containerWidth}px;
      height: ${this.containerHeight}px;
      overflow: hidden;
      box-sizing: border-box;
    `;

    this.backdropCanvas = this.containerEle.querySelector('.backdrop');
    this.backdropCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      filter: brightness(0.6);
    `;
    this.backdropCanvas.width = this.containerWidth;
    this.backdropCanvas.height = this.containerHeight;

    this.mousePointEle = this.containerEle.querySelector('.mouse-point');
    this.mousePointEle.style.cssText = `
      position: absolute;
      left: 10000px;
      top: 0;
      width: 120px;
      z-index: 1;
    `;

    this.pointAreaCanvas = this.containerEle.querySelector('.point-area');
    this.pointAreaCanvas.width = this.pointAreaWidth;
    this.pointAreaCanvas.height = this.pointAreaHeight;

    const pointInfo = this.containerEle.querySelector('.point-info');
    pointInfo.style.cssText = `
      line-height: 1.3;
      padding: 5px 0 5px 5px;
      background-color: #000;
      color: #fff;
      font-size: 12px;
      box-sizing: border-box;
      user-select: none;
    `;

    this.pointLocationEle = this.containerEle.querySelector('.point-location');
    this.pointColorEle = this.containerEle.querySelector('.point-color');

    this.clipFrameEle = this.containerEle.querySelector('.clip-frame');
    this.clipFrameEle.style.cssText = `
      position: absolute;
      top: 0;
      left: 10000px;
      border: solid 2px #00ccff;
      background-repeat: no-repeat;
      box-sizing: border-box;
    `;

    const resizeAnchors = this.containerEle.querySelectorAll('.resize-anchor');
    const resizeAnchorStyles = `
      position: absolute;
      width: 8px;
      height: 8px;
      border: solid #00ccff 1px;
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
      box-sizing: border-box;
    `;

    resizeAnchors[0].style.cssText = `
      ${resizeAnchorStyles}
      left: -5px;
      top: -5px;
      cursor: nwse-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[1].style.cssText = `
      ${resizeAnchorStyles}
      left: calc(50% - 4px);
      top: -5px;
      cursor: ns-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[2].style.cssText = `
      ${resizeAnchorStyles}
      left: calc(100% - 3px);
      top: -5px;
      cursor: nesw-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[3].style.cssText = `
      ${resizeAnchorStyles}
      left: calc(100% - 3px);
      top: calc(50% - 4px);
      cursor: ew-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[4].style.cssText = `
      ${resizeAnchorStyles}
      left: calc(100% - 3px);
      top: calc(100% - 3px);
      cursor: nwse-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[5].style.cssText = `
      ${resizeAnchorStyles}
      left: calc(50% - 4px);
      top: calc(100% - 3px);
      cursor: ns-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[6].style.cssText = `
      ${resizeAnchorStyles}
      left: -5px;
      top: calc(100% - 3px);
      cursor: nesw-resize;
      box-sizing: border-box;
    `;

    resizeAnchors[7].style.cssText = `
      ${resizeAnchorStyles}
      left: -5px;
      top: calc(50% - 4px);
      cursor: ew-resize;
      box-sizing: border-box;
    `;
  }
}

const CONTAINER_HTML = `
  <canvas class="backdrop"></canvas>

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
  </div>

  <div class="tool-bar"></div>

  <div class="clip-info"></div>
`;

function resizeHighOrder({ index, rectX, rectY, rectWidth, rectHeight }) {
  let oneWayDrag, fixedPointX, fixedPointY, oneWayXLength, oneWayYLength;

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

function moveHighOrder({ offsetX, offsetY, rectWidth, rectHeight, containerWidth, containerHeight }) {
  return function (x, y) {
    let _x = x - offsetX;
    let _y = y - offsetY;

    if (_x <= 0) {
      _x = 0;
    } else if (_x >= containerWidth - rectWidth) {
      _x = containerWidth - rectWidth;
    }

    if (_y <= 0) {
      _y = 0;
    } else if (_y >= containerHeight - rectHeight) {
      _y = containerHeight - rectHeight;
    }

    return {
      x: _x,
      y: _y
    }
  }
}

function paramsError(param) {
  throw new Error(`params(${param}) can not empty`);
}