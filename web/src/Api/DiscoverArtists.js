import Base from './Base';

class DiscoverArtists extends Base
{
    search(params) 
    {
        return this.apiCall('get', '/api/v1/discover/artists', null, params);
    }
}

export default DiscoverArtists;
