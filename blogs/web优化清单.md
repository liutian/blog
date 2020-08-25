### 度量标准
- `FP` 记录页面第一次绘制像素的时间，比如说页面的背景色是灰色的，那么在显示灰色背景时就记录下了 FP 指标
- `FCP` 记录页面首次绘制文本、图片、非空白 Canvas 或 SVG 的时间
- `LCP` 用于记录视窗内最大的元素绘制的时间，该时间会随着页面渲染变化而变化，因为页面中的最大元素在渲染过程中可能会发生改变，另外该指标会在用户第一次交互后停止记录
- `TTI` 首次可交互时间

### 性能指标
- 100 毫秒：用户采取操作后，要在 100 毫秒内收到响应，才不会有延迟感
- 3G网络环境下首屏可交互时间小于5s
- 重要文件的大小预算小于170kb

### 性能优化之网络传输
- cdn加速
- 针对文本文件使用 `gzip` 或者 `brotli` 进行压缩传输
- HTTP缓存
- 遵守HTML文件“14kb 规则”，保障网站必要内容都在14kbHTML文件中(TCP 慢开始)，尽量将首屏css内联（小于14kb的情况下）
- 尽量使用`WebP`格式的图片 
- 使用字体图标
- 升级到HTTP2.0、TLS 1.3

### 性能优化之资源加载
- 资源预加载策略
  - `dns-prefetch` 提前解析域名

```html
<link rel="dns-prefetch" href="//example.com">
```

  - `preconnect` 提前建立连接，包含DNS查找，TCP握手，以及可选的TLS协议，允许浏览器减少潜在的建立连接的开销

```html
<link rel="preconnect" href="//example.com">
<link rel="preconnect" href="//cdn.example.com" crossorigin>
```

  - `prefetch` 提前下载资源，不会预处理、不会自动执行、不会将其应用于当前上下文

```html
<link rel="prefetch" href="//example.com/next-page.html" as="html" crossorigin="use-credentials">
<link rel="prefetch" href="/library.js" as="script">
```

  - `prerender` 提前下载并执行

```html
<link rel="prerender" href="//example.com/next-page.html">
```

  - `reload` 提供当前页面资源加载优先级，比预加载的资源优先级更高，不会阻碍其他文件的加载

```html
<link rel="preload" href="mystyles.css" as="style" onload="this.rel='stylesheet'">
```

- 异步加载js
  - 使用`async` `defer` 并将 `script` 标签放到 `head` 标签中，以便让浏览器更早地发现资源并在后台线程中解析并开始加载JS
  - 动态创建 `script` 标签 
  - 使用XHR异步请求JS代码并注入到页面
- 异步加载css

```html
<link rel="stylesheet" href="mystyles.css" media="noexist" onload="this.media='all'">
<link rel="alternate stylesheet" href="mystyles.css" onload="this.rel='stylesheet'">
<link rel="preload" href="mystyles.css" as="style" onload="this.rel='stylesheet'">
```
使用preload，比使用不匹配的media方法能够更早地开始加载CSS

- 响应式图片 `srcset` `sizes` `<picture>` 
- 图片，视频，广告脚本懒加载 `Intersection Observer`
- 不使用@import，它会影响浏览器的并行下载

### 性能优化之构建
- 图片压缩和整合
- 文件进行最小化处理
  - 生成优化过的逻辑最小化实现
  - 删除不必要的代码，注释，空格
    - 去除无用的css，[uncss](https://github.com/uncss/uncss)
    - js tree shaking
- 预编译
- 代码分割，动态 `import`
- 代码作用域提升 `Scope Hoisting`

### 性能优化之运行时
- DOM
  - 尽量减少DOM访问次数
  - 尽量减少可能导致回流(重排)的css属性的修改，参考[css Trigger](https://csstriggers.com/)，
  - DOM元素离线更新
  - 指定图片大小避免重排
  - 善于使用事件委托
- javascript
  - 数据读取
    - 尽量直接从局部变量读取数据，速度快于从数组或者对象中读取数据
    - 变量从局部作用域到全局作用域的搜索过程越长速度越慢
    - 对象嵌套的越深，读取速度就越慢
    - 对象在原型链中存在的位置越深，找到它的速度就越慢
  - 逻辑
    - 基于循环的迭代比基于函数的迭代快
    - 用Map表代替大量的 if-else 和 switch 会提升性能
    - 在JS中倒序循环会略微提升性能
    - 避免使用for...in（会枚举到原型，所以很慢）
  - cpu密集的任务使用 `WebAssembly` 执行
  - 使用 `requestAnimationFrame` 替换 `setTimeout` 保证回调函数稳定的在每一帧最开始触发
  - 一个大任务拆分成多个小任务分布在不同的 `Macrotask` 中执行
  - 将密集计算的任务移入 `WebWorker` 执行
- CSS
  - 对页面中可能发生大量重排重绘的元素抽离到独立渲染层（硬件加速）
  - 恰当使用will-change提升动画性能，以减少重绘
  - 使用Flex时，比使用inline-block和float时重排更快，所以在布局时可以优先考虑Flex
  - 使用 css `contain` `content-visibility` `contain-intrinsic-size` 优化布局和绘制并减少不必要计算


### 性能优化之用户体验
- 恰当添加 `Loading` 或者过渡动画提示用户
- 骨架屏
- 先加载低质量或模糊图片资源，后续加载完整版资源

### 服务器端渲染
弥补主要内容在前端渲染的成本，减少白屏时间，提升首次有效绘制的速度。可以使用服务端渲染来获得更快的首次有效绘制

