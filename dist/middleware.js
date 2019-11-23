"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let cache;
let errorCallback = null;
function createPromiseMiddleware() {
    const middleware = (api) => next => async (actions) => {
        if (!cache.actionHandlers) {
            throw new Error("Invoking action before execute async middleware.run function only!!");
        }
        if (cache.actionHandlers[actions.type]) {
            try {
                await cache.actionHandlers[actions.type](actions.payload);
            }
            catch (error) {
                errorCallback && errorCallback(error);
                console.error(`runtimeError: ${error}`);
            }
        }
        next(actions);
    };
    middleware.run = function (app, errorCallback) {
        cache = app;
        errorCallback = errorCallback;
    };
    return middleware;
}
exports.createPromiseMiddleware = createPromiseMiddleware;
exports.asyncMiddleware = createPromiseMiddleware();
//# sourceMappingURL=middleware.js.map