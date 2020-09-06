import { Test } from "@anderjason/tests";
import "./Observable/index.test";
import "./ObservableArray/index.test";
import "./ObservableDict/index.test";
import "./TypedEvent/index.test";

Test.runAll()
  .then(() => {
    console.log("Tests complete");
  })
  .catch((err) => {
    console.error(err);
    console.error("Tests failed");
  });
