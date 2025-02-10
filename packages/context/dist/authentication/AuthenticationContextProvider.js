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
import { createContext, useCallback, useContext, useMemo } from 'react';
const Context = createContext(undefined);
Context.displayName = 'AuthenticationContext';
function AuthenticationContextProvider(props) {
    var _a;
    const { msal, authRequest, children } = props;
    const account = (_a = msal.instance.getActiveAccount()) !== null && _a !== void 0 ? _a : msal.instance.getAllAccounts()[0];
    const getAccessToken = useCallback(function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield msal.instance.acquireTokenSilent(Object.assign(Object.assign({}, authRequest), { account }));
                return response.accessToken;
            }
            catch (err) {
                yield msal.instance.acquireTokenRedirect(Object.assign(Object.assign({}, authRequest), { account }));
                return '';
            }
        });
    }, [msal, authRequest]);
    const context = useMemo(() => account
        ? {
            account: { id: account.localAccountId, name: account.name },
            logout: () => {
                msal.instance.logoutRedirect({
                    account,
                    postLogoutRedirectUri: `/logout?p=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                });
            },
            getAccessToken,
        }
        : undefined, [account, msal, getAccessToken]);
    return _jsx(Context.Provider, { value: context, children: children });
}
export function useAuthenticationContext() {
    return useContext(Context);
}
export default AuthenticationContextProvider;
