import { TypedEvent } from "../TypedEvent";
import { ObservableDictChange, ObservableDictBase, Dict } from "../ObservableDict";
export declare class ReadOnlyObservableDict<T = unknown> implements ObservableDictBase<T> {
    static givenObservableDict<T>(observableDict: ObservableDictBase<T>): ReadOnlyObservableDict<T>;
    private _observableDict;
    private _isObservableDict;
    private constructor();
    get count(): number;
    get didChange(): TypedEvent<Dict<T>>;
    get didChangeSteps(): TypedEvent<ObservableDictChange<T>[]>;
    hasKey(key: string): boolean;
    toOptionalValueGivenKey(key: string): T | undefined;
    toKeys(): Set<string>;
    toValues(): Dict<T>;
}
