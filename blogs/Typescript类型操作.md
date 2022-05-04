### 模式匹配
```
type A = [1, 2, 3]
type TypeA = A extends [infer First, ...infer Rest] ? First : never // 1
type B = '123'
type TypeB = B extends `${infer FirstChar}${infer Rest}` ? FirstChar : never // '1'
```

### 特殊操作
- 将类型转为字符串
```
// 能转为字符串的类型有限
type CanStringified = string | number | bigint | boolean | null | undefined

// 将支持的类型转化为字符串
type Stringify<T extends CanStringified> = `${T}`
```

- 循环
```
type IterationString<Str, Item> = Str extends `${infer Char}${infer Rest}` ? IterationString<Rest, Char | Item>  : Item ;

type CharSet = IterationString<'abc|abc', never> // "a" | "b" | "c" | "|"

```
- 其他方式的循环
```
// 分布式条件类型，当泛型参数 T 为联合类型时，条件类型即为分布式条件类型，会将 T 中的每一项分别分发给 extends 进行比对
type Example1<T> = T extends number ? T : never

type Result1 = Example1<"1" | "2" | 3 | 4> // 3 | 4

// 映射类型，固定写法，in 操作符会分发 T 成为新对象类型的键
type Example2<T> = {
  [Key in T]: Key
}
type Result2 = Example2<"1" | "2" | 3 | 4> // { 1: "1"; 2: "2"; 3: 3; 4: 4; }
```
- 从元组类型构造联合类型
```
type TupleToUnion<T extends unknown[]> = T[number]
type Result = TupleToUnion<[1, 2, 3]> // 1 | 2 | 3 
```

### 实用Tip
- 提取 `Promise<T>` 的值的类型
```
type GetPromiseValue<P> = P extends Promise<infer V> ? V : never;

type PromiseType = Promise<string[]>

type value = GetPromiseValue<PromiseType> // string[]
```

- 提取函数参数类型
```
type GetFunParams<F> = F extends (...params: infer Params) => any ? Params: never;

type Params = GetFunParams<(params1: string,params2: number) => void> // [params1: string, params2: number]
```

- 提取函数返回值类型
```
type GetFunResult<F> = F extends (...params: infer Params) => infer Result ? Result: never;

type Params = GetFunResult<(params1: string,params2: number) => boolean> // boolean
```

- 提取函数返回值 `Promise<T>` 值类型
```
type GetFunResult<F> = F extends (...params: infer Params) => infer Result ? GetPromiseValue<Result>: never;

type Params = GetFunResult<(params1: string,params2: number) => Promise<boolean>> // boolean
```