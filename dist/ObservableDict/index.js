"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDict = exports.dictGivenObject = void 0;
const SimpleEvent_1 = require("../SimpleEvent");
function dictGivenObject(obj) {
    if (obj == null) {
        throw new Error("Object is required");
    }
    const result = {};
    Object.keys(obj).forEach((key) => {
        result[String(key)] = obj[key];
    });
    return result;
}
exports.dictGivenObject = dictGivenObject;
class ObservableDict {
    constructor(dict) {
        this.didChange = SimpleEvent_1.SimpleEvent.ofEmpty();
        this.didChangeSteps = SimpleEvent_1.SimpleEvent.ofEmpty();
        this._isObservableDict = true;
        this._map = new Map();
        Object.keys(dict).forEach((key) => {
            this._map.set(key, dict[key]);
        });
    }
    static ofEmpty() {
        return new ObservableDict({});
    }
    static givenValues(values) {
        return new ObservableDict(values);
    }
    static isObservableDict(input) {
        if (input == null) {
            return false;
        }
        if (typeof input !== "object") {
            return false;
        }
        return input._isObservableDict === true;
    }
    get count() {
        return this._map.size;
    }
    setValue(key, value) {
        const updates = [];
        if (this._map.has(key)) {
            const oldValue = this._map.get(key);
            if (oldValue === value) {
                return;
            }
            updates.push({
                type: "update",
                key,
                oldValue,
                newValue: value,
            });
        }
        else {
            updates.push({
                type: "add",
                key,
                newValue: value,
            });
        }
        this._map.set(key, value);
        this.didChange.emit(this.toValues());
        this.didChangeSteps.emit(updates);
    }
    removeKey(key) {
        if (!this._map.has(key)) {
            return;
        }
        const updates = [
            {
                type: "remove",
                key,
                oldValue: this._map.get(key),
            },
        ];
        this._map.delete(key);
        this.didChange.emit(this.toValues());
        this.didChangeSteps.emit(updates);
    }
    clear() {
        const updates = [];
        for (let [k, v] of this._map) {
            updates.push({
                type: "remove",
                key: k,
                oldValue: v,
            });
        }
        this._map.clear();
        this.didChange.emit({});
        this.didChangeSteps.emit(updates);
    }
    sync(input) {
        if (input == null) {
            this.clear();
            return;
        }
        const updates = [];
        Object.keys(input).forEach((key) => {
            if (this._map.has(key)) {
                updates.push({
                    type: "update",
                    key,
                    oldValue: this._map.get(key),
                    newValue: input[key],
                });
            }
            else {
                updates.push({
                    type: "add",
                    key,
                    newValue: input[key],
                });
            }
            this._map.set(key, input[key]);
        });
        const inputKeys = new Set(Object.keys(input));
        for (let key of this._map.keys()) {
            if (!inputKeys.has(key)) {
                updates.push({
                    type: "remove",
                    key,
                    oldValue: this._map.get(key),
                });
                this._map.delete(key);
            }
        }
        this.didChange.emit(this.toValues());
        this.didChangeSteps.emit(updates);
    }
    hasKey(key) {
        return this._map.has(key);
    }
    toOptionalValueGivenKey(key) {
        return this._map.get(key);
    }
    toKeys() {
        return new Set(this._map.keys());
    }
    toValues() {
        const dict = {};
        for (let [key, value] of this._map) {
            dict[key] = value;
        }
        return dict;
    }
}
exports.ObservableDict = ObservableDict;
//# sourceMappingURL=index.js.map