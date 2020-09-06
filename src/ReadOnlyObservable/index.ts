import { TypedEvent } from "../TypedEvent";
import { Observable, ObservableBase } from "../Observable";

export class ReadOnlyObservable<T> implements ObservableBase<T> {
  static givenObservable<T>(observable: Observable<T>): ReadOnlyObservable<T> {
    return new ReadOnlyObservable<T>(observable);
  }

  private _observable: Observable<T>;
  private _isObservable = true;

  private constructor(observable: Observable<T>) {
    this._observable = observable;
  }

  get value(): T {
    return this._observable.value;
  }

  get didChange(): TypedEvent<T> {
    return this._observable.didChange;
  }
}
