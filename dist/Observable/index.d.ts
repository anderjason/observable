import { SimpleEvent } from "../SimpleEvent";
export declare type ObservableFilter<T> = (newValue: T, oldValue: T) => boolean;
export interface ObservableBase<T> {
    readonly didChange: SimpleEvent<T>;
    readonly value: T;
}
export declare class Observable<T = number> implements ObservableBase<T> {
    readonly didChange: SimpleEvent<T>;
    readonly discardFilter: ObservableFilter<T> | undefined;
    static isStrictEqual<T>(newValue: T, oldValue: T): boolean;
    static isObservable(input: any): input is ObservableBase<unknown>;
    static givenValue<T>(value: T, discardFilter?: ObservableFilter<T>): Observable<T>;
    static ofEmpty<T>(discardFilter?: ObservableFilter<T>): Observable<T>;
    private _value;
    private _isObservable;
    private constructor();
    get value(): T;
    setValue(newValue: T): void;
    mutate(fn: (value: T) => void): void;
}
