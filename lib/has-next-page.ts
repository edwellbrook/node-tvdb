interface Response {
    links?: {
        next?: number;
    };
}

/**
 * Returns true if the response has additional pages, otherwise returns false.
 */
export const hasNextPage = (response: Response) => {
    return response?.links?.next !== undefined;
};
