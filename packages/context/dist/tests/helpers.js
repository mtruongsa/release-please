// Copyright (c) 2023 System Automation Corporation.
// This file is licensed under the MIT License.
export function assertionCallback(done, fn) {
    return function (err, data) {
        if (err) {
            done(err);
        }
        else {
            try {
                fn(data);
                done();
            }
            catch (err2) {
                done(err2);
            }
        }
    };
}
