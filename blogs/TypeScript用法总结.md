TypeScript 的类型是 JavaScript 类型的超集。但是从更深层次上来说，两者的本质是不一样的，一个是变量的类型，一个是值的类型。现阶段 TypeScript 不算真正意义上的语言，而是围绕 JavaScript 语言的一种高级注释

### 类型推导

仅仅在初始化的时候进行类型推导

```ts
let a = "lucifer"; // 我们没有给 a 声明类型， a 被推导为string
a.toFixed(); // Error
a.includes("1"); // ok
a = 1;
a.toFixed(); // 依然报错， a 不会被推导 为 number
```

### 特殊类型 - void

声明一个 `void` 类型的变量没有什么作用，因为它的值只能为 `undefined` 或 `null`，常用于声明方法没有返回值

```ts
function fn1(): void {}
```

### 特殊类型 - never

使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码

```ts
/**
 * 如果Foo后续开发被修改为 type Foo = string | number | boolean
 * 同时 controlFlowAnalysisWithNever 方法流程控制没有一并修改，
 * 这时else 分支的 foo 类型会被收窄为 boolean 类型
 * 导致无法赋值给 never 类型，这时就会产生一个编译错误
 */
//
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

### 特殊类型 - unknow | any

- 不能直接将 `unknow` 类型变量赋值给除 `any | unknow` 之外类型变量，但是可以将 `any` 类型变量赋值给任意其他类型变量
- 不能对 `unknow` 进行任何操作

```ts
let value: unknown; // 将 unknown 替换为 any 下列语句不会编译报错

value.foo.bar; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
value[0][1]; // Error
```

### type 和 interface 区别

```ts
// interface 可以重复声明
interface TypeA {
  name: string;
}
interface TypeA {
  age: number;
}
const student: TypeA = { name: "tom", age: 4 };

// type 不可重复声明
type typea = { name: string };
type typea = { age: number }; // Error

// 要想达到 interface 同样效果需要使用 &
type typea = { name: string };
type typeb = { age: number };
type TypeA = typea & typeb;
const student: TypeA = { name: "tom", age: 4 };
```

### 联合类型

```ts
// Dinner 要么有 fish 要么有 bear
type dinnerFish = {
  size: number;
  fishCount: number;
};
type dinnerBear = {
  size: number;
  bearCount: number;
};
type Dinner = dinnerFish | dinnerBear;

function eat(dinner: Dinner) {
  console.log(dinner.size);
  console.log(dinner.fishCount); // Error
}

let dinner: Dinner = {}; // Error
let dinner: Dinner = { size: 1, bearCount: 1 };
eat({ size: 1 }); // Error
eat({ size: 1, bearCount: 1 });
```

### 小技巧

```ts
// 接口地址和响应结果映射
interface API {
  "/user": { name: string };
  "/course": { score: number };
}
const get = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
  return fetch(url).then((res) => res.json());
};

// 巧用显式泛型
function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

$<HTMLInputElement>("input").value;

// 数组只读
let arr1: number[] = [1, 2, 3, 4];
let arr2: ReadonlyArray<number> = arr1;

arr2[0] = 12; // Error
arr2.push(5); // Error
arr2.length = 100; // Error
arr1 = arr2; // Error

// 巧用 DeepReadonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

const a = { foo: { bar: 22 } };
const b = a as DeepReadonly<typeof a>;
b.foo.bar = 33; // Error

const toArray = <T>(element: T) => [element]; // Error

const toArray = <T extends {}>(element: T) => [element]; // Ok

// 类实例属性快速定义
class A {
  constructor(
    readonly name: string,
    protected address: string,
    private age: number
  ) {}

  info() {
    console.log(`name: ${this.name} address: ${this.address} age: ${this.age}`);
  }
}

// 自定义类型保护的类型谓词
function fn1(arg: number | string) {
  if (typeof arg === "number") {
    arg.toFixed(2);
  } else {
    arg.split(",");
  }
}

type type1 = { method1: Function };
type type2 = { method2: Function };

function fn2(arg: type1 | type2) {
  if (isType1(arg)) {
    arg.method1();
  } else {
    arg.method2();
  }
}

function isType1(arg: any): arg is type1 {
  return "method1" in arg;
}
```

### 特殊操作符 - typeof

```ts
interface Person {
  name: string;
  age: number;
}

const tom: Person = { name: "tom", age: 30 };
type Tom = typeof tom; // -> Person

function toArray(x: number): number[] {
  return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]
```

当一个类型总有一个字面量初始值时，可以先定义字面量值，然后基于字面量使用 `typeof` 定义类型，可以减少重复代码

#### 特殊操作符 - keyof ????

```ts
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join"
type K3 = keyof { [x: string]: Person }; // string | number
```

### 特殊操作符 - in

```ts
type Keys = "a" | "b" | "c";

type Obj = {
  [p in Keys]: any;
}; // -> { a: any, b: any, c: any }
```

### 特殊操作符 - extends

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m"); // Error
```

### 三元运算符与类型判断 ????

```ts
// 案例一
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T1 = Boxed<string>;
//   ^ = type T1 = {  value: string;  }

type T2 = Boxed<number[]>;
//   ^ = type T2 = {  array: number[]; }
type T3 = Boxed<string | number[]>;
//   ^ = type T3 = BoxedValue<string> | BoxedArray<number>


// 案例二
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// Manufacturer and model are both of type string,
// so we can pluck them both into a typed string array
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// If we try to pluck model and year, we get an
// array of a union type: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);


// 案例三
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// This is an error!
type WrongPartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean;
'boolean' only refers to a type, but is being used as a value here.
'}' expected.
}
Declaration or statement expected.

```

### 泛型类型提取

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
//   ^ = type T1 = string
type T2 = Foo<{ a: string; b: number }>;
//   ^ = type T2 = string | number
```

### 函数泛型简写

```ts
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
// 等价于
let myIdentity: { <T>(arg: T): T } = identity;
```

### 泛型缩形

```ts
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 枚举 与 keyof

```ts
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level message is:", message);
  }
}

printImportant("ERROR", "This is a message");

let levelStr = "ERROR";
printImportant(levelStr, "This is a message"); // Error
```

### 限制类只能继承不能直接实例化

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }
}

let howard = new Employee("Howard", "Sales"); // Ok
let john = new Person("John"); // Error
```

### 接口继承类

```ts
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

### 通过接口定义函数

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

mySearch = function (source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};
```

### 如果接口中构造函数和普通方法必须分离?????

```ts
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};
```

### 规定函数执行时的 `this` 指向

```ts
type student = {
  name: string;
};

function introduce(this: student): string {
  return `I am ${this.name}`;
}

introduce(); // Error
introduce({ name: "jack" }); // Error

introduce.apply({ name: "jack" }); // Ok
```

### 定义函数属性

```ts
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 函数参数为对象时，对象属性检查

```ts
interface Student {
  name?: string;
  age?: number;
}

function fn1(student: Student) {}

fn1({ nickname: "tom", age: 100 }); // Error

// 解决方案一
interface Student {
  name?: string;
  age?: number;
  [propName: string]: any;
}

// 解决方案二
let student = { nickname: "tom", age: 100 };
fn1(student);

// 注意解决方案一
let student = { nickname: "tom", score: 100 };
fn1(student); // Error
```

### !非空断言

用于断言操作对象是非 `null` 和非 `undefined` 类型

```js
function myFunc(maybeString: string | undefined | null) {
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}

type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```

### 定义全局变量

```ts
declare var var1: number;

declare function fn1();
```

[深入理解 TypeScript](https://github.com/jkchao/typescript-book-chinese)
