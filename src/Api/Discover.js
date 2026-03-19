import Base            from './Base';
import DiscoverAlbums  from './DiscoverAlbums';
import DiscoverArtists from './DiscoverArtists';

/**
 * Discover artists, albuns and playable media.
 */
class Discover extends Base
{
    /**
     * Constructor.
     *
     * @param {Http} httpClient
     * A client to make http requests.
     * @param {State} state
     * State object.
     */
    constructor(httpClient, state)
    {
        super(httpClient, state);
        this.albums  = new DiscoverAlbums(httpClient, state);
        this.artists = new DiscoverArtists(httpClient, state);
    }

    /**
     * Fetches possible playable resources for our music.
     *
     * @param {object} musicDescription
     * The description of a music, including title, artist etc.
     *
     * @returns {Promise}
     * To be resolved when the back-end responds.
     */
    resources(musicDescription)
    {
        return this.apiCall('get', 'api/v1/discover/resources', null, musicDescription);
    }
}

export default Discover;
