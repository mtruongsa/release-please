import { ReactNode } from 'react';
export type ApiBaseUrlProviderProps = {
    url: string;
    children?: ReactNode;
};
declare function ApiBaseUrlProvider(props: ApiBaseUrlProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useApiBaseUrl(): string;
export default ApiBaseUrlProvider;
