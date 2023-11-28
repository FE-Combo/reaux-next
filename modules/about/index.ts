import Main from './component/Main';
import { register, Model, helper } from 'dist';
import {connect} from "reaux";
import { State } from './type';
import { AllState } from 'utils/state';

const initialState: State = {
  name: 'about',
};

class ActionHandler extends Model<State> {
  @helper.inServer()
  async onReady() {
    console.info('about: only in server');
  }

  async onUpdate(...args){
    console.info("about onUpdate", args)
  }

  async test() {
    this.router.push('/home');
  }
  
  async onShow() {
    console.info("about onShow")
  }

  async onHide() {
    console.info("about onHide")
  }

  @helper.interval(3)
  async onTick() {
    console.info("about onTick")
  }
}

export const { actions, View } = connect((state: AllState)=>({name: state.about.name}))(register(
  new ActionHandler('about', initialState),
  Main,
));
