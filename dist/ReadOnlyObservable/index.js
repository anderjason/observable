"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadOnlyObservable = void 0;
class ReadOnlyObservable {
    constructor(observable) {
        this._isObservable = true;
        this._observable = observable;
    }
    static givenObservable(observable) {
        return new ReadOnlyObservable(observable);
    }
    get value() {
        return this._observable.value;
    }
    get didChange() {
        return this._observable.didChange;
    }
}
exports.ReadOnlyObservable = ReadOnlyObservable;
//# sourceMappingURL=index.js.map