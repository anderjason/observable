import { ObservableBase } from "../Observable";
import { asyncGivenObservable } from "../Observable/_internal/asyncGivenObservable";
import { TypedEvent } from "../TypedEvent";

export class ReadOnlyObservable<T> implements ObservableBase<T> {
  static givenObservable<T>(
    observable: ObservableBase<T>
  ): ReadOnlyObservable<T> {
    return new ReadOnlyObservable<T>(observable);
  }

  private _observable: ObservableBase<T>;
  private _isObservable = true;

  private constructor(observable: ObservableBase<T>) {
    this._observable = observable;
  }

  get value(): T {
    return this._observable.value;
  }

  get didChange(): TypedEvent<T> {
    return this._observable.didChange;
  }

  toPromise(filter?: (value: T) => boolean): Promise<T> {
    return asyncGivenObservable({
      observable: this,
      filter,
    });
  }
}
