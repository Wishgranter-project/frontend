import Base from './Base';

class DiscoverAlbums extends Base
{
    search(params) 
    {
        return this.apiCall('get', 'api/v1/discover/albums', null, params);
    }

    get(artist, title) 
    {
        return this.apiCall('get', 'api/v1/discover/album', null, {artist, title});
    }
}

export default DiscoverAlbums;
