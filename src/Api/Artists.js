import Base from './Base';

/**
 * Retrieves the list of artists in our collection.
 */
class Artists extends Base 
{
    /**
     * Fetches the artists.
     *
     * @protected
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    list()
    {
        return this.apiCall('get', 'api/v1/collection/artists');
    }
}

export default Artists;
