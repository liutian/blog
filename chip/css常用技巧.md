### 清除浮动
```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

### 三角
```css
.triangle {
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 25px 40px 25px;
  border-color: transparent transparent red transparent;
}
```

### 单行文本省略号
```css
.single-ellipsis{
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```
white-space

### 多行文本省略号
```css
.multiline-ellipsis {
  display: -webkit-box;
  width: 200px;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; 
}
```
word-break


### 一键网站变灰
```css
body {
  filter: grayscale(100%);
}
```

### rem自适应
```css
html{
  font-size: calc(100vm / x);
}
```
x为设计稿中 字体/屏幕宽 比值

### 按钮文字两端对齐
```html
<button class="btn">电子邮件</button> 
<br>
<button class="btn">账号</button>
```

```css
.btn{
  box-sizing: border-box;
  padding: 5px 20px;
  border-width: 1px;
  width: calc(42px + 4em);
  text-align-last: justify;
}
```
`text-align-last` 也可用于两端布局


### 1像素边框
```css
.container{
  position: relative;
}

.container::after{
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 200%;
  content: "";
  border: 1px solid #f66;
  transform: scale(.5);
  transform-origin: left top;
}
```

### 1像素边
```css
.side{
  background-color: #000;
  height: 1px;
  transform: scaleY(0.5);
  transform-origin: 50% 100%;
}
```

### 支持小于12px文字
```css
// 适用于移动端
.container{
  font-size: 10px;
  -webkit-text-size-adjust: none;
}
// 适用于pc端
.container{
  transform: scale(0.8);
}
```

### 图片层阴影
```css
.avatar {
  position: relative;
  border-radius: 100%;
  width: 200px;
  height: 200px;
  background: url(https://yangzw.vip/static/codepen/thor.jpg) no-repeat center/cover;
}

.avatar::after {
  position: absolute;
  left: 0;
  top: 10%;
  z-index: -1;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  background: inherit;
  filter: blur(10px) brightness(80%) opacity(.8);
  content: "";
  transform: scale(.95);
}
```

### 卡片阴影
```css
.card{
  display: inline-block;
  padding: 5px 10px;
  box-shadow: 
    0 4px 8px 0 rgba(0, 0, 0, 0.2), 
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
```

### 加载中动效
```html
<div class="load-indicator">
加载中<span class="dot"></span>
</div>
```

```css
.load-indicator .dot {
  display: inline-block;
  overflow: hidden;
  height: 1em;
  line-height: 1;
  vertical-align: bottom;
}

.load-indicator .dot::after {
  display: block;
  white-space: pre-wrap;
  content: "...\A..\A.";
  animation: loading 3s infinite step-start both;
}

@keyframes loading {
  33% {
    transform: translateY(-2em);
  }
  66% {
    transform: translateY(-1em);
  }
}
```



### 美化选项框
```html
<input type="radio" id="radio1" name="radio" hidden>
<label for="radio1">
  <span class="radio-btn"></span>
  radio1
</label>

<input type="radio" id="radio2" name="radio" hidden>
<label for="radio2">
  <span class="radio-btn"></span>
  radio2
</label>

<input type="radio" id="radio3" name="radio" hidden>
<label for="radio3">
  <span class="radio-btn"></span>
  radio3
</label>
```

```css
.radio-btn{
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  width: 0.7em;
  height: 0.7em;
  border: solid 1px red;
  border-radius: 50%;
  vertical-align: middle;
}
input:checked + label .radio-btn::after{
  display: inline-block;
  position: absolute;
  box-sizing: border-box;
  top: -1px;
  left: -1px;
  content: '';
  width: 0.7em;
  height: 0.7em;
  background-color: blue;
  border: solid 1px blue;
  border-radius: 50%;
  transform: scale(.5);
  transform-origin: center center;
}
```

### 响应输入框获取焦点
```html
<div id="container">
  <input type="text" name="user-name">
  <input type="password" name="user-pwd">
  <div class="user-name-focus">你在输入用户名</div>
  <div class="user-pwd-focus">你在输入密码</div>
</div>
```

```css
.user-name-focus,.user-pwd-focus{
  display: none;
}

input[name=user-name]:focus-within ~ .user-name-focus{
  display: block;
}

input[name=user-pwd]:focus-within ~ .user-pwd-focus{
  display: block;
}
```

### 列表展开高度自适应
```html
<ul class="auto-height">
  <li>
    <input type="radio" id="item-1" name="radio" hidden>
    <label class="title" for="item-1">列表1</label>
    <div class="content">内容1<br>内容2<br>内容3<br>内容4</div>
  </li>
  <li>
    <input type="radio" id="item-2" name="radio" hidden>
    <label class="title" for="item-2">列表2</label>
    <div class="content">内容1<br>内容2<br>内容3<br>内容4</div>
  </li>
  <li>
    <input type="radio" id="item-3" name="radio" hidden>
    <label class="title" for="item-3">列表3</label>
    <div class="content">内容1<br>内容2<br>内容3<br>内容4</div>
  </li>
</ul>
```

```css
ul,li{
  list-style: none;
}

ul{
  padding: 0;
}

.auto-height {
  width: 150px;
}

.auto-height li + li {
  margin-top: 5px;
}

.auto-height .title {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 20px;
  background-color: #f66;
  cursor: pointer;
  color: #fff;
}

.auto-height .content {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  border: 1px solid #f66;
  border-top: none;
  border-bottom-width: 0;
  max-height: 0;
  transition: all 500ms;
}

.auto-height li input:checked ~ .content {
  border-bottom-width: 1px;
  max-height: 600px;
}
```


### 星级评分
```html
<div id="container">
  <input type="radio" hidden id="radio1" name="star" checked>
  <label for="radio1" ></label>
  
  <input type="radio" hidden id="radio2" name="star" >
  <label for="radio2" ></label>
  
  <input type="radio" hidden id="radio3" name="star">
  <label for="radio3" ></label>
  
  <input type="radio" hidden id="radio4" name="star">
  <label for="radio4" ></label>
  
  <input type="radio" hidden id="radio5" name="star">
  <label for="radio5" ></label>
</div>
```

```css
#container{
  font-size: 0;
}

label{
  cursor: pointer;
  color: #d2d200;
  font-size: 25px;
}

label::after{
  display: inline-block;
  width: 1em;
  content: '★';
  vertical-align: middle;
  transition: all 0.2s;
}

label:hover::after{
  transform: scale(1.3);
}

#container:hover label::after{
  content: '★';
}

#container:hover label:hover ~ label::after{
  content: '✰' ;
}

input:checked + label ~ label::after{
  content: '✰';
}
```



