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
        if (this.queryParams.without('page').isEmpty()) {
            return this.api.collection.playlists
                .get(this.playlistId)
                .getItems(this.queryParams);
        } else {
            return this.api.collection.playlistItems
                .search(this.queryParams.withAdded('playlist', this.playlistId));
        }
    }
}

export default QueueContextPlaylist;
