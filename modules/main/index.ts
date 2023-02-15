import Main from './component/Main';
import { start, Model } from 'dist';
import BaseApp from 'next/app';
import { NextPageContext } from 'next';
import { State } from './type';

const initialState: State = {
  name: 'main',
};

class ActionHandler extends Model<State> {
  async onReady(context: NextPageContext) {
    if (!this.isRefreshRoutes(context.pathname || '/')) {
      // TODO:
    }
  }

  isRefreshRoutes(path: string) {
    return path === '/_next/webpack-hmr' || path.startsWith('/_next/static/');
  }
}

export const { actions, View } = start(
  new ActionHandler('main', initialState),
  Main,
  BaseApp,
);
