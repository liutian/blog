
### 特殊类型

#### void
声明一个 `void` 类型的变量没有什么作用，因为它的值只能为 `undefined` 或 `null`
```ts
let unusable: void = undefined;
```

#### never
使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。

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

#### unknow和any区别
- 不能直接将 `unknow` 类型变量赋值给除 `any | unknow` 之外类型变量，但是可以将 `any` 类型变量赋值给任意其他类型变量
- 不能对 `any` 进行任何操作

```ts
let value: unknown;

value.foo.bar; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
value[0][1]; // Error
```

### type和interface区别
```ts
interface A {
    a: number;
}

interface A {
    b: number;
}

const a: A = {a: 3, b: 4}


type a = {a: number}
type b = {b: number}
const a: a|b = {a: 3, b: 4}
```

### 类实例属性快速定义
```ts
class A {
  constructor(readonly name: string, protected address: string, private age: number) {
  }

  info() {
    console.log(`name: ${this.name} address: ${this.address} age: ${this.age}`)
  }
}
```

### 技巧
```ts
// 巧用查找类型+泛型+keyof
interface API {
  '/user': { name: string },
  '/menu': { foods: Food[] },
}
const get = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
  return fetch(url).then(res => res.json())
}


// 巧用显式泛型
function $<T extends HTMLElement>(id: string):T {
  return document.getElementById(id)
}

$<HTMLInputElement>('input').value


// 巧用 DeepReadonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

const a = { foo: { bar: 22 } }
const b = a as DeepReadonly<typeof a>
b.foo.bar = 33 // Hey, stop!



// 巧用tsx+extends
const toArray = <T>(element: T) => [element]; // Error in .tsx file.

const toArray = <T extends {}>(element: T) => [element]; // No errors.



// 巧用ClassOf
interface ClassOf<T> {
  new (...args: any[]): T;
}
const renderAnimal = (AnimalComponent: ClassOf<Animal>) => {
  return <AnimalComponent/>; // Good!
}

renderAnimal(Cat); // Good!
renderAnimal(Dog); // Good!


// 巧用类型查找+类方法
class Parent extends React.PureComponent {
  private updateHeader = (title: string, subTitle: string) => {
    // Do it.
  };
  render() {
    return <Child updateHeader={this.updateHeader}/>;
  }
}

interface ChildProps {
  updateHeader: Parent['updateHeader'];
}
class Child extends React.PureComponent<ChildProps> {
  private onClick = () => {
    this.props.updateHeader('Hello', 'Typescript');
  };
  render() {
    return <button onClick={this.onClick}>Go</button>;
  }
}
```

### 联合类型
```ts
// Dinner 要么有 fish 要么有 bear 。
type Dinner = {
  size: number,
  fish: number,
} | {
  size: number,
  bear: number,
}

function eat(dinner: Dinner) {
  console.log(dinner.size);
  console.log(dinner.fish); // Erro
}

let dinner: Dinner = {}  // Error
let dinner: Dinner = {size:1, bear:1} 
eat({size: 1}) // Error
eat({size:1, bear:1}) 
```



### 泛型操作符

#### typeof
```ts
interface Person {
  name: string;
  age: number;
}

const tom: Person = { name: 'tom', age: 30 };
type Tom = typeof tom; // -> Person

function toArray(x: number): number[] {
  return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]
```
当一个类型总有一个字面量初始值时，可以先定义字面量值，然后基于字面量定义类型，可以减少重复代码

#### keyof
```ts
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
```

#### in
```ts
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```

#### extends
```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}


function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m"); // Error
```

### 泛型条件判断
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

### 函数类型泛型
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


### 自定义类型保护的类型谓词
```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}

// as 类型断言
if ((pet as Fish).swim) {
  (pet as Fish).swim();
} else {
  (pet as Bird).fly();
}

// in 类型断言
if ('swim' in pet) {
  pet.swim();
} else{
  pet.fly();
}

```


### 枚举keyof特殊性
```ts
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG
}

type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");
```


### 限制类只能继承不能直接实例化
```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee can extend Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
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

### 字符串字面量类型
```ts
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // It's possible that someone could reach this
      // by ignoring your types though.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
Argument of type '"uneasy"' is not assignable to parameter of type 'Easing'.
```

### 函数类型快速定义
```ts
let myAdd: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};
```


### 方法重载
```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 },
];

let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```



### 设置函数this类型
```ts
interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```


### 数组只读
```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

ro[0] = 12; // error!
Index signature in type 'readonly number[]' only permits reading.
ro.push(5); // error!
Property 'push' does not exist on type 'readonly number[]'.
ro.length = 100; // error!
Cannot assign to 'length' because it is a read-only property.
a = ro; // error!
The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
```


### 构造函数和普通方法必须分离
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


### 属性检查
```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return { color: config.color || "red", area: config.width || 20 };
}

let mySquare = createSquare({ colour: "red", width: 100 }); 
// Error Argument of type '{ colour: string; width: number; }' is not assignable to parameter of type 'SquareConfig'.
//  Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?

// 解决方案
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}

// 或者
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```






### 可选链
```ts
obj?.prop.fn()
```

### 空值联合
```ts
obj ?? '123'
```


### 定义全局变量
```ts
declare var var1: number;

declare function fn1();
```

[深入理解 TypeScript](https://github.com/jkchao/typescript-book-chinese)


























