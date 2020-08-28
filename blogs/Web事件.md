### 常见事件
- 键盘事件：`keydown`  `keyup` ~~`keypress`~~
- 鼠标事件：`click` `dblclick` `mousedown` `mousemove`  `mouseup` `pointerlockchange` `pointerlockerror` `select` `wheel` `contextmenu` 

`mouseenter` `mouseleave` 会冒泡 `mouseover` `mouseout` 不会冒泡
- 表单事件：`reset` `submit` `change` `input` `beforeinput` 
- 资源事件：`load` `error` `abort` `beforeunload` `unload`;常用于控制图片异步加载，脚本异步加载，监听页面文档载入状态
- 视图事件：`fullscreenchange` `fullscreenerror` `resize` `scroll`

`focusin` `focusout` 不会冒泡  `focus`  `blur` 会冒泡 

- 剪贴板事件：`cut` `copy` `paste`
- 触摸事件：`touchcancel` `touchend` `touchmove` `touchstart`
- 拖放事件：`drag` `dragend` `dragenter` `dragstart` `dragleave` `dragover` `drop`
- 输入法事件：`compositionstart` `compositionupdate` `compositionend`

- css事件：`animationstart` `animationend` `animationiteration` `transitionstart` `transitioncancel` `transitionend` `transitionrun`
- `pagehide` `pageshow` `popstate`
- 窗口事件：`close` `visibilitychange`
- 打印事件：`beforeprint` `afterprint` 提供在打印文档时及时修改文档内容的机会
- 指针事件：`pointerover` `pointerenter` `pointerdown` `pointermove` `pointerup` `pointercancel` `pointerout` `pointerleave` `gotpointercapture` `lostpointercapture`
- select 
- 变动事件

### Event
- `type` 事件名称，可用于同一个事件监听器监听多个事件
- `eventPhase` 当前事件流处于哪个阶段：捕获，事件目标，冒泡
- `bubbles` 事件是否可以进行冒泡，因为部分事件只可以在事件目标上触发，不会进行捕获或者冒泡
- `composed` 事件是否可以在阴影DOM和常规DOM之间的边界上浮动
- `timeStamp` 事件创建时距离该页面打开时刻的时间戳，可以用于监控用户操作流
- `isTrusted` 事件是否是由浏览器或者用户操作生成，通过类似 `click()` 或通过调用 `EventTarget.dispatchEvent` 生成则为 `false`
- `cancelable` 事件是否可以取消默认行为，例如浏览器厂商提议 `wheel` 事件只能在事件监听回调第一次执行时被取消，接下来的 `wheel` 事件都不能被取消
- `stopPropagation()` 阻止 **捕获** 和冒泡阶段中事件的进一步传播到下一个元素
- `stopImmediatePropagation()` 该方法调用后，当前事件应该触发所有后续监听器一律不会执行，包括在相同元素上注册的，如果在捕获阶段父级元素调用，则事件永远不会到达事件目标


### EventUI
- `layerX` 鼠标点相对于事件目标所在布局上下文的水平坐标
- `detail` 鼠标点击的次数，如果两次点击直接移动鼠标或者间隔超过浏览器规定的时间，该值会重置为0，该属性只对 `click` `mousedown` `mouseup` `dblclick` (总是2) 有效，对所有的其它 `UIEvent` 对象，总是零
- `which` 


### MouseEvent 
继承自 `EventUI`  
- `clientX` 鼠标点相对于浏览器工作区的水平坐标
- `pageX` 鼠标点相对于整个页面的水平坐标
- `offsetX` 鼠标点相对于事件目标的内填充边的水平坐标
- `screenX` 鼠标点相对于整个屏幕的水平坐标
- `movementX` 当前事件和上一个 `mousemove` 事件之间鼠标在水平方向上的移动值，计算方式为 : `currentEvent.movementX = currentEvent.screenX - previousEvent.screenX`
- `altKey` 事件触发的时，`alt` 键是否被按下，另外还有 `ctrlKey` `shfitKey` `metaKey` 在 MAC 键盘上，表示 `Command` 键（⌘），在 Windows键盘上，表示 `Windows` 键（⊞）
- `button` 具体由哪个鼠标按键触发的事件
0: 主按键被按下，通常指鼠标左键    
1: 辅助按键被按下，通常指鼠标滚轮  
2: 次按键被按下，通常指鼠标右键  
3: 第四按键被按下，通常可以实现浏览器后退  
4: 第五按键被按下，通常可以实现浏览器前进  
- `buttons` 事件触发时总共按下了哪些鼠标按键
该属性为数字，值等于所有按键对应数值进行或(|)运算的结果
0  : 没有按键  
1  : 主按键  
2  : 辅助按键  
4  : 次按键  
8  : 第四按键   
16 : 第五按键   
- `relatedTarget` 是鼠标事件的次要目标，包含该属性的事件有：`focusin`	`focusout` `mouseenter`	   `mouseleave`	`mouseout` `mouseover` `dragenter` `dragexit`	
- `region` 鼠标点击 `canvas` 时，鼠标点是否处于 `canvas` 事先定义的某个区域内


### KeyboardEvent
继承自 `EventUI`  
- `altKey` 与 `MouseEvent` 类似
- `code` 表示键盘上的物理键，该值不会因键盘布局或修饰键而改变状态
- `isComposing` 表示该事件是否在 `compositionstart` 之后和 `compositionend` 之前被触发
- `key` 如果按下的键拥有可打印的内容，则返回一个非空的 `Unicode` 字符来代表这个键的可打印内容，如果按下的键是一个控制键或特殊字符，则返回一个事先定义好的值
- `location` 按键在键盘或其他设备上的位置
0: 按键只有唯一版本  
1: 左侧版本的按键  
2: 右侧版本的按键  
3: 数字区域的按键  
- `repeat` 该按键被保持为自动重复, 则该值为 `true`  
当按键被按下并被按住时开始自动重复
```
keydown  
keypress  
keydown
keypress
<<repeating until the user releases the key>>
keyup
```
> 手动触发事件不会生成与该事件关联的默认操作。 例如, 手动触发按键事件不会导致该字母出现在焦点文本输入中。 可以防止脚本模拟与浏览器本身交互的用户操作。
> 不仅仅是输入框可以接收该事件，按钮也可以接收键盘事件


### InputEvent
继承自 `EventUI` 当对可以输入区域进行键盘输入，内容粘贴，内容拖拽，删除内容时触发
- `data` 返回当前输入的字符串，如果是删除操作，则该值为空字符串
- `isComposing` 


### 自定义事件

### 页面窗口事件
- `window.load` 当页面文档以及文档中涉及的**所有资源**(包括图片，样式和脚本)下载完之后触发
- `DOMContentLoaded` 当页面文档下载完之后就触发的事件
DOMContentLoaded 事件必须等待其所属script之前的样式表加载解析完成才会触发  
```
<link rel="stylesheet" href="css.php">
<script>
document.addEventListener('DOMContentLoaded',function(){
    console.log('3 seconds passed');
});
</script>
```
如果将link置于script之后，就会立即打印  
- `window.beforeunload` 在 `window.unload` 事件之前触发，该事件可以返回字符，用于弹出确认信息，提示用户是否确实需要跳转页面
- `window.error` 当代码执行异常报错时触发，事件对象包含报错信息，可用于监控和上报页面异常
- `window.resize` 浏览器窗口尺寸发生变化时触发

`mouseenter` `mouseleave` 不会冒泡 `mouseover` `mouseout` 会冒泡
`focusin` `focusout` 会冒泡  `focus`  `blur` 不会冒泡 
`mousemove` `mouseup` 一般在父级元素注册监听器
`wheel` deltaX deltaY deltaZ  非用户真实操作触发的滚轮事件不会引发默认行为
可以通过取消 `keypress` `keydown` 事件来禁止内容输入，`input` 不能取消




### 拖拽

### 触摸事件

### 触摸手势

### Dom变动事件

### 设备方向变动事件

### 模拟原生事件


- input
- textinput
- change
- focusin foucusout 
