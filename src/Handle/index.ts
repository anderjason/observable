export class Handle {
  static readonly unreleasedSet = new Set<Handle>();

  static givenCallback(callback: () => void): Handle {
    const handle = new Handle(callback);

    this.unreleasedSet.add(handle);

    return handle;
  }

  private _callback: (() => void) | undefined;

  private constructor(callback: () => void) {
    this._callback = callback;
  }

  get isReleased(): boolean {
    return this._callback == null;
  }

  release(): void {
    if (this._callback == null) {
      return;
    }

    Handle.unreleasedSet.delete(this);

    const fn = this._callback;
    this._callback = undefined;

    fn();
  }
}
