### 声明变量的六种方法
`var` `let` `const` `function` `import` `class`


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


### let和var区别
- `let` 声明的变量只在命令所在的代码块内有效
```
{ // 代码块
  let a = 10;
  var b = 1;
}

console.log(a); // ReferenceError: a is not defined.
console.log(b); // 1


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
- 不存在变量提升，如果区块中存在 `let` 和 `const` 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错
```
{
  console.log(a); // ReferenceError
  let a = 10;
}

// 函数形参部分也是一个独立作用域
function bar(x = y, y = 2) {
  return [x, y];
}

bar(); // 报错

typeof x; // ReferenceError
let x;
```
> 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量
- 不允许重复声明变量


### 解构赋值
- 只有等号两边的 **模式** 相同，左边的变量才会被赋予对应的值，当等号右边的值不是对象或数组，将其转为对象在进行赋值
```
let {name,...newObj} = {name: 'xxx', age: 20, address: 'yyy'};
let [first,...newArr] = [10,'xx',{},true];
let {length} = ['xxx']; // 因为数组也是对象
let {size} = new Map();

// 模式不相同，自动转为包装类
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true

// 模式不相同
let [foo] = 1; // 报错  
let [foo] = {}; // 报错

// 由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```
- 只要数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值
```
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"

//字符串也可以进行数组形式的解构赋值
let [a, b, c] = 'xyz';
a // 'x'
b // 'y'
z // 'z'

let map = new Map();
map.push('name','Zhang');
let [list] = map;
list // ['name','Zhang'];

for (let [key, value] of map) {
  // ...
}
// 或者
for (let [,value] of map) {
  // ...
}
```
- 变量名与属性名不一致
```
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let arr = ['a','b','c','d'];
let {[10]: ten,[arr.length - 1]: last} = arr;
ten // undefined
last // 'd'
```
- 嵌套赋值
```
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
// 第二个p只是模式的一部分，第一个p才是变量赋值
```
- 给现有对象或者数组赋值
```
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error

// 正确的写法
let x;
({x} = {x: 1});

let obj = {};
({a: obj.a = 'aaa',b: obj.b = 'bbb'} = {a: 'test'});
```
> 如果要将一个已经声明的变量用于解构赋值，必须非常小心
- 特殊解构赋值默认值
```
// 数组也是对象
let {0:first = 'aa'} = ['xx','yy']; 

// 默认值为惰性求值，只有需要默认值时才会进行求值
let i = 3;
let {x: y1 = ++i} = {};
y1 // 4
i // 4
let {x: y2 = ++i} = {x: 5};
y2 // 5
i // 4
```


### 扩展运算符
- 复制并创建新数组
```
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```
- 合并数组
```
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```
- 解决无法识别非 `BMP` 字符的问题
```
[...'hello']
// [ "h", "e", "l", "l", "o" ]

'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
```
- 任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组
```
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

let set = new Set();
set.add('a');
set.add('b');
set.add('c');
let array = [...set];

// 对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike];
```


### 严格模式
- **无论是全局作用域还是函数作用域都不再意外创建全局变量**
- **不能对只读属性赋值，不可写属性赋值，不可扩展对象的新属性赋值**
- **不能删除不可删除的属性**
- 函数的参数不能有同名属性
- 禁止传统八进制数字语法，统一改用 `0O` 为前缀的八进制写法
- 不能使用 `with` 语句
- `eval` 不会在它的外层作用域引入变量
- 不能删除变量 `delete prop` ，只能删除属性 `delete globalThis[prop]`
- `eval` 和 `arguments` 不能被重新赋值
- 参数的值不会随 `arguments` 对象的值的改变而变化
- 不能使用 `arguments.callee` `arguments.caller`
- 不能使用 `fn.caller` 和 `fn.arguments` 获取函数调用的堆栈
- 增加了保留字 `implements` `interface` `let` `package` `private` `protected` `public` `static` `yield`
- 严格模式禁止了不在脚本或者函数层面上的函数声明，也就是禁止在块级作用域中声明函数
- 指定的 `this` 不再被封装为对象，而且如果没有指定 `this` 的话它值是 `undefined`
```
"use strict";
function fun() { return this; }
console.assert(fun() === undefined);
console.assert(fun.call(2) === 2);
console.assert(fun.apply(null) === null);
console.assert(fun.call(undefined) === undefined);
console.assert(fun.bind(true)() === true);
```


### 顶层对象
在浏览器环境指的是 `window` 对象，在 `Node` 指的是 `global` 对象。`ES5` 之中，顶层对象的属性与全局变量是等价的  
为了保持兼容性，`var` 命令和 `function` 命令声明的全局变量，依旧是顶层对象的属性；`let` 命令、`const` 命令、`class` 命令声明的全局变量，不属于顶层对象的属性
```
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```
> `ES2020` 在语言标准的层面，引入 `globalThis` 作为顶层对象。也就是说，任何环境下，`globalThis` 都是存在的，都可以从它拿到顶层对象，指向全局环境下的 `this`