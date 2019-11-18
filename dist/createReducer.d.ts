import { Reducer } from "redux";
import { StateView, ActionType, ActionPayload, HelperActionPayload } from "./type";
export declare function setStateAction<State>(module: string, state: Partial<State>, type?: string): ActionType<ActionPayload>;
export declare function setHelperAction<T>(type: T, payload: HelperActionPayload): ActionType<HelperActionPayload>;
export declare function createReducer(): Reducer<StateView>;
