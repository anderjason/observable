"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadOnlyObservableSet = void 0;
class ReadOnlyObservableSet {
    constructor(observableSet) {
        this._isObservableSet = true;
        this._observableSet = observableSet;
    }
    static givenObservableSet(observableSet) {
        return new ReadOnlyObservableSet(observableSet);
    }
    get count() {
        return this._observableSet.count;
    }
    hasValue(value) {
        return this._observableSet.hasValue(value);
    }
    toSet() {
        return this._observableSet.toSet();
    }
    toArray() {
        return this._observableSet.toArray();
    }
    get didChange() {
        return this._observableSet.didChange;
    }
    get didChangeSteps() {
        return this._observableSet.didChangeSteps;
    }
}
exports.ReadOnlyObservableSet = ReadOnlyObservableSet;
//# sourceMappingURL=index.js.map