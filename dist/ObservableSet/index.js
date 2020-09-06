"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableSet = void 0;
const TypedEvent_1 = require("../TypedEvent");
const util_1 = require("@anderjason/util");
class ObservableSet {
    constructor(values) {
        this.didChange = TypedEvent_1.TypedEvent.ofEmpty();
        this.didChangeSteps = TypedEvent_1.TypedEvent.ofEmpty();
        this._isObservableSet = true;
        this._set = values;
    }
    static ofEmpty() {
        return new ObservableSet(new Set());
    }
    static givenValues(values) {
        return new ObservableSet(new Set(values));
    }
    static isObservableSet(input) {
        if (input == null) {
            return false;
        }
        if (typeof input !== "object") {
            return false;
        }
        return input._isObservableSet === true;
    }
    get count() {
        return this._set.size;
    }
    addValue(value) {
        if (this._set.has(value)) {
            return false;
        }
        this._set.add(value);
        this.didChange.emit(Array.from(this._set));
        this.didChangeSteps.emit([
            {
                type: "add",
                value,
            },
        ]);
        return true;
    }
    removeValue(value) {
        if (!this._set.has(value)) {
            return false;
        }
        this._set.delete(value);
        this.didChange.emit(Array.from(this._set));
        this.didChangeSteps.emit([
            {
                type: "remove",
                value,
            },
        ]);
        return true;
    }
    removeAllWhere(filter) {
        if (filter == null) {
            throw new Error("Filter is required");
        }
        const updates = [];
        Array.from(this._set).forEach((v) => {
            const isMatch = filter(v);
            if (isMatch) {
                this._set.delete(v);
                updates.push({
                    type: "remove",
                    value: v,
                });
            }
        });
        this.didChange.emit(Array.from(this._set));
        this.didChangeSteps.emit(updates);
    }
    sync(values) {
        if (values == null) {
            this.clear();
            return;
        }
        const newSet = new Set(values);
        const updates = [];
        const diff = util_1.SetUtil.differenceGivenSets(this._set, newSet);
        diff.addedItems.forEach((value) => {
            updates.push({
                type: "add",
                value,
            });
        });
        diff.removedItems.forEach((value) => {
            updates.push({
                type: "remove",
                value,
            });
        });
        this._set = newSet;
        this.didChange.emit(Array.from(this._set));
        this.didChangeSteps.emit(updates);
    }
    clear() {
        const values = this.toSet();
        this._set.clear();
        const updates = [];
        values.forEach((value) => {
            updates.push({
                type: "remove",
                value,
            });
        });
        this.didChange.emit(Array.from(this._set));
        this.didChangeSteps.emit(updates);
    }
    hasValue(value) {
        return this._set.has(value);
    }
    toSet() {
        return new Set(this._set);
    }
    toArray() {
        return Array.from(this._set);
    }
}
exports.ObservableSet = ObservableSet;
//# sourceMappingURL=index.js.map