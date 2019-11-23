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
    console.info(`next context: ${this.context}`); // 获取next context
    console.info(`model state: ${this.state}`); // 当前模块的state
    console.info(`root state: ${this.rootState}`); // 整个项目的state
    this.setState({ name: "new name" }); // 更新 model state
    this.resetState(); // 重置当前model的state
  }
}

export const { actions, View } = register(
  new ActionHandler("home", initialState),
  Main
);
