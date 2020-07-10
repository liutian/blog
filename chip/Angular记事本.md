### 通过项目名访问页面
- 本地开发 `ng serve --serve-path /demo --base-href /demo/`
- 构建部署 `ng build --base-href /demo/`

### 本地开发时通过域名访问页面
`ng serve --host demo.com --port 80 --disable-host-check`

### 本地开发时将Ajax请求反向代理到后端服务器
`ng serve --proxy-config proxy.conf.json` 具体配置请查阅 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)  

### 通过默认路径导入项目的其他文件，例如 import { A } from 'app/demo/a'
在项目根目录下的 `tsconfig.json` 中配置 `compilerOptions.baseUrl` 为 `src`

### 引入第三方库但是没有合适的npm包
- 直接将第三方库 `lib-a` 下载下来放到项目根目录的lib目录下，比如 `lib/lib-a/index.js`
- 在 `angular.json` 文件 projects.<项目名>.architect.build.options.scripts 节点追加 `'../lib/lib-a/index.js'`

### 引入第三方样式库但是没有合适的npm包
- 直接将第三方库 `lib-b` 下载下来放到项目根目录的lib目录下，比如 `lib/lib-b/index.css`
- 在 `angular.json` 文件 projects.<项目名>.architect.build.options.styles 节点追加 `'../lib/lib-b/index.css'`

### 如果某些页面用到了第三方库，但是这些库本身比较大影响到构建打包的时间和生成文件的大小
- 不要通过 import 的方式引入这些库，而是把这些库放到项目的 `src/assets/lib/` 目录下
- 针对这些库写对应的组件/指令,当使用到组件/指令时异步加载第三方库代码，例如：`src/app/share/highlight`

### 第三方库的接口暴露到全局变量中，导致typescript语法检查时报错，例如：let a = new LibA();
- 在 `src/typings.d.ts` 中新增 `interface Window { LibA: any }`
- 或者 `declare var libraryName: any`

### 如何将自己的代码编译为es6
修改项目根目录下的 `tsconfig.json` 文件，将 `compilerOptions.target` 修改为 `es6`


### 代理后端请求时可以将多个条目代理到同一个目标
```javascript
const PROXY_CONFIG = [
  {
    context: [ "/path1", "/path2", "/path3", "/path4"],
    target: "http://localhost:3000"
  }
]
```

### 如果你需要根据情况绕过本地代理，或在发出请求前先动态修改一下，可以添加 bypass 选项
```javascript
const PROXY_CONFIG = {
  "/api/proxy": {
    target: "http://localhost:3000",
    secure: false,
    bypass: function (req, res, proxyOptions) {
      if (req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
      req.headers["X-Custom-Header"] = "yes";
    }
  }
}
```

### 详细代理日志输出
```javascript
{
  "/api": {
    target: "http://localhost:3000",
    secure: false,
    pathRewrite: {
      "^/api": ""
    },
    logLevel: "debug"
  }
}
```


### 如何以热更新方式进行本地开发，方便反复调试页面样式
- main.ts 中引入热加载代码
```typescript
import { acceptHot } from '../lib/hmr';

platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef: NgModuleRef<AppModule>) => {
  if (module.hot) {
    acceptHot(module, moduleRef);
  }
});
```
- `ng serve --hmr `

### 从node_modules中复制文件到构建目录
```javascript
"assets": [
  { 
    "glob": "**/*", 
    "input": "./node_modules/some-package/images",
    "output": "/some-package/" 
  }
]
```

### 复制文件到构建目录时，排除某些文件
```javascript
"assets": [
  {
    "glob": "**/*", 
    "input": "src/assets/", 
    "ignore": ["**/*.svg"], 
    "output": "/assets/" 
  },
]
```

### 重新定义第三方样式或者脚本的打包名称，同时不在indec.html中引用
```javascript
"styles": [
  { 
    "input": "src/external-module/styles.scss", 
    "inject": false, 
    "bundleName": "external-module" 
  }
],
"scripts": [
  { 
    "input": "src/external-module/main.js", 
    "inject": false, 
    "bundleName": "external-module" 
  }
]
```

### 只压缩第三方脚本，不压缩第三方样式
```javascript
"optimization": { "scripts": true, "styles": false }
```

### 开启node_module下的源码映射
```javascript
"sourceMap": {"scripts": true, "vendor": true}
```

### 关闭样式文件的源码映射
```javascript
"sourceMap": {"scripts": true, "styles": false}
```

### 将构建之后的文件发布到CDN之后，代码报错，输出的错误信息不全
```javascript
"scrossOrigin": "anonymous"
```

### 创建组件时组件display为block
```javascript
"@schematics/angular:component": {
  "displayBlock": true,
}
```

### 创建页面级组件时省略selector
```javascript
"@schematics/angular:component": {
  "skipSelector": true
}
```


### 初始化项目时主应用名和项目名不同名
```javascript
ng new demo --createApplication=false
ng g application app1
```
app1应用会存储在/projects/下


### 输出构建日志
```javascript
ng build --buildEventLog=./build.log 
```

### 更详细的输出构建用时统计
```javascript
"architect.build.options.verbose": true
```

### 动态懒加载模块
- angular.json 文件添加 `architect.build.options.lazyModules: ["src/app/demo/demo.module.ts"]`
- tsconfig.json 文件添加 `files: ["src/app/demo/demo.module.ts"]`

### 开发技巧
- 服务应该声明自己的提供者（而不是在 NgModule 或组件中声明提供者），这样它们才是可摇树优化的 。这样，如果该服务从未被注入到导入该库的应用中，编译器就会把该服务从发布包中删除
- cli构建模型：工作区配置 --> 项目 --> 项目配置 --> 项目构建器 --> 项目构建器默认配置 --> 不同环境下项目构建器配置
- 如果把 noImplicitAny 标志设置为了 true，你可能会得到隐式索引错。 大多数程序员可能觉得这种错误是个烦恼而不是助力。 你可以使用另一个标志来禁止它们。`"suppressImplicitAnyIndexErrors": true`

### Angular高阶知识
- [预编译](https://angular.cn/guide/aot-compiler)
- [预编译元数据错误](https://angular.cn/guide/aot-metadata-errors)
- [模板类型检查](https://angular.cn/guide/template-typecheck)
- [语言服务](https://angular.cn/guide/language-service)
- [构建器](https://angular.cn/guide/cli-builder)

### --prod 标志具有如下优化特性
- 预先(AOT)编译：预编译 Angular 的组件模板
- 生产模式：部署到启用了生产模式的生产环境
- 打包：把你的多个应用于库文件拼接到少量包（bundle）中
- 最小化：删除多余的空格、注释和可选令牌
- 混淆/丑化：重写代码，使用简短的、不容易理解的变量名和函数名
- 消除死代码：删除未引用过的模块和很多未用到的代码

### 模板检查
- 精确定位错误的代码行，并展示错误位置
- 配合IDE可以在不运行系统的情况下检查模板错误
- 构建发布时感知到模板错误
- 检查组件属性，方法是否存在
- 检查组件方法签名，包括方法参数数量，类型，返回值
- 检查组件属性类型
- 组件输出类型推断
- 组件收入属性类型检查
- 管道值和参数类型推断
- 支持组件/指令的泛型推断

enableIvy
启用 Ivy 编译和渲染管道。从版本 9 开始，默认值为 true 。在版本 9 中，您可以选择不用 Ivy 而是继续使用以前的编译器 View Engine。
对于使用 CLI 生成的库项目，prod 配置默认在版本9中为 false。

enableResourceInlining
当为 true 时，将所有 @Component 装饰器中的 templateUrl 和 styleUrls 属性替换为 template 和 styles 属性中的内联内容。
启用后，ngc 的 .js 输出不会包含任何延迟加载的模板或样式 URL。
对于使用 CLI 生成的库项目，dev 配置下默认为 true 。

skipMetadataEmit
skipTemplateCodegen
strictMetadataEmit
fullTemplateTypeCheck
strictTemplates
strictInjectionParameters
trace
{{$any(person).addresss.street}}

如果你在某个公司代理之后，此后端就无法直接代理到局域网之外的任何 URL。 这种情况下，你可以把这个后端代理配置为，借助 agent 通过你的公司代理转发此调用：
agent
AOT 编译器不支持 函数表达式 和 箭头函数，但是在版本 5 和更高版本中，编译器会在生成 .js 文件时自动执行此重写
禁止使用 Angular 特性的不带装饰器的基类 