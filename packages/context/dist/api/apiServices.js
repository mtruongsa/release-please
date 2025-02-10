// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuthenticationContext } from '../authentication/AuthenticationContextProvider.js';
import { useApiBaseUrl } from './ApiBaseUrlProvider.js';
import { paramsSerializer } from './paramsSerializer.js';
const sessionId = uuidv4();
export class ApiServices {
    constructor(api, authContext) {
        this.api = api;
        this.api.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            const headers = { 'X-Session-Id': sessionId };
            if (authContext) {
                const token = yield authContext.getAccessToken();
                headers['Authorization'] = `Bearer ${token}`;
            }
            config.headers = Object.assign({}, config.headers, headers);
            return config;
        }));
    }
    promiseOrCallback(promise, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cb) {
                const response = yield promise;
                return response.data;
            }
            promise.then((result) => cb(null, result.data), (error) => cb(error));
        });
    }
    get(url, configOrCallback, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let config;
            if (cb) {
                config = configOrCallback;
            }
            else if (typeof configOrCallback === 'function') {
                cb = configOrCallback;
            }
            else {
                config = configOrCallback;
            }
            return this.promiseOrCallback(this.api.get(url, config), cb);
        });
    }
    post(url, dataOrCallback, configOrCallback, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            let config;
            if (cb) {
                data = dataOrCallback;
                config = configOrCallback;
            }
            else if (typeof configOrCallback === 'function') {
                data = dataOrCallback;
                cb = configOrCallback;
            }
            else {
                config = configOrCallback;
                if (typeof dataOrCallback === 'function') {
                    cb = dataOrCallback;
                }
                else {
                    data = dataOrCallback;
                }
            }
            return this.promiseOrCallback(this.api.post(url, data, config), cb);
        });
    }
    patch(url, dataOrCallback, configOrCallback, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            let config;
            if (cb) {
                data = dataOrCallback;
                config = configOrCallback;
            }
            else if (typeof configOrCallback === 'function') {
                data = dataOrCallback;
                cb = configOrCallback;
            }
            else {
                config = configOrCallback;
                if (typeof dataOrCallback === 'function') {
                    cb = dataOrCallback;
                }
                else {
                    data = dataOrCallback;
                }
            }
            return this.promiseOrCallback(this.api.patch(url, data, config), cb);
        });
    }
    put(url, dataOrCallback, configOrCallback, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            let config;
            if (cb) {
                data = dataOrCallback;
                config = configOrCallback;
            }
            else if (typeof configOrCallback === 'function') {
                data = dataOrCallback;
                cb = configOrCallback;
            }
            else {
                config = configOrCallback;
                if (typeof dataOrCallback === 'function') {
                    cb = dataOrCallback;
                }
                else {
                    data = dataOrCallback;
                }
            }
            return this.promiseOrCallback(this.api.put(url, data, config), cb);
        });
    }
    delete(url, configOrCallback, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let config;
            if (cb) {
                config = configOrCallback;
            }
            else if (typeof configOrCallback === 'function') {
                cb = configOrCallback;
            }
            else {
                config = configOrCallback;
            }
            return this.promiseOrCallback(this.api.delete(url, config), cb);
        });
    }
}
export function useApiServices() {
    const authContext = useAuthenticationContext();
    const baseURL = useApiBaseUrl();
    const apiServices = useMemo(() => new ApiServices(axios.create({ baseURL, paramsSerializer }), authContext), [authContext, baseURL]);
    return apiServices;
}
