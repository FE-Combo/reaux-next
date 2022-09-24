import { Reducer, combineReducers, ReducersMapObject } from 'redux';
// import { routerReducer } from 'connected-next-router';
import { StateView, ActionType } from './type';

export function createActionType(namespace: string): string {
  return `@@framework/actionType/${namespace}`;
}

export function setModuleAction<State>(
  namespace: string,
  state: Partial<State>,
): ActionType<Partial<State>> {
  return {
    type: createActionType(namespace),
    payload: state,
  };
}

export function createModuleReducer(
  namespace: string,
  initialState: Record<string, unknown> = {},
): Reducer<object> {
  return (
    state: Record<string, unknown> = initialState,
    action: ActionType<object>,
  ) => {
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
  asyncReducers?: ReducersMapObject<StateView, any>,
): Reducer<StateView> {
  const reducers: ReducersMapObject<StateView, any> = {
    '@error': createModuleReducer('@error'),
    '@loading': createModuleReducer('@loading'),
    // router: routerReducer,
    ...asyncReducers,
  };
  return combineReducers(reducers);
}
