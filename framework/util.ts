import { StateView } from './type';

declare const process: any;
declare const window: any;

type ActionHandler = ((...args: any[]) => any) & {
  inServer?: boolean;
  inClient?: boolean;
};

type HandlerDecorator = (
  target: object,
  name: string | symbol,
  descriptor: TypedPropertyDescriptor<ActionHandler>,
) => TypedPropertyDescriptor<ActionHandler>;

type HandlerInterceptor<S> = (
  handler: ActionHandler,
  state: Readonly<S>,
) => any;

interface Options {
  callback: (
    target: object,
    name: string | symbol,
    descriptor: TypedPropertyDescriptor<ActionHandler>,
  ) => void;
}

export function handlerDecorator<S extends StateView>(
  interceptor: HandlerInterceptor<S>,
  options?: Options,
): HandlerDecorator {
  return (target, name, descriptor) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // const rootState: S = (target as any)?.rootState;
      await interceptor(fn!.bind(this, ...args), {} as S);
    };
    if (typeof options?.callback === 'function') {
      options.callback(target, name, descriptor);
    }
    return descriptor;
  };
}

export const isServer =
  process && typeof process === 'object' && typeof window === 'undefined';


export function filterObject<S extends {}, K extends keyof S>(state: S, keys: K | K[]) {
  const filteredObj = {} as Pick<S, K>;
  if (typeof keys === 'string') {
    keys = [keys];
  }
  for (const key of keys as K[]) {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      filteredObj[key] = state[key];
    }
  }
  return filteredObj;
}