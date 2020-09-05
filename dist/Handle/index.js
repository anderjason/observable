"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = void 0;
class Handle {
    constructor(callback) {
        this._callback = callback;
    }
    static givenCallback(callback) {
        const handle = new Handle(callback);
        this.unreleasedSet.add(handle);
        return handle;
    }
    get isReleased() {
        return this._callback == null;
    }
    release() {
        if (this._callback == null) {
            return;
        }
        Handle.unreleasedSet.delete(this);
        const fn = this._callback;
        this._callback = undefined;
        fn();
    }
}
exports.Handle = Handle;
Handle.unreleasedSet = new Set();
//# sourceMappingURL=index.js.map