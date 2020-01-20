import { Middleware, MiddlewareAPI } from "redux";
import { createActionType } from "./createReducer";
import { AppCache } from "./type";

interface AsyncMiddleware extends Middleware {
  run: (app: AppCache) => void;
}

let cache: AppCache;

export function createPromiseMiddleware(): AsyncMiddleware {
  const middleware: AsyncMiddleware = (
    api: MiddlewareAPI
  ) => next => async actions => {
    if (!cache.actionHandlers) {
      throw new Error(
        "Invoking action before execute async middleware.run function only!!"
      );
    }
    if (cache.actionHandlers[actions.type]) {
      try {
        await cache.actionHandlers[actions.type](actions.payload);
      } catch (error) {
        // TODO: collection error
        cache.store.dispatch({
          type: createActionType("@error"),
          payload: error
        });
        console.error(`runtimeError: ${error}`);
      }
    }
    next(actions);
  };

  middleware.run = function(app: AppCache): any {
    cache = app;
  };
  return middleware;
}

export const asyncMiddleware: AsyncMiddleware = createPromiseMiddleware();
