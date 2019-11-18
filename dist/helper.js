import { handlerDecorator } from "./util";
import { SET_HELPER_LOADING, SET_HELPER_LANG, SET_HELPER_EXCEPTION } from "./util";
export class Helper {
    constructor(appCache, setHelperAction) {
        this.appCache = appCache;
        this.setHelperAction = setHelperAction;
    }
    put(action) {
        this.appCache.store.dispatch(action);
    }
    loading(identifier = "global") {
        const that = this;
        return handlerDecorator(async function (handler) {
            try {
                that.put(that.setHelperAction(SET_HELPER_LOADING, {
                    identifier,
                    hasShow: true
                }));
                await handler();
            }
            finally {
                that.put(that.setHelperAction(SET_HELPER_LOADING, {
                    identifier,
                    hasShow: false
                }));
            }
        });
    }
    get lang() {
        return this.appCache.store.getState().helper.lang;
    }
    set lang(value) {
        this.put(this.setHelperAction(SET_HELPER_LANG, value));
    }
    get exception() {
        return this.appCache.store.getState().helper.exception;
    }
    set exception(exception) {
        this.put(this.setHelperAction(SET_HELPER_EXCEPTION, exception));
    }
}
//# sourceMappingURL=helper.js.map