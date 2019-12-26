import Main from "./component/Main";
import { register, Model, helper, isServer } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "main"
};

class ActionHandler extends Model<State> {
  async onReady() {
    if (isServer()) {
      helper.lang = "ZH";
    }

    console.info("main");
  }
}

export const { actions, View } = register(
  new ActionHandler("main", initialState),
  Main
);
