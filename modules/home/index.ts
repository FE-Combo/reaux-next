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
    await helper.delay(1000);
    await this.setState({ name: "click button" });
  }

  @helper.loading()
  async clickGlobalButton() {
    await helper.delay(1000);
    await this.setState({ name: "click global button" });
  }

  async text() {
    this.setState({ name: "click button name" });
  }
}

export const { actions, View } = register(
  new ActionHandler("home", initialState),
  Main
);
