import { TypedEvent } from "../TypedEvent";
import { ObservableArray, ObservableArrayChange, ObservableArrayBase } from "../ObservableArray";
export declare class ReadOnlyObservableArray<T> implements ObservableArrayBase<T> {
    static givenObservableArray<T>(observableArray: ObservableArray<T>): ReadOnlyObservableArray<T>;
    private _observableArray;
    private _isObservableArray;
    private constructor();
    get count(): number;
    get didChange(): TypedEvent<T[]>;
    get didChangeSteps(): TypedEvent<ObservableArrayChange<T>[]>;
    hasValue(value: T): boolean;
    toOptionalValueGivenIndex(index: number): T | undefined;
    toIndexOfValue(value: T, fromIndex?: number): number;
    toValues(): T[];
}
