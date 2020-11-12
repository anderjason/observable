import { ObservableBase } from "..";
export declare function asyncGivenObservable<T>({ observable, filter, }: {
    observable: ObservableBase<T>;
    filter?: (value: T) => boolean;
}): Promise<T>;
