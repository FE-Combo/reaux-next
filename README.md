[![npm version](https://img.shields.io/npm/v/reaux-next.svg?style=flat)](https://www.npmjs.com/package/reaux-next)

<img width="100" src="./logo.png"/> <img width="150" src="https://www.nextjs.cn/static/images/nextjs-logo.png"/>

## 动机

复用[REAUX](https://github.com/vocoWone/reaux)特性，依赖于[NEXT](https://nextjs.org/)

## 特性

- 1 个项目切分成 n 个 module
- 1 个 module 包含 1 个 component，1 个 model
- 1 个 model 包含 1 个 state，1 个 namespace，3 个生命周期 action，n 个 自定义 action
- 同步与异步都是通过同步的方式处理（async/await）
- 内建 helper
- 面向对象式编程
- 项目结构清晰分工明确

## API

- start：注册顶层模块并启动应用（特殊register，通常应用于`_app.tsx`对应的模块）

- register：注册模块

- isServer: 判断是否是服务端

- helper：内建工具
    - delay: 睡眠
    - put: 相当于dispatch，执行于客户端
    - loading: 装饰器，统一管理loading状态，执行于客户端
    - isLoading: 判断是否处于loading状态，执行于客户端

- Model：生成model的父类
    - onReady: 相当于getInitialProps
    - onLoad: 相当于componentDidMount
    - onUnLoad: 相当于componentWillUnmount
    - onShow: 当前模块在viewport中触发（客户端执行）
    - onHide: 当前模块不在viewport中触发（客户端执行）
    - state: 当前模块state
    - rootState: 全局state
    - resetState: 重置state
    - setState: 更新state

## 项目结构

- modules：模块（主要业务代码，理解为每个页面就是个模块，模块之前没有强依赖，低耦合高内聚）
- pages：路由（专注于路由分配不参与业务处理）
- components：共用组件（分为不依赖于业务 store 与依赖于业务 store）
- services：API
- utils：工具库

## Attentions
- tsconfig.json target must be `"esnext"` & lib must within `"next"`, otherwise cause by: 
    - `@loading`can't be monitor in useSelector
    - function `start` is not executed in client

- 框架集成dot-i18n时，在action中使用`helper.loading`且显示配置`i18n("xx")`会导致应用奔溃报错 `SyntaxError: This experimental syntax requires enabling one of the following parser plugin(s): "decorators-legacy", "decorators".`，暂时未知原因。
    - 不要同时使用二者
    - i18n("xx")单独包装一层，与actions在不同文件中
    - 修改后如果还是报错，尝试重新`yarn build`

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
    直接使用官方指定的sentry/nextjs即可（ref：https://docs.sentry.io/platforms/javascript/guides/nextjs/#configure），但不支持使用custom server

- Q: 不同模块之前是否可以互相修改state
    如果模块中暴露了对应的action则可以，否则不可以