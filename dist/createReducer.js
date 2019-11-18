import { combineReducers } from "redux";
import { SET_STATE_ACTION, SET_HELPER_LOADING, SET_HELPER_LANG, SET_HELPER_EXCEPTION } from "./util";
export function setStateAction(module, state, type = SET_STATE_ACTION) {
    return {
        type,
        payload: { module, state }
    };
}
export function setHelperAction(type, payload) {
    return {
        type,
        payload
    };
}
function appReducer(state = {}, action) {
    if (action.type === SET_STATE_ACTION) {
        const { module, state: moduleState } = action.payload;
        return { ...state, [module]: { ...state[module], ...moduleState } };
    }
    return state;
}
function helperReducer(state = {}, action) {
    const nextState = { ...state };
    switch (action.type) {
        case SET_HELPER_LOADING:
            const { hasShow, identifier } = action.payload;
            !nextState.loading && (nextState.loading = {});
            const count = nextState.loading[identifier] || 0;
            nextState.loading.identifier = count + (hasShow ? 1 : -1);
            return nextState;
        case SET_HELPER_LANG:
            const lang = action.payload;
            nextState.lang = lang;
            return nextState;
        case SET_HELPER_EXCEPTION:
            const exception = action.payload;
            nextState.exception = exception;
            return nextState;
        default:
            return state;
    }
}
export function createReducer() {
    const reducers = {
        app: appReducer,
        helper: helperReducer
    };
    return combineReducers(reducers);
}
//# sourceMappingURL=createReducer.js.map