import Main from "./component/Main";
import { register, Model } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "main"
};

class ActionHandler extends Model<State> {
  async onReady() {
    console.info("main");
  }
}

export const { actions, View } = register(
  new ActionHandler("main", initialState),
  Main
);
