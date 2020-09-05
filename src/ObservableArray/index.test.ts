import { Test } from "@anderjason/tests";
import { ObjectUtil } from "@anderjason/util";
import { ObservableArray, ObservableArrayChange } from ".";

Test.define("ObservableArray can be created empty", () => {
  const oa = ObservableArray.ofEmpty();
  Test.assert(oa.count === 0);
});

Test.define("ObservableArray can be created from an array", () => {
  const oa = ObservableArray.givenValues(["a", "b", "c", "d"]);
  Test.assert(oa.count === 4);
});

function assertArrayChange<T>(
  array: ObservableArray<T>,
  fn: (array: ObservableArray<T>) => void,
  expectedChanges: ObservableArrayChange<T>[],
  expectedValue: T[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    let actualChanges: ObservableArrayChange<T>[];

    const handle = array.didChangeSteps.subscribe((c) => {
      actualChanges = c;
    });

    try {
      fn(array);
    } catch (err) {
      reject(err);
    }

    handle.release();

    try {
      Test.assert(
        ObjectUtil.objectIsDeepEqual(actualChanges, expectedChanges),
        JSON.stringify(actualChanges, null, 2)
      );
      Test.assertIsDeepEqual(
        array.toValues(),
        expectedValue,
        JSON.stringify(array.toValues(), null, 2)
      );

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

Test.define("ObservableArray can add an item at the end", async () => {
  const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

  await assertArrayChange(
    input,
    (a) => a.addValue("e"),
    [
      {
        type: "add",
        value: "e",
        newIndex: 4,
      },
    ],
    ["a", "b", "c", "d", "e"]
  );
});

Test.define("ObservableArray can add an item in the middle", async () => {
  const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

  await assertArrayChange(
    input,
    (a) => a.addValue("X", 2),
    [
      {
        type: "move",
        value: "c",
        oldIndex: 2,
        newIndex: 3,
      },
      {
        type: "move",
        value: "d",
        oldIndex: 3,
        newIndex: 4,
      },
      {
        type: "add",
        value: "X",
        newIndex: 2,
      },
    ],
    ["a", "b", "X", "c", "d"]
  );
});

Test.define("ObservableArray can move an item forward", async () => {
  const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

  await assertArrayChange(
    input,
    (a) => a.moveValueAtIndex(1, 3),
    [
      {
        type: "move",
        value: "b",
        oldIndex: 1,
        newIndex: 3,
      },
      {
        type: "move",
        value: "c",
        oldIndex: 2,
        newIndex: 1,
      },
      {
        type: "move",
        value: "d",
        oldIndex: 3,
        newIndex: 2,
      },
    ],
    ["a", "c", "d", "b"]
  );
});

Test.define("ObservableArray can move an item backward", async () => {
  const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

  await assertArrayChange(
    input,
    (a) => a.moveValueAtIndex(3, 1),
    [
      {
        type: "move",
        value: "b",
        oldIndex: 1,
        newIndex: 2,
      },
      {
        type: "move",
        value: "c",
        oldIndex: 2,
        newIndex: 3,
      },
      {
        type: "move",
        value: "d",
        oldIndex: 3,
        newIndex: 1,
      },
    ],
    ["a", "d", "b", "c"]
  );
});

Test.define(
  "ObservableArray can move an item forward beyond the length of the array",
  async () => {
    const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

    await assertArrayChange(
      input,
      (a) => a.moveValueAtIndex(3, 5),
      [
        {
          type: "move",
          value: "d",
          oldIndex: 3,
          newIndex: 5,
        },
      ],
      ["a", "b", "c", undefined, undefined, "d"]
    );
  }
);

Test.define(
  "ObservableArray can move an item to a negative offset",
  async () => {
    const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

    await assertArrayChange(
      input,
      (a) => a.moveValueAtIndex(0, -1),
      [
        {
          type: "move",
          value: "a",
          oldIndex: 0,
          newIndex: 3,
        },
        {
          type: "move",
          value: "b",
          oldIndex: 1,
          newIndex: 0,
        },
        {
          type: "move",
          value: "c",
          oldIndex: 2,
          newIndex: 1,
        },
        {
          type: "move",
          value: "d",
          oldIndex: 3,
          newIndex: 2,
        },
      ],
      ["b", "c", "d", "a"]
    );
  }
);

Test.define("ObservableArray can be cleared", async () => {
  const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

  await assertArrayChange(
    input,
    (a) => a.clear(),
    [
      {
        type: "remove",
        value: "a",
        oldIndex: 0,
      },
      {
        type: "remove",
        value: "b",
        oldIndex: 1,
      },
      {
        type: "remove",
        value: "c",
        oldIndex: 2,
      },
      {
        type: "remove",
        value: "d",
        oldIndex: 3,
      },
    ],
    []
  );
});

Test.define(
  "ObservableArray can determine whether a value exists in the array",
  () => {
    const input = ObservableArray.givenValues(["a", "b", "c", "d"]);

    Test.assert(input.hasValue("a") === true);
    Test.assert(input.hasValue("X") === false);
  }
);

Test.define(
  "ObservableArray can remove values matching a predicate",
  async () => {
    const input = ObservableArray.givenValues([
      "a", // 0
      "X", // 1
      "b", // 2
      "X", // 3
      "c", // 4
      "X", // 5
      "d", // 6
      "X", // 7
    ]);

    const filter = (str: string) => str === "X";

    await assertArrayChange(
      input,
      (a) => a.removeAllWhere(filter),
      [
        {
          type: "remove",
          value: "X",
          oldIndex: 1,
        },
        {
          type: "move",
          value: "b",
          oldIndex: 2,
          newIndex: 1,
        },
        {
          type: "remove",
          value: "X",
          oldIndex: 3,
        },
        {
          type: "move",
          value: "c",
          oldIndex: 4,
          newIndex: 2,
        },
        {
          type: "remove",
          value: "X",
          oldIndex: 5,
        },
        {
          type: "move",
          value: "d",
          oldIndex: 6,
          newIndex: 3,
        },
        {
          type: "remove",
          value: "X",
          oldIndex: 7,
        },
      ],
      ["a", "b", "c", "d"]
    );
  }
);
