import { Handle } from "../Handle";
export declare type SimpleEventSubscription<T> = (newValue: T, oldValue?: T) => void | Promise<void>;
export declare class SimpleEvent<T = void> {
    private _subscriptions;
    private _lastValue?;
    static ofEmpty<T = void>(): SimpleEvent<T>;
    static givenLastValue<T>(lastValue: T): SimpleEvent<T>;
    private constructor();
    subscribe(subscription: SimpleEventSubscription<T>, includeLast?: boolean): Handle;
    emit(newValue: T): Promise<void>;
    private unsubscribe;
}
