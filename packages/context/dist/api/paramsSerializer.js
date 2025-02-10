export function paramsSerializer(params, options) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (!validateParamKey(key) || !validateParamValue(value)) {
            continue;
        }
        searchParams.append(key, typeof value !== 'string' ? JSON.stringify(value) : value);
    }
    return searchParams.toString();
}
function validateParamKey(item) {
    return item.length;
}
function validateParamValue(item) {
    return item !== undefined;
}
