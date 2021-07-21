"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEvent = void 0;
const util_1 = require("@anderjason/util");
const Receipt_1 = require("../Receipt");
class TypedEvent {
    constructor(lastValue) {
        this._subscriptions = undefined;
        this._lastValue = lastValue;
    }
    subscribe(subscription, includeLast = false) {
        if (this._subscriptions == null) {
            this._subscriptions = [];
        }
        this._subscriptions.push(subscription);
        if (includeLast) {
            subscription(this._lastValue);
        }
        return new Receipt_1.Receipt(() => this.unsubscribe(subscription));
    }
    async emit(newValue) {
        const previousValue = this._lastValue;
        this._lastValue = newValue;
        if (this._subscriptions != null) {
            await util_1.PromiseUtil.asyncSequenceGivenArrayAndCallback(this._subscriptions, async (handler) => {
                await handler(newValue, previousValue);
            });
        }
    }
    toPromise(params) {
        const { timeout, filter } = params || {};
        return new Promise((resolve, reject) => {
            let timer;
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
                    }
                    else {
                        resolve(undefined);
                    }
                }, timeout.durationMs);
            }
        });
    }
    unsubscribe(handler) {
        if (this._subscriptions == null) {
            return;
        }
        this._subscriptions = util_1.ArrayUtil.arrayWithoutValue(this._subscriptions, handler);
        if (this._subscriptions.length === 0) {
            this._subscriptions = undefined;
        }
    }
}
exports.TypedEvent = TypedEvent;
//# sourceMappingURL=index.js.map