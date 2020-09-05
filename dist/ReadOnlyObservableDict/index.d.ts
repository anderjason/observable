import { SimpleEvent } from "../SimpleEvent";
import { ObservableDict, ObservableDictChange, ObservableDictBase, Dict } from "../ObservableDict";
export declare class ReadOnlyObservableDict<T = unknown> implements ObservableDictBase<T> {
    static givenObservableDict<T>(observableDict: ObservableDict<T>): ReadOnlyObservableDict<T>;
    private _observableDict;
    private _isObservableDict;
    private constructor();
    get count(): number;
    get didChange(): SimpleEvent<Dict<T>>;
    get didChangeSteps(): SimpleEvent<ObservableDictChange<T>[]>;
    hasKey(key: string): boolean;
    toOptionalValueGivenKey(key: string): T | undefined;
    toKeys(): Set<string>;
    toValues(): Dict<T>;
}
