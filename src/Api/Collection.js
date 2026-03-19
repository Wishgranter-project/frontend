import Artists        from './Artists';
import Playlists      from './Playlists';
import PlaylistsItems from './PlaylistsItems';

/**
 * Entry point for the collection.
 */
class Collection
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
        this.artists       = new Artists(httpClient, state);
        this.playlists     = new Playlists(httpClient, state);
        this.playlistItems = new PlaylistsItems(httpClient, state);
    }
}

export default Collection;
