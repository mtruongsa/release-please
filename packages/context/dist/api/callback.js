// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
export function callback(onSuccess, onError) {
    return (err, result) => {
        if (err) {
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
        else {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(result);
        }
    };
}
