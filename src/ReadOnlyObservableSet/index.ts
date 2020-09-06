import { TypedEvent } from "../TypedEvent";
import {
  ObservableSet,
  ObservableSetChange,
  ObservableSetBase,
} from "../ObservableSet";

export class ReadOnlyObservableSet<T> implements ObservableSetBase<T> {
  static givenObservableSet<T>(
    observableSet: ObservableSet<T>
  ): ReadOnlyObservableSet<T> {
    return new ReadOnlyObservableSet<T>(observableSet);
  }

  private _observableSet: ObservableSet<T>;
  private _isObservableSet = true;

  private constructor(observableSet: ObservableSet<T>) {
    this._observableSet = observableSet;
  }

  get count(): number {
    return this._observableSet.count;
  }

  hasValue(value: T): boolean {
    return this._observableSet.hasValue(value);
  }

  toSet(): Set<T> {
    return this._observableSet.toSet();
  }

  toArray(): T[] {
    return this._observableSet.toArray();
  }

  get didChange(): TypedEvent<T[]> {
    return this._observableSet.didChange;
  }

  get didChangeSteps(): TypedEvent<ObservableSetChange<T>[]> {
    return this._observableSet.didChangeSteps;
  }
}
