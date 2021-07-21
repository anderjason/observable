import { Receipt } from "../Receipt";
export declare type TypedEventSubscription<T> = (newValue: T, oldValue?: T) => void | Promise<void>;
export interface TypedEventPromiseTimeout {
    durationMs: number;
    behavior: "resolve" | "reject";
}
export interface TypedEventPromiseParams<T> {
    event: TypedEvent<T>;
    timeout?: TypedEventPromiseTimeout;
    filter?: (value: T) => boolean;
}
export declare class TypedEvent<T = void> {
    private _subscriptions;
    private _lastValue?;
    constructor(lastValue?: T);
    subscribe(subscription: TypedEventSubscription<T>, includeLast?: boolean): Receipt;
    emit(newValue: T): Promise<void>;
    toPromise(params?: TypedEventPromiseParams<T>): Promise<T>;
    private unsubscribe;
}
