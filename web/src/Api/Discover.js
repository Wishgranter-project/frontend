import Base from './Base';
import DiscoverReleases from './DiscoverReleases';
import DiscoverArtists from './DiscoverArtists';

class Discover extends Base
{
    constructor(httpClient) 
    {
        super(httpClient);
        this.releases = new DiscoverReleases(httpClient);
        this.artists  = new DiscoverArtists(httpClient);
    }

    sources(params) 
    {
        return this.apiCall('get', '/api/v1/discover/sources', null, params);
    }
}

export default Discover;
