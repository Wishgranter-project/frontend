import Base from './Base';

/**
 * Retrieves tracks for an album.
 */
class Album extends Base
{
    /**
     * Constructor.
     *
     * @param {Http} httpClient
     * A client to make http requests.
     * @param {string} artist
     * The name of the artist.
     * @param {string} title
     * The title of the album.
     */
    constructor(httpClient, artist, title) 
    {
        super(httpClient);
        this.artist = artist;
        this.title  = title;
    }

    /**
     * Fetches the tracks for the album.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    fetchItems()
    {
        return this.read().then((response) =>
        {
            var album = response.data;
            var items = [];

            for (var t of album.tracks) {
                items.push({
                    title: t,
                    artist: this.artist,
                    album: this.title
                });
            }

            return items;
        });
    }

    /**
     * Makes the api call.
     *
     * @protected
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    read()
    {
        return this.apiCall('get', 'api/v1/discover/album', null, {
            artist: this.artist,
            title: this.title
        });
    }
}

export default Album;
