import Main from "./component/Main";
import { register, Model, helper} from "../../framework";
import { NextPageContext } from "next";
import { State } from "./type";

const initialState: State = {
  name: "about"
};

class ActionHandler extends Model<State> {
  @helper.inServer()
  async onReady(context: NextPageContext) {
    console.info("about: only in server");
  }
}

export const { actions, View } = register(
  new ActionHandler("about", initialState),
  Main
);
