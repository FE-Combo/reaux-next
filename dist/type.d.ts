import { ComponentType, ComponentClass } from "react";
import { Store, Action, ReducersMapObject } from "redux";
export interface AppCache {
    context?: any;
    actionHandlers: {};
    modules: {};
    store: Store<StateView>;
    asyncReducers: ReducersMapObject<StateView, any>;
    injectReducer: (namespace: string, asyncReducers: ReducersMapObject<StateView, any>) => any;
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
export declare abstract class BaseModel<S = {}> {
    abstract readonly moduleName: string;
    abstract readonly initState: S;
    abstract state: Readonly<S>;
    abstract rootState: Readonly<StateView>;
    abstract setState(newState: Partial<S>): void;
    abstract resetState(): void;
    onReady(): Promise<any>;
    onLoad(): Promise<any>;
    onUnload(): Promise<any>;
    onHide(): Promise<any>;
}
export declare abstract class Exception {
    message: string;
    protected constructor(message: string);
}
export interface StartOptions<T> {
    App: ComponentType<any> & {
        getInitialProps: (context: any) => any;
    };
    BaseApp: ComponentClass<any>;
}
