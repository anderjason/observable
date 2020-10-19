import { TypedEvent } from "../TypedEvent";
export declare type ObservableFilter<T> = (newValue: T, oldValue: T) => boolean;
export interface ObservableBase<T> {
    readonly didChange: TypedEvent<T>;
    readonly value: T;
}
export declare class Observable<T = number> implements ObservableBase<T> {
    readonly didChange: TypedEvent<T>;
    readonly discardFilter: ObservableFilter<T> | undefined;
    static isStrictEqual<T>(newValue: T, oldValue: T): boolean;
    static isObservable(input: any): input is ObservableBase<unknown>;
    static givenValue<T>(value: T, discardFilter?: ObservableFilter<T>): Observable<T>;
    static ofEmpty<T>(discardFilter?: ObservableFilter<T>): Observable<T>;
    static givenValueOrObservable<T>(value: T | ObservableBase<T>, discardFilter?: ObservableFilter<T>): ObservableBase<T>;
    private _value;
    private _isObservable;
    private constructor();
    get value(): T;
    setValue(newValue: T): void;
}
