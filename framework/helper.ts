import { AnyAction } from "redux";
import { handlerDecorator, isServer} from "./util";
import { AppCache } from "./type";
import { setModuleAction } from "./createReducer";

export class Helper {
  appCache: AppCache;
  constructor(appCache: AppCache) {
    this.appCache = appCache;
  }

  private put<T extends AnyAction>(action: T) {
    if(!isServer()) {
      this.appCache.store.dispatch(action);
    }
  }

  loading(identifier: string = "global") {
    const that = this;
    return handlerDecorator(async function(handler) {
      if(!isServer()) {
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
      } else {
        await handler();
      }
    });
  }

  isLoading(identifier: string = "global"): boolean {
    if(!isServer()) {
      const loading = this.appCache.store.getState()["@loading"];
      return !!(loading && loading[identifier] > 0);
    }
    return false;
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
