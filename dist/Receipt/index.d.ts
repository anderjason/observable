export declare class Receipt {
    private static readonly _all;
    private _cancelFunction;
    constructor(cancelFunction: () => void);
    get isCancelled(): boolean;
    cancel(): void;
}
