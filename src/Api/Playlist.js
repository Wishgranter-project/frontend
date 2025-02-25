import Base from './Base';

class Playlist extends Base 
{
    /**
     * Constructor.
     *
     * @param {Http} httpClient
     * A client to make http requests.
     * @param {string} playlistId
     * The playlist id.
     */
    constructor(httpClient, playlistId) 
    {
        super(httpClient);
        this.playlistId = playlistId;
    }

    /**
     * Fetches details about the playlist.
     *
     * Title, description, etc.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async read() 
    {
        return this.apiCall('get', 'api/v1/collection/playlists/' + this.playlistId);
    }

    /**
     * Prompts the browser to download it.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    download() 
    {   
        this.download('api/v1/collection/playlists/' + this.playlistId, undefined, 'application/jsonl');
    }

    /**
     * Fetches items from the playlist.
     *
     * @param {object} params
     * Parameters to filter, paginate etc.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async getItems(params = null) 
    {
        return this.apiCall('get', 'api/v1/collection/playlists/' + this.playlistId + '/items', null, params);
    }

    /**
     * Updates the playlist.
     *
     * @param {object} data
     * The playlist details. Title, description etc. 
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async update(data) 
    {
        return this.apiCall('put', 'api/v1/collection/playlists/' + this.playlistId, data, null, {
            // To avoid the http client converting the body into json.
            headers: { 'Content-Type': undefined }
        });
    }

    /**
     * Deletes the playlist.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    async delete() 
    {
        return this.apiCall('delete', 'api/v1/collection/playlists/' + this.playlistId);
    }
}

export default Playlist;
