// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
import { useCallback } from 'react';
import { generatePath, useNavigate as useRouterNavigate } from 'react-router-dom';
export function useNavigate() {
    const navigate = useRouterNavigate();
    return useCallback((page, params) => {
        navigate(generatePath(page, params));
    }, [navigate]);
}
