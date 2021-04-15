"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createReducer_1 = require("./createReducer");
let cache;
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
                // TODO: collection error
                cache.store.dispatch({
                    type: createReducer_1.createActionType("@error"),
                    payload: error
                });
                console.error(`runtimeError: ${error}`);
            }
        }
        next(actions);
    };
    middleware.run = function (app) {
        cache = app;
    };
    return middleware;
}
exports.createPromiseMiddleware = createPromiseMiddleware;
exports.asyncMiddleware = createPromiseMiddleware();
//# sourceMappingURL=middleware.js.map