import { AnyAction } from 'redux';
import { handlerDecorator, isServer } from './util';
import { App as AppCache } from 'reaux';
import { setModuleAction, createActionType } from 'reaux';

export class Helper {
  private appCache: AppCache;
  constructor(appCache: AppCache) {
    this.appCache = appCache;
  }

  // Only used internally, use `this.dispatch(action)` in model
  private put<T extends AnyAction>(action: T) {
    if (!isServer) {
      this.appCache.store.dispatch(action);
    }
  }

  loading(identifier: string = 'global') {
    /* eslint-disable @typescript-eslint/no-this-alias */
    const that = this;
    return handlerDecorator(async function (handler) {
      if (!isServer) {
        try {
          const nextLoadingState = that.appCache.store.getState()['@loading'];
          nextLoadingState[identifier] = nextLoadingState[identifier] + 1 || 1;
          that.put(setModuleAction('@loading', nextLoadingState));
          await handler();
        } catch (error) {
          that.put({
            type: createActionType('@error'),
            payload: {
              name: error.name,
              message: error.message,
              stack: error?.stack,
            },
          });
        } finally {
          const nextLoadingState = that.appCache.store.getState()['@loading'];
          nextLoadingState[identifier] = nextLoadingState[identifier] - 1 || 0;
          that.put(setModuleAction('@loading', nextLoadingState));
        }
      } else {
        await handler();
      }
    });
  }

  inServer() {
    return handlerDecorator(
      async function (handler) {
        await handler();
      },
      {
        callback: (_target, _name, descriptor) => {
          descriptor.value.inServer = true;
        },
      },
    );
  }

  inClient() {
    return handlerDecorator(
      async function (handler) {
        await handler();
      },
      {
        callback: (_target, _name, descriptor) => {
          descriptor.value.inClient = true;
        },
      },
    );
  }

  isLoading(identifier: string = 'global'): boolean {
    if (!isServer) {
      const loading = this.appCache.store.getState()['@loading'];
      return !!(loading && loading[identifier] > 0);
    }
    return false;
  }

  async delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
