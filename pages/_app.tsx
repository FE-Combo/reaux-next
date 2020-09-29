import { start } from "../framework";
import { View } from "../modules/main";
import BaseApp from "next/app";
const App = start({
  App: View,
  BaseApp
});


export default App