import { Done } from 'mocha';
export declare function assertionCallback(done: Done, fn: (data: unknown) => void): (err?: Error | null, data?: unknown) => void;
