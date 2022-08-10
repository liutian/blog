
### 索引访问
```typescript
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
```
### map映射类型
```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number]; 

type Age = typeof MyArray[number]["age"]; 

type key = "age";
type Age3 = Person[key]; 
```

### 模式匹配
```
type A = [1, 2, 3]
type TypeA = A extends [infer First, ...infer Rest,infer Last] ? First : never // 1
type B = '123'
type TypeB = B extends `${infer FirstChar}${infer Rest}` ? FirstChar : never // '1'
```
### 循环
```typescript
type IterationString<Str, Item> = Str extends `${infer Char}${infer Rest}` ? IterationString<Rest, Char | Item>  : Item ;

type CharSet = IterationString<'abc|abc', never> // "a" | "b" | "c" | "|"

```
### 其他方式的循环
```typescript
// 分布式条件类型，当泛型参数 T 为联合类型时，条件类型即为分布式条件类型，会将 T 中的每一项分别分发给 extends 进行比对
type Example1<T> = T extends number ? T : never

type Result1 = Example1<"1" | "2" | 3 | 4> // 3 | 4

// 映射类型，固定写法，in 操作符会分发 T 成为新对象类型的键
type Example2<T> = {
  [Key in T]: Key
}
type Result2 = Example2<"1" | "2" | 3 | 4> // { 1: "1"; 2: "2"; 3: 3; 4: 4; }
```
### 从元组类型构造联合类型
```typescript
type TupleToUnion<T extends unknown[]> = T[number]
type Result = TupleToUnion<[1, 2, 3]> // 1 | 2 | 3 
```
### 定义类数字类型
```typescript
type NumberLike = number | `${number}`
const list: NumberLike[] = [43,'3434','abc'] // error: Type abc is not assignable to type NumberLike
```
- 获取函数参数长度
```typescript
type GetFunctionLength<F> = F extends (...args: infer P) => any
  ? P["length"]
  : never
```

### 实用Tip
- 提取 `Promise<T>` 的值的类型
```typescript
type GetPromiseValue<P> = P extends Promise<infer V> ? V : never;

type PromiseType = Promise<string[]>

type value = GetPromiseValue<PromiseType> // string[]
```

- 提取函数返回值类型
```typescript
type GetFunResult<F> = F extends (...params: infer Params) => infer Result ? Result: never;

type Params = GetFunResult<(params1: string,params2: number) => boolean> // boolean
```

- 提取函数返回值 `Promise<T>` 值类型
```typescript
type GetFunResult<F> = F extends (...params: infer Params) => infer Result ? GetPromiseValue<Result>: never;

type Params = GetFunResult<(params1: string,params2: number) => Promise<boolean>> // boolean
```

- 改变属性名称
```typescript
type ChangePropKey<T> = {
  [Prop in keyof T as `new_${Prop & string}`]: T[Prop]
}
```

- 对类型新增方法定义，并约束方法签名
```typescript
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});
```

- 遍历展开类型属性
```typescript
type DeepKeyOf<T> = T extends Record<string, any> ? {
  [k in keyof T]: k extends string ? k | `${k}.${DeepKeyOf<T[k]>}` : never;
}[keyof T] : never;
```

- 遍历展开类型属性，考虑循环引用问题
```typescript

export type AutoPath<O, P> = P extends string ?

  ((P & `${string}.` extends never ? P : P & `${string}.`) extends infer Q ?

    (Q extends `${infer A}.${infer B}` ?

      (A extends StringKeyOf<O> ? `${A}.${AutoPath<GetKeyType<O, A>, B>}` : never)
      :
      (Q extends StringKeyOf<O> ? P : StringKeyOf<O>))

    : never)

  : never;

type StringKeyOf<T, E extends string = never> =
  T extends Array<any> ? ConvertArray<T> : (T extends object ? `${Exclude<keyof T | E, symbol>}` : never)

type GetKeyType<T, K> = K extends keyof T ? ConvertArray<T[K]> : never;

type ConvertArray<T> = T extends Array<infer U> ? ConvertArray<U> : T;


```
### 收藏地址
- https://github.com/type-challenges/type-challenges