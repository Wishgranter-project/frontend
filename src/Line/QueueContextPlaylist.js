import QueueContextSearch from './QueueContextSearch';

class QueueContextPlaylist extends QueueContextSearch 
{
    constructor(api, noMore = false, queryParams, playlistId) 
    {
        super(api, noMore, queryParams);
        this.playlistId = playlistId;
    }

    static id() 
    {
        return 'playlist';
    }

    serialize() 
    {
        return {
            id: QueueContextPlaylist.id(),
            noMore: this.noMore,
            queryParams: (this.queryParams ? this.queryParams.toString() : ''),
            playlistId: this.playlistId
        };
    }

    async request(queue) 
    {
        return this.api.collection.playlists
            .get(this.playlistId)
            .getItems(this.queryParams);
    }
}

export default QueueContextPlaylist;
