"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const redux_logger_1 = require("redux-logger");
const redux_1 = require("redux");
const redux_devtools_extension_1 = require("redux-devtools-extension");
const createView_1 = require("./createView");
const createAction_1 = require("./createAction");
const createReducer_1 = require("./createReducer");
const middleware_1 = require("./middleware");
const util_1 = require("./util");
const type_1 = require("./type");
const helper_1 = require("./helper");
function createApp() {
    const cache = {
        actionHandlers: {},
        modules: {},
        store: redux_1.createStore(createReducer_1.createReducer(), redux_devtools_extension_1.composeWithDevTools({})(redux_1.applyMiddleware(redux_logger_1.createLogger({
            collapsed: true,
            predicate: (state, action) => action.type !== util_1.INIT_CLIENT_APP &&
                action.type !== util_1.INIT_CLIENT_HELPER
        }), middleware_1.asyncMiddleware)))
    };
    const helper = new helper_1.Helper(cache, (type, payload) => createReducer_1.setHelperAction(type, payload));
    middleware_1.asyncMiddleware.run(cache, (exception) => {
        helper.exception = exception;
    });
    return { cache, helper };
}
const { cache, helper } = createApp();
exports.helper = helper;
function start(Component, BaseApp) {
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
            cache.store.dispatch({
                type: util_1.INIT_CLIENT_APP,
                payload: props.initialReduxState.app
            });
            cache.store.dispatch({
                type: util_1.INIT_CLIENT_HELPER,
                payload: props.initialReduxState.helper
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
    const { actions, actionHandlers } = createAction_1.createAction(handler);
    cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };
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
        return cache.store.getState().app[this.moduleName];
    }
    get rootState() {
        return cache.store.getState();
    }
    setState(newState) {
        cache.store.dispatch(createReducer_1.setStateAction(this.moduleName, newState, util_1.SET_STATE_ACTION));
    }
    resetState() {
        cache.store.dispatch(createReducer_1.setStateAction(this.moduleName, this.initState, util_1.SET_STATE_ACTION));
    }
}
exports.Model = Model;
//# sourceMappingURL=core.js.map