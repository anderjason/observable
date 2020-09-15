export class Receipt {
  private static readonly _all = new Set<Receipt>();

  private _cancelFunction: (() => void) | undefined;

  constructor(cancelFunction: () => void) {
    Receipt._all.add(this);

    this._cancelFunction = cancelFunction;
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
