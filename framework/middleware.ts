import { Middleware, MiddlewareAPI } from "redux";
import { AppCache, Exception } from "./type";

type ErrorCallback = (exception: Exception) => void;

interface AsyncMiddleware extends Middleware {
  run: (app: AppCache, errorCallback: ErrorCallback) => void;
}

let cache: AppCache;
let errorCallback: ErrorCallback | null = null;

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
        errorCallback && errorCallback(error);
        console.error(`runtimeError: ${error}`);
      }
    }
    next(actions);
  };

  middleware.run = function(app: AppCache, errorCallback?: ErrorCallback): any {
    cache = app;
    errorCallback = errorCallback;
  };
  return middleware;
}

export const asyncMiddleware: AsyncMiddleware = createPromiseMiddleware();
