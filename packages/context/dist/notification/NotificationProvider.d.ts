import React from 'react';
export type NotificationConnectionInfo = {
    url: string;
    accessToken: string;
};
export type InstanceSubscription = {
    subscribe: (objectId: string, callback: (...args: NotificationInstanceChange[]) => void) => void;
    unsubscribe: (objectId: string, callback?: (...args: NotificationInstanceChange[]) => void) => void;
};
export type DocumentSubscription = {
    subscribe: (objectId: string, instanceId: string | undefined, callback: (...args: NotificationDocumentChange[]) => void) => void;
    unsubscribe: (objectId: string, instanceId: string | undefined, callback?: (...args: NotificationDocumentChange[]) => void) => void;
};
export type NotificationDocumentChange = {
    objectId: string;
    instanceId: string;
    documentId: string;
    type: string;
};
export type NotificationInstanceChange = {
    objectId: string;
    instanceId: string;
};
export type NotificationContextType = {
    documentChanges?: DocumentSubscription;
    instanceChanges?: InstanceSubscription;
};
export declare const NotificationContext: React.Context<NotificationContextType>;
declare function NotificationProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useNotification(): NotificationContextType;
export default NotificationProvider;
