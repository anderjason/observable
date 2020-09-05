import { SimpleEvent } from "../SimpleEvent";
import { Observable, ObservableBase } from "../Observable";
export declare class ReadOnlyObservable<T> implements ObservableBase<T> {
    static givenObservable<T>(observable: Observable<T>): ReadOnlyObservable<T>;
    private _observable;
    private _isObservable;
    private constructor();
    get value(): T;
    get didChange(): SimpleEvent<T>;
}
