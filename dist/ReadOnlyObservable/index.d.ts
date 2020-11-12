import { ObservableBase } from "../Observable";
import { TypedEvent } from "../TypedEvent";
export declare class ReadOnlyObservable<T> implements ObservableBase<T> {
    static givenObservable<T>(observable: ObservableBase<T>): ReadOnlyObservable<T>;
    private _observable;
    private _isObservable;
    private constructor();
    get value(): T;
    get didChange(): TypedEvent<T>;
}
