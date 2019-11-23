"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const util_1 = require("./util");
function setStateAction(module, state, type = util_1.SET_STATE_ACTION) {
    return {
        type,
        payload: { module, state }
    };
}
exports.setStateAction = setStateAction;
function setHelperAction(type, payload) {
    return {
        type,
        payload
    };
}
exports.setHelperAction = setHelperAction;
function appReducer(state = {}, action) {
    if (action.type === util_1.INIT_CLIENT_APP) {
        return action.payload;
    }
    if (action.type === util_1.SET_STATE_ACTION) {
        const { module, state: moduleState } = action.payload;
        return { ...state, [module]: { ...state[module], ...moduleState } };
    }
    return state;
}
function helperReducer(state = {}, action) {
    const nextState = { ...state };
    switch (action.type) {
        case util_1.INIT_CLIENT_HELPER:
            return action.payload;
        case util_1.SET_HELPER_LOADING:
            const { hasShow, identifier } = action.payload;
            !nextState.loading && (nextState.loading = {});
            const count = nextState.loading[identifier] || 0;
            nextState.loading[identifier] = count + (hasShow ? 1 : -1);
            return nextState;
        case util_1.SET_HELPER_LANG:
            const lang = action.payload;
            nextState.lang = lang;
            return nextState;
        case util_1.SET_HELPER_EXCEPTION:
            const exception = action.payload;
            nextState.exception = exception;
            return nextState;
        default:
            return state;
    }
}
function createReducer() {
    const reducers = {
        app: appReducer,
        helper: helperReducer
    };
    return redux_1.combineReducers(reducers);
}
exports.createReducer = createReducer;
//# sourceMappingURL=createReducer.js.map