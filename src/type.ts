import { Store, Action } from "redux";

export interface AppCache {
  actionHandlers: {};
  modules: {};
  store: Store<StateView>;
}

export interface StateView {
  app: {};
  helper: StateViewHelper;
}

export interface StateViewHelper {
  loading?: StateViewHelperLoadingState;
  lang?: string;
  exception?: Exception;
}

export interface StateViewHelperLoadingState {
  [loadingType: string]: number;
}

export interface ActionType<P = any> extends Action {
  name?: string;
  payload: P;
}

export interface ActionPayload {
  module: string;
  state: any;
}

export type HelperActionPayload =
  | {
      identifier: string;
      hasShow: boolean;
    }
  | string
  | Exception;

export abstract class BaseModel<S = {}> {
  abstract readonly moduleName: string;
  abstract readonly initState: S;
  abstract state: Readonly<S>;
  abstract rootState: Readonly<StateView>;
  abstract setState(newState: Partial<S>): void;
  async onReady(content: any) {
    // extends to be overrode
  }
  async onLoad() {
    // extends to be overrode
  }
  async onUnload() {
    // extends to be overrode
  }
  async onHide() {
    // extends to be overrode
  }
}

export abstract class Exception {
  protected constructor(public message: string) {}
}
