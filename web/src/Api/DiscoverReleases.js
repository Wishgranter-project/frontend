import Base from './Base';
import Release from './Release';

class DiscoverReleases extends Base
{
    search(params) 
    {
        return this.apiCall('get', 'api/v1/discover/releases', null, params);
    }

    get(releaseId) 
    {
        return new Release(this.httpClient, releaseId);
    }

    getAlbum(artist, title) 
    {
        return this.apiCall('get', 'api/v1/discover/album', null, {artist, title});
    }
}

export default DiscoverReleases;
