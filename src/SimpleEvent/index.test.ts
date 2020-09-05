import { Test } from "@anderjason/tests";
import { SimpleEvent } from ".";

Test.define("SimpleEvent can be subscribed to", () => {
  const event = SimpleEvent.ofEmpty();

  const handle = event.subscribe(() => {});

  Test.assert(handle != null);
  handle.release();
});

Test.define("SimpleEvent can take an initial value", () => {
  const event = SimpleEvent.givenLastValue(5);

  let result: number;

  const handle = event.subscribe((v) => {
    result = v;
  }, true);

  Test.assert(result === 5);
  handle.release();
});

Test.define(
  "SimpleEvent fires the event with a value when emit is called",
  () => {
    const event = SimpleEvent.ofEmpty<number>();

    let result: number;
    let eventCount: number = 0;

    const handle = event.subscribe((v) => {
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

    handle.release();
  }
);

Test.define(
  "SimpleEvent stops firing the event when the handle is released",
  () => {
    const event = SimpleEvent.ofEmpty<number>();

    let eventCount: number = 0;

    const handle = event.subscribe((v) => {
      eventCount += 1;
    });

    Test.assert(eventCount === 0);

    event.emit(5);

    // @ts-ignore
    Test.assert(eventCount === 1);

    handle.release();

    event.emit(10);

    // @ts-ignore
    Test.assert(eventCount === 1); // no change
  }
);

Test.define(
  "SimpleEvent fires the event for new subscriptions with the previous value if requested",
  () => {
    const event = SimpleEvent.ofEmpty<number>();

    let result: number;

    event.emit(5);
    Test.assert(result == null);

    const handle = event.subscribe((v) => {
      result = v;
    }, true);

    Test.assert(result === 5);

    handle.release();
  }
);
