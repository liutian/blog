### 奇妙的length
当数组成员新增，移除或者最大索引值变化时，数组 `length` 会动态变化，`length` 永远等于数组 `index` + 1，当强制把数组的 `length` 值变小时，数组会自动删除 `index` 大于等于 `length` 的成员
```
let arr = [1,2,3,4,5,6];
arr.length = 3;
arr // [1,2,3]
```


### Array.from
`Array.from` 可以将伪数组和可遍历对象转为真正的数组
> 只有对象中包含 `length` 属性就是伪数组
```
// 伪数组
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
  return p.textContent.length > 100;
});

// arguments对象
function foo() {
  var args = Array.from(arguments);
  // ...
}

Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']
```
`Array.from` 还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组
```
let spans = document.querySelectorAll('span.name');

// Array.from()
let names = Array.from(spans, s => s.textContent)
```


### Array.prototype.includes 与 Array.prototype.indexOf 的区别
`Array.prototype.indexOf` 它内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判
```
[NaN].indexOf(NaN)
// -1

[NaN].includes(NaN)
// true
```


### Array.prototype.flat
用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响
```
[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]

[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]
```


### Array.prototype.sort 的排序稳定性
ES2019 明确规定，Array.prototype.sort()的默认排序算法必须稳定
```
// 正确sort排序，符合预期 straw 在 spork 之前
const arr = [
  'peach',
  'straw',
  'apple',
  'spork'
];

const stableSorting = (s1, s2) => {
  if (s1[0] < s2[0]) return -1;
  return 1;
};

arr.sort(stableSorting)
// ["apple", "peach", "straw", "spork"]
arr.sort(stableSorting)
// ["apple", "peach", "straw", "spork"]


// 错误sort排序，导致不稳定排序结果
const unstableSorting = (s1, s2) => {
  if (s1[0] <= s2[0]) return -1;
  return 1;
};

arr.sort(unstableSorting)
// ["apple", "peach", "spork", "straw"]
arr.sort(unstableSorting)
// ["apple", "peach", "straw", "spork"]
```


### Set集合
保证成员唯一性，添加重复成员视为无效的操作，遍历的顺序就是插入的顺序
- 添加成员时不会发生类型转换，`5` 和 `'5'` 是两个不同的值，类似 `Object.is` 相等算法
- 可以通过数组或者部署迭代器接口的对象初始化成员
```
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

const set = new Set(document.querySelectorAll('div'));
set.size // 56
```
- 部署独立的迭代器
```
let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
// red
// green
// blue


let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```
- 可以实现数据去重
```
// 去除数组的重复成员
[...new Set(array)]

// 去除字符串的重复字符
[...new Set('ababbc')].join('')
// "abc"
```


### WeakSet
保证成员唯一性，添加重复成员视为无效的操作，成员必须是 **对象**，不能进行 **遍历** 操作，对成员的引用不会导致对象引用计数 `+1`  
因为是若引用，垃圾回收会忽略 `WeakSet` 对其成员的引用，当成员引用计数为0时，随时会被回收，很可能刚刚遍历结束，成员就取不到了，所以遍历机制无法保证成员的存在，不能进行遍历操作，没有 `size` `clear` `forEach` ，使用举例：
```
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
```


### Map
保存键值对的集合，键可以是任意类型，遍历的顺序就是插入的顺序  
- 可以通过数组或者部署迭代器接口的对象初始化成员，该数组的成员是一个个表示键值对的数组
```
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
```
- 遍历成员
```
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]

map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
```


### WeakMap
保存键值对的集合，键可以是任意类型，遍历的顺序就是插入的顺序，键名必须是 **对象**，不能进行 **遍历** 操作，对键名的引用不会导致对象引用计数 `+1`   
因为是若引用，垃圾回收会忽略 `WeakMap` 对其键名对象的引用，当键名引用计数为0时，键名和它指向的键值会自动回收，很可能刚刚遍历结束，成员就取不到了，所以遍历机制无法保证成员的存在，没有 `size` `clear` `forEach`，使用举例：
```
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```