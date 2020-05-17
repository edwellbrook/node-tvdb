export interface JsonResponse {
    data?: [];
    Error?: string;
    links?: {
        next: number;
    }
}

export interface RequestOptions {
    query?: {
        [key: string]: string;
    };
    headers?: {
        [key: string]: string;
    };
    getAllPages?: boolean;
    page?: number;
    language?: string;
    /**
     * Use language instead.
     * @deprecated
     */
    lang?: string;
}

export interface Language {
    abbreviation?: string;
    englishName?: string;
    id?: number;
    name?: string;
}

export interface SeriesEpisodesSummary {
    airedEpisodes?: string;
    airedSeasons?: string[];
    dvdEpisodes?: string;
    dvdSeasons?: string[];
}

export interface Series {
    added?: string;
    airsDayOfWeek?: string;
    airsTime?: string;
    aliases?: string[];
    banner?: string;
    firstAired?: string;
    genre?: string[];
    id?: number;
    imdbId?: string;
    lastUpdated?: number;
    network?: string;
    networkId?: string;
    overview?: string;
    rating?: string;
    runtime?: string;
    seriesId?: string;
    seriesName?: string;
    siteRating?: number;
    siteRatingCount?: number;
    slug?: string;
    status?: string;
    zap2itId?: string;
}

export interface Actor {
    id: number;
    image: string;
    imageAdded: string;
    imageAuthor: number;
    lastUpdated: string;
    name: string;
    role: string;
    seriesId: number;
    sortOrder: number;
}

export interface Episode {
    absoluteNumber?: number;
    airedEpisodeNumber?: number;
    airedSeason?: number;
    airsAfterSeason?: number;
    airsBeforeEpisode?: number;
    airsBeforeSeason?: number;
    directors?: string[];
    dvdChapter?: number;
    dvdDiscid?: string;
    dvdEpisodeNumber?: number;
    dvdSeason?: number;
    episodeName?: string;
    filename?: string;
    firstAired?: string;
    guestStars?: string[];
    id?: number;
    imdbId?: string;
    lastUpdated?: number;
    lastUpdatedBy?: string;
    overview?: string;
    productionCode?: string;
    seriesId?: string;
    showUrl?: string;
    siteRating?: number;
    siteRatingCount?: number;
    thumbAdded?: string;
    thumbAuthor?: number;
    thumbHeight?: string;
    thumbWidth?: string;
    writers?: string[];
}

export interface Update {
    id?: number;
    lastUpdated?: number;
}
