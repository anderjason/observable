import { SimpleEvent } from "../SimpleEvent";

export type ObservableFilter<T> = (newValue: T, oldValue: T) => boolean;

export interface ObservableBase<T> {
  readonly didChange: SimpleEvent<T>;
  readonly value: T;
}

export class Observable<T = number> implements ObservableBase<T> {
  readonly didChange = SimpleEvent.ofEmpty<T>();
  readonly discardFilter: ObservableFilter<T> | undefined;

  static isStrictEqual<T>(newValue: T, oldValue: T): boolean {
    return newValue === oldValue;
  }

  static isObservable(input: any): input is ObservableBase<unknown> {
    if (input == null) {
      return false;
    }

    if (typeof input !== "object") {
      return false;
    }

    return input._isObservable === true;
  }

  static givenValue<T>(
    value: T,
    discardFilter?: ObservableFilter<T>
  ): Observable<T> {
    return new Observable<T>(value, discardFilter);
  }

  static ofEmpty<T>(discardFilter?: ObservableFilter<T>): Observable<T> {
    return new Observable<T>(undefined, discardFilter);
  }

  private _value: T;
  private _isObservable = true;

  private constructor(value?: T, filter?: ObservableFilter<T>) {
    this.discardFilter = filter;

    if (value != null) {
      this.setValue(value);
    }
  }

  get value(): T {
    return this._value;
  }

  setValue(newValue: T): void {
    let discard: boolean = false;

    if (this.discardFilter != null) {
      try {
        discard = this.discardFilter(newValue, this._value);
      } catch (err) {
        console.warn(err);
      }
    }

    if (discard) {
      return;
    }

    this._value = newValue;
    this.didChange.emit(newValue);
  }

  mutate(fn: (value: T) => void): void {
    fn(this.value);
    this.didChange.emit(this.value);
  }
}
