import Router from 'next/router'
import { Helper } from './helper';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import React, { ComponentType, ComponentClass } from 'react';
import {createAction, middleware, createView, createActionType, createReducer, App as AppCache, setModuleAction, createModuleReducer, createApp as createBaseApp, BaseModel} from "reaux";
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  ConnectedRouter,
  createRouterMiddleware,
  go,
  goBack,
  goForward,
  push,
  replace,
  prefetch,
  routerReducer
} from 'connected-next-router';
import { StateView, BaseModel as NextBaseModel, ModuleView} from './type';
import {
  createStore,
  applyMiddleware,
  AnyAction
} from 'redux';
import { isServer } from './util';
import chalk from 'chalk';
import { AppContext } from 'next/dist/pages/_app';
import { NextPageContext } from 'next';
import { UrlObject } from 'url';

type Url = UrlObject | string;

const isProd = process.env.NODE_ENV === 'production';

// ref: https://github.com/danielr18/connected-next-router/issues/78
/* Make `Router.asPath` return with `basePath` prefixed (if absent) */
const patchedRouter = new Proxy(Router, {
  get: (Router, key, receiver) => {
    if (key === 'asPath') {
      const { basePath, asPath } = Router
      const replaced = asPath.includes(basePath) ? asPath : basePath + asPath
      return replaced
    } else {
      return Reflect.get(Router, key, receiver)
    }
  }
})

// TODO: Dynamic and static separation
function createAppCache(): AppCache {
  const applyMiddlewares = [
    createRouterMiddleware({ Router: patchedRouter }),
    createLogger({ collapsed: true, predicate: () => false }),
    middleware(() => cache.actionHandlers),
  ];
  const store = createStore(
    createReducer(),
    composeWithDevTools({
      predicate: (state, action) =>
        !/^@@framework\/actionsHandler/.test(action.type),
    })(applyMiddleware(...applyMiddlewares)),
  );
  const cache = createBaseApp(store)
  cache.asyncReducers["router"] = routerReducer;
  cache.store.replaceReducer(createReducer(cache.asyncReducers));
  return cache;
}

let cache = isServer ? null : createAppCache();

const helper = new Helper(cache);

function start<H extends BaseModel>(
  handler: H,
  Component: ComponentType<any> & {
    getInitialProps?: (context: NextPageContext) => any;
  },
  BaseApp: ComponentClass,
) {
  const { View, actions } = register(handler, Component);
  // Upgrade submodule to top level module
  const App = createApp(View, BaseApp);
  return { View: App, actions };
}

function register<H extends BaseModel>(
  handler: H,
  Component: ComponentType<any>,
) {
  // TODO: 检测 module namespace重复，包括[@error, @loading, router]

  // create actions&handlers
  const { actions, actionHandlers } = createAction(handler);
  if (!isServer) {
    modelInject(handler, actionHandlers);
  }

  const View = createView(handler, Component) as ModuleView;
  View.getInitialProps = async (context: NextPageContext) => {
    if (isServer) {
      if (!isProd) {
        console.info(
          `${chalk.green('ready')} - ${
            handler.moduleName
          } getInitialProps successfully`,
        );
      }
      modelInject(handler, actionHandlers);
    }

    const onReady = handler.onReady.bind(handler) as any as ((context: NextPageContext)=>Promise<any>) & {inClient: boolean; inServer: boolean;};
    if (
      (!!onReady.inServer && !!onReady.inClient) ||
      (!onReady.inServer && !onReady.inClient)
    ) {
      // execute in server and client
      return (await onReady(context)) || {};
    } else {
      if (!!onReady.inServer && isServer) {
        // execute only in server
        return (await onReady(context)) || {};
      } else if (!!onReady.inClient && !isServer) {
        // execute only in client
        return (await onReady(context)) || {};
      }
      return {};
    }
  };

  return { 
    View, 
    actions,
    proxyLifeCycle: (View: ComponentType<any>) => {
      // register next view
      const NextView = createView(handler, View) as ModuleView;
      NextView.getInitialProps = async (context: NextPageContext) => {
        if (isServer) {
          if (!isProd) {
            console.info(
              `${chalk.green('ready')} - ${
                handler.moduleName
              } getInitialProps successfully`,
            );
          }
          modelInject(handler, actionHandlers);
        }
    
        const onReady = handler.onReady.bind(handler) as any as ((context: NextPageContext)=>Promise<any>) & {inClient: boolean; inServer: boolean;};
        if (
          (!!onReady.inServer && !!onReady.inClient) ||
          (!onReady.inServer && !onReady.inClient)
        ) {
          // execute in server and client
          return (await onReady(context)) || {};
        } else {
          if (!!onReady.inServer && isServer) {
            // execute only in server
            return (await onReady(context)) || {};
          } else if (!!onReady.inClient && !isServer) {
            // execute only in client
            return (await onReady(context)) || {};
          }
          return {};
        }
      };
      return NextView;
    },
  }
}

// client inject is executed at the beginning, server register in getInitialProps. because getInitialProps cannot continue to be executed on the client after the server is executed
function modelInject<H extends BaseModel>(
  handler: H,
  actionHandlers: AppCache['actionHandlers'],
) {
  // register reducer
  const currentModuleReducer = createModuleReducer(
    handler.moduleName,
    handler.initState,
  );
  // TODO: using cache.injectReducer
  cache.asyncReducers[handler.moduleName] = currentModuleReducer;
  cache.store.replaceReducer(createReducer(cache.asyncReducers));

  // register actions
  cache.actionHandlers = { ...cache.actionHandlers, ...actionHandlers };
}

// Reister top level module
function createApp(
  View: ComponentType & { getInitialProps?: (context: NextPageContext) => any },
  BaseApp: ComponentClass,
) {
  return class App extends BaseApp {
    static async getInitialProps(context: AppContext) {
      // Executed on the server side when the page is refreshed, and executed on the client side when the client page jumps.
      if (isServer) {
        if (!isProd) {
          console.info(
            `${chalk.green('ready')} - NextApp getInitialProps successfully`,
          );
        }
        // It will only be executed on the server side, not on the client side
        cache = createAppCache();
      }

      const appProps =
        typeof View.getInitialProps === 'function'
          ? await View.getInitialProps(context.ctx)
          : {};
      const superProps = await super['getInitialProps'](context);
      return {
        initialReduxState: cache.store.getState(),
        ...superProps,
        ...appProps,
      };
    }
    constructor(props) {
      super(props);
      if (!isServer) {
        // Only executed when the page is refreshed.
        // dispatching state from server; client & server ensure synchronization.
        // When the client initializes redux, avoid getting the store generated by the server from the window object
        const namespaces = Object.keys(props.initialReduxState);
        namespaces.forEach((namespace) => {
          cache.store.dispatch({
            type: createActionType(namespace),
            payload: props.initialReduxState[namespace],
          });
        });
      }
    }

    render() {
      return (
        <Provider store={cache.store}>
          <ConnectedRouter Router={patchedRouter}>
            <View {...this.props} />
          </ConnectedRouter>
        </Provider>
      );
    }
  };
}

// TODO: move to reaux
class Model<S = {}, R = StateView> extends NextBaseModel<S, R>{
  public constructor(readonly moduleName: string, readonly initState: S) {
    super();
  }

  get state(): Readonly<S> {
      return cache.store.getState()[this.moduleName];
  }

  get initialState(): Readonly<S> {
      return this.initState;
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

  get router() {
    return {
      go: (number: number) => this.dispatch(go(number)),
      goBack: () => this.dispatch(goBack()),
      goForward: () => this.dispatch(goForward()),
      push: (url: Url, as?: Url, options?: any) =>
        this.dispatch(push(url, as, options)),
      replace: (url: Url, as?: Url, options?: any) =>
        this.dispatch(replace(url, as, options)),
      prefetch: (url: string) => this.dispatch(prefetch(url)),
    };
  }
}

export { start, register, Model, helper };
