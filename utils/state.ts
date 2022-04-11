import {LoadingState, ErrorState} from "../framework/type"
import {State as MainState} from 'modules/main/type';
import {State as HomeState}  from 'modules/home/type';
import {State as AboutState} from 'modules/about/type';


export interface AllState {
  "@loading": Partial<LoadingState>,
  "@error": ErrorState,
  main: MainState;
  home: HomeState;
  abount: AboutState;
}
