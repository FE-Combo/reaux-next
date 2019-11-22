[![npm version](https://img.shields.io/npm/v/reaux-next.svg?style=flat)](https://www.npmjs.com/package/reaux-next)  

## 动机

复用[REAUX](https://github.com/vocoWone/reaux)特性，依赖于[NEXT](https://nextjs.org/)

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
