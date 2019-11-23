"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const util_2 = require("./util");
class Helper {
    constructor(appCache, setHelperAction) {
        this.appCache = appCache;
        this.setHelperAction = setHelperAction;
    }
    put(action) {
        this.appCache.store.dispatch(action);
    }
    loading(identifier = "global") {
        const that = this;
        return util_1.handlerDecorator(async function (handler) {
            try {
                that.put(that.setHelperAction(util_2.SET_HELPER_LOADING, {
                    identifier,
                    hasShow: true
                }));
                await handler();
            }
            finally {
                that.put(that.setHelperAction(util_2.SET_HELPER_LOADING, {
                    identifier,
                    hasShow: false
                }));
            }
        });
    }
    isLoading(identifier) {
        const loading = this.appCache.store.getState().helper.loading;
        return !!(loading && loading[identifier] > 0);
    }
    get lang() {
        return this.appCache.store.getState().helper.lang;
    }
    set lang(value) {
        this.put(this.setHelperAction(util_2.SET_HELPER_LANG, value));
    }
    get exception() {
        return this.appCache.store.getState().helper.exception;
    }
    set exception(exception) {
        this.put(this.setHelperAction(util_2.SET_HELPER_EXCEPTION, exception));
    }
    async delay(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.Helper = Helper;
//# sourceMappingURL=helper.js.map