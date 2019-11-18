export class BaseModel {
    async onReady(context) {
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
export class Exception {
    constructor(message) {
        this.message = message;
    }
}
//# sourceMappingURL=type.js.map