export type Callback<T> = (error?: Error | null, result?: T) => void;
export declare function callback<T>(onSuccess?: (result: T) => void, onError?: (err: Error) => void): Callback<T>;
