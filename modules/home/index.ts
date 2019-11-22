import Main from "./component/Main";
import { register, Model, helper } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "home"
};

class ActionHandler extends Model<State> {
  @helper.loading()
  async onReady() {
    console.info("home");
    await this.setState({ name: "new name" });
  }

  @helper.loading("button")
  async clickButton() {
    await this.setState({ name: "click button name" });
  }

  async text() {
    this.setState({ name: "click button name" });
  }
}

export const { actions, View } = register(
  new ActionHandler("home", initialState),
  Main
);
