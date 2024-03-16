import Base from './Base';

class Playlist extends Base 
{
    constructor(httpClient, playlistId) 
    {
        super(httpClient);
        this.playlistId = playlistId;
    }

    async read() 
    {
        return this.apiCall('get', 'api/v1/collection/playlists/' + this.playlistId);
    }

    download() 
    {
        var url = new URL('api/v1/collection/playlists/' + this.playlistId + '?download=1', this.httpClient.defaultOptions.baseHref);
        window.open(url.toString(), "_blank");
    }

    async getItems(params = null) 
    {
        return this.apiCall('get', 'api/v1/collection/playlists/' + this.playlistId + '/items', null, params);
    }

    async update(data) 
    {
        return this.apiCall('put', 'api/v1/collection/playlists/' + this.playlistId, data, null, { headers: { 'Content-Type': undefined } });
    }

    async delete() 
    {
        return this.apiCall('delete', 'api/v1/collection/playlists/' + this.playlistId);
    }
}

export default Playlist;
