export const BASE_URL = 'https://api.thetvdb.com';
export const LIB_VERSION = require('../package.json').version;
export const API_VERSION = 'v2.1.1';
export const AV_HEADER = `application/vnd.thetvdb.${API_VERSION}`;

export const DEFAULT_OPTS = {
    getAllPages: true,
    headers: {
        'User-Agent': `node-tvdb/${LIB_VERSION} (+https://github.com/edwellbrook/node-tvdb)`
    }
};