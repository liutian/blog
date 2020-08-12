### 权重规则计算
- ID选择器 > 类选择器|伪类选择器|属性选择器 > 元素选择器|伪元素选择器 > 通配符选择器 > 浏览器默认继承的样式
- 同权重情况下：内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）
- 同权重同文件情况下，以文件中最后定义样式为准
- 同权重多个外部样式表，以最后的定位为准
- !important高于一切其他样式
- 权重计算不升位
- `:not` `>` `+` `~` 不参与权重计算

![css权重](../assets/img/css-basic-1.png)

### 伪元素
::after ::before ::selection ::placeholder ::first-letter ::first-line

### white-space
|          | 源码空格 | 源码换行 | 内容超出容器边界换行 |
| normal   | 合并     | 忽略     | 换行                |
| nowrap   | 合并     | 忽略     | 不换行              |
| pre      | 保留     | 换行     | 不换行              |
| pre-wrap | 保留     | 换行     | 换行                |
| pre-line | 合并     | 换行     | 换行                |


### 元素垂直方向的百分比设定是相对于父元素的高度吗?
- 如果是height的话，是相对于包含块的高度
- 如果是padding或者margin竖直方向的属性则是相对于包含块的宽度

### 元素隐藏
- `display: none` 不占据空间，不响应事件
- `width: 0;height: 0;overflow: hidden` 不占据空间，响应事件
- `opacity: 0` 占据空间，响应事件
- `visibility: hidden` 占据空间，不响应事件
- `position: absolute;left: -99999px` 不占据空间，响应事件
- `transform: scale(0,0)` 占据空间，不响应事件

### overflow: hidden可以剪切超出它范围的所有子代元素吗
如果overflow不是定位元素，则overflow无法对absolute子元素进行剪裁，同时如果 `overflow: auto | scroll`，即使绝对定位元素高宽比overflow元素高宽还要大，也
都不会出现滚动条。

### font-weight 的特殊性
如果使用数值作为font-weight属性值，必须是100～900的整百数。因为这里的数值仅仅是外表长得像数值，实际上是一个具有特定含义的关键字，并且这里的数值关键字和字母关键字之间是有对应关系的。

### :first-child和:first-of-type区别

### 浏览器渲染流程


### css性能优化
- will-change

