export type NavigateFunction = (page: string, params?: Record<string, string>) => void;
export declare function useNavigate(): NavigateFunction;
