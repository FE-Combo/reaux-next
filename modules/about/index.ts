import Main from "./component/Main";
import { register, Model } from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "about"
};

class ActionHandler extends Model<State> {
  async onReady() {
    console.info("about");
    // return { about: "about" };
  }
  async text() {
    // TODO:
  }
}

export const { actions, View } = register(
  new ActionHandler("about", initialState),
  Main
);
