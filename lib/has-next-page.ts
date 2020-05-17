import { Response } from "node-fetch";

/**
 * Returns true if the response has additional pages, otherwise returns false.
 */
export const hasNextPage = (response: Response) => {
    // @ts-expect-error
    return response && response.links && response.links.next;
};