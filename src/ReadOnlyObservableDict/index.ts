import { TypedEvent } from "../TypedEvent";
import {
  ObservableDict,
  ObservableDictChange,
  ObservableDictBase,
  Dict,
} from "../ObservableDict";

export class ReadOnlyObservableDict<T = unknown>
  implements ObservableDictBase<T> {
  static givenObservableDict<T>(
    observableDict: ObservableDictBase<T>
  ): ReadOnlyObservableDict<T> {
    return new ReadOnlyObservableDict<T>(observableDict);
  }

  private _observableDict: ObservableDictBase<T>;
  private _isObservableDict = true;

  private constructor(observableDict: ObservableDictBase<T>) {
    this._observableDict = observableDict;
  }

  get count(): number {
    return this._observableDict.count;
  }

  get didChange(): TypedEvent<Dict<T>> {
    return this._observableDict.didChange;
  }

  get didChangeSteps(): TypedEvent<ObservableDictChange<T>[]> {
    return this._observableDict.didChangeSteps;
  }

  hasKey(key: string): boolean {
    return this._observableDict.hasKey(key);
  }

  toOptionalValueGivenKey(key: string): T | undefined {
    return this._observableDict.toOptionalValueGivenKey(key);
  }

  toKeys(): Set<string> {
    return this._observableDict.toKeys();
  }

  toValues(): Dict<T> {
    return this._observableDict.toValues();
  }
}
