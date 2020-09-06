import { TypedEvent } from "../TypedEvent";
import {
  ObservableArray,
  ObservableArrayChange,
  ObservableArrayBase,
} from "../ObservableArray";

export class ReadOnlyObservableArray<T> implements ObservableArrayBase<T> {
  static givenObservableArray<T>(
    observableArray: ObservableArray<T>
  ): ReadOnlyObservableArray<T> {
    return new ReadOnlyObservableArray<T>(observableArray);
  }

  private _observableArray: ObservableArray<T>;
  private _isObservableArray = true;

  private constructor(observableArray: ObservableArray<T>) {
    this._observableArray = observableArray;
  }

  get count(): number {
    return this._observableArray.count;
  }

  get didChange(): TypedEvent<T[]> {
    return this._observableArray.didChange;
  }

  get didChangeSteps(): TypedEvent<ObservableArrayChange<T>[]> {
    return this._observableArray.didChangeSteps;
  }

  hasValue(value: T): boolean {
    return this._observableArray.hasValue(value);
  }

  toOptionalValueGivenIndex(index: number): T | undefined {
    return this._observableArray.toOptionalValueGivenIndex(index);
  }

  toIndexOfValue(value: T, fromIndex?: number): number {
    return this._observableArray.toIndexOfValue(value, fromIndex);
  }

  toValues(): T[] {
    return this._observableArray.toValues();
  }
}
