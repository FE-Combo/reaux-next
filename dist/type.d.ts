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
export declare type HelperActionPayload = {
    identifier: string;
    hasShow: boolean;
} | string | Exception;
export declare abstract class BaseModel<S = {}> {
    abstract readonly moduleName: string;
    abstract readonly initState: S;
    abstract state: Readonly<S>;
    abstract rootState: Readonly<StateView>;
    abstract setState(newState: Partial<S>): void;
    onReady(context: any): Promise<void>;
    onLoad(): Promise<void>;
    onUnload(): Promise<void>;
    onHide(): Promise<void>;
}
export declare abstract class Exception {
    message: string;
    protected constructor(message: string);
}
