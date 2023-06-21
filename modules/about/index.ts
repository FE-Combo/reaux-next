import Main from './component/Main';
import { register, Model, helper } from 'dist';
import { State } from './type';

const initialState: State = {
  name: 'about',
};

class ActionHandler extends Model<State> {
  @helper.inServer()
  async onReady() {
    console.info('about: only in server');
  }

  async test() {
    this.setState({test: "test"})
  }

  async reset() {
    this.resetState();
  }

  async onShow(): Promise<any> {
    console.info("about onShow")
  }

  async onHide(): Promise<any> {
    console.info("about onHide")
  }

  @helper.interval(3)
  async onTick() {
    console.info("about onTick")
  }
}

export const { actions, View } = register(
  new ActionHandler('about', initialState),
  Main,
);
