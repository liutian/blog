TypeScript 的类型是 JavaScript 类型的超集。但是从更深层次上来说，两者的本质是不一样的，一个是变量的类型，一个是值的类型。现阶段 TypeScript 不算真正意义上的语言，而是围绕 JavaScript 语言的一种高级注释，同时它会自动检查代码，找出那些逃过我们眼睛的 bug


### 复杂类型推导
```ts
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


### 特殊类型 - unknow vs any

- 可以将任意类型赋值给 `any | unknow`
- 不能直接将 `unknow` 类型变量赋值给除 `any | unknow` 之外类型变量，但是可以将 `any` 类型变量赋值给任意其他类型变量
- 不能对 `unknow` 进行任何操作

```ts
let value: unknown;
// 将 unknown 替换为 any 下列语句不会编译报错
value.foo.bar; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
value[0][1]; // Error
```

### 联合类型

```ts
type dinnerFish = {
  size: number;
  fishCount: number;
};
type dinnerBear = {
  size: number;
  bearCount: number;
};

// Dinner 要么有 fishCount 要么有 bearCount , 不能同时存在这两个属性
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

### 交叉类型

```ts
type dinnerFish = {
  size: number;
  fishCount: number;
};
type dinnerBear = {
  size: number;
  bearCount: number;
};

// Dinner 必须同时存在 size fishCount bearCount 三个属性
type Dinner = dinnerFish & dinnerBear;

function eat(dinner: Dinner) {
  console.log(dinner.size); // OK
  console.log(dinner.fishCount); // OK
  console.log(dinner.bearCount); // OK
}

let dinner: Dinner = {}; // Error
let dinner: Dinner = { size: 1, bearCount: 1 }; // Error
eat({ size: 1 }); // Error
eat({ size: 1, bearCount: 1 }); // Error
```

### type 和 interface 区别

```ts
// 同一个文件 type 不可重复声明
type typea = { name: string };
type typea = { age: number }; // Error

// 同一个文件 interface 可以重复声明
interface TypeA {
  name: string;
}
interface TypeA {
  age: number;
}
const student: TypeA = { name: "tom", age: 4 };

// type 通过 & 扩充类型
type typeChild1 = { name: string };
type typeChild2 = { age: number };
type typeParent = typeChild1 & typeChild2;
const student: typeParent = { name: "tom", age: 4 };

// interface 通过 extends 扩充类型
interface Child {}
interface Parent extends Child {}

```


### 规定函数执行时的 `this` 指向

```ts
type Student = {
  name: string;
};

function introduce(this: Student): string {
  return `I am ${this.name}`;
}

introduce(); // Error
introduce({ name: "jack" }); // Error

introduce.apply({ name: "jack" }); // Ok
```

### 只校验已有属性类型，忽略未知属性类型

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
```

### 特殊操作符 - infer 泛型类型提取

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
//   ^ = type T1 = string
type T2 = Foo<{ a: string; b: number }>;
//   ^ = type T2 = string | number
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

### 类、接口、继承、实现之间关系

- 类可以继承类（只能单继承）
- 接口可以继承接口（可以多继承）
- 类不可以继承接口
- 接口可以继承类（可以多继承）
- 类可以实现类（可以多实现）
- 接口与接口直接不能相互实现
- 类可以实现接口（可以多实现）
- 接口不可以实现类

只要记住接口不可以实现接口或者类，类不可以继承接口

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


[深入理解 TypeScript](https://github.com/jkchao/typescript-book-chinese)
