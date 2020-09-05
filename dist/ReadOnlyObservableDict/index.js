"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadOnlyObservableDict = void 0;
class ReadOnlyObservableDict {
    constructor(observableDict) {
        this._isObservableDict = true;
        this._observableDict = observableDict;
    }
    static givenObservableDict(observableDict) {
        return new ReadOnlyObservableDict(observableDict);
    }
    get count() {
        return this._observableDict.count;
    }
    get didChange() {
        return this._observableDict.didChange;
    }
    get didChangeSteps() {
        return this._observableDict.didChangeSteps;
    }
    hasKey(key) {
        return this._observableDict.hasKey(key);
    }
    toOptionalValueGivenKey(key) {
        return this._observableDict.toOptionalValueGivenKey(key);
    }
    toKeys() {
        return this._observableDict.toKeys();
    }
    toValues() {
        return this._observableDict.toValues();
    }
}
exports.ReadOnlyObservableDict = ReadOnlyObservableDict;
//# sourceMappingURL=index.js.map