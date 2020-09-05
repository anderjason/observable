"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const SimpleEvent_1 = require("../SimpleEvent");
class Observable {
    constructor(value, filter) {
        this.didChange = SimpleEvent_1.SimpleEvent.ofEmpty();
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
    mutate(fn) {
        fn(this.value);
        this.didChange.emit(this.value);
    }
}
exports.Observable = Observable;
//# sourceMappingURL=index.js.map