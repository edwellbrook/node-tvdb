import flatten from 'lodash.flatten';
import { hasNextPage } from './has-next-page';
import { TheTVDB } from '.';

/**
 * Returns the next page of a paged response.
 */
export const getNextPages = (client: TheTVDB, response: any, path: string, opts: any) => {
    if (!hasNextPage(response) || !opts.getAllPages) {
        return Promise.resolve(response);
    }

    const query = { ...opts.query, page: response.links.next };
    const reqOpts = { ...opts, query };

    return client.sendRequest(path, reqOpts)
        .then(nextRes => [response.data, nextRes])
        .then(dataArr => {
            return {
                data: flatten(dataArr)
            };
        });
};
