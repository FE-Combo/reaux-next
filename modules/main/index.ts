import Main from "./component/Main";
import { register, Model } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "my name"
};

class ActionHandler extends Model<State> {
  async onReady() {
    // TODO;
  }
  async text() {
    // TODO:
  }
}

export const { actions, View } = register(
  new ActionHandler("main", initialState),
  Main
);
