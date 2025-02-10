import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthenticationContext } from '../authentication/AuthenticationContextProvider.js';
import { Callback } from './callback.js';
export type Data = Record<string, unknown> | FormData;
export declare class ApiServices {
    private api;
    constructor(api: AxiosInstance, authContext?: AuthenticationContext);
    private promiseOrCallback;
    get<T, D = Data>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
    get<T>(url: string, cb: Callback<T>): void;
    get<T, D = Data>(url: string, config: AxiosRequestConfig<D>, cb: Callback<T>): void;
    post<T, D = Data>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
    post<T>(url: string, cb: Callback<T>): void;
    post<T, D = Data>(url: string, data: D, cb: Callback<T>): void;
    post<T, D = Data>(url: string, data: D, config: AxiosRequestConfig<D>, cb: Callback<T>): void;
    patch<T, D = Data>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
    patch<T>(url: string, cb: Callback<T>): void;
    patch<T, D = Data>(url: string, data: D, cb: Callback<T>): void;
    patch<T, D = Data>(url: string, data: D, config: AxiosRequestConfig<D>, cb: Callback<T>): void;
    put<T, D = Data>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
    put<T>(url: string, cb: Callback<T>): void;
    put<T, D = Data>(url: string, data: D, cb: Callback<T>): void;
    put<T, D = Data>(url: string, data: D, config: AxiosRequestConfig<D>, cb: Callback<T>): void;
    delete<T, D = Data>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
    delete<T>(url: string, cb: Callback<T>): void;
    delete<T, D = Data>(url: string, config: AxiosRequestConfig<D>, cb: Callback<T>): void;
}
export declare function useApiServices(): ApiServices;
