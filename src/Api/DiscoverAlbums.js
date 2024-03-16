import Base from './Base';
import Album from './Album';

class DiscoverAlbums extends Base
{
    search(params) 
    {
        return this.apiCall('get', 'api/v1/discover/albums', null, params);
    }

    get(artist, title) 
    {
        return new Album(this.httpClient, artist, title);
    }
}

export default DiscoverAlbums;
