import { RedirectRequest } from '@azure/msal-browser';
import { IMsalContext } from '@azure/msal-react';
import { ReactNode } from 'react';
export type AuthenticationContext = {
    account: UserAccount;
    logout: VoidFunction;
    getAccessToken: () => Promise<string>;
};
export type UserAccount = {
    id: string;
    name?: string;
};
export type AuthenticationContextProviderProps = {
    msal: IMsalContext;
    authRequest: AuthenticationRequest;
    children?: ReactNode;
};
export type AuthenticationRequest = Pick<RedirectRequest, 'scopes' | 'extraQueryParameters' | 'state'>;
declare function AuthenticationContextProvider(props: AuthenticationContextProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useAuthenticationContext(): AuthenticationContext | undefined;
export default AuthenticationContextProvider;
