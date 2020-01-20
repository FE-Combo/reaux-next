import { Helper } from "./helper";
import { Provider } from "react-redux";
import { createView } from "./createView";
import { createLogger } from "redux-logger";
import React, { ComponentType } from "react";
import { createAction } from "./createAction";
import { asyncMiddleware } from "./middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import { StateView, BaseModel, AppCache, StartOptions } from "./type";
import { createStore, applyMiddleware, ReducersMapObject } from "redux";
import {
  createActionType,
  createReducer,
  setModuleAction,
  createModuleReducer
} from "./createReducer";

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

const cache = createAppCache();
const helper = new Helper(cache);

function start<T>(
  options: StartOptions<T>
): ComponentType<any> & {
  getInitialProps: (context: any) => any;
} {
  const { App: Component, BaseApp } = options;
  return class App extends BaseApp {
    static async getInitialProps(context: any) {
      cache.context = context;
      const appProps =
        typeof Component.getInitialProps === "function"
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
          type: createActionType(namespace),
          payload: props.initialReduxState[namespace]
        });
      });
    }
    render() {
      return (
        <Provider store={cache.store}>
          <Component {...this.props}></Component>
        </Provider>
      );
    }
  };
}

function register<H extends BaseModel>(
  handler: H,
  Component: ComponentType<any>
) {
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
  const { actions, actionHandlers } = createAction(handler);
  cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };

  // register view
  const View = createView(handler, Component);

  return { View, actions };
}

class Model<S = {}> extends BaseModel<S> {
  public constructor(readonly moduleName: string, readonly initState: S) {
    super();
    if (!cache.store) {
      throw new Error("store unknown!!");
    }
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

export { start, register, Model, helper };
