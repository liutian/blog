### DOM接口概述
几乎所有DOM对象都会实现这样一个接口继承链：HTMLElement --> Element --> Node --> EventTarget

### EventTarget
- `addEventListener()`
- `removeEventListener()`
- `dispatchEvent()`

### Node 继承 EventTarget
- 属性
  - `parentNode: Node`
  - `parentElement: Node`
  - `nextSibling: Node`
  - `previousSibling: Node`
  - `childNodes: NodeList`
  - `firstChild: Node`
  - `lastChild: Node`
  - `nodeType: number`
  - `nodeName: string`
  - `nodeValue: any`
  - `textContent: string`
- 方法
  - `appendChild()` 如果参数引用了 DOM 树上的现有节点，则节点将从当前位置分离，并附加到新位置
  - `insertBefore()` 在当前节点下增加一个子节点 Node，并使该子节点位于参考节点的前面
  - `removeChild()` 
  - `replaceChild()`
  - `contains()` 传入的节点是否为该节点的后代节点
  - `cloneNode()`
  - `normalize()` 将当前节点和它的后代节点”规范化“，不存在一个空的文本节点，或者两个相邻的文本节点

### Element 继承 Node
- 属性
  - `id: string`
  - `tagName: string` 对于元素节点来说，tagName属性的值和nodeName属性的值是相同的.
  - `innerHTML: string`
  - `className: string`
  - `classList: DOMTokenList` 表示一组空格分隔的标记
    - `length`
    - `contains()`
    - `add()`
    - `remove()`
    - `replace()`
    - `toggle()`
  - `children: HTMLCollectioin` 忽略所有非元素子节点
  - `firstElementChild` 
  - `lastElementChild`
  - `clientX: number` X可以替换为 `Height` `Width` `Top`  `Left` 
  - `scrollX: number` X可以替换为 `Height` `Width` `Left` `Top`
- 方法
  - `querySelector()`
  - `querySelectorAll()`
  - `remove()`
  - `replaceWith()`
  - `getAttribute()`
  - `setAttribute()`
  - `removeAttribute()`
  - `toggleAttribute()`
  - `insertAdjacentElement()`
  - `insertAdjacentHTML()`
  - `insertAdjacentText()`
  - `getElementsByTagName(): HTMLCollection`
  - `getElementsByClassName(): HTMLCollection`
  - `attachShadow()`
  - `getBoundingClientRect()`
  - `getClientRects()` 返回元素每一个盒子的边界矩形的矩形集合，适用于行内元素有多个行盒的情况
  - `scrollTo()` 滚动到指定坐标
    - 实现元素平滑滚动 `element.scrollTo({top: 1000, behavior: 'smooth'})`
  - `scroll()` 和scrollTo用法功能一样
  - `scrollBy()` 滚动指定距离
  - `scrollIntoView()`


### HTMLElement 继承 Element
- 属性
  - `style`
  - `hidden`
  - `dataset`
  - `offsetX` X可以替换为 `Height` `Width` `Top`  `Left` 
  - `offsetParent` 如果没有就是body元素
  - `contentEditable: string` 获取/设置元素的可编辑状态 `'true'|'false'`
- 方法
  - `click()`
  - `blur()`
  - `focus()`

### HTMLDocument
- 属性
  - `cookie`
  - `designMode: string` 控制整个文档是否可编辑
  - `domain`
  - `lastModified: string` 包含了当前文档的最后修改日期和时间
  - `location`
  - `readyState: string` 属性描述了document 的加载状态
  - `referrer`
  - `title`
- 方法
  - `hasFocus()`
  - `open()`
  - `write()`
  - `close()`
  - `execCommand()`
  - `queryCommandEnabled()`

### Document 继承 Node 包含 HTMLDocument接口
- 属性
  - `body`
  - `head`
  - `hidden: boolean` 表明当前页面是否隐藏
  - `visibilityState: string` 表明当前文档的可见性，可能的取值有 `visible|hidden|prerender`
  - `documentElement` 代表文档的 `html` 元素。
  - `images: HTMLCollection` 当前文档中所有 image 元素的集合
  - `links: HTMLCollection` 包含文档中所有超链接的列表
  - `scripts: HTMLCollection` 包含了当前文档中所有 script 元素的集合.
  - `activeElement` 当前文档的活动元素，一般为获取获取焦点的输入框或者按钮
- 方法
  - `createElement()` 
  - `createDocumentFragment()`
  - `createComment()` 创建注释节点
  - `createTextNode()` 创建一个文本节点
  - `createRange()`
  - `getElementById()`
  - `getElementsByName(): NodeList`
  - `querySelector()`
  - `querySelectorAll()`
  - `getSelection()`
  - `hasFocus()` 表明当前文档或者当前文档内的节点是否获得了焦点，当查看一个文档时，当前文档中获得焦点的元素一定是当前文档的活动元素，但一个文档中的活动元素不一定获得了焦点.。例如， 一个在后台的窗口中的活动元素一定没有获得焦点。一般配合 `activeElement` 监控用户行为
- 事件
  - `visibilitychange`
  - `fullscreenchange`
  - `DOMContentLoaded`

### DocumentFragment
一个没有父对象的最小文档对象。它被作为一个轻量版的 Document 使用，就像标准的document一样，存储由节点组成的文档结构。与document相比，最大的区别是DocumentFragment 不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，且不会导致性能等问题

### HTMLCollection
表示通用元素集合，会即时更新，不能操作该集合，适用于 `document.images` `document.links` `document.scripts`

### NodeList
表示特定节点集合，适用于 `Node.childNodes` 或者 `querySelectorAll`，它是一个类似数组的对象，但是可以使用 forEach() 来迭代。可以使用 Array.from() 将其转换为数组，一般情况它是一个实时集合，例如 `Node.childNodes`，其他情况它是一个静态集合，例如 `querySelectorAll`

### HTMLInputElement 继承 Element
- 属性
  - `value`
  - `defaultValue`
  - `checked` 适用于 `type: checkbox|radio`
  - `defaultChecked` 适用于 `type: checkbox|radio`
  - `size` 宽度设置为指定字符长度
  - `accept` 适用于 `type: file`
  - `files` 适用于 `type: file`
  - `selectionStart`
  - `selectionEnd`
  - `selectionDirection`
- 方法
  - `select()` 选择输入框全部文本
  - `setSelectionRange()` 选择输入框部分文本


### HTMLAnchorElement 继承 Element
- 属性
  - `download` 浏览器在下载链接指向的文件时，文件本地保存的文件名

### HTMLImageElement 继承 Element
- 属性
  - `decoding` 属性用于告诉浏览器使用何种方式解析图像数据 
    - `sync` 同步解码图像，保证与其他内容一起显示
    - `async` 异步解码图像，加快显示其他内容
    - `auto` 默认模式，表示不偏好解码模式。由浏览器决定哪种方式更适合用户
- 方法
  - `decode()` 返回一个当图片解码后可安全用于附加到 DOM 上时 resolves 的 Promise 对象，这可用于在将图片附加到一个 DOM 中的元素（或作为一个新元素加入 DOM 中）之前启动加载，所以在将图像添加到 DOM 时可以立即渲染图像。防止了将图像加入DOM后图像的加载造成下一帧渲染的延迟
```js
const img = new Image();
img.src = 'nebula.jpg';
img.decode()
.then(() => {
  document.body.appendChild(img);
})
.catch((encodingError) => {
  // Do something with the error.
})
```

### HTMLSelectElement 继承 Element
- 属性
  - `value`
  - `options` 
  - `selectedIndex` 
  - `selectedOptions`
  - `size`
- 方法
  - `add()`
  - `remove()`

### Window
- 属性
  - `name` 窗口名称
  - `frameElement` 指向包裹当前窗口的 iframe 元素
  - `parent` 当前窗口或子窗口的父窗口的引用
  - `top` 窗口层级最顶层窗口的引用
  - `frames` 返回当前窗口中所有子窗体的数组
  - `innerHeight` 获得浏览器窗口的内容区域的高度，包含水平滚动条(如果有的话)
  - `outerHeight` 获取整个浏览器窗口的高度，包括侧边栏（如果存在）、窗口镶边和窗口调正边框
  - `pageXOffset`
  - `pageYOffset`
  - `screenX`  X可以替换为 `Top`  `Left` `X` `Y`
  - `customElements` 用于定义Web Component
  - `crypto` 允许网页访问某些加密相关服务
  - `devicePixelRatio` 返回当前显示器的物理像素和设备独立像素的比例
- 方法
  - `getSelection()`
  - `open()`
  - `postMessage()`
  - `print()`
  - `prompt()`
  - `scrollX()`