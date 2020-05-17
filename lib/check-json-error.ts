import { Response } from 'node-fetch';

/**
 * Check response for JSON error. Return a rejected promise if there's an error
 * otherwise resolve the response body as a JSON object.
 */
export const checkJsonError = async (response: Response) => {
    const json = await response.json();
    if (json.Error) {
        let error = new Error(json.Error);

        // @ts-expect-error
        error.response = {
            url: response.url,
            status: response.status,
            statusText: response.statusText
        };
        return Promise.reject(error);
    }
    return Promise.resolve(json);
};
