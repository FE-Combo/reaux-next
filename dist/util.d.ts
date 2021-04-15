import { StateView } from "./type";
declare type ActionHandler = (...args: any[]) => any;
declare type HandlerDecorator = (target: object, name: string | symbol, descriptor: TypedPropertyDescriptor<ActionHandler>) => TypedPropertyDescriptor<ActionHandler>;
declare type HandlerInterceptor<S> = (handler: ActionHandler, state: Readonly<S>) => any;
export declare function handlerDecorator<S extends StateView>(interceptor: HandlerInterceptor<S>): HandlerDecorator;
export declare const isServer: () => boolean;
export {};
