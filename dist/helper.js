"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const createReducer_1 = require("./createReducer");
class Helper {
    constructor(appCache) {
        this.appCache = appCache;
    }
    put(action) {
        this.appCache.store.dispatch(action);
    }
    loading(identifier = "global") {
        const that = this;
        return util_1.handlerDecorator(async function (handler) {
            try {
                const nextLoadingState = that.appCache.store.getState()["@loading"];
                nextLoadingState[identifier] = nextLoadingState[identifier] + 1 || 1;
                that.put(createReducer_1.setModuleAction("@loading", nextLoadingState));
                await handler();
            }
            finally {
                const nextLoadingState = that.appCache.store.getState()["@loading"];
                nextLoadingState[identifier] = nextLoadingState[identifier] - 1 || 0;
                that.put(createReducer_1.setModuleAction("@loading", nextLoadingState));
            }
        });
    }
    isLoading(identifier = "global") {
        const loading = this.appCache.store.getState()["@loading"];
        return !!(loading && loading[identifier] > 0);
    }
    async delay(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map