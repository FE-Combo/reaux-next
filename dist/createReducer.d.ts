import { Reducer, ReducersMapObject } from "redux";
import { StateView, ActionType } from "./type";
export declare function createActionType(namespace: string): string;
export declare function setModuleAction<State>(namespace: string, state: Partial<State>): ActionType<Partial<State>>;
export declare function createModuleReducer(namespace: string): Reducer<object>;
export declare function createReducer(asyncReducers?: ReducersMapObject<StateView, any>): Reducer<StateView>;
