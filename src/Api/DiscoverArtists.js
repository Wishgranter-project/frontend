import Base from './Base';

class DiscoverArtists extends Base
{
    /**
     * Searches for artists matching our parameters.
     *
     * @param {object} params
     * Describing the artist.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    search(params) 
    {
        return this.apiCall('get', 'api/v1/discover/artists', null, params);
    }
}

export default DiscoverArtists;
