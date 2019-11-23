import { AnyAction } from "redux";
import { handlerDecorator } from "./util";
import { AppCache, Exception, HelperActionPayload } from "./type";
import {
  SET_HELPER_LOADING,
  SET_HELPER_LANG,
  SET_HELPER_EXCEPTION
} from "./util";

type SetHelperAction = <T>(type: T, payload: HelperActionPayload) => any;

export class Helper {
  appCache: AppCache;
  setHelperAction: SetHelperAction;
  constructor(appCache: AppCache, setHelperAction: SetHelperAction) {
    this.appCache = appCache;
    this.setHelperAction = setHelperAction;
  }
  put<T extends AnyAction>(action: T) {
    this.appCache.store.dispatch(action);
  }
  loading(identifier: string = "global") {
    const that = this;
    return handlerDecorator(async function(handler) {
      try {
        that.put(
          that.setHelperAction(SET_HELPER_LOADING, {
            identifier,
            hasShow: true
          })
        );
        await handler();
      } finally {
        that.put(
          that.setHelperAction(SET_HELPER_LOADING, {
            identifier,
            hasShow: false
          })
        );
      }
    });
  }
  isLoading(identifier: string): boolean {
    const loading = this.appCache.store.getState().helper.loading;
    return !!(loading && loading[identifier] > 0);
  }
  get lang(): string | undefined {
    return this.appCache.store.getState().helper.lang;
  }
  set lang(value: string | undefined) {
    this.put(this.setHelperAction(SET_HELPER_LANG, value!));
  }
  get exception(): Exception | undefined {
    return this.appCache.store.getState().helper.exception;
  }
  set exception(exception: Exception | undefined) {
    this.put(this.setHelperAction(SET_HELPER_EXCEPTION, exception!));
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
