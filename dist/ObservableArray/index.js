"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableArray = void 0;
const util_1 = require("@anderjason/util");
const SimpleEvent_1 = require("../SimpleEvent");
class ObservableArray {
    constructor(values) {
        this.didChange = SimpleEvent_1.SimpleEvent.ofEmpty();
        this.didChangeSteps = SimpleEvent_1.SimpleEvent.ofEmpty();
        this._isObservableArray = true;
        this.replaceValueAtIndex = (index, value) => {
            if (index < 0) {
                throw new Error("Index cannot be negative");
            }
            const oldValue = this._array[index];
            if (oldValue === value) {
                return;
            }
            const updates = [];
            if (oldValue != null) {
                updates.push({
                    type: "remove",
                    value: oldValue,
                    oldIndex: index,
                });
            }
            this._array.splice(index, 1, value);
            updates.push({
                type: "add",
                value,
                newIndex: index,
            });
            this.didChange.emit([...this._array]);
            this.didChangeSteps.emit(updates);
        };
        this._internalMove = (oldIndex, newIndex) => {
            while (oldIndex < 0) {
                oldIndex += this._array.length;
            }
            while (newIndex < 0) {
                newIndex += this._array.length;
            }
            if (newIndex >= this._array.length) {
                var k = newIndex - this._array.length + 1;
                while (k--) {
                    this._array.push(undefined);
                }
            }
            this._array.splice(newIndex, 0, this._array.splice(oldIndex, 1)[0]);
        };
        this._array = values;
    }
    static ofEmpty() {
        return new ObservableArray([]);
    }
    static givenValues(values) {
        return new ObservableArray([...values]);
    }
    static isObservableArray(input) {
        if (input == null) {
            return false;
        }
        if (typeof input !== "object") {
            return false;
        }
        return input._isObservableArray === true;
    }
    get count() {
        return this._array.length;
    }
    forEach(fn) {
        this._array.forEach(fn);
    }
    map(fn) {
        return this._array.map(fn);
    }
    addValue(value, index) {
        const newIndex = index != null ? index : this._array.length;
        const updates = this._array
            .slice(newIndex)
            .map((v, i) => {
            return {
                type: "move",
                value: v,
                oldIndex: newIndex + i,
                newIndex: newIndex + i + 1,
            };
        });
        this._array.splice(newIndex, 0, value);
        updates.push({
            type: "add",
            value,
            newIndex,
        });
        this.didChange.emit([...this._array]);
        this.didChangeSteps.emit(updates);
    }
    moveValueAtIndex(oldIndex, newIndex) {
        if (oldIndex === newIndex) {
            return;
        }
        while (oldIndex < 0) {
            oldIndex += this._array.length;
        }
        while (newIndex < 0) {
            newIndex += this._array.length;
        }
        const value = this._array[oldIndex];
        const changes = [];
        const minIndex = Math.min(oldIndex, newIndex);
        const maxIndex = Math.max(oldIndex, newIndex);
        let offset;
        if (oldIndex < newIndex) {
            offset = -1;
        }
        else {
            offset = 1;
        }
        for (let i = minIndex; i <= maxIndex; i++) {
            if (i === oldIndex) {
                changes.push({
                    type: "move",
                    value,
                    oldIndex,
                    newIndex,
                });
            }
            else {
                if (this._array[i] != null) {
                    changes.push({
                        type: "move",
                        value: this._array[i],
                        oldIndex: i,
                        newIndex: i + offset,
                    });
                }
            }
        }
        this._internalMove(oldIndex, newIndex);
        this.didChange.emit([...this._array]);
        this.didChangeSteps.emit(changes);
    }
    removeValue(value) {
        this.removeAllWhere((v) => v === value);
    }
    removeValueAtIndex(index) {
        this.removeAllWhere((v, i) => i === index);
    }
    removeAllWhere(filter) {
        if (filter == null) {
            throw new Error("Filter is required");
        }
        const updates = [];
        let removedCount = 0;
        this._array.forEach((v, i) => {
            const isMatch = filter(v, i);
            if (isMatch) {
                updates.push({
                    type: "remove",
                    value: this._array[i],
                    oldIndex: i,
                });
                removedCount += 1;
            }
            else {
                if (removedCount > 0) {
                    updates.push({
                        type: "move",
                        value: this._array[i],
                        oldIndex: i,
                        newIndex: i - removedCount,
                    });
                }
            }
        });
        const reversedUpdates = util_1.ArrayUtil.arrayWithReversedOrder(updates);
        reversedUpdates.forEach((update) => {
            if (update.type === "remove") {
                this._array.splice(update.oldIndex, 1);
            }
        });
        this.didChange.emit([...this._array]);
        this.didChangeSteps.emit(updates);
    }
    clear() {
        const updates = this._array.map((v, i) => {
            return {
                type: "remove",
                value: v,
                oldIndex: i,
            };
        });
        this._array = [];
        this.didChange.emit([...this._array]);
        this.didChangeSteps.emit(updates);
    }
    hasValue(value, fromIndex) {
        return this._array.indexOf(value, fromIndex) !== -1;
    }
    toOptionalValueGivenIndex(index) {
        return this._array[index];
    }
    toIndexOfValue(value, fromIndex) {
        return this._array.indexOf(value, fromIndex);
    }
    toValues() {
        return Array.from(this._array);
    }
}
exports.ObservableArray = ObservableArray;
//# sourceMappingURL=index.js.map