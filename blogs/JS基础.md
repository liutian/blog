
### 解构赋值
- 只有等号两边的 **模式** 相同，左边的变量才会被赋予对应的值，当等号右边的值不是对象或数组，将其转为对象在进行赋值
```
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true

let {length} = ['xxx']; // 因为数组也是对象
let {size} = new Map();

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
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```
- 特殊解构赋值默认值
```
let {x: y = 3} = {};
y // 3

let {x: y = 3} = {x: 5};
y // 5

let {0:first = 'aa'} = ['xx','yy'];
```
- 如果要将一个已经声明的变量用于解构赋值，必须非常小心
```
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error

// 正确的写法
let x;
({x} = {x: 1});
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
- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用with语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
- eval不会在它的外层作用域引入变量
- eval和arguments不能被重新赋值
- arguments不会自动反映函数参数的变化
- 不能使用arguments.callee
- 不能使用arguments.caller
- 禁止this指向全局对象
- 不能使用fn.caller和fn.arguments获取函数调用的堆栈
- 增加了保留字（比如protected、static和interface）