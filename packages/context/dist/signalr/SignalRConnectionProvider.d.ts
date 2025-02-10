import React from 'react';
export type SignalRConnectionInfo = {
    url: string;
    accessToken: string;
};
export type Subscription<T> = {
    subscribe: (topic: string, callback: (...args: T[]) => any) => void;
    unsubscribe: (topic: string, callback?: (...args: T[]) => void) => void;
};
export type DocumentChange = {
    objectId: string;
    instanceId: string;
    documentId: string;
    type: string;
};
export type InstanceChange = string;
export type SignalRConnectionContextType = {
    documentChanges?: Subscription<DocumentChange>;
    instanceChanges?: Subscription<InstanceChange>;
};
export declare const SignalRConnectionContext: React.Context<SignalRConnectionContextType>;
declare function SignalRConnectionProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSignalRConnection(): SignalRConnectionContextType;
export default SignalRConnectionProvider;
