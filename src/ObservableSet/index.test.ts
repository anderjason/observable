import { Test } from "@anderjason/tests";
import { ObjectUtil, SetUtil } from "@anderjason/util";
import { ObservableSet, ObservableSetChange } from ".";

Test.define("ObservableSet can be created empty", () => {
  const oa = ObservableSet.ofEmpty();
  Test.assert(oa.count === 0);
});

Test.define("ObservableSet can be created from an array", () => {
  const oa = ObservableSet.givenValues(["a", "b", "c", "d"]);
  Test.assert(oa.count === 4);
});

Test.define("ObservableSet can be created from a set", () => {
  const oa = ObservableSet.givenValues(new Set(["a", "b", "c", "d"]));
  Test.assert(oa.count === 4);
});

function assertSetChange<T>(
  os: ObservableSet<T>,
  fn: (set: ObservableSet<T>) => void,
  expectedChanges: ObservableSetChange<T>[],
  expectedValue: Set<T>
): Promise<void> {
  return new Promise((resolve, reject) => {
    let actualChanges: ObservableSetChange<T>[];

    const receipt = os.didChangeSteps.subscribe((c) => {
      actualChanges = c;
    });

    try {
      fn(os);
    } catch (err) {
      reject(err);
    }

    receipt.cancel();

    try {
      Test.assertIsDeepEqual(
        actualChanges,
        expectedChanges,
        JSON.stringify(actualChanges, null, 2)
      );
      Test.assert(
        SetUtil.setIsEqual(os.toSet(), expectedValue),
        JSON.stringify(os.toArray(), null, 2)
      );

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

Test.define("ObservableSet can add an item", async () => {
  const input = ObservableSet.givenValues(["a", "b", "c", "d"]);

  await assertSetChange(
    input,
    (a) => a.addValue("e"),
    [
      {
        type: "add",
        value: "e",
      },
    ],
    new Set(["a", "b", "c", "d", "e"])
  );
});

Test.define("ObservableSet ignores an existing value", async () => {
  const input = ObservableSet.givenValues(["a", "b", "c", "d"]);

  await assertSetChange(
    input,
    (a) => a.addValue("b"),
    [],
    new Set(["a", "b", "c", "d"])
  );
});

Test.define("ObservableSet can be cleared", async () => {
  const input = ObservableSet.givenValues(["a", "b", "c", "d"]);

  await assertSetChange(
    input,
    (a) => a.clear(),
    [
      {
        type: "remove",
        value: "a",
      },
      {
        type: "remove",
        value: "b",
      },
      {
        type: "remove",
        value: "c",
      },
      {
        type: "remove",
        value: "d",
      },
    ],
    new Set()
  );
});

Test.define(
  "ObservableSet can determine whether a value exists in the array",
  () => {
    const input = ObservableSet.givenValues(["a", "b", "c", "d"]);

    Test.assert(input.hasValue("a") === true);
    Test.assert(input.hasValue("X") === false);
  }
);

Test.define(
  "ObservableArray can remove values matching a predicate",
  async () => {
    const input = ObservableSet.givenValues(["a", "b", "c", "d"]);

    const filter = (str: string) => str === "c" || str === "d";

    await assertSetChange(
      input,
      (a) => a.removeAllWhere(filter),
      [
        {
          type: "remove",
          value: "c",
        },
        {
          type: "remove",
          value: "d",
        },
      ],
      new Set(["a", "b"])
    );
  }
);

Test.define("ObservableSet can sync its values to match a set", async () => {
  const input = ObservableSet.givenValues(["a", "b", "c", "d", "e"]);

  await assertSetChange(
    input,
    (a) => a.sync(new Set(["c", "d", "x"])),
    [
      {
        type: "remove",
        value: "a",
      },
      {
        type: "remove",
        value: "b",
      },
      {
        type: "remove",
        value: "e",
      },
      {
        type: "add",
        value: "x",
      },
    ],
    new Set(["c", "d", "x"])
  );
});
