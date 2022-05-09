import Main from "./component/Main";
import { register, Model, PageContext, helper} from "../../framework";
import { State } from "./type";

const initialState: State = {
  name: "about"
};

class ActionHandler extends Model<State> {
  @helper.inServer()
  async onReady(context: PageContext) {
    console.info("about: only in server");
  }
}

export const { actions, View } = register(
  new ActionHandler("about", initialState),
  Main
);
