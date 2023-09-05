import { NextPageContext } from 'next';
import { State, ErrorState, LoadingState } from 'reaux';
import { RouterState } from 'connected-next-router';

export interface StateView extends State {
  '@error': ErrorState;
  '@loading': Partial<LoadingState>;
  router: RouterState;
  [namespace: string]: any;
}

export interface ActionPayload {
  module: string;
  state: object;
}

export interface StartOptons {
  withAction: boolean; // 是否生成action
  withDispatch: boolean; // 是否生成dispatch action
  withEffect: boolean; // 是否生成副作用函数
}

export type PageContext = NextPageContext;

export type ModuleView<T=any, R=any> = React.ComponentType<T> & {
  getInitialProps?: (context: NextPageContext) => R;
};

export abstract class BaseModel<S = {}, R = any> {
  abstract readonly moduleName: string;
  abstract readonly initialState: S;
  abstract state: Readonly<S>;
  abstract rootState: Readonly<R>;
  abstract setState(newState: Partial<S>): void;
  abstract resetState(): void;
  abstract dispatch(action: any): void;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async onReady(_context?: NextPageContext): Promise<any> {
    // Extends to be overrode
    // Execute on the server or client before module render
    // Similar to getInitialProps in nextjs
  }
  async onLoad(...args: any[]): Promise<any> {
    // Extends to be overrode
    // Similar to componentDidMount
  }
  async onUpdate(...args: any[]): Promise<any> {
    // Extends to be overrode
    // Similar to componentDidUpdate
  }
  async onUnload(...args: any[]): Promise<any> {
    // Extends to be overrode
    // Similar to componentWillUnMount
  }
  async onTick(...args: any[]): Promise<any> {
    // Extends to be overrode
    // Periodic call (default 1s), can use the @helper.interval decorator to specify the period (in seconds)
  }
  async onShow(...args: any[]): Promise<any> {
    // Extends to be overrode
    // Display in viewport
  }
  async onHide(...args: any[]): Promise<any> {
    // Extends to be overrode
    // Disappear in viewport
  }
}

export interface BaseModuleProps<T=any, P=object> {
  Component: React.ComponentType<T>; // router component
  pageProps: P; // router component props
}