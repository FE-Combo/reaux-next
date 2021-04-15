"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const react_redux_1 = require("react-redux");
const createView_1 = require("./createView");
const redux_logger_1 = require("redux-logger");
const react_1 = __importDefault(require("react"));
const createAction_1 = require("./createAction");
const middleware_1 = require("./middleware");
const redux_devtools_extension_1 = require("redux-devtools-extension");
const type_1 = require("./type");
const redux_1 = require("redux");
const createReducer_1 = require("./createReducer");
function createAppCache() {
    const cache = {
        actionHandlers: {},
        modules: {},
        asyncReducers: {},
        injectReducer: (namespace, asyncReducer) => {
            cache.asyncReducers[namespace] = asyncReducer;
            cache.store.replaceReducer(createReducer_1.createReducer(cache.asyncReducers));
        },
        store: redux_1.createStore(createReducer_1.createReducer(), redux_devtools_extension_1.composeWithDevTools({
            predicate: (state, action) => !/^@@framework\/actionsHandler/.test(action.type)
        })(redux_1.applyMiddleware(redux_logger_1.createLogger({
            collapsed: true,
            predicate: () => false
        }), middleware_1.asyncMiddleware)))
    };
    middleware_1.asyncMiddleware.run(cache);
    return cache;
}
const cache = createAppCache();
const helper = new helper_1.Helper(cache);
exports.helper = helper;
function start(options) {
    const { App: Component, BaseApp } = options;
    return class App extends BaseApp {
        static async getInitialProps(context) {
            cache.context = context;
            const appProps = typeof Component.getInitialProps === "function"
                ? await Component.getInitialProps(context)
                : {};
            const superProps = await super["getInitialProps"](context);
            return {
                initialReduxState: cache.store.getState(),
                ...superProps,
                ...appProps
            };
        }
        constructor(props) {
            super(props);
            const namespaces = Object.keys(props.initialReduxState);
            namespaces.forEach(namespace => {
                cache.store.dispatch({
                    type: createReducer_1.createActionType(namespace),
                    payload: props.initialReduxState[namespace]
                });
            });
        }
        render() {
            return (react_1.default.createElement(react_redux_1.Provider, { store: cache.store },
                react_1.default.createElement(Component, Object.assign({}, this.props))));
        }
    };
}
exports.start = start;
function register(handler, Component) {
    if (cache.modules.hasOwnProperty(handler.moduleName)) {
        throw new Error(`module is already registered, module=${handler.moduleName}`);
    }
    cache.modules[handler.moduleName] = true;
    // register reducer
    const currentModuleReducer = createReducer_1.createModuleReducer(handler.moduleName);
    cache.asyncReducers[handler.moduleName] = currentModuleReducer;
    cache.store.replaceReducer(createReducer_1.createReducer(cache.asyncReducers));
    // register actions
    const { actions, actionHandlers } = createAction_1.createAction(handler);
    cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };
    // register view
    const View = createView_1.createView(handler, Component);
    return { View, actions };
}
exports.register = register;
class Model extends type_1.BaseModel {
    constructor(moduleName, initState) {
        super();
        this.moduleName = moduleName;
        this.initState = initState;
        if (!cache.store) {
            throw new Error("store unknown!!");
        }
    }
    get context() {
        return cache.context;
    }
    get state() {
        return cache.store.getState()[this.moduleName];
    }
    get rootState() {
        return cache.store.getState();
    }
    setState(newState) {
        cache.store.dispatch(createReducer_1.setModuleAction(this.moduleName, newState));
    }
    resetState() {
        cache.store.dispatch(createReducer_1.setModuleAction(this.moduleName, this.initState));
    }
}
exports.Model = Model;
//# sourceMappingURL=core.js.map