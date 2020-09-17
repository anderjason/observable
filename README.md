# @anderjason/observable

## Installation

`npm install --save @anderjason/observable`

# Key concepts

## Receipts

A Receipt is an object that can be returned by any function which performs a reversable action.

Each receipt has a `cancel()` function that can be used to reverse the action. A receipt can only be cancelled once. Invoking `cancel()` additional times has no effect.

For example:

- A function that starts a timer could return a receipt that can be used to stop the timer.
- A function that adds an element to the DOM could return a receipt that can be used to remove the object from the DOM.
- A function that adds an event handler to listen for a keyboard shortcut could return a receipt that can be used to remove the event handler.

All of these scenarios are possible without receipts, but each one requires some knowledge of how to separately perform and reverse each action, and each one is handled in a slightly different way. The benefit of using receipts is consistency throughout a large system, across all scenarios which fit this apply-and-reverse pattern.

If you have many things to set up as part of presenting a complex UI, you can collect the resulting receipts in an array, and cancel them all together in a simple loop when they're no longer needed.

## Typed events

A typed event allows a source object to broadcast notifications to other subscriber objects. Notifications can be a simple signal without any associated data (like "did load"), or they can include a value of a certain data type (like coordinates associated with a "did click" event.)

Creating a typed event is easy:

```
// Create an event without a data type (type void)
const didLoad = new TypedEvent();

// Subscribing to the event returns a Receipt
const receipt = didLoad.subscribe(() => {
  // this callback is invoked when the notification occurs
  console.log("Loaded!");
});

// Calling emit() notifies all subscribers
didLoad.emit();

// Unsubscribe by cancelling the receipt
receipt.cancel();
```

You can pass a value to subscribers by specifying a data type when creating the typed event. For example:

```
import { Point2 } from "@anderjason/geometry";

// Creating an event with a generic type
const didClick = new TypedEvent<Point2>();

// The callback passed to subscribe receives a value
const receipt = didClick.subscribe((point) => {
  // this callback is invoked when the notification occurs
  console.log(`Clicked at ${point.x}, ${point.y}");
});

// Passing a value to emit() sends the value to all subscribers
didClick.emit(Point2.givenXY(100, 150));

// Unsubscribe by cancelling the receipt
receipt.cancel();
```

Typed events keep track of the last value that was broadcast, so that new subscriptions can receive the last value, even if the subscription was added after the call to emit(). For example:

```
import { Point2 } from "@anderjason/geometry";

const didClick = new TypedEvent<Point2>();

/*
  We can emit a notification here, before adding any subscriptions,
  and the most recent value will be stored internally for any subscriptions that are added later
*/

didClick.emit(Point2.givenXY(100, 150));

/*
  Passing true as the second parameter to subscribe() means that at the moment the subscription is created, the callback will always be invoked immediately using the event's most recent value (or undefined, if there is none)
*/
const receipt = didClick.subscribe((point) => {
  /* The value passed to the callback will be undefined if no events have occurred yet */
  if (point == null) {
    return;
  }

  console.log(`Clicked at ${point.x}, ${point.y}");
});

// Calling emit again will notify subscribers as usual
didClick.emit(Point2.givenXY(40, 90));

receipt.cancel();
```

## Observable

`TODO`

# API Reference

### Observable

`TODO`

### ObservableArray

`TODO`

### ObservableDict

`TODO`

### ObservableSet

`TODO`

### ReadOnlyObservable

`TODO`

### ReadOnlyObservableArray

`TODO`

### ReadOnlyObservableDict

`TODO`

### ReadOnlyObservableSet

`TODO`

### Receipt

`TODO`

### TypedEvent

`TODO`
