### 水平居中

#### 方案一
```css
.container{
  text-align: center;
}
```
属性会影响后代元素

#### 方案二
```css
.container{
  // 必须定宽
  width: 200px; 
  margin: 0 auto;
}
```
容器必须定宽

#### 方案三
```css
.container{
  display: flex;
  justify-content: center;
}
```

#### 方案四
```css
.container{
  position: relative;
}

.item{
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
}
```
脱离文档流，子元素高度无法撑起父元素

#### 方案五
```css
.container{
  position: relative;
}

.item{
  position: absolute;
  left: 50%;
  width: 100px;
  margin-left: -100px;
}
```
脱离文档流，子元素高度无法撑起父元素，子元素必须定宽

### 垂直居中
#### 方案一
```css
.container{
  height: 50px;
  line-height: 50px;
}
```
不适合多行文本

#### 方案二(图片垂直居中)
```css
.container{
  height: 150px;
  line-height: 150px;
  font-size: 0;
}

.container img{
  vertical-align: middle;
}
```
需要容器 `font-size: 0` 才能实现真正垂直居中影响后代元素

#### 方案三
```css
.container{
  display: flex;
  align-items: center;
}
```

#### 方案四
```css
.table{
  display: table;
  height: 200px;
}

.table .container{
  display: table-cell;
  vertical-align: middle;
}
```
适合子元素高度未知的情况，但是需要多一层嵌套，而且子元素内容溢出时会撑开父元素

#### 方案五
```css
.container{
  position: relative;
  height: 300px;
}

.item{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```
脱离文档流，子元素高度无法撑起父元素

#### 方案六
```css
.container{
  position: relative;
  height: 300px;
}

.item{
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
```
脱离文档流，子元素高度无法撑起父元素

### 水平垂直居中

#### 方案一
```css
.container{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```
不适合多行文本

#### 方案二(图片)
```css
.container{
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 0;
}

.container img{
  vertical-align: middle;
}
```
需要容器 `font-size: 0` 才能实现真正垂直居中影响后代元素

#### 方案三
```css
.table{
  display: table;
  width: 200px;
  height: 200px;
}

.table .container{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
```
适合子元素高度未知的情况，但是需要多一层嵌套，而且子元素内容溢出时会撑开父元素

#### 方案四
```css
.container{
  position: relative;
}

.item{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```
脱离文档流，子元素高度无法撑起父元素

#### 方案五
```css
.container{
  position: relative;
  width: 200px;
  height: 200px;
}

.item{
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 50px;
  height: 50px;
}
```
脱离文档流，子元素高度无法撑起父元素，子元素必须定宽高

#### 方案六
```css
.container{
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 方案七
```css
.container{
  margin: 50vh auto 0;
  transform: translateY(-50%);
}
```
仅适合全屏垂直水平居中

#### 方案八
```css
button.container{
  border: none;
  outline: none;
  background-color: transparent;
}
```
不符合HTML语义化

### 左列定宽，右列自适应

#### 方案一
```css
.left{
  float: left;
  width: 100px;
}

.right{
  margin-left: 100px;
}
```
左列脱离文档流，导致父元素可能无法完全包裹左列，为了避免内容浮动到左列下面必须 `margin-left: <左列宽度>`

#### 方案二
```css
.left{
  float: left;
  width: 100px;
}

.right{
  overflow: hidden;
}
```

#### 方案三
```css
.container{
  display: table;
}

.left{
  width: 100px;
}

.right{
  display: table-cell;
}
```
因为table中margin无效，设置间隔很麻烦，而且子元素内容溢出时会撑开父元素

#### 方案四
```css
.container{
  position: relative;
}

.left{
  position: absolute;
  width: 100px;
}

.right{
  position: absolute;
  left: 100px;
  right: 0;
}
```
脱离文档流，导致子元素无法撑起容器

#### 方案五
```css
.container{
  display: flex;
}

.left{
  width: 100px;
}

.right{
  flex-grow: 1;
}
```

#### 方案六
```css
.container{
  display: grid;
  grid-template-columns: 100px auto;
}
```

### 左列自适应，右列固定

#### 方案一
```css
.container{
  padding-left: 100px;
}

.left{
  float: left;
  width: 100%;
  margin-left: -100px;
}

.right{
  float: right;
  width: 100px;
}
```
需要处理较多副作用

#### 方案二
```html
<div class="container">
  <!-- 注意需要调整顺序，才能生效 -->
  <div class="right">right</div>
  <div class="left">left</div>
</div>
```

```css
.left{
  overflow: hidden;
}

.right{
  width: 100px;
  float: right;
}
```
需要注意子元素在DOM中的顺序

#### 方案三
```css
.container{
  display: table;
  width: 500px;
}

.left{
  display: table-cell;
}

.right{
  display: table-cell;
  width: 100px;
}
```
容器元素必须定宽才能生效，由于margin失效，设置间隔比较麻烦，而且子元素内容溢出时会撑开父元素

#### 方案四
```css
.container{
  position: relative;
}

.left{
  position: absolute;
  left: 0;
  right: 100px;
}

.right{
  position: absolute;
  width: 100px;
  right: 0;
}
```
脱离文档流，子元素高度无法撑起父元素

#### 方案五
```css
.container{
  display: flex;
}

.left{
  flex-grow: 1;
}

.right{
  width: 100px;
}
```

#### 方案六
```css
.container{
  display: grid;
  grid-template-columns: auto 100px;
}
```

### 左列不定宽，右列自适应

#### 方案一
```css
.left{
  float: left;
}

.right{
  overflow: hidden;
}
```
左列脱离文档流，导致父元素可能无法完全包裹左列

#### 方案二
```css
.container{
  display: flex;
}

.right{
  flex-grow: 1;
}
```

#### 方案三
```css
.container{
  display: grid;
  grid-template-columns: auto 1fr;
}
```


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