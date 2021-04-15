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
//# sourceMappingURL=util.js.map