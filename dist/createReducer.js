"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
function createActionType(namespace) {
    return `@@framework/actionType/${namespace}`;
}
exports.createActionType = createActionType;
function setModuleAction(namespace, state) {
    return {
        type: createActionType(namespace),
        payload: state
    };
}
exports.setModuleAction = setModuleAction;
function createModuleReducer(namespace) {
    return (state = {}, action) => {
        const actionType = createActionType(namespace);
        switch (action.type) {
            case actionType:
                const nextState = { ...state, ...action.payload };
                return nextState;
            default:
                return state;
        }
    };
}
exports.createModuleReducer = createModuleReducer;
function createReducer(asyncReducers) {
    const reducers = {
        "@error": createModuleReducer("@error"),
        "@loading": createModuleReducer("@loading"),
        ...asyncReducers
    };
    return redux_1.combineReducers(reducers);
}
exports.createReducer = createReducer;
//# sourceMappingURL=createReducer.js.map