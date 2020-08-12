### 水平居中

#### 方案一
```css
.container{
  display: grid;
  justify-items: center;
}
```

#### 方案二
```css
.container{
  display: flex;
  justify-content: center;
}
```

#### 方案三
```css
.container{
  text-align: center;
}
```
属性会影响后代元素

#### 方案四
```css
.container{
  // 必须定宽
  width: 200px; 
  margin: 0 auto;
}
```
容器必须定宽

#### 方案五
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

#### 方案六
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
  display: grid;
  align-items: center;
```

#### 方案二
```css
.container{
  display: flex;
  align-items: center;
}
```

#### 方案三
```css
.container{
  height: 50px;
  line-height: 50px;
}
```
不适合多行文本

#### 方案四(图片垂直居中)
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

#### 方案五
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
适合子元素高度未知的情况，但是需要多一层嵌套，height无效子元素内容溢出时会撑开父元素

#### 方案六
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

#### 方案七
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
  display: grid;
  align-items: center;
  justify-items: center;
}
```

#### 方案二
```css
.container{
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 方案三
```css
.container{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```
不适合多行文本

#### 方案四(图片)
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

#### 方案五
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
适合子元素高度未知的情况，但是需要多一层嵌套，height无效子元素内容溢出时会撑开父元素

#### 方案六
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

#### 方案七
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

#### 方案八
```css
.container{
  margin: 50vh auto 0;
  transform: translateY(-50%);
}
```
仅适合全屏垂直水平居中

#### 方案九
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

#### 方案二
```css
.container{
  display: grid;
  grid-template-columns: 100px auto;
}
```
列宽度变化无法应用动画效果

#### 方案三
```css
.left{
  float: left;
  width: 100px;
}

.right{
  margin-left: 100px;
}
```
左列脱离文档流，导致父元素可能无法完全包裹左列(父元素`overflow: hidden`)，为了避免内容浮动到左列下面必须 `margin-left: <左列宽度>`

#### 方案四
```css
.left{
  float: left;
  width: 100px;
}

.right{
  overflow: hidden;
}
```
左列脱离文档流，导致父元素可能无法完全包裹左列(父元素`overflow: hidden`)

#### 方案五
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
因为table中margin无效，设置间隔很麻烦，height无效子元素内容溢出时会撑开父元素

#### 方案六
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


### 左列自适应，右列固定

#### 方案一
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

#### 方案二
```css
.container{
  display: grid;
  grid-template-columns: auto 100px;
}
```
列宽度变化无法应用动画效果

#### 方案三
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
需要处理较多副作用，脱离文档流，导致父元素可能无法完全包裹左列(父元素`overflow: hidden`)

#### 方案四
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
需要注意子元素在DOM中的顺序，脱离文档流，导致父元素可能无法完全包裹左列(父元素`overflow: hidden`)

#### 方案五
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
容器元素必须定宽才能生效，由于margin失效，设置间隔比较麻烦，height无效子元素内容溢出时会撑开父元素

#### 方案六
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


### 左列不定宽，右列自适应

#### 方案一
```css
.container{
  display: flex;
}

.right{
  flex-grow: 1;
}
```

#### 方案二
```css
.container{
  display: grid;
  grid-template-columns: auto 1fr;
}
```
列宽度变化无法应用动画效果

#### 方案三
```css
.left{
  float: left;
}

.right{
  overflow: hidden;
}
```
左列脱离文档流，导致父元素可能无法完全包裹左列


### 左右固定，中间自适应

#### 方案一
```css
.container{
  display: flex;
}

.left{
  width: 200px;
}

.center{
  flex-grow: 1;
}

.right{
  width: 100px;
}
```

#### 方案二
```css
.container{
  display: grid;
  grid-template-columns: 200px auto 100px;
}
```
列宽度变化无法应用动画效果

#### 方案三
```css
.container{
  display: table;
}

.left{
  display: table-cell;
  width: 200px;
}

.center{ }

.right{
  display: table-cell;
  width: 100px;
}
```
由于margin失效，设置间隔比较麻烦，height无效子元素内容溢出时会撑开父元素

#### 方案四
```css
.container{
  padding: 0 100px 0 200px;
}

.left{
  float: left;
  margin-left: -100%;
  width: 200px;
  position: relative;
  left: -200px;
}

.center{
  float: left;
  width: 100%;
}

.right{
  float: left;
  margin-left: -100px;
  width: 100px;
  position: relative;
  right: -100px;
}
```
脱离文档流，导致父元素无法完全包裹子元素

### 列表布局，列数不固定自适应容器

#### 方案一
```css
.container{
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
}

.item{
  height: 150px;
}
```

#### 方案二
```css
.container{
  display: flex;
  flex-wrap: wrap;
}

.item{
  width: 120px;
  height: 150px;
}
```

#### 方案三
```css
.container{
  font-size: 0;
}

.item{
  display: inline-block;
  width: 120px;
  height: 150px;
  font-size: 12px;
  vertical-align: top;
}
```

#### 方案四
```css
.container{
  overflow: hidden;
}

.item{
  float: left;
  width: 120px;
  height: 150px;
}
```

### 顶部和底部固定高度，中间自适应高度
```html
<div class="container" style="height: 1000px;">
  <div class="top" style="height: 100px;">top</div>
  <div class="center" >center</div>
  <div class="bottom" style="height: 100px;">bottom</div>
</div>
```

#### 方案一
```css
.center{
  height: calc(100% - 200px);
}
```

#### 方案二
```css
.container{
  display: flex;
  flex-direction: column;
}

.center{
  flex-grow: 1;
}
```

#### 方案三
```css
.container{
  display: grid;
  grid-template-rows: 100px auto 100px;
}
```

#### 方案四
```css
.container{
  position: relative;
}

.center{
  position: absolute;
  top: 100px;
  bottom: 100px;
  width: 100%;
}

.bottom{
  position: absolute;
  bottom: 0;
  width: 100%;
}
```

### 多列等高布局

#### 方案一
```css
.container{
  overflow: hidden;
}

.item{
  display: inline-block;
  vertical-align: top;
  padding-bottom: 10000px;
  margin-bottom: -10000px;
}
```

#### 方案二
```css
.container{
  display: table;
}

.item{
  display: table-cell;
}
```

#### 方案三
```css
.container{
  display: flex;
}
```

#### 方案四
```css
.container{
  display: grid;
  grid-auto-flow: column;
}
```

