import { ArrayUtil, PromiseUtil } from "@anderjason/util";
import { Receipt } from "../Receipt";

export type TypedEventSubscription<T> = (
  newValue: T,
  oldValue?: T
) => void | Promise<void>;

export class TypedEvent<T = void> {
  private _subscriptions: TypedEventSubscription<T>[] | undefined = undefined;
  private _lastValue?: T;

  static ofEmpty<T = void>(): TypedEvent<T> {
    return new TypedEvent<T>();
  }

  static givenLastValue<T>(lastValue: T): TypedEvent<T> {
    return new TypedEvent(lastValue);
  }

  private constructor(lastValue?: T) {
    this._lastValue = lastValue;
  }

  subscribe(
    subscription: TypedEventSubscription<T>,
    includeLast: boolean = false
  ): Receipt {
    if (this._subscriptions == null) {
      this._subscriptions = [];
    }

    this._subscriptions.push(subscription);

    if (includeLast) {
      subscription(this._lastValue);
    }

    return Receipt.givenCancelFunction(() => this.unsubscribe(subscription));
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

  private unsubscribe(handler: TypedEventSubscription<T>): void {
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
