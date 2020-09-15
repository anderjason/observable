import { Receipt } from "../Receipt";
export declare type TypedEventSubscription<T> = (newValue: T, oldValue?: T) => void | Promise<void>;
export declare class TypedEvent<T = void> {
    private _subscriptions;
    private _lastValue?;
    constructor(lastValue?: T);
    subscribe(subscription: TypedEventSubscription<T>, includeLast?: boolean): Receipt;
    emit(newValue: T): Promise<void>;
    private unsubscribe;
}
