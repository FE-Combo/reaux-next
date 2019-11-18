let cache;
let errorCallback = null;
export function createPromiseMiddleware() {
    const middleware = (api) => next => async (actions) => {
        next(actions);
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
    };
    middleware.run = function (app, errorCallback) {
        cache = app;
        errorCallback = errorCallback;
    };
    return middleware;
}
export const asyncMiddleware = createPromiseMiddleware();
//# sourceMappingURL=middleware.js.map