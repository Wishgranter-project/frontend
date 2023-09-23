import QueueContextSearch from './QueueContextSearch';

class QueueContextPlaylist extends QueueContextSearch 
{
    constructor(api, queryParams, playlistId) 
    {
        super(api, queryParams);
        this.playlistId = playlistId;
    }

    async request(queue) 
    {
        return this.api.collection.playlists
            .get(this.playlistId)
            .getItems(this.queryParams);
    }
}

export default QueueContextPlaylist;
