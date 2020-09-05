import { SimpleEvent } from "../SimpleEvent";
export interface ObservableDictChange<T = unknown> {
    type: "add" | "remove" | "update";
    key: string;
    oldValue?: T;
    newValue?: T;
}
export interface Dict<T = unknown> {
    [key: string]: T;
}
export declare function dictGivenObject(obj: any): Dict<unknown>;
export interface ObservableDictBase<T = unknown> {
    readonly didChange: SimpleEvent<Dict<T>>;
    readonly didChangeSteps: SimpleEvent<ObservableDictChange<T>[]>;
    hasKey(key: string): boolean;
    toOptionalValueGivenKey(key: string): T;
    toKeys(): Set<string>;
    toValues(): Dict<T>;
}
export declare class ObservableDict<T = unknown> implements ObservableDictBase<T> {
    readonly didChange: SimpleEvent<Dict<T>>;
    readonly didChangeSteps: SimpleEvent<ObservableDictChange<T>[]>;
    static ofEmpty<T>(): ObservableDict<T>;
    static givenValues<T>(values: Dict<T>): ObservableDict<T>;
    static isObservableDict(input: any): input is ObservableDictBase<unknown>;
    private _map;
    private _isObservableDict;
    private constructor();
    get count(): number;
    setValue(key: string, value: T): void;
    removeKey(key: string): void;
    clear(): void;
    sync(input: Dict<T>): void;
    hasKey(key: string): boolean;
    toOptionalValueGivenKey(key: string): T | undefined;
    toKeys(): Set<string>;
    toValues(): Dict<T>;
}
