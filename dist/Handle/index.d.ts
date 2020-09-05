export declare class Handle {
    static readonly unreleasedSet: Set<Handle>;
    static givenCallback(callback: () => void): Handle;
    private _callback;
    private constructor();
    get isReleased(): boolean;
    release(): void;
}
