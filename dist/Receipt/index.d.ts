export declare class Receipt {
    private static readonly _all;
    static givenCancelFunction(cancelFunction: () => void): Receipt;
    private _cancelFunction;
    private constructor();
    get isCancelled(): boolean;
    cancel(): void;
}
