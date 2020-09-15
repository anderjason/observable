import { TypedEvent } from "../TypedEvent";
import { SetUtil } from "@anderjason/util";

export interface ObservableSetChange<T> {
  type: "add" | "remove";
  value: T;
}

export interface ObservableSetBase<T> {
  readonly didChange: TypedEvent<T[]>;
  readonly didChangeSteps: TypedEvent<ObservableSetChange<T>[]>;

  hasValue(value: T): boolean;
  toSet(): Set<T>;
  toArray(): T[];
}

export class ObservableSet<T> implements ObservableSetBase<T> {
  readonly didChange = new TypedEvent<T[]>();
  readonly didChangeSteps = new TypedEvent<ObservableSetChange<T>[]>();

  static ofEmpty<T>(): ObservableSet<T> {
    return new ObservableSet(new Set());
  }

  static givenValues<T>(values: T[] | Set<T>): ObservableSet<T> {
    return new ObservableSet(new Set(values));
  }

  static isObservableSet(input: any): input is ObservableSetBase<unknown> {
    if (input == null) {
      return false;
    }

    if (typeof input !== "object") {
      return false;
    }

    return input._isObservableSet === true;
  }

  private _set: Set<T>;
  private _isObservableSet = true;

  private constructor(values: Set<T>) {
    this._set = values;
  }

  get count(): number {
    return this._set.size;
  }

  addValue(value: T): boolean {
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

  removeValue(value: T): boolean {
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

  removeAllWhere(filter: (value: T) => boolean): void {
    if (filter == null) {
      throw new Error("Filter is required");
    }

    const updates: ObservableSetChange<T>[] = [];

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

  sync(values: T[] | Set<T>): void {
    if (values == null) {
      this.clear();
      return;
    }

    const newSet = new Set(values);

    const updates: ObservableSetChange<T>[] = [];

    const diff = SetUtil.differenceGivenSets(this._set, newSet);

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

  clear(): void {
    const values = this.toSet();

    this._set.clear();

    const updates: ObservableSetChange<T>[] = [];

    values.forEach((value) => {
      updates.push({
        type: "remove",
        value,
      });
    });

    this.didChange.emit(Array.from(this._set));
    this.didChangeSteps.emit(updates);
  }

  hasValue(value: T): boolean {
    return this._set.has(value);
  }

  toSet(): Set<T> {
    return new Set(this._set);
  }

  toArray(): T[] {
    return Array.from(this._set);
  }
}
