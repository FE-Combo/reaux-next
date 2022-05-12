[![npm version](https://img.shields.io/npm/v/reaux-next.svg?style=flat)](https://www.npmjs.com/package/reaux-next)

<img width="100" src="./logo.png"/> <img width="150" src="https://www.nextjs.cn/static/images/nextjs-logo.png"/>

## 动机
基于[next](https://nextjs.org/)+[reaux](https://github.com/vocoWone/reaux)数据流方案，统一数据流与应用结构，简化开发体验

## 特性
- 应用以模块(module)方式解耦，模块自身遵循单一职责
- 整个应用包含1个顶层模块和n个子模块，模块按需加载，支持ssr
- 每个模块包含 1 个 component，1 个 model（1 个 state，1 个 namespace，6个生命周期，n 个 自定义 action）
- 同步与异步的场景统一通过同步的方式处理（async/await）
- 内部提供帮助函数helper
- 统一遵循redux数据流
- 面向对象编程

## API
- start：注册顶层模块并启动应用（特殊子模块，通常应用于`_app.tsx`）

- register：注册子模块

- isServer: 判断是否是服务端

- helper：帮助函数
    - delay: 睡眠
    - inServer: 装饰器，应用于`onReady`,指定该生命周期执行于服务端
    - inServer: 装饰器，应用于`onReady`,指定该生命周期执行于客户端
    - loading: 装饰器，统一管理loading状态，执行于客户端
    - isLoading: 判断是否处于loading状态，执行于客户端

- Model：生成model的父类
    - onReady: 相当于getInitialProps
        - 添加装饰器`@helper.onServer()/@helper。onClient()`指定执行端（服务端/客户端）。如果该函数存在返回值建议不要指定执行端（建议顶层模块只在服务端执行）。
        - 不要在该生命周期中使用`window.location`对象，无论是服务端还是客户端，location相关的值可以直接从onReady参数中获取；
    - onLoad: 相当于componentDidMount
    - onUpdate: 相当于componentDidUpdate
    - onUnLoad: 相当于componentWillUnmount
    - onShow: 当前模块在viewport中触发
    - onHide: 当前模块不在viewport中触发
    - state: 当前模块state
    - rootState: 全局state
    - resetState: 重置state
    - setState: 更新state

## 应用结构
- modules：模块（应用业务代码，遵循低耦合高内聚）
- pages：路由（专注于路由分配不参与业务处理）
- components：公共组件
- services：API
- utils：工具库

## 状态树结构
- `@error`: action运行时异常收集，组件以及生命周期异常在nextjs框架中已统一处理。
- `@loading`: 应用loading统一管理，配合`@helper.loading(namespace)`使用。
- `[...modules]`: 模块state，命名有model的namespace决定。

## Attentions
- 模块之间可以是完全独立，也可以是嵌套关系，还可以是数据耦合关系；
    - 模块本身需要遵循单一原则，一个模块一个功能；
    - 模块之前使用组件进行层级嵌套；
    - 模块之间数据依赖时需要遵循redux数据流，修改非自身模块的状态尽量通过该模块开放的action；

- tsconfig.json target must be `"esnext"` & lib must within `"esnext"`, otherwise cause by: 
    - `@loading`can't be monitor in useSelector
    - function `start` is not executed in client

- 框架集成dot-i18n时，在action中使用`helper.loading`且显式配置`i18n("xx")`会导致应用奔溃报错 `SyntaxError: This experimental syntax requires enabling one of the following parser plugin(s): "decorators-legacy", "decorators".`，暂时未知原因。
    - 不要同时使用二者
    - i18n("xx")单独包装一层，与actions在不同文件中
    - 修改后还是报错，尝试重新`yarn build`

## Q&A
- Q: 每个action都需要dispatch写法是否比较繁琐？
	其一action在redux中的定义本身就是一个对象，从官方定义可以看出每个action必须要dispatch才能生效；
	其二视图层我们不希望出现异步处理的情况，所有异步方式使用redux数据流方式。

- Q: 视图层为什么不希望出现请求api的情况？
    我们的目的就是要将数据处理逻辑与UI解耦通过redux统一数据流方式处理。各执其职，UI负责渲染model负责业务逻辑。

- Q: 所有api数据存在redux中是否有性能影响?
    这里的性能问题主要分为三种：
	1. api数据量太大：需要通过接口优化，加分页或者删除不必要的字段；
	2. redux更新导致不必要react diff：redux本身的机制决定，有一定影响但diff的过程很快；可以使用shallowEqual优化
	3. 缓存过多的module导致数据量太大（一般不会出现）：onUnload的时候手动去触发reset state

- Q: 如何接入sentry？
    直接使用官方指定的sentry/nextjs即可（ref：https://docs.sentry.io/platforms/javascript/guides/nextjs/#configure），但不支持custom server。

- Q: 不同模块之前是否可以互相修改state？
    可以，被修改模块需要暴露自定义action触发状态更新

- Q: 为什么onReady（getInitialProps）中在客户端执行时不能使用window.location对象？
    onReady在客户端触发就必须从第一个页面导航到第二个页面。此时第二个页面的location值是与第一个页面的一样，若需要使用location相关的值可以直接使用onReady参数。

- Q: module与page有什么区别？
    page是路由页面，moudle是模块。一个页面必须是一个模块，但是一个模块不一定是一个页面。
