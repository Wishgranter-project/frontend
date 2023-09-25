import Base from './Base';

class Playlist extends Base 
{
    constructor(httpClient, playlistId) 
    {
        super(httpClient);
        this.playlistId = playlistId;
    }

    read() 
    {
        return this.apiCall('get', 'api/v1/collection/playlists/' + this.playlistId);
    }

    getItems(params = null) 
    {
        return this.apiCall('get', 'api/v1/collection/playlists/' + this.playlistId + '/items', null, params);
    }

    update(data) 
    {
        return this.apiCall('put', 'api/v1/collection/playlists/' + this.playlistId, data, null, { headers: { 'Content-Type': undefined } });
    }

    delete() 
    {
        return this.apiCall('delete', 'api/v1/collection/playlists/' + this.playlistId);
    }
}

export default Playlist;
