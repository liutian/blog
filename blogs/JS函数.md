### 函数参数默认值
当参数值为 `undefined` 时会被赋予指定默认值
- 指定了默认值以后，函数的 `length` 属性，将返回没有指定默认值的参数个数
- 参数默认值不是传值的，而是每次都重新计算默认值表达式的值
```
let x = 0;
function hello(y = x + 1){
  console.log(y);
}

hello() // 1
hello() // 2
```
- 与结构赋值默认值结合使用
```
function hello({x, y = 5} = {}) {
  console.log(x, y);
}

hello() // undefined 5
```
- 设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失
```
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2


// 另一个例子
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
// 全局变量x不存在，就会报错


// 参数的默认值是一个函数，该函数的作用域也遵守这个规则
let foo = 'outer';

function bar(func = () => foo) {
  let foo = 'inner';
  console.log(func());
}

bar(); // outer
```
- 利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误
```
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Error: Missing parameter
```


### rest参数
用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 是一个 **真正** 数组，而 `arguments` 是一个伪数组 
```
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```
> rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错


### 箭头函数
箭头函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象  
`this` 指向的固定化，并不是因为箭头函数内部有绑定 `this` 的机制，实际原因是箭头函数根本没有自己的 `this`，导致内部的 `this` 就是外层代码块的 `this`。正是因为它没有 `this`，所以也就不能用作构造函数，除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target另外，由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向
- 如果箭头函数不需要参数或需要多个参数，需要用圆括号代表参数部分
```
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};
```
- 如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。
```
var sum = (num1, num2) => { 
  return num1 + num2; 
}
```
- 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错
```
// 报错
let getTempItem = id => { id: id, name: "Temp" };

// 不报错
let getTempItem = id => ({ id: id, name: "Temp" });
```
- 如果箭头函数只有一行语句，且不需要返回值，可以采用下面的写法，就不用写大括号了
```
let fn = () => void doesNotReturn();
```
- 箭头函数不适用，定义对象的方法，且该方法内部包括 `this`
```
// `this` 指向全局对象，这是因为对象不构成单独的作用域，导致 `speak` 箭头函数定义时的作用域就是全局作用域
const human = {
  word: 'hello',
  speak: () => {
    console.log(this.word);
  }
}
```


### 尾调用
函数的 **最后一步** 是调用另一个函数
```
function f(x){
  return g(x);
}

// 该情况不属于尾调用
function f(x){
  return g(x) + 1;
}
```
尾调用不一定出现在函数尾部，只要是最后一步操作即可
```
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
```


### 尾调用优化
尾调用由于是函数的最后一步操作，其实不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了
只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行 **尾调用优化**
```
function addOne(a){
  var one = 1;
  function inner(b){
    return b + one;
  }
  // 这种情况的尾调用优化没有生效
  return inner(a);
}
```


### API备忘录
- `toString` 返回函数源代码
- `name` 返回函数最初定义时的名称
- `length` 返回函数形参的数量
- `bind` 创建一个新函数，通过参数指定新函数的 `this`
- `apply` `call`


### 尾调用优化


### async函数
- `await` 命令后面是一个 `thenable` 对象（即定义then方法的对象），那么 `await` 会将其等同于 `Promise` 对象
- `async` 函数可以保留运行堆栈
- 使用 `try...catch` 结构，实现多次重复尝试
```
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get('http://google.com/this-throws-an-error');
      break;
    } catch(err) {}
  }
  console.log(i); // 3
}

test();
```
- 多个 `await` 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发
```
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```