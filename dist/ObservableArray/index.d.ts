import { TypedEvent } from "../TypedEvent";
export interface ObservableArrayChange<T> {
    type: "add" | "remove" | "move";
    value?: T;
    newIndex?: number;
    oldIndex?: number;
}
export interface ObservableArrayBase<T> {
    readonly didChange: TypedEvent<T[]>;
    readonly didChangeSteps: TypedEvent<ObservableArrayChange<T>[]>;
    readonly count: number;
    hasValue(value: T, fromIndex?: number): boolean;
    toOptionalValueGivenIndex(index: number): T | undefined;
    toIndexOfValue(value: T, fromIndex?: number): number;
    toValues(): T[];
}
export declare class ObservableArray<T> implements ObservableArrayBase<T> {
    readonly didChange: TypedEvent<T[]>;
    readonly didChangeSteps: TypedEvent<ObservableArrayChange<T>[]>;
    static ofEmpty<T>(): ObservableArray<T>;
    static givenValues<T>(values: T[]): ObservableArray<T>;
    static isObservableArray(input: any): input is ObservableArrayBase<unknown>;
    private _array;
    private _isObservableArray;
    private constructor();
    get count(): number;
    forEach(fn: (value: T, index: number, array: T[]) => void): void;
    map<TO>(fn: (value: T, index: number, array: T[]) => TO[]): TO[][];
    addValue(value: T, index?: number): void;
    moveValueAtIndex(oldIndex: number, newIndex: number): void;
    replaceValueAtIndex: (index: number, value: T) => void;
    sync(input: T[]): void;
    private _internalMove;
    removeValue(value: T): void;
    removeValueAtIndex(index: number): void;
    removeAllWhere(filter: (value: T, index: number) => boolean): void;
    clear(): void;
    hasValue(value: T, fromIndex?: number): boolean;
    toOptionalValueGivenIndex(index: number): T | undefined;
    toIndexOfValue(value: T, fromIndex?: number): number;
    toValues(): T[];
}
