import { Reducer, combineReducers, ReducersMapObject } from "redux";
import {
  SET_STATE_ACTION,
  SET_HELPER_LOADING,
  SET_HELPER_LANG,
  SET_HELPER_EXCEPTION
} from "./util";
import {
  StateView,
  ActionType,
  ActionPayload,
  StateViewHelperLoadingState,
  Exception,
  HelperActionPayload
} from "./type";

export function setStateAction<State>(
  module: string,
  state: Partial<State>,
  type: string = SET_STATE_ACTION
): ActionType<ActionPayload> {
  return {
    type,
    payload: { module, state }
  };
}

export function setHelperAction<T>(
  type: T,
  payload: HelperActionPayload
): ActionType<HelperActionPayload> {
  return {
    type,
    payload
  };
}

function appReducer(
  state: StateView["app"] = {},
  action: ActionType<any>
): StateView["app"] {
  if (action.type === SET_STATE_ACTION) {
    const { module, state: moduleState } = action.payload as ActionPayload;
    return { ...state, [module]: { ...state[module], ...moduleState } };
  }
  return state;
}

function helperReducer(
  state: StateView["helper"] = {},
  action: ActionType<any>
): StateView["helper"] {
  const nextState = { ...state };
  switch (action.type) {
    case SET_HELPER_LOADING:
      const {
        hasShow,
        identifier
      } = action.payload as StateViewHelperLoadingState;
      !nextState.loading && (nextState.loading = {});
      const count = nextState.loading[identifier] || 0;
      nextState.loading.identifier = count + (hasShow ? 1 : -1);
      return nextState;
    case SET_HELPER_LANG:
      const lang = action.payload as string;
      nextState.lang = lang;
      return nextState;
    case SET_HELPER_EXCEPTION:
      const exception = action.payload as Exception;
      nextState.exception = exception;
      return nextState;
    default:
      return state;
  }
}

export function createReducer(): Reducer<StateView> {
  const reducers: ReducersMapObject<StateView, any> = {
    app: appReducer,
    helper: helperReducer
  };
  return combineReducers(reducers);
}
