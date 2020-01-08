### Promise
`Promise` 对象的状态改变，只有两种可能：从 `pending` 变为 `fulfilled` 和从 `pending` 变为 `rejected`。如果改变已经发生了，你再对 `Promise` 对象添加回调函数，会立即得到这个结果。这与事件完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
缺点：无法取消 `Promise` ，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，`Promise` 内部抛出的错误，不会反应到外部


### Promise嵌套
- `promise` 内部嵌套
```
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

// resolve(p1) 将导致 p2.then 转接到p1上
const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```
- `then` 方法嵌套
```
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve('p1'), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve('p2'), 1000)
})

p2.then((data) => {
  console.log('p2.then');
  console.log('data: ' + data);
  return p1;
}).then((data) => {
  console.log('p2.then.then');
  console.log('data: ' + data);
})
```


### 调用resolve 或 reject并不会终结 Promise 函数的执行
```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```


### Promise静态方法
- `Promise.all` 将多个子 `Promise` 实例包装成一个新的 `Promise` 实例，只有所有子实例状态都变成 `fulfilled` 时，新实例才会变成 `fulfilled`，否则任何一个子实例状态变成 `rejected` 新实例就会变成 `rejected`
- `Promise.any` 将多个子 `Promise` 实例包装成一个新的 `Promise` 实例，只有所有子实例状态都变成 `rejected` 时，新实例才会变成 `rejected`，否则任何一个子实例状态变成 `fulfilled` 新实例就会变成 `fulfilled`，该方法处于 **提案** 阶段
- `Promise.race` 将多个子 `Promise` 实例包装成一个新的 `Promise` 实例，只要子实例任何一个发生状态改变，新实例就会跟着发生同样的状态改变
- `Promise.allSettled` 将多个子 `Promise` 实例包装成一个新的 `Promise` 实例，只有所有子实例都发生状态改变，新实例才会结束，结束状态总是 `fulfilled`，该方法由 **ES2020** 引入


### Promise.try