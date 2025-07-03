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
     */
    constructor(httpClient)
    {
        this.artists       = new Artists(httpClient);
        this.playlists     = new Playlists(httpClient);
        this.playlistItems = new PlaylistsItems(httpClient);
    }
}

export default Collection;
