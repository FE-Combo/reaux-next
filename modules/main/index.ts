import Main from "./component/Main";
import { start, Model } from "../../framework";
import BaseApp from "next/app";
import { State } from "./type";

const initialState: State = {
  name: "main"
};

class ActionHandler extends Model<State> {
  async onReady() {
    console.info("main");
  }
}

export const { actions, View } = start(
  new ActionHandler("main", initialState),
  Main,
  BaseApp
);
