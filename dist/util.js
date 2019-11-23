"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handlerDecorator(interceptor) {
    return (target, name, descriptor) => {
        const fn = descriptor.value;
        descriptor.value = async function (...args) {
            const rootState = target.rootState;
            await interceptor(fn.bind(this, ...args), rootState);
        };
        return descriptor;
    };
}
exports.handlerDecorator = handlerDecorator;
exports.isServer = () => process && typeof process === "object" && typeof window === "undefined";
exports.SET_STATE_ACTION = "@@framework/setState";
exports.INIT_CLIENT_APP = "@@framework/initApp";
exports.INIT_CLIENT_HELPER = "@@framework/initHelper";
exports.SET_HELPER_LOADING = "@@framework/setHelper/setLoading";
exports.SET_HELPER_LANG = "@@framework/setHelper/setLang";
exports.SET_HELPER_EXCEPTION = "@@framework/setHelper/exception";
//# sourceMappingURL=util.js.map