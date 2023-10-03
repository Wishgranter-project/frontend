import Base from './Base';
import Playlist from './Playlist';

class Playlists extends Base 
{
    list() 
    {
        return this.apiCall('get', 'api/v1/collection/playlists');
    }

    downloadAll() 
    {
        var url = new URL('api/v1/collection/playlists?download=1', this.httpClient.defaultOptions.baseHref);
        window.open(url.toString(), "_blank");
    }

    create(data) 
    {
        return this.apiCall('post', 'api/v1/collection/playlists', data, null, { headers: { 'Content-Type': undefined } });
    }

    get(playlistId) 
    {
        return new Playlist(this.httpClient, playlistId);
    }
}

export default Playlists;
