import { StateView } from "./type";

declare const process: any;
declare const window: any;

type ActionHandler = (...args: any[]) => any;

type HandlerDecorator = (
  target: object,
  name: string | symbol,
  descriptor: TypedPropertyDescriptor<ActionHandler>
) => TypedPropertyDescriptor<ActionHandler>;

type HandlerInterceptor<S> = (
  handler: ActionHandler,
  state: Readonly<S>
) => any;

export function handlerDecorator<S extends StateView>(
  interceptor: HandlerInterceptor<S>
): HandlerDecorator {
  return (target, name, descriptor) => {
    const fn = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const rootState: S = (target as any).rootState;
      await interceptor(fn!.bind(this, ...args), rootState);
    };
    return descriptor;
  };
}

export const isServer = () =>
  process && typeof process === "object" && typeof window === "undefined";

export const SET_STATE_ACTION = "@@framework/setState";

export const INIT_CLIENT_APP = "@@framework/initApp";

export const INIT_CLIENT_HELPER = "@@framework/initHelper";

export const SET_HELPER_LOADING = "@@framework/setHelper/setLoading";

export const SET_HELPER_LANG = "@@framework/setHelper/setLang";

export const SET_HELPER_EXCEPTION = "@@framework/setHelper/exception";
