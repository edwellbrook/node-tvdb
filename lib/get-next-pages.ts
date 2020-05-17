import flatten from 'lodash.flatten';
import { hasNextPage } from './has-next-page';
import { TheTVDB } from '.';

interface Options {
    getAllPages: boolean;
    query: {};
}

/**
 * Returns the next page of a paged response.
 */
export const getNextPages = async (client: TheTVDB, response: any, path: string, options: Options) => {
    if (!hasNextPage(response) || !options.getAllPages) {
        return Promise.resolve(response);
    }

    const query = { ...options.query, page: response.links.next };
    const reqOpts = { ...options, query };

    return client.sendRequest(path, reqOpts)
        .then(nextRes => [response.data, nextRes])
        .then(dataArr => {
            return {
                data: flatten(dataArr)
            };
        });
};
