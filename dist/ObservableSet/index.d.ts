import { SimpleEvent } from "../SimpleEvent";
export interface ObservableSetChange<T> {
    type: "add" | "remove";
    value: T;
}
export interface ObservableSetBase<T> {
    readonly didChange: SimpleEvent<T[]>;
    readonly didChangeSteps: SimpleEvent<ObservableSetChange<T>[]>;
    hasValue(value: T): boolean;
    toValues(): T[];
}
export declare class ObservableSet<T> implements ObservableSetBase<T> {
    readonly didChange: SimpleEvent<T[]>;
    readonly didChangeSteps: SimpleEvent<ObservableSetChange<T>[]>;
    static ofEmpty<T>(): ObservableSet<T>;
    static givenValues<T>(values: T[] | Set<T>): ObservableSet<T>;
    static isObservableSet(input: any): input is ObservableSetBase<unknown>;
    private _set;
    private _isObservableSet;
    private constructor();
    get count(): number;
    addValue(value: T): boolean;
    removeValue(value: T): boolean;
    clear(): void;
    hasValue(value: T): boolean;
    toValues(): T[];
}
