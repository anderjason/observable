import { Test } from "@anderjason/tests";
import { ObjectUtil } from "@anderjason/util";
import { ObservableDict, ObservableDictChange, Dict } from ".";

Test.define("ObservableDict can be created empty", () => {
  const od = ObservableDict.ofEmpty();
  Test.assert(od.count === 0);
});

Test.define("ObservableDict can be created from an array", () => {
  const od = ObservableDict.givenValues({
    message: "hello world",
    color: "red",
  });
  Test.assert(od.count === 2);
});

function assertDictChange<T>(
  dict: ObservableDict<T>,
  fn: (dict: ObservableDict<T>) => void,
  expectedChanges: ObservableDictChange<T>[],
  expectedValue: Dict<T>
): Promise<void> {
  return new Promise((resolve, reject) => {
    let actualChanges: ObservableDictChange<T>[];

    const receipt = dict.didChangeSteps.subscribe((c) => {
      actualChanges = c;
    });

    try {
      fn(dict);
    } catch (err) {
      reject(err);
    }

    receipt.cancel();

    try {
      Test.assert(
        ObjectUtil.objectIsDeepEqual(actualChanges, expectedChanges),
        JSON.stringify(actualChanges, null, 2)
      );
      Test.assertIsDeepEqual(
        dict.toValues(),
        expectedValue,
        JSON.stringify(dict.toValues(), null, 2)
      );

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

Test.define("ObservableDict can add an item", async () => {
  const input = ObservableDict.givenValues({
    message: "one",
  });

  await assertDictChange(
    input,
    (a) => a.setValue("color", "red"),
    [
      {
        type: "add",
        key: "color",
        newValue: "red",
      },
    ],
    {
      message: "one",
      color: "red",
    }
  );
});

Test.define("ObservableDict can update an existing key", async () => {
  const input = ObservableDict.givenValues({
    message: "one",
  });

  await assertDictChange(
    input,
    (a) => a.setValue("message", "two"),
    [
      {
        type: "update",
        key: "message",
        oldValue: "one",
        newValue: "two",
      },
    ],
    {
      message: "two",
    }
  );
});

Test.define("ObservableArray can remove a key", async () => {
  const input = ObservableDict.givenValues({
    message: "one",
    color: "red",
  });

  await assertDictChange(
    input,
    (a) => a.removeKey("message"),
    [
      {
        type: "remove",
        key: "message",
        oldValue: "one",
      },
    ],
    {
      color: "red",
    }
  );
});

Test.define("ObservableDict can be cleared", async () => {
  const input = ObservableDict.givenValues({
    message: "one",
    color: "red",
  });

  await assertDictChange(
    input,
    (a) => a.clear(),
    [
      {
        type: "remove",
        key: "message",
        oldValue: "one",
      },
      {
        type: "remove",
        key: "color",
        oldValue: "red",
      },
    ],
    {}
  );
});
