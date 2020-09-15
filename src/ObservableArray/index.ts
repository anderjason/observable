import { ArrayUtil } from "@anderjason/util";
import { TypedEvent } from "../TypedEvent";

export interface ObservableArrayChange<T> {
  type: "add" | "remove" | "move";
  value?: T;
  newIndex?: number;
  oldIndex?: number;
}

export interface ObservableArrayBase<T> {
  readonly didChange: TypedEvent<T[]>;
  readonly didChangeSteps: TypedEvent<ObservableArrayChange<T>[]>;

  hasValue(value: T, fromIndex?: number): boolean;
  toOptionalValueGivenIndex(index: number): T | undefined;
  toIndexOfValue(value: T, fromIndex?: number): number;
  toValues(): T[];
}

export class ObservableArray<T> implements ObservableArrayBase<T> {
  readonly didChange = new TypedEvent<T[]>();
  readonly didChangeSteps = new TypedEvent<ObservableArrayChange<T>[]>();

  static ofEmpty<T>(): ObservableArray<T> {
    return new ObservableArray([]);
  }

  static givenValues<T>(values: T[]): ObservableArray<T> {
    return new ObservableArray([...values]);
  }

  static isObservableArray(input: any): input is ObservableArrayBase<unknown> {
    if (input == null) {
      return false;
    }

    if (typeof input !== "object") {
      return false;
    }

    return input._isObservableArray === true;
  }

  private _array: T[];
  private _isObservableArray = true;

  private constructor(values: T[]) {
    this._array = values;
  }

  get count(): number {
    return this._array.length;
  }

  forEach(fn: (value: T, index: number, array: T[]) => void) {
    this._array.forEach(fn);
  }

  map<TO>(fn: (value: T, index: number, array: T[]) => TO[]) {
    return this._array.map(fn);
  }

  addValue(value: T, index?: number): void {
    const newIndex: number = index != null ? index : this._array.length;

    const updates: ObservableArrayChange<T>[] = this._array
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

  moveValueAtIndex(oldIndex: number, newIndex: number): void {
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

    const changes: ObservableArrayChange<T>[] = [];

    const minIndex = Math.min(oldIndex, newIndex);
    const maxIndex = Math.max(oldIndex, newIndex);

    let offset: number;
    if (oldIndex < newIndex) {
      offset = -1;
    } else {
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
      } else {
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

  replaceValueAtIndex = (index: number, value: T): void => {
    if (index < 0) {
      throw new Error("Index cannot be negative");
    }

    const oldValue = this._array[index];

    if (oldValue === value && oldValue != null) {
      return;
    }

    const updates: ObservableArrayChange<T>[] = [];

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

  sync(input: T[]): void {
    if (input == null || input.length === 0) {
      this.clear();
      return;
    }

    let adds: ObservableArrayChange<T>[] = [];
    let removes: ObservableArrayChange<T>[] = [];
    let moves: ObservableArrayChange<T>[] = [];

    input.forEach((newValue, idx) => {
      if (this._array[idx] !== newValue) {
        if (this._array[idx] != null) {
          removes.push({
            type: "remove",
            oldIndex: idx,
            value: this._array[idx],
          });
        }

        adds.push({
          type: "add",
          newIndex: idx,
          value: newValue,
        });
      }
    });

    for (let i = input.length; i < this._array.length; i++) {
      removes.push({
        type: "remove",
        oldIndex: i,
        value: this._array[i],
      });
    }

    Array.from(removes).forEach((remove) => {
      if (remove.value == null) {
        return;
      }

      const matchingAdd = adds.find((add) => add.value === remove.value);
      if (matchingAdd != null) {
        removes = ArrayUtil.arrayWithoutValue(removes, remove);
        adds = ArrayUtil.arrayWithoutValue(adds, matchingAdd);

        moves.push({
          type: "move",
          oldIndex: remove.oldIndex,
          newIndex: matchingAdd.newIndex,
          value: remove.value,
        });
      }
    });

    const updates = [...removes, ...moves, ...adds];

    this._array = [...input];

    this.didChange.emit(this.toValues());
    this.didChangeSteps.emit(updates);
  }

  private _internalMove = (oldIndex: number, newIndex: number): void => {
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

  removeValue(value: T): void {
    this.removeAllWhere((v) => v === value);
  }

  removeValueAtIndex(index: number): void {
    this.removeAllWhere((v, i) => i === index);
  }

  removeAllWhere(filter: (value: T, index: number) => boolean): void {
    if (filter == null) {
      throw new Error("Filter is required");
    }

    const updates: ObservableArrayChange<T>[] = [];

    let removedCount: number = 0;
    this._array.forEach((v, i) => {
      const isMatch = filter(v, i);
      if (isMatch) {
        updates.push({
          type: "remove",
          value: this._array[i],
          oldIndex: i,
        });
        removedCount += 1;
      } else {
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

    const reversedUpdates = ArrayUtil.arrayWithReversedOrder(updates);

    reversedUpdates.forEach((update) => {
      if (update.type === "remove") {
        this._array.splice(update.oldIndex, 1);
      }
    });

    this.didChange.emit([...this._array]);
    this.didChangeSteps.emit(updates);
  }

  clear(): void {
    const updates = this._array.map((v, i) => {
      return {
        type: "remove",
        value: v,
        oldIndex: i,
      } as ObservableArrayChange<T>;
    });

    this._array = [];

    this.didChange.emit([...this._array]);
    this.didChangeSteps.emit(updates);
  }

  hasValue(value: T, fromIndex?: number): boolean {
    return this._array.indexOf(value, fromIndex) !== -1;
  }

  toOptionalValueGivenIndex(index: number): T | undefined {
    return this._array[index];
  }

  toIndexOfValue(value: T, fromIndex?: number): number {
    return this._array.indexOf(value, fromIndex);
  }

  toValues(): T[] {
    return Array.from(this._array);
  }
}
