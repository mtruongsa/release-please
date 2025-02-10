import { jsx as _jsx } from "react/jsx-runtime";
// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
import { createContext, useContext, useState } from 'react';
import { useNotification } from '../notification/index.js';
export const SignalRConnectionContext = createContext({});
SignalRConnectionContext.displayName = 'SignalRConnectionContext';
function SignalRConnectionProvider({ children }) {
    const notifications = useNotification();
    const [instanceCallbacks] = useState(
    // Map provided callbacks to our wrappers that are sent to the underlying
    // notification provider.
    new WeakMap());
    return (_jsx(SignalRConnectionContext.Provider, { value: {
            documentChanges: {
                subscribe: (topicName, callback) => {
                    var _a;
                    const [objectId, instanceId] = topicName.split('/');
                    (_a = notifications.documentChanges) === null || _a === void 0 ? void 0 : _a.subscribe(objectId, instanceId, callback);
                },
                unsubscribe: (topicName, callback) => {
                    var _a;
                    const [objectId, instanceId] = topicName.split('/');
                    (_a = notifications.documentChanges) === null || _a === void 0 ? void 0 : _a.unsubscribe(objectId, instanceId, callback);
                },
            },
            instanceChanges: {
                subscribe: (objectId, callback) => {
                    var _a;
                    // If there is already a wrapper for the given callback, we must reuse the
                    // same one.  Otherwise, if we overwrite the entry in our cache, we'll lose
                    // track of the original wrapper.
                    let wrapper = instanceCallbacks.get(callback);
                    if (!wrapper) {
                        wrapper = (...changes) => {
                            callback(...changes.map((change) => change.instanceId));
                        };
                        instanceCallbacks.set(callback, wrapper);
                    }
                    (_a = notifications.instanceChanges) === null || _a === void 0 ? void 0 : _a.subscribe(objectId, wrapper);
                },
                unsubscribe: (objectId, callback) => {
                    var _a;
                    (_a = notifications.instanceChanges) === null || _a === void 0 ? void 0 : _a.unsubscribe(objectId, callback && instanceCallbacks.get(callback));
                },
            },
        }, children: children }));
}
export function useSignalRConnection() {
    console.warn('Use of useSignalRConnection is deprecated. Use useNotification instead.');
    return useContext(SignalRConnectionContext);
}
export default SignalRConnectionProvider;
