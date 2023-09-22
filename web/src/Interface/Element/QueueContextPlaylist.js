import QueueContextSearch from './QueueContextSearch';

class QueueContextPlaylist extends QueueContextSearch 
{
    constructor(initialBatch, api, queryParams, playlistId) 
    {
        super(initialBatch, api, queryParams);
        this.playlistId = playlistId;
    }

    async request(queue) 
    {
        return this.api.collection.playlists.get(this.playlistId).getItems(this.queryParams);
    }
}

export default QueueContextPlaylist;
