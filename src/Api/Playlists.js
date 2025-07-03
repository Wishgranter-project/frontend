import Base     from './Base';
import Playlist from './Playlist';

class Playlists extends Base
{
    /**
     * Fetches a list of all playlists.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    list()
    {
        return this.apiCall('get', 'api/v1/collection/playlists');
    }

    /**
     * Prompts the browse to download all playlists.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    downloadAll()
    {
        this.download('api/v1/collection/playlists', undefined, 'application/zip');
    }

    /**
     * Creates a new playlist.
     *
     * @param {object} data
     * The playlist details. Title, description, etc.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    create(data)
    {
        return this.apiCall('post', 'api/v1/collection/playlists', data, null, {
            // To avoid the http client converting the body into json.
            headers: { 'Content-Type': undefined }
        });
    }

    /**
     * Instantiate a new Playlist object.
     *
     * @param {string} playlistId
     * The playlist id.
     *
     * @returns {Playlist}
     * The playlist object.
     */
    get(playlistId)
    {
        return new Playlist(this.httpClient, playlistId);
    }
}

export default Playlists;
