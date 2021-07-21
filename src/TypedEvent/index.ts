import { ArrayUtil, PromiseUtil } from "@anderjason/util";
import { Receipt } from "../Receipt";

export type TypedEventSubscription<T> = (
  newValue: T,
  oldValue?: T
) => void | Promise<void>;

export interface TypedEventPromiseTimeout {
  durationMs: number;
  behavior: "resolve" | "reject";
}

export interface TypedEventPromiseParams<T> {
  timeout?: TypedEventPromiseTimeout;
  filter?: (value: T) => boolean;
}

export class TypedEvent<T = void> {
  private _subscriptions: TypedEventSubscription<T>[] | undefined = undefined;
  private _lastValue?: T;

  constructor(lastValue?: T) {
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

    return new Receipt(() => this.unsubscribe(subscription));
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

  toPromise(params?: TypedEventPromiseParams<T>): Promise<T> {
    const { timeout, filter } = params || {};
  
    return new Promise((resolve, reject) => {
      let timer: number;

      const receipt = this.subscribe((value) => {
        let isDone = true;
        if (filter != null) {
          isDone = filter(value);
        }
  
        if (isDone) {
          if (timer != null) {
            clearTimeout(timer);
          }
          
          receipt.cancel();
          resolve(value);
        }
      });
  
      if (timeout != null) {
        timer = setTimeout(() => {
          receipt.cancel();
  
          if (timeout.behavior === "reject") {
            reject(new Error("Timeout waiting for event"));
          } else {
            resolve(undefined);
          }
        }, timeout.durationMs)
      }
    })
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
