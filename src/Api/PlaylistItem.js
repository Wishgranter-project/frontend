import Base from './Base';

class PlaylistItem extends Base 
{
    /**
     * Constructor.
     *
     * @param {Http} httpClient
     * A client to make http requests.
     * @param {string} uuid
     * The uuid of the playlist item.
     */
    constructor(httpClient, uuid) 
    {
        super(httpClient);
        this.uuid = uuid;
    }

    /**
     * Fetches details of the playlist item. 
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async read() 
    {
        return this.apiCall('get', 'api/v1/collection/items/' + this.uuid);
    }

    /**
     * Updates the playlist item.
     *
     * @param {object} data
     * The playlist item details. Title, artist, album etc.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async update(data) 
    {
        return this.apiCall('put', 'api/v1/collection/items/' + this.uuid, data, null, {
            // To avoid the http client converting the body into json.
            headers: { 'Content-Type': undefined }
        });
    }

    /**
     * Deletes the playlist item.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async delete() 
    {
        return this.apiCall('delete', 'api/v1/collection/items/' + this.uuid);
    }
}

export default PlaylistItem;
