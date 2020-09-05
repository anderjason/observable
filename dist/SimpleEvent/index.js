"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleEvent = void 0;
const util_1 = require("@anderjason/util");
const Handle_1 = require("../Handle");
class SimpleEvent {
    constructor(lastValue) {
        this._subscriptions = undefined;
        this._lastValue = lastValue;
    }
    static ofEmpty() {
        return new SimpleEvent();
    }
    static givenLastValue(lastValue) {
        return new SimpleEvent(lastValue);
    }
    subscribe(subscription, includeLast = false) {
        if (this._subscriptions == null) {
            this._subscriptions = [];
        }
        this._subscriptions.push(subscription);
        if (includeLast) {
            subscription(this._lastValue);
        }
        return Handle_1.Handle.givenCallback(() => this.unsubscribe(subscription));
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
exports.SimpleEvent = SimpleEvent;
//# sourceMappingURL=index.js.map