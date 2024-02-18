import Base from './Base';
import DiscoverAlbums from './DiscoverAlbums';
import DiscoverArtists from './DiscoverArtists';

class Discover extends Base
{
    constructor(httpClient) 
    {
        super(httpClient);
        this.albums  = new DiscoverAlbums(httpClient);
        this.artists = new DiscoverArtists(httpClient);
    }

    resources(params) 
    {
        return this.apiCall('get', 'api/v1/discover/resources', null, params);
    }
}

export default Discover;
