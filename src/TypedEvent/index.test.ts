import { Test } from "@anderjason/tests";
import { TypedEvent } from ".";

Test.define("TypedEvent can be subscribed to", () => {
  const event = new TypedEvent();

  const receipt = event.subscribe(() => {});

  Test.assert(receipt != null);
  receipt.cancel();
});

Test.define("TypedEvent can take an initial value", () => {
  const event = new TypedEvent(5);

  let result: number;

  const receipt = event.subscribe((v) => {
    result = v;
  }, true);

  Test.assert(result === 5);
  receipt.cancel();
});

Test.define(
  "TypedEvent fires the event with a value when emit is called",
  () => {
    const event = new TypedEvent<number>();

    let result: number;
    let eventCount: number = 0;

    const receipt = event.subscribe((v) => {
      result = v;
      eventCount += 1;
    });

    event.emit(5);
    Test.assert(result === 5);
    Test.assert(eventCount === 1);

    event.emit(10);

    // @ts-ignore
    Test.assert(result === 10);

    // @ts-ignore
    Test.assert(eventCount === 2);

    receipt.cancel();
  }
);

Test.define(
  "TypedEvent stops firing the event when the receipt is cancelled",
  () => {
    const event = new TypedEvent<number>();

    let eventCount: number = 0;

    const receipt = event.subscribe((v) => {
      eventCount += 1;
    });

    Test.assert(eventCount === 0);

    event.emit(5);

    // @ts-ignore
    Test.assert(eventCount === 1);

    receipt.cancel();

    event.emit(10);

    // @ts-ignore
    Test.assert(eventCount === 1); // no change
  }
);

Test.define(
  "TypedEvent fires the event for new subscriptions with the previous value if requested",
  () => {
    const event = new TypedEvent<number>();

    let result: number;

    event.emit(5);
    Test.assert(result == null);

    const receipt = event.subscribe((v) => {
      result = v;
    }, true);

    Test.assert(result === 5);

    receipt.cancel();
  }
);
