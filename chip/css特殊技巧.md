### 适配刘海屏
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
```

```css
body {
  padding-bottom: 50px;  
  padding-top: constant(safe-area-inset-top);
  padding-left: constant(safe-area-inset-left);
  padding-right: constant(safe-area-inset-right);
  padding-bottom: calc(constant(safe-area-inset-bottom) + 50px);

  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-left: env(safe-area-inset-left);
  padding-bottom: calc(env(safe-area-inset-bottom) + 50px); 
}

// 额外50px留给底部通用按钮导航
.bottom-action{
  position: fixed;
  box-sizing: content-box;
  height: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding-bottom:  constant(safe-area-inset-bottom);
  padding-bottom:  env(safe-area-inset-bottom);
}
```

### iOS滑动不流畅
- `-webkit-overflow-scrolling: touch` 启用了硬件加速特性，当手指从触摸屏上移开，会保持一段时间的滚动，保持滑动惯性，但是可能会导致使用`position: fixed` 固定定位的元素，随着页面一起滚动
- 设置外部 overflow 为 hidden,设置内容元素 overflow 为 auto。内部元素超出 body 即产生滚动，超出的部分 body 隐藏

### iOS上拉边界下拉出现白色空白
```js
document.body.addEventListener('touchmove', function(e) {
    if(e._isScroller) return;
    // 阻止默认事件
    e.preventDefault();
}, { passive: false});
```

### 移动端点击延时
移动端提供双击缩放功能，需要等待一段时间来判断是不是双击动作，而不是立即响应单击，等待的这段时间大约是300ms，解决方式是通过 `touchstart` 替换 `click`

### 移动端点击穿透
在发生点击约300ms之后，移动端会在之前坐标点上模拟产生 `click` 动作，所以在上层元素监听触摸事件，触摸之后该层消失，并且下层元素具有点击特性（监听click事件或者a，input，button），则下层元素也会响应点击事件。解决方案：
- 阻止上层元素默认行为
```js
ele.addEventListener('touched', function(e){
  e.preventDefault();
})
```
- 让上层元素不立即消失，等到模拟click动作约300ms之后再消失

### 移动端软键盘弹出影响页面布局问题

### 移动端软键盘弹出后页面滚动范围变化

### fixed在移动端有哪些问题
- fixed在某些情况下可能导致容器内的子元素的1px边框线消失，即使使用z-index也无法解决。 解决方法：可以使用translateZ属性来解决
- fixed定位的容器内不能带有input，这是常见的bug。解决方法：在input聚焦的时候去掉fixed定位状态，改为absolute。
- fixed ＋可滚动的容器内会导致fixed定位的子元素在滚动时定位失效，滚动完成后才正常回到fixed的位置。解决方法：尽量不要在可滚动的容器内包含fixed定位的子元素。

### 移动端特殊样式
- `-webkit-font-smoothing: antialiased` 防止高清屏字体模糊，使用iOS系统
- `-webkit-appearance: none` 清除iOS中预置的样式，如input，botton
- `img,a { -webkit-touch-callout: none }` 禁用长按弹出菜单
- `tap-highlight-color: transparent` 清除点击高亮，如a

### 常用特效属性
- backdrop-filter
- mix-blend-mode
- -webkit-box-reflect