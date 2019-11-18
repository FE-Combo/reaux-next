import React, { PureComponent } from "react";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createView } from "./createView";
import { createAction } from "./createAction";
import { createReducer, setStateAction, setHelperAction } from "./createReducer";
import { asyncMiddleware } from "./middleware";
import { BaseModel } from "./type";
import { Helper } from "./helper";
function createApp() {
    const cache = {
        actionHandlers: {},
        modules: {},
        store: createStore(createReducer(), composeWithDevTools({})(applyMiddleware(createLogger({ collapsed: true }), asyncMiddleware)))
    };
    const helper = new Helper(cache, (type, payload) => {
        setHelperAction(type, payload);
    });
    asyncMiddleware.run(cache, (exception) => {
        helper.exception = exception;
    });
    return { cache, helper };
}
const { cache, helper } = createApp();
function start(Component) {
    return class App extends PureComponent {
        static async getInitialProps(context) {
            return {
                appProps: typeof Component.getInitialProps === "function"
                    ? await Component.getInitialProps(context)
                    : {}
            };
        }
        render() {
            return (React.createElement(Provider, { store: cache.store },
                React.createElement(Component, Object.assign({}, this.props))));
        }
    };
}
function register(handler, Component) {
    if (cache.modules.hasOwnProperty(handler.moduleName)) {
        throw new Error(`module is already registered, module=${handler.moduleName}`);
    }
    cache.modules[handler.moduleName] = true;
    const { actions, actionHandlers } = createAction(handler);
    cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };
    const View = createView(handler, Component);
    return { View, actions };
}
class Model extends BaseModel {
    constructor(moduleName, initState) {
        super();
        this.moduleName = moduleName;
        this.initState = initState;
        if (!cache.store) {
            throw new Error("store unknown!!");
        }
        cache.store.dispatch(setStateAction(moduleName, initState, `@@${moduleName}/initState`));
    }
    get state() {
        return cache.store.getState().app[this.moduleName];
    }
    get rootState() {
        return cache.store.getState();
    }
    setState(newState) {
        cache.store.dispatch(setStateAction(this.moduleName, newState, `@@${this.moduleName}/setState[${Object.keys(newState).join(",")}]`));
    }
}
export { start, register, Model, helper };
//# sourceMappingURL=core.js.map