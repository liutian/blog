
### 索引访问类型
```ts
// 通过属性字符串生成新类型
type ObjType = {
  name: string,
  age: number
}
type Newtype = ObjType['name'];

// 通过数字类型生成新类型并可链式使用
type ArrayType = ObjType[];
type NewType = ArrayType[number]['age'];

// 通过范型方式生成新类型
type GetValueType<T extends {[prop: string]: any},K extends string> = T[K];
type ObjType = {
  name: string,
  age: number
}
type NewType = GetValueType<ObjType,'name' | 'age'>;
```
### map映射类型
```ts
// 改变属性的值类型
type ObjType = {
  name: string,
  age: number,
  birthday: Date
}
type ChangePropType<T> = {
  [Prop in keyof T]: boolean
}
type NewType = ChangePropType<ObjType>;
const obj = {} as NewType;

// 改变属性名
type ChangeValueType<T> = {
  [Prop in keyof T as `new_${Prop & string}`]: T[Prop]
}
type NewType = ChangeValueType<ObjType>;

// 改变属性特性
type ObjType = {
  name: string,
  readonly age: number,
  birthday?: Date
}
type ChangePropFeatures<T> = {
  -readonly [Prop in keyof T]-?: T[Prop]
}
type NewType = ChangePropFeatures<ObjType>;
```
### 函数范型定义方式
```ts
// 函数声明时定义范型
const clone = <T>(origin: T): T => {
  return {} as any;
}

// 先定义范型
type cloneFnType = <T>(origin: T) => T
const clone: cloneFnType = (origin) => {
  return {} as any;
}

```

### 类和范型特殊用例
```ts
const query = <T,K extends keyof T>(table: new () => T,columns: K[]):T => {
  return {} as any;
}
class Demo{
  name:string;
}
query(Demo,['name'])
```
### 模版字面量类型
```ts
// 联合类型交叉产生新类型
type StrType1 = 'a' | 'b';
type StrType2 = '1' | '2';
type NewType = `${StrType1}_${StrType2}`;


// 和数组配合
type Str = '123'
type NewStr = Str extends `${infer FirstChar}${infer Rest}` ? FirstChar : never;


// 递归遍历
type IterationString<Str, Item> = Str extends `${infer Char}${infer Rest}` ? IterationString<Rest, Char | Item>  : Item ;


// 定义类数字数组
type NumberLike = number | `${number}`
const list: NumberLike[] = [43,'3434','abc'] // error: Type abc is not assignable to type NumberLike
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