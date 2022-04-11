[![npm version](https://img.shields.io/npm/v/reaux-next.svg?style=flat)](https://www.npmjs.com/package/reaux-next)

## 动机

复用[REAUX](https://github.com/vocoWone/reaux)特性，依赖于[NEXT](https://nextjs.org/)

## 特性

- 1 个项目切分成 n 个 module
- 1 个 module 包含 1 个 component，1 个 model
- 1 个 model 包含 1 个 state，1 个 namespace，3 个生命周期 action，n 个 自定义 action
- 每个 action 都是 async/await 函数
- 内建 helper：loading、error、delay, lang
- 面向对象式编程
- 项目结构分工明确

## API

- start

```
import { start } from "reaux-next";
import { View } from "../modules/xxx";
import BaseApp from "next/app";

export default start(View, BaseApp);
```

- register

```

import Main from "./component/xxx";
import { register, Model, helper } from "reaux-next";
import { State } from "./xxx.type";

const namespace = "home";

const initialState: State = {
    name: "home"
};

class ActionHandler extends Model<State> {
    async text() {
        this.setState({ name: "click button name" });
    }
}

export const { actions, View } = register(new ActionHandler(namespace, initialState),Main);

```

## 项目结构

- modules：模块（主要业务代码，理解为每个页面就是个模块，模块之前没有强依赖，低耦合高内聚）
- pages：路由（专注于路由分配不参与业务处理）
- components：共用组件（分为不依赖于业务 store 与依赖于业务 store）
- services：API
- utils：工具库

## Attentions
- tsconfig.json target must be `"target": "esnext"`. otherwise, `start` is not executed in client

## DEMO

- yarn dev
