import { TypedEvent } from "../TypedEvent";

export interface ObservableDictChange<T = unknown> {
  type: "add" | "remove" | "update";
  key: string;
  oldValue?: T;
  newValue?: T;
}

export interface Dict<T = unknown> {
  [key: string]: T;
}

export function dictGivenObject(obj: any): Dict<unknown> {
  if (obj == null) {
    throw new Error("Object is required");
  }

  const result: Dict<unknown> = {};

  Object.keys(obj).forEach((key) => {
    result[String(key)] = obj[key];
  });

  return result;
}

export interface ObservableDictBase<T = unknown> {
  readonly didChange: TypedEvent<Dict<T>>;
  readonly didChangeSteps: TypedEvent<ObservableDictChange<T>[]>;

  hasKey(key: string): boolean;
  toOptionalValueGivenKey(key: string): T;
  toKeys(): Set<string>;
  toValues(): Dict<T>;
}

export class ObservableDict<T = unknown> implements ObservableDictBase<T> {
  readonly didChange = new TypedEvent<Dict<T>>();
  readonly didChangeSteps = new TypedEvent<ObservableDictChange<T>[]>();

  static ofEmpty<T>(): ObservableDict<T> {
    return new ObservableDict({});
  }

  static givenValues<T>(values: Dict<T>): ObservableDict<T> {
    return new ObservableDict(values);
  }

  static isObservableDict(input: any): input is ObservableDictBase<unknown> {
    if (input == null) {
      return false;
    }

    if (typeof input !== "object") {
      return false;
    }

    return input._isObservableDict === true;
  }

  private _map: Map<string, T>;
  private _isObservableDict = true;

  private constructor(dict: Dict<T>) {
    this._map = new Map();

    Object.keys(dict).forEach((key) => {
      this._map.set(key, dict[key]);
    });
  }

  get count(): number {
    return this._map.size;
  }

  setValue(key: string, value: T): void {
    const updates: ObservableDictChange<T>[] = [];

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
    } else {
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

  removeKey(key: string): void {
    if (!this._map.has(key)) {
      return;
    }

    const updates: ObservableDictChange<T>[] = [
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

  clear(): void {
    const updates: ObservableDictChange<T>[] = [];

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

  sync(input: Dict<T>): void {
    if (input == null) {
      this.clear();
      return;
    }

    const updates: ObservableDictChange<T>[] = [];

    Object.keys(input).forEach((key) => {
      if (this._map.has(key)) {
        updates.push({
          type: "update",
          key,
          oldValue: this._map.get(key),
          newValue: input[key],
        });
      } else {
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

  hasKey(key: string): boolean {
    return this._map.has(key);
  }

  toOptionalValueGivenKey(key: string): T | undefined {
    return this._map.get(key);
  }

  toKeys(): Set<string> {
    return new Set(this._map.keys());
  }

  toValues(): Dict<T> {
    const dict: Dict<T> = {};
    for (let [key, value] of this._map) {
      dict[key] = value;
    }
    return dict;
  }
}
