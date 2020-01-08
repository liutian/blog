### 声明变量的六种方法
`var` `let` `const` `function` `import` `class`

### let和var区别
- `let` 声明的变量只在命令所在的代码块内有效
```
{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1


var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
// 变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6。你可能会问，如果每一轮循环的变量i都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量i时，就在上一轮循环的基础上进行计算
// 另外，for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
- 不存在变量提升，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错
```
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错

typeof x; // ReferenceError
let x;
```
> 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量
- 不允许重复声明变量


### 三种作用域
- 全局作用域
- 函数作用域
- 块级作用域
> for 循环有两层作用域



### 块级作用域
```
// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}
```


### 顶层对象
在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的  
为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性
```
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```
> ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

