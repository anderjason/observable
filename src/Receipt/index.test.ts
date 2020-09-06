import { Test } from "@anderjason/tests";
import { Receipt } from ".";

Test.define("Receipt is not cancelled by default", () => {
  const receipt = Receipt.givenCancelFunction(() => {});
  Test.assert(!receipt.isCancelled);

  receipt.cancel();
});

Test.define("Receipt is cancelled after calling cancel", () => {
  const receipt = Receipt.givenCancelFunction(() => {});
  receipt.cancel();

  Test.assert(receipt.isCancelled);
});

Test.define("Receipt invokes the cancel function when calling cancel", () => {
  let didCancel = false as boolean;

  const receipt = Receipt.givenCancelFunction(() => {
    didCancel = true;
  });

  receipt.cancel();

  Test.assert(didCancel === true);
});

Test.define("Receipt only invokes the cancel function once", () => {
  let cancelCount: number = 0;

  const receipt = Receipt.givenCancelFunction(() => {
    cancelCount += 1;
  });

  receipt.cancel();
  receipt.cancel();
  receipt.cancel();

  Test.assert(cancelCount === 1);
});
