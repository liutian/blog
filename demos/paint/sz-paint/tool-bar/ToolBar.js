import { UIElement } from "../UIElement.js";
import { installListener, fixedPositionHighOrder } from '../util.js';

export default class ToolBar extends UIElement {
  primaryToolEle = null;
  secondaryToolEle = null;
  locationMarkerEle = null;
  sizeToolEle = null;
  colorToolEle = null;
  fontSizeToolEle = null;

  primaryToolWidth = -1;
  primaryToolHeight = -1;
  secondaryToolWidth = -1;
  secondaryToolHeight = -1;
  toolState = null;
  currToolState = null;

  initView() {
    this.primaryToolEle = this.query('.primary-tool');

    const primaryToolStyles = window.getComputedStyle(this.primaryToolEle);
    this.primaryToolWidth = Math.ceil(window.parseFloat(primaryToolStyles.getPropertyValue('width')));
    this.primaryToolHeight = Math.ceil(window.parseFloat(primaryToolStyles.getPropertyValue('height')));

    this.secondaryToolEle = this.query('.secondary-tool');

    const secondaryToolStyles = window.getComputedStyle(this.secondaryToolEle);
    this.secondaryToolWidth = Math.ceil(window.parseFloat(secondaryToolStyles.getPropertyValue('width')));
    this.secondaryToolHeight = Math.ceil(window.parseFloat(secondaryToolStyles.getPropertyValue('height')));

    this.locationMarkerEle = this.query('.location-marker');

    // 必须在getComputedStyle之后设置坐标
    this.style.position = 'absolute';

    this.sizeToolEle = this.query('.size-tool');
    this.colorToolEle = this.query('.color-tool');
    this.fontSizeToolEle = this.query('.font-size-tool');
  }

  bindEvent() {
    this.unbindEventFn = installListener([
      [this.primaryToolEle, 'click', this.primaryToolClickListener],
      [this.secondaryToolEle, 'click', this.secondaryToolClickListener],
      [this.fontSizeToolEle, 'change', this.fontSizeToolChangeListener]
    ]);
  }

  reset() {
    this.currToolState = null;
  }

  start() {
    this.toolState = {
      rect: { size: 'normal', color: 'red', locationX: -1 },
      circular: { size: 'normal', color: 'red', locationX: -1 },
      arrow: { size: 'normal', color: 'red', locationX: -1 },
      paint: { size: 'normal', color: 'red', locationX: -1 },
      mosaic: { size: 'normal', locationX: -1 },
      font: { size: 'normal', color: 'red', locationX: -1 }
    };

    this.primaryToolEle.querySelectorAll('.graph-tool').forEach((item) => {
      const state = this.toolState[item.dataset.type];
      state.locationX = item.offsetLeft + (item.offsetWidth / 2);
    });
    this.style.left = '10000px';
  }

  primaryToolClickListener = (e) => {
    const classList = e.target.classList;
    if (!classList.contains('tool-item')) {
      return;
    }

    if (classList.contains('graph-tool')) {
      if (e.target.classList.contains('active')) {
        this.refreshView(null);
      } else {
        this.refreshView({ type: e.target.dataset.type });
      }
      this.dispatchEvent(new CustomEvent('change', {
        detail: this.currToolState
      }));
    } else if (classList.contains('undo-tool')) {
      this.refreshView(null);
      this.dispatchEvent(new CustomEvent('undo'));
    }
  }

  secondaryToolClickListener = (e) => {
    if (!e.target.classList.contains('tool-item')) {
      return;
    }

    this.refreshView({ size: e.target.dataset.size, color: e.target.dataset.color });

    this.dispatchEvent(new CustomEvent('change', {
      detail: this.currToolState
    }));
  }

  fontSizeToolChangeListener = () => {
    this.currToolState.size = this.toolState.font.size = e.target.value;
  }

  render({ x, y, location }) {
    this.hidden = false;
    this.secondaryToolEle.hidden = true;
    this.locationMarkerEle.hidden = true;
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;

    const secondaryStyles = this.secondaryToolEle.style;

    secondaryStyles.left = 'unset';
    secondaryStyles.right = 'unset';
    secondaryStyles.top = 'unset';
    secondaryStyles.bottom = 'unset';

    // 从左到右从高到低 1001 101 110  1010
    if (location === 9) {
      this.style.textAlign = 'left';
      this.secondaryToolEle.style.left = '0px';
      this.secondaryToolEle.style.bottom = 'calc( 100% + 10px)';
      this.locationMarkerEle.style.bottom = 'calc(100%)';
      this.locationMarkerEle.style.transform = 'rotate(180deg)';
    } else if (location === 5) {
      this.style.textAlign = 'right';
      this.secondaryToolEle.style.right = '0px';
      this.secondaryToolEle.style.bottom = 'calc( 100% + 10px)';
      this.locationMarkerEle.style.bottom = 'calc(100%)';
      this.locationMarkerEle.style.transform = 'rotate(180deg)';
    } else if (location === 6) {
      this.style.textAlign = 'right';
      this.secondaryToolEle.style.right = '0px';
      this.secondaryToolEle.style.top = 'calc( 100% + 10px)';
      this.locationMarkerEle.style.bottom = 'unset';
      this.locationMarkerEle.style.transform = 'unset';
    } else if (location === 10) {
      this.style.textAlign = 'left';
      this.secondaryToolEle.style.left = '0px';
      this.secondaryToolEle.style.top = 'calc( 100% + 10px)';
      this.locationMarkerEle.style.bottom = 'unset';
      this.locationMarkerEle.style.transform = 'unset';
    }
  }

  refreshView(currToolState) {
    if (!currToolState) {
      this.secondaryToolEle.hidden = true;
      this.locationMarkerEle.hidden = true;
      this.currToolState = null;

      this.primaryToolEle.querySelectorAll('.graph-tool').forEach(item => {
        item.style.backgroundColor = 'transparent';
        item.classList.remove('active');
      });
      return;
    }

    currToolState.type = currToolState.type || this.currToolState.type;
    const toolState = this.toolState[currToolState.type];
    if (currToolState.color) {
      toolState.color = currToolState.color;
    } else {
      currToolState.color = toolState.color;
    }
    if (currToolState.size) {
      toolState.size = currToolState.size;
    } else {
      currToolState.size = toolState.size;
    }
    this.currToolState = { ...currToolState };

    this.primaryToolEle.hidden = false;
    this.secondaryToolEle.hidden = false;
    this.locationMarkerEle.hidden = false;

    this.primaryToolEle.querySelectorAll('.graph-tool').forEach(item => {
      if (item.dataset.type === currToolState.type) {
        item.style.backgroundColor = '#000';
        item.classList.add('active');
      } else {
        item.style.backgroundColor = 'transparent';
        item.classList.remove('active');
      }
    });

    if (['rect', 'circular', 'arrow', 'paint'].includes(currToolState.type)) {
      this.sizeToolEle.hidden = false;
      this.colorToolEle.hidden = false;
      this.fontSizeToolEle.hidden = true;
    } else if (currToolState.type === 'mosaic') {
      this.sizeToolEle.hidden = false;
      this.colorToolEle.hidden = true;
      this.fontSizeToolEle.hidden = true;
    } else if (currToolState.type === 'font') {
      this.sizeToolEle.hidden = true;
      this.colorToolEle.hidden = false;
      this.fontSizeToolEle.hidden = false;
    }

    this.sizeToolEle.querySelectorAll('.tool-item').forEach((item) => {
      if (currToolState.size === item.dataset.size && item.dataset.size) {
        item.style.backgroundColor = '#000';
      } else {
        item.style.backgroundColor = 'transparent';
      }
    });

    this.colorToolEle.querySelectorAll('.tool-item').forEach((item) => {
      if (currToolState.color === item.dataset.color && item.dataset.color) {
        item.style.backgroundColor = '#000';
      } else {
        item.style.backgroundColor = 'transparent';
      }
    });

    [...this.fontSizeToolEle.options].forEach((item) => {
      item.selected = item.value === currToolState.size;
    });

    this.locationMarkerEle.style.left = (this.toolState[currToolState.type].locationX - 5) + 'px';

    const width = window.parseInt(window.getComputedStyle(this.secondaryToolEle).getPropertyValue('width'));
    const left = this.toolState[currToolState.type].locationX - width / 2;
    this.secondaryToolEle.style.left = (left <= 0 ? 0 : left) + 'px';
  }

  fixedPositionHighOrder(hostWidth, hostHeight) {
    return fixedPositionHighOrder(hostWidth, hostHeight, this.primaryToolWidth,
      this.primaryToolHeight + this.secondaryToolHeight + 10, this.secondaryToolHeight, 5)
  }

}