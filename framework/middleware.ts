import { Middleware, MiddlewareAPI } from "redux";
import { createActionType } from "./createReducer";
import { ActionType, ActionHandlers } from "./type";

export function middleware(callback: ()=> ActionHandlers): Middleware {
  const middleware: Middleware = (
    api: MiddlewareAPI
  ) => next => async (actions: ActionType) => {
    const actionHandlers = callback();
    if (actionHandlers[actions.type]) {
      try {
        await actionHandlers[actions.type](...actions.payload);
      } catch (error) {
        // TODO: collection error
        api.dispatch({
          type: createActionType("@error"),
          payload: error
        });
        console.error(`runtimeError: ${error}`);
      }
    }
    next(actions);
  };

  return middleware;
}

