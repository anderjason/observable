import { TypedEvent } from "../TypedEvent";
import { ObservableSet, ObservableSetChange, ObservableSetBase } from "../ObservableSet";
export declare class ReadOnlyObservableSet<T> implements ObservableSetBase<T> {
    static givenObservableSet<T>(observableSet: ObservableSet<T>): ReadOnlyObservableSet<T>;
    private _observableSet;
    private _isObservableSet;
    private constructor();
    get count(): number;
    hasValue(value: T): boolean;
    toSet(): Set<T>;
    toArray(): T[];
    get didChange(): TypedEvent<T[]>;
    get didChangeSteps(): TypedEvent<ObservableSetChange<T>[]>;
}
