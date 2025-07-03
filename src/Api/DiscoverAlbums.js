import Base from  './Base';
import Album from './Album';

class DiscoverAlbums extends Base
{
    /**
     * Searches for albums matching our parameters.
     *
     * @param {object} params
     * Descripting the albums.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    search(params)
    {
        return this.apiCall('get', 'api/v1/discover/albums', null, params);
    }

    /**
     * Instantiate a new Album object.
     *
     * @param {string} artist
     * The name of the artist.
     * @param {string} title
     * The title of the album.
     *
     * @returns {Album}
     * The album object.
     */
    get(artist, title)
    {
        return new Album(this.httpClient, artist, title);
    }
}

export default DiscoverAlbums;
