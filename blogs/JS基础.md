### 声明变量的六种方法
`var` `let` `const` `function` `import` `class`

### 基本数据类型
`string` `number` `boolean` `null` `undefined` `symbol` `bigint`

### 类型判断
- `typeof` 可以判断变量属于哪种基本数据类型，引用数据类型，统一返回 `object`，而函数则返回 `function`
- `instanceof` 可以判断变量基于哪个函数或者类直接或者间接实例化的，即可以 `追溯原型链`
- `Object.prototype.toString.call(v)` 既可以判断基本数据类型又可以判断原生引用类型

### 三种作用域
- 全局作用域
- 函数作用域
- 块级作用域
> for 循环和函数有两层作用域


### 块级作用域
```js
// 块级作用域写法
{
  let tmp = ...;
  ...
}

// 没有块级作用域之前的写法 IIFE
(function () {
  var tmp = ...;
  ...
}());
```


### let和var区别
- `let` 声明的变量只在命令所在的代码块内有效
```js
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
// 变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6


// for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
- 不存在变量提升，即暂时性死区。如果区块中存在 `let` 和 `const` 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错
```js
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
- 只有等号两边的 **模式** 相同，左边的变量才会被赋予对应的值
```js
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
```js
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"

//字符串也可以进行数组形式的解构赋值
let [a, b, c] = 'xyz';
a // 'x'
b // 'y'
z // 'z'

let map = new Map();
map.set('name','Zhang');
map.set('age',14');
let [entry1, entry2] = map;
entry1 // ['name','Zhang'];
entry2 // ['age', 14]

for (let [key, value] of map) {
  // ...
}
// 或者
for (let [,value] of map) {
  // ...
}
```

- 重命名变量名
```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let arr = ['a','b','c','d'];
let {[10]: ten,[arr.length - 1]: last} = arr;
ten // undefined
last // 'd'
```

- 特殊解构赋值默认值
```js
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

- 给现有变量赋值
```js
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

### 数组扩展运算符
任何定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组
```js
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

### 数组扩展运算符用途
- 复制并创建新数组
```js
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```
- 合并数组
```js
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
```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]

'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
```


### 链判断运算符
判断左侧的对象是否为 `null` 或 `undefined` 如果是的，不再往下运算，直接返回 `undefined`  
```
const firstName = message?.body?.user?.firstName || 'default';
const passwordValue = loginForm.querySelector('input[name=password]')?.value;
person.sayHello?.();
```
> 链运算符不能用于赋值运算符左侧 `a?.b = c`  


#### 短路机制 
```
a?.[++x]
// 等同于
a == null ? undefined : a[++x]
```
如果 `a` 是 `undefined` 或 `null`，那么 `x` 不会进行递增运算，即惰性计算


### Null 判断运算符
它的行为类似 `||`，但是只有运算符左侧的值为 `null` 或 `undefined` 时，才会返回右侧的值
```js
// 之前的做法
let result = response.result || 'default'; // 当 response.result 为 0 '' false 时 result 被错误的赋值为 'default'

// 改进的做法
let result = response.result ?? 'default'; // 仅当 response.result 为 null 或者 undefined 时 result 才会赋值为 'default'
```


### 严格模式
- **无论是全局作用域还是函数作用域都不再意外创建全局变量(例如变量未声明就赋值)**
- **不能对只读属性赋值，不能删除不可配置属性，不可扩展对象的新属性赋值**
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
```js
var a = 1;
window.a // 1
// 如果在 Node 的 REPL 环境，可以写成 global.a

let b = 1;
window.b // undefined
```
> `ES2020` 在语言标准的层面，引入 `globalThis` 作为顶层对象。也就是说，任何环境下，`globalThis` 都是存在的，都可以从它拿到顶层对象，指向全局环境下的 `this`


### JSON
**格式规范**   
- 基本类型：`string` `number` `boolean` `null`
- 结构化类型：`Object` `Array`
- **属性名**必须使用双引号，**属性值**只有字符串类型需要双引号，其他类型不需要双引号

**JSON.stringify**  
- 如果对象有 `toJSON` 方法，直接调用 `toJSON` 方法，并且停止遍历该对象下的其他属性（Date类型默认有自己的 `toJSON` 方法）
- 当第二个参数为函数时类似数组 `map` 方法，而且函数第一次调用时，参数 `key` 为空，`value` 为整个对象
- 当第二个参数为数组时，只会返回数组中出现的属性  
- `undefined` 函数 `symbol` 作为对象属性值时会忽略该属性
- `undefined` 函数 `symbol` 作为数组元素值时会序列化 `null`
- `undefined` 函数 `symbol` 作为单独的值进行序列化时返回 `undefined`


**JSON.stringify实现深度拷贝的弊端**
- 拷贝带有循环引用的对象时会报错
- 无法拷贝函数、正则  
- 对象丢失原有constructor，并指向Object

**高性能JSON.stringify实现思路**
- 开发者事先定义 `JSON scheme`
- 根据 `JSON scheme` 生成对应的模板方法，模板方法会对属性与值进行字符串拼接
- 最后开发者执行模板方法，并传入需要转换的对象实例  
> [高性能JSON.parse实现](https://github.com/youngwind/blog/issues/115)  
> [深度拷贝各种实现与JSON.stringify实现的对比测试报告](https://jsperf.com/deep-copy-vs-json-stringify-json-parse/115)  
> JSON Schema规范: [链接](https://www.jianshu.com/p/1711f2f24dcf?utm_campaign=hugo) [链接](https://www.jianshu.com/p/8278eb2458c4?winzoom=1)  
> 可视化JSON Schema生成器：[链接](https://github.com/YMFE/json-schema-editor-visual) [链接](https://github.com/jdorn/json-editor) [链接](https://github.com/jackwootton/json-schema) [链接](https://github.com/rjsf-team/react-jsonschema-form)
