### 网络传输
- 遵守HTML文件“14kb 规则”，保障网站必要内容都在14kbHTML文件中(TCP 慢开始)，尽量将首屏css内联（小于14kb的情况下）
- 异步加载css
  - 使用js动态加载css
  - `<link rel="stylesheet" href="mystyles.css" media="noexist" onload="this.media='all'">`
  - `<link rel="alternate stylesheet" href="mystyles.css" onload="this.rel='stylesheet'">`
  - `<link rel="preload" href="mystyles.css" as="style" onload="this.rel='stylesheet'">`

使用preload，比使用不匹配的media方法能够更早地开始加载CSS
- 去除无用的css，[uncss](https://github.com/uncss/uncss)
- 不要使用@import，它会影响浏览器的并行下载

### css
- 恰当使用硬件加速和will-change提升动画性能，以减少重绘
- 使用Flex时，比使用inline-block和float时重排更快，所以在布局时可以优先考虑Flex
- 减少可能导致回流(重排)的css属性的修改，参考[css Trigger](https://csstriggers.com/)