"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadOnlyObservableArray = void 0;
class ReadOnlyObservableArray {
    constructor(observableArray) {
        this._isObservableArray = true;
        this._observableArray = observableArray;
    }
    static givenObservableArray(observableArray) {
        return new ReadOnlyObservableArray(observableArray);
    }
    get count() {
        return this._observableArray.count;
    }
    get didChange() {
        return this._observableArray.didChange;
    }
    get didChangeSteps() {
        return this._observableArray.didChangeSteps;
    }
    hasValue(value) {
        return this._observableArray.hasValue(value);
    }
    toOptionalValueGivenIndex(index) {
        return this._observableArray.toOptionalValueGivenIndex(index);
    }
    toIndexOfValue(value, fromIndex) {
        return this._observableArray.toIndexOfValue(value, fromIndex);
    }
    toValues() {
        return this._observableArray.toValues();
    }
}
exports.ReadOnlyObservableArray = ReadOnlyObservableArray;
//# sourceMappingURL=index.js.map