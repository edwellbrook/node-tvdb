// Type definitions for node-tvdb
// Definitions by: Jeffrey Barrus http://github.com/jbarrus

export = Client;

declare class Client {
    constructor(apiKey: string, language?: string)

    /**
     * Get available languages useable by TheTVDB API.
     *
     * ``` javascript
     * tvdb.getLanguages()
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     */
    getLanguages(opts?: any): Promise<any>

    /**
     * Get episode by episode id.
     *
     * ``` javascript
     * tvdb.getEpisodeById(4768125)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Episodes/get_episodes_id
     */

    getEpisodeById(episodeId: number | string, opts?: any): Promise<any>

    /**
     * Get all episodes by series id.
     *
     * The opts may include the object `query` with any of the parameters from the query endpoint
     *
     * ``` javascript
     * tvdb.getEpisodesBySeriesId(153021)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     */

    getEpisodesBySeriesId(seriesId: number | string, opts?: any): Promise<any>

    /**
     * Get episodes summary by series id.
     *
     * ``` javascript
     * tvdb.getEpisodesSummaryBySeriesId(153021)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_summary
     */

    getEpisodesSummaryBySeriesId(seriesId: number | string): Promise<any>

    /**
     * Get basic series information by id.
     *
     * ``` javascript
     * tvdb.getSeriesById(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id
     */

    getSeriesById(seriesId: number | string, opts?: any): Promise<any>

    /**
     * Get series episode by air date.
     *
     * ``` javascript
     * tvdb.getEpisodeByAirDate(153021, '2011-10-03')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     */

    getEpisodesByAirDate(seriesId: number | string, airDate: string, opts?: any): Promise<any>

    /**
     * Get basic series information by name.
     *
     * ``` javascript
     * tvdb.getSeriesByName('Breaking Bad')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Search/get_search_series
     */

    getSeriesByName(name: string, opts?: any) : Promise<any>

    /**
     * Get series actors by series id.
     *
     * ``` javascript
     * tvdb.getActors(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_actors
     */

    getActors(seriesId: number | string, opts?: any): Promise<any>

    /**
     * Get basic series information by imdb id.
     *
     * ``` javascript
     * tvdb.getSeriesByImdbId('tt0903747')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Search/get_search_series
     */

    getSeriesByImdbId(imdbId: string, opts?: any): Promise<any>

    /**
     * Get basic series information by zap2it id.
     *
     * ``` javascript
     * tvdb.getSeriesByZap2ItId('EP00018693')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Search/get_search_series
     */

    getSeriesByZap2ItId(zap2ItId: string, opts?: any): Promise<any>

    /**
     * Get series banner by series id.
     *
     * ``` javascript
     * tvdb.getSeriesBanner(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_filter
     */

    getSeriesBanner(seriesId: number | string, opts?: any): Promise<any>

    /**
     * Get series images for a given key type.
     *
     * ``` javascript
     * // request only return fan art images:
     * tvdb.getSeriesImages(73255, 'fanart', { query: queryOptions })
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     */

    getSeriesImages(seriesId: number | string, keyType: string, opts?: any): Promise<any>

    /**
     * Convenience wrapper around `getSeriesImages` to only return poster images for a series.
     *
     * ``` javascript
     * tvdb.getSeriesPosters(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     */
    getSeriesPosters(seriesId: number | string, opts?: any): Promise<any>

    /**
     * Convenience wrapper around `getSeriesImages` to only return season poster images for a series.
     *
     * ``` javascript
     * tvdb.getSeasonPosters(73255, 1)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     */
    getSeasonPosters(seriesId: number | string, season: number | string, opts?: any): Promise<any>

    /**
     * Get a list of series updated since a given unix timestamp (and, if given,
     * between a second timestamp).
     *
     * ``` javascript
     * tvdb.getUpdates(1400611370, 1400621370)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see     https://api.thetvdb.com/swagger#!/Updates/get_updated_query
     */

    getUpdates(fromTime: number, toTime: number, opts?: any): Promise<any>

    /**
     * Get series and episode information by series id. Helper for calling
     * `getSeriesById` and `getEpisodesBySeriesId` at the same time.
     *
     * ``` javascript
     * tvdb.getSeriesAllById(73255)
     *     .then(response => {
     *         response; // contains series data (i.e. `id`, `seriesName`)
     *         response.episodes; // contains an array of episodes
     *     })
     *     .catch(error => { handle error });
     * ```
     */
    getSeriesAllById(seriesId: number | string: string | number, opts?: any): Promise<any>

    /**
    * Runs a get request with the given options, useful for running custom
    * requests.
    *
    * ``` javascript
    * tvdb.sendRequest('custom/endpoint', { custom: 'options' })
    *     .then(response => { handle response })
    *     .catch(error => { handle error });
    * ```
    */
    sendRequest(path: string, opts?: any): Promise<any>
}
