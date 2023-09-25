import Base from './Base';
import Playlist from './Playlist';

class Playlists extends Base 
{
    list() 
    {
        return this.apiCall('get', 'api/v1/collection/playlists');
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
