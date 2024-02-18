import Base from './Base';
import PlaylistItem from './PlaylistItem';

class PlaylistsItems extends Base 
{
    search(params) 
    {
        return this.apiCall('get', 'api/v1/collection/items', null, params);
    }

    create(data) 
    {
        return this.apiCall('post', 'api/v1/collection/items', data, null, { headers: { 'Content-Type': undefined } });
    }

    get(uuid) 
    {
        return new PlaylistItem(this.httpClient, uuid);
    }
}

export default PlaylistsItems;
