import { ObservableBase } from "..";

export function asyncGivenObservable<T>({
  observable,
  filter,
}: {
  observable: ObservableBase<T>;
  filter?: (value: T) => boolean;
}): Promise<T> {
  if (observable.value != null) {
    if (filter == null || filter(observable.value)) {
      return Promise.resolve(observable.value);
    }
  }

  return new Promise((resolve) => {
    if (observable.value != null) {
      if (filter == null || filter(observable.value)) {
        resolve(observable.value);
        return;
      }
    }

    const receipt = observable.didChange.subscribe((value) => {
      if (value == null) {
        return;
      }

      if (filter != null && !filter(value)) {
        return;
      }

      receipt.cancel();
      resolve(value);
    });
  });
}
