import { Test } from "@anderjason/tests";
import { Receipt } from ".";

Test.define("Receipt is not cancelled by default", () => {
  const receipt = new Receipt(() => {});
  Test.assert(!receipt.isCancelled);

  receipt.cancel();
});

Test.define("Receipt is cancelled after calling cancel", () => {
  const receipt = new Receipt(() => {});
  receipt.cancel();

  Test.assert(receipt.isCancelled);
});

Test.define("Receipt invokes the cancel function when calling cancel", () => {
  let didCancel = false as boolean;

  const receipt = new Receipt(() => {
    didCancel = true;
  });

  receipt.cancel();

  Test.assert(didCancel === true);
});

Test.define("Receipt only invokes the cancel function once", () => {
  let cancelCount: number = 0;

  const receipt = new Receipt(() => {
    cancelCount += 1;
  });

  receipt.cancel();
  receipt.cancel();
  receipt.cancel();

  Test.assert(cancelCount === 1);
});
