import Main from './component/Main';
import Detail from './component/Detail';
import { register, Model, helper } from 'dist';
import { State } from './type';

const initialState: State = {
  name: 'home',
};

class ActionHandler extends Model<State> {
  @helper.loading()
  async onReady() {
    // 对应next.js中的getInitialProps方法
    console.info('home');
    this.setState({ name: 'new name' });
  }

  async onLoad() {
    // mount
  }
  async onUnload() {
    // unmount
  }

  async onShow(): Promise<any> {
    console.info("home detail onShow")
  }

  async onHide(): Promise<any> {
    console.info("home detail onHide")
  }

  @helper.loading('button')
  async clickButton() {
    await helper.delay(1000);
    await this.setState({ name: 'click button' });
    this.router.push('/home', {
      query:{
        t: new Date().getTime()
      }
    });
  }

  @helper.loading()
  async clickGlobalButton() {
    await helper.delay(1000);
    this.setState({ name: 'click global button' });
    await helper.delay(1000);
    this.setState({ name: 'click global button2' });
  }

  async text() {
    console.info(`model state: ${this.state}`); // 当前模块的state
    console.info(`root state: ${this.rootState}`); // 整个项目的state
    this.setState({ name: 'name' }); // 更新 model state
    this.resetState(); // 重置当前model的state
    this.dispatch({ type: 'test', payload: {} }); // dispatch
  }
}

export const { actions, View, proxyLifeCycle } = register(
  new ActionHandler('home', initialState),
  Main,
);

export const HomeDetail = proxyLifeCycle(Detail);
