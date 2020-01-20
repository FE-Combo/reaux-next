import { AnyAction } from "redux";
import { handlerDecorator } from "./util";
import { AppCache } from "./type";
import { setModuleAction } from "./createReducer";

export class Helper {
  appCache: AppCache;
  constructor(appCache: AppCache) {
    this.appCache = appCache;
  }

  put<T extends AnyAction>(action: T) {
    this.appCache.store.dispatch(action);
  }

  loading(identifier: string = "global") {
    const that = this;
    return handlerDecorator(async function(handler) {
      try {
        const nextLoadingState = that.appCache.store.getState()["@loading"];
        nextLoadingState[identifier] = nextLoadingState[identifier] + 1 || 1;
        that.put(setModuleAction("@loading", nextLoadingState));
        await handler();
      } finally {
        const nextLoadingState = that.appCache.store.getState()["@loading"];
        nextLoadingState[identifier] = nextLoadingState[identifier] - 1 || 0;
        that.put(setModuleAction("@loading", nextLoadingState));
      }
    });
  }

  isLoading(identifier: string = "global"): boolean {
    const loading = this.appCache.store.getState()["@loading"];
    return !!(loading && loading[identifier] > 0);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
