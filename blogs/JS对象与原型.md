### 对象简写形式
```js
const name = 'Zhang';
const key = 'motto';
const fn = 'speak';

const human = {
  name,
  get country(){
    return 'China';
  },
  [key]: 'Never say die',
  introduce (){
    return `My name is ${this.name} , i am from ${this.country}.`;
  },
  [fn](){
    return `My motto is ${this.motto}`;
  }
}

```


### 对象扩展运算符
- 用于合并两个对象  
```js
let ab = { ...a, ...b };

// 等同于
let ab = Object.assign({}, a, b);
```
- 修改现有对象属性  
```js
let newObj = {
  ...oldObj, // ...oldObj和name顺序会影响最终生产的对象
  name: 'New Name' 
};

// 等同于
let newObj = Object.assign(oldObj, {name: 'New Name'});

```
- 可以跟表达式
```js
const obj = {
  ...(x > 1 ? {a: 1} : {}),
  b: 2,
};
```
- 不能复制继承自原型对象的属性
```js
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```

### 对象属性枚举与遍历
- `for...in` 遍历对象自身和继承的可枚举的属性（包括方法）
- `Object.keys` 返回对象自身可枚举属性名称的数组（包括方法）
- `JSON.stringify` 只串行化对象自身可枚举的属性和 `Object.keys` 类似但是不包括方法
- `Object.assign` 只拷贝对象自身可枚举的属性和 `Object.keys` 一致
> 类中定义的方法都是不可枚举的，尽量 `Object.keys` 替代 `for...in`

### 实现对象深度拷贝
```js
function clone (parent) {
  const parents = [];
  const children = [];

  function _clone (parent) {
    if (parent === null) return null;
    if (typeof parent !== 'object') return parent;

    let child, proto;

    if (isType(parent, 'Array')) {
      child = [];
    } else if (isType(parent, 'RegExp')) {
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, 'Date')) {
      child = new Date(parent.getTime());
    } else {
      proto = Object.getPrototypeOf(parent);
      child = Object.create(proto);
    }

    const index = parents.indexOf(parent);

    if (index != -1) {
      return children[index];
    }

    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      child[i] = _clone(parent[i]);
    }

    return child;
  }

  return _clone(parent);
}
```

### API备忘录
- **`Object.assign`** 复制一个或多个对象来创建一个新的对象，源对象和目标对象可以是数组
- **`Object.keys`** 返回对象自身可枚举属性名称的数组
- **`key in object`** 可以访问到对象任何属性
- `Object.prototype.toString` 返回对象的字符串表示，重写该方法可以实现特殊效果
- `Object.prototype.valueOf` 返回对象的原始值，如果对象没有原始值，则valueOf将返回对象本身，重写该方法可以实现特殊效果
- `Object.prototype.hasOwnProperty` 判断某个属性是否属于对象自身，而非来自原型链
- `Object.prototype.isPrototypeOf` 判断指定的对象是否存在于本对象的原型链
- `Object.prototype.propertyIsEnumerable` 判断当前对象的属性是否是可枚举的
- `Object.getOwnPropertyNames` 除了包含 `Object.keys` 结果外还会包含对象自身不可枚举的属性
- `Object.create` 使用指定对象作为新创建对象的原型，第二个可选参数为属性描述符
- `Object.is` 绝对比较两个值是否相等，比 `===` 更严格，+0 和 -0 不相等，NaN 互不相等
- `Object.defineProperty` 给对象添加指定属性并指定属性的配置
- `Object.getPrototypeOf` 返回指定对象的原型 `Object.getPrototypeOf(Child) === Parent`
- `Object.setPrototypeOf` 设置指定对象的原型
- `Reflect.ownKeys` 除了包含 `Object.getOwnPropertyNames` 结果外还会包含对象自身 `Symbol` 属性
- `Object.freeze` 不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改
- `Object.preventExtensions` 不能再添加新的属性
- `Object.seal` 阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变

### 类定义
```js
let ability = 'eat';

class Human {
  name = 'Zhang'; // 可以定义实例属性
  [ability](){ } // 动态属性名

  // 私有属性和方法使用 # 为前缀，避免和其他变量混淆，而且私有属性和私有方法可以和正常的属性和方法重名
  // 之所以要引入一个新的前缀#表示私有属性，而没有采用private关键字，是因为 JavaScript 是一门动态语言，没有类型声明，
  // 使用独立的符号似乎是唯一的比较方便可靠的方法，能够准确地区分一种属性是否为私有属性
  #nickname = 'z'; 
  #introduce(){ 
    return `My nickname is ${this.#nickname} , my motto is ${this.#introduce()}`;
  } 
  introduce(){ // 私有和公开方法名可以重名
    return this.#introduce();
  }

  constructor(){
    // 如果当前函数通过 new 关键字执行，new.target 返回执行 new 时的函数
    // 利用这个特点，可以写出不能独立使用、必须继承后才能使用的类
    if (new.target === Human) {
      throw new Error('本类不能实例化');
    }
  }

  // 静态属性仍处于提案阶段
  static age = 11; 

  // 如果静态方法包含this关键字，这个this指的是类，而不是实例
  static speak() { 
    this.hello();
  }
  static hello() { } 
}

// 也可以通过表达式定义类，即匿名类
const h = class Human { }
// 省略类名
const h = class { }
// 立即执行的Class 
const h = new class { }()


// 子类继承父类
class Student extends Human {
  // 子类继承父类时，子类要么不写构造函数如果写构造函数就必须在构造函数中调用super()，而且必须在使用this之前调用，否则在创建类实例时会报错
  constructor() {
    console.log('student init ...');
    super();
    this.score = 100;
  }
} 
```
- 类中定义的方法都是不可枚举的
- 类内部默认启用严格模式
- 类不存在变量提升，保证类的继承
- 类必须通过 `new` 关键字来调用，不能单独调用，否则报错
- `super()` 相当于 `Parent.prototype.constructor.call(this)` 而 `this` 指向 `Child` 的实例，也就是在`new Child()`时，当执行父类的构造函数时，`this` 指向子类对象，执行子类其他函数时如果函数里面又通过 `super.xxx()` 执行了父类方法，那么父类方法里面的 `this` 也是指向子类对象
- 如果在子类方法中访问 `super.xxx` 能够访问定义父类原型上的方法和属性，不能访问实例属性，也就是在子类中 `super.xxx()` 相当于 `Parent.prototype.xxx.call(this)`  `super.xxx` 相当于  `Parent.prototype.xxx`
- 如果通过 `super` 对某个属性赋值，这时 `super` 就是 `this`，赋值的属性会变成子类实例的属性
- 在子类的静态方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类，而不是子类的实例
- 类可以继承原生类，从而可以根据原生类自定义自己的类，包括：`Number` `Boolean` `String` `Date` `Array` `RegExp` `Object` `Function` `Error`


### 子类 __proto__ 与 prototype
- 子类 `__proto__` 属性，表示构造函数的继承，总是指向父类
- 子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的prototype属性
```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
**继承的本质**  
```js
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();
```
**继承的特殊场景**  
```js
// 子类继承Object类
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
// 这种情况下，A其实就是构造函数Object的复制，A的实例就是Object的实例



// 不存在任何继承
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
// 这种情况下，A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性
```

### 实现ES6的class
```js
function inherit(subType, superType){
  subType.prototype = Object.create(superType.prototype,{
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType
    }
  })

  // 继承父类静态方法
  Object.setPrototypeOf(subType, superType)
}

function subType(...args){
  superType.call(this,...args)
}

function superType(){ }
```

### 原型链图解
![prototype](../assets/img/object-1.png)





