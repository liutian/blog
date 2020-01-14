### 遍历器
引入遍历器目的是使用 `for ... of` 命令遍历一切可以遍历的数据结构  
实现遍历器接口的对象除了具有 `next` 方法，还可以具有 `return` 方法和 `throw` 方法。`next` 方法是必须部署的，`return` 方法和 `throw` 方法是可选的，`return` 方法的使用场合是，如果 `for...of` 循环提前退出（通常是因为出错，或者有 `break` 语句），就会调用 `return` 方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 `return` 方法
```
let obj = {
  data: [ 'hello', 'world' ],
  // 实现遍历器接口的对象必须有该方法
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    // 生成具有 next 方法的遍历器
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};

// TypeScript 对遍历器接口对定义
interface Iterable {
  [Symbol.iterator]() : Iterator,
}

interface Iterator {
  next(value?: any) : IterationResult,
}

interface IterationResult {
  value: any,
  done: boolean,
}
```
- 原生实现遍历器接口的数据结构  
`Array` `Map` `Set` `String` `TypedArray` `函数的 arguments 对象` `NodeList 对象`  
- 遍历器使用场景
```
// 解构赋值
let [first,...set] = 'hello world';

// 扩展运算符
let arr = [...'hello world'];

// Array.from()
let arr = Array.from('hello world');
```
- 遍历器实现指针结构  
```
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next };

  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return { done: false, value: value };
    } else {
      return { done: true };
    }
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i); // 1, 2, 3
}
```


### for...of 和 for...in 区别
- `for...in` 获取的是对象键名，`for...of` 获取的是对象键值
```
var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a); // 0 1 2 3
}

for (let a of arr) {
  console.log(a); // a b c d
}
```
- `for...in` 遍历数组的所有属性，`for...of` 遍历数组数字索引属性
```
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```
> for...in循环主要是为遍历对象而设计的，不适合遍历数组


### 异步遍历器
对象通过部署 `Symbol.asyncIterator` 方法来产生异步遍历器，同时 `next` 方法返回 `Promise`
```
// 传统写法
function main(inputFilePath) {
  const readStream = fs.createReadStream(
    inputFilePath,
    { encoding: 'utf8', highWaterMark: 1024 }
  );
  readStream.on('data', (chunk) => {
    console.log('>>> '+chunk);
  });
  readStream.on('end', () => {
    console.log('### DONE ###');
  });
}

// 异步遍历器写法
async function main(inputFilePath) {
  const readStream = fs.createReadStream(
    inputFilePath,
    { encoding: 'utf8', highWaterMark: 1024 }
  );

  for await (const chunk of readStream) {
    console.log('>>> '+chunk);
  }
  console.log('### DONE ###');
}
```
