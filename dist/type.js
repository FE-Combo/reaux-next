"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    async onReady() {
        // extends to be overrode
    }
    async onLoad() {
        // extends to be overrode
    }
    async onUnload() {
        // extends to be overrode
    }
    async onHide() {
        // extends to be overrode
    }
}
exports.BaseModel = BaseModel;
class Exception {
    constructor(message) {
        this.message = message;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=type.js.map