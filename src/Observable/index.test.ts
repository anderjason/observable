import { Test } from "@anderjason/tests";
import { StringUtil } from "@anderjason/util";
import { Observable } from ".";

Test.define("Observable can take an initial value", () => {
  const instance = Observable.givenValue(5);
  Test.assert(instance.value === 5);
});

Test.define("Observable supports generic types", () => {
  interface Player {
    name: string;
  }

  const bob: Player = {
    name: "Bob",
  };

  const instance = Observable.givenValue<Player>(bob);
  Test.assert(instance.value === bob);
});

Test.define("Observable updates the value when setValue is called", () => {
  const instance = Observable.givenValue(5);

  instance.setValue(10);
  Test.assert(instance.value === 10);
});

Test.define(
  "Observable fires an event when the value is changed using setValue",
  () => {
    const instance = Observable.givenValue(5);

    let didFire = false as boolean;
    const receipt = instance.didChange.subscribe(() => {
      didFire = true;
    });

    instance.setValue(10);
    receipt.cancel();

    Test.assert(didFire === true);
  }
);

Test.define(
  "Observable can detect whether an unknown object is observable",
  () => {
    const instance: unknown = Observable.givenValue(5) as unknown;

    Test.assert(Observable.isObservable(instance) === true);
    Test.assert(Observable.isObservable(5) === false);
    Test.assert(Observable.isObservable("something") === false);
  }
);

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

Test.define("Observable can return a promise", () => {
  return new Promise((resolve, reject) => {
    const instance = Observable.ofEmpty<string>();
    const delayMs = 150;

    const startTime = new Date().getTime();

    instance.toPromise().then((result) => {
      if (result !== "hello world") {
        reject(
          new Error(
            `Expected a different result from toPromise() (got '${result}')`
          )
        );
        return;
      }

      const endTime = new Date().getTime();
      const durationMs = endTime - startTime;
      if (durationMs < delayMs) {
        reject(
          new Error(`toPromise() resolved too early (in ${durationMs}ms)`)
        );
        return;
      }

      resolve();
    });

    delay(delayMs).then(() => {
      instance.setValue("hello world");
    });
  });
});

Test.define(
  "Observable promise resolves immediately if the value is already set",
  () => {
    return new Promise((resolve, reject) => {
      const instance = Observable.givenValue<string>("hello world");

      instance.toPromise().then((result) => {
        if (result !== "hello world") {
          reject(
            new Error(
              `Expected a different result from toPromise() (got '${result}')`
            )
          );
          return;
        }

        resolve();
      });
    });
  }
);

Test.define(
  "Observable promise waits for a matching value when passed a filter",
  () => {
    return new Promise((resolve, reject) => {
      const instance = Observable.ofEmpty<string>();

      const filter = (input: string): boolean => {
        if (StringUtil.stringIsEmpty(input)) {
          return false;
        }

        return input.includes("C");
      };

      instance.toPromise(filter).then((result) => {
        if (result !== "C1") {
          reject(
            new Error(
              `Expected a different result from toPromise() (got '${result}')`
            )
          );
          return;
        }

        resolve();
      });

      instance.setValue("A1");
      instance.setValue("B1");
      instance.setValue("C1");
    });
  }
);
