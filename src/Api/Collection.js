import Artists from './Artists';
import Playlists from './Playlists';
import PlaylistsItems from './PlaylistsItems';

class Collection 
{
    constructor(httpClient) 
    {
        this.artists       = new Artists(httpClient);
        this.playlists     = new Playlists(httpClient);
        this.playlistItems = new PlaylistsItems(httpClient);
    }
}

export default Collection;
