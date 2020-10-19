"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const TypedEvent_1 = require("../TypedEvent");
class Observable {
    constructor(value, filter) {
        this.didChange = new TypedEvent_1.TypedEvent();
        this._isObservable = true;
        this.discardFilter = filter;
        if (value != null) {
            this.setValue(value);
        }
    }
    static isStrictEqual(newValue, oldValue) {
        return newValue === oldValue;
    }
    static isObservable(input) {
        if (input == null) {
            return false;
        }
        if (typeof input !== "object") {
            return false;
        }
        return input._isObservable === true;
    }
    static givenValue(value, discardFilter) {
        return new Observable(value, discardFilter);
    }
    static ofEmpty(discardFilter) {
        return new Observable(undefined, discardFilter);
    }
    static givenValueOrObservable(value, discardFilter) {
        if (Observable.isObservable(value)) {
            return value;
        }
        else {
            return Observable.givenValue(value, discardFilter);
        }
    }
    get value() {
        return this._value;
    }
    setValue(newValue) {
        let discard = false;
        if (this.discardFilter != null) {
            try {
                discard = this.discardFilter(newValue, this._value);
            }
            catch (err) {
                console.warn(err);
            }
        }
        if (discard) {
            return;
        }
        this._value = newValue;
        this.didChange.emit(newValue);
    }
}
exports.Observable = Observable;
//# sourceMappingURL=index.js.map