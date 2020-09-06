export class Receipt {
  private static readonly _all = new Set<Receipt>();

  static givenCancelFunction(cancelFunction: () => void): Receipt {
    const handle = new Receipt(cancelFunction);

    this._all.add(handle);

    return handle;
  }

  private _cancelFunction: (() => void) | undefined;

  private constructor(callback: () => void) {
    this._cancelFunction = callback;
  }

  get isCancelled(): boolean {
    return this._cancelFunction == null;
  }

  cancel(): void {
    if (this._cancelFunction == null) {
      return;
    }

    Receipt._all.delete(this);

    const fn = this._cancelFunction;
    this._cancelFunction = undefined;

    fn();
  }
}
