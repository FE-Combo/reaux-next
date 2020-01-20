import { ComponentType, ComponentClass } from "react";
import { Store, Action, ReducersMapObject } from "redux";

export interface AppCache {
  context?: any;
  actionHandlers: {};
  modules: {};
  store: Store<StateView>;
  // Add a dictionary to keep track of the registered async reducers
  asyncReducers: ReducersMapObject<StateView, any>;
  // adds the async reducer, and creates a new combined reducer
  injectReducer: (
    namespace: string,
    asyncReducers: ReducersMapObject<StateView, any>
  ) => any;
}

export interface StateView {
  [namespace: string]: {};
  "@error": ErrorState;
  "@loading": LoadingState;
}

export interface ErrorState {
  runtimeException: any;
  apiException: any;
}

export interface LoadingState {
  [loadingType: string]: number;
}

export interface ActionType<P = any> extends Action {
  name?: string;
  payload: P;
}

export interface ActionPayload {
  module: string;
  state: object;
}

export abstract class BaseModel<S = {}> {
  abstract readonly moduleName: string;
  abstract readonly initState: S;
  abstract state: Readonly<S>;
  abstract rootState: Readonly<StateView>;
  abstract setState(newState: Partial<S>): void;
  abstract resetState(): void;
  async onReady(): Promise<any> {
    // extends to be overrode
  }
  async onLoad(): Promise<any> {
    // extends to be overrode
  }
  async onUnload(): Promise<any> {
    // extends to be overrode
  }
  async onHide(): Promise<any> {
    // extends to be overrode
  }
}

export abstract class Exception {
  protected constructor(public message: string) {}
}

export interface StartOptions<T> {
  App: ComponentType<any> & {
    getInitialProps: (context: any) => any;
  };
  BaseApp: ComponentClass<any>;
}
