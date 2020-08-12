
### 盒模型
规定如何描述元素尺寸大小，以及如何计算

### 盒类型
盒类型大部分取决于 `display` 值

- 块级盒 `display: block | table | flex | grid | list-item`
- 行内级盒 `display: inline | inline-block | inline-table | inline-flex | inline-grid` 
- 块容器盒 直接子元素只能是块级盒或者只能是行内级盒
- 块盒 `display: block` 属于块级盒的一种
- 行内盒 `display: inline` 并且非替换元素，属于行内级盒的一种，其他行内级盒都是原子行内盒，不能拆分换行
- 匿名盒 为了布局根据内容临时生成的盒子，css无法选中，不能设置样式，分为匿名块盒子，匿名行内盒
- 行盒 行内格式化上下文产生的盒，用于表示一行

### 视觉格式化模型
规定如何描述元素位置坐标，以及如何计算

### 容器块(包含块)
元素定位和大小都是参考一个矩形边缘来计算的，而这个矩形就是该元素的容器块 

- 首先根元素就是一个初始容器块
- 其次，如果元素的 `position: relative | static` 其容器块就是由离它最近的块容器父级元素或创建了格式上下文的父级元素生成
- 如果元素设置了 `position: fixed` 它的容器块一般由视窗生成，如果离元素最近祖先元素 `transform` `perspective` `filter` 属性值非none，则该祖先元素为容器块
- 如果元素设置了 `position: absolute` 则它的容器块就是由 `position: relative | absolute | fixed` 的最近父级元素生成，如果父级元素都没有设置，则由根元素生成

### 布局方案
- 常规流，元素默认布局方案，包括BFC和IFC
- 绝对定位，触发方式为 `positon` 不是 `static` 或者 `relative`
- 浮动，触发方式为元素必须为 `position: static | relative` 并且 `float` 为非 `none` 值

### 块格式化上下文(BFC)
如果元素对应盒类型为块容器盒，并且子元素都为块级盒，同时满足一定条件，可以形成块格式化上下文，其规定块级盒子元素如下布局方式：
- 块级盒在垂直方向，一个接一个堆叠放置，每个盒子水平占满整个容器空间
- 块级盒在垂直方向距离取决于margin，同属一个BFC中的两个以及以上的盒相接时，margin会发生重叠
- BFC容器中的子元素不会影响到外面的元素
- BFC容器中的浮动元素会撑开容器

### 块容器盒什么情况会形成块格式化上下文
- 浮动元素(float不是none)
- 绝对定位(position为absolute或者fixed)
- 内联块(display: inline-block)
- 表格单元格(display: table-cell)
- overflow值不是visible
- flex-item grid-item

### 行内格式化上下文(IFC)
如果元素对应盒类型为块容器盒，并且只包含行内级盒时，会形成行内格式化上下文，其规定行内级盒子元素如下布局方式：
- 行内级盒在水平方向，一个接一个堆叠放置，当容器宽度不够时就会换行
- 每一行将生成一个匿名行盒，来包含该行的所有行内级盒
- 水平方向上，当所有盒的总宽度小于匿名行盒的宽度时，那么水平方向排版由 `text-align` 属性来决定
- 垂直方向上，行内级盒的对齐方式由 `vertical-align` 控制，默认对齐为 `baseline`
- 行盒的高度由改行中实际高度最高的盒子计算出来
- 行内盒（inline）的垂直的 `border` `paddin` `margin` 都不会撑开行盒的高度
- 源码中的空白符会被合并但不会忽略，在渲染时表现为幽灵空白节点

### 行内级元素垂直对齐方式(vertical-align)
- `baseline` 元素基线与行盒基线对齐
- `middle` 元素中线与行盒基线向上偏移x-height位置对齐，x-height以当前行默认继承字体大小计算，注意不是该行最大的font-size
- `top` 元素顶部与行盒顶顶部对齐
- `bottom` 元素底部与行盒底部对齐
- 长度值 将元素基线与行盒基线向上偏移该长度值所在位置对齐
- 百分比值 将元素 `line-height` 与该百分比值相乘，得到的具体值在进行上面的对齐

vertical-align只能应用于 `display: inline | table-cell`

对于图片等替换元素，使用元素本身的下边缘作为基线

`display: inline-block` 元素，如果里面没有inline，或者overflow不是visible，则该元素的基线就是其margin底边缘；否则其基线就是元素里面最后一行
inline元素的基线

### 行盒高度计算
行盒的高度由其内容最高的一个决定。如果是都是纯 `inline` 元素，则其高度由最高的 `line-height` 计算值决定；而如果包括了 `inline-block`，则 `inline-block` 的 margin（上下），border（上下），padding（上下），height 都会影响整体行盒的高度

### line-height值为数字和百分比的区别
值为数字时所有的子元素继承的都是这个数字然后和当前子元素font-size相乘；如果使用百分比值或者长度值，那么所有的子元素继承的是最终的计算值

### 定位
当元素 `position: relative | absolute | fixed | sticky` 会产生基于容器块的绝对定位
- `absolute` `fixed` 元素设置宽度，left 和 right 同时设置则取 left；高度 auto，top 和 bottom 同时设置实际高度为元素内容本身高度忽略 top bottom
- `relative` `sticky` 无论元素是否设置宽高，元素left 和 right 同时设置时，忽略right；top 和 bottom同时设置时，忽略bottom；总是忽略宽高属性计算值总是内容实际宽高

absolute以祖先元素（position非static）paddingbox左上角为定位原点

当absolute元素没有设置left/top/right/bottom时，称为“无依赖绝对定位”，其定位的位置和没有设置 absolute 时候的位置一样

### 浮动
当元素 `float` 不是 `none` 会产生浮动定位

浮动元素的上一个兄弟元素是块级元素的，浮动元素直接在新的一行进行左右平移。而如果浮动元素的上一个兄弟元素是行内级元素的话，就涉及到行盒的情况了，那么就在当前行盒进行左右平移，且外顶部对齐当前行盒的顶部

如果需要设置浮动元素与 `clear` 元素的间距，得设置浮动的元素的 `margin`，而不是 `clear` 元素的 `margin`

### 浮动会产生哪些副作用
- 对后面的块盒元素布局产生影响
- 父元素的高度坍塌

### 如何解决浮动造成的副作用
- 只需要在不想受到浮动元素影响块盒上使用 `clear: both` 即可，注意行内盒无效
- 使父元素产生BFC

### 哪些情况会产生堆叠上下文
- 根元素
- `position: absolute | relative` 并且 z-index 不是 auto
- `position: fixed | sticky`
- flex-item 并且 z-index 不是 auto
- opacity 值小于 1
- mix-blend-mode 不是 normal
- transform filter clip-path perspective 不是 none
- `-webkit-overflow-scrolling: touch`
- will-change 值是可以产生堆叠上下文的属性

### 同一堆叠上下文，堆叠顺序
- 创建堆叠上下文环境的元素的背景与边框
- 拥有负 z-index 的创建了堆叠上下文的子元素 （负的越高越堆叠层级越低）
- 常规流布局中，非行内级，无 position 定位（static 除外）的子元素
- 无 position 定位（static除外）的 float 浮动子元素
- 常规流布局中，行内级，无 position 定位（static 除外）的子元素
- 堆叠层级 为 0 的 position 定位（static 除外）的子元素
- 堆叠层级 为正值的position 定位的子元素（z-index 正值越大就越高）
- 当元素的层叠水平一致、层叠顺序相同的时候，在DOM流中处于后面的元素会覆盖前面的元素。

z-index 只作用于 position 属性值为非 static 的元素，对static 元素设置 z-index 值是没有任何意义的

虽然 auto 值和 0 值的 stack level 都为 0，但是 0 值肯定会创建一个新的堆叠上下文，而 auto 值则不会创建一个新的堆叠上下文（除非是fixed元素或根元素），所以它们还是有区别的。而创建一个层叠上下文之后，其子元素的层叠顺序就相对于父元素计算


### flex布局
多适用于一维布局且需要自动缩放的场景，布局项尺寸变化时无法应用动画效果需要谨慎使用，[演示站](https://xluos.github.io/demo/flexbox/) [游戏](https://codepip.com/games/flexbox-froggy/)

#### flex-grow
flex-grow 默认值是0，表示不占用剩余的空白间隙扩展自己的宽度。大于0，则flex容器剩余空间的分配就会发生，具体规则如下：
- 所有剩余空间总量是1。
- 如果只有一个flex子项设置了flex-grow属性值：
  - 如果flex-grow值小于1，则扩展的空间就总剩余空间和这个比例的计算值。
  - 如果flex-grow值大于1，则独享所有剩余空间。
- 如果有多个flex设置了flex-grow属性值：
  - 如果flex-grow值总和小于1，则每个子项扩展的空间就是总剩余空间和当前元素设置的flex-grow比例的计算值。
  - 如果flex-grow值总和大于1，则所有剩余空间被利用，分配比例就是flex-grow属性值的比例。例如所有的flex子项都设置flex-grow:1，则表示剩余空白间隙大家等分，如果设置的flex-grow比例是1:2:1，则中间的flex子项占据一半的空白间隙，剩下的前后两个元素等分。

#### flex-shrink
flex-shrink 默认值是1，表示在容器没有足够空间是自愿缩放自己宽度。如果设置为0，则表示不收缩，保持原始的fit-content宽度。

已知flex子项不换行，且容器空间不足，不足的空间就是“完全收缩的尺寸”：
- 如果只有一个flex子项设置了flex-shrink：
  - flex-shrink值小于1，则收缩的尺寸不完全，会有一部分内容溢出flex容器。
  - flex-shrink值大于等于1，则收缩完全，正好填满flex容器。
- 如果多个flex子项设置了flex-shrink：
  - flex-shrink值的总和小于1，则收缩的尺寸不完全，每个元素收缩尺寸占“完全收缩的尺寸”的比例就是设置的flex-shrink的值。
  - flex-shrink值的总和大于1，则收缩完全，每个元素收缩尺寸的比例和flex-shrink值的比例一样

#### flex
摘录网上案例：范张，范鑫和范旭每人100万固定家产，范帅和范哥则20万保底家产。如果范闲归西那天家产还有富余，范帅和范哥按照3:2比例分配；如果没有剩余财产，则范张，范鑫和范旭三位兄长按照2:1:1的比例给两人匀20万保底家产

html结构:
```html
<div class="container">
  <item clas="zhang">范张</item>
  <item clas="xin">范鑫</item>
  <item clas="xu">范旭</item>
  <item clas="shuai">范帅</item>
  <item clas="ge">范哥</item>
</div>
```

css实现:
```css
.container {
  /* 范闲：来，家产分配开始了~ */
  display: flex;  
}
.zhang {
  /* 老大不会争夺多余财产，但是会在财产不足时候分出老二老三分出的2倍的财产，这是作为老大应有的姿态 */
  flex: 0 2 100px;    
}
.xin,
.xu {
  /* 老二和老三不会争夺多余财产，但是会在财产不足时候分出部分财产，照应老四和老幺 
  这里也可以直接写成：flex: 100px*/
  flex: 0 1 100px;    
}
.shuai {
  /* 老四会争夺多余财产，且会在财产不足时候享用哥哥们分出的财产，确保能够活下去，感谢三位哥哥的照顾 */
  flex: 3 0 20px;    
}
.ge {
  /* 老五会争夺多余财产，不过比例比哥哥少一点，且会在财产不足时候享用哥哥们分出的财产，感谢哥哥们的照顾 */
  flex: 2 0 20px;    
}
```

### grid布局
多适用于二维布局的场景，布局项尺寸变化时无法应用动画效果需要谨慎使用，[游戏](http://cssgridgarden.com/#zh-cn)