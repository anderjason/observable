import { SimpleEvent } from "../SimpleEvent";

export interface ObservableSetChange<T> {
  type: "add" | "remove";
  value: T;
}

export interface ObservableSetBase<T> {
  readonly didChange: SimpleEvent<T[]>;
  readonly didChangeSteps: SimpleEvent<ObservableSetChange<T>[]>;

  hasValue(value: T): boolean;
  toValues(): T[];
}

export class ObservableSet<T> implements ObservableSetBase<T> {
  readonly didChange = SimpleEvent.ofEmpty<T[]>();
  readonly didChangeSteps = SimpleEvent.ofEmpty<ObservableSetChange<T>[]>();

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

  clear(): void {
    const values = this.toValues();

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

  toValues(): T[] {
    return Array.from(this._set);
  }
}
