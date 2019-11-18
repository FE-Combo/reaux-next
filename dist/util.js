export function handlerDecorator(interceptor) {
    return (target, name, descriptor) => {
        const handler = descriptor.value;
        descriptor.value = async function (...args) {
            const rootState = target.rootState;
            (await interceptor(handler.bind(this, ...args), rootState));
        };
        return descriptor;
    };
}
export const isServer = () => process && typeof process === "object" && typeof window === "undefined";
export const SET_STATE_ACTION = "@@framework/setState";
export const SET_HELPER_LOADING = "@@framework/setHelper/setLoading";
export const SET_HELPER_LANG = "@@framework/setHelper/setLang";
export const SET_HELPER_EXCEPTION = "@@framework/setHelper/exception";
//# sourceMappingURL=util.js.map