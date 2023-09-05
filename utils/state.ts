
import {StateView} from "dist"
import { State as MainState } from 'modules/main/type';
import { State as HomeState } from 'modules/home/type';
import { State as AboutState } from 'modules/about/type';

export interface AllState extends StateView {
  main: MainState;
  home: HomeState;
  about: AboutState;
}
