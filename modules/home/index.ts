import Main from "./component/Main";
import { register, Model } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "home"
};

class ActionHandler extends Model<State> {
  async onReady() {
    console.info("home");
    return { home: "home" };
  }
  async clickButton() {
    this.setState({ name: "click button name" });
  }
  async text() {
    // TODO:
  }
}

export const { actions, View } = register(
  new ActionHandler("home", initialState),
  Main
);
