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

### 移动端字体模糊怎么办
在MacOS测试环境下面设置 `-webkit-font-smoothing: antialiased` 但是这个属性仅仅是面向MacOS，其他操作系统设
置后无效

### overflow:scroll 在 iOS 上滑动卡顿的问题
启用了硬件加速特性 `-webkit-overflow-scrolling: touch` 

### inline元素之间空白间隔如何解决
- 设置元素float
- 元素收尾相连
- 设置元素 `font-size: 0`
- 设置父元素 `letter-spacing: -1em` 当前元素 `letter-spacing: normal`

### fixed在移动端有哪些问题
- fixed在某些情况下可能导致容器内的子元素的1px边框线消失，即使使用z-index也无法解决。
解决方法：可以使用translateZ属性来解决
- fixed定位的容器内不能带有input，这是常见的bug。
解决方法： 在input聚焦的时候去掉fixed定位状态，改为absolute。
- fixed＋可滚动的容器内会导致fixed定位的子元素在滚动时定位失效，滚动完成后才正常回到fixed的位置。
解决方法：尽量不要在可滚动的容器内包含fixed定位的子元素。
- ios不支持onresize事件