import { AnyAction } from "redux";
import { handlerDecorator } from "./util";
import { AppCache, Exception } from "./type";
import {
  SET_HELPER_LOADING,
  SET_HELPER_LANG,
  SET_HELPER_EXCEPTION
} from "./util";

export class Helper {
  appCache: AppCache;
  allLocales: {} = {};
  constructor(appCache: AppCache) {
    this.appCache = appCache;
  }
  t<T extends string | number>(value: T): T {
    const allLocales = this.getLocales();
    if (!allLocales || (allLocales as any)[this.lang]) {
      console.warn(`language doesn't initial`);
      return value;
    } else if ((allLocales as any)[this.lang][value]) {
      return (allLocales as any)[this.lang][value];
    } else {
      console.warn(`${value} doesn't exist in ${this.lang}`);
      return value;
    }
  }
  put<T extends AnyAction>(action: T) {
    this.appCache.store.dispatch(action);
  }
  loading(identifier: string = "global") {
    const that = this;
    return handlerDecorator(async function(handler) {
      try {
        that.put({
          type: SET_HELPER_LOADING,
          payload: {
            identifier,
            hasShow: true
          }
        });
        await handler();
      } finally {
        that.put({
          type: SET_HELPER_LOADING,
          payload: {
            identifier,
            hasShow: false
          }
        });
      }
    });
  }
  isLoading(identifier: string = "global"): boolean {
    const loading = this.appCache.store.getState().helper.loading;
    return !!(loading && loading[identifier] > 0);
  }
  get lang(): string | undefined {
    return this.appCache.store.getState().helper.lang;
  }
  set lang(value: string | undefined) {
    this.put({
      type: SET_HELPER_LANG,
      payload: value!
    });
  }
  setLocales(allLocales) {
    this.allLocales = allLocales;
  }
  getLocales() {
    return this.allLocales;
  }
  get exception(): Exception | undefined {
    return this.appCache.store.getState().helper.exception;
  }
  set exception(exception: Exception | undefined) {
    this.put({
      type: SET_HELPER_EXCEPTION,
      payload: exception!
    });
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
