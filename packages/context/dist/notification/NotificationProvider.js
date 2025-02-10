var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { HubConnectionBuilder, LogLevel, } from '@microsoft/signalr';
import { createContext, useContext, useEffect, useState } from 'react';
import { useApiServices } from '../api/index.js';
export const NotificationContext = createContext({});
NotificationContext.displayName = 'NotificationContext';
function NotificationProvider({ children }) {
    const [instancesNotification, setInstancesNotification] = useState();
    const [documentsNotification, setDocumentsNotification] = useState();
    const api = useApiServices();
    useEffect(() => {
        const getConnectionInfo = (hubName) => {
            return api.post(`/notification/hubs/${hubName}/negotiate`);
        };
        const getConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const instancesConnectionInfo = yield getConnectionInfo('instanceChanges');
                const documentsConnectionInfo = yield getConnectionInfo('documentChanges');
                if (instancesConnectionInfo) {
                    const options = {
                        accessTokenFactory: () => {
                            var _a;
                            return (_a = instancesConnectionInfo.accessToken) !== null && _a !== void 0 ? _a : '';
                        },
                    };
                    const connection = new HubConnectionBuilder()
                        .withUrl(instancesConnectionInfo.url, options)
                        .configureLogging(LogLevel.Error)
                        .withAutomaticReconnect()
                        .build();
                    setInstancesNotification(connection);
                }
                if (documentsConnectionInfo) {
                    const options = {
                        accessTokenFactory: () => {
                            var _a;
                            return (_a = documentsConnectionInfo.accessToken) !== null && _a !== void 0 ? _a : '';
                        },
                    };
                    const connection = new HubConnectionBuilder()
                        .withUrl(documentsConnectionInfo.url, options)
                        .configureLogging(LogLevel.Error)
                        .withAutomaticReconnect()
                        .build();
                    setDocumentsNotification(connection);
                }
                // eslint-disable-next-line no-empty
            }
            catch (err) {
                console.log(err);
            }
        });
        getConnection();
    }, []);
    useEffect(() => {
        let documentsConnectionStopped = false;
        const startConnection = (connection, numOfAttempts) => __awaiter(this, void 0, void 0, function* () {
            yield connection.start().catch((error) => {
                if (numOfAttempts < 4 && !documentsConnectionStopped) {
                    setTimeout(() => {
                        if (!documentsConnectionStopped) {
                            startConnection(connection, numOfAttempts + 1);
                        }
                    }, 2000);
                }
                else {
                    console.warn(`Cannot start connection to Notification Service due to error "${error}"`);
                }
            });
        });
        if (documentsNotification) {
            startConnection(documentsNotification, 0);
        }
        return () => {
            documentsNotification === null || documentsNotification === void 0 ? void 0 : documentsNotification.stop();
            documentsConnectionStopped = true;
        };
    }, [documentsNotification]);
    useEffect(() => {
        let instancesConnectionStopped = false;
        const startConnection = (connection, numOfAttempts) => __awaiter(this, void 0, void 0, function* () {
            yield connection.start().catch((error) => {
                if (numOfAttempts < 4 && !instancesConnectionStopped) {
                    setTimeout(() => {
                        if (!instancesConnectionStopped) {
                            startConnection(connection, numOfAttempts + 1);
                        }
                    }, 2000);
                }
                else {
                    console.warn(`Cannot start connection to Notification Service due to error "${error}"`);
                }
            });
        });
        if (instancesNotification) {
            startConnection(instancesNotification, 0);
        }
        return () => {
            instancesNotification === null || instancesNotification === void 0 ? void 0 : instancesNotification.stop();
            instancesConnectionStopped = true;
        };
    }, [instancesNotification]);
    return (_jsx(NotificationContext.Provider, { value: {
            documentChanges: documentsNotification
                ? {
                    subscribe: (objectId, instanceId, callback) => documentsNotification.on(`${objectId}/${instanceId}`, callback),
                    unsubscribe: (objectId, instanceId, callback) => callback
                        ? documentsNotification.off(`${objectId}/${instanceId}`, callback)
                        : documentsNotification.off(`${objectId}/${instanceId}`),
                }
                : undefined,
            instanceChanges: instancesNotification
                ? {
                    subscribe: (objectId, callback) => instancesNotification.on(objectId, callback),
                    unsubscribe: (objectId, callback) => callback
                        ? instancesNotification.off(objectId, callback)
                        : instancesNotification.off(objectId),
                }
                : undefined,
        }, children: children }));
}
export function useNotification() {
    return useContext(NotificationContext);
}
export default NotificationProvider;
