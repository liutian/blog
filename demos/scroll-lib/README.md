使用 typescript 造一个虚拟滚动条ui库，可水平和垂直滚动，可通过鼠标滚轮和鼠标拖拽滚动，当鼠标移入或者移除元素时可自动显示隐藏，可配置滚动条偏移距离   

技能点：  
- 通过dom元素的属性计算滚动条尺寸和坐标：scrollTop clientHeight scrollHeight
- 鼠标拖拽的实现
- 通过滚轮事件的 deltaY 正负来做滚动方向，不要依靠其值的大小来作为滚动的距离


该demo使用typescript编写，所以需要事先安装: `npm i typescript -g`  
启动编译: tsc -m es2015 -t es2015 -w ./assets/scroll.ts