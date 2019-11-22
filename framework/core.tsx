import React, { ComponentClass, ComponentType } from "react";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createView } from "./createView";
import { createAction } from "./createAction";
import {
  createReducer,
  setStateAction,
  setHelperAction
} from "./createReducer";
import { asyncMiddleware } from "./middleware";
import { SET_STATE_ACTION, INIT_CLIENT_APP, INIT_CLIENT_HELPER } from "./util";
import { StateView, BaseModel, AppCache, Exception } from "./type";
import { Helper } from "./helper";

function createApp(): { cache: AppCache; helper: Helper } {
  const cache = {
    actionHandlers: {},
    modules: {},
    store: createStore(
      createReducer(),
      composeWithDevTools({})(
        applyMiddleware(
          createLogger({
            collapsed: true,
            predicate: (state, action) =>
              action.type !== INIT_CLIENT_APP &&
              action.type !== INIT_CLIENT_HELPER
          }),
          asyncMiddleware
        )
      )
    )
  };
  const helper = new Helper(cache, (type, payload) =>
    setHelperAction(type, payload)
  );
  asyncMiddleware.run(cache, (exception: Exception) => {
    helper.exception = exception;
  });
  return { cache, helper };
}

const { cache, helper } = createApp();

function start(
  Component: ComponentType<any> & {
    getInitialProps: (context: any) => any;
  },
  BaseApp: ComponentClass<any>
): ComponentType<any> & {
  getInitialProps: (context: any) => any;
} {
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
      cache.store.dispatch({
        type: INIT_CLIENT_APP,
        payload: props.initialReduxState.app
      });
      cache.store.dispatch({
        type: INIT_CLIENT_HELPER,
        payload: props.initialReduxState.helper
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
  const { actions, actionHandlers } = createAction(handler);
  cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };
  const View = createView(handler, Component);
  return { View, actions };
}

class Model<S> extends BaseModel<S> {
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
    return cache.store.getState().app[this.moduleName];
  }
  get rootState(): Readonly<StateView> {
    return cache.store.getState();
  }
  setState(newState: Partial<S>) {
    cache.store.dispatch(
      setStateAction(this.moduleName, newState, SET_STATE_ACTION)
    );
  }
  resetState() {
    cache.store.dispatch(
      setStateAction(this.moduleName, this.initState, SET_STATE_ACTION)
    );
  }
}

export { start, register, Model, helper };
