export class UIElement extends HTMLElement {
  // 组件主数据保存区
  inputData = {};
  unbindEventFn = null;
  // 组件根DOM
  _shadowRoot = null;
  __template_path = '/template.js';
  __style_path = '/style.js';

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'closed' });
  }

  // 加载组件模板和样式
  async loadResource() {
    const { default: template } = await import(this.constructor.__root_path + this.__template_path);
    this._shadowRoot.innerHTML = template;
    const { default: style } = await import(this.constructor.__root_path + this.__style_path);
    const styleEle = document.createElement('style');
    styleEle.textContent = style;
    this._shadowRoot.appendChild(styleEle);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.inputData[name] = newValue;
  }

  // 初始化需要操作的DOM元素
  initView() {

  }

  // 绑定DOM事件
  bindEvent() {

  }

  // 组件开始运行
  start() {

  }

  // 组件主体试图更新逻辑
  render(data) {

  }

  setInputData(data) {
    Object.assign(this.inputData, data);
  }

  // 重置组件数据包括DOM和绑定事件
  reset() {
    if (this.unbindEventFn) {
      this.unbindEventFn();
    }
  }

  query(selector) {
    return this._shadowRoot.querySelector(selector);
  }

  queryAll(selector) {
    return this._shadowRoot.querySelectorAll(selector);
  }
}