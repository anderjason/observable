import { TypedEvent } from "../TypedEvent";
export interface ObservableSetChange<T> {
    type: "add" | "remove";
    value: T;
}
export interface ObservableSetBase<T> {
    readonly didChange: TypedEvent<T[]>;
    readonly didChangeSteps: TypedEvent<ObservableSetChange<T>[]>;
    hasValue(value: T): boolean;
    toSet(): Set<T>;
    toArray(): T[];
}
export declare class ObservableSet<T> implements ObservableSetBase<T> {
    readonly didChange: TypedEvent<T[]>;
    readonly didChangeSteps: TypedEvent<ObservableSetChange<T>[]>;
    static ofEmpty<T>(): ObservableSet<T>;
    static givenValues<T>(values: T[] | Set<T>): ObservableSet<T>;
    static isObservableSet(input: any): input is ObservableSetBase<unknown>;
    private _set;
    private _isObservableSet;
    private constructor();
    get count(): number;
    addValue(value: T): boolean;
    removeValue(value: T): boolean;
    removeAllWhere(filter: (value: T) => boolean): void;
    sync(values: T[] | Set<T>): void;
    clear(): void;
    hasValue(value: T): boolean;
    toSet(): Set<T>;
    toArray(): T[];
}
