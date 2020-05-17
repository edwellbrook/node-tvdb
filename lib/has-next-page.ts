/**
 * Returns true if the response has additional pages, otherwise returns false.
 */
export const hasNextPage = (response: any) => {
    return response && response.links && response.links.next;
};