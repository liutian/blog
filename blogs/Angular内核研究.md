### 前置内容
- [zone.js](https://github.com/angular/angular/blob/master/packages/zone.js/lib/zone.ts) 通过拦截浏览器原生异步API，来监控页面发生的异步事件，并发出通知，`Angular` 在合适的时机执行变更检测
  ```
  // ApplicationRef
  this._zone.onMicrotaskEmpty.subscribe({
    next: () => { 
      this._zone.run(() => { this.tick(); }); 
    }
  });
  ```
- [rxjs](https://rxjs-dev.firebaseapp.com/api) 


### 术语
- `platform` 特定程序解析和执行环境，主要功能是提供一组相关联的静态供应商和对应的注入器
- `applaction` 一个完整angular程序实例，主要功能是推动变更检测
- `module` 一组相关angular组件的集合，主要功能是提供一组相关联的供应商和对应的注入器
- `component` 实现特定UI功能的实力


### 构建模型
- 在Ivy没有完全替代旧版本之前，框架核心库以及周边官方库发布到npm上的代码是非Ivy代码
- 当首次执行 `npm start` 或者 `npm build` 时编译器会对 `node_modules` 下的代码进行 `Ivy` 编译并保存在对应目录下
- 当再次执行 `npm start` 或者 `npm build` 时编译器只会编译当前项目代码，不在对 `node_modules` 进行额外编译处理，提供编译效率


### 注入器结构
平台注入器 -> 根级ngZone注入器 -> 主模块注入器 -> 组件注入器


### 资料
- [视图数据结构](https://github.com/angular/angular/tree/master/packages/core/src/render3/VIEW_DATA.md)
- [优化思路](https://github.com/angular/angular/tree/master/packages/core/src/render3/PERF_NOTES.md)
- [编译器架构](https://github.com/angular/angular/tree/master/packages/compiler/design/architecture.md)
- [ivy工作原理](../assets/doc/Angular-Ivy.pptx)


### 启动流程
- 创建平台实例
  - 搜集静态提供商  
    - `{ provide: PLATFORM_ID, useValue: 'unknown' }` -> `core`
    - `{ provide: PlatformRef, deps: [Injector] }` -> `core`
    - `{ provide: TestabilityRegistry, deps: [] }` -> `core`
    - `{ provide: Console, deps: [] }` -> `core`
    - `{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }` -> `browser`
    - `{ provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true }` -> `browser`
    - `{ provide: DOCUMENT, useFactory: _document, deps: [] }` -> `browser`
    - `{ provier: InjectionToken('Platform: browser'), useValue: true}` -> `browser`
    - `{ provier: InjectionToken('Platform: core'), useValue: true}` -> `core`
    - `{ provide: INJECTOR_SCOPE, useValue: 'platform'}` -> `core`
  - 将搜集来的提供商进行归总，并创建平台级注入器 -> [R3Injector](https://github.com/angular/angular/tree/master/packages/core/src/di/r3_injector.ts)
  - 暴露底层API `window.ng` 便于调试
  - 创建平台实例 -> `injector.get(PlatformRef)`
  - 执行平台初始化程序 -> `PLATFORM_INITIALIZER`
- 创建模块工厂 -> [R3NgModuleFactory](https://github.com/angular/angular/tree/master/packages/core/src/render3/ng_module_ref.ts)
- 使用模块工厂引导启动主模块
  - 初始化根级 `ngZone` 实例 -> [NgZone](https://github.com/angular/angular/tree/master/packages/core/src/zone/ng_zone.ts)
  - 使用根级 `zone` 包裹接下来的所有代码 -> `ngZone.run(...)`
  - 创建根级 `zone` 注入器，父级注入器为平台注入器，注入特定提供商 `{provide: NgZone, useValue: ngZone}`
  - 使用模块工厂创建模块实例 -> [NgModuleRef](https://github.com/angular/angular/tree/master/packages/core/src/render3/ng_module_ref.ts)
    - 创建模块注入器（模块实例即为注入器，`NgModuleRef.injector = this`），父级注入器为根级 `zone` 注入器，注入特定提供商:  
    `{ provide: NgModuleRef, useValue: this}`  
    `{ provider: ComponentFactoryResolver, useClass: ComponentFactoryResolver, deps: [NgModuleRef]}`  
      - 解析模块导入的其他模块，并注入模块所属所有提供商  
      `{ provide: NgLocalization, useClass: NgLocaleLocalization}`  -> `CommonModule providers`  
      属于 `ApplicationModule` 的提供商
      ```javascript
        {
          provide: ApplicationRef,
          useClass: ApplicationRef,
          deps:
              [NgZone, Console, Injector, ErrorHandler, ComponentFactoryResolver, ApplicationInitStatus]
        },
        {provide: SCHEDULER, deps: [NgZone], useFactory: zoneSchedulerFactory},
        {
          provide: ApplicationInitStatus,
          useClass: ApplicationInitStatus,
          deps: [[new Optional(), APP_INITIALIZER]]
        },
        {provide: Compiler, useClass: Compiler, deps: []},
        {provide: APP_ID, useFactory: _appIdRandomProviderFactory, deps: <any[]>[]},
        {provide: IterableDiffers, useFactory: _iterableDiffersFactory, deps: []},
        {provide: KeyValueDiffers, useFactory: _keyValueDiffersFactory, deps: []},
        {
          provide: LOCALE_ID,
          useFactory: _localeFactory,
          deps: [[new Inject(LOCALE_ID), new Optional(), new SkipSelf()]]
        },
        {provide: DEFAULT_CURRENCY_CODE, useValue: USD_CURRENCY_CODE},
      ```  
      属于 `BrowserModule` 的提供商
      ```javascript  
        {provide: INJECTOR_SCOPE, useValue: 'root'},
        {provide: ErrorHandler, useFactory: errorHandler, deps: []},
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: DomEventsPlugin,
          multi: true,
          deps: [DOCUMENT, NgZone, PLATFORM_ID]
        },
        {provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true, deps: [DOCUMENT]},
        {
          provide: DomRendererFactory2,
          useClass: DomRendererFactory2,
          deps: [EventManager, DomSharedStylesHost, APP_ID]
        },
        {provide: RendererFactory2, useExisting: DomRendererFactory2},
        {provide: SharedStylesHost, useExisting: DomSharedStylesHost},
        {provide: DomSharedStylesHost, useClass: DomSharedStylesHost, deps: [DOCUMENT]},
        {provide: Testability, useClass: Testability, deps: [NgZone]},
        {provide: EventManager, useClass: EventManager, deps: [EVENT_MANAGER_PLUGINS, NgZone]},
      ```   
    - 创建导入模块类的实例，同时 `ApplicatonRef` 和 主模块类实例会一并创建
  - 执行应用初始化程序 -> `ApplicationInitStatus`
  - 引导根组件进行初始化和首次变更检测 -> `moduleRef._bootstrapComponents.forEach(f => appRef.bootstrap(f))`
    - 创建根组件工厂 [ComponentFactory](https://github.com/angular/angular/tree/master/packages/core/src/render3/component_ref.ts)
    - 创建根组件实例 `ComponentFactory.create`
      - 创建根组件特有注入器
      - 创建根组件渲染器
      - 获取根组件对应DOM对象
      - 创建根组件上下文对象
      - 创建顶层 `TView` `LView`
      - 创建根组件 `TView` `LView`
      - 创建根组件类实例
    - 进行首次变更检测 `tick()`