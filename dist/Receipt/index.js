"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receipt = void 0;
class Receipt {
    constructor(callback) {
        this._cancelFunction = callback;
    }
    static givenCancelFunction(cancelFunction) {
        const handle = new Receipt(cancelFunction);
        this._all.add(handle);
        return handle;
    }
    get isCancelled() {
        return this._cancelFunction == null;
    }
    cancel() {
        if (this._cancelFunction == null) {
            return;
        }
        Receipt._all.delete(this);
        const fn = this._cancelFunction;
        this._cancelFunction = undefined;
        fn();
    }
}
exports.Receipt = Receipt;
Receipt._all = new Set();
//# sourceMappingURL=index.js.map