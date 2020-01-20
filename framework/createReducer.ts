import { Reducer, combineReducers, ReducersMapObject } from "redux";
import { StateView, ActionType } from "./type";

export function createActionType(namespace: string): string {
  return `@@framework/actionType/${namespace}`;
}

export function setModuleAction<State>(
  namespace: string,
  state: Partial<State>
): ActionType<Partial<State>> {
  return {
    type: createActionType(namespace),
    payload: state
  };
}

export function createModuleReducer(namespace: string): Reducer<object> {
  return (state: {} = {}, action: ActionType<object>) => {
    const actionType = createActionType(namespace);
    switch (action.type) {
      case actionType:
        const nextState = { ...state, ...action.payload };
        return nextState;
      default:
        return state;
    }
  };
}

export function createReducer(
  asyncReducers?: ReducersMapObject<StateView, any>
): Reducer<StateView> {
  const reducers: ReducersMapObject<StateView, any> = {
    "@error": createModuleReducer("@error"),
    "@loading": createModuleReducer("@loading"),
    ...asyncReducers
  };
  return combineReducers(reducers);
}
