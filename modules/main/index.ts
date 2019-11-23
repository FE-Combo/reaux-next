import Main from "./component/Main";
import { register, Model } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "main"
};

class ActionHandler extends Model<State> {
  async onReady() {
    // 对应next.js中的getInitialProps方法
    console.info("main");
    this.text();
  }
  async onLoad() {
    // mount or update
  }
  async onUnload() {
    // unmount
  }
  async text() {
    // TODO:
  }
}

export const { actions, View } = register(
  new ActionHandler("main", initialState),
  Main
);
