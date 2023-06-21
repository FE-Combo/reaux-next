import Router from 'next/router';
import { Helper } from './helper';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import React, { ComponentType, ComponentClass } from 'react';
import {
  createAction,
  middleware,
  createView,
  createActionType,
  createReducer,
  App as AppCache,
  setModuleAction,
  resetModuleAction,
  createModuleReducer,
  createApp as createBaseApp,
  hasOwnLifecycle
} from 'reaux';
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
  routerReducer,
} from 'connected-next-router';
import { StateView, BaseModel as NextBaseModel, ModuleView } from './type';
import { createStore, applyMiddleware, AnyAction } from 'redux';
import { isServer } from './util';
import chalk from 'chalk';
import { AppContext } from 'next/dist/pages/_app';
import { NextPageContext } from 'next';
import { UrlObject } from 'url';
import { InView, ObserverInstanceCallback } from "react-intersection-observer";

type Url = UrlObject | string;

const isProd = process.env.NODE_ENV === 'production';

// ref: https://github.com/danielr18/connected-next-router/issues/78
/* Make `Router.asPath` return with `basePath` prefixed (if absent) */
const patchedRouter = new Proxy(Router, {
  get: (Router, key, receiver) => {
    if (key === 'asPath') {
      const { basePath, asPath } = Router;
      const replaced = asPath.includes(basePath) ? asPath : basePath + asPath;
      return replaced;
    } else {
      return Reflect.get(Router, key, receiver);
    }
  },
});

// TODO: Dynamic and static separation
function createAppCache(): AppCache {
  const applyMiddlewares = [
    createRouterMiddleware({ Router: patchedRouter }),
    createLogger({ collapsed: true, predicate: () => false }),
    middleware(() => newCache.actionHandlers),
  ];
  const store = createStore(
    createReducer(),
    composeWithDevTools({
      predicate: (_state, action) =>
        !/^@@framework\/actionsHandler/.test(action.type),
    })(applyMiddleware(...applyMiddlewares)),
  );
  const newCache = createBaseApp(store);
  newCache.asyncReducers['router'] = routerReducer;
  newCache.store.replaceReducer(createReducer(newCache.asyncReducers));
  return newCache;
}

// 客户端缓存直接存储在全局
// 服务端缓存存储在ctx上，执行顺序：App getInitialProps -> Sub App getInitialProps -> App constructor
const clientCache = isServer ? null : createAppCache();

// helper中redux相关逻辑只在客户端执行
const helper = new Helper(clientCache);

function start<H extends Model>(
  handler: H,
  Component: ModuleView,
  BaseApp: ComponentClass,
) {
  const { View, actions } = register(handler, Component);
  // Upgrade submodule to top level module
  const App = createApp(View, BaseApp);
  return { View: App, actions };
}

function register<H extends Model>(handler: H, Component: ModuleView) {
  if (["@error", "@loading", "router"].includes(handler.moduleName)) {
    throw new Error(`The module is a common module and cannot be overwritten, please rename it, module=${handler.moduleName}`);
  }

  // create actions&handlers
  const { actions, actionHandlers } = createAction(handler);
  if (!isServer) {
    modelInject(handler, actionHandlers, clientCache);
  }

  // register view, attach lifecycle and viewport observer
  let View;
  if (hasOwnLifecycle(handler, "onShow") || hasOwnLifecycle(handler, "onHide")) {
    View = withIntersectionObserver(
      createView(handler, Component),
      async (entry: Parameters<ObserverInstanceCallback>[1]) => await handler.onShow(entry),
      async (entry: Parameters<ObserverInstanceCallback>[1]) => await handler.onHide(entry)
  );
  } else {
    View = createView(handler, Component) as ModuleView;
  }
 
  View.getInitialProps = async (
    context: NextPageContext & { cache: AppCache },
  ) => {
    try {
      if (isServer) {
        if (!isProd) {
          console.info(
            `${chalk.green('ready')} - ${
              handler.moduleName
            } getInitialProps successfully`,
          );
        }
        modelInject(handler, actionHandlers, context.cache);
        // model 赋予 cache
        handler._cache = context.cache;
      }
  
      const onReady = handler.onReady.bind(handler) as any as ((
        context: NextPageContext,
      ) => Promise<any>) & { inClient: boolean; inServer: boolean };
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
    } catch (error) {
      console.error(error)
      return {};
    } 
  };

  return {
    View,
    actions,
    proxyLifeCycle: function<T>(View: ComponentType<T>) {
      // register next view
      const NextView = createView(handler, View) as ModuleView<T>;
      NextView.getInitialProps = async (
        context: NextPageContext & { cache: AppCache },
      ) => {
        try {
          if (isServer) {
            if (!isProd) {
              console.info(
                `${chalk.green('ready')} - ${
                  handler.moduleName
                } getInitialProps successfully`,
              );
            }
            modelInject(handler, actionHandlers, context.cache);
          }
  
          const onReady = handler.onReady.bind(handler) as any as ((
            context: NextPageContext,
          ) => Promise<any>) & { inClient: boolean; inServer: boolean };
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
        } catch (error) {
          console.error(error)
          return {};
        }
      };
      return NextView;
    },
  };
}

// client inject is executed at the beginning, server register in getInitialProps. because getInitialProps cannot continue to be executed on the client after the server is executed
function modelInject<H extends Model>(
  handler: H,
  actionHandlers: AppCache['actionHandlers'],
  cache: AppCache,
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
  View: ModuleView,
  BaseApp: ComponentClass<{ cache?: AppCache }>,
) {
  return class App extends BaseApp {
    static async getInitialProps(
      context: AppContext & { ctx: NextPageContext & { cache: AppCache } },
    ) {
      // Executed on the server side when the page is refreshed, and executed on the client side when the client page jumps.
      if (isServer) {
        if (!isProd) {
          console.info(
            `${chalk.green('ready')} - NextApp getInitialProps successfully`,
          );
        }
        // It will only be executed on the server side, not on the client side
        // cahce in server, void global variable
        context.ctx.cache = createAppCache();
      }

      const appProps =
        typeof View.getInitialProps === 'function'
          ? await View.getInitialProps(context.ctx)
          : {};
      const superProps = await super['getInitialProps'](context);
      return {
        cache: isServer ? context.ctx.cache : null,
        initialReduxState: isServer
          ? context.ctx.cache.store.getState()
          : clientCache.store.getState(),
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
          clientCache.store.dispatch({
            type: createActionType(namespace),
            payload: props.initialReduxState[namespace],
          });
        });
      }
    }

    render() {
      return (
        <Provider store={isServer ? this.props.cache.store : clientCache.store}>
          <ConnectedRouter Router={patchedRouter}>
            <View {...this.props} />
          </ConnectedRouter>
        </Provider>
      );
    }
  };
}

// TODO: move to reaux
class Model<S = {}, R = StateView> extends NextBaseModel<S, R> {
  public _cache: AppCache = isServer ? undefined : clientCache;
  public constructor(readonly moduleName: string, readonly initState: S) {
    super();
  }

  get state(): Readonly<S> {
    return this._cache.store.getState()[this.moduleName];
  }

  get initialState(): Readonly<S> {
    return this.initState;
  }

  get rootState(): Readonly<R> {
    return this._cache.store.getState();
  }

  setState(newState: Partial<S>) {
    this._cache.store.dispatch(setModuleAction(this.moduleName, newState));
  }

  resetState() {
    this._cache.store.dispatch(
      resetModuleAction(this.moduleName, this.initState),
    );
  }

  dispatch(action: AnyAction) {
    this._cache.store.dispatch(action);
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

export function withIntersectionObserver<T>(Component: ComponentType<T>, onShow: (entry: Parameters<ObserverInstanceCallback>[1]) => Promise<any>, onHide: (entry: Parameters<ObserverInstanceCallback>[1]) => Promise<any>) {
  return class View extends React.PureComponent<T> {
      constructor(props: T) {
          super(props);
      }

      handleChange: ObserverInstanceCallback = async (inView, entry) => {
          if (inView) {
              await onShow(entry);
          } else {
              await onHide(entry);
          }
      };

      render() {
          return (
              <InView onChange={this.handleChange}>
                  {({ref}) => (
                      <div ref={ref}>
                          <Component {...this.props} />
                      </div>
                  )}
              </InView>
          );
      }
  };
}

export { start, register, Model, helper };
