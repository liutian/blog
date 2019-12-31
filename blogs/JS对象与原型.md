### 对象字面量定义简写形式
```
const name = 'xx';
const key = 'address';
const fn = 'run';

const obj = {
  name,
  say(){
    return `name: ${this.name} age: ${this.age}`;
  },
  get age(){
    return 10;
  },
  [key]: 'yyy',
  [fn](){
    return fn + ' ...';
  }
}

// 简写的对象方法不能用作构造函数
new obj.say() // 报错
```
> **super** 关键字指向当前对象原型，当前只能用在Class方法和对象简写方法中使用


### 对象扩展运算符
- 可以用于合并两个对象  
```
let ab = { ...a, ...b };

// 等同于
let ab = Object.assign({}, a, b);
```
- 修改现有对象属性  
```
let newVersion = {
  ...previousVersion,
  name: 'New Name' // Override the name property
};
```
- 可以跟表达式
```
const obj = {
  ...(x > 1 ? {a: 1} : {}),
  b: 2,
};
```
- 不能复制继承自原型对象的属性
```
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```


### 链判断运算符
使用了?.运算符，直接在链式调用的时候判断，左侧的对象是否为null或undefined。如果是的，就不再往下运算，而是返回undefined  
```
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value;
person.sayHello?.();
```
**短路机制**  
```
a?.[++x]
// 等同于
a == null ? undefined : a[++x]
```
如果a是undefined或null，那么x不会进行递增运算。也就是说，链判断运算符一旦为真，右侧的表达式就不再求值
**链运算符禁止用于赋值运算符左侧** `a?.b = c`  


### Null 判断运算符
它的行为类似||，但是只有运算符左侧的值为null或undefined时，才会返回右侧的值
```
function Component(props) {
  const {
    enabled: enable = true,
  } = props;
  // …
}
```


### 对象属性枚举与遍历
有四个操作会忽略属性描述符 `enumerable` 为 `false` 的属性
- for...in 只遍历对象自身的和继承的可枚举的属性
- Object.keys() 返回对象自身的所有可枚举的属性的键名
- JSON.stringify() 只串行化对象自身的可枚举的属性
- Object.assign() 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性
> 所有 Class 的原型的方法都是不可枚举的
> 尽量不要用for...in，而用Object.keys代替


### API备忘录
- **`Object.assign`** 复制一个或多个对象来创建一个新的对象
- **`Object.keys`** 返回指定对象自身可枚举属性名称的数组
- **`Object.prototype.toString`** 返回对象的字符串表示，一般用于重写该方法来实现特殊效果
- **`Object.prototype.hasOwnProperty`** 表示某个对象是否含有指定的属性，而且此属性非原型链继承的
- **Object.prototype.valueOf** 返回对象的原始值，如果对象没有原始值，则valueOf将返回对象本身，一般用于重写该方法来实现特殊效果
- **Object.getOwnPropertyNames** 返回指定对象所有的可枚举或不可枚举的属性名的数组
- **Reflect.ownKeys** 返回指定对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
- **Object.create** 使用指定的原型对象和属性创建一个新对象
- **Object.is** 绝对比较两个值是否相等，比===更严格，+0 和 -0 不相等，NaN 互不相等
- **Object.defineProperty** 给对象添加指定属性并指定属性的配置
- **Object.getPrototypeOf** 返回指定对象的原型
- **Object.setPrototypeOf** 设置指定对象的原型
- **Object.prototype.isPrototypeOf** 判断指定的对象是否在本对象的原型链中的原型对象




### 注意事项


### 函数name属性
返回函数最初定义时的名称，bind方法返回的函数name属性以'bound'前缀



