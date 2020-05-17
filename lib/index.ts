import url from 'url';
import fetch from 'node-fetch';
import { login } from './login';
import { checkHttpError } from './check-http-error';
import { checkJsonError } from './check-json-error';
import { getNextPages } from './get-next-pages';
import { BASE_URL, AV_HEADER, DEFAULT_OPTS } from './config';
import { RequestOptions, Language, Actor, Series, SeriesEpisodesSummary, Episode } from './types';

/**
 * API Client
 */
export class TheTVDB {
    protected tokenPromise?: Promise<string>;

    constructor(public apiKey: string, public language: string = 'en') {
        if (!apiKey) {
            throw new Error('API key is required');
        }
    }

    protected async getToken() {
        if (!this.tokenPromise) {
            this.tokenPromise = login(this.apiKey);
        }

        return this.tokenPromise;
    }

    /**
     * Get available languages usable by TheTVDB API.
     *
     * ``` javascript
     * tvdb.getLanguages()
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Languages/get_languages
     */
    async getLanguages(options?: RequestOptions) {
        return this.sendRequest<Language[]>('languages', options);
    }

    /**
     * Get episode by episode id.
     *
     * ``` javascript
     * tvdb.getEpisodeById(4768125)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Episodes/get_episodes_id
     */
    async getEpisodeById(episodeId: number | string, options?: RequestOptions) {
        return this.sendRequest<Episode>(`episodes/${episodeId}`, options);
    }

    /**
     * Get all episodes by series id.
     *
     * The options may include the object `query` with any of the parameters from the query endpoint
     *
     * ``` javascript
     * tvdb.getEpisodesBySeriesId(153021)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     */
    async getEpisodesBySeriesId(seriesId: number | string, options?: RequestOptions) {
        if (options?.query) {
            return this.sendRequest<Episode[]>(`series/${seriesId}/episodes/query`, options);
        }
        return this.sendRequest<Episode[]>(`series/${seriesId}/episodes`, options);
    }

    /**
     * Get episodes summary by series id.
     *
     * ``` javascript
     * tvdb.getEpisodesSummaryBySeriesId(153021)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_summary
     */
    async getEpisodesSummaryBySeriesId(seriesId: number | string) {
        return this.sendRequest<SeriesEpisodesSummary>(`series/${seriesId}/episodes/summary`);
    }

    /**
     * Get basic series information by id.
     *
     * ``` javascript
     * tvdb.getSeriesById(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id
     */
    async getSeriesById(seriesId: number | string, options?: RequestOptions) {
        return this.sendRequest<Series>(`series/${seriesId}`, options);
    }

    /**
     * Get series episode by air date.
     *
     * ``` javascript
     * tvdb.getEpisodeByAirDate(153021, '2011-10-03')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_episodes_query
     */
    async getEpisodesByAirDate(seriesId: number | string, airDate: string, options?: RequestOptions) {
        const query = { firstAired: airDate };
        const reqOpts = { ...options, query };
        return this.getEpisodesBySeriesId(seriesId, reqOpts);
    }

    /**
     * Get basic series information by name.
     *
     * ``` javascript
     * tvdb.getSeriesByName('Breaking Bad')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Search/get_search_series
     */
    async getSeriesByName(name: string, options?: RequestOptions) {
        const query = { name };
        const reqOpts = { ...options, query };
        return this.sendRequest<Series>(`search/series`, reqOpts);
    }

    /**
     * Get series actors by series id.
     *
     * ``` javascript
     * tvdb.getActors(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_actors
     */
    async getActors(seriesId: number | string, options?: RequestOptions) {
        return this.sendRequest<Actor>(`series/${seriesId}/actors`, options);
    }

    /**
     * Get basic series information by imdb id.
     *
     * ``` javascript
     * tvdb.getSeriesByImdbId('tt0903747')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Search/get_search_series
     */
    async getSeriesByImdbId(imdbId: string, options?: RequestOptions) {
        const query = { imdbId };
        const reqOpts = { ...options, query };
        return this.sendRequest<Series>(`search/series`, reqOpts);
    }

    /**
     * Get basic series information by zap2it id.
     *
     * ``` javascript
     * tvdb.getSeriesByZap2ItId('EP00018693')
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Search/get_search_series
     */
    async getSeriesByZap2ItId(zap2itId: string, options?: RequestOptions) {
        const query = { zap2itId };
        const reqOpts = { ...options, query };
        return this.sendRequest<Series>(`search/series`, reqOpts);
    }

    /**
     * Get series banner by series id.
     *
     * ``` javascript
     * tvdb.getSeriesBanner(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_filter
     */
    async getSeriesBanner(seriesId: number | string, options?: RequestOptions) {
        const query = { keys: 'banner' };
        const reqOpts = { ...options, query };
        return this.sendRequest(`series/${seriesId}/filter`, reqOpts).then(response => {
            return (response as { banner: string }).banner;
        });
    }

    /**
     * Get series images for a given key type.
     *
     * ``` javascript
     * // request only return fan art images:
     * tvdb.getSeriesImages(73255, 'fanart', { query: queryOptions })
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_images
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     */
    async getSeriesImages(seriesId: number | string, keyType: string | null, options?: RequestOptions) {
        const query = {
            ...(keyType === null ? {} : {
                query: {
                    keyType
                }
            })
        };
        const reqOpts = { ...options, ...query};
        return this.sendRequest(`series/${seriesId}/images/query`, reqOpts);
    }

    /**
     * Convenience wrapper around `getSeriesImages` to only return poster images for a series.
     *
     * ``` javascript
     * tvdb.getSeriesPosters(73255)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     */
    async getSeriesPosters(seriesId: number | string, options?: RequestOptions) {
        return this.getSeriesImages(seriesId, 'poster', options);
    }

    /**
     * Convenience wrapper around `getSeriesImages` to only return season poster images for a series.
     *
     * ``` javascript
     * tvdb.getSeasonPosters(73255, 1)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Series/get_series_id_images_query
     */
    async getSeasonPosters(seriesId: number | string, season: number | string, options?: RequestOptions) {
        const query = { keyType: 'season', subKey: season };
        const reqOpts = { ...options, query };
        return this.getSeriesImages(seriesId, null, reqOpts);
    }

    /**
     * Get a list of series updated since a given unix timestamp (and, if given,
     * between a second timestamp).
     *
     * ``` javascript
     * tvdb.getUpdates(1400611370, 1400621370)
     *     .then(response => { handle response })
     *     .catch(error => { handle error });
     * ```
     * @see https://api.thetvdb.com/swagger#!/Updates/get_updated_query
     */
    async getUpdates(fromTime: number, toTime?: any): Promise<any>
    async getUpdates(fromTime: number, toTime: number, options?: any): Promise<any> {
        const query = {
            fromTime,
            ...(toTime ? { toTime } : {})
        };
        const reqOpts = {
            ...(options ? toTime : options),
            query
        };

        return this.sendRequest('updated/query', reqOpts);
    }

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
    async getSeriesAllById(seriesId: number | string, options?: any) {
        const results = await Promise.all([
            this.getSeriesById(seriesId, options),
            this.getEpisodesBySeriesId(seriesId, options)
        ]);

        return {
            ...results[0],
            episodes: results[1]
        };
    }

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
    async sendRequest<T = any>(path: string, opts?: RequestOptions): Promise<T> {
        const options: RequestOptions = { ...DEFAULT_OPTS, ...opts };
        const query = { ...options.query };
        const headers = {
            'Accept': AV_HEADER,
            'Accept-language': options.lang ?? options.language ?? this.language,
            ...options.headers
        };

        const requestURL = BASE_URL + '/' + url.format({
            pathname: path,
            query
        });

        return this.getToken()
            .then(token => {
                (headers as { [key: string]: string }).Authorization = `Bearer ${token}`;
                return fetch(requestURL, { headers });
            })
            .then(res => checkHttpError(res))
            .then(res => checkJsonError(res))
            .then(json => getNextPages<T>(this, json, path, options))
            .then(json => json.data as unknown as T);
    }
}