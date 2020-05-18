import flatten from 'lodash.flatten';
import { hasNextPage } from './has-next-page';
import { TheTVDB } from '.';
import { RequestOptions, JsonResponse } from './types';

/**
 * Returns the next page of a paged response.
 */
export const getNextPages = async<T = {}>(client: TheTVDB, response: JsonResponse, path: string, options: RequestOptions) => {
    if (!hasNextPage(response) || !options.getAllPages || !response.links?.next) {
        return response;
    }

    const query = { ...options.query, page: String(response.links.next) };
    const reqOpts = { ...options, query };
    return client.sendRequest<T>(path, reqOpts)
        .then(nextRes => {
            return {
                data: flatten([response.data, nextRes])
            };
        });
};
