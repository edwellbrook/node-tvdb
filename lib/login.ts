import fetch from 'node-fetch';
import { AV_HEADER, BASE_URL } from './config';
import { checkHttpError } from './check-http-error';
import { checkJsonError } from './check-json-error';

/**
 * Perform login flow with given API Key.
 */
export const login = async (apiKey: string) => {
    const opts = {
        method: 'POST',
        body: JSON.stringify({ apikey: apiKey }),
        headers: {
            'Accept': AV_HEADER,
            'Content-Type': 'application/json'
        }
    };

    return fetch(`${BASE_URL}/login`, opts)
        .then(res => checkHttpError(res))
        .then(res => checkJsonError(res))
        .then(json => json.token as string);
}
