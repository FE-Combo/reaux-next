import { Helper } from "./helper";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import React, { ComponentType, ComponentClass } from "react";
import { createAction } from "./createAction";
import { asyncMiddleware } from "./middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import { StateView, BaseModel, AppCache } from "./type";
import { createStore, applyMiddleware, ReducersMapObject } from "redux";
import {createView} from "./createView";
import {
  createActionType,
  createReducer,
  setModuleAction,
  createModuleReducer
} from "./createReducer";
import {isServer} from "./util"
import chalk from "chalk";

const inServer = isServer();

// TODO: 
function createAppCache(): AppCache {
  const cache = {
    actionHandlers: {},
    modules: {},
    asyncReducers: {} as ReducersMapObject<StateView, any>,
    injectReducer: (namespace, asyncReducer) => {
      cache.asyncReducers[namespace] = asyncReducer;
      cache.store.replaceReducer(createReducer(cache.asyncReducers));
    },
    store: createStore(
      createReducer(),
      composeWithDevTools({
        predicate: (state, action) =>
          !/^@@framework\/actionsHandler/.test(action.type)
      })(
        applyMiddleware(
          createLogger({
            collapsed: true,
            predicate: () => false
          }),
          asyncMiddleware
        )
      )
    )
  };
  asyncMiddleware.run(cache);
  return cache;
}

let cache = inServer ? null : createAppCache();
let useHelper = () => new Helper(cache);

function start<H extends BaseModel>(
  handler: H,
  Component: ComponentType<any> & {getInitialProps?: (context: any) => any},
  BaseApp: ComponentClass
) {
  const {View, actions} = register(handler, Component);
  const App = createApp(View, BaseApp);
  return {View: App, actions}
}

function register<H extends BaseModel>(
  handler: H,
  Component: ComponentType<any>
) {
  // create actions&handlers
  const { actions, actionHandlers } = createAction(handler);
  
  if(!inServer) {
    modelInject(handler, actionHandlers);
  }
  const View = createView(handler, Component)
  View.getInitialProps = async ()=> {
    if(inServer) {
      console.info(`${chalk.green("ready")} - ${handler.moduleName} getInitialProps successfully`)
      modelInject(handler, actionHandlers);
    }
    return (await handler.onReady()) || {};
  }

  return { View, actions };
}

//client inject is executed at the beginning, server register in getInitialProps. because getInitialProps cannot continue to be executed on the client after the server is executed
function modelInject<H extends BaseModel>(handler: H, actionHandlers: AppCache["actionHandlers"]){
  if (cache.modules.hasOwnProperty(handler.moduleName)) {
    throw new Error(
      `module is already registered, module=${handler.moduleName}`
    );
  }
  cache.modules[handler.moduleName] = true;

  // register reducer
  const currentModuleReducer = createModuleReducer(handler.moduleName);
  cache.asyncReducers[handler.moduleName] = currentModuleReducer;
  cache.store.replaceReducer(createReducer(cache.asyncReducers));

  // register actions
  cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };

  // create custom state in model
  handler.resetState();
}

function createApp(
  View: ComponentType<any> & {getInitialProps?: (context: any) => any},
  BaseApp: ComponentClass
) {
  return class App extends BaseApp {
    static async getInitialProps(context: any) {
      console.info(`${chalk.green("ready")} - NextApp getInitialProps successfully`)
      // It will only be executed on the server side, not on the client side
      cache = createAppCache()
      cache.context = context;
      const appProps =
        typeof View.getInitialProps === "function"
          ? await View.getInitialProps(context)
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
      if(!inServer) {
        // dispatching state from server; client & server ensure synchronization
        const namespaces = Object.keys(props.initialReduxState);
        namespaces.forEach(namespace => {
          cache.store.dispatch({
            type: createActionType(namespace),
            payload: props.initialReduxState[namespace]
          });
        });
      }
    }

    render() {
      return (
        <Provider store={cache.store}>
          <View {...this.props}></View>
        </Provider>
      );
    }
  }
}

class Model<S = {}> extends BaseModel<S> {
  public constructor(readonly moduleName: string, readonly initState: S) {
    super();
  }
  get context(): Readonly<any> {
    return cache.context;
  }
  get state(): Readonly<S> {
    return cache.store.getState()[this.moduleName] as S;
  }
  get rootState(): Readonly<StateView> {
    return cache.store.getState();
  }
  setState(newState: Partial<S>) {
    cache.store.dispatch(setModuleAction(this.moduleName, newState));
  }
  resetState() {
    cache.store.dispatch(setModuleAction(this.moduleName, this.initState));
  }
}

export { start, register, Model, useHelper };
