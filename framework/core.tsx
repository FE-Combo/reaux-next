import { Helper } from "./helper";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import React, { ComponentType, ComponentClass } from "react";
import { createAction } from "./createAction";
import { middleware } from "./middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import { StateView, BaseModel, AppCache } from "./type";
import { createStore, applyMiddleware, ReducersMapObject, AnyAction } from "redux";
import {createView} from "./createView";
import {
  createActionType,
  createReducer,
  setModuleAction,
  createModuleReducer
} from "./createReducer";
import {isServer} from "./util"
import chalk from "chalk";
import {AppContext} from "next/dist/pages/_app";

const isProd = process.env.NODE_ENV === "production";

// TODO: Dynamic and static separation
function createAppCache(): AppCache {
  const cache = {
    actionHandlers: {},
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
          middleware(() => cache.actionHandlers)
        )
      )
    )
  };
  return cache;
}

let cache = isServer ? null : createAppCache();

const helper = new Helper(cache);

function start<H extends BaseModel>(
  handler: H,
  Component: ComponentType<any> & {getInitialProps?: (context: AppContext) => any},
  BaseApp: ComponentClass,
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
  
  if(!isServer) {
    modelInject(handler, actionHandlers);
  }
  const View = createView(handler, Component);
  View.getInitialProps = async (context: AppContext)=> {
    if(isServer) {
      if(!isProd) {
        console.info(`${chalk.green("ready")} - ${handler.moduleName} getInitialProps successfully`)
      }
      modelInject(handler, actionHandlers);
    }

    const onReady = handler.onReady as any;
    if((!!onReady.inServer && !!onReady.inClient) || (!onReady.inServer && !onReady.inClient)) {
       // execute in server and client
       return (await handler.onReady(context)) || {};
    } else {
      if(!!onReady.inServer && isServer) {
        // execute only in server
        return (await handler.onReady(context)) || {};
      } else if (!!onReady.inClient && !isServer) {
        // execute only in client
        return (await handler.onReady(context)) || {};
      } else {
        return {};
      }
    }   
  }

  return { View, actions };
}

// client inject is executed at the beginning, server register in getInitialProps. because getInitialProps cannot continue to be executed on the client after the server is executed
function modelInject<H extends BaseModel>(handler: H, actionHandlers: AppCache["actionHandlers"]){
  // register reducer
  const currentModuleReducer = createModuleReducer(handler.moduleName);
  // TODO: using cache.injectReducer
  cache.asyncReducers[handler.moduleName] = currentModuleReducer;
  cache.store.replaceReducer(createReducer(cache.asyncReducers));

  // register actions
  cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };

  // create custom state in model
  handler.resetState();
}

function createApp(
  View: ComponentType<any> & {getInitialProps?: (context: AppContext) => any},
  BaseApp: ComponentClass
) {
  return class App extends BaseApp {
    static async getInitialProps(context: AppContext) {
      // Executed on the server side when the page is refreshed, and executed on the client side when the client page jumps.
      if(isServer) {
        if(!isProd) {
          console.info(`${chalk.green("ready")} - NextApp getInitialProps successfully`)
        }
        // It will only be executed on the server side, not on the client side
        cache = createAppCache()
      }

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
      if(!isServer) {
        // Only executed when the page is refreshed.
        // dispatching state from server; client & server ensure synchronization.
        // When the client initializes redux, avoid getting the store generated by the server from the window object 
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

class Model<S = {}, R = StateView> extends BaseModel<S, R> {
  public constructor(readonly moduleName: string, readonly initState: S) {
    super();
  }
  get state(): Readonly<S> {
    return cache.store.getState()[this.moduleName] as S;
  }
  get rootState(): Readonly<R> {
    return cache.store.getState();
  }
  setState(newState: Partial<S>) {
    cache.store.dispatch(setModuleAction(this.moduleName, newState));
  }
  resetState() {
    cache.store.dispatch(setModuleAction(this.moduleName, this.initState));
  }
  dispatch(action: AnyAction) {
    cache.store.dispatch(action);
  }
}

export { start, register, Model, helper };
