import { ArrayUtil, PromiseUtil } from "@anderjason/util";
import { Handle } from "../Handle";

export type SimpleEventSubscription<T> = (
  newValue: T,
  oldValue?: T
) => void | Promise<void>;

export class SimpleEvent<T = void> {
  private _subscriptions: SimpleEventSubscription<T>[] | undefined = undefined;
  private _lastValue?: T;

  static ofEmpty<T = void>(): SimpleEvent<T> {
    return new SimpleEvent<T>();
  }

  static givenLastValue<T>(lastValue: T): SimpleEvent<T> {
    return new SimpleEvent(lastValue);
  }

  private constructor(lastValue?: T) {
    this._lastValue = lastValue;
  }

  subscribe(
    subscription: SimpleEventSubscription<T>,
    includeLast: boolean = false
  ): Handle {
    if (this._subscriptions == null) {
      this._subscriptions = [];
    }

    this._subscriptions.push(subscription);

    if (includeLast) {
      subscription(this._lastValue);
    }

    return Handle.givenCallback(() => this.unsubscribe(subscription));
  }

  async emit(newValue: T): Promise<void> {
    const previousValue = this._lastValue;
    this._lastValue = newValue;

    if (this._subscriptions != null) {
      await PromiseUtil.asyncSequenceGivenArrayAndCallback(
        this._subscriptions,
        async (handler) => {
          await handler(newValue, previousValue);
        }
      );
    }
  }

  private unsubscribe(handler: SimpleEventSubscription<T>): void {
    if (this._subscriptions == null) {
      return;
    }

    this._subscriptions = ArrayUtil.arrayWithoutValue(
      this._subscriptions,
      handler
    );

    if (this._subscriptions.length === 0) {
      this._subscriptions = undefined;
    }
  }
}
