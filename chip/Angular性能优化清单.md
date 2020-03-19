### 构建优化
修改angular.json配置
![](../assets/img/chip/angular-perf-1.png)

### 摇树优化服务
服务定义时设置 **providedIn** : 'root'，这样服务不需要通过provider注入到单个模块中，Angular自动将其注入全局环境，方便摇树优化

### 懒加载特性模块
路由配置： loadChildren: () => import('./demo/demo.module').then(mod => mod.DemoModule)

### 开启prod运行模式
保证生产环境执行 **enableProdMode()**，避免多余变更检测

### 变更检测
- 在性能要求比较高的组件中使用 **ChangeDetectionStrategy.OnPush** 配合 [不可变数据类型](https://immutable-js.github.io/immutable-js/) 
- 通过 **ChangeDetectorRef** 手动管理变更检测 
- 在明确代码执行之后不需要进行变更检测，可以将代码放入 **ngZone.runOutsideAngular**

### 使用纯管道
在明确管道输出的结果之和输入参数有关时可以设置管道 **pure**: true

### 长列表优化
- *ngFor指令配合 **trackBy** 选项
- 虚拟滚动 [CDK](https://material.angular.io/cdk/scrolling/overview) 或 [ngx-virtual-scroller](https://github.com/rintoj/ngx-virtual-scroller)
- 尽可能使用 **ng-container**


### 优化模板表达式
避免表达式中存在过多的计算逻辑，将函数调用改为管道实现更好

### 引入服务器端渲染
关注首屏渲染时效性和SEO优化的场景需要引入服务器渲染

### 使用 Service Workers
客户端本地缓存，避免请求静态资源

### 修改代码构建目标
- 部分场景将代码构建目标改为es6性能会有所提供 ， 可以修改tsconfig.json中的 **target** : "es6"
- 当客户浏览器完全支持es6语法的情况下可以 设置 angular.json  中 **es5BrowserSupport** : false

