import { Response } from 'node-fetch';

/**
 * Check response for HTTP error. Return a rejected promise if there's an error
 * otherwise resolve the full response object.
 */
export const checkHttpError = (response: Response) => {
    const contentType = response.headers.get('content-type') || '';

    if (response.status && response.status >= 400 && !contentType.includes('application/json')) {
        let error = new Error(response.statusText);

        // @ts-expect-error
        error.response = {
            url: response.url,
            status: response.status,
            statusText: response.statusText
        };
        throw error;
    }

    return response;
}